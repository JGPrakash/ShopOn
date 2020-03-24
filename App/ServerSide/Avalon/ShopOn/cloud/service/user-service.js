function UserService() {

    var self = this;


  

  

    this.authenticate = function (userData, callback) {
        $.server.webMethodPOST("iam/token/", userData, callback);
    }
    this.getAllUser = function (comp_id,callback) {
        $.server.webMethodGET("iam/users?comp_id="+ comp_id,  callback);
    }
    this.getUserSearch = function (key, callback) {

        $.server.webMethodGET("iam/users/" + key + "/search", callback, callback);
    };
    this.insertUser = function (registerData, callback) {
        $.server.webMethodPOST("iam/users ", registerData, callback);
    }

    this.updateVerification = function (data, callback) {
        $.server.webMethodPUT("iam/users/", data, callback);
    }
    //move to shopon
   

    this.getUserObject = function (data, callback) {
        var user_id = JSON.parse(getCookie("admin_data"))[0].user_id;
       // $.server.webMethodGET("iam/users/" + user_id + "/object?obj_id=" + data.obj_id + "&obj_type=" + data.obj_type + "&comp_prod_id=" + data.comp_prod_id, callback);
        $.server.webMethodGET("iam/users/tempobject?user_id=" + user_id + "&obj_id=" + data.obj_id + "&obj_type=" + data.obj_type + "&comp_prod_id=" + data.comp_prod_id, callback);
    }





    this.getCompanyProductByCompIdAndUserId = function (comp_id, callback) {
        var user_id = JSON.parse(getCookie("admin_data"))[0].user_id;
        // $.server.webMethodGET("iam/users/" + user_id + "/companyproduct?comp_id=" + comp_id, callback);
        $.server.webMethodGET("iam/users/tempcompanyproduct?user_id=" + user_id + "&comp_id=" + comp_id, callback);
    }

   

    this.getMenus = function (menu_ids,callback) {      
        $.server.webMethodGET("iam/users/menu?menu_ids=" + menu_ids, callback);
    }
    this.getUserMemberbyUserId = function (user_group_id, callback) {
        $.server.webMethodGET("iam/users/user_group", callback, callback);
    }
    this.insertUserMember = function (data, callback) {

        $.server.webMethodPOST("iam/users/user_group", data, callback);
    };

    this.updateUserMember = function (data, callback) {

        $.server.webMethodPUT("iam/users/user_group" + data.user_group_id, data, callback);
    };

    this.deleteUserMember = function (data, callback) {

        $.server.webMethodDELETE("iam/users/" + data.user_group_id + "/user_group", data, callback, callback, callback);
    };
   
    


}