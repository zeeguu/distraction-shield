"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewBlockedSite = createNewBlockedSite;

var _urlFormatter = require("./urlFormatter.js");

var urlFormatter = _interopRequireWildcard(_urlFormatter);

var _BlockedSite = require("../classes/BlockedSite.js");

var BlockedSite = _interopRequireWildcard(_BlockedSite);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// this requires a callback since the getUrlFromServer is asynchronous
function createNewBlockedSite(newUrl, callback) {
    urlFormatter.getUrlFromServer(newUrl, function (url, title) {
        var bs = new BlockedSite.BlockedSite(url, title);
        callback(bs);
    });
}