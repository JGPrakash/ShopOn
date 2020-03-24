function AccountReportAPI() {
    var self = this;

    this.accountReportAPI = function (data, callback, errorCallback) {
        $.server.webMethodPOST("finfacts/accountreport/account/", data, callback, errorCallback);
    }

}