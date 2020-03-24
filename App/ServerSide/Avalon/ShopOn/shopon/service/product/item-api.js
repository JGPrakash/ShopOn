function ItemAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("inventory/item/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (item_no, callback) {
        //$.server.webMethodGET("inventory/item/" + item_no + "?store_no=" + localStorage.getItem("user_store_no"), callback, callback);
        $.server.webMethodGET("inventory/item/" + item_no + "?store_no=" + localStorage.getItem("user_fulfillment_store_no"), callback, callback);
    }
    this.getCountValue = function (callback) {
        $.server.webMethodGET("inventory/item/count?comp_id=" + localStorage.getItem("user_company_id"), callback);
    }

    this.getSummary = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("inventory/item/summary/?store_no=" + localStorage.getItem("user_store_no") + "&sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX + "&start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/item/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("inventory/item/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("inventory/item/" + id, data, callback, callback, callback);
    }
}


function ItemImageAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/item_image/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (item_no, callback) {
        //$.server.webMethodGET("inventory/item/" + item_no + "?store_no=" + localStorage.getItem("user_store_no"), callback, callback);
        $.server.webMethodGET("shopon/item_image/" + item_no + "?store_no=" + localStorage.getItem("user_fulfillment_store_no"), callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/item_image/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/item_image/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/item_image/" + id, data, callback, callback, callback);
    }
}