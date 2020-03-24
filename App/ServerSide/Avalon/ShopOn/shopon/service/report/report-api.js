function ReportAPI() {
    var self = this;

    this.salesReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/sales", data, callback, errorCallback);
    }
    this.purchaseReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/purchase", data, callback, errorCallback);
    }
    this.inventoryReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/inventory", data, callback, errorCallback);
    }
    this.stockReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/stock", data, callback, errorCallback);
    }
    this.dueReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/due", data, callback, errorCallback);
    }
    this.collectionReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/collection", data, callback, errorCallback);
    }
    this.subscriptionReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/subscription", data, callback, errorCallback);
    }
    this.storeSalesReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/sales/store", data, callback, errorCallback);
    }
    this.storePurchaseReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/report/purchase/store", data, callback, errorCallback);
    }
}