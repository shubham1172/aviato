$(document).ready(function(){
    function getLocation() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status==200){
                    var data = JSON.parse(xhr.responseText);
                    var uluru = {lat: data.location.lat, lng: data.location.lng};
                    initMap(uluru);
                }else{
                    console.log(xhr.responseText);
                }
            }
        }
        xhr.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB0-0hUk1RRzmSPKaQA4eFAbYoas0Lma3Q");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }
    var map;
    var infowindow;

    function initMap(pyrmont) {
        //var pyrmont = {lat: -33.867, lng: 151.195};
        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 16
        });
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pyrmont,
          radius: 1000,
          types: ['airport', 'food', 'pharmacy']
        }, callback);
    }

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

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
    getLocation();
});