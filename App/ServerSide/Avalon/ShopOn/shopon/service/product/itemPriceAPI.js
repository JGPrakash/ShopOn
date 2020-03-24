function ItemPriceAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("inventory/item-price/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (item_attr_no, callback) {
        $.server.webMethodGET("inventory/item-price/" + item_attr_no, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/item-price/", data, callback, errorCallback);
    }
    this.multiPostValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/item-price/multi/", data, callback, errorCallback);
    };
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/item-price/" + data.item_attr_no, data, callback, errorCallback);
    }
    this.multiPutValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/item-price/multi/" + data[0].price_no, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("inventory/item-price/" + data.item_attr_no, data, callback, errorCallback);
    }

    this.printBatch = function (callback, errorCallback) {
        $.server.webMethodPOST("inventory/item-price/pricebatch", {"comp_id":"78"}, callback, errorCallback);
    }
}