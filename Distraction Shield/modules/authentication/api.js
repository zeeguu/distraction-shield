define ('api', ['constants'], function Api(constants) {

        postRequest = function (url, parameters) {
            return request("POST", url, parameters);
        };

        getRequest = function (url, parameters) {
            return request("GET", url, parameters);
        };

        request = function (method, url, parameters) {
            return new Promise(function (resolve, reject) {
                let httpRequest = new XMLHttpRequest();
                httpRequest.open(method, constants.apiUrl + url);
                httpRequest.onload = function () {
                    if (httpRequest.status === 200) {
                        resolve(httpRequest.response);
                    } else {
                        reject(new Error(httpRequest.statusText));
                    }
                };
                httpRequest.onerror = function () {
                    reject(new Error("Network error"));
                };
                httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                httpRequest.send(parameters);
            });
        };

    return {
        postRequest: postRequest,
        getRequest: getRequest,
        request: request
    }
});

// var api = new Api();