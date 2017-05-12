"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wildcardStrComp = wildcardStrComp;
//Fancy string comparison with wildcards
function wildcardStrComp(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}