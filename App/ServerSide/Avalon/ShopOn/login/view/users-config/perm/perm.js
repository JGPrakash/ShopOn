$.fn.permPage = function () {
    return $.pageController.getPage(this, function (page, $$) {

        page.userService = new UserService();



        page.events.page_load = function () {

            page.userService.getPermissionDetails(function (data) {
                var newBoardData = [];
                $(data).each(function (i, dataItem) {
                    newBoardData.push({
                        value:dataItem.perm_id,
                        text:dataItem.perm_name
                    });
                });

                $$("ucSimpleEntityManage").load({
                    keyColumn: "perm_id",
                    service: {
                        getAllData: function (callback) {
                            page.userService.getPermissionDetails(callback);
                            //callback([
                            //    { class_id: "1", class_name: "LKG", section_id: "1", section_name: "State  Board" }
                            //]);
                        },
                        insertData: function (currentData, callback) {
                            var perm_id;
                            page.userService.getMaxPermissionDetails(function (maxNo) {
                                perm_id=maxNo[0].perm_id;
                                page.userService.insertPermissionDetails(currentData,perm_id, callback);
                                location.reload();

                            });

                        },
                        updateData: function (currentData, callback) {
                            page.userService.updatePermissionDetails(currentData, callback);
                        },
                        deleteData: function (keyColumn, callback) {
                            page.userService.deletePermissionDetails(keyColumn, callback);
                        }

                    },
                    columns: [
                        { 'name': "Permission Id", 'width': "300px", 'dataField': "perm_id", templateStyle: "label", lookUpValues: [] },

                       // { 'name': "Group Name", 'width': "300px", 'dataField': "group_name", templateStyle: "Select", valueDataField: "group_id", lookUpValues: newBoardData }
                        { 'name': "Permission Name", 'width': "200px", 'dataField': "perm_name", templateStyle: "TextBox", lookUpValues: [] },

                    ],


                });
            });




        }


    });
}

