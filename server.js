var express = require('express');
var app = express();
var compress = require('compression');
var favicon = require('serve-favicon');
var path = require('path');

var appPort = process.env.PORT || 3000;

app.use(compress());

app.use(favicon(path.join(__dirname, '/src/assets/favicon', 'favicon.ico')));
app.use('/src/assets', express.static(path.join(__dirname, '/src/assets')));
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/node_modules/materialize-css/fonts/roboto', express.static(path.join(__dirname, '/node_modules/materialize-css/fonts/roboto')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Starting app on port:', appPort);
});
