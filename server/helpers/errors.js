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
        console.log(err)
        const { status, message, details } = err;
        log.error(message);
        res.status(status).json({
            "error": {
                "status": status,
                "message": message,
                "details": details,
            },
        });
    } else if (err instanceof Error) {
        const { message } = err;
        log.error(message);
        console.log(err)
        res.status(400).json({
            "error": err.name + ": " + err.message,
        });
    } else {
        console.log(err)
        log.error(err);
        res.status(500).json({
            "error": err,
        });
    }
}
