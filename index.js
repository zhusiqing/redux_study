import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from "./src/components/app"
import reducer from './src/reducers'

const store = createStore(reducer)

ReactDOM.render (
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('root')
)
