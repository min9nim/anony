import React from 'react';
import "./PostMeta.scss";

export default class PostMeta extends React.Component {
    constructor(props) {
        console.log("PostMeta 생성자 호출");
        super(props);
    }

    render(){
        console.log("PostMeta 렌더링");
        return (
            <div className="postMeta">
                <div>Comments: {this.props.post.commentCnt || 0}</div>
                <div>View: {this.props.post.viewCnt || 0} </div>
            </div>
        );
    }
}
