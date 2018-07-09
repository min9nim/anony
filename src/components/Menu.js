import React from 'react';
import {tp} from "../tp";
import shortid from "shortid";
import "./Menu.scss";
import {
    FormGroup,
    ControlLabel,
    FormControl,
    Button
  } from 'react-bootstrap';

export default class Menu extends React.Component {
    constructor(props) {
        console.log("PostMenu 생성자 호출");
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        this.state = {
            uuid: tp.user.uuid,
            clicked : false
        }
        tp.shortid = shortid;
    }

    // copy(){
    //     var copyText = document.getElementById("uuid");
    //     /* Select the text field */
    //     copyText.select();
    //     /* Copy the text inside the text field */
    //     document.execCommand("copy");
    //     alert("copied on Clipboard");      
    // }

    confirm(){
        if(this.getValidationState() !== "success"){
            alert("invalid uuid");
            return;
        }
        tp.setUser({uuid: this.state.uuid});
        tp.store.dispatch(tp.action.setUuid(user.uuid));
        alert("uuid changed");
        this.hideMenu();
    }

    cancel(){
        this.setState({uuid: tp.user.uuid});
        this.hideMenu();
    }

    hideMenu(){
        this.setState({clicked: false});
    }

    getValidationState() {
        const length = this.state.uuid.length;
        if (shortid.isValid(this.state.uuid) && this.state.uuid.length===9) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        if(e.target.value.length > 9) return;
        const state = {};
        state[e.target.id] = e.target.value ;
        this.setState(state);
      }

    showMenu(){
        this.setState({clicked: true});
    }

    render(){
        console.log("Menu 렌더링");
        return (
            <div className="menu">{
                this.state.clicked
                ? 
                <div className="uuid-setting">
                    <FormGroup className="form" controlId = "uuid" validationState = {this.getValidationState()}>
                        {/* <ControlLabel> uuid </ControlLabel> */}
                        <FormControl type = "text"
                                value = {this.state.uuid}
                                onChange = {this.handleChange}
                                placeholder = "uuid.." />
                        <FormControl.Feedback />
                    </FormGroup>
                    {/* <div className="copy" onClick={this.copy}>copy</div> */}
                    <div className="confirm" onClick={this.confirm}>Save</div>
                    <div className="cancel" onClick={this.cancel}>Cancel</div>
                </div>
                :
                <div className="navi" onClick={this.showMenu}>...</div>
            }</div>
        );
    }
}
