/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.UserMemberPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.userAPI = new UserAPI();
        page.groupAPI = new GroupAPI();
        page.UserGroupAPI = new UserGroupAPI();
        page.companyproductAPI = new CompanyProductAPI();
        page.userPermissionAPI = new UserPermissionAPI();
        page.objectPermissionAPI = new ObjectPermissionAPI();
        page.user_id = null;
        $("body").keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
            //your keyCode contains the key code, F1 to F2 
            //is among 112 and 123. Just it.
            //console.log(keyCode);
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNew_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnDelete_click();
            }
        });
        document.title = "ShopOn - User Management";
        page.events.btnNew_click = function () {
            $(".detail-basic").show();
            var data = '';
            page.user_id = null;
            $$("txtUserName").val('');
            $$("txtPhoneNo").val('');
            $$("txtEmail").val('');
            $$("txtEmail").disable(false);
            $$("txtPhoneNo").disable(false);
            $$("txtPassword").val('');
            $$("txtPassword").val('');
            $$("grdUserMember").dataBind([]);
            $$("chkActive").prop("checked", true);
            $$("btnSave").show();
            $$("btnDelete").hide();
            $(".userclass-panel").hide();
            $$("txtUserName").focus();
        };
        page.events.page_load = function () {
            $(".detail-basic").hide();
            $(".userclass-panel").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("chkActive").prop("checked", false);
            $$("txtSearchInput").val('');
            $$("txtUserName").val('');
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("510px");
            $$("grdSearchResult").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "ID", 'width': "11%", 'dataField': "user_id" },
                    { 'name': "User Name", 'width': "35%", 'dataField': "user_name" },
                    { 'name': "Phone No", 'width': "34%", 'dataField': "phone_no" }
                ]
            });
            var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
            }
            page.userAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                $(".detail-basic").show();
                $(".userclass-panel").show();
                page.user_id = item.user_id;
                page.selectedRowId = row.attr("row_id");
                $$("txtUserName").value(item.user_name);
                var pwd = item.password;
                (pwd == "" || pwd == null) ? $$("txtPassword").value('') : $$("txtPassword").value(nvl(pwd));
                var email = item.email_id;
                (email == "" || email == null) ? $$("txtEmail").value('') : $$("txtEmail").value(nvl(email));
                if (email != "") {
                    $$("txtEmail").disable(true);
                }
                else {
                    $$("txtEmail").disable(false);
                }
                var mobile1 = item.phone_no;
                (mobile1 == "" || mobile1 == null) ? $$("txtPhoneNo").value('') : $$("txtPhoneNo").value(mobile1);
                if (mobile1 != "") {
                    $$("txtPhoneNo").disable(true);
                }
                else {
                    $$("txtPhoneNo").disable(false);
                }
                if (item.active == 1) {
                    $$("chkActive").prop("checked", true);
                }
                if (item.active == 0 || item.active == "" || item.active == null) {
                    $$("chkActive").prop("checked", false);
                }
                $$("txtFullName").value(item.full_name);
                $$("txtOTP").value(item.otp);
                $$("txtAddressLine1").value(item.address_line_1);
                $$("txtAddressLine2").value(item.address_line_2);
                $$("txtAddressLine3").value(item.address_line_3);
                $$("txtCity").value(item.city);
                $$("txtState").value(item.state);
                $$("txtCountry").value(item.country);
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "and usr_grp.user_id=" + page.user_id,
                    sort_expression: ""
                }
                page.UserGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdUserMember").dataBind(data);
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    //filter_expression: " ugt.user_id=" + page.user_id,
                    filter_expression: " opt.user_id=" + page.user_id,
                    sort_expression: ""
                }
                page.objectPermissionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdUserMemberPermission").dataBind(data);
                });
                $(".detail-basic").show();
                $$("btnSave").show();
                $$("btnDelete").show();
            };
            $$("grdSearchResult").dataBind([]);
            $$("grdUserMember").width("100%");
            $$("grdUserMember").height("255px");
            $$("grdUserMember").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Product Type", 'width': "120px", 'dataField': "prod_name" },
                    { 'name': "Product Name", 'width': "120px", 'dataField': "comp_prod_name" },
                    { 'name': "Group Name", 'width': "120px", 'dataField': "group_name" },
                ]
            });
            $$("grdUserMember").dataBind([]);
            $$("grdUserMember").selectionChanged = function (row, item) {
                page.user_group_id = item.user_group_id;
                $$("ddlProductName").selectedValue(item.comp_prod_id);
            };
            $$("grdUserMemberPermission").width("100%");
            $$("grdUserMemberPermission").height("255px");
            $$("grdUserMemberPermission").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Product Type", 'width': "120px", 'dataField': "prod_name" },
                    { 'name': "Product Name", 'width': "120px", 'dataField': "comp_prod_name" },
                    //{ 'name': "Group Name", 'width': "120px", 'dataField': "group_name" },
                    { 'name': "Object Type", 'width': "120px", 'dataField': "obj_type" },
                    { 'name': "Object ID", 'width': "120px", 'dataField': "obj_id" },
                    { 'name': "", 'width': "0px", 'dataField': "obj_perm_id", visible: false },
                ]
            });
            $$("grdUserMemberPermission").dataBind([]);
            $$("grdUserMemberPermission").selectionChanged = function (row, item) {
                page.user_group_id = item.user_group_id;
                page.obj_perm_id = item.obj_perm_id;
                $$("ddlProductName").selectedValue(item.comp_prod_id);
            };
            var data = {
                start_record: 0,
                end_record: "",
                //filter_expression: "prod_id IN " + CONTEXT.MANUAL_PRODUCT,//(6,7,8,9,10,26,27,28,29,30,31)
                filter_expression: "prod_id IN (6,7,8,9,10,26,27,28,29,30,31)",
                sort_expression: ""
            }
            page.companyproductAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("ddlProductName").dataBind(data, "comp_prod_id", "comp_prod_name", "Select");
                $$("ddlProductNamePermission").dataBind(data, "comp_prod_id", "comp_prod_name", "Select");
            });
            //var data = {
            //    start_record: 0,
            //    end_record: "",
            //    filter_expression: "",
            //    sort_expression: ""
            //}
            //page.objectPermissionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            var data = [
                {
                    "obj_type":"Product"
                },
                {
                    "obj_type": "Product::Menu"
                },
                {
                    "obj_type": "Product::Previlege"
                },
                {
                    "obj_type": "Product::Store"
                },
                {
                    "obj_type": "Product::CompProd::Store"
                },
            ]
            $$("ddlObjectType").dataBind(data, "obj_type", "obj_type", "Select");
            //});
            var datafor = [
            {
                "name": "Group",
                "id": "Group"
            },
            {
                "name": "User",
                "id": "User"
            }
            ]
            $$("ddlObjectFor").dataBind(datafor, "id", "name", "Select");
            $$("ddlObjectFor").selectionChange(function () {
                if ($$("ddlObjectFor").selectedValue() == "User") {
                    $$("pnlUserGroup").hide();
                }
                else if ($$("ddlObjectFor").selectedValue() == "Group") {
                    $$("pnlUserGroup").show();
                }
                else {
                    $$("pnlUserGroup").hide();
                }
            });
            $$("ddlProductName").selectionChange(function () {
                if ($$("ddlProductName").selectedData() != null) {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        //filter_expression: "comp_prod_id=" + $$("ddlProductName").selectedValue(),
                        filter_expression: "gt.prod_id=" + $$("ddlProductName").selectedData().prod_id,
                        sort_expression: "",
                    }
                    page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlGroup").dataBind(data, "group_id", "group_name", "Select");
                    });
                }
                else {
                    $$("ddlGroup").dataBind([]);
                }
            })
            $$("ddlObjectType").selectionChange(function () {
                if ($$("ddlObjectType").selectedValue() == "Product") {
                    page.userproductid = $$("ddlProductNamePermission").selectedData().prod_id;
                    page.usercompproductid = $$("ddlProductNamePermission").selectedData().comp_prod_id;
                    $$("pnlUserGroup").hide();
                }
                else if ($$("ddlObjectType").selectedValue() == "Product::Menu") {
                    page.userproductid = $$("ddlProductNamePermission").selectedData().prod_id;
                    page.usercompproductid = $$("ddlProductNamePermission").selectedData().comp_prod_id;
                    $$("pnlUserGroup").hide();
                }
                else if ($$("ddlObjectType").selectedValue() == "Product::CompProd::Store") {
                    page.userproductid = $$("ddlProductNamePermission").selectedData().prod_id;
                    page.usercompproductid = $$("ddlProductNamePermission").selectedData().comp_prod_id;
                    $$("pnlUserGroup").hide();
                }
                else if ($$("ddlObjectType").selectedValue() == "Product::Previlege") {
                    page.userproductid = $$("ddlProductNamePermission").selectedData().prod_id;
                    page.usercompproductid = $$("ddlProductNamePermission").selectedData().comp_prod_id;
                    $$("pnlUserGroup").hide();
                } else {
                    $$("pnlUserGroup").hide();
                }
            });
            $$("ddlProductNamePermission").selectionChange(function () {
                if ($$("ddlProductNamePermission").selectedData() != null) {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        //filter_expression: "comp_prod_id=" + $$("ddlProductNamePermission").selectedValue(),
                        filter_expression: "gt.prod_id=" + $$("ddlProductNamePermission").selectedData().prod_id,
                        sort_expression: "",
                    }
                    page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlGroupPermission").dataBind(data, "group_id", "group_name", "Select");
                    });
                }
                else {
                    $$("ddlGroupPermission").dataBind([]);
                }
            })
        };
        page.events.btnSave_click = function () {
            var user = {
                user_name: $$("txtUserName").value(),
                password: $$("txtPassword").value(),
                phone_no: ($$("txtPhoneNo").value() == "") ? "" : $$("txtPhoneNo").value(),
                email_id: $$("txtEmail").value(),
                full_name: $$("txtFullName").value(),
                otp: $$("txtOTP").value(),
                address_line_1: $$("txtAddressLine1").value(),
                address_line_2: $$("txtAddressLine2").value(),
                address_line_3: $$("txtAddressLine3").value(),
                city: $$("txtCity").value(),
                state: $$("txtState").value(),
                country: $$("txtCountry").value(),
                comp_id: localStorage.getItem("comp_id"),
                default_branch: "105"
            };
            if (user.user_name == "") {
                $$("msgPanel").show("User name is mandatory...!");
                $$("txtUserName").focus();
            }
            else if (user.phone_no == "") {
                $$("msgPanel").show("Phone no is mandatory...!");
                $$("txtPhoneNo").focus();
            }
            else if (user.email_id == "") {
                $$("msgPanel").show("Email is mandatory...!");
                $$("txtEmail").focus();
            }
            else if (user.user_name != "" && isInt(user.user_name)) {
                $$("msgPanel").show("User name should only contains characters ...!");
                $$("txtUserName").focus();
            }
            else if (user.phone_no != "" && !isInt(user.phone_no)) {
                $$("msgPanel").show("Phone no should only contain numbers ...!");
                $$("txtPhoneNo").focus();
            }


            else if (user.phone_no != "" && (user.phone_no).length < 10) {
                $$("msgPanel").show("Phone no should be 10 in length...!");
                $$("txtPhoneNo").focus();
            }
            else if (user.email_id != "" && !ValidateEmail(user.email_id)) {
                $$("msgPanel").show("Email address is not valid...!");
                $$("txtEmail").focus();
            }
            else {
                if (page.user_id == null || page.user_id == '') {
                    var active;
                    if ($$("chkActive").prop("checked")) {
                        user.active = 1;
                    } else {
                        user.active = 0;
                    }
                    $$("msgPanel").show("Inserting new user...");
                    //insert data
                    page.userAPI.insertUser(user, function (data) {
                        page.user_id = data[0].user_id;
                        $$("msgPanel").show("User saved successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: " user_id=" + page.user_id,
                            sort_expression: ""
                        }
                        page.userAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                } else {
                    
                    $$("msgPanel").show("Updating user...");
                    user.user_id = page.user_id;
                    var active;
                    if ($$("chkActive").prop("checked")) {
                        user.active = 1;
                    } else {
                        user.active = 0;
                    }
                    page.userAPI.putValue(page.user_id,user, function (data) {
                        $$("msgPanel").show("User updated successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: " user_id=" + page.user_id,
                            sort_expression: ""
                        }
                        page.userAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            //$$("grdSearchResult").dataBind(data);
                            //$$("grdSearchResult").getAllRows()[0].click();
                        });
                    });
                }
            }
            $$("btnDelete").show();
        };
        page.events.btnDelete_click = function () {
            $$("msgPanel").show("Removing user...");
            var user = {
                user_id: page.user_id
            }
            page.userAPI.deleteValue(page.user_id, user, function (data) {
                $$("msgPanel").show("User removed successfully...!");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.userAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdSearchResult").dataBind(data);
                    $$("msgPanel").hide();
                });
                $(".detail-basic").hide();
                $(".userclass-panel").hide();
                $$("btnSave").hide();
                $$("btnDelete").hide();
            });
        };
        page.events.btnSearch_click = function () {
            $(".detail-basic").hide();
            $(".userclass-panel").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(user_id,user_name,phone_no) like '%" + $$("txtSearchInput").value()+"%'",
                    sort_expression: ""
                }
                page.userAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdSearchResult").dataBind(data);
                    $$("msgPanel").hide();
                });
        };
        page.events.btnAdd_click = function () {
            page.controls.pnlAddUserMember.open();
            page.controls.pnlAddUserMember.title("User Member");
            page.controls.pnlAddUserMember.width("30vw");
            page.controls.pnlAddUserMember.height(300);
            page.user_group_id = null;
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "and usr_grp.user_id=" + page.user_id,
                sort_expression: ""
            }
            page.UserGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdUserMember").dataBind(data);
            });
            $$("ddlProductName").selectedValue(-1);
            $$("ddlGroup").selectedValue(-1);
        };
        page.events.btnAddPermission_click = function () {
            page.controls.pnlAddUserMemberPermission.open();
            page.controls.pnlAddUserMemberPermission.title("User Member Permission");
            page.controls.pnlAddUserMemberPermission.width("30vw");
            page.controls.pnlAddUserMemberPermission.height(300);
            page.obj_perm_id == null;
            var data = {
                start_record: 0,
                end_record: "",
                //filter_expression: " ugt.user_id=" + page.user_id,
                filter_expression: " opt.user_id=" + page.user_id,
                sort_expression: ""
            }
            page.objectPermissionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdUserMemberPermission").dataBind(data);
            });
            $$("ddlProductNamePermission").selectedValue(-1);
            $$("ddlGroupPermission").selectedValue(-1);
            $$("ddlObjectType").selectedValue(-1);
            $$("ddlObjectFor").selectedValue(-1);
            $$("txtObjectID").value("");
            $$("pnlUserGroup").hide();
        };
        page.events.btnUpdate_click = function () {
            try {
                if (page.user_group_id == null || page.user_group_id == "" || page.user_group_id == undefined)
                    throw "Please select the User Group";
                page.controls.pnlAddUserMember.open();
                page.controls.pnlAddUserMember.title("User Group");
                page.controls.pnlAddUserMember.width("50%");
                page.controls.pnlAddUserMember.height(300);
            } catch (e) {
                alert(e);
            }
        };
        page.events.btnSaveUserMember_click = function () {
            var member = {
                perm_id: "1",
                obj_type: $$("ddlObjectType").selectedValue(),
                //obj_id: $$("txtObjectID").value(),
            };
            if ($$("grdSearchResult").selectedData()[0] == "" || $$("grdSearchResult").selectedData()[0] == null || $$("grdSearchResult").selectedData()[0] == undefined) {
                alert("Please select the user first");
                $$("grdSearchResult").focus();
            }
            else if (member.obj_type == "" || member.obj_type == null || member.obj_type == undefined || member.obj_type == "-1") {
                alert("Please select the product name");
                $$("ddlProductNamePermission").selectedObject.focus();
            }
            else if ($$("ddlObjectFor").selectedValue() == "Group" && ($$("ddlGroupPermission").selectedValue() == "-1" || $$("ddlGroupPermission").selectedValue() == null || $$("ddlGroupPermission").selectedValue() == "" || $$("ddlGroupPermission").selectedValue() == undefined)) {
                alert("Please select the group name");
                $$("ddlGroupPermission").selectedObject.focus();
            }
            else if ($$("txtObjectID").value() == "" || $$("txtObjectID").value() == null || $$("txtObjectID").value() == undefined) {
                alert("Please enter the Object ID");
                $$("txtObjectID").focus();
            }
            else {
                if ($$("ddlObjectFor").selectedValue() == "User") {
                    member.user_id = page.user_id;
                }
                if ($$("ddlObjectFor").selectedValue() == "Group") {
                    member.group_id = $$("ddlGroupPermission").selectedValue();
                    //member.user_id = page.user_id;
                }
                if ($$("ddlObjectType").selectedValue() == "Product") {
                    member.obj_id = page.userproductid;
                }
                if ($$("ddlObjectType").selectedValue() == "Product::CompProd::Store") {
                    member.obj_id = page.userproductid + "::" + page.usercompproductid + "::" + $$("txtObjectID").value();
                }
                if ($$("ddlObjectType").selectedValue() == "Product::Menu") {
                    member.obj_id = page.userproductid + "::" + $$("txtObjectID").value();
                }
                if ($$("ddlObjectType").selectedValue() == "Product::Previlege") {
                    member.obj_id = page.userproductid + "::" + $$("txtObjectID").value();
                }
                if (page.obj_perm_id == null || page.obj_perm_id == '' || page.obj_perm_id == undefined) {
                    $$("msgPanel").show("Inserting group details for user...");
                    page.objectPermissionAPI.postValue(member, function (data) {
                        $$("msgPanel").show("User group inserted successfully...!");
                        page.user_group_id = data[0].user_group_id;
                        var data = {
                            start_record: 0,
                            end_record: "",
                            //filter_expression: " ugt.user_id=" + page.user_id,
                            filter_expression: " opt.user_id=" + page.user_id,
                            sort_expression: ""
                        }
                        page.objectPermissionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdUserMemberPermission").dataBind([]);
                            $$("grdUserMemberPermission").dataBind(data);
                            $$("msgPanel").hide();
                            page.user_group_id = null;
                        });
                    });
                    $$("ddlProductName").selectedValue('');
                    $$("ddlGroup").selectedValue('');
                } else {
                    member.obj_perm_id = page.obj_perm_id;
                    $$("msgPanel").show("Updating group details for user...");
                    page.objectPermissionAPI.putValue(page.obj_perm_id, member, function (data) {
                        $$("msgPanel").show("User group updated successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            //filter_expression: " ugt.user_id=" + page.user_id,
                            filter_expression: " opt.user_id=" + page.user_id,
                            sort_expression: ""
                        }
                        page.objectPermissionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdUserMemberPermission").dataBind(data);
                            $$("msgPanel").hide();
                            page.user_group_id = null;
                        });
                    });
                    $$("ddlProductName").selectedValue('');
                    $$("ddlGroup").selectedValue('');
                }
                page.controls.pnlAddUserMemberPermission.close();
            }
        }
        page.events.btnSaveMember_click = function () {
            var member = {
                user_id: page.user_id,
                comp_prod_id: $$("ddlProductName").selectedValue(),
                group_id: $$("ddlGroup").selectedValue(),

            };
            if (member.user_id == "" || member.user_id == null || member.user_id == undefined) {
                alert("Please select the user first");
                $$("grdSearchResult").focus();
            }
            if (member.comp_prod_id == "" || member.comp_prod_id == null || member.comp_prod_id == undefined || member.comp_prod_id == "-1") {
                alert("Please select the product name");
                $$("ddlProductName").selectedObject.focus();
            }
            if (member.group_id == "" || member.group_id == null || member.group_id == undefined || member.group_id == "-1") {
                alert("Please select the group name");
                $$("ddlGroup").selectedObject.focus();
            }
            else {
                if (page.user_group_id == null || page.user_group_id == '' || page.user_group_id == undefined) {
                    
                    $$("msgPanel").show("Inserting group details for user...");
                    page.UserGroupAPI.postValue(member, function (data) {
                        $$("msgPanel").show("User group inserted successfully...!");
                        page.user_group_id = data[0].user_group_id;
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "and usr_grp.user_id=" + page.user_id,
                            sort_expression: ""
                        }
                        page.UserGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdUserMember").dataBind([]);
                            $$("grdUserMember").dataBind(data);
                            $$("msgPanel").hide();
                            page.user_group_id = null;
                            $$("ddlProductNamePermission").selectedValue(-1);
                            $$("ddlGroupPermission").selectedValue(-1);
                            $$("ddlObjectType").selectedValue(-1);
                            $$("ddlObjectFor").selectedValue(-1);
                            $$("txtObjectID").value("");
                            $$("pnlUserGroup").hide();
                        });
                    });
                }
                else {
                    var umember = {
                        user_id: page.user_id,
                        user_id: page.user_id,
                        comp_prod_id: $$("ddlProductName").selectedValue(),
                        group_id: $$("ddlGroup").selectedValue(),
                    };
                    umember.user_group_id = page.user_group_id;
                    $$("msgPanel").show("Updating group details for user...");
                    page.UserGroupAPI.putValue(page.user_group_id, umember, function (data) {
                        $$("msgPanel").show("User group updated successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "and usr_grp.user_id=" + page.user_id,
                            sort_expression: ""
                        }
                        page.UserGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdUserMember").dataBind(data);
                            $$("msgPanel").hide();
                            page.user_group_id = null;
                        });
                    });
                    $$("ddlProductName").selectedValue('');
                    $$("ddlGroup").selectedValue('');
                }
            }
            page.controls.pnlAddUserMember.close();
        };
        page.events.btnDeletePermission_click = function () {
            var umember = {
                obj_perm_id: page.obj_perm_id
            };
            try {
                $$("msgPanel").show("Removing user member...");
                if (page.obj_perm_id == null || page.obj_perm_id == "" || page.obj_perm_id == undefined)
                    throw "Please select the tax";
                page.objectPermissionAPI.deleteValue(page.obj_perm_id, umember, function () {
                    $$("msgPanel").show("User Permission removed successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: " opt.user_id=" + page.user_id,
                        sort_expression: ""
                    }
                    page.objectPermissionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("grdUserMemberPermission").dataBind([]);
                        $$("grdUserMemberPermission").dataBind(data);
                        page.obj_perm_id = null;
                        $$("msgPanel").hide();
                        $$("ddlProductNamePermission").selectedValue(-1);
                        $$("ddlGroupPermission").selectedValue(-1);
                        $$("ddlObjectType").selectedValue(-1);
                        $$("ddlObjectFor").selectedValue(-1);
                        $$("txtObjectID").value("");
                        $$("pnlUserGroup").hide();
                    });
                });
            } catch (e) {
                $$("msgPanel").show(e);
            }
        };
        page.events.btnDelete1_click = function () {
            var umember = {
                user_group_id: page.user_group_id
            };
            try {
                $$("msgPanel").show("Removing user member...");
                if (page.user_group_id == null || page.user_group_id == "" || page.user_group_id == undefined)
                    throw "Please select the tax";
                page.UserGroupAPI.deleteValue(page.user_group_id, umember, function () {
                    $$("msgPanel").show("User group removed successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "and usr_grp.user_id=" + page.user_id,
                        sort_expression: ""
                    }
                    page.UserGroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("grdUserMember").dataBind([]);
                        $$("grdUserMember").dataBind(data);
                        page.user_group_id = null;
                        $$("msgPanel").hide();
                        $$("ddlProductName").selectedValue('');
                        $$("ddlGroup").selectedValue('');
                    });
                });
            } catch (e) {
                $$("msgPanel").show(e);
            }
        };

    });
};