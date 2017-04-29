$(document).ready(function(){
    $("#demo").click(function(){
        $("#body").fadeTo(1500,0,function(){
             $("#body").load("http://localhost:8082/public/?filePath=html/home.html");
             $('#body').fadeTo(500,100);
        });
    });
});