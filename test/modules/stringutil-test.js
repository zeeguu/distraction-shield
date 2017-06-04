let assert = require('assert');
let stringutil = require('../../dist/modules/stringutil.js');

describe('stringutil | unti test', function() {
    it('should compare if a string is a substring of another string ', function() {
        let str = "https://www.facebook.com/events/887318548075668/";
        let rule ="facebook";
        let exp1 =  new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
        assert.equal(stringutil.wildcardStrComp(str, rule),exp1);
    });

});
