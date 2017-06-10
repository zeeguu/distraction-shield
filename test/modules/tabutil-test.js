'use strict';


/* eslint-env node */
let assert = require('assert');
let tabutil = require('../../dist/modules/tabutil.js');
const chrome = require('sinon-chrome');


describe('tabutil | unit test', function() {
    before(function () {
        global.chrome = chrome;

        chrome.tabs.query.yields([
            {id: 1, title: 'Tab 1', url : 'https://www.facebook.com'},
            {id: 2, title: 'Tab 2', url : 'https://www.9gag.com'},
        ]);
    });

    it('should singleton open tab',function () {
        let url = 'https://www.google.com';

        assert.ok(chrome.tabs.create.notCalled, 'tabs.create should not be called');
        tabutil.openTabSingleton(url);

        assert.ok(chrome.tabs.query.calledOnce);
        assert.ok(chrome.tabs.create.calledOnce, 'tabs.create should be called');


        url = 'https://www.facebook.com';
        tabutil.openTabSingleton(url);
        assert.ok(chrome.tabs.update.calledOnce, 'tabs.update should be called once');

    });

    it('should find the id of an open tab or return false', function () {
       let urlOpenTab =  'https://www.facebook.com';
       let urlNotOpenTab =  'https://www.google.com';

       tabutil.isOpenTab(urlNotOpenTab, function(result) {
           assert.ok(result === false);
       });
       tabutil.isOpenTab(urlOpenTab, function(result) {
           assert.ok(result === 1);
       });
    });


    after(function () {
        chrome.flush();
        delete global.chrome;
    });

});
