/**
 * Import modules
 */
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cityPooler = require('../data/cityPooler.js');

//Create app
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));

// /public/?filePath=...
app.get('/public/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/', req.query.filePath));
});

app.get('/get-cities', function(req, res){
    cityPooler.getCities(req, res);
});

//Chennai airport
start_lat=12.9940947; start_lng = 80.1705791;
curr_lat = start_lat; curr_lng = start_lng;
end_lat = -1; end_lng = -1;
speed = 0.005;

// /select-city/?lat=xxx&lng=yyy
app.get('/select-city', function(req, res){
    end_lat = Number(req.query.lat);
    end_lng = Number(req.query.lng);
    res.send(JSON.stringify({lat:start_lat, lng:start_lng}));
});

//start coordinates
app.get('/get-location', function(req, res){
    console.log(curr_lat);
    console.log(curr_lng);
    res.send(JSON.stringify({lat: curr_lat, lng: curr_lng}));
});

//home
app.get('/', function(req, res){

    res.sendFile(path.join(__dirname, '../public/html/', 'index.html'));
});

//Listen to the network
var port = 8082;
app.listen(port, function(){
  console.log('Aviato up and running on 8082!');
});

/**
 * Traverse logic
 */
setInterval(function(){
    if(end_lat>-1&&end_lng>-1){
        slope = (end_lng-start_lng)/(end_lat-start_lat);
        if((curr_lat>end_lat+speed*10&&end_lat>start_lat)||(curr_lat>end_lat-speed*10&&end_lat>start_lat)
            ||(curr_lat<end_lat+speed*10&&end_lat<start_lat)||(curr_lat<end_lat-speed*10&&end_lat<start_lat)){
            curr_lat=end_lat;
            curr_lng=end_lng;
        }else{
            if(end_lat>start_lat){
                curr_lat+=speed;
            }
            else{
                curr_lat-=speed
            }
            if(end_lng<start_lng){
                curr_lng=slope*(speed) + curr_lng;
            }else{
                curr_lng=slope*(speed) + curr_lng;
            }
        }
    }
}, 3000);

