function BlockedSite(url, title) {
    this.getUrl = function (url) {
        var link = document.createElement('a');
        link.setAttribute('href', url);
        var domain = link.hostname;
        return "*://" + domain + "/*";
    };

    this.getIcon = function (url) {
        return "<img style=\"-webkit-user-select: none\" src=\"https://www.google.com/s2/favicons?domain=" + url + "\">"
    };

    this.url = this.getUrl(url);
    this.name = title;

    this.icon = this.getIcon(url);
    this.lastVisited = new Date();
    this.checkboxVal = true;
    this.counter = 0;
};

