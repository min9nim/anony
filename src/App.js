import React from 'react'
//import {List, Write, Post, Edit, PostHistory } from "./pages";
//import List from "./pages/List";
import { AlertDismissable, Confirm } from './components'
import { Route, Switch } from 'react-router-dom'
//import moment from "moment";
import shortcut from './ext/shortcut'
import { tp } from './tp.js'
import { createStore } from 'redux'
import { reducer } from './redux/reducer'
//import {R} from "ramda";
const R = require('ramda')

export default class App extends React.Component {
  constructor(props) {
    // console.log("App 생성자 호출!!");
    super(props)

    //const contextname = $m._go(location.pathname, R.split("/"), R.prop(1));
    const contextname = location.pathname.split('/')[1]
    const context = [
      '',
      'list',
      'post',
      'edit',
      'postHistory',
      'write',
    ].includes(contextname)
      ? ''
      : '/' + contextname

    shortcut.add('Alt+W', () => this.props.history.push(context + '/write'))
    shortcut.add('Alt+L', () => this.props.history.push(context + '/list'))
    shortcut.add('Alt+E', () => {
      if (location.pathname.includes('post')) {
        // 글보기 화면인 경우에만
        this.props.history.push(location.pathname.replace('post', 'edit'))
      }
    })

    tp.history = this.props.history

    // 초기상태 정의
    // this.state = {
    //   view: {
    //     search: "",
    //     uuid: tp.user.uuid
    //   },
    //   data: {
    //     posts: [],        // 전체 글
    //     comments: []     // 전체 댓글
    //   }
    // };

    tp.view.App = this

    // 스토어 최초 한번 생성
    tp.store = createStore(reducer, {
      view: {
        search: '',
        uuid: tp.user.uuid,
      },
      data: {
        posts: [], // 전체 글
        comments: [], // 전체 댓글
      },
    })

    // 상태 변화에 따라 App에서 달라질 것은 없다고 판단되어 아래를 주석처리 18/08/08, 대신 List와 Post에서 직접 상태를 구독하는 것으로 함
    // 이후 App 가 스토어 상태를 구독하도록 설정
    // this.unsubscribe = tp.store.subscribe(() => {
    //     this.setState(tp.store.getState());
    // });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const render = nextProps.location.pathname !== this.props.location.pathname
    //|| !R.equals(nextState, this.state)
    // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
    //console.log("App.shouldComponentUpdate returns [" + render + "]");
    return render
  }

  // componentWillUnmount(){
  //   console.log("# App unsubscribe store..");
  //   this.unsubscribe();
  // }

  render() {
    // console.log("App 렌더링..");
    let tmp = decodeURI(location.pathname.split('/')[1])
    tp.context = tmp === 'post' ? '' : tmp

    const renderList = ({ history, match }) => {
      tp.thispage = 'List'
      const List = tp.asyncComponent(
        () => import(/* webpackChunkName: "List"  */ './pages/List'),
        '/pages/List',
      )
      //const List2 = List;
      //return <List history={history} posts={this.state.data.posts.filter(p => p.origin === undefined && p.isPrivate !== true)} context={match.params.context}/> ;
      return <List history={history} context={match.params.context} />
    }
    const renderPost = ({ history, match }) => {
      tp.thispage = 'Post'
      const Post = tp.asyncComponent(
        () => import(/* webpackChunkName: "Post"  */ './pages/Post'),
        '/pages/Post',
      )
      //return <Post history={history} postKey={match.params.key} post={this.state.data.posts.find(post => post.key === match.params.key)} context={match.params.context}/> ;
      return (
        <Post
          history={history}
          postKey={match.params.key}
          context={match.params.context}
        />
      )
    }
    const renderEdit = ({ history, match }) => {
      tp.thispage = 'Edit'
      const Edit = tp.asyncComponent(
        () => import(/* webpackChunkName: "Write"  */ './pages/Write'),
        '/pages/Write',
      )
      //return <Edit history={history} postKey={match.params.key} post={this.state.data.posts.find(post => post.key === match.params.key)} context={match.params.context}/> ;
      return (
        <Edit
          type="edit"
          history={history}
          postKey={match.params.key}
          context={match.params.context}
        />
      )
    }
    const renderWrite = ({ history, match }) => {
      tp.thispage = 'Write'
      const Write = tp.asyncComponent(
        () => import(/* webpackChunkName: "Write"  */ './pages/Write'),
        '/pages/Write',
      )
      return <Write history={history} context={match.params.context} />
    }
    const renderPostHistory = ({ history, match }) => {
      tp.thispage = 'PostHistory'
      const PostHistory = tp.asyncComponent(
        () =>
          import(/* webpackChunkName: "PostHistory"  */ './pages/PostHistory'),
        '/pages/PostHistory',
      )
      //return <PostHistory history={history} postKey={match.params.key} phist={this.state.data.posts.filter(p=> p.origin === match.params.key)} context={match.params.context}/> ;
      return (
        <PostHistory
          history={history}
          postKey={match.params.key}
          context={match.params.context}
        />
      )
    }

    return (
      <div>
        <Switch>
          {/*Switch는 매칭되는 첫번재꺼만 보여주고 아래꺼는 버림*/}
          {/* public */}
          <Route path="/post/:key" render={renderPost} />
          <Route path="/postHistory/:key" render={renderPostHistory} />
          <Route path="/edit/:key" render={renderEdit} />
          <Route path="/write" render={renderWrite} />
          <Route path="/list" render={renderList} />

          {/* context */}
          <Route path="/:context/post/:key" render={renderPost} />
          <Route path="/:context/postHistory/:key" render={renderPostHistory} />
          <Route path="/:context/edit/:key" render={renderEdit} />
          <Route path="/:context/write" render={renderWrite} />
          <Route path="/:context/list" render={renderList} />
          <Route path="/:context" render={renderList} />

          <Route path="/" render={renderWrite} />
        </Switch>
        <AlertDismissable />
        <Confirm />
      </div>
    )
  }
}
