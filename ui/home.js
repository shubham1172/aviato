$(document).ready(function(){
    //get current location
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB0-0hUk1RRzmSPKaQA4eFAbYoas0Lma3Q",
        success: function(data){
            //returned lat lng
            $lat = data.location.lat;
            $lng = data.location.lng;
            console.log($lat);
            console.log($lng);
        }
    });
});