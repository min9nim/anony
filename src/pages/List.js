import React from "react";
import { Button } from "react-bootstrap";
import {Excerpt, Menu, Search} from "../components";
import {tp} from "../tp.js";
import { Link } from "react-router-dom";
import "./List.scss";

export default class List extends React.Component {
    constructor(props) {
        console.log("List 생성자 호출");
        super(props);
        this.logoClick = this.logoClick.bind(this);

        this.state = {
            posts: tp.store.getState().data.posts.filter(p => p.origin === undefined)
        }

        //if(tp.view.App.state.data.posts.length <= 1 && tp.store.getState().view.search === ""){
        if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length <= 1
            && tp.store.getState().view.search === ""){
            tp.api.getPosts({idx: 0, cnt: 10, context: this.props.context})
                .then(tp.checkStatus)
                .then(res => tp.store.dispatch(tp.action.setPosts(res.posts)));
        }
        tp.context = this.props.context;

        this.contextPath = this.props.context ? "/"+this.props.context : "" ;

        // 이후 App 가 스토어 상태를 구독하도록 설정
        this.unsubscribe = tp.store.subscribe(() => {
            console.log("List가 store 상태 변경 노티 받음")
            this.setState(tp.store.getState().data);
        });
    }

    componentWillUnmount(){
        console.log("# List unsubscribe store..");
        this.unsubscribe();
    }    

    componentDidMount(){
        document.title = (this.props.context || "Anony") + " - " + tp.thispage;
        tp.$m.scrollTo(0, tp.scrollTop);        // 이전 스크롤 위치로 복원
    }

    logoClick(){
        // 기존내용 초기화
        tp.store.dispatch(tp.action.setSearch(""));
        tp.store.dispatch(tp.action.initPosts());
        tp.isScrollLast = false;

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
                    {!search && <Menu/> }
                    <div className="title" onClick={this.logoClick}>{title}</div>
                    <div className="status">{status}</div>
                    <Search context={this.props.context}/>
                </div>
                {/* <div className="context">{this.props.context || "Anony"}</div> */}
                {this.state.posts.map(
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
