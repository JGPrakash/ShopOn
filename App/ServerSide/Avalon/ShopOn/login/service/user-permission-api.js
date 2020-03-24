function UserPermissionAPI() {

    var self = this;


    this.getValue = function (data, callback) {
        var user_id = JSON.parse(localStorage.getItem("admin_data"))[0].user_id;
        // $.server.webMethodGET("iam/users/" + user_id + "/object?obj_id=" + data.obj_id + "&obj_type=" + data.obj_type + "&comp_prod_id=" + data.comp_prod_id, callback);
        //$.server.webMethodGET("iam/users/tempobject?user_id=" + user_id + "&obj_id=" + data.obj_id + "&obj_type=" + data.obj_type + "&comp_prod_id=" + data.comp_prod_id, callback, callback);
        $.server.webMethodGET("iam/user-permissions/" + user_id + "?user_id=" + user_id + "&obj_id=" + data.obj_id + "&obj_type=" + data.obj_type + "&comp_prod_id=" + data.comp_prod_id, callback);

    }
    
    this.getPricePlanPrivilages = function (data, callback) {
        $.server.webMethodGET("iam/price-plan-access/?start_record=" + data.start_record + "&end_record=" + data.end_record + "&filter_expression=" + encodeURIComponent(data.filterExpression) + "&sort_expression=" + data.sort_expression, callback);
    }


}