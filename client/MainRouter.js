import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './core/Home'
import Menu from './core/Menu'

import Users from './user/Users'
import Signup from './user/Signup'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'

import Signin from './auth/Signin'
import PrivateRoute from './auth/PrivateRoute'

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// The Switch component in React Router renders a route exclusively. In other words,
// it only renders the first child that matches the requested route path. On the other hand,
// without being nested in a Switch, every Route component renders inclusively when there
// is a path match; for example, a request at '/' also matches a route at '/contact'.

const MainRouter = () => {
    return (
        <React.Fragment>
            <Menu />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/users" component={Users} />
                <Route path="/signup" component={Signup} />
                <Route path="/signin" component={Signin} />
                <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
                <Route path="/user/:userId" component={Profile} />
            </Switch>
        </React.Fragment>
    );
}

export default MainRouter
