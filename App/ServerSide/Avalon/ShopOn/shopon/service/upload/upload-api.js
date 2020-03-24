function UploadAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/citystate/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("update/excel/", data, callback, errorCallback);
    }
    this.postVariationValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("update/excel/variation", data, callback, errorCallback);
    }
    this.postSkuValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("update/excel/sku", data, callback, errorCallback);
    }
    this.uploadSalesExecutive = function (data, callback, errorCallback) {
        $.server.webMethodPOST("update/excel/SalesExecutive/", data, callback, errorCallback);
    }
}