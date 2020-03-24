function EventsAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        //todo filter expression -> 
        $.server.webMethodGET("shopon/event?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression , callback);
    }
    this.searchValueCount = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/event?select_expression= count(*) cnt &start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + encodeURIComponent(sort_expression), callback, callback);
    };
    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/event/" + data.attr_no_key, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/event/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/event/" + data.attr_no_key, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/event/" + data.attr_no_key, data, callback, errorCallback);
    }
}