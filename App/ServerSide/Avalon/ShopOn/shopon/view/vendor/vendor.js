/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.vendorPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.vendorAPI = new VendorAPI();
        page.vendor_no = null;
        document.title = "ShopOn - Supplier";
        $("body").keydown(function (e) {
            //now we caught the key code
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
                page.events.btnBeforeDelete_click();
            }

        });

        //To search the Vendor
        page.events.btnSearch_click = function () {
            $(".detail-info").hide();
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("btnDelete").selectedObject.next().hide();
            $$("msgPanel").show("Searching...");

            //Load the search result in grid
            var data = {
                start_record: 0,
                end_record: "",
                //filter_expression: "concat(ifnull(vendor_no,''),ifnull(vendor_id,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + $$("txtSearchInput").value() + "%'",
                filter_expression: "concat(ifnull(vendor_id,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.vendorAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
        };

        //To create a new vendor
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();
            $$("btnDelete").selectedObject.next().hide();

            //Clear all textbox
            $$("txtVendorName").val('');
            $$("txtVendorName").focus();
            $$("txtAddress").val('');
            $$("txtPhoneno").val('');
            $$("txtLandline").val('');
            $$("txtEmail").val('');
            $$("chkActive").prop('checked', true);
            $("#lblCreatedDate").text('');
            $$("txtArea").val(''),
            $$("txtIFSCCode").val(''),
            $$("txtBankName").val(''),
            $$("txtAccountNo").val(''),
            $$("txtgstno").val(''),
            $$("txtTinNo").val(''),
            $$("txtlicenseno").val(''),
            //Set the curent vendor no to null
            page.vendor_no = null;
           
            
        };

        //To insert or update a vendor
        page.events.btnSave_click = function () {
            $$("btnSave").disable(false);
            var error_count = 0;
            var vendor = {
                vendor_name: $$("txtVendorName").value(),
                vendor_phone:($$("txtPhoneno").value() == "") ? "" : $$("txtPhoneno").value(),
                landline_no:$$("txtLandline").val(),
                vendor_email: $$("txtEmail").value(),
                area: $$("txtArea").val(),
                ifsc_code: $$("txtIFSCCode").val(),
                bank_name: $$("txtBankName").val(),
                account_no: $$("txtAccountNo").val(),
                vendor_address: $$("txtAddress").value(),
                license_no: $$("txtlicenseno").value(),
                gst_no: $$("txtgstno").value(),
                tin_no: $$("txtTinNo").value(),
                active_comm: $$("chkActive").prop("checked") ? 1 : 0,
                comp_id: localStorage.getItem("user_company_id"),
            };

            if (vendor.vendor_name == "") {
                $$("msgPanel").show("Supplier name is mandatory ...!");
                $$("txtVendorName").focus();
                error_count++;
            }

            if (vendor.vendor_phone != "") {
                var mob_reg = /^\d{10}$/;
                if (!mob_reg.test(vendor.vendor_phone)) {
                    error_count++;
                    $$("msgPanel").show("Mobile no should only contain numbers ...!");
                    $$("txtPhoneno").focus();
                }
            }
            
            if ( vendor.vendor_name !="" && isInt(vendor.vendor_name) ) {
                $$("msgPanel").show("Supplier name should only contains characters ...!");
                $$("txtVendorName").focus();
                error_count++;
            }
            if (vendor.landline_no != "" && !isInt(vendor.landline_no)) {
                $$("msgPanel").show("Landline no should only contain numbers ...!");
                $$("txtLandline").focus();
                error_count++;
            }
            if (vendor.vendor_email != "" && !ValidateEmail(vendor.vendor_email))
            {
                $$("msgPanel").show("Email address is not valid...!");
                $$("txtEmail").focus();
                error_count++;
            }
            if (vendor.area != "" && !isNaN(vendor.area))
            {
                $$("msgPanel").show("Area should only contain characters ...!");
                $$("txtArea").focus();
                error_count++;
            }
            if (vendor.bank_name != "" && !isNaN(vendor.bank_name)) {
                $$("msgPanel").show("Bank name should only contain characters ...!");
                $$("txtBankName").focus();
                error_count++;
            }
            if (vendor.account_no != "" && isNaN(vendor.account_no)) {
                $$("msgPanel").show("Account number should only contain numbers ...!");
                $$("txtAccountNo").focus();
                error_count++;
            }
            if (vendor.ifsc_code != "") {
                if (vendor.ifsc_code.length == 11) {
                    var ifsc_reg = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
                    if (!ifsc_reg.test(vendor.ifsc_code)) {
                        error_count++;
                        $$("msgPanel").show("You Are Entered Wrong IFSC Number");
                        $$("txtIFSCCode").focus();
                    }
                }
                else {
                    error_count++;
                    $$("msgPanel").show("You Are Entered Wrong IFSC Number");
                    $$("txtIFSCCode").focus();
                }
            }
            if (vendor.gst_no != "") {
                if (vendor.gst_no.length == 15) {
                    var gst_reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                    if (!gst_reg.test(vendor.gst_no)) {
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
            if(error_count==0) {

                if (page.vendor_no == null || page.vendor_no == '') {
                    if (vendor.vendor_phone == "" || vendor.vendor_phone == null || typeof vendor.vendor_phone == "undefined") {
                        $$("msgPanel").flash("Inserting new supplier...");
                        page.vendorAPI.postValue(vendor, function (data) {
                            $$("msgPanel").flash("Supplier saved successfully...!");
                            $$("btnSave").disable(false);
                            var vendor = {
                                vendor_no: data[0].key_value
                            }
                            page.vendorAPI.getValue(vendor, function (data) {
                                // Add the new data to Grid
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtVendorName").focus();
                            });
                        });
                    }
                    else {
                        var filter_expression = "concat(ifnull(vendor_id,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + vendor.vendor_phone + "%'";
                        page.vendorAPI.searchValues("", "", filter_expression, "", function (testdata) {
                            if (testdata.length == 0) {
                                $$("msgPanel").flash("Inserting new supplier...");
                                page.vendorAPI.postValue(vendor, function (data) {
                                    $$("msgPanel").flash("Supplier saved successfully...!");
                                    $$("btnSave").disable(false);
                                    var vendor = {
                                        vendor_no: data[0].key_value
                                    }
                                    page.vendorAPI.getValue(vendor, function (data) {
                                        // Add the new data to Grid
                                        $$("grdSearchResult").dataBind(data);
                                        $$("grdSearchResult").getAllRows()[0].click();
                                        $$("msgPanel").hide();
                                        $$("txtVendorName").focus();
                                    });
                                });
                            }
                            else {
                                if (confirm("This Mobile No " + vendor.vendor_phone + " Is Already Registered With Other Supplier Are You Sure Wants To Register It Again")) {
                                    $$("msgPanel").flash("Inserting new supplier...");
                                    page.vendorAPI.postValue(vendor, function (data) {
                                        $$("msgPanel").show("Supplier saved successfully...!");
                                        $$("btnSave").disable(false);
                                        var vendor = {
                                            vendor_no: data[0].key_value
                                        }
                                        page.vendorAPI.getValue(vendor, function (data) {
                                            // Add the new data to Grid
                                            $$("grdSearchResult").dataBind(data);
                                            $$("grdSearchResult").getAllRows()[0].click();
                                            $$("msgPanel").hide();
                                            $$("txtVendorName").focus();
                                        });
                                    });
                                }
                            }
                        });
                    }

                }
                else {
                    if (vendor.vendor_phone == "" || vendor.vendor_phone == null || typeof vendor.vendor_phone == "undefined") {
                        $$("msgPanel").flash("Updating supplier...");
                        vendor.vendor_no = page.vendor_no;
                        page.vendorAPI.putValue(vendor.vendor_no, vendor, function (data1) {
                            $$("msgPanel").flash("Supplier updated successfully...!");
                            $$("btnSave").disable(false);
                            var vendor = {
                                vendor_no: page.vendor_no
                            }
                            page.vendorAPI.getValue(vendor, function (data) {
                                // Update the new data to Grid
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtVendorName").focus();
                            });
                        });
                    }
                    else {
                        var filter_expression = "concat(ifnull(vendor_id,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + vendor.vendor_phone + "%'";
                        page.vendorAPI.searchValues("", "", filter_expression, "", function (testdata) {
                            if (testdata.length == 0) {
                                $$("msgPanel").flash("Updating supplier...");
                                vendor.vendor_no = page.vendor_no;
                                page.vendorAPI.putValue(vendor.vendor_no, vendor, function (data1) {
                                    $$("msgPanel").flash("Supplier updated successfully...!");
                                    $$("btnSave").disable(false);
                                    var vendor = {
                                        vendor_no: page.vendor_no
                                    }
                                    page.vendorAPI.getValue(vendor, function (data) {
                                        // Update the new data to Grid
                                        $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                        $$("grdSearchResult").selectedRows()[0].click();
                                        $$("msgPanel").hide();
                                        $$("txtVendorName").focus();
                                    });
                                });
                            }
                            else {
                                if (page.vendor_no != testdata[0].vendor_no) {
                                    if (confirm("This Mobile No " + vendor.vendor_phone + " Is Already Registered With Other Supplier Are You Sure Wants To Save It Again")) {
                                        $$("msgPanel").flash("Updating supplier...");
                                        vendor.vendor_no = page.vendor_no;
                                        page.vendorAPI.putValue(vendor.vendor_no, vendor, function (data1) {
                                            $$("msgPanel").flash("Supplier updated successfully...!");
                                            $$("btnSave").disable(false);
                                            var vendor = {
                                                vendor_no: page.vendor_no
                                            }
                                            page.vendorAPI.getValue(vendor, function (data) {
                                                // Update the new data to Grid
                                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                                $$("grdSearchResult").selectedRows()[0].click();
                                                $$("msgPanel").hide();
                                                $$("txtVendorName").focus();
                                            });
                                        });
                                    }
                                }
                                else {
                                    $$("msgPanel").flash("Updating supplier...");
                                    vendor.vendor_no = page.vendor_no;
                                    page.vendorAPI.putValue(vendor.vendor_no, vendor, function (data1) {
                                        $$("msgPanel").flash("Supplier updated successfully...!");
                                        $$("btnSave").disable(false);
                                        var vendor = {
                                            vendor_no: page.vendor_no
                                        }
                                        page.vendorAPI.getValue(vendor, function (data) {
                                            // Update the new data to Grid
                                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                            $$("grdSearchResult").selectedRows()[0].click();
                                            $$("msgPanel").hide();
                                            $$("txtVendorName").focus();
                                        });
                                    });
                                }
                            }
                        });
                    }
                    
                } 
            }
            else {
                $$("btnSave").disable(false);
            }
            $$("btnDelete").show();
            $$("btnDelete").selectedObject.next().show();
        };
        page.events.btnBeforeDelete_click = function () {
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
        }
        page.events.btnRemoveConfirmPopupClose_click = function () {
            page.controls.pnlRemoveConfirmPopup.close();
        }
        page.events.btnDelete_click = function () {
            if (page.vendor_no != null && page.vendor_no != '') {
                $$("msgPanel").show("Removing vendor...");
                var data = {
                    vendor_no: page.vendor_no
                }
                page.vendorAPI.deleteValue(page.vendor_no, data, function (data) {
                    //Delete from grid
                    $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                    $(".detail-info").hide();

                    $$("btnSave").hide();
                    $$("btnDelete").hide();
                    $$("btnDelete").selectedObject.next().hide();
                    $$("msgPanel").show("Supplier removed successfully...!");
                    page.controls.pnlRemoveConfirmPopup.close();
                    $$("msgPanel").hide();

                });
            }
            else {
                $$("msgPanel").show("Select a Supplier first...!");
            }
        };
        page.events.btnReport_click = function () {
            page.controls.pnlReportPopup.open();
            page.controls.pnlReportPopup.title("Report Type");
            page.controls.pnlReportPopup.rlabel("Report Type");
            page.controls.pnlReportPopup.width(500);
            page.controls.pnlReportPopup.height(150);
        }
        page.events.btnGetReportVendor_click = function () {
            var vendor_details = [];
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: " vt.active_comm = 1",
                sort_expression: ""
            }
            page.vendorAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $(data).each(function (i, item) {
                    vendor_details.push({
                        "VendorNo": item.vendor_id,
                        "VendorName": item.vendor_name,
                        "PhoneNo": (item.vendor_phone == null) ? "" : item.vendor_phone,
                        "Email": (item.vendor_email == null) ? "" : item.vendor_email,
                        "Address": (item.vendor_address == null || item.vendor_address == ",,,-") ? "" : item.vendor_address
                    });
                });

                var accountInfo = {
                    "ApplicaName": CONTEXT.COMPANY_NAME,
                    "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "PhoneNo": "Ph No : "+CONTEXT.COMPANY_PHONE_NO,
                    "CompanyDLNo": "DL No : " + CONTEXT.COMPANY_DL_NO,
                    "CompanyTINNo": "TIN No : " + CONTEXT.COMPANY_TIN_NO,
                    "CompanyGST": "GST No : " + CONTEXT.COMPANY_GST_NO,
                    "BillName": "Supplier Report",
                    "Vendor": vendor_details
                };
                GeneratePrint("ShopOnDev", "Vendor/VendorMainReport.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            });
        }
             
        page.events.page_load = function () {
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("480px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "ID", 'width': "60px", 'rlabel': 'No', 'dataField': "vendor_no" },
                    { 'name': "ID", 'width': "60px",'rlabel':'No', 'dataField': "vendor_id" },
                    { 'name': "Name", 'width': "150px", 'rlabel': 'Name', 'dataField': "vendor_name" },
                    { 'name': "Phone No", 'width': "130px", 'rlabel': 'Phone', 'dataField': "vendor_phone" },
                ]
            });
            $$("grdSearchResult").selectionChanged = function (row, item) {
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
                $$("btnDelete").selectedObject.next().show();
                //Set the current vendor
                page.vendor_no = item.vendor_no;
              
                //Load the data
                $$("txtVendorName").value(item.vendor_name);
                $$("txtAddress").value(item.vendor_address);
                var mobile1 = item.vendor_phone;
                (mobile1 == "" || mobile1 == null) ? $$("txtPhoneno").value('') : $$("txtPhoneno").value(mobile1);
                $$("txtEmail").value(item.vendor_email);
                $$("lblCreatedDate").value(item.cre_date);
                $$("chkActive").prop('checked', item.active_comm == "1");
                $$("txtArea").val(item.area),
                $$("txtIFSCCode").val(item.ifsc_code),
                $$("txtBankName").val(item.bank_name),
                $$("txtAccountNo").val(item.account_no),
                $$("txtLandline").val(item.landline_no);
                $$("txtgstno").val(item.gst_no);
                $$("txtTinNo").val(item.tin_no);
                $$("txtlicenseno").val(item.license_no);
                $$("txtVendorName").focus();
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();
            $$("txtSearchInput").focus();

            //$$("txtSearchInput").keyup(function () {
            //    //Load the search result in grid
            //    var data = {
            //        start_record: 0,
            //        end_record: "",
            //        filter_expression: "concat(ifnull(vendor_no,''),ifnull(vendor_name,''),ifnull(vendor_phone,'')) like '%" + $$("txtSearchInput").value() + "%'",
            //        sort_expression: ""
            //    }
            //    page.vendorAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //        $$("grdSearchResult").dataBind(data);
            //        $$("msgPanel").hide();
            //    });
            //})
            $$("ddlExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
        };
        function selectRow(up) {
            var t = $$("grdSearchResult");
            var count = t.grid.dataCount;
            var selected = t.selectedRowIds()[0];
            if (selected) {
                var index = parseInt(t.selectedRowIds()[0])-1;
                index = parseInt(index) + parseInt(up ? -1 : 1);
                if (index < 0) index = 0;
                if (index >= count) index = count - 1;
                t.getAllRows()[index].click();
            } else {
                var index;
                index = parseInt(up ? count - 1 : 0);
                t.getAllRows()[index].click();
            }
        }
        var panel = $("[controlid=grdSearchResult]").attr('tabindex', 0).focus();
        panel.bind('keydown', function (e) {
            switch (e.keyCode) {
                case 38:    // up
                    selectRow(true);
                    return false;
                case 40:    // down
                    selectRow(false);
                    return false;
            }
        });
       
    });
};
