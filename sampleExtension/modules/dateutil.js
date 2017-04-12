
function DateUtil() {
    this.bg = chrome.extension.getBackgroundPage();

    this.secondsToHHMMSS = function (seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    };

    this.formatDate = function(date){
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    };

    // Function which returns the current date, formatted in the correct format.
    this.getToday = function(){
        var dateObject = new Date();
        return (dateObject.getDate())+"/"+(dateObject.getMonth()+1)+"/"+dateObject.getFullYear();
    }
}

var dateUtil = new DateUtil();