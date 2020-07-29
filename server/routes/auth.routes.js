import express from "express";

import authCtrl from "./../controllers/auth.controller";
import { asyncMiddleware } from "./../helpers/async";

const router = express.Router();

//* -------------------------------------------------------------------------- */
//*                            ROUTE - /auth/signin                            */
//* -------------------------------------------------------------------------- */
router.route("/auth/signin")
    // POST - REQUEST TO AUTHENTICATE THE USER WITH THEIR EMAIL AND PASSWORD
    .post(asyncMiddleware(authCtrl.signin));


export default router;
