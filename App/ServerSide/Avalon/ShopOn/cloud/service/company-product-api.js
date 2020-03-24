function CompanyProductAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter Expression -> comp_id,compprodname,prodid,prodname,priceplan,comp_name,prod_uri,comp_prod_uri,instance_id
        $.server.webMethodGET("cloud/companyproduct/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("cloud/companyproduct/" + id, callback);
    }

    this.postValue = function (data, callback) {
        $.server.webMethodPOST("cloud/companyproduct/", data, callback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("cloud/companyproduct/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, callback, errorCallback) {
        $.server.webMethodDELETE("cloud/companyproduct/" + id, id, callback, callback, callback);
    }
}