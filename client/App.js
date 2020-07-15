import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import { ThemeProvider } from '@material-ui/styles'

import theme from './theme'
import MainRouter from './MainRouter'

//* -------------------------------------------------------------------------- */
//*                                 EXPLANATION                                */
//* -------------------------------------------------------------------------- */
// In this file, we configure the React app so that it renders the view components
// with a customized Material-UI theme, enables frontend routing, and ensures that
// the React Hot Loader can instantly load changes as we develop the components.

// Here wrap the MainRouter component with ThemeProvider, which gives it access to
// the Material-UI theme, and BrowserRouter, which enables frontend routing with React
// Router. The custom theme variables we defined previously are passed as a prop to
// ThemeProvider, making the theme available in all our custom React components.

const App = () => {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }, [])
    return (
        <BrowserRouter>
            {/* Load theme from Material UI, importing our settings from theme.js */}
            <ThemeProvider theme={theme}>
                <MainRouter />
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default hot(module)(App)
