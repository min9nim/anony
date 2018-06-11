import React from 'react';
import {tp} from "../tp";
import {deletePost, viewMode} from "../redux/action";
import moment from "moment";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Post.scss";

export default class Post extends React.Component {
    constructor(props) {
        console.log("Post 생성자 호출");
        super(props);
        this.deletePost = this.deletePost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
        console.log("Post.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deletePost(){
        if(confirm("이 글을 삭제합니다")){
            tp.dispatch(deletePost(this.props.post.key));
            //this.props.history.push("/list");
            history.back();
        }
    }

    render(){
        console.log("Post 렌더링");
        if(this.props.post){
            // post 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.post
        }
        
        if([null, undefined].includes(this.state)){
            // 최초 렌더링 시에는 post 가 undefined 이므로 예외처리
            const key = location.pathname.split("/")[2];
            tp.api.getPost(key).then(res => {
                this.setState(res.posts[0]);
            });
            return <div/>
        }


        const html = this.state.content.replace(/\n/g, "<br>");
        return (
            <div className="post">
                <div>
                    <div className="title h4">{this.state.title}</div>
                    <div className="delete" onClick={this.deletePost}>~</div>
                </div>
                <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD/YYYY dd HH:mm:ss')}</div>
                <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
                <Link to="/list"><Button bsStyle="success">List</Button></Link>
                <Link to="/write"><Button bsStyle="success">Write</Button></Link>
            </div>
        );
    }
}
