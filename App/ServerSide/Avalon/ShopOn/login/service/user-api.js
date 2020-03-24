function UserAPI() {
    
    this.getUserDetail = function ( callback) {
          //user
        callback(JSON.parse(getCookie("admin_data")));
    }
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("iam/users/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (user_id, callback) {
        $.server.webMethodGET("iam/users/" + user_id + "?user_id=" + user_id, callback, callback);
    }
    this.insertUser = function (registerData, callback, errorCallback) {
        $.server.webMethodPOST("iam/users/", registerData, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("iam/users/" + id, data, callback, errorCallback);
    }
}