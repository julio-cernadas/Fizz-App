//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// Think of controllers as “orchestrators”. They call the services, which contain
// more “pure” business logic. But by themselves,controllers don’t really contain
// any logic other than handling the request and calling services. The services
// do most of the work, while the controllers orchestrate the service calls and
// decide what to do with the data or HTTP status code is returned!
// HTTP CODES -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

import formidable from "formidable";

import userServices from "./../services/user.service";
import profileImage from "./../../client/assets/images/profile-pic.png";
import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
//* GET METHOD - Load users
const list = async (req, res) => {
    const users = await userServices.getUsers();
    res.status(200).json(users);
};

//* POST METHOD - Create a new user
const create = async (req, res) => {
    const userData = req.body;
    await userServices.createUser(userData);
    res.status(201).json({
        message: "Successfully signed up!",
    });
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
//* PARAMS MIDDLEWARE for ':userId'
// The userByID controller function uses the value in the :userId parameter
// to query the database by _id and load the matching user's details.
const userByID = async (req, res, next, id) => {
    req.profile = await userServices.findUser(id);
    next();
};

//* GET METHOD - read user details by userId
// This retrieves the user details from req.profile and removes sensitive
// info, such as the hashed_password and salt values, before sending response.
const read = (req, res) => {
    const userProfile = req.profile;
    log.info("Reading user profile data!");
    res.status(200).json(userProfile);
};

//* PUT METHOD - update a user's details by userId
// Note we're receiving form data here, so use Postman!
const update = (req, res) => {
    let user = req.profile;
    log.debug("executed", req)
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        user = await userServices.updateUser(user, err, fields, files);
        res.status(200).json(user);
    });
};

//* DELETE METHOD - remove a user by userId
// This function retrieves the user from req.profile.
const remove = async (req, res) => {
    let user = req.profile;
    await userServices.deleteUser(user);
    res.status(200).json(user);
};

//* -------------------------------------------------------------------------- */
//*                     ROUTE - /users/photos/defaultphoto                     */
//* -------------------------------------------------------------------------- */
// * GET METHOD - fetch default profile photo
const defaultPhoto = (req, res) => {
    log.info("Sending default profile photo!");
    res.sendFile(process.cwd() + profileImage);
};

//* -------------------------------------------------------------------------- */
//*                        ROUTE - /users/photos/:userId                       */
//* -------------------------------------------------------------------------- */
// * GET METHOD - fetch user uploaded profile photo
const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        log.info("Sending user profile photo for -> ", req.profile.name);
        res.set("Content-Type", req.profile.photo.contentType);
        return res.status(200).send(req.profile.photo.data);
    }
    next();
};

//* -------------------------------------------------------------------------- */
//*                   ROUTE - /users/follow ~ /users/unfollow                  */
//* -------------------------------------------------------------------------- */
// * PUT METHOD - add followed user's reference to the current user's 'Following' array
const addFollowing = async (req, res, next) => {
    const { userId, followId } = req.body;
    await userServices.updateFollowingDBArray(userId, followId, "push");
    next();
};

// * PUT METHOD - add current user's reference to the followed user's 'Followers' array
const addFollower = async (req, res) => {
    const { userId, followId } = req.body;
    let user = await userServices.updateFollowersDBArray(userId, followId, "push");
    res.status(200).json(user);
};

// * PUT METHOD - remove followed user's reference from the current user's 'Following' array
const removeFollowing = async (req, res, next) => {
    const { userId, unfollowId } = req.body;
    await userServices.updateFollowingDBArray(userId, unfollowId, "pull");
    next();
};

// * PUT METHOD - remove current user's reference from the followed user's 'Followers' array
const removeFollower = async (req, res) => {
    const { userId, unfollowId } = req.body;
    let user = await userServices.updateFollowersDBArray(userId, unfollowId, "pull");
    res.status(200).json(user);
};

//* -------------------------------------------------------------------------- */
//*                      ROUTE - /users/findpeople/:userId                     */
//* -------------------------------------------------------------------------- */
// * GET METHOD - fetch the list of users that the current user is not following
const findPeople = async (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id); // exlude self from non-followed user search
    let users = await userServices.findNonFollowedUsers(following);
    res.status(200).json(users);
};

export default {
    create,
    userByID,
    read,
    list,
    update,
    remove,
    defaultPhoto,
    photo,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
};
