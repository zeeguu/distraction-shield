"use strict";

function Interception() {
    var self = this;

    // The amount of milliseconds in one day
    this.oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    // This method goes through the interceptDateList and count how many times the user was intercepted last day,
    // last week, last month and the total amount of interceptions.
    this.calcInterceptData = function (dateList) {
        var tmp = dateList;
        var countDay = 0,
            countWeek = 0,
            countMonth = 0,
            countTotal = 0;

        if (tmp != null) {
            var firstDate = new Date();
            var length = tmp.length;
            for (var i = 0; i < length; i++) {
                var secondDate = new Date(tmp.pop());
                var diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / self.oneDay));
                if (diffDays == 0) {
                    countDay++;
                }
                if (diffDays <= 7) {
                    countWeek++;
                }
                if (diffDays <= 31) {
                    countMonth++;
                }
                countTotal++;
            }
        }
        return {
            countDay: countDay,
            countWeek: countWeek,
            countMonth: countMonth,
            countTotal: countTotal
        };
    };

    // Receives the url from the parameter, and searches the correct blockedSite item from the blockedsite list.
    // Then the interceptioncounter for this item is incremented by 1.
    // Also the global interceptioncounter is incremented by one.
    this.incrementInterceptionCounter = function (urlAddress) {
        var urlList = blockedSites.getList();
        for (var i = 0; i < urlList.length; i++) {
            if (stringutil.wildcardStrComp(urlAddress, urlList[i].getUrl())) {
                urlList[i].setCounter(urlList[i].getCounter() + 1);
                break;
            }
        }
        storage.setBlacklist(blockedSites);
        storage.getInterceptCounter().then(function (output) {
            var counter = output.tds_interceptCounter;
            counter++;
            storage.setInterceptionCounter(counter);
        });
    };

    // This function adds the current time+date to the saved time+date list
    this.addToInterceptDateList = function () {
        var interceptDateList = void 0;
        storage.getInterceptDateList().then(function (result) {
            interceptDateList = result.tds_interceptDateList;
        }).then(function () {
            var newDate = new Date().toDateString();
            if (interceptDateList == null) {
                interceptDateList = [newDate];
            } else {
                interceptDateList.push(newDate);
            }
        }).then(function () {
            storage.setInterceptDateList(interceptDateList);
        });
    };
}

var interception = new Interception();