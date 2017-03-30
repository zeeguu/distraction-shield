
function Auth() {
    var self = this;

    this.apiUrl = "https://zeeguu.unibe.ch/api";
    this.loginUrl = "/session";
    this.signinUrl = "/add_user";
    this.loginAnonUrl = "/get_anon_session";
    this.signinAnonUrl = "/add_anon_user";
    this.logoutUrl = "/logout_session";

    this.session = null;

    this.loginAnon = function(username, password) {
        var url = self.loginAnonUrl + "/" + username;
        var params = "password="+password;
        return api.postRequest(url, params);
    };

    this.signinAnon = function(username, password) {
        var url = self.signinAnonUrl;
        var params = "uuid="+username+"&password"+password;
        return api.postRequest(url, params);
    };

    this.login = function(email, password){
        var url = self.loginUrl + "/" + email;
        var params = "password="+password;
        return api.postRequest(url, params);
    };

    this.signin = function(username, password, email){
        //TODO This will probably be done by redirecting to the Zeeguu website itself.
    };

    this.logout = function(){
        this.session = null;
        var url = self.logoutUrl;
        var params = "";
        return api.getRequest(url, params);
    };

    this.getSession = function(){
        if(self.session != null){
            return self.session;
        }
    };
}

var auth = new Auth();