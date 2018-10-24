import React from "react";
import { Button } from "react-bootstrap";
import {Excerpt, Menu, Search, ListLoader} from "../components";
import {tp} from "../tp.js";
import { Link } from "react-router-dom";
import nprogress from "nprogress";
import $m from "../../com/util";

import "./List.scss";


export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.logoClick = this.logoClick.bind(this);

        this.state = {
            posts: tp.store.getState().data.posts.filter(p => p.origin === undefined),
            loading: false
        }

        tp.view.List = this;

        if(this.props.context && this.props.context.length > tp.MAXCONTEXTLEN){
            alert(`채널이름은 최대 ${tp.MAXCONTEXTLEN}자 까지 가능합니다`);
            history.back();
            return;
        }
        
        tp.context = this.props.context && this.props.context.length <= tp.MAXCONTEXTLEN
                    ? this.props.context : "public" ;

        //if(tp.view.App.state.data.posts.length <= 1 && tp.store.getState().view.search === ""){
        if(
            (// 처음부터 글쓰기로 글을 생성하고 들어온 경우
                tp.store.getState().data.posts.filter(p => p.origin === undefined).length <= 1
                &&
                tp.store.getState().view.search === ""
            )
            ||
            // 글수정화면에서 context를 수정한 경우(posts에 context 가 2개 이상 포함된 경우)
            tp.store.getState().data.posts.map(p => p.context).filter((v,i,a) => a.indexOf(v) === i).length > 1
        ){
            tp.api.getPosts({idx: 0, cnt: 10, context: tp.context})
                .then(tp.checkStatus)
                .then(res => tp.store.dispatch(tp.action.setPosts(res.posts)));
        }else{
            // 이전에 들고있던 글목록이 있다면 굳이 새로 서버로 요청을 다시 보낼 필요가 없음..
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
        // console.log("List 렌더링..");

        //let title = tp.store.getState().view.uuid + (tp.context ? (" /" + tp.context) : "") ;
        let title = tp.user.uuid + (tp.context ? (" /" + tp.context) : "") ;
        
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
                    <Search context={tp.context} />
                </div>
                {this.state.posts.map(
                    post => <Excerpt history={this.props.history} key={post.key} post={post} context={tp.context}/>
                )}
                {this.state.loading && new Array(10).fill("").map((v,i) => <ListLoader key={i} />)}
                {tp.store.getState().view.search !== "" && (
                    <div className="backBtn">
                        <Button bsStyle="success" onClick={this.logoClick}>Back</Button>
                    </div>     
                )}

                <div className="writeBtn">
                    <Link to={"/" + tp.context + "/write"}><Button bsStyle="success"><i className="icon-doc-new" />Write</Button></Link>
                </div>
            </div>
        );
    }
}

document.body.onscroll = function () {
    const PAGEROWS = 10;

    
    if(tp.thispage !== "List"){
        // 목록화면이 아니면 리턴  
        return;
    }
    if(tp.view.List.state.loading){
        // 데이터 로딩중이면 리턴
        return;
    }


    // 현재 목록화면 scrollTop 의 값
    const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);


    // 현재 스크롤 값을 전역변수에 저장
    tp.scrollTop = scrollTop;

    if(tp.isScrollLast) return;
    // 아직 모든 글이 로드된 상태가 아니라면 스크롤이 아래까지 내려왔을 때 다음 글 10개 로드

    //현재문서의 높이
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    //현재 화면 높이 값
    const clientHeight = document.documentElement.clientHeight;

    //console.log("scrollTop : " + scrollTop)
    //console.log("clientHeight : " + clientHeight)
    //console.log("scrollHeight : " + scrollHeight)


    if (
        (scrollTop + clientHeight == scrollHeight)    // 일반적인 경우(데스크탑: 크롬/파폭, 아이폰: 사파리)
        ||
        (tp.isMobileChrome() && (scrollTop + clientHeight == scrollHeight - 56))   // 모바일 크롬(55는 위에 statusbar 의 높이 때문인건가)
    ){ //스크롤이 마지막일때

    /*
    * 18.09.19 min9nim
    * 아래와 같이 분기 처리하면 데스크탑 크롬에서 스크롤이 마지막에 닿고나서 요청이 여러번 한꺼번에 올라가는 문제 발생
    * //if ((scrollTop + clientHeight) >= scrollHeight-55) { 
    */

//console.log("scrollTop + clientHeight = " + (scrollTop + clientHeight));
//console.log("scrollHeight = " + scrollHeight);



        nprogress.start();
        $m("#nprogress .spinner").css("top", "95%");
        tp.view.List.setState({loading: true});
        tp.api.getPosts({
            idx: tp.store.getState().data.posts.filter(p => p.origin === undefined).length,
            cnt: PAGEROWS,
            search: tp.store.getState().view.search,
            hideProgress: true,
            context: tp.context
        })
        .then(res => {
            tp.view.List.setState({loading: false});
            tp.store.dispatch(tp.action.scrollEnd(res.posts));
            if(res.posts.length < PAGEROWS){
                console.log("Scroll has touched bottom")
                tp.isScrollLast = true;
                return;
            }
        })
    }
};