$.fn.customerGroup = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.memberPromotion = new MemberPromotionService();
        page.customerGroupService = new CustomerGroupService();
        page.groupAPI = new GroupAPI();
        page.customergroupAPI = new CustomerGroupAPI();
        page.customerAPI = new CustomerAPI();
        page.chk_mem = 0;
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
                page.events.btnNewGroup_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSaveGroup_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnRemoveGroup_click();
            }

        });
        document.title = "ShopOn - Customer Group";
        page.events = {
            grdGroupResult_select: function (row, item) {
                $(".detail-info").show();
                $$("btnSaveGroup").show();
                $$("btnRemoveGroup").show();
                $$("btnAdd").show();
                //$$("btnRemove").show();
                $$("grdGroupTrans").show();
                page.selecetedGroup = item;
                $$("lblGroupNo").value(item.group_id);
                $$("txtGroupName").val(item.group_name);
                $$("txtGroupName").focus();
                $$("aclMem").selectedObject.val('');
                //$$("msgPanel").show("Details of the customer group...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "grp.group_id=" + item.group_id,
                    sort_expression: ""
                }
                page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.customerGroupService.getGroupsCustByAll(item.group_id, function (item) {
                    page.controls.grdGroupTrans.dataBind(item);
                    page.customer = item;
                });

            },
            
            grdGroupTrans_select: function (row, item) {
                //$$("aclMemb").selectedObject.val(item.cust_name);
                page.cgroup_id=item.group_id;
                page.group_cust_id = item.group_cust_id;
                page.cust_no = item.cust_no;
                //$$("msgPanel").show("Details of the customer...");
                //$$("aclMem").selectedObject.val(item.cust_name);
            },
            
            page_load: function () {
                $$("txtGroupSearch").focus();
                $(".detail-info").hide();
                $$("btnSaveGroup").hide();
                $$("btnRemoveGroup").hide();
                $$("btnRemove").hide();
                //page.events.btnNewGroup_click();
                page.controls.grdGroupResult.width("100%");
                page.controls.grdGroupResult.height("480px");
                page.controls.grdGroupResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Group Id", 'width': "100px", 'dataField': "group_id" },
                        { 'name': "Group Name", 'width': "150px", 'dataField': "group_name" },

                    ]
                });
                page.controls.grdGroupResult.selectionChanged = page.events.grdGroupResult_select;
                page.controls.grdGroupResult.dataBind([]);
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.customerGroupService.getGroups(function (item) {
                    page.controls.grdGroupResult.dataBind(item);

                });
                page.controls.grdGroupTrans.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    //To Handle removing an item from list.
                    if (action == "delete") {
                        //page.controls.grdGroupTrans.deleteRow(rowId);
                        var chrMem = $$("grdGroupTrans").selectedData()[0];
                        var data = {
                            group_cust_id: page.group_cust_id,
                            //cust_no: chrMem.cust_no,
                            //group_id: chrMem.group_id
                        }
                        if (chrMem == undefined) {
                            //alert("please select the member");
                            //$(".detail-info").progressBar("show");
                            $$("msgPanel").show("Please select the customer...!");
                        } else {
                            //Update Query
                            $$("msgPanel").show("Removing customer...");
                            page.customergroupAPI.deleteValue(page.group_cust_id, data, function (data) {
                            //page.customerGroupService.deleteGrpCust(data, function (data1) {
                                //alert("Member Added Successfully");
                                //$(".detail-info").progressBar("show");
                                $$("msgPanel").show("Customer removed successfully...!");
                                //$$("pnlAddGroup").close();
                                //$$("pnlAddGroup").hide();
                                var data = {
                                    start_record: 0,
                                    end_record: "",
                                    filter_expression: "grp.group_id=" + $$("lblGroupNo").value(),
                                    sort_expression: ""
                                }
                                page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                                //page.customerGroupService.getGroupsCustByAll(page.selecetedGroup.group_id, function (data) {
                                    $$("grdGroupTrans").dataBind(item);
                                    $$("msgPanel").hide();
                                });
                            });
                        }
                    }
                /*    if (action == "update") {
                        //page.controls.grdGroupTrans.deleteRow(rowId);
                        $$("pnlAddM").open();
                        $$("pnlAddM").title("Update");
                        $$("pnlAddM").width(350);
                        $$("pnlAddM").height(200);

                    }*/
                }

                page.controls.grdGroupTrans.width("100%");
                page.controls.grdGroupTrans.height("440px");
                page.controls.grdGroupTrans.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Group Name", 'width': "150px", 'dataField': "group_name" },
                        { 'name': "Cust No", 'width': "80px", 'dataField': "cust_no",visible:false },
                        { 'name': "Email", 'width': "180px", 'dataField': "email" },
                        { 'name': "Mobile No", 'width': "120px", 'dataField': "phone_no" },
                        { 'name': "Customer Name", 'width': "250px", 'dataField': "cust_name" },
                        {
                            'name': "Action",
                            'width': "50px",
                            'dataField': "cust_no",
                            itemTemplate: "<input type='button'  class='grid-button' value='' action='delete' style='background-image: url(./delete.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>"
                            //itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        },
                    /*    {
                            'name': "Action",
                            'width': "40px",
                            'dataField': "cust_no",
                            itemTemplate: "<input action='update' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='update' value='Update' /> "
                        }*/
                    ]
                });
                //});
                page.controls.grdGroupTrans.selectionChanged = page.events.grdGroupTrans_select;
                page.controls.grdGroupTrans.dataBind([]);

                
            //   page.controls.grdEmailDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
             //       if (action == "delete") {
             //           page.controls.grdEmailDetails.deleteRow(rowId);

                        //Recalculate after deleting a item
                        //page.calculate();

              //      }
           //   }
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.custList = item;

                });
                $$("aclMem").dataBind({
                    getData: function (term, callback) {
                        callback(page.custList);
                        //page.customerGroupService.getCustomerByAll(term, callback);
                    }
                });
                page.controls.aclMem.select(function (item) {
                    if (item == null)
                        page.chk_mem = 1;
                    else
                        page.chk_mem = 0;
                });
                page.controls.aclMem.noRecordFound(function () {
                    page.chk_mem = 1;
                })
                page.controls.aclMem.allowCustomText(function (item) {
                    page.chk_mem = 1;
                    page.controls.txtState.selectedObject.val(item.val());

                });
          /*      $$("aclMemb").dataBind({
                    getData: function (term, callback) {
                        page.customerGroupService.getCustomerByAll(term, callback);
                    }
                });*/
            }

        };

        page.events.btnAddGroup_click = function () {
            $$("pnlAddGroup").open();
            $$("pnlAddGroup").title("Add Group");
            $$("pnlAddGroup").width(350);
            $$("pnlAddGroup").height(200);

        };
        page.events.btnAdd_click = function () {
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                page.custList = item;

            });
            $$("aclMem").dataBind({
                getData: function (term, callback) {
                    callback(page.custList);
                    //page.customerGroupService.getCustomerByAll(term, callback);
                }
            });
            $$("pnlAdd").open();
            $$("pnlAdd").title("Add");
            $$("pnlAdd").width(350);
            $$("pnlAdd").height(200);
            //$$("aclMem").focus();
        };
        page.events.btnNewGroup_click = function () {
            $$("lblGroupNo").value('');
            $$("txtGroupName").value('');
            $$("btnSaveGroup").show();
            $(".detail-info").show();
            $$("btnRemoveGroup").hide();
            $$("btnAdd").hide();
            $$("btnRemove").hide();
            $$("grdGroupTrans").hide();
            $$("txtGroupName").focus();
            //$$("btnNewGroup").hide();
        };
        page.events.btnSaveGroup_click = function () {
            var data = {
                group_id: $$("lblGroupNo").value(),
                group_name: $$("txtGroupName").value(),
                comp_id: localStorage.getItem("user_company_id"),
            }
            if (data.group_id == "") {
                //Insert Query
                if (data.group_name == "" || data.group_name == null || data.group_name == "")
                {
                    //$(".detail-info").progressBar("show");
                    $$("msgPanel").show("Please enter group name...!");

                }
                else
                {
                    
                    var group = {
                        group_name: $$("txtGroupName").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                    }
                    $$("msgPanel").show("Inserting new group...");
                    page.groupAPI.postValue(group, function (data1) {
                    //page.customerGroupService.insertGroup(data.group_name, function (data1) {
                    // alert("Data Insert Successfully");
                    page.group_id = data1[0].key_value;
                    $$("msgPanel").show("Group saved successfully...!");
                    var data1 = {
                        group_id: data1[0].key_value
                    }
                    page.groupAPI.getValue(data1, function (data) {
                    //page.customerGroupService.getGroupsById(page.group_id, function (data) {
                        $$("grdGroupResult").dataBind(data);
                        $$("grdGroupResult").getAllRows()[0].click();
                        //alert("Saved successfully...");
                        //$(".detail-info").progressBar("show");
                        $$("msgPanel").hide();
                        $$("txtGroupName").focus();
                    });
                });
                }

            } else {
                //Update Query
                $$("msgPanel").show("Updating group...");
                page.groupAPI.putValue(page.group_id, data, function (data1) {
                //page.customerGroupService.updateGroup(data, function (data1) {
                    $$("msgPanel").show("Group updated successfully...!");
                    var data1 = {
                        group_id: data.group_id
                    }
                    page.groupAPI.getValue(data1, function (data) {
                    //page.customerGroupService.getGroupsById(data.group_id, function (data) {
                        $$("grdGroupResult").dataBind(data);
                        $$("grdGroupResult").getAllRows()[0].click();
                        $$("msgPanel").hide();
                    });
                });
            }
            $$("btnRemoveGroup").show();
            $$("btnNewGroup").show();
        };
        page.events.btnRemoveGroup_click = function () {
            var data = {
                group_id: $$("lblGroupNo").value(),
                group_name: $$("txtGroupName").value()
            }
            if (data.group_id == "") {
                $$("msgPanel").show("Please select the group...!");

            } else {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "grp.group_id=" + $$("lblGroupNo").value(),
                    sort_expression: ""
                }
                page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.customerGroupService.getGroupsCustByAll(data.group_id, function (item) {
                    if (item.length > 0)
                        $$("msgPanel").show("Group has customer remove customer first...!");
                    else {
                        $$("msgPanel").show("Removing group...");
                        var data = {
                            group_id: $$("lblGroupNo").value()
                        }
                        page.groupAPI.deleteValue(data.group_id, data, function (data) {
                        //page.customerGroupService.removeGroup(data, function (data) {
                            //alert("Data Deleted Successfully");
                            //$(".detail-info").progressBar("show");
                            $$("msgPanel").show("Group removed successfully...!");
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "concat(group_id, group_name)" + $$("txtGroupSearch").value(),
                                sort_expression: ""
                            }
                            page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            //page.customerGroupService.getGroups(function (item) {
                                page.controls.grdGroupResult.dataBind(item);
                                $$("msgPanel").hide();
                            });
                        });
                        //$(".detail-info").progressBar("hide");
                        //page.events.btnSearch_click();
                        $(".detail-info").hide();
                        $$("btnSaveGroup").hide();
                        $$("btnRemoveGroup").hide();
                    }
                });
            }
        };
      /*  page.events.btnUpdateM_click = function () {
            var data = {
                group_cust_id:page.group_cust_id,
                group_id:page.cgroup_id,
                cust_no: $$("aclMemb").selectedValue(),
            }
            page.customer;
            if (data.group_cust_id != "" || data.group_id != "") {
                //page.customerGroupService.getGrpCust(data.group_id,data.cust_no, function (data1) {
                if (data.cust_no != page.customer[0].cust_no && data.cust_no != page.customer[1].cust_no && data.cust_no != page.customer[2].cust_no && data.cust_no != "") {
                        page.customerGroupService.updateGrpCust(data, function (data) {
                            $$("msgPanel").show("Customer Updated Successfully...");
                            page.customerGroupService.getGroupsCustByAll(page.selecetedGroup.group_id, function (data) {
                                $$("grdGroupTrans").dataBind(data);
                            });
                        });
                    }
                    else {
                        $$("msgPanel").show("Customer Already Exists...");
                    }
               // });
            }
            else {
                $$("msgPanel").show("Please select the Group...");
            }
            $$("aclMemb").selectedObject.val('');
        }*/
        page.events.btnAddM_click = function () {
            var groupcustomer = {
                group_id: $$("lblGroupNo").value(),
                cust_no: $$("aclMem").selectedValue()
            }
            if (groupcustomer.group_id == "") {
                alert("Please select the group");
            } else {
                if (page.chk_mem == 0){
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "grp.cust_no=" + $$("aclMem").selectedValue(),
                    sort_expression: ""
                }
                page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data1) {
                    //page.customerGroupService.getGrpCust(data, function (data1) {
                    if (data1.length != 0) {
                        //alert("Customer Already Added");
                        //$$("msgPanel").show("Customer already added in the group...");
                        alert("Customer already added in the group");
                        /*
                        data.group_cust_id = data1[0].group_cust_id;
                        page.customerGroupService.updateGrpCust(data, function (data) {
                            alert("Member Added Successfully");
                        });
                        page.customerGroupService.getGroupsCustByAll(page.selecetedGroup.group_id, function (data) {
                            $$("grdGroupTrans").dataBind(data);
                        });*/
                    } else {
                        page.customergroupAPI.postValue(groupcustomer, function (data1) {
                            //page.customerGroupService.insertGrpCust(data, function (data) {
                            //page.group_cust_id = data[0].key_value;
                            //page.controls.pnlAddGroup.close();
                            /*
                            page.customerGroupService.getGrpCustById(page.group_cust_id, function (item) {
                                //page.controls.grdGroupTrans.dataBind(item);
                                $$("grdGroupTrans").dataBind(item);
                                $$("grdGroupTrans").getAllRows()[0].click();*/
                            //alert("Member Added Successfully");
                            //$(".detail-info").progressBar("show");
                            //$$("msgPanel").show("Customer saved in the group successfully...");
                            alert("Customer added in the group successfully");
                            page.controls.pnlAdd.close();
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "grp.group_id=" + page.selecetedGroup.group_id,
                                sort_expression: ""
                            }
                            page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                //page.customerGroupService.getGroupsCustByAll(page.selecetedGroup.group_id, function (data) {
                                $$("grdGroupTrans").dataBind(data);
                                //$$("msgPanel").hide();
                            });
                        });
                    }
                });
                }
                else if (page.chk_mem == 1) {
                    var customer = {
                        first_name: $$("aclMem").selectedObject.val().split(" ")[0],
                        last_name: $$("aclMem").selectedObject.val().split(" ")[1],
                        comp_id: localStorage.getItem("user_company_id"),
                    }
                    page.customerAPI.postValue(customer, function (data) {
                        groupcustomer.cust_no = data[0].key_value;
                        page.customergroupAPI.postValue(groupcustomer, function (data1) {
                            alert("Customer added in the group successfully");
                            page.controls.pnlAdd.close();
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "grp.group_id=" + page.selecetedGroup.group_id,
                                sort_expression: ""
                            }
                            page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                //page.customerGroupService.getGroupsCustByAll(page.selecetedGroup.group_id, function (data) {
                                $$("grdGroupTrans").dataBind(data);
                                //$$("msgPanel").hide();
                            });
                    });
                    });

                    //page.customerService.insertState($$("txtState").selectedObject.val(), function (data) { });
                }
                $$("aclMem").selectedObject.val('');
                //$$("pnlAddGroup").hide();
            }
            //$(".detail-info").progressBar("hide");
        };

        page.events.btnRemove_click = function () {
            var chrMem = $$("grdGroupTrans").selectedData()[0];
            var data = {
                group_cust_id:page.group_cust_id,
                //cust_no: chrMem.cust_no,
                //group_id: chrMem.group_id
            }
            if (chrMem == undefined) {
                //alert("please select the member");
                //$(".detail-info").progressBar("show");
                $$("msgPanel").show("Please select the customer...");
            } else {
                //Update Query
                $$("msgPanel").show("Removing customer...");
                page.customergroupAPI.deleteValue(page.group_cust_id, data, function (data) {
                ////page.customerGroupService.deleteGrpCust(data, function (data) {
                    //alert("Member Added Successfully");
                    //$(".detail-info").progressBar("show");
                    $$("msgPanel").show("Customer removed successfully...!");
                    //$$("pnlAddGroup").close();
                    //$$("pnlAddGroup").hide();
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "grp.group_id=" + page.selecetedGroup.group_id,
                        sort_expression: ""
                    }
                    page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.customerGroupService.getGroupsCustByAll(page.selecetedGroup.group_id, function (data) {
                        $$("grdGroupTrans").dataBind(data);
                        $$("msgPanel").hide();
                    });
                });
            }
            
        };
        page.events.btnSearch_click = function () {
            $(".detail-info").hide();
            $$("btnSaveGroup").hide();
            $$("btnRemoveGroup").hide();
            $$("msgPanel").show("Searching...");
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(group_id, group_name) like '%" + $$("txtGroupSearch").value()+"%'",
                sort_expression: ""
            }
            page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
            //page.customerGroupService.getGroupSearch($$("txtGroupSearch").value(),function (item) {
                page.controls.grdGroupResult.dataBind(item);
                $$("msgPanel").hide();
            });
        }
    });
}