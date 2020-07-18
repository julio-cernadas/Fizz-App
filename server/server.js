import app from "./express";
import mongoose from "mongoose";

import config from "./../config/config";
import log from "../utils/webpack-logger"


// * Connection URL
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

// * Catch Error if not able to connect
// http://thecodebarbarian.com/whats-new-in-mongoose-5-improved-connections.html
mongoose.connection.on("error", () => {
    log.error('Cannot connect to database!')
    throw new Error(`Shutting down application: ${config.mongoUri}`);
});

// * Express starts listening
app.listen(config.port, (err) => {
    if (err) log.error(err);
    log.info("Server started on port %s.", config.port);
});

