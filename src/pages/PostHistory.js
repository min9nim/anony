console.log("PostHistory.js start");

import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import { Link } from 'react-router-dom';
import "./PostHistory.scss";


export default class PostHistory extends React.Component {
    constructor(props) {
<<<<<<< HEAD
        console.log("PostHistory 생성자 호출");
        super(props);


        if(this.props.phist.length === 0){
            const postKey = location.pathname.split("/")[2];
            tp.api.getPostHistory(postKey).then(res => {
                if(res.posts.length > 0){
                    tp.store.dispatch(tp.action.setPostHistory(res.posts));
                }else{
                    alert("Have no changes");
                }
            })        
        }


        // 화면을 새로고침하거나 url을 통해 직접 access 한 경우에 대한 예외처리는 생략 18.06.18
    }

    render(){
        console.log("PostHistory 렌더링..");
        return (
            <div className="postHistory">
                {this.props.phist.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post}/>
                )}
                <Link to={location.pathname.replace("History", "")}><Button bsStyle="success" className="writeBtn">Last</Button></Link>
            </div>
            
=======
        // 아씨 이거 모야  글보기화면에서 목록화면으로 이동할때마다 생성자가 계속 호출이 되는거였네
        console.log("PostHistory 생성자 호출");
        super(props);

        if(this.props.phist === undefined){

            tp.api.getPostHistory().then(res => {
                //tp.store.dispatch(tp.action.addPosts(res.posts));
            });
        }
    }


    render(){
        console.log("PostHistory 렌더링..");
        return (
            <div className="list">
                {this.props.posts.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post}/>
                )}
                <div className="writeBtn">
                    <Link to="/write"><Button bsStyle="success">Write</Button></Link>
                </div>
            </div>
>>>>>>> a0e0d0ddcbdf586d11e1f9af8166a52ee91e5097
        );
    }
}
