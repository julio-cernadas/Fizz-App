//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// As you can see from the code below, no logic should go in your routes/routers.
// Routes should chain together your controller functions. So routes are pretty
// simple. Import your controllers and chain together the functions.

import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

//* -------------------------------------------------------------------------- */
//*                               ROUTE - /users                               */
//* -------------------------------------------------------------------------- */
router
    .route("/users")
    // GET - LIST ALL USERS
    .get(userCtrl.list)
    // POST - CREATE NEW USERS
    .post(userCtrl.create);

//* -------------------------------------------------------------------------- */
//*                           ROUTE - /users/:userId                           */
//* -------------------------------------------------------------------------- */
// Whenever the Express app receives a request to a route that matches a path containing
// the :userId parameter in it, the app will execute the userByID controller function,
// which fetches and loads the user into the Express request object, before propagating
// it to the next function that's specific to the request that came in.
router.param("userId", userCtrl.userByID);

// After the 'userId' was processed, then we move onto this part...
// NOTE: these all use 'requireSignIn' for authentication +
// 'hasAuthorization' for authorization. It is important that these ared for security.
router
    .route("/users/:userId")
    // GET - LIST ALL THE USER DETAILS
    // .get(authCtrl.requireSignin, userCtrl.read)
    .get(userCtrl.read)
    // PUT - UPDATE A USER'S DETAILS
    // .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .put(userCtrl.update)
    // DELETE - REMOVE A SPECIFIC USER
    // .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)
    .delete(userCtrl.remove);

export default router;
