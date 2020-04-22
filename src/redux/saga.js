import { type } from '@/redux/action'
import { call, put, takeEvery } from 'redux-saga/effects'

const { DELETEPOST, DELETEPOST_REQUESTED, DELETEPOST_FAILED } = type

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
  }
}

export default function* () {
  yield takeEvery(DELETEPOST_REQUESTED, deletePost)
}
