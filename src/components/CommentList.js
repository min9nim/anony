console.log("CommentList.js start");

import React from 'react';
import Comment from "../components";
import {tp} from "../tp.js";
import "./CommentList.scss";


export default class CommentList extends React.Component {
    constructor(props) {
        console.log("CommentList 생성자 호출");
        super(props);
        this.state = {
            comments: []
        }
        this.initState();

    }

    initState(){
        tp.api.getComments(this.props.postKey).then(res => {
            this.setState({
                comments: res.comments
            });
        });
    }


    render(){
        console.log("CommentList 렌더링..");
        return (
            <div className="CommentList">
                {this.state.comments.map(
                    comment => <Comment history={this.props.history} key={comment.key} comment={comment}/>
                )}
            </div>
        );
    }
}
