import {ADD, DELETE, VIEW, SCROLLEND} from "./action";

export function reducer(state = {}, action) {
  return {
    view: view(state.view, action),
    data: {posts: posts(state.data.posts, action)}
  }
}

function posts(state = {}, action) {
  switch (action.type) {
    case ADD:
      return [action.post, ...state];
    case SCROLLEND:
      return [...state, ...action.posts];
    case DELETE:
      const idx = state.findIndex(o => o.key === action.key);
      const tmp = [...state]; // state 배열 복사
      tmp.splice(idx, 1); // idx번째 요소 삭제
      return tmp;
    default:
      return state;
  }
}

function view(state = {}, action) {
  switch (action.type) {
    case VIEW:
      return action.view
    default:
      return state;
  }
}

