var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var path = require('path');

app.use(favicon(path.join(__dirname, '/src/assets/favicon', 'favicon.ico')));
app.use('/src/assets', express.static(path.join(__dirname, '/src/assets')));
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/node_modules/materialize-css/fonts/roboto', express.static(path.join(__dirname, '/node_modules/materialize-css/fonts/roboto')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(3000);
