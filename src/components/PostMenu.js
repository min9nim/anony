import React, { Fragment } from 'react'
import { ctx } from '@/biz/context'
import { deletePost, removePost, restorePost, addPosts } from '@/redux/action'
import { connect } from 'react-redux'
import './PostMenu.scss'

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
    //if(!confirm("Delete this?")) return;
    ctx.confirm({
      //message: "Delete this?<br> whenever you can restore this.",
      //width: "256px",
      message: 'Delete this?',
      onYes: () => {
        ctx.api
          .deletePost({
            key: this.props.postKey,
            uuid: ctx.user.uuid,
          })
          .then((res) => {
            if (this.props.posts.length > 0)
              this.props.deletePost(this.props.postKey)
            //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
            //this.props.history.push("/list");
            //ctx.view.Post.setState({deleted : true});
          })
          .catch((e) => {
            ctx.alert({
              message: e.message,
              style: 'warning',
            })
          })
      },
    })
  }

  removePost() {
    ctx.confirm({
      message: 'Remove this?',
      width: '155px',
      onYes: () => {
        ctx.api
          .removePost({
            key: this.props.postKey,
            uuid: ctx.user.uuid,
          })
          .then((res) => {
            if (['PostHistory', 'List'].includes(ctx.thispage)) {
              // 애니메이션 처리
              document.getElementById(this.props.postKey).style.transform =
                'scaleY(0)'

              // dom 제거
              setTimeout(
                () =>
                  this.props.removePost((p) => p.key === this.props.postKey),
                500,
              )

              // 목록에서 바로 삭제할 경우에는 화면이동 필요없음
            } else {
              // 애니메이션 처리
              document.getElementsByClassName('post')[0].style.transform =
                'scaleX(0)'

              // dom 제거
              setTimeout(() => {
                this.props.removePost((p) => p.key === this.props.postKey)

                // 글보기 화면에서 삭제할 경우에는 목록화면으로 이동 필요
                if (this.props.postOrigin) {
                  var arr = location.pathname.split('/')
                  arr.splice(2, 2, 'postHistory', this.props.postOrigin) // context 명이 없는 경우 문제 발생할 수 있음
                  this.props.history.push(arr.join('/'))
                } else {
                  this.props.history.push(this.contextPath + '/list')
                }
              }, 500)
            }
          })
          .catch((e) => {
            ctx.alert({
              message: 'Fail<br>' + e.message,
              style: 'danger',
              width: '200px',
            })
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
        if (res.status === 'Success') {
          this.props.history.push(
            this.contextPath + '/edit/' + this.props.postKey,
          )
        } else {
          ctx.alert({
            message: res.message,
            style: 'warning',
            width: '160px',
          })
          //this.cancelMenu();
        }
      })
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
    let historyCnt
    if (this.props.post) {
      if (this.props.post.historyCnt) {
        historyCnt = '(' + this.props.post.historyCnt + ')'
      }
    }

    return (
      <div className="postMenu">
        {this.state.clicked ? (
          <div className="navi">
            {ctx.history.location.pathname.indexOf('/post/') >= 0 && (
              <div className="icon-list" onClick={this.list.bind(this)}>
                List
              </div>
            )}
            {!this.props.postOrigin && (
              <div
                className="icon-history"
                onClick={this.postHistory.bind(this)}
              >
                History{historyCnt}
              </div>
            )}
            {this.props.postDeleted ? (
              <div className="icon-ccw" onClick={this.restorePost.bind(this)}>
                Restore
              </div>
            ) : (
              <Fragment>
                {!this.props.postOrigin && (
                  <div
                    className="icon-pencil"
                    onClick={this.editPost.bind(this)}
                  >
                    Edit
                  </div>
                )}
                <div
                  className="icon-trash-empty"
                  onClick={this.deletePost.bind(this)}
                  title="Delete this, whenever you can restore this"
                >
                  Delete
                </div>
              </Fragment>
            )}
            <div
              className="icon-trash"
              onClick={this.removePost.bind(this)}
              title="Delete this, you cannot undo"
            >
              Remove
            </div>
            {/* <div className="icon-cancel" onClick={this.cancelMenu}>Cancel</div> */}
          </div>
        ) : (
          <div className="navi" onClick={this.showMenu.bind(this)}>
            ...
          </div>
        )}
      </div>
    )
  }
}

export default connect((state) => ({ posts: state.data.posts }), {
  deletePost,
  removePost,
  restorePost,
  addPosts,
})(PostMenu)
