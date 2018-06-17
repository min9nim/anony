import {ADD, DELETE, VIEW, UPDATE, SCROLLEND} from "./action";

export function reducer(state = {}, action) {
  console.log("# reducer call");
  console.log("state = " + JSON.stringify(state, null,2));
  console.log("action = " + JSON.stringify(action, null,2));
  return {
    view: view(state.view, action),
    data: {posts: posts(state.data.posts, action)}
  }
}

function posts(state = [], action) {
  switch (action.type) {
    case ADD: {
      return [action.post, ...state];
    }
    case SCROLLEND: {
      return [...state, ...action.posts];
    }
    case DELETE: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.key);
      afterState.splice(idx, 1); // idx번째 요소 삭제
      return afterState;
    }
    case UPDATE: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.post.key);
      afterState.splice(idx, 1, action.post); // idx번째 요소 삭제하고 post 추가
      return afterState;
    }
    default: {
      return state;
    }
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

