import { ctx } from '@/biz/context'
import React from 'react'
import { Button, FormControl, FormGroup } from 'react-bootstrap'
import shortid from 'shortid'
import { MyChannels } from '@/components'

import './MenuBoard.scss'

export class MenuBoard extends React.Component {
  constructor(props) {
    //ctx.logger.verbose("MenuBoard 생성자 호출");
    super(props)
    //this.hideMenu = this.props.hideMenu;
    this.confirm = this.confirm.bind(this)
    this.refreshUuid = this.refreshUuid.bind(this)
    this.deleteUuid = this.deleteUuid.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      uuid: ctx.user.uuid,
    }
  }

  async confirm() {
    if (this.getValidationState() !== 'success') {
      ctx.alert({ message: 'Invalid uuid', style: 'warning', width: '152px' })
      return
    }
    ctx.setUser({ uuid: this.state.uuid })
    //ctx.store.dispatch(ctx.action.setUuid(ctx.user.uuid));
    //alert("uuid changed");
    ctx.alert({
      message: 'uuid changed',
      style: 'info',
      width: '152px',
    })

    ctx.store.dispatch(ctx.action.myChannels([]))
    const res = await ctx.api.myChannels()
    ctx.store.dispatch(ctx.action.myChannels(res.output))

    this.props.hideMenu()
  }

  cancel() {
    this.setState({ uuid: ctx.user.uuid })
    this.props.hideMenu()
  }

  refreshUuid() {
    this.setState({ uuid: shortid.generate() })
  }

  deleteUuid() {
    this.setState({ uuid: '' })
    this.uuidinput.focus()
  }

  getValidationState() {
    let uuid = ctx.$m.removeTag(this.state.uuid).trim()
    const length = uuid.length
    if (shortid.isValid(this.state.uuid) && length >= 9) return 'success'
    else if (length > 5) return 'warning'
    else if (length > 0) return 'error'
    return null
  }

  handleChange(e) {
    if (e.target.value.length > 10) return
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    //ctx.logger.verbose("MenuBoard 렌더링");
    return (
      <div className="uuid-setting">
        <div className="modal_div"></div>
        <div className="inner_div">
          <div className="upper_grp">
            <FormGroup
              className="form"
              controlId="uuid"
              validationState={this.getValidationState()}
            >
              {/* <ControlLabel> uuid </ControlLabel> */}
              <FormControl
                type="text"
                autoFocus
                ref={(ref) => {
                  this.uuidinput = ref
                }}
                value={this.state.uuid}
                onChange={this.handleChange}
                placeholder="uuid.."
              />
              <FormControl.Feedback />
            </FormGroup>
            <div
              className="icon-cancel delete"
              onClick={this.deleteUuid}
              title="Delete uuid"
            />
            <div
              className="icon-spin3 refresh"
              onClick={this.refreshUuid}
              title="Generate random uuid"
            />
          </div>

          <div className="btn_grp">
            <Button
              className="searchBtn"
              variant="success"
              onClick={this.confirm}
            >
              Save
            </Button>
            <Button
              className="cancelBtn"
              variant="success"
              onClick={this.cancel}
            >
              Cancel
            </Button>
          </div>

          <MyChannels channels={ctx.store.getState().data.channels} />
        </div>
      </div>
    )
  }
}
