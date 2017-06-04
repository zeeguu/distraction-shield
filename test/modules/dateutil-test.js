let assert = require('assert');
let dateutil = require('../../dist/modules/dateutil.js')['default'];

describe('dateutil | unti test', function() {
    before(function() {
        this.dateutil = dateutil;
    });

    it('should transform seconds to HH:MM:SS ', function() {
        let seconds = 5000;
        let date    = new Date(seconds*1000).toISOString().substr(11,8);

        assert.equal(date, dateutil.secondsToHHMMSS(seconds));
    });
});
