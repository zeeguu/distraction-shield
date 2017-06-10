"use strict";

/* eslint-env node */
var assert = require('assert');
var blockedSiteBuilder = require('../../dist/modules/blockedSiteBuilder');
var sinon = require('sinon');


describe('BlockedSiteBuilder | unit tests', function() {
    before(function() {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    });

    it('should get a complete url from the hosting server', function(done) {
        blockedSiteBuilder.createNewBlockedSite("facebook.com").then(
            function (blockedSite) {
                //resolution
                console.log("ok");
                assert.ok(/http[s]?:[/]{2}([\w]*.)*/.test(blockedSite));
                done();
            },
            function (error) {
                //rejection
                console.log(error);
                done();
            });
    });

});
