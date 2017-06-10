"use strict";

/* eslint-env node */
var assert = require('assert');
var urlFormatter = require('../../dist/modules/urlFormatter');

describe('BlockedSite | unit tests', function() {
    before(function() {
        this.url = "https://www.facebook.com/";
        this.urlDomainOnly = "www.facebook.com"
        this.incompleteUrl = "facebook.com";
    });

    it('should remove a final slash or leave the url intact', function() {
       urlFormatter.getUrlFromServer(this.incompleteUrl,
       function (response) {
           assert.ok(response === url)
       },
       function (error) {

       });
    });


});
