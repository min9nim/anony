import React, { useState } from 'react'
import { PostMenu, PostMeta } from '../components'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './Excerpt.scss'
import { highlight } from 'mingutils'

export function Excerpt(props) {
  const [state, setState] = useState({
    postMetaClicked: false,
  })

  function postMetaClick() {
    setState({ postMetaClicked: true })
  }

  const contextPath = props.context ? '/' + props.context : ''

  const deletedClass = props.post.deleted ? 'deleted' : ''
  const privateClass = props.post.isPrivate ? 'private' : ''

  const titleClass = `title h4 ${deletedClass} ${privateClass}`
  const contentStyle = `content ${deletedClass} ${privateClass}`

  const search = ctx.store.getState().view.search
  let title = highlight(search)(props.post.title)
  title = (props.post.isPrivate ? `<i class="icon-lock"></i>` : '') + title
  const content = ctx.$m.removeTag(props.post.content)
  const excerpt = highlight(search)(content)

  return (
    <div id={props.post.key} className="excerpt">
      <div className="title1">
        <Link to={contextPath + '/post/' + props.post.key}>
          <div
            className={titleClass}
            dangerouslySetInnerHTML={{ __html: title }}
          ></div>
        </Link>
      </div>

      <div className="meta">
        {props.post.writer} -{' '}
        {/postHistory/.test(location.pathname) && 'edited'}{' '}
        {moment(props.post.date).fromNow()}
      </div>
      <div
        className={contentStyle}
        dangerouslySetInnerHTML={{ __html: excerpt }}
      ></div>
      <div className="meta-wrapper">
        {state.postMetaClicked ? (
          <PostMeta post={props.post} />
        ) : (
          <div className="postMetaBtn" onClick={postMetaClick}>
            ...
          </div>
        )}
        <PostMenu
          history={props.history}
          context={props.context}
          postKey={props.post.key}
          post={props.post}
          postOrigin={props.post.origin}
          postDeleted={props.post.deleted}
        />
      </div>
    </div>
  )
}
