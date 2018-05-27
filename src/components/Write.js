import React from 'react';

import {
    FormGroup,
    HelpBlock,
    ControlLabel,
    FormControl,
    Button
} from 'react-bootstrap';
import tp, {store, addPost} from "../tp.js";

console.log("Write.js call");

export default class Write extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.savePost = this.savePost.bind(this);
        this.goList = this.goList.bind(this);
        this.state = {
            title: "",
            writer: "",
            content: "",
        };
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevState !== this.state;
    }

    getValidationState() {
        const length = this.state.title.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        let state = {};
        state[e.target.id] = e.target.value;
        this.setState(state);
        //console.log(this.state);
    }

    savePost() {
        if(this.state.title === ""){
            alert("제목을 입력하세요");
            return;
        }
        //const posts = [...this.props.app.state.posts, this.state];
        //const posts = [...tp.getPosts(), this.state];
        /*
        this.props.app.setState({
            posts: posts,
            mode: "list"
        });
        */
        store.dispatch(addPost(this.state));
        //tp.setPosts({mode: "list", posts: posts});
        tp.saveState(store.getState());
    }
    
    goList() {
        this.props.app.setState({
            mode: "list",
        });
    }
    

    render() {
        console.log("Write rendering");
        const layout = {
            margin: "20px"
        };
        return (
            <div style={layout}>
                <FormGroup controlId="title" validationState={this.getValidationState()}>
                    <ControlLabel>Title</ControlLabel>
                    <FormControl type="text" value={this.state.title} onChange={this.handleChange} placeholder="제목을 입력하세요.." />
                    <FormControl.Feedback /> {/*
                    <HelpBlock>Validation is based on string length.</HelpBlock>*/} </FormGroup>
                <FormGroup controlId="writer">
                    <ControlLabel>Writer</ControlLabel>
                    <FormControl type="text" value={this.state.writer} onChange={this.handleChange} placeholder="별명을 입력하세요.." /> </FormGroup>
                <FormGroup controlId="content">
                    <ControlLabel>Content</ControlLabel>
                    <FormControl style={{height: "100px"}} value={this.state.content} onChange={this.handleChange} componentClass="textarea" placeholder="내용을 입력하세요.." /> </FormGroup>
                <Button bsStyle="success" onClick={this.savePost}>Save</Button>
                <Button style={{marginLeft: "3px"}}bsStyle="success" onClick={this.goList}>List</Button> </div>
        );
    }
}
