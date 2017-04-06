
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
                date: dateUtil.formatDate(date),
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
            self.handleIncrementDayStat(response.tds_currentDayStatistic, amount);
        });
    };

    this.handleIncrementDayStat = function(currentDayStatistic, amount){
        var today = dateUtil.getToday();
        if (currentDayStatistic == null){
            self.setCurrentDayStatistic({date: today, timespent: 0});
        } else if(currentDayStatistic.date != today){
            self.addPreviousDayToStatsList(currentDayStatistic);
            self.setCurrentDayStatistic({date: today, timespent: amount});
        } else {
            self.setCurrentDayStatistic({date: today, timespent: currentDayStatistic.timespent+amount});
        }
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
        return new Promise(self.handlerRetrieveDayStatisticsList);
    };

    this.handlerRetrieveDayStatisticsList = function(resolve){
        self.getDayStatisticsList().then(function(responseDayList){
            var previousDays = responseDayList.tds_dayStatistics;
            self.getCurrentDayStatistic().then(function(responseDay){
                previousDays.push(responseDay.tds_currentDayStatistic);
                resolve(previousDays);
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


}
