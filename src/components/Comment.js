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

    shouldComponentUpdate(prevProps, prevState) {
        // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
        //console.log("Comment.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deleteComment(){
        if(confirm("delete this comment?")){
            tp.api.deleteComment({
                key: this.state.key,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    tp.alert(res.message);
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
                <div className={this.state.deleted ? "content deleted" : "content"}>{html}</div>
            </div>
        );
    }
}
