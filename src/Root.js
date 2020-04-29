import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './App'
import useDarkMode from 'use-dark-mode'

const Root = () => {
  const { value } = useDarkMode(false)
  ctx.logger.info('dark value', value)
  return (
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  )
}

export default Root
