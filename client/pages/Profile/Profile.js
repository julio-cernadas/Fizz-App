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
import Divider from "@material-ui/core/Divider";

import FollowProfileButton from "./components/FollowProfileButton";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";
import DeleteUser from "./components/DeleteUser";
import auth from "./../../services/auth/auth-helper";
import { listByUser } from "./../../services/api/posts/api-post.js";
import { read } from "./../../services/api/users/api-user.js";

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 640,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
        color: theme.palette.protectedTitle,
        fontSize: '1em'
    },
    bigAvatar: {
        width: 70,
        height: 70,
        margin: 10
    }
}))


export default function Profile({match, ...props}) {
    const classes = useStyles();
    const [values, setValues] = useState({
        user: { following: [], followers: [] },
        redirectToSignin: false,
        following: false
    })
    const [posts, setPosts] = useState([])
    const jwt = auth.isAuthenticated();

    //* CHECK IF SIGNED IN USER EXISTS IN FETCHED USER'S FOLLOWERS LIST.
    const checkIfFollowing = (user) => {
        const match = user.followers.some((follower) => {
            return follower._id == jwt.user._id;
        });
        return match;
    };

    const loadPosts = (user) => {
        listByUser({ userId: user }, { t: jwt.token })
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setPosts(data);
                }
            });
    };

    //* INITIAL GET REQUEST FOR USER PROFILE DATA AND SET 'VALUES'.
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        read({ userId: match.params.userId }, { t: jwt.token }, signal)
            .then((data) => {
                if (data && data.error) {
                    setValues({
                        ...values,
                        redirectToSignin: true
                    });
                } else {
                    const following = checkIfFollowing(data)
                    setValues({
                        ...values,
                        user: data,
                        following: following
                    })
                    loadPosts(data._id)
                }
            });
        return function cleanup() {
            abortController.abort();
        };
    }, [match.params.userId]);

    //* CALL FOLLOW OR UNFOLLOW API METHODS AND SET 'VALUES'.
    const clickFollowButton = (callApi) => {
        callApi({ userId: jwt.user._id }, { t: jwt.token }, values.user._id)
            .then((data) => {
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    setValues({
                        ...values,
                        user: data,
                        following: !values.following,
                    });
                }
            });
    };

    const removePost = (post) => {
        const updatedPosts = posts;
        const index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    };

    const photoUrl = values.user._id
        ? `/api/v1/users/photos/${values.user._id}?${new Date().getTime()}`
        : "/api/v1/users/photos/defaultphoto";

    // If the current user is not authenticated, we set up the conditional
    // redirect to the Sign In view.
    if (values.redirectToSignin) {
        return <Redirect to='/signin' />
    }

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl} className={classes.bigAvatar} />
                    </ListItemAvatar>
                    <ListItemText primary={values.user.name} secondary={values.user.email} />
                    {/* If viewing their own page, show 'Edit/Delete' buttons, else show 'Follow/Unfollow'*/}
                    {auth.isAuthenticated().user && (auth.isAuthenticated().user._id == values.user._id)
                        ? (<ListItemSecondaryAction>
                            <Link to={"/user/edit/" + values.user._id}>
                                <IconButton aria-label="Edit" color="primary">
                                    <Edit />
                                </IconButton>

                            </Link>
                            <DeleteUser userId={values.user._id} />
                        </ListItemSecondaryAction>)
                        : (<FollowProfileButton following={values.following}
                            onButtonClick={clickFollowButton} />)
                    }
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary={values.user.about} secondary={"Joined: " + (
                        new Date(values.user.created)).toDateString()} />
                </ListItem>
            </List>
            <ProfileTabs user={values.user} posts={posts} removePostUpdate={removePost} />
        </Paper>
    );
}
