import React from 'react';
import {tp} from "../tp";
import {deletePost, viewMode} from "../redux/action";
import moment from "moment";
import {Button} from 'react-bootstrap';
import "./Post.scss";

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
        this.goList = this.goList.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    deletePost(){
        if(confirm("이 글을 삭제합니다")){
            tp.dispatch(deletePost(this.props.post.key));
            this.goList();
        }
    }

    goList() {
        tp.dispatch(viewMode({mode: "list"}));
    }    

    render(){
        console.log("Excerpt rendering");
        const html = this.props.post.content.replace(/\n/g, "<br>");
        return (
            <div className="post">
                <div>
                    <div className="title h4">{this.props.post.title}</div>
                    <div className="delete" onClick={this.deletePost}>...</div>
                </div>
                <div className="meta">{this.props.post.writer} - {moment(this.props.post.date).fromNow()}</div>
                <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
                <Button bsStyle="success" onClick={this.goList}>List</Button>
            </div>
        );
    }
}
