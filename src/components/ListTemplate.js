import React from 'react'
import {
  Excerpt,
  ListLoader,
  MenuBoard,
  MyChannels,
  Search,
} from '@/components'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './ListTemplate.scss'

export default function ListTemplate({
  logoClick,
  setMenuClicked,
  posts,
  setLoading,
  loading,
  menuClicked,
}) {
  const channel = ctx.context ? ' /' + ctx.context : ''
  return (
    <div className="list">
      <div className="header">
        <div className="logo">
          <img src="/image/logo_transparent.png" onClick={logoClick} />
        </div>
        <Search
          context={ctx.context}
          setLoading={setLoading}
          loading={loading}
        />
        <div className="menu-title">
          {/* <Menu /> */}
          <div
            className="icon-menu-1 menu"
            onClick={() => setMenuClicked(true)}
          ></div>
          <div className="uuid">{ctx.user.uuid}</div>
        </div>
        <div className="channel">{channel}</div>
      </div>

      {posts.map((post) => (
        <Excerpt
          history={ctx.history}
          key={post.key}
          post={post}
          context={ctx.context}
        />
      ))}

      {loading && <ListLoader />}

      {ctx.store.getState().view.search !== '' && (
        <div className="backBtn">
          <Button variant="success" onClick={logoClick}>
            Back
          </Button>
        </div>
      )}

      <div className="writeBtn">
        <Link to={'/' + ctx.context + '/write'}>
          <Button variant="success">
            <i className="icon-doc-new" />
            Write
          </Button>
        </Link>
      </div>

      <div className="channels-wrappter">
        <MyChannels />
      </div>

      {menuClicked && <MenuBoard hideMenu={() => setMenuClicked(false)} />}
    </div>
  )
}
