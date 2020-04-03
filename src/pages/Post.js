import React from 'react'
import { tp } from '../tp'
import {
  highlight_nl2br,
  highlight,
  spaAccess,
  directAccess,
  editPost,
} from '../biz'
import { exclude, go } from 'mingutils'
import {
  PostMenu,
  CommentWrite,
  CommentList,
  PostMeta,
  MyChannels,
} from '../components'
import { prop, length, propEq } from 'ramda'
import moment from 'moment'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Remarkable from 'remarkable'
import './Post.scss'
import '../css/hljsTheme/xcode.css'

export default class Post extends React.Component {
  constructor(props) {
    //console.log("Post 생성자 호출");
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
    const { posts } = tp.store.getState().data
    if (go(posts, exclude(prop('origin')), length)) {
      this.state = posts.find(propEq('key', this.props.postKey))
    }

    this.contextPath = this.props.context ? '/' + this.props.context : ''
    tp.view.Post = this

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
    this.unsubscribe = tp.store.subscribe(() => {
      this.setState(
        tp.store.getState().data.posts.find(propEq('key', this.props.postKey)),
      )
    })
    if (this.state.key) {
      spaAccess(this.state.date, this.props.postKey)
      return
    }
    directAccess(this.props.postKey)
  }

  render() {
    if (this.state.key) {
      // 해당 글로 직접 access 한 경우에도 타이틀 세팅해주려면 여기서 한번 더 타이틀 설정이 필요함
      document.title = this.state.title
    } else {
      return null
    }

    let title
    const search = tp.store.getState().view.search
    title = tp.highlight(this.state.title, search)
    //title += this.state.isPrivate ? "<sup> - Private -</sup>" : "";
    title = (this.state.isPrivate ? `<i class="icon-lock"></i>` : '') + title

    const deletedClass = this.state.deleted ? 'deleted' : ''
    const privateClass = this.state.isPrivate ? 'private' : ''
    const titleClass = `title h4 ${deletedClass} ${privateClass}`

    const contentClass = this.state.isMarkdown ? 'markdown' : 'content'
    const contentStyle = `${deletedClass} ${privateClass} ${contentClass}`

    const content = this.state.isMarkdown
      ? this.md.render(highlight_nl2br(this.state.content, search))
      : tp.$m.txtToHtml(this.state.content, search)

    return (
      <div>
        {/* <div className="context">{this.props.context || "Anony"}</div> */}
        <div className="post">
          <div className="title-wrapper">
            <div className="prev-padding"> </div>
            {/*제목에서 검색결과 하이라이트 표시를 하려면 html태그 사용이 필요하다 */}
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
            {/**
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
            )}
          </div>
          <div
            className={contentStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <PostMeta post={this.state} />
          {//!!this.state.origin || this.state.isPrivate || (
          this.state.context &&
            (!!this.state.origin || (
              //(
              <div>
                <Link to={this.contextPath + '/list'}>
                  <Button bsStyle="success" className="listBtn">
                    <i className="icon-list" />
                    List
                  </Button>
                </Link>
                <Link to={this.contextPath + '/write'}>
                  <Button bsStyle="success" className="writeBtn">
                    <i className="icon-doc-new" />
                    Write
                  </Button>
                </Link>
                <Button
                  bsStyle="success"
                  className="writeBtn"
                  onClick={this.editPost}
                >
                  <i className="icon-pencil" />
                  Edit
                </Button>
              </div>
            ))}
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
      </div>
    )
  }
}
