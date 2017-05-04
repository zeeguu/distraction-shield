//TODO fix require for this module
define ('tracker', ['constants', 'exerciseTime'], function Tracker(constants, exerciseTime) {
// The tracker tracks whether you are currently working on exercises.
// Every second, the "alarm" is fired, and the url of the current tab is examined.
// If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.

    var self = this;
    this.idle = false;
    this.tabActive = null;
    this.activeTime = 0;
    this.zeeguuRegex = constants.zeeguuExLink + ".*";

    // Initialize the alarm, and initialize the idle-checker.
    init = function() {
        console.log("Tracker initialized.");
        setInterval(fireAlarm, 5000);
        setInterval(increaseTimeCounter, 1000);

        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(15);
        chrome.idle.onStateChanged.addListener(checkIdle);

    };

    fireAlarm = function () {
        if (self.activeTime > 0) {
            exerciseTime.incrementTodayExerciseTime(self.activeTime);
            self.activeTime = 0;
        }
    };

    // Check if the user is idle. If the user is not idle, and on the zeeguu website, increment the counter.
    increaseTimeCounter = function () {
        if (!self.idle) {
            self.getCurrentTab().then(function(result){ self.tabActive = result});
            if (self.compareUrlToRegex(self.zeeguuRegex, self.tabActive)) {
                self.activeTime = self.activeTime + 1;
            }
        }
    };

    // Function attached to the idle-listener. Sets the self.idle variable.
    checkIdle = function(idleState) {
        self.idle = (idleState != "active");
    };

    // Gets the current tab.
    getCurrentTab = function() {
        return new Promise(function(resolve, reject){
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
                if(tabs.length == 1) {
                    resolve(tabs[0].url);
                }
            });
        });
    };

    // Compare regex to url.
    compareUrlToRegex = function(regex, url) {
        return RegExp(regex).test(url);
    };

    return {
        init : init,

    }
});


// var tracker = new Tracker();
// tracker.init();
