console.log("List.js start");

import React from 'react';
import { Button } from 'react-bootstrap';
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import {createStore} from 'redux';
import {reducer} from "../redux/reducer";
import { Link } from 'react-router-dom';
import "./List.scss";


export default class List extends React.Component {
    constructor(props) {
        console.log("List 생성자 호출");
        super(props);

        // List 최초 호출시 목록 가져와서 store 초기화
        tp.api.getPosts(0, 10).then(res => {
            // 기존 상태 복사
            let copy = JSON.parse(JSON.stringify(tp.view.App.state));

            // 신규상태
            copy.data.posts = res.posts
        
            // 스토어 최초 한번 생성
            tp.store = createStore(reducer, copy);
        
            // App 를 신규상태로 초기화
            tp.view.App.setState(tp.store.getState());
    
            // 이후 App 가 스토어 상태를 구독하도록 설정
            tp.store.subscribe(() => {
                tp.view.App.setState(tp.store.getState());
            });
          })
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
