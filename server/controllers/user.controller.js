//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// Think of controllers as “orchestrators”. They call the services, which contain
// more “pure” business logic. But by themselves,controllers don’t really contain
// any logic other than handling the request and calling services. The services
// do most of the work, while the controllers orchestrate the service calls and
// decide what to do with the data or HTTP status code is returned!

import User from "../database/models/user.model";
import userServices from "./../services/user.service";
import errorHandler from "./../helpers/dbErrorHandler";

import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
// * GET METHOD - Load users
const list = async (req, res, next) => {
    try {
        // 'getUsers' returns a promise since it is an async function!
        const users = await userServices.getUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

// * POST METHOD - Create a new user
const create = async (req, res, next) => {
    try {
        const userData = req.body;
        await userServices.createUser(userData);
        return res.status(200).json({
            message: "Successfully signed up!",
        });
    } catch (err) {
        next(err);
    }
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
// * PROCESS PARAMS -> ':userId'
// The userByID controller function uses the value in the :userId parameter
// to query the database by _id and load the matching user's details.
const userByID = async (req, res, next, id) => {
    try {
        const userID = id;
        req.profile = await userServices.findUser(userID);
        next();
    } catch (err) {
        return res.status("400").json({
            error: "Could not retrieve user",
        });
    }
};

// * GET METHOD - read user details by userId
// This retrieves the user details from req.profile and removes sensitive
// info, such as the hashed_password and salt values, before sending response
const read = (req, res, next) => {
    try {
        const userProfile = req.profile;
        log.info("Reading user profile data!");
        userServices.removeSensitiveInfo(userProfile);
        return res.json(userProfile);
    } catch (err) {
        next(err);
    }
};

// * PUT METHOD - update a user's details by userId
const update = async (req, res, next) => {
    try {
        let { profile: user, body: updatedData } = req;
        await userServices.updateUser(user, updatedData);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// * DELETE METHOD - remove a user by userId
// This function retrieves the user from req.profile
const remove = async (req, res, next) => {
    try {
        let user = req.profile;
        await userServices.deleteUser(user);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export default {
    create,
    userByID,
    read,
    list,
    remove,
    update,
};
