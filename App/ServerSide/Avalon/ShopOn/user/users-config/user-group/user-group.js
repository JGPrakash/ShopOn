$.fn.userGroupPage = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.userService = new UserService();
page.events = {
 btnUserManagement_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/users/users.html";
            },
             btnGroupManagement_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/group/group.html";
            },
            btnPermissionManagement_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/perm/perm.html";
            },
            btnObjectConfiguration_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/object/object.html";
            },
            btnUserObjectPermission_click: function() {
                  document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/user/users-config/user-obj-perm/user-obj-perm.html";
            },

        page_load: function() {

            page.userService.getGroupDetails(function (data) {

                var newUserData = [];

                var newBoardData = [];
                $(data).each(function (i, dataItem) {
                    newBoardData.push({
                        value:dataItem.group_id,
                        text:dataItem.group_name
                    });
                });

                page.userService.getAllUserDetails(function (data) {
                    $(data).each(function (i, dataItem) {
                        newUserData.push({
                            value: dataItem.user_id,
                            text: dataItem.user_name
                        });
                    });


                $$("ucSimpleEntityManage").load({
                    keyColumn: "group_id",
                    service: {
                        getAllData: function (callback) {
                            page.userService.getAllUserGroupDetails(callback);
                            //callback([
                            //    { class_id: "1", class_name: "LKG", section_id: "1", section_name: "State  Board" }
                            //]);
                        },
                        insertData: function (currentData, callback) {

                                page.userService.insertUserGroupDetails(currentData, callback);


                        },
                        updateData: function (currentData, callback) {
                            if (currentData.user_group_id == undefined || currentData.user_group_id == null || currentData.user_group_id == "")
                                page.userService.insertUserGroupDetails(currentData, callback);
                            else
                                page.userService.updateUserGroupDetails(currentData, callback);
                        },
                        deleteData: function (keyColumn, callback) {
                            page.userService.deleteUserGroupDetails(keyColumn, callback);
                        }

                    },
                    columns: [

                        { 'name': "Group Name", 'width': "300px", 'dataField': "group_name", templateStyle: "Select", valueDataField: "group_id", lookUpValues: newBoardData },
                        { 'name': "User Name", 'width': "300px", 'dataField': "user_name", templateStyle: "Select", valueDataField: "user_id", lookUpValues: newUserData }

                    ],


                });
            });
            });


$$("btnUserManagement").selectedObject.html(appConfig.title);
                $$("btnGroupManagement").selectedObject.html(appConfig.title);
$$("btnPermissionManagement").selectedObject.html(appConfig.title);
                $$("btnObjectConfiguration").selectedObject.html(appConfig.title);
                $$("btnUserObjectPermission").selectedObject.html(appConfig.title);

        }

}
    });
}

