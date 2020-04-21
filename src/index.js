import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import '../node_modules/nprogress/nprogress.css' // css를 따로 땡겨야 하는게 상당히 거슬리네 거 참.. 허허..
import './css/style.scss'
import Root from './Root'
import store from './redux/store'

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <Root />
    </Provider>
  </AppContainer>,
  document.getElementById('root'),
)
// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
