$.fn.manageSalesExecutive = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.salesExecutiveService = new SalesExecutiveService();
        page.salesexecutiverewardAPI = new SalesExecutiveRewardAPI();
        page.salesexecutiverewardplanAPI = new SalesExecutiveRewardPlanAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.salesExecutiveRewardService = new SalesExecutiveRewardService();
        page.uploadAPI = new UploadAPI();
        page.userAPI = new UserAPI();
        page.UserGroupAPI = new UserGroupAPI();
        page.cityAPI = new CityAPI();
        page.citystateAPI = new CityStateAPI();
        page.customerService = new CustomerService();
        page.printCount = 1;
        page.pincodeList = null;
        function confirmManualDisc() {
            var defer = $.Deferred();

            $("#dialog-form").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#manualcount");
                        //Do your code here
                        page.printCount = text1.val();
                        defer.resolve("Ok");
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        defer.resolve("Cancel");

                        $(this).dialog("close");
                    }
                }
            });
            return defer.promise();
        }

        document.title = "ShopOn - Sales Executive";
        $("body").keydown(function (e) {
            //now we caught the key code
            var keyCode = e.keyCode || e.which;

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
                page.events.btnBeforeRemove_click();
            }
            if (e.keyCode == 80 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnPrintCustomerReport_click();
            }
        });
        
        page.select = function (item) {
            $$("btnSearch").show();
            $$("btnNewCustomer").show();
            $$("btnSave").show();
            $$("btnRemove").show();
            $("#iupdate").show();
            if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD) {
                $$("btnRewardTransaction").show();
                $$("btnRedeemReward").show();
                $(".credeem").show();
                $("#rewardsRedeems").show();
                $$("btnRewardPayment").show();
            }
            else {
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $(".credeem").hide();
                $("#rewardsRedeems").hide();
                $$("btnRewardPayment").hide();
            }
            if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE) {
                $$("btnPrintBarcode").show();
                $(".crepending").show();
            }
            else {
                $$("btnPrintBarcode").hide();
                $(".crepending").hide();
            }
            
            $$("hdnCustNo").html(nvl(item.sale_executive_no, ""));
            $$("txtFirstName").value(nvl(item.sale_executive_name, ""));
            $$("txtCompanyName").value(nvl(item.company_name, ""));
            $$("txtCompany").value(nvl(item.company_id, ""));
            $$("txtDOB").setDate(nvl(item.date_of_birth, ""));
            $$("txtAddressLine2").value(nvl(item.address, ""));
            $$("txtAddressLine1").value(nvl(item.address1, ""));
            $$("txtStreet").value(nvl(item.address2, ""));
            $$("txtPincode").selectedObject.val(nvl(item.zip_code, ""));
            $$("txtCity").selectedObject.val(nvl(item.city, ""));
            $$("txtState").selectedObject.val(nvl(item.state, ""));
            var mobile1 = item.phone_no;
            (mobile1 == "" || mobile1 == null) ? $$("txtPhone").value('') : $$("txtPhone").value(item.phone_no);
            $$("txtEmail").value(nvl(item.email, ""));
            $$("txtArea").value(nvl(item.area, ""));
            //Bank Details
            $$("txtBankName").value(nvl(item.bank_name, ""));
            $$("txtAcntNo").value(nvl(item.account_no, ""));
            $$("txtifsccode").value(nvl(item.ifsc_code, ""));
            //$$("txtgstno").value(nvl(item.gst_no, ""));
            $$("txtlicenseno").value(nvl(item.license_no, ""));
            $$("txtPanNo").value(nvl(item.pan_no, ""));
            $$("txtAadhaarNo").value(nvl(item.aadar_no, ""));
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

            $("[controlid = txtlicenseno]").each(function () {
                this.value = this.value.replace(/-/g, ",");
            });
            $("[controlid = txtAddressLine2]").each(function () {
                this.value = this.value.replace(/-/g, ",");
            });

            if (item.saexe_active == 1) {
                $$("chkActive").prop('checked', true);
            }
            else {
                $$("chkActive").prop('checked', false);
            }
            if (item.reward_plan_id == null)
            {
                $$("ddlmyrewardplans").selectedValue("-1");
            }
            else {
                $$("ddlmyrewardplans").selectedValue(item.reward_plan_id);
            }

            $$("lblrewardpoint").value(item.points);
            $$("lbltotalpoints").value(item.points);

            $$("txtFirstName").focus();
        };

        page.delete = function (callback) {
            if ($$("hdnCustNo").val() != "") {
                $$("msgPanel").show("Removing sales executive...");
                var data = {
                    sale_executive_no: $$("hdnCustNo").val()
                }
                page.salesexecutiveAPI.deleteValue(data.sale_executive_no, data, function (data) {
                    $$("msgPanel").show("Sales executive removed sucessfully...!");
                    page.events.btnSearch_click();

                    $$("hdnCustNo").val('');

                    $$("txtFirstName").val('');
                    $$("txtCompanyName").val('');
                    $$("txtCompany").val('');
                    $$("txtDOB").setDate('');
                    //$$("txtStreet").val('');
                    $$("txtAddressLine2").val('');
                    $$("txtAddressLine1").value("");
                    $$("txtStreet").value("");
                    $$("txtPincode").selectedObject.val("");
                    $$("txtCity").selectedObject.val("");
                    $$("txtState").selectedObject.val("");
                    $$("txtPhone").val('');
                    //$$("txtLandline").val('');
                    $$("txtEmail").val('');
                    $$("txtArea").val('');
                    $$("txtPanNo").val('');
                    $$("txtAadhaarNo").val('');
                    $$("lblUserId").html("");
                    $$("txtUserName").value("");
                    $$("txtPassword").value("");
                    $$("chkActive").prop('checked', true);

                    $$("btnSearch").show();
                    $$("btnNewCustomer").show();
                    $$("btnSave").hide();
                    $$("btnRemove").hide();
                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD) {
                        $$("btnRewardTransaction").hide();
                        $$("btnRedeemReward").hide();
                        $("#credeem").hide();
                    }
                    else {
                        $$("btnRewardTransaction").hide();
                        $$("btnRedeemReward").hide();
                        $("#credeem").hide();
                    }
                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE) {
                        $$("btnPrintBarcode").show();
                        $(".crepending").show();
                    }
                    else {
                        $$("btnPrintBarcode").hide();
                        $(".crepending").hide();
                    }
                    $("#rewardsRedeems").hide();
                    $$("btnRewardPayment").hide();
                });
            } else {
                $$("msgPanel").show("Please select a sales executive first...!");
            }
        }
        page.save = function (callback) {
            $$("btnSearch").show();
            $$("btnNewCustomer").show();
            $$("btnSave").show();
            $$("btnRemove").hide();
            if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD) {
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $("#credeem").hide();
            }
            else {
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $("#credeem").hide();
            }
            if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE) {
                $$("btnPrintBarcode").show();
                $(".crepending").show();
            }
            else {
                $$("btnPrintBarcode").hide();
                $(".crepending").hide();
            }
            $("#rewardsRedeems").hide();
            $$("btnRewardPayment").hide();
            $("[controlid = txtlicenseno]").each(function () {
                this.value = this.value.replace(/,/g, "-");
            });
            $("[controlid = txtAddressLine2]").each(function () {
                this.value = this.value.replace(/,/g, "-");
            });
            var data = {
                sale_executive_name: $$("txtFirstName").val(),
                company_name: $$("txtCompanyName").val(),
                company_id: $$("txtCompany").val(),
                date_of_birth: dbDate($$("txtDOB").getDate()),
                address: $$("txtAddressLine2").val(),
                address1: $$("txtAddressLine1").value(),
                address2: $$("txtStreet").value(),
                zip_code: $$("txtPincode").selectedObject.val(),
                city: $$("txtCity").selectedObject.val(),
                state: $$("txtState").selectedObject.val(),
                phone_no: ($$("txtPhone").value() == "") ? "" : $$("txtPhone").value(),
                email: $$("txtEmail").val(),
                area: $$("txtArea").val(),
                bank_name: $$("txtBankName").val(),
                account_no: $$("txtAcntNo").val(),
                ifsc_code: $$("txtifsccode").val(),
                license_no: $$("txtlicenseno").val(),
                pan_no: $$("txtPanNo").val(),
                aadar_no: $$("txtAadhaarNo").val(),
                reward_plan_id: ($$("ddlmyrewardplans").selectedValue() == null) ? "-1" : $$("ddlmyrewardplans").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                user_id: $$("lblUserId").html()
            }
            
            if ($$("chkActive").prop("checked"))
                data.saexe_active = 1;
            else
                data.saexe_active = 0;

            if ($$("hdnCustNo").val() != "") {
                if ($$("txtPhone").value() == "") {
                    page.update();
                }
                else {
                    page.salesexecutiveAPI.searchValues("", "", " ifnull(phone_no,'') like '" + $$("txtPhone").value() + "'", "", function (item) {
                        if (item.length == 0) {
                            page.update();
                        }
                        else {
                            if (item[0].sale_executive_no == $$("hdnCustNo").val()) {
                                page.update();
                            }
                            else {
                                if (confirm("This Mobile No Is Already Register With Other Sales Executive Are You Want To Sure To Save It Again?")) {
                                    page.update();
                                }
                            }
                        }
                    });
                }
            }
            else {
                if ($$("txtPhone").value() == "") {
                    page.insert();
                }
                else {
                    page.salesexecutiveAPI.searchValues("", "", " ifnull(phone_no,'') like '" + $$("txtPhone").value() + "'", "", function (item) {
                        if (item.length == 0) {
                            page.insert();
                        }
                        else {
                            if (confirm("This Mobile No Is Already Register With Other Sales Executive Are You Want To Sure To Save It Again?")) {
                                page.insert();
                            }
                        }
                    });
                }
            }
            $$("btnSave").disable(false);
        };
        page.insert = function () {
            var data = {
                sale_executive_name: $$("txtFirstName").val(),
                company_name: $$("txtCompanyName").val(),
                company_id: $$("txtCompany").val(),
                date_of_birth: dbDate($$("txtDOB").getDate()),
                address: $$("txtAddressLine2").val(),
                address1: $$("txtAddressLine1").value(),
                address2: $$("txtStreet").value(),
                zip_code: $$("txtPincode").selectedObject.val(),
                city: $$("txtCity").selectedObject.val(),
                state: $$("txtState").selectedObject.val(),
                phone_no: ($$("txtPhone").value() == "") ? "" : $$("txtPhone").value(),
                email: $$("txtEmail").val(),
                area: $$("txtArea").val(),
                bank_name: $$("txtBankName").val(),
                account_no: $$("txtAcntNo").val(),
                ifsc_code: $$("txtifsccode").val(),
                license_no: $$("txtlicenseno").val(),
                pan_no: $$("txtPanNo").val(),
                aadar_no: $$("txtAadhaarNo").val(),
                reward_plan_id: ($$("ddlmyrewardplans").selectedValue() == null) ? "-1" : $$("ddlmyrewardplans").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                user_id: $$("lblUserId").html()
            }

            if ($$("chkActive").prop("checked"))
                data.saexe_active = 1;
            else
                data.saexe_active = 0;
            $$("msgPanel").show("Inserting new sales executive...");
            page.salesexecutiveAPI.postValue(data, function (cust) {
                data.sales_executive_no = cust[0].key_value;
                $$("msgPanel").show("Sales executive saved successfully...!");
                $$("btnSave").disable(false);
                // Add New Data Only to the Grid
                var sales = {
                    sale_executive_no: cust[0].key_value
                }
                page.salesexecutiveAPI.getValue(sales, function (item) {
                    //page.salesExecutiveService.getSaleExecutiveById(data.sales_executive_no, function (item) {
                    page.controls.grdCustomer.dataBind(item);
                    $$("grdCustomer").getAllRows()[0].click();
                    $$("msgPanel").hide();
                });

            });
        }
        page.update = function () {
            var data = {
                sale_executive_name: $$("txtFirstName").val(),
                company_name: $$("txtCompanyName").val(),
                company_id: $$("txtCompany").val(),
                date_of_birth: dbDate($$("txtDOB").getDate()),
                address: $$("txtAddressLine2").val(),
                address1: $$("txtAddressLine1").value(),
                address2: $$("txtStreet").value(),
                zip_code: $$("txtPincode").selectedObject.val(),
                city: $$("txtCity").selectedObject.val(),
                state: $$("txtState").selectedObject.val(),
                phone_no: ($$("txtPhone").value() == "") ? "" : $$("txtPhone").value(),
                email: $$("txtEmail").val(),
                area: $$("txtArea").val(),
                bank_name: $$("txtBankName").val(),
                account_no: $$("txtAcntNo").val(),
                ifsc_code: $$("txtifsccode").val(),
                license_no: $$("txtlicenseno").val(),
                pan_no: $$("txtPanNo").val(),
                aadar_no: $$("txtAadhaarNo").val(),
                reward_plan_id: ($$("ddlmyrewardplans").selectedValue() == null) ? "-1" : $$("ddlmyrewardplans").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                user_id: $$("lblUserId").html()
            }

            if ($$("chkActive").prop("checked"))
                data.saexe_active = 1;
            else
                data.saexe_active = 0;
            data.sale_executive_no = $$("hdnCustNo").val();
            $$("msgPanel").show("Updating sales executive...");
            page.salesexecutiveAPI.putValue(data.sale_executive_no, data, function (data1) {

                $$("msgPanel").show("Sales executive updated successfully...!");
                $$("btnSave").disable(false);
                var sales = {
                    sale_executive_no: data.sale_executive_no
                }
                page.salesexecutiveAPI.getValue(sales, function (data) {

                    // Update the new data to Grid
                    $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                    $$("grdCustomer").selectedRows()[0].click();
                    $$("msgPanel").hide();

                });
            });
        }

        page.events = {
            btnSearch_click: function () {
                //$(".detail-panel").hide();
                $(".basic-info").hide();
                $(".credeem").hide();
                $$("msgPanel").show("Searching...");
                var data = {
                    start_record: 0,
                    end_record: "",
                    //filter_expression: "concat(ifnull(sale_executive_no,''),ifnull(sale_executive_id,''),ifnull(sale_executive_name,''),ifnull(phone_no,'')) like '%" + $$("txtSalesExecutiveSearch").value() + "%'",
                    filter_expression: "concat(ifnull(sale_executive_id,''),ifnull(sale_executive_name,''),ifnull(phone_no,'')) like '%" + $$("txtSalesExecutiveSearch").value() + "%'",
                    sort_expression: ""
                }
                page.salesexecutiveAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.salesExecutiveService.getSaleExecutiveByAll($$("txtSalesExecutiveSearch").value(), function (item) {
                    page.controls.grdCustomer.dataBind(item);
                    $$("msgPanel").hide();
                });
                //page.controls.grdCustomer.dataBind([]);
                //page.select({});
                $$("btnSearch").show();
                $$("btnNewCustomer").show();
                $$("btnSave").hide();
                $$("btnRemove").hide();
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $("#credeem").hide();
                $$("chkActive").prop('checked', true);
                $$("btnPrintBarcode").hide();
                $(".crepending").hide();
                $("#rewardsRedeems").hide();
                $$("btnRewardPayment").hide();
                $("#iupdate").hide();
            },
            grdCustomer_select: function (row, item) {
                //show right panel
                $(".basic-info").show();
                $$("btnNewCustomer").show();
                $$("hdnCustNo").val(item.sale_executive_no);
                page.select(item);
                (CONTEXT.ENABLE_SALES_EXECUTIVE_LOGIN) ? $$("pnlMoreAction").show() : $$("pnlMoreAction").hide();
                (CONTEXT.ENABLE_EXECUTIVE_BANK_DETAILS) ? $$("pnlBankDetails").show() : $$("pnlBankDetails").hide();
            },
            btnNewCustomer_click: function (row, item) {
                
                $$("hdnCustNo").val("");
                $$("hdnCustNo").html("");
                page.events.btnSearch_click();
                $(".basic-info").show();
                page.select({});
                page.controls.grdCustomer.dataBind([]);
                $$("btnSearch").show();
                $$("btnSave").show();
                $$("btnRemove").hide();
                $("#credeem").hide();
                $$("btnRewardTransaction").hide();
                $$("btnRedeemReward").hide();
                $$("btnPrintBarcode").hide();
                $(".crepending").hide();
                $("#rewardsRedeems").hide();
                $$("btnRewardPayment").hide();

                $$("chkActive").prop('checked', true);
                $$("lblrewardpoint").value("0.00");
                $$("txtFirstName").focus();
                //$$("msgPanel").hide();
                $$("pnlMoreAction").hide();
                (CONTEXT.ENABLE_EXECUTIVE_BANK_DETAILS) ? $$("pnlBankDetails").show() : $$("pnlBankDetails").hide();
            },
            btnSave_click: function () {
                $$("btnSave").disable(true);
                var cus_phone = $$("txtPhone").val();
                var cus_fname = $$("txtFirstName").val();
                var cus_lname = $$("txtCompanyName").val();
                var cus_email = $$("txtEmail").val();
                //var pincode = $$("txtPincode").val();
                var acnt_no = $$("txtAcntNo").val();
                var aadar = $$("txtAadhaarNo").val();
                var bname = $$("txtBankName").val();
                var area = $$("txtArea").val();
                //var land_no = $$("txtLandline").val();
                try{
                    if (cus_fname == "") {
                        throw"Sales executive name is mandatory ...!";
                        $$("txtFirstName").focus();
                    }
                    if (cus_fname != "" && !isNaN(cus_fname)) {
                        throw"Sales executive name should only contains characters ...!";
                        $$("txtFirstName").focus();
                    }
                    if (cus_lname != "" && !isNaN(cus_lname)) {
                        throw"Company name should only contains characters ...!";
                        $$("txtLastName").focus();
                    }

                    if (cus_phone != "" && !isInt(cus_phone)) {
                        throw"Mobile no should only contain numbers ...!";
                        $$("txtPhone").focus();
                    }
                    if (cus_phone != "" && cus_phone.length < 10) {
                        throw "Mobile no should be 10 in length...!";
                        $$("txtPhone").focus();
                    }
                    if (cus_email != "" && !ValidateEmail(cus_email)) {
                        throw"Email address is not valid...!";
                        $$("txtEmail").focus();
                    }
                    if (isNaN(acnt_no)) {
                        throw"Account Number should be a number...!";
                        $$("txtAcntNo").focus();
                    }
                    if (isNaN(aadar)) {
                        throw"Aadhaar Number should be a number...!";
                        $$("txtAadhaarNo").focus();
                    }
                    if (bname != "" && !isNaN(bname)) {
                        throw"Bank name should only contains characters ...!";
                        $$("txtBankName").focus();
                    }
                    if (area != "" && !isNaN(area)) {
                        throw"Area should only contains characters ...!";
                        $$("txtArea").focus();
                    }
                    
                    page.save();
                    $$("btnNewCustomer").show();
                    $$("msgPanel").hide();
                    $$("txtFirstName").focus();
                    
                }
                catch (e) {
                    alert(e)
                    $$("btnSave").disable(false);
                }
            },
            btnBeforeRemove_click: function () {
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
            btnRewardTransaction_click: function () {
                page.controls.pnlPointTransaction.open();
                page.controls.pnlPointTransaction.title("Reward Transaction");
                page.controls.pnlPointTransaction.width(1200);
                page.controls.pnlPointTransaction.height(600);
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: " a.sale_executive_no =" + $$("hdnCustNo").val(),
                    sort_expression: ""
                }
                page.salesexecutiverewardAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.salesExecutiveRewardService.getPointTransaction($$("hdnCustNo").val(), function (item) {
                   page.controls.grdPointTransaction.dataBind(item);
                });


            },
            btnRedeemReward_click: function () {
                page.controls.pnlRedeemReward.open();
                page.controls.pnlRedeemReward.title("Redeem Reward");
                $$("txtpointstoredeem").val("");
                $$("lblamount").value("");
                $$("txtDescription").value("");
                $$("txtpointstoredeem").focus();
                page.controls.pnlRedeemReward.width(500);
                page.controls.pnlRedeemReward.height(400);
                $$("txtpointamount").value(4);
            },
            btnSavePoints_click: function () {
                if (parseFloat($$("lbltotalpoints").value()) > 0) {
                    if (parseFloat($$("lbltotalpoints").value()) >= parseInt($$("txtpointstoredeem").val())) {
                            var data = {

                                sales_executive_no: $$("hdnCustNo").val(),
                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                bill_no: "-1",
                                ver_no: "1",
                                reward_plan_id: $$("ddlmyrewardplans").selectedValue(),
                                points: $$("txtpointstoredeem").val(),
                                trans_type: "Debit",
                                description: $$("txtDescription").value(),
                                setteled_amount: $$("lblamount").value()
                            }
                            page.salesExecutiveRewardService.insertSalesExecutiveRewardt(data, function (data1) {
                                //PrintData(data);
                               // page.accService.insertExpense(finfactsdata, function (response) {
                                    page.controls.pnlRedeemReward.close();
                                    $$("msgPanel").show("Points used successfully...!");
                                    //page.salesExecutiveService.getSaleExecutiveById($$("hdnCustNo").val(), function (data) {

                                    //    // Update the new data to Grid
                                    //    $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                                    //    $$("grdCustomer").selectedRows()[0].click();
                                    //});
                                    page.salesexecutiveAPI.getValue({ sale_executive_no: $$("hdnCustNo").val() }, function (data) {
                                        $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                                        $$("grdCustomer").selectedRows()[0].click();
                                    });
                                    $$("msgPanel").hide();
                              //  });
                            });
                        }
                        else {
                            alert("Points exceeds...!");
                        }
                    }
                    else {
                        alert("Customer having no points...!");
                    }
                //});
            },
            
            page_load: function () {
                
                $(".basic-info").hide();
                $(".credeem").hide();
                page.events.btnSearch_click();
                //page.events.btnNewCustomer_click();
                $$("btnNewCustomer").show();
                page.controls.grdCustomer.width("100%");
                page.controls.grdCustomer.height("480px");
                page.controls.grdCustomer.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        //{ 'name': "ID", 'rlabel': 'No', 'width': "60px", 'dataField': "sale_executive_no" },
                        { 'name': "ID", 'rlabel': 'No', 'width': "60px", 'dataField': "sale_executive_id" },
                        { 'name': "Executive Name", 'rlabel': 'Executive Name', 'width': "150px", 'dataField': "sale_executive_name" },
                        { 'name': "Mobile No", 'rlabel': 'Mobile No', 'width': "130px", 'dataField': "phone_no" },
                    ]
                });

                page.controls.grdCustomer.rowBound = function (row, item) {
                    row.css("cursor", "pointer");
                    row.click(function () {
                        row.parent().children("div").css("background-color", "");
                       
                    });
                }
                page.controls.grdCustomer.selectionChanged = page.events.grdCustomer_select;
                page.controls.grdCustomer.dataBind([]);

                page.controls.grdPointTransaction.width("100%");
                page.controls.grdPointTransaction.height("400px");
                page.controls.grdPointTransaction.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        //{ 'name': "Executive No", 'width': "60px", 'dataField': "sale_executive_no" },
                        { 'name': "Executive No", 'width': "110px", 'dataField': "sale_executive_id" },
                        { 'name': "Executive Name", 'width': "220px", 'dataField': "sale_executive_name" },
                        { 'name': "Trans Type", 'width': "120px", 'dataField': "trans_type" },
                        { 'name': "Transaction Date", 'width': "130px", 'dataField': "Transd" },
                        { 'name': "Bill No", 'width': "130px", 'dataField': "bill_code" },
                        { 'name': "Reward Name", 'width': "170px", 'dataField': "reward_plan_name" },
                        { 'name': "Reward Points", 'width': "120px", 'dataField': "points" },
                    ]
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.salesexecutiverewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.salesExecutiveRewardService.getActiveReward(function (data) {
                    $$("ddlmyrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name", "Select");
                    $$("ddlredeemrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name", "Select");
                });
                $$("ddlredeemrewardplans").selectionChange(function () {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: " 1=1 having points >0",
                        sort_expression: ""
                    }
                    if ($$("ddlredeemrewardplans").selectedValue() != "-1") {
                        data.filter_expression = "se.reward_plan_id=" + $$("ddlredeemrewardplans").selectedValue() + " having points >0 ";
                    }
                    page.salesexecutiveAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                        page.controls.grdRewardAmount.dataBind(item);
                    });
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
                $$("txtSalesExecutiveSearch").focus();

                //$$("txtSalesExecutiveSearch").keyup(function () {
                //    var data = {
                //        start_record: 0,
                //        end_record: "",
                //        filter_expression: "concat(ifnull(sale_executive_no,''),ifnull(sale_executive_name,''),ifnull(phone_no,'')) like '%" + $$("txtSalesExecutiveSearch").value() + "%'",
                //        sort_expression: ""
                //    }
                //    page.salesexecutiveAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //        page.controls.grdCustomer.dataBind(item);
                //    });
                //});
                if (CONTEXT.ENABLE_PINCODE_MAPPING) {
                    page.customerService.getPincodeMapping("", function (data) {
                        page.pincodeList = data;
                    });
                }
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
                page.controls.txtCity.allowCustomText(function (item) {
                    page.controls.txtCity.selectedObject.val(item.val());
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
                page.controls.txtState.allowCustomText(function (item) {
                    page.controls.txtState.selectedObject.val(item.val());

                });

                $$("ddlRewardTransactionExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
                $$("ddlRewardPaymentExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
            }

        };

        page.events.btnPrintBarcode_click = function () {
            if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE) {
                var template = "Template3";
                if (template == "Template1") {
                    confirmManualDisc().then(function (answer) {
                        if (answer == "Ok") {
                            var printBox = {
                                PrinterName: "Microsoft Print to PDF",
                                Width: 500,
                                Height: 90,
                                Lines: []
                            };
                            //Barcode Printer Code
                            //Set The ASCII of Name
                            var se_name = $$("txtFirstName").value();
                            var a = se_name[0].charCodeAt(0);
                            var b = se_name[1].charCodeAt(0);
                            var c = se_name[2].charCodeAt(0);

                            printBox.Lines.push({ StartX: 25, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 160, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 300, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 25, StartY: 25, BarcodeText: $$("hdnCustNo").val() + "" + b + "" + c , FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 160, StartY: 25, BarcodeText: $$("hdnCustNo").val() + "" + b + "" + c, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 300, StartY: 25, BarcodeText: $$("hdnCustNo").val() + "" + b + "" + c, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 25, StartY: 25, BarcodeText: $$("hdnCustNo").val() + "" + b + "" + c, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 160, StartY: 25, BarcodeText: $$("hdnCustNo").val() + "" + b + "" + c, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 300, StartY: 25, BarcodeText: $$("hdnCustNo").val() + "" + b + "" + c, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 25, StartY: 68, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 160, StartY: 68, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 300, StartY: 68, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                            for (var i = 0; i < parseInt(page.printCount) ; i++)
                                PrintService.PrintBarcode(printBox);
                        }
                    });
                }
                else if (template == "Template2") {
                    confirmManualDisc().then(function (answer) {
                        if (answer == "Ok") {

                            var printBox = {

                                PrinterName: "Microsoft Print to PDF",
                                Width: 500,
                                Height: 80,
                                Lines: []
                            };
                            //Barcode Printer Code
                            //Set The ASCII of Name
                            var se_name = $$("txtFirstName").value().toUpperCase();
                            var a = se_name[0].charCodeAt(0);
                            var b = se_name[1].charCodeAt(0);
                            var c = se_name[2].charCodeAt(0);
                            //var sales_exe_no = parseInt($$("hdnCustNo").val()) + parseInt(b);
                            var sales_exe_no = $$("hdnCustNo").val();//getFullCode($$("hdnCustNo").val());

                            printBox.Lines.push({ StartX: 20, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 120, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 220, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 320, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 15, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 115, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 215, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 315, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 15, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 115, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 215, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 315, StartY: 25, BarcodeText: $$("hdnCustNo").val(), FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 20, StartY: 65, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 120, StartY: 65, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 220, StartY: 65, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 320, StartY: 65, Text: ($$("txtFirstName").value()).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                            for (var i = 0; i < parseInt(page.printCount) ; i++) {
                                if (i + 1 == parseInt(page.printCount)) {
                                    PrintService.PrintBarcode(printBox);
                                    alert("Barcode Printed Successfully");
                                }
                                else {
                                    PrintService.PrintBarcode(printBox);
                                }
                            }
                        }
                    });
                }
                else if (template == "Template3") {
                    //page.printCount = $$("txtPrintRow").value();
                    if (page.printCount == null || page.printCount == "")
                        page.printCount = 1;
                    confirmManualDisc().then(function (answer) {
                        if (answer == "Ok") {
                            var printBox = {

                                PrinterName: "Microsoft Print to PDF",
                                Width: 500,
                                Height: 80,
                                Lines: []
                            };
                            //Barcode Printer Code
                            var item = page.controls.grdCustomer.selectedData()[0];
                            //var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();

                            printBox.Lines.push({ StartX: 20, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 120, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 220, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 320, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 10, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });
                            printBox.Lines.push({ StartX: 110, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });
                            printBox.Lines.push({ StartX: 210, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });
                            printBox.Lines.push({ StartX: 310, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });

                            printBox.Lines.push({ StartX: 10, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });
                            printBox.Lines.push({ StartX: 110, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });
                            printBox.Lines.push({ StartX: 210, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });
                            printBox.Lines.push({ StartX: 310, StartY: 25, BarcodeText: getBitByOne(item.sale_executive_no, 6), FontFamily: "Courier New", FontSize: 24, FontStyle: 1, TextHeight: 20, TextWidth: 100 });

                            printBox.Lines.push({ StartX: 20, StartY: 50, Text: (item.sale_executive_no), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 120, StartY: 50, Text: (item.sale_executive_no), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 220, StartY: 50, Text: (item.sale_executive_no), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 320, StartY: 50, Text: (item.sale_executive_no), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 20, StartY: 65, Text: (item.sale_executive_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 120, StartY: 65, Text: (item.sale_executive_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 220, StartY: 65, Text: (item.sale_executive_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 320, StartY: 65, Text: (item.sale_executive_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });


                            for (var i = 0; i < parseInt(page.printCount) ; i++) {
                                if (i + 1 == parseInt(page.printCount)) {
                                    //PrintService.PrintStringBarcode(printBox);
                                    PrintService.PrintBarcode(printBox);
                                    alert("Barcode Printed Successfully");
                                }
                                else {
                                    //PrintService.PrintStringBarcode(printBox);
                                    PrintService.PrintBarcode(printBox);
                                }
                            }
                        }
                    });
                }
                else {
                    alert("Your Settings Block Print");
                }
            }
        }

        //Upload From Excel
        page.events.btnUpdateExcel_click = function () {
            page.controls.pnlUpdateExcelPopup.open();
            page.controls.pnlUpdateExcelPopup.title("Update From Excel");
            page.controls.pnlUpdateExcelPopup.width(600);
            page.controls.pnlUpdateExcelPopup.height(400);
            $("#fileUpload").val("");
            $$("upload_path_variation").html("2. Your File Must Present " + CONTEXT.REPORT_PATH + " drive");
            $$("lblSampleDocument").html("<a href='" + CONTEXT.SAMPLE_SALES_EXECUTIVE_EXCEL_FORMAT_LOCATION + "'>Click Here</a>")
        }
        page.events.btnUploadFile_click = function () {
            var _validFileExtensions = [".xls"];
            var files = $("#fileUpload").get(0).files;
            var file_name = $("#fileUpload").val();
            var check_file_name = $("#fileUpload").val().split(".");
            if (check_file_name[1] != "xls") {
                alert("Sorry This File Format Not Supported");
            }
            else {
                if (confirm("If Upload The File The Previous Item Data Is Erased")) {
                    var data = {
                        file_name: CONTEXT.REPORT_PATH + "" + files[0].name,
                        truncate: ($$("ddlFormatVariation").selectedValue() == "True") ? "True" : "False",
                        start_row: parseInt($$("txtStartRow").value()) - 1,
                        end_row: parseInt($$("txtEndRow").value()) - 1,
                        comp_id: localStorage.getItem("user_company_id"),
                        store_no: localStorage.getItem("user_store_no"),
                    }
                    page.uploadAPI.uploadSalesExecutive(data, function (data) {
                        alert("Data Uploaded Successfully");
                        $("#fileUpload").val("");
                        page.controls.pnlUpdateExcelPopup.close();
                        page.events.btnSearch_click();
                    }, function (data) {
                        alert("Some Error Will Occur Please Upload Later");
                    });
                }
            }
        }
        
        //Give User Permission To Login
        page.events.btnSaveUser_click = function () {
            try {
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
                            group_id: 9,
                        };
                        page.UserGroupAPI.postValue(member, function (data) {
                            page.save();
                            alert("User Access Created");
                        });
                    }, function (data) {
                        alert("Duplicate Entry For User Name, Mobile No Or Password");
                    });
                }
                else {
                    data.user_id = $$("lblUserId").html();
                    page.userAPI.putValue(data.user_id, data, function (data) {
                        alert("User Access Updated");
                    });
                }
            }
            catch (e) {
                alert(e);
            }
        }
        page.events.btnRewardPayment_click = function () {
            page.controls.pnlRewardPaymentPopup.open();
            page.controls.pnlRewardPaymentPopup.title("Reward Payment Panel");
            page.controls.pnlRewardPaymentPopup.width(1200);
            page.controls.pnlRewardPaymentPopup.height(600);

            page.view.selectedRewardAmount([]);
            $$("txtallpointamount").value(4);
            page.events.btnSearchReward_click();
        }
        page.events.btnSearchReward_click = function () {
            //var filter = "concat(ifnull(sale_executive_no,''),ifnull(sale_executive_id,''),ifnull(sale_executive_name,''),ifnull(phone_no,'')) like '%" + $$("txtSalesExecutiveSearch").value() + "%' having points >0";
            var filter = "";
            if ($$("txtStartDate").getDate() != "") {
                filter = " date(saert.trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
            }
            if ($$("txtEndDate").getDate() != "") {
                filter = (filter == "") ? "" : filter + " and";
                filter = filter + " date(saert.trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
            }
            page.salesexecutiverewardplanAPI.searchReward(0, "", filter, "", function (item) {
                //page.controls.grdRewardAmount.dataBind(item);
                page.view.selectedRewardAmount(item);
            });
        }
        page.events.btnRewardRecalculate_click = function () {
            page.controls.grdRewardAmount.dataBind(page.controls.grdRewardAmount.allData());
        }
        page.events.btnPayReward_click = function () {
            var data = [];
            if ($$("txtallpointamount").value() == "" || $$("txtallpointamount").value() == null || typeof $$("txtallpointamount").value() == "undefined")
                $$("txtallpointamount").value(4);
            $(page.controls.grdRewardAmount.selectedData()).each(function (i, item) {
                if (parseFloat(item.points) > 0) {
                    data.push({
                        sale_executive_no: item.sale_executive_no,
                        trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        bill_no: "-1",
                        ver_no: "1",
                        reward_plan_id: item.reward_plan_id,
                        points: item.points,
                        trans_type: "Debit",
                        description: "Reward Payment",
                        setteled_amount: parseFloat(item.points) / parseFloat($$("txtallpointamount").value())
                    });
                }
            });
            if (data.length == 0) {
                alert("No Sales Executive Has To Be Selected");
            }
            else {
                //page.salesExecutiveRewardService.insertAllSalesExecutiveRewardt(0,data, function (data1) {
                page.salesexecutiverewardAPI.postAllValue(0, data, function (data1) {
                    page.controls.pnlRewardPaymentPopup.close();
                    page.salesexecutiveAPI.getValue({ sale_executive_no: $$("hdnCustNo").val() }, function (data) {
                        $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                        $$("grdCustomer").selectedRows()[0].click();
                    });
                    alert("Points payed successfully...!");
                });
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
                    "Sale Executive Id": item.sale_executive_id,
                    "Sale Executive Name": item.sale_executive_name,
                    "Trans Type": item.trans_type,
                    "Transaction Date": item.Transd,
                    "Bill No": (item.bill_code == null) ? "" : item.bill_code,
                    "Reward Name": item.reward_plan_name,
                    "Reward Points": parseFloat(item.points).toFixed(2),
                });
            });
            var accountInfo =
            {
                "CompName": CONTEXT.COMPANY_NAME,
                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                "ReportName": "Sales Executive Reward Transaction",
                "Details": detail_list
            };

            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/sales-executive-reward-transaction-report.jrxml", accountInfo, $$("ddlRewardTransactionExportType").selectedValue());
        }
        page.events.btnRewardPaymentReport_click = function () {
            page.controls.pnlRewardPaymentPrintingPopup.open();
            page.controls.pnlRewardPaymentPrintingPopup.title("Report Type");
            page.controls.pnlRewardPaymentPrintingPopup.rlabel("Report Type");
            page.controls.pnlRewardPaymentPrintingPopup.width(500);
            page.controls.pnlRewardPaymentPrintingPopup.height(200);
            //PrintDataPR(0);
        }
        page.events.btnPrintRewardPayment_click = function () {
            var detail_list = [];
            var detail = page.controls.grdRewardAmount.allData();
            if ($$("txtallpointamount").value() == "" || $$("txtallpointamount").value() == null || typeof $$("txtallpointamount").value() == "undefined")
                $$("txtallpointamount").value(4);
            $(detail).each(function (i, item) {
                detail_list.push({
                    "Sale Executive Id": item.sale_executive_id,
                    "Sale Executive Name": item.sale_executive_name,
                    "Reward Name": item.reward_plan_name,
                    "Reward Points": parseFloat(item.points).toFixed(2),
                    "Reward Amount": parseFloat(parseFloat(item.points) / parseFloat($$("txtallpointamount").value())).toFixed(2),
                });
            });
            var accountInfo =
            {
                "CompName": CONTEXT.COMPANY_NAME,
                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                "ReportName": "Sales Executive Reward Payment",
                "Details": detail_list
            };

            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/sales-executive-reward-payment-report.jrxml", accountInfo, $$("ddlRewardPaymentExportType").selectedValue());
        }
        page.view = {
            selectedRewardAmount: function (data) {
                page.controls.grdRewardAmount.width("100%");
                page.controls.grdRewardAmount.height("300px");
                page.controls.grdRewardAmount.setTemplate({
                    selection: "Multiple", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "ID", 'rlabel': 'No', 'width': "60px", 'dataField': "sale_executive_id" },
                        { 'name': "Reward Plans Id", 'rlabel': 'Reward Plans Id', 'width': "0px", 'dataField': "sale_executive_no", visible: false },
                        { 'name': "Name", 'rlabel': 'Name', 'width': "150px", 'dataField': "sale_executive_name" },
                        { 'name': "Reward Plans", 'rlabel': 'Reward Plans', 'width': "150px", 'dataField': "reward_plan_name" },
                        { 'name': "Reward Plans Id", 'rlabel': 'Reward Plans Id', 'width': "0px", 'dataField': "reward_plan_id",visible:false },
                        { 'name': "Points", 'rlabel': 'Points', 'width': "130px", 'dataField': "points" },
                        { 'name': "Amount", 'rlabel': 'Amount', 'width': "130px", 'dataField': "amount" },
                    ]
                });
                $$("grdRewardAmount").rowBound = function (row, item) {
                    if ($$("txtallpointamount").value() == "" || $$("txtallpointamount").value() == null || typeof $$("txtallpointamount").value() == "undefined")
                        $$("txtallpointamount").value(4);
                    var point = parseFloat(item.points);
                    point = point / parseFloat($$("txtallpointamount").value());
                    $(row).find("[datafield=amount]").find("div").html(point);
                    $(row).find("input[datafield=amount]").val(point)
                };
                page.controls.grdRewardAmount.dataBind(data);
            }
        }
    });
}