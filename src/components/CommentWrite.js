import React from 'react'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import shortid from 'shortid'
import './CommentWrite.scss'

export class CommentWrite extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.saveComment = this.saveComment.bind(this)

    this.state = {
      key: '', // key
      writer: ctx.user.writer, // 작성자
      content: '', // 내용
      uuid: ctx.user.uuid, // uuid
      postKey: this.props.postKey, // 부모 포스트 id
      commentKey: '', // 부모 코멘트 id
      date: '', // 작성시간

      isLoading: false, // Confirm 버튼 사용가능 여부(isLoading 이 false 일때만 사용 가능)
    }
  }

  handleChange(e) {
    let state = {}
    state[e.target.id] = e.target.value
    this.setState(state)

    if (e.target.id === 'content') {
      // https://zetawiki.com/wiki/HTML_textarea_자동_높이_조절
      // ctx.logger.verbose("## e.target.scrollHeight = " + e.target.scrollHeight);
      // ctx.logger.verbose("## e.target.style.height = " + e.target.style.height);

      e.target.style.height =
        e.target.scrollHeight > 20 ? e.target.scrollHeight + 1 + 'px' : '20px'

      // ctx.logger.verbose("@@ e.target.scrollHeight = " + e.target.scrollHeight);
      // ctx.logger.verbose("@@ e.target.style.height = " + e.target.style.height);
    }
  }

  saveComment() {
    if (this.state.content === '') {
      ctx.alert({
        message: 'Comment is empty',
        style: 'warning',
        width: '185px',
      })
      return
    }

    this.setState({ isLoading: true })

    const newComment = {
      key: shortid.generate(),
      writer: this.state.writer.trim(),
      content: this.state.content.trim(),
      uuid: this.state.uuid,
      postKey: this.state.postKey,
      date: Date.now(),
      uuid: ctx.user.uuid,
      commentKey: '',
    }

    ctx.api.addComment(newComment).then(res => {
      //ctx.logger.verbose("# " + res.message);
      ctx.store.dispatch(ctx.action.addComment(newComment))
      // 부모post의 댓글 카운트 1증가
      let post = ctx.store
        .getState()
        .data.posts.find(p => p.key === this.state.postKey)
      post.commentCnt = post.commentCnt ? post.commentCnt + 1 : 1
      ctx.store.dispatch(ctx.action.updatePost(post))
      this.setState({ content: '' }) // 기존 입력한 내용 초기화
      ctx.setUser({ writer: newComment.writer }) // 사용자 정보 업데이트

      //document.getElementById("content").style.height = "";   // 댓글 입력 textarea 높이 초기화
      this.content.style.height = '' // 댓글 입력 textarea 높이 초기화

      this.setState({ isLoading: false })
    })
  }

  render() {
    const { isLoading } = this.state

    //ctx.logger.verbose("Comment 렌더링..");
    return (
      <div className="comment-write">
        <div className="writer">
          <FormControl
            id="writer"
            value={this.state.writer}
            onChange={this.handleChange}
            placeholder="Writer.."
          />
        </div>
        <div className="content">
          <FormControl
            id="content"
            value={this.state.content}
            inputRef={ref => {
              this.content = ref
            }}
            onChange={this.handleChange}
            componentClass="textarea"
            placeholder="Comment.."
          />
        </div>
        <div className="confirmBtn">
          <Button
            bsStyle="success"
            disabled={isLoading}
            onClick={isLoading ? null : this.saveComment}
          >
            <i className="icon-floppy" />
            Confirm
          </Button>
        </div>
      </div>
    )
  }
}
