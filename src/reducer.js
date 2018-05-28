import {
  ADD,
  DELETE,
  VIEW
} from "./action";


export function reducer(state = {}, action) {
  return {
    mode: mode(state.mode, action),
    posts: posts(state.posts, action)
  }
}

function posts(state = {}, action) {
  switch (action.type) {
    case ADD:
      return [...state, action.post];
    case DELETE:
      let idx = state.findIndex(o => o.key === action.key);
      let tmp = [...state];
      tmp.splice(idx, 1);
      return tmp;
    default:
      return state;
  }
}

function mode(state = "", action) {
  switch (action.type) {
    case VIEW:
      return action.mode
    default:
      return state;
  }
}
