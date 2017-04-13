
function ExerciseTime() {
    var self = this;

    // Increments the counter for time spent on exercises today with 'amount'.
    // When there the current day does not exist in the storage yet, initialize the counter for this day at 0.
    this.incrementTodayExerciseTime = function(amount){
        let exerciseTimeList;
        storage.getExerciseTimeList().then(function(response){
            exerciseTimeList = response;
            let today = dateUtil.getToday();
            if(exerciseTimeList == null){
                exerciseTimeList = {};
            }
            if(exerciseTimeList[today] == null){
                exerciseTimeList[today] = 0;
            }
            exerciseTimeList[today] += amount;
        }).then(function(){
            storage.setExerciseTimeList(exerciseTimeList);
        });
    };
}


var exerciseTime = new ExerciseTime();