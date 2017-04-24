define([], function () {
    /* ---------- ----- auth/api-- ----- ---------- */
    this.apiUrl = "https://zeeguu.unibe.ch/api";
    this.loginUrl = "/session";
    this.loginAnonUrl = "/get_anon_session";
    this.signinAnonUrl = "/add_anon_user";
    this.validateUrl = "/validate";
    this.logoutUrl = "/logout_session";

    /* ---------- ----- background ----- ---------- */
    var zeeguuExLink = "https://www.zeeguu.unibe.ch/practice/get-ex";


    /* ---------- ----- BlockedSite ----- ---------- */
    var FAVICONLINK = "https://www.google.com/s2/favicons?domain=";

    /* ---------- ----- UserSettings, inject ----- ---------- */
    var modes = {
        lazy: {
            label:"lazy",
            zeeguuText:"You are in lazy mode. Click <a id='originalDestination'>'Skip'</a> any time to continue browsing."
        },
        pro: {
            label: "pro",
            zeeguuText:"You are in pro mode. Complete the exercise and click the 'Take me away!' button when you are done to continue browsing."
        }
    };

    /* ---------- ----- BlockedSiteList ----- ---------- */
    var newUrlNotUniqueError = "New blocked site item to be added was found to resolve to an already blacklisted website, " +
                               "please try a different url.\nDuplicate url: ";

    /* ---------- ----- urlFormatter ----- ---------- */
    var INVALID_URL_MESSAGE = "We unfortunately could not reach the site you are trying to block.\n" +
                              "Are you sure the url is correct? \n \n";

    /* -------------------- Text Messages ----------------------- */
    var zeeguuInfoText = "Hey, you tried to enter one of the sites you wanted to be protected from!";

    /* -------------------- Keypress constants ----------------------- */
    /* ---------- ----- optionsPage/htmlFunctionality ----- ---------- */
    var KEY_DELETE = 46;
    var KEY_ENTER  = 13;

    /* -------------------- Number constants ----------------------- */
    /* ---------- ----- turnoffSlider ----- ---------- */
    var MAX_TURN_OFF_TIME = 480;


    return {
        zeeguuExLink            : zeeguuExLink,
        FAVICONLINK             : FAVICONLINK,
        modes                   : modes,
        newUrlNotUniqueError    : newUrlNotUniqueError,
        INVALID_URL_MESSAGE     : INVALID_URL_MESSAGE,
        zeeguuInfoText          : zeeguuInfoText,
        KEY_DELETE              : KEY_DELETE,
        KEY_ENTER               : KEY_ENTER,
        MAX_TURN_OFF_TIME       : MAX_TURN_OFF_TIME
    }
});

