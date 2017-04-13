
// This module is an utility to help get the correct format for dates which are used in the codebase.
function DateUtil() {
    var self = this;
    this.bg = chrome.extension.getBackgroundPage();

    // Converts seconds to the format HH:MM:SS
    this.secondsToHHMMSS = function (seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    };

    // Formats the date parameter to DD/MM/YY
    this.formatDate = function(date){
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    };

    // Function which returns the current date, formatted in the correct format.
    this.getToday = function(){
        var dateObject = new Date();
        return self.formatDate(dateObject);
    }
}

var dateUtil = new DateUtil();