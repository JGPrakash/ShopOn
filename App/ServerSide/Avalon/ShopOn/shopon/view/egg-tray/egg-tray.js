$.fn.eggTray = function() {
    return $.pageController.getPage(this, function(page, $$) {

        //Import Services required
        page.vendorAPI = new VendorAPI();
        page.eggtrayAPI = new EggTrayAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.customerAPI = new CustomerAPI();
        page.stockReportAPI = new StockReportAPI();
        document.title = "ShopOn - Tray";
        page.sku_no = 0;
        page.obj = "";
        $("body").keydown(function (e) {
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewTray_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSaveTray_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnBeforeRemoveTray_click();
            }
        });

        function saveSO() {
            var newSO = {
                tray_id: page.currentSO.tray_id,
                tray_name: page.controls.txtTrayName2.value(),
                tray_desc: page.controls.txtTrayDesc1.value()

            };
            if (!page.currentSO.tray_id) {
                $$("msgPanel").show("Inserting tray...!");
                page.eggtrayAPI.postValue(newSO, function (data) {
                    $$("msgPanel").show("tray inserted successfully...!");

                });
            }
            else {
                $$("msgPanel").show("Updating Tray...!");
                page.eggtrayAPI.putValue(newSO.tray_id, newSO, function (data1) {
                    $$("msgPanel").show("Tray updated successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(ifnull(tray.tray_id,''),ifnull(tray.tray_name,'')) like '%" + page.view.searchInput() + "%'",
                        sort_expression: ""
                    }
                    page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.view.searchResult(data);
                        $$("msgPanel").hide();
                    });
                });
            }
        }

        function RemoveTray() {
            if (page.currentSO != null) {
                $$("msgPanel").show("Removing Tray...!");
                var data = {
                    tray_id: page.currentSO.tray_id
                }
                page.eggtrayAPI.deleteValue(page.currentSO.tray_id, data, function (data) {
                    $$("msgPanel").show("Tray removed successfully...!");
                    page.events.btnSearch_click();

                    page.controls.txtTrayName2.value('');
                    page.controls.lblTrayCount.html("0");
                    page.currentSO.tray_id = null;
                    page.controls.lblTrayNo.html('');
                });
            } else {
                 $$("msgPanel").show("Please select the tray first to proceed");
            }
        }
        page.view = {
            searchInput: function() {
                return page.controls.txtTraySearch.val();
            },
            searchResult: function(data) {
                page.controls.grdTrayResult.width("100%");
                    page.controls.grdTrayResult.height("480px");
                page.controls.grdTrayResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Tray Id", 'rlabel': 'No', 'width': "30%", 'dataField': "tray_id", visible: false },
                        { 'name': "Tray Id", 'rlabel': 'No', 'width': "30%", 'dataField': "tray_no" },
                        { 'name': "Tray Name", 'rlabel': 'Name', 'width': "50%", 'dataField': "tray_name" }
                    ]
                });
                page.controls.grdTrayResult.selectionChanged = function(rowList, dataList) {
                    page.events.grdTrayResult_select(dataList);
                    $(".detail-basic.row").show();
                    $$("btnSaveTray").show();
                    $$("btnRemoveTray").show();
                    $$("btnCustomerTray").show();
                    $("#eremove").show();
                    $$("txtTrayName2").focus();
                }
                page.controls.grdTrayResult.dataBind(data);
            },
            selectedSO: function(item) {
                if (item) {
                    //page.controls.lblTrayNo.html(item.tray_id);
                    page.controls.lblTrayNo.html(item.tray_no);
                    page.controls.txtTrayName2.value(item.tray_name);
                    page.controls.txtTrayDesc1.value(item.tray_desc);

                    page.controls.lblTrayTotalCount.html(item.total_stock);
                    if (item.current_stock == null)
                        page.controls.lblTrayCount.html("0");
                    else
                        page.controls.lblTrayCount.html(item.current_stock);
                   
                    page.selectedSO = item;
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "so.tray_id =" + page.currentSO.tray_id + " and store_no=" + localStorage.getItem("user_store_no"),
                        sort_expression: ""
                    }
                    page.eggtraytransAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        if (data.length != 0) {
                            page.sku_no = data[0].sku_no;
                        }
                        page.controls.grdTransactions.width("100%");
                        page.controls.grdTransactions.height("330px");

                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 50,
                            columns: [
                                { 'name': "Id", 'width': "80px", 'dataField': "trans_id" },
                                { 'name': "Count", 'width': "80px", 'dataField': "tray_count" },
                                { 'name': "Trans Type", 'width': "160px", 'dataField': "trans_type" },
                                { 'name': "Trans Date", 'width': "150px", 'dataField': "trans_date" },
                                { 'name': "Customer/Vendor", 'width': "180px", 'dataField': "cust_name" },
                                { 'name': "Bill No", 'width': "120px", 'dataField': "bill_code" },
                                {
                                    'name': "Action",
                                    'width': "80px",
                                    'dataField': "trans_id",//<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Delete' value='Delete' />
                                    itemTemplate: "<input type='button' title='Delete'  class='grid-button' value='' action='delete' style='    border: none;    background-color: transparent;    background-image: url(./delete.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' /> "
                                }
                            ]
                        });
                        page.controls.grdTransactions.rowBound = function (row, item) {
                            if (item.bill_code == null || item.bill_code == "" || typeof item.bill_code == "undefined") {
                                $(row).find("[datafield=bill_code]").find("div").html(item.bill_id);
                            }
                        }
                        page.controls.grdTransactions.dataBind(data);
                    });
                }
                return page.selectedSO;
            },
            selectedSOItems: function(data) {

            },
        }
        page.events = {
            btnBeforeRemoveTray_click: function () {
                var result;
                result = page.controls.grdTransactions.allData().length;
                if (result == 0) {
                    page.controls.pnlRemoveConfirmPopup.open();
                    page.controls.pnlRemoveConfirmPopup.title("Remove Alert");
                    page.controls.pnlRemoveConfirmPopup.rlabel("Remove Alert");
                    page.controls.pnlRemoveConfirmPopup.width(540);
                    page.controls.pnlRemoveConfirmPopup.height(200);
                    if (CONTEXT.ENABLE_REMOVE) {
                        $$("btnRemoveAlertPopupSave").show();
                    }
                    else {
                        $$("btnRemoveAlertPopupSave").hide();
                    }
                } else {
                    $$("lblAtert").html("This Tray Contains " + result + " Transactions, Please Remove The Transaction Then Delete This Tray");
                    page.controls.pnlRemoveAlertPopup.open();
                    page.controls.pnlRemoveAlertPopup.title("Remove Alert");
                    page.controls.pnlRemoveAlertPopup.rlabel("Remove Alert");
                    page.controls.pnlRemoveAlertPopup.width(540);
                    page.controls.pnlRemoveAlertPopup.height(200);
                }
            },
            btnRemoveAlertPopupClose_click: function () {
                page.controls.pnlRemoveAlertPopup.close();
            },
            btnRemoveConfirmPopupClose_click: function () {
                page.controls.pnlRemoveConfirmPopup.close();
            },
            btnRemoveTray_click: function () {
                RemoveTray();
                page.controls.pnlRemoveConfirmPopup.close();
                //var result;
                //result = page.controls.grdTransactions.allData().length;
                //if (result == 0) {
                //    if (confirm("Are You Sure want To Remove This Tray")) {
                //        RemoveTray();
                //    }
                //} else {
                //    $$("msgPanel").show("This tray contains " + result+ " transactions...");
                //}
            },
            btnSearch_click: function () {
                $("#eremove").hide();
                $(".detail-basic.row").hide();
                $$("btnSaveTray").hide();
                $$("btnRemoveTray").hide();
                $$("btnCustomerTray").hide();
                $$("msgPanel").show("Searching...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    //filter_expression: "concat(ifnull(tray.tray_id,''),ifnull(tray.tray_name,'')) like '%" + page.view.searchInput() + "%'",
                    filter_expression: "concat(ifnull(tray.tray_no,''),ifnull(tray.tray_name,'')) like '%" + page.view.searchInput() + "%'",
                    sort_expression: ""
                }
                page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.view.searchResult(data);
                    $$("msgPanel").hide();
                    $$("txtTraySearch").focus();
                });
            },
            grdTrayResult_select: function(item) {
                $(".detail-info").show();
                page.currentSO = item;
                page.currentSOItem = [];
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "tray.tray_id=" + item.tray_id,
                    sort_expression: ""
                }
                page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (dataitem) {
                    if (dataitem.length > 0) {
                        page.view.selectedSO(dataitem[0]);
                        $('html, body').animate({
                            scrollTop: $("[controlid=btnNewTray]").offset().top - 50
                        }, 2000);
                    }
                });
            },

            btnNewTray_click: function () {
                page.bill_no = null;
                page.currentBillNo = null;
                page.controls.lblTrayCount.html("0");
                page.controls.pnlNewTrayPopup.open();
                page.controls.pnlNewTrayPopup.title("Create New Tray");
                page.controls.pnlNewTrayPopup.rlabel("Create New Tray");
                page.controls.pnlNewTrayPopup.width(300);
                page.controls.pnlNewTrayPopup.height(300);
                $$("txtTrayName").focus();
                $$("btnAddTrayOK").disable(false);
            },

            btnAddTransaction_click: function() {

                if (page.currentSO != null) {
                    page.controls.pnlTransactionPayPopup.open();

                    page.controls.pnlTransactionPayPopup.title("Create New Transaction");
                    page.controls.pnlTransactionPayPopup.rlabel("Create New Transaction");
                    page.controls.pnlTransactionPayPopup.width(340);
                    page.controls.pnlTransactionPayPopup.height(420);

                    $$("dsBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    $$("btnTransactionPayOK").disable(false);
                    $$("txtBillId").value("");
                    $$("txtTrayCount").value("");
                    $$("ddlPayType").selectedValue("Vendor Purchase");
                } else {
                        $$("msgPanel").show("Please select the tray first to add your transaction...!");
                }
            },


            btnTransactionPayOK_click: function () {
                $$("btnTransactionPayOK").disable(true);
                var trans = {
                    tray_count: page.controls.txtTrayCount.value(),

                    trans_date: dbDate(page.controls.dsBillPayDate.getDate()),
                    trans_type: page.controls.ddlPayType.selectedValue(),
                    tray_id: page.currentSO.tray_id,

                    cust_id: page.controls.ddlCustomer.selectedValue(),
                    bill_id: page.controls.txtBillId.value(),
                    store_no: localStorage.getItem("user_store_no"),
                    sku_no:page.sku_no
                };
                if (trans.trans_type == '') {
                    alert("Please enter trans type...!");
                }
                else if (trans.bill_id == '') {
                    alert("Please enter bill no...!");
                }
                //else if (isNaN(trans.bill_id)) {
                //    alert("Please enter only digits for invoice no...!");
                //}
                else if (trans.tray_count == '') {
                    alert("Please enter tray Count...!");
                }
                else if (isNaN(trans.tray_count)) {
                    alert('Please enter only digits for tray count...!');

                }
                else if (trans.trans_date == '') {
                    alert("Please enter trans date...!");
                }
            else 
               { 
                    $$("msgPanel").show("Inserting tray transaction...!");
                    page.eggtraytransAPI.postValue(trans, function (data) {
                        $$("msgPanel").show("Tray transacation saved successfully...!");
                        page.controls.pnlTransactionPayPopup.close();
                        $$("btnTransactionPayOK").disable(false);
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "so.tray_id =" + trans.tray_id + " and so.store_no=" + localStorage.getItem("user_store_no"),
                            sort_expression: ""
                        }
                        page.eggtraytransAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            page.controls.grdTransactions.dataBind(data);
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "tray.tray_id=" + trans.tray_id,
                                sort_expression: ""
                            }
                            page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                page.controls.lblTrayTotalCount.html(data[0].total_stock);
                                $$("msgPanel").hide();
                                page.controls.lblTrayCount.html(data[0].current_stock);
                            });
                        });
                    });
                } 
            },
            btnSaveTray_click: function() {
                if (page.currentSO != null) {
                    saveSO();
                } else {
                    $$("msgPanel").show("Please select the tray first to proceed this");
                }
            },
            page_init: function() {},

            btnCustomerTray_click: function() {
                page.controls.pnlCustomerViewPopup.open();

                page.controls.pnlCustomerViewPopup.title("Customer Report");
                page.controls.pnlCustomerViewPopup.rlabel("Customer Report");
                page.controls.pnlCustomerViewPopup.width(850);
                page.controls.pnlCustomerViewPopup.height(400);
                var filter = {
                    viewMode: "customerTrayReport",
                    store_no: getCookie("user_store_id"),
                    tray_id: page.currentSO.tray_id,
                    //filter_expression: "so.tray_id =" + page.currentSO.tray_id + " and (trans_type like 'Customer Sales' or trans_type like 'Customer Return') and so.store_no=" + localStorage.getItem("user_store_no"),
                    //sort_expression: ""
                }
                page.stockReportAPI.stockReport(filter, function (data) {
                //page.eggtraytransAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.controls.grdCustView.height("250px");
                    page.controls.grdCustView.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Cust Id", 'width': "5%", 'dataField': "cust_id" },
                            { 'name': "Cust Name", 'width': "30%", 'dataField': "cust_name" },
                            { 'name': "Tray Name", 'width': "40%", 'dataField': "tray_name" },
                            { 'name': "Tray Count", 'width': "15%", 'dataField': "tray_count" },
                        ]
                    });

                    page.controls.grdCustView.dataBind(data);

                });


            },
            page_load: function() {
                page.events.btnSearch_click();
                $("#eremove").hide();
                $$("ddlPayType").selectionChange(function() {

                    if ($$("ddlPayType").selectedValue() == "Customer Sales") {
                        $$("lblCustVend").html("Customer");
                        $$("pnlCustVend").show();
                        $$("pnlInvoiceNo").show();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlCustomer").dataBind(data, "cust_no", "cust_name");
                        });

                    } else if ($$("ddlPayType").selectedValue() == "Customer Return") {
                        $$("lblCustVend").html("Customer");
                        $$("pnlCustVend").show();
                        $$("pnlInvoiceNo").show();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlCustomer").dataBind(data, "cust_no", "cust_name");
                        });
                    } else if ($$("ddlPayType").selectedValue() == "Vendor Purchase") {
                        $$("lblCustVend").html("Vendor");
                        $$("pnlCustVend").show();
                        $$("pnlInvoiceNo").show();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.vendorAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlCustomer").dataBind(data, "vendor_no", "vendor_name");
                        });
                    } else if ($$("ddlPayType").selectedValue() == "Vendor Return") {
                        $$("lblCustVend").html("Vendor");
                        $$("pnlCustVend").show();
                        $$("pnlInvoiceNo").show();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.vendorAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlCustomer").dataBind(data, "vendor_no", "vendor_name");
                        });
                    } else if ($$("ddlPayType").selectedValue() == "Manual Stock") {
                        $$("pnlCustVend").hide();
                        $$("pnlInvoiceNo").hide();
                    } else if ($$("ddlPayType").selectedValue() == "Manual Return") {
                        $$("pnlCustVend").hide();
                        $$("pnlInvoiceNo").hide();
                    }
                });


                $$("ddlPayType").selectionChange();
                page.view.searchResult([]);

                $$("grdTransactions").rowCommand = function (obj) {
                    if (obj.action == "delete") {
                        page.controls.pnlRemove1ConfirmPopup.open();
                        page.controls.pnlRemove1ConfirmPopup.title("Remove Alert");
                        page.controls.pnlRemove1ConfirmPopup.rlabel("Remove Alert");
                        page.controls.pnlRemove1ConfirmPopup.width(540);
                        page.controls.pnlRemove1ConfirmPopup.height(200);
                        if (CONTEXT.ENABLE_REMOVE) {
                            $$("btnRemove1AlertPopupSave").show();
                        }
                        else {
                            $$("btnRemove1AlertPopupSave").hide();
                        }
                    }
                }
                $$("txtTraySearch").keyup(function () {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(ifnull(tray.tray_id,''),ifnull(tray.tray_name,'')) like '%" + page.view.searchInput() + "%'",
                        sort_expression: ""
                    }
                    page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.view.searchResult(data);
                        $$("msgPanel").hide();
                    });
                });

                $$("ddlCustomer").selectionChange(function () {
                    $$("txtBillId").focus();
                });
            },
            btnRemove1ConfirmPopupClose_click:function(){
                page.controls.pnlRemove1ConfirmPopup.close();
            },
            btnRemove1Tray_click:function(){
                var data;
                $$("msgPanel").show("Removing tray transaction...!");
                var data = {
                    trans_id: $$("grdTransactions").selectedData()[0].trans_id
                }
                page.eggtraytransAPI.deleteValue($$("grdTransactions").selectedData()[0].trans_id, data, function (data) {
                    $$("msgPanel").show("Tray transaction removed successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "so.tray_id =" + page.currentSO.tray_id + " and so.store_no=" + localStorage.getItem("user_store_no"),
                        sort_expression: ""
                    }
                    page.eggtraytransAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.controls.grdTransactions.dataBind(data);
                        $$("msgPanel").hide();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "tray.tray_id=" + page.currentSO.tray_id,
                            sort_expression: ""
                        }
                        page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            page.controls.lblTrayTotalCount.html(data[0].total_stock);
                            page.controls.lblTrayCount.html(data[0].current_stock);
                            page.controls.pnlRemove1ConfirmPopup.close();
                        });
                    });
                });
            },
            btnAddTrayOK_click: function() {
                $$("btnAddTrayOK").disable(true);
                try {
                    if ($$("txtTrayName").val() == "") {
                        alert("Tray name is mandatory...!");
                        $$("txtTrayName").focus();
                    }
                    else {
                        var input = {
                            tray_name: page.controls.txtTrayName.value(),
                            tray_desc: page.controls.txtTrayDesc.value(),
                            comp_id: localStorage.getItem("user_company_id")
                        };
                        $$("msgPanel").show("Inserting tray...!");
                        page.eggtrayAPI.postValue(input, function (data) {
                            $$("msgPanel").show("Tray inserted successfully...!");
                            var tray_id = data[0].key_value
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "tray.tray_id=" + tray_id,
                                sort_expression: ""
                            }
                            page.eggtrayAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                page.view.searchResult(data);
                                $$("msgPanel").hide();
                                page.controls.grdTrayResult.getAllRows()[0].click();
                                page.controls.grdTransactions.dataBind([]);

                            });
                            $$("pnlNewTrayPopup").close();
                            page.controls.txtTrayName.val('');
                            page.controls.txtTrayDesc.val('');
                            $$("btnAddTrayOK").disable(false);
                            },
                            function (error) {
                                alert('This item is already mapped to the different tray. You cannot map the same item to different trays. ' + error.message);
                                $$("btnAddTrayOK").disable(false);
                            });
                       }
                    }
                    catch (e) {
                        alert('This item is already mapped to the different tray. You cannot map the same item to different trays.');
                        $$("btnAddTrayOK").disable(false);
                    }
                }
        }

        page.interface.load = function() {
            $(page.selectedObject).load("/view/pages/item-list/item-list.html");
        }
    });
}