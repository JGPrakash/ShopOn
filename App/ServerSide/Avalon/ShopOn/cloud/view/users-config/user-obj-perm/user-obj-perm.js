$.fn.userObjPermPage = function () {
    return $.pageController.getPage(this, function (page, $$) {

        page.userService = new UserService();



        page.events.page_load = function () {

            page.userService.getPermissionDetails(function (data) {
                var newBoardData = [];
                var newUserData = [];

                $(data).each(function (i, dataItem) {
                    newBoardData.push({
                        value:dataItem.perm_id,
                        text:dataItem.perm_name
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
                    keyColumn: "obj_perm_id",
                    service: {
                        getAllData: function (callback) {
                            page.userService.getObjectPermDetails(callback);
                            //callback([
                            //    { class_id: "1", class_name: "LKG", section_id: "1", section_name: "State  Board" }
                            //]);
                        },
                        insertData: function (currentData, callback) {
                            var id;
                            page.userService.getMaxObjectPermDetails(function (maxNo) {
                                obj_perm_id=maxNo[0].obj_perm_id;
                                page.userService.insertObjectPermissionDetails(currentData,obj_perm_id, callback);
                                location.reload();

                            });

                        },
                        updateData: function (currentData, callback) {
                            page.userService.updateObjectPermissionDetails(currentData, callback);
                        },
                        deleteData: function (keyColumn, callback) {
                            page.userService.deleteObjectPermissionDetails(keyColumn, callback);
                        }

                    },
                    columns: [
                        { 'name': "Obj Perm Id", 'width': "100px", 'dataField': "obj_perm_id", templateStyle: "label", lookUpValues: [] },

                       // { 'name': "Group Name", 'width': "300px", 'dataField': "group_name", templateStyle: "Select", valueDataField: "group_id", lookUpValues: newBoardData }
                        { 'name': "Permission Name", 'width': "100px", 'dataField': "perm_name", templateStyle: "Select", valueDataField: "perm_id", lookUpValues: newBoardData },
                        { 'name': "Object Type", 'width': "200px", 'dataField': "obj_type", templateStyle: "TextBox", lookUpValues: [] },

                        { 'name': "Object Id", 'width': "200px", 'dataField': "obj_id", templateStyle: "TextBox", lookUpValues: [] },

                        { 'name': "User Type", 'width': "200px", 'dataField': "user_type", templateStyle: "TextBox", lookUpValues: [] },

                        { 'name': "User Name", 'width': "100px", 'dataField': "user_name", templateStyle: "Select", valueDataField: "user_id", lookUpValues: newUserData }


                    ],


                });
            });


            });

        }


    });
}

