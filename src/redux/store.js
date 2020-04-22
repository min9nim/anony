import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reducer } from './reducer'
import createSaga from 'redux-saga'
import saga from './saga'

const sagaMiddleWare = createSaga()

export default createStore(
  reducer,
  {
    view: {
      search: '',
      uuid: ctx.user.uuid,
    },
    data: {
      posts: [], // 전체 글
      comments: [], // 전체 댓글
      channels: [], // 채널목록
    },
  },
  applyMiddleware(thunk, sagaMiddleWare),
  // applyMiddleware(thunk),
)

sagaMiddleWare.run(saga)
