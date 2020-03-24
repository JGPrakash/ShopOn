function ItemSKUAPI() {
    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("inventory/sku?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/sku/", data, callback, errorCallback);
    };
    this.putValue = function (sku_no, data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/sku/" + sku_no, data, callback, errorCallback);
    };
    this.multiPostValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/sku/multi/", { multi: data }, callback, errorCallback);
    };
    this.multiPutValue = function (sku_no, data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/sku/multi/" + sku_no, { multi: data }, callback, errorCallback);
    };
    this.deleteValue = function (sku_no, callback, errorCallback) {
        $.server.webMethodDELETE("inventory/sku/" + sku_no, {}, callback, errorCallback);
    };
}