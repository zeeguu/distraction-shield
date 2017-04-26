define (['constants'], function Api(constants) {

        postRequest = function (url, parameters) {
            return request("POST", url, parameters);
        };

        getRequest = function (url, parameters) {
            return request("GET", url, parameters);
        };

        request = function (method, url, parameters) {
            return new Promise(function (resolve, reject) {
                let request = new XMLHttpRequest();
                request.open(method, constants.apiUrl + url);
                request.onload = function () {
                    if (request.status === 200) {
                        resolve(request.response);
                    } else {
                        reject(new Error(request.statusText));
                    }
                };
                request.onerror = function () {
                    reject(new Error("Network error"));
                };
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(parameters);
            });
        };

    return {
        postRequest: postRequest,
        getRequest: getRequest,
        request: request
    }
});

// var api = new Api();