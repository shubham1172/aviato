/**
 * Import modules
 */
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');

//Create app
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));

//home
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../ui', 'home.html'));
});
//ui files
app.get('/ui/:filename', function(req, res){
    res.sendFile(path.join(__dirname, '../ui', req.params.filename));
});
//Listen to the network
var port = 8082;
app.listen(port, function(){
  console.log('Aviato up and running on 8082!');
});
