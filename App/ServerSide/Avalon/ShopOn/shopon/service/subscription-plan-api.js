function SubscriptionPlanAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/subscription-plan/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (data, callback) {
        $.server.webMethodGET("shopon/subscription-plan/?sub_plan_id=" + data.sub_plan_id, callback, callback);
    }
    this.getAutoBillItems = function (data, callback) {
        $.server.webMethodPOST("shopon/subscription-plan/autoBillItems/", data, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/subscription-plan/", data, callback, errorCallback);
    }

    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/subscription-plan/" + data.sub_plan_id, data, callback, errorCallback);
    }

    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/subscription-plan/" + data.sub_plan_id, data, callback, errorCallback);
    }

}