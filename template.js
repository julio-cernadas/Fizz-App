export default () => {
    return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>MERN Kickstart</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/javascript" src="/dist/bundle.js"></script>
        </body>
      </html>`
}

/* -------------------------------------------------------------------------- */
/*                                 EXPLANATION                                */
/* -------------------------------------------------------------------------- */
// When the server receives a request to the root URL, this HTML template will be rendered in the browser,
// and the div element with ID "root" will contain our React component.
