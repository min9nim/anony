import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "./Excerpt";
import {tp} from "../tp.js";
import {viewMode} from "../redux/action";

console.log("List.js call");

export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.writePost = this.writePost.bind(this);
    }

    writePost(){
        /*
        this.props.app.setState({
            mode : "write",
        })

        */

        tp.dispatch(viewMode("write"));
    }

    render(){
        console.log("List rendering");
        return (
            <div style={{margin: '20px'}}>
                {tp.state.posts.slice().reverse().map(
                    post => <Excerpt key={post.key} post={post} app={this.props.app}/>
                )}
                <div className="writeBtn"><Button bsStyle="success" onClick={this.writePost}>Write</Button></div>
            </div>
        );
    }
}
