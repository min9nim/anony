import React from 'react'
import { findDOMNode } from 'react-dom'
import Alert from 'react-bootstrap/lib/Alert'
import Button from 'react-bootstrap/lib/Button'
import './AlertDismissable.scss'

export class AlertDismissable extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleDismiss = this.handleDismiss.bind(this)
    this.handleShow = this.handleShow.bind(this)

    this.state = {
      show: false,
      style: 'warning', // success, warning, danger, info
      message: '',
      width: undefined,
    }

    tp.view.AlertDismissable = this
  }

  handleDismiss() {
    this.setState({ show: false, message: '' })
    if (typeof this.onClose === 'function') {
      this.onClose()
      this.onClose = undefined
    }
  }

  handleShow({ message, style = 'warning', width, onClose }) {
    this.setState({
      show: true,
      message,
      style,
      width,
    })
    this.onClose = onClose
  }

  componentDidUpdate() {
    if (this.state.show) findDOMNode(this.refs.closeBtn).focus()
  }

  render() {
    if (!this.state.show) {
      return null
    }
    return (
      <div className="alertDismissable">
        <div className="modal_div"></div>
        <Alert
          bsStyle={this.state.style}
          style={{ width: this.state.width }}
          onDismiss={this.handleDismiss}
        >
          <p dangerouslySetInnerHTML={{ __html: this.state.message }} />
          <p>
            <Button
              bsStyle={this.state.style}
              ref="closeBtn"
              onClick={this.handleDismiss}
            >
              Close
            </Button>
          </p>
        </Alert>
      </div>
    )
  }
}
