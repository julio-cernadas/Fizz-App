//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// In these five api helper methods, we will cover calls to all the user
// CRUD-related API endpoints that we implemented on the backend.

const create = async (user) => {
    try {
        // fetch to make a POST call at the create API route, '/api/users', to
        // create a new user in the backend with the provided data.
        let response = await fetch('/api/users/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        // we return the response from the server as a promise. So, the component
        // calling this method can use this promise to handle the response
        // appropriately, depending on what is returned from the server.
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const list = async (signal) => {
    try {
        // The list method will use fetch to make a GET call to retrieve all
        // the users in the database, and then return the response from the
        // server as a promise to the component.
        let response = await fetch('/api/users/', {
            method: 'GET',
            signal: signal,
        })
        // The returned promise, if it resolves successfully, will give the
        // component an array containing the user objects that were retrieved
        // from the database.
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const read = async (params, credentials, signal) => {
    try {
        // The read method will use fetch to make a GET call to retrieve a
        // specific user by ID. Since this is a protected route, besides passing
        // the user ID as a parameter, the requesting component must also provide
        // valid credentials, which, in this case, will be a valid JWT received
        // after a successful sign-in.
        let response = await fetch('/api/users/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        // The response from the server is returned to the component in a promise.
        // This promise, when it resolves, will either give the component the user
        // details for the specific user or notify that access is restricted to
        // authenticated users.
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const update = async (params, credentials, user) => {
    try {
        // The update method will take changed user data from the view component
        // for a specific user, then use fetch to make a PUT call to update the
        // existing user in the backend. This is also a protected route that will
        // require a valid JWT as the credential.
        let response = await fetch('/api/users/' + params.userId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const remove = async (params, credentials) => {
    try {
        // This, again, is a protected route that will require a valid JWT as a
        // credential, similar to the read and update methods.
        let response = await fetch('/api/users/' + params.userId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        // The response from the server to the delete request will be returned to
        // the component as a promise, as in the other methods.
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export {
    create,
    list,
    read,
    update,
    remove
}