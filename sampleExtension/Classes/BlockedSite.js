
function BlockedSite(url, title) {
    this.constructUrl = function (url) {
        return "*://" + url + "/*";
    };

    this.constructIcon = function (url) {
        return "<img style=\"-webkit-user-select: none\" src=\"https://www.google.com/s2/favicons?domain=" + url + "\">"
    };

    this.url = this.constructUrl(url);
    this.name = title;
    this.icon = this.constructIcon(url);
    this.checkboxVal = true;
    this.counter = 0;

    this.getUrl = function() {return this.url;};
    this.getIcon = function() {return this.icon;};
    this.getName = function() {return this.name;};
    this.setCounter = function(newVal) {this.counter = newVal;};
    this.getCounter = function() {return this.counter;};
    this.setCheckboxVal = function(newVal) {this.checkboxVal = newVal;};
    this.getCheckboxVal = function() {return this.checkboxVal;};
}

/* --------------- --------------- Serialization --------------- --------------- */

//Private to this and storage.js
blockedSite_serialize = function(blockedSite) {
    return JSON.stringify(blockedSite);
};

//Private to this and blocked_site_list
parseBlockedSite = function(blockedSite) {
    var b = new BlockedSite();
    b.url = blockedSite.url;
    b.name = blockedSite.name;
    b.icon = blockedSite.icon;
    b.checkboxVal = blockedSite.checkboxVal;
    b.counter = blockedSite.counter;
    return b;
};

//Private to this and storage.js
blockedSite_deserialize = function(serializedBlockedSite) {
    if(serializedBlockedSite != null) {
        var parsed = JSON.parse(serializedBlockedSite);
        return parseBlockedSite(parsed);
    }
    return null;
};

/* --------------- --------------- --------------- --------------- --------------- */