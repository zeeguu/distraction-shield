
var Tracker = new function() {
    var self = this;

    this.idle = false;

    this.tabActive = null;
    this.zeeguuRegex = "https://zeeguu.herokuapp.com/.*";


    this.init = function(){
        setInterval(self.fireAlarm, 1000);
        chrome.idle.setDetectionInterval(15);
        chrome.idle.onStateChanged.addListener(self.checkIdle);
    };

    this.fireAlarm = function(){
        if(!self.idle){
            self.getCurrentTab();
            if(self.compareUrlToRegex(self.zeeguuRegex, self.tabActive)){
                TrackerStorage.incrementDayStat(1);
                //console.log("Time spent on exercises: "+self.i);
            }
        }
    };

    this.checkIdle = function(idleState){
        if(idleState == 'active'){
            self.idle = false;
        } else if(idleState == 'idle'){
            self.idle = true;
        }
        console.log("State changed. Current state: "+idleState);
    };

    this.getCurrentTab = function(){
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            if(tabs.length == 1) {
                self.tabActive = tabs[0].url;
            }
        });
    };

    this.compareUrlToRegex = function(regex, url){
        return RegExp(regex).test(url);
    };
};

Tracker.init();
TrackerStorage.init();
