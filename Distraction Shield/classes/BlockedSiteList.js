import BlockedSite from './BlockedSite';
import * as constants from '/Distraction Shield/constants';

/* --------------- --------------- Serialization --------------- --------------- */

//Private to this and storage.js
export function serializeBlockedSiteList (blockedSiteList) {
    var obj = {
        list: blockedSiteList.getList()
    };
    obj.list = obj.list.map(BlockedSite.serializeBlockedSite);
    return JSON.stringify(obj);
}
//Private method
export function parseBlockedSiteList (blockedSiteList) {
    var bl = new BlockedSiteList();
    bl.setList(blockedSiteList.list);
    return bl;
}
//Private to this and storage.js
export function deserializeBlockedSiteList(serializedBlockedSiteList) {
    if (serializedBlockedSiteList != null) {
        var parsed = JSON.parse(serializedBlockedSiteList);
        parsed.list = parsed.list.map(BlockedSite.deserializeBlockedSite);
        return parseBlockedSiteList(parsed);
    }
    return null;
}
/* --------------- --------------- --------------- --------------- --------------- */

export class BlockedSiteList {
    constructor () {
        this._list = [];
    }


    set list (blockedSiteArr)   { this._list = blockedSiteArr }
    get list ()                 { return this._list }

    get urls () {
        if (list != []) {
            return list.map(function (bs) {
                return bs.url();
            });
        }
        return [];
    }

    get activeUrls () {
        if (list != []) {
            var urlList = this.filterOnChecked();
            if (urlList != []) {
                return urlList.map(function (bs) {
                    return bs.url();
                });
            }
        }
        return [];
    }

    addToList (newBlockedSite) {
        var currentUrls = this.urls;
        var unique = currentUrls.every(function (urlFromList) {
            return urlFromList != newBlockedSite.getUrl();
        });
        if (unique) {
            list.push(newBlockedSite);
            return true;
        } else {
            alert(constants.newUrlNotUniqueError + newBlockedSite.getDomain());
            return false;
        }
    };

    addAllToList (blockedSiteList) {
        for (var i = 0; i < blockedSiteList.getList().length; i++) {
            this.addToList(blockedSiteList.getList()[i]);
        }
    };

    removeFromList (blockedSiteToDelete) {
        var urlKey = list.indexOf(blockedSiteToDelete);
        if (urlKey > -1) {
            list.splice(urlKey, 1);
            return true;
        } else {
            return false;
        }
    };

    filterOnChecked () {
        if (list != []) {
            return list.filter(function (a) {
                return a.getCheckboxVal() == true;
            });
        }
        return [];
    };

}

