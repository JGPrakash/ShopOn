/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.fn.registerPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.registerAPI = new RegisterAPI();
        page.register_no = null;

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

        page.events.btnNew_click = function () {
            $(".detail-basic").show();
            var data = '';
            page.register_no = null;
            $$("txtRegisterName").val('');
            $$("txtRegisterType").val('');
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("txtRegisterName").focus();
        };
        
        page.events.page_load = function () {
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("txtSearchInput").val('');
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("450px");
            $$("grdSearchResult").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Reg No", 'width': "120px", 'dataField': "reg_no" },
                     { 'name': "Reg Name", 'width': "120px", 'dataField': "reg_name" }
                ]
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                page.register_no = item.reg_no;
                page.selectedRowId = row.attr("row_id");
                
                $$("txtRegisterName").value(item.reg_name);
                $$("txtRegisterType").value(item.reg_type);

                $$("btnSave").show();
                $$("btnDelete").show();
                $(".detail-basic").show();
                $$("txtStoreName").focus();
            };
            $$("grdSearchResult").dataBind([]);
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                sort_expression: ""
            }
            page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
            })
            $$("txtSearchInput").focus();
        };
            
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            try{
                if ($$("txtRegisterName").value() == "" || $$("txtRegisterName").value() == null) {
                    throw"Register name is mantatory...!";
                } 
                else {
                    if (page.register_no == null || page.register_no == '') {
                        var data = {
                            reg_name: $$("txtRegisterName").value(),
                            reg_type: $$("txtRegisterType").value(),
                            store_no: localStorage.getItem("user_store_no"),
                        };
                        $$("msgPanel").show("Inserting new Register...");
                        page.registerAPI.postValue(data, function (data) {
                            $$("msgPanel").show("Register saved Successfully...!");
                            $$("btnSave").disable(false);
                            page.register_no = data[0].key_value;
                            var data = {
                                reg_no: data[0].key_value
                            }
                            page.registerAPI.getValue(data, function (data) {
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                            });
                        });
                    }
                    else {
                        var data = {
                            reg_no: page.register_no,
                            reg_name: $$("txtRegisterName").value(),
                            reg_type: $$("txtRegisterType").value(),
                            store_no: localStorage.getItem("user_store_no"),
                        };
                        $$("msgPanel").show("Updating Register...");
                        page.registerAPI.putValue(data, function (data1) {
                            $$("msgPanel").show("Register updated Successfully...!");
                            $$("btnSave").disable(false);
                            var data = {
                                reg_no: page.register_no
                            }
                            page.registerAPI.getValue(data, function (data) {
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                            });
                        });
                    }
                }
            }
            catch (e) {
                alert(e);
                $$("btnSave").disable(false);
            }
            $$("btnDelete").show();
    };
        page.events.btnDelete_click = function () {
            if (confirm("Are Sure Want To Remove This Register")) {
                $$("msgPanel").show("Removing Register...");
                var data = {
                    reg_no: page.register_no
                }
                page.registerAPI.deleteValue(data, function (data) {
                    $$("msgPanel").show("Store removed Successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                        sort_expression: ""
                    }
                    page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("grdSearchResult").dataBind(data);
                        $$("msgPanel").hide();
                    })
                });
                $(".detail-basic").hide();
                $$("btnSave").hide();
                $$("btnDelete").hide();
            }
        };
        page.events.btnSearch_click = function () {
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "store_no=" + localStorage.getItem("user_store_no")+" and (reg_no like '" + $$("txtSearchInput").value() + "%' or reg_name like '" + $$("txtSearchInput").value() + "%')",
                sort_expression: ""
            }
            page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            })
        };
    });
};



