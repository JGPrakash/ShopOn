/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.lookupPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        //page.companyService = new LookupService();
        page.lookupService = new LookupService();
        page.lookup_id = null;
        document.title = "ShopOn - Lookup";
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
//$$("msgPanel").show("clearing fields...");
            var data = '';
            $$("pnlDetail").show();
            $$("pnlLookupValue").hide();
            $$("txtLookupId").hide();
            $$("txtLookupId").val('');
            $$("txtLookupName").val('');
            $$("txtLookupDescription").val('');
            $$("grdLookupValue").dataBind([]);
            page.lookup_id = null;
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("txtLookupName").focus();
        };
        page.lookupService.getLookup(function (data) {
            $$("grdLookupResult").dataBind(data);
        });
        page.events.page_load = function () {
            $$("txtSearch").val('');
            $$("pnlDetail").hide();
            $$("pnlLookupValue").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("txtLookupId").disable(true);
            $$("grdLookupResult").width("100%");
            $$("grdLookupResult").height("350px");
            $$("grdLookupResult").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Id", 'width': "20%", 'dataField': "lookup_id" },
                    { 'name': "Name", 'width': "60%", 'dataField': "lookup_name" },
                ]
            });

            $$("grdLookupResult").selectionChanged = function (row, item) {
                page.lookup_id = item.lookup_id;
                $$("txtLookupId").show();
                $$("pnlDetail").show();
                $$("pnlLookupValue").show();
                 $$("txtLookupId").value(item.lookup_id);
                 $$("txtLookupName").value(item.lookup_name);
                 $$("txtLookupDescription").value(item.description);
                page.lookupService.getLookupValue(item.lookup_id, function (data) {
                    $$("grdLookupValue").dataBind(data);
                });
                $$("btnDelete").show();
                $$("btnSave").show();
                $$("txtLookupName").focus();
            };
            $$("grdLookupResult").dataBind([]);
            $$("grdLookupValue").width("100%");
            $$("grdLookupValue").height("267px");
            if (window.mobile) {
                $$("grdLookupValue").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Id", 'width': "30%", 'dataField': "lookup_val_id" },
                        { 'name': "Key Value", 'width': "30%", 'dataField': "key_value" }
                    ]
                });
            }
            else {
                $$("grdLookupValue").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Id", 'width': "150px", 'dataField': "lookup_val_id" },
                        { 'name': "Key Value", 'width': "250px", 'dataField': "key_value" }
                    ]
                });
            }
            $$("grdLookupValue").dataBind([]);
            $$("grdLookupValue").selectionChanged = function (row, item) {
                page.lookup_val_id = item.lookup_val_id;
            }
            $$("txtSearch").focus();
        };


        page.events.btnSave_click = function () {
            //$(".detail-info").progressBar("show")
            $$("msgPanel").show("Inserting new lookup...");
            if (page.lookup_id == null || page.lookup_id == '') {
                var data = {
                    lookup_name: $$("txtLookupName").value(),
                    description: $$("txtLookupDescription").value()

                };
                if (data.lookup_name == "" || data.lookup_name == null || data.lookup_name == undefined) {
                    $$("msgPanel").show("Lookup name is Mandatory...!");
                    $$("txtLookupName").focus();
                }
                else if (data.lookup_name != "" && !isNaN(data.lookup_name)) {
                    $$("msgPanel").show("Lookup name should only contains characters ...!");
                    $$("txtLookupName").focus();
                }
                else {
                    page.lookupService.insertLookup(data, function (data) {
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Lookup added successfully...!");
                        var sss = {
                            lookup_id: data[0].key_value
                        }
                        page.lookupService.getLookupById(sss, function (data) {
                            $$("grdLookupResult").dataBind(data);
                            $$("grdLookupResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            //$$("msgPanel").show("updating new data...");
                        });
                        //page.lookupService.getLookup(function (data) {
                        //    $$("grdLookupResult").dataBind(data);
                        //    $$("msgPanel").hide();
                        //    //$$("msgPanel").show("updating new data...");
                        //});
                    });
                    page.events.btnNew_click();
                }
            }
            else {
                $$("msgPanel").show("Updating lookup...");
                var data = {
                    lookup_id: page.lookup_id,
                    lookup_name: $$("txtLookupName").value(),
                    description: $$("txtLookupDescription").value()
                };
                if (data.lookup_name == "" || data.lookup_name == null || data.lookup_name == undefined) {
                    $$("msgPanel").show("Lookup name is Mandatory...!");
                    $$("txtLookupName").focus();
                }
                else if (data.lookup_name != "" && !isNaN(data.lookup_name)) {
                    $$("msgPanel").show("Lookup name should only contains characters ...!");
                    $$("txtLookupName").focus();
                }
                else {
                    page.lookupService.updateLookup(data, function (data1) {
                        $$("msgPanel").show("Lookup updated successfully...!");
                        page.lookupService.getLookupById(data, function (data) {
                            $$("grdLookupResult").updateRow($$("grdLookupResult").selectedRowIds()[0], data[0]);
                            $$("grdLookupResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            //$$("msgPanel").show("updating new data...");
                        });
                    });
                    page.events.btnNew_click();
                }
            }
            $$("btnDelete").show();
        };
        page.events.btnDelete_click = function () {
            //$(".detail-info").progressBar("show")
            page.lookupService.getLookupValue(page.lookup_id, function (data) {
                if (data.length > 0) {
                    $$("msgPanel").show("This lookup contains key value. Please remove key value first...!");
                }
                else {
                    $$("msgPanel").show("Removing lookup details...");
                    page.lookupService.deleteLookup(page.lookup_id, function () {
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Lookup removed successfully...!");
                        //$$("msgPanel").show("selected Record is deleted");
                        page.lookupService.getLookup(function (data) {
                            $$("grdLookupResult").dataBind(data);
                            $$("msgPanel").hide();
                            //$$("msgPanel").show("updating new data...");
                        });
                        page.events.btnNew_click();
                        $$("btnSave").hide();
                        $$("pnlDetail").hide();
                    });
                }
            });
        };
        page.events.btnSearch_click = function () {
            $$("pnlDetail").hide();
            $$("pnlLookupValue").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");
            page.lookupService.getLookupByIdName($$("txtSearch").val(), function (data) {
                $$("grdLookupResult").dataBind(data);
                $$("msgPanel").hide();
                $$("txtSearch").focus();
            });
        };
        page.events.btnAddLookupValue_click = function () {
            $$("pnlAddLookupValuePopup").open();
            $$("pnlAddLookupValuePopup").title("Lookup Key Value");
            $$("pnlAddLookupValuePopup").width(350);
            $$("pnlAddLookupValuePopup").height(220);
            $$("txtLookupValueName").focus();
        }
        page.events.btnSaveLookupValue_click = function () {
//$(".detail-info").progressBar("show")
            
            var data = {

                lookup_id: page.lookup_id,
                key_value: $$("txtLookupValueName").value()
            };
            if (data.lookup_id == "" || data.lookup_id == null || data.lookup_id == undefined) {
                alert("Please select the lookup...!");
                $$("txtLookupValueName").focus();
            }
            else if (data.key_value == "" || data.key_value == null || data.key_value == undefined)
            {
                alert("Lookup key value is Mandatory...!");
                $$("txtLookupValueName").focus();
            }
            //if (data.lookup_name != "" && !isNaN(data.lookup_name)) {
            //    $$("msgPanel").show("Lookup key value should only contains characters ...!");
            //}
            else {
            $$("msgPanel").show("inserting new key value for lookup...");
            page.lookupService.insertLookupValue(data, page.lookup_id, function () {
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Key value added successfully...!");
                $$("pnlAddLookupValuePopup").close();
                page.lookupService.getLookupValue(page.lookup_id, function (data) {
                    $$("grdLookupValue").dataBind(data);
                    $$("msgPanel").hide();
                    $$("txtLookupValueName").value('');
                    //$$("msgPanel").show("updating new data...");
                });
            });
          }
        }
        page.events.btnRemLookupValue_click = function () {
            var count=0;
            if(count>0) {
                $$("msgPanel").show("Key value cannot removed...");
            }
            else if ($$("grdLookupValue").selectedData()[0] == undefined ||$$("grdLookupValue").selectedData()[0] == null || $$("grdLookupValue").selectedData()[0] == "") {
                $$("msgPanel").show("Please select the lookup key value...!");
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Removing lookup details...");
                page.lookupService.deleteLookupValue(page.lookup_val_id, function () {
                   //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Key value removed successfully...!");
                    page.lookupService.getLookupValue(page.lookup_id, function (data) {
                        $$("grdLookupValue").dataBind(data);
                        //$$("msgPanel").show("updating new data...");
                        $$("msgPanel").hide();
                    });
                });
            }
        }
    });
};

