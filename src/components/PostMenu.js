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
                if (res.status === "fail") {
                    alert(res.message);
                } else {
                    tp.store && tp.store.dispatch(tp.action.deletePost(this.props.postKey));
                    //history.back();       // 이걸 사용하면 전혀 다른 사이트로 튈수 있음
                    this.props.history.push("/list");
                }
            })
        }
    }


    editPost(){
        tp.api.authPost({
            key: this.props.postKey,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "success"){
                tp.temp = res.post;
                this.props.history.push("/edit/"+this.props.postKey);
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
        console.log("PostMenu 렌더링");
        return (<div className="postMenu">{
                this.state.clicked ? 
                <div className="menu">
                    <div onClick={this.editPost}>Edit</div> <div onClick={this.deletePost}>Delete</div>
                </div>
                :
                <div className="menu" onClick={this.showMenu}>...</div>
                }</div>
        );
    }
}
