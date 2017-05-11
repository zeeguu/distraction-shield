import * as urlFormatter from '/Distraction Shield/modules/urlFormatter';
import '/Distraction Shield/classes/BlockedSite';

// this requires a callback since the getUrlFromServer is asynchronous
export default function createNewBlockedSite(newUrl, callback) {
    urlFormatter.getUrlFromServer(newUrl, function (url, title) {
        var bs = new BlockedSite(url, title);
        callback(bs);
    });
}


