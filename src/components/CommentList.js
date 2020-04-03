import React from 'react'
import { Comment } from '../components'
import { tp } from '@/biz/context'
import './CommentList.scss'

export class CommentList extends React.Component {
  constructor(props) {
    // console.log("CommentList 생성자 호출");
    super(props)
    this.state = {
      comments: tp.store
        .getState()
        .data.comments.filter(c => c.postKey === this.props.postKey),
    }
    tp.view.CommentList = this

    // 이후 CommentList 가 스토어 상태를 구독하도록 설정
    this.unsubscribe = tp.store.subscribe(() => {
      // console.log("# CommentList setState called..");
      this.setState({
        comments: tp.store
          .getState()
          .data.comments.filter(c => c.postKey === this.props.postKey),
      })
    })

    if (this.state.comments.length === 0 && this.props.commentCnt > 0) {
      tp.api
        .getComments(this.props.postKey)
        .then(res => tp.store.dispatch(tp.action.addComments(res.comments)))
    }
  }

  componentWillUnmount() {
    // console.log("# CommentList unsubscribe store..");
    this.unsubscribe()
  }

  render() {
    //console.log("CommentList 렌더링..");
    return (
      <div className="CommentList">
        {this.state.comments.map(comment => (
          <Comment
            history={this.props.history}
            key={comment.key}
            comment={comment}
            context={this.props.context}
          />
        ))}
      </div>
    )
  }
}
