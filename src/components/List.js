import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "./Excerpt";

export default class List extends React.Component {

    constructor(props) {
        console.log("List constructor");
        super(props);
        this.writePost = this.writePost.bind(this);
    }

    writePost(){
        this.props.parentObj.setState({
            mode : "write",
        })
    }

    render(){
        console.log("List rendering");
        return (
            <div style={{margin: '20px'}}>
                {this.props.parentObj.state.posts.map(
                    post => <Excerpt key={post.key} post={post}/>
                )}
                <Button bsStyle="success" onClick={this.writePost}>Write</Button>
            </div>
        );
    }
}
