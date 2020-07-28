import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                                 ERROR TYPES                                */
//* -------------------------------------------------------------------------- */
export class Err extends Error {
    constructor(status, message, details = undefined) {
        super();
        this.id = "Err_Class"
        this.status = status;
        this.message = message;
        this.details = details;
    }
}

export class InternalErr extends Err {
    constructor(details) {
        super();
        this.status = 500;
        this.message = "Internal error, try again!";
        this.details = details;
    }
}

//* -------------------------------------------------------------------------- */
//*                                ERROR HANDLER                               */
//* -------------------------------------------------------------------------- */
// INTERESTING CONCEPT:
// https://codeburst.io/better-error-handling-in-express-js-b118fc29e9c7
export function errorHandler(err, req, res, next) {
    if (err.id === "Err_Class") {
        const { status, message, details } = err;
        log.error(message);
        res.status(status).json({
            "Error": {
                "Status": status,
                "Message": message,
                "Details": details,
            },
        });
    } else if (err instanceof Error) {
        const { message } = err;
        log.error(message);
        res.status(400).json({
            "Error": err.message,
        });
    } else {
        log.error(err);
        res.status(500).json({
            "Error": err,
        });
    }
}
