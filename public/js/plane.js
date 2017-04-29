$(document).ready(function(){
    //handler of button click
    $('#city').click(function(){
        //dummy data
        lat = 22.652043; lng =	88.44633;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status==200){
                    console.log(xhr.responseText);
                }else{
                    console.log(xhr.responseText);
                }
            }
        }
        xhr.open("GET", "http://localhost:8082/select-city/?lat="+lat+"&lng="+lng);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send();
    });
});