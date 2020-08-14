//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// In order to integrate the auth API endpoints from the server with the frontend
// React components, we will add methods for fetching sign-in and sign-out API
// endpoints in this file.

const signin = async (user) => {
    try {
        let response = await fetch('/api/v1/auth/signin/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        return await response.json();
    } catch (err) {
        console.log(err)
    }
}

export {
    signin
}