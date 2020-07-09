// Webpack will compile client-side code in both development and production mode, then place the bundled
// files in the dist folder. To make these static files available on requests from the client side, we
// will add the following code in server.js to serve static files from the dist folder:

import path from 'path'
import express from 'express'
import { MongoClient } from 'mongodb'
import template from './../template'

// * comment out before building for production ****
import devBundle from './devBundle'

// * initialize express server
const app = express()

// * comment out before building for production ****
devBundle.compile(app)

// * This will configure the Express app to return/serve static files from the dist folder
// * when the requested route starts with /dist.
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// * When the server receives a request at the root URL /, we will render template.js in the browser.
app.get('/', (req, res) => {
    res.status(200).send(template())
})

// * Configure the Express app to start a server that listens on the specified port for incoming requests.
let port = process.env.PORT || 3000
app.listen(port, function onStart(err) {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', port)
})

// * Database Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernSimpleSetup'

// * Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    console.log("Connected successfully to mongodb server")
    db.close()
})
