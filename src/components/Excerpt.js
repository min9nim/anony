import React from 'react';
import {PostMenu, PostMeta} from "../components";
import moment from "moment";
import { Link } from 'react-router-dom';
import "./Excerpt.scss";
//import R from "ramda";
const R = require("ramda");


export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
        this.contextPath = this.props.context ? "/"+this.props.context : "" ;

        //moment.locale('ko');
        moment.locale('en');
        
    }

    shouldComponentUpdate(prevProps, prevState) {
        // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
        //return this.props !== prevProps;
        
        //props: history, key, post, context
        //return prevProps.post !== this.props.post;
        //console.log("this.props.post.deleted = " + this.props.post.deleted);
        //console.log("prevProps.post.deleted = " + prevProps.post.deleted);
        return !R.equals(this.props, prevProps);
    }

    render(){
        console.log("Excerpt 렌더링..");

        const search = tp.store.getState().view.search;
        const title = tp.highlight(this.props.post.title, search);
        const excerpt = tp.highlight(this.props.post.content.substr(0,100), search);

        return (
            <div id={this.props.post.key} className="excerpt">
                <div className="title1">
                    <Link to={ this.contextPath + "/post/" + this.props.post.key}>
                        <div className={this.props.post.deleted ? "title h4 deleted" : "title h4"}
                            dangerouslySetInnerHTML={{__html: title}}>
                        </div>
                    </Link>
                </div>
                <div>
                    <div className="meta" onClick={this.editPost}>
                        {this.props.post.writer} - {/postHistory/.test(location.pathname) && "edited"} {moment(this.props.post.date).fromNow()}
                    </div>
                    {/postHistory/.test(location.pathname) || <PostMenu history={this.props.history} context={this.props.context} postKey={this.props.post.key} postDeleted={this.props.post.deleted}/>}
                </div>
                <div className={this.props.post.deleted ? "content deleted" : "content"}
                    dangerouslySetInnerHTML={{__html: excerpt}}>
                </div>
                <PostMeta post={this.props.post} />
            </div>
        );
    }
}
