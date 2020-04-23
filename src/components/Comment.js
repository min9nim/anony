import { ctx } from '@/biz/context'
import { CommentMenu } from '@/components'
import moment from 'moment'
import React from 'react'
import './Comment.scss'

export class Comment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // ctx.logger.verbose("Comment 렌더링");
    // if (this.props.comment) {
    //   // Comment 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
    //   this.state = this.props.comment
    // }
    const { comment } = this.props
    const html = ctx.$m.txtToHtml(comment.content)
    return (
      <div className="comment">
        <div>
          <div className="meta">
            {comment.writer} - {moment(comment.date).format('MM/DD dd HH:mm')}
          </div>
          <CommentMenu comment={comment} />
        </div>
        {/*댓글에서 새줄표시 <br> 처리하기 위해 html을 사용할 수 있어야 함*/}
        <div
          className={comment.deleted ? 'content deleted' : 'content'}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    )
  }
}
