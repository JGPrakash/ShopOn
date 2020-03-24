/// <reference path="customer-edit.html" />


    $.fn.vendorEdit = function () {
        return $.pageController.getControl(this, function (page, $$, e) {

            page.vendorService = new VendorService();
            page.vendorAPI = new VendorAPI();
         //   document.write('<script src="/' + appConfig.root + '/shopon/service/sales/customer-service.js"><\/script>');

            page.template("/" + appConfig.root + '/shopon/view/vendor/vendor-edit/vendor-edit.html');
            //page.customerService = new CustomerService();


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
                var error_count = 0;
                var vendor = {
                    vendor_name: $$("txtVendorName").value(),
                    vendor_phone: ($$("txtPhoneno").value() == "") ? "" : $$("txtPhoneno").value(),
                    landline_no: $$("txtLandline").val(),
                    vendor_email: $$("txtEmail").value(),
                    area: $$("txtArea").val(),
                    ifsc_code: $$("txtIFSCCode").val(),
                    bank_name: $$("txtBankName").val(),
                    account_no: $$("txtAccountNo").val(),
                    vendor_address: $$("txtAddress").value(),
                    active_comm: 1,
                    gst_no: $$("txtGstNo").val(),
                    tin_no: $$("txtTinNo").value(),
                    license_no: $$("txtlicenseno").value(),
                    comp_id: localStorage.getItem("user_company_id"),
                };

                if (vendor.vendor_name == "") {
                    alert("Vendor name is mandatory ...!");
                    $$("txtVendorName").focus();
                    //alert("Vendor Name is Mantatory");
                    error_count++;
                }

                if (vendor.vendor_name != "" && isInt(vendor.vendor_name)) {
                    alert("Vendor name should only contains characters ...!");
                    $$("txtVendorName").focus();
                    error_count++;
                }
                if (vendor.vendor_phone != "" && !isInt(vendor.vendor_phone)) {
                    alert("Phone no should only contain numbers ...!");
                    $$("txtPhoneno").focus();
                    error_count++;
                }
                if (vendor.vendor_phone != "" && vendor.vendor_phone.length != 10) {
                    alert("Phone no should be 10 in length...!");
                    $$("txtPhoneno").focus();
                    error_count++;
                }
                if (vendor.landline_no != "" && !isInt(vendor.landline_no)) {
                    $$("msgPanel").show("Landline no should only contain numbers ...!");
                    $$("txtLandline").focus();
                    error_count++;
                }
                if (vendor.vendor_email != "" && !ValidateEmail(vendor.vendor_email)) {
                    alert("Email address is not valid...!");
                    $$("txtEmail").focus();
                    error_count++;
                }
                if (vendor.area != "" && !isNaN(vendor.area)) {
                    alert("Area should only contain characters ...!");
                    $$("txtArea").focus();
                    error_count++;
                }
                if (vendor.bank_name != "" && !isNaN(vendor.bank_name)) {
                    alert("Bank name should only contain characters ...!");
                    $$("txtBankName").focus();
                    error_count++;
                }
                if (vendor.account_no != "" && isNaN(vendor.account_no)) {
                    alert("Account number should only contain numbers ...!");
                    $$("txtAccountNo").focus();
                    error_count++;
                }
                if (vendor.ifsc_code != "") {
                    if (vendor.ifsc_code.length == 11) {
                        var ifsc_reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
                        if (!ifsc_reg.test(vendor.ifsc_code)) {
                            error_count++;
                            alert("You Are Entered Wrong IFSC Number");
                            $$("txtifsccode").focus();
                        }
                    }
                    else {
                        error_count++;
                        alert("You Are Entered Wrong IFSC Number");
                        $$("txtifsccode").focus();
                    }
                }
                if (vendor.gst_no != "") {
                    if (vendor.gst_no.length == 15) {
                        var gst_reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                        if (!gst_reg.test(vendor.gst_no)) {
                            error_count++;
                            alert("You Are Entered Wrong GST Number");
                            $$("txtgstno").focus();
                        }
                    }
                    else {
                        error_count++;
                        alert("You Are Entered Wrong GST Number");
                        $$("txtgstno").focus();
                    }
                }
                if (error_count == 0) {

                    if (page.vendor_no == null || page.vendor_no == '') {

                        if (vendor.vendor_phone == "" || vendor.vendor_phone == null || typeof vendor.vendor_phone == "undefined") {
                            page.vendorAPI.postValue(vendor, function (data) {
                                alert("Vendor saved successfully...!");
                                page.vendorService.getVendorByNo(data[0].key_value, function (data) {
                                    callback(data);
                                });
                            });
                        }
                        else {
                            var filter_expression = "concat(ifnull(vendor_id,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + vendor.vendor_phone + "%'";
                            page.vendorAPI.searchValues("", "", filter_expression, "", function (testdata) {
                                if (testdata.length == 0) {
                                    page.vendorAPI.postValue(vendor, function (data) {
                                        alert("Vendor saved successfully...!");
                                        page.vendorService.getVendorByNo(data[0].key_value, function (data) {
                                            callback(data);
                                        });
                                    });
                                }
                                else {
                                    if (confirm("This Mobile No " + vendor.vendor_phone + " Is Already Registered With Other Supplier Are You Sure Wants To Register It Again")) {
                                        page.vendorAPI.postValue(vendor, function (data) {
                                            alert("Vendor saved successfully...!");
                                            page.vendorService.getVendorByNo(data[0].key_value, function (data) {
                                                callback(data);
                                            });
                                        });
                                    }
                                }
                            });
                        }

                    }
                    //else {

                    //    vendor.vendor_no = page.vendor_no;
                    //    page.vendorService.updateVendor(vendor, function (data) {
                    //        page.vendorService.getVendorByNo(vendor.vendor_no, function (data) {
                    //            callback(data);
                    //        });
                    //    });
                    //    }
                }
            };

            page.interface.select = function (item) {

                $$("hdnCustNo").val(nvl(item.cust_no, ""));
                $$("txtVendorName").val(nvl(item.vendor_name, ""));
                $$("txtPhoneno").val(nvl(item.lphone_no, ""));
                $$("txtLandline").val(nvl(item.landline_no, ""));
                $$("txtEmail").val(nvl(item.email, ""));
                $$("txtAddress").val(nvl(item.address, ""));
                $$("txtArea").val(nvl(item.area, ""));
                $$("txtBankName").val(nvl(item.bank_name, ""));
                $$("txtAccountNo").val(nvl(item.account_no, ""));
                $$("txtIFSCCode").val(nvl(item.ifsc_code, ""));
                $$("txtTinNo").val(nvl(item.ifsc_code, ""));
                $$("txtlicenseno").val(nvl(item.ifsc_code, ""));

                $$("txtVendorName").focus();
            };

            

        });
    }
    