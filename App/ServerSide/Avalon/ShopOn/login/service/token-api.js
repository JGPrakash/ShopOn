function TokenAPI() {

    var self = this;


    this.putValue = function (userData, callback, errorcallback) {
        $.server.webMethodPOST("iam/tokens/", userData, callback, errorcallback);
    }

}