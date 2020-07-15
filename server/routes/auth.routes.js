import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

//* -------------------------------------------------------------------------- */
//*                            ROUTE - /auth/signin                            */
//* -------------------------------------------------------------------------- */
router.route('/auth/signin')
    // POST - REQUEST TO AUTHENTICATE THE USER WITH THEIR EMAIL AND PASSWORD
    .post(authCtrl.signin)

//* -------------------------------------------------------------------------- */
//*                            ROUTE - /auth/signout                           */
//* -------------------------------------------------------------------------- */
router.route('/auth/signout')
    // GET - CLEAR THE COOKIE WITH A JWT THAT WAS SET ON THE RESPONSE OBJECT AFTER SIGN-IN
    .get(authCtrl.signout)

export default router
