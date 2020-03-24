/// <reference path="customer-edit.html" />


    $.fn.customerEdit = function () {
        return $.pageController.getControl(this, function (page, $$, e) {

         //   document.write('<script src="/' + appConfig.root + '/shopon/service/sales/customer-service.js"><\/script>');

            page.template( "/" + appConfig.root + '/shopon/view/customer/customer-edit/customer-edit.html');
            page.customerService = new CustomerService();
            page.customerAPI = new CustomerAPI();
            page.rewardplanAPI = new RewardPlanAPI();

            page.chk_state = 0;
            page.chk_city = 0;
            page.chk_city_name;
            page.chk_state_name;
            page.pincodeList = null;

            
            page.interface.delete=function (callback) {
                if($$("hdnCustNo").val()!="") {
                    page.customerService.deleteCustomer($$("hdnCustNo").val(), function (data) {
                        alert("Customer data is removed");
                        $$("hdnCustNo").val('');

                        $$("txtFirstName").val('');
                        $$("txtLastName").val('');
                        $$("txtCompany").val('');
                        $$("txtDOB").setDate('');
                        $$("txtStreet").val('');
                        $$("txtAddressLine2").val('');
                        $$("txtCity").val('');
                        $$("txtState").val('');
                        $$("txtPincode").val('');
                        $$("txtPhone").val('');
                        $$("txtEmail").val('');
                        //page.events.btnSearch_click();

                    });
                }
                else{
                    alert("Please select customer to delete");
                }
            }
            page.interface.save = function (callback) {
                try{
                    var count = 0;
                    var cus_email = $$("txtEmail").val();
                    if ($$("txtFirstName").val() == "") {
                        throw "Customer Name is Mantatory";
                        $$("txtFirstName").focus();
                    }
                    if ($$("txtFirstName").val() != "" && !isNaN($$("txtFirstName").val())) {
                        throw "Customer name should only contains characters ...!";
                        $$("txtFirstName").focus();
                    }
                    if ($$("txtLastName").val() != "" && !isNaN($$("txtLastName").val())) {
                        throw "Customer name should only contains characters ...!";
                        $$("txtLastName").focus();
                    }
                    if ($$("txtPhone").val() != "") {
                        if (isNaN($$("txtPhone").val()) || (($$("txtPhone").val()).length != 10)) {
                            throw "Check Customer Mobile No";
                            $$("txtPhone").focus();
                        }
                    }
                    if (CONTEXT.ENABLE_CUSTOMER_MOBILE) {
                        if (!ValidateMobileNo($$("txtPhone").val())) {
                            throw "Phone No Is Not Valid ...!";
                            $$("txtPhone").focus();
                        }
                    }
                    if (cus_email != "" && !ValidateEmail(cus_email)) {
                        throw "Email Address is not Valid...!!!";
                        $$("txtEmail").focus();
                    }
                    if ($$("txtPincode").selectedObject.val() != "") {
                        if (isNaN($$("txtPincode").selectedObject.val())) {
                            throw "Pincode Should Be A No";
                            $$("txtPincode").focus();
                        }
                    }
                    if (!isNaN($$("txtFirstName").val())) {
                        throw "Customer Name start with character";
                        $$("txtFirstName").focus();
                    }
                    if ($$("txtGst").val() != "") {
                        if (!ValidateGSTNo($$("txtGst").val())) {
                            count++;
                            throw "You Are Entered Wrong GST Number";
                            $$("txtGst").focus();
                        }
                    }
                    if ($$("txtAlternatePhone").val() != "") {
                        if (isNaN($$("txtAlternatePhone").val()) || (($$("txtAlternatePhone").val()).length != 10)) {
                            count++;
                            throw "Alternare Phone No Is Not Valid ...!";
                            $$("txtAlternatePhone").focus();
                        }
                    }
                    var succ = "on";
                    var fail = "off";
                    var data = {
                        first_name: $$("txtFirstName").val(),
                        last_name: $$("txtLastName").val(),

                        company: $$("txtCompany").val(),
                        date_of_birth: ($$("txtDOB").getDate() == "" || $$("txtDOB").getDate() == null || $$("txtDOB").getDate() == undefined) ? "" : dbDate($$("txtDOB").getDate()),
                        address1: $$("txtStreet").val(),
                        address2: $$("txtAddressLine2").val(),
                        city: $$("txtCity").selectedObject.val(),
                        state: $$("txtState").selectedObject.val(),
                        zip_code: $$("txtPincode").selectedObject.val(),

                        phone_no: $$("txtPhone").val(),
                        email: $$("txtEmail").val(),
                        gst_no: $$("txtGst").val(),
                        cus_active: "1",
                        comp_id: getCookie("user_company_id"),
                        alter_mobile: $$("txtAlternatePhone").val(),

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
                    data.reward_plan_id = $$("ddlrewardplans").selectedValue();
                    if (count == 0) {
                        if ($$("hdnCustNo").val() != "") {
                            data.cust_no = $$("hdnCustNo").val();
                            data.cust_name = data.first_name + " " + data.last_name;
                            data.address = data.address1 + " , " + data.address2 + " , " + data.city + " , " + data.state + " , " + data.zip_code;
                            page.customerService.updateCustomer(data, function () {
                                $$("hdnCustNo").val('');
                                callback(data);
                                alert("Saved successfully!");
                            });
                        }
                        else {
                            if (page.chk_city == 1) {
                                var data1 = {
                                    city_name: $$("txtCity").selectedObject.val(),
                                    state_name: $$("txtState").selectedObject.val()
                                }
                                page.customerService.insertCity(data1, function (data1) { });
                            }
                            if (page.chk_state == 1) {
                                page.customerService.insertState($$("txtState").selectedObject.val(), function (data2) { });
                            }
                            if ($$("txtPhone").val() == "" || $$("txtPhone").val() == null || typeof $$("txtPhone").val() == "undefined") {
                                page.customerAPI.postValue(data, function (cust) {
                                    data.cust_no = cust[0].key_value;
                                    data.cust_name = data.first_name + " " + data.last_name;
                                    data.address = data.address1 + " , " + data.address2 + " , " + data.city + " , " + data.state + " , " + data.zip_code;
                                    callback(data);
                                    alert("Saved successfully!");
                                });
                            }
                            else {
                                var data1 = {
                                    start_record: 0,
                                    end_record: "",
                                    filter_expression: "concat(ifnull(phone_no,'')) like '%" + $$("txtPhone").val() + "%'",
                                    sort_expression: ""
                                }
                                page.customerAPI.searchData(data1.start_record, data1.end_record, data1.filter_expression, data1.sort_expression, function (item) {
                                    if (item.length == 0) {
                                        page.customerAPI.postValue(data, function (cust) {
                                            data.cust_no = cust[0].key_value;
                                            data.cust_name = data.first_name + " " + data.last_name;
                                            data.address = data.address1 + " , " + data.address2 + " , " + data.city + " , " + data.state + " , " + data.zip_code;
                                            callback(data);
                                            alert("Saved successfully!");
                                        });
                                    }
                                    else {
                                        if (confirm("This Mobile No " + $$("txtPhone").value() + " Is Already Registered Are You Sure Wants To Register It Again")) {
                                            page.customerAPI.postValue(data, function (cust) {
                                                data.cust_no = cust[0].key_value;
                                                data.cust_name = data.first_name + " " + data.last_name;
                                                data.address = data.address1 + " , " + data.address2 + " , " + data.city + " , " + data.state + " , " + data.zip_code;
                                                callback(data);
                                                alert("Saved successfully!");
                                            });
                                        }
                                    }
                                });
                            }
                            
                            //page.customerService.insertCustomer(data, function (cust) {
                            //    data.cust_no = cust[0].key_value;
                            //    data.cust_name = data.first_name + " " + data.last_name;
                            //    data.address = data.address1 + " , " + data.address2 + " , " + data.city + " , " + data.state + " , " + data.zip_code;
                            //    callback(data);
                            //    alert("Saved successfully!");
                            //});
                        }
                    }
                }
                catch (e) {
                    alert(e);
                }
            };

            page.interface.select = function (item) {
                //page.customerService.getRewardByAll("%", function (data) {
                //    $$("ddlrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name", "All");
                //});
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("ddlrewardplans").dataBind(data, "reward_plan_id", "reward_plan_name", "Select");
                });
                $$("hdnCustNo").val(nvl(item.cust_no, ""));
                $$("txtFirstName").val(nvl(item.first_name, ""));
                $$("txtLastName").val(nvl(item.last_name, ""));
                $$("txtCompany").val(nvl(item.company, ""));
                $$("txtDOB").setDate(nvl(item.date_of_birth, ""));
                $$("txtDOB").selectedObject.val("");
                $$("txtStreet").val(nvl(item.address1, ""));
                $$("txtAddressLine2").val(nvl(item.address2, ""));
               // $$("txtCity").val(nvl(item.city, ""));
                //$$("txtState").val(nvl(item.state, ""));
                $$("txtPincode").selectedObject.val(nvl(item.zip_code, ""));
                $$("txtPhone").val(nvl(item.phone_no, ""));
                $$("txtEmail").val(nvl(item.email, ""));
                $$("txtAlternatePhone").val(nvl(item.phone_no, ""));
                page.customerService.getCityByAll("%", function (data) {
                    page.cityList = data;
                });
                //City autocomplete
                page.controls.txtCity.dataBind({
                    getData: function (term, callback) {
                        callback(page.cityList);

                    }
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
                page.customerService.getStateByAll("%", function (data) {
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

                if (CONTEXT.ENABLE_REWARD_MODULE) {
                    $$("pnlRewardPoints").show();
                } else {
                    $$("pnlRewardPoints").hide();
                }
                if (CONTEXT.enableCustomerCommunication) {
                    $$("pnlCommunication").show();
                } else {
                    $$("pnlCommunication").hide();
                }
                if (CONTEXT.ENABLE_EMAIL == "true") {
                    $$("chkEmail").show();
                    $('#lblEmail').show();
                } else {
                    $$("chkEmail").hide();
                    $('#lblEmail').hide();
                }
                if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                    $$("chkMobile").show();
                    $('#lblSms').show();
                } else {
                    $$("chkMobile").hide();
                    $('#lblSms').hide();
                }
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
                $$("txtFirstName").focus();
            };

            page.interface.returnCustomer = function (callback) {
                var count = 0;
                var cus_email = $$("txtEmail").val();
                if ($$("txtFirstName").val() == "") {
                    alert("Customer Name is Mantatory");
                    $$("txtFirstName").focus();
                    count++;
                }
                if ($$("txtPhone").val() != "") {
                    if (isNaN($$("txtPhone").val()) || (($$("txtPhone").val()).length != 10)) {
                        alert("Check Customer Mobile No");
                        $$("txtPhone").focus();
                        count++;
                    }
                }
                if (cus_email != "" && !ValidateEmail(cus_email)) {
                    alert("Email Address is not Valid...!!!");
                    $$("txtEmail").focus();
                    count++;
                }
                if ($$("txtPincode").selectedObject.val() != "") {
                    if (isNaN($$("txtPincode").selectedObject.val())) {
                        alert("Pincode Should Be a No");
                        $$("txtPincode").focus();
                        count++;
                    }
                }
                if (!isNaN($$("txtFirstName").val())) {
                    alert("Customer Name start with character");
                    $$("txtFirstName").focus();
                    count++;
                }
                if ($$("txtAlternatePhone").val() != "") {
                    if (isNaN($$("txtAlternatePhone").val()) || (($$("txtAlternatePhone").val()).length != 10)) {
                        alert("Check Customer Alternate Mobile No");
                        $$("txtAlternatePhone").focus();
                        count++;
                    }
                }
                //try {
                if (count == 0) {
                    var succ = "on";
                    var fail = "off";
                    var data = {

                        first_name: $$("txtFirstName").val(),
                        last_name: $$("txtLastName").val(),

                        company: $$("txtCompany").val(),
                        date_of_birth: ($$("txtDOB").getDate() == "" || $$("txtDOB").getDate() == null || $$("txtDOB").getDate() == undefined) ? "" : dbDate($$("txtDOB").getDate()),
                        address1: $$("txtStreet").val(),
                        address2: $$("txtAddressLine2").val(),
                        city: $$("txtCity").selectedObject.val(),
                        state: $$("txtState").selectedObject.val(),
                        zip_code: $$("txtPincode").selectedObject.val(),

                        phone_no: $$("txtPhone").val(),
                        email: $$("txtEmail").val(),
                        gst_no: $$("txtGst").val(),
                        alter_mobile: $$("txtAlternatePhone").val(),

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
                    if (page.chk_city == 1) {
                        var data1 = {
                            city_name: $$("txtCity").selectedObject.val(),
                            state_name: $$("txtState").selectedObject.val()
                        }
                        page.customerService.insertCity(data1, function (data1) { });
                    }
                    if (page.chk_state == 1) {
                        page.customerService.insertState($$("txtState").selectedObject.val(), function (data2) { });
                    }
                    //reward plans
                    data.reward_plan_id = $$("ddlrewardplans").selectedValue();

                    data.cust_name = data.first_name + " " + data.last_name;
                    data.address = data.address1 + ", " + data.address2 + ", " + data.city + " ," + data.state + ", " + data.zip_code;
                    callback(data);
                }
                
            };
        });
    }
    