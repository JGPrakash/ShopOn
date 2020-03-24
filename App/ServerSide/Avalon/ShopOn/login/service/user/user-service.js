function UserService() {
    var self = this;
    this.getUserDetail = function ( callback) {

        if(androidApp==true){
            callback([{"password":"1","user_id":"1","user_name":"Admin"}]);
        }else{
            
          $.server.webMethod("RAC.User.getUserDetail", JSON.stringify({}), callback);
        } 
        
    }


    this.getSettings = function (callback) {
        if (androidApp == true) {
            callback([]);
        } else {
            var map = new Map();
            map.add("comp_id", localStorage.getItem("user_company_id"));
            //$.server.webMethodSync("Settings.getSettings", map.toString(), callback);
            //$.server.webMethod("Settings.getSettings", JSON.stringify({}), callback);
            var filter_expression = "comp_id ="+localStorage.getItem("user_company_id");
            $.server.webMethodGET("shopon/settings?start_record=&end_record=&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=sett_no", callback);
        }
    }
    
    this.getLicense = function (callback) {
        if (appConfig.check_license) {
            var data = {
                "check_file_name": appConfig.check_file_path,
                "license_file_name": appConfig.license_file_path,
                "mode": appConfig.mode,
                "company_id": localStorage.getItem("user_company_id")
            }
            $.server.webMethodPOST("shopon/license/", data, callback);
        }
        else {
            var data = {
                Version:"Licensed"
            }
            callback(data);
        }
        
    }

    this.getUserMenu = function ( callback) {
          if(androidApp==true){
            callback([]);
        }else{
            
           $.server.webMethod("RAC.User.getUserMenu", JSON.stringify({}), callback);
        } 
    }
  
    this.getAllUser = function (callback) {
        $.server.webMethod("RAC.User.getAllUser", JSON.stringify({}), callback);
    }

    


    this.authenticate = function (user_id, password, callback,errorCallback) {

        $.server.webMethod("RAC.User.authenticate", JSON.stringify({ user_id: user_id, password: password }), callback,errorCallback);

       /* var result=$.server.webMethod("RAC.User.authenticate", JSON.stringify({ user_id: user_id, password: password }));
        if(result=="success"){
            callback;
        }
        else{
            alert("hai");
        }*/

        //var result;
        //$.ajax({
        //    type: "POST",
        //    url: "http://vegeta.in/SchoolDataService/SecurityService.jsp" ,
        //    data: {
        //        user_id: user_id,
        //        password: password
        //    }, xhrFields: {
        //        withCredentials: true
        //    },
        //    //dataType: "json",
        //    async: true, crossDomain: true,
        //    success: function (items) {
        //        items = JSON.parse(items);
        //        result = items;


        //        if (typeof callback !== "undefined")
        //             callback(result);
        //    },
        //    error: function (err) {


        //    }
        //});


    }

    this.getMaxUserDetails = function (callback) {
        $.server.webMethod("RAC.User.getMaxUserDetails", "", callback);
    }


    this.insertUserDetails = function (data,user_id, callback) {
        var map = new Map();

        map.add("user_id",user_id);
        map.add("user_name", data.user_name, "Text");
        map.add("password", data.password, "Text");
        map.add("full_name", data.full_name, "Text");

        $.server.webMethod("RAC.User.insertUserDetails", map.toString(), callback);
    }


    this.updateUserDetails = function (data, callback) {
        var map = new Map();
        map.add("user_id",data.user_id);
        map.add("user_name", data.user_name, "Text");
        map.add("password", data.password, "Text");
        map.add("full_name", data.full_name, "Text");
        $.server.webMethod("RAC.User.updateUserDetails", map.toString(), callback);
    }


    this.deleteUserDetails = function (user_id, callback) {

        var map = new Map();
        map.add("user_id", user_id);
        $.server.webMethod("RAC.User.deleteUserDetails", map.toString(), callback);
    }

    this.getGroupDetails = function ( callback) {
        $.server.webMethod("RAC.User.getUserGroupDetails", JSON.stringify({}), callback);
    }


    this.getAllUserDetails = function ( callback) {
        $.server.webMethod("RAC.User.getAllUserDetails", JSON.stringify({}), callback);
    }



    this.getAllUserGroupDetails = function ( callback) {
        $.server.webMethod("RAC.User.getAllUserGroupDetails", JSON.stringify({}), callback);
    }


    this.getMaxGroupDetails = function (callback) {
        $.server.webMethod("RAC.User.getMaxGroupDetails", "", callback);
    }


    this.insertGroupDetails = function (data,group_id, callback) {
        var map = new Map();

        map.add("group_id",group_id);
        map.add("group_name", data.group_name, "Text");


        $.server.webMethod("RAC.User.insertGroupDetails", map.toString(), callback);
    }


    this.updateGroupDetails = function (data, callback) {
        var map = new Map();
        map.add("group_id",data.group_id);
        map.add("group_name", data.group_name, "Text");
        $.server.webMethod("RAC.User.updateGroupDetails", map.toString(), callback);
    }


    this.deleteGroupDetails = function (group_id, callback) {

        var map = new Map();
        map.add("group_id", group_id);
        $.server.webMethod("RAC.User.deleteGroupDetails", map.toString(), callback);
    }


    this.insertUserGroupDetails = function (data, callback) {
        var map = new Map();

        map.add("group_id", data.group_id);
        map.add("user_id", data.user_id);


        $.server.webMethod("RAC.User.insertUserGroupDetails", map.toString(), callback);
    }


    this.updateUserGroupDetails = function (data, callback) {
        var map = new Map();
        map.add("user_group_id", data.user_group_id);
        map.add("group_id", data.group_id);
        map.add("user_id", data.user_id);
        $.server.webMethod("RAC.User.updateUserGroupDetails", map.toString(), callback);
    }


    this.deleteUserGroupDetails = function (group_id, callback) {

        var map = new Map();
        map.add("group_id", group_id);
        $.server.webMethod("RAC.User.deleteUserGroupDetails", map.toString(), callback);
    }


    this.insertPermissionDetails = function (data,perm_id, callback) {
        var map = new Map();

        map.add("perm_id",perm_id);
        map.add("perm_name",data.perm_name, 'Text');


        $.server.webMethod("RAC.User.insertPermissionDetails", map.toString(), callback);
    }


    this.updatePermissionDetails = function (data, callback) {
        var map = new Map();
        map.add("perm_id",data.perm_id);
        map.add("perm_name",data.perm_name, 'Text');
        $.server.webMethod("RAC.User.updatePermissionDetails", map.toString(), callback);
    }


    this.deletePermissionDetails = function (perm_id, callback) {

        var map = new Map();
        map.add("perm_id", perm_id);
        $.server.webMethod("RAC.User.deletePermissionDetails", map.toString(), callback);
    }



    this.getPermissionDetails = function ( callback) {
        $.server.webMethod("RAC.User.getPermissionDetails", JSON.stringify({}), callback);
    }

    this.getMaxPermissionDetails = function (callback) {
        $.server.webMethod("RAC.User.getMaxPermissionDetails", "", callback);
    }


    this.insertObjectDetails = function (data,id, callback) {
        var map = new Map();

        map.add("id",id);
        map.add("obj_type",data.obj_type, 'Text');
        map.add("obj_id",data.obj_id, 'Text');
        map.add("attr_1",data.attr_1, 'Text');
        map.add("attr_2",data.attr_2, 'Text');
        map.add("attr_3",data.attr_3, 'Text');


       $.server.webMethod("RAC.User.insertObjectDetails", map.toString(), callback);
    }


    this.updateObjectDetails = function (data, callback) {
        var map = new Map();

        map.add("id",data.id);
        map.add("obj_type",data.obj_type, 'Text');
        map.add("obj_id",data.obj_id, 'Text');
        map.add("attr_1",data.attr_1, 'Text');
        map.add("attr_2",data.attr_2, 'Text');
        map.add("attr_3",data.attr_3, 'Text');

       $.server.webMethod("RAC.User.updateObjectDetails", map.toString(), callback);
    }


    this.deleteObjectDetails = function (id, callback) {

        var map = new Map();
        map.add("id", id);
       $.server.webMethod("RAC.User.deleteObjectDetails", map.toString(), callback);
    }


    this.getObjectDetails = function ( callback) {
       $.server.webMethod("RAC.User.getObjectDetails", JSON.stringify({}), callback);
    }

    this.getMaxObjectDetails = function (callback) {
       $.server.webMethod("RAC.User.getMaxObjectDetails","", callback);
    }



    this.insertObjectPermissionDetails = function (data,obj_perm_id, callback) {
        var map = new Map();

        map.add("obj_perm_id",obj_perm_id);
        map.add("perm_id",data.perm_id, 'Text');
        map.add("obj_type",data.obj_type, 'Text');
        map.add("obj_id",data.obj_id, 'Text');
        map.add("user_type",data.user_type, 'Text');
        map.add("user_id",data.user_id, 'Text');


       $.server.webMethod("RAC.User.insertObjectPermDetails", map.toString(), callback);
    }


    this.updateObjectPermissionDetails = function (data, callback) {
        var map = new Map();

        map.add("obj_perm_id",data.obj_perm_id);
        map.add("perm_id",data.perm_id, 'Text');
        map.add("obj_type",data.obj_type, 'Text');
        map.add("obj_id",data.obj_id, 'Text');
        map.add("user_type",data.user_type, 'Text');
        map.add("user_id",data.user_id, 'Text');

       $.server.webMethod("RAC.User.updateObjectPermDetails", map.toString(), callback);
    }


    this.deleteObjectPermissionDetails = function (obj_perm_id, callback) {

        var map = new Map();
        map.add("obj_perm_id", obj_perm_id);
       $.server.webMethod("RAC.User.deleteObjectPermDetails", map.toString(), callback);
    }


    this.getObjectPermDetails = function ( callback) {
       $.server.webMethod("RAC.User.getObjectPermDetails", JSON.stringify({}), callback);
    }

    this.getMaxObjectPermDetails = function (callback) {
       $.server.webMethod("RAC.User.getMaxObjectPermDetails","", callback);
    }

    this.getMyFinfactsCompany = function (callback) {
        var map = new Map();
        map.add("user_id", CONTEXT.user_id);
        //map.add("user_id", "1");
        $.server.webMethod("RAC.User.getMyFinfactsCompany", map.toString(), callback);
    }

    this.getUserCompany = function (user_id,callback) {
        var map = new Map();
        map.add("user_id", user_id);
        $.server.webMethod("RAC.User.getUserCompany", map.toString(), callback);
    }
    this.getCompanyStore = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        $.server.webMethod("RAC.User.getCompanyStore", map.toString(), callback);
    }
    this.getStoreRegister = function (store_no, callback) {
        var map = new Map();
        map.add("store_no", store_no);
        $.server.webMethod("RAC.User.getStoreRegister", map.toString(), callback);
    }

    this.getExpiryAlertItems = function (callback) {
        var map = new Map();
        map.add("store_no", localStorage.getItem("user_store_no"));
        $.server.webMethod("Item.getExpiryAlertItems", map.toString(), callback);
    }
    this.getStockAlert = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        map.add("store_no", getCookie("user_store_id"));
        $.server.webMethod("Item.getStockAlert", map.toString(), callback);
    }
}