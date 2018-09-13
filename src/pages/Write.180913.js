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
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.savePost = this.savePost.bind(this);
    this.cancel = this.cancel.bind(this);
    this.refreshUuid = this.refreshUuid.bind(this);
    this.deleteUuid = this.deleteUuid.bind(this);
    this.deleteContext = this.deleteContext.bind(this);
    this.deleteTitle = this.deleteTitle.bind(this);
    this.deleteWriter = this.deleteWriter.bind(this);
    this.toggleAdvancedOpt = this.toggleAdvancedOpt.bind(this);
    
    this.state = {
      key: "",
      title: "",
      writer: tp.user.writer,
      content: "",
      date : "",
      isPrivate: false,
      isMarkdown: tp.user.isMarkdown === undefined ? false : tp.user.isMarkdown,
      hasComment: tp.user.hasComment === undefined ? true : tp.user.hasComment,
      uuid : tp.user.uuid,
      context : this.props.context ? this.props.context : "public",
      
      
      advancedOptCliked : false,
      autoTitle : true
    };

    tp.view.Write = this;
    //this.contextPath = this.props.context ? "/" + this.props.context : "" ;
  }

  shouldComponentUpdate(nextProps, prevState) {
    return nextProps !== this.state;
  }

  componentDidMount(){
    document.title = this.props.context + " - " + tp.thispage;
  }

  toggleAdvancedOpt(){
    this.setState({advancedOptCliked : !this.state.advancedOptCliked});
  }

  cancel(){
    if(this.state.content.length > 10 && !confirm("Cancel to write?")){
      return;
    }
    //this.props.history.push(this.state.context ? "/" + this.state.context : "" + "/list");
    // 글보기에서 글쓰기로 들어온 경우나 글목록에서 글쓰기로 들어온 경우라면 이전 페이지로 보내는 것이 적절함
    
    if(location.pathname === "/"){
    // 주소창에 서비스주소 입력해서 직접 들어온 경우
      this.props.history.push("/public/list");
    }else{
      history.back();
    }

  }

  handleChange(e) {
    if(e.target.id === "uuid" && e.target.value.length > tp.MAXUUIDLEN) return;
    if(e.target.id === "context" && e.target.value.length > tp.MAXCONTEXTLEN) return;
    if(e.target.id === "title"){
      this.state.autoTitle = false;
    }

    if(
      (this.state.autoTitle || this.state.title === "") && e.target.id === "content"
    ){
      if(e.target.value.length <= tp.MAXTITLELEN){
        this.state.title = e.target.value;
      }else{
        this.state.title = e.target.value.substr(0, tp.MAXTITLELEN);
        this.state.autoTitle = false;
      }
    }

    

    const state = {};
    state[e.target.id] = e.target.getAttribute("type")==="checkbox" ? e.target.checked : e.target.value ;
    this.setState(state);
  }

  refreshUuid(){
    this.setState({uuid: shortid.generate()});
  }

  deleteUuid(){
      this.setState({uuid: ""});
      this.uuidinput.focus();
  }  
  deleteContext(){
    this.setState({context: ""});
    this.contextinput.focus();
  }  
  deleteTitle(){
    this.setState({title: ""});
    this.titleinput.focus();
  }  
  deleteWriter(){
    this.setState({writer: ""});
    this.writerinput.focus();
  }   
  savePost() {
    if (tp.$m.removeTag(this.state.content).trim() === "") {
      tp.alert({
        message: "Content is empty",
        style: "warning",
        width: "173px",
        onClose: () => {this.contentinput.focus();}
      });
      return;
    }

    if (tp.$m.removeTag(this.state.context).trim() === "") {
      tp.alert({
        message: "Channel is empty",
        style: "warning",
        width: "176px",
        onClose: () => {this.contextinput.focus();}
      });
      return;
    }  

    if (tp.$m.removeTag(this.state.uuid).trim() === "") {
      tp.alert({
        message: "Uuid is empty",
        style: "warning",
        width: "173px",
        onClose: () => {this.uuidinput.focus();}
      });
      this.uuidinput.focus();

      return;
    }

    tp.setUser(this.state.uuid);
    

    const tagRemovedContent = tp.$m.removeTag(this.state.content).trim();
    const tagRemovedTitle = tp.$m.removeTag(this.state.title).trim();


    const newPost = {
      key : shortid.generate(),
      title : tagRemovedTitle === "" ? tagRemovedContent.substr(0,tp.MAXTITLELEN) : tagRemovedTitle,
      writer : this.state.writer.trim(),
      content : this.state.content.trim(),
      date : Date.now(),
      isPrivate : this.state.isPrivate,
      isMarkdown : this.state.isMarkdown,
      hasComment : this.state.hasComment,
      uuid : tp.user.uuid,
      context : this.state.context,
      commentCnt : 0,
    };

    tp.api.addPost(newPost).then(res => {
      console.log("# " + res.message);
      //if(tp.view.App.state.data.posts.length > 0){

      
      if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length > 0){
        if(tp.store.getState().data.posts[0].context !== res.output.context){
          // 다른 채널에 신규 글을 등록했다면 이전에 store에 등록된 posts 목록은 초기화
          tp.store.dispatch(tp.action.initPosts());
        }
        tp.store.dispatch(tp.action.addPost(res.output));
      }else{
        // write 화면으로 직접 접근해서 저장하는 경우에는 store에 새글을 추가를 하지 않아도 문제되지 않음
      }
      
      // 사용자 정보 업데이트
      tp.setUser({writer : newPost.writer, hasComment : newPost.hasComment, isMarkdown: newPost.isMarkdown});

      // 작성된 글 바로 확인
      //this.props.history.push(this.contextPath + "/post/" + newPost.key);
      this.props.history.push("/" + this.state.context + "/post/" + newPost.key);
    });
  }


  render() {
    console.log("Write 렌더링..");

    const contentStyle = {
      height: tp.isDesktop() ? (window.innerHeight - 200) + "px" : (window.innerHeight - 400) + "px",   // 핸드폰의 키보드 높이만큼 줄임
      fontSize: this.state.isMarkdown ? "15px" : "20px"
    }

    const advancedOptIcon = this.state.advancedOptCliked ? "icon-folder-open-empty" : "icon-folder-empty" ;

    return (
        <div className="write">
            {/* <div className="context">{this.props.context || "Anony"}</div> */}
            <FormGroup  className="form_title">
                {/*<ControlLabel> Title </ControlLabel>*/}
                <FormControl type = "text"
                        id="title"
                        value = {this.state.title}
                        onChange = {this.handleChange}
                        inputRef={ref => { this.titleinput = ref; }}
                        placeholder = "Title.." />
                {this.state.title && <div className="icon-cancel delete" onClick={this.deleteTitle} title="Delete title" /> }
            </FormGroup>
            <FormGroup className="form_writer" >
                <FormControl type = "text" className="writer" id="writer"
                      value = {this.state.writer}
                      onChange = {this.handleChange}
                      inputRef={ref => { this.writerinput = ref; }}
                      placeholder = "Writer.." />
                {this.state.writer &&
                  <div className="icon-cancel delete" onClick={this.deleteWriter} title="Delete writer" />
                }

                <div className={advancedOptIcon + " options"} onClick={this.toggleAdvancedOpt}> advanced options</div>
            </FormGroup>
            {
              this.state.advancedOptCliked &&
              <React.Fragment>
                <FormGroup className="form_context">
                  <FormControl type = "text" className="context" id="context"
                              value = {this.state.context}
                              onChange = {this.handleChange}
                              inputRef={ref => { this.contextinput = ref; }}
                              placeholder = "Channel.." />
                  {this.state.context && <div className="icon-cancel delete" onClick={this.deleteContext} title="Delete channel" />}

                </FormGroup>
                <FormGroup className="form_uuid">
                  <FormControl type = "text" className="uuid" id="uuid"
                              value = {this.state.uuid}
                              inputRef={ref => { this.uuidinput = ref; }}
                              onChange = {this.handleChange}
                              placeholder = "Uuid.." >                          
                  </FormControl>
                  <div className="group_icon">
                    <div className="icon-spin3 refresh" onClick={this.refreshUuid} title="Generate random uuid"/>
                    {this.state.uuid &&
                      <div className="icon-cancel delete" onClick={this.deleteUuid} title="Delete uuid" />
                    }
                  </div>
                </FormGroup>
                <FormGroup className="form_chk">
                  <Checkbox onChange={this.handleChange} id="isMarkdown" checked={this.state.isMarkdown} title="If you check markdown, you can use markdown syntax">Markdown</Checkbox> 
                  <Checkbox onChange={this.handleChange} id="isPrivate" checked={this.state.isPrivate} title="If you check private, the article is not exposed on the list. You can only access the URL directly. If you need to access it again, please keep the post URL separately.">Private</Checkbox> 
                  <Checkbox onChange={this.handleChange} id="hasComment" checked={this.state.hasComment} title="If you check comment, you can get comments from others">Comment</Checkbox> 
                  </FormGroup>

              </React.Fragment>
            }
            <FormGroup controlId = "content">
                {/*<ControlLabel> Content </ControlLabel>*/}
                <FormControl style={contentStyle}
                        autoFocus
                        inputRef={ref => { this.contentinput = ref; }}
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
