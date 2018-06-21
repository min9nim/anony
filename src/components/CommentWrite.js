import React from 'react';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    Button
} from 'react-bootstrap';  
import shortid from "shortid";
import "./CommentWrite.scss";


export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.saveComment = this.saveComment.bind(this);


        this.state = {
            key: "",                    // key
            writer: tp.user.writer,     // 작성자
            content: "",                // 내용
            uuid: tp.user.uuid,         // uuid
            postKey: this.props.postKey,// 부모 포스트 id
            commentKey: "",              // 부모 코멘트 id
            date: ""                   // 작성시간
        }
    }

    shouldComponentUpdate(prevProps, prevState) {
        return true;
    }

    handleChange(e) {
        let state = {};
        state[e.target.id] = e.target.value;
        this.setState(state);
        
        if(e.target.id === "content"){
            // https://zetawiki.com/wiki/HTML_textarea_자동_높이_조절
            e.target.style.height = (2+e.target.scrollHeight)+"px";        
        }
    }

    saveComment(){
        if (this.state.content === "") {
            alert("내용을 입력하세요");
            return;
          }
      
          const newComment = {
            key : shortid.generate(),
            writer : this.state.writer.trim(),
            content : this.state.content.trim(),
            uuid: this.state.uuid,
            postKey: this.state.postKey,
            date : Date.now(),
            uuid : tp.user.uuid,
            commentKey : ""
          };
      
          tp.api.addComment(newComment).then(res => {
            console.log("# " + res.message);


            tp.store.dispatch(tp.action.addComment(newComment));
            // 부모post의 댓글 카운트 1증가            
            let post = tp.store.getState().data.posts.find(p => p.key === this.state.postKey);
            post.commentCnt = post.commentCnt ? post.commentCnt + 1 : 1 ;
            tp.store.dispatch(tp.action.updatePost(post));
            this.setState({content: ""});       // 기존 입력한 내용 초기화
            tp.setUser({writer : newComment.writer});    // 사용자 정보 업데이트

            document.getElementById("content").style.height = "";   // 댓글 입력 textarea 높이 초기화
      
          });
    }
      
    render(){
        console.log("Comment 렌더링..");
        return (
            <div className="comment-write">
                <div className="writer">
                    <FormControl id="writer" 
                        value = {this.state.writer}
                        onChange = {this.handleChange}
                        placeholder = "Writer.." />
                </div>
                <div className="content">
                    <FormControl id="content"
                        value = {this.state.content}
                        onChange = {this.handleChange}
                        componentClass = "textarea"
                        placeholder = "Comment.." />
                </div>
                <div className="confirmBtn">
                    <Button bsStyle="success" onClick={this.saveComment}>Confirm</Button>
                </div>
            </div>
        );
    }
}