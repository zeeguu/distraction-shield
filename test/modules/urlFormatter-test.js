"use strict";

/* eslint-env node */
var assert = require('assert');
var urlFormatter = require('../../dist/modules/urlFormatter');

describe('BlockedSite | unit tests', function() {
    before(function() {
        this.urlWithPort = "https://www.facebook.com/folder1/folder2/index.html:5000";
        this.urlWithFilename = "https://www.facebook.com/folder1/folder2/index.html";
        this.url = "https://www.facebook.com/";
        this.urlDomainOnly = "www.facebook.com"
        this.incompleteUrl = "facebook.com";
        this.urlStrippedAll = "www.facebook.com/folder1/folder2";
    });

    it('should remove a final slash or leave the url intact', function() {
        let url = this.url;
        let lengthBefore = url.length;
        url = urlFormatter.stripOfFinalSlash(url);
        let lengthAfter = url.length;
        assert.ok((lengthAfter === lengthBefore - 1) && (url[url.length - 1] !== '/'));

        url = this.incompleteUrl;
        lengthBefore = url.length;
        url = urlFormatter.stripOfFinalSlash(url);
        lengthAfter = url.length;
        assert.ok((lengthAfter === lengthBefore) && (url[url.length - 1] !== '/'));
    });

    it('should remove the scheme (*://) from the url or leave the url intact', function () {
        let url = this.url;
        let lengthBefore = url.length;
        url = urlFormatter.stripOfScheme(url);
        let lengthAfter = url.length;
        assert.ok((lengthAfter < lengthBefore) && !(/:\/\//.test(url)));

        url = this.incompleteUrl;
        lengthBefore = url.length;
        url = urlFormatter.stripOfScheme(url);
        lengthAfter = url.length;
        assert.ok((lengthAfter === lengthBefore) && !(/:\/\//.test(url)));
    });

    it('should remove the port (:[0-9]{4}) from the url or leave the url intact', function () {
        let url = this.urlWithPort;
        let lengthBefore = url.length;
        url = urlFormatter.stripOfPort(url);
        let lengthAfter = url.length;
        assert.ok((lengthAfter < lengthBefore) && !(/:[0-9]{4}/.test(url)));

        url = this.incompleteUrl;
        lengthBefore = url.length;
        url = urlFormatter.stripOfPort(url);
        lengthAfter = url.length;
        assert.ok((lengthAfter === lengthBefore) && !(/:[0-9]{4}/.test(url)));
    });

    it('should remove the filename or leave the url intact', function () {
        let url = this.urlWithFilename;
        let lengthBefore = url.length;
        url = urlFormatter.stripOfFileName(url);
        let lengthAfter = url.length;
        assert.ok((lengthAfter < lengthBefore) && !(/[/]([\w]*\.[\w?=&]*$)/.test(url)));

        url = this.incompleteUrl;
        lengthBefore = url.length;
        url = urlFormatter.stripOfFileName(url);
        lengthAfter = url.length;
        assert.ok((lengthAfter === lengthBefore) && !(/[/]([\w]*\.[\w?=&]*$)/.test(url)));
    });

    it('should return url stripped of all and only the domain', function () {
        let result = urlFormatter.stripOfAll(this.urlWithFilename);
        assert.ok(result[0] === this.urlStrippedAll);
        assert.ok(result[1] === this.urlDomainOnly);
    });

});
