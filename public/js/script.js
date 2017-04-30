$(document).ready(function(){
   
$('#demo').click(function(){
     $("#body").fadeTo(1500,0,function(){
             $("#body").load("http://localhost:8082/public/?filePath=html/home.html");
             $("#footer").remove();
             $('#body').fadeTo(500,100);
});
//city navigation
/**
$('.cityList').on('click',function(e){

    var city = new XMLHttpRequest();
     city.onreadystatechange = function(){
        if(city.readyState===XMLHttpRequest.DONE){
            if(city.status==200){
                $("#body").fadeTo(1500,0,function(){
             $("#body").load("http://localhost:8082/public/?filePath=html/home.html");
             $("#footer").remove();
             $('#body').fadeTo(500,100);
        });
            }
        }
        console.log(e.target.id);
    }
    city.open('GET','http://localhost:8082/select-city/'+e.target.id,true);
    city.send(null);

    
});
*/
});

});