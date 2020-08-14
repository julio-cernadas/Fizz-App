import React, { useState } from "react";
import { Link } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { create } from "./../../services/api/users/api-user.js";

import backgroundImg from "./../../assets/images/background3.jpg";

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        height: "100vh",
        paddingTop: theme.spacing(1),
    },
    card: {
        maxWidth: 440,
        margin: "auto",
        textAlign: "center",
        marginTop: theme.spacing(16),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    cardBottom: {
        maxWidth: 440,
        margin: "auto",
        textAlign: "center",
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(0),
    },
    error: {
        verticalAlign: "middle",
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    text: {
        textAlign: "center",
    },
    button: {
        margin: "auto",
        marginRight: theme.spacing(10),
        marginBottom: theme.spacing(2),
    },
    submit: {
        margin: "auto",
        marginBottom: theme.spacing(2),
    },
}));

export default function Signup() {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: "",
        password: "",
        email: "",
        open: false,
        error: "",
    });

    const handleChange = (name) => (event) => {
        setValues({
            ...values,
            [name]: event.target.value,
        });
    };

    // This takes the input values from the state and calls the create fetch method
    // to sign up the user with the backend. Then, depending on the response from
    // the server, either an error message is shown or a success dialog is shown.
    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
        };

        //* API METHOD CALLED HERE...
        create(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error.message });
            } else {
                setValues({ ...values, error: "", open: true });
            }
        });
    };
/* -------------------------------------------------------------------------- */
    return (
        <div className={classes.background}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        JOIN THE FUN!
                    </Typography>
                    <TextField id="name" label="Name" className={classes.textField}
                        value={values.name} onChange={handleChange("name")} margin="normal" />
                    <br />
                    <TextField id="email" type="email" label="Email" className={classes.textField}
                        value={values.email} onChange={handleChange("email")} margin="normal" />
                    <br />
                    <TextField id="password" type="password" label="Password" className={classes.textField}
                        value={values.password} onChange={handleChange("password")} margin="normal" />
                    <br />
                    {/* ERROR MESSAGE POP UP ON BOTTOM */}
                    {values.error && (
                        <Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>
                                error
                            </Icon>
                            {values.error}
                        </Typography>
                    )}
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained"
                        onClick={clickSubmit} className={classes.submit} >
                        Submit
                    </Button>
                </CardActions>
            </Card>
            <Card className={classes.cardBottom}>
                <CardContent>
                    <Link to="/signin">
                        <Typography color="inherit">
                            Already have an account? Log In
                        </Typography>
                    </Link>
                </CardContent>
            </Card>

            {/* NEW ACCOUNT CREATION MESSAGE */}
            <Dialog open={values.open} disableBackdropClick={true}>
                <DialogTitle className={classes.text}>Welcome!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Account Successfully Created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button className={classes.button} color="primary"
                            autoFocus="autoFocus" variant="contained" >
                            Sign In
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>
    );
}
