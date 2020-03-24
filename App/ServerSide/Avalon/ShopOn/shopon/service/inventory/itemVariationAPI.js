function ItemVariationAPI() {
    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("inventory/variation/searchValue?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
    this.searchValues = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("inventory/variation?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/variation/", data, callback, errorCallback);
    };
    this.putValue = function (var_no, data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/variation/" + var_no, data, callback, errorCallback);
    };
    this.multiPostValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/variation/multi/", { multi: data }, callback, errorCallback);
    };
    this.multiPutValue = function (var_no, data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/variation/multi/" + var_no, { multi: data }, callback, errorCallback);
    };
    this.deleteValue = function (var_no, callback, errorCallback) {
        $.server.webMethodDELETE("inventory/variation/" + var_no, {}, callback, errorCallback);
    };
}