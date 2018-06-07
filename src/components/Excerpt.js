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

        const excerpt1 = {display:"inline-block", margin:"10px", width: "100%"};
        
        return (
            <div id={this.props.post.key}>
                <div style={excerpt1} className="excerpt1">
                    <div><div style={{display:"inline-block", width:"calc(100% - 30px)"}}><h4>{this.props.post.title}</h4></div><div style={{display:"inline-block", margin:"10px", cursor:"pointer"}} onClick={this.deletePost}>x</div></div>
                    <div style={{color : "#aaa"}}>{this.props.post.writer} - {new Date(this.props.post.date).toString().substr(4, 17)}</div>
                    <div>{this.props.post.content}</div>
                </div>
            </div>
        );
    }
}
