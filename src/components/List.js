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
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { setPosts, setSearch, addPosts, setPostsAsync } from '@/redux/action'
import { connect } from 'react-redux'
import { prop, isNil, pipe, last } from 'ramda'
import { needToFetch, fetchList } from './List-fn'

import './List.scss'

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
    props.setPostsAsync({
      idx: 0,
      cnt: 10,
      context: ctx.context,
    })
  }

  const posts = props.state.data.posts.filter(pipe(prop('origin'), isNil))

  // initialize
  useEffect(() => {
    props.logger.verbose('[effect-in] initialize')
    ctx.scrollTop = 0 // 스크롤 위치 초기화
    document.title = (ctx.context || 'Anony') + ' - ' + ctx.thispage

    if (props.context && props.context.length > ctx.MAXCONTEXTLEN) {
      alert(`채널이름은 최대 ${ctx.MAXCONTEXTLEN}자 까지 가능합니다`)
      history.back()
      return
    }

    if (needToFetch(props)) {
      props.setPostsAsync({ idx: 0, cnt: 10, context: ctx.context })
    }
  }, [])

  // infinite loading
  useEffect(() => {
    props.logger.verbose('[effect-in] infinite loading')
    ctx.$m.scrollTo(0, ctx.scrollTop) // 이전 스크롤 위치로 복원

    const lastPost = last(document.querySelectorAll('.list > .excerpt'))

    if (!lastPost) {
      props.logger.warn('not found lastPost')
      return () => {}
    }
    if (ctx.noMore) {
      props.logger.info('no more data')
      return
    }
    props.logger.info('observe last one')

    const unobserve = observeDom(
      lastPost,
      fetchList(props, posts, state, setState),
    )
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
  connect((state) => ({ state }), {
    setPosts,
    setSearch,
    addPosts,
    setPostsAsync,
  })(List),
)
