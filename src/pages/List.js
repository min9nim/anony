console.log("List.js start");

import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import { Link } from 'react-router-dom';
import "./List.scss";


export default class List extends React.Component {
    constructor(props) {
        // 아씨 이거 모야  글보기화면에서 목록화면으로 이동할때마다 생성자가 계속 호출이 되는거였네
        console.log("List 생성자 호출");
        super(props);

        if(tp.view.App.state.data.posts.length < 10){
            tp.api.getPosts(0, 10).then(res => {
                tp.store.dispatch(tp.action.addPosts(res.posts));
            });
        }
    }


    render(){
        console.log("List 렌더링..");
        return (
            <div className="list">
                {this.props.posts.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post}/>
                )}
                <div className="writeBtn">
                    <Link to="/write"><Button bsStyle="success">Write</Button></Link>
                </div>
            </div>
        );
    }
}
