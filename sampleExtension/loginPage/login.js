
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;


/* -------------------- -------------------------- -------------------- */
var html_loginButton = $('#loginBtn');
var html_usernameLoginFld = $('#usernameLoginFld');
var html_passwordLoginFld = $('#passwordLoginFld');

var html_signinButton = $('#signinBtn');
var html_usernameSigninFld = $('#usernameSigninFld');
var html_passwordSigninFld = $('#passwordSigninFld');

var loginUrl = "https://zeeguu.unibe.ch/api/session";
var signinUrl = "https://zeeguu.unibe.ch/api/add_user";

var loginAnonUrl = "https://zeeguu.unibe.ch/api/get_anon_session";
var signinAnonUrl = "https://zeeguu.unibe.ch/api/add_anon_user";

loginZeeguu = function() {
    var username = html_usernameLoginFld.val();
    var password = html_passwordLoginFld.val();

    console.log("Username:"+username+" Password:"+password);

    html_usernameLoginFld.val('');
    html_passwordLoginFld.val('');

    $.ajax({
        type: "POST",
        url: loginAnonUrl+"/"+username,
        data: $.param({
            //uuid: username,
            password: password
        })
    }).done(function(session){
        console.log(session);
    }).fail(function(data){
        console.log("Fail..");
    }).always(function(data){
        console.log("always? "+data);
    });
};

signinZeeguu = function() {
    var username = html_usernameSigninFld.val();
    var password = html_passwordSigninFld.val();

    console.log("Username:"+username+" Password:"+password);

    html_usernameSigninFld.val('');
    html_passwordSigninFld.val('');

    $.ajax({
        type: "POST",
        url: signinAnonUrl,
        data: $.param({
            uuid: username,
            password: password
        })
    }).done(function(session){
        console.log(session);
    }).always(function(data){
        console.log("always? "+data);
    });
};

//Connect functions to HTML elements
connectButton = function(html_button, method) {
    html_button.on('click', method);
};

connectHtmlFunctionality = function() {
    connectButton(html_loginButton, loginZeeguu);
    connectButton(html_signinButton, signinZeeguu);
};

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectHtmlFunctionality();
});
