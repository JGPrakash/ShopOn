function SubscriptionAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/subscription/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/subscription/" + data.sub_id + "?sub_id=" + data.sub_id + "&comp_id=" + localStorage.getItem("user_company_id"), callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/subscription/", data, callback, errorCallback);
    }

    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/subscription/" + data.sub_id, data, callback, errorCallback);
    }

    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/subscription/" + data.sub_id, data, callback, errorCallback);
    }

}