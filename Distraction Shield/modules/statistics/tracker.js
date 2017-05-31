import * as constants from '../../constants';
import * as exerciseTime from './exerciseTime';
import * as storage from '../storage'
import BlockedSiteList from '../../classes/BlockedSiteList'
import * as api from '../api'


/**
 * The tracker tracks whether you are currently working on exercises.
 * Every second, the "alarm" is fired, and the url of the current tab is examined.
 * If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.
 */
export default class Tracker {

    constructor() {
        this.idle = false;
        this.activeTimeEx = 0;
        this.updatedExerciseTime = false;
        this.updatedBlockedSiteTime = false;
        this.blockedsites = new BlockedSiteList();
    }

    /**
     * gets the current tab
     * @returns {Promise}
     */
    getCurrentTab() {
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                if (tabs.length == 1) {
                    resolve(tabs[0]);
                }
            });
        });
    }

    /**
     * Initialize the alarm, and initialize the idle-checker.
     */
    init() {
        //setInterval(this.fireAlarm.bind(this), constants.savingFrequency);
        //setInterval(this.increaseTimeCounter.bind(this), constants.measureFrequency);

        this.getBlockedSites();
        this.addBlockedSitesUpdateListener();

        // When the user does not input anything for 15 seconds, set the state to idle.
        //chrome.idle.setDetectionInterval(constants.idleTime);
        chrome.idle.setDetectionInterval(15);
        chrome.idle.onStateChanged.addListener(this.updateIdleState.bind(this));

        this.addAlarmListener();
        this.addOnActiveTabChangeListener();
        this.addOnTabUpdateListener();

        this.createTrackerAlarm();

        api.postRequest('http://httpbin.org/post', null).then((res) => console.log(res));
    }

    createTrackerAlarm(){
        chrome.alarms.create('trackerAlarm', {periodInMinutes: 0.1});
    }

    // Function attached to the idle-listener. Sets the this.idle variable.
    updateIdleState(idleState) {
        this.getCurrentTab().then(this.updateTime);
        console.log("Idle state changed to "+idleState);
        if(idleState == "idle") {
            chrome.alarms.clear("trackerAlarm");
        } else if (idleState == "active") {
            this.createTrackerAlarm();
        }
        //this.idle = (idleState != "active");
    }

    updateTime(tab) {
        console.log('update time! '+tab.url);
    }

    addAlarmListener() {
        chrome.alarms.onAlarm.addListener((alarm) => {
            if(alarm && alarm.name == 'trackerAlarm') {
                this.getCurrentTab().then(this.updateTime);
            }
        });
    }
    addOnActiveTabChangeListener() {
        chrome.tabs.onActivated.addListener((activeInfo) => {
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                this.updateTime(tab);
            })
        });
    }
    addOnTabUpdateListener() {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if(changeInfo.status === 'complete') {
                chrome.tabs.query({active: true}, (tabs) => {
                    if(tabId == tabs[0].id) {
                        this.updateTime(tab);
                    }
                });
            }
        });
    }


    /**
     * intiates listener to find updates to the list of blocked sites.
     */
    addBlockedSitesUpdateListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message === "updateListener") {
                this.updateStorageBlockedSites();
            }
        });
    }

    /**
     * updates the values in the storage to hold the right statistics
     */
    updateStorageBlockedSites() {
        // Retrieve the blocked sites from the storage
        storage.getBlacklistPromise().then((blockedsites) => {
            // Extract the time-spent values from the this.blockedsites.
            let timeValues = this.retrieveTimeSpent(this.blockedsites);
            // Replace this.blockedsites with the data from the storage
            this.blockedsites = blockedsites;
            // Put the extracted time-spent values back into this.blockedsites
            this.putBackTimeSpent(timeValues);
            // Update the storage with these new values.
            storage.setBlacklist(this.blockedsites);
        });
    }

    /**
     * Get a list of the time wasted on all BlockedSites from the BlockedSiteList
     * @param {BlockedSiteList} blockedsites
     * @returns {Array}
     */
    retrieveTimeSpent(blockedsites) {
        let list = [];
        blockedsites.list.map((item) => list.push({'domain': item.domain, 'timeSpent': item.timeSpent}));
        return list;
    }

    putBackTimeSpent(timeValues) {
        this.blockedsites.list.map((blockedSite) => {
            let bSite = timeValues.find((timeValue) => timeValue.domain == blockedSite.domain);
            if (bSite != undefined) blockedSite.timeSpent = bSite.timeSpent;
        });
    }

    /**
     * retrieve the BlockedSiteList from the storage.
     */
    getBlockedSites() {
        storage.getBlacklistPromise().then((result) => {
            this.blockedsites.addAllToList(result);
        });
    }

    /**
     * function that increments the time spent on different websites
     */
    fireAlarm() {
        if (this.updatedExerciseTime) {
            exerciseTime.incrementTodayExerciseTime(this.activeTimeEx);
            this.activeTimeEx = 0;
            this.updatedExerciseTime = false;
        }
        if (this.updatedBlockedSiteTime) {
            this.updateStorageBlockedSites();
            this.updatedBlockedSiteTime = false;
        }
    }

    /**
     * Check if the user is idle. If the user is not idle, and on the zeeguu website, increment the counter.
     */
    increaseTimeCounter() {
        if (!this.idle) {
            this.getCurrentTab().then((tabActive) => {
                this.matchUrls(tabActive.url);
            });
        }
    }

    /**
     * Check whether the passed url is in the BlockedSiteList
     * @param {string} tabActive url of the active tab
     */
    matchUrls(tabActive) {
        if (this.matchToZeeguu(tabActive)) {
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
        this.activeTimeEx += 1;
        this.updatedExerciseTime = true;
    }

    incTimeBlockedSite(site) {
        site.timeSpent += 1;
        this.updatedBlockedSiteTime = true;
    }

    matchToBlockedSites(tabActive) {
        return new Promise((resolve, reject) => {
            let match = this.blockedsites.list.find((site) => this.compareDomain(tabActive, site.domain));
            if (typeof match !== 'undefined') resolve(match);
        });
    }

    // Creates a regex string which using the domain of an url.
    createRegexFromDomain(domain) {
        return "^(http[s]?:\\/\\/)?(.*)" + domain + ".*$";
    };

    // Compares the domain of an url to another domain using a regex.
    compareDomain(url, domain) {
        return Tracker.compareUrlToRegex(this.createRegexFromDomain(domain), url);
    };

    // Compare regex to url.
    static compareUrlToRegex(regex, url) {
        return RegExp(regex).test(url);
    }

}
