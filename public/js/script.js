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
                    $('.cityList').append('<span style="margin:10px;" id="?'+cities[i].lat+'&'+cities[i].lng+'">'+cities[i].name+'</span>');
                }
            }
        }
    }
    cityReq.open('GET','http://localhost:8082/get-cities/',true);
    cityReq.send(null);

//city navigation
$('.cityList').on('click',function(e){

    var city = new XMLHttpRequest();
     city.onreadystatechange = function(){
        if(city.readyState===XMLHttpRequest.DONE){
            if(city.status==200){
                $("#body").fadeTo(1500,0,function(){
             $("#body").load("http://localhost:8082/public/?filePath=html/home.html");
             $('#body').fadeTo(500,100);
        });
            }
        }
        console.log(e.target.id);
    }
    city.open('GET','http://localhost:8082/select-city/'+e.target.id,true);
    city.send(null);

    
});

});