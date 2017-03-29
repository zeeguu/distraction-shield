

function Auth() {
    var self = this;
    this.loginUrl = "https://zeeguu.unibe.ch/api/session";
    this.signinUrl = "https://zeeguu.unibe.ch/api/add_user";

    this.loginAnonUrl = "https://zeeguu.unibe.ch/api/get_anon_session";
    this.signinAnonUrl = "https://zeeguu.unibe.ch/api/add_anon_user";

    this.logoutUrl = "https://zeeguu.unibe.ch/api/logout_session";

    this.session = null;


    this.loginAnon = function(username, password) {
        $.ajax({
            type: "POST",
            url: self.loginAnonUrl + "/" + username,
            data: $.param({
                password: password
            })
        }).done(function (session) {
            console.log(session);
            self.session = session;
        }).fail(function () {
            console.log("Fail..");
        });
    };

    this.signinAnon = function(username, password) {
        $.ajax({
            type: "POST",
            url: self.signinAnonUrl,
            data: $.param({
                uuid: username,
                password: password
            })
        }).done(function (session) {
            console.log(session);
            self.session = session;
        }).fail(function () {
            console.log("Fail..");
        });
    };

    this.login = function(username, password, email){
        //TODO Create login functionality.
    };

    this.signin = function(username, password, email){
        $.ajax({
            type: "POST",
            url: self.signinUrl+"/"+email,
            data: $.param({
                username: username,
                password: password
            })
        }).done(function (session) {
            console.log("Creating account: "+email);
            console.log(session);
            self.session = session;
        }).fail(function () {
            console.log("Fail..");
        }).always(function(){
            console.log("Done creating account.");
        });
    };

    this.logout = function(){
        //TODO Create logout functionality.
        this.session = null;
    };

    this.getSession = function(){
        if(self.session != null){
            return self.session;
        }
    };
}

var auth = new Auth();