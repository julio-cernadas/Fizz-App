import React from "react";
import { Link, withRouter } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";

import auth from "./../services/auth/auth-helper";
import logo from "./../assets/images/logo_white.png"

// To indicate the current location of the application on the Menu, we will
// highlight the link that matches the current location path by changing the
// color conditionally. This will be called for each menu item's style property!
const isActive = (history, path) => {
    if (history.location.pathname == path) {
        return { color: "#ff4081" }; // make color PINK
    } else {
        return { color: "#ffffff" }; // make color WHITE
    }
};

// We use 'withRouter' get access to the history object's properties.
// https://stackoverflow.com/questions/53539314/what-is-withrouter-for-in-react-router-dom
const Menu = withRouter(({ history }) => (
    <AppBar position="sticky" elevation={0}>
        <Toolbar variant="dense">
            {/* LEFT SIDE LOGO */}
            <Link to="/">
                <img src={logo} height="46" width="200"/>
            </Link>

            {/* HOME Button */}
            <Link to="/">
                <IconButton aria-label="Home" style={isActive(history, "/")}>
                    <HomeIcon />
                </IconButton>
            </Link>

            {/* USERS Button */}
            <Link to="/users">
                <Button style={isActive(history, "/users")}>
                    USERS
                </Button>
            </Link>

            {/* SIGN UP + LOG IN Button */}
            {/* If user is not authenticated -> show 'SIGN UP' + 'LOG IN' tabs*/}
            {!auth.isAuthenticated() && (
                <React.Fragment>
                    <Link to="/signup">
                        <Button style={isActive(history, "/signup")}>
                            SIGN UP
                        </Button>
                    </Link>
                    <Link to="/signin">
                        <Button style={isActive(history, "/signin")}>
                            LOG IN
                        </Button>
                    </Link>
                </React.Fragment>
            )}

            {/* MY PROFILE + LOG OUT Menu Button */}
            {/* If user is authenticated -> display 'MY PROFILE' + 'LOG OUT'*/}
            {auth.isAuthenticated() && (
                <React.Fragment>
                    <Link to={"/user/" + auth.isAuthenticated().user._id}>
                        <Button style={isActive(history,
                            "/user/" + auth.isAuthenticated().user._id)}>
                            PROFILE
                        </Button>
                    </Link>
                    <Button color="inherit" onClick={() => {
                        auth.clearJWT(() => history.push("/"));}}>
                        LOG OUT
                    </Button>
                </React.Fragment>
            )}

        </Toolbar>
    </AppBar>
));



export default Menu;
