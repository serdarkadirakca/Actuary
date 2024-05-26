const dateOpt = new Date();

var day = dateOpt.getDate();
var month = dateOpt.getMonth()+1; 
var year = dateOpt.getFullYear();
var hour = dateOpt.getHours();
var min = dateOpt.getMinutes();
if(day<10){
    day = "0" + day; 
}
if(month<10){
    month = "0" + month; 
}
if(hour<10){
    hour = "0" + hour; 
}
if(min<10){
    min = "0" + min; 
}
var date = day + "." + (month) + "." + year + " - " + hour + ":" + min;
module.exports = date;

