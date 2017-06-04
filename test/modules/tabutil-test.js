/* eslint-env node */
let assert = require('assert');
let tabutil = require('../../dist/modules/tabutil.js');
const chrome = require('sinon-chrome');


describe('tabutil | unit test', function() {
    before(function () {
        global.chrome = chrome;
    });

    it('should singleton open tab',function () {
        let url = "https://www.google.com";
        assert.ok(chrome.tabs.create.notCalled, 'tabs.create should not be called');

        tabutil.openTabSingleton(url);
        assert.ok(global.chrome.tabs.create.calledOnce, 'tabs.create should be called');

        chrome.tabs.create({url : url});
        tabutil.openTabSingleton(url);
        assert.ok(chrome.tabs.update.calledOnce, 'tabs.update should be called once');

    });


    after(function () {
        chrome.flush();
        delete global.chrome;
    });

});
