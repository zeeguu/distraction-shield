/**
 * Created by edser on 3/16/17.
 */

function BlockedSite (input) {
    this.getUrl = function(input) {
        return "*://"+input+"/*";
    };

    this.getName = function(input) {
        var result = extractDomain(input);

        var splitup = result.split(['.']);
        if (splitup.length <= 2) {
            result = splitup[0];
        } else {
            result = splitup[1];
        }
        return result;
    };

    // this.getName = function (str) {
    //     if (!/^https?:\/\//i.test(str)) {
    //         str = 'http://' + str;
    //     }
    //     var uri = new URI();
    //     uri = URI.parse(str);
    //     return uri.hostname;
    // };

    this.getIcon = function(input) {
        return "<img style=\"-webkit-user-select: none\" src=\"https://www.google.com/s2/favicons?domain="+input+"\">"
    };

    this.url = this.getUrl(input);
    this.name = this.getName(input);

    this.icon = this.getIcon(input);
    this.lastVisited = new Date();
    this.checkboxVal = true;
    this.counter=0;

}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

