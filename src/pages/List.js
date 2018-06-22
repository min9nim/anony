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
            // posts 목록을 초기화하고
            tp.store.dispatch(tp.action.initPosts());

            // 다시 세팅
            tp.api.getPosts({idx: 0, cnt: 10, context: this.props.context})
                .then(tp.checkStatus)
                .then(res => tp.store.dispatch(tp.action.addPosts(res.posts)));
        }
        tp.context = this.props.context;

        this.contextPath = this.props.context ? "/"+this.props.context : "" ;

    }


    render(){
        console.log("List 렌더링..");
        return (
            <div className="list">
                <div className="context">{this.props.context || "Anony"}</div>
                {this.props.posts.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post} context={this.props.context}/>
                )}
                <div className="writeBtn">
                    <Link to={this.contextPath + "/write"}><Button bsStyle="success">Write</Button></Link>
                </div>
            </div>
        );
    }
}
