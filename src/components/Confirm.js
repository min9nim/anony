import React from "react";
import {
    Alert,
    Button
} from "react-bootstrap";
import "./Confirm.scss";


export default class Confirm extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleDismiss = this.handleDismiss.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.handleYes = this.handleYes.bind(this);
      this.handleNo = this.handleNo.bind(this);
  
      this.state = {
        show: false,
        style: "info",   // success, warning, danger, info
        message: "",
        width: "200px",
      };

      tp.view.Confirm = this;
    }
  
    handleDismiss() {
      this.setState({ show: false, message: "" });
    }

    handleYes(){
      this.handleDismiss();
      debugger;
      if(typeof this.onYes === "function"){
        this.onYes();
        this.onYes = undefined;
      }
    }

    handleNo(){
      this.handleDismiss();
      if(typeof this.onNo === "function"){
        this.onNo();
        this.onNo = undefined;
      }
    }
  
    handleShow({message, style="info", width="200px", onYes, onNo}) {
      this.setState({
        show: true,
        message,
        style,
        width,
      });
      this.onYes = onYes;
      this.onNo = onNo;
    }
  
    render() {
      if (this.state.show) {
        return (
          <div>
            <div className="modal_div"></div>
            <Alert bsStyle={this.state.style} style={{width: this.state.width}} onDismiss={this.handleDismiss}>
              <p>
                {this.state.message}
              </p>
              <p>
                <Button bsStyle="info" onClick={this.handleYes}>YES</Button>
                <span> or </span>
                <Button bsStyle="warning" onClick={this.handleNo}>NO</Button>
              </p>
            </Alert>
          </div>
        );
      }else{
        return null;
      }
    }
}