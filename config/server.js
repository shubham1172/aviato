/**
 * Import modules
 */
var express = require('express');
var morgan = require('morgan');
var path = require('path');

//Create app
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));

//index
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//Listen to the network
var port = 8082;
app.listen(port, function(){
  console.log('SUDOCODE up and running on 8082!');
});
