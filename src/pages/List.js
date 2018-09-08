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

        if(this.props.context.length > tp.MAXCONTEXTLEN){
            alert(`채널이름은 최대 ${tp.MAXCONTEXTLEN}자 까지 가능합니다`);
            history.back();
            return;
        }
        
        tp.context = this.props.context && this.props.context.length <= tp.MAXCONTEXTLEN
                    ? this.props.context : "public" ;

        //if(tp.view.App.state.data.posts.length <= 1 && tp.store.getState().view.search === ""){
        if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length <= 1
            && tp.store.getState().view.search === ""){
            // 이전에 들고있던 글목록이 있다면 굳이 새로 서버로 요청을 다시 보낼 필요가 없음..
            tp.api.getPosts({idx: 0, cnt: 10, context: tp.context})
                .then(tp.checkStatus)
                .then(res => tp.store.dispatch(tp.action.setPosts(res.posts)));
        }
        


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
        document.title = (tp.context || "Anony") + " - " + tp.thispage;
        tp.$m.scrollTo(0, tp.scrollTop);        // 이전 스크롤 위치로 복원
    }

    logoClick(){
        // 기존내용 초기화
        tp.store.dispatch(tp.action.setSearch(""));
        tp.store.dispatch(tp.action.initPosts());
        tp.isScrollLast = false;

        // 다시 세팅
        tp.api.getPosts({idx: 0, cnt: 10, context: tp.context})
            .then(tp.checkStatus)
            .then(res => tp.store.dispatch(tp.action.addPosts(res.posts)));
    }
    

    render(){
        console.log("List 렌더링..");

        let title = tp.store.getState().view.uuid + (tp.context ? (" /" + tp.context) : "") ;
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
                    <Search context={tp.context}/>
                </div>
                {this.state.posts.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post} context={tp.context}/>
                )}

                {tp.store.getState().view.search !== "" && (
                    <div className="backBtn">
                        <Button bsStyle="success" onClick={this.logoClick}>Back</Button>
                    </div>     
                )}

                <div className="writeBtn">
                    <Link to={"/" + tp.context + "/write"}><Button bsStyle="success">Write</Button></Link>
                </div>
            </div>
        );
    }
}
