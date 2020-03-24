/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.companyPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.companyService = new CompanyService();
        page.busService = new BusinessService();
        page.settService = new SettingService();
        page.revenueService = new RevenueService();

        page.companyAPI = new CompanyAPI();
        page.comp_id = null;
        document.title = "ShopOn - Company";
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            //if (keyCode == 112) {
            //    e.preventDefault();
            //    page.events.btnNew_click();
            //}
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            //if (e.keyCode == 82 && e.ctrlKey) {
            //    e.preventDefault();
            //    page.events.btnDelete_click();
            //}
        });

        page.events.btnNew_click = function () {
//$$("msgPanel").show("clearing fields...");
            var data = '';
            $$("pnlDetail").show();
            $$("pnlPeriod").hide();
            //$$("txtCompanyId").hide();
            $$("txtCompanyId").val('');
            $$("txtCompanyName").val('');
            //$$("dsStartDate").setDate('');
            $$("dsStartDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            $$("grdPeriod").dataBind([]);
            page.comp_id=null;
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("txtCompanyName").focus();
        };
        //page.companyService.getCompany(function (data) {
        //    $$("grdCompanyResult").dataBind(data);
        //});
        page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
            $$("grdCompanyResult").dataBind(data);
        });
        page.events.page_load = function () {
            $$("txtSearch").val('');
            $$("pnlDetail").hide();
            $$("pnlPeriod").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("txtCompanyId").disable(true);

            page.busService.getBusiness(function (data) {
                $$("ddlBusiness").dataBind(data, "bus_id", "bus_name");
            });

            $$("grdCompanyResult").width("100%");
            $$("grdCompanyResult").height("350px");
            $$("grdCompanyResult").setTemplate({
                selection: "Single", paging: true, pageSize: 10,
                columns: [
                    {'name': "Company Id", 'width': "150px", 'dataField': "comp_id"},
                    {'name': "Company Name", 'width': "150px", 'dataField': "comp_name"},
                ]
            });

            $$("grdCompanyResult").selectionChanged = function (row, item) {
                page.comp_id = item.comp_id;
                $$("txtCompanyId").show();
                $$("pnlDetail").show();
                 $$("pnlPeriod").show();
                $$("txtCompanyId").value(item.comp_id);
                $$("txtCompanyName").value(item.comp_name);
                $$("dsStartDate").setDate(item.start_date);
                $$("ddlBusiness").selectedValue(item.bus_id);
                page.companyService.getPeriod(item.comp_id, function (data) {
                    $$("grdPeriod").dataBind(data);
                });
                page.settService.getAllSettings(function (finfactsData) {
                    $(finfactsData).each(function (i, item) {
                        if (item.sett_key == "FINFACTS_CURRENT_PERIOD") {
                            page.period = item.sett_no;
                            page.revenueService.getPeriod(page.comp_id, function (periodData) {
                                $$("ddlPeriod").dataBind(periodData, "per_id", "per_name", "Select");
                                $$("ddlPeriod").selectedValue(item.value_1);
                            });
                        }
                    });
                });
                //$$("btnDelete").show();
                $$("btnSave").show();
                $$("txtCompanyName").focus();
                $$("btnNew").hide();
                $$("btnDelete").hide();
            };
            $$("grdCompanyResult").dataBind([]);
            $$("grdPeriod").width("100%");
            $$("grdPeriod").height("230px");
            $$("grdPeriod").setTemplate ({
                selection: "Single", paging: true, pageSize: 20,
                columns: [
                    {'name':"Period Id", 'width':"100px", 'dataField':"per_id"},
                    {'name':"Period Name", 'width':"180px", 'dataField':"per_name"}
                ]
            });
            $$("grdPeriod").dataBind([]);
            $$("grdPeriod").selectionChanged = function (row, item) {
                page.per_id = item.per_id;
            }

            $$("btnNew").hide();
            $$("btnDelete").hide();
            $$("txtSearch").focus();
        };


        page.events.btnSave_click = function () {
            //$(".detail-info").progressBar("show")
           
            if (page.comp_id == null || page.comp_id == '') {
                $$("msgPanel").show("Inserting new company...");
                var data = {
                  //  comp_id: $$("txtCompanyId").value(),
                    comp_name: $$("txtCompanyName").value(),
                    start_date: $$("dsStartDate").getDate(),
                    bus_id: $$("ddlBusiness").selectedValue()

                };
                page.companyService.insertCompany(data, function (data) {
                    //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Company added successfully...!");
                    //page.companyService.getCompany(function (data) {
                    var data = {
                        comp_id: data[0].key_value
                    }
                    page.companyService.getCompanyById(data, function (data) {
                        $$("grdCompanyResult").dataBind(data);
                        $$("grdCompanyResult").getAllRows()[0].click();
                        //page.events.btnNew_click();
                        $$("msgPanel").hide();
                        //$$("msgPanel").show("updating new data...");
                    });
                });
                
            }
            else  {
 //$(".detail-info").progressBar("show")
           $$("msgPanel").show("Updating company...");
                var data = {
                    comp_id:page.comp_id,
                 //   comp_id: $$("txtCompanyId").value(),
                    comp_name: $$("txtCompanyName").value(),
                    start_date: $$("dsStartDate").getDate(),
                    bus_id: $$("ddlBusiness").selectedValue()
                };
                page.companyService.updateCompany(data, function (data1) {
                     //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Company updated successfully...!");
                    data1 = {
                        comp_id: data.comp_id
                    };
                    //Period
                    var data1 = {
                        sett_no: page.period,
                        sett_desc: 'Period',
                        sett_key: 'FINFACTS_CURRENT_PERIOD',
                        value_1: $$("ddlPeriod").selectedValue(),
                        value_2: "Finfacts",
                        value_3: "Dropdown",
                    }
                    $$("msgPanel").show("Updating period...");
                    page.settService.updateSetting(data1, function () {
                        $$("msgPanel").show("Period Updated successfully...!");
                        page.companyService.getCompanyById(data1, function (data) {
                            // $$("grdCompanyResult").dataBind(data);
                            $$("grdCompanyResult").updateRow($$("grdCompanyResult").selectedRowIds()[0], data[0]);
                            $$("grdCompanyResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            //page.events.btnNew_click();
                            //$$("msgPanel").show("updating new data...");
                        });
                    });
                    
                });
                
            }
            $$("btnDelete").show();
        };
        page.events.btnDelete_click = function () {
//$(".detail-info").progressBar("show")
           $$("msgPanel").show("Removing company details...");

            page.companyService.deleteCompany(page.comp_id, function () {
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Company removed successfully...!");
                //$$("msgPanel").show("selected Record is deleted");
                page.companyService.getCompany(function (data) {
                    $$("grdCompanyResult").dataBind(data);
                    $$("msgPanel").hide();
                    //$$("msgPanel").show("updating new data...");
                });
                page.events.btnNew_click();
                $$("btnSave").hide();
                $$("pnlDetail").hide();
            });

        };
        page.events.btnSearch_click = function () {
            $$("pnlDetail").hide();
            $$("pnlPeriod").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");
            //page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
            page.companyService.getCompanyByIdName("%"+$$("txtSearch").value()+"%", function (data) {
                $$("grdCompanyResult").dataBind(data);
                $$("msgPanel").hide();
                $$("txtSearch").focus();
            });
        };
        page.events.btnAddPeriod_click = function () {

            $$("pnlAddPeriodPopup").open();
            $$("pnlAddPeriodPopup").title("Period");
            $$("pnlAddPeriodPopup").width(350);
            $$("pnlAddPeriodPopup").height(220);

        }
        page.events.btnSavePeriod_click = function () {
//$(".detail-info").progressBar("show")
           $$("msgPanel").show("inserting new period for company...");
            var data = {

                comp_id: page.comp_id,
                per_name: $$("txtPeriodName").value()
            };
            page.companyService.insertPeriod(data, page.comp_id, function () {
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Period added successfully...!");
                $$("pnlAddPeriodPopup").close();
                page.companyService.getPeriod(page.comp_id, function (data) {
                    $$("grdPeriod").dataBind(data);
                    $$("msgPanel").hide();
                    //$$("msgPanel").show("updating new data...");
                });
            });
        }
        page.events.btnRemPeriod_click = function () {
            var count=0;
            if(count>0) {
                $$("msgPanel").show("Period cannot removed...");
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Removing company details...");
                page.companyService.deletePeriod(page.per_id, function () {
                   //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Period removed successfully...!");
                    page.companyService.getPeriod(page.comp_id, function (data) {
                        $$("grdPeriod").dataBind(data);
                        //$$("msgPanel").show("updating new data...");
                        $$("msgPanel").hide();
                    });
                });
            }
        }
    });
};

