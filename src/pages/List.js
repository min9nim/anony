console.log("List.js start");

import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import {viewMode} from "../redux/action";
import { Link } from 'react-router-dom';
import "./List.scss";


export default class List extends React.Component {

    constructor(props) {
        super(props);

    }

    render(){
        console.log("List 렌더링..");
        return (
            <div className="list">
                {this.props.posts.map(
                    post => <Excerpt key={post.key} post={post}/>
                )}
                <div className="writeBtn">
                    <Link to="/write"><Button bsStyle="success">Write</Button></Link>
                </div>
            </div>
        );
    }
}
