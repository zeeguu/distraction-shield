
function Interception() {
    var self = this;
    this.trs = null;


    this.interceptionCounter = 0;
    this.interceptDateList = [];
    this.countDay = 0;
    this.countWeek = 0;
    this.countMonth = 0;

    this.oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds


    this.init = function() {
    };


}

var ic = new Interception();

