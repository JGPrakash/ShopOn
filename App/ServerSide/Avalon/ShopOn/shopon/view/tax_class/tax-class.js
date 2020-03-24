/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.fn.taxclassPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.taxclassAPI = new TaxClassAPI();
        page.tax_class_no = null;
        document.title = "ShopOn - Tax Class";
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
                page.events.btnBeforeDelete_click();
            }
        });

        page.events.btnNew_click = function () {
            $(".detail-basic").show();
            var data = '';
            page.tax_class_no = null;
            $$("txtTaxClassName").val('');
            $$("ddlClassType").selectedValue("Select");
            $$("txtHsnCode").val('');
            $$("txtSacCode").val('');
            page.controls.pnlhsn.hide();
            page.controls.pnlsac.hide();
            $$("chkActive").prop("checked",true);
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("txtTaxClassName").focus();
        };
        var data = {
            start_record: 0,
            end_record: "",
            filter_expression: "",
            sort_expression: ""
        }
        page.taxclassAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
        //page.taxclassService.getTaxClass(function (data) {
            $$("grdSearchResult").dataBind(data);
        });
        page.events.page_load = function () {
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            page.controls.pnlhsn.hide();
            page.controls.pnlsac.hide();
            $$("txtTaxClassName").val('');
           $$("txtSearchInput").val('');
            $$("chkActive").prop("checked",false);
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("460px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Class No", 'rlabel': 'No', 'width': "120px", 'dataField': "tax_class_no", visible: false },
                    { 'name': "Tax Class No", 'rlabel': 'Tax Class No', 'width': "20%", 'dataField': "tax_class_id" },
                    { 'name': "Tax Class Name", 'rlabel': 'Tax Class Name', 'width': "60%", 'dataField': "tax_class_name" }
                ]
            });
            $$("ddlClassType").selectionChange(function () {
                if ($$("ddlClassType").selectedValue() == "Goods") {
                    page.controls.pnlhsn.show();
                    page.controls.pnlsac.hide();
                }
                else if ($$("ddlClassType").selectedValue() == "Service") {
                    page.controls.pnlhsn.hide();
                    page.controls.pnlsac.show();
                }
                else {
                    page.controls.pnlhsn.hide();
                    page.controls.pnlsac.hide();
                }
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                page.tax_class_no = item.tax_class_no;
                page.selectedRowId = row.attr("row_id");
                
                $$("txtTaxClassName").value(item.tax_class_name);
                if(item.active == 1)
                    $$("chkActive").prop("checked", true);
                if(item.active == 0)
                    $$("chkActive").prop("checked", false);
                
                if (item.class_type == "Goods") {
                    page.controls.pnlhsn.show();
                    page.controls.pnlsac.hide();
                    $$("txtHsnCode").val(item.hsn_code);
                    $$("ddlClassType").selectedValue(item.class_type);
                }
                else if (item.class_type == "Service") {
                    page.controls.pnlhsn.hide();
                    page.controls.pnlsac.show();
                    $$("txtSacCode").val(item.sac_code);
                    $$("ddlClassType").selectedValue(item.class_type);
                }
                else {
                    page.controls.pnlhsn.hide();
                    $$("ddlClassType").selectedValue("Select");
                    $$("txtSacCode").val('');
                    $$("txtHsnCode").val('');
                    page.controls.pnlsac.hide();
                }
                $$("btnSave").show();
                $$("btnDelete").show();
                $(".detail-basic").show();
                $$("txtTaxClassName").focus();
            };
            $$("grdSearchResult").dataBind([]);
            $$("txtSearchInput").focus();
        };
            
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            try{
                if ($$("txtTaxClassName").value() == "" || $$("txtTaxClassName").value() == null) {
                    throw"Tax class name is mantatory...!";
                }
                if ($$("ddlClassType").selectedValue() == "Select") {
                    throw"Please select the class type";
                    $$("ddlClassType").selectedObject.focus();
                }
                if ($$("ddlClassType").selectedValue() == "Goods" && ($$("txtHsnCode").value() == "" || $$("txtHsnCode").value() == null)) {
                    throw "HSN Code Is Not Valid";
                    $$("txtHsnCode").focus();
                }
                if ($$("ddlClassType").selectedValue() == "Service" && ($$("txtSacCode").value() == "" || $$("txtSacCode").value() == null)) {
                    throw "SAC Code Is Not Valid";
                    $$("txtHsnCode").focus();
                }
                if (page.tax_class_no == null || page.tax_class_no == '') {
                    if ($$("chkActive").prop("checked")) {
                        active = 1;
                    } else {
                        active = 0;
                    }
                    var data = {
                        tax_class_name: $$("txtTaxClassName").value(),
                        class_type: $$("ddlClassType").selectedValue(),
                        active: active,
                        hsn_code: $$("txtHsnCode").value(),
                        sac_code: $$("txtSacCode").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                    };
                    $$("msgPanel").show("Inserting new tax class...!");
                    page.taxclassAPI.postValue(data, function (data) {
                        $$("msgPanel").show("Tax class saved Successfully...!");
                        $$("btnSave").disable(false);
                        page.tax_class_no = data[0].key_value;
                        var tax = {
                            tax_class_no: data[0].key_value
                        }
                        page.taxclassAPI.getValue(tax, function (data) {
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                }
                else {
                    var active;
                    if ($$("chkActive").prop("checked")) {
                        active = 1;
                    } else {
                        active = 0;
                    }
                    var data = {
                        tax_class_no: page.tax_class_no,
                        tax_class_name: $$("txtTaxClassName").value(),
                        active: active,
                        class_type: $$("ddlClassType").selectedValue(),
                        hsn_code: $$("txtHsnCode").value(),
                        sac_code: $$("txtSacCode").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                    };
                    $$("msgPanel").show("Updating tax class...!");
                    page.taxclassAPI.putValue(page.tax_class_no, data, function (data1) {
                        $$("msgPanel").show("Tax class updated Successfully...!");
                        $$("btnSave").disable(false);
                        var tax = {
                            tax_class_no: page.tax_class_no
                        }
                        page.taxclassAPI.getValue(tax, function (data) {
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                }
            }
            catch (e) {
                alert(e);
                $$("btnSave").disable(false);
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
            $$("msgPanel").show("Removing tax class...!");
            var data = {
                tax_class_no: page.tax_class_no
            }
            page.taxclassAPI.deleteValue(page.tax_class_no, data, function (data) {
                //page.taxclassService.deleteTaxClass(page.tax_class_no, function () {
                $$("msgPanel").show("Tax class removed Successfully...!");
                //$$("msgPanel").show("updating the new details..");
                //$(".detail-info").progressBar("hide")
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(tax_class_no,tax_class_name) like '%" + $$("txtSearchInput").value() + "%'",
                    sort_expression: ""
                }
                page.taxclassAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.taxclassService.getTaxClass(function (data) {
                    $$("grdSearchResult").dataBind(data);
                    page.controls.pnlRemoveConfirmPopup.close();
                    $$("msgPanel").hide();
                });
                //page.events.btnNew_click();
            });
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
        };
        page.events.btnSearch_click = function () {
            $(".detail-basic").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...!");
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(tax_class_id,tax_class_name) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.taxclassAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.taxclassService.getTaxClassByNo ($$("txtSearchInput").val(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
        };
    });
};



