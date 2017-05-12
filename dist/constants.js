"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* ---------- ----- background ----- ---------- */
var zeeguuExLink = exports.zeeguuExLink = "https://www.zeeguu.unibe.ch/practice/get-ex";

/* ---------- ----- BlockedSite ----- ---------- */
var FAVICONLINK = exports.FAVICONLINK = "https://www.google.com/s2/favicons?domain=";
/* ---------- ----- export const ants for statistics ----- ---------- */

// The time in seconds after which a user is considered to be idle. Important for tracking the amount of time spent on a url.
// Minimum value is 15 seconds.
var idleTime = exports.idleTime = 15;

// The time in milliseconds of how many times the url of the website is compared to the blacklist or the exercise page.
var measureFrequency = exports.measureFrequency = 1000;

// The time in milliseconds after which the time tracking export const iables are saved to the local or sync storage.
var savingFrequency = exports.savingFrequency = 5000;

/* ---------- ----- UserSettings, inject ----- ---------- */
var modes = exports.modes = {
    lazy: {
        label: "lazy",
        zeeguuText: "You are in lazy mode. Click <a id='originalDestination'>'Skip'</a> any time to continue browsing."
    },
    pro: {
        label: "pro",
        zeeguuText: "You are in pro mode. Complete the exercise and click the 'Take me away!' button when you are done to continue browsing."
    }
};

/* ---------- ----- BlockedSiteList ----- ---------- */
var newUrlNotUniqueError = exports.newUrlNotUniqueError = "New blocked site item to be added was found to resolve to an already blacklisted website, " + "please try a different url.\nDuplicate url: ";

/* ---------- ----- urlFormatter ----- ---------- */
var INVALID_URL_MESSAGE = exports.INVALID_URL_MESSAGE = "We unfortunately could not reach the site you are trying to block.\n" + "Are you sure the url is correct? \n \n";

/* -------------------- Text Messages ----------------------- */
var zeeguuInfoText = exports.zeeguuInfoText = "Hey, you tried to enter one of the sites you wanted to be protected from!";

/* -------------------- Keypress export const ants ----------------------- */
/* ---------- ----- optionsPage/htmlFunctionality ----- ---------- */
var KEY_DELETE = exports.KEY_DELETE = 46;
var KEY_ENTER = exports.KEY_ENTER = 13;

/* -------------------- Number export const ants ----------------------- */

// The amount of milliseconds in one day
var oneDay = exports.oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

/* ---------- ----- turnoffSlider ----- ---------- */
var MAX_TURN_OFF_TIME = exports.MAX_TURN_OFF_TIME = 480;