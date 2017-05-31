import {getUrlFromServer} from "./urlFormatter";
import BlockedSite from "../classes/BlockedSite";

// this requires a callback since the getUrlFromServer is asynchronous
/**
 * Constructs a new blockedSite instance using the given url, and passes it on to the callback
 * The only real right way of creating a new blocked site. For this it uses the BlockedSite and the urlFormatter.
 * @param {string} newUrl the unformatted url of which to construct a BlockedSite
 * @param {function} callback function that takes one argument: the new BlockedSite
 */
export function createNewBlockedSite(newUrl, callback) {
    getUrlFromServer(newUrl, function (url, title) {
        let bs = new BlockedSite(url, title);
        callback(bs);
    });
}
