import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import backgroundImg from "./../assets/images/wallpaper.jpg";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 600,
        margin: "auto",
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    title: {
        padding: `
            ${theme.spacing(3)}px
            ${theme.spacing(2.5)}px
            ${theme.spacing(2)}px
        `,
        color: theme.palette.openTitle,
    },
    media: {
        minHeight: 400,
    },
}));

export default function Home() {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <Typography variant="h6" className={classes.title}>
                Home Page
            </Typography>
            <CardMedia
                className={classes.media}
                image={backgroundImg}
                title="Background Image"
            />
            <CardContent>
                <Typography variant="body1" component="p">
                    Welcome to the MERN Skeleton home page.
                </Typography>
            </CardContent>
        </Card>
    );
}
