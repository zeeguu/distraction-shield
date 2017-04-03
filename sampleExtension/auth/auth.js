
function Auth() {
    var self = this;

    this.apiUrl = "https://zeeguu.unibe.ch/api";
    this.loginUrl = "/session";
    this.signinUrl = "/add_user";
    this.loginAnonUrl = "/get_anon_session";
    this.signinAnonUrl = "/add_anon_user";
    this.validateUrl = "/validate";
    this.logoutUrl = "/logout_session";

    this.session = null;

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
        var url = self.validateUrl + "?session="+self.session;
        return api.getRequest(url, "");
    };

    this.logout = function(){
        var url = self.logoutUrl + "?session="+self.session;
        this.session = null;
        return api.getRequest(url, "");
    };

    this.getSession = function(){
        if(self.session != null){
            return self.session;
        }
    };

    this.setSession = function (session) {
        if (self.session != null) {
            self.logout().then(function () {
                self.session = session;
            });
        } else {
            self.session = session;
        }
    };
}

var auth = new Auth();