import React from 'react';
import { Media, Button } from 'react-bootstrap';
import List from "./pages/List";
import Write from "./pages/Write";
import Post from "./pages/Post";
import { Route, Switch } from 'react-router-dom';
import { tp } from "./tp";

console.log("App.js call");

export default class App extends React.Component {

  constructor(props) {
    console.log("App 생성자 호출..");
    super(props);
    // 초기상태 정의
    this.state = {
      view: {
        mode: "list",
        key: ""
      },
      data: {
        posts: []
      }
    };
    tp.view.App = this;
  }

  render() {
    console.log("App 렌더링..");

    return (
      <div>
        <Switch>
          <Route path="/" render={() => <List posts={this.state.data.posts} />} />
          <Route path="/list" render={() => <List posts={this.state.data.posts} />} />
          <Route path="/write" component={Write} />
          <Route path="/post" render={() => <Post post={this.state.data.posts.find(post => post.key === this.state.view.key)} />} />
        </Switch>
      </div>
    );
  }
}
