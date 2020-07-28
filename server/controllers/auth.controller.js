import expressJwt from "express-jwt"; // Express middleware for validating JWTs

import authServices from "./../services/auth.service";
import config from "./../../config/config";

//* -------------------------------------------------------------------------- */
//*                            ROUTE - /auth/signin                            */
//* -------------------------------------------------------------------------- */
const signin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await authServices.findAndAuthenticateUser(email, password);
    const token = user.getSignedToken();

    // Respond with the signed JWT along with the user's details.
    return res.json({
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};

//* -------------------------------------------------------------------------- */
//*                  AUTHENTICATION & AUTHORIZATION MIDDLEWARE                 */
//* -------------------------------------------------------------------------- */
// Middleware used to verify that the incoming request has a valid JWT in the
// Authorization header. If the token is valid, it appends the verified user's ID in
// an 'auth' key to the request object; otherwise, it throws an authentication error.
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    userProperty: "auth",
});

// This will check whether the authenticated user is the same as the user being updated
// or deleted before the corresponding CRUD controller function is allowed to proceed.
const hasAuthorization = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized)
        return res.status("403").json({ error: "User is not authorized" });
    next();
};

export default {
    signin,
    requireSignin,
    hasAuthorization,
};
