define (['constants'], function (constants) {
    return function Api() {
        var self = this;

        this.postRequest = function (url, parameters) {
            return self.request("POST", url, parameters);
        };

        this.getRequest = function (url, parameters) {
            return self.request("GET", url, parameters);
        };

        this.request = function (method, url, parameters) {
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
    }
});

// var api = new Api();