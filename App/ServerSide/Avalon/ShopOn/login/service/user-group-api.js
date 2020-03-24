function UserGroupAPI() {
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> group_id, group_name, user_group_id, user_id, user_name, comp_prod_id, comp_prod_name, prod_id, prod_name, comp_id
        $.server.webMethodGET("iam/user-groups/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("iam/user-groups/" + id, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("iam/user-groups/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("iam/user-groups/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("iam/user-groups/" + id, data, callback, callback, callback);
    }


}