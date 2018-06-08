import React from 'react';
import {Media, Button} from 'react-bootstrap';
import List from "./pages/List";
import Write from "./pages/Write";
import View from "./pages/Post";
import {tp} from "./tp";

console.log("App.js call");

export default class App extends React.Component {

  constructor(props) {
    console.log("App 생성자 호출..");
    super(props);
    // 초기상태 정의
    this.state = {
      view : {
        mode: "list",
        key: ""
      },
      data : {
        posts: []
      }
    };
    tp.view.App = this;
  }
  
  render() {
    console.log("App 렌더링..");

    let viewComp;
    switch(this.state.view.mode){
      case "list":
        viewComp = <List posts={this.state.data.posts}/>;
        break;
      case "write":
        viewComp = <Write />;
        break;
      case "post":
        viewComp = <View post={this.state.data.posts.find(post => post.key === this.state.view.key)}/>;
        break;
      default:
        break;
    }


    return (
      <div>{viewComp}</div>
    );
  }
}
