$.fn.groupPage = function () {
    return $.pageController.getPage(this, function (page, $$) {
          page.userService = new UserService();



        page.events.page_load = function () {

            page.userService.getGroupDetails(function (data) {
                var newBoardData = [];
                $(data).each(function (i, dataItem) {
                    newBoardData.push({
                        value:dataItem.group_id,
                        text:dataItem.group_name
                    });
                });

                $$("ucSimpleEntityManage").load({
                    keyColumn: "group_id",
                    service: {
                        getAllData: function (callback) {
                            page.userService.getGroupDetails(callback);
                            //callback([
                            //    { class_id: "1", class_name: "LKG", section_id: "1", section_name: "State  Board" }
                            //]);
                        },
                        insertData: function (currentData, callback) {
                            var group_id;
                            page.userService.getMaxGroupDetails(function (maxNo) {
                                group_id=maxNo[0].group_id;
                                page.userService.insertGroupDetails(currentData,group_id, callback);
                                location.reload();

                            });

                        },
                        updateData: function (currentData, callback) {
                            page.userService.updateGroupDetails(currentData, callback);
                        },
                        deleteData: function (keyColumn, callback) {
                            page.userService.deleteGroupDetails(keyColumn, callback);
                        }

                    },
                    columns: [
                        { 'name': "Group Id", 'width': "300px", 'dataField': "group_id", templateStyle: "label", lookUpValues: [] },

                       // { 'name': "Group Name", 'width': "300px", 'dataField': "group_name", templateStyle: "Select", valueDataField: "group_id", lookUpValues: newBoardData }
                        { 'name': "Group Name", 'width': "200px", 'dataField': "group_name", templateStyle: "TextBox", lookUpValues: [] },

                    ],


                });
            });




        }


    });
}

