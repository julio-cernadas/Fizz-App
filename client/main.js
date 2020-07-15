import React from 'react'
import { hydrate } from 'react-dom'
import App from './App'

// * explanation - hydrate is used to re-render a react app that was server side rendered already
// https://medium.com/@akakankur81/a-quick-overview-on-react-dom-render-and-hydrate-6d0ec6c1b234

hydrate(<App />, document.getElementById('root'))
// This will serve as the entry point to render the complete React app, as already indicated in
// the client-side Webpack configuration