import React from 'react';
import {tp} from "../tp";
import {addPost, viewMode} from "../action";
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
    this.goList = this.goList.bind(this);
    this.state = {
      title: "",
      writer: "",
      content: "",
      date : ""
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
  }

  savePost() {
    if (this.state.title === "") {
      alert("제목을 입력하세요");
      return;
    }
    this.state.date = Date.now();
    tp.dispatch(addPost(this.state));
  }

  goList() {
    tp.dispatch(viewMode("list"));
  }

  render() {
    const layout = {
      margin: "20px"
    };
    return (
        <div style = {layout} >
            <FormGroup  controlId = "title" validationState = {this.getValidationState()}>
                <ControlLabel> Title </ControlLabel>
                <FormControl type = "text"
                        autoFocus value = {this.state.title}
                        onChange = {this.handleChange}
                        placeholder = "제목을 입력하세요.." />
                <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId = "writer" >
                <ControlLabel> Writer </ControlLabel>
                <FormControl type = "text"
                      value = {this.state.writer}
                      onChange = {this.handleChange}
                      placeholder = "별명을 입력하세요.." />
            </FormGroup>
            <FormGroup controlId = "content">
                <ControlLabel> Content </ControlLabel>
                <FormControl  style = {{height: "100px"}}
                        value = {this.state.content}
                        onChange = {this.handleChange}
                        componentClass = "textarea"
                        placeholder = "내용을 입력하세요.." />
            </FormGroup>
            <Button bsStyle = "success" onClick = {this.savePost}> Save </Button>
            <Button style = {{marginLeft: "3px"}} bsStyle = "success" onClick = {this.goList}>List </Button>
        </div>
    );
  }
}
