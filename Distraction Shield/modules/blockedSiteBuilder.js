import {getUrlFromServer} from "./urlFormatter.js";
import {BlockedSite} from "../classes/BlockedSite";

// this requires a callback since the getUrlFromServer is asynchronous
export function createNewBlockedSite(newUrl, callback) {
    getUrlFromServer(newUrl, function (url, title) {
        let bs = new BlockedSite(url, title);
        callback(bs);
    });
}
