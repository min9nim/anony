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
                key: this.props.commentKey,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    alert(res.message);
                } else {
                    tp.store.dispatch(tp.action.deleteComment(this.props.commentKey));
                    // 부모post의 댓글 카운트 1증가  
                    const postKey = location.pathname.split("/")[2];          
                    let post = tp.store.getState().data.posts.find(p => p.key === postKey);
                    post.commentCnt = post.commentCnt ? post.commentCnt -1 : 1 ;
                    tp.store.dispatch(tp.action.updatePost(post));
                }
            })
        }
    }


    editComment(){
        tp.api.authComment({
            key: this.props.commentKey,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "Success"){
                tp.temp = res.comment;
                //this.props.history.push("/edit/"+this.props.commentKey);
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
                    <div onClick={this.deleteComment}>Delete</div>
                </div>
                :
                <div className="menu" onClick={this.showMenu}>...</div>
                }</div>
        );
    }
}
