import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
//import App from './App';
import Root from './Root';
import './css/style.scss';

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