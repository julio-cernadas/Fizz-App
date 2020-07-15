// * To handle HTTP requests and serve responses properly, we will use the following modules to configure Express:
import express from 'express'
import path from 'path'

import bodyParser from 'body-parser'
// body-parser: Request body-parsing middleware to handle the complexities of parsing streamable request
// objects so that we can simplify browser-server communication by exchanging JSON in the request body. To
// install the module, run yarn add body-parser from the command line. Then, configure the Express app
// with bodyParser.json() and bodyParser.urlencoded({ extended: true }).

import cookieParser from 'cookie-parser'
// cookie-parser: Cookie parsing middleware to parse and set cookies in request objects. To install
// the cookie-parser module, run yarn add cookie-parser from the command line.

import compress from 'compression'
// compression: Compression middleware that will attempt to compress response bodies for all requests
// that traverse through the middleware. To install the compression module, run yarn add compression from the command line.

import cors from 'cors'
// cors: Middleware to enable cross-origin resource sharing (CORS). To install the cors module,
// run yarn add cors from the command line.

import helmet from 'helmet'
// helmet: Collection of middleware functions to help secure Express apps by setting various HTTP
// headers. To install the helmet module, run yarn add helmet from the command line.

import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

// * modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import { StaticRouter } from 'react-router-dom'

import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'
//end

// ! comment out before building for production ****
import devBundle from './devBundle' // ! ***********

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

// ! comment out before building for production ****
devBundle.compile(app) // ! ************************

// * parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())

// * secure apps by setting various HTTP headers
app.use(helmet())

// * enable CORS - Cross Origin Resource Sharing
app.use(cors())

// * Explanation - https://www.digitalocean.com/community/tutorials/react-server-side-rendering
// * server side rendering to serve static files from /dist
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// * mount api routes
app.use('/', userRoutes)
app.use('/', authRoutes)

// * Server side rendering setup
// video - https://www.youtube.com/watch?v=8_RzRQXSHcg&t=494s
// Rendering on the server is a bit different since it’s all stateless. The basic idea is that we wrap
// the app in a stateless <StaticRouter> instead of a <BrowserRouter>. We pass in the requested url from
// the server so the routes can match and a context prop we’ll discuss next.

// When you render a <Route> on the client, the browser history changes state and we get the new screen.
// In a static server environment we can’t change the app state. Instead, we use the context prop to
// find out what the result of rendering was. If we find a context.url, then we know the app redirected.
// This allows us to send a proper redirect from the server.

// '*' path makes it so that all get requests have this process applied
app.get('*', (req, res) => {
    const sheets = new ServerStyleSheets()
    const context = {}

    // Render the component to a string
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            // server - not the complete story
            <StaticRouter location={req.url} context={context}>
                {/* used for material ui purposes - https://material-ui.com/guides/server-rendering/*/}
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    )

    // check if the app was redirected
    if (context.url) {
        return res.redirect(303, context.url)
    }

    // Grab the CSS from the sheets.
    const css = sheets.toString()

    // Send the rendered page back to the client.
    res.status(200).send(Template({
        markup: markup,
        css: css
    }))
})

// * Catch unauthorised errors
// express-jwt throws an error named UnauthorizedError when a token cannot be validated
// for some reason. We catch this error here to return a 401 status back to the requesting
// client. We also add a response to be sent if other server-side errors are generated and caught here.
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})

export default app
