function CompanyAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_id, comp_name
        $.server.webMethodGET("cloud/company/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("cloud/company/" + id, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("cloud/company/", data, callback, errorCallback);
    }

    this.putValue = function (id,data, callback) {
        $.server.webMethodPUT("cloud/company/" + id, registerData, callback);
    }

    this.deleteValue = function (id, callback) {
        $.server.webMethodDelete("cloud/company/" + id, callback);
    }


}