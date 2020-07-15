// * This will be used to inject the initial component HTML and CSS into a template to
// * be rendered on the client side. This function will be called in 'express.js'
export default ({ markup, css }) => {
    return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          >
          <title>MERN APP</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          <style>
              a{
                text-decoration: none;
                color: #061d95
              }
          </style>
        </head>
        <body style="margin:0">
          <div id="root">${markup}</div>
          <style id="jss-server-side">${css}</style>
          <script type="text/javascript" src="/dist/bundle.js"></script>
        </body>
      </html>`
}

// * look above -> <script type="text/javascript" src="/dist/bundle.js"></script>
// This script tag will load our React frontend code in the browser when we
// visit the root URL '/' with the serverrunning. We are ready to see this in action
// and can start installing the dependencies that will add the React views.

// * look above -> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
// *               <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
// To add the Roboto fonts that are recommended by Material-UI and to use the Material-UI
// icons, we will add the relevant style links into the