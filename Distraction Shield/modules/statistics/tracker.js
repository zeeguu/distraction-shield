import * as constants from '../../constants';
import * as exerciseTime from './exerciseTime';
import * as storage from '../storage'
import BlockedSiteList from '../../classes/BlockedSiteList'

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
        this.blockedsites = new BlockedSiteList();

    }

    // Gets the current tab.
    getCurrentTab() {
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                if (tabs.length == 1) {
                    resolve(tabs[0].url);
                }
            });
        });
    }

    // Initialize the alarm, and initialize the idle-checker.
    init() {
        setInterval(this.fireAlarm.bind(this), constants.savingFrequency);
        setInterval(this.increaseTimeCounter.bind(this), constants.measureFrequency);

        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(constants.idleTime);
        chrome.idle.onStateChanged.addListener(this.checkIdle);

        storage.getBlacklistPromise().then((result) => {
            this.blockedsites.addAllToList(result);
        });
    }

    fireAlarm() {
        if (this.updatedExerciseTime) {
            exerciseTime.incrementTodayExerciseTime(this.activeTime);
            this.activeTime = 0;
            this.updatedExerciseTime = false;
        }
        if (this.updatedBlockedSiteTime) {
            storage.setBlacklist(this.blockedsites);
            this.updatedBlockedSiteTime = false;
        }
    }

    // Check if the user is idle. If the user is not idle, and on the zeeguu website, increment the counter.
    increaseTimeCounter() {
        if (!this.idle) {
            this.getCurrentTab().then((tabActive) => {
                this.matchUrls(tabActive);
            });
        }
    }

    matchUrls(tabActive) {
        if(this.matchToZeeguu(tabActive)) {
            this.incTimeExercises();
        } else {
            this.matchToBlockedSites(tabActive).then((site) => {
                this.incTimeBlockedSite(site);
           });
        }
    }

    matchToZeeguu(tabActive) {
        return this.compareDomain(tabActive, constants.zeeguuExTracker);
    }

    incTimeExercises() {
        this.activeTime += 1;
        this.updatedExerciseTime = true;

    }

    incTimeBlockedSite(site) {
        site.timeSpent += 1;
        this.updatedBlockedSiteTime = true;
    }

    matchToBlockedSites(tabActive) {
        return new Promise((resolve, reject) => {
            let match = this.blockedsites.list.find((site) => this.compareDomain(tabActive, site.domain));
            if(typeof match !== 'undefined') resolve(match);
        });

    }

    // Creates a regex string which using the domain of an url.
    createRegexFromDomain(domain) {
        return "^(http[s]?:\\/\\/)?(.*)"+domain+".*$";
    };

    // Compares the domain of an url to another domain using a regex.
    compareDomain(url, domain) {
        return Tracker.compareUrlToRegex(this.createRegexFromDomain(domain), url);
    };

    // Function attached to the idle-listener. Sets the this.idle variable.
    checkIdle(idleState) {
        this.idle = (idleState != "active");
    }

    // Compare regex to url.
    static compareUrlToRegex(regex, url) {
        return RegExp(regex).test(url);
    }

}
