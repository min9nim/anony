import React from 'react';
import {tp} from "../tp";
import {deletePost, viewMode} from "../redux/action";
import moment from "moment";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Post.scss";

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
        moment.locale('ko');
    }

    shouldComponentUpdate(prevProps, prevState) {
        console.log("Post shouldComponentUpdate called..");
        // 여기는 setState 나 props 가 바뀔 때만 호출되는 듯
        // 화면 최초 로딩시에는 무조건 한번은 렌더링이 되게 되어있는 듯 하다. 업데이트할지 말지에 대한 부분이니까.. 맞네.. 18/06/08
        return prevProps !== this.props
    }

    deletePost(){
        if(confirm("이 글을 삭제합니다")){
            tp.dispatch(deletePost(this.props.post.key));
            //this.props.history.push("/list");
            history.back();
        }
    }

    render(){
        console.log("Post 렌더링,,");
        if(this.props.post === undefined){
            // 최초 렌더링 시에는 post 가 undefined 이므로 예외처리
            return <div/>
        }
        const html = this.props.post.content.replace(/\n/g, "<br>");
        return (
            <div className="post">
                <div>
                    <div className="title h4">{this.props.post.title}</div>
                    <div className="delete" onClick={this.deletePost}>~</div>
                </div>
                <div className="meta">{this.props.post.writer} - {moment(this.props.post.date).format('MM/DD/YYYY dd HH:mm:ss')}</div>
                <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
                <Link to="/list"><Button bsStyle="success">List</Button></Link>
                <Link to="/write"><Button bsStyle="success">Write</Button></Link>
            </div>
        );
    }
}
