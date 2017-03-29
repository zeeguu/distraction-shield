/*
 * format of every Url:
 * "scheme://prefix.domain:port/path/filename"
 *
 * scheme - defines the type of Internet service (most common is http or https)
 * prefix - defines a domain prefix (default for http is www)
 * domain - defines the Internet domain name (like w3schools.com)
 * port - defines the port number at the host (default for http is 80)
 * path - defines a path at the server (If omitted: the root directory of the site)
 * filename - defines the name of a document or resource
 *
 */

stripFinalSlash = function(url) {
    if (url[url.length - 1] == '/') {
        var ans = url.split("");
        ans.pop();
        url = ans.join("");
    }
    return url;
};

stripOfScheme = function(url) {
    var domain = url;
    if (url.indexOf("://") > -1) {
        domain = url.split('://')[1];
    }
    return domain;
};

stripOfPort = function(url) {
    var result = [];
    if (url.indexOf(":") > -1) {
        var splitted = url.split(':');
        result.push(splitted[0]);
        splitted.shift();
        splitted = splitted[0].split('/');
        splitted.shift();
        splitted = splitted.join('/');
        result.push('/' + splitted + '/');
        url = result.join("");
    }
    return url;
};

stripOfFileName = function(url) {
    if (url.indexOf("/") > -1) {
        var result = url.split("").reverse().join("");
        result = result.split(['/']);
        var stripped = [];
        for(var i = 1; i < result.length; i++) {
            stripped.push('/');
            stripped.push(result[i]);
        }
        stripped = stripped.join("").split("").reverse().join("");
        return stripped;
    } else {
        return url;
    }
};


getFullDomain = function(url) {
    if (url.indexOf("/") > -1) {
        return url.split("/")[0];
    } else {
        return url;
    }
};

stripOfAll = function(url) {
    url = stripOfScheme(url);
    url = stripFinalSlash(url);
    url = stripOfPort(url);
    url = stripOfFileName(url);
    url = stripFinalSlash(url);
    return [url, getFullDomain(url)];
};

formatForGetRequest = function(url) {
    var strippedUrl = stripOfAll(url);
    return "http://" + strippedUrl[0];
};

httpGetAsync = function(theUrl, callback, error) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.onreadystatechange = function () {
        // on succesful request, return responseURL
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (xmlHttp.responseText != null) {
                var title = (/<title.*?>(.*?)<\/title>/m).exec(xmlHttp.responseText)[1];
                callback(xmlHttp.responseURL, title);
            } else {
                error(xmlHttp.status);
            }
        }
    };
    // TODO Error handling!
    xmlHttp.onerror = function () {
        error(xmlHttp.status);
    };
    xmlHttp.send(null);
};

submitUrl = function(url, callback) {
    var getUrl = formatForGetRequest(url);
    httpGetAsync(
        getUrl, 
        function (url, title) {
            callback(url, title)
        },
        function (status) { // error callback
            switch (status) {
                case 404:
                    alert('File not found');
                    break;
                case 500:
                    alert('Server error');
                    break;
                case 0:
                    alert('Request aborted');
                    break;
                default:
                    alert('Unknown error ' + status);
            }
        }
    );
};
