//* -------------------------------------------------------------------------- */
//*                                  JWT RECAP                                 */
//* -------------------------------------------------------------------------- */
// With JWT, user state storage is the client's responsibility, and there are multiple
// options for client-side storage besides cookies. On signout, the client needs to
// delete the token on the client-side to establish that the user is no longer authenticated.
// On the server-side, we can use and verify the token that's generated at sign-in to
// protect routes that should not be accessed without valid authentication.

import User from "./../database/models/user.model";
import { Err } from "./../helpers/errors";
import log from "./../../utils/webpack-logger";

const findAndAuthenticateUser = async (email, password) => {
    // Find user by email, if nothing is returned then throw error.
    let user = await User.findOne({ email: email });
    if (!user) throw new Err(400, "User not found!");

    // If user is found, then authenticate password too, otherwise throw error.
    if (!user.isAuthenticated(password))
    throw new Err(400, "Password is incorrect!");
    log.info(`Successfully authenticated -> User '${user.email}'.`);
    return user;
};

export default {
    findAndAuthenticateUser,
};
