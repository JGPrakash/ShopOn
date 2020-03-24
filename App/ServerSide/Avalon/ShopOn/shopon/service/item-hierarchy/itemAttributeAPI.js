function ItemAttributeAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression,i, callback) {
        //todo filter expression -> 
        $.server.webMethodGET("shopon/item-attribute/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression+"&i="+i, callback);
    }
    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/item-attribute/" + data.attr_no_key, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/item-attribute/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/item-attribute/" + data.attr_no_key, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/item-attribute/" + data.attr_no_key, data, callback, errorCallback);
    }
}