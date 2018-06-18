import action from "./action";
const at = action.type;

export function reducer(state = {}, action) {
  // console.log("# reducer call");
  // console.log("state = " + JSON.stringify(state, null,2));
  // console.log("action = " + JSON.stringify(action, null,2));
  return {
    view: view(state.view, action),
    data: {
      posts: posts(state.data.posts, action),
      comments: comments(state.data.comments, action),
      postHistory: postHistory(state.data.postHistory, action)
    }
  }
}

function posts(state = [], action) {
  switch (action.type) {
    case at.ADDPOST: {
      if(action.post.isPrivate){
        return state;
      }else{
        return [action.post, ...state];
      }
    }
    case at.SCROLLEND: {
      return [...state, ...action.posts];
    }
    case at.ADDPOSTS: {
      return [...state, ...action.posts];
    }
    case at.INITPOSTS: {
      return [];
    }
    case at.DELETEPOST: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.key);
      afterState[idx].deleted = true;   // idx번째 요소 삭제표시
      return afterState;
    }
    case at.RESTOREPOST: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.key);
      afterState[idx].deleted = false;
      return afterState;
    }

    case at.REMOVEPOST: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.key);
      afterState.splice(idx, 1); // idx번째 요소 삭제
      return afterState;
    }
    case at.UPDATEPOST: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.post.key);
      if(action.post.isPrivate){
        if(idx < 0){
          // 해당 글이 목록에 포함되어 있지 않을 경우 기존 상태 유지
        }else{
          afterState.splice(idx, 1); // 비밀글로 설정한 경우 그냥 목록에서 제거
        }
      }else{
        if(idx < 0){
          afterState.splice(0, 0, action.post); // 비밀글에서 공개글로 설정한 경우는 목록의 가장 앞단에 추가
        }else{
          afterState.splice(idx, 1, action.post); // idx번째 요소 삭제하고 post 추가
        }
      }
      
      return afterState;
    }
    default: {
      return state;
    }
  }
}

function comments(state = [], action) {
  switch (action.type) {
    case at.ADDCOMMENT: {
      return [...state, action.comment];
    }
    case at.ADDCOMMENTS: {
      return [...state, ...action.comments];
    }
    case at.DELETECOMMENT: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.key);
      //afterState.splice(idx, 1); // idx번째 요소 삭제
      afterState[idx].deleted = true;
      return afterState;
    }
    case at.UPDATECOMMENT: {
      const afterState = [...state]; // state 배열 복사
      const idx = afterState.findIndex(o => o.key === action.comment.key);
      afterState.splice(idx, 1, action.comment); // idx번째 요소 삭제하고 comment 추가
      return afterState;
    }
    default: {
      return state;
    }
  }
}


function postHistory(state = [], action) {
  switch (action.type) {
    case at.SETPOSTHISTORY: {
      // 모든 글의 변경사항들을 지속적으로 관리하기 어려움이 있어
      // 히스토리 조회시 최신상태를 유지하기 위해 하나의 건에 대한 정보만 담기로 한다
      return action.phist;
    }
    default: {
      return state;
    }
  }
}

function view(state = {}, action) {
  switch (action.type) {
    case at.VIEW:
      return action.view
    default:
      return state;
  }
}

