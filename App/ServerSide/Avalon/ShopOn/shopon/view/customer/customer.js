var global_page = null;

$.fn.manageCustomer = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        global_page = page;
        page.customerService = new CustomerService();
        page.customerAPI = new CustomerAPI();
        page.customerrewardAPI = new CustomerRewardAPI();
        page.cityAPI = new CityAPI();
        page.citystateAPI = new CityStateAPI();
        page.rewardplanAPI = new RewardPlanAPI();
        page.accService = new AccountingService();
        page.billAPI = new BillAPI();
        page.reportAPI = new ReportAPI();
        page.userAPI = new UserAPI();
        page.UserGroupAPI = new UserGroupAPI();
        page.SubscriptionPlanAPI = new SubscriptionPlanAPI();
        page.stockAPI = new StockAPI();
        page.dynaReportService = new DynaReportService();
        page.chk_state = 0;
        page.chk_city = 0;
        page.chk_city_name;
        page.chk_state_name;
        page.true_ifsc = true;
        page.pincodeList = null;
        page.itemAPI = new ItemAPI();
        page.object = null;
        document.title = "ShopOn - Customer";
        $("body").keydown(function (e) {
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
            //your keyCode contains the key code, F1 to F2 
            //is among 112 and 123. Just it.
            //console.log(keyCode);
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewCustomer_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnBeforeDelete_click();
            }
            if (e.keyCode == 80 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnPrintCustomerReport_click();
            }
        });
        
        page.select = function (item) {
            var data = {
                start_record: 0,
                end_record: "",
            }
            if (item.value != undefined) {
                data.filter_expression = "cust_no=" + item.cust_no;
                data.sort_expression = "";
            } else {
                data.filter_expression = "";
                data.sort_expression = "";
            }
            var data = {
                cust_no:item.cust_no
            }
            if(typeof item.cust_no != "undefined" && item.cust_no != null){
                page.customerAPI.getValue(data, function (data, callback) {
                    $$("lblrewardpoint").value(data[0].points);
                    $$("lbltotalpoints").value(parseFloat(data[0].points));
                });
            }
            else {
                $$("lblrewardpoint").value("");
                $$("lbltotalpoints").value("");
            }
            
            $$("btnSearch").show();
            $$("btnNewCustomer").show();
            $$("btnSave").show();
            $$("btnRemove").show();
            $$("btnPrintCustomerReport").hide();
            $$("btnReportCustomerReport").show();
            $$("btnRewardTransaction").show();
            $$("btnRedeemReward").show();
            if (CONTEXT.ENABLE_SUBSCRIPTION) {
                $$("btnSubscription").show();
                $("#subscription").show();
                $$("btnSubscriptionReport").show();
                $("#subscriptionReport").show();
            }
            else {
                $$("btnSubscription").hide();
                $("#subscription").hide();
                $$("btnSubscriptionReport").hide();
                $("#subscriptionReport").hide();
            }


            $$("hdnCustNo").val(nvl(item.cust_no, ""));
            $$("txtFirstName").value(nvl(item.first_name, ""));
            $$("txtLastName").value(nvl(item.last_name, ""));
            $$("txtCompany").value(nvl(item.company, ""));
            $$("txtDOB").setDate(nvl(item.date_of_birth, ""));
            $$("txtStreet").value(nvl(item.address1, ""));
            $$("txtAddressLine2").value(nvl(item.address2, ""));
            $$("txtCity").selectedObject.val(nvl(item.city, ""));
            $$("txtState").selectedObject.val(nvl(item.state, ""));
            $$("txtPincode").selectedObject.val(nvl(item.zip_code, ""));
            var mobile1 = item.phone_no;
            (mobile1 == "" || mobile1 == null) ? $$("txtPhone").value('') : $$("txtPhone").value(nvl(mobile1, ""));
            var mobile2 = item.alter_mobile;
            (mobile2 == "" || mobile2 == null) ? $$("txtAltMobile").value('') : $$("txtAltMobile").value(nvl(mobile2, ""));
            $$("txtLandline").value(nvl(item.landline_no, ""));
            $$("txtEmail").value(nvl(item.email, ""));
            $$("txtArea").value(nvl(item.area, ""));
            //Bank Details
            $$("txtBankName").value(nvl(item.bank_name, ""));
            $$("txtAcntNo").value(nvl(item.account_no, ""));
            $$("txtifsccode").value(nvl(item.ifsc_code, ""));
            $$("txtgstno").value(nvl(item.gst_no, ""));
            $$("txtlicenseno").value(nvl(item.license_no, ""));
            $$("txtPanNo").value(nvl(item.pan_no, ""));
            $$("txtAadhaarNo").value(nvl(item.aadar_no, ""));
            $$("txtTinNo").value(nvl(item.tin_no, ""));
            $$("txtVehicleNo").value(nvl(item.vehicle_no, ""))
            $$("ddlBusinessType").selectedValue(item.business_type);
            $$("lblUserId").html(nvl(item.user_id, ""));
            if (item.user_id == "" || item.user_id == null) {
                $$("txtUserName").value("");
                $$("txtPassword").value("");
            }
            else {
                page.userAPI.getValue(item.user_id, function (data) {
                    $$("txtUserName").value(data[0].user_name);
                    $$("txtPassword").value(data[0].password);
                });
            }
            $$("ddlBusinessType").selectionChange(function () {
                if ($$("ddlBusinessType").selectedValue() == "Other") {
                    $$("txtOtherType").selectedValue(item.other_bus_type);
                }
            });
            $("[controlid = txtlicenseno]").each(function () {
                this.value = this.value.replace(/-/g, ",");
            });
            if (item.reward_plan_id == "" || item.reward_plan_id == null || item.reward_plan_id == undefined) {
                $$("ddlmyrewardplans").selectedValue(-1);
            }
            else {
                $$("ddlmyrewardplans").selectedValue(item.reward_plan_id);
            }
            if (item.mobile_comm == "on") {
                $$("chkMobile").prop('checked', true);
            }
            else {
                $$("chkMobile").prop('checked', false);
            }
            if (item.email_comm == "on") {
                $$("chkEmail").prop('checked', true);
            }
            else {
                $$("chkEmail").prop('checked', false);
            }

            if (item.cus_active == 1) {
                $$("chkActive").prop('checked', true);
            }
            else {
                $$("chkActive").prop('checked', false);
            }
        };

        page.delete = function (callback) {
            $("#cremove").hide();
            $("#cprint").hide();
            $("#credeem").hide();
            if ($$("hdnCustNo").val() != "") {
                $$("msgPanel").show("Removing customer...");
                var data = {
                    cust_no: $$("hdnCustNo").val()
                }
                page.customerAPI.deleteValue(data.cust_no, data, function (data) {
                    $$("msgPanel").show("Customer removed sucessfully...!");
                    page.events.btnSearch_click();

                    $$("hdnCustNo").val('');

                    $$("txtFirstName").val('');
                    $$("txtLastName").val('');
                    $$("txtCompany").val('');
                    $$("txtDOB").setDate('');
                    $$("txtStreet").val('');
                    $$("txtAddressLine2").val('');
                    $$("txtCity").selectedObject.val('');
                    $$("txtState").selectedObject.val('');
                    $$("txtPincode").selectedObject.val('');
                    $$("txtPhone").val('');
                    $$("txtLandline").val('');
                    $$("txtEmail").val('');
                    $$("txtArea").val('');
                    $$("txtPanNo").val('');
                    $$("txtAadhaarNo").val('');
                    $$("txtTinNo").val('');
                    $$("txtVehicleNo").val('');
                    $$("txtOtherType").val('');
                    $$("lblUserId").html("");
                    $$("txtUserName").value("");
                    $$("txtPassword").value("");
                    //reward plans
                    $$("ddlmyrewardplans").selectedObject.val(1);

                    $$("chkActive").prop('checked', true);

                    $$("btnSearch").show();
                    $$("btnNewCustomer").show();
                    $$("btnSave").show();
                    $$("btnRemove").hide();
                    $$("btnPrintCustomerReport").hide();
                    $$("btnReportCustomerReport").show();
                    $$("btnRewardTransaction").hide();
                    $$("btnRedeemReward").hide();
                    $$("btnSubscription").hide();
                    $$("btnSubscriptionReport").hide();
                    $("#subscriptionReport").hide();
                });
            } else {
                $$("msgPanel").show("Please select a customer first...!");
            }
        }
        page.save = function (callback) {
            $("#cremove").hide();
            $("#cprint").hide();
            $("#credeem").hide();
            $$("btnSearch").show();
            $$("btnNewCustomer").show();
            $$("btnSave").show();
            $$("btnRemove").show();
            $$("btnPrintCustomerReport").hide();
            $$("btnReportCustomerReport").show();
            $$("btnRewardTransaction").hide();
            $$("btnRedeemReward").hide();
            $$("btnSubscription").hide();
            $$("btnSubscriptionReport").hide();
            $("#subscriptionReport").hide();

            var succ = "on";
            var fail = "off";

            $("[controlid = txtlicenseno]").each(function () {
                this.value = this.value.replace(/,/g, "-");
            });

            var data = {

                first_name: ($$("txtFirstName").val()),
                last_name: $$("txtLastName").val(),

                company: $$("txtCompany").val(),
                date_of_birth: dbDate($$("txtDOB").getDate()),
                address1: $$("txtStreet").val(),
                address2: $$("txtAddressLine2").val(),
                city: $$("txtCity").selectedObject.val(),
                state: $$("txtState").selectedObject.val(),
                zip_code: $$("txtPincode").selectedObject.val(),
                alter_mobile: ($$("txtAltMobile").value() == "") ? "" : $$("txtAltMobile").value(),
                phone_no: ($$("txtPhone").value() == "") ? "" : $$("txtPhone").value(),
                landline_no: $$("txtLandline").val(),
                email: $$("txtEmail").val(),
                area: $$("txtArea").val(),
                bank_name: $$("txtBankName").val(),
                account_no: $$("txtAcntNo").val(),
                ifsc_code: $$("txtifsccode").val(),
                gst_no: $$("txtgstno").val(),
                license_no: $$("txtlicenseno").val(),
                pan_no: $$("txtPanNo").val(),
                aadar_no: $$("txtAadhaarNo").val(),
                tin_no: $$("txtTinNo").val(),
                vehicle_no: $$("txtVehicleNo").val(),
                business_type: $$("ddlBusinessType").selectedValue(),
                other_bus_type:$$("txtOtherType").val(),
                comp_id: localStorage.getItem("user_company_id"),
                user_id: $$("lblUserId").html()
            }
            if ($$("chkMobile").prop("checked")) {
                data.mobile_comm = succ;
            } else {
                data.mobile_comm = fail;
            }
            if ($$("chkEmail").prop("checked")) {
                data.email_comm = succ;
            } else {
                data.email_comm = fail;
            }

            if ($$("chkActive").prop("checked"))
                data.cus_active = 1;
            else
                data.cus_active = 0;

            //reward plans
            data.reward_plan_id = $$("ddlmyrewardplans").selectedValue();
            if ($$("hdnCustNo").val() != "") {
                data.cust_no = $$("hdnCustNo").val();
                
                $$("msgPanel").show("Updating customer...");
                if ($$("txtPhone").value() == "" || $$("txtPhone").value() == null || typeof $$("txtPhone").value() == "undefined") {
                    page.customerAPI.putValue(data.cust_no, data, function (data1) {
                        $$("msgPanel").show("Customer updated successfully...!");
                        var customer = {
                            cust_no: data.cust_no
                        }
                        page.customerAPI.getValue(customer, function (data) {
                            $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                            $$("grdCustomer").selectedRows()[0].click();
                            $$("msgPanel").hide();

                        });
                    });
                }
                else {
                    var data1 = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(ifnull(phone_no,'')) like '%" + $$("txtPhone").value() + "%'",
                        sort_expression: ""
                    }
                    page.customerAPI.searchData(data1.start_record, data1.end_record, data1.filter_expression, data1.sort_expression, function (item) {
                        if (item.length == 0) {
                            page.customerAPI.putValue(data.cust_no, data, function (data1) {
                                $$("msgPanel").show("Customer updated successfully...!");
                                var customer = {
                                    cust_no: data.cust_no
                                }
                                page.customerAPI.getValue(customer, function (data) {
                                    $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                                    $$("grdCustomer").selectedRows()[0].click();
                                    $$("msgPanel").hide();

                                });
                            });
                        }
                        else {
                            if (data.cust_no != item[0].cust_no) {
                                if (confirm("This Mobile No " + $$("txtPhone").value() + " Is Already Registered With Other Customer Are You Sure Wants To Register It Again")) {
                                    page.customerAPI.putValue(data.cust_no, data, function (data1) {
                                        $$("msgPanel").show("Customer updated successfully...!");
                                        var customer = {
                                            cust_no: data.cust_no
                                        }
                                        page.customerAPI.getValue(customer, function (data) {
                                            $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                                            $$("grdCustomer").selectedRows()[0].click();
                                            $$("msgPanel").hide();

                                        });
                                    });
                                }
                            }
                            else {
                                page.customerAPI.putValue(data.cust_no, data, function (data1) {
                                    $$("msgPanel").show("Customer updated successfully...!");
                                    var customer = {
                                        cust_no: data.cust_no
                                    }
                                    page.customerAPI.getValue(customer, function (data) {
                                        $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                                        $$("grdCustomer").selectedRows()[0].click();
                                        $$("msgPanel").hide();

                                    });
                                });
                            }
                        }
                    });
                }

            }
            else {
                $$("msgPanel").show("Inserting new customer...");
                if ($$("txtPhone").value() == "" || $$("txtPhone").value() == null || typeof $$("txtPhone").value() == "undefined") {
                    page.customerAPI.postValue(data, function (cust) {
                        data.cust_no = cust[0].key_value;
                        $$("msgPanel").show("Customer saved successfully...!");
                        var customer = {
                            cust_no: data.cust_no
                        }
                        page.customerAPI.getValue(customer, function (item) {
                            page.view.selectedGridCustomer(item);
                            $$("grdCustomer").getAllRows()[0].click();
                            $$("msgPanel").hide();
                        });
                    });
                }
                else {
                    var data1 = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "concat(ifnull(phone_no,'')) like '%" + $$("txtPhone").value() + "%'",
                        sort_expression: ""
                    }
                    page.customerAPI.searchData(data1.start_record, data1.end_record, data1.filter_expression, data1.sort_expression, function (item) {
                        if (item.length == 0) {
                            page.customerAPI.postValue(data, function (cust) {
                                data.cust_no = cust[0].key_value;
                                $$("msgPanel").show("Customer saved successfully...!");
                                var customer = {
                                    cust_no: data.cust_no
                                }
                                page.customerAPI.getValue(customer, function (item) {
                                    page.view.selectedGridCustomer(item);
                                    $$("grdCustomer").getAllRows()[0].click();
                                    $$("msgPanel").hide();
                                });
                            });
                        }
                        else {
                            if (confirm("This Mobile No " + $$("txtPhone").value() + " Is Already Registered Are You Sure Wants To Register It Again")) {
                                page.customerAPI.postValue(data, function (cust) {
                                    data.cust_no = cust[0].key_value;
                                    $$("msgPanel").show("Customer saved successfully...!");
                                    var customer = {
                                        cust_no: data.cust_no
                                    }
                                    page.customerAPI.getValue(customer, function (item) {
                                        page.view.selectedGridCustomer(item);
                                        $$("grdCustomer").getAllRows()[0].click();
                                        $$("msgPanel").hide();
                                    });
                                });
                            }
                        }
                    });
                }
                
                
            }
        };

        page.events = {
            btnSearch_click: function () {
                $(".basic-info").hide();
                $$("msgPanel").show("Searching...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    //filter_expression: "concat(ifnull(cust_no,''),ifnull(cust_id,''),ifnull(first_name,''),ifnull(last_name,''),ifnull(phone_no,'')) like '%" + $$("txtCustomerSearch").value() + "%'",
                    filter_expression: "concat(ifnull(cust_id,''),ifnull(first_name,''),ifnull(last_name,''),ifnull(phone_no,''),ifnull(alter_mobile,'')) like '%" + $$("txtCustomerSearch").value() + "%'",
                    sort_expression: ""
                }
                page.customerAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.controls.grdCustomer.dataBind(item);
                    page.view.selectedGridCustomer(item);
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerrewardAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.controls.grdPointTransaction.dataBind(item);
                    $$("msgPanel").hide();
                });
                //page.select({});
                $$("btnSearch").show();
                $$("btnNewCustomer").show();
                $$("btnSave").hide();
                $$("btnRemove").hide();
                $("#cremove").hide();
                $("#cprint").hide();
                $("#credeem").hide();
                $$("btnPrintCustomerReport").hide();
                $$("btnReportCustomerReport").show();
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $$("btnSubscription").hide();
                $$("btnSubscriptionReport").hide();
                $("#subscriptionReport").hide();
                $$("chkActive").prop('checked', true);
            },
            grdCustomer_select: function (row, item) {
                //show right panel
                $(".basic-info").show();
                $$("btnRewardTransaction").show();
                $$("btnRedeemReward").show();
                if (CONTEXT.ENABLE_SUBSCRIPTION) {
                    $$("btnSubscription").show();
                    $("#subscription").show();
                    $$("btnSubscriptionReport").show();
                    $("#subscriptionReport").show();
                }
                else {
                    $$("btnSubscription").hide();
                    $("#subscription").hide();
                    $$("btnSubscriptionReport").hide();
                    $("#subscriptionReport").hide();
                }
                $("#cremove").show();
                $("#cprint").show();
                $("#credeem").show();
                $$("btnNewCustomer").show();
                $$("hdnCustNo").val(item.cust_no);
                page.select(item);
                page.object = item;
                if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                    $$("btnRewardTransaction").show();
                    $$("btnRedeemReward").show();
                    $$("pnlRewardPlans").show();
                    $$("pnlRewardPoints").show();
                    $('#cprint').show();
                }
                else {
                    $('#cprint').hide();
                    $$("btnRewardTransaction").hide();
                    $$("btnRedeemReward").hide();
                    page.controls.btnPrintCustomerReport.selectedObject.next().hide();
                    page.controls.btnRewardTransaction.selectedObject.next().hide();
                    $$("pnlRewardPlans").hide();
                    $$("pnlRewardPoints").hide();
                }
                if (CONTEXT.ENABLE_VEHICLE_NO == "true") {
                    $$("pnlVehicle").show();
                } else {
                    $$("pnlVehicle").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION) {
                    $$("pnlType").show();
                } else {
                    $$("pnlType").hide();
                }
                $$("pnlCommunication").hide();
                if (CONTEXT.ENABLE_EMAIL == "true") {
                    $$("chkEmail").show();
                    $('#lblEmail').show();
                    $$("pnlCommunication").show();
                } else {
                    $$("chkEmail").hide();
                    $('#lblEmail').hide();
                }
                if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                    $$("chkMobile").show();
                    $('#lblMobile').show();
                    $$("pnlCommunication").show();
                } else {
                    $$("chkMobile").hide();
                    $('#lblMobile').hide();
                }
                $$("btnBillHistory").show();
                $("#customerbill").show();
                $$("txtFirstName").focus();
                (CONTEXT.ENABLE_CUSTOMER_LOGIN) ? $$("pnlMoreAction").show() : $$("pnlMoreAction").hide();
                (CONTEXT.ENABLE_CUSTOMER_BANK_DETAILS) ? $$("pnlBankDetails").show() : $$("pnlBankDetails").hide();
            },
            btnNewCustomer_click: function (row, item) {
                if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                    $$("btnRewardTransaction").show();
                    $$("btnRedeemReward").show();
                    $$("pnlRewardPlans").show();
                    $$("pnlRewardPoints").show();
                    $('#cprint').show();
                } else {
                    $('#cprint').hide();
                    $$("btnRewardTransaction").hide();
                    $$("btnRedeemReward").hide();
                    page.controls.btnPrintCustomerReport.selectedObject.next().hide();
                    page.controls.btnRewardTransaction.selectedObject.next().hide();
                    $$("pnlRewardPlans").hide();
                    $$("pnlRewardPoints").hide();
                }
                if (CONTEXT.ENABLE_VEHICLE_NO == "true") {
                    $$("pnlVehicle").show();
                } else {
                    $$("pnlVehicle").hide();
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION) {
                    $$("pnlType").show();
                } else {
                    $$("pnlType").hide();
                }
                page.events.btnSearch_click();
                $(".basic-info").show();
                page.select({});
                //page.controls.grdCustomer.dataBind([]);
                page.view.selectedGridCustomer([]);
                $$("btnSearch").show();
                $("#cremove").hide();
                $("#cprint").hide();
                $("#credeem").hide();
                $$("btnSave").show();
                $$("btnRemove").hide();
                $$("btnSubscription").hide();
                $$("btnSubscriptionReport").hide();
                $("#subscriptionReport").hide();
                $$("btnPrintCustomerReport").hide();
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $$("chkActive").prop('checked', true);
                $$("ddlmyrewardplans").selectedValue(-1);

                $$("txtFirstName").focus();
                
                $$("pnlCommunication").hide();
                if (CONTEXT.ENABLE_EMAIL == "true") {
                    $$("chkEmail").show();
                    $('#lblEmail').show();
                    $$("pnlCommunication").show();
                } else {
                    $$("chkEmail").hide();
                    $('#lblEmail').hide();
                }
                if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                    $$("chkMobile").show();
                    $('#lblMobile').show();
                    $$("pnlCommunication").show();
                } else {
                    $$("chkMobile").hide();
                    $('#lblMobile').hide();
                }
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(city_id,city_name) like '%%'",
                    sort_expression: ""
                }
                page.cityAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.cityList = data;
                });
                //City autocomplete
                page.controls.txtCity.dataBind({
                    getData: function (term, callback) {
                        callback(page.cityList);
                    }
                });
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
                page.controls.txtState.dataBind({
                    getData: function (term, callback) {
                        callback(page.stateList);
                    }
                });
                $$("pnlMoreAction").hide();
                (CONTEXT.ENABLE_CUSTOMER_BANK_DETAILS) ? $$("pnlBankDetails").show() : $$("pnlBankDetails").hide();
            },
            btnSave_click: function () {
                
                var error_count = 0;
                var cus_phone = $$("txtPhone").val();
                var cus_mobile = $$("txtAltMobile").val();
                var cus_fname = $$("txtFirstName").val();
                var cus_lname = $$("txtLastName").val();
                var cus_email = $$("txtEmail").val();
                var pincode = $$("txtPincode").selectedObject.val();
                var acnt_no = $$("txtAcntNo").val();
                var aadar = $$("txtAadhaarNo").val();
                var bname = $$("txtBankName").val();
                var area = $$("txtArea").val();
                var landline = $$("txtLandline").val();
                if (cus_fname == "") {
                    $$("msgPanel").show("Customer first name is mandatory ...!");
                    $$("txtFirstName").focus();
                    error_count++;
                }
                if (cus_fname != "" && !isNaN(cus_fname)) {
                    $$("msgPanel").show("Customer name should only contains characters ...!");
                    $$("txtFirstName").focus();
                    error_count++;
                }
                if (cus_lname != "" && !isNaN(cus_lname)) {
                    $$("msgPanel").show("Customer name should only contains characters ...!");
                    $$("txtLastName").focus();
                    error_count++;
                }

                if (cus_phone != "" && !isInt(cus_phone)) {
                    $$("msgPanel").show("Mobile no should only contain numbers ...!");
                    $$("txtPhone").focus();
                    error_count++;
                }
                if (cus_mobile != "" && !isInt(cus_mobile)) {
                    $$("msgPanel").show("Alternate mobile no should only contain numbers ...!");
                    $$("txtAltMobile").focus();
                    error_count++;
                }
                if (CONTEXT.ENABLE_CUSTOMER_MOBILE) {
                    if (!ValidateMobileNo(cus_phone)) {
                        $$("msgPanel").show("Mobile No Is Not Valid ...!");
                        $$("txtPhone").focus();
                        error_count++;
                    }
                }
                if (landline != "" && !isInt(landline)) {
                    $$("msgPanel").show("Landline no should only contain numbers ...!");
                    $$("txtLandline").focus();
                    error_count++;
                }
                if (cus_phone != "" && cus_phone.length != 10) {
                    $$("msgPanel").show("Mobile no should be 10 in length...!");
                    $$("txtPhone").focus();
                    error_count++;
                }
                if (cus_mobile != "" && cus_mobile.length != 10) {
                    $$("msgPanel").show("Alternate mobile no should be 10 in length...!");
                    $$("txtAltMobile").focus();
                    error_count++;
                }
                if (cus_email != "" && !ValidateEmail(cus_email)) {
                    $$("msgPanel").show("Email address is not valid...!");
                    $$("txtEmail").focus();
                    error_count++;
                }
                if (isNaN(pincode)) {
                    $$("msgPanel").show("Pincode should be a number...!");
                    $$("txtPincode").focus();
                    error_count++;
                }
                if (isNaN(acnt_no)) {
                    $$("msgPanel").show("Account Number should be a number...!");
                    $$("txtAcntNo").focus();
                    error_count++;
                }
                if (isNaN(aadar)) {
                    $$("msgPanel").show("Aadhaar Number should be a number...!");
                    $$("txtAadhaarNo").focus();
                    error_count++;
                }
                if (bname != "" && !isNaN(bname)) {
                    $$("msgPanel").show("Bank name should only contains characters ...!");
                    $$("txtBankName").focus();
                    error_count++;
                }
                if (area != "" && !isNaN(area)) {
                    $$("msgPanel").show("Area should only contains characters ...!");
                    $$("txtArea").focus();
                    error_count++;
                }
                if ($$("txtifsccode").val() != "") {
                    if ($$("txtifsccode").val().length == 11) {
                        var ifsc_reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
                        if (!ifsc_reg.test($$("txtifsccode").val())) {
                            error_count++;
                            $$("msgPanel").show("You Are Entered Wrong IFSC Number");
                            $$("txtifsccode").focus();
                        }
                    }
                    else {
                        error_count++;
                        $$("msgPanel").show("You Are Entered Wrong IFSC Number");
                        $$("txtifsccode").focus();
                    }
                }
                if ($$("txtgstno").val() != "") {
                    if ($$("txtgstno").val().length == 15) {
                        var gst_reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                        if (!gst_reg.test($$("txtgstno").val())) {
                            error_count++;
                            $$("msgPanel").show("You Are Entered Wrong GST Number");
                            $$("txtgstno").focus();
                        }
                    }
                    else {
                        error_count++;
                        $$("msgPanel").show("You Are Entered Wrong GST Number");
                        $$("txtgstno").focus();
                    }
                }
                if (error_count == 0) {
                    if (page.chk_city == 1) {
                        var city = {
                            city_name: $$("txtCity").selectedObject.val(),
                        }
                        page.cityAPI.postValue(city, function (data) { });
                    }
                    if (page.chk_state == 1) {
                        var state = {
                            state_name: $$("txtState").selectedObject.val(),
                        }
                        page.citystateAPI.postValue(state, function (data) { });
                    }
                    page.save();
                    $$("btnNewCustomer").show();
                    $$("msgPanel").hide();
                    $$("txtFirstName").focus();
                }
                else {
                }
            },
            btn_check_reg_exp: function (data, regex) {
                page.true_ifsc = regex.test(data);
                return (page.true_ifsc);
            },
            btnBeforeDelete_click: function () {
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
            },
            btnRemoveConfirmPopupClose_click: function () {
                page.controls.pnlRemoveConfirmPopup.close();
            },
            btnRemove_click: function () {
                page.delete();
                page.controls.pnlRemoveConfirmPopup.close();
            },
            btnReportCustomerReport_click: function () {
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(150);
            },
            btnBillPrint_click: function () {
                page.controls.pnlPrintingCustomerBillPopup.open();
                page.controls.pnlPrintingCustomerBillPopup.title("Bill Print");
                page.controls.pnlPrintingCustomerBillPopup.rlabel("Bill Print");
                page.controls.pnlPrintingCustomerBillPopup.width(800);
                page.controls.pnlPrintingCustomerBillPopup.height(610);
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(ifnull(cust_no,''),ifnull(cust_id,''),ifnull(first_name,''),ifnull(last_name,''),ifnull(phone_no,'')) like '%%'",
                    sort_expression: ""
                }
                page.customerAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    $$("ddlBillCustomerName").dataBind(item, "cust_no", "cust_name", "All");
                });
                page.view.selectedCustomerBill([]);
                $$("dsBillStartDate").selectedObject.val("");
                $$("dsBillEndDate").selectedObject.val("");
            },
            btnPrintJasperBill_click: function () {
                var customer_details = [];
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $(data).each(function (i, item) {
                        customer_details.push({
                            "CustNo": item.cust_no,
                            "CustName": item.cust_name,
                            "PhoneNo": (item.phone_no == null) ? "" : item.phone_no,
                            "Email": (item.email == null) ? "" : item.email,
                            "Address": (item.address == null || item.address == ",,,-") ? "" : item.address
                        });
                    });

                    var accountInfo = {
                        "ApplicaName": CONTEXT.COMPANY_NAME,
                        "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                        "PhoneNo": CONTEXT.COMPANY_PHONE_NO,
                        "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                        "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                        "CompanyGST": CONTEXT.COMPANY_GST_NO,
                        "BillName": "Customer Report",
                        "Customer": customer_details
                    };
                    GeneratePrint("ShopOnDev", "Customer/CustomerR.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                });
            },
            btnPrintCustomerReport_click: function () {
                $$("msgPanel").show("Printing customer details...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    PrintData(data);
                });
                $$("msgPanel").hide();
            },
            btnRewardTransaction_click: function () {
                page.controls.pnlPointTransaction.open();
                page.controls.pnlPointTransaction.title("Reward Transaction");
                page.controls.pnlPointTransaction.rlabel("Reward Transaction");
                page.controls.pnlPointTransaction.width(1300);
                page.controls.pnlPointTransaction.height(580);
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: " a.cust_no =" + $$("hdnCustNo").val(),
                    sort_expression: ""
                }
                page.customerrewardAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    page.controls.grdPointTransaction.dataBind(item);
                });
            },
            btnSubscription_click: function () {
                page.controls.pnlSubscription.open();
                page.controls.pnlSubscription.title("Subscription");
                page.controls.pnlSubscription.rlabel("Subscription");
                $$("txtpointstoredeem").val("");
                $$("lblamount").value("");
                $$("txtDescription").value("");
                $('#pnlDays').hide();
                page.controls.pnlSubscription.width(1300);
                page.controls.pnlSubscription.height(600);
                page.controls.ucCustomerSubscription.page_load(page.object);

                //$.pageController.unLoadUserControl(page, "currentUC");
                //$.pageController.loadUserControl(page, page.controls.pnlSubscription.children("div"), "currentUC", "subscriptionCust")
                //page.controls.currentUC.page_load(page.controls.grdCustomer.selectedData()[0].cust_no);
            },
            btnRedeemReward_click: function () {
                page.controls.pnlRedeemReward.open();
                page.controls.pnlRedeemReward.title("Redeem Reward");
                page.controls.pnlRedeemReward.rlabel("Redeem Reward");
                $$("txtpointstoredeem").val("");
                $$("lblamount").value("");
                $$("txtDescription").value("");
                page.controls.pnlRedeemReward.width(500);
                page.controls.pnlRedeemReward.height(400);
                $$("txtpointamount").value(4);
                $$("txtpointstoredeem").focus();
            },
            btnSavePoints_click: function () {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "cust_no=" + $$("hdnCustNo").val(),
                    sort_expression: ""
                }
                page.customerrewardAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    if (data[0].points > 0) {
                        if (parseInt(data[0].points) >= parseInt($$("txtpointstoredeem").val())) {
                            var data = {

                                cust_no: $$("hdnCustNo").val(),
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                bill_no: "-1",
                                ver_no: "1",
                                reward_plan_id: $$("ddlmyrewardplans").selectedValue(),
                                points: $$("txtpointstoredeem").val(),
                                trans_type: "Debit",
                                description: $$("txtDescription").val(),
                                setteled_amount: $$("lblamount").value()
                            }
                            var finfactsdata = {
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                expense_acc_id: CONTEXT.ExpenseCategory,//204,
                                amount: $$("lblamount").value(),
                                description: "Reward ID " + $$("ddlmyrewardplans").selectedValue(),
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                key_1: $$("ddlmyrewardplans").selectedValue()
                            };
                            page.customerrewardAPI.postValue(data, function (data1) {
                                page.accService.insertExpense(finfactsdata, function (response) {
                                    page.controls.pnlRedeemReward.close();
                                    $$("msgPanel").show("Points used successfully...!");
                                    page.customerService.getCustomerByNo(data.cust_no, function (data) {
                                        //$$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                                        $$("grdCustomer").selectedRows()[0].click();
                                    });
                                });
                            });
                        }
                        else {
                            alert("Points exceeds...!");
                        }
                    }
                    else {
                        alert("Customer having no points...!");
                    }
                });
            },
            page_load: function () {
                
                $(".basic-info").hide();
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $$("btnPrintCustomerReport").hide();
                $$("btnReportCustomerReport").hide();
                $("#cprint").hide();
                $("#credeem").hide();
                $("#cremove").hide();
                $$("btnSubscription").hide();
                $("#subscription").hide();
                if (CONTEXT.ENABLE_SUBSCRIPTION) {
                    $$("btnSubscriptionReport").show();
                    $("#subscriptionReport").show();
                }
                else {
                    $$("btnSubscriptionReport").hide();
                    $("#subscriptionReport").hide();
                }
                $$("btnBillHistory").hide();
                $("#customerbill").hide();
                page.events.btnSearch_click();
                $$("btnNewCustomer").show();
                //if ($$("ddlBusinessType").selectedValue() == "Other") {
                //    $$("txtOtherType").show();
                //}
                //page.view.selectedGridCustomer([]);
                 $$("txtOtherType").hide();
                $$("ddlBusinessType").selectionChange(function () {
                    if ($$("ddlBusinessType").selectedValue() == "Other") {
                        $$("txtOtherType").show();
                    }
                    else {
                        $$("txtOtherType").hide();
                    }
                })
                //page.controls.grdCustomer.dataBind([]);
                //page.view.selectedGridCustomer([]);
                var dataSourceCustomer = {
                    getData: function (term, callback) {
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.customerAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) { });
                    }
                };
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(city_id,city_name) like '%%'",
                    sort_expression: ""
                }
                page.cityAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.cityList = data;
                });

                //City autocomplete
                page.controls.txtCity.dataBind({
                    getData: function (term, callback) {
                        callback(page.cityList);

                    }
                });
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
                page.controls.txtState.dataBind({
                    getData: function (term, callback) {
                        callback(page.stateList);

                    }
                });
                page.controls.txtState.select(function (item) {
                    if (item == null)
                        page.chk_state = 1;
                    else
                        page.chk_state = 0;
                });
                page.controls.txtState.noRecordFound(function () {
                    page.chk_state = 1;
                })
                page.controls.txtState.allowCustomText(function (item) {
                    page.chk_state = 1;
                    page.controls.txtState.selectedObject.val(item.val());

                });
                page.controls.txtCity.select(function (item) {
                    if (item == null)
                        page.chk_city = 1;
                    else
                        page.chk_city = 0;
                });
                page.controls.txtCity.noRecordFound(function (item) {
                    page.chk_city = 1;
                });
                page.controls.txtCity.allowCustomText(function (item) {
                    page.chk_city = 1;
                    page.controls.txtCity.selectedObject.val(item.val());

                });
                page.controls.txtPincode.dataBind({
                    getData: function (term, callback) {
                        callback(page.pincodeList);
                    }
                });
                page.controls.txtPincode.select(function (item) {
                    if (item != null) {
                        $$("txtCity").selectedObject.val(item.city);
                        $$("txtState").selectedObject.val(item.state);
                        $$("txtPincode").selectedObject.val(item.pincode);
                    }
                });
                page.controls.txtPincode.allowCustomText(function (item) {
                    page.controls.txtPincode.selectedObject.val(item.val());
                });
                //reward plans
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("ddlmyrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name", "Select");
                });

                page.controls.grdPointTransaction.width("100%");
                page.controls.grdPointTransaction.height("400px");
                page.controls.grdPointTransaction.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        //{ 'name': "Cust No", 'rlabel': 'Cust No', 'width': "60px", 'dataField': "cust_no" },
                        { 'name': "Cust No", 'rlabel': 'Cust No', 'width': "60px", 'dataField': "cust_id" },
                        { 'name': "Cust Name", 'rlabel': 'Cust Name', 'width': "200px", 'dataField': "cust_name" },
                        { 'name': "Trans Type", 'rlabel': 'Trans Type', 'width': "110px", 'dataField': "trans_type" },
                        { 'name': "Transaction Date", 'rlabel': 'Trans Date', 'width': "130px", 'dataField': "Transd" },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "100px", 'dataField': "bill_no",visible:false },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code" },
                        { 'name': "Reward Name", 'rlabel': 'Reward Name', 'width': "150px", 'dataField': "reward_plan_name" },
                        { 'name': "Reward Points", 'rlabel': 'Reward Points', 'width': "110px", 'dataField': "points" },
                        { 'name': "Description", 'rlabel': 'Description', 'width': "150px", 'dataField': "description" },
                    ]
                });
                $$("txtpointamount").change(function () {
                    var point = $$("txtpointstoredeem").value();
                    var pointamt = 4;
                    if ($$("txtpointamount").value() != "" && $$("txtpointamount").value() != null && !isNaN($$("txtpointamount").value())) {
                        pointamt = parseFloat($$("txtpointamount").value());
                    }
                    point = point / pointamt;
                    $$("lblamount").value(point);
                });
                $$("txtpointstoredeem").change(function () {
                    var point = $$("txtpointstoredeem").value();
                    var pointamt = 4;
                    if ($$("txtpointamount").value() != "" && $$("txtpointamount").value() != null && !isNaN($$("txtpointamount").value())) {
                        pointamt = parseFloat($$("txtpointamount").value());
                    }
                    point = point / pointamt;
                    $$("lblamount").value(point);
                });
                //$$("txtpointstoredeem").change(function () {
                //    var tot_point = $$("lbltotalpoints").value();

                //    var plan = $$("ddlmyrewardplans").selectedValue();
                //    var myplan;
                //    switch (plan) {
                //        case "1":
                //            myplan = 1;
                //            break;
                //        case "2":
                //            myplan = 2;
                //            break;
                //        case "3":
                //            myplan = 3;
                //            break;
                //        case "4":
                //            myplan = 4;
                //            break;
                //        case "5":
                //            myplan = 5;
                //            break;
                //        default:
                //            myplan = 0;
                //            break;
                //    }
                //    var cal_point = (myplan * tot_point) / 4;
                //    $$("lblamount").value(cal_point);
                //});


                //$$("txtpointstoredeem").change(function () {
                //    var point = $$("txtpointstoredeem").value();
                //    point = point / 4;
                //    $$("lblamount").value(point);
                //})

                $$("chkActive").prop('checked', true);

                $$("txtCustomerSearch").focus();

                //setTimeout(function () {
                    if (CONTEXT.ENABLE_PINCODE_MAPPING) {
                        page.customerService.getPincodeMapping("", function (data) {
                            page.pincodeList = data;
                        });
                    }
                //}, 2000);
                
                    //$$("txtCustomerSearch").keyup(function () {
                    //    var data = {
                    //        start_record: 0,
                    //        end_record: "",
                    //        filter_expression: "concat(ifnull(cust_no,''),ifnull(cust_id,''),ifnull(first_name,''),ifnull(last_name,''),ifnull(phone_no,'')) like '%" + $$("txtCustomerSearch").value() + "%'",
                    //        sort_expression: ""
                    //    }
                    //    page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //        page.controls.grdCustomer.dataBind(item);
                    //    });
                    //})
                    if (false) {
                        $("#customerautobill").show();
                        $$("btnAutoBill").show();
                    }
                    else {
                        $("#customerautobill").hide();
                        $$("btnAutoBill").hide();
                    }
                    $$("ddlRewardTransactionExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value", "Select");
                    $$("ddlExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value", "Select");
            },
            btnSubscriptionReport_click:function(){
                page.controls.pnlSubscriptionReport.open();
                page.controls.pnlSubscriptionReport.title("Subscription Report");
                page.controls.pnlSubscriptionReport.width(1000);
                page.controls.pnlSubscriptionReport.height(600);

                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(ifnull(cust_no,''),ifnull(cust_id,''),ifnull(first_name,''),ifnull(last_name,''),ifnull(phone_no,'')) like '%" + $$("txtCustomerSearch").value() + "%'",
                    sort_expression: ""
                }
                page.customerAPI.searchData(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    $$("ddlCustomer").dataBind(item, "cust_no", "cust_name", "Select");
                });

                page.controls.grdSubscriptionReport.width("100%");
                page.controls.grdSubscriptionReport.height("400px");
                page.controls.grdSubscriptionReport.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Sub Id", 'rlabel': 'Sub Id', 'width': "100px", 'dataField': "sub_id" },
                        { 'name': "Customer Name", 'rlabel': 'Customer Name', 'width': "170px", 'dataField': "cust_name" },
                        { 'name': "Connection Name", 'rlabel': 'Connection Name', 'width': "170px", 'dataField': "conn_name" },
                        { 'name': "Start Date", 'rlabel': 'Start Date', 'width': "100px", 'dataField': "start_date" },
                        { 'name': "End Date", 'rlabel': 'End Date', 'width': "150px", 'dataField': "end_date" },
                        { 'name': "Status", 'rlabel': 'Status', 'width': "150px", 'dataField': "status" },
                        { 'name': "", 'width': "0px", 'dataField': "active" },
                    ]
                });
                $$("grdSubscriptionReport").dataBind([]);
            },
            btnGenerate_click: function () {
                var filter = {};
                filter.fromDate = ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate());
                filter.toDate = ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate());
                filter.cust_no = $$("ddlCustomer").selectedValue() == "-1" ? "" : $$("ddlCustomer").selectedValue();
                filter.comp_id = localStorage.getItem("user_company_id");
                filter.store_no = localStorage.getItem("user_store_no");
                page.reportAPI.subscriptionReport(filter, function (data) {
                    $$("grdSubscriptionReport").dataBind(data);
                });
            },
            btnBillHistory_click: function () {
                page.controls.pnlBillHistory.open();
                page.controls.pnlBillHistory.title("Customer Bill History");
                page.controls.pnlBillHistory.rlabel("Customer Bill History");
                page.controls.pnlBillHistory.width(1200);
                page.controls.pnlBillHistory.height(600);

                page.controls.grdBillHistory.width("100%");
                page.controls.grdBillHistory.height("450px");
                page.controls.grdBillHistory.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "120px", 'dataField': "bill_code" },
                        { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "120px", 'dataField': "state_text" },
                        { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "140px", 'dataField': "bill_date" },
                        { 'name': "Bill Month", 'rlabel': 'Bill Month', 'width': "120px", 'dataField': "sch_id", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                        { 'name': "Due Date", 'width': "90px", 'dataField': "due_date", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                        { 'name': "Customer", 'rlabel': 'Customer', 'width': "200px", 'dataField': "cust_name" },
                        { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "135px", 'dataField': "total" },
                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "100px", 'dataField': "paid" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "110px", 'dataField': "balance" },
                    ]
                });
                $$("grdBillHistory").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        page.billAPI.searchValues("", "", "b.cust_no=" + page.controls.grdCustomer.selectedData(0)[0].cust_no, "bill_no desc", function (data) {
                            var totalRecord = data.length;
                            page.billAPI.searchValues("", "", "b.cust_no=" + page.controls.grdCustomer.selectedData(0)[0].cust_no, "bill_no desc", function (data) {
                                callback(data, totalRecord);
                            });
                        });
                    },
                    update: function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });
            },
        };
        page.view = {
            selectedGridCustomer:function(data){
                page.controls.grdCustomer.width("550px");
                page.controls.grdCustomer.height("455px");
                page.controls.grdCustomer.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        //{ 'name': "Cust No", 'rlabel': 'Cust No', 'width': "60px", 'dataField': "cust_no" },
                        { 'name': "Cust No", 'rlabel': 'Cust No', 'width': "60px", 'dataField': "cust_id" },
                        { 'name': "Cust Name", 'rlabel': 'Cust Name', 'width': "150px", 'dataField': "cust_name" },
                        { 'name': "Mobile No", 'rlabel': 'Mobile No', 'width': "130px", 'dataField': "phone_no" },
                        { 'name': "Alt Mobile No", 'rlabel': 'Alternate Mobile No', 'width': "130px", 'dataField': "alter_mobile" },
                    ]
                });
                page.controls.grdCustomer.rowBound = function (row, item) {
                    row.css("cursor", "pointer");
                    row.click(function () {
                        row.parent().children("div").css("background-color", "");

                    });
                }

                page.controls.grdCustomer.selectionChanged = page.events.grdCustomer_select;
                page.controls.grdCustomer.dataBind(data);
            },
            selectedCustomerBill: function(data){
                page.controls.grdCustomerBill.width("100%");
                page.controls.grdCustomerBill.height("380px");
                page.controls.grdCustomerBill.setTemplate({
                    selection: "Multiple", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Customer Name", 'rlabel': "Customer Name", 'width': "150px", 'dataField': "cust_name" },
                        { 'name': "Bill No", 'rlabel': "Bill No", 'width': "100px", 'dataField': "bill_code" },
                        { 'name': "Bill Date", 'rlabel': "Bill Date", 'width': "130px", 'dataField': "bill_date" },
                        { 'name': "Sch Date", 'rlabel': "Sch Date", 'width': "100px", 'dataField': "sch_id" },
                        { 'name': "Amount", 'rlabel': "Amount", 'width': "100px", 'dataField': "total" },
                        //{ 'name': "Balance", 'rlabel': "Balance", 'width': "100px", 'dataField': "balance" },
                    ]
                });
                $$("grdCustomerBill").dataBind(data);
            }
        }
        page.events.btnSaveUser_click = function () {
            try{
                if (!ValidateUserName($$("txtUserName").value())) {
                    $$("txtUserName").focus();
                    throw "User Name Is Not Valid";
                }
                var data = {
                    user_name: $$("txtUserName").value(),
                    email_id: $$("txtEmail").value(),
                    comp_id: localStorage.getItem("comp_id"),
                    password: $$("txtPassword").value(),
                    full_name: $$("txtUserName").value(),
                    phone_no: $$("txtPhone").value()
                }
                if ($$("lblUserId").html() == "") {
                    page.userAPI.insertUser(data, function (data) {
                        $$("lblUserId").html(data[0].user_id);
                        var member = {
                            user_id: $$("lblUserId").html(),
                            comp_prod_id: localStorage.getItem("user_company_id"),
                            group_id: 52,
                        };
                        page.UserGroupAPI.postValue(member, function (data) {
                            page.save();
                            alert("User Access Created");
                        });
                    });
                }
                else {
                    data.user_id = $$("lblUserId").html();
                    page.userAPI.putValue(data.user_id,data, function (data) {
                        alert("User Access Updated");
                    });
                }
            }
            catch (e) {
                alert(e);
            }
        }
        page.events.btnbtnRewardTransactionReport_click = function () {
            page.controls.pnlRewardTransactionPrintingPopup.open();
            page.controls.pnlRewardTransactionPrintingPopup.title("Report Type");
            page.controls.pnlRewardTransactionPrintingPopup.rlabel("Report Type");
            page.controls.pnlRewardTransactionPrintingPopup.width(500);
            page.controls.pnlRewardTransactionPrintingPopup.height(200);
            //PrintDataPR(0);
        }
        page.events.btnPrintRewardTransaction_click = function () {
            var detail_list = [];
            var detail = page.controls.grdPointTransaction.allData();
            $(detail).each(function (i, item) {
                detail_list.push({
                    "Customer Id": item.cust_id,
                    "Customer Name": item.cust_name,
                    "Trans Type": item.trans_type,
                    "Transaction Date": item.Transd,
                    "Bill No": item.bill_no,
                    "Reward Name": item.reward_plan_name,
                    "Reward Points": parseFloat(item.points).toFixed(2),
                });
            });
            var accountInfo =
            {
                "CompName": CONTEXT.COMPANY_NAME,
                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                "ReportName": "Customer Reward Transaction",
                "Details": detail_list
            };

            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/customer-reward-transaction-report.jrxml", accountInfo, $$("ddlRewardTransactionExportType").selectedValue());
        }
        function PrintData(dataList) {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;
            doc.write("<h1 align='center'> " + CONTEXT.COMPANY_NAME + "</h1>");
            doc.write("<br><header align='center'> <h3>Customer Report</h3></header>");

            doc.write("<table align='center'  style='width:550px; align:center;' cellpadding='0' cellspacing='0' border='1'>");
            doc.write("<tr style='font-weight:bold;color: white; background-color:gray;'>");
            doc.write("<th style='width:80px'>Cust No</th>");
            doc.write("<th style='width:280px'>Customer Name</th>");
            doc.write("<th style='width:120px'>Mobile No</th></tr>");

            $(dataList).each(function (i, data) {
                if (head == false || head == true) {
                    doc.write("<tr><td align='center'>" + data.cust_no + "</td>");
                    doc.write("<td align='left'>" + data.cust_name + "</td>");
                    doc.write("<td align='center'>" + data.phone_no + "</td></tr>");

                    doc.write("</tr>");
                    head = true;
                }
                doc.write("<tr>");
                doc.write("</tr>");
            });
            doc.write("</table> <br><br><div align='right'><h3> Authorized Signature</h3></div>");
            doc.write("<footer> <h2 align='center'>" + CONTEXT.ClientAddress + "</h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

            doc.close();
            r.focus();
            r.print();


        }
        //Auto Bill Generate
        page.events.btnAutoBill_click = function () {
            if (confirm("Are You Sure Want To Generate The Bill")) {
                var data = {
                    sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                }
                page.SubscriptionPlanAPI.getAutoBillItems(data, function (data) {
                    alert("Bill Generated Successfully!!");
                }, function (data) {
                    alert("Some Internal Problem Will Occur Please Try Again Later");
                });
            }
        }
        page.events.btnBillSearch_click = function () {
            var filter = "";
            if ($$("dsBillStartDate").getDate() != "") {
                filter = (filter != "") ? filter + " and " : filter;
                filter = filter + "date(bill_date) >= '" + dbDate($$("dsBillStartDate").getDate())+"'";
            }
            if ($$("dsBillEndDate").getDate() != "") {
                filter = (filter != "") ? filter + " and " : filter;
                filter = filter + "date(bill_date) <= '" + dbDate($$("dsBillEndDate").getDate()) + "'";
            }
            if ($$("ddlBillCustomerName").selectedValue() != "-1") {
                filter = (filter != "") ? filter + " and " : filter;
                filter = filter + "cust_no = " + $$("ddlBillCustomerName").selectedValue();
            }
            //page.billService.getBillByNo(temp_search, function (data) {
            page.billAPI.searchValues("", "", filter, "", function (data) {
                $$("grdCustomerBill").dataBind(data);
            });
        }
        page.events.btnbtnCustomerBillPrint_click = function () {
            $(page.controls.grdCustomerBill.selectedData()).each(function (i, item) {
                page.events.btnPrintBill_click(item.bill_no);//, function (data) {
                //    alert("Selected Bill Printed Successfully");
                //});
            });
        }
        page.events.btnPrintBill_click = function (billNo, callback) {
            //if (i == bills.length) {
            //    callback();
            //}
            //else {
            page.stockAPI.getSalesBill(billNo, function (data) {
                    var bill = data;
                    var billItem = data.bill_items;
                    var exp_type ="PDF";
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
            var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
            var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            function inWords(num) {
                if ((num = num.toString()).length > 9) return 'overflow';
                n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
                if (!n) return; var str = '';
                str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
                str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
                str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
                str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
                str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
                return str + " Only";
            }
        }
        
    });
}
