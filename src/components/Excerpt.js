import React from 'react';
import {tp} from "../tp";
import {deletePost, viewMode} from "../redux/action";
import moment from "moment";
import { Link } from 'react-router-dom';
import "./Excerpt.scss";


export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
        this.viewPost = this.viewPost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    deletePost(){
        if(confirm("선택 항목을 삭제합니다")){
            tp.api.deletePost({
                key: this.props.post.key,
                uuid: tp.uuid
            }).then(res => {
                if(res.status === "fail"){
                    alert(res.message);
                }else{
                    tp.store.dispatch(deletePost(this.props.post.key))
                }
            })
        }
    }

    viewPost(){
        tp.dispatch(viewMode({mode: "post", key: this.props.post.key}));
    }
    render(){
        console.log("Excerpt 렌더링..");
        return (
            <div id={this.props.post.key} className="excerpt">
                <div>
                    <div className="title h4"><Link to={"/post/" + this.props.post.key}>{this.props.post.title}</Link></div>
                    <div className="delete" onClick={this.deletePost}>~</div>
                </div>
                <div className="meta">{this.props.post.writer} - {moment(this.props.post.date).fromNow()}</div>
                <div className="content">{this.props.post.content.substr(0,100)}</div>
            </div>
        );
    }
}
