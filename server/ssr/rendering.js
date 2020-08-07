import express from 'express'
import path from 'path'

// Modules for server side rendering purposes...
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

// Front End files...
import MainRouter from './../../client/MainRouter'
import theme from './../../client/theme'
import template from './template'

// Material Styling Purposes...
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline';

import log from "./../../utils/webpack-logger"

const CURRENT_WORKING_DIR = process.cwd()

export default function (app) {
    // * Explanation - https://www.digitalocean.com/community/tutorials/react-server-side-rendering
    // * server side rendering to serve static files from /dist
    app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

    // * Server side rendering setup
    // video - https://www.youtube.com/watch?v=8_RzRQXSHcg&t=494s
    // link  - https://www.digitalocean.com/community/tutorials/react-react-router-ssr
    // ui    - https://material-ui.com/guides/server-rendering/
    // Rendering on the server is a bit different since it’s all stateless. The
    // basic idea is that we wrap the app in a stateless <StaticRouter> instead of
    // a <BrowserRouter>. We pass in the requested url from the server so the
    // routes can match and a context prop we’ll discuss next.

    // When you render a <Route> on the client, the browser history changes state
    // and we get the new screen. In a static server environment we can’t change the
    // app state. Instead, we use the context prop to find out what the result of
    // rendering was. If we find a context.url, then we know the app redirected. This
    // allows us to send a proper redirect from the server.

    // '*' path makes it so that all get requests have this process applied
    app.get('*', (req, res) => {
        // The context object is useful to store information about a specific route
        // render, and that information is then made available to the component in
        // the form of a 'staticContext' prop

        // 1. Generate CSS styles using Material-UI's ServerStyleSheets
        const sheets = new ServerStyleSheets()
        const context = {}

        // 2. Use renderToString to generate markup which renders components
        //    specific to the route requested
        const markup = ReactDOMServer.renderToString(
            sheets.collect(
                // StaticRouter is a stateless router that takes the requested URL to match
                // with the frontend route that was declared in the MainRouter component.
                <StaticRouter location={req.url} context={context}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <MainRouter />
                    </ThemeProvider>
                </StaticRouter>
            )
        )

        // log.debug("context:", context)
        // check if the app was redirected
        if (context.url) {
            // log.debug(context.url)
            return res.redirect(303, context.url)
        }

        // Grab the CSS from the sheets.
        const css = sheets.toString()

        // 3. Return template with markup and CSS styles in the response.
        // In other words, send the rendered page back to the client.
        res.status(200).send(template({
            markup: markup,
            css: css
        }))
    })
}