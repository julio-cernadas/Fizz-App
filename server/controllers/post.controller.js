import formidable from "formidable";

import postServices from "./../services/post.service";
import { Err } from "./../helpers/errors";
import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /posts/new/:userId'                        */
//* -------------------------------------------------------------------------- */
//* POST METHOD - user creates a new post.
const create = async (req, res) => {
    const user = req.profile
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        const post = await postServices.createPost(user, err, fields, files);
        res.status(201).json(post);
    });
};

//* -------------------------------------------------------------------------- */
//*                        ROUTE - /posts/photo/:postId                        */
//* -------------------------------------------------------------------------- */
//* PARAMS MIDDLEWARE for ':photoId'.
const postByID = async (req, res, next, id) => {
    req.post = await postServices.findPost(id);
    next();
};

//* GET - retrieve a specified post's photo.
const photo = (req, res) => {
    res.set("Content-Type", req.post.photo.contentType);
    res.status(200).send(req.post.photo.data);
};

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /posts/feed/:userId                        */
//* -------------------------------------------------------------------------- */
//* GET METHOD - list of posts from all the users a specified user is following.
const listNewsFeed = async (req, res) => {
    const following = req.profile.following;
    // following.push(req.profile._id)
    let posts = await postServices.getFollowedUsersPosts(following);
    res.status(200).json(posts);
};

//* -------------------------------------------------------------------------- */
//*                          ROUTE - /posts/by/:userId                         */
//* -------------------------------------------------------------------------- */
//* GET METHOD - list of posts from a specified user.
const listByUser = async (req, res) => {
    const userId = req.profile._id;
    let posts = await postServices.getUserPosts(userId);
    res.status(200).json(posts);
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /posts/:postId                           */
//* -------------------------------------------------------------------------- */
//* DELETE METHOD - ensure the post belongs to the user whose attempting to delete it.
const isPoster = (req, res, next) => {
    log.debug(req.post)
    let isPoster = (req.post && req.auth) && (req.post.postedBy._id == req.auth._id);
    if (!isPoster) throw new Err(403, "User is not authorized");
    next();
};

//* DELETE METHOD - after authenticating 'isPoster', safely remove the post from DB.
const remove = async (req, res) => {
    let post = req.post;
    const deletedPost = await postServices.deletePost(post);
    res.json(deletedPost);
};

//* -------------------------------------------------------------------------- */
//*                     ROUTE - /posts/like ~ /posts/unlike                    */
//* -------------------------------------------------------------------------- */
//* PUT METHOD - push the User's id to the Post's 'Likes' array.
const like = async (req, res) => {
    const { postId, userId } = req.body;
    const post = await postServices.updateLikesArray(postId, userId, "push");
    res.status(200).json(post)
}

//* PUT METHOD - pull the User's id from the Post's 'Likes' array.
const unlike = async (req, res) => {
    const { postId, userId } = req.body;
    const post = await postServices.updateLikesArray(postId, userId, "pull");
    res.status(200).json(post);
}

//* -------------------------------------------------------------------------- */
//*                  ROUTE - /posts/comment ~ /posts/uncomment                 */
//* -------------------------------------------------------------------------- */
//* PUT - push current user's comment + id to the Post's 'Comments' array.
const comment = async (req, res) => {
    const { postId, comment, userId } = req.body;
    comment.postedBy = userId;
    const post = await postServices.updateCommentsArray(postId, comment, "push")
    res.status(200).json(post)
}

//* PUT - pull current user's comment + id from the Post's 'Comments' array.
const uncomment = async (req, res) => {
    const { postId, comment } = req.body.comment;
    const post = await postServices.updateCommentsArray(postId, { _id: comment._id }, "pull")
    res.status(200).json(post)
}


export default {
    create,
    photo,
    postByID,
    listNewsFeed,
    listByUser,
    remove,
    isPoster,
    like,
    unlike,
    comment,
    uncomment,
};
