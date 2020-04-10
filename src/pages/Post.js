import React from 'react'
import { ctx, Ctx } from '@/biz/context'
import {
  highlight_nl2br,
  highlight,
  spaAccess,
  directAccess,
  editPost,
} from '../biz'
import { exclude, go, highlight as mark } from 'mingutils'
import {
  PostMenu,
  CommentWrite,
  CommentList,
  PostMeta,
  MyChannels,
  PostBottomButtons,
} from '../components'
import { prop, length, propEq } from 'ramda'
import moment from 'moment'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Remarkable from 'remarkable'
import './Post.scss'
import '../css/hljsTheme/xcode.css'

export default class Post extends React.Component {
  // static contextType = Ctx
  constructor(props) {
    //ctx.logger.verbose("Post 생성자 호출");
    super(props)
    this.editPost = () =>
      editPost(this.props.history, this.contextPath, this.props.postKey)

    this.state = {
      key: '',
      title: '',
      writer: '',
      content: '',
      date: '',
      isPrivate: false,
      deleted: false,
      uuid: '',
      viewCnt: '',
      origin: '',
      likeCnt: 0,
    }
    const { posts } = ctx.store.getState().data
    if (go(posts, exclude(prop('origin')), length)) {
      this.state = posts.find(propEq('key', this.props.postKey))
    }

    this.contextPath = this.props.context ? '/' + this.props.context : ''
    ctx.view.Post = this

    this.md = new Remarkable({
      html: true,
      linkify: true,
      xhtmlOut: true,
      breaks: true,
      highlight,
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount() {
    document.title = this.state.title
    this.unsubscribe = ctx.store.subscribe(() => {
      this.setState(
        ctx.store.getState().data.posts.find(propEq('key', this.props.postKey)),
      )
    })
    if (this.state.key) {
      spaAccess(this.state.date, this.props.postKey)
      return
    }
    directAccess(this.props.postKey)
  }

  render() {
    // ctx.logger.verbose('this.context:', this.context)
    if (!this.state.key) {
      return null
    }
    // 해당 글로 직접 access 한 경우에도 타이틀 세팅해주려면 여기서 한번 더 타이틀 설정이 필요함
    document.title = this.state.title

    let title
    const search = ctx.store.getState().view.search
    title = mark(search)(this.state.title)
    //title += this.state.isPrivate ? "<sup> - Private -</sup>" : "";
    title = (this.state.isPrivate ? `<i class="icon-lock"></i>` : '') + title

    const deletedClass = this.state.deleted ? 'deleted' : ''
    const privateClass = this.state.isPrivate ? 'private' : ''
    const titleClass = `title h4 ${deletedClass} ${privateClass}`

    const contentClass = this.state.isMarkdown ? 'markdown' : 'content'
    const contentStyle = `${deletedClass} ${privateClass} ${contentClass}`

    const content = this.state.isMarkdown
      ? this.md.render(highlight_nl2br(this.state.content, search))
      : ctx.$m.txtToHtml(this.state.content, search)

    return (
      <article>
        <div className="post">
          <div className="title-wrapper">
            <div className="prev-padding"> </div>
            <div
              className={titleClass}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <div className="meta">
            <div className="writer-time">
              {this.state.writer} -{' '}
              {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}
            </div>
            {
              /**
               * 18.11.09
               * URL에서 channel 값을 지우고 직접 access해서 들어오는 경우에는 this.state.context 값이 false 가 된다
               */
              this.state.context && (
                <PostMenu
                  history={this.props.history}
                  postKey={this.state.key}
                  postDeleted={this.state.deleted}
                  postOrigin={this.state.origin}
                  post={this.state}
                  context={this.props.context}
                />
              )
            }
          </div>
          <div
            className={contentStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <PostMeta post={this.state} />
          {
            //!!this.state.origin || this.state.isPrivate || (
            this.state.context &&
              (!!this.state.origin || (
                <PostBottomButtons
                  contextPath={this.contextPath}
                  editPost={this.editPost}
                />
              ))
          }
          {this.state.origin && (
            <Link to={this.contextPath + '/postHistory/' + this.state.origin}>
              <Button bsStyle="success" className="writeBtn">
                <i className="icon-history" />
                History
              </Button>
            </Link>
          )}
        </div>

        {!this.state.origin && this.state.hasComment && (
          <div>
            <CommentList
              postKey={this.state.key}
              commentCnt={this.state.commentCnt}
            />
            {this.state.deleted || <CommentWrite postKey={this.state.key} />}
          </div>
        )}

        <div className="channels-wrappter">
          <MyChannels />
        </div>
      </article>
    )
  }
}

Post.contextType = Ctx
