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
            if(tp.store){
              tp.store.dispatch(tp.action.addComment(newComment));
            }else{
              // write 화면으로 직접 접근해서 저장하는 경우에는 store에 새글을 추가를 하지 않아도 문제되지 않음
            }
            
            // 사용자 정보 업데이트
            tp.setUser({writer : newComment.writer});
      
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
