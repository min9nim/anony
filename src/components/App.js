import React from 'react';
import {Media, Button} from 'react-bootstrap';
import List from "./List";
import Write from "./Write";
import {tp} from "../tp";

console.log("App.js call");

export default class App extends React.Component {

  constructor(props) {
    console.log("App 생성자 호출..");
    super(props);
    // 초기상태 정의
    this.state = {
      mode: "list",
      posts: []
    };
    tp.view.App = this;
  }
  
  render() {
    console.log("App 렌더링..");
    return (
      <div>{this.state.mode === "list"
          ? <List posts={this.state.posts}/>
          : <Write/>
      }</div>
    );
  }
}
