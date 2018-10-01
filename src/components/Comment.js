import React from "react";
import {tp} from "../tp";
import moment from "moment";
import {CommentMenu} from "../components";

import "./Comment.scss";

export default class Comment extends React.Component {
    constructor(props) {
        console.log("Comment 생성자 호출");
        super(props);
        this.state = {
            key: "",
            writer: "",
            content: "",
            date: "",
            uuid: "",
            postKey: ""
          };
        this.deleteComment = this.deleteComment.bind(this);
    }


    deleteComment(){
        if(confirm("delete this comment?")){
            tp.api.deleteComment({
                key: this.state.key,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    tp.alert({
                        message: res.message,
                        style: "danger"
                    });
                } else {
                    tp.store && tp.store.dispatch(tp.action.deleteComment(this.state.key));
                    //history.back();
                    this.props.history.push("/list");
                }
            })
        }
    }

    render(){
        console.log("Comment 렌더링");
        if(this.props.comment){
            // Comment 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.comment
        }

        const html = tp.$m.txtToHtml(this.state.content)

        return (
            <div className="comment">
                <div>
                    <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD dd HH:mm')}</div>
                    <CommentMenu comment={this.state}/>
                </div>
                {/*댓글에서 새줄표시 <br> 처리하기 위해 html을 사용할 수 있어야 함*/}
                <div className={this.state.deleted ? "content deleted" : "content"}  dangerouslySetInnerHTML={{__html: html}} />
            </div>
        );
    }
}
