$(document).ready(function(){


    //cities request
    var cityReq = new XMLHttpRequest();
    var cities;
    cityReq.onreadystatechange = function(){
        if(cityReq.readyState===XMLHttpRequest.DONE){
            if(cityReq.status==200){
                cities = JSON.parse(cityReq.responseText);
                console.log(cities);
                for(i=0;i<4;i++){
                    $('#cityList').append('<span style="margin:10px;" class="cl" id="?'+cities[i].lat+'&'+cities[i].lng+'">'+cities[i].name+'</span>');
                }
            }
        }
    }
    cityReq.open('GET','http://localhost:8082/get-cities/',true);
    cityReq.send(null);




    //returns current location of flight
    function getLocation(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status==200){
                    var data = JSON.parse(xhr.responseText);
                    var uluru = {lat: data.lat, lng: data.lng};
                    callback(uluru);
                }else{
                    console.log(xhr.responseText);
                }
            }
        }
        var url = "http://localhost:8082/get-location/";
        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }
    //global variables
    var map;
    var infowindow;
    var planeMarker;
    var flag = false;
    //initializes map
    function initMap(location, initCall) {
        //var pyrmont = {lat: -33.867, lng: 151.195};
        map = new google.maps.Map(document.getElementById('map'), {
          center: location,
          zoom: 16
        });
        infowindow = new google.maps.InfoWindow();
        search(location, function(){
            initCall();
        });
    }
    //searches in a given location
    function search(location, searchCall){
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: location,
          radius: 1000,
          types: ['airport', 'amusement_park', 'bus_station', 'embassy', 'hindu_temple',
                    'hospital', 'lodging', 'school', 'stadium', 'taxi_stand'
                    ,'train_station', 'university', 'zoo', 'natural_feature', 'point_of_interest']
        }, callback);
        searchCall();
    }

    function weather(location, weatherCall){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status==200){
                    var data = JSON.parse(xhr.responseText);
                    var parsed = {name: data.location.region+", "+data.location.country,
                                    temp: data.current.temp_c, humidity: data.current.humidity, 
                                    wind: data.current.wind_kph};
                                   
                    weatherCall(parsed);
                }else{
                    console.log(xhr.responseText);
                }
            }
        }
        xhr.open("GET","http://api.apixu.com/v1/current.json?key=c00fe1113f754aef94304921173004&q="+location.lat+","+location.lng);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }
    //calls create marker
    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }
    //creates markers
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
    //accounts for change of location
    function changeLocation(event){
        var lat = (map.getCenter().lat());
        var lng = (map.getCenter().lng());
        var location = {lat: lat, lng: lng};
        search(location, function(){
            flag = false;
        });
    }
    //main
    $('#recentre').click(function(){
        getLocation(function(location){
            map.setCenter(location);
            flag = true;
        });
    });
    //onclick handler
    $('#cityList').on('click', function(e){
        flag = true;
        v = e.target.id.substring(1);
        console.log(v);
        end_lat = Number(v.substring(0, v.indexOf("&")));
        end_lng = Number(v.substring(v.indexOf("&")+1));
        console.log(end_lat); console.log(end_lng);
        //end_lat = 22.652043; end_lng = 88.44633;
        start_lat = end_lat; start_lng = end_lng;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status==200){
                    start_lat = JSON.parse(xhr.responseText).lat;
                    start_lng = JSON.parse(xhr.responseText).lng;
                    var flightPlanCoordinates = [
                        {lat: start_lat, lng: start_lng},
                        {lat: end_lat, lng: end_lng}
                    ];
                    var flightPath = new google.maps.Polyline({
                        path: flightPlanCoordinates,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                    flightPath.setMap(map);
                    var slope = (end_lng-start_lng)/(end_lat-start_lat);
                    var angle = Math.atan(slope)*180/3.14;
                    var image = 'http://localhost:8082/public/?filePath=images/p0CW.png';
                    if(angle>22.5 && angle<=67.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p45CW.png';
                    else if(angle>67.5 && angle<=112.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p90CW.png';
                    else if(angle>112.5 && angle<=157.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p135CW.png';
                    else if(angle>157.5 && angle<=202.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p180CW.png';
                    else if(angle>202.5 && angle<=247.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p225CW.png';
                    else if(angle>247.5 && angle<=292.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p270CW.png';
                    else if(angle>292.5 && angle<=337.5)
                        var image = 'http://localhost:8082/public/?filePath=images/p315CW.png';
                    
                    planeMarker = new google.maps.Marker({
                        position: {lat: start_lat, lng: start_lng},
                        map: map,
                        icon: image
                    });
                 }else{
                    console.log(xhr.responseText);
                }
            }
        }
        xhr.open("GET", "http://localhost:8082/select-city/?lat="+end_lat+"&lng="+end_lng);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send();
    });

    getLocation(function(data){
        initMap(data, function(done){
            google.maps.event.addDomListener(map, 'click', changeLocation);
            google.maps.event.addDomListener(map, 'dragend', changeLocation);
            setInterval(function(){
                if(flag==true){
                    getLocation(function(data2){    
                        search(data2, function(){
                            map.setCenter(data2);
                            planeMarker.setPosition(data2);
                            weather(data2, function(info){
                                
                                $('#info').html('Region: '+info.name+'<br>'+'Temperature: '+info.temp+' C<br>Humidity: '+info.humidity+'%<br>Wind: '+info.wind+' kph');
                            });
                        });
                    });
                }
            }, 3000);
        });
    });
});