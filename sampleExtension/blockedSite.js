function BlockedSite(url, title) {
    this.getUrl = function (url) {
        url = stripOfScheme(url);
        url = stripOfFileName(url);
        return "*://" + url + "/*";
    };

    this.getIcon = function (url) {
        console.log(url);
        url = stripOfScheme(url);
        url = stripOfFileName(url);
        return "<img style=\"-webkit-user-select: none\" src=\"https://www.google.com/s2/favicons?domain=" + url + "\">"
    };

    this.url = this.getUrl(url);
    this.name = title;

    this.icon = this.getIcon(url);
    this.lastVisited = new Date();
    this.checkboxVal = true;
    this.counter = 0;
};

