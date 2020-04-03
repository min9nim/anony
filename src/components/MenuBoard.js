import React from 'react'
import { ctx } from '@/biz/context'
import shortid from 'shortid'
import { MyChannels } from '../components'
import './MenuBoard.scss'
import { FormGroup, FormControl, Button } from 'react-bootstrap'

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

  confirm() {
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
    ctx.api.myChannels().then(res => {
      ctx.store.dispatch(ctx.action.myChannels(res.output))
    })

    //this.hideMenu();
    ctx.view.List.setState({ menuClicked: false })
  }

  cancel() {
    this.setState({ uuid: ctx.user.uuid })
    //this.hideMenu();
    ctx.view.List.setState({ menuClicked: false })
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
    const state = {}
    state[e.target.id] = e.target.value
    this.setState(state)
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
                inputRef={ref => {
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
              bsStyle="success"
              onClick={this.confirm}
            >
              Save
            </Button>
            <Button
              className="cancelBtn"
              bsStyle="success"
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
