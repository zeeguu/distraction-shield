
var Tracker = new function() {
    var i;
    var idle;
    var tabActive;
    var zeeguuRegex = "https://zeeguu.herokuapp.com/.*";
    var self = this;


    this.init = function(){
        i = 0;
        idle = false;
        setInterval(self.fireAlarm, 1000);
        chrome.idle.setDetectionInterval(15);
        chrome.idle.onStateChanged.addListener(self.checkIdle);
    };

    this.fireAlarm = function(){
        if(!idle){
            self.getCurrentTab();
            if(self.compareUrlToRegex(zeeguuRegex, tabActive)){
                i++;
                console.log("Time spent on exercises: "+i);
            }
        }
    };

    this.checkIdle = function(idleState){
        if(idleState == 'active'){
            idle = false;
        } else if(idleState == 'idle'){
            idle = true;
        }
        console.log("State changed. Current state: "+idleState);
    };

    this.getCurrentTab = function(){
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            if(tabs.length == 1) {
                tabActive = tabs[0].url;
            }
        });
    };

    this.compareUrlToRegex = function(regex, url){
        return RegExp(regex).test(url);
    };
};

Tracker.init();
