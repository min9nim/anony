import React from "react";
import shortid from "shortid";
import {tp} from "../tp";
import {
  FormGroup,
  Checkbox,
  FormControl,
  Button
} from "react-bootstrap";
import "./Write.scss";

export default class Write extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.savePost = this.savePost.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      key: "",
      title: "",
      writer: tp.user.writer,
      content: "",
      date : "",
      isPrivate: false,
      isMarkdown: false,
      hasComment: tp.user.hasComment === undefined ? true : tp.user.hasComment,
      uuid : tp.user.uuid
    };

    tp.view.Write = this;
    this.contextPath = this.props.context ? "/"+this.props.context : "" ;
  }

  shouldComponentUpdate(prevProps, prevState) {
    return prevState !== this.state;
  }

  componentDidMount(){
    document.title = (this.props.context || "Anony") + " - " + tp.thispage;
  }

  getValidationState() {
    return;
    const length = this.state.title.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  cancel(){
    if(this.state.content.length > 10 && !confirm("Cancel to write?")){
      return;
    }
    //this.props.history.push(this.contextPath + "/list");
    history.back();
  }

  handleChange(e) {
    const state = {};
    state[e.target.id] = e.target.getAttribute("type")==="checkbox" ? e.target.checked : e.target.value ;
    this.setState(state);
  }

  savePost() {
    if (tp.$m.removeTag(this.state.content).trim() === "") {
      tp.alert({message: "Content is empty", style: "warning", width: "173px"});

      return;
    }


    

    const tagRemovedContent = tp.$m.removeTag(this.state.content).trim();
    const tagRemovedTitle = tp.$m.removeTag(this.state.title).trim();


    const newPost = {
      key : shortid.generate(),
      title : tagRemovedTitle === "" ? tagRemovedContent.substr(0,20) : tagRemovedTitle,
      writer : this.state.writer.trim(),
      content : this.state.content.trim(),
      date : Date.now(),
      isPrivate : this.state.isPrivate,
      isMarkdown : this.state.isMarkdown,
      hasComment : this.state.hasComment,
      uuid : tp.user.uuid,
      context : this.props.context,
      commentCnt : 0,
    };

    tp.api.addPost(newPost).then(res => {
      console.log("# " + res.message);
      //if(tp.view.App.state.data.posts.length > 0){
      if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length > 0){
        tp.store.dispatch(tp.action.addPost(res.output));
      }else{
        // write 화면으로 직접 접근해서 저장하는 경우에는 store에 새글을 추가를 하지 않아도 문제되지 않음
      }
      
      // 사용자 정보 업데이트
      tp.setUser({writer : newPost.writer, hasComment : newPost.hasComment});

      // 작성된 글 바로 확인
      this.props.history.push(this.contextPath + "/post/" + newPost.key);
    });
  }


  render() {
    console.log("Write 렌더링..");

    const contentStyle = {
      height: tp.isDesktop() ? (window.innerHeight - 170) + "px" : (window.innerHeight - 400) + "px",   // 핸드폰의 키보드 높이만큼 줄임
      fontSize: this.state.isMarkdown ? "15px" : "20px"
    }

    return (
        <div className="write">
            <div className="context">{this.props.context || "Anony"}</div>
            <FormGroup  controlId="title" className="title" validationState = {this.getValidationState()}>
                {/*<ControlLabel> Title </ControlLabel>*/}
                <FormControl type = "text"
                        value = {this.state.title}
                        onChange = {this.handleChange}
                        placeholder = "Title.." />
                <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="writer" >
                {/*<ControlLabel> Writer </ControlLabel> */}
                <FormControl type = "text" className="writer"
                      value = {this.state.writer}
                      onChange = {this.handleChange}
                      placeholder = "Writer.." />
                <Checkbox onChange={this.handleChange} id="isMarkdown" checked={this.state.isMarkdown} title="If you check markdown, you can use markdown syntax">Markdown</Checkbox> 
                <Checkbox onChange={this.handleChange} id="isPrivate" checked={this.state.isPrivate} title="If you check private, the article is not exposed on the list. You can only access the URL directly. If you need to access it again, please keep the post URL separately.">Private</Checkbox> 
                <Checkbox onChange={this.handleChange} id="hasComment" checked={this.state.hasComment} title="If you check comment, you can get comments from others">Comment</Checkbox> 
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
            <Button bsStyle="success" onClick = {this.savePost}>Save</Button>
            <Button className="write-cancel-btn" bsStyle="success" onClick={this.cancel}>Cancel</Button>
        </div>
    );
  }
}
