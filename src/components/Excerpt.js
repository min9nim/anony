import React from 'react'
import { PostMenu, PostMeta } from '../components'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './Excerpt.scss'
import { highlight } from 'mingutils'

export class Excerpt extends React.Component {
  constructor(props) {
    ctx.logger.verbose('Excerpt 생성자호출')

    super(props)
    this.state = {
      postMetaClicked: false,
    }
    this.contextPath = this.props.context ? '/' + this.props.context : ''

    moment.locale('ko')
    //moment.locale('en');
  }

  postMetaClick() {
    this.setState({ postMetaClicked: true })
  }
  render() {
    //ctx.logger.verbose("Excerpt 렌더링..");

    const deletedClass = this.props.post.deleted ? 'deleted' : ''
    const privateClass = this.props.post.isPrivate ? 'private' : ''

    const titleClass = `title h4 ${deletedClass} ${privateClass}`
    const contentStyle = `content ${deletedClass} ${privateClass}`

    const search = ctx.store.getState().view.search
    let title = highlight(search)(this.props.post.title)
    title =
      (this.props.post.isPrivate ? `<i class="icon-lock"></i>` : '') + title
    const content = ctx.$m.removeTag(this.props.post.content)
    const excerpt = highlight(search)(content)

    return (
      <div id={this.props.post.key} className="excerpt">
        <div className="title1">
          <Link to={this.contextPath + '/post/' + this.props.post.key}>
            <div
              className={titleClass}
              dangerouslySetInnerHTML={{ __html: title }}
            ></div>
          </Link>
        </div>

        <div className="meta" onClick={this.editPost}>
          {this.props.post.writer} -{' '}
          {/postHistory/.test(location.pathname) && 'edited'}{' '}
          {moment(this.props.post.date).fromNow()}
        </div>
        <div
          className={contentStyle}
          dangerouslySetInnerHTML={{ __html: excerpt }}
        ></div>
        <div className="meta-wrapper">
          {this.state.postMetaClicked ? (
            <PostMeta post={this.props.post} />
          ) : (
            <div
              className="postMetaBtn"
              onClick={this.postMetaClick.bind(this)}
            >
              ...
            </div>
          )}
          <PostMenu
            history={this.props.history}
            context={this.props.context}
            postKey={this.props.post.key}
            post={this.props.post}
            postOrigin={this.props.post.origin}
            postDeleted={this.props.post.deleted}
          />
        </div>
      </div>
    )
  }
}
