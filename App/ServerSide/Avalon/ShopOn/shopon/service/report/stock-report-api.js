function StockReportAPI() {
    var self = this;

    this.stockReport = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/stockreport", data, callback, errorCallback);
    }
    this.getStockSummary = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/stockreport/summary", data, callback, errorCallback);
    }
}