const express = require('express');
// const serveStatic = require('serve-static');
let app = express();
let path = require('path');

// app.use(serveStatic(__dirname + "/dist"));

app.use(express.static('dist'));
app.get('*', (request, response) => {
    // response.sendFile(__dirname + '/dist' + '/index.html');
    const requestPath = path.resolve(__dirname,  "dist", "index.html");
    console.log('GET request for:', requestPath);
    response.sendFile(requestPath);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Listening on port ' + port)
});


