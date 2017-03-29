
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;


/* -------------------- -------------------------- -------------------- */
var html_loginButton = $('#loginBtn');
var html_usernameFld = $('#usernameFld');
var html_passwordFld = $('#passwordFld');

loginZeeguu = function() {
    var username = html_usernameFld.val();
    var password = html_passwordFld.val();

    console.log("Username:"+username+" Password:"+password);

    html_usernameFld.val('');
    html_passwordFld.val('');

    $.ajax({
        type: "POST",
        url: "https://zeeguu.unibe.ch/api/get_anon_session/"+username,
        data: $.param({
            //uuid: username,
            password: password
        })
    }).done(function(data){
        console.log(data);
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
};

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectHtmlFunctionality();
});
