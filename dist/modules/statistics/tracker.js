'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../../constants');

var constants = _interopRequireWildcard(_constants);

var _exerciseTime = require('./exerciseTime');

var exerciseTime = _interopRequireWildcard(_exerciseTime);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// The tracker tracks whether you are currently working on exercises.
// Every second, the "alarm" is fired, and the url of the current tab is examined.
// If this url corresponds with the zeeguu url, the time spent on exercises counter is incremented.
var Tracker = function () {
    function Tracker() {
        _classCallCheck(this, Tracker);

        this.idle = false;
        this.tabActive = null;
        this.activeTime = 0;
        this.updatedExerciseTime = false;
        this.updatedBlockedSiteTime = false;
        this.zeeguuRegex = constants.zeeguuExLink + ".*";
    }

    // Gets the current tab.


    _createClass(Tracker, [{
        key: 'getCurrentTab',
        value: function getCurrentTab() {
            return new Promise(function (resolve, reject) {
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
                    if (tabs.length === 1) {
                        resolve(tabs[0].url);
                    }
                });
            });
        }
    }, {
        key: 'init',


        ///TODO remove this.zeeguuRegex = constants.zeeguuExLink + ".*";

        // Initialize the alarm, and initialize the idle-checker.

        value: function init() {
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

    }, {
        key: 'fireAlarm',
        value: function fireAlarm() {
            if (this.activeTime > 0) {
                exerciseTime.incrementTodayExerciseTime(this.activeTime);
                this.activeTime = 0;
            }
        }
    }, {
        key: 'increaseTimeCounter',


        // Check if the user is idle. If the user is not idle, and on the zeeguu website, increment the counter.
        value: function increaseTimeCounter() {
            if (!this.idle) {
                this.getCurrentTab().then(function (result) {
                    this.tabActive = result;
                });
                if (this.compareUrlToRegex(this.zeeguuRegex, this.tabActive)) {
                    this.activeTime = this.activeTime + 1;
                }
            }
        }
    }, {
        key: 'checkIdle',


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
        value: function checkIdle(idleState) {
            this.idle = idleState !== "active";
        }
    }, {
        key: 'compareUrlToRegex',


        // Compare regex to url.
        value: function compareUrlToRegex(regex, url) {
            return RegExp(regex).test(url);
        }
    }]);

    return Tracker;
}();

exports.default = Tracker;