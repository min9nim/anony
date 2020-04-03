import React, { useEffect } from 'react'
import $m from '../../com/util'
import { Loading } from './Loading'
import './MyChannels.scss'

export const MyChannels = props => {
  const { channels } = tp.store.getState().data
  useEffect(() => {
    if (channels.length > 0) {
      return
    }
    // 로드된 채널 정보가 없다면 api 호출
    tp.api.myChannels().then(res => {
      tp.store.dispatch(tp.action.myChannels(res.output))
    })
  })

  function handleClick(channel) {
    tp.context = channel
    tp.api
      .getPosts({ idx: 0, cnt: 10, context: channel })
      .then(tp.checkStatus)
      .then(res => tp.store.dispatch(tp.action.setPosts(res.posts)))
      .then(() => {
        tp.isScrollLast = false
      })
      .then(toggleChannels)
      .then(() => {
        tp.history.push('/' + channel)
      })
  }

  function toggleChannels() {
    if ($m('.my-channels').css('display') === 'block') {
      $m('.my-channels').hide()
    } else {
      $m('.my-channels').show()
    }
  }

  return (
    <div className="my-channels">
      <div className="title">My channels</div>
      {channels.length === 0 ? (
        <Loading className="loading2" name="list" />
      ) : (
        channels.map(item => {
          return (
            <div
              key={item.name}
              className={tp.context === item.name ? 'item selected' : 'item'}
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
