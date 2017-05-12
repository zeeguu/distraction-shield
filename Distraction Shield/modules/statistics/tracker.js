import * as constants from '../../constants';
import * as exerciseTime from './exerciseTime';


// The tracker tracks whether you are currently working on exercises.
// Every second, the "alarm" is fired, and the url of the current tab is examined.
// If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.

    var self = this;
    this.idle = false;
    this.tabActive = null;
    this.activeTime = 0;
    this.updatedExerciseTime = false;
    this.updatedBlockedSiteTime = false;
    ///TODO remove this.zeeguuRegex = constants.zeeguuExLink + ".*";

    // Initialize the alarm, and initialize the idle-checker.
    export function init () {
        setInterval(fireAlarm, constants.savingFrequency);
        setInterval(increaseTimeCounter, constants.measureFrequency);

        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(constants.idleTime);
        chrome.idle.onStateChanged.addListener(checkIdle);

    };

    // TODO replace old function with this one
    // fireAlarm = function () {
    //     if (self.updatedExerciseTime) {
    //         exerciseTime.incrementTodayExerciseTime(self.activeTime);
    //         self.activeTime = 0;
    //         self.updatedExerciseTime = false;
    //     }
    //     if (self.updatedBlockedSiteTime) {
    //         synchronizer.syncBlacklist(blockedSites);
    //         self.updatedExerciseTime = false;
    //     }
    // };

    // TODO REMOVE
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

    //TODO implement tracker for websites
    // // Check if the user is idle. If the user is not idle, increment a counter.
    // matchUrls = function () {
    //     if (!self.idle) {
    //         self.getCurrentTab().then(function(result){
    //             self.tabActive = result;
    //
    //             // If the user is working on exercises
    //             if (self.compareDomain(self.tabActive, constants.zeeguuExLink)) {
    //                 self.increaseTimeCounterExercises()
    //             } else {
    //                 // If the user is on a blocked website
    //                 let blockedSitePromise = self.matchUrlToBlockedSite(self.tabActive, blockedSites.getList());
    //                 blockedSitePromise.then(function(result) {
    //                     self.increaseTimeCounterBlockedSite(result);
    //                 }).catch(function(reject){});
    //             }
    //         });
    //     }
    // };
    //
    // this.increaseTimeCounterExercises = function () {
    //     self.updatedExerciseTime = true;
    //     self.activeTime = self.activeTime + 1;
    // };
    //
    // this.increaseTimeCounterBlockedSite = function (blockedSite) {
    //     self.updatedBlockedSiteTime = true;
    //     blockedSite.setTimeSpent(blockedSite.getTimeSpent()+1);
    // };
    //
    // this.matchUrlToBlockedSite = function (url, blockedSites) {
    //     return new Promise(function(resolve, reject){
    //         blockedSites.forEach(function(item){
    //             if(self.compareDomain(url, item.getDomain())) {
    //                 resolve(item);
    //             }
    //         });
    //         reject();
    //     });
    // };
    //
    // // Creates a regex string which using the domain of an url.
    // this.createRegexFromDomain = function (domain) {
    //     return "^(http[s]?:\\/\\/)?(.*)"+domain+".*$";
    // };
    //
    // // Compares the domain of an url to another domain using a regex.
    // this.compareDomain = function (url, domain) {
    //     return self.compareUrlToRegex(url, self.createRegexFromDomain(domain));
    // };

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



// var tracker = new Tracker();
// tracker.init();
