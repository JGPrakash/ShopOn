function ItemAttrCacheAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        //todo filter expression -> type,item_no,attr_no
        $.server.webMethodGET("shopon/item-attr-cache/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (item_attr_no, callback) {
        $.server.webMethodGET("shopon/item-attr-cache/" + item_attr_no, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/item-attr-cache/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/item-attr-cache/" + data.item_attr_no, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/item-attr-cache/" + data.item_attr_no, data, callback, errorCallback);
    }
}