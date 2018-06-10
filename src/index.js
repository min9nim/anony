import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import "../node_modules/nprogress/nprogress.css"; // css를 따로 땡겨야 하는게 상당히 거슬리네 거 참.. 허허..
import './css/style.scss';
import Root from './Root';

ReactDOM.render(
  <AppContainer>
    <Root/>
  </AppContainer>,
  document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
        <NextApp/>
      </AppContainer>
      , document.getElementById('root')
    );
  });
}