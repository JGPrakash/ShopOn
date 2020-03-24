$.fn.objPage = function () {
    return $.pageController.getPage(this, function (page, $$) {

        page.userService = new UserService();



        page.events.page_load = function () {

            page.userService.getObjectDetails(function (data) {
                var newBoardData = [];
                $(data).each(function (i, dataItem) {
                    newBoardData.push({
                        value:dataItem.id,
                        text:dataItem.obj_id
                    });
                });

                $$("ucSimpleEntityManage").load({
                    keyColumn: "id",
                    service: {
                        getAllData: function (callback) {
                            page.userService.getObjectDetails(callback);
                            //callback([
                            //    { class_id: "1", class_name: "LKG", section_id: "1", section_name: "State  Board" }
                            //]);
                        },
                        insertData: function (currentData, callback) {
                            var id;
                            page.userService.getMaxObjectDetails(function (maxNo) {
                                id=maxNo[0].id;
                                page.userService.insertObjectDetails(currentData,id, callback);
                                location.reload();

                            });

                        },
                        updateData: function (currentData, callback) {
                            page.userService.updateObjectDetails(currentData, callback);
                        },
                        deleteData: function (keyColumn, callback) {
                            page.userService.deleteObjectDetails(keyColumn, callback);
                        }

                    },
                    columns: [
                        { 'name': "Id", 'width': "100px", 'dataField': "id", templateStyle: "label", lookUpValues: [] },

                       // { 'name': "Group Name", 'width': "300px", 'dataField': "group_name", templateStyle: "Select", valueDataField: "group_id", lookUpValues: newBoardData }
                        { 'name': "Object Type", 'width': "200px", 'dataField': "obj_type", templateStyle: "TextBox", lookUpValues: [] },

                        { 'name': "Object Id", 'width': "200px", 'dataField': "obj_id", templateStyle: "TextBox", lookUpValues: [] },

                        { 'name': "Att Name1", 'width': "400px", 'dataField': "attr_1", templateStyle: "TextBox", lookUpValues: [] },
                        { 'name': "Att Name2", 'width': "100px", 'dataField': "attr_2", templateStyle: "TextBox", lookUpValues: [] },
                        { 'name': "Att Name3", 'width': "100px", 'dataField': "attr_3", templateStyle: "TextBox", lookUpValues: [] },


                    ],


                });
            });




        }


    });
}

