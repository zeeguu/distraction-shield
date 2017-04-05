
var redirectLink = "https://zeeguu.herokuapp.com/get-ex?redirect=";
var modes = {lazy: "lazy", pro: "pro"};

var newUrlNotUniqueError = "New blocked site item to be added was found to resolve to an already blacklisted website, " +
                           "please try a different url.\n Duplicate url: ";
var INVALID_URL_MESSAGE = "We unfortunately could not reach the site you are trying to block.\n" +
                          "Are you sure the url is correct? \n \n";

/* -------------------- Text Messages ----------------------- */

var infoText = "Hey, you tried to enter one of the sites you wanted to be protected from!";
var proText = "You are in pro mode. Complete the exercise and click the 'Take me away!' button when you are done to continue browsing.";
var lazyText = "You are in lazy mode. Click <a id='originalDestination'>'Skip'</a> any time to continue browsing.";

/* -------------------- Keypress constants ----------------------- */
var KEY_DELETE = 46;
var KEY_ENTER  = 13;

/* -------------------- Number constants ----------------------- */
var MAX_TURN_OFF_TIME = 480;

var FAVICONLINK = "https://www.google.com/s2/favicons?domain=";