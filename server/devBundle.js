import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "./../webpack.config.client.js";

export default function compile (ENV, app) {
    if (ENV === "development") {
        const compiler = webpack(webpackConfig);
        const middleware = webpackMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
        });
        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
    }
}
