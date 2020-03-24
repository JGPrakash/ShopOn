function PurchaseReportAPI() {
    var self = this;

    this.purchaseReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/purchasereport", data, callback, errorCallback);
    }
}