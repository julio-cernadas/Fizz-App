const path = require('path')

const CURRENT_WORKING_DIR = process.cwd()

const config = {
    mode: "production",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR, '/dist'),
        filename: 'bundle.js',
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            }
        ]
    }
}

module.exports = config


//* -------------------------------------------------------------------------- */
//*                                   CONFIGS                                  */
//* -------------------------------------------------------------------------- */
// This will configure Webpack to bundle the React code to be used in production mode. The configuration
// here is similar to the client-side configuration for development mode, but without the hot-reloading
// plugin and debug configuration as these will not be required in production.

// With the bundling configurations in place, we can add configuration for running these generated
// bundles automatically on code updates during development using Nodemon.