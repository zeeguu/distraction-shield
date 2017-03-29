
var bg = chrome.extension.getBackgroundPage();

// Log console messages to the background page console instead of the content page.
var console = bg.console;
var auth = bg.auth;

/* -------------------- -------------------------- -------------------- */
var html_loginButton = $('#loginBtn');
var html_usernameLoginFld = $('#usernameLoginFld');
var html_passwordLoginFld = $('#passwordLoginFld');

var html_signinButton = $('#signinBtn');
var html_usernameSigninFld = $('#usernameSigninFld');
var html_passwordSigninFld = $('#passwordSigninFld');
var html_emailSigninFld = $('#emailSigninFld');

var html_signinAnonButton = $('#signinAnonBtn');
var html_usernameSigninAnonFld = $('#usernameSigninAnonFld');
var html_passwordSigninAnonFld = $('#passwordSigninAnonFld');

login = function(){
    var username = html_usernameLoginFld.val();
    var password = html_passwordLoginFld.val();

    console.log("Username:" + username + " Password:" + password);
    auth.loginAnon(username, password);

    html_usernameLoginFld.val('');
    html_passwordLoginFld.val('');
};

signinAnon = function(){
    var username = html_usernameSigninAnonFld.val();
    var password = html_passwordSigninAnonFld.val();

    console.log("Username:" + username + " Password:" + password);
    auth.signinAnon(username, password);

    html_usernameSigninAnonFld.val('');
    html_passwordSigninAnonFld.val('');
};

signin = function(){
    var username = html_usernameSigninFld.val();
    var password = html_passwordSigninFld.val();
    var email = html_emailSigninFld.val();

    console.log("Username:" + username + " Password:" + password + " Email:" + email);
    auth.signin(username, password, email);

    //html_usernameSigninFld.val('');
    //html_passwordSigninFld.val('');
};


//Connect functions to HTML elements
connectButton = function(html_button, method) {
    html_button.on('click', method);
};

connectHtmlFunctionality = function() {
    connectButton(html_loginButton, login);
    connectButton(html_signinButton, signin);
};

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectHtmlFunctionality();
});
