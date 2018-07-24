import React from 'react';
import {tp} from "../tp";
import "./PostMeta.scss";

export default class PostMeta extends React.Component {
    constructor(props) {
        console.log("PostMeta 생성자 호출");
        super(props);
        this.likePost = this.likePost.bind(this);
    }

    likePost(){
        if(this.props.post.liked){
            tp.api.cancelLike(this.props.post.key)
                .then(res => {
                    tp.store.dispatch(tp.action.updatePost(res.output));
                })
        }else{
            tp.api.likePost(this.props.post.key)
                .then(res => {
                    tp.store.dispatch(tp.action.updatePost(res.output));
                })
        }
    }

    render(){
        console.log("PostMeta 렌더링");
        return (
            <div className="postMeta">
                <div>Comments: {this.props.post.commentCnt || 0}</div>
                <div>View: {this.props.post.viewCnt || 0} </div>
                <div className={this.props.post.liked ? "liked" : "like"} onClick={this.likePost}>Like: {this.props.post.likeCnt} </div>
            </div>
        );
    }
}
