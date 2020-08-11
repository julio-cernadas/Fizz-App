import _ from "lodash";
import fs from "fs";

import Post from "./../database/models/post.model";
import { handle } from "./../helpers/async";
import { Err, InternalErr } from "./../helpers/errors";
import log from "./../../utils/webpack-logger";

//* -------------------------------------------------------------------------- */
//*                               PARAMS - postId                              */
//* -------------------------------------------------------------------------- */
const findPost = async (postId) => {
    const [post, err] = await handle(
        Post.findById(postId).populate("postedBy", "_id name").exec()
    );
    if (err) throw new Err(400, "Post not found, try a different ID!");
    return post;
};

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /posts/new/:userId                         */
//* -------------------------------------------------------------------------- */
const createPost = async (user, err, fields, files) => {
    if (err) throw new Err(400, "Image could not be uploaded, try again!", err);
    const post = new Post(fields);
    post.postedBy = user;
    if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
    }
    await post.save().catch((err) => { throw new Error(err) });
    return post;
};

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /posts/feed/:userId                        */
//* -------------------------------------------------------------------------- */
const getFollowedUsersPosts = async (following) => {
    let [posts, err] = await handle(
        Post.find({ postedBy: { $in: following } })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-created")
            .exec()
    );
    console.log(posts)
    if (err) throw new Error(err);
    return posts;
};

//* -------------------------------------------------------------------------- */
//*                          ROUTE - /posts/by/:userId                         */
//* -------------------------------------------------------------------------- */
const getUserPosts = async (userId) => {
    let [posts, err] = await handle(
        Post.find({ postedBy: userId })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-created")
            .exec()
    );
    if (err) throw new Error(err);
    return posts;
};

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /posts/:postId                           */
//* -------------------------------------------------------------------------- */
const deletePost = async (post) => {
    const deletedPost = await post.remove();
    return deletedPost;
};

//* -------------------------------------------------------------------------- */
//*                     ROUTE - /posts/like ~ /posts/unlike                    */
//* -------------------------------------------------------------------------- */
const updateLikesArray = async (postId, userId, action) => {
    const updateData = {};
    updateData["$" + action] = { likes: userId }; // ==> { $action: { likes: userId } }
    let post = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    const word = action === "push" ? "to" : "from";
    log.info(`Successfully ${action}ed user-${userId} ${word} post-${postId} 'Likes' array`);
    return post;
};

//* -------------------------------------------------------------------------- */
//*                  ROUTE - /posts/comment ~ /posts/uncomment                 */
//* -------------------------------------------------------------------------- */
const updateCommentsArray = async (postId, comment, action) => {
    const updateData = {};
    updateData["$" + action] = { comments: comment }; // ==> { $action: { comments: comment } }
    let post = await Post.findByIdAndUpdate(postId, updateData, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec()
    const word = action === "push" ? "to" : "from";
    log.info(`Successfully ${action}ed comment-'${comment.text}' ${word} post-${postId} 'Comments' array`);
    return post;
}

export default {
    createPost,
    getFollowedUsersPosts,
    getUserPosts,
    findPost,
    deletePost,
    updateLikesArray,
    updateCommentsArray,
};
