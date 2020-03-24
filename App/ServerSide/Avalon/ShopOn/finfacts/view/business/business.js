/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.businessPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.businessService = new BusinessService();
        page.bus_id = null;
        document.title = "ShopOn - Business";
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
                page.events.btnDelete_click();
            }
        });

        page.events.btnNew_click = function () {
            var data = '';
            $$("pnlDetail").show();
            $$("pnlTemplate").hide();
            $$("txtBusinessId").hide();
            $$("txtBusinessId").val('');
            $$("txtBusinessName").val('');
            $$("txtBusinessDescription").val('');
            //$$("dsStartDate").setDate('');
            $$("grdtemplate").dataBind([]);
            page.bus_id = null;
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("txtBusinessName").focus();
        };
        page.businessService.getBusiness(function (data) {
            $$("grdBusinessResult").dataBind(data);
        });
        page.events.page_load = function () {
            $$("txtSearch").val('');
            $$("pnlDetail").hide();
            $$("pnlTemplate").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("txtBusinessId").disable(true);
            $$("grdBusinessResult").width("100%");
            $$("grdBusinessResult").height("350px");
            $$("grdBusinessResult").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Business Id", 'width': "20%", 'dataField': "bus_id" },
                    { 'name': "Business Name", 'width': "60%", 'dataField': "bus_name" },
                ]
            });

            $$("grdBusinessResult").selectionChanged = function (row, item) {
                page.bus_id = item.bus_id;
                $$("txtBusinessId").show();
                $$("pnlDetail").show();
                $$("pnlTemplate").show();
                 $$("txtBusinessId").value(item.bus_id);
                 $$("txtBusinessName").value(item.bus_name);
                 $$("txtBusinessDescription").value(item.bus_desc);
                 page.businessService.getTemplateAccess(item.bus_id, function (data) {
                     $$("grdtemplate").dataBind(data);
                });
                $$("btnDelete").show();
                $$("btnSave").show();
                $$("txtBusinessName").focus();
            };
            $$("grdBusinessResult").dataBind([]);
            $$("grdtemplate").width("100%");
            $$("grdtemplate").height("267px");
            $$("grdtemplate").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Temp Id", 'width': "10%", 'dataField': "template_id" },
                    { 'name': "Temp Access Id", 'width': "25%", 'dataField': "acc_id" },
                    { 'name': "Temp", 'width': "15%", 'dataField': "actives" },
                    { 'name': "Temp Name", 'width': "30%", 'dataField': "template_name" }
                ]
            });
            $$("grdtemplate").dataBind([]);
            $$("grdtemplate").selectionChanged = function (row, item) {
                page.acc_id = item.acc_id;
            }
            page.businessService.getTemplate(function (data) {
                $$("ddlTemplateName").dataBind(data, "template_id", "template_name", "Select");
            });
            $$("txtSearch").focus();
        };


        page.events.btnSave_click = function () {
            //$(".detail-info").progressBar("show")
           $$("msgPanel").show("Inserting new busineess...");
           if (page.bus_id == null || page.bus_id == '') {
                var data = {
                    bus_name: $$("txtBusinessName").value(),
                    bus_desc: $$("txtBusinessDescription").value(),
                };
                if (data.bus_name == "" || data.bus_name == null || data.bus_name == undefined) {
                    $$("msgPanel").show("Busineess name is Mandatory...!");
                    $$("txtBusinessName").focus();
                }
                else if (data.bus_name != "" && !isNaN(data.bus_name)) {
                    $$("msgPanel").show("Busineess name should only contains characters ...!");
                    $$("txtBusinessName").focus();
                }
                else {
                    page.businessService.insertBusiness(data, function (data) {
                        //$(".detail-info").progressBar("hide")
                        var sss = {
                            bus_id: data[0].key_value
                        }
                        $$("msgPanel").show("Busineess added successfully...!");
                        page.businessService.getBusinessById(sss,function (data) {
                            $$("grdBusinessResult").dataBind(data);
                            $$("grdBusinessResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                }
                page.events.btnNew_click();
            }
            else  {
 //$(".detail-info").progressBar("show")
               $$("msgPanel").show("Updating busineess...");
                var data = {
                    bus_id: page.bus_id,
                    bus_name: $$("txtBusinessName").value(),
                    bus_desc: $$("txtBusinessDescription").value(),
                };
                if (data.bus_name == "" || data.bus_name == null || data.bus_name == undefined) {
                    $$("msgPanel").show("Busineess name is Mandatory...!");
                    $$("txtBusinessName").focus();
                }
                else if (data.bus_name != "" && !isNaN(data.bus_name)) {
                    $$("msgPanel").show("Busineess name should only contains characters ...!");
                    $$("txtBusinessName").focus();
                }
                else {
                    page.businessService.updateBusiness(data, function (data1) {
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Busineess updated successfully...!");
                        page.businessService.getBusinessById(data, function (data) {
                            $$("grdBusinessResult").updateRow($$("grdBusinessResult").selectedRowIds()[0], data[0]);
                            $$("grdBusinessResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                }
                page.events.btnNew_click();
            }
            $$("btnDelete").show();
        };
        page.events.btnDelete_click = function () {
//$(".detail-info").progressBar("show")
            $$("msgPanel").show("Removing busineess details...");

            page.businessService.deleteBusiness(page.bus_id, function () {
                //$(".detail-info").progressBar("hide")
               $$("msgPanel").show("Busineess removed successfully...!");
               page.businessService.getBusiness(function (data) {
                    $$("grdBusinessResult").dataBind(data);
                    $$("msgPanel").hide();
                });
                page.events.btnNew_click();
                $$("btnSave").hide();
                $$("pnlDetail").hide();
            });

        };
        page.events.btnSearch_click = function () {
            $$("pnlDetail").hide();
            $$("pnlTemplate").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");
            page.businessService.getBusinessByIdName($$("txtSearch").val(), function (data) {
                $$("grdBusinessResult").dataBind(data);
                $$("msgPanel").hide();
                $$("txtSearch").focus();
            });
        };
        page.events.btnAddTemplate_click = function () {
            $$("pnlAddTemplatePopup").open();
            $$("pnlAddTemplatePopup").title("Template");
            $$("pnlAddTemplatePopup").width(350);
            $$("pnlAddTemplatePopup").height(250);
            $$("chkActive").prop('checked', true);
        }
        page.events.btnSaveTemplate_click = function () {
//$(".detail-info").progressBar("show")
            $$("msgPanel").show("inserting new Template access for busineess...");
            var data = {
                bus_id: page.bus_id,
                template_id: $$("ddlTemplateName").selectedValue(),
                active: $$("chkActive").prop("checked") ? 1 : 0
            };
            page.businessService.insertTemplateAccess(data, page.bus_id, function () {
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Template access added successfully...!");
                $$("pnlAddTemplatePopup").close();
                page.businessService.getTemplateAccess(page.bus_id, function (data) {
                    $$("grdtemplate").dataBind(data);
                    $$("msgPanel").hide();
                });
            });
        }
        page.events.btnRemTemplate_click = function () {
            var count=0;
            if(count>0) {
                $$("msgPanel").show("Template access cannot removed...");
            }
            else if ($$("grdtemplate").selectedData()[0] == undefined || $$("grdtemplate").selectedData()[0] == null || $$("grdtemplate").selectedData()[0] == "") {
                $$("msgPanel").show("Please select the template...!");
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Removing business details...");
                page.businessService.deleteTemplateAccess(page.acc_id, function () {
                   //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Template access removed successfully...!");
                    page.businessService.getTemplateAccess(page.bus_id, function (data) {
                        $$("grdtemplate").dataBind(data);
                        $$("msgPanel").hide();
                    });
                });
            }
        }
    });
};

