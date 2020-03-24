function ObjectPermissionAPI() {

    var self = this;
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter Expression -> comp_prod_id,obj_id,user_id,obj_type,perm_id
        $.server.webMethodGET("iam/object-permissions/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (data, callback) {
        var user_id = JSON.parse(getCookie("admin_data"))[0].user_id;
        $.server.webMethodGET("iam/object-permissions/"+ user_id+"?user_id=" + user_id + "&obj_id=" + data.obj_id + "&obj_type=" + data.obj_type + "&comp_prod_id=" + data.comp_prod_id, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("iam/object-permissions/", data, callback, errorCallback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("iam/object-permissions/" + id, data, callback, errorCallback);
    }
    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("iam/object-permissions/" + id, data, callback, callback, callback);
    }
}