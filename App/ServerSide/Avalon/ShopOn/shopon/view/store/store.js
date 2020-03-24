/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.fn.storePage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.storeAPI = new StoreAPI();
        page.registerAPI = new RegisterAPI();
        page.revenueService = new RevenueService();
        page.store_no = null;
        page.store_reg_no = null;
        $("body").keydown(function (e) {
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
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
        document.title = "ShopOn - Store Management";

        page.events.btnNew_click = function () {
            $(".detail-basic").show();
            var data = '';
            page.store_no = null;
            page.store_reg_no = null;
            $$("txtStoreName").val('');
            $$("btnSave").show();
            $$("pnlRegisterDetails").show();
            $$("btnDelete").hide();
            $$("txtStoreName").focus();
            $$("grdRegisterResult").dataBind([]);
            page.revenueService.getPeriod(localStorage.getItem("user_finfacts_comp_id"), function (periodData) {
                $$("ddlPeriod").dataBind(periodData, "per_id", "per_name", "Select");
            });
        };
        
        page.events.page_load = function () {
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("pnlRegisterDetails").hide();
            $$("btnDelete").hide();
            $$("txtSearchInput").val('');
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("450px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    {'name': "Store No", 'width': "120px", 'dataField': "store_no"},
                     { 'name': "Store Name", 'width': "120px", 'dataField': "store_name" },
                     { 'name': "", 'width': "0px", 'dataField': "finfacts_comp_id" },
                     { 'name': "", 'width': "0px", 'dataField': "finfacts_per_id" },
                ]
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                page.store_no = item.store_no;
                page.selectedRowId = row.attr("row_id");
                
                $$("txtStoreName").value(item.store_name);
                
                $$("btnSave").show();
                $$("btnDelete").show();
                $(".detail-basic").show();
                $$("pnlRegisterDetails").show();
                $$("txtStoreName").focus();
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "store_no=" + item.store_no,
                    sort_expression: ""
                }
                page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdRegisterResult").dataBind(data);
                    $$("msgPanel").hide();
                })

                page.revenueService.getPeriod(item.finfacts_company_id, function (periodData) {
                    $$("ddlPeriod").dataBind(periodData, "per_id", "per_name", "Select");
                    $$("ddlPeriod").selectedValue(item.finfacts_per_id);
                });
            };
            $$("grdSearchResult").dataBind([]);
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
            })
            $$("grdRegisterResult").width("100%");
            $$("grdRegisterResult").height("405px");
            $$("grdRegisterResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Reg No", 'width': "120px", 'dataField': "reg_no" },
                    { 'name': "Reg Name", 'width': "140px", 'dataField': "reg_name" },
                    { 'name': "Reg Type", 'width': "140px", 'dataField': "reg_type" },
                ]
            });
            $$("grdRegisterResult").dataBind([]);
            $$("grdRegisterResult").selectionChanged = function (row, item) {
                page.store_reg_no = item.reg_no;
            };
            page.controls.grdRegisterResult.edit(true);
            $$("txtSearchInput").focus();
        };
            
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            try{
                if ($$("txtStoreName").value() == "" || $$("txtStoreName").value() == null) {
                    throw"Store name is mantatory...!";
                }
                if ($$("ddlPeriod").selectedValue() == "-1" || $$("ddlPeriod").selectedValue() == null || typeof $$("ddlPeriod").selectedValue() == "undefined") {
                    throw "Store Period Is Not Selected";
                }
                //else {
                    if (page.store_no == null || page.store_no == '') {
                        var data = {
                            store_name: $$("txtStoreName").value(),
                            state_no: "400",
                            finfacts_company_id:localStorage.getItem("user_finfacts_comp_id"),
                            comp_id: localStorage.getItem("user_company_id"),
                            finfacts_per_id: $$("ddlPeriod").selectedValue()
                        };
                        $$("msgPanel").show("Inserting new Store...");
                        page.storeAPI.postValue(data, function (data) {
                            $$("msgPanel").show("Store saved Successfully...!");
                            $$("btnSave").disable(false);
                            page.store_no = data[0].key_value;
                            var data = {
                                store_no: data[0].key_value
                            }
                            page.storeAPI.getValue(data, function (data) {
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                            });
                        });
                    }
                    else {
                        var data = {
                            store_no: page.store_no,
                            store_name: $$("txtStoreName").value(),
                            state_no: "400",
                            finfacts_company_id: localStorage.getItem("user_finfacts_comp_id"),
                            comp_id: localStorage.getItem("user_company_id"),
                            finfacts_per_id: $$("ddlPeriod").selectedValue()
                        };
                        $$("msgPanel").show("Updating store...");
                        page.storeAPI.putValue(data, function (data1) {
                            $$("msgPanel").show("Store updated Successfully...!");
                            $$("btnSave").disable(false);
                            var data = {
                                store_no: page.store_no
                            }
                            page.storeAPI.getValue(data, function (data) {
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                            });
                        });
                    }
                //}
            }
            catch (e) {
                alert(e);
                $$("btnSave").disable(false);
            }
            $$("btnDelete").show();
    };
        page.events.btnDelete_click = function () {
            if (confirm("Are Sure Want To Remove This Store")) {
                $$("msgPanel").show("Removing Store...");
                var data = {
                    store_no: page.store_no
                }
                page.storeAPI.deleteValue(data, function (data) {
                    $$("msgPanel").show("Store removed Successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("grdSearchResult").dataBind(data);
                        $$("msgPanel").hide();
                    })
                });
                $(".detail-basic").hide();
                $$("btnSave").hide();
                $$("btnDelete").hide();
                $$("pnlRegisterDetails").hide();
            }
        };
        page.events.btnSearch_click = function () {
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("pnlRegisterDetails").hide();
            $$("msgPanel").show("Searching...");
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "(store_no like '" + $$("txtSearchInput").value() + "%' or store_name like '" + $$("txtSearchInput").value() + "%')",
                sort_expression: ""
            }
            page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            })
        };

        page.events.btnAdd_click = function () {
            page.controls.pnlRegisterAddPopup.open();
            page.controls.pnlRegisterAddPopup.title("Register");
            page.controls.pnlRegisterAddPopup.width(380);
            page.controls.pnlRegisterAddPopup.height(250);
            $$("txtRegName").value("");
            $$("txtRegName").focus();
            $$("txtRegType").value("");
            page.store_reg_no = null;
        };
        page.events.btnSaveRegister_click = function () {
            try{
                if ($$("txtRegName").value() == "" || $$("txtRegName").value() == null) {
                    throw "Register name is mantatory...!";
                }
                else {
                    var data = {
                        reg_name: $$("txtRegName").value(),
                        reg_type: $$("txtRegType").value(),
                        store_no: page.store_no,
                    };
                    $$("msgPanel").show("Inserting new Register...");
                    page.registerAPI.postValue(data, function (data) {
                        $$("msgPanel").show("Register saved Successfully...!");
                        $$("btnSave").disable(false);
                        page.store_reg_no = data[0].key_value;
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "store_no=" + page.store_no,
                            sort_expression: ""
                        }
                        page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdRegisterResult").dataBind(data);
                            $$("msgPanel").hide();
                        });
                        page.controls.pnlRegisterAddPopup.close();
                    });
                }
            }
            catch (e) {
                alert(e);
            }
        };
        page.events.btnDeleteRegister_click = function () {
            try{
                if (page.store_reg_no == null || page.store_reg_no == "" || page.store_reg_no == undefined)
                    throw "Please select the register";
                if (confirm("Are Sure Want To Remove This Register")) {
                    $$("msgPanel").show("Removing Register...");
                    var data = {
                        reg_no: page.store_reg_no
                    }
                    page.registerAPI.deleteValue(data, function (data) {
                        $$("msgPanel").show("Store removed Successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "store_no=" + page.store_no,
                            sort_expression: ""
                        }
                        page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdRegisterResult").dataBind(data);
                            $$("msgPanel").hide();
                        })
                        page.store_reg_no = null;
                    });
                }
            }
            catch (e) {
                alert(e);
            }
        };
        page.events.btnUpdateRegister_click = function () {
            try{
                if (page.store_reg_no == null || page.store_reg_no == "" || typeof page.store_reg_no == "undefined")
                    throw "Please Select The Register !!!";
                page.controls.pnlRegisterUpdatePopup.open();
                page.controls.pnlRegisterUpdatePopup.title("Update Register");
                page.controls.pnlRegisterUpdatePopup.width(380);
                page.controls.pnlRegisterUpdatePopup.height(250);
                $$("txtUpdateRegName").value(page.controls.grdRegisterResult.selectedData(0)[0].reg_name);
                $$("txtUpdateRegType").value(page.controls.grdRegisterResult.selectedData(0)[0].reg_type);
                $$("txtUpdateRegName").focus();
            }
            catch (e) {
                alert(e);
            }
        };
        page.events.btnUpdateSaveRegister_click = function () {
            try {
                if ($$("txtUpdateRegName").value() == "" || $$("txtUpdateRegName").value() == null) {
                    throw "Register name is mantatory...!";
                }
                else {
                    var data = {
                        reg_no: page.store_reg_no,
                        reg_name: $$("txtUpdateRegName").value(),
                        reg_type: $$("txtUpdateRegType").value(),
                        store_no: page.store_no,
                    };
                    $$("msgPanel").show("Inserting new Register...");
                    page.registerAPI.putValue(data, function (data) {
                        $$("msgPanel").show("Register updated Successfully...!");
                        $$("btnSave").disable(false);
                        page.store_reg_no = page.store_reg_no;
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "store_no=" + page.store_no,
                            sort_expression: ""
                        }
                        page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdRegisterResult").dataBind(data);
                            $$("msgPanel").hide();
                        });
                        page.controls.pnlRegisterUpdatePopup.close();
                    });
                }
            }
            catch (e) {
                alert(e);
            }
        };
    });
};



