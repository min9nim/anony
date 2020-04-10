import React, { useEffect } from 'react'
import $m from '../../com/util'
import { Loading } from './Loading'
import './MyChannels.scss'

function handleClick(channel) {
  ctx.context = channel
  ctx.api
    .getPosts({ idx: 0, cnt: 10, context: channel })
    .then((res) => ctx.store.dispatch(ctx.action.setPosts(res.posts)))
    .then(() => {
      ctx.isScrollLast = false
    })
    .then(toggleChannels)
    .then(() => {
      ctx.history.push('/' + channel)
    })
}

function toggleChannels() {
  if ($m('.my-channels').css('display') === 'block') {
    $m('.my-channels').hide()
  } else {
    $m('.my-channels').show()
  }
}

export const MyChannels = (props) => {
  const { channels } = ctx.store.getState().data
  useEffect(() => {
    if (channels.length > 0) {
      return
    }
    // 로드된 채널 정보가 없다면 api 호출
    ctx.api.myChannels().then((res) => {
      ctx.store.dispatch(ctx.action.myChannels(res.output))
    })
  })

  return (
    <div className="my-channels">
      <div className="title">My channels</div>
      {channels.length === 0 ? (
        <Loading className="loading2" name="list" />
      ) : (
        channels.map((item) => {
          return (
            <div
              key={item.name}
              className={ctx.context === item.name ? 'item selected' : 'item'}
              onClick={() => handleClick(item.name)}
            >
              {item.name + '(' + item.count + ')'}
            </div>
          )
        })
      )}
    </div>
  )
}
