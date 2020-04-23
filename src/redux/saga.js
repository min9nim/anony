import {
  type,
  updatePost,
  removePost as removePostAction,
} from '@/redux/action'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

const {
  DELETEPOST,
  DELETEPOST_REQUESTED,
  DELETEPOST_FAILED,
  LIKEPOST_REQUESTED,
  LIKEPOST_FAILED,
  REMOVEPOST_FAILED,
  REMOVEPOST_REQUESTED,
  REMOVEPOST,
} = type

function* deletePost(action) {
  try {
    yield call(ctx.api.deletePost, {
      key: action.key,
      uuid: ctx.user.uuid,
    })
    yield put({ type: DELETEPOST, key: action.key })
    ctx.logger.debug('상태 변경 완료')
  } catch (e) {
    yield put({ type: DELETEPOST_FAILED, message: e.message })
    ctx.alert({
      message: e.message,
      style: 'warning',
    })
  }
}

function* likePost(action) {
  try {
    const res = yield call(ctx.api.likePost, action.key)
    yield put(updatePost(res.output))
  } catch (e) {
    yield put({ type: LIKEPOST_FAILED, message: e.message })
    ctx.alert({
      message: e.message,
      style: 'warning',
    })
  }
}

function* removePost(action) {
  try {
    yield call(ctx.api.removePost, {
      key: action.key,
      uuid: ctx.user.uuid,
    })

    if (['PostHistory', 'List'].includes(ctx.thispage)) {
      yield call(() => {
        document.getElementById(action.key).style.transform = 'scaleY(0)'
      })
      yield delay(500)
      yield put(removePostAction((p) => p.key === action.key))
    } else {
      yield call(() => {
        document.getElementsByClassName('post')[0].style.transform = 'scaleX(0)'
      })
      yield delay(500)
      yield put(removePostAction((p) => p.key === action.key))
      yield call(() => {
        if (action.postOrigin) {
          var arr = location.pathname.split('/')
          arr.splice(2, 2, 'postHistory', action.postOrigin) // context 명이 없는 경우 문제 발생할 수 있음
          ctx.history.push(arr.join('/'))
        } else {
          ctx.history.push(action.contextPath + '/list')
        }
      })
    }
  } catch (e) {
    yield put({ type: REMOVEPOST_FAILED, message: e.message })
    ctx.alert({
      message: e.message,
      style: 'warning',
    })
  }
}

export default function* () {
  yield takeEvery(DELETEPOST_REQUESTED, deletePost)
  yield takeEvery(LIKEPOST_REQUESTED, likePost)
  yield takeEvery(REMOVEPOST_REQUESTED, removePost)
}
