
function Interception() {
    var self = this;

    this.oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    this.calcInterceptData = function(dateList) {
        var tmp = dateList;
        let countDay = 0, countWeek = 0, countMonth = 0, countTotal = 0;

        if (tmp != null) {
            var firstDate = new Date();
            var length = tmp.length;
            for (var i = 0; i < length; i++) {
                let secondDate = new Date(tmp.pop());
                var diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (self.oneDay)));
                if (diffDays == 0) {
                    countDay++;
                }
                if (diffDays <= 7) {
                    countWeek++;
                }
                if (diffDays <= 31) {
                    countMonth++
                }
                countTotal++;
            }
        }
        return {
            countDay: countDay,
            countWeek: countWeek,
            countMonth: countMonth,
            countTotal: countTotal
        }
    };

    this.incrementInterceptionCounter = function(urlAddress) {
        let urlList = blockedSites.getList();
        for (var i = 0; i < urlList.length; i++) {
            if (wildcardStrComp(urlAddress, urlList[i].getUrl())) {
                urlList[i].setCounter(urlList[i].getCounter() + 1);
                break;
            }
        }
        storage.setBlacklist(blockedSites);
        storage.getInterceptCounter()
            .then(function(output){
                var counter = output;
                counter++;
                storage.setInterceptionCounter(counter);
            });
    };

    // This function adds the current time+date to the saved time+date list
    this.addToInterceptDateList = function() {
        let interceptDateList = [];
        storage.getInterceptDateList()
        .then(function(result){
            interceptDateList = result;
        })
        .then(function(){
            var newDate = new Date().toDateString();
            if (interceptDateList == null) {
                interceptDateList = [newDate];
            } else {
                interceptDateList.push(newDate);
            }
        })
        .then(function(){
            storage.setInterceptDateList(interceptDateList);
        });
    };
}

var interception = new Interception();

