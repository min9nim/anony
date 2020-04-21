import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { reducer } from './reducer'

export default createStore(reducer, {
  view: {
    search: '',
    uuid: ctx.user.uuid,
  },
  data: {
    posts: [], // 전체 글
    comments: [], // 전체 댓글
    channels: [], // 채널목록
  },
}, applyMiddleware(thunk))
