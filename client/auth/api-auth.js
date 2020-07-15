//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// In order to integrate the auth API endpoints from the server with the frontend
// React components, we will add methods for fetching sign-in and sign-out API
// endpoints in this file.

const signin = async (user) => {
    try {
        // The signin method will take user sign-in data from the view component,
        // then use fetch to make a POST call to verify the user with the backend.
        let response = await fetch('/auth/signin/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })

        // The response from the server will be returned to the component in a
        // promise, which may provide the JWT if sign-in was successful.
        return await response.json()

    } catch (err) {
        console.log(err)
    }
}

const signout = async () => {
    try {
        let response = await fetch('/auth/signout/', { method: 'GET' })

        // This method will also return a promise to inform the component about
        // whether the API request was successful.
        return await response.json()

    } catch (err) {
        console.log(err)
    }
}

export {
    signin,
    signout
}