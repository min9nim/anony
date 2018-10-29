console.log("PostHistory.js start");

import React from "react";
import { Button } from "react-bootstrap";
import Excerpt from "../components/Excerpt";
import {tp} from "../tp.js";
import { Link } from "react-router-dom";
import "./PostHistory.scss";


export default class PostHistory extends React.Component {
    constructor(props) {
        console.log("PostHistory 생성자 호출");
        super(props);
        this.state = {
            phist : tp.store.getState().data.posts.filter(p=> p.origin === this.props.postKey)
        }

        if(this.state.phist.length === 0){
            tp.api.getPostHistory(this.props.postKey)
                .then(tp.checkStatus)
                .then(res => {
                    if(res.posts.length > 0){
                        tp.store.dispatch(tp.action.addPosts(res.posts));
                    }else{
                        tp.alert("Have no changes");
                    }
                })
        }

        this.contextPath = this.props.context ? "/" + this.props.context : "" ;

        // 이후 App 가 스토어 상태를 구독하도록 설정
        this.unsubscribe = tp.store.subscribe(() => {
            console.log("PostHistory 가 store 상태변경 노티 받음")
            this.setState({
                phist: tp.store.getState().data.posts.filter(p=> p.origin === this.props.postKey)
            });
        });


    }
    componentWillUnmount(){
        console.log("# PostHistory unsubscribe store..");
        this.unsubscribe();
    }

    componentDidMount(){
        document.title = (this.props.context || "Anony") + " - " + tp.thispage;
    }

    render(){
        console.log("PostHistory 렌더링..");
        return (
            <div className="postHistory">
                {this.state.phist.map(
                    post => <Excerpt history={this.props.history} context={this.props.context} key={post.key} post={post}/>
                )}
                <div className="btnWrapper">
                    <Link to={this.contextPath + "/post/" + this.props.postKey}><Button bsStyle="success"><i className="icon-to-end" />Last</Button></Link>
                </div>
            </div>
            
        );
    }
}