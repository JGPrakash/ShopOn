function CloudIntegrationAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("iam/company/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("iam/company/" + id, callback);
    }

    this.postValue = function (data, callback) {
        $.server.webMethodPOST("iam/company/", data, callback);
    }
    this.postValueWithURL = function (url, data, callback) {
        $.server.webMethodPOSTWithURL(url, "company/companyintegration/", data, callback);
    }

    this.putValue = function (id, data, callback) {
        $.server.webMethodPUT("iam/company/" + id, registerData, callback);
    }

    this.deleteValue = function (id, callback) {
        $.server.webMethodDelete("iam/company/" + id, callback);
    }


}