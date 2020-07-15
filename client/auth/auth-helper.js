//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// To manage auth state in the frontend of the application, the frontend needs to
// be able to store, retrieve, and delete the auth credentials that are received
// from the server on successful user sign in. In our MERN applications, we will
// use the browser's sessionsStorage as the storage option to store the JWT
// auth credentials. Alternatively, you can use localStorage instead of
// sessionStorage to store the JWT credentials.

// With sessionStorage, the user auth state will only be remembered in the current
// window tab. With localStorage, the user auth state will be remembered across
// tabs in a browser.

// With these three methods, we now have ways of storing, retrieving, and deleting
// JWT credentials on the client-side. Using these methods, the React components we
// build for the frontend will be able to check and manage user auth state to restrict
// access in the frontend, as demonstrated in the following section with the custom
// PrivateRoute component.

import { signout } from "./api-auth.js";

const auth = {
        /* ------------------------- STORING JWT CREDENTIALS ------------------------ */
    // The authenticate method takes the JWT credentials, jwt, and a callback
    // function, cb, as arguments. It stores the credentials in sessionStorage
    // after ensuring window is defined, in other words ensuring this code is
    // running in a browser and hence has access to sessionStorage. Then, it
    // executes the callback function that is passed in. This callback will
    // allow the component – in our case, the component where sign-in is
    // called – to define actions that should take place after successfully
    // signing in and storing credentials.
    authenticate(jwt, cb) {
        // Ensure this being run in a web-page inside a web-browser.
        if (typeof window !== "undefined")
            sessionStorage.setItem("jwt", JSON.stringify(jwt));
        cb();
    },

    /* ----------------------- RETRIEVING JWT CREDENTIALS ----------------------- */
    // We will need to retrieve the stored credentials to check if the current user
    // is signed in. The isAuthenticated() method, can retrieve these credentials
    // from sessionStorage. A call to the method will return either the stored
    // credentials or false, depending on whether credentials were found in
    // sessionStorage. Finding credentials in storage will mean a user is signed
    // in, whereas not finding credentials will mean the user is not signed in.
    isAuthenticated() {
        if (typeof window == "undefined") return false;
        console.log(JSON.parse(sessionStorage.getItem("jwt")));

        if (sessionStorage.getItem("jwt"))
            return JSON.parse(sessionStorage.getItem("jwt"));
        else return false;
    },

    /* ------------------------ DELETING JWT CREDENTIALS ------------------------ */
    // When a user successfully signs out from the application, we want to clear the
    // stored JWT credentials from sessionStorage.

    // This clearJWT method takes a callback function as an argument, and it removes
    // the JWT credential from sessionStorage. The passed in 'cb' function allows
    // the component initiating the signout functionality to dictate what should
    // happen after a successful sign-out.

    // The clearJWT method also uses the signout method we defined earlier in
    // api- auth.js to call the signout API in the backend. If we had used
    // cookies to store the credentials instead of sessionStorage, the response
    // to this API call would be where we clear the cookie, as shown in the
    // preceding code. Using the signout API call is optional since this is
    // dependent on whether cookies are used as the credential storage mechanism.
    clearJWT(cb) {
        if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
        cb();
        //optional - if we used cookies to store the credentials
        signout().then((data) => {
            document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        });
    },
};

export default auth;
