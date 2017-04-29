$(document).ready(function(){
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
    var flag = true;
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
    $('#city').click(function(){
        //dummy data
        end_lat = 22.652043; end_lng = 88.44633;
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
                        });
                    });
                }
            }, 3000);
        });
    });
});