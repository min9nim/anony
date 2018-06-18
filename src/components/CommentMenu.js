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
<<<<<<< HEAD
                if (res.status === "Fail") {
                    alert(res.message);
                } else {
                    tp.store.dispatch(tp.action.deleteComment(this.props.commentKey));
                    // 부모post의 댓글 카운트 1증가  
                    const postKey = location.pathname.split("/")[2];          
                    let post = tp.store.getState().data.posts.find(p => p.key === postKey);
                    post.commentCnt = post.commentCnt ? post.commentCnt -1 : 1 ;
                    tp.store.dispatch(tp.action.updatePost(post));
=======
                if (res.status === "fail") {
                    alert(res.message);
                } else {
                    tp.store && tp.store.dispatch(tp.action.deleteComment(this.props.commentKey));
                    //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                    //this.props.history.push("/list");
>>>>>>> a0e0d0ddcbdf586d11e1f9af8166a52ee91e5097
                }
            })
        }
    }


    editComment(){
        tp.api.authComment({
            key: this.props.commentKey,
            uuid: tp.user.uuid
        }).then(res => {
<<<<<<< HEAD
            if(res.status === "Success"){
=======
            if(res.status === "success"){
>>>>>>> a0e0d0ddcbdf586d11e1f9af8166a52ee91e5097
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
