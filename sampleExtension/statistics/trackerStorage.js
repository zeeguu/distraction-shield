
function TrackerStorage() {
    var self = this;

    this.init = function(){
        // Create new dummydata.
        self.setDayStatisticsList([]);
        self.loadDummyData(10);

        // Make sure there is a record for the current day by calling this method.
        self.incrementDayStat(0);
    };


    // Loads dummy data in the previous day list for demonstration purposes.
    this.loadDummyData = function(amount){
        var dummyList = [];
        for(var i = amount; i > 0; i--){
            var date = new Date();
            //set date to date.day - 1
            date = new Date(date.setDate(date.getDate() - i));
            dummyList.push(
                {
                date: ((date.getDate())+"/"+(date.getMonth()+1)+"/"+date.getFullYear()),
                timespent: Math.floor((Math.random()*100)+1)
                }
            );
        }
        self.setDayStatisticsList(dummyList);
    };


    // Increments the counter for time spent on exercises today with 'amount'.
    // When there is no currentDateStatistic in the storage yet, create one.
    // And when the currentDateStatistic does not correspond with the actual current date,
    // this currentDataStatistic is added to the list of previous day statistics.
    this.incrementDayStat = function(amount){
        self.getCurrentDayStatistic().then(function(response){
            var today = self.getToday();
            var responseObject = response.tds_currentDayStatistic;
            if (responseObject == null){
                self.setCurrentDayStatistic({date: today, timespent: 0});
            } else if(responseObject.date != today){
                self.addPreviousDayToStatsList(responseObject);
                self.setCurrentDayStatistic({date: today, timespent: amount});
            } else {
                self.setCurrentDayStatistic({date: today, timespent: responseObject.timespent+amount});
            }

        });
    };

    // This function adds the previous day to the list of day statistics.
    this.addPreviousDayToStatsList = function(dayStats){
        console.log("Adding previous day to dayStats " + dayStats.date + " - " + dayStats.timespent);
        self.getDayStatisticsList().then(function(response){
            var newList = response.tds_dayStatistics;
            if(newList == null){
                newList = [];
            }
            newList.push(dayStats);
            self.setDayStatisticsList(newList);
        });
    };


    // Get the list containing information about time spent on exercises. For the previous days, and the current day.
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

    // Set the list dict containing information about how much time is spent on exercises each previous day.
    this.setDayStatisticsList = function(statList){
        self.setStorage("tds_dayStatistics", statList);
    };

    // Get the list containing information about how much time is spent on exercises each previous day.
    this.getDayStatisticsList = function(){
        return self.getStorage("tds_dayStatistics");
    };

    // Set the data dict containing information about how much time is spent on exercises today.
    this.setCurrentDayStatistic = function(dayStats){
        self.setStorage("tds_currentDayStatistic", dayStats);
    };

    // Get the data dict containing information about how much time is spent on exercises today.
    this.getCurrentDayStatistic = function(){
        return self.getStorage("tds_currentDayStatistic");
    };

    // General function which is used to set items stored in the storage of the chrome api.
    this.setStorage = function(ind, data) {
        var newObj= {};
        newObj[ind] = data;
        chrome.storage.sync.set(newObj, function() {
            handleRuntimeError();
        })
    };

    // General function which is used to retrieve items stored in the storage of the chrome api.
    // This function returns a Promise, to account for possible delays which might exist between the requesting of
    // the things in the storage and the actual retrieving of it.
    this.getStorage = function(index){
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(index, function (output) {
                if (handleRuntimeError()) {
                    resolve(output);
                } else {
                    reject(Error("Statistics cannot be found."));
                }
            })
        });
    };

    // Function which returns the current date, formatted in the correct format.
    this.getToday = function(){
        var dateObject = new Date();
        return (dateObject.getDate())+"/"+(dateObject.getMonth()+1)+"/"+dateObject.getFullYear();
    }
}
