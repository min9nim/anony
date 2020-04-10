import React, { useState, useEffect } from 'react'
import { Comment } from '../components'
import { ctx } from '@/biz/context'
import './CommentList.scss'

export function CommentList(props) {
  ctx.logger.debug('CommentList render')

  const [comments, setComments] = useState([])

  useEffect(() => {
    ctx.logger.debug('useEffect', comments.length)

    const unsubscribe = ctx.store.subscribe(() => {
      const newComments = ctx.store
        .getState()
        .data.comments.filter((c) => c.postKey === props.postKey)
      ctx.logger.debug(
        '스토어 변경감지하고 코멘츠 갱신처리',
        newComments.length,
      )
      setComments(newComments)
    })
    if (comments.length === 0 && props.commentCnt > 0) {
      ctx.logger.debug('load comments')
      ctx.api.getComments(props.postKey).then((res) => {
        ctx.logger.debug('loaded comments')
        ctx.store.dispatch(ctx.action.addComments(res.comments))
        ctx.logger.debug('스토어 dispatch')
        const commentList = ctx.store
          .getState()
          .data.comments.filter((c) => c.postKey === props.postKey)
        setComments(commentList)
      })
    }

    return () => {
      ctx.logger.debug('unsubscribe')
      unsubscribe()
    }
  }, [comments])
  return (
    <div className="CommentList">
      {comments.map((comment) => (
        <Comment
          history={props.history}
          key={comment.key}
          comment={comment}
          context={props.context}
        />
      ))}
    </div>
  )
}
