//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// Services should contain the majority of your business logic that encapsulates your
// business requirements, calls your data access layer or models, calls API’s external
// to the Node application, etc. And in general, contains most of your algorithmic code.

// Provides functions for common tasks like the manipulation of arrays and objects.
import extend from "lodash/extend";

import User from "../database/models/user.model";
import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
const getUsers = async () => {
    // Select method here is a space seperated list of desired fields from db
    let users = await User.find().select("name email updated created");
    log.info("Users data successfully selected!");
    return users;
};

const createUser = async (userData) => {
    const user = new User(userData);
    log.debug("New user data recieved.", userData);

    await user.save();
    log.info("New user successfuly saved!");
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
const removeSensitiveInfo = (profile) => {
    profile.hashed_password = undefined;
    profile.salt = undefined;
    log.debug("Removed sensitive viewable information!");
};

const updateUser = async (user, updatedData) => {
    log.debug("Received new user data.");
    // Lodash - extend/merge the changes from the request body to the user profile.
    user = extend(user, updatedData);

    // Modify the 'updated' field to reflect the latest updated timestamp.
    user.updated = Date.now();

    // Save the updated user object to the DB.
    await user.save();
    removeSensitiveInfo(user);
    log.info("Successfully updated user profile!");
};

export default {
    getUsers,
    createUser,
    removeSensitiveInfo,
    updateUser,
};
