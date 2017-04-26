define(['constants','background'], function Auth(constants, background) {
    function Auth() {
        var self = this;
        // var settings = background.getLocalSettings();

        //TODO make getter, setter and enforce private
        this.sessionAuthentic = false;

        this.loginAnon = function (username, password) {
            //caller has responsibility to set auth.session to the returned value
            var url = constants.loginAnonUrl + "/" + username;
            var params = "password=" + password;
            return api.postRequest(url, params);
        };

        this.signinAnon = function (username, password) {
            //caller has responsibility to set auth.session to the returned value
            var url = constants.signinAnonUrl;
            var params = "uuid=" + username + "&password=" + password;
            return api.postRequest(url, params);
        };

        this.login = function (email, password) {
            //caller has responsibility to set auth.session to the returned value
            var url = constants.loginUrl + "/" + email;
            var params = "password=" + password;
            return api.postRequest(url, params);
        };

        this.validate = function () {
            var url = constants.validateUrl + "?session=" + self.getSession();
            return api.getRequest(url, "");
        };

        this.logout = function () {
            var url = constants.logoutUrl + "?session=" + self.getSession();
            self.sessionAuthentic = false;
            self.setSession(null);
            return api.getRequest(url, "").then();
        };

        this.authenticateSession = function () {
            return self.validate().then(function (response) {
                if (response !== "OK") {
                    self.setSession(null);
                    self.sessionAuthentic = false;
                } else {
                    self.sessionAuthentic = true;
                }
            }, function (error) {
                self.setSession(null);
                self.sessionAuthentic = false;
            });
        };

        this.getSession = function () {
            return settings.getSessionID();
        };

        this.setSession = function (session) {
            oldSession = self.getSession();
            if (self.sessionAuthentic) {
                self.logout().then(function () {
                    settings.setSessionID(session);
                    synchronizer.syncSettings(settings);
                    if (session) {
                        self.sessionAuthentic = true;
                    } else {
                        self.sessionAuthentic = false;
                    }
                });
            } else {
                settings.setSessionID(session);
                synchronizer.syncSettings(settings);
                if (session) {
                    self.sessionAuthentic = true;
                } else {
                    self.sessionAuthentic = false;
                }
            }
        };
    }

    return {
        Auth: Auth
    }
});
// var auth = new Auth();
