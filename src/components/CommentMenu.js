import React from 'react';
import {tp} from "../tp";
import "./CommentMenu.scss";

export default class CommentMenu extends React.Component {
    constructor(props) {
        console.log("CommentMenu 생성자 호출");
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.editComment = this.editComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.removeComment = this.removeComment.bind(this);

        this.state = {
            clicked : false
        }
    }

    shouldComponentUpdate(prevProps, prevState) {
        //console.log("CommentMenu.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deleteComment(){
        if(confirm("Delete this?")){
            tp.api.deleteComment({
                key: this.props.comment.key,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    alert(res.message);
                } else {
                    tp.store.dispatch(tp.action.deleteComment(this.props.comment.key));
                }
            })
        }
    }
    
    removeComment(){
        if(confirm("Remove this?")){
            tp.api.removeComment({
                key: this.props.comment.key,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    alert(res.message);
                } else {
                    tp.store.dispatch(tp.action.removeComment(this.props.comment.key));

                    // 부모 글의 commentCnt 1감소
                    const postKey = this.props.comment.postKey;
                    let post = tp.store.getState().data.posts.find(p => p.key === postKey);
                    post.commentCnt = post.commentCnt ? post.commentCnt -1 : 1 ;
                    tp.store.dispatch(tp.action.updatePost(post));
                }
            })
        }
    }    


    editComment(){
        tp.api.authComment({
            key: this.props.comment.key,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "Success"){
                tp.temp = res.comment;
                //this.props.history.push("/edit/"+this.props.comment.key);
            }else{
                alert(res.message);
            }
        })
    }    


    showMenu(){
        this.setState({
            clicked: true
        })
    }

    render(){
        console.log("CommentMenu 렌더링");
        return (<div className="commentMenu">{
                this.state.clicked ? 
                <div className="menu">
                    {
                        this.props.comment.deleted ? 
                        <div onClick={this.removeComment}>Remove</div> :
                        <div onClick={this.deleteComment}>Delete</div>
                    }
                </div>
                :
                <div className="menu" onClick={this.showMenu}>...</div>
                }</div>
        );
    }
}
