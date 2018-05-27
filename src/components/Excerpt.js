import React from 'react';
import tp, {store, deletePost} from "../tp.js";

console.log("Excerpt.js call");

export default class Excerpt extends React.Component {

    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
    }

    shouldComponentUpdate(prevProps, prevState) {
        return prevProps !== this.props;
    }

    deletePost(){
        if(confirm("선택 항목을 삭제합니다")){
            //let posts = JSON.parse(JSON.stringify(app.state.posts));
            
            /*
            let posts = tp.getPosts();
            let idx = posts.findIndex(o => o.key === this.props.post.key);
            posts.splice(idx,1);
            this.props.app.setState({
                posts : posts
            });
            */
            store.dispatch(deletePost(this.props.post.key));
            tp.saveState(store.getState());
        }
    }

    render(){
        console.log("Excerpt rendering");
        return (
            <div id={this.props.post.key}>
                <div style={{display:"inline-block", margin:"10px"}}>
                    <h4>{this.props.post.title}</h4>
                    {this.props.post.content} </div>
                <div style={{float: "right", margin:"10px", cursor:"pointer"}} onClick={this.deletePost}>x</div>
            </div>
        );
    }
}
