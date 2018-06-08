import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import {viewMode} from "../redux/action";
import "./List.scss";

console.log("List.js call");

export default class List extends React.Component {

    constructor(props) {
        super(props);
        //this.state = {posts : []};
        this.writePost = this.writePost.bind(this);
        //tp.view.List = this;
    }

    writePost(){
        tp.dispatch(viewMode({mode:"write"}));
    }

    render(){
        console.log("List rendering");
        return (
            <div className="list">
                {this.props.posts.map(
                    post => <Excerpt key={post.key} post={post}/>
                )}
                <div className="writeBtn"><Button bsStyle="success" onClick={this.writePost}>Write</Button></div>
            </div>
        );
    }
}
