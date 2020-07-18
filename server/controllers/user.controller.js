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
//*                             ROUTE - /api/users                             */
//* -------------------------------------------------------------------------- */
// * GET METHOD - Load users
const list = async (req, res) => {
    try {
        const users = await userServices.getUsers();
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// * POST METHOD - Create a new user
const create = async (req, res) => {
    try {
        const userData = req.body;
        userServices.createUser(userData);
        return res.status(200).json({
            message: "Successfully signed up!",
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /api/users/:userId                         */
//* -------------------------------------------------------------------------- */
// * GET METHOD - read user details by userId
const read = (req, res) => {
    // This retrieves the user details from req.profile and removes sensitive
    // info, such as the hashed_password and salt values, before sending response
    const userProfile = req.profile;
    log.info("Reading user profile data!")
    userServices.removeSensitiveInfo(userProfile);
    return res.json(userProfile);
};

// * PUT METHOD - update a user's details by userId
const update = async (req, res) => {
    try {
        let { profile: user, body: updatedData } = req;
        await userServices.updateUser(user, updatedData);
        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// * DELETE METHOD - remove a user by userId
const remove = async (req, res) => {
    try {
        // This function retrieves the user from req.profile
        let user = req.profile;

        // Then uses the remove() query to delete the user from the database.
        let deletedUser = await user.remove();

        // On successful deletion, the requesting client is returned the deleted user object in the response.
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        res.json(deletedUser);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// * PARAMS - used for ':userId'
// The userByID controller function uses the value in the :userId parameter
// to query the database by _id and load the matching user's details.
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id);
        if (!user)
            return res.status("400").json({
                error: "User not found",
            });
        req.profile = user;
        next();
    } catch (err) {
        return res.status("400").json({
            error: "Could not retrieve user",
        });
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
