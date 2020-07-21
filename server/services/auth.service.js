//* -------------------------------------------------------------------------- */
//*                                  JWT RECAP                                 */
//* -------------------------------------------------------------------------- */
// With JWT, user state storage is the client's responsibility, and there are multiple
// options for client-side storage besides cookies. On signout, the client needs to
// delete the token on the client-side to establish that the user is no longer authenticated.
// On the server-side, we can use and verify the token that's generated at sign-in to
// protect routes that should not be accessed without valid authentication.

import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'

import User from "../database/models/user.model";
import config from './../../config/config'
import log from "./../../utils/webpack-logger";

