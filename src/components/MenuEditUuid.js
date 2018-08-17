import React from 'react';
import {tp} from "../tp";
import shortid from "shortid";
import "./MenuEditUuid.scss";
import {
    FormGroup,
    ControlLabel,
    FormControl,
    Button
  } from 'react-bootstrap';

export default class MenuEditUuid extends React.Component {
    constructor(props) {
        console.log("PostMenu 생성자 호출");
        super(props);
        this.hideMenu = this.props.hideMenu;
        this.confirm = this.confirm.bind(this);
        this.refreshUuid = this.refreshUuid.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        this.state = {
            uuid: tp.user.uuid,
        }
    }


    confirm(){
        if(this.getValidationState() !== "success"){
            alert("invalid uuid");
            return;
        }
        tp.setUser({uuid: this.state.uuid});
        tp.store.dispatch(tp.action.setUuid(tp.user.uuid));
        alert("uuid changed");
        this.hideMenu();
    }

    cancel(){
        this.setState({uuid: tp.user.uuid});
        this.hideMenu();
    }

    refreshUuid(){
        this.setState({uuid: shortid.generate()});
    }


    getValidationState() {
        const length = this.state.uuid.length;
        if (shortid.isValid(this.state.uuid) && this.state.uuid.length >= 9) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        if(e.target.value.length > 10) return;
        const state = {};
        state[e.target.id] = e.target.value ;
        this.setState(state);
    }

    render(){
        console.log("MenuEditUuid 렌더링");
        return (
            <div className="uuid-setting">
                <div className="modal_div"></div>
                <div className="inner_div">
                    <div className="upper_grp">
                        <FormGroup className="form" controlId = "uuid" validationState = {this.getValidationState()}>
                            {/* <ControlLabel> uuid </ControlLabel> */}
                            <FormControl type = "text"
                                    autoFocus
                                    value = {this.state.uuid}
                                    onChange = {this.handleChange}
                                    placeholder = "uuid.." />
                            <FormControl.Feedback />
                        </FormGroup>
                        <div className="icon-spin3 refresh" onClick={this.refreshUuid} title="Gererage random uuid"/>
                    </div>
                    
                    <div className="btn_grp">
                        <Button className="searchBtn" bsStyle="success" onClick={this.confirm}>Save</Button>
                        <Button className="cancelBtn" bsStyle="success" onClick={this.cancel}>Cancel</Button>
                    </div>  
                </div>
            </div>
        );
    }
}