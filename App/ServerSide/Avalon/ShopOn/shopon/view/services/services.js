/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.servicesPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        
        document.title = "Avalon - Services";

        page.serviceAPI = new ServiceAPI();
        page.stateAPI = new StateAPI();
        page.service_no = null;

        page.events = {
            page_load: function () {

                page.stateAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlStatus").dataBind(data, "state_no", "state_name");
                });
                page.events.btnSearch_click();

            },
            btnSearch_click: function () {
                var filter = "";
                if ($$("txtSearchInput").val() != "" && $$("txtSearchInput").val() != null && typeof $$("txtSearchInput").val() != "undefined") {
                    filter = "brand_name like '%" + $$("txtSearchInput").val() + "%' or model_name like '%" + $$("txtSearchInput").val() + "%' or ptype_name like '%" + $$("txtSearchInput").val() + "%' or state_name like '%" + $$("txtSearchInput").val() + "%' or cust_name like '%" + $$("txtSearchInput").val() + "%' or contact_number like '%" + $$("txtSearchInput").val() + "%'";
                }
                page.serviceAPI.searchValues("", "", "", "service_no desc", filter, function (data) {
                    page.view.selectedSearchGrid(data);
                });
                page.view.selectedPanel("search");
            },
            btnSave_click: function () {
                var data = {
                    service_no: page.service_no,
                    state_no: $$("ddlStatus").selectedValue()
                }
                page.serviceAPI.putValue(page.service_no, data, function (data) {
                    alert("Service Status Changed Successfully...!!!");
                    page.serviceAPI.searchValues("", "", "st.service_no = " + page.service_no, "", "", function (data) {
                        $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                        $$("grdSearchResult").selectedRows()[0].click();
                    });
                });
            }
        }
        page.view = {
            selectedSearchGrid: function (data) {
                $$("grdSearchResult").width("100%");
                $$("grdSearchResult").height("480px");
                $$("grdSearchResult").setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "ID", 'width': "80px", 'dataField': "service_no" },
                        { 'name': "Cust Name", 'width': "150px", 'dataField': "cust_name" },
                        { 'name': "Status", 'width': "150px", 'dataField': "state_name" }
                    ]
                });
                $$("grdSearchResult").selectionChanged = function (row, item) {
                    page.service_no = item.service_no;
                    $$("txtPtypeName").val(item.ptype_name);
                    $$("txtBrand").val(item.brand_name);
                    $$("txtModel").val(item.model_name);
                    $$("txtProblemDetails").val(item.statement);
                    $$("txtServiceType").val(item.service_type_name);
                    $$("txtAddress").val(item.address);
                    $$("txtContactNumber").val(item.contact_number);
                    $$("ddlStatus").selectedValue(item.state_no);
                    page.view.selectedPanel("click");
                    (item.service_type_no == "2") ? $$("pnlAddress").show() : $$("pnlAddress").hide();
                }
                page.controls.grdSearchResult.rowBound = function (row, item) {
                    $(row[0]).css("font-weight", "bold");
                    if (item.state_no == "1") {
                        row[0].style.color = "red";
                    }
                    if (item.state_no == "2") {
                        row[0].style.color = "#0b3dca";
                    }
                    if (item.state_no == "3") {
                        row[0].style.color = "#a21254";
                    }
                    if (item.state_no == "4") {
                        row[0].style.color = "#ec9209";
                    }
                    if (item.state_no == "5") {
                        row[0].style.color = "#1d6b04";
                    }
                    if (item.state_no == "6") {
                        row[0].style.color = "#981010";
                    }
                    if (item.state_no == "7") {
                        row[0].style.color = "#ca0bc4";
                    }
                }
                $$("grdSearchResult").dataBind(data);
            },
            selectedPanel: function (panel) {
                if (panel == "search") {
                    $$("pnlDetailSection").hide();
                }
                if (panel == "click") {
                    $$("pnlDetailSection").show();
                }
            },
        }
        
    });
};

