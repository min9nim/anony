import action from './action'
//import R from "ramda";
const R = require('ramda')

const at = action.type

export function reducer(state = {}, action) {
  return {
    view: view(state.view, action),
    data: {
      posts: posts(state.data.posts, action),
      comments: comments(state.data.comments, action),
      channels: channels(state.data.channels, action),
    },
  }
}

function posts(state = [], action) {
  switch (action.type) {
    case at.ADDPOST: {
      return [action.post, ...state]
    }
    case at.SCROLLEND: {
      return [...state, ...action.posts]
    }
    case at.ADDPOSTS: {
      return [...state, ...action.posts]
    }
    case at.INITPOSTS: {
      return []
    }
    case at.SETPOSTS: {
      return action.posts
    }
    case at.DELETEPOST: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.key)
      afterState[idx].deleted = true // idx번째 요소 삭제표시
      return afterState
    }
    case at.VIEWPOST: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.key)
      // 기존상태의 값을 변경하면 안될 것 같아서 아래와 같이 처리함
      afterState[idx] = Object.assign({}, afterState[idx]) // 객체 복사
      afterState[idx].viewCnt = afterState[idx].viewCnt
        ? afterState[idx].viewCnt + 1
        : 1
      return afterState
    }
    case at.RESTOREPOST: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.key)
      afterState[idx].deleted = false
      return afterState
    }

    case at.REMOVEPOST: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      //const idx = afterState.findIndex(o => o.key === action.key);
      //afterState.splice(idx, 1); // idx번째 요소 삭제
      //return afterState;
      return afterState.filter((p) => !action.predi(p))
    }
    case at.UPDATEPOST: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.post.key)

      /**
       * 18.09.17 min9nim
       * 이번에 비밀글을 목록에서 보여주지 않았던 특성을 제거했음
       * 그냥 일반 글처럼 수정처리하믄 되는거임
       */

      // if(action.post.isPrivate){
      //   if(idx < 0){
      //     // 해당 글이 목록에 포함되어 있지 않을 경우 기존 상태 유지
      //   }else{
      //     afterState.splice(idx, 1); // 비밀글로 설정한 경우 그냥 목록에서 제거
      //   }
      // }else{
      //   if(idx < 0){
      //     afterState.splice(0, 0, action.post); // 비밀글에서 공개글로 설정한 경우는 목록의 가장 앞단에 추가
      //   }else{
      //     afterState.splice(idx, 1, action.post); // idx번째 요소 삭제하고 post 추가
      //   }
      // }

      afterState.splice(idx, 1, action.post) // idx번째 요소 삭제하고 post 추가
      afterState.sort((a, b) => b.date - a.date) // 최종수정일 기준 내림차순 정렬

      return afterState
    }
    default: {
      return state
    }
  }
}

function comments(state = [], action) {
  switch (action.type) {
    case at.ADDCOMMENT: {
      return [...state, action.comment]
    }
    case at.ADDCOMMENTS: {
      return [...state, ...action.comments]
    }
    case at.DELETECOMMENT: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.key)
      afterState[idx].deleted = true
      return afterState
    }
    case at.REMOVECOMMENT: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.key)
      afterState.splice(idx, 1) // idx번째 요소 삭제
      return afterState
    }

    case at.UPDATECOMMENT: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.comment.key)
      afterState.splice(idx, 1, action.comment) // idx번째 요소 삭제하고 comment 추가
      return afterState
    }

    case at.RESTORECOMMENT: {
      //const afterState = [...state]; // state 배열 복사
      const afterState = R.clone(state) // state 깊은 복사
      const idx = afterState.findIndex((o) => o.key === action.key)
      afterState[idx].deleted = false
      return afterState
    }

    default: {
      return state
    }
  }
}

function view(state = {}, action) {
  switch (action.type) {
    case at.SETSEARCH:
      return Object.assign({}, state, { search: action.search })
    case at.SETUUID:
      return Object.assign({}, state, { uuid: action.uuid })
    default:
      return state
  }
}

function channels(state = [], action) {
  switch (action.type) {
    case at.MYCHANNELS:
      //return state.concat(action.channels);
      //return action.channels.length === 0 ? ["public"] : action.channels;
      return action.channels
    default:
      return state
  }
}
