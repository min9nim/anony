import React from 'react';
import {PostMenu, PostMeta} from "../components";
import moment from "moment";
import { Link } from 'react-router-dom';
import "./Excerpt.scss";


export default class Excerpt extends React.Component {
    constructor(props) {
        super(props);
        this.contextPath = this.props.context ? "/"+this.props.context : "" ;
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
