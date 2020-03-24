$.fn.subscriptionCust = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.SubscriptionAPI = new SubscriptionAPI();
        page.SubscriptionPlanAPI = new SubscriptionPlanAPI();
        page.customerAPI = new CustomerAPI();
        page.citystateAPI = new CityStateAPI();
        page.cityAPI = new CityAPI();
        page.itemAPI = new ItemAPI();
        page.stockAPI = new StockAPI();
        page.dynaReportService = new DynaReportService();
        page.chk_state = 0;
        page.chk_city = 0;
        page.sub_plan_id = null;
        page.template("/" + appConfig.root + '/shopon/view/customer/customer-subscription/subscription.html');
        page.clearPlans = function () {
            $$("ddlPlan").selectedValue('');
            $$("ddlBillDate").selectedValue('1');
            $$("dsSubPlanStartDate").selectedObject.val('');
            $$("txtPlanPrice").value("");
        }
        page.events = {
            btnAdd_click: function () {
                $$("pnlConnGridPopup").hide();
                $$("pnlConnDetailPopup").show();
                $$("pnlConnPlanPopup").hide();
                if (CONTEXT.ENABLE_SUBSCRIPTION_IP_DETAILS) {
                    $$("pnlIpDetails").show();
                } else {
                    $$("pnlIpDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS) {
                    $$("pnlLastMileDetails").show();
                } else {
                    $$("pnlLastMileDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_BILLING_DETAILS) {
                    $$("pnlBillingDetails").show();
                } else {
                    $$("pnlBillingDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS) {
                    $$("pnlInstallationAddress").show();
                } else {
                    $$("pnlInstallationAddress").hide();
                }
                page.clearfields();
                page.enableFields();
                page.sub_id = null;
                page.loadData(function () {
                    $$("grdPlanHistory").dataBind([]);
                });
                $$("txtConnectionName").focus();
                $$("dsSubSaveConnEndDate").selectedObject.val("");
                $$("ddlSubPlan").selectedValue("-1");
                $$("txtSubPrice").value("");
                $$("ddlSubBillDate").selectedValue("1");
                $$("ddlSubPlan").selectionChange(function () {
                    page.stockAPI.searchCurrentPricesMain($$("ddlSubPlan").selectedValue(), localStorage.getItem("user_store_no"), function (data) {
                        page.controls.ddlSubPrice.dataBind(data, "var_no", "price");
                        $$("txtSubPrice").value(data[0].price);
                        
                    });
                });
                $$("pnlAddSubscriptionPlan").show();
                $$("btnBillNow").hide();
                $('#dsSubSaveConnEndDate').focusout(function () {
                    //if ($$("dsSubSaveConnEndDate").getDate() == "") {
                    //    $$("btnBillNow").hide();
                    //}
                    //else {
                    $$("btnBillNow").show();
                    //}
                });
            },
            btnAddPlan_click: function () {
                $$("pnlConnGridPopup").hide();
                $$("pnlConnDetailPopup").show();
                if (CONTEXT.ENABLE_SUBSCRIPTION_IP_DETAILS) {
                    $$("pnlIpDetails").show();
                } else {
                    $$("pnlIpDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS) {
                    $$("pnlLastMileDetails").show();
                } else {
                    $$("pnlLastMileDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_BILLING_DETAILS) {
                    $$("pnlBillingDetails").show();
                } else {
                    $$("pnlBillingDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS) {
                    $$("pnlInstallationAddress").show();
                } else {
                    $$("pnlInstallationAddress").hide();
                }
                page.clearPlans();
                $$("pnlAddPlanPopup").open();
                $$("pnlAddPlanPopup").title("Add Plan");
                $$("pnlAddPlanPopup").rlabel("Add Plan");
                $$("pnlAddPlanPopup").width(600);
                $$("pnlAddPlanPopup").height(250);
            },
            btnBack_click: function () {
                $$("pnlConnGridPopup").show();
                $$("pnlConnDetailPopup").hide();
            },
            btnSubSave_click: function () {
                try {
                    //if ($$("txtConnectionName").value() == "" || $$("txtConnectionName").value() == null) {
                    //    $$("txtConnectionName").focus();
                    //    throw "Connection Name Is Not Empty";
                    //}
                    if ($$("ddlSubPlan").selectedValue() == "-1") {
                        throw "Ad Name Is Not Selected";
                        $$("ddlSubPlan").focus();
                    }
                    if ($$("dsSubConnStartDate").getDate() == "" || $$("dsSubConnStartDate").getDate() == null) {
                        throw "Please Choose Starting Date";
                    }
                    if ($$("txtSubBillPhone").value() != "" && $$("txtSubBillPhone").value().length != 10) {
                        $$("txtSubBillPhone").focus();
                        throw "Phone No should be 10 in length...!";
                    }
                    if ($$("txtSubBillPhone").value() != "" && !isInt($$("txtSubBillPhone").value())) {
                        $$("txtSubBillPhone").focus();
                        throw "Phone No is not valid. It must be a number...!";
                    }
                    if ($$("txtSubInsPhone").value() != "" && $$("txtSubInsPhone").value().length != 10) {
                        $$("txtSubInsPhone").focus();
                        throw "Phone No should be 10 in length...!";
                    }
                    if ($$("txtSubInsPhone").value() != "" && !isInt($$("txtSubInsPhone").value())) {
                        $$("txtSubInsPhone").focus();
                        throw "Phone No is not valid. It must be a number...!";
                    }
                    if ($$("txtSubBillPincode").selectedObject.val() != "" && isNaN($$("txtSubBillPincode").selectedObject.val())) {
                        $$("txtSubBillPincode").focus();
                        throw "Pincode should be a number...!";
                    }
                    if ($$("txtSubBillPincode").selectedObject.val() != "" && ($$("txtSubBillPincode").selectedObject.val().length != 6)) {
                        $$("txtSubBillPincode").focus();
                        throw "Pincode should be a 6 in length...!";
                    }
                    if ($$("txtSubInsPincode").selectedObject.val() != "" && isNaN($$("txtSubInsPincode").selectedObject.val())) {
                        $$("txtSubInsPincode").focus();
                        throw "Pincode should be a number...!";
                    }
                    if ($$("txtSubInsPincode").selectedObject.val() != "" && ($$("txtSubInsPincode").selectedObject.val().length != 6)) {
                        $$("txtSubInsPincode").focus();
                        throw "Pincode should be a 6 in length...!";
                    }
                    if ($$("txtSubBillEmail").value() != "" && !ValidateEmail($$("txtSubBillEmail").value())) {
                        $$("txtSubBillEmail").focus();
                        throw "Email address is not valid...!";
                    }
                    if ($$("txtSubInsEmail").value() != "" && !ValidateEmail($$("txtSubInsEmail").value())) {
                        $$("txtSubInsEmail").focus();
                        throw "Email address is not valid...!";
                    }
                    var start_date = $$("dsSubConnStartDate").getDate();
                    if (page.sub_id == null || page.sub_id == '' || page.sub_id == undefined) { //insert query
                        var data = {
                            cust_id: page.cust_id,
                            collection_type: $$("ddlSubCollectionType").selectedValue(),
                            //     coll_days: $$("txtSubCollDay").value(),
                            no_of_ip: $$("txtRequiredIP").value(),
                            static_routing: $("#radiodStaticRouterYes").prop("checked") ? 1 : 0,
                            bgp: $("#radiodBGPYes").prop("checked") ? 1 : 0,
                            service_provider: $$("txtServiceProvider").value(),
                            media: $$("txtMedia").value(),
                            end_interface: $$("txtInterface").value(),
                            equipment_by: $$("txtEquipmentBy").value(),
                            conn_name: $$("ddlSubPlan").selectedData().item_name,//$$("txtConnectionName").value(),
                            start_date: ($$("dsSubConnStartDate").getDate() == "") ? "" : dbDate($$("dsSubConnStartDate").getDate()),
                            end_date: ($$("dsSubSaveConnEndDate").getDate() == "") ? "" : dbDate($$("dsSubSaveConnEndDate").getDate()),
                            bill_addr: $$("txtSubBillAddress").value(),
                            bill_city: $$("txtSubBillCity").value(),
                            bill_dist: $$("txtSubBillDist").selectedObject.val(),
                            bill_pincode: $$("txtSubBillPincode").value(),
                            bill_state: $$("txtSubBillState").selectedObject.val(),
                            bill_area: $$("txtSubBillArea").selectedObject.val(),
                            bill_contact_person: $$("txtSubBillCP").value(),
                            bill_email: $$("txtSubBillEmail").value(),
                            bill_phone: $$("txtSubBillPhone").value(),
                            ins_addr: $$("txtSubInsAddress").value(),
                            ins_city: $$("txtSubInsCity").value(),
                            ins_dist: $$("txtSubInsDist").selectedObject.val(),
                            ins_pincode: $$("txtSubInsPincode").value(),
                            ins_state: $$("txtSubInsState").selectedObject.val(),
                            ins_contact_person: $$("txtSubInsCP").value(),
                            ins_email: $$("txtSubInsEmail").value(),
                            ins_phone: $$("txtSubInsPhone").value(),
                            plan_status: "Active",
                            store_no: $$("ddlSubStore").selectedValue(),
                            comp_id: localStorage.getItem("user_company_id"),
                            status: "Active",
                            active:"1"
                        }
                        $$("msgPanel").show("Inserting Subscription...");
                        page.SubscriptionAPI.postValue(data, function (data1) {
                            page.sub_id = data1[0].key_value;
                            $$("msgPanel").show("Subscription saved successfully...!");
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + page.cust_id,
                                sort_expression: ""
                            }
                            page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                                page.controls.grdSubscription.dataBind(item);
                                $$("msgPanel").hide();
                            });
                            if (true) {//todo: check this in settings
                                var plan_data = {
                                    sub_id: page.sub_id,
                                    plan_id: $$("ddlSubPlan").selectedValue(),
                                    start_date: (start_date == "") ? "" : dbDate(start_date),
                                    end_date: ($$("dsSubSaveConnEndDate").getDate() == "") ? "" : dbDate($$("dsSubSaveConnEndDate").getDate()),
                                    bill_date: $$("ddlSubBillDate").selectedValue(),
                                    var_no: $$("ddlSubPrice").selectedValue(),
                                    price: $$("txtSubPrice").val(),
                                    starting_payment: $$("ddlSubPayMode").selectedValue(),
                                    status: "Actived",
                                    active: "1"
                                }
                                page.SubscriptionPlanAPI.postValue(plan_data, function (data1) {
                                    page.sub_plan_id = undefined;
                                });
                            }
                        });

                        page.clearfields();
                        page.events.btnBack_click();
                        //$$("pnlConnPlanPopup").show();
                    }
                    else {
                        var data = {
                            sub_id:page.sub_id,
                            cust_id: page.cust_id,
                            collection_type: $$("ddlSubCollectionType").selectedValue(),
                            no_of_ip: $$("txtRequiredIP").value(),
                            static_routing: $("#radiodStaticRouterYes").prop("checked") ? 1 : 0,
                            bgp: $("#radiodBGPYes").prop("checked") ? 1 : 0,
                            service_provider: $$("txtServiceProvider").value(),
                            media: $$("txtMedia").value(),
                            end_interface: $$("txtInterface").value(),
                            equipment_by: $$("txtEquipmentBy").value(),
                            conn_name: $$("txtConnectionName").value(),
                            start_date: ($$("dsSubConnStartDate").getDate() == "") ? "" : dbDate($$("dsSubConnStartDate").getDate()),
                            bill_addr: $$("txtSubBillAddress").value(),
                            bill_city: $$("txtSubBillCity").value(),
                            bill_dist: $$("txtSubBillDist").selectedObject.val(),
                            bill_pincode: $$("txtSubBillPincode").value(),
                            bill_state: $$("txtSubBillState").selectedObject.val(),
                            bill_area: $$("txtSubBillArea").selectedObject.val(),
                            bill_contact_person: $$("txtSubBillCP").value(),
                            bill_email: $$("txtSubBillEmail").value(),
                            bill_phone: $$("txtSubBillPhone").value(),
                            ins_addr: $$("txtSubInsAddress").value(),
                            ins_city: $$("txtSubInsCity").value(),
                            ins_dist: $$("txtSubInsDist").selectedObject.val(),
                            ins_pincode: $$("txtSubInsPincode").value(),
                            ins_state: $$("txtSubInsState").selectedObject.val(),
                            ins_contact_person: $$("txtSubInsCP").value(),
                            ins_email: $$("txtSubInsEmail").value(),
                            ins_phone: $$("txtSubInsPhone").value(),
                            plan_status: "Active",
                            store_no: $$("ddlSubStore").selectedValue(),
                            comp_id: localStorage.getItem("user_company_id"),
                            status: "Active",
                            active: "1"
                        }
                        $$("msgPanel").show("Updating Subscription...");
                        page.SubscriptionAPI.putValue(data, function (data1) {
                            $$("msgPanel").show("Subscription updated successfully...!");
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + page.cust_id,
                                sort_expression: ""
                            }
                            page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                                page.controls.grdSubscription.dataBind(item);
                                $$("msgPanel").hide();
                            });
                        });
                        page.events.btnBack_click();
                        //$$("pnlConnPlanPopup").show();
                        page.clearfields();
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnSubSavePlan_click: function () {
                try{
                    if ($$("ddlPlan").selectedValue() == '' && $$("ddlBillDate").selectedValue() == '' && $$("dsSubPlanStartDate").selectedValue() == '') {
                        throw"Select All fields..";
                    }
                    if ($$("ddlPrice").selectedValue() == "-1" || $$("ddlPrice").selectedValue() == null || $$("ddlPrice").selectedValue() == "" || typeof $$("ddlPrice").selectedValue() == "undefined") {
                        throw "Price Is Not Selected";
                    }
                    if ($$("ddlPrice").selectedData().price == "-1" || $$("ddlPrice").selectedData().price == null || $$("ddlPrice").selectedData().price == "" || typeof $$("ddlPrice").selectedData().price == "undefined") {
                        throw "Price Is Not Selected";
                    }
                    if ($$("ddlBillDate").selectedValue() == "-1" || $$("ddlBillDate").selectedValue() == null || $$("ddlBillDate").selectedValue() == "" || typeof $$("ddlBillDate").selectedValue() == "undefined") {
                        throw "Bill Date Is Not Selected";
                    }
                    if ($$("dsSubPlanStartDate").getDate() == "" || $$("dsSubPlanStartDate").getDate() == null || typeof $$("dsSubPlanStartDate").getDate() == "undefined") {
                        throw "Start Date Is Not Selected";
                    }
                    $(page.controls.grdPlanHistory.allData()).each(function (i, item) {
                        if (item.end_date == null || item.end_date == '' || typeof item.end_date == "undefined") {
                            var upd_data = {
                                sub_plan_id: item.sub_plan_id,
                                end_date: dbDate(moment(new Date()).format('DD-MM-YYYY')),
                                status:"Closed",
                                active:"0"
                            }
                            $$("msgPanel").show("Plan stopping...");
                            page.SubscriptionPlanAPI.putValue(upd_data, function (data) {
                                $$("msgPanel").show("Subscription Plan stopped successfully...!");
                            });
                            $$("msgPanel").hide();
                        }
                    });
                    var data = {
                        sub_id: page.sub_id,
                        plan_id: $$("ddlPlan").selectedValue(),
                        start_date: ($$("dsSubPlanStartDate").getDate() == "") ? "" : dbDate($$("dsSubPlanStartDate").getDate()),
                        end_date: ($$("dsSubSavePlanEndDate").getDate() == "") ? "" : dbDate($$("dsSubSavePlanEndDate").getDate()),
                        bill_date: $$("ddlBillDate").selectedValue(),
                        var_no: $$("ddlPrice").selectedValue(),
                        price: $$("txtPlanPrice").value(),
                        starting_payment: $$("ddlPayMode").selectedValue(),
                        status: "Actived",
                        active: "1"
                    }
                    $$("msgPanel").show("Inserting Subscription Plan...");
                    page.SubscriptionPlanAPI.postValue(data, function (data1) {
                        page.sub_plan_id = undefined;
                        $$("msgPanel").show("Subscription Plan saved successfully...!");

                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "concat(ifnull(spt.sub_id,' '),ifnull(item_no,' '),ifnull(spt.start_date,' '),ifnull(spt.end_date,' ')) like '%%' and cust_no=" + page.cust_id + " and spt.sub_id= " + page.sub_id,
                            sort_expression: "sub_plan_id desc"
                        }
                        page.SubscriptionPlanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            page.controls.grdPlanHistory.dataBind(item);
                            page.clearPlans();
                            $$("pnlAddPlanPopup").close();
                            $$("msgPanel").hide();
                        });
                    });
                }
                catch (e) {
                    alert(e);
                }
            },
            btnCloseConnection_click: function () {
                try{
                    $(page.controls.grdPlanHistory.allData()).each(function (i, item) {
                        if (item.end_date == null || item.end_date == '' || typeof item.end_date == "undefined") {
                            throw "Plan Id " + item.plan_id + " Is Not Stopped, Please Stop the Plan And Try Again";
                        }
                    });
                    var data = page.controls.grdSubscription.selectedData();
                    if (data.length == '') {
                        throw"Please select One Connection first..";
                    }
                    if (data[0].end_date != null && data[0].end_date != "") {
                        throw"This Connection already Closed";
                    }
                    if (confirm("Are you sure want to Close this connection?..")) {
                        $$("pnlCloseConnPopup").open();
                        $$("pnlCloseConnPopup").title("Close Connection");
                        $$("pnlCloseConnPopup").width(400);
                        $$("pnlCloseConnPopup").height(150);
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnOK_click: function () {
                var upd_data = {
                    sub_id: page.sub_id,
                    end_date: dbDate($$("dsSubConnEndDate").getDate()),
                    status: "Closed",
                    active:"0"
                }
                $$("msgPanel").show("Closing Subscription...");
                page.SubscriptionAPI.putValue(upd_data, function (data1) {
                    $$("msgPanel").show("Subscription closed successfully...!");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + page.cust_id,
                        sort_expression: ""
                    }
                    page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                        page.controls.grdSubscription.dataBind(item);
                        $$("msgPanel").hide();
                    });
                    $$("dsSubConnEndDate").setDate('');
                    $$("pnlCloseConnPopup").close();
                    page.disablefields();
                    $$("pnlConnGridPopup").show();
                    $$("pnlConnDetailPopup").hide();
                    $$("pnlConnPlanPopup").hide();
                    $("btnAdd").hide();
                });
            },
            btnStopPlan_click: function () {
                var upd_data = {
                    sub_plan_id: page.sub_plan_id,
                    end_date: dbDate($$("dsSubPlanEndDate").getDate()),
                    status: "Closed",
                    active: "0"
                }
                $$("msgPanel").show("Plan stopping...");
                page.SubscriptionPlanAPI.putValue(upd_data, function (data1) {
                    $$("msgPanel").show("Subscription Plan stopped successfully...!");
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(ifnull(spt.sub_id,' '),ifnull(item_no,' '),ifnull(spt.start_date,' '),ifnull(spt.end_date,' ')) like '%%' and cust_no=" + page.cust_id + " and spt.sub_id= " + page.sub_id,
                    sort_expression: "sub_plan_id desc"
                }
                page.SubscriptionPlanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.controls.grdPlanHistory.dataBind(item);
                    $$("msgPanel").hide();
                });
                $$("dsSubPlanEndDate").selectedObject.val ('');
                $$("pnlStopPlanPopup").close();
            },
            btnClosePlan_click: function () {
                var plan_data = page.controls.grdPlanHistory.selectedData();

                var data = {
                    sub_plan_id: plan_data[0].sub_plan_id,
                }
                if (data.sub_plan_id == "") {
                    alert("Please select the plan to stop");

                }
                else if (plan_data[0].end_date != '' && plan_data[0].end_date != null) {
                    alert("Plan Already Stopped");

                } else {
                    if (confirm("Are you sure want to Stop this Plan?..")) {
                        $$("pnlStopPlanPopup").open();
                        $$("pnlStopPlanPopup").title("Stop Plan");
                        $$("pnlStopPlanPopup").width(400);
                        $$("pnlStopPlanPopup").height(150);
                    }
                }
            },
            btnPnlStopPlan_click: function () {
                try{
                    var plan_data = page.controls.grdPlanHistory.selectedData();
                    var data = {
                        sub_plan_id: plan_data[0].sub_plan_id,
                    }
                    if (data.sub_plan_id == "") {
                        throw"Please select the plan to stop";
                    }
                    if (plan_data[0].end_date != '' && plan_data[0].end_date != null) {
                        throw"Plan Already Ended";
                    }
                    if (plan_data[0].active == "0") {
                        throw "Plan Already Stopped";
                    }
                    if (confirm("Are you sure want to Stop this Plan?..")) {
                        var upd_data = {
                            sub_plan_id: page.sub_plan_id,
                            status: "Stopped",
                            active: "0"
                        }
                        $$("msgPanel").show("Plan stopping...");
                        page.SubscriptionPlanAPI.putValue(upd_data, function (data1) {
                            $$("msgPanel").show("Subscription Plan stopped successfully...!");
                        });
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "concat(ifnull(spt.sub_id,' '),ifnull(item_no,' '),ifnull(spt.start_date,' '),ifnull(spt.end_date,' ')) like '%%' and cust_no=" + page.cust_id + " and spt.sub_id= " + page.sub_id,
                            sort_expression: "sub_plan_id desc"
                        }
                        page.SubscriptionPlanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            page.controls.grdPlanHistory.dataBind(item);
                            $$("msgPanel").hide();
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnPnlStartPlan_click: function () {
                try {
                    var plan_data = page.controls.grdPlanHistory.selectedData();
                    var data = {
                        sub_plan_id: plan_data[0].sub_plan_id,
                    }
                    if (data.sub_plan_id == "") {
                        throw "Please select the plan to active";
                    }
                    if (plan_data[0].end_date != '' && plan_data[0].end_date != null) {
                        throw "Plan Already Ended";
                    }
                    if (plan_data[0].active == "1") {
                        throw "Plan Already Activated";
                    }
                    if (confirm("Are you sure want to Activate this Plan?..")) {
                        var upd_data = {
                            sub_plan_id: page.sub_plan_id,
                            status: "Actived",
                            active: "1"
                        }
                        $$("msgPanel").show("Plan Activated...");
                        page.SubscriptionPlanAPI.putValue(upd_data, function (data1) {
                            $$("msgPanel").show("Subscription Plan Activated successfully...!");
                        });
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "concat(ifnull(spt.sub_id,' '),ifnull(item_no,' '),ifnull(spt.start_date,' '),ifnull(spt.end_date,' ')) like '%%' and cust_no=" + page.cust_id + " and spt.sub_id= " + page.sub_id,
                            sort_expression: "sub_plan_id desc"
                        }
                        page.SubscriptionPlanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            page.controls.grdPlanHistory.dataBind(item);
                            $$("msgPanel").hide();
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnPnlStopConnection_click: function () {
                try {
                    var data = page.controls.grdSubscription.selectedData();
                    if (data.length == '') {
                        throw "Please select One Connection first..";
                    }
                    if (data[0].end_date != null && data[0].end_date != "") {
                        throw "This Connection already Closed";
                    }
                    if (data[0].active == "0") {
                        throw "Connection Already Stopped";
                    }
                    if (confirm("Are you sure want to Stop this connection?..")) {
                        var upd_data = {
                            sub_id: page.sub_id,
                            status: "Stopped",
                            active: "0"
                        }
                        $$("msgPanel").show("Stoping Subscription...");
                        page.SubscriptionAPI.putValue(upd_data, function (data1) {
                            $$("msgPanel").show("Subscription stopped successfully...!");
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + page.cust_id,
                                sort_expression: ""
                            }
                            page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                                page.controls.grdSubscription.dataBind(item);
                                $$("msgPanel").hide();
                            });
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnPnlStartConnection_click: function () {
                try {
                    var data = page.controls.grdSubscription.selectedData();
                    if (data.length == '') {
                        throw "Please select One Connection first..";
                    }
                    if (data[0].end_date != null && data[0].end_date != "") {
                        throw "This Connection already Stopped";
                    }
                    if (data[0].active == "1") {
                        throw "Connection Already Activated";
                    }
                    if (confirm("Are you sure want to Activate this connection?..")) {
                        var upd_data = {
                            sub_id: page.sub_id,
                            status: "Activated",
                            active: "1"
                        }
                        $$("msgPanel").show("Active Subscription...");
                        page.SubscriptionAPI.putValue(upd_data, function (data1) {
                            $$("msgPanel").show("Subscription Activated Successfully...!");
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + page.cust_id,
                                sort_expression: ""
                            }
                            page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                                page.controls.grdSubscription.dataBind(item);
                                $$("msgPanel").hide();
                            });
                        });
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnEditPlan_click: function () {
                try{
                    var plan_data = page.controls.grdPlanHistory.selectedData();
                    var data = {
                        sub_plan_id: plan_data[0].sub_plan_id,
                    }
                    if (data.sub_plan_id == "") {
                        throw "Please select the plan to edit";
                    }
                    if (plan_data[0].end_date != '' && plan_data[0].end_date != null) {
                        throw "Ended Plan Is Not Editable";
                    }
                    if (plan_data[0].active == "0") {
                        throw "Stopped Plan Is Not Editable";
                    }
                    if (confirm("Are you sure want to Edit this Plan?..")) {
                        $$("pnlConnGridPopup").hide();
                        $$("pnlConnDetailPopup").show();
                        if (CONTEXT.ENABLE_SUBSCRIPTION_IP_DETAILS) {
                            $$("pnlIpDetails").show();
                        } else {
                            $$("pnlIpDetails").hide();
                        }
                        if (CONTEXT.ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS) {
                            $$("pnlLastMileDetails").show();
                        } else {
                            $$("pnlLastMileDetails").hide();
                        }
                        if (CONTEXT.ENABLE_SUBSCRIPTION_BILLING_DETAILS) {
                            $$("pnlBillingDetails").show();
                        } else {
                            $$("pnlBillingDetails").hide();
                        }
                        if (CONTEXT.ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS) {
                            $$("pnlInstallationAddress").show();
                        } else {
                            $$("pnlInstallationAddress").hide();
                        }
                        $$("pnlEditPlanPopup").open();
                        $$("pnlEditPlanPopup").title("Edit Plan");
                        $$("pnlEditPlanPopup").rlabel("Edit Plan");
                        $$("pnlEditPlanPopup").width(600);
                        $$("pnlEditPlanPopup").height(250);
                    }
                }
                catch (e) {
                    alert(e);
                }
            },
            btnEditSavePlan_click: function () {
                try {
                    if ($$("ddlEditPlan").selectedValue() == '' && $$("ddlEditBillDate").selectedValue() == '' && $$("dsSubPlanEditStartDate").selectedValue() == '') {
                        throw "Select All fields..";
                    }
                    if ($$("ddlEditPrice").selectedValue() == "-1" || $$("ddlEditPrice").selectedValue() == null || $$("ddlEditPrice").selectedValue() == "" || typeof $$("ddlEditPrice").selectedValue() == "undefined") {
                        throw "Price Is Not Selected";
                    }
                    if ($$("ddlEditBillDate").selectedValue() == "-1" || $$("ddlEditBillDate").selectedValue() == null || $$("ddlEditBillDate").selectedValue() == "" || typeof $$("ddlEditBillDate").selectedValue() == "undefined") {
                        throw "Bill Date Is Not Selected";
                    }
                    if ($$("dsSubPlanEditStartDate").getDate() == "" || $$("dsSubPlanEditStartDate").getDate() == null || typeof $$("dsSubPlanEditStartDate").getDate() == "undefined") {
                        throw "Start Date Is Not Selected";
                    }
                    if ($$("txtEditPlanPrice").value() == "" || $$("txtEditPlanPrice").value() == null || typeof $$("txtEditPlanPrice").value() == "undefined") {
                        throw "Plan Price Should Be Positive And Non Negative";
                    }
                    var data = {
                        sub_plan_id:page.sub_plan_id,
                        sub_id: page.sub_id,
                        plan_id: $$("ddlEditPlan").selectedValue(),
                        start_date: ($$("dsSubPlanEditStartDate").getDate() == "") ? "" : dbDate($$("dsSubPlanEditStartDate").getDate()),
                        end_date: ($$("dsSubPlanEditEndDate").getDate() == "") ? "" : dbDate($$("dsSubPlanEditEndDate").getDate()),
                        bill_date: $$("ddlEditBillDate").selectedValue(),
                        var_no: $$("ddlEditPrice").selectedValue(),
                        price: $$("txtEditPlanPrice").value(),
                        starting_payment: $$("ddlEditPayMode").selectedValue(),
                        status: "Actived",
                        active: "1"
                    }
                    $$("msgPanel").show("Inserting Subscription Plan...");
                    page.SubscriptionPlanAPI.putValue(data, function (data1) {
                        page.sub_plan_id = null;
                        $$("msgPanel").show("Subscription Plan saved successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "concat(ifnull(spt.sub_id,' '),ifnull(item_no,' '),ifnull(spt.start_date,' '),ifnull(spt.end_date,' ')) like '%%' and cust_no=" + page.cust_id + " and spt.sub_id= " + page.sub_id,
                            sort_expression: "sub_plan_id desc"
                        }
                        page.SubscriptionPlanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            page.controls.grdPlanHistory.dataBind(item);
                            page.clearPlans();
                            $$("pnlEditPlanPopup").close();
                            $$("msgPanel").hide();
                        });
                    });
                }
                catch (e) {
                    alert(e);
                }
            },
        }
        
        page.clearfields = function () {
            $$("dsSubConnStartDate").selectedObject.val('');
            $$("dsSubConnEndDate").selectedObject.val('');
            $("#radiodStaticRouterNo").prop("checked", true);
            $("#radiodBGPNo").prop("checked", true);
            $$("txtSubBillAddress").val('');
            $$("txtSubBillCity").val('');
            $$("txtSubBillDist").selectedObject.val('');
            $$("txtSubBillPincode").val('');
            $$("txtSubBillState").selectedObject.val('');
            $$("txtSubBillArea").selectedObject.val('');
            $$("txtSubBillCP").val('');
            $$("txtConnectionName").val('');
            $$("txtSubBillEmail").val('');
            $$("txtSubBillPhone").val('');
            $$("txtSubInsAddress").val('');
            $$("txtSubInsCity").val('');
            $$("txtSubInsDist").selectedObject.val('');
            $$("txtSubInsPincode").val('');
            $$("txtSubInsState").selectedObject.val('');
            $$("txtSubInsCP").val('');
            $$("txtSubInsEmail").val('');
            $$("txtSubInsPhone").val('');
            $$("txtRequiredIP").val('');
            $$("ddlPlan").selectedValue('');
            $$("ddlSubCollectionType").selectedValue("Daily");
            $$("txtServiceProvider").val('');
            $$("txtMedia").val('');
            $$("txtInterface").val('');
            $$("txtEquipmentBy").val('');

        }
        page.loadData = function (callback) {
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(state_id,state_name) like '%%'",
                sort_expression: ""
            }
            page.citystateAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.stateList = data;
            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(city_id,city_name) like '%%'",
                sort_expression: ""
            }
            page.cityAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.cityList = data;
            });
            $$("ddlSubCollectionType").selectionChange(function () {
                if ($$("ddlSubCollectionType").selectedValue() == "Weekly") {
                    $$("ddlSubWeekly").show();
                    $$("ddlSubMonthly").hide();
                    $("#pnlDays").show();
                    //  $$("txtSubCollDay").hide();
                }
                else if ($$("ddlSubCollectionType").selectedValue() == "Monthly") {
                    $$("ddlSubWeekly").hide();
                    $$("ddlSubMonthly").show();
                    $("#pnlDays").show();
                    //    $$("txtSubCollDay").hide();
                }
                else if ($$("ddlSubCollectionType").selectedValue() == "Daily") {
                    $$("ddlSubWeekly").hide();
                    $$("ddlSubMonthly").hide();
                    $("#pnlDays").hide();
                    //      $$("txtSubCollDay").hide();
                }
            })
            var data1 = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(item_no,' '),ifnull(item_name,' ')) like '%%' and pt.ptype_name='Services'",
                sort_expression: ""
            }
            page.itemAPI.searchValues(data1.start_record, data1.end_record, data1.filter_expression, data1.sort_expression, function (item) {
                page.controls.ddlPlan.dataBind(item, "item_no", "item_name", "Select");
                page.controls.ddlSubPlan.dataBind(item, "item_no", "item_name", "Select");
                page.controls.ddlEditPlan.dataBind(item, "item_no", "item_name", "Select");
                if (callback != undefined) {
                    callback();
                }
            });
        }
        page.disablefields = function () {
            $$("dsSubConnStartDate").disable(true);
            $$("txtConnectionName").disable(true);
            $$("txtSubBillAddress").disable(true);
            $$("txtSubBillCity").disable(true);
            $$("txtSubBillDist").disable(true);
            $$("txtSubBillPincode").disable(true);
            $$("txtSubBillState").disable(true);
            $$("txtSubBillArea").disable(true);
            $$("txtSubBillCP").disable(true);
            $$("txtSubBillEmail").disable(true);
            $$("txtSubBillPhone").disable(true);
            $$("txtSubInsAddress").disable(true);
            $$("txtSubInsCity").disable(true);
            $$("txtSubInsDist").disable(true);
            $$("txtSubInsPincode").disable(true);
            $$("txtSubInsState").disable(true);
            $$("txtSubInsCP").disable(true);
            $$("txtSubInsEmail").disable(true);
            $$("txtSubInsPhone").disable(true);
            $$("txtRequiredIP").disable(true);
            $$("ddlSubCollectionType").disable(true);
            $$("txtServiceProvider").disable(true);
            $$("txtMedia").disable(true);
            $$("txtInterface").disable(true);
            $$("txtEquipmentBy").disable(true);
            $$("btnAddPlan").disable(true);
        }
        page.enableFields = function () {
            $$("dsSubConnStartDate").disable(false);
            $$("txtConnectionName").disable(false);
            $$("txtSubBillAddress").disable(false);
            $$("txtSubBillCity").disable(false);
            $$("txtSubBillDist").disable(false);
            $$("txtSubBillPincode").disable(false);
            $$("txtSubBillState").disable(false);
            $$("txtSubBillArea").disable(false);
            $$("txtSubBillCP").disable(false);
            $$("txtSubBillEmail").disable(false);
            $$("txtSubBillPhone").disable(false);
            $$("txtSubInsAddress").disable(false);
            $$("txtSubInsCity").disable(false);
            $$("txtSubInsDist").disable(false);
            $$("txtSubInsPincode").disable(false);
            $$("txtSubInsState").disable(false);
            $$("txtSubInsCP").disable(false);
            $$("txtSubInsEmail").disable(false);
            $$("txtSubInsPhone").disable(false);
            $$("txtRequiredIP").disable(false);
            $$("ddlSubCollectionType").disable(false);
            $$("txtServiceProvider").disable(false);
            $$("txtMedia").disable(false);
            $$("txtInterface").disable(false);
            $$("txtEquipmentBy").disable(false);
            $$("btnAddPlan").disable(false);
        }
        page.interface.page_load = function (cust_data) {
            page.cust_id = cust_data.cust_no;
            page.cust_name = cust_data.cust_name;
            page.cust_address = cust_data.address;
            page.cust_email = cust_data.email;
            page.cust_mobile = cust_data.phone_no
            $$("ddlSubWeekly").hide();
            $$("ddlSubMonthly").hide();
            $$("pnlConnGridPopup").show();
            $$("pnlConnDetailPopup").hide();
            $$("ddlSubCollectionType").selectionChange(function () {
                if ($$("ddlSubCollectionType").selectedValue() == "Weekly") {
                    $$("ddlSubWeekly").show();
                    $$("ddlSubMonthly").hide();
                    $("#pnlDays").show();
                    //  $$("txtSubCollDay").hide();
                }
                else if ($$("ddlSubCollectionType").selectedValue() == "Monthly") {
                    $$("ddlSubWeekly").hide();
                    $$("ddlSubMonthly").show();
                    $("#pnlDays").show();
                    //    $$("txtSubCollDay").hide();
                }
                else if ($$("ddlSubCollectionType").selectedValue() == "Daily") {
                    $$("ddlSubWeekly").hide();
                    $$("ddlSubMonthly").hide();
                    $("#pnlDays").hide();
                    //      $$("txtSubCollDay").hide();
                }
            })
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(state_id,state_name) like '%%'",
                sort_expression: ""
            }
            page.citystateAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.stateList = data;
            });

            //State autocomplete
            page.controls.txtSubBillState.dataBind({
                getData: function (term, callback) {
                    callback(page.stateList);

                }
            });
            page.controls.txtSubBillState.select(function (item) {
                if (item == null)
                    page.chk_state = 1;
                else
                    page.chk_state = 0;
            });
            page.controls.txtSubBillState.noRecordFound(function () {
                page.chk_state = 1;
            })
            page.controls.txtSubBillState.allowCustomText(function (item) {
                page.chk_state = 1;
                page.controls.txtSubBillState.selectedObject.val(item.val());

            });
          
            page.controls.txtSubInsState.dataBind({
                getData: function (term, callback) {
                    callback(page.stateList);

                }
            });
            page.controls.txtSubInsState.select(function (item) {
                if (item == null)
                    page.chk_state = 1;
                else
                    page.chk_state = 0;
            });
            page.controls.txtSubBillState.noRecordFound(function () {
                page.chk_state = 1;
            })
            page.controls.txtSubBillState.allowCustomText(function (item) {
                page.chk_state = 1;
                page.controls.txtSubBillState.selectedObject.val(item.val());

            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(city_id,city_name) like '%%'",
                sort_expression: ""
            }
            page.cityAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.cityList = data;
            });
            // District autocomplete
            page.controls.txtSubBillDist.dataBind({
                getData: function (term, callback) {
                    callback(page.cityList);

                }
            });
            page.controls.txtSubBillDist.select(function (item) {
                if (item == null)
                    page.chk_state = 1;
                else
                    page.chk_state = 0;
            });
            page.controls.txtSubBillDist.noRecordFound(function () {
                page.chk_state = 1;
            })
            page.controls.txtSubBillDist.allowCustomText(function (item) {
                page.chk_state = 1;
                page.controls.txtSubBillDist.selectedObject.val(item.val());

            });
            page.controls.txtSubInsDist.dataBind({
                getData: function (term, callback) {
                    callback(page.cityList);

                }
            });
            page.controls.txtSubInsDist.select(function (item) {
                if (item == null)
                    page.chk_state = 1;
                else
                    page.chk_state = 0;
            });
            page.controls.txtSubInsDist.noRecordFound(function () {
                page.chk_state = 1;
            })
            page.controls.txtSubInsDist.allowCustomText(function (item) {
                page.chk_state = 1;
                page.controls.txtSubInsDist.selectedObject.val(item.val());

            });
            
          
            var data1 = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(item_no,' '),ifnull(item_name,' ')) like '%%' and pt.ptype_name='Services'",
                sort_expression: ""
            }
            page.itemAPI.searchValues(data1.start_record, data1.end_record, data1.filter_expression, data1.sort_expression, function (item) {
                page.controls.ddlPlan.dataBind(item, "item_no", "item_name", "Select");
                page.controls.ddlEditPlan.dataBind(item, "item_no", "item_name", "Select");
                //page.customer = item;
            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + cust_data.cust_no,
                sort_expression: ""
            }
            page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                page.controls.grdSubscription.dataBind(item);
            });

            page.controls.grdSubscription.width("100%");
            page.controls.grdSubscription.height("200px");
            page.controls.grdSubscription.setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Sub Id", 'rlabel': "Sub Id", 'width': "100px", 'dataField': "sub_id" },
                    { 'name': "Customer Name", 'rlabel': "Customer Name", 'width': "170px", 'dataField': "cust_name" },
                    { 'name': "Connection Name", 'rlabel': "Connection Name", 'width': "170px", 'dataField': "conn_name" },
                    { 'name': "Start Date", 'rlabel': "Start Date", 'width': "100px", 'dataField': "start_date" },
                    { 'name': "End Date", 'rlabel': "End Date", 'width': "150px", 'dataField': "end_date" },
                    { 'name': "Status", 'rlabel': "Status", 'width': "150px", 'dataField': "status" },
                    { 'name': "", 'width': "0px", 'dataField': "active" },
                    //{ 'name': "", 'width': "40px", 'dataField': "", visible: false, editable: false, itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                ]
            });
            page.controls.grdSubscription.rowCommand = function (action, actionElement, rowId, row, rowData) {
                //if (action == "Delete") {
                //    page.events.btnCloseConnection_click();
                //}
            }
            //page.controls.grdSubscription.selectionChanged = page.events.grdSubscription_select;
            $$("grdSubscription").rowBound = function (row, item) {
                //if (item.end_date != "" && item.end_date != null) {
                //    $(row).css("color", "Red");
                //    page.conClosed = true;
                //}
                //else {
                //    page.conClosed = false;
                //}
                if (item.active == "0") {
                    $(row).css("color", "orange");
                    if (item.end_date != "" && item.end_date != null) {
                        $(row).css("color", "Red");
                    }
                }
            }

            $$("grdSubscription").selectionChanged = function (row, item) {
                page.sub_id = item.sub_id;
                page.cust_id = cust_data.cust_no;
                $("#pnlDailyDays").hide();
                //   var sub_data = $$("grdSubscription").selectedData();
                $$("pnlConnGridPopup").show();
                $$("pnlConnDetailPopup").show();
                if (CONTEXT.ENABLE_SUBSCRIPTION_IP_DETAILS) {
                    $$("pnlIpDetails").show();
                } else {
                    $$("pnlIpDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS) {
                    $$("pnlLastMileDetails").show();
                } else {
                    $$("pnlLastMileDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_BILLING_DETAILS) {
                    $$("pnlBillingDetails").show();
                } else {
                    $$("pnlBillingDetails").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS) {
                    $$("pnlInstallationAddress").show();
                } else {
                    $$("pnlInstallationAddress").hide();
                }
                //    $("#pnlDailyDays").hide();
                page.selectedRowId = row.attr("row_id");
                //$$("ddlCustomer").selectedValue(item.cust_id);
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: " concat(ifnull(spt.sub_id,' '),ifnull(item_no,' '),ifnull(spt.start_date,' '),ifnull(spt.end_date,' ')) like '%%' and cust_no=" + page.cust_id + " and spt.sub_id= " + page.sub_id,
                    sort_expression: "sub_plan_id desc"
                }
                page.SubscriptionPlanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.controls.grdPlanHistory.dataBind(item);
                });
                $$("dsSubConnStartDate").selectedObject.val(item.start_date);
                $$("dsSubConnEndDate").selectedObject.val(item.end_date);

                if ($("#radiodStaticRouterYes").prop("checked"))
                    $("#radiodStaticRouterYes").prop("checked", true);
                else
                    $("#radiodStaticRouterNo").prop("checked", true);

                if ($("#radiodBGPYes").prop("checked"))
                    $("#radiodBGPYes").prop("checked", true);
                else
                    $("#radiodBGPNo").prop("checked", true);
                $$("txtConnectionName").value(item.conn_name);
                $$("txtSubBillAddress").value(item.bill_addr);
                $$("txtSubBillCity").value(item.bill_city);
                $$("txtSubBillDist").selectedObject.val(item.bill_dist);
                $$("txtSubBillPincode").value(item.bill_pincode);
                $$("txtSubBillState").selectedObject.val(item.bill_state);
                $$("txtSubBillArea").selectedObject.val(item.bill_area);
                $$("txtSubBillCP").value(item.bill_contact_person);
                $$("txtSubBillEmail").value(item.bill_email);
                $$("txtSubBillPhone").value(item.bill_phone);
                $$("txtSubInsAddress").value(item.ins_addr);
                $$("txtSubInsCity").value(item.ins_city);
                $$("txtSubInsDist").selectedObject.val(item.ins_dist);
                $$("txtSubInsPincode").value(item.ins_pincode);
                $$("txtSubInsState").selectedObject.val(item.ins_state);
                $$("txtSubInsCP").value(item.ins_contact_person);
                $$("txtSubInsEmail").value(item.ins_email);
                $$("txtSubInsPhone").value(item.ins_phone);
                $$("txtRequiredIP").value(item.no_of_ip);
                $$("ddlPlan").selectedValue(item.plan_id);
                $$("ddlSubCollectionType").selectedValue(item.collection_type);
                $$("ddlSubCollectionType").selectionChange(function () {
                    if ($$("ddlSubCollectionType").selectedValue() == "Weekly") {
                        $$("ddlSubWeekly").selectedValue(item.coll_days);
                    }
                    else if ($$("ddlSubCollectionType").selectedValue() == "Monthly") {
                        $$("ddlSubMonthly").selectedValue(item.coll_days);
                    }
                });
                $$("txtServiceProvider").value(item.service_provider);
                $$("txtMedia").value(item.media);
                $$("txtInterface").value(item.end_interface);
                $$("txtEquipmentBy").value(item.equipment_by);
                $$("ddlSubStore").selectedValue(item.store_no);
                page.controls.txtConnectionName.focus();
                $$("pnlConnPlanPopup").show();
                if (item.end_date == null || item.end_date == "" || typeof item.end_date == "undefined") {
                    page.enableFields();
                }
                else {
                    page.disablefields();
                }
                $$("pnlAddSubscriptionPlan").hide();
            };
            $$("grdSubscription").dataBind([]);

            page.controls.grdPlanHistory.width("100%");
            page.controls.grdPlanHistory.height("200px");
            page.controls.grdPlanHistory.setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Sub Plan Id", 'rlabel': "Sub Plan Id", 'width': "100px", 'dataField': "sub_plan_id" },
                    { 'name': "Plan name", 'rlabel': "Plan Name", 'width': "130px", 'dataField': "item_name" },
                    { 'name': "Bill Type", 'rlabel': "Bill Type", 'width': "100px", 'dataField': "plan_bill_type" },
                    { 'name': "Amount", 'rlabel': "Amount", 'width': "100px", 'dataField': "price" },
                    { 'name': "Start Date", 'rlabel': "Start Date", 'width': "100px", 'dataField': "start_date" },
                    { 'name': "End Date", 'rlabel': "End Date", 'width': "150px", 'dataField': "end_date" },
                    { 'name': "Bill Date", 'rlabel': "Bill Date", 'width': "150px", 'dataField': "bill_date" },
                    { 'name': "Status", 'rlabel': "Status", 'width': "150px", 'dataField': "status" },
                    { 'name': "", 'width': "0px", 'dataField': "active" },
                    
                //{ 'name': "", 'width': "150px", 'dataField': "sub_plan_id", itemTemplate: "<div id='planstop'></div>" },
                ]
            });
            $$("grdPlanHistory").dataBind([]);
            //page.controls.grdPlanHistory.selectionChanged = function (row, item) {
            //    page.sub_plan_id = item.sub_plan_id
            //};
            $$("grdPlanHistory").rowBound = function (row, item) {
                var htmlTemplate = [];
                //if ((item.end_date == "" || item.end_date == null ) && page.conClosed==false) {
                //    var htmlDiv = "";
                //    htmlDiv = htmlDiv + "<input type='button' title='Stop'  class='grid-button' value='Stop' action='Stop' style=''  />";

                //    htmlTemplate.push(htmlDiv);
                //    $(row).find("[id=planstop]").html(htmlTemplate.join(""));
                //}
                
                if (item.active == "0") {
                    $(row).css("color", "#f57405");
                    if (item.end_date != "" && item.end_date != null) {
                        $(row).css("color", "Red");
                    }
                }
            }
            $$("grdPlanHistory").selectionChanged = function (row, item) {
                page.sub_plan_id = item.sub_plan_id;
                $$("ddlPlan").selectedValue(item.plan_id);
                $$("ddlBillDate").selectedValue(item.bill_date);
                $$("dsSubPlanStartDate").selectedObject.val(item.start_date);

                $$("ddlEditPlan").selectedValue(item.plan_id);
                $$("ddlEditPrice").selectedValue(item.var_no);
                $$("ddlEditBillDate").selectedValue(item.bill_date);
                $$("dsSubPlanEditStartDate").selectedObject.val(item.start_date);
                $$("dsSubPlanEditEndDate").selectedObject.val(item.end_date);
                $$("ddlEditPayMode").selectedValue(item.starting_payment);
                $$("txtEditPlanPrice").value(item.price);
            }
            page.controls.grdPlanHistory.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Stop") {
                    var plan_data = page.controls.grdPlanHistory.selectedData();

                    var data = {
                        sub_plan_id: plan_data[0].sub_plan_id,
                    }
                    if (data.sub_plan_id == "") {
                        $$("msgPanel").show("Please select the plan to stop");

                    }
                    else if (plan_data[0].end_date != '' && plan_data[0].end_date != null) {
                        $$("msgPanel").show("Plan Already Stopped");

                    } else {
                        if (confirm("Are you sure want to Stop this Plan?..")) {
                            $$("pnlStopPlanPopup").open();
                            $$("pnlStopPlanPopup").title("Stop Plan");
                            $$("pnlStopPlanPopup").width(400);
                            $$("pnlStopPlanPopup").height(150);
                        }
                    }

                }
            }
            $$("ddlPlan").selectionChange(function () {
                page.stockAPI.searchCurrentPricesMain($$("ddlPlan").selectedValue(), localStorage.getItem("user_store_no"), function (data) {
                    page.controls.ddlPrice.dataBind(data, "var_no", "price");
                    if(data.length > 0)
                        $$("txtPlanPrice").val(data[0].price);
                });
            });
            $$("ddlEditPlan").selectionChange(function () {
                page.stockAPI.searchCurrentPricesMain($$("ddlEditPlan").selectedValue(), localStorage.getItem("user_store_no"), function (data) {
                    page.controls.ddlEditPrice.dataBind(data, "var_no", "price");
                    if (data.length > 0)
                        $$("txtEditPlanPrice").val(data[0].price);
                });
            });

            $$("ddlSubStore").dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name");
        }
        page.events.btnbtnBillNow_click = function () {
            try {
                if ($$("ddlSubPlan").selectedValue() == "-1") {
                    throw "Ad Name Is Not Selected";
                    $$("ddlSubPlan").focus();
                }
                if ($$("dsSubConnStartDate").getDate() == "" || $$("dsSubConnStartDate").getDate() == null) {
                    throw "Please Choose Starting Date";
                }
                var start_date = $$("dsSubConnStartDate").getDate();
                page.start_date = start_date;
                if (page.sub_id == null || page.sub_id == '' || page.sub_id == undefined) { //insert query
                    var data = {
                        cust_id: page.cust_id,
                        collection_type: $$("ddlSubCollectionType").selectedValue(),
                        //     coll_days: $$("txtSubCollDay").value(),
                        no_of_ip: $$("txtRequiredIP").value(),
                        static_routing: $("#radiodStaticRouterYes").prop("checked") ? 1 : 0,
                        bgp: $("#radiodBGPYes").prop("checked") ? 1 : 0,
                        service_provider: $$("txtServiceProvider").value(),
                        media: $$("txtMedia").value(),
                        end_interface: $$("txtInterface").value(),
                        equipment_by: $$("txtEquipmentBy").value(),
                        conn_name: $$("ddlSubPlan").selectedData().item_name,//$$("txtConnectionName").value(),
                        start_date: ($$("dsSubConnStartDate").getDate() == "") ? "" : dbDate($$("dsSubConnStartDate").getDate()),
                        end_date: ($$("dsSubSaveConnEndDate").getDate() == "") ? "" : dbDate($$("dsSubSaveConnEndDate").getDate()),
                        bill_addr: $$("txtSubBillAddress").value(),
                        bill_city: $$("txtSubBillCity").value(),
                        bill_dist: $$("txtSubBillDist").selectedObject.val(),
                        bill_pincode: $$("txtSubBillPincode").value(),
                        bill_state: $$("txtSubBillState").selectedObject.val(),
                        bill_area: $$("txtSubBillArea").selectedObject.val(),
                        bill_contact_person: $$("txtSubBillCP").value(),
                        bill_email: $$("txtSubBillEmail").value(),
                        bill_phone: $$("txtSubBillPhone").value(),
                        ins_addr: $$("txtSubInsAddress").value(),
                        ins_city: $$("txtSubInsCity").value(),
                        ins_dist: $$("txtSubInsDist").selectedObject.val(),
                        ins_pincode: $$("txtSubInsPincode").value(),
                        ins_state: $$("txtSubInsState").selectedObject.val(),
                        ins_contact_person: $$("txtSubInsCP").value(),
                        ins_email: $$("txtSubInsEmail").value(),
                        ins_phone: $$("txtSubInsPhone").value(),
                        plan_status: "Active",
                        store_no: localStorage.getItem("user_store_no"),
                        comp_id: localStorage.getItem("user_company_id"),
                        status: "Active",
                        active: "1"
                    }
                    $$("msgPanel").show("Inserting Subscription...");
                    page.SubscriptionAPI.postValue(data, function (data1) {
                        page.sub_id = data1[0].key_value;
                        $$("msgPanel").show("Subscription saved successfully...!");
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "concat(ifnull(sub_id,' '),ifnull(cust_name,' '),ifnull(start_date,' '),ifnull(end_date,' ')) like '%%' and cust_no=" + page.cust_id,
                            sort_expression: ""
                        }
                        page.SubscriptionAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            page.controls.grdSubscription.dataBind(item);
                            $$("msgPanel").hide();
                        });
                        if (true) {//todo: check this in settings
                            var plan_data = {
                                sub_id: page.sub_id,
                                plan_id: $$("ddlSubPlan").selectedValue(),
                                start_date: (start_date == "") ? "" : dbDate(start_date),
                                end_date: ($$("dsSubSaveConnEndDate").getDate() == "") ? "" : dbDate($$("dsSubSaveConnEndDate").getDate()),
                                bill_date: $$("ddlSubBillDate").selectedValue(),
                                var_no: $$("ddlSubPrice").selectedValue(),
                                price: $$("txtSubPrice").val(),
                                starting_payment: $$("ddlSubPayMode").selectedValue(),
                                status: "Actived",
                                active: "1"
                            }
                            page.SubscriptionPlanAPI.postValue(plan_data, function (data1) {
                                var newBill = {
                                    bill_no: "0",
                                    bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    store_no: getCookie("user_store_id"),
                                    reg_no: localStorage.getItem("user_register_id"),
                                    user_no: localStorage.getItem("app_user_id"),
                                    due_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),

                                    sub_total: $$("txtSubPrice").value(),
                                    round_off: 0,
                                    total: $$("txtSubPrice").value(),
                                    discount: 0,
                                    tax: 0,

                                    bill_type: "Sale",
                                    state_no: "200",
                                    sales_tax_no: "1",
                                    delivered_by: "-1",
                                    expense: "",
                                    cust_no: page.cust_id,
                                    cust_name: page.cust_name,
                                    mobile_no: page.cust_mobile,
                                    email_id: page.cust_email,
                                    cust_address: page.cust_address,
                                    gst_no: "",
                                    tot_qty_words: "",
                                    bill_no_par: "",
                                    pay_mode: "Cash",
                                    bill_barcode: "",
                                    sales_executive: "",
                                    //FINFACTS ENTRY DATA
                                    invent_type: "SaleCredit",
                                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    advance_amount: "",
                                    advance_status: "",
                                    adv_end_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    bill_discount: "",
                                    //fulfill: true,
                                    price_rate: "",
                                    sub_id: page.sub_id,
                                    sub_plan_id: data1[0].key_value,
                                    finfacts:[]
                                };
                                var rbillItems = [];
                                var tot_days = 0;
                                var start_date = dbDate(page.start_date);
                                var end_date = dbDate($$("dsSubSaveConnEndDate").getDate());
                                if (start_date != null && start_date != "" && typeof start_date != "undefined") {
                                    if (end_date != null && end_date != "" && typeof end_date != "undefined") {
                                        var tot_days = Math.round((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));
                                    }
                                }
                                rbillItems.push({
                                    var_no: $$("ddlSubPrice").selectedValue(),
                                    item_no: $$("ddlSubPlan").selectedValue(),
                                    bill_item_qty: "1",
                                    qty: tot_days+1,
                                    free_qty: 0,
                                    unit_identity: "0",
                                    price: $$("txtSubPrice").value(),
                                    discount: "0",
                                    taxable_value: "0",
                                    tax_per: "0",
                                    total_price: $$("txtSubPrice").value(),
                                    price_no: "",
                                    bill_type: "Sale",
                                    tax_class_no: "",
                                    sub_total: $$("txtSubPrice").value(),

                                    hsn_code: "",
                                    cgst: "",//parseFloat(billItem.tax_per / 2),
                                    sgst: "",//parseFloat(billItem.tax_per / 2),
                                    igst: "",
                                    tray_received: "",
                                    cost: $$("txtSubPrice").value(),
                                    amount: $$("txtSubPrice").value(),

                                    executive_id: "-1",
                                    text_qty: ((page.start_date == "") ? "" : dbDate(page.start_date)) + "||" + (($$("dsSubSaveConnEndDate").getDate() == "") ? "" : dbDate($$("dsSubSaveConnEndDate").getDate())),

                                    //Item Stock Table
                                    mrp: "",
                                    batch_no: "",
                                    man_date: "",
                                    expiry_date: "",
                                    stock_selection: "auto",
                                    tray_id: "-1",
                                    tray_mode: "Custom",
                                    sl_no: "1",
                                    
                                });
                                newBill.bill_items = rbillItems;
                                newBill.executivePoints = [];
                                newBill.payments = [];
                                newBill.billschedule = [];
                                newBill.reward = [];
                                newBill.discounts = [];
                                newBill.expenses = [];
                                newBill.finfacts_advance = [];
                                newBill.finfacts_expense = [];
                                page.stockAPI.insertBill(newBill, function (data) {
                                    page.events.btnPrintBill_click(data.bill_no);
                                });
                            });
                        }
                    });

                    page.clearfields();
                    page.events.btnBack_click();
                }
            }
            catch (e) {
                alert(e);
            }
        }
        page.events.btnPrintBill_click = function (billNo, callback) {
            //if (i == bills.length) {
            //    callback();
            //}
            //else {
            page.stockAPI.getSalesBill(billNo, function (data) {
                var bill = data;
                var billItem = data.bill_items;
                var exp_type = "PDF";
                var bill_item = [];
                var s_no = 0;
                var tot_tax_per = 0;

                var repInput = {
                    viewMode: "Standard",
                    fromDate: "",
                    toDate: "",
                    cust_no: data.cust_no,
                    item_no: "",
                    bill_type: ""
                }
                page.dynaReportService.getSalesReport(repInput, function (pending) {
                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                    var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                    $(pending).each(function (i, item) {
                        if (item.bill_type == "Sale") {
                            salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                            salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                        }
                        else {
                            salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                            salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                        }
                    });
                    var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                    $(billItem).each(function (i, item) {
                        tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                        s_no = s_no + 1;
                        (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                        (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                        if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                            var monthex;
                            var yearex
                            if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                                monthex = item.expiry_date.substring(3, 5);
                                yearex = item.expiry_date.substring(6, 10);
                                item.expiry_date = monthex + "-" + yearex;
                            }
                        }
                        bill_item.push({
                            "BillItemNo": s_no,
                            "ProductName": item.item_name,	// nonstandard unquoted field name
                            "Pack": item.packing,	// nonstandard single-quoted field name
                            "Batch": item.batch_no,	// standard double-quoted field name
                            "Exp": item.expiry_date,
                            "Qty": item.qty,
                            "Per": item.unit_per,
                            "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                            "Hsn": item.hsn_code,
                            "FreeQty": item.free_qty,
                            "Rate": parseFloat(item.price).toFixed(2),
                            "PDis": parseFloat(item.discount).toFixed(2),
                            "MRP": parseFloat(item.mrp).toFixed(2),
                            "CGST": parseInt(item.tax_per) / 2 + "%",//item.tax_cgst,
                            "TaxRate": item.tax_rate,
                            "SGST": parseInt(item.tax_per) / 2 + "%",//item.tax_sgst,
                            "GST": parseInt(item.tax_per) + "%",
                            "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                            "GValue": parseFloat(item.total_price).toFixed(2),
                            "start_date": item.start_date,
                            "end_date": item.end_date
                        });
                    });
                    var full_address = data.address.split("-");
                    var tot_amt = parseFloat(data.total) - parseFloat(data.bill_discount);
                    var accountInfo =
                                {
                                    "BillType": "INVOICE",
                                    "PayMode": data.pay_mode,
                                    "CustomerName": data.cust_name,	// standard double-quoted field name
                                    "Phone": data.phone_no,
                                    "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                    "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                    "DLNo": data.license_no,
                                    "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                    "GST": data.gst_no,
                                    "TIN": data.tin_no,
                                    "Area": data.area,//data.sales_exe_area,
                                    "SalesExecutiveName": data.sales_exe_name,
                                    "VehicleNo": data.vehicle_no,
                                    //"BillNo": data.bill_no,
                                    "BillNo": data.bill_id,
                                    "BillDate": data.bill_date,
                                    "NoofItems": data.no_of_items,
                                    "Quantity": data.no_of_qty,
                                    "Abdeen": "Abdeen:",
                                    "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                    "Off": pending_balance,
                                    "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                    //"+9199444 10350",
                                    "ApplsName": CONTEXT.COMPANY_NAME,
                                    "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                    "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                    "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Home": "LL:",
                                    "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                    "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                    "DiscountAmount": parseFloat(parseFloat(data.tot_discount) + parseFloat(data.bill_discount)).toFixed(2),
                                    "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                    "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                    "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                    "BillAmount": parseFloat(tot_amt).toFixed(2),
                                    "ApplicaName": CONTEXT.COMPANY_NAME,
                                    "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                    "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                    "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                    "CompanyName2": "",//"Dealer : Steel & Pipes",
                                    "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                    "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                    "BillAmountWordings": inWords(parseInt(tot_amt)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                    "Cell": "Cell : ",
                                    "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                    "Home": "Phone : ",
                                    "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                    //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                    //"CompanyCityStreetPincode": "",
                                    "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                    "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                    "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                    "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                    //"33CCKPS9949CIZ4",
                                    "SSSS": "DUPLICATE",
                                    "ShipAmt": data.expense_amt,
                                    "Original": "Duplicate",
                                    "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                    "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                    "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                    "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                    "Bill_Advance_End_Date": data.adv_end_date,
                                    "Bill_Advance_End_Days": data.adv_end_days,
                                    "Balance": pending_balance,
                                    "BillItem": bill_item
                                };

                    if (page.PrintBillType == "Return") {
                        accountInfo.BillName = "ORIGINAL RETURN BILL";
                        accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                        accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                    }
                    else {
                        accountInfo.BillName = "ORIGINAL BILL";
                    }
                    PrintService.PrintFile("sales-bill-print/main-sales-template11.jrxml", accountInfo);
                    //self.btnPrintBill_click(i+1, bills,callback);
                });
            });
            //}
        }
    })
}
function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
};