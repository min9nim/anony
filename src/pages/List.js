import React from 'react'
import { Button } from 'react-bootstrap'
import {
  Excerpt,
  MenuBoard,
  Search,
  ListLoader,
  MyChannels,
} from '../components'
import { ctx } from '@/biz/context'
import { Link } from 'react-router-dom'
import nprogress from 'nprogress'
import $m from '../../com/util'

import './List.scss'

export default class List extends React.Component {
  constructor(props) {
    super(props)
    this.logoClick = this.logoClick.bind(this)

    this.state = {
      channels: ctx.store.getState().data.channels,
      comments: [],
      posts: ctx.store
        .getState()
        .data.posts.filter(p => p.origin === undefined),
      menuClicked: false,
    }

    ctx.view.List = this

    if (this.props.context && this.props.context.length > ctx.MAXCONTEXTLEN) {
      alert(`채널이름은 최대 ${ctx.MAXCONTEXTLEN}자 까지 가능합니다`)
      history.back()
      return
    }

    ctx.context =
      this.props.context && this.props.context.length <= ctx.MAXCONTEXTLEN
        ? this.props.context
        : 'public'

    //if(ctx.view.App.state.data.posts.length <= 1 && ctx.store.getState().view.search === ""){
    if (
      // 처음부터 글쓰기로 글을 생성하고 들어온 경우
      (ctx.store.getState().data.posts.filter(p => p.origin === undefined)
        .length <= 1 &&
        ctx.store.getState().view.search === '') ||
      // 글수정화면에서 context를 수정한 경우(posts에 context 가 2개 이상 포함된 경우)
      ctx.store
        .getState()
        .data.posts.map(p => p.context)
        .filter((v, i, a) => a.indexOf(v) === i).length > 1
    ) {
      ctx.api
        .getPosts({ idx: 0, cnt: 10, context: ctx.context })
        .then(res => ctx.store.dispatch(ctx.action.setPosts(res.posts)))
    } else {
      // 이전에 들고있던 글목록이 있다면 굳이 새로 서버로 요청을 다시 보낼 필요가 없음..
    }
  }

  componentWillUnmount() {
    //ctx.logger.verbose("# List unsubscribe store..");
    this.unsubscribe()
  }

  componentDidMount() {
    document.title = (ctx.context || 'Anony') + ' - ' + ctx.thispage
    ctx.$m.scrollTo(0, ctx.scrollTop) // 이전 스크롤 위치로 복원
    // 이후 App 가 스토어 상태를 구독하도록 설정
    this.unsubscribe = ctx.store.subscribe(() => {
      // ctx.logger.verbose("List가 store 상태 변경 노티 받음")
      this.setState(ctx.store.getState().data)
    })
  }

  logoClick() {
    // 기존내용 초기화
    ctx.store.dispatch(ctx.action.setSearch(''))
    //ctx.store.dispatch(ctx.action.initPosts());
    ctx.isScrollLast = false

    // 다시 세팅
    ctx.api
      .getPosts({ idx: 0, cnt: 10, context: ctx.context })
      //.then(res => ctx.store.dispatch(ctx.action.addPosts(res.posts)));
      .then(res => ctx.store.dispatch(ctx.action.setPosts(res.posts)))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.posts !== nextState.posts) {
      return true
    }
    if (this.state.channels !== nextState.channels) {
      return true
    }
    if (this.state.menuClicked !== nextState.menuClicked) {
      return true
    } else {
      ctx.logger.verbose('List 렌더링 안함 ')
      return false
    }
  }

  render() {
    //let title = ctx.store.getState().view.uuid + (ctx.context ? (" /" + ctx.context) : "") ;
    let title = ctx.user.uuid + (ctx.context ? ' /' + ctx.context : '')
    let uuid = ctx.user.uuid
    let channel = ctx.context ? ' /' + ctx.context : ''

    let status = ''
    let search = ctx.store.getState().view.search

    if (search) {
      status = ` > ${search}'s result`
    }

    return (
      <div className="list">
        <div className="header">
          <div className="logo">
            <img src="/image/logo_transparent.png" onClick={this.logoClick} />
          </div>
          <Search context={ctx.context} />

          {/* <div className="status">{status}</div> */}

          <div className="menu-title">
            {/* <Menu /> */}
            <div
              className="icon-menu-1 menu"
              onClick={() => this.setState({ menuClicked: true })}
            ></div>
            <div className="uuid">{uuid}</div>
          </div>
          <div className="channel">{channel}</div>
        </div>

        {this.state.posts.map(post => (
          <Excerpt
            history={this.props.history}
            key={post.key}
            post={post}
            context={ctx.context}
          />
        ))}

        <ListLoader />

        {ctx.store.getState().view.search !== '' && (
          <div className="backBtn">
            <Button bsStyle="success" onClick={this.logoClick}>
              Back
            </Button>
          </div>
        )}

        <div className="writeBtn">
          <Link to={'/' + ctx.context + '/write'}>
            <Button bsStyle="success">
              <i className="icon-doc-new" />
              Write
            </Button>
          </Link>
        </div>

        <div className="channels-wrappter">
          <MyChannels />
        </div>

        {this.state.menuClicked && <MenuBoard />}
      </div>
    )
  }
}

document.body.onscroll = function() {
  const PAGEROWS = 10

  if (ctx.thispage !== 'List') {
    // 목록화면이 아니면 리턴
    return
  }
  if (ctx.view.ListLoader.state.loading) {
    // 데이터 로딩중이면 리턴
    return
  }

  // 현재 목록화면 scrollTop 의 값
  const scrollTop = Math.max(
    document.documentElement.scrollTop,
    document.body.scrollTop,
  )

  // 현재 스크롤 값을 전역변수에 저장
  ctx.scrollTop = scrollTop

  if (ctx.isScrollLast) return
  // 아직 모든 글이 로드된 상태가 아니라면 스크롤이 아래까지 내려왔을 때 다음 글 10개 로드

  //현재문서의 높이
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  )
  //현재 화면 높이 값
  const clientHeight = document.documentElement.clientHeight

  // ctx.logger.verbose('@@ scrollTop : ' + scrollTop)
  // ctx.logger.verbose('clientHeight : ' + clientHeight)
  // ctx.logger.verbose('scrollHeight : ' + scrollHeight)

  if (
    scrollTop + clientHeight == scrollHeight || // 일반적인 경우(데스크탑: 크롬/파폭, 아이폰: 사파리)
    //(ctx.isMobileChrome() && (scrollTop + clientHeight > scrollHeight - 10))   // 모바일 크롬(55는 위에 statusbar 의 높이 때문인건가)
    (ctx.isMobileChrome() && scrollTop + clientHeight > scrollHeight - 57) // 모바일 크롬(55는 위에 statusbar 의 높이 때문인건가)
  ) {
    //스크롤이 마지막일때
    ctx.logger.verbose('@@ 다음 페이지 호출~')

    /*
     * 18.09.19 min9nim
     * 아래와 같이 분기 처리하면 데스크탑 크롬에서 스크롤이 마지막에 닿고나서 요청이 여러번 한꺼번에 올라가는 문제 발생
     * //if ((scrollTop + clientHeight) >= scrollHeight-55) {
     */

    //ctx.logger.verbose("scrollTop + clientHeight = " + (scrollTop + clientHeight));
    //ctx.logger.verbose("scrollHeight = " + scrollHeight);

    nprogress.start()
    $m('#nprogress .spinner').css('top', '95%')
    ctx.view.ListLoader.setState({ loading: true })
    ctx.api
      .getPosts({
        idx: ctx.store.getState().data.posts.filter(p => p.origin === undefined)
          .length,
        cnt: PAGEROWS,
        search: ctx.store.getState().view.search,
        hideProgress: true,
        context: ctx.context,
      })
      .then(res => {
        ctx.view.ListLoader.setState({ loading: false })
        ctx.store.dispatch(ctx.action.scrollEnd(res.posts))
        if (res.posts.length < PAGEROWS) {
          //ctx.logger.verbose("Scroll has touched bottom")
          ctx.isScrollLast = true
          return
        }
      })
  }
}
