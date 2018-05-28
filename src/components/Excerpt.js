import React from 'react';
import {tp} from "../tp";
import {deletePost} from "../action";

export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    deletePost(){
        if(confirm("선택 항목을 삭제합니다")){
            tp.dispatch(deletePost(this.props.post.key));
        }
    }

    render(){
        console.log("Excerpt rendering");
        return (
            <div id={this.props.post.key}>
                <div style={{display:"inline-block", margin:"10px"}}>
                    <h4>{this.props.post.title}</h4>
                    <p style={{color : "#aaa"}}>{this.props.post.writer} - {new Date(this.props.post.date).toString().substr(4, 17)}</p>
                    {this.props.post.content} </div>
                <div style={{float: "right", margin:"10px", cursor:"pointer"}} onClick={this.deletePost}>x</div>
            </div>
        );
    }
}
