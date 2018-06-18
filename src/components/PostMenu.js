import React from 'react';
import {tp} from "../tp";
import "./PostMenu.scss";

export default class PostMenu extends React.Component {
    constructor(props) {
        console.log("PostMenu 생성자 호출");
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.editPost = this.editPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.removePost = this.removePost.bind(this);
        this.postHistory = this.postHistory.bind(this);

        this.state = {
            clicked : false
        }
    }

    shouldComponentUpdate(prevProps, prevState) {
        //console.log("PostMenu.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deletePost(){
        if(confirm("Delete this?")){
            tp.api.deletePost({
                key: this.props.postKey,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    alert(res.message);
                } else {
                    (tp.view.App.state.data.posts.length > 0 ) && tp.store.dispatch(tp.action.deletePost(this.props.postKey));
                    //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                    //this.props.history.push("/list");
                    tp.view.Post.setState({deleted : true});
                }
            })
        }
    }


    removePost(){
        if(confirm("Remove this?")){
            tp.api.removePost({
                key: this.props.postKey,
                uuid: tp.user.uuid
            }).then(res => {
                if (res.status === "Fail") {
                    alert(JSON.stringify(res, null, 2));
                } else {
                    //tp.store.dispatch(tp.action.deletePost(this.props.postKey));
                    tp.store.dispatch(tp.action.removePost(this.props.postKey));
                    //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                    this.props.history.push("/list");
                    //tp.view.Post.setState({deleted : true});
                }
            })
        }
    }

    editPost(){
        tp.api.authPost({
            key: this.props.postKey,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "Success"){
                tp.temp = res.post;
                this.props.history.push("/edit/"+this.props.postKey);
            }else{
                alert(res.message);
            }
        })
    }
    
    postHistory(){
        tp.api.getPostHistory(this.props.postKey).then(res => {
            if(res.posts.length > 0){
                tp.store.dispatch(tp.action.setPostHistory(res.posts));
                this.props.history.push("/postHistory/" + this.props.postKey);
            }else{
                alert("Have no changes");
            }
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
                <div className="menu">
                    <div onClick={this.postHistory}>History</div>
                    {this.props.postDeleted || (
                        <div>
                            <div onClick={this.editPost}>Edit</div>
                            <div onClick={this.deletePost}>Delete</div>
                            <div onClick={this.removePost}>Remove</div>
                        </div>
                    )}
                    
                </div>
                :
                <div className="menu" onClick={this.showMenu}>...</div>
            }</div>
        );
    }
}
