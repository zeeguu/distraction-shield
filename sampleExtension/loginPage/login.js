
var bg = chrome.extension.getBackgroundPage();

// Log console messages to the background page console instead of the content page.
var console = bg.console;
var auth = bg.auth;

/* -------------------- -------------------------- -------------------- */
var instructions;

var html_emailLoginFld = $('#emailLoginFld');
var html_passwordLoginFld = $('#passwordLoginFld');
var html_submitButton = $('#submitBtn');

var messageDialog = $('#message');
var spinner = $('.spinner');


login = function(){
    messageDialog.text("");

    var email = html_emailLoginFld.val();
    var password = html_passwordLoginFld.val();
    console.log("Email:" + email + " Password:" + password);

    spinner.show();
    auth.login(email, password).then(function(response){
        auth.setSession(response);
        messageDialog.text("You logged in!");
    }, function(error){
        messageDialog.text("Wrong credentials..");
    }).then(function(response){
        spinner.hide();
    }, function(){
        spinner.hide();
    });
    html_emailLoginFld.val('');
    html_passwordLoginFld.val('');

    if ("forceLogin" in instructions) {
        console.log('forcelogin!');
        url = instructions["forceLogin"];
        url = url + "?redirect=" + instructions["redirect"];
        window.location = url;
    }
};

getExtraInstructions = function () {
    var url = window.location.href;
    var urlParts = url.split(/\?/);
    var cleanUrl = urlParts[0];
    var params = urlParts[1];
    setUrlInAddressbar(cleanUrl);
    return GetparametersDictionary(params);
};

GetparametersDictionary = function (unsplitParams) {
    if (!unsplitParamPairs) return {};
    var unsplitParamPairs = unsplitParams.split(/&/);
    var params = {};
    for (i in unsplitParamPairs) {
        var splitParam = unsplitParamPairs[i].split(/=/);
        params[splitParam[0]] = splitParam[1];
    }
    return params;
};

setUrlInAddressbar = function (newUrl) {
    window.history.pushState('',document.title,newUrl);
};

//Connect functions to HTML elements
connectButton = function(html_button, method) {
    html_button.on('click', method);
};

connectHtmlFunctionality = function() {
    connectButton(html_submitButton, login);
};

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    instructions = getExtraInstructions();
    console.log(instructions);
    connectHtmlFunctionality();
});
