//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// As you can see from the code below, no logic should go in your routes/routers.
// Routes should chain together your controller functions. So routes are pretty
// simple. Import your controllers and chain together the functions.

import express from "express";
import userCtrl from "./../controllers/user.controller";
import authCtrl from "./../controllers/auth.controller";

import { asyncMiddleware, asyncParamware } from "./../helpers/async";

const router = express.Router();

//* -------------------------------------------------------------------------- */
//*                               PARAM - :userId                              */
//* -------------------------------------------------------------------------- */
// This fetches and loads the user into the 'request' object, before propagating
// it to the next function that's specific to the request that came in.
router.param("userId", asyncParamware(userCtrl.userByID)); // this sets 'req.profile'


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
// NOTE: 'requireSignIn' for authentication + 'hasAuthorization' for authorization.
router.route("/users/:userId")
    // GET - LIST ALL THE USER DETAILS
    .get(authCtrl.requireSignin, userCtrl.read)

    // PUT - UPDATE A USER'S DETAILS
    .put(
        authCtrl.requireSignin,
        authCtrl.hasAuthorization,
        asyncMiddleware(userCtrl.update)
    )

    // DELETE - REMOVE A SPECIFIC USER
    .delete(
        authCtrl.requireSignin,
        authCtrl.hasAuthorization,
        asyncMiddleware(userCtrl.remove)
    );


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


export default router;
