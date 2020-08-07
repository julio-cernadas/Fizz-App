import React from 'react'
import { hydrate } from 'react-dom'
import App from './App'

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// The hydrate function hydrates a container that already has HTML content rendered
// by ReactDOMServer. This means the server-rendered markup is preserved and only
// event handlers are attached when React takes over in the browser, allowing the
// initial load performance to be better. With basic server-side rendering
// implemented, direct requests to the frontend routes from the browser address
// bar can now be handled properly by the server, making it possible to bookmark
// the React frontend views.
// https://medium.com/@akakankur81a-quick-overview-on-react-dom-render-and-hydrate-6d0ec6c1b234

hydrate(<App />, document.getElementById('root'))
// This is used to re-render a react app that was already server side rendered.
// This will serve as the entry point to render the complete React app, as
// indicated in the client-side Webpack configuration