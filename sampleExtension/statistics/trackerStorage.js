
var TrackerStorage = new function() {
    var self = this;

    this.init = function(){
        // self.setCurrentDayStatistic(null);
        // self.setDayStatisticsList([]);


        // setInterval(self.tester, 5000);
    };

    // this.tester = function() {
    //     self.getCompleteDayStatList().then(function(response){
    //         console.log(response);
    //     });
    // };

    this.incrementDayStat = function(amount){
        self.getCurrentDayStatistic().then(function(response){
            var today = self.getToday();
            var responseObject = response.tds_currentDayStatistic;
            //console.log(responseObject);

            if(responseObject == null){
                self.setCurrentDayStatistic({'date': today, 'timespent': 0});
            } else if(responseObject.date != today){
                self.addPreviousDayToStatsList(responseObject);
                self.setCurrentDayStatistic({'date': today, 'timespent': amount});
            } else {
                self.setCurrentDayStatistic({'date': today, 'timespent': responseObject.timespent+amount});
            }

        });
    };

    this.addPreviousDayToStatsList = function(dayStats){
        console.log("Adding previous day to dayStats "+dayStats.date+" - "+dayStats.timespent);
        self.getDayStatisticsList().then(function(response){
            var newList = response.tds_dayStatistics;
            if(newList == null){
                newList = [];
            }
            newList.push(dayStats);
            self.setDayStatisticsList(newList);
        });
    };

    this.getCompleteDayStatList = function(){
        return new Promise(function(resolve, reject){
            self.getDayStatisticsList().then(function(response){
                var previousDays = response.tds_dayStatistics;
                self.getCurrentDayStatistic().then(function(response2){
                    previousDays.push(response2.tds_currentDayStatistic);
                    resolve(previousDays);
                });
            });
        })
    };

    this.setDayStatisticsList = function(statList){
        self.setStorage("tds_dayStatistics", statList);
    };

    this.getDayStatisticsList = function(){
        return self.getStorage("tds_dayStatistics");
    };

    this.setCurrentDayStatistic = function(dayStats){
        self.setStorage("tds_currentDayStatistic", dayStats);
    };

    this.getCurrentDayStatistic = function(){
        return self.getStorage("tds_currentDayStatistic");
    };

    this.setStorage = function(ind, data) {
        //console.log("Setting storage :"+ind+" data: "+data);
        var newObj= {};
        newObj[ind] = data;
        chrome.storage.sync.set(newObj, function() {
            handleRuntimeError();
        })
    };

    this.getStorage = function(index){
        //console.log("Getting storage :"+index);
        var storagePromise = new Promise(function(resolve, reject){
            chrome.storage.sync.get(index, function(output){
                if(handleRuntimeError()){
                    resolve(output);
                } else {
                    reject(Error("Statistics cannot be found."));
                }
            })
        });
        return storagePromise;
    }

    this.getToday = function(){
        var dateObject = new Date();
        return (dateObject.getDay())+"/"+dateObject.getMonth()+"/"+dateObject.getFullYear();
    }
};
