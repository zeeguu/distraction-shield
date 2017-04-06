
function Interception() {
    var self = this;

    this.oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds


    this.init = function() {
    };

    this.calcInterceptData = function(dateList) {
        var tmp = dateList;
        let countDay = 0, countWeek = 0, countMonth = 0, countTotal = 0;

        if (tmp != null) {
            var firstDate = new Date();
            var length = tmp.length;
            for (var i = 0; i < length; i++) {
                let secondDate = new Date(tmp.pop());
                var diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (self.oneDay)));
                if (diffDays == 0) {
                    countDay++;
                }
                if (diffDays < 8) {
                    countWeek++;
                }
                if (diffDays < 32) {
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
    };
}

var ic = new Interception();

