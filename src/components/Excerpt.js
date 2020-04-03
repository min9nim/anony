import React from 'react'
import { PostMenu, PostMeta } from '../components'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './Excerpt.scss'
//import R from "ramda";
const R = require('ramda')

export class Excerpt extends React.Component {
  constructor(props) {
    //console.log("Excerpt 생성자호출");

    super(props)
    this.state = {
      postMetaClicked: false,
    }
    this.contextPath = this.props.context ? '/' + this.props.context : ''

    moment.locale('ko')
    //moment.locale('en');
  }

  shouldComponentUpdate(nextProps, prevState) {
    // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
    //return this.props !== prevProps;

    //props: history, key, post, context
    //return prevProps.post !== this.props.post;
    //console.log("this.props.post.deleted = " + this.props.post.deleted);
    //console.log("prevProps.post.deleted = " + prevProps.post.deleted);

    /**
     * 18.11.08
     * postMetaClicked 함수를 추가하면서 아래 리턴값 변경함
     *
     */
    //return !R.equals(this.props, nextProps)
    return true
  }

  postMetaClick() {
    this.setState({ postMetaClicked: true })
  }
  render() {
    //console.log("Excerpt 렌더링..");

    const deletedClass = this.props.post.deleted ? 'deleted' : ''
    const privateClass = this.props.post.isPrivate ? 'private' : ''

    const titleClass = `title h4 ${deletedClass} ${privateClass}`
    const contentStyle = `content ${deletedClass} ${privateClass}`

    const search = tp.store.getState().view.search
    let title = tp.highlight(this.props.post.title, search)
    title =
      (this.props.post.isPrivate ? `<i class="icon-lock"></i>` : '') + title
    //const excerpt = tp.highlight(this.props.post.content.substr(0,100), search);
    const content = tp.$m.removeTag(this.props.post.content)
    const excerpt = tp.highlight(content, search)

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
