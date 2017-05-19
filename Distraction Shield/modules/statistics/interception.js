import * as storage from '../storage'
import * as constants from '../../constants'
import * as stringutil from '../stringutil'

// This method goes through the interceptDateList and count how many times the user was intercepted last day,
// last week, last month and the total amount of interceptions.
export function calcInterceptData(dateList) {
    let tmp = dateList;
    let countDay = 0, countWeek = 0, countMonth = 0, countTotal = 0;

    if (tmp !== null) {
        let firstDate = new Date();
        let length = tmp.length;
        for (let i = 0; i < length; i++) {
            let secondDate = new Date(tmp.pop());
            let diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (constants.oneDay)));
            if (diffDays === 0) {
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
}

// Receives the url from the parameter, and searches the correct blockedSite item from the blockedsite list.
// Then the interceptioncounter for this item is incremented by 1.
// Also the global interceptioncounter is incremented by one.
export function incrementInterceptionCounter(urlAddress, blockedSites) {
    let urlList = blockedSites.list;
    for (let i = 0; i < urlList.length; i++) {
        if (stringutil.wildcardStrComp(urlAddress, urlList[i].url)) {
            urlList[i].counter = urlList[i].counter + 1;
            break;
        }
        //TODO why is this here, do we need this, cause it does not work?
        // if (diffDays <= 31) {
        //     countMonth++
        // }
        // countTotal++;
    }

    storage.setBlacklist(blockedSites);
    storage.getInterceptCounter()
        .then(function (output) {
            let counter = output.tds_interceptCounter;
            counter++;
            storage.setInterceptCounter(counter);
        });
}

// This function adds the current time+date to the saved time+date list
export function addToInterceptDateList() {
    let interceptDateList;
    storage.getInterceptDateList()
        .then(function (result) {
            interceptDateList = result.tds_interceptDateList;
        })
        .then(function () {
            let newDate = new Date().toDateString();
            if (interceptDateList === null) {
                interceptDateList = [newDate];
            } else {
                interceptDateList.push(newDate);
            }
        })
        .then(function () {
            storage.setInterceptDateList(interceptDateList);
        });
}

