import express from "express";

import routes from "./routes/routes";
import serverSideRendering from "./ssr/rendering";
import config from "./../config/config";
import { errorHandler } from "./helpers/errors";

const app = express();

// ! ACTIVATES FRONT END MODULES IN DEV ENVIRONMENT
import compile from './devBundle'
compile(config.env, app)

// * API routes and required middlewares...
routes(config.env, app);

// * Server side rendering setup...
serverSideRendering(app);

// * Error Handler
app.use(errorHandler);

export default app;
