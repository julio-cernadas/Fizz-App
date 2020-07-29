//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// As you can see from the code below, no logic should go in your routes/routers.
// Routes should chain together your controller functions. So routes are pretty
// simple. Import your controllers and chain together the functions.
// NOTE: 'requireSignIn' for authentication + 'hasAuthorization' for authorization.

import express from "express";
import userCtrl from "./../controllers/user.controller";
import authCtrl from "./../controllers/auth.controller";

import { asyncMiddleware, asyncParamware } from "./../helpers/async";

const router = express.Router();


//* -------------------------------------------------------------------------- */
//*                     ROUTE - /users/photos/defaultphoto                     */
//* -------------------------------------------------------------------------- */
router.route("/users/photos/defaultphoto")
    // GET - DEFAULT USER PROFILE PHOTO
    .get(userCtrl.defaultPhoto);


//* -------------------------------------------------------------------------- */
//*                        ROUTE - /users/photos/:userId                       */
//* -------------------------------------------------------------------------- */
router.route("/users/photos/:userId")
    // GET - USER UPLOADED PROFILE PHOTO
    .get(userCtrl.photo, userCtrl.defaultPhoto);


//* -------------------------------------------------------------------------- */
//*                            ROUTE - /users/follow                           */
//* -------------------------------------------------------------------------- */
router.route('/users/follow')
    // PUT - ADD TO FOLLOWING AND FOLLOWERS REFERENCE ARRAY
    // ! .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower)
    .put(asyncMiddleware(userCtrl.addFollowing), asyncMiddleware(userCtrl.addFollower))


//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/unfollow                          */
//* -------------------------------------------------------------------------- */
router.route('/users/unfollow')
    // PUT - REMOVE FROM FOLLOWING AND FOLLOWERS REFERENCE ARRAY
    // ! .put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower)
    .put(asyncMiddleware(userCtrl.removeFollowing), asyncMiddleware(userCtrl.removeFollower))


//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
router.route("/users")
// GET - LIST ALL USERS
.get(asyncMiddleware(userCtrl.list))
// POST - CREATE NEW USERS
.post(asyncMiddleware(userCtrl.create));


//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
router.route("/users/:userId")
    // GET - LIST ALL THE USER DETAILS
    // ! .get(authCtrl.requireSignin, userCtrl.read)
    .get(userCtrl.read)

    // PUT - UPDATE A USER'S DETAILS
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, asyncMiddleware(userCtrl.update))

    // DELETE - REMOVE A SPECIFIC USER
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, asyncMiddleware(userCtrl.remove));


//* -------------------------------------------------------------------------- */
//*                      ROUTE - /users/findpeople/:userId                     */
//* -------------------------------------------------------------------------- */
router.route('/users/findpeople/:userId')
    // GET - LIST USERS NOT FOLLOWED BY CURRENT USER
    // ! .get(authCtrl.requireSignin, userCtrl.findPeople)
    .get(userCtrl.findPeople);


//* -------------------------------------------------------------------------- */
//*                               PARAM - :userId                              */
//* -------------------------------------------------------------------------- */
// This fetches and loads the user into the 'request' object, before propagating
// it to the next function that's specific to the request that came in.
router.param("userId", asyncParamware(userCtrl.userByID)); // sets 'req.profile'



export default router;
