
// The tracker tracks whether you are currently working on exercises.
// Every second, the "alarm" is fired, and the url of the current tab is examined.
// If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.
function Tracker() {
    var self = this;
    this.idle = false;
    this.tabActive = null;
    this.activeTime = 0;
    this.zeeguuRegex = zeeguuExLink+ ".*";

    // Initialize the alarm, and initialize the idle-checker.
    this.init = function() {

        setInterval(self.fireAlarm, 5000);
        setInterval(self.matchUrls, 1000);

        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(15);
        chrome.idle.onStateChanged.addListener(self.checkIdle);

    };

    this.fireAlarm = function () {
        if (self.activeTime > 0) {
            exerciseTime.incrementTodayExerciseTime(self.activeTime);
            self.activeTime = 0;
        }
    };

    // Check if the user is idle. If the user is not idle, and on the zeeguu website, increment the counter.
    this.matchUrls = function () {
        if (!self.idle) {
            self.getCurrentTab().then(function(result){
                self.tabActive = result;
                let blockedSitePromise = self.matchUrlToBlockedSite(result, blockedSites.getList());
                blockedSitePromise.then(function(result) {
                    console.log("Increment "+result.getDomain());
                }).catch(function () {
                    console.log("No match.");
                });

            });

            if (self.compareUrlToRegex(self.tabActive, self.zeeguuRegex)) {
                self.increaseTimeCounterExercises()
            }
        }
    };

    this.increaseTimeCounterExercises = function () {
        self.activeTime = self.activeTime + 1;
    };

    this.matchUrlToBlockedSite = function (url, blockedSites) {
        return new Promise(function(resolve, reject){
            blockedSites.forEach(function(item){
                if(self.matchUrl(url, item.getDomain())) {
                    resolve(item);
                }
            });
            reject();
        });
    };

    this.matchUrl = function (url, blockedSiteDomain) {
        return self.compareUrlToRegex(url, "^(http[s]?:\\/\\/)?(.*)"+blockedSiteDomain+".*$");
    };

    // Function attached to the idle-listener. Sets the self.idle variable.
    this.checkIdle = function(idleState) {
        self.idle = (idleState != "active");
    };

    // Gets the current tab.
    this.getCurrentTab = function() {
        return new Promise(function(resolve, reject){
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
                if(tabs.length == 1) {
                    resolve(tabs[0].url);
                }
            });
        });
    };

    // Compare regex to url.
    this.compareUrlToRegex = function(url, regex) {
        return RegExp(regex).test(url);
    };
}


var tracker = new Tracker();
tracker.init();
