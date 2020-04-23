import React from 'react'
import ReactDOM from 'react-dom'
import { Alert, Button } from 'react-bootstrap'
import './Confirm.scss'

export class Confirm extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleDismiss = this.handleDismiss.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleYes = this.handleYes.bind(this)
    this.handleNo = this.handleNo.bind(this)

    this.state = {
      show: false,
      style: 'info', // success, warning, danger, info
      message: '',
      width: undefined,
    }

    ctx.view.Confirm = this
  }

  handleDismiss() {
    this.setState({ show: false, message: '' })
  }

  handleYes() {
    this.handleDismiss()
    if (typeof this.onYes === 'function') {
      this.onYes()
      this.onYes = undefined
    }
  }

  handleNo() {
    this.handleDismiss()
    if (typeof this.onNo === 'function') {
      this.onNo()
      this.onNo = undefined
    }
  }

  componentDidUpdate() {
    if (this.state.show) ReactDOM.findDOMNode(this.refs.yesBtn).focus()
  }

  handleShow({ message, style = 'info', width, onYes, onNo }) {
    this.setState({
      show: true,
      message,
      style,
      width,
    })
    this.onYes = onYes
    this.onNo = onNo
  }

  render() {
    if (!this.state.show) {
      return null
    }
    return (
      <div className="confirm">
        <div className="modal_div"></div>
        <Alert
          variant={this.state.style}
          style={{ width: this.state.width }}
          onDismiss={this.handleDismiss}
        >
          <p dangerouslySetInnerHTML={{ __html: this.state.message }} />
          <p>
            <Button variant="info" ref="yesBtn" onClick={this.handleYes}>
              YES
            </Button>
            <span> or </span>
            <Button variant="warning" onClick={this.handleNo}>
              NO
            </Button>
          </p>
        </Alert>
      </div>
    )
  }
}
