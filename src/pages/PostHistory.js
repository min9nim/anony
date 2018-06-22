console.log("PostHistory.js start");

import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import { Link } from 'react-router-dom';
import "./PostHistory.scss";


export default class PostHistory extends React.Component {
    constructor(props) {
        console.log("PostHistory 생성자 호출");
        super(props);


        if(this.props.phist.length === 0){
            const postKey = this.props.postKey;
            tp.api.getPostHistory(postKey)
                .then(tp.checkStatus)
                .then(res => {
                if(res.posts.length > 0){
                    tp.store.dispatch(tp.action.setPostHistory(res.posts));
                }else{
                    alert("Have no changes");
                }
            })        
        }

        this.contextPath = this.props.context ? "/" + this.props.context : "" ;



        // 화면을 새로고침하거나 url을 통해 직접 access 한 경우에 대한 예외처리는 생략 18.06.18
    }

    render(){
        console.log("PostHistory 렌더링..");
        return (
            <div className="postHistory">
                <div className="context">{this.props.context || "Anony"}</div>
                {this.props.phist.map(
                    post => <Excerpt history={this.props.history} context={this.props.context} key={post.key} post={post}/>
                )}
                <Link to={this.contextPath + location.pathname.replace("History", "")}><Button bsStyle="success" className="writeBtn">Last</Button></Link>
            </div>
            
        );
    }
}