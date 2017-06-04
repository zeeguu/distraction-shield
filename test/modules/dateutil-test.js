let assert = require('assert');
let dateutil = require('../../dist/modules/dateutil.js');

describe('dateutil | unti test', function() {
    it('should transform seconds to HH:MM:SS ', function() {
        let seconds = 5000;
        let date    = new Date(seconds*1000).toISOString().substr(11,8);

        assert.equal(dateutil.secondsToHHMMSS(seconds), date);
    });

    it('should stringify date', function () {
        let date = new Date();
        let stringDate = date.getDate()+"/"+(date.getMonth() +1) + "/"+ date.getFullYear();
        assert.equal(dateutil.formatDate(date), stringDate);
    });

    it('should get today', function () {
        let date = new Date();
        let today = date.getDate()+"/"+(date.getMonth() +1) + "/"+ date.getFullYear();
        assert.equal(dateutil.getToday(), today);
    });
});
