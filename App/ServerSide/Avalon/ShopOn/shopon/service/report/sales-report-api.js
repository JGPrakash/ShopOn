function SalesReportAPI() {
    var self = this;

    this.salesReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/salesreport", data, callback, errorCallback);
    }
}