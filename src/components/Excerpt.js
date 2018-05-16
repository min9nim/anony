import React from 'react';

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
            let posts = JSON.parse(JSON.stringify(app.state.posts));
            let idx = posts.findIndex(o => o.key === this.props.post.key);
            posts.splice(idx,1);
            app.setState({
                posts : posts
            });
            //localStorage.setItem("posts", JSON.stringify(app.state.posts));   // setState가 비동기라 이렇게 사용하믄 안됨
            localStorage.setItem("posts", JSON.stringify(posts))
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
