define(function DateUtil() {
// This module is an utility to help get the correct format for dates which are used in the codebase.

    // Converts seconds to the format HH:MM:SS
    secondsToHHMMSS = function (seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    };

    // Formats the date parameter to DD/MM/YY
    formatDate = function(date){
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    };

    // Function which returns the current date, formatted in the correct format.
    getToday = function(){
        var dateObject = new Date();
        return formatDate(dateObject);
    }

    return {
        secondsToHHMMSS : secondsToHHMMSS,
        formatDate      : formatDate,
        getToday        : getToday
    }
});

//var dateUtil = new DateUtil();