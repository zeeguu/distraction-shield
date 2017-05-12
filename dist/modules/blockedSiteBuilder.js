"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewBlockedSite = createNewBlockedSite;

var _urlFormatter = require("./urlFormatter.js");

var _BlockedSite = require("../classes/BlockedSite");

// this requires a callback since the getUrlFromServer is asynchronous
function createNewBlockedSite(newUrl, callback) {
    (0, _urlFormatter.getUrlFromServer)(newUrl, function (url, title) {
        var bs = new _BlockedSite.BlockedSite(url, title);
        callback(bs);
    });
}