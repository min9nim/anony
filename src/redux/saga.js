import { type, updatePost } from '@/redux/action'
import { call, put, takeEvery } from 'redux-saga/effects'

const {
  DELETEPOST,
  DELETEPOST_REQUESTED,
  DELETEPOST_FAILED,
  LIKEPOST_REQUESTED,
  LIKEPOST_FAILED,
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

export default function* () {
  yield takeEvery(DELETEPOST_REQUESTED, deletePost)
  yield takeEvery(LIKEPOST_REQUESTED, likePost)
}
