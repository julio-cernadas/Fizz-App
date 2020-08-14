//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// To manage auth state in the frontend of the application, the frontend needs to
// be able to store, retrieve, and delete the auth credentials that are received
// from the server on successful user sign in. In our MERN applications, we will
// use the browser's sessionsStorage as the storage option to store the JWT
// auth credentials. Alternatively, you can use localStorage instead, the
// difference is that with sessionStorage, the user auth state will only be stored
// in the current window tab. With localStorage, the user auth state will be
// remembered across tabs in a browser.


//* ------------------------- STORING JWT CREDENTIALS ------------------------ */
function authenticate(jwt, callback) {
    // Ensure this being run in a web-page inside a web-browser.
    if (typeof window !== "undefined")
        sessionStorage.setItem("jwt", JSON.stringify(jwt));
    callback();
}

//* ----------------------- RETRIEVING JWT CREDENTIALS ----------------------- */
// 'sessionStorage.getItem' returns either the stored credentials or false,
// depending on whether credentials were found in sessionStorage.
function isAuthenticated() {
    if ((typeof window !== "undefined") && sessionStorage.getItem("jwt"))
        return JSON.parse(sessionStorage.getItem("jwt"));
    else return false;
}

//* ------------------------ DELETING JWT CREDENTIALS ------------------------ */
// When a user successfully signs out from the application, we want to clear the
// stored JWT credentials from sessionStorage.
function clearJWT(callback) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    callback();
}

export default {
    authenticate,
    isAuthenticated,
    clearJWT
};
