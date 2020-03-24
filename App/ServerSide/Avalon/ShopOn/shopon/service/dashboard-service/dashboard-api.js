function DashBoardAPI() {

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/dashboard/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (id, callback) {
        $.server.webMethodGET("shopon/dashboard/" + id.id, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/dashboard/", data, callback, errorCallback);
    }
    this.postMultiValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/dashboard/multi", data, callback, errorCallback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/dashboard/" + id, data, callback, errorCallback);
    }
    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/dashboard/" + id, data, callback, callback, callback);
    }
    this.getStockDashboard = function (id, callback) {
        $.server.webMethodGET("shopon/dashboard/stock/" + id, callback, callback);
    }
}