//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// Services should contain the majority of your business logic that encapsulates your
// business requirements, calls your data access layer or models, calls API’s external
// to the Node application, etc. And in general, contains most of your algorithmic code.

// Provides functions for common tasks like the manipulation of arrays and objects.

// TODO: add more validation checks + add validation directory

import _ from "lodash";
import fs from 'fs'

import User from "./../database/models/user.model";
import { handle } from "./../helpers/async";
import { Err, InternalErr } from "./../helpers/errors";
import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
// Find every users profile data to list them in UI...
const getUsers = async () => {
    // Select method here is a space seperated list of desired fields from db.
    // let users = await User.find().select("name email updated created")
    let users = await User.find().select("name email updated created")
        .catch((err) => { throw new InternalErr(err) });
    log.info("Users data successfully selected!");
    return users;
};

// Create a new user with the specified data in params...
const createUser = async (userData) => {
    // Check if user exists.
    let userExists = await User.findOne({ email: userData.email })
        .catch((err) => { throw new InternalErr(err) });
    if (userExists) throw new Err(400, "User already registered.");

    // Safely create the new User object.
    const reqData = _.pick(userData, ["name", "email", "password"]);
    if (!reqData.name || !reqData.email || !reqData.password)
        throw new Err(400, "Missing required fields, try again!");
    const user = new User(reqData);

    // Save User object to DB.
    await user.save()
        .catch((err) => { throw new Error(err) });
    log.info("New user successfuly saved!");
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
// Find a user profile by id in params...
const findUser = async (id) => {
    // Check if user exists, otherwise throw error.
    const [user, err] = await handle(
        User.findById(id)
            .select("-hashed_password -salt")
            .populate("following", "_id name")
            .populate("followers", "_id name")
            .exec()
    );
    if (err) throw new Err(400, "Could not find user, try a different ID!", err);
    log.info(`Found User: ${id}`);
    return user;
};

// Update a user's profile with new data in params...
const updateUser = async (user, err, fields, files) => {
    // If form is properly processed, select the desired data and update User object.
    if (err) throw new Err(400, "Photo could not be uploaded, try again!", err);
    fields = _.pick(fields, ["name", "photo", "about", "email", "password"]);
    user = _.extend(user, fields);
    user.updated = Date.now();

    // Add the uploaded photo to object as well.
    if (files.photo) {
        user.photo.data = fs.readFileSync(files.photo.path);
        user.photo.contentType = files.photo.type;
    }

    // Save all User updates.
    await user.save()
        .catch((err) => { throw new Error(err) });
    log.info("Successfully updated user profile!");
    return user;
};

// Remove user from database...
const deleteUser = async (user) => {
    log.debug("Received user data to be deleted.");
    await user.remove()
        .catch((err) => { throw new Error(err) });
    log.info("Successfully deleted user profile!");
};

//* -------------------------------------------------------------------------- */
//*                   ROUTE - /users/follow ~ /users/unfollow                  */
//* -------------------------------------------------------------------------- */
// Push/pull reference User ID to/from current User's 'Following' array.
const updateFollowingDBArray = async (userId, refId, action) => {
    const updateData = {};
    updateData["$" + action] = { following: refId }; // == { $action: { following: followId }
    await User.findByIdAndUpdate(userId, updateData)
        .catch((err) => { throw new Error(err) });
    const word = (action === "push" ? "to" : "from")
    log.info(`Successfully ${action}ed user-${refId} ${word} user's-${userId} 'Following' array`);
}

// Push/pull current User ID to/from reference User's 'Followers' array.
const updateFollowersDBArray = async (userId, refId, action) => {
    const updateData = {};
    updateData["$" + action] = { followers: userId }; // == { $action: { followers: userId } }
    let user = await User.findByIdAndUpdate(refId, updateData, { new: true })
        .select("-hashed_password -salt")
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec();
    const word = (action === "push" ? "to" : "from")
    log.info(`Successfully ${action}ed user-${userId} ${word} user's-${refId} 'Followers' array`);
    return user;
}

//* -------------------------------------------------------------------------- */
//*                      ROUTE - /users/findpeople/:userId                     */
//* -------------------------------------------------------------------------- */
const findNonFollowedUsers = async (following) => {
    let users = await User.find({ _id: { $nin: following } }).select('name')
        .catch((err) => { throw new Error(err) });
    return users;
}


export default {
    getUsers,
    createUser,
    findUser,
    updateUser,
    deleteUser,
    updateFollowingDBArray,
    updateFollowersDBArray,
    findNonFollowedUsers,
};
