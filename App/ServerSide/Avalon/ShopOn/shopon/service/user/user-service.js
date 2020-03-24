function UserService() {
    var self = this;
    this.getUserDetail = function(callback) {
        $.server.webMethod("User.getUserDetail", JSON.stringify({}), callback);
    }

    this.getUserMenu = function(callback) {
        $.server.webMethod("User.getUserMenu", JSON.stringify({}), callback);
    }

    this.getAllUser = function(callback) {
        $.server.webMethod("User.getAllUser", JSON.stringify({}), callback);
    }




    this.authenticate = function(user_id, password, callback) {

        $.server.webMethod("User.authenticate", JSON.stringify({ user_id: user_id, password: password }), callback);
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

    this.getMaxUserDetails = function(callback) {
        $.server.webMethod("User.getMaxUserDetails", "", callback);
    }


    this.insertUserDetails = function(data, user_id, callback) {
        var map = new Map();

        map.add("user_id", user_id);
        map.add("user_name", data.user_name, "Text");
        map.add("password", data.password, "Text");
        map.add("full_name", data.full_name, "Text");

        $.server.webMethod("User.insertUserDetails", map.toString(), callback);
    }


    this.updateUserDetails = function(data, callback) {
        var map = new Map();
        map.add("user_id", data.user_id);
        map.add("user_name", data.user_name, "Text");
        map.add("password", data.password, "Text");
        map.add("full_name", data.full_name, "Text");
        $.server.webMethod("User.updateUserDetails", map.toString(), callback);
    }


    this.deleteUserDetails = function(user_id, callback) {

        var map = new Map();
        map.add("user_id", user_id);
        $.server.webMethod("User.deleteUserDetails", map.toString(), callback);
    }

    this.getGroupDetails = function(callback) {
        $.server.webMethod("User.getUserGroupDetails", JSON.stringify({}), callback);
    }


    this.getAllUserDetails = function(callback) {
        $.server.webMethod("User.getAllUserDetails", JSON.stringify({}), callback);
    }



    this.getAllUserGroupDetails = function(callback) {
        $.server.webMethod("User.getAllUserGroupDetails", JSON.stringify({}), callback);
    }


    this.getMaxGroupDetails = function(callback) {
        $.server.webMethod("User.getMaxGroupDetails", "", callback);
    }


    this.insertGroupDetails = function(data, group_id, callback) {
        var map = new Map();

        map.add("group_id", group_id);
        map.add("group_name", data.group_name, "Text");


        $.server.webMethod("User.insertGroupDetails", map.toString(), callback);
    }


    this.updateGroupDetails = function(data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        map.add("group_name", data.group_name, "Text");
        $.server.webMethod("User.updateGroupDetails", map.toString(), callback);
    }


    this.deleteGroupDetails = function(group_id, callback) {

        var map = new Map();
        map.add("group_id", group_id);
        $.server.webMethod("User.deleteGroupDetails", map.toString(), callback);
    }


    this.insertUserGroupDetails = function(data, callback) {
        var map = new Map();

        map.add("group_id", data.group_id);
        map.add("user_id", data.user_id);


        $.server.webMethod("User.insertUserGroupDetails", map.toString(), callback);
    }


    this.updateUserGroupDetails = function(data, callback) {
        var map = new Map();
        map.add("group_id", data.group_id);
        map.add("user_id", data.user_id);
        $.server.webMethod("User.updateUserGroupDetails", map.toString(), callback);
    }


    this.deleteUserGroupDetails = function(group_id, callback) {

        var map = new Map();
        map.add("group_id", group_id);
        $.server.webMethod("User.deleteUserGroupDetails", map.toString(), callback);
    }


    this.insertPermissionDetails = function(data, perm_id, callback) {
        var map = new Map();

        map.add("perm_id", perm_id);
        map.add("perm_name", data.perm_name, 'Text');


        $.server.webMethod("User.insertPermissionDetails", map.toString(), callback);
    }


    this.updatePermissionDetails = function(data, callback) {
        var map = new Map();
        map.add("perm_id", data.perm_id);
        map.add("perm_name", data.perm_name, 'Text');
        $.server.webMethod("User.updatePermissionDetails", map.toString(), callback);
    }


    this.deletePermissionDetails = function(perm_id, callback) {

        var map = new Map();
        map.add("perm_id", perm_id);
        $.server.webMethod("User.deletePermissionDetails", map.toString(), callback);
    }



    this.getPermissionDetails = function(callback) {
        $.server.webMethod("User.getPermissionDetails", JSON.stringify({}), callback);
    }

    this.getMaxPermissionDetails = function(callback) {
        $.server.webMethod("User.getMaxPermissionDetails", "", callback);
    }


    this.insertObjectDetails = function(data, id, callback) {
        var map = new Map();

        map.add("id", id);
        map.add("obj_type", data.obj_type, 'Text');
        map.add("obj_id", data.obj_id, 'Text');
        map.add("attr_1", data.attr_1, 'Text');
        map.add("attr_2", data.attr_2, 'Text');
        map.add("attr_3", data.attr_3, 'Text');


        $.server.webMethod("User.insertObjectDetails", map.toString(), callback);
    }


    this.updateObjectDetails = function(data, callback) {
        var map = new Map();

        map.add("id", data.id);
        map.add("obj_type", data.obj_type, 'Text');
        map.add("obj_id", data.obj_id, 'Text');
        map.add("attr_1", data.attr_1, 'Text');
        map.add("attr_2", data.attr_2, 'Text');
        map.add("attr_3", data.attr_3, 'Text');

        $.server.webMethod("User.updateObjectDetails", map.toString(), callback);
    }


    this.deleteObjectDetails = function(id, callback) {

        var map = new Map();
        map.add("id", id);
        $.server.webMethod("User.deleteObjectDetails", map.toString(), callback);
    }


    this.getObjectDetails = function(callback) {
        $.server.webMethod("User.getObjectDetails", JSON.stringify({}), callback);
    }

    this.getMaxObjectDetails = function(callback) {
        $.server.webMethod("User.getMaxObjectDetails", "", callback);
    }



    this.insertObjectPermissionDetails = function(data, obj_perm_id, callback) {
        var map = new Map();

        map.add("obj_perm_id", obj_perm_id);
        map.add("perm_id", data.perm_id, 'Text');
        map.add("obj_type", data.obj_type, 'Text');
        map.add("obj_id", data.obj_id, 'Text');
        map.add("user_type", data.user_type, 'Text');
        map.add("user_id", data.user_id, 'Text');


        $.server.webMethod("User.insertObjectPermDetails", map.toString(), callback);
    }


    this.updateObjectPermissionDetails = function(data, callback) {
        var map = new Map();

        map.add("obj_perm_id", data.obj_perm_id);
        map.add("perm_id", data.perm_id, 'Text');
        map.add("obj_type", data.obj_type, 'Text');
        map.add("obj_id", data.obj_id, 'Text');
        map.add("user_type", data.user_type, 'Text');
        map.add("user_id", data.user_id, 'Text');

        $.server.webMethod("User.updateObjectPermDetails", map.toString(), callback);
    }


    this.deleteObjectPermissionDetails = function(obj_perm_id, callback) {

        var map = new Map();
        map.add("obj_perm_id", obj_perm_id);
        $.server.webMethod("User.deleteObjectPermDetails", map.toString(), callback);
    }


    this.getObjectPermDetails = function(callback) {
        $.server.webMethod("User.getObjectPermDetails", JSON.stringify({}), callback);
    }

    this.getMaxObjectPermDetails = function(callback) {
        //$.server.webMethod("User.getMaxObjectPermDetails", "", callback);
        $.server.webMethod("User.getMaxObjectPermDetails", "", callback);
    }

    this.getMyFinfactsCompany = function (callback) {
        var map = new Map();
        //map.add("user_id", CONTEXT.user_id);
        map.add("user_id", "1");
        $.server.webMethod("User.getMyFinfactsCompany", map.toString(), callback);
    }



}