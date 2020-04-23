//ctx.logger.verbose("PostHistory.js start");

import React from 'react'
import { Button } from 'react-bootstrap'
import { Excerpt } from '../components'
import { ctx } from '@/biz/context'
import { Link } from 'react-router-dom'
import './PostHistory.scss'

export default class PostHistory extends React.Component {
  constructor(props) {
    //ctx.logger.verbose("PostHistory 생성자 호출");
    super(props)
    this.state = {
      phist: ctx.store
        .getState()
        .data.posts.filter(p => p.origin === this.props.postKey),
    }

    if (this.state.phist.length === 0) {
      ctx.api.getPostHistory(this.props.postKey).then(res => {
        if (res.posts.length > 0) {
          ctx.store.dispatch(ctx.action.addPosts(res.posts))
        } else {
          ctx.alert('Have no changes')
        }
      })
    }

    this.contextPath = this.props.context ? '/' + this.props.context : ''

    // 이후 App 가 스토어 상태를 구독하도록 설정
    this.unsubscribe = ctx.store.subscribe(() => {
      //ctx.logger.verbose("PostHistory 가 store 상태변경 노티 받음")
      this.setState({
        phist: ctx.store
          .getState()
          .data.posts.filter(p => p.origin === this.props.postKey),
      })
    })
  }
  componentWillUnmount() {
    //ctx.logger.verbose("# PostHistory unsubscribe store..");
    this.unsubscribe()
  }

  componentDidMount() {
    document.title = (this.props.context || 'Anony') + ' - ' + ctx.thispage
  }

  render() {
    //ctx.logger.verbose("PostHistory 렌더링..");
    return (
      <div className="postHistory">
        {this.state.phist.map(post => (
          <Excerpt
            history={this.props.history}
            context={this.props.context}
            key={post.key}
            post={post}
          />
        ))}
        <div className="btnWrapper">
          <Link to={this.contextPath + '/post/' + this.props.postKey}>
            <Button variant="success">
              <i className="icon-to-end" />
              Last
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}
