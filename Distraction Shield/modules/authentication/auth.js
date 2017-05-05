
function Auth() {
    var self = this;

    this.loginUrl = "/session";
    this.loginAnonUrl = "/get_anon_session";
    this.signinAnonUrl = "/add_anon_user";
    this.validateUrl = "/validate";
    this.logoutUrl = "/logout_session";
    this.detailsUrl = "/get_user_details";

    this.sessionAuthentic = false;

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

    this.validate = function () {
        var url = self.validateUrl + "?session="+self.getSession();
        return api.getRequest(url, "");
    };

    this.getDetails = function () {
        var url = self.detailsUrl + "?session="+self.getSession();
        return api.getRequest(url, "");
    }

    this.logout = function(){
        var url = self.logoutUrl + "?session="+self.getSession();
        self.sessionAuthentic = false;
        self.setSession(null);
        return api.getRequest(url, "").then();
    };

    this.authenticateSession = function () {
        if (self.getSession() != null && self.getSession() != undefined) {
            return self.validate().then(function (response) {
                if (response !== "OK") {
                    self.invalidateSession();
                } else {
                    self.sessionAuthentic = true;
                }
            }, function (error) {
                self.invalidateSession();
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve("No valid session");
                self.invalidateSession();
            });
        }
    };

    this.invalidateSession = function () {
        self.setSession(null);
        self.sessionAuthentic = false;
    }

    this.getSession = function(){
        return localSettings.getSessionID();
    };

    this.setSession = function (session) {
        oldSession = self.getSession();
        if (self.sessionAuthentic) {
            self.logout().then(function () {
                localSettings.setSessionID(session);
                if (session) {
                    self.sessionAuthentic = true;
                } else {
                    self.sessionAuthentic = false;
                }
            });
        } else {
            localSettings.setSessionID(session);
            if (session) {
                self.sessionAuthentic = true;
            } else {
                self.sessionAuthentic = false;
            }
        }
    };

}

var auth = new Auth();
