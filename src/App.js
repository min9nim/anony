console.log("App.js start");

import React from 'react';
import { Media, Button } from 'react-bootstrap';
import { List, Write, Post } from "./pages";
import { Route, Switch } from 'react-router-dom';
import { tp } from "./tp";

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
    console.log("App 렌더링..,,");

    return (
      <div>
        <Switch>{/*Switch는 매칭되는 첫번재꺼만 보여주고 아래꺼는 버림*/}
          <Route path="/post/:key" render={({ match, history, location }) => <Post history={history} post={this.state.data.posts.find(post => post.key === match.params.key)} />} />
          <Route path="/write" component={Write} />
          <Route path="/list" render={({ match, history, location }) => <List posts={this.state.data.posts} />} />
          <Route path="/" render={({ match, history, location }) => <List posts={this.state.data.posts} />} />
        </Switch>
      </div>
    );
  }
}
