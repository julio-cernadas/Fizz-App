//* -------------------------------------------------------------------------- */
//*                             ASYNC AWAIT WRAPPER                            */
//* -------------------------------------------------------------------------- */
// EXPLANATION:
// AsyncMiddleware is a function that takes another function and wraps it in a
// promise. Thus this function will take an express route handler, and since we
// are passing that handler into Promise.resolve it will resolve with whatever
// value our route handler returns. If, however, one of the await statements in
// our handler gives us a rejected promise, it will go into the .catch and be
// passed to next which will eventually give the error to our express error middleware.
// So, we eliminate the need to write a try/catch block for every async functio!

export const asyncMiddleware = (fn) => (req, res, next) => {
    Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

export const asyncParamware = (fn) => {
    return function (req, res, next, param) {
        fn(req, res, next, param).catch(next);
    };
}

//* -------------------------------------------------------------------------- */
//*                       GOLANG STYLE ASYNC AWAIT RETURN                      */
//* -------------------------------------------------------------------------- */
// const [data, err] = await handle(asyncFunction(param))
// https://dev.to/sobiodarlington/better-error-handling-with-async-await-2e5m

export const handle = (promise) => {
    return promise
        .then(data => ([data, undefined]))
        .catch(error => Promise.resolve([undefined, error]));
}