/* eslint-env node */
var assert = require('assert');
var UserSettings = require('../../dist/classes/UserSettings')['default'];

describe('UserSettings | unit tests', function() {
    before(function() {
        this.userSettings = new UserSettings();
        this.userSettings.offTill = new Date();
    });

    it('turn on the extension', function() {
        this.userSettings.state = 'Off';
        this.userSettings.turnOn();
        assert.equal(this.userSettings.state, 'On');
    });

    it('turnOff the extension', function () {
        this.userSettings.state = 'On';
        this.userSettings.turnOff(true);
        assert.equal(this.userSettings.state, 'Off');
    });

    it('turnOffFor minutes the extension', function () {
        this.userSettings.state = 'On';
        var minutes = 10;

        const curDate = new Date();
        let offTill = new Date(curDate.setMinutes(minutes+ curDate.getMinutes()));

        this.userSettings.turnOffFor(minutes, true);

        assert.equal(this.userSettings.state, 'Off');
        assert.equal(this.userSettings.offTill.getMinutes(), offTill.getMinutes());

    });

    it('turnOffForDay the extension', function () {
        this.userSettings.state = 'On';

       let offTill = new Date(new Date().setHours(24, 0, 0, 0));
       this.userSettings.turnOffForDay(true);

        assert.equal(this.userSettings.state, 'Off');
        assert.equal(this.userSettings.offTill.getDay(), offTill.getDay());
    });
});
