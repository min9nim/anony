import { withLogger } from '@/biz'
import { ctx } from '@/biz/context'
import React, { useEffect, useState } from 'react'
import { setPosts, setSearch, addPosts, setPostsAsync } from '@/redux/action'
import { connect } from 'react-redux'
import { prop, isNil, pipe } from 'ramda'
import { initializeEffect, infiniteLoadingEffect } from './List-fn'
import './List.scss'
import ListTemplate from './ListTemplate'

function List(props) {
  const [loading, setLoading] = useState(false)
  const [menuClicked, setMenuClicked] = useState(false)

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

  return (
    <ListTemplate
      logoClick={logoClick}
      posts={posts}
      loading={loading}
      setLoading={setLoading}
      menuClicked={menuClicked}
      setMenuClicked={setMenuClicked}
    />
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
