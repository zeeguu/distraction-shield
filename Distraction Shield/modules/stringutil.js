define('stringutil', function stringutil() {
    //Fancy string comparison with wildcards
    wildcardStrComp = function (str, rule) {
        return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
    };

    return {
        wildcardStrComp     : wildcardStrComp
    }
});