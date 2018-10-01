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
      optClicked : false,
      autoTitle : this.props.type === "edit" ? false : true
    };

    if(this.props.type === "edit"){
      this.initializeInEdit();
    }
  }


  initializeInEdit(){
    if(tp.store.getState().data.posts.length > 0){
        // 글보기화면이나 목록화면에서 넘어 들어온 경우
        //this.state = this.props.post;
        this.state = tp.store.getState().data.posts.find(post => post.key === this.props.postKey);
        this.state.uuid = tp.user.uuid;
        /**
         * 18.09.13
         * min9nim
         * 정상적인 접근 방법으로는 아래 분기로직으로 진입이 불가능하기에 아래 주석처리함
         */
        // if(this.state.origin !== undefined){

        //   tp.alert({
        //     message: "Invalid access!",
        //     style: "danger",
        //     onClose: history.back
        //   });
        // }
    }else{
      // URL로 직접 들어온 경우
        tp.api.getPost(this.props.postKey).then(res => {
            //this.state = res.post;
            
            /**
             * 18.09.13
             * min9nim
             * 어짜피 아래 스토어 갱신에 따라 setState가 호출될 것이기 때문에 위 문장 필요없음
             */
            this.state.uuid = tp.user.uuid; // uuid 는 res.post 에 포함되어 있지 않다
            tp.store.dispatch(tp.action.addPost(res.post));
        });
    }
    
    this.unsubscribe = tp.store.subscribe(() => {
        console.log("Edit가 store 상태변경 노티 받음");
        if(this.state.key === ""){
          // URL로 직접 들어온 경우에만 this.setState가 필요
          this.setState(tp.store.getState().data.posts.find(post => post.key === this.props.postKey));
        }else{
          /**
           * 18.09.13
           * min9nim
           * 여기서 this.setState 를 하게 되면,
           * 글 수정후 저장시 tp.setUser() 에 의해 store가 갱신되고
           * 이때 잠시 수정 전 글이 잠깐 원복되어져 보이게 되는 문제가 발생할 수 있어서 분기처리함
           */
        }
        
    });      
  }

  componentWillUnmount(){
    if(this.props.type === "edit"){
      console.log("# Edit unsubscribe store..");
      this.unsubscribe();  
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.type === "edit" && nextState.origin !== undefined){
      // 히스토리 글을 수정하려고 하는 경우
      alert("Invalid access!");
      //history.back();
      /**
       * 18.09.13 min9nim
       * history.back() 를 사용하면 alert 가 연속으로 두세번 호출되는 문제가 있어서 그냥 아래와 같이 페이지 이동 처리
       */
      nextProps.history.push("/public/list");
      return false;

      // tp.alert({
      //   message: "Invalid access!",
      //   style: "danger",
      //   onClose: history.back
      // });
    }

    return nextState !== this.state;
  }

  getValidationState() {
    let uuid = tp.$m.removeTag(this.state.uuid).trim();
    const length = uuid.length;
    if (shortid.isValid(this.state.uuid) && length >= 9) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  componentDidMount(){
    document.title = this.props.context + " - " + tp.thispage;
  }

  toggleAdvancedOpt(){
    this.setState({optClicked : !this.state.optClicked});
  }

  cancel(){
    if(this.props.type === "edit"){
      // 글수정시 취소 버튼 클릭하면 글보기 화면으로 이동
      var arr = location.pathname.split("/");
      arr.splice(arr.indexOf("edit"), 1, "post");
      this.props.history.push(arr.join("/"));
    }else{
      // in Write
      if(this.state.content.length > 10){
        tp.confirm({
          message : "Cancel to write?",
          style : "danger",
          width : "170px",
          onYes : () => {            
            if(location.pathname === "/"){
              // 주소창에 서비스주소 입력해서 직접 들어온 경우
                this.props.history.push("/public/list");
              }else{
                history.back();
              }
          },
        });
      }else{
        if(location.pathname === "/"){
          // 주소창에 서비스주소 입력해서 직접 들어온 경우
            this.props.history.push("/public/list");
        }else{
          history.back();
        }
      }
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
    if(this.props.type==="edit"){
      // not allowed
    }else{
      this.setState({uuid: shortid.generate()});
    }
  }

  deleteUuid(){
    if(this.props.type==="edit"){
      // not allowed
    }else{
      this.setState({uuid: ""});
      this.uuidinput.focus();
    }
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

      return;
    }

    if(this.getValidationState() !== "success"){
      tp.alert({
        message: "Invalid uuid", 
        style: "warning", 
        width: "152px",
        onClose: () => {this.uuidinput.focus();}
      });
      return;
    }


    
    const tagRemovedContent = tp.$m.removeTag(this.state.content).trim();
    const tagRemovedTitle = tp.$m.removeTag(this.state.title).trim();

    let post = {
      title : tagRemovedTitle === "" ? tagRemovedContent.substr(0,tp.MAXTITLELEN) : tagRemovedTitle,
      writer : this.state.writer.trim(),
      content : this.state.content.trim(),
      date : Date.now(),
      isPrivate : this.state.isPrivate,
      isMarkdown : this.state.isMarkdown,
      hasComment : this.state.hasComment,
      uuid : tp.user.uuid,
      context : this.state.context
    }


    // 사용자 정보 업데이트
    tp.setUser({
      uuid: this.state.uuid,
      writer : post.writer,
      hasComment : post.hasComment, 
      isMarkdown: post.isMarkdown
    });

    if(this.props.type === "edit"){
      Object.assign(post, {
        key : this.state.key,
        viewCnt : this.state.viewCnt,
        likeCnt : this.state.likeCnt,
        commentCnt : this.state.commentCnt,
      });
  
      tp.api.updatePost(post).then(res => {
        if(res.status === "Fail"){
          tp.alert({
            message: res.message,
            style: "danger",
          });
          return;
        }
        //if(tp.view.App.state.data.posts.length > 0){
        if(tp.store.getState().data.posts.length > 0){
          tp.store.dispatch(tp.action.updatePost(post));
        }

        // 작성된 글 바로 확인
        this.props.history.push("/" + this.state.context + "/post/" + post.key);
        
        
      });  
    }else{
      Object.assign(post, {
        key : shortid.generate(),
        viewCnt : 0,
        likeCnt : 0,
        commentCnt : 0,
      });
  
      tp.api.addPost(post).then(res => {
        if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length > 0){
          if(tp.store.getState().data.posts[0].context !== res.output.context){
            // 다른 채널에 신규 글을 등록했다면 이전에 store에 등록된 posts 목록은 초기화
            tp.store.dispatch(tp.action.initPosts());
          }
          tp.store.dispatch(tp.action.addPost(res.output));
        }else{
          // write 화면으로 직접 접근해서 저장하는 경우에는 store에 새글을 추가를 하지 않아도 문제되지 않음
        }

        // 작성된 글 바로 확인
        this.props.history.push("/" + this.state.context + "/post/" + post.key);
        
      });  
    }

  }


  render() {
    console.log("Write 렌더링..");


    /**
     * 18.09.20 min9nim
     * 안드로이드(G6) 크롬&파폭일 경우 예외처리 추가
     */
    let height =  ( tp.isDesktop() || navigator.userAgent.match(/android/i) )
                  ?
                    //(window.innerHeight - 200) + "px"
                    /**
                     * 18.10.01 min9nim
                     * options 버튼 클릭시 스크롤이 생기는 문제 때문에 높이 를 아래와 같이 조정
                     */
                    (window.innerHeight - 250) + "px"
                  :
                    (window.innerHeight - 400) + "px";


    const contentStyle = {
      height,   // 핸드폰의 키보드 높이만큼 줄임
      fontSize: this.state && this.state.isMarkdown ? "15px" : "20px"
    }

    const optIcon = this.state.optClicked ? "icon-folder-open-empty" : "icon-folder-empty" ;

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

                <div className={optIcon + " options"} onClick={this.toggleAdvancedOpt}> options</div>
            </FormGroup>
            {
              this.state.optClicked &&
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
                              disabled = {this.props.type === "edit"}
                              inputRef={ref => { this.uuidinput = ref; }}
                              onChange = {this.handleChange}
                              placeholder = "Uuid.." >                          
                  </FormControl>
                  <div className="group_icon">
                    <div style={this.props.type==="edit" ? {cursor: "not-allowed"} : {cursor: "pointer"}}
                        className="icon-spin3 refresh"
                        onClick={this.refreshUuid}
                        title="Generate random uuid"/>
                    {this.state.uuid &&
                      <div style={this.props.type==="edit" ? {cursor: "not-allowed"} : {cursor: "pointer"}} 
                        className="icon-cancel delete" 
                        onClick={this.deleteUuid} 
                        title="Delete uuid" />
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
            <div className="help-wrapper">
              <a href="/public/post/BylrBddOOm"><div className="icon-help-circled help">How to use</div></a>
            </div>
        </div>
    );
  }
}
