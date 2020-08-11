import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
import ArrowForward from "@material-ui/icons/ArrowForward";
import Person from "@material-ui/icons/Person";

import { list } from "./api-user.js";

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// The Users component here will be used to show the names of all the users that
// have been fetched from the database and links each name to the user profile.

const useStyles = makeStyles((theme) => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5),
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
    },
}));

export default function Users() {
    const classes = useStyles();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // When the fetch request is initiated, we pass in the AbortSignal as a
        // param. This associates the signal and controller with the fetch request
        // and allows us to abort it by calling AbortController.abort() below...
        const abortController = new AbortController();
        const signal = abortController.signal;

        // * API METHOD CALLED HERE...
        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(data);
            }
        });

        return function cleanup() {
            abortController.abort();
        };
    }, []);

    return (
        <Paper className={classes.root} elevation={2}>
            <Typography variant="h6" className={classes.title}>
                All User
            </Typography>
            <List dense>
                {users.map((item, i) => {
                    return (
                        <Link to={"/user/" + item._id} key={i}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.name} />
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <ArrowForward />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    );
                })}
            </List>
        </Paper>
    );
}
