function RegisterAPI() {

    var self = this;


    this.searchValue = function (start_record, end_record, filterExpression, sort_expression, callback) {
        var user_id = JSON.parse(localStorage.getItem("admin_data"))[0].user_id;
        //$.server.webMethodGET("iam/CompanyProduct11?user_id=" + user_id, callback);
        $.server.webMethodGET("settings/register/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);

    }
    this.getValue = function (id, callback) {
        $.server.webMethodGET("settings/register/" + id.reg_no + "?reg_no=" + id.reg_no, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("settings/register/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("settings/register/" + data.reg_no, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("settings/register/" + data.reg_no, data, callback, errorCallback);
    }
}