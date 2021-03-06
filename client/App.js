import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hot } from "react-hot-loader";

import { Container } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from '@material-ui/core/CssBaseline';

import Router from "./Router";
import theme from "./theme";

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// Once the code that's been rendered on the server-side reaches the browser and
// the frontend script takes over, we need to remove the server-side injected CSS
// when the root React component mounts, using the useEffect hook. This will give
// back full control over rendering the React app to the client-side.

// In this file, we configure the React app so that it renders the view components
// with a customized Material-UI theme, enables frontend routing, and ensures that
// the React Hot Loader can instantly load changes as we develop the components.

// Here wrap the 'Router' component with ThemeProvider, which gives it access to
// the Material-UI theme, and BrowserRouter, which enables frontend routing with React
// Router. The custom theme variables we defined previously are passed as a prop to
// ThemeProvider, making the theme available in all our custom React components.

// BrowserRouter is the router implementation that uses the HTML5 history API to
// keep your UI up to date with the browser URL. It's responsibility is to store
// all the components and its routes as an object.

const App = () => {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) jssStyles.parentNode.removeChild(jssStyles);
    }, []);

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container disableGutters={true} maxWidth={false}>
                    <Router />
                </Container>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default hot(module)(App);
