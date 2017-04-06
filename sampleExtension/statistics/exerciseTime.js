
function ExerciseTime() {
    var self = this;

    this.init = function() {
        // Create new dummydata.
        statsStorage.setDayStatisticsList([]);
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
        statsStorage.setDayStatisticsList(dummyList);
    };


    // Increments the counter for time spent on exercises today with 'amount'.
    // When there is no currentDateStatistic in the storage yet, create one.
    // And when the currentDateStatistic does not correspond with the actual current date,
    // this currentDataStatistic is added to the list of previous day statistics.
    this.incrementDayStat = function(amount){
        statsStorage.getCurrentDayStatistic().then(function(response){
            self.handleIncrementDayStat(response.tds_currentDayStatistic, amount);
        });
    };

    this.handleIncrementDayStat = function(currentDayStatistic, amount){
        var today = dateUtil.getToday();
        if (currentDayStatistic == null){
            statsStorage.setCurrentDayStatistic({date: today, timespent: 0});
        } else if(currentDayStatistic.date != today){
            statsStorage.addPreviousDayToStatsList(currentDayStatistic);
            statsStorage.setCurrentDayStatistic({date: today, timespent: amount});
        } else {
            statsStorage.setCurrentDayStatistic({date: today, timespent: currentDayStatistic.timespent+amount});
        }
    };
}


var exerciseTime = new ExerciseTime();
exerciseTime.init();
