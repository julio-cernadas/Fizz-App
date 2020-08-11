import express from "express";
import userCtrl from "./../controllers/user.controller";
import authCtrl from "./../controllers/auth.controller";
import postCtrl from './../controllers/post.controller';

import { asyncMiddleware, asyncParamware } from "./../helpers/async";

const router = express.Router();

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /posts/new/:userId'                        */
//* -------------------------------------------------------------------------- */
router.route('/posts/new/:userId')
    // POST - CREATE NEW POST
    // .post(authCtrl.requireSignin, postCtrl.create)
    .post(asyncMiddleware(postCtrl.create))

//* -------------------------------------------------------------------------- */
//*                        ROUTE - /posts/photo/:postId                        */
//* -------------------------------------------------------------------------- */
router.route('/posts/photo/:postId')
    // GET - RETRIEVE A SPECIFIED POST'S PHOTO
    .get(postCtrl.photo)

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /posts/feed/:userId                        */
//* -------------------------------------------------------------------------- */
router.route('/posts/feed/:userId')
    // GET - LIST OF POSTS FROM PEOPLE THE USER IS FOLLOWING
    .get(authCtrl.requireSignin, asyncMiddleware(postCtrl.listNewsFeed))
    // .get(asyncMiddleware(postCtrl.listNewsFeed))

//* -------------------------------------------------------------------------- */
//*                          ROUTE - /posts/by/:userId                         */
//* -------------------------------------------------------------------------- */
router.route('/posts/by/:userId')
    // GET - LIST OF POSTS BY A SPECIFIC USER
    .get(authCtrl.requireSignin, asyncMiddleware(postCtrl.listByUser))
    // .get(asyncMiddleware(postCtrl.listByUser))

//* -------------------------------------------------------------------------- */
//*                     ROUTE - /posts/like ~ /posts/unlike                    */
//* -------------------------------------------------------------------------- */
router.route('/posts/like')
    // PUT - PUSH CURRENT USER'S ID TO THE POST'S LIKES ARRAY
    .put(authCtrl.requireSignin, asyncMiddleware(postCtrl.like))
    // .put(asyncMiddleware(postCtrl.like))

router.route('/posts/unlike')
    // PUT - PULL CURRENT USER'S ID FROM THE POST'S LIKES ARRAY
    .put(authCtrl.requireSignin, asyncMiddleware(postCtrl.unlike))
    // .put(asyncMiddleware(postCtrl.unlike))

//* -------------------------------------------------------------------------- */
//*                  ROUTE - /posts/comment ~ /posts/uncomment                 */
//* -------------------------------------------------------------------------- */
router.route('/posts/comment')
    // PUT - PUSH CURRENT USER'S COMMENT + ID TO THE POST'S COMMENTS ARRAY
    .put(authCtrl.requireSignin, asyncMiddleware(postCtrl.comment))
    // .put(asyncMiddleware(postCtrl.comment))

router.route('/posts/uncomment')
    // PUT - PULL CURRENT USER'S COMMENT + ID FROM THE POST'S COMMENTS ARRAY
    .put(authCtrl.requireSignin, asyncMiddleware(postCtrl.uncomment))
    // .put(asyncMiddleware(postCtrl.uncomment))

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /posts/:postId                           */
//* -------------------------------------------------------------------------- */
router.route('/posts/:postId')
    // DELETE - REMOVE THE SPECIFIED POST BY ID
    .delete(authCtrl.requireSignin, postCtrl.isPoster, asyncMiddleware(postCtrl.remove))

//* -------------------------------------------------------------------------- */
//*                          PARAMS - userId ~ postId                          */
//* -------------------------------------------------------------------------- */
router.param('userId', asyncParamware(userCtrl.userByID))
router.param('postId', asyncParamware(postCtrl.postByID))


export default router;