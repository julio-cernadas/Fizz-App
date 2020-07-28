// Set up app to report and generate logs files about the user’s requests.
import morgan from "morgan";

// Body-parsing middleware for exchanging JSON in the request body.
import bodyParser from "body-parser";

// Cookie parsing middleware to parse and set cookies in request objects.
import cookieParser from "cookie-parser";

// Compresses response bodies for requests that traverse through the middleware.
import compress from "compression";

// Helps secure apps by setting many HTTP headers.
import helmet from "helmet";

// Middleware to enable cross origin resource sharing.
import cors from "cors";

// API routes for Express
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

import log from "./../../utils/webpack-logger";

export default function (ENV, app) {
    // Enable 'morgan' for development envs..
    if (ENV === "development") {
        app.use(morgan("tiny"));
        log.info("Morgan Enabled...");
    }

    // Apply middlewares from above...
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(compress());
    app.use(helmet());
    app.use(cors());

    // Mount API routes to Express...
    app.use("/api/v1", userRoutes);
    app.use("/api/v1", authRoutes);
}