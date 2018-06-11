import React from 'react';
import shortid from "shortid";
import {tp} from "../tp";
import {addPost, viewMode} from "../redux/action";
import { Link } from 'react-router-dom';
import {
  FormGroup,
  HelpBlock,
  ControlLabel,
  FormControl,
  Button
} from 'react-bootstrap';
import "./Write.scss";

export default class Write extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.savePost = this.savePost.bind(this);
    this.state = {
      key: "",
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
    return;
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
    if (this.state.content === "") {
      alert("내용을 입력하세요");
      return;
    }

    this.state.key = shortid.generate();
    if(this.state.title === ""){
      this.state.title = this.state.content.substr(0,7);
    }
    this.state.title = this.state.title.trim();
    this.state.writer = this.state.writer.trim();
    this.state.content = this.state.content.trim();
    this.state.date = Date.now();

    tp.api.addPost(this.state).then(res => {
      console.log("# " + res.message);
      tp.store.dispatch(addPost(this.state));
      this.props.history.push("/post/" + this.state.key);
    });
  }


  render() {
    console.log("Write 렌더링..");
    return (
        <div className="write">
            <FormGroup  controlId = "title" validationState = {this.getValidationState()}>
                {/*<ControlLabel> Title </ControlLabel>*/}
                <FormControl type = "text"
                        autoFocus value = {this.state.title}
                        onChange = {this.handleChange}
                        placeholder = "Title.." />
                <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId = "writer" >
                {/*<ControlLabel> Writer </ControlLabel> */}
                <FormControl type = "text"
                      value = {this.state.writer}
                      onChange = {this.handleChange}
                      placeholder = "Writer.." />
            </FormGroup>
            <FormGroup controlId = "content">
                {/*<ControlLabel> Content </ControlLabel>*/}
                <FormControl className="content"
                        value = {this.state.content}
                        onChange = {this.handleChange}
                        componentClass = "textarea"
                        placeholder = "Content.." />
            </FormGroup>
            <Button bsStyle = "success" onClick = {this.savePost}>Save</Button>
            <Link to="/list"><Button className="write-cancel-btn" bsStyle="success">Cancel</Button></Link>
        </div>
    );
  }
}
