import React from 'react';
import {tp} from "../tp";
import { Link } from 'react-router-dom';
import {
  FormGroup,
  Checkbox,
  FormControl,
  Button
} from 'react-bootstrap';
import "./Edit.scss";

export default class Edit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.savePost = this.savePost.bind(this);
    
    if(this.props.post){
      this.state = this.props.post;
      this.state.uuid = tp.user.uuid;
    }else{
      tp.api.getPost(this.props.postKey).then(res => {
        this.state = res.posts[0];
        this.state.uuid = tp.user.uuid;  
        tp.store.dispatch(tp.action.addPost(res.posts[0]));
    });

    }
    this.contextPath = this.props.context ? "/"+this.props.context : "" ;
  }

  shouldComponentUpdate(prevProps, prevState) {
    return true;
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
    const state = {};
    state[e.target.id] = e.target.getAttribute("type")==="checkbox" ? e.target.checked : e.target.value ;
    this.setState(state);
  }

  savePost() {
    if (this.state.content === "") {
      alert("내용을 입력하세요");
      return;
    }

    const afterPost = {
      key : this.state.key,
      title : this.state.title === "" ? this.state.content.trim().substr(0,17) : this.state.title.trim(),
      writer : this.state.writer.trim(),
      content : this.state.content.trim(),
      date : Date.now(),
      isPrivate : this.state.isPrivate,
      hasComment : this.state.hasComment,
      uuid : tp.user.uuid,
      context : this.state.context
    };

    tp.api.updatePost(afterPost).then(res => {
      if(res.status === "Fail"){
        alert(JSON.stringify(res, null, 2));
        return;
      }
      console.log("# " + res.message);
      if(tp.view.App.state.data.posts.length > 0){
        tp.store.dispatch(tp.action.updatePost(afterPost));
      }
      
      // 사용자 정보 업데이트
      tp.setUser({writer : afterPost.writer});

      // 작성된 글 바로 확인
      this.props.history.push(this.contextPath + "/post/" + afterPost.key);


    });
  }


  render() {
    console.log("Write 렌더링..");

    if(!this.state) return <div/>;

    return (
        <div className="edit">
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
                <FormControl type = "text" className="writer"
                      value = {this.state.writer}
                      onChange = {this.handleChange}
                      placeholder = "Writer.." />
                <Checkbox onChange={this.handleChange} id="isPrivate" checked={this.state.isPrivate}>Private</Checkbox> 
                <Checkbox onChange={this.handleChange} id="hasComment" checked={this.state.hasComment}>Comment</Checkbox> 
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
            <Link to={this.contextPath + "/post/"+this.state.key}><Button className="write-cancel-btn" bsStyle="success">Cancel</Button></Link>
        </div>
    );
  }
}
