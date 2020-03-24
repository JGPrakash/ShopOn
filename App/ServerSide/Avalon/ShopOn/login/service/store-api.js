function StoreAPI() {

    var self = this;


    this.searchValue = function (start_record, end_record, filterExpression, sort_expression, callback) {
        var user_id = JSON.parse(localStorage.getItem("admin_data"))[0].user_id;
        //$.server.webMethodGET("iam/CompanyProduct11?user_id=" + user_id, callback);
        $.server.webMethodGET("settings/store/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);

    }
    this.getValue = function (id, callback) {
        $.server.webMethodGET("settings/store/" + id.store_no + "?store_no=" + id.store_no, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("settings/store/", data, callback, errorCallback);
    }
    this.putValue = function (data, callback, errorCallback) {
        $.server.webMethodPUT("settings/store/" + data.store_no, data, callback, errorCallback);
    }
    this.deleteValue = function (data, callback, errorCallback) {
        $.server.webMethodDELETE("settings/store/" + data.store_no, data, callback, errorCallback);
    }
}