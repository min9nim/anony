import React from 'react'
import { ctx } from '@/biz/context'
import { type } from '@/redux/action'
import './PostMeta.scss'

const { LIKEPOST_REQUESTED } = type

export class PostMeta extends React.Component {
  constructor(props) {
    // ctx.logger.verbose("PostMeta 생성자 호출");
    super(props)
    this.likePost = this.likePost.bind(this)
  }

  likePost() {
    if (this.props.post.liked) {
      ctx.api.cancelLike(this.props.post.key).then((res) => {
        ctx.store.dispatch(ctx.action.updatePost(res.output))
      })
      return
    }
    // ctx.api.likePost(this.props.post.key).then((res) => {
    //   ctx.store.dispatch(ctx.action.updatePost(res.output))
    // })
    ctx.store.dispatch({ type: LIKEPOST_REQUESTED, key: this.props.post.key })
  }

  render() {
    // ctx.logger.verbose("PostMeta 렌더링");
    return (
      <div className="postMeta">
        <i className="icon-eye">View: {this.props.post.viewCnt || 0} </i>
        <i className="icon-comment-empty">
          Comments: {this.props.post.commentCnt || 0}
        </i>
        <i
          className={
            this.props.post.liked
              ? 'icon-thumbs-up-alt liked'
              : ' icon-thumbs-up like'
          }
          onClick={this.likePost}
        >
          like: {this.props.post.likeCnt}{' '}
        </i>
      </div>
    )
  }
}
