function set_time() {
   //Select the element with the |time_display| ID
   var time_display = document.getElementById("time_display");
   //Create a new Date object
   var date = new Date();
   //Get the current time
   var time = date.toLocaleTimeString();
   //Set the time_display element's innerHTML to the current time
   time_display.innerHTML = time;
}

function set_date() {
    //Select the element with the |date_display| ID
    var date_display = document.getElementById("date_display");
    //Create a new Date object
    var date = new Date();
    //Get the current date
    var date_string = date.toDateString();
    //Set the date_display element's innerHTML to the current date
    date_display.innerHTML = date_string;
}

window.onload = function() {
    setInterval(set_time, 1000);
    setInterval(set_date, 1000);
}