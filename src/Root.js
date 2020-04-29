import React, { useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './App'
import useDarkMode from 'use-dark-mode'

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta')
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i]
    }
  }
  return ''
}

const Root = () => {
  const { value } = useDarkMode(false)
  ctx.logger.info('[Root render] dark value', value)
  useEffect(() => {
    ctx.logger.info('[Root render] effect')
    const meta = getMeta('theme-color')
    meta.setAttribute('content', value ? '#10171d' : '#ddd')
  })

  return (
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  )
}

export default Root
