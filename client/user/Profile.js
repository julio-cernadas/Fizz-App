import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Person from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";

import DeleteUser from "./DeleteUser";
import auth from "./../auth/auth-helper";
import { read } from "./api-user.js";

const useStyles = makeStyles((theme) => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: "auto",
        padding: theme.spacing(3),
        marginTop: theme.spacing(5),
    }),
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle,
    },
}));

/* -------------------------------------------------------------------------- */

export default function Profile({ match }) {
    const classes = useStyles();

    // In the Profile component definition, we need to initialize the state with
    // an empty user and set redirectToSignin to false.
    const [user, setUser] = useState({});
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const jwt = auth.isAuthenticated();

    // The Profile component should fetch user information and render the view
    // with these details. To implement this, we will use the useEffect hook,
    // as we did in the Users component.

    // This effect uses the match.params.userId value and calls the read user
    // fetch method. Since this method also requires credentials to authorize
    // the signed-in user, the JWT is retrieved from sessionStorage using the
    // isAuthenticated method from auth-helper.js, and passed in the call to read.

    // Once the server responds, either the state is updated with the user
    // information or the view is redirected to the Sign In view if the current
    // user is not authenticated. We also add a cleanup function in this effect
    // hook to abort the fetch signal when the component unmounts.

    // This effect only needs to rerun when the userId parameter changes in the
    // route, for example, when the app goes from one profile view to the other.
    // To ensure this effect reruns when the userId value updates, we will add
    // [match.params.userId] in the second argument to useEffect.
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        read(
            {
                userId: match.params.userId,
            },
            { t: jwt.token },
            signal
        ).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
            } else {
                setUser(data);
            }
        });

        return function cleanup() {
            abortController.abort();
        };
    }, [match.params.userId]);

    // If the current user is not authenticated, we set up the conditional
    // redirect to the Sign In view.
    if (redirectToSignin) {
        return <Redirect to="/signin" />;
    }
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Person />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />{" "}
                    {auth.isAuthenticated().user &&
                        auth.isAuthenticated().user._id == user._id && (
                            <ListItemSecondaryAction>
                                <Link to={"/user/edit/" + user._id}>
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit />
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id} />
                            </ListItemSecondaryAction>
                        )}
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={
                            "Joined: " + new Date(user.created).toDateString()
                        }
                    />
                </ListItem>
            </List>
        </Paper>
    );
}
