var redirectLink = "https://zeeguu.herokuapp.com/get-ex?redirect=";
var revertToOriginMessage = "goToOriginalDestination";
var modes = {lazy: "lazy", pro: "pro"};

var newUrlNotUniqueError = "new blocked site item to be added was found to resolve to an already blacklisted website, " +
                           "please try a different url.\n Duplicate url: ";

/* -------------------- Text Messages ----------------------- */

var infoText = "Hey, you tried to enter one of the sites you wanted to be protected from!";
var proText = "You are in pro mode. Complete the exercise and click the 'Take me away!' button when you are done to continue browsing.";
var lazyText = "You are in lazy mode. Click <a id='originalDestination'>'Skip'</a> any time to continue browsing.";

/* -------------------- Keypress constants ----------------------- */
var KEY_DELETE = 46;
var KEY_ENTER  = 13;

/* -------------------- Number constants ----------------------- */
var MAX_TURN_OFF_TIME = 480;