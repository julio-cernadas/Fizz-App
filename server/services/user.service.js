//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// Services should contain the majority of your business logic that encapsulates your
// business requirements, calls your data access layer or models, calls API’s external
// to the Node application, etc. And in general, contains most of your algorithmic code.

// Provides functions for common tasks like the manipulation of arrays and objects.
import _ from "lodash";

import User from "./../database/models/user.model";
import { handle } from "./../helpers/async";
import { Err, InternalErr } from "./../helpers/errors";
import log from "./../../utils/webpack-logger";

// TODO:
// - add more validation checks!
// - create validation folder to separate concerns

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
// Find every users profile data to list them in UI...
const getUsers = async () => {
    // Select method here is a space seperated list of desired fields from db
    let users = await User.find().select("name email updated created")
        .catch((err) => { throw new InternalErr(err) });
    log.info("Users data successfully selected!");
    return users;
};

// Create a new user with the specified data in params...
const createUser = async (userData) => {
    // Check if user exists
    let userExists = await User.findOne({ email: userData.email })
        .catch((err) => { throw new InternalErr(err) });
    if (userExists) throw new Err(400, "User already registered.");

    // Safely create the new User object
    const reqData = _.pick(userData, ["name", "email", "password"]);
    if (!reqData.name || !reqData.email || !reqData.password)
        throw new Err(400, "Missing required fields, try again!");
    const user = new User(reqData);

    // Save User object to DB
    await user.save()
        .catch((err) => { throw new Error(err) });
    log.info("New user successfuly saved!");
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
// Find a user profile by id in params...
const findUser = async (id) => {
    // Check if user exists, otherwise throw error
    let [user, err] = await handle(User.findById(id).select("-hashed_password -salt"));
    if (err) throw new Err(400, "Could not find user, try a different ID!")
    log.info(`Found User: ${id}`);
    return user;
};

// Update a user's profile with new data in params...
const updateUser = async (user, updatedData) => {
    // Lodash - extend/merge the changes from the request body to the user profile.
    user = _.extend(user, updatedData);

    // Modify the 'updated' field to reflect the latest updated timestamp.
    user.updated = Date.now();
    await user.save()
        .catch((err) => { throw new Error(err) });
    log.info("Successfully updated user profile!");
};

// Remove user from database...
const deleteUser = async (user) => {
    log.debug("Received user data to be deleted.");
    await user.remove()
        .catch((err) => { throw new Error(err) });
    log.info("Successfully deleted user profile!");
};

export default {
    getUsers,
    createUser,
    findUser,
    updateUser,
    deleteUser,
};
