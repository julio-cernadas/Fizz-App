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

// TODO:
// - add more validation checks!
// - create validation folder to separate concerns

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
// Find every users profile data to list them in UI...
const getUsers = async () => {
    try {// Select method here is a space seperated list of desired fields from db
        let users = await User.find().select("name email updated created");
        log.info("Users data successfully selected!");
        return users;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Create a new user with the specified data in params...
const createUser = async (userData) => {
    try {
        const user = new User(userData);
        log.debug("New user data recieved.");

        await user.save();
        log.info("New user successfuly saved!");
    } catch (err) {
        throw new Error(err.message);
    }
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
// Find a user profile by id in params...
const findUser = async (id) => {
    try {
        let user = await User.findById(id);
        log.info(`Found User: ${id}`)
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Remove secure data from profile before sending back in response...
const removeSensitiveInfo = (profile) => {
    profile.hashed_password = undefined;
    profile.salt = undefined;
    log.debug("Removed sensitive viewable information!");
};

// Update a user's profile with new data in params...
const updateUser = async (user, updatedData) => {
    try {
        log.debug("Received new user data.");
        // Lodash - extend/merge the changes from the request body to the user profile.
        user = extend(user, updatedData);

        // Modify the 'updated' field to reflect the latest updated timestamp.
        user.updated = Date.now();
        await user.save();

        removeSensitiveInfo(user);
        log.info("Successfully updated user profile!");
    } catch (err) {
        throw new Error(err.message);
    }
};

// Remove user from database...
const deleteUser = async (user) => {
    try {
        log.debug("Received user data to be deleted.");
        await user.remove();

        removeSensitiveInfo(user);
        log.info("Successfully deleted user profile!")
    } catch (err) {
        throw new Error(err.message);
    }
}

export default {
    getUsers,
    createUser,
    findUser,
    removeSensitiveInfo,
    updateUser,
    deleteUser,
};
