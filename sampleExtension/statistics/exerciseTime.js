
function ExerciseTime() {
    var self = this;

    this.init = function() {
        // Make sure there is a record for the current day by calling this method.
        self.incrementDayStat(0);
    };


    // Increments the counter for time spent on exercises today with 'amount'.
    // When there is no currentDateStatistic in the storage yet, create one.
    // And when the currentDateStatistic does not correspond with the actual current date,
    // this currentDataStatistic is added to the list of previous day statistics.
    this.incrementDayStat = function(amount){
        storage.getCurrentDayStatistic().then(function(response){
            self.handleIncrementDayStat(response.tds_currentDayStatistic, amount);
        });
    };

    this.handleIncrementDayStat = function(currentDayStatistic, amount){
        var today = dateUtil.getToday();
        if (currentDayStatistic == null){
            storage.setCurrentDayStatistic({date: today, timespent: 0});
        } else if(currentDayStatistic.date != today){
            self.addPreviousDayToStatsList(currentDayStatistic);
            storage.setCurrentDayStatistic({date: today, timespent: amount});
        } else {
            storage.setCurrentDayStatistic({date: today, timespent: currentDayStatistic.timespent+amount});
        }
    };

    // This function adds the previous day to the list of day statistics.
    this.addPreviousDayToStatsList = function(dayStats){
        storage.getDayStatisticsList().then(function(response){
            var newList = response.tds_dayStatistics;
            if(newList == null){
                newList = [];
            }
            newList.push(dayStats);
            storage.setDayStatisticsList(newList);
        });
    };

    // Get the list containing information about time spent on exercises. For the previous days, and the current day.
    this.getCompleteDayStatList = function(){
        return new Promise(function(resolve, reject){
            Promise.all([storage.getDayStatisticsList(), storage.getCurrentDayStatistic()])
                .then(function(result){
                    let completeList = result[0].tds_dayStatistics;
                    completeList.push(result[1].tds_currentDayStatistic);
                    resolve(completeList);
                });
        });
    };
}


var exerciseTime = new ExerciseTime();
exerciseTime.init();
