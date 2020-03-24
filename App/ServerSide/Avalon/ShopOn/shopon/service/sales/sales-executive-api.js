function SalesExecutiveAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/salesexecutive/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
        //var url = "shopon/salesexecutive/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression;
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
        $.server.webMethodGET("shopon/salesexecutive/" + id.sale_executive_no, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/salesexecutive/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/salesexecutive/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/salesexecutive/" + id, data, callback, callback, callback);
    }
}