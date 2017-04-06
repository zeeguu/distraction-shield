
function StatisticsStorage() {
    var self = this;

    this.getInterceptDateList = function(){
        return self.getStorage("tds_interceptDateList");
    };

    // This function adds the previous day to the list of day statistics.
    this.addPreviousDayToStatsList = function(dayStats){
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
            Promise.all([self.getDayStatisticsList(), self.getCurrentDayStatistic()])
                .then(function(result){
                    let completeList = result[0].tds_dayStatistics;
                    completeList.push(result[1].tds_currentDayStatistic);
                    resolve(completeList);
                });
        });
    };

    // Set the list dict containing information about how much time is spent on exercises each previous day.
    this.setDayStatisticsList = function(statList){
        statsStorage.setStorage("tds_dayStatistics", statList);
    };

    // Get the list containing information about how much time is spent on exercises each previous day.
    this.getDayStatisticsList = function(){
        return statsStorage.getStorage(["tds_dayStatistics"]);
    };

    // Set the data dict containing information about how much time is spent on exercises today.
    this.setCurrentDayStatistic = function(dayStats){
        statsStorage.setStorage("tds_currentDayStatistic", dayStats);
    };

    // Get the data dict containing information about how much time is spent on exercises today.
    this.getCurrentDayStatistic = function(){
        return statsStorage.getStorage(["tds_currentDayStatistic"]);
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
                    reject(Error("Data cannot be found."));
                }
            })
        });
    };
}

var statsStorage = new StatisticsStorage();
