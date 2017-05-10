define('BlockedSite', ['constants'], function BlockedSite(constants) {

    /* --------------- --------------- Serialization --------------- --------------- */
    //Private to this and storage.js
    serializeBlockedSite = function (blockedSite) {
        var obj = {
            url: blockedSite.getUrl(),
            domain: blockedSite.getDomain(),
            name: blockedSite.getName(),
            icon: blockedSite.getIcon(),
            checkboxVal: blockedSite.getCheckboxVal(),
            counter: blockedSite.getCounter(),
            timeSpent: blockedSite.getTimeSpent()
        };
        return JSON.stringify(obj);
    };

    //Private to this and blocked_site_list
    parseBlockedSite = function (blockedSite) {
        var b = new BlockedSite();
        b.setUrl(blockedSite.url);
        b.setDomain(blockedSite.domain);
        b.setName(blockedSite.name);
        b.setIcon(blockedSite.icon);
        b.setCheckboxVal(blockedSite.checkboxVal);
        b.setCounter(blockedSite.counter);
        b.setTimeSpent(blockedSite.timeSpent);
        return b;
    };

    //Private to this and storage.js
    deserializeBlockedSite = function (serializedBlockedSite) {
        if (serializedBlockedSite != null) {
            var parsed = JSON.parse(serializedBlockedSite);
            return parseBlockedSite(parsed);
        }
        return null;
    };

    /* --------------- --------------- --------------- --------------- --------------- */

    function BlockedSite(urlBase, title) {
        constructUrl = function (url) {
            return "*://" + url + "/*";
        };

        constructIcon = function (url) {
            return "<img style=\"-webkit-user-select: none\" src=\"" + constants.FAVICONLINK + url + "\">"
        };

        var url = constructUrl(urlBase);
        var domain = urlBase;
        var name = title;
        var icon = constructIcon(urlBase);
        var checkboxVal = true;
        var counter = 0;
        var timeSpent = 0;

        this.getUrl = function () {
            return url;
        };
        this.setUrl = function (newUrl) {
            url = newUrl;
        };
        this.getDomain = function () {
            return domain;
        };
        this.setDomain = function (newDomain) {
            domain = newDomain;
        };
        this.getIcon = function () {
            return icon;
        };
        this.setIcon = function (newIcon) {
            icon = newIcon;
        };
        this.getName = function () {
            return name;
        };
        this.setName = function (newName) {
            name = newName;
        };
        this.getCounter = function () {
            return counter;
        };
        this.setCounter = function (newVal) {
            counter = newVal;
        };

        this.setTimeSpent = function(newVal) {
            timeSpent = newVal;
        };

        this.getTimeSpent = function() {
            return timeSpent;
        };

        this.getCheckboxVal = function () {
            return checkboxVal;
        };
        this.setCheckboxVal = function (newVal) {
            checkboxVal = newVal;
        };

    }

    return {
        BlockedSite : BlockedSite,
        serializeBlockedSite : serializeBlockedSite,
        deserializeBlockedSite : deserializeBlockedSite,
        parseBlockedSite : parseBlockedSite
    }

});

