import React from 'react';
import {tp} from "../tp";
import moment from "moment";
import {PostMenu, CommentWrite} from "../components";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Post.scss";

export default class Post extends React.Component {
    constructor(props) {
        console.log("Post 생성자 호출");
        super(props);
        this.state = {
            key: "",
            title: "",
            writer: "",
            content: "",
            date : "",
            uuid : ""
          };
        this.deletePost = this.deletePost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
        console.log("Post.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deletePost(){
        if(confirm("이 글을 삭제합니다")){
            tp.api.deletePost({
                key: this.state.key,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "fail") {
                    alert(res.message);
                } else {
                    tp.store && tp.store.dispatch(tp.action.deletePost(this.state.key));
                    //history.back();
                    this.props.history.push("/list");
                }
            })
        }
    }

    render(){
        console.log("Post 렌더링");
        if(this.props.post){
            // post 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.post
        }
        
        if([null, undefined].includes(this.state) || this.state.menu){
            // 최초 렌더링 시에는 post 가 undefined 이므로 예외처리
            const key = location.pathname.split("/")[2];
            tp.api.getPost(key).then(res => {
                this.setState(res.posts[0]);
            });
            return <div/>
        }

        //const html = this.state.content.replace(/\n/g, "<br>");
        const html = tp.$m.txtToHtml(this.state.content)

        return (
            <div>
                <div className="post">
                    <div>
                        <div className="title h4">{this.state.title}</div>
                        <PostMenu history={this.props.history} postKey={this.state.key}/>
                    </div>
                    <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}</div>
                    <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
                    <Link to="/list"><Button bsStyle="success" className="listBtn">List</Button></Link>
                    <Link to="/write"><Button bsStyle="success" className="writeBtn">Write</Button></Link>
                </div>
                <Comment postKey={this.state.key} />
            </div>
        );
    }
}
