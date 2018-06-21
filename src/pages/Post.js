import React from 'react';
import {tp} from "../tp";
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

        // view 카운트 1증가
        tp.api.viewPost(this.props.postKey).then(res => {
            console.log("## api.viewPost 콜백.." + JSON.stringify(this.props.post));
            if(res.status === "Success"){
                if(this.props.post){
                    // List에서 제목 클릭해서 넘어온 경우에만 스토어를 업데이트 하도록 한다
                    tp.store.dispatch(tp.action.viewPost(this.props.postKey));
                }else{
                    // url로 직접 access 한 경우에는 이미 viewCnt가 증가된 값이 화면에 출력되기 때문에 스토어를 따로 업데이트 하지 않음
                }                
            };
        })

        tp.view.Post = this;
    }

    shouldComponentUpdate(prevProps, prevState) {
        // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
        //console.log("Post.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    render(){
        console.log("Post 렌더링");
        if(this.props.post){
            // post 프롭이 들어오는 경우는 다시 업데이트하지 말라고 일부러 setState 를 사용하지 않고 state를 갱신함
            this.state = this.props.post
        }
        //if([null, undefined].includes(this.state) || this.state.menu){
        if(!this.state.key || this.state.menu){
            // 최초 렌더링 시에는 post 가 undefined 이므로 예외처리
            tp.api.getPost(this.props.postKey).then(res => {
                tp.store.dispatch(tp.action.addPost(res.posts[0]));
            });
            return <div/>
        }
        const content = tp.$m.txtToHtml(this.state.content);

        return (
            <div>
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
