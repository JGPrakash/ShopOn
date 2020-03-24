$.fn.subscriptionCust = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.SubscriptionAPI = new SubscriptionAPI();
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
                page.events.btnNewSubs_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSaveSubs_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnRemoveSubs_click();
            }

        });
        page.events = {
            page_load: function () {
                $$("txtSearch").focus();
                $(".detail-info").hide();
                $$("btnSaveCustomer").hide();
                $$("btnRemoveCustomer").hide();
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.controls.ddlCustomer.dataBind(item);
                    //page.customer = item;
                });
                page.controls.grdSearchResult.width("100%");
                page.controls.grdSearchResult.height("500px");
                page.controls.grdSearchResult.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Subs Id", 'width': "100px", 'dataField': "sub_id" },
                        { 'name': "Plan Name", 'width': "100px", 'dataField': "Plan_name" },
                        { 'name': "Customer Name", 'width': "150px", 'dataField': "cust_name" },

                    ]
                });
                page.controls.grdSearchResult.selectionChanged = page.events.grdSearchResult_select;
                page.controls.grdSearchResult.dataBind([]);

            },
            btnNewSubs_click: function () {
                $$("ddlCustomer").selectedObject.val('');
                $$("btnSaveSubs").show();
                $(".detail-info").show();
                $$("btnRemoveSubs").hide();
            },
            btnSaveSubs_click: function () {
                if (data.sub_id == "") {        //insert query
                    var data = {
                        no_of_ip: $$("txtIPAddress").value(),
                        static_routing: $$("txtGroupName").value(),
                        bgp: $$("txtGroupName").value(),
                        item_no: $$("txtPlanSearch").selectedObject.val(),
                        service_provider: $$("txtServiceProvider").val(),
                        media: $$("txtMedia").val(),
                        end_interface: $$("txtInterface").val(),
                        equipment_by: $$("txEquipmentBy").val(),
                        comp_id: "",
                        store_no: "",
                        cust_id: "",
                    }
                    $$("msgPanel").show("Inserting Subscription...");
                    page.SubscriptionAPI.postValue(data, function (data1) {
                        page.sub_id = data1[0].key_value;
                        $$("msgPanel").show("Subscription saved successfully...!");

                    });
                    page.SubscriptionAPI.getValue(data1, function (data) {
                        $$("grdSearchResult").dataBind(data);

                    });
                    $$("msgPanel").hide();
                } //update query
                else {
                    var data = {
                        no_of_ip: $$("txtIPAddress").value(),
                        static_routing: $$("txtGroupName").value(),
                        bgp: $$("txtGroupName").value(),
                        item_no: $$("txtPlanSearch").selectedObject.val(),
                        service_provider: $$("txtServiceProvider").val(),
                        media: $$("txtMedia").val(),
                        end_interface: $$("txtInterface").val(),
                        equipment_by: $$("txEquipmentBy").val(),
                        comp_id: "",
                        store_no: "",
                        cust_id: "",
                    }
                    $$("msgPanel").show("Inserting Subscription...");
                    page.SubscriptionAPI.putValue(data, function (data1) {
                        page.sub_id = data1[0].key_value;
                        $$("msgPanel").show("Subscription updated successfully...!");

                    });
                    page.SubscriptionAPI.getValue(data1, function (data) {
                        $$("grdSearchResult").dataBind(data);

                    });
                    $$("msgPanel").hide();
                }
                $$("btnRemoveSubs").show();
                $$("btnNewSubs").show();
            },
            btnRemoveSubs_click: function () {
                if (data.sub_id == "") {
                    $$("msgPanel").show("Please select the subscription...!");
                }
                else {
                    page.SubscriptionAPI.deleteValue(data.sub_id, data, function (data) {
                        $$("msgPanel").show("Subscription removed successfully...!");
                    });
                    page.SubscriptionAPI.getValue(data1, function (data) {
                        $$("grdSearchResult").dataBind(data);

                    });
                    $$("msgPanel").hide();
                }
            },
            btnSearch_click: function () {
                $(".detail-info").hide();
                $$("btnSaveSubs").hide();
                $$("btnRemoveSubs").hide();
                $$("msgPanel").show("Searching...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.controls.grdSearchResult.dataBind(item);
                });
                $$("msgPanel").hide();
            },
            btnInstallationAddress_click: function () {
                $$("pnlInstallationAddress").open();
                $$("pnlInstallationAddress").title("InstallationAddress");
                $$("pnlInstallationAddress").width(350);
                $$("pnlInstallationAddress").height(200);
            },
            btnSaveAddress_click: function () {

            },
        }
    });
}