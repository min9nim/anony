console.log("App.js start");

import React from 'react';
import { List, Write, Post, Edit } from "./pages";
import { Route, Switch } from 'react-router-dom';
import moment from "moment";
import { tp } from "./tp";
import shortcut from "./ext/shortcut";


export default class App extends React.Component {

  constructor(props) {
    console.log("App 생성자 호출..");
    super(props);


    const go = (page) => () => this.props.history.push("/" + page);
    const sa = (keys, func) => keys.split(",").forEach(key => shortcut.add(key, func));
    sa("Alt+W", go("write"));
    sa("Alt+L", go("List"));
    
    

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

    moment.locale('ko');
  }

  shouldComponentUpdate(prevProps, prevState) {
    const render = prevProps.location.pathname !== this.props.location.pathname || prevState !== this.state;
    // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
    console.log("App.shouldComponentUpdate returns [" + render + "]");
    return render;
  }



  render() {
    console.log("App 렌더링..,,");

    const renderList = ({history}) => <List history={history} posts={this.state.data.posts} /> ;
    const renderPost = ({history, match}) => <Post history={history} post={this.state.data.posts.find(post => post.key === match.params.key)} /> ;
    const renderEdit = ({history, match}) => <Edit history={history} post={this.state.data.posts.find(post => post.key === match.params.key)} /> ;

    return (
      <div>
        <Switch>{/*Switch는 매칭되는 첫번재꺼만 보여주고 아래꺼는 버림*/}
          <Route path="/post/:key" render={renderPost} />
          <Route path="/edit/:key" render={renderEdit} />
          <Route path="/write" component={Write} />
          <Route path="/list" render={renderList} />
          <Route path="/" render={renderList} />
        </Switch>
      </div>
    );
  }
}
