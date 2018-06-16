import React from 'react';
import {PostMenu} from "../components";
import moment from "moment";
import { Link } from 'react-router-dom';
import "./Excerpt.scss";


export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    render(){
        console.log("Excerpt 렌더링..");
        return (
            <div id={this.props.post.key} className="excerpt">
                <div>
                    <div className="title h4"><Link to={"/post/" + this.props.post.key}>{this.props.post.title}</Link></div>
                </div>
                <div>
                    <div className="meta" onClick={this.editPost}>{this.props.post.writer} - {moment(this.props.post.date).fromNow()}</div>
                    <PostMenu history={this.props.history} postKey={this.props.post.key}/>
                </div>
                <div className="content">{this.props.post.content.substr(0,100)}</div>
            </div>
        );
    }
}
