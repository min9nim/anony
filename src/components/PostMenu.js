import React, { Fragment } from "react";
import {tp} from "../tp";
import "./PostMenu.scss";

export default class PostMenu extends React.Component {
    constructor(props) {
        console.log("PostMenu 생성자 호출");
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.cancelMenu = this.cancelMenu.bind(this);
        this.editPost = this.editPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.removePost = this.removePost.bind(this);
        this.restorePost = this.restorePost.bind(this);
        this.postHistory = this.postHistory.bind(this);

        this.state = {
            clicked : false
        }
        this.contextPath = this.props.context ? "/"+this.props.context : "" ;

    }

    deletePost(){
        //if(!confirm("Delete this?")) return;
        tp.confirm({
            //message: "Delete this?<br> whenever you can restore this.",
            //width: "256px",
            message: "Delete this?",
            onYes : () => {
                tp.api.deletePost({
                    key: this.props.postKey,
                    uuid: tp.user.uuid
                }).then(res => {
                    if (res.status === "Fail") {
                        tp.alert({
                            message: res.message,
                            style: "warning",
                        });
                    } else {
                        if(tp.store.getState().data.posts.length > 0 )
                            tp.store.dispatch(tp.action.deletePost(this.props.postKey));
                        //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                        //this.props.history.push("/list");
                        //tp.view.Post.setState({deleted : true});
                    }
                    this.cancelMenu();
                })
            }
        });
    }


    removePost(){
        //if(!confirm("Remove this?")) return;
        tp.confirm({
            //message: "Remove this?<br> you cannot restore this.", width: "212px",
            message: "Remove this?", width: "155px",
            onYes: () => {
                tp.api.removePost({
                    key: this.props.postKey,
                    uuid: tp.user.uuid
                }).then(res => {
                    if (res.status === "Fail") {
                        tp.alert({
                            message: "Fail<br>" + res.message,
                            style: "danger",
                            width: "200px"
                        });
                        this.cancelMenu();
                    } else {
                        //tp.store.dispatch(tp.action.deletePost(this.props.postKey));
                        tp.store.dispatch(tp.action.removePost(p => p.key === this.props.postKey));
                        //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                        if(this.props.postOrigin){
                            // 수정내역을 삭제할 경우
                            if(location.pathname.indexOf("postHistory") >= 0){
                                // postHistory 목록에서 삭제할 경우 화면 이동 없음
                            }else{
                                // 글보기 화면에서 삭제할 경우에는 히스토리 목록 화면으로 이동
                                var arr = location.pathname.split("/");
                                arr.splice(2, 2, "postHistory", this.props.postOrigin);     // context 명이 없는 경우 문제 발생할 수 있음
                                this.props.history.push(arr.join("/"));
                            }
                        }else{
                            this.props.history.push(this.contextPath + "/list");
                        }
                        
                        //tp.view.Post.setState({deleted : true});
                    }
                })
            }
        })
    }

    restorePost(){
        //if(!confirm("Restore this?")) return;
        tp.confirm({
            message: "Restore this?",
            onYes : () => {
                tp.api.restorePost({
                    key: this.props.postKey,
                    uuid: tp.user.uuid
                }).then(res => {
                    if (res.status === "Fail") {
                        tp.alert(JSON.stringify(res, null, 2));
                    } else {
                        //tp.store.dispatch(tp.action.deletePost(this.props.postKey));
                        tp.store.dispatch(tp.action.restorePost(this.props.postKey));
                        //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                        //this.props.history.push("/list");
                        //tp.view.Post.setState({deleted : true});
                    }
                    this.cancelMenu();
                })
            }
        });
    }    

    editPost(){
        tp.api.authPost({
            key: this.props.postKey,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "Success"){
                this.props.history.push(this.contextPath + "/edit/"+this.props.postKey);
            }else{
                tp.alert({
                    message: res.message, 
                    style: "warning",
                    width: "160px"
                });
                this.cancelMenu();
            }
        })
    }
    
    postHistory(){
        // 기존 세팅된 히스토리 내역 초기화
        tp.store.dispatch(tp.action.removePost(p => p.origin === this.props.postKey));
        
        // 최신 상태로 새로 세팅
        tp.api.getPostHistory(this.props.postKey).then(res => {
            if(res.posts.length > 0){
                //tp.store.dispatch(tp.action.setPostHistory(res.posts));
                tp.store.dispatch(tp.action.addPosts(res.posts))
                this.props.history.push(this.contextPath + "/postHistory/" + this.props.postKey);
            }else{
                tp.alert({
                    message: "Have no changes", 
                    style: "info",
                });
                this.cancelMenu();
            }
        })
    }

    cancelMenu(){
        this.setState({
            clicked: false
        })
    }


    showMenu(){
        this.setState({
            clicked: true
        })
    }

    render(){
        console.log("PostMenu 렌더링");
        return (
            <div className="postMenu">{
                this.state.clicked
                ? 
                <div className="navi">
                    {!this.props.postOrigin && 
                        <div className="icon-history" onClick={this.postHistory}>History</div>
                    }
                    {this.props.postDeleted ? (
                        <div className="icon-ccw" onClick={this.restorePost}>Restore</div>
                    ) : (
                        <Fragment>
                            {!this.props.postOrigin && 
                                <div className="icon-pencil" onClick={this.editPost}>Edit</div>
                            }
                            <div className="icon-trash-empty" onClick={this.deletePost} title="Delete this, whenever you can restore this">Delete</div>
                        </Fragment>
                    )
                    }
                    <div className="icon-trash" onClick={this.removePost} title="Delete this, you cannot undo">Remove</div>
                    <div className="icon-cancel" onClick={this.cancelMenu}>Cancel</div>
                </div>
                :
                <div className="navi" onClick={this.showMenu}>...</div>
            }</div>
        );
    }
}
