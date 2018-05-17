import React from 'react';
import shortid from "shortid";
import {
    FormGroup,
    HelpBlock,
    ControlLabel,
    FormControl,
    Button
} from 'react-bootstrap';

export default class Write extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.savePost = this.savePost.bind(this);
        this.state = {
            //key : Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2),
            key: shortid.generate(),
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
        const posts = [...window.app.state.posts, this.state];
        window.app.setState({
            posts: posts,
            mode: "list"
        });
        window.localStorage.setItem("posts", JSON.stringify(posts));
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
                    <FormControl style={{height: "300px"}} value={this.state.content} onChange={this.handleChange} componentClass="textarea" placeholder="내용을 입력하세요.." /> </FormGroup>
                <Button bsStyle="success" onClick={this.savePost}>Save</Button> </div>
        );
    }
}
