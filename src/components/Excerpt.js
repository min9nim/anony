import React from 'react';
import {tp} from "../tp";
import {deletePost} from "../action";

export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    deletePost(){
        if(confirm("선택 항목을 삭제합니다")){
            tp.dispatch(deletePost(this.props.post.key));
        }
    }

    render(){
        console.log("Excerpt rendering");
        return (
            <div id={this.props.post.key} className="excerpt">
                <div><div className="title h4">{this.props.post.title}</div><div className="delete" onClick={this.deletePost}>x</div></div>
                <div className="meta">{this.props.post.writer} - {new Date(this.props.post.date).toString().substr(4, 17)}</div>
                <div>{this.props.post.content}</div>
            </div>
        );
    }
}
