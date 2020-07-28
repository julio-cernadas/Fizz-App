import db from "./database/setup";
import app from "./express";
import config from "./../config/config";
import log from "./../utils/webpack-logger";

// * Establish MongoDB Connection
db(config.mongoUri);

// * Express Server/Listening
app.listen(config.port, () => {
    log.info(`Server Started On Port: ${config.port}`);
});