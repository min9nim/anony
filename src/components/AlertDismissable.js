import React from "react";
//import ReactDOM from 'react-dom';     // 이거보다 아래가 더 최적화를 위해 나은 코드일까? 18.08.19
import {findDOMNode} from 'react-dom';

import {
    Alert,
    Button
} from "react-bootstrap";
import "./AlertDismissable.scss";


export default class AlertDismissable extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleDismiss = this.handleDismiss.bind(this);
      this.handleShow = this.handleShow.bind(this);
  
      this.state = {
        show: false,
        style: "warning",   // success, warning, danger, info
        message: "",
        width: undefined,
      };


      tp.view.AlertDismissable = this;
    }
  
    handleDismiss() {
      this.setState({ show: false, message: "" });
      if(typeof this.onClose === "function"){
        this.onClose();
        this.onClose = undefined;
      }
    }
  
    handleShow({message, style="warning", width, onClose}) {
      this.setState({
        show: true,
        message,
        style,
        width,
      });
      this.onClose = onClose;
    }

    componentDidUpdate(){
      if(this.state.show)
        //ReactDOM.findDOMNode(this.refs.closeBtn).focus();   // 이거보다 아래가 더 최적화를 위해 나은 코드일까? 18.08.19
        findDOMNode(this.refs.closeBtn).focus();
    }

  
    render() {
      if (this.state.show) {
        return (
          <div>
            <div className="modal_div"></div>
            <Alert bsStyle={this.state.style} style={{width: this.state.width}} onDismiss={this.handleDismiss}>
              <p dangerouslySetInnerHTML={{__html: this.state.message}} />
              <p>
                {/* <Button bsStyle="danger">Take this action</Button>
                <span> or </span> */}
                <Button bsStyle={this.state.style} ref="closeBtn" onClick={this.handleDismiss}>Close</Button>
              </p>
            </Alert>
          </div>
        );
      }else{
        return null;
      }
    }
}