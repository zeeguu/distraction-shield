define ([], function BlockedSiteList() {
    /* --------------- --------------- Serialization --------------- --------------- */

    //Private to this and storage.js
    serializeBlockedSiteList = function (blockedSiteList) {
        return JSON.stringify(blockedSiteList);
    };

    //Private method
    parseBlockedSiteList = function (blockedSiteList) {
        var bl = new BlockedSiteList();
        bl.list = blockedSiteList.list;
        return bl;
    };

    //Private to this and storage.js
    deserializeBlockedSiteList = function (serializedBlockedSiteList) {
        if (serializedBlockedSiteList != null) {
            var parsed = JSON.parse(serializedBlockedSiteList);
            parsed.list = parsed.list.map(parseBlockedSite);
            return parseBlockedSiteList(parsed);
        }
        return null;
    };

    /* --------------- --------------- --------------- --------------- --------------- */


    return function () {
        this.list = [];

        this.setList = function (blockedSiteArr) {
            this.list = blockedSiteArr;
        };
        this.getList = function () {
            return this.list;
        };


        this.addToList = function (newBlockedSite) {
            var currentUrls = this.getUrls();
            var unique = currentUrls.every(function (urlFromList) {
                return urlFromList != newBlockedSite.getUrl();
            });
            if (unique) {
                this.list.push(newBlockedSite);
                return true;
            } else {
                alert(newUrlNotUniqueError + newBlockedSite.getDomain());
                return false;
            }
        };

        this.addAllToList = function (blockedSiteList) {
            for (var i = 0; i < blockedSiteList.getList().length; i++) {
                this.addToList(blockedSiteList.getList()[i]);
            }
        };

        this.removeFromList = function (blockedSiteToDelete) {
            var urlKey = this.list.indexOf(blockedSiteToDelete);
            if (urlKey > -1) {
                this.list.splice(urlKey, 1);
                return true;
            } else {
                return false;
            }
        };

        this.filterOnChecked = function () {
            if (this.list != []) {
                return this.list.filter(function (a) {
                    return a.checkboxVal == true;
                });
            }
            return [];
        };

        this.getUrls = function () {
            if (this.list != []) {
                return this.list.map(function (a) {
                    return a.url;
                });
            }
            return [];
        };

        this.getActiveUrls = function () {
            if (this.list != []) {
                var urlList = this.filterOnChecked();
                if (urlList != []) {
                    return urlList.map(function (a) {
                        return a.url;
                    });
                }
            }
            return [];
        };
    }
});

