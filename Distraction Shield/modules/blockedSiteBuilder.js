import * as urlFormatter from "./urlFormatter.js";
import * as BlockedSite from "../classes/BlockedSite.js";

    // this requires a callback since the getUrlFromServer is asynchronous
    export function createNewBlockedSite(newUrl, callback) {
        urlFormatter.getUrlFromServer(newUrl, function (url, title) {
            let bs = new BlockedSite.BlockedSite(url, title);
            callback(bs);
        });
    }