import * as storage from '../storage/storage'

/**
 * Increases total time spent on doing exercises with 'amount'
 * @param {int} amount
 */
export function updateTotalExerciseTime(amount) {
  storage.getTotalTimeList().then((listWithTotalTime) => {
        let element = listWithTotalTime[0];
        element.timeInvested += amount;

        return listWithTotalTime;
    }).then(listWithTotalTime => {
        storage.setTotalTimeList(listWithTotalTime);
  });
}

export function updateTotalInterceptTime(amount) {
  storage.getTotalTimeList().then((listWithTotalTime) => {
    let element = listWithTotalTime[0];
    element.timeWasted += amount;

    return listWithTotalTime;
  }).then(listWithTotalTime => {
    storage.setTotalTimeList(listWithTotalTime);
  });
}

export function updateTotalTime(exerciseTime, interceptTime) {
  storage.getTotalTimeList().then((listWithTotalTime) => {
    let element = listWithTotalTime[0];
    element.timeInvested += exerciseTime;
    element.timeWasted += interceptTime;

    return listWithTotalTime;
  }).then(listWithTotalTime => {
    storage.setTotalTimeList(listWithTotalTime);
  });
}
