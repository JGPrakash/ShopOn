function TokenAPI() {

    var self = this;


    this.putValue = function (userData, callback) {
        $.server.webMethodPOST("iam/tokens/", userData, callback, callback);
    }

}