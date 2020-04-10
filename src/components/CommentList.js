import React, { useState, useEffect } from 'react'
import { Comment } from '../components'
import { ctx } from '@/biz/context'
import './CommentList.scss'

export function CommentList(props) {
  const [mounted, setMounted] = useState(true)
  const [comments, setComments] = useState([])

  useEffect(() => {
    const unsubscribe = ctx.store.subscribe(() => {
      const newComments = ctx.store
        .getState()
        .data.comments.filter((c) => c.postKey === props.postKey)
      setComments(newComments)
    })
    return () => {
      unsubscribe()
    }
  }, [comments])

  useEffect(() => {
    if (mounted && comments.length === 0 && props.commentCnt > 0) {
      ctx.api.getComments(props.postKey).then((res) => {
        ctx.store.dispatch(ctx.action.addComments(res.comments))
      })
      setMounted(false)
    }
  }, [mounted])

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
