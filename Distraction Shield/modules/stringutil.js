
function StringUtil() {
    //Fancy string comparison with wildcards
    this.wildcardStrComp = function (str, rule) {
        return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
    };
}

var stringutil = new StringUtil();