import React from 'react';
import {tp} from "../tp";
import {PostMenu, CommentWrite, CommentList, PostMeta} from "../components";
const R = require("ramda");
import moment from "moment";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Remarkable from "remarkable";
//import hljs from 'highlight.js';
import shortcut from "../ext/shortcut";
import "./Post.scss";
import "../css/hljsTheme/xcode.css";

export default class Post extends React.Component {
    constructor(props) {
        console.log("Post 생성자 호출");
        super(props);

        this.state = {
            key: "",
            title: "",
            writer: "",
            content: "",
            date : "",
            deleted : false,
            uuid : "",
            viewCnt: "",
            likeCnt: 0
        };

        if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length > 0){
            this.state = tp.store.getState().data.posts.find(post => post.key === this.props.postKey);
        }


        shortcut.add("Alt+E", () => {
            if(location.pathname.indexOf("post") >= 0){// 글보기 화면인 경우에만
              this.props.history.push((location.pathname.replace("post", "edit")));
            }
        });

        this.contextPath = this.props.context ? "/" + this.props.context : "" ;
        tp.view.Post = this;

        this.unsubscribe = tp.store.subscribe(() => {
            this.setState(tp.store.getState().data.posts.find(post => post.key === this.props.postKey));
        });

        this.md = new Remarkable({
            html: true,
            linkify: true,
            xhtmlOut: true,
            breaks: true,
            // Highlighter function. Should return escaped HTML,
            // or '' if the source string is not changed
            highlight: (str, lang) => {
                if(tp.hljs === undefined){
                    import(/* webpackChunkName: "highlightjs"  */'highlight.js')
                        .then(m => {
                            tp.hljs = m.default;
                            //this.render();    // 이렇게 한다고 화면이 실제로 다시 그려지지는 않음
                            this.setState(this.state);
                        })
                        .catch(err => console.log(err.message));
                    return "code is loading..";
                }else{
                    if (lang && tp.hljs.getLanguage(lang)) {
                        try {
                            return tp.hljs.highlight(lang, str).value;
                        } catch (err) {
                            console.log(err.message);
                        }
                    }
                    try {
                        return tp.hljs.highlightAuto(str).value;
                    } catch (err) {
                        console.log(err.message);
                    }
                    return ''; // use external default escaping      
                }
            }
        });
          

        //if(this.props.post){
        if(tp.store.getState().data.posts.filter(p => p.origin === undefined).length > 0){
            // 목록/수정 화면에서 넘어 들어온 경우
            const diff = Date.now() - this.state.date;

            if(diff < 1000){
                // 1. 글등록이나 수정하고 바로 들어온 경우
                // 조회수 증가 처리 필요없고, 스토어 업데이트도 필요없음
            }else{
                // 2. List 에서 글 선택해서 들어온 경우
                if(tp.store.getState().data.posts.length > 1){
                    tp.api.viewPost(this.props.postKey).then(res => {
                        if(res.status == "Success"){
                            // 일반post 인 경우
                            // tp.store.dispatch(tp.action.viewPost(this.props.postKey))
                            // 여기서 스토어를 업데이트하면 다시 App 부터 리렌더링되면서 로직이 꼬이게 됨, 18.07.25
                        }else{
                            // 수정내역post 인 경우
                        }
                    })
                }else{
                    // 3.직접URL로 들어온 후 tp.api.viewPost 호출하고 store업데이트 된 후 화면 다시 그리면서 이쪽으로 들어옴
                }

            }
        }else{
            // 3. 직접URL로 치고 들어온 경우
            // - viewPost 호출한 후에 getPost로 응답결과를 그냥 화면에 보여주면 됨
            // - store 업데이트 필요없음
            tp.api.viewPost(this.props.postKey)
                .then(res => {
                    if(res.status == "Success"){
                        console.log("@@ 처음 데이터 가지고 왔음요");
                        // 일반post 인 경우
                        tp.store.dispatch(tp.action.addPost(res.output))
                    }else{
                        // 수정내역post 인 경우
                        tp.api.getPost(this.props.postKey)
                            .then(R.pipe(tp.checkStatus, R.prop("post"), tp.action.addPost, tp.store.dispatch))
                    }
                })
        }

    }


    componentWillUnmount(){
        console.log("# Post unsubscribe store..");
        this.unsubscribe();
    }
    

    componentDidMount(){
        document.title = this.state.title;
    }
    
    
    render(){
        console.log("Post 렌더링");

        if(this.state.key){
            // 해당 글로 직접 access 한 경우에도 타이틀 세팅해주려면 여기서 한번 더 타이틀 설정이 필요함
            document.title = this.state.title;
        }else{
            return <div/> ;
        }

        let title;
        const search = tp.store.getState().view.search;
        title = tp.highlight(this.state.title, search);
        title += this.state.isPrivate ? (<sup> - Private -</sup>) : "";

        function nl2br(str){
            // 마크다운에서 인용부호 사용시 인용부호 밖으로 벗어날 수 있는 방법이 없어서 아래를 주석처리함
            //return str.replace(/\n\n\n/g, "\n<br><br>\n").replace(/\n\n/g, "\n<br>\n");
            return str;
        }


        function highlight_nl2br(str){
            // 마크다운의 코드서식 텍스트에는 검색결과 highlight표시 안하도록 예외 처리
            return str.split("```").map((v, i) => 
                i%2 ? v : v.split("`").map((v,i) => i%2 ? v : nl2br(tp.highlight(v, search))).join("`")
            ).join("```");
        }        

        // const searchHighlight = R.curry(tp.highlight)(R.__, search);
        // const highlight_nl2br = R.pipe(
        //     R.split("```"),
        //     R.map(R.ifElse(
        //         (v, i) => i%2,
        //         R.identity,
        //         R.pipe(searchHighlight, nl2br)
        //     )),
        //     R.join("```")
        // );        

        
        const contentClass = this.state.isMarkdown ? "markdown" : "content";
        const contentStyle = this.state.deleted ? contentClass + "  deleted" : contentClass
        const content = this.state.isMarkdown ?
                        this.md.render(highlight_nl2br(this.state.content)) :
                        tp.$m.txtToHtml(this.state.content, search);
        

        return (
            <div>
                {/* <div className="context">{this.props.context || "Anony"}</div> */}
                <div className="post">
                    <div>
                        {/*제목에서 검색결과 하이라이트 표시를 하려면 html태그 사용이 필요하다 */}
                        <div className={this.state.deleted ? "title h4 deleted" : "title h4"}
                            dangerouslySetInnerHTML={{__html: title}}>
                        </div>
                    </div>
                    <div>
                        <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}</div>
                        {!this.state.origin && (
                            <PostMenu history={this.props.history} postKey={this.state.key} postDeleted={this.state.deleted} context={this.props.context}/>
                        )}
                    </div>
                    <div className={contentStyle} dangerouslySetInnerHTML={{__html: content}}></div>
                    <PostMeta post={this.state}/>
                    {!!this.state.origin || this.state.isPrivate || (
                        <div>
                            <Link to={this.contextPath + "/list"}><Button bsStyle="success" className="listBtn">List</Button></Link>
                            <Link to={this.contextPath + "/write"}><Button bsStyle="success" className="writeBtn">Write</Button></Link>
                        </div>
                    )}
                    {this.state.origin && (
                        <Link to={this.contextPath + "/postHistory/" + this.state.origin}>
                            <Button bsStyle="success" className="writeBtn">History</Button>
                        </Link>
                    )}
                     
                </div>

                {!this.state.origin && this.state.hasComment && (
                    <div>
                        <CommentList postKey={this.state.key} ff="ff" commentCnt={this.state.commentCnt} />
                        {this.state.deleted || <CommentWrite postKey={this.state.key} /> }
                    </div>
                )}
            </div>
        );
    }
}
