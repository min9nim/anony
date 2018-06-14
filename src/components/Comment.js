import React from 'react';
import {tp} from "../tp";
import moment from "moment";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Comment.scss";

export default class Comment extends React.Component {
    constructor(props) {
        console.log("Comment 생성자 호출");
        super(props);
        this.state = {
            key: "",
            title: "",
            writer: "",
            content: "",
            date : "",
            uuid : ""
          };
        this.deleteComment = this.deleteComment.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
        console.log("Comment.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deleteComment(){
        if(confirm("이 글을 삭제합니다")){
            tp.api.deleteComment({
                key: this.state.key,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "fail") {
                    alert(res.message);
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
        if(this.props.Comment){
            // Comment 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.Comment
        }
        
        if([null, undefined].includes(this.state) || this.state.menu){
            // 최초 렌더링 시에는 Comment 가 undefined 이므로 예외처리
            const key = location.pathname.split("/")[2];
            tp.api.getComment(key).then(res => {
                this.setState(res.Comments[0]);
            });
            return <div/>
        }

        //const html = this.state.content.replace(/\n/g, "<br>");
        const html = tp.$m.txtToHtml(this.state.content)

        return (
            <div>
                <div className="Comment">
                    <div>
                        <div className="title h4">{this.state.title}</div>
                        <CommentMenu history={this.props.history} CommentKey={this.state.key}/>
                    </div>
                    <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}</div>
                    <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
                    <Link to="/list"><Button bsStyle="success" className="listBtn">List</Button></Link>
                    <Link to="/write"><Button bsStyle="success" className="writeBtn">Write</Button></Link>
                </div>
                <Comment CommentKey={this.state.key} />
            </div>
        );
    }
}
