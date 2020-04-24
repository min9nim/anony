import React from 'react'
import { ctx } from '@/biz/context'
import './CommentEdit.scss'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'

export class CommentEdit extends React.Component {
  constructor(props) {
    super(props)
    this.hideEdit = this.props.hideEdit
    this.hideMenu = this.props.hideMenu
    this.save = this.save.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = this.props.comment
    this.state.uuid = ctx.user.uuid
  }

  save() {
    const content = this.state.content.trim()
    if (content === '') {
      ctx.alert('Comment is empty')
      return
    }

    // 댓글 수정하고
    ctx.api
      .updateComment(this.state)
      .then(res => ctx.store.dispatch(ctx.action.updateComment(res.output)))

    this.hideEdit()
    this.hideMenu()
  }

  handleChange(e) {
    const state = {}
    state[e.target.id] = e.target.value
    this.setState(state)
  }

  render() {
    ctx.logger.verbose('Search 렌더링')
    return (
      <div className="CommentEditBox">
        <div className="modal_div"></div>
        <div className="inner_div">
          <FormGroup controlId="writer">
            {/*<ControlLabel> Content </ControlLabel>*/}
            <FormControl
              className="writer"
              value={this.state.writer}
              onChange={this.handleChange}
              as="textarea"
              placeholder="writer.."
            />
          </FormGroup>

          <FormGroup controlId="content">
            {/*<ControlLabel> Content </ControlLabel>*/}
            <FormControl
              className="content"
              autoFocus
              value={this.state.content}
              onChange={this.handleChange}
              as="textarea"
              placeholder="comment.."
            />
          </FormGroup>

          <div className="btn_grp">
            <Button className="searchBtn" variant="success" onClick={this.save}>
              Save
            </Button>
            <Button
              className="cancelBtn"
              variant="success"
              onClick={this.hideEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
