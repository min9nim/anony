import React from 'react';
import { Button } from 'react-bootstrap';
import {Excerpt, Menu, Search} from "../components";
import {tp} from "../tp.js";
import { Link } from 'react-router-dom';
import "./List.scss";

export default class List extends React.Component {
    constructor(props) {
        // 아씨 이거 모야  글보기화면에서 목록화면으로 이동할때마다 생성자가 계속 호출이 되는거였네
        console.log("List 생성자 호출");
        super(props);
        this.logoClick = this.logoClick.bind(this);

        if(tp.view.App.state.data.posts.length < 10 && tp.store.getState().view.search === ""){
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

    componentDidMount(){
        document.title = (this.props.context || "Anony") + " - " + tp.thispage;
    }

    logoClick(){
        tp.store.dispatch(tp.action.setSearch(""));

        // 기존내용 초기화
        tp.store.dispatch(tp.action.initPosts());

        // 다시 세팅
        tp.api.getPosts({idx: 0, cnt: 10, context: this.props.context})
            .then(tp.checkStatus)
            .then(res => tp.store.dispatch(tp.action.addPosts(res.posts)));
    }
    

    render(){
        console.log("List 렌더링..");


        //let title = tp.context || "Anony";
        //let title = tp.user.uuid;
        let title = tp.store.getState().view.uuid;
        let status = "";
        let search = tp.store.getState().view.search;

        if(search){
            status = ` > ${search}'s result`;
        }


        return (
            <div className="list">
                <div className="header">
                    <div className="title" onClick={this.logoClick}>{title}</div><Menu/>
                    <div className="status">{status}</div>
                    <Search context={this.props.context}/>
                </div>
                <div className="context">{this.props.context || "Anony"}</div>
                {this.props.posts.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post} context={this.props.context}/>
                )}

                {tp.store.getState().view.search !== "" && (
                    <div className="backBtn">
                        <Button bsStyle="success" onClick={this.logoClick}>Back</Button>
                    </div>     
                )}

                <div className="writeBtn">
                    <Link to={this.contextPath + "/write"}><Button bsStyle="success">Write</Button></Link>
                </div>
            </div>
        );
    }
}
