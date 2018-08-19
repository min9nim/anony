import React from "react";
import {tp} from "../tp";
import "./CommentEdit.scss";
import {
    FormGroup,
    ControlLabel,
    FormControl,
    Button
  } from "react-bootstrap";

export default class CommentEdit extends React.Component {
    constructor(props) {
        super(props);
        this.hideEdit = this.props.hideEdit;
        this.hideMenu = this.props.hideMenu;
        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        this.state = this.props.comment;
        this.state.uuid = tp.user.uuid;
    }


    save(){
        const content = this.state.content.trim();
        if(content === ""){
            tp.alert("Comment is empty");
            return;
        }

        // 댓글 수정하고
        tp.api.updateComment(this.state)
            .then(tp.checkStatus)
            .then(res => tp.store.dispatch(tp.action.updateComment(res.output)));

        this.hideEdit();
        this.hideMenu();
    }



    handleChange(e) {
        const state = {};
        state[e.target.id] = e.target.value ;
        this.setState(state);
    }    


    render(){
        console.log("Search 렌더링");
        return (
            <div className="CommentEditBox">
                <div className="modal_div"></div>
                <div className="inner_div">
                    <FormGroup controlId = "writer">
                        {/*<ControlLabel> Content </ControlLabel>*/}
                        <FormControl className="writer"
                                value = {this.state.writer}
                                onChange = {this.handleChange}
                                componentClass = "textarea"
                                placeholder = "writer.." />
                    </FormGroup>

                    <FormGroup controlId = "content">
                        {/*<ControlLabel> Content </ControlLabel>*/}
                        <FormControl className="content"
                                autoFocus
                                value = {this.state.content}
                                onChange = {this.handleChange}
                                componentClass = "textarea"
                                placeholder = "comment.." />
                    </FormGroup>

                    <div className="btn_grp">
                        <Button className="searchBtn" bsStyle="success" onClick={this.save}>Save</Button>
                        <Button className="cancelBtn" bsStyle="success" onClick={this.hideEdit}>Cancel</Button>
                    </div>    
                </div>                
            </div>
        )
    }
}
