import React from 'react';
import {tp} from "../tp";
import {deletePost, viewMode} from "../redux/action";
import PostMenu from "../components/PostMenu";
import moment from "moment";
import { Link } from 'react-router-dom';
import "./Excerpt.scss";


export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
        this.editPost = this.editPost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    deletePost(){
        if(confirm("Delete this?")){
            tp.api.deletePost({
                key: this.props.post.key,
                uuid: tp.user.uuid
            }).then(res => {
                if(res.status === "fail"){
                    alert(res.message);
                }else{
                    tp.store.dispatch(deletePost(this.props.post.key))
                }
            })
        }
    }

    menuClick(){
        
    }

    editPost(){
        tp.api.authPost({
            key: this.props.post.key,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "success"){
                this.props.history.push("/edit/"+this.props.post.key);
            }else{
                alert(res.message);
            }
        })
    }

    render(){
        console.log("Excerpt 렌더링..");
        return (
            <div id={this.props.post.key} className="excerpt">
                <div>
                    <div className="title h4"><Link to={"/post/" + this.props.post.key}>{this.props.post.title}</Link></div>
                    <PostMenu history={this.props.history} postKey={this.props.post.key}/>
                </div>
                <div className="meta" onClick={this.editPost}>{this.props.post.writer} - {moment(this.props.post.date).fromNow()}</div>
                <div className="content">{this.props.post.content.substr(0,100)}</div>
            </div>
        );
    }
}
