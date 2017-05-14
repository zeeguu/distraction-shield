"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewBlockedSite = createNewBlockedSite;

var _urlFormatter = require("./urlFormatter");

var _BlockedSite = require("../classes/BlockedSite");

var _BlockedSite2 = _interopRequireDefault(_BlockedSite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this requires a callback since the getUrlFromServer is asynchronous
function createNewBlockedSite(newUrl, callback) {
    (0, _urlFormatter.getUrlFromServer)(newUrl, function (url, title) {
        var bs = new _BlockedSite2.default(url, title);
        callback(bs);
    });
}