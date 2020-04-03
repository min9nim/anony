import React from 'react'
import { AlertDismissable, Confirm } from './components'
import { Route, Switch } from 'react-router-dom'
import { tp } from './tp.js'
import { createStore } from 'redux'
import { reducer } from './redux/reducer'
import { render, initializeShortcut } from './helper'

export default class App extends React.Component {
  constructor(props) {
    super(props)
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

    initializeShortcut(this.props.history, context)

    tp.history = this.props.history

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
  }

  shouldComponentUpdate(nextProps, nextState) {
    const render = nextProps.location.pathname !== this.props.location.pathname
    //|| !R.equals(nextState, this.state)
    // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
    //console.log("App.shouldComponentUpdate returns [" + render + "]");
    return render
  }

  render() {
    let tmp = decodeURI(location.pathname.split('/')[1])
    tp.context = tmp === 'post' ? '' : tmp

    return (
      <div>
        <Switch>
          {/*Switch는 매칭되는 첫번재꺼만 보여주고 아래꺼는 버림*/}
          {/* public */}
          <Route path="/post/:key" render={render('Post')} />
          <Route path="/postHistory/:key" render={render('PostHistory')} />
          <Route path="/edit/:key" render={render('Edit')} />
          <Route path="/write" render={render('Write')} />
          <Route path="/list" render={render('List')} />

          {/* context */}
          <Route path="/:context/post/:key" render={render('Post')} />
          <Route
            path="/:context/postHistory/:key"
            render={render('PostHistory')}
          />
          <Route path="/:context/edit/:key" render={render('Edit')} />
          <Route path="/:context/write" render={render('Write')} />
          <Route path="/:context/list" render={render('List')} />
          <Route path="/:context" render={render('List')} />

          <Route path="/" render={render('Write')} />
        </Switch>
        <AlertDismissable />
        <Confirm />
      </div>
    )
  }
}
