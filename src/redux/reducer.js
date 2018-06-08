import {ADD, DELETE, VIEW, ADDMULTI} from "./action";


export function reducer(state = {}, action) {
  return {
    mode: mode(state.mode, action),
    posts: posts(state.posts, action)
  }
}

function posts(state = {}, action) {
  switch (action.type) {
    case ADD:
      return [action.post, ...state];
    case ADDMULTI:
      return [...state, ...action.posts];
    case DELETE:
      const idx = state.findIndex(o => o.key === action.key);
      return state.slice().splice(idx, 1);
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
