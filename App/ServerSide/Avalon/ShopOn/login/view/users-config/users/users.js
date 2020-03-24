$.fn.userManagePage = function () {
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
                    keyColumn: "user_id",
                    service: {
                        getAllData: function (callback) {
                            page.userService.getAllUserDetails(callback);
                            //callback([
                            //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                            //]);
                        },
                        insertData: function (currentData, callback) {
                            var section_id;
                            page.userService.getMaxUserDetails(function (maxNo) {
                                user_id=maxNo[0].user_id;
                                page.userService.insertUserDetails(currentData,user_id, callback);
                                location.reload();

                            });

                        },
                        updateData: function (currentData, callback) {
                            page.userService.updateUserDetails(currentData, callback);
                        },
                        deleteData: function (keyColumn, callback) {
                            page.userService.deleteUserDetails(keyColumn, callback);
                        }

                    },
                    columns: [
                        { 'name': "User Id", 'width': "100px", 'dataField': "user_id", templateStyle: "label", lookUpValues: [] },

                        { 'name': "User Name", 'width': "200px", 'dataField': "user_name", templateStyle: "TextBox", lookUpValues: [] },
                        { 'name': "Password", 'width': "200px", 'dataField': "password", templateStyle: "TextBox", lookUpValues: [] },
                        { 'name': "Full Name", 'width': "200px", 'dataField': "full_name", templateStyle: "TextBox", lookUpValues: [] }

                    ],


                });
            });



           
        }
        
        
    });
}

