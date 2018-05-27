import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "./Excerpt";

console.log("List.js call");

export default class List extends React.Component {

    constructor(props) {
        console.log("List constructor");
        super(props);
        this.writePost = this.writePost.bind(this);
    }

    writePost(){
        this.props.app.setState({
            mode : "write",
        })
    }

    render(){
        console.log("List rendering");
        return (
            <div style={{margin: '20px'}}>
                {this.props.app.state.posts.map(
                    post => <Excerpt key={post.key} post={post} app={this.props.app}/>
                )}
                <Button bsStyle="success" onClick={this.writePost}>Write</Button>
            </div>
        );
    }
}
