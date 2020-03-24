$.fn.doctor = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.doctorService = new DoctorService();
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
                page.events.btnNewCustomer_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnRemove_click();
            }
            if (e.keyCode == 80 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnPrintCustomerReport_click();
            }
        });
        page.select = function (item) {
            //page.customerService.getTotalPoint(item.cust_no, function (data, callback) {
            //    //page.controls.grdPointTransaction.dataBind(item);
            //    $$("lblrewardpoint").value(data[0].points);
            //    $$("lbltotalpoints").value(data[0].points);

            //});

            $$("btnSearch").show();
            $$("btnNewCustomer").show();
            $$("btnSave").show();
            $$("btnRemove").show();
            //$$("btnPrintCustomerReport").show();
            //$$("btnRewardTransaction").show();
            //$$("btnRedeemReward").show();


            $$("hdnCustNo").val(nvl(item.sale_executive_no, ""));
            $$("txtFirstName").value(nvl(item.sale_executive_name, ""));
            $$("txtCompanyName").value(nvl(item.company_name, ""));
            $$("txtCompany").value(nvl(item.company_id, ""));
            $$("txtDOB").setDate(nvl(item.date_of_birth, ""));
            //$$("txtStreet").value(nvl(item.address1, ""));
            $$("txtAddressLine2").value(nvl(item.address, ""));
            //        $$("txtCity").value(nvl(item.city,""));
            //$$("txtCity").selectedObject.val(nvl(item.city, ""));
            //$$("txtState").selectedObject.val(nvl(item.state, ""));
            //   $$("txtState").value(nvl(item.state,""));
            //$$("txtPincode").value(nvl(item.zip_code, ""));
            //$$("txtPhone").value(nvl(item.phone_no, "+91"));
            var mobile1 = item.phone_no;
            (mobile1 == "" || mobile1 == null) ? $$("txtPhone").value('') : $$("txtPhone").value(nvl(mobile1.substring(3), ""));
            //$$("txtLandline").value(nvl(item.landline_no, ""));
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
            //$$("txtTinNo").value(nvl(item.tin_no, ""));

            $("[controlid = txtlicenseno]").each(function () {
                this.value = this.value.replace(/-/g, ",");
            });
            $("[controlid = txtAddressLine2]").each(function () {
                this.value = this.value.replace(/-/g, ",");
            });

            //if (item.reward_plan_id == "" || item.reward_plan_id == null || item.reward_plan_id == undefined) {
            //    $$("ddlmyrewardplans").selectedValue(-1);
            //}
            //else{
            //    $$("ddlmyrewardplans").selectedValue(item.reward_plan_id);
            //}
            //reward plan
            //if (item.reward_plan_id == 1)
            //    $$("ddlmyrewardplans").selectedObject.val(1);
            //if (item.reward_plan_id == 2)
            //    $$("ddlmyrewardplans").selectedObject.val(2);
            //if (item.reward_plan_id == 3)
            //    $$("ddlmyrewardplans").selectedObject.val(3);
            //if (item.reward_plan_id == 4)
            //    $$("ddlmyrewardplans").selectedObject.val(4);
            //if (item.reward_plan_id == 5)
            //    $$("ddlmyrewardplans").selectedObject.val(5);




            //if (item.mobile_comm == "on") {
            //    $$("chkMobile").prop('checked', true);
            //}
            //else {
            //    $$("chkMobile").prop('checked', false);
            //}
            //if (item.email_comm == "on") {
            //    $$("chkEmail").prop('checked', true);
            //}
            //else {
            //    $$("chkEmail").prop('checked', false);
            //}

            if (item.saexe_active == 1) {
                $$("chkActive").prop('checked', true);
            }
            else {
                $$("chkActive").prop('checked', false);
            }
            $$("txtFirstName").focus();
        };

        page.delete = function (callback) {
            //$("#cremove").hide();
            //$("#cprint").hide();
            //$("#credeem").hide();
            if ($$("hdnCustNo").val() != "") {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Removing sales executive...");
                page.doctorService.deleteSaleExecutive($$("hdnCustNo").val(), function (data) {
                    //$(".detail-info").progressBar("hide")
                    $$("msgPanel").show("Sales executive removed sucessfully...!");
                    page.events.btnSearch_click();

                    $$("hdnCustNo").val('');

                    $$("txtFirstName").val('');
                    $$("txtCompanyName").val('');
                    $$("txtCompany").val('');
                    $$("txtDOB").setDate('');
                    //$$("txtStreet").val('');
                    $$("txtAddressLine2").val('');
                    //$$("txtCity").selectedObject.val('');
                    //$$("txtState").selectedObject.val('');
                    //$$("txtPincode").val('');
                    $$("txtPhone").val('');
                    //$$("txtLandline").val('');
                    $$("txtEmail").val('');
                    $$("txtArea").val('');
                    $$("txtPanNo").val('');
                    $$("txtAadhaarNo").val('');
                    //$$("txtTinNo").val('');
                    //reward plans
                    //$$("ddlmyrewardplans").selectedObject.val(1);

                    $$("chkActive").prop('checked', true);

                    $$("btnSearch").show();
                    $$("btnNewCustomer").show();
                    $$("btnSave").show();
                    $$("btnRemove").hide();
                    //$$("btnPrintCustomerReport").show();
                    //$$("btnRewardTransaction").hide();
                    //$$("btnRedeemReward").hide();
                });
            } else {
                $$("msgPanel").show("Please select a sales executive first...!");
            }
        }
        page.save = function (callback) {
            //try {

            //$("#cremove").hide();
            //$("#cprint").hide();
            //$("#credeem").hide();
            $$("btnSearch").show();
            $$("btnNewCustomer").show();
            $$("btnSave").show();
            $$("btnRemove").hide();
            //$$("btnPrintCustomerReport").show();
            //$$("btnRewardTransaction").hide();
            //$$("btnRedeemReward").hide();

            //var succ = "on";
            //var fail = "off";

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
                date_of_birth: $$("txtDOB").getDate(),
                //address1: $$("txtStreet").val(),
                address: $$("txtAddressLine2").val(),
                //city: $$("txtCity").selectedObject.val(),
                //state: $$("txtState").selectedObject.val(),
                //zip_code: $$("txtPincode").val(),
                phone_no: ($$("txtPhone").value() == "") ? "" : "+91" + $$("txtPhone").value(),
                //phone_no: $$("txtPhone").val(),
                //landline_no:$$("txtLandline").val(),
                email: $$("txtEmail").val(),
                area: $$("txtArea").val(),
                bank_name: $$("txtBankName").val(),
                account_no: $$("txtAcntNo").val(),
                ifsc_code: $$("txtifsccode").val(),
                //gst_no: $$("txtgstno").val(),
                license_no: $$("txtlicenseno").val(),
                pan_no: $$("txtPanNo").val(),
                aadar_no: $$("txtAadhaarNo").val(),
                //tin_no: $$("txtTinNo").val()

            }
            //if ($$("chkMobile").prop("checked")) {
            //    data.mobile_comm = succ;
            //} else {
            //    data.mobile_comm = fail;
            //}
            //if ($$("chkEmail").prop("checked")) {
            //    data.email_comm = succ;
            //} else {
            //    data.email_comm = fail;
            //}

            if ($$("chkActive").prop("checked"))
                data.saexe_active = 1;
            else
                data.saexe_active = 0;

            //reward plans
            //data.reward_plan_id = $$("ddlmyrewardplans").selectedValue();
            //points
            //data.points = $$("lblrewardpoint").selectedObject.val()

            //data.cust_name = data.first_name + " " + data.last_name;
            //data.address = data.address1 + " , " + data.address2 + " , " + data.city + " , " + data.state + " , " + data.zip_code;
            if ($$("hdnCustNo").val() != "") {
                data.sale_executive_no = $$("hdnCustNo").val();
                //$(".detail-info").progressBar("show")

                $$("msgPanel").show("Updating sales executive...");

                page.doctorService.updateSalesExecutive(data, function () {
                    $$("msgPanel").show("Sales executive updated successfully...!");

                    page.doctorService.getSaleExecutiveById(data.sale_executive_no, function (data) {

                        // Update the new data to Grid
                        $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
                        $$("grdCustomer").selectedRows()[0].click();
                        $$("msgPanel").hide();

                    });
                    //$(".detail-info").progressBar("hide")

                    //callback(data);
                });

            } else {
                //$(".detail-info").progressBar("show")

                $$("msgPanel").show("Inserting new sales executive...");
                page.doctorService.insertSaleExecutive(data, function (cust) {
                    data.sales_executive_no = cust[0].key_value;
                    $$("msgPanel").show("Sales executive saved successfully...!");
                    // Add New Data Only to the Grid
                    page.doctorService.getSaleExecutiveById(data.sales_executive_no, function (item) {
                        page.controls.grdCustomer.dataBind(item);
                        $$("grdCustomer").getAllRows()[0].click();
                        $$("msgPanel").hide();
                    });
                    //$(".detail-info").progressBar("hide")
                    // callback(data);
                });
            }
        };


        page.events = {
            btnSearch_click: function () {
                //$(".detail-panel").hide();
                $(".basic-info").hide();
                $$("msgPanel").show("Searching...");
                page.doctorService.getSaleExecutiveByAll($$("txtCustomerSearch").value(), function (item) {
                    page.controls.grdCustomer.dataBind(item);
                    $$("msgPanel").hide();
                });
                page.controls.grdCustomer.dataBind([]);
                page.select({});
                $$("btnSearch").show();
                $$("btnNewCustomer").show();
                $$("btnSave").hide();
                $$("btnRemove").hide();
                $$("chkActive").prop('checked', true);

                //page.events.btnNewCustomer_click();
                /*page.customerService.getTotalPointTransaction($$("lbltotalpoints").value(), function (item) {
                    page.controls.grdPointTransaction.dataBind(item);
                });*/
            },
            grdCustomer_select: function (row, item) {
                //show right panel
                $(".basic-info").show();
                //$$("btnRewardTransaction").show();
                //$$("btnRedeemReward").show();
                //$("#cremove").show();
                //$("#cprint").show();
                //$("#credeem").show();
                $$("btnNewCustomer").show();
                $$("hdnCustNo").val(item.sale_executive_no);
                page.select(item);
                //$$("msgPanel").show("Details of the customer...");
                //if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                //    $$("btnRewardTransaction").show();
                //    $$("btnRedeemReward").show();
                //    $$("pnlRewardPlans").show();
                //    $$("pnlRewardPoints").show();
                //} else {
                //    $$("btnRewardTransaction").hide();
                //    $$("btnRedeemReward").hide();
                //    page.controls.btnPrintCustomerReport.selectedObject.next().hide();
                //    page.controls.btnRewardTransaction.selectedObject.next().hide();
                //    $$("pnlRewardPlans").hide();
                //    $$("pnlRewardPoints").hide();
                //}
            },
            btnNewCustomer_click: function (row, item) {


                page.events.btnSearch_click();
                $(".basic-info").show();
                page.select({});
                page.controls.grdCustomer.dataBind([]);
                $$("btnSearch").show();
                //$$("btnNewCustomer").hide();
                //$("#cremove").hide();
                //$("#cprint").hide();
                //$("#credeem").hide();
                $$("btnSave").show();
                $$("btnRemove").hide();
                //$$("btnPrintCustomerReport").show();
                //$$("btnRewardTransaction").hide();
                //$$("btnRedeemReward").hide();
                $$("chkActive").prop('checked', true);
                //$$("ddlmyrewardplans").selectedValue(-1);

                $$("txtFirstName").focus();
                //$$("msgPanel").hide();
            },
            btnSave_click: function () {

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
                if (cus_fname == "") {
                    $$("msgPanel").show("Sales executive name is mandatory ...!");
                    $$("txtFirstName").focus();
                }
                else if (cus_fname != "" && !isNaN(cus_fname)) {
                    $$("msgPanel").show("Sales executive name should only contains characters ...!");
                    $$("txtFirstName").focus();
                }
                else if (cus_lname != "" && !isNaN(cus_lname)) {
                    $$("msgPanel").show("Company name should only contains characters ...!");
                    $$("txtLastName").focus();
                }

                else if (cus_phone != "" && !isInt(cus_phone)) {
                    $$("msgPanel").show("Phone no should only contain numbers ...!");
                    $$("txtPhone").focus();
                }
                    //else if ((cus_phone != "" && cus_phone == "+91") != "" && cus_phone.substring(0, 3) != "+91")
                    //{
                    //    $$("msgPanel").show("Phone no should contain '+91' as prefix ...!");
                    //    $$("txtPhone").focus();
                    //}
                else if (cus_phone != "" && cus_phone.length < 10) {
                    $$("msgPanel").show("Phone no should be 10 in length...!");
                    $$("txtPhone").focus();
                }
                else if (cus_email != "" && !ValidateEmail(cus_email)) {
                    $$("msgPanel").show("Email address is not valid...!");
                    $$("txtEmail").focus();
                }
                    //else if (isNaN(pincode)) {
                    //    $$("msgPanel").show("Pincode should be a number...!");
                    //    $$("txtPincode").focus();
                    //}
                else if (isNaN(acnt_no)) {
                    $$("msgPanel").show("Account Number should be a number...!");
                    $$("txtAcntNo").focus();
                }
                else if (isNaN(aadar)) {
                    $$("msgPanel").show("Aadhaar Number should be a number...!");
                    $$("txtAadhaarNo").focus();
                }
                    //else if (aadar != "" && aadar.length < 12) {
                    //    $$("msgPanel").show("Aadhaar Number should be 12 in length...!");
                    //    $$("txtAadhaarNo").focus();
                    //}
                else if (bname != "" && !isNaN(bname)) {
                    $$("msgPanel").show("Bank name should only contains characters ...!");
                    $$("txtBankName").focus();
                }
                else if (area != "" && !isNaN(area)) {
                    $$("msgPanel").show("Area should only contains characters ...!");
                    $$("txtArea").focus();
                }
                    //else if (isNaN(land_no)) {
                    //    $$("msgPanel").show("Landline Number should be a number...!");
                    //    $$("txtLandline").focus();
                    //}
                else {
                    page.save();
                    $$("btnNewCustomer").show();
                    $$("msgPanel").hide();
                    $$("txtFirstName").focus();
                }
            },
            btnRemove_click: function () {
                /* var selData = page.controls.grdCustomer.selectedData();
                 page.customerService.deleteCustomer(selData[0].cust_no, function (data) {
                     alert("Customer data is removed");
                     page.events.btnSearch_click();

                 });*/
                page.delete();

                //page.events.btnSearch_click();

                //page.customerService.getCustomersByAll($$("txtCustomerSearch").value(), function (item) {
                //    page.controls.grdCustomer.dataBind(item);

                //    $$("btnSearch").show();
                //    $$("btnNewCustomer").show();
                //    $$("btnSave").show();
                //    $$("btnRemove").hide();
                //    $$("btnPrintCustomerReport").show();
                //    $$("btnRewardTransaction").hide();
                //    $$("btnRedeemReward").hide();
                //});



            },
            //btnPrintCustomerReport_click: function () {
            //    $$("msgPanel").show("Printing customer details...");
            //    page.customerService.getAllCustomer(function (data) {
            //        PrintData(data);
            //    });
            //    $$("msgPanel").hide();
            //},
            //PointTransaction
            //btnRewardTransaction_click: function () {
            //    page.controls.pnlPointTransaction.open();
            //    page.controls.pnlPointTransaction.title("Reward Transaction");
            //    page.controls.pnlPointTransaction.width(1000);
            //    page.controls.pnlPointTransaction.height(600);
            //    page.customerService.getPointTransaction($$("hdnCustNo").val(), function (item) {
            //        // page.select(item);
            //        //txtTotalPoint.dataBind(item);
            //        page.controls.grdPointTransaction.dataBind(item);
            //    });


            //},

            //btnRedeemReward_click: function () {
            //    page.controls.pnlRedeemReward.open();
            //    page.controls.pnlRedeemReward.title("Redeem Reward");
            //    $$("txtpointstoredeem").val("");
            //    $$("lblamount").value("");
            //    page.controls.pnlRedeemReward.width(500);
            //    page.controls.pnlRedeemReward.height(300);
            //},
            //btnSavePoints_click: function () {

            //    page.customerService.getTotalPoint($$("hdnCustNo").val(), function (data, callback) {

            //        if (data[0].points > 0) {
            //            if (parseInt(data[0].points) >= parseInt($$("txtpointstoredeem").val())) {
            //            var data = {

            //                cust_no: $$("hdnCustNo").val(),
            //                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
            //                bill_no: "-1",
            //                ver_no: "1",
            //                reward_plan_id: $$("ddlmyrewardplans").selectedValue(),
            //                points: $$("txtpointstoredeem").val(),
            //                trans_type: "Debit",
            //                setteled_amount: $$("lblamount").value()
            //            }
            //            page.customerService.insertCustomerRewardt(data, function (data1) {
            //                //PrintData(data);
            //                page.controls.pnlRedeemReward.close();
            //                $$("msgPanel").show("Points used successfully...!");
            //                page.customerService.getCustomerByNo(data.cust_no, function (data) {

            //                    // Update the new data to Grid
            //                    $$("grdCustomer").updateRow($$("grdCustomer").selectedRowIds()[0], data[0]);
            //                    $$("grdCustomer").selectedRows()[0].click();
            //                });
            //            });
            //            }
            //            else {
            //                alert("Points exceeds...!");
            //            }
            //        }
            //        else {
            //            alert("Customer having no points...!");
            //        }

            //    });


            //},
            page_load: function () {
                //$$("lblrewardpoint").val(0);
                //hide right panel

                $(".basic-info").hide();
                //$$("btnRewardTransaction").hide();
                //$$("btnRedeemReward").hide();
                //$("#cprint").hide();
                //$("#credeem").hide();
                //$("#cremove").hide();
                //$$("btnPrintCustomerReport").hide();
                page.events.btnSearch_click();
                //page.events.btnNewCustomer_click();
                $$("btnNewCustomer").show();
                page.controls.grdCustomer.width("100%");
                page.controls.grdCustomer.height("510px");
                page.controls.grdCustomer.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Sales Exe No", 'width': "80px", 'dataField': "sale_executive_no" },
                        { 'name': "Sales Exe Name", 'width': "180px", 'dataField': "sale_executive_name" },
                        { 'name': "Mobile No", 'width': "160px", 'dataField': "phone_no" },

                        //{ 'name': "Item Name", 'width': "40px", 'dataField': "item_no", itemTemplate: "<input type='button' action='select' value='Select' />" },

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

                //var dataSourceCustomer = {
                //    getData: function (term, callback) {
                //        page.customerService.getCustomerByAll(term, callback);
                //    }
                //};

                //page.customerService.getCityByAll("%", function (data) {
                //    page.cityList = data;
                //});


                ////City autocomplete
                //page.controls.txtCity.dataBind({
                //    getData: function (term, callback) {
                //        callback(page.cityList);

                //    }
                //});
                //page.customerService.getStateByAll("%", function (data) {
                //    page.stateList = data;
                //});


                ////State autocomplete
                //page.controls.txtState.dataBind({
                //    getData: function (term, callback) {
                //        callback(page.stateList);

                //    }
                //});
                ////reward plans
                //page.customerService.getRewardByAll("%", function (data) {
                //    $$("ddlmyrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name","Select");
                //});

                //page.controls.grdPointTransaction.width("100%");
                //page.controls.grdPointTransaction.height("400px");
                //page.controls.grdPointTransaction.setTemplate({
                //    selection: "Single",
                //    columns: [
                //        { 'name': "Cust No", 'width': "60px", 'dataField': "cust_no" },
                //        { 'name': "Cust Name", 'width': "180px", 'dataField': "cust_name" },
                //        { 'name': "Trans Type", 'width': "100px", 'dataField': "trans_type" },
                //        { 'name': "Transaction Date", 'width': "120px", 'dataField': "Transd" },
                //        { 'name': "Bill No", 'width': "100px", 'dataField': "bill_no" },
                //        { 'name': "Reward Name", 'width': "150px", 'dataField': "reward_plan_name" },
                //        { 'name': "Reward Points", 'width': "100px", 'dataField': "points" },

                //        //{ 'name': "Item Name", 'width': "40px", 'dataField': "item_no", itemTemplate: "<input type='button' action='select' value='Select' />" },

                //    ]
                //});

                //page.controls.grdPointTransaction.dataBind([]);
                /*
                page.customerService.getPointTransaction($$("hdnCustNo").val(), function (item) {
                  //page.customerService.getTotalPoint(item.cust_no, (data, callback));
                  lbltotalpoints.dataBind(data[0].points);
                  txtTotalPoint.dataBind(item);
                });*/
                //page.controls.lbltotalpoints.val(item);
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

                //$$("chkActive").prop('checked', true);

                //$$("txtCustomerSearch").focus();

            }

        };

        //function PrintData(dataList) {
        //    var r = window.open(null, "_blank");
        //    var doc = r.document;
        //    var head = false;
        //    doc.write("<h1 align='center'> " + CONTEXT.AppName + "</h1>");
        //    //   doc.write("<html>AVM Wholesale Dealer<style>.col{padding:5px}.hcol{padding:5px}</style><body>");
        //    //   doc.write("<header align='center'> <h1>AVM Wholesale Dealer</h1></header>");
        //    doc.write("<br><header align='center'> <h3>Customer Report</h3></header>");

        //    doc.write("<table align='center'  style='width:550px; align:center;' cellpadding='0' cellspacing='0' border='1'>");
        //    doc.write("<tr style='font-weight:bold;color: white; background-color:gray;'>");
        //    doc.write("<th style='width:150px'>Customer No</th>");
        //    doc.write("<th style='width:200px'>Customer Name</th>");
        //    doc.write("<th style='width:150px'>Mobile No</th></tr>");

        //    $(dataList).each(function (i, data) {
        //        if (head == false || head == true) {


        //            doc.write("<tr><td align='right'>" + data.cust_no + "</td>");
        //            doc.write("<td align='right'>" + data.cust_name + "</td>");
        //            doc.write("<td align='right'>" + data.phone_no + "</td></tr>");

        //            doc.write("</tr>");
        //            head = true;
        //        }
        //        doc.write("<tr>");
        //        //  for (var prop in data) {
        //        // doc.write("<td  class='col'>" + data[prop] + "</td>");
        //        // }
        //        doc.write("</tr>");
        //    });
        //    doc.write("</table> <br><br><div align='right'><h3> Authorized Signature</h3></div>");
        //    doc.write("<footer> <h2 align='center'>" + CONTEXT.ClientAddress + "</h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

        //    doc.close();
        //    r.focus();
        //    r.print();


        //}


    });
}