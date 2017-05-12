//Fancy string comparison with wildcards
export function wildcardStrComp(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}