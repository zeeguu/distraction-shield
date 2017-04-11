
function ExerciseTime() {
    var self = this;

    this.init = function() {
        // Make sure there is a record for the current day by calling this method.
        self.incrementTodayExerciseTime(0);
    };


    // Increments the counter for time spent on exercises today with 'amount'.
    // When there is no currentDateStatistic in the storage yet, create one.
    // And when the currentDateStatistic does not correspond with the actual current date,
    // this currentDataStatistic is added to the list of previous day statistics.
    this.incrementTodayExerciseTime = function(amount){
        storage.getTodayExerciseTime().then(function(response){
            self.handleIncExerciseTime(response.tds_currentDayStatistic, amount);
        });
    };

    this.handleIncExerciseTime = function(currentDayStatistic, amount){
        var today = dateUtil.getToday();
        if (currentDayStatistic == null){
            storage.setTodayExerciseTime({date: today, timespent: 0});
        } else if(currentDayStatistic.date != today){
            self.addDayToList(currentDayStatistic);
            storage.setTodayExerciseTime({date: today, timespent: amount});
        } else {
            storage.setTodayExerciseTime({date: today, timespent: currentDayStatistic.timespent+amount});
        }
    };

    // This function adds the previous day to the list of day statistics.
    this.addDayToList = function(dayStats){
        storage.getExerciseTimeList().then(function(response){
            var newList = response.tds_dayStatistics;
            if(newList == null){
                newList = [];
            }
            newList.push(dayStats);
            storage.setExerciseTimeList(newList);
        });
    };

    // Get the list containing information about time spent on exercises. For the previous days, and the current day.
    this.getCompleteDayStatList = function(){
        return new Promise(function(resolve, reject){
            Promise.all([storage.getExerciseTimeList(), storage.getTodayExerciseTime()])
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
