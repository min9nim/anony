import React from 'react';
import {tp} from "../tp";
import R from "ramda";
import moment from "moment";
import {PostMenu, CommentWrite, CommentList, PostMeta} from "../components";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Post.scss";
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

        this.contextPath = this.props.context ? "/"+this.props.context : "" ;
        tp.view.Post = this;




      

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

    render(){
        console.log("Post 렌더링");
        if(this.props.post){
            // post 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.post
        }else{
            return <div/> ;
        }
        
        const content = tp.$m.txtToHtml(this.state.content);

        return (
            <div>
                <div className="context">{this.props.context || "Anony"}</div>
                <div className="post">
                    <div>
                        <div className={this.state.deleted ? "title h4 deleted" : "title h4"}>
                            {this.state.title} {this.state.isPrivate && <sup>- Private -</sup>}
                        </div>
                    </div>
                    <div>
                        <div className="meta">{this.state.writer} - {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}</div>
                        {!this.state.origin && <PostMenu history={this.props.history} postKey={this.state.key} postDeleted={this.state.deleted} context={this.props.context}/>}
                    </div>
                    <div className={this.state.deleted ? "content deleted" : "content"} dangerouslySetInnerHTML={{__html: content}}></div>
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
