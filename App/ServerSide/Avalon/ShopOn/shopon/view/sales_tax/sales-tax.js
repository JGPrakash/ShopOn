/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.salestaxPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.salestaxAPI = new SalesTaxAPI();
        page.salestaxclassAPI = new SalesTaxClassAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.sales_tax_no = null;
        document.title = "ShopOn - Sales Tax";
        $("body").keydown(function (e) {
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
                page.events.btnBeforeDelete_click();
            }
        });

        page.events.btnNew_click = function () {
            $(".detail-basic").show();
            var data = '';
            page.sales_tax_no = null;
            $$("txtSalesTaxName").val('');
            $$("txtTaxPer").val('');
            $$("chkActive").prop("checked", true);
            $$("grdTaxResult").dataBind([]);
            $$("btnSave").show();
            $$("btnDelete").hide();
            $(".taxclass-panel").hide();
            $$("txtSalesTaxName").focus();
            $("#tax").hide();
            $("#tax").show();
        };
        var data = {
            start_record: 0,
            end_record: "",
            filter_expression: "",
            sort_expression: ""
        }
        page.salestaxAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            $$("grdSearchResult").dataBind(data);
        });
        page.events.page_load = function () {
            $(".detail-basic").hide();
            $(".taxclass-panel").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            
            $$("chkActive").prop("checked", false);
            $$("txtSearchInput").val('');
            $$("txtSalesTaxName").val('');
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("480px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Sales Tax No", 'rlabel': 'No', 'width': "150px", 'dataField': "sales_tax_no", visible: false },
                    { 'name': "Sales Tax No", 'rlabel': 'No', 'width': "150px", 'dataField': "sales_tax_id" },
                    { 'name': "Sales Tax Name", 'rlabel': 'Name', 'width': "200px", 'dataField': "sales_tax_name" }
                ]
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                page.sales_tax_no = item.sales_tax_no;
                page.selectedRowId = row.attr("row_id");
                $$("txtSalesTaxName").value(item.sales_tax_name);
                $(".taxclass-panel").show();
                if (item.active == 1) {
                    $$("chkActive").prop("checked", true);
                }
                if (item.active == 0 || item.active == "" || item.active == null) {
                    $$("chkActive").prop("checked", false);
                }
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "sales_tax_no=" + page.sales_tax_no,
                    sort_expression: ""
                }
                page.salestaxclassAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdTaxResult").dataBind(data);
                    $$("msgPanel").hide();
                });
                $(".detail-basic").show();
                $$("btnSave").show();
                $$("btnDelete").show();
                page.sales_tax_class_no = null;
                $$("txtSalesTaxName").focus();
            };

            $$("grdSearchResult").dataBind([]);
            $$("grdTaxResult").width("100%");
            $$("grdTaxResult").height("415px");
            $$("grdTaxResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Tax Class Name", 'rlabel': 'Tax Class Name', 'width': "200px", 'dataField': "tax_class_name" },
                    { 'name': "Percentage", 'rlabel': 'Percentage', 'width': "100px", 'dataField': "tax_per" },
                    { 'name': "CGST", 'rlabel': 'CGST', 'width': "80px", 'dataField': "cgst" },
                    { 'name': "SGST", 'rlabel': 'SGST', 'width': "80px", 'dataField': "sgst" },
                    { 'name': "IGST", 'rlabel': 'IGST', 'width': "80px", 'dataField': "igst" },
                    { 'name': "Cess %", 'rlabel': 'Cess %', 'width': "80px", 'dataField': "cess_per" },
                    { 'name': "Cess Qty", 'rlabel': 'Cess Qty', 'width': "80px", 'dataField': "cess_qty" },
                    { 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "90px", 'dataField': "cess_qty_amount" },
                ]
            });
            $$("grdTaxResult").dataBind([]);
            $$("grdTaxResult").selectionChanged = function (row, item) {
                page.sales_tax_class_no = item.sales_tax_class_no;
            };
            page.controls.grdTaxResult.edit(true);
            $$("txtSearchInput").focus();
        };
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            if ($$("txtSalesTaxName").value() == "") {
                $$("msgPanel").show("Sales tax name is mandatory...!");
                $$("txtSalesTaxName").focus();
                $$("btnSave").disable(false);
            }
            else {
                if (page.sales_tax_no == null || page.sales_tax_no == '') {
                    var active;
                    if ($$("chkActive").prop("checked")) {
                        active = 1;
                    } else {
                        active = 0;
                    }
                    var data = {
                        sales_tax_name: $$("txtSalesTaxName").value(),
                        active: active,
                        comp_id: localStorage.getItem("user_company_id"),
                    };
                    $$("msgPanel").show("Inserting new sales tax...!");
                    page.salestaxAPI.postValue(data, function (data) {
                        $$("msgPanel").show("Sales tax saved successfully...!");
                        $$("btnSave").disable(false);
                        page.sales_tax_no = data[0].key_value;
                        var salestax = {
                            sales_tax_no: data[0].key_value
                        }
                        page.salestaxAPI.getValue(salestax, function (data) {
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                        });
                    });
                    $$("msgPanel").hide()
                } else {
                    var active;
                    if ($$("chkActive").prop("checked")) {
                        active = 1;
                    } else {
                        active = 0;
                    }
                    var data = {
                        sales_tax_no: page.sales_tax_no,
                        sales_tax_name: $$("txtSalesTaxName").value(),
                        active: active,
                        comp_id: localStorage.getItem("user_company_id"),
                    };
                    $$("msgPanel").show("Updating sales tax...!");
                    page.salestaxAPI.putValue(page.sales_tax_no, data, function (data1) {
                        $$("msgPanel").show("Sales tax updated successfully...!");
                        $$("btnSave").disable(false);
                        var salestax = {
                            sales_tax_no: page.sales_tax_no
                        }
                        page.salestaxAPI.getValue(salestax, function (data) {
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                }
            }

            $$("btnDelete").show();
        };
        page.events.btnBeforeDelete_click = function () {
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
        }
        page.events.btnRemoveConfirmPopupClose_click = function () {
            page.controls.pnlRemoveConfirmPopup.close();
        }
        page.events.btnDelete_click = function () {
            $$("msgPanel").show("Removing sales tax...!");
            var data = {
                sales_tax_no: page.sales_tax_no
            }
            page.salestaxAPI.deleteValue(page.sales_tax_no, data, function (data) {
                $$("msgPanel").show("Sales tax removed successfully...!");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(sales_tax_no,sales_tax_name) like '%" + $$("txtSearchInput").value() + "%'",
                    sort_expression: ""
                }
                page.salestaxAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("grdSearchResult").dataBind(data);
                    $$("grdSearchResult").getRow(0)[0].find("[datafield=sales_tax_no]").click();
                    page.controls.pnlRemoveConfirmPopup.close();
                    $$("msgPanel").hide();
                });
                $(".detail-basic").hide();
                $(".taxclass-panel").hide();
                $$("btnSave").hide();
                $$("btnDelete").hide();
            });
        };
        page.events.btnSearch_click = function () {
            $(".detail-basic").hide();
            $(".taxclass-panel").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...!");
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(sales_tax_id,sales_tax_name) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.salestaxAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
        };
        page.events.btnAdd_click = function () {
            var data = {
                sales_tax_no: page.sales_tax_no,
                add: true
            }

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "active=1 and tax_class_no not in(select tax_class_no from sales_tax_class_t where sales_tax_no=sales_tax_no=" + page.sales_tax_no + ")",
                sort_expression: ""
            }
            page.taxclassAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("ddlTaxName").dataBind(data, "tax_class_no", "tax_class_name");
                page.controls.pnlTaxAddPopup.open();

                page.controls.pnlTaxAddPopup.title("Tax");
                page.controls.pnlTaxAddPopup.rlabel("Tax");
                page.controls.pnlTaxAddPopup.width(420);
                page.controls.pnlTaxAddPopup.height(390);
                $$("btnSaveTax").disable(false);
                page.sales_tax_class_no = null;

                $$("txtTaxPer").value("0");
                $$("txtCentralGST").value("0");
                $$("txtStateGST").value("0");
                $$("txtItemGST").value("0");
                $$("txtCessPer").value("0");
                $$("txtCessQty").value("1");
                $$("txtCessAmount").value("0");

                if (CONTEXT.ENABLE_ADDITIONAL_TAX) {
                    $$("pnlCessPer").show();
                    $$("pnlCessQty").show();
                    $$("pnlCessAmt").show();
                }
                else {
                    $$("pnlCessPer").hide();
                    $$("pnlCessQty").hide();
                    $$("pnlCessAmt").hide();
                }
            });
        };
        page.events.btnUpdate_click = function () {
            try {
                if (page.sales_tax_class_no == null || page.sales_tax_class_no == "" || page.sales_tax_class_no == undefined)
                    throw "Please select the tax class";
                var data = {
                    sales_tax_no: page.sales_tax_no,
                    add: false
                }
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "active=1",
                    sort_expression: ""
                }
                page.taxclassAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("ddlTaxName").dataBind(data, "tax_class_no", "tax_class_name");
                    //$$("txtTaxPer").value($$("grdTaxResult").selectedData()[0].tax_per);
                    //$$("txtCentralGST").value($$("grdTaxResult").selectedData()[0].tax_per);
                    page.controls.pnlTaxAddPopup.open();
                    page.controls.pnlTaxAddPopup.title("Tax");
                    page.controls.pnlTaxAddPopup.rlabel("Tax");
                    page.controls.pnlTaxAddPopup.width(380);
                    page.controls.pnlTaxAddPopup.height(400);

                    $$("ddlTaxName").selectedValue($$("grdTaxResult").selectedData()[0].tax_class_no);
                    $$("txtTaxPer").value($$("grdTaxResult").selectedData()[0].tax_per);
                    $$("txtCentralGST").value($$("grdTaxResult").selectedData()[0].cgst);
                    $$("txtStateGST").value($$("grdTaxResult").selectedData()[0].sgst);
                    $$("txtItemGST").value($$("grdTaxResult").selectedData()[0].igst);
                    $$("txtCessPer").value($$("grdTaxResult").selectedData()[0].cess_per);
                    $$("txtCessQty").value($$("grdTaxResult").selectedData()[0].cess_qty);
                    $$("txtCessAmount").value($$("grdTaxResult").selectedData()[0].cess_qty_amount);
                });
            } catch (e) {
                alert(e);
            }
        };
        function isTaxAlreadyExsists(sale_tax_no,tax_class_no,callback) {
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "sales_tax_no=" + sale_tax_no + " and tax_class_no=" + tax_class_no,
                sort_expression: ""
            }
            page.salestaxclassAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                if (data.length > 0)
                    callback(true);
                else
                    callback(false);
            })
        }
        page.events.btnSaveTax_click = function () {
            $$("btnSaveTax").disable(true);
            
            try{
                if ($$("txtSalesTaxName").value() == "" || $$("txtSalesTaxName").value() == null || $$("txtSalesTaxName").value() == undefined) {
                    throw"Sales tax name should not be empty";
                }
                if ($$("txtTaxPer").value() == "" || $$("txtTaxPer").value() == null || typeof $$("txtTaxPer").value() == "undefined" || isNaN($$("txtTaxPer").value())) {
                    throw"Percentage value should be a number and not empty";
                }
                if ($$("txtCentralGST").value() == "" || $$("txtCentralGST").value() == null || typeof $$("txtCentralGST").value() == "undefined" || isNaN($$("txtCentralGST").value())) {
                    throw"CGST value should be a number and not empty";
                }
                if ($$("txtStateGST").value() == "" || $$("txtStateGST").value() == null || typeof $$("txtStateGST").value() == "undefined" || isNaN($$("txtStateGST").value())) {
                    throw"SGST value should be a number and not empty";
                }
                if ($$("txtItemGST").value() == "" || $$("txtItemGST").value() == null || typeof $$("txtItemGST").value() == "undefined" || isNaN($$("txtItemGST").value())) {
                    throw"IGST value should be a number and not empty";
                }
                if ($$("txtCessAmount").value() == "" || $$("txtCessAmount").value() == null || typeof $$("txtCessAmount").value() == "undefined" || isNaN($$("txtCessAmount").value())) {
                    throw "Cess amount should be a number and not empty";
                }
                if ($$("txtCessPer").value() == "" || $$("txtCessPer").value() == null || typeof $$("txtCessPer").value() == "undefined" || isNaN($$("txtCessPer").value())) {
                    throw "Cess % should be a number and not empty";
                }
                if ($$("txtCessQty").value() == "" || $$("txtCessQty").value() == null || typeof $$("txtCessQty").value() == "undefined" || isNaN($$("txtCessQty").value())) {
                    throw "Cess qty should be a number and not empty";
                }
                if (parseFloat($$("txtTaxPer").value()) != (parseFloat($$("txtCentralGST").value()) + parseFloat($$("txtStateGST").value()) + parseFloat($$("txtItemGST").value()) + parseFloat($$("txtCessPer").value()))) {
                    throw "Total Tax Value Not Matching With The Splited Tax Value";
                }
                if (page.sales_tax_class_no == null || page.sales_tax_class_no == '' || page.sales_tax_class_no == undefined) {
                    isTaxAlreadyExsists(page.sales_tax_no, $$("ddlTaxName").selectedValue(), function (boolean) {
                        if (!boolean) {
                            var data = {
                                sales_tax_no: page.sales_tax_no,
                                tax_class_no: $$("ddlTaxName").selectedValue(),
                                tax_per: $$("txtTaxPer").value(),
                                cgst: ($$("txtCentralGST").value() == "" || $$("txtCentralGST").value() == null || typeof $$("txtCentralGST").value() == "undefined") ? 0 : $$("txtCentralGST").value(),
                                sgst: ($$("txtStateGST").value() == "" || $$("txtStateGST").value() == null || typeof $$("txtStateGST").value() == "undefined") ? 0 : $$("txtStateGST").value(),
                                igst: ($$("txtItemGST").value() == "" || $$("txtItemGST").value() == null || typeof $$("txtItemGST").value() == "undefined") ? 0 : $$("txtItemGST").value(),
                                cess_per: ($$("txtCessPer").value() == "" || $$("txtCessPer").value() == null || typeof $$("txtCessPer").value() == "undefined") ? 0 : $$("txtCessPer").value(),
                                cess_qty: ($$("txtCessQty").value() == "" || $$("txtCessQty").value() == null || typeof $$("txtCessQty").value() == "undefined") ? 0 : $$("txtCessQty").value(),
                                cess_qty_amount: ($$("txtCessAmount").value() == "" || $$("txtCessAmount").value() == null || typeof $$("txtCessAmount").value() == "undefined") ? 0 : $$("txtCessAmount").value(),
                                comp_id: localStorage.getItem("user_company_id"),
                            };
                            $$("msgPanel").show("Inserting tax for sales tax...!");
                            page.salestaxclassAPI.postValue(data, function (data) {
                                $$("msgPanel").show("Tax inserted successfully...!");
                                $$("btnSaveTax").disable(false);
                                var data = {
                                    start_record: 0,
                                    end_record: "",
                                    filter_expression: "sales_tax_no=" + page.sales_tax_no,
                                    sort_expression: ""
                                }
                                page.salestaxclassAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                    $$("grdTaxResult").dataBind(data);
                                    $$("msgPanel").hide();
                                    page.sales_tax_class_no = null;
                                });
                            });
                            $$("ddlTaxName").selectedValue('');
                            $$("txtTaxPer").val('');
                            $$("txtCentralGST").value('');
                            $$("txtStateGST").value('');
                            $$("txtItemGST").value('');
                        } else {
                            alert("This tax class is already mapped and seems to be duplicate..!");
                        }
                    })

                } else {
                    var data = {
                        sales_tax_class_no: page.sales_tax_class_no,
                        sales_tax_no: page.sales_tax_no,
                        tax_class_no: $$("ddlTaxName").selectedValue(),
                        tax_per: $$("txtTaxPer").value(),
                        cgst: $$("txtCentralGST").value(),
                        sgst: $$("txtStateGST").value(),
                        igst: $$("txtItemGST").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                    };

                    $$("msgPanel").show("Updating tax for sales tax...!");
                    page.salestaxclassAPI.putValue(page.sales_tax_class_no, data, function (data1) {
                        $$("msgPanel").show("Tax updated successfully...!");
                        $$("btnSaveTax").disable(false);
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "sales_tax_no=" + page.sales_tax_no,
                            sort_expression: ""
                        }
                        page.salestaxclassAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("grdTaxResult").dataBind(data);
                            $$("msgPanel").hide();
                            page.sales_tax_class_no = null;
                        });
                    });
                    $$("ddlTaxName").selectedValue('');
                    $$("txtTaxPer").val('');
                    $$("txtCentralGST").value('');
                    $$("txtStateGST").value('');
                    $$("txtItemGST").value('');
                }
                page.controls.pnlTaxAddPopup.close();

            }
            catch (e) {
                alert(e);
                $$("btnSaveTax").disable(false);
            }
        };
        page.events.btnBeforeDelete1_click = function () {
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
        page.events.btnRemove1ConfirmPopupClose_click = function () {
            page.controls.pnlRemove1ConfirmPopup.close();
        }
        page.events.btnDelete1_click = function () {
            try {
                $$("msgPanel").show("Removing tax...!");
                if (page.sales_tax_class_no == null || page.sales_tax_class_no == "" || page.sales_tax_class_no == undefined)
                    throw "Please select the tax";
                var data = {
                    sales_tax_class_no: page.sales_tax_class_no
                }
                page.salestaxclassAPI.deleteValue(page.sales_tax_class_no, data, function (data) {
                    $$("msgPanel").show("Tax removed successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "sales_tax_no=" + page.sales_tax_no,
                        sort_expression: ""
                    }
                    page.salestaxclassAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("grdTaxResult").dataBind(data);
                        page.sales_tax_class_no = null;
                        $$("msgPanel").hide();
                        page.controls.pnlRemove1ConfirmPopup.close();
                    });
                });
            } catch (e) {
                $$("msgPanel").show(e);
            }
        };
    });
};