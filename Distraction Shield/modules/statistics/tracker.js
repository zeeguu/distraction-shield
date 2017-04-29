
// The tracker tracks whether you are currently working on exercises.
// Every second, the "alarm" is fired, and the url of the current tab is examined.
// If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.
function Tracker() {
    var self = this;
    this.idle = false;
    this.tabActive = null;
    this.activeTime = 0;
    this.updatedExerciseTime = false;
    this.updatedBlockedSiteTime = false;

    // Initialize the alarm, and initialize the idle-checker.
    this.init = function() {
        setInterval(self.fireAlarm, savingFrequency);
        setInterval(self.matchUrls, measureFrequency);

        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(idleTime);
        chrome.idle.onStateChanged.addListener(self.checkIdle);

    };

    this.fireAlarm = function () {
        if (self.updatedExerciseTime) {
            exerciseTime.incrementTodayExerciseTime(self.activeTime);
            self.activeTime = 0;
            self.updatedExerciseTime = false;
        }
        if (self.updatedBlockedSiteTime) {
            synchronizer.syncBlacklist(blockedSites);
            self.updatedExerciseTime = false;
        }

    };

    // Check if the user is idle. If the user is not idle, increment a counter.
    this.matchUrls = function () {
        if (!self.idle) {
            self.getCurrentTab().then(function(result){
                self.tabActive = result;

                // If the user is on a blocked website
                let blockedSitePromise = self.matchUrlToBlockedSite(self.tabActive, blockedSites.getList());
                blockedSitePromise.then(function(result) {
                    self.increaseTimeCounterBlockedSite(result);
                }).catch(function(reject){});

                // If the user is working on exercises
                if (self.compareDomain(self.tabActive, zeeguuDomain)) {
                    self.increaseTimeCounterExercises()
                }
            });
        }
    };

    this.increaseTimeCounterExercises = function () {
        self.updatedExerciseTime = true;
        self.activeTime = self.activeTime + 1;
    };

    this.increaseTimeCounterBlockedSite = function (blockedSite) {
        self.updatedBlockedSiteTime = true;
        blockedSite.setTimeSpent(blockedSite.getTimeSpent()+1);
    };

    this.matchUrlToBlockedSite = function (url, blockedSites) {
        return new Promise(function(resolve, reject){
            blockedSites.forEach(function(item){
                if(self.compareDomain(url, item.getDomain())) {
                    resolve(item);
                }
            });
            reject();
        });
    };

    // Creates a regex string which using the domain of an url.
    this.createRegexFromDomain = function (domain) {
        return "^(http[s]?:\\/\\/)?(.*)"+domain+".*$";
    };

    // Compares the domain of an url to another domain using a regex.
    this.compareDomain = function (url, domain) {
        return self.compareUrlToRegex(url, self.createRegexFromDomain(domain));
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
