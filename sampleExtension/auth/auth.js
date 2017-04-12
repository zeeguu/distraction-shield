
function Auth() {
    var self = this;

    this.loginUrl = "/session";
    this.loginAnonUrl = "/get_anon_session";
    this.signinAnonUrl = "/add_anon_user";
    this.validateUrl = "/validate";
    this.logoutUrl = "/logout_session";

    this.sessionAuthenticated = false;

    this.loginAnon = function(username, password) {
        //caller has responsibility to set auth.session to the returned value
        var url = self.loginAnonUrl + "/" + username;
        var params = "password="+password;
        return api.postRequest(url, params);
    };

    this.signinAnon = function(username, password) {
        //caller has responsibility to set auth.session to the returned value
        var url = self.signinAnonUrl;
        var params = "uuid="+username+"&password="+password;
        return api.postRequest(url, params);
    };

    this.login = function(email, password){
        //caller has responsibility to set auth.session to the returned value
        var url = self.loginUrl + "/" + email;
        var params = "password="+password;
        return api.postRequest(url, params);
    };

    this.signin = function(username, password, email){
        //TODO This will be done by redirecting to the Zeeguu website itself.
    };

    this.validate = function () {
        var url = self.validateUrl + "?session="+self.getSession();
        return api.getRequest(url, "");
    };

    this.logout = function(){
        var url = self.logoutUrl + "?session="+self.getSession();
        self.setSession(null);
        self.sessionAuthenticated = false;
        return api.getRequest(url, "");
    };

    this.checkSessionAuthenticity = function () {
        return self.validate().then(function (response) {
            if (response !== "OK") {
                self.setSession(null);
                self.sessionAuthenticated = false;
                console.log("sessionAuthenticated false"); //todo remove
            } else {
                self.sessionAuthenticated = true;
                console.log("sessionAuthenticated true"); //todo remove
            }
        }, function (error) {
            self.setSession(null);
            self.sessionAuthenticated = false;
            console.log("sessionAuthenticated false"); //todo remove
        });
    }

    this.getSession = function(){
        return localSettings.getSessionID();
    };

    this.setSession = function (session) {
        oldSession = self.getSession();
        if (oldSession != null) {
            self.logout().then(function () {
                localSettings.setSessionID(session);
            });
        } else {
            localSettings.setSessionID(session);
        }
    };

}

var auth = new Auth();