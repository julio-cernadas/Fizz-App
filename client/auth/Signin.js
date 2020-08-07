import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import { CardMedia } from "@material-ui/core";

import auth from "./../auth/auth-helper";
import { signin } from "./api-auth.js";

import logo from "./../assets/logo.png"
import backgroundImg from "./../assets/images/background2.jpg"

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
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
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
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    submit: {
        margin: "auto",
        marginBottom: theme.spacing(2),
    },
    media: {
        height: 40,
        paddingTop: '10.00%'
    }
}));

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// The Signin function will take props in the argument that contain React Router
// variables. We will use these for the redirect. redirectToReferrer should be set
// to true when the user successfully signs in after submitting the form and the
// received JWT is stored in sessionStorage.

export default function Signin(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        redirectToReferrer: false,
    });

    const onClickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined,
        };

        //* API METHOD CALLED HERE...
        signin(user).then((data) => {
            if (data.error)
                setValues({ ...values, error: data.error.message })
            else // store credential...
                auth.authenticate(data, () => {
                    setValues({
                        ...values,
                        error: "",
                        redirectToReferrer: true,
                    });
                });
        });
    };

    // NOTE: the above function is a react hooks way as below
    // handleChange(event) { this.setState({ value: event.target.value }) }
    const handleChange = (name) => (event) => {
        setValues({
            ...values,
            [name]: event.target.value
        });
    };

    // The redirection will happen conditionally based on the redirectToReferrer
    // value using the Redirect component from React Router.
    const { from } = props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = values;
    if (redirectToReferrer) return <Redirect to={from} />;

    return (
        <div className={classes.background}>
            <Card className={classes.card}>
                <CardContent>
                    <CardMedia className={classes.media} title="X" image={logo} />
                    <TextField
                        id="email"
                        type="email"
                        label="Email"
                        className={classes.textField}
                        value={values.email}
                        onChange={handleChange("email")}
                        margin="normal"/>
                    <br />
                    <TextField
                        id="password"
                        type="password"
                        label="Password"
                        className={classes.textField}
                        value={values.password}
                        onChange={handleChange("password")}
                        margin="normal"/>
                    <br />
                    {values.error && (
                        <Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>error</Icon>
                            {values.error}
                        </Typography>
                    )}
                </CardContent>
                <CardActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={onClickSubmit}
                        className={classes.submit}>
                        LOG IN
                </Button>
                </CardActions>
            </Card>
            <Card className={classes.cardBottom}>
                <CardContent>
                    <Link to="/signup">
                        <Typography color="inherit">
                            Don't have an account? Sign Up
                        </Typography>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
