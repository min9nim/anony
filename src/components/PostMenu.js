import React from 'react'
import { ctx } from '@/biz/context'
import {
  deletePost,
  removePost,
  restorePost,
  addPosts,
  type,
} from '@/redux/action'
import { connect } from 'react-redux'
import PostMenuTemplate from './PostMenuTemplate'

const { DELETEPOST_REQUESTED, REMOVEPOST_REQUESTED } = type

class PostMenu extends React.Component {
  constructor(props) {
    //ctx.logger.verbose("PostMenu 생성자 호출");
    super(props)
    this.cancelMenu = this.cancelMenu.bind(this)
    // this.restorePost = this.restorePost.bind(this);

    this.state = {
      clicked: true,
    }
    this.contextPath = this.props.context ? '/' + this.props.context : ''
  }

  deletePost() {
    ctx.confirm({
      message: 'Delete this?',
      onYes: () => {
        ctx.store.dispatch({
          type: DELETEPOST_REQUESTED,
          key: this.props.postKey,
        })
      },
    })
  }

  removePost() {
    ctx.confirm({
      message: 'Remove this?',
      width: '155px',
      onYes: () => {
        ctx.store.dispatch({
          type: REMOVEPOST_REQUESTED,
          key: this.props.postKey,
          postOrigin: this.props.postOrigin,
          contextPath: this.contextPath,
        })
      },
    })
  }

  restorePost() {
    //if(!confirm("Restore this?")) return;
    ctx.confirm({
      message: 'Restore this?',
      onYes: () => {
        ctx.api
          .restorePost({
            key: this.props.postKey,
            uuid: ctx.user.uuid,
          })
          .then((res) => {
            //ctx.store.dispatch(ctx.action.deletePost(this.props.postKey));
            this.props.restorePost(this.props.postKey)
            //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
            //this.props.history.push("/list");
            //ctx.view.Post.setState({deleted : true});
            this.cancelMenu()
          })
          .catch((e) => {
            ctx.alert({ message: e.message, style: 'danger' })
            this.cancelMenu()
          })
      },
    })
  }

  editPost() {
    ctx.api
      .authPost({
        key: this.props.postKey,
        uuid: ctx.user.uuid,
      })
      .then((res) => {
        this.props.history.push(
          this.contextPath + '/edit/' + this.props.postKey,
        )
      })
      .catch((e) =>
        ctx.alert({
          message: e.message,
          style: 'warning',
          width: '160px',
        }),
      )
  }

  postHistory() {
    // 기존 세팅된 히스토리 내역 초기화
    this.props.removePost((p) => p.origin === this.props.postKey)

    // 최신 상태로 새로 세팅
    ctx.api.getPostHistory(this.props.postKey).then((res) => {
      if (res.posts.length > 0) {
        //ctx.store.dispatch(ctx.action.setPostHistory(res.posts));
        this.props.addPosts(res.posts)
        this.props.history.push(
          this.contextPath + '/postHistory/' + this.props.postKey,
        )
      } else {
        ctx.alert({
          message: 'Have no changes',
          style: 'info',
        })
        this.cancelMenu()
      }
    })
  }

  cancelMenu() {
    this.setState({
      clicked: false,
    })
  }

  showMenu() {
    this.setState({
      clicked: true,
    })
  }

  list() {
    this.props.history.push(this.contextPath + '/list/')
  }

  render() {
    //ctx.logger.verbose("PostMenu 렌더링");
    let historyCnt = this.props.post?.historyCnt
      ? (historyCnt = '(' + this.props.post.historyCnt + ')')
      : ''

    return (
      <PostMenuTemplate
        menuClicked={this.state.clicked}
        postOrigin={this.props.postOrigin}
        postDeleted={this.props.postDeleted}
        historyCnt={historyCnt}
        listClick={this.list.bind(this)}
        historyClick={this.postHistory.bind(this)}
        restoreClick={this.restorePost.bind(this)}
        editClick={this.editPost.bind(this)}
        deleteClick={this.deletePost.bind(this)}
        removeClick={this.removePost.bind(this)}
        dotsClick={this.showMenu.bind(this)}
      />
    )
  }
}

export default connect((state) => ({ posts: state.data.posts }), {
  deletePost,
  removePost,
  restorePost,
  addPosts,
})(PostMenu)
