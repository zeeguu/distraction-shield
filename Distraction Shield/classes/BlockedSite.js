
function BlockedSite(url, title) {
    this.constructUrl = function (url) {
        return "*://" + url + "/*";
    };

    this.constructIcon = function (url) {
        return "<img style=\"-webkit-user-select: none\" src=\""+ FAVICONLINK + url +"\">"
    };

    this.url = this.constructUrl(url);
    this.domain = url;
    this.name = title;
    this.icon = this.constructIcon(url);
    this.checkboxVal = true;
    this.counter = 0;
    this.timeSpent = 0;

    this.getUrl = function () { return this.url; };
    this.getDomain = function () { return this.domain; };
    this.getIcon = function() {return this.icon;};
    this.getName = function() {return this.name;};
    this.setCounter = function(newVal) {this.counter = newVal;};
    this.getCounter = function() {return this.counter;};
    this.setTimeSpent = function(newVal) {this.timeSpent = newVal;};
    this.getTimeSpent = function() {return this.timeSpent;};
    this.setCheckboxVal = function(newVal) {this.checkboxVal = newVal;};
    this.getCheckboxVal = function() {return this.checkboxVal;};
}

/* --------------- --------------- Serialization --------------- --------------- */

//Private to this and storage.js
serializeBlockedSite = function(blockedSite) {
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
    b.timeSpent = blockedSite.timeSpent;

    return b;
};

//Private to this and storage.js
deserializeBlockedSite = function(serializedBlockedSite) {
    if(serializedBlockedSite != null) {
        var parsed = JSON.parse(serializedBlockedSite);
        return parseBlockedSite(parsed);
    }
    return null;
};

/* --------------- --------------- --------------- --------------- --------------- */
