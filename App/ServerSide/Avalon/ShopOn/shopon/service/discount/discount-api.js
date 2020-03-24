﻿function DiscountAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/discount/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);

        //var url = "shopon/discount/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression;
        //if (LCACHE.isEmpty(url)) {
        //    $.server.webMethodGET(url, function (result, obj) {
        //        LCACHE.set(url, result);
        //        callback(result, obj);
        //    });
        //} else {
        //    callback(LCACHE.get(url));
        //}
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("shopon/discount/" + id.disc_no, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/discount/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/discount/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/discount/" + id, data, callback, callback, callback);
    }
}