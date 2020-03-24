function ItemCategoryAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        //todo filter expression -> 
        $.server.webMethodGET("shopon/item-category/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/item-category/" + data.cat_no, callback, callback);
    }
    this.getParentCategory = function (callback) {
        $.server.webMethodGET("shopon/item-category/CatParentName", callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/item-category/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/item-category/" + data.cat_no, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/item-category/" + data.cat_no, data, callback, errorCallback);
    }

}

function CategoryValueAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        //todo filter expression -> 
        $.server.webMethodGET("shopon/category_value/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/category_value/" + data.cat_val_id, callback, callback);
    }
    this.getParentCategory = function (callback) {
        $.server.webMethodGET("shopon/category_value/CatParentName", callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/category_value/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/category_value/" + data.cat_val_id, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/category_value/" + data.cat_val_id, data, callback, errorCallback);
    }

}