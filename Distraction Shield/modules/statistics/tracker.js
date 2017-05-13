import * as constants from '../../constants';
import * as exerciseTime from './exerciseTime';

// The tracker tracks whether you are currently working on exercises.
// Every second, the "alarm" is fired, and the url of the current tab is examined.
// If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.
export default class Tracker {

    constructor() {
        this.idle = false;
        this.tabActive = null;
        this.activeTime = 0;
        this.updatedExerciseTime = false;
        this.updatedBlockedSiteTime = false;
        this.zeeguuRegex = constants.zeeguuExLink + ".*";
    }

    // Gets the current tab.
    getCurrentTab() {
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                if (tabs.length === 1) {
                    resolve(tabs[0].url);
                }
            });
        });
    };

    ///TODO remove this.zeeguuRegex = constants.zeeguuExLink + ".*";

    // Initialize the alarm, and initialize the idle-checker.

    init() {
        setInterval(this.fireAlarm, constants.savingFrequency);
        setInterval(this.increaseTimeCounter, constants.measureFrequency);
        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(constants.idleTime);
        chrome.idle.onStateChanged.addListener(this.checkIdle);

    }

    // TODO replace old function with this one
    // fireAlarm = function () {
    //     if (this.updatedExerciseTime) {
    //         exerciseTime.incrementTodayExerciseTime(this.activeTime);
    //         this.activeTime = 0;
    //         this.updatedExerciseTime = false;
    //     }
    //     if (this.updatedBlockedSiteTime) {
    //         synchronizer.syncBlacklist(blockedSites);
    //         this.updatedExerciseTime = false;
    //     }
    // };

    // TODO REMOVE
    fireAlarm() {
        if (this.activeTime > 0) {
            exerciseTime.incrementTodayExerciseTime(this.activeTime);
            this.activeTime = 0;
        }
    };

    // Check if the user is idle. If the user is not idle, and on the zeeguu website, increment the counter.
    increaseTimeCounter() {
        if (!this.idle) {
            this.getCurrentTab().then(function (result) {
                this.tabActive = result;
            });
            if (this.compareUrlToRegex(this.zeeguuRegex, this.tabActive)) {
                this.activeTime = this.activeTime + 1;
            }
        }
    };

    //TODO implement tracker for websites
    // // Check if the user is idle. If the user is not idle, increment a counter.
    // matchUrls = function () {
    //     if (!this.idle) {
    //         this.getCurrentTab().then(function(result){
    //             this.tabActive = result;
    //
    //             // If the user is working on exercises
    //             if (this.compareDomain(this.tabActive, constants.zeeguuExLink)) {
    //                 this.increaseTimeCounterExercises()
    //             } else {
    //                 // If the user is on a blocked website
    //                 let blockedSitePromise = this.matchUrlToBlockedSite(this.tabActive, blockedSites.getList());
    //                 blockedSitePromise.then(function(result) {
    //                     this.increaseTimeCounterBlockedSite(result);
    //                 }).catch(function(reject){});
    //             }
    //         });
    //     }
    // };
    //
    // this.increaseTimeCounterExercises = function () {
    //     this.updatedExerciseTime = true;
    //     this.activeTime = this.activeTime + 1;
    // };
    //
    // this.increaseTimeCounterBlockedSite = function (blockedSite) {
    //     this.updatedBlockedSiteTime = true;
    //     blockedSite.setTimeSpent(blockedSite.getTimeSpent()+1);
    // };
    //
    // this.matchUrlToBlockedSite = function (url, blockedSites) {
    //     return new Promise(function(resolve, reject){
    //         blockedSites.forEach(function(item){
    //             if(this.compareDomain(url, item.getDomain())) {
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
    //     return this.compareUrlToRegex(url, this.createRegexFromDomain(domain));
    // };

    // Function attached to the idle-listener. Sets the this.idle variable.
    checkIdle(idleState) {
        this.idle = (idleState !== "active");
    };

    // Compare regex to url.
    compareUrlToRegex(regex, url) {
        return RegExp(regex).test(url);
    };

}
