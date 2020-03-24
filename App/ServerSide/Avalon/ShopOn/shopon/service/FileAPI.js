function FileAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/files/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (item_attr_no, callback) {
        $.server.webMethodGET("shopon/files/" + item_attr_no, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/files/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/files/" + data.file_no, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/files/" + data.file_no, data, callback, errorCallback);
    }
}