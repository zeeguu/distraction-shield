
var bg = chrome.extension.getBackgroundPage();

// Log console messages to the background page console instead of the content page.
var console = bg.console;
var auth = bg.auth;

/* -------------------- -------------------------- -------------------- */
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
    connectHtmlFunctionality();
});
