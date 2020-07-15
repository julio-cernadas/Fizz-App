import User from '../models/user.model'

import extend from 'lodash/extend'
// lodash is a ibrary that provides utility functions for common programming tasks,
// including the manipulation of arrays and objects.

import errorHandler from './../helpers/dbErrorHandler'

//* -------------------------------------------------------------------------- */
//*                              ASYNC/AWAIT RECAP                             */
//* -------------------------------------------------------------------------- */
// The create function is defined as an asynchronous function with the async keyword, allowing us
// to use await with user.save(), which returns a Promise. Using the await keyword inside an async
// function causes this function to wait until the returned Promise resolves, before the next lines
// of code are executed. If the Promise rejects, an error is thrown and caught in the catch block.


//* -------------------------------------------------------------------------- */
//*                             ROUTE - /api/users                             */
//* -------------------------------------------------------------------------- */
// * GET METHOD - Load user and append to req.
const list = async (req, res) => {
    try {
        // select method here is a space seperated list of what we want to select
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// * POST METHOD - Used to create a new user
const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//* -------------------------------------------------------------------------- */
//*                         ROUTE - /api/users/:userId                         */
//* -------------------------------------------------------------------------- */
// * GET METHOD - get/read user details by userId
const read = (req, res) => {
    // The read function retrieves the user details from req.profile and removes sensitive
    // information, such as the hashed_password and salt values, before sending the user
    // object in the response to the requesting client.
    req.profile.hashed_password = undefined
    req.profile.salt = undefined

    return res.json(req.profile)
}

// * PUT METHOD - update a user's details by userId
const update = async (req, res) => {
    try {
        // This retrieves the user details from req.profile
        let user = req.profile

        // Then uses the lodash module to extend and merge the changes that came in
        // the request body to update the user data.
        user = extend(user, req.body)

        // Before saving this updated user to the database, the updated field is populated
        // with the current date to reflect the last updated timestamp.
        user.updated = Date.now()

        // Upon successfully saving this update, the updated user object is cleaned by removing
        // sensitive data, before sending the user object in the response to the requesting client.
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// * DELETE METHOD - remove a user by userId
const remove = async (req, res) => {
    try {
        // This function retrieves the user from req.profile
        let user = req.profile

        // Then uses the remove() query to delete the user from the database.
        let deletedUser = await user.remove()

        // On successful deletion, the requesting client is returned the deleted user object in the response.
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// * PARAMS - used for ':userId'
// The userByID controller function uses the value in the :userId parameter
// to query the database by _id and load the matching user's details.
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

export default {
    create,
    userByID,
    read,
    list,
    remove,
    update
}
