import React from 'react';
import {tp} from "../tp";
import R from "ramda";
import moment from "moment";
import {PostMenu, CommentWrite, CommentList, PostMeta} from "../components";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Remarkable from "remarkable";
import hljs from 'highlight.js';
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
            uuid : ""
          };

        this.contextPath = this.props.context ? "/" + this.props.context : "" ;
        tp.view.Post = this;

        this.md = new Remarkable({
            html:         true,        // Enable HTML tags in source
            xhtmlOut:     false,        // Use '/' to close single tags (<br />)
            breaks:       true,        // Convert '\n' in paragraphs into <br>
            langPrefix:   '',  // CSS language prefix for fenced blocks
            linkify:      true,        // Autoconvert URL-like text to links
          
            // Enable some language-neutral replacement + quotes beautification
            typographer:  false,
          
            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
            quotes: '“”‘’',
          
            // Highlighter function. Should return escaped HTML,
            // or '' if the source string is not changed
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                  try {
                    return hljs.highlight(lang, str).value;
                  } catch (err) {}
                }
            
                try {
                  return hljs.highlightAuto(str).value;
                } catch (err) {}
            
                return ''; // use external default escaping
              }
        });


        if(this.props.post){
            const diff = Date.now() - this.props.post.date;
            console.log("# diff = " + diff)
            if(diff < 1000){
                // 1. 글등록이나 수정하고 바로 들어온 경우
                // 조회수 증가 처리 필요없고, 스토어 업데이트도 필요없음
            }else{
                // 2. List 에서 글 선택해서 들어온 경우
                // - viewPost 호출한 후에 store 업데이트 필요
                tp.api.viewPost(this.props.postKey)
                    .then(res => {
                        if(res.status == "Success"){
                            // 일반post 인 경우
                            tp.store.dispatch(tp.action.viewPost(this.props.postKey))
                        }else{
                            // 수정내역post 인 경우
                        }
                    })

            }
        }else{
            // 3. 직접URL로 치고 들어온 경우
            // - viewPost 호출한 후에 getPost로 응답결과를 그냥 화면에 보여주면 됨
            // - store 업데이트 필요없음
            tp.api.viewPost(this.props.postKey)
                .then(res => {
                    if(res.status == "Success"){
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

    componentDidMount(){
        // 이거는 컴포넌트가 dom에 로드될 때 최초 한번밖에 호출이 안되네
        document.title = this.state.title;
    }
    
    
    render(){
        console.log("Post 렌더링");
        if(this.props.post){
            // post 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.post

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
            return str.replace(/\n\n/g, "\n<br>\n");
        }
        
        const contentClass = this.state.isMarkdown ? "markdown" : "content";
        const contentStyle = this.state.deleted ? contentClass + "  deleted" : contentClass

        const content = this.state.isMarkdown ?
                        //this.md.render(nl2br(tp.highlight(this.state.content, search))) :
                        this.md.render(nl2br(this.state.content)) : // highlight를 적용하면 markdown 코드영역 안의 단어가 매칭될 경우 span태그가 그대로 노출되는 문제가 있음, 180711
                        tp.$m.txtToHtml(this.state.content, search);
        

        return (
            <div>
                <div className="context">{this.props.context || "Anony"}</div>
                <div className="post">
                    <div>
                        <div className={this.state.deleted ? "title h4 deleted" : "title h4"}
                            dangerouslySetInnerHTML={{__html: title}}>
                        </div>
                    </div>
                    <div>
                        <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}</div>
                        {!this.state.origin && <PostMenu history={this.props.history} postKey={this.state.key} postDeleted={this.state.deleted} context={this.props.context}/>}
                    </div>
                    <div className={contentStyle} dangerouslySetInnerHTML={{__html: content}}></div>
                    <PostMeta post={this.state}/>
                    {!!this.state.origin || this.state.isPrivate || (
                        <div>
                            <Link to={this.contextPath + "/list"}><Button bsStyle="success" className="listBtn">List</Button></Link>
                            <Link to={this.contextPath + "/write"}><Button bsStyle="success" className="writeBtn">Write</Button></Link>
                        </div>
                    )}
                    {this.state.origin && <Link to={this.contextPath + "/postHistory/" + this.state.origin}><Button bsStyle="success" className="writeBtn">History</Button></Link>}
                     
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
