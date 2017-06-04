import * as constants from '../../constants';
import * as exerciseTime from './exerciseTime';
import * as storage from '../storage'
import BlockedSiteList from '../../classes/BlockedSiteList'

/**
 * The tracker tracks whether you are currently working on exercises.
 * Every second, the "alarm" is fired, and the url of the current tab is examined.
 * If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.
 */
export default class Tracker {

    constructor() {
        this.wasIdle = false;
        this.blockedsites = new BlockedSiteList();
        this.previousTime = new Date();
        this.currentTab = null;
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
        this.getBlockedSites();
        this.addStorageOnChangedListener();

        this.addIdleListener();
        this.addAlarmListener();
        this.addOnActiveTabChangeListener();
        this.addOnTabUpdateListener();

        this.createTrackerAlarm();

        this.getCurrentTab().then((tab) => this.currentTab = tab);
    }

    triggerUpdateTime() {
        let tab = this.currentTab;
        let timeSpent = new Date() - this.previousTime;
        this.previousTime = new Date();
        if(!this.wasIdle) {
            if (this.matchToZeeguu(tab.url)) {
                this.incTimeExercises(timeSpent);
            } else {
                this.matchToBlockedSites(tab.url).then((site) => {
                    this.incTimeBlockedSite(site, timeSpent);
                });
            }
        } else {
            this.wasIdle = false;
        }
    }

    createTrackerAlarm(){
        chrome.alarms.create('trackerAlarm', {periodInMinutes: constants.trackerAlarmFrequency});
    }

    updateIdleState(idleState) {
        if(idleState == "idle") {
            chrome.alarms.clear("trackerAlarm");
        } else if (idleState == "active") {
            this.wasIdle = true;
            this.createTrackerAlarm();
        }
        this.triggerUpdateTime();
    }

    addIdleListener() {
        // When the user does not input anything for 15 seconds, set the state to idle.
        chrome.idle.setDetectionInterval(constants.idleTime);
        chrome.idle.onStateChanged.addListener(this.updateIdleState.bind(this));
    }

    addAlarmListener() {
        chrome.alarms.onAlarm.addListener((alarm) => {
            if(alarm && alarm.name == 'trackerAlarm') {
                this.getCurrentTab().then((tab) => {
                   if(tab.url === this.currentTab.url) {
                       this.triggerUpdateTime();
                   } else {
                       this.currentTab = tab;
                   }
                })
            }
        });
    }

    addOnActiveTabChangeListener() {
        chrome.tabs.onActivated.addListener((activeInfo) => {
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                this.triggerUpdateTime();
                this.currentTab = tab;
            })
        });
    }

    addOnTabUpdateListener() {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if(changeInfo.status === 'loading') {
                chrome.tabs.query({active: true}, (tabs) => {
                    if(tabId == tabs[0].id) {
                        this.triggerUpdateTime();
                        this.currentTab = tab;
                    }
                });
            }
        });
    }

    /**
     * intiates listener to find updates to the list of blocked sites.
     */
    addStorageOnChangedListener() {
        chrome.storage.onChanged.addListener(this.handleStorageChange.bind(this));
    }

    handleStorageChange(changes) {
        if (constants.tds_blacklist in changes) {
            let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[constants.tds_blacklist].newValue);
            // Extract the time-spent values from the this.blockedsites.
            let timeValues = this.retrieveTimeSpent(this.blockedsites);
            // Replace this.blockedsites with the data from the storage
            this.blockedsites = newBlockedSiteList;
            // Put the extracted time-spent values back into this.blockedsites
            this.putBackTimeSpent(timeValues);
        }
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
     * Check whether the passed url is in the BlockedSiteList
     * @param {string} tabActive url of the active tab
     */
    matchUrls(tabActive) {

    }

    matchToZeeguu(tabActive) {
        return this.compareDomain(tabActive, constants.zeeguuExTracker);
    }

    incTimeExercises(timeSpent) {
        exerciseTime.incrementTodayExerciseTime(timeSpent);
    }

    incTimeBlockedSite(site, timeSpent) {
        site.timeSpent += timeSpent;
        storage.setBlacklist(this.blockedsites);
    }

    matchToBlockedSites(tabActive) {
        return new Promise((resolve, reject) => {
            let match = this.blockedsites.list.find((site) => this.compareDomain(tabActive, site.domain));
            if (typeof match !== 'undefined') resolve(match);
        });
    }

    // Compares the domain of an url to another domain using a regex.
    compareDomain(url, domain) {
        return Tracker.compareUrlToRegex(this.createRegexFromDomain(domain), url);
    };

    // Creates a regex string which using the domain of an url.
    createRegexFromDomain(domain) {
        return "^(http[s]?:\\/\\/)?(.*)" + domain + ".*$";
    };

    // Compare regex to url.
    static compareUrlToRegex(regex, url) {
        return RegExp(regex).test(url);
    }

}
