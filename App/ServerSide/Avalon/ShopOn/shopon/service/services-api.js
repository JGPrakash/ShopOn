function ServiceAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, additonal_filter, callback) {
        $.server.webMethodGET("services/services/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&additional_filter=" + encodeURIComponent(additonal_filter), callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("services/services/" + id.carosal_id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("services/services/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("services/services/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("services/services/" + id, data, callback, errorCallback);
    }
}

function StateAPI() {
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("services/state/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}