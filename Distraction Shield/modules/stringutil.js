

/**
 * used to compare if a string is a substring of, with ReqExp
 * @param {string} str compared with rule
 * @param {string} rule compare str to this
 */
export function wildcardStrComp(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}