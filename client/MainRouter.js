import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Container} from "@material-ui/core";

import Menu from './core/Menu'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import Signin from './auth/Signin'
import PrivateRoute from './auth/PrivateRoute'

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// The Switch component in React Router renders a route exclusively. So basically,
// it only renders the first child that matches the requested route path. On the
// other hand, without being nested in a Switch, every Route component renders
// inclusively when there is a path match; for example, a request at '/' also
// matches a route at '/contact'.

const MainRouter = () => {
    return (
    // Switch components are used to render the default components once the app
    // rendered, and it will switch between routes as needed.

    // Route holds the specific path of the app along with the component’s name
    // and renders it once it matches the URL.
        <Container disableGutters={true} maxWidth={false}>
            <Menu />
            <main>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/users" component={Users} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/signin" component={Signin} />
                    <Route exact path="/user/:userId" component={Profile} />
                    <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
                </Switch>
            </main>
        </Container>
    );
}

export default MainRouter
