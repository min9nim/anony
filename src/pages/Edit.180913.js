import React from "react";
import {tp} from "../tp";
import { Link } from "react-router-dom";
import {
  FormGroup,
  Checkbox,
  FormControl,
  Button
} from "react-bootstrap";
import "./Edit.scss";

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.savePost = this.savePost.bind(this);
    
    if(tp.store.getState().data.posts.length > 0){
        // 글보기화면이나 목록화면에서 넘어 들어온 경우
        //this.state = this.props.post;
        this.state = tp.store.getState().data.posts.find(post => post.key === this.props.postKey);
        this.state.uuid = tp.user.uuid;
        if(this.state.origin !== undefined){
          tp.alert({
            message: "Invalid access!",
            style: "danger",
          });
          history.back();
        }
    }else{
      // URL로 직접 들어온 경우
      tp.api.getPost(this.props.postKey).then(res => {
          this.state = res.post;
          this.state.uuid = tp.user.uuid;  
          tp.store.dispatch(tp.action.addPost(res.post));
      });
    }
    this.unsubscribe = tp.store.subscribe(() => {
      console.log("Edit가 store 상태변경 노티 받음")
      this.setState(tp.store.getState().data.posts.find(post => post.key === this.props.postKey));
    });

  }
  
  componentWillUnmount(){
    console.log("# Edit unsubscribe store..");
    this.unsubscribe();
  }


  componentDidMount(){
    document.title = this.state.context + " - " + tp.thispage;
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
    if (tp.$m.removeTag(this.state.content).trim() === "") {
      tp.alert("Content is empty");
      return;
    }


    const tagRemovedContent = tp.$m.removeTag(this.state.content).trim();
    const tagRemovedTitle = tp.$m.removeTag(this.state.title).trim();

    const afterPost = {
      key : this.state.key,
      title : tagRemovedTitle === "" ? tagRemovedContent.trim().substr(0,20) : tagRemovedTitle,
      writer : this.state.writer.trim(),
      content : this.state.content.trim(),
      date : Date.now(),
      isPrivate : this.state.isPrivate,
      isMarkdown : this.state.isMarkdown,
      hasComment : this.state.hasComment,
      viewCnt : this.state.viewCnt,
      likeCnt : this.state.likeCnt,
      uuid : tp.user.uuid,
      context : this.state.context
    };

    tp.api.updatePost(afterPost).then(res => {
      if(res.status === "Fail"){
        //tp.alert(JSON.stringify(res, null, 2));
        tp.alert({
          message: res.message,
          style: "danger",
        });

        return;
      }
      console.log("# " + res.message);
      //if(tp.view.App.state.data.posts.length > 0){
      if(tp.store.getState().data.posts.length > 0){
        tp.store.dispatch(tp.action.updatePost(afterPost));
      }
      
      // 사용자 정보 업데이트
      tp.setUser({writer : afterPost.writer});

      // 작성된 글 바로 확인
      this.props.history.push("/" + this.state.context + "/post/" + afterPost.key);


    });
  }


  render() {
    console.log("Write 렌더링..");

    if(!this.state) return <div/>;

    const contentStyle = {
      height: tp.isDesktop() ? (window.innerHeight - 170) + "px" : (window.innerHeight - 400) + "px",   // 핸드폰의 키보드 높이만큼 줄임
      fontSize: this.state.isMarkdown ? "15px" : "20px"
    }    

    return (
        <div className="edit">
            <FormGroup  controlId = "title" validationState = {this.getValidationState()}>
                {/*<ControlLabel> Title </ControlLabel>*/}
                <FormControl type = "text"
                        value = {this.state.title}
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
                <Checkbox onChange={this.handleChange} id="isMarkdown" checked={this.state.isMarkdown}>Markdown</Checkbox>                       
                <Checkbox onChange={this.handleChange} id="isPrivate" checked={this.state.isPrivate}>Private</Checkbox> 
                <Checkbox onChange={this.handleChange} id="hasComment" checked={this.state.hasComment}>Comment</Checkbox> 
            </FormGroup>
            <FormGroup controlId = "content">
                {/*<ControlLabel> Content </ControlLabel>*/}
                <FormControl style={contentStyle}
                        autoFocus
                        value = {this.state.content}
                        onChange = {this.handleChange}
                        componentClass = "textarea"
                        placeholder = "Content.." />
            </FormGroup>
            <Button bsStyle = "success" onClick = {this.savePost}>Save</Button>
            <Link to={"/" + this.state.context + "/post/"+this.state.key}><Button className="write-cancel-btn" bsStyle="success">Cancel</Button></Link>
        </div>
    );
  }
}
