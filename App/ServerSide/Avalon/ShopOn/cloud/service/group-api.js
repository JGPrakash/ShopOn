function GroupAPI() {
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> group_id, prod_id, group_name
        $.server.webMethodGET("iam/groups/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.maxValue = function (callback) {
        $.server.webMethodGET("iam/groups/max/", callback, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("iam/groups/" + id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("iam/groups/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("iam/groups/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, callback) {
        $.server.webMethodDELETE("iam/groups/" + id, id, callback, callback, callback);
    }


}