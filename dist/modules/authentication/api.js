"use strict";

function Api() {
    var self = this;

    this.apiUrl = "https://zeeguu.unibe.ch/api";

    this.postRequest = function (url, parameters) {
        return self.request("POST", url, parameters);
    };

    this.getRequest = function (url, parameters) {
        return self.request("GET", url, parameters);
    };

    this.request = function (method, url, parameters) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(method, self.apiUrl + url);
            request.onload = function () {
                if (request.status === SUCCESFUL_REQUEST) {
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

var api = new Api();