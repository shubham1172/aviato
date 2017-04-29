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

//start coordinates
lat = 37.387474;lng = -122.057543;
app.get('/get-location', function(req, res){
    res.send(JSON.stringify({lat: lat, lng: lng}));
});

//Listen to the network
var port = 8082;
app.listen(port, function(){
  console.log('Aviato up and running on 8082!');
});

setInterval(function(){lat+=0.0005; lng+=0.0005;}, 3000);