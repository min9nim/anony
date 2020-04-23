import { withLogger } from '@/biz'
import { ctx } from '@/biz/context'
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
import { prop, isNil, pipe } from 'ramda'
import { initializeEffect, infiniteLoadingEffect } from './List-fn'
import './List.scss'

function List(props) {
  const [state, setState] = useState({
    channels: props.state.data.channels,
    menuClicked: false,
    loading: false,
  })

  const setLoading = (loading) => {
    setState({ ...state, loading })
  }

  const logoClick = () => {
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
  useEffect(initializeEffect(props), [])

  // infinite loading
  useEffect(infiniteLoadingEffect(props, setLoading), [posts.length])

  props.logger.verbose('render', state.loading)
  let uuid = ctx.user.uuid
  let channel = ctx.context ? ' /' + ctx.context : ''
  let search = props.state.view.search
  let status = search ? (status = ` > ${search}'s result`) : ''

  return (
    <div className="list">
      <div className="header">
        <div className="logo">
          <img src="/image/logo_transparent.png" onClick={logoClick} />
        </div>
        <Search
          context={ctx.context}
          setLoading={setLoading}
          loading={state.loading}
        />
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
