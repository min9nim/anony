import { withLogger } from '@/biz'
import { ctx } from '@/biz/context'
import { observeDom } from '@/biz/utils'
import {
  Excerpt,
  ListLoader,
  MenuBoard,
  MyChannels,
  Search,
} from '@/components'
import nprogress from 'nprogress'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { setPosts, setSearch, scrollEnd } from '@/redux/action'
import { connect } from 'react-redux'
import $m from '@@/com/util'
import './List.scss'

const PAGEROWS = 10

function List(props) {
  const [state, setState] = useState({
    channels: props.state.data.channels,
    menuClicked: false,
    loading: false,
  })

  const logoClick = async () => {
    // 기존내용 초기화
    props.setSearch('')
    ctx.noMore = false

    // 다시 세팅
    const res = await ctx.api.getPosts({
      idx: 0,
      cnt: 10,
      context: ctx.context,
    })
    props.setPosts(res.posts)
  }

  const posts = props.state.data.posts.filter((p) => p.origin === undefined)

  // initialize
  useEffect(() => {
    props.logger.verbose('[effect-in] initialize')
    ctx.scrollTop = 0 // 스크롤 위치 초기화
    ctx.view.List = this
    document.title = (ctx.context || 'Anony') + ' - ' + ctx.thispage

    if (props.context && props.context.length > ctx.MAXCONTEXTLEN) {
      alert(`채널이름은 최대 ${ctx.MAXCONTEXTLEN}자 까지 가능합니다`)
      history.back()
      return
    }

    ctx.context =
      props.context && props.context.length <= ctx.MAXCONTEXTLEN
        ? props.context
        : 'public'

    if (
      // 처음부터 글쓰기로 글을 생성하고 들어온 경우
      (props.state.data.posts.filter((p) => p.origin === undefined).length <=
        1 &&
        props.state.view.search === '') ||
      // 글수정화면에서 context를 수정한 경우(posts에 context 가 2개 이상 포함된 경우)
      props.state.data.posts
        .map((p) => p.context)
        .filter((value, index, array) => array.indexOf(value) === index)
        .length > 1
    ) {
      ctx.api
        .getPosts({ idx: 0, cnt: 10, context: ctx.context })
        .then((res) => {
          props.setPosts(res.posts)
        })
    } else {
      console.log('여기 드르와여지??')
      // 이전에 들고있던 글목록이 있다면 굳이 새로 서버로 요청을 다시 보낼 필요가 없음..
    }
    return () => {
      props.logger.verbose('[effect-out] initialize')
    }
  }, [])

  // infinite loading
  useEffect(() => {
    props.logger.verbose('[effect-in] infinite loading')
    ctx.$m.scrollTo(0, ctx.scrollTop) // 이전 스크롤 위치로 복원

    const lastPost = Array.prototype.slice.call(
      document.querySelectorAll('.list > .excerpt'),
      -1,
    )[0]

    if (!lastPost) {
      props.logger.warn('not found lastPost')
      return () => {}
    }
    if (ctx.noMore) {
      props.logger.info('no more data')
      return
    }
    props.logger.info('observe last one')

    const unobserve = observeDom(lastPost, async () => {
      props.logger.info('last one show up', posts.length)

      nprogress.start()
      $m('#nprogress .spinner').css('top', '95%')
      setState({ ...state, loading: true })

      const res = await ctx.api.getPosts({
        idx: posts.length,
        cnt: PAGEROWS,
        search: props.state.view.search,
        hideProgress: true,
        context: ctx.context,
      })
      if (lastPost.observed) {
        props.logger.info('unobserve last one')
        unobserve()
      }

      setState({ ...state, loading: false })

      props.scrollEnd(res.posts)
      if (res.posts.length < PAGEROWS) {
        props.logger.verbose('Scroll has touched bottom')
        ctx.noMore = true
        return
      }
    })
    return () => {
      props.logger.verbose('[effect-out] infinite loading')

      // 현재 목록화면 scrollTop 의 값
      ctx.scrollTop = Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop,
      )

      if (lastPost.observed) {
        props.logger.info('unobserve last one')
        unobserve()
      }
    }
  }, [posts.length])

  props.logger.verbose('render', state.loading)
  //let title = props.state.view.uuid + (ctx.context ? (" /" + ctx.context) : "") ;
  let title = ctx.user.uuid + (ctx.context ? ' /' + ctx.context : '')
  let uuid = ctx.user.uuid
  let channel = ctx.context ? ' /' + ctx.context : ''

  let status = ''
  let search = props.state.view.search

  if (search) {
    status = ` > ${search}'s result`
  }

  return (
    <div className="list">
      <div className="header">
        <div className="logo">
          <img src="/image/logo_transparent.png" onClick={logoClick} />
        </div>
        <Search context={ctx.context} />

        {/* <div className="status">{status}</div> */}

        <div className="menu-title">
          {/* <Menu /> */}
          <div
            className="icon-menu-1 menu"
            onClick={() => setState({ ...state, menuClicked: true })}
          ></div>
          <div className="uuid">{uuid}</div>
        </div>
        <div className="channel">{channel}</div>
      </div>

      {posts.map((post) => (
        <Excerpt
          history={props.history}
          key={post.key}
          post={post}
          context={ctx.context}
        />
      ))}

      {state.loading && <ListLoader />}

      {props.state.view.search !== '' && (
        <div className="backBtn">
          <Button bsStyle="success" onClick={logoClick}>
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

      {state.menuClicked && (
        <MenuBoard
          hideMenu={() => setState({ ...state, menuClicked: false })}
        />
      )}
    </div>
  )
}

export default withLogger(
  connect((state) => ({ state }), { setPosts, setSearch, scrollEnd })(List),
)
