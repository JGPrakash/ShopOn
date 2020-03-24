$.fn.settingsPage = function () {
    return $.pageController.getPage(this, function (page, $$) {

        page.settService = new SettingService();
        page.settingApi = new SettingsAPI();
        page.revenueService = new RevenueService();
        page.accaccountService = new AccAccountService();
        page.salestaxService = new SalesTaxService();
        page.companyService = new CompanyService();
        page.afterapply = function () {
            
        }
        
        document.title = "ShopOn - Settings";
        page.events.btnUploadGen_click = function () {

            page.settingApi.searchSettings("", "", "value_3='General' and sett_key='LAST_UPLOAD_TIME' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                if (data.length > 0) {
                    var upData = {
                        upd_date: data[0].value_1,
                        e_comp_id: CONTEXT.ESHOPON_COMP_ID,
                        e_store_no: CONTEXT.ESHOPON_STORE_NO,
                        e_auth_token: CONTEXT.ESHOPON_AUTH_TOKEN
                    }
                }
                $.server.webMethodPOST("shopon/online-offline-sync/offline", upData, function (data) {
                    alert("Upload Completed...!");
                }, function (error) {
                    alert(error.message);
                })
            })
        }
        page.events.btnDownloadGen_click = function () {
            page.settingApi.searchSettings("", "", "value_3='General' and sett_key in ('LAST_DOWNLOAD_TIME','ESHOPON_COMP_ID','ESHOPON_STORE_NO','ESHOPON_AUTH_TOKEN') and comp_id = " + getCookie("user_company_id"), "", function (data) {
                if (data.length > 0) {
                    var upd_date = data.filter(function (n) {
                        return n.sett_key == 'LAST_DOWNLOAD_TIME';
                    })
                    var e_comp_id = data.filter(function (n) {
                        return n.sett_key == 'ESHOPON_COMP_ID';
                    })
                    var e_store_no = data.filter(function (n) {
                        return n.sett_key == 'ESHOPON_STORE_NO';
                    })
                    var e_auth_token = data.filter(function (n) {
                        return n.sett_key == 'ESHOPON_AUTH_TOKEN';
                    })

                    var upData = {
                        upd_date: upd_date[0].value_1,
                        e_comp_id: e_comp_id[0].value_1,
                        e_store_no: e_store_no[0].value_1,
                        e_auth_token: e_auth_token[0].value_1
                    }
                    $.server.webMethodPOST("shopon/online-offline-sync/online", upData, function (data) {
                        alert("Download Completed...!");
                    }, function (error) {
                        alert(error.message);
                    })
                }

            })
        }
        page.events.btnSaveGen_click = function () {
            if ($$("txtCompanyGen").val() == "") {
                $$("msgPanel").show("Enter company name...!");
                $$("txtCompanyGen").focus();
            }
            else if ($$("txtOwnerGen").val() == "") {
                $$("msgPanel").show("Enter owner name...!");
                $$("txtOwnerGen").focus();
            }
            else if ($$("txtPhoneNo").val() == "") {
                $$("msgPanel").show("Enter phone no...!");
                $$("txtPhoneNo").focus();
            }
            else if (($$("txtPhoneNo").val() != "") && !isInt($$("txtPhoneNo").val())) {
                $$("msgPanel").show("Phone no should only contain numbers ...!!!");
                $$("txtPhoneNo").focus();
            }
            else if ($$("txtPhoneNo").val() != "" && $$("txtPhoneNo").val().length < 10) {
                $$("msgPanel").show("Phone no should have 10 digits...!");
                $$("txtPhoneNo").focus();
            }
            else if ($$("txtEmail").val() == "") {
                $$("msgPanel").show("Enter e-mail address...!");
                $$("txtEmail").focus();
            }
            else if ($$("txtEmail").val() != "" && !ValidateEmail($$("txtEmail").val())) {
                $$("msgPanel").show("Email address is not valid...!");
                $$("txtEmail").focus();
            }
            else if ($$("txtCmpnyAddGen").val() == "") {
                $$("msgPanel").show("Enter company address...!");
                $$("txtCmpnyAddGen").focus();
            }
            else {
                $$("msgPanel").hide();
                page.saveGeneral();

            }

        }
        page.saveGeneral = function () {

            $("textarea").each(function () {
                this.value = this.value.replace(/,/g, "-");
            });
            //Company Name
            var data1 = {
                sett_no: page.company_name,
                sett_desc: 'Company Name',
                sett_key: 'COMPANY_NAME',
                value_1: $$("txtCompanyGen").val(),
                value_2: "General",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating company name...");
            //page.settService.getMaxSettingDetails(function (maxNo, callback) {
            //    sett_no = maxNo[0].sett_no;
            page.settService.updateSetting(data1, function () {

                //Owner Name
                var data2 = {
                    sett_no: page.company_owner_name,
                    sett_desc: 'Owner Name',
                    sett_key: 'COMPANY_OWNER_NAME',
                    value_1: $$("txtOwnerGen").val(),
                    value_2: "General",
                    value_3: "Text",
                }
                $$("msgPanel").show("owner name updated successfully...!");
                $$("msgPanel").show("Updating company name...");
                //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                //    sett_no = maxNo[0].sett_no;
                page.settService.updateSetting(data2, function () {
                    //Owner Name
                    var data2a = {
                        sett_no: page.company_land_no,
                        sett_desc: 'Landline No',
                        sett_key: 'COMPANY_LANDLINE_NO',
                        value_1: $$("txtCmpnyLandlineNo").val(),
                        value_2: "General",
                        value_3: "Text",
                    }
                    $$("msgPanel").show("owner name updated successfully...!");
                    $$("msgPanel").show("Updating owner name...");
                    //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                    //    sett_no = maxNo[0].sett_no;
                    page.settService.updateSetting(data2a, function () {

                        //Phone No
                        var data3 = {
                            sett_no: page.company_phoneno,
                            sett_desc: 'Phone No',
                            sett_key: 'COMPANY_PHONE_NO',
                            value_1: $$("txtPhoneNo").val(),
                            value_2: "General",
                            value_3: "Text",
                        }
                        $$("msgPanel").show("owner name updated successfully...!");
                        $$("msgPanel").show("Updating phone no...");
                        //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                        //    sett_no = maxNo[0].sett_no;
                        page.settService.updateSetting(data3, function () {

                            //E-mail
                            var data3a = {
                                sett_no: page.company_alterphoneno,
                                sett_desc: 'Alter Phone No',
                                sett_key: 'COMPANY_ALTER_PHONE_NO',
                                value_1: $$("txtAlterPhoneNo").val(),
                                value_2: "General",
                                value_3: "Text",
                            }
                            $$("msgPanel").show("Phone no updated successfully...!");
                            $$("msgPanel").show("Updating alter phone no...");
                            //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                            //    sett_no = maxNo[0].sett_no;
                            page.settService.updateSetting(data3a, function () {
                                //E-mail
                                var data4 = {
                                    sett_no: page.company_email,
                                    sett_desc: 'E-mail',
                                    sett_key: 'COMPANY_EMAIL',
                                    value_1: $$("txtEmail").val(),
                                    value_2: "General",
                                    value_3: "Text",
                                }
                                $$("msgPanel").show("Alter phone no updated successfully...!");
                                $$("msgPanel").show("Updating e-mail address...");
                                //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                //    sett_no = maxNo[0].sett_no;
                                page.settService.updateSetting(data4, function () {
                                    var data41a = {
                                        sett_no: page.company_web_address,
                                        sett_desc: 'COMPANY_WEB_ADDRESS',
                                        sett_key: 'COMPANY_WEB_ADDRESS',
                                        value_1: $$("txtWebAddress").val(),
                                        value_2: "General",
                                        value_3: "Text",
                                    }
                                    $$("msgPanel").show("Alter email updated successfully...!");
                                    $$("msgPanel").show("Updating webaddress address...");
                                    //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                    //    sett_no = maxNo[0].sett_no;
                                    page.settService.updateSetting(data41a, function () {
                                        //Company Address
                                        var data4a = {
                                            sett_no: page.companygstno,
                                            sett_desc: 'Company GST No',
                                            sett_key: 'COMPANY_GST_NO',
                                            value_1: $$("txtCmpnyGSTNo").val(),
                                            value_2: "General",
                                            value_3: "Text",
                                        }
                                        $$("msgPanel").show("E-mail address updated successfully...!");
                                        $$("msgPanel").show("Updating company GST No...");
                                        //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                        //    sett_no = maxNo[0].sett_no;
                                        page.settService.updateSetting(data4a, function () {
                                            //Company Address
                                            var data4b = {
                                                sett_no: page.companydlno,
                                                sett_desc: 'Company DL No',
                                                sett_key: 'COMPANY_DL_NO',
                                                value_1: $$("txtCmpnyDLNo").val(),
                                                value_2: "General",
                                                value_3: "Text",
                                            }
                                            $$("msgPanel").show("Company GST No updated successfully...!");
                                            $$("msgPanel").show("Updating company DL No...");
                                            //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                            //    sett_no = maxNo[0].sett_no;
                                            page.settService.updateSetting(data4a, function () {
                                                //Company TIN No
                                                var data4c = {
                                                    sett_no: page.companytinno,
                                                    sett_desc: 'Company TIN No',
                                                    sett_key: 'COMPANY_TIN_NO',
                                                    value_1: $$("txtCmpnyTINNo").val(),
                                                    value_2: "General",
                                                    value_3: "Text",
                                                }
                                                $$("msgPanel").show("Company DL No inserted successfully...!");
                                                $$("msgPanel").show("Updating company TIN No...");
                                                //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                //    sett_no = maxNo[0].sett_no;
                                                page.settService.updateSetting(data4c, function () {
                                                    //Company Address
                                                    var data5 = {
                                                        sett_no: page.company_address,
                                                        sett_desc: 'Company Address',
                                                        sett_key: 'COMPANY_ADDRESS_LINE1',
                                                        value_1: $$("txtCmpnyAddGen").val(),
                                                        value_2: "General",
                                                        value_3: "Text",
                                                    }
                                                    $$("msgPanel").show("Company TIN No inserted successfully...!");
                                                    $$("msgPanel").show("Updating company address...");
                                                    //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                    //    sett_no = maxNo[0].sett_no;
                                                    page.settService.updateSetting(data5, function () {
                                                        var data5 = {
                                                            sett_no: page.company_address_line2,
                                                            sett_desc: 'Company Address',
                                                            sett_key: 'COMPANY_ADDRESS_LINE2',
                                                            value_1: $$("txtCmpnyAddGen1").val(),
                                                            value_2: "General",
                                                            value_3: "Text",
                                                        }
                                                        $$("msgPanel").show("Company Address Updated successfully...!");
                                                        $$("msgPanel").show("Updating company address...");
                                                        //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                        //    sett_no = maxNo[0].sett_no;
                                                        page.settService.updateSetting(data5, function () {
                                                            $$("msgPanel").show("Company address inserted successfully...!");
                                                            var files = $("#fileUpload").get(0).files;
                                                            var fileName = "";
                                                            // Add the uploaded image content to the form data collection
                                                            if (files.length > 0) {
                                                                fileName = files[0];
                                                            }
                                                            //if (fileName.name != "" || fileName.name != null || fileName.name != undefined) {
                                                            //    vehicletype.image_name = fileName.name
                                                            //}
                                                            //else {
                                                            //    vehicletype.image_name = page.image_name;
                                                            //}
                                                            var data6 = {
                                                                //sett_no: 396,
                                                                sett_desc: 'Logo Name',
                                                                sett_key: 'LogoName',
                                                                value_1: $$("txtLogoName").val(),
                                                                value_2: "General",
                                                                value_3: (fileName.name == "" || fileName.name == null) ? "" : fileName.name,
                                                            }
                                                            $$("msgPanel").show("Inserting logo name...");
                                                            //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                                //sett_no = maxNo[0].sett_no;
                                                                //page.settService.insertSettings(data6, sett_no, function () {
                                                                    $$("msgPanel").show("Logo name inserted successfully...!");
                                                                    var data7 = {
                                                                        sett_no: page.tax_no,
                                                                        sett_desc: 'Default Sales Tax',
                                                                        sett_key: 'DEFAULT_SALES_TAX',
                                                                        value_1: $$("ddlDefaultTax").selectedValue(),
                                                                        value_2: "General",
                                                                        value_3: "Dropdown",
                                                                    }
                                                                    $$("msgPanel").show("Updating tax...");
                                                                    //page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                                    //    sett_no = maxNo[0].sett_no;
                                                                    page.settService.updateSetting(data7, function () {
                                                                        $//$("msgPanel").show("Purchase account updated...!");
                                                                        var data8 = {
                                                                            sett_no: page.def_store,
                                                                            sett_desc: 'User Default Store',
                                                                            sett_key: 'USER_DEFAULT_STORE',
                                                                            value_1: $$("ddlCurrentStore").selectedValue(),
                                                                            value_2: "General",
                                                                            value_3: "Dropdown",
                                                                        }
                                                                        $$("msgPanel").show("Updating store...");
                                                                        page.settService.updateSetting(data8, function () {
                                                                            $$("msgPanel").show("Store inserted successfully...!");
                                                                            //$$("msgPanel").show("Purchase account updated...!");
                                                                            var data9 = {
                                                                                sett_no: page.def_reg,
                                                                                sett_desc: 'User Default Register',
                                                                                sett_key: 'USER_DEFAULT_REGISTER',
                                                                                value_1: $$("ddlCurrentRegister").selectedValue(),
                                                                                value_2: "General",
                                                                                value_3: "Dropdown",
                                                                            }
                                                                            $$("msgPanel").show("Updating register...");
                                                                            page.settService.updateSetting(data9, function () {
                                                                                $$("msgPanel").show("User register updated sucessfully...!");
                                                                                //$(".detail-info").progressBar("hide")
                                                                                var data10 = {
                                                                                    sett_no: page.vendor,
                                                                                    sett_desc: 'Include Vendor',
                                                                                    sett_key: 'ENABLE_VARIATION_VENDOR',
                                                                                    //value_1: $$("ddlCurrentRegister").selectedValue(),
                                                                                    value_2: "General",
                                                                                    value_3: "Checkbox",
                                                                                }
                                                                                if ($$("chkVendor").prop("checked")) {
                                                                                    data10.value_1 = "true";
                                                                                } else {
                                                                                    data10.value_1 = "false";
                                                                                }
                                                                                $$("msgPanel").show("Updating vendor...");
                                                                                page.settService.updateSetting(data10, function () {
                                                                                    $$("msgPanel").show("Vendor updated sucessfully...!");
                                                                                    var data11 = {
                                                                                        sett_no: page.mrp,
                                                                                        sett_desc: 'Include MRP',
                                                                                        sett_key: 'ENABLE_VARIATION_MRP',
                                                                                        //value_1: $$("ddlCurrentRegister").selectedValue(),
                                                                                        value_2: "General",
                                                                                        value_3: "Checkbox",
                                                                                    }
                                                                                    if ($$("chkMRP").prop("checked")) {
                                                                                        data11.value_1 = "true";
                                                                                    } else {
                                                                                        data11.value_1 = "false";
                                                                                    }
                                                                                    $$("msgPanel").show("Updating MRP...");
                                                                                    page.settService.updateSetting(data11, function () {
                                                                                        $$("msgPanel").show("MRP updated sucessfully...!");
                                                                                        var data12 = {
                                                                                            sett_no: page.mandate,
                                                                                            sett_desc: 'Include Manufacturer Date',
                                                                                            sett_key: 'ENABLE_VARIATION_MAN_DATE',
                                                                                            //value_1: $$("ddlCurrentRegister").selectedValue(),
                                                                                            value_2: "General",
                                                                                            value_3: "Checkbox",
                                                                                        }
                                                                                        if ($$("chkManDate").prop("checked")) {
                                                                                            data12.value_1 = "true";
                                                                                        } else {
                                                                                            data12.value_1 = "false";
                                                                                        }
                                                                                        $$("msgPanel").show("Updating manufacturer date...");
                                                                                        page.settService.updateSetting(data12, function () {
                                                                                            $$("msgPanel").show("Manufacturer date updated sucessfully...!");
                                                                                            var data13 = {
                                                                                                sett_no: page.expdate,
                                                                                                sett_desc: 'Include Expiry Date',
                                                                                                sett_key: 'ENABLE_VARIATION_EXP_DATE',
                                                                                                //value_1: $$("ddlCurrentRegister").selectedValue(),
                                                                                                value_2: "General",
                                                                                                value_3: "Checkbox",
                                                                                            }
                                                                                            if ($$("chkExpDate").prop("checked")) {
                                                                                                data13.value_1 = "true";
                                                                                            } else {
                                                                                                data13.value_1 = "false";
                                                                                            }
                                                                                            $$("msgPanel").show("Updating expiry date...");
                                                                                            page.settService.updateSetting(data13, function () {
                                                                                                $$("msgPanel").show("Expiry date updated sucessfully...!");
                                                                                                var data14 = {
                                                                                                    sett_no: page.batchno,
                                                                                                    sett_desc: 'Include Batch No',
                                                                                                    sett_key: 'ENABLE_VARIATION_BATCH',
                                                                                                    //value_1: $$("ddlCurrentRegister").selectedValue(),
                                                                                                    value_2: "General",
                                                                                                    value_3: "Checkbox",
                                                                                                }
                                                                                                if ($$("chkBatchNo").prop("checked")) {
                                                                                                    data14.value_1 = "true";
                                                                                                } else {
                                                                                                    data14.value_1 = "false";
                                                                                                }
                                                                                                $$("msgPanel").show("Updating Batch No...");
                                                                                                page.settService.updateSetting(data14, function () {
                                                                                                    $$("msgPanel").show("Batch No updated sucessfully...!");
                                                                                                    var data15 = {
                                                                                                        sett_no: page.freemode,
                                                                                                        sett_desc: 'Free Mode',
                                                                                                        sett_key: "FREE_MODE",
                                                                                                        value_1: $$("ddlFreeMode").selectedValue(),
                                                                                                        value_2: "General",
                                                                                                        value_3: "Dropdown",
                                                                                                    }
                                                                                                    $$("msgPanel").show("Updating free mode...");
                                                                                                    page.settService.updateSetting(data15, function () {
                                                                                                        $$("msgPanel").show("Free mode updated sucessfully...!");
                                                                                                        var data16 = {
                                                                                                            sett_no: page.chkBuyingCost,
                                                                                                            sett_desc: 'Include Buying Cost',
                                                                                                            sett_key: 'ENABLE_VARIATION_BUYING_COST',
                                                                                                            value_2: "General",
                                                                                                            value_3: "Checkbox",
                                                                                                        }
                                                                                                        if ($$("chkBuyingCost").prop("checked")) {
                                                                                                            data16.value_1 = "true";
                                                                                                        } else {
                                                                                                            data16.value_1 = "false";
                                                                                                        }
                                                                                                        $$("msgPanel").show("Updating Buying Cost...");
                                                                                                        page.settService.updateSetting(data16, function () {
                                                                                                            $$("msgPanel").show("Buying Cost updated sucessfully...!");
                                                                                                            page.events.btnGeneral_click();
                                                                                                            $$("msgPanel").hide();
                                                                                                        });
                                                                                                    });
                                                                                                    //$(".detail-info").progressBar("hide")
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                        //$$("msgPanel").hide();
                                                                                    });
                                                                                });
                                                                                //page.loadGen();
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            //});
                                                        //});
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            $$("msgPanel").hide();
        }
        page.events.btnSaveFin_click = function () {
            page.saveFinfacts();
        }
        page.saveFinfacts = function () {
            //Updating Company Name
            var data0 = {
                sett_no: page.company,
                sett_desc: 'finfacts company',
                sett_key: 'FINFACTS_COMPANY',
                value_1: $$("ddlCompany").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            //$(".detail-info").progressBar("show")

            $$("msgPanel").show("Updating company...");
            page.settService.updateSetting(data0, function () {
                $$("msgPanel").show("Company updated successfully...!");
            
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
            
            //Sales Account Cash
            var data2 = {
                sett_no: page.sales_cash,
                sett_desc: 'SalesCashAccount',
                sett_key: 'FINFACTS_SALES_DEF_CASH_ACCOUNT',
                value_1: $$("ddlSalesAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("updating sales account...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").flash("Sales account Updated...!");
            
            //Purchase Account Cash
            var data3 = {
                sett_no: page.purchase_cash,
                sett_desc: 'PurchaseCashAccount',
                sett_key: 'FINFACTS_PURCHASE_DEF_CASH_ACCOUNT',
                value_1: $$("ddlPurchaseAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating purchase account...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Purchase account updated...!");
            

            //Sales Account Bank
            var data4 = {
                sett_no: page.sales_bank,
                sett_desc: 'SalesBankAccount',
                sett_key: 'FINFACTS_SALES_DEF_BANK_ACCOUNT',
                value_1: $$("ddlSalesAccountBank").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("updating SalesAccountBank...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Sales bank account Updated...!");
            
            //Purchase Account Bank
            var data5 = {
                sett_no: page.purchase_bank,
                sett_desc: 'PurchaseBankAccount',
                sett_key: 'FINFACTS_PURCHASE_DEF_BANK_ACCOUNT',
                value_1: $$("ddlPurchaseAccountBank").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating purchase bank account...");
            page.settService.updateSetting(data5, function () {
                $$("msgPanel").flash("Purchase bank account updated...!");
            

            //Sales Account Reward
            var data6 = {
                sett_no: page.sales_reward,
                sett_desc: 'SalesRewardAccount',
                sett_key: 'FINFACTS_SALES_DEF_REWARD_ACCOUNT',
                value_1: $$("ddlSalesAccountReward").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("updating sales reward account...");
            page.settService.updateSetting(data6, function () {
                $$("msgPanel").flash("Sales reward account Updated...!");
            
            //Purchase Account Reward
            var data7 = {
                sett_no: page.purchase_reward,
                sett_desc: 'PurchaseRewardAccount',
                sett_key: 'FINFACTS_PURCHASE_DEF_REWARD_ACCOUNT',
                value_1: $$("ddlPurchaseAccountReward").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating purchase reward account...");
            page.settService.updateSetting(data7, function () {
                $$("msgPanel").flash("Purchase reward account updated...!");
            
            //Sales Account Coupon
            var data8 = {
                sett_no: page.sales_coupon,
                sett_desc: 'SalesCouponAccount',
                sett_key: 'FINFACTS_SALES_DEF_COUPON_ACCOUNT',
                value_1: $$("ddlSalesAccountCoupon").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating sales coupon account...");
            page.settService.updateSetting(data8, function () {
                $$("msgPanel").flash("Sales coupon account Updated...!");
            
            //Purchase Account Coupon
            var data9 = {
                sett_no: page.purchase_coupon,
                sett_desc: 'PurchaseCouponAccount',
                sett_key: 'FINFACTS_PURCHASE_DEF_COUPON_ACCOUNT',
                value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating purchase account coupon...");
            page.settService.updateSetting(data9, function () {
                $$("msgPanel").flash("Purchase account coupon updated...!");
                //
            
            var data10 = {
                sett_no: page.billexpacc,
                sett_desc: 'Bill Expense Account',
                sett_key: 'FINFACTS_BILL_EXPENSE_ACCOUNT',
                value_1: $$("ddlBillExpAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating bill expense account...");
            page.settService.updateSetting(data10, function () {
                $$("msgPanel").flash("Bill expense account Updated...!");
            
            var data11 = {
                sett_no: page.billexpcate,
                sett_desc: 'Bill Expense Category',
                sett_key: 'FINFACTS_BILL_EXPENSE_CATEGORY',
                value_1: $$("ddlBillExpCategory").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating bill expense category...");
            page.settService.updateSetting(data11, function () {
                $$("msgPanel").flash("Bill expense category Updated...!");
            
            var data12 = {
                sett_no: page.billexpaccdept,
                sett_desc: 'Bill Expense Sundry Debtor Account',
                sett_key: 'FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR',
                value_1: $$("ddlBillExpDeAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating bill expense sundry debtor account...");
            page.settService.updateSetting(data12, function () {
                $$("msgPanel").flash("Bill expense sundry debtor account Updated...!");
            
            var data13 = {
                sett_no: page.billexpacccred,
                sett_desc: 'Bill Expense Sundry Creditor Account',
                sett_key: 'FINFACTS_BILL_EXPENSE_ACCOUNT_CREDITOR',
                value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating bill expense sundry creditor account...");
            page.settService.updateSetting(data13, function () {
                $$("msgPanel").flash("Bill expense sundry creditor account Updated...!");
            
            var data14 = {
                sett_no: page.enafinmode,
                sett_desc: 'Finfacts Required or not',
                sett_key: 'ENABLE_FINFACTS_MODULES',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Checkbox",
            }
            if ($$("chkFinfactsModules").prop("checked")) {
                data14.value_1 = "true";
            } else {
                data14.value_1 = "false";
            }
            $$("msgPanel").flash("Updating finfacts modules...");
            page.settService.updateSetting(data14, function () {
                $$("msgPanel").flash("Finfacts modules Updated...!");
            
            var data15 = {
                sett_no: page.enabillexp,
                sett_desc: 'Enable Bill Expense',
                sett_key: 'ENABLE_BILL_EXPENSE_MODULES',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Checkbox",
            }
            if ($$("chkBillExpModules").prop("checked")) {
                data15.value_1 = "true";
            } else {
                data15.value_1 = "false";
            }
            $$("msgPanel").flash("Updating bill expense...");
            page.settService.updateSetting(data15, function () {
                $$("msgPanel").flash("Bill expense Updated...!");
                var data15 = {
                    sett_no: page.ddlBillIncome,
                    sett_desc: 'INCOME_ACCOUNT',
                    sett_key: 'INCOME_ACCOUNT',
                    value_1: $$("ddlBillIncome").selectedValue(),
                    value_2: "Finfacts",
                    value_3: "DropDown",
                }
                $$("msgPanel").flash("Updating bill income...");
                page.settService.updateSetting(data15, function () {
                    $$("msgPanel").flash("Bill income Updated...!");
                    var data15 = {
                        sett_no: page.ddlBillIncomeTarget,
                        sett_desc: 'INCOME_TARGET_ACCOUNT',
                        sett_key: 'INCOME_TARGET_ACCOUNT',
                        value_1: $$("ddlBillIncomeTarget").selectedValue(),
                        value_2: "Finfacts",
                        value_3: "DropDown",
                    }
                    $$("msgPanel").flash("Updating bill income target...");
                    page.settService.updateSetting(data15, function () {
                        $$("msgPanel").flash("Bill income target updated...!");
                        page.events.btnFinfacts_click();
                    });
                });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
        }
        page.events.btnSaveMod_click = function () {
            page.saveModules();
        }
        page.saveModules = function () {
            //Updating Inventory
            var data1 = {
                sett_no: page.enable_inventory_module,
                sett_desc: 'Inventory',
                sett_key: 'ENABLE_INVENTORY_MODULE',
                //value_1: $$("ddlCompany").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkInventory").prop("checked")) {
                data1.value_1 = "true";
            } else {
                data1.value_1 = "false";
            }
            $$("msgPanel").show("Updating inventory...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").show("Inventory updated successfully...!");
            });
            //Tax
            var data2 = {
                sett_no: page.enable_tax_module,
                sett_desc: 'Tax',
                sett_key: 'ENABLE_TAX_MODULE',
                //value_1: $$("ddlPeriod").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkTax").prop("checked")) {
                data2.value_1 = "true";
            } else {
                data2.value_1 = "false";
            }
            $$("msgPanel").show("Updating tax...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").show("Tax Updated successfully...!");
            });
            //Sales Account Cash
            var data3 = {
                sett_no: page.enable_discount_module,
                sett_desc: 'Discount',
                sett_key: 'ENABLE_DISCOUNT_MODULE',
                //value_1: $$("ddlSalesAccount").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkDiscount").prop("checked")) {
                data3.value_1 = "true";
            } else {
                data3.value_1 = "false";
            }
            $$("msgPanel").flash("Updating discount...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Discount Updated...!");
            });
            //Purchase Account Cash
            var data4 = {
                sett_no: page.enable_reward_module,
                sett_desc: 'Rewards',
                sett_key: 'ENABLE_REWARD_MODULE',
                //value_1: $$("ddlPurchaseAccount").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkRewards").prop("checked")) {
                data4.value_1 = "true";
            } else {
                data4.value_1 = "false";
            }
            $$("msgPanel").flash("Updating rewards...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Rewards updated...!");
            });

            //Sales Account Bank
            var data5 = {
                sett_no: page.enable_coupon_module,
                sett_desc: 'Coupons',
                sett_key: 'ENABLE_COUPON_MODULE',
                //value_1: $$("ddlSalesAccountBank").selectedValue(),
                value_2: "Finfacts",
                value_3: "Checkbox",
            }
            if ($$("chkCoupons").prop("checked")) {
                data5.value_1 = "true";
            } else {
                data5.value_1 = "false";
            }
            $$("msgPanel").flash("updating coupons...");
            page.settService.updateSetting(data5, function () {
                $$("msgPanel").flash("Coupons Updated...!");
            });
            //Purchase Account Bank
            var data6 = {
                sett_no: page.enable_packaging_module,
                sett_desc: 'Packaging',
                sett_key: 'ENABLE_PACKAGING_MODULE',
                //value_1: $$("ddlPurchaseAccountBank").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkPackaging").prop("checked")) {
                data6.value_1 = "true";
            } else {
                data6.value_1 = "false";
            }
            $$("msgPanel").flash("Updating packaging...");
            page.settService.updateSetting(data6, function () {
                $$("msgPanel").flash("Purchase Packaging updated...!");
            });

            //Sales Account Reward
            var data7 = {
                sett_no: page.enable_touch_pos_module,
                sett_desc: 'Touch POS',
                sett_key: 'ENABLE_TOUCH_POS_MODULE',
                //value_1: $$("ddlSalesAccountReward").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkTouchPOS").prop("checked")) {
                data7.value_1 = "true";
            } else {
                data7.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Touch POS...");
            page.settService.updateSetting(data7, function () {
                $$("msgPanel").flash("Touch POS Updated...!");
            });
            //Purchase Account Reward
            var data8 = {
                sett_no: page.enable_order_module,
                sett_desc: 'Orders',
                sett_key: 'ENABLE_ORDER_MODULE',
                //value_1: $$("ddlPurchaseAccountReward").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkOrders").prop("checked")) {
                data8.value_1 = "true";
            } else {
                data8.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Orders...");
            page.settService.updateSetting(data8, function () {
                $$("msgPanel").flash("Orders updated...!");
            });


            //Sales Account Coupon
            var data9 = {
                sett_no: page.enable_marketing_module,
                sett_desc: 'Marketing',
                sett_key: 'ENABLE_MARKETING_MODULE',
                //value_1: $$("ddlSalesAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkMarketing").prop("checked")) {
                data9.value_1 = "true";
            } else {
                data9.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Marketing...");
            page.settService.updateSetting(data9, function () {
                $$("msgPanel").flash("Marketing Updated...!");
            });
            //Purchase Account Coupon
            var data10 = {
                sett_no: page.enable_multi_lang_module,
                sett_desc: 'Multi Language',
                sett_key: 'ENABLE_MULTI_LANG_MODULE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkMultiLanguage").prop("checked")) {
                data10.value_1 = "true";
            } else {
                data10.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Multi Language...");
            page.settService.updateSetting(data10, function () {
                $$("msgPanel").flash("Multi Language updated...!");
            });
            var data11 = {
                sett_no: page.vehino,
                sett_desc: 'Vehicle No',
                sett_key: 'ENABLE_VEHICLE_NO',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkVehicleNo").prop("checked")) {
                data11.value_1 = "true";
            } else {
                data11.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Vehicle No...");
            page.settService.updateSetting(data11, function () {
                $$("msgPanel").flash("Vehicle No updated...!");
            });
            var data12 = {
                sett_no: page.dateformat,
                sett_desc: 'Date Format',
                sett_key: 'ENABLE_DATE_FORMAT',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkDateFormat").prop("checked")) {
                data12.value_1 = "true";
            } else {
                data12.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Vehicle No...");
            page.settService.updateSetting(data12, function () {
                $$("msgPanel").flash("Vehicle No updated...!");
            });
            var data13 = {
                sett_no: page.showmrp,
                sett_desc: 'Show MRP',
                sett_key: 'ENABLE_MRP',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowMRP").prop("checked")) {
                data13.value_1 = "true";
            } else {
                data13.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show MRP...");
            page.settService.updateSetting(data13, function () {
                $$("msgPanel").flash("Show MRP updated...!");
            });
            var data14 = {
                sett_no: page.showmandate,
                sett_desc: 'Show Man Date',
                sett_key: 'ENABLE_MAN_DATE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowmanDate").prop("checked")) {
                data14.value_1 = "true";
            } else {
                data14.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show mandatory date...");
            page.settService.updateSetting(data14, function () {
                $$("msgPanel").flash("Show mandatory date updated...!");
            });
            var data15 = {
                sett_no: page.showexpdate,
                sett_desc: 'Show Exp Date',
                sett_key: 'ENABLE_EXP_DATE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowExpDate").prop("checked")) {
                data15.value_1 = "true";
            } else {
                data15.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show expiry date...");
            page.settService.updateSetting(data15, function () {
                $$("msgPanel").flash("Show expiry date updated...!");
            });
            var data16 = {
                sett_no: page.showbatno,
                sett_desc: 'Show Batch No',
                sett_key: 'ENABLE_BAT_NO',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowBatchNo").prop("checked")) {
                data16.value_1 = "true";
            } else {
                data16.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show batch No...");
            page.settService.updateSetting(data16, function () {
                $$("msgPanel").flash("Show batch No updated...!");
            });
            var data17 = {
                sett_no: page.showreordlel,
                sett_desc: 'Show Reorder Level',
                sett_key: 'ENABLE_REORDER_LEVEL',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowReorLel").prop("checked")) {
                data17.value_1 = "true";
            } else {
                data17.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show reorder level...");
            page.settService.updateSetting(data17, function () {
                $$("msgPanel").flash("Show reorder level updated...!");
            });
            var data18 = {
                sett_no: page.showreordqty,
                sett_desc: 'Show Reorder Qty',
                sett_key: 'ENABLE_REORDER_QTY',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowReorQty").prop("checked")) {
                data18.value_1 = "true";
            } else {
                data18.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show reorder qty...");
            page.settService.updateSetting(data18, function () {
                $$("msgPanel").flash("Show reorder qty updated...!");
            });
            var data19 = {
                sett_no: page.marketshopon,
                sett_desc: 'Market ShopOn',
                sett_key: 'ENABLE_MARKET_SHOPON',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkMarketShopOn").prop("checked")) {
                data19.value_1 = "true";
            } else {
                data19.value_1 = "false";
            }
            $$("msgPanel").flash("Updating market shopOn...");
            page.settService.updateSetting(data19, function () {
                $$("msgPanel").flash("Market shopOn updated...!");
            });
            var data20 = {
                sett_no: page.taxchgedynamic,
                sett_desc: 'Tax Changes Dynamically',
                sett_key: 'ENABLE_TAX_CHANGES',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkTaxChangesDynamically").prop("checked")) {
                data20.value_1 = "true";
            } else {
                data20.value_1 = "false";
            }
            $$("msgPanel").flash("Updating tax changes dynamically...");
            page.settService.updateSetting(data20, function () {
                $$("msgPanel").flash("Tax changes dynamically updated...!");
            });
            var data21 = {
                sett_no: page.advancedsearch,
                sett_desc: 'Show Advance Search',
                sett_key: 'ENABLE_ADVANCE_SEARCH',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkshowAdvanceSearch").prop("checked")) {
                data21.value_1 = "true";
            } else {
                data21.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show advance search...");
            page.settService.updateSetting(data21, function () {
                $$("msgPanel").flash("Show advance search updated...!");
            });
            var data22 = {
                sett_no: page.moduletray,
                sett_desc: 'Show Module Tray',
                sett_key: 'ENABLE_MODULE_TRAY',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkModuleTray").prop("checked")) {
                data22.value_1 = "true";
            } else {
                data22.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show module tray...");
            page.settService.updateSetting(data22, function () {
                $$("msgPanel").flash("Show module tray updated...!");
            });
            var data23 = {
                sett_no: page.expirydaysmode,
                sett_desc: 'Expiry Days Modules',
                sett_key: 'ENABLE_EXP_DAYS_MODE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkExpiryDaysModules").prop("checked")) {
                data23.value_1 = "true";
            } else {
                data23.value_1 = "false";
            }
            $$("msgPanel").flash("Updating expiry days modules...");
            page.settService.updateSetting(data23, function () {
                $$("msgPanel").flash("Expiry days modules updated...!");
            });
            var data24 = {
                sett_no: page.showcustgst,
                sett_desc: 'Show Cust GST',
                sett_key: 'ENABLE_CUST_GST',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkCustGST").prop("checked")) {
                data24.value_1 = "true";
            } else {
                data24.value_1 = "false";
            }
            $$("msgPanel").flash("Updating show cust GST...");
            page.settService.updateSetting(data24, function () {
                $$("msgPanel").flash("Show cust GST updated...!");
            });
            var data25 = {
                sett_no: page.taxinclusive,
                sett_desc: 'Enable Tax Inclusive',
                sett_key: 'ENABLE_TAX_INCLUSIVE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableTaxInsive").prop("checked")) {
                data25.value_1 = "true";
            } else {
                data25.value_1 = "false";
            }
            $$("msgPanel").flash("Updating tax inclusive...");
            page.settService.updateSetting(data25, function () {
                $$("msgPanel").flash("Tax inclusive updated...!");
            });
            var data26 = {
                sett_no: page.expiryalert,
                sett_desc: 'Expiry Alert',
                sett_key: 'ENABLE_EXP_ALERT',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkExpiryAlert").prop("checked")) {
                data26.value_1 = "true";
            } else {
                data26.value_1 = "false";
            }
            $$("msgPanel").flash("Updating expiry alert...");
            page.settService.updateSetting(data26, function () {
                $$("msgPanel").flash("Expiry alert updated...!");
                page.afterapply();
            });
            var data27 = {
                sett_no: page.billadjustment,
                sett_desc: 'Bill Adjustment',
                sett_key: 'ENABLE_BILL_ADJUSTMENT',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkBillAdjustment").prop("checked")) {
                data27.value_1 = "true";
            } else {
                data27.value_1 = "false";
            }
            $$("msgPanel").flash("Updating expiry alert...");
            page.settService.updateSetting(data27, function () {
                $$("msgPanel").flash("Expiry alert updated...!");
                page.afterapply();
            });
            var data38 = {
                sett_no: page.producttype,
                sett_desc: 'ENABLE_PRODUCT_TYPE',
                sett_key: 'ENABLE_PRODUCT_TYPE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkProductType").prop("checked")) {
                data38.value_1 = "true";
            } else {
                data38.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Product Type...");
            page.settService.updateSetting(data38, function () {
                $$("msgPanel").flash("Product Type updated...!");
                page.afterapply();
            });
            var data39 = {
                sett_no: page.enablemanufacture,
                sett_desc: 'ENABLE_MANUFACTURE',
                sett_key: 'ENABLE_MANUFACTURE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableManufacture").prop("checked")) {
                data39.value_1 = "true";
            } else {
                data39.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Manufacture...");
            page.settService.updateSetting(data39, function () {
                $$("msgPanel").flash("Manufacture updated...!");
                page.afterapply();
            });
            var data40 = {
                sett_no: page.enablealternateunit,
                sett_desc: 'ENABLE_ALTER_UNIT',
                sett_key: 'ENABLE_ALTER_UNIT',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkAlternateUnit").prop("checked")) {
                data40.value_1 = "true";
            } else {
                data40.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Alternate Unit...");
            page.settService.updateSetting(data40, function () {
                $$("msgPanel").flash("Alternate Unit updated...!");
                page.afterapply();
            });
            var data41 = {
                sett_no: page.enablestockmain,
                sett_desc: 'ENABLE_STOCK_MAINTAINENCE',
                sett_key: 'ENABLE_STOCK_MAINTAINENCE',
                //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkStockMaintainence").prop("checked")) {
                data41.value_1 = "true";
            } else {
                data41.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Alternate Unit...");
            page.settService.updateSetting(data41, function () {
                $$("msgPanel").flash("Alternate Unit updated...!");
                page.afterapply();
            });
            var data42 = {
                sett_no: page.SellingPriceEditable,
                sett_desc: 'SellingPriceEditable',
                sett_key: 'SELLING_PRICE_EDITABLE',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkSellingPriceEdit").prop("checked")) {
                data42.value_1 = "true";
            } else {
                data42.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Alternate Unit...");
            page.settService.updateSetting(data42, function () {
                $$("msgPanel").flash("Alternate Unit updated...!");
                page.afterapply();
            });
            var data43 = {
                sett_no: page.enablefree,
                sett_desc: 'SHOW_FREE',
                sett_key: 'SHOW_FREE',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableFree").prop("checked")) {
                data43.value_1 = "true";
            } else {
                data43.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Alternate Unit...");
            page.settService.updateSetting(data43, function () {
                $$("msgPanel").flash("Alternate Unit updated...!");
                page.afterapply();
            });
            var data44 = {
                sett_no: page.enablerack,
                sett_desc: 'ENABLE_RACK',
                sett_key: 'ENABLE_RACK',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableRack").prop("checked")) {
                data44.value_1 = "true";
            } else {
                data44.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Rack...");
            page.settService.updateSetting(data44, function () {
                $$("msgPanel").flash("Rack updated...!");
                page.afterapply();
            });
            var data45 = {
                sett_no: page.enablesecondbill,
                sett_desc: 'ENABLE_SECOND_BILL',
                sett_key: 'ENABLE_SECOND_BILL',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableSecondBill").prop("checked")) {
                data45.value_1 = "true";
            } else {
                data45.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Second Bill...");
            page.settService.updateSetting(data45, function () {
                $$("msgPanel").flash("Second Bill updated...!");
                page.afterapply();
            });
            var data46 = {
                sett_no: page.enablevariation,
                sett_desc: 'ENABLE_VARIATION',
                sett_key: 'ENABLE_VARIATION',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableVariation").prop("checked")) {
                data46.value_1 = "true";
            } else {
                data46.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Variation...");
            page.settService.updateSetting(data46, function () {
                $$("msgPanel").flash("Variation updated...!");
                page.afterapply();
            });
            var data47 = {
                sett_no: page.enablesalesexecutive,
                sett_desc: 'ENABLE_SALES_EXECUTIVE',
                sett_key: 'ENABLE_SALES_EXECUTIVE',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableSalesExecutive").prop("checked")) {
                data47.value_1 = "true";
            } else {
                data47.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Executive...");
            page.settService.updateSetting(data47, function () {
                $$("msgPanel").flash("Sales Executive updated...!");
                page.afterapply();
            });
            var data48 = {
                sett_no: page.enablehsncode,
                sett_desc: 'ENABLE_HSN_CODE',
                sett_key: 'ENABLE_HSN_CODE',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableHsnCode").prop("checked")) {
                data48.value_1 = "true";
            } else {
                data48.value_1 = "false";
            }
            $$("msgPanel").flash("Updating HSN Code...");
            page.settService.updateSetting(data48, function () {
                $$("msgPanel").flash("HSN Code updated...!");
                page.afterapply();
            });
            var data49 = {
                sett_no: page.showbarcode,
                sett_desc: 'ShowBarCode',
                sett_key: 'SHOW_BARCODE',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkShowBarCode").prop("checked")) {
                data49.value_1 = "true";
            } else {
                data49.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Bar Code...");
            page.settService.updateSetting(data49, function () {
                $$("msgPanel").flash("Bar Code updated...!");
                page.afterapply();
            });
            var data50 = {
                sett_no: page.showpowisereport,
                sett_desc: 'ENABLE_POWISE_REPORT',
                sett_key: 'ENABLE_POWISE_REPORT',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkPowiseReport").prop("checked")) {
                data50.value_1 = "true";
            } else {
                data50.value_1 = "false";
            }
            $$("msgPanel").flash("Updating PO Wise Report...");
            page.settService.updateSetting(data50, function () {
                $$("msgPanel").flash("PO Wise Report updated...!");
                page.afterapply();
            });
            var data51 = {
                sett_no: page.showsowisereport,
                sett_desc: 'ENABLE_SOWISE_REPORT',
                sett_key: 'ENABLE_SOWISE_REPORT',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkSowiseReport").prop("checked")) {
                data51.value_1 = "true";
            } else {
                data51.value_1 = "false";
            }
            $$("msgPanel").flash("Updating SO Wise Report...");
            page.settService.updateSetting(data51, function () {
                $$("msgPanel").flash("SO Wise Report updated...!");
                page.afterapply();
            });
            var data52 = {
                sett_no: page.enablestockalert,
                sett_desc: 'ENABLE_STOCK_ALERT',
                sett_key: 'ENABLE_STOCK_ALERT',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkEnableStockAlert").prop("checked")) {
                data52.value_1 = "true";
            } else {
                data52.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Stock Alert...");
            page.settService.updateSetting(data52, function () {
                $$("msgPanel").flash("Stock Alert updated...!");
                page.afterapply();
            });
            var data53 = {
                sett_no: page.enablecancelbill,
                sett_desc: 'ENABLE_CANCEL_BILL',
                sett_key: 'ENABLE_CANCEL_BILL',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkCancelBill").prop("checked")) {
                data53.value_1 = "true";
            } else {
                data53.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Cancel Bill...");
            page.settService.updateSetting(data53, function () {
                $$("msgPanel").flash("Cancel Bill updated...!");
                page.afterapply();
            });
            var data54 = {
                sett_no: page.enablecashbill,
                sett_desc: 'ENABLE_CASHIER_BILL',
                sett_key: 'ENABLE_CASHIER_BILL',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkCashBill").prop("checked")) {
                data54.value_1 = "true";
            } else {
                data54.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Cash Bill...");
            page.settService.updateSetting(data54, function () {
                $$("msgPanel").flash("Cash Bill updated...!");
                page.afterapply();
            });
            var data55 = {
                sett_no: page.enableitemdescription,
                sett_desc: 'ENABLE_ITEM_DESCRIPTION',
                sett_key: 'ENABLE_ITEM_DESCRIPTION',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkItemDescription").prop("checked")) {
                data55.value_1 = "true";
            } else {
                data55.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Item Desciption...");
            page.settService.updateSetting(data55, function () {
                $$("msgPanel").flash("Item Desciption updated...!");
                page.afterapply();
            });
            var data56 = {
                sett_no: page.enableinventorydetails,
                sett_desc: 'ENABLE_INVENTORY_DETAILS',
                sett_key: 'ENABLE_INVENTORY_DETAILS',
                value_2: "Modules",
                value_3: "Checkbox",
            }
            if ($$("chkInventoryDetails").prop("checked")) {
                data56.value_1 = "true";
            } else {
                data56.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Item Desciption...");
            page.settService.updateSetting(data56, function () {
                $$("msgPanel").flash("Item Desciption updated...!");
                page.afterapply();
            });
            var data8 = {
                sett_no: page.enablesalesexecutivereward,
                sett_desc: 'ENABLE_SALES_EXECUTIVE_REWARD',
                sett_key: 'ENABLE_SALES_EXECUTIVE_REWARD',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesExecutiveReward").prop("checked")) {
                data8.value_1 = "true";
            } else {
                data8.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Executive Reward ...");
            page.settService.updateSetting(data8, function () {
                $$("msgPanel").flash("Sales Executive Reward Updated...!");
                page.afterapply();
            });
            var data8a = {
                sett_no: page.chkPincodeMapping,
                sett_desc: 'ENABLE_PINCODE_MAPPING',
                sett_key: 'ENABLE_PINCODE_MAPPING',
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkPincodeMapping").prop("checked")) {
                data8a.value_1 = "true";
            } else {
                data8a.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Pincode Mapping ...");
            page.settService.updateSetting(data8a, function () {
                $$("msgPanel").flash("Pincode Mapping Updated...!");
                var data9 = {
                    sett_no: page.chkShowQRCode,
                    sett_desc: 'ENABLE_QR_CODE',
                    sett_key: 'ENABLE_QR_CODE',
                    value_2: "Sale",
                    value_3: "Checkbox",
                }
                if ($$("chkShowQRCode").prop("checked")) {
                    data9.value_1 = "true";
                } else {
                    data9.value_1 = "false";
                }
                $$("msgPanel").flash("Updating QR Code ...");
                page.settService.updateSetting(data9, function () {
                    $$("msgPanel").flash("QR Code Updated...!");
                    var data10 = {
                        sett_no: page.chkStockMaintain,
                        sett_desc: 'ENABLE_STOCK_MAINTANENCE',
                        sett_key: 'ENABLE_STOCK_MAINTANENCE',
                        value_2: "Modules",
                        value_3: "Checkbox",
                    }
                    if ($$("chkStockMaintain").prop("checked")) {
                        data10.value_1 = "true";
                    } else {
                        data10.value_1 = "false";
                    }
                    $$("msgPanel").flash("Updating Stock Maintainence ...");
                    page.settService.updateSetting(data10, function () {
                        $$("msgPanel").flash("Stock Maintainence Updated...!");
                        var data10 = {
                            sett_no: page.chkEnableSubscription,
                            sett_desc: 'ENABLE_SUBSCRIPTION',
                            sett_key: 'ENABLE_SUBSCRIPTION',
                            value_2: "Modules",
                            value_3: "Checkbox",
                        }
                        if ($$("chkEnableSubscription").prop("checked")) {
                            data10.value_1 = "true";
                        } else {
                            data10.value_1 = "false";
                        }
                        $$("msgPanel").flash("Updating Subscription ...");
                        page.settService.updateSetting(data10, function () {
                            $$("msgPanel").flash("Subscription Updated...!");
                            var data10 = {
                                sett_no: page.txtDefaultBillDueDays,
                                sett_desc: 'DEFAULT_BILL_DUE_DAYS',
                                sett_key: 'DEFAULT_BILL_DUE_DAYS',
                                value_1: $$("txtDefaultBillDueDays").value(),
                                value_2: "Modules",
                                value_3: "Text",
                            }
                            $$("msgPanel").flash("Updating Default Due Days ...");
                            page.settService.updateSetting(data10, function () {
                                $$("msgPanel").flash("Default Due Days Updated...!");
                                var data10 = {
                                    sett_no: page.chkEnableCustomerLogin,
                                    sett_desc: 'ENABLE_CUSTOMER_LOGIN',
                                    sett_key: 'ENABLE_CUSTOMER_LOGIN',
                                    value_2: "Modules",
                                    value_3: "Checkbox",
                                }
                                if ($$("chkEnableCustomerLogin").prop("checked")) {
                                    data10.value_1 = "true";
                                } else {
                                    data10.value_1 = "false";
                                }
                                $$("msgPanel").flash("Updating Customer Login ...");
                                page.settService.updateSetting(data10, function () {
                                    $$("msgPanel").flash("Customer Login Updated...!");
                                    var data10 = {
                                        sett_no: page.chkEnableSalesExecutiveLogin,
                                        sett_desc: 'ENABLE_SALES_EXECUTIVE_LOGIN',
                                        sett_key: 'ENABLE_SALES_EXECUTIVE_LOGIN',
                                        value_2: "Modules",
                                        value_3: "Checkbox",
                                    }
                                    if ($$("chkEnableSalesExecutiveLogin").prop("checked")) {
                                        data10.value_1 = "true";
                                    } else {
                                        data10.value_1 = "false";
                                    }
                                    $$("msgPanel").flash("Updating Sales Executive Login ...");
                                    page.settService.updateSetting(data10, function () {
                                        $$("msgPanel").flash("Sales Executive Login Updated...!");
                                        var data10 = {
                                            sett_no: page.chkEnableCashierBarcode,
                                            sett_desc: 'ENABLE_CASHIER_BARCODE',
                                            sett_key: 'ENABLE_CASHIER_BARCODE',
                                            value_2: "Modules",
                                            value_3: "Checkbox",
                                        }
                                        if ($$("chkEnableCashierBarcode").prop("checked")) {
                                            data10.value_1 = "true";
                                        } else {
                                            data10.value_1 = "false";
                                        }
                                        $$("msgPanel").flash("Updating Cashier Barcode ...");
                                        page.settService.updateSetting(data10, function () {
                                            $$("msgPanel").flash("Cashier Barcode Updated...!");
                                            var data10 = {
                                                sett_no: page.chkEnableCustomerBankDetails,
                                                sett_desc: 'ENABLE_CUSTOMER_BANK_DETAILS',
                                                sett_key: 'ENABLE_CUSTOMER_BANK_DETAILS',
                                                value_2: "Modules",
                                                value_3: "Checkbox",
                                            }
                                            if ($$("chkEnableCustomerBankDetails").prop("checked")) {
                                                data10.value_1 = "true";
                                            } else {
                                                data10.value_1 = "false";
                                            }
                                            $$("msgPanel").flash("Updating Customer Bank Deatils ...");
                                            page.settService.updateSetting(data10, function () {
                                                $$("msgPanel").flash("Customer Bank Deatils Updated...!");
                                                var data10 = {
                                                    sett_no: page.chkEnableExecutiveBankDetails,
                                                    sett_desc: 'ENABLE_EXECUTIVE_BANK_DETAILS',
                                                    sett_key: 'ENABLE_EXECUTIVE_BANK_DETAILS',
                                                    value_2: "Modules",
                                                    value_3: "Checkbox",
                                                }
                                                if ($$("chkEnableExecutiveBankDetails").prop("checked")) {
                                                    data10.value_1 = "true";
                                                } else {
                                                    data10.value_1 = "false";
                                                }
                                                $$("msgPanel").flash("Updating Executive Bank Deatils ...");
                                                page.settService.updateSetting(data10, function () {
                                                    $$("msgPanel").flash("Executive Bank Deatils Updated...!");
                                                    var data10 = {
                                                        sett_no: page.chkEnableDueDateAlert,
                                                        sett_desc: 'ENABLE_DUE_DATE_ALERT',
                                                        sett_key: 'ENABLE_DUE_DATE_ALERT',
                                                        value_2: "Modules",
                                                        value_3: "Checkbox",
                                                    }
                                                    if ($$("chkEnableDueDateAlert").prop("checked")) {
                                                        data10.value_1 = "true";
                                                    } else {
                                                        data10.value_1 = "false";
                                                    }
                                                    $$("msgPanel").flash("Updating Executive Bank Deatils ...");
                                                    page.settService.updateSetting(data10, function () {
                                                        $$("msgPanel").flash("Executive Bank Deatils Updated...!");
                                                        var data11 = {
                                                            sett_no: page.chkEnableCustomerMobile,
                                                            sett_desc: 'ENABLE_CUSTOMER_MOBILE',
                                                            sett_key: 'ENABLE_CUSTOMER_MOBILE',
                                                            value_2: "Modules",
                                                            value_3: "Checkbox",
                                                        }
                                                        if ($$("chkEnableCustomerMobile").prop("checked")) {
                                                            data11.value_1 = "true";
                                                        } else {
                                                            data11.value_1 = "false";
                                                        }
                                                        $$("msgPanel").flash("Updating Customer Mobile...");
                                                        page.settService.updateSetting(data11, function () {
                                                            $$("msgPanel").flash("Customer Mobile Updated...!");
                                                            var data12 = {
                                                                sett_no: page.chkEnableDynamicBarcode,
                                                                sett_desc: 'ENABLE_DYNAMIC_BARCODE',
                                                                sett_key: 'ENABLE_DYNAMIC_BARCODE',
                                                                value_2: "Modules",
                                                                value_3: "Checkbox",
                                                            }
                                                            if ($$("chkEnableDynamicBarcode").prop("checked")) {
                                                                data12.value_1 = "true";
                                                            } else {
                                                                data12.value_1 = "false";
                                                            }
                                                            $$("msgPanel").flash("Updating Dynamic Barcode...");
                                                            page.settService.updateSetting(data12, function () {
                                                                $$("msgPanel").flash("Dynamic Barcode Updated...!");
                                                                var data13 = {
                                                                    sett_no: page.ddlItemSelectionMode,
                                                                    sett_desc: 'ITEM_SELECTION_MODE',
                                                                    sett_key: 'ITEM_SELECTION_MODE',
                                                                    value_1: $$("ddlItemSelectionMode").selectedValue(),
                                                                    value_2: "Modules",
                                                                    value_3: "DropDown",
                                                                }
                                                                $$("msgPanel").flash("Updating Item Selection Mode...");
                                                                page.settService.updateSetting(data13, function () {
                                                                    $$("msgPanel").flash("Item Selection Mode Updated...!");
                                                                    var data14 = {
                                                                        sett_no: page.chkEnableDCBill,
                                                                        sett_desc: 'ENABLE_DC_BILL',
                                                                        sett_key: 'ENABLE_DC_BILL',
                                                                        value_2: "Modules",
                                                                        value_3: "Checkbox",
                                                                    }
                                                                    if ($$("chkEnableDCBill").prop("checked")) {
                                                                        data14.value_1 = "true";
                                                                    } else {
                                                                        data14.value_1 = "false";
                                                                    }
                                                                    page.settService.updateSetting(data14, function () {
                                                                        $$("msgPanel").flash("Updated DC Bill...");
                                                                        var data15 = {
                                                                            sett_no: page.chkCustomerInBill,
                                                                            sett_desc: 'ENABLE_CUSTOMER_IN_BILL',
                                                                            sett_key: 'ENABLE_CUSTOMER_IN_BILL',
                                                                            value_2: "Modules",
                                                                            value_3: "Checkbox",
                                                                        }
                                                                        if ($$("chkCustomerInBill").prop("checked")) {
                                                                            data15.value_1 = "true";
                                                                        } else {
                                                                            data15.value_1 = "false";
                                                                        }
                                                                        page.settService.updateSetting(data15, function () {
                                                                            $$("msgPanel").flash("Mantatory Customer Bill Updated...");
                                                                            var data16 = {
                                                                                sett_no: page.chkVendorInBill,
                                                                                sett_desc: 'ENABLE_VENDOR_IN_BILL',
                                                                                sett_key: 'ENABLE_VENDOR_IN_BILL',
                                                                                value_2: "Modules",
                                                                                value_3: "Checkbox",
                                                                            }
                                                                            if ($$("chkVendorInBill").prop("checked")) {
                                                                                data16.value_1 = "true";
                                                                            } else {
                                                                                data16.value_1 = "false";
                                                                            }
                                                                            page.settService.updateSetting(data16, function () {
                                                                                $$("msgPanel").flash("Mantatory Supplier Bill Updated...");
                                                                                var data17 = {
                                                                                    sett_no: page.chkAttributeSearch,
                                                                                    sett_desc: 'ATTRIBUTES_SEARCH',
                                                                                    sett_key: 'ATTRIBUTES_SEARCH',
                                                                                    value_2: "Modules",
                                                                                    value_3: "Checkbox",
                                                                                }
                                                                                if ($$("chkAttributeSearch").prop("checked")) {
                                                                                    data17.value_1 = "true";
                                                                                } else {
                                                                                    data17.value_1 = "false";
                                                                                }
                                                                                page.settService.updateSetting(data17, function () {
                                                                                    $$("msgPanel").flash("Attribute Search Updated...");
                                                                                    var data18 = {
                                                                                        sett_no: page.chkCreditDebitNote,
                                                                                        sett_desc: 'CREDIT_DEBIT_NOTE',
                                                                                        sett_key: 'CREDIT_DEBIT_NOTE',
                                                                                        value_2: "Modules",
                                                                                        value_3: "Checkbox",
                                                                                    }
                                                                                    if ($$("chkCreditDebitNote").prop("checked")) {
                                                                                        data18.value_1 = "true";
                                                                                    } else {
                                                                                        data18.value_1 = "false";
                                                                                    }
                                                                                    page.settService.updateSetting(data18, function () {
                                                                                        $$("msgPanel").flash("Credit Debit Note Updated...");
                                                                                        var data19 = {
                                                                                            sett_no: page.chkSecondaryLanguage,
                                                                                            sett_desc: 'ENABLE_SECONDARY_LANGUAGE',
                                                                                            sett_key: 'ENABLE_SECONDARY_LANGUAGE',
                                                                                            value_2: "Modules",
                                                                                            value_3: "Checkbox",
                                                                                        }
                                                                                        if ($$("chkSecondaryLanguage").prop("checked")) {
                                                                                            data19.value_1 = "true";
                                                                                        } else {
                                                                                            data19.value_1 = "false";
                                                                                        }
                                                                                        page.settService.updateSetting(data19, function () {
                                                                                            $$("msgPanel").flash("Secondary Language Updated...");
                                                                                            var data20 = {
                                                                                                sett_no: page.chkItemPackage,
                                                                                                sett_desc: 'PACKAGE',
                                                                                                sett_key: 'PACKAGE',
                                                                                                value_2: "Modules",
                                                                                                value_3: "Checkbox",
                                                                                            }
                                                                                            if ($$("chkItemPackage").prop("checked")) {
                                                                                                data20.value_1 = "true";
                                                                                            } else {
                                                                                                data20.value_1 = "false";
                                                                                            }
                                                                                            page.settService.updateSetting(data20, function () {
                                                                                                $$("msgPanel").flash("Item Package Updated...");
                                                                                                var data20 = {
                                                                                                    sett_no: page.chkPriceLimit,
                                                                                                    sett_desc: 'ENABLE_PRICE_LIMIT',
                                                                                                    sett_key: 'ENABLE_PRICE_LIMIT',
                                                                                                    value_2: "Modules",
                                                                                                    value_3: "Checkbox",
                                                                                                }
                                                                                                if ($$("chkPriceLimit").prop("checked")) {
                                                                                                    data20.value_1 = "true";
                                                                                                } else {
                                                                                                    data20.value_1 = "false";
                                                                                                }
                                                                                                page.settService.updateSetting(data20, function () {
                                                                                                    $$("msgPanel").flash("Price Limit Updated...");
                                                                                                    var data21 = {
                                                                                                        sett_no: page.chkAdditionalTax,
                                                                                                        sett_desc: 'ENABLE_ADDITIONAL_TAX',
                                                                                                        sett_key: 'ENABLE_ADDITIONAL_TAX',
                                                                                                        value_2: "Modules",
                                                                                                        value_3: "Checkbox",
                                                                                                    }
                                                                                                    if ($$("chkAdditionalTax").prop("checked")) {
                                                                                                        data21.value_1 = "true";
                                                                                                    } else {
                                                                                                        data21.value_1 = "false";
                                                                                                    }
                                                                                                    page.settService.updateSetting(data21, function () {
                                                                                                        $$("msgPanel").flash("Additional Tax Updated...");
                                                                                                        var data22 = {
                                                                                                            sett_no: page.chkPosSerialNo,
                                                                                                            sett_desc: 'ENABLE_SERIAL_NO_IN_POS',
                                                                                                            sett_key: 'ENABLE_SERIAL_NO_IN_POS',
                                                                                                            value_2: "Modules",
                                                                                                            value_3: "Checkbox",
                                                                                                        }
                                                                                                        if ($$("chkPosSerialNo").prop("checked")) {
                                                                                                            data22.value_1 = "true";
                                                                                                        } else {
                                                                                                            data22.value_1 = "false";
                                                                                                        }
                                                                                                        page.settService.updateSetting(data22, function () {
                                                                                                            $$("msgPanel").flash("Additional Tax Updated...");
                                                                                                            var data23 = {
                                                                                                                sett_no: page.chkPosItemNotes,
                                                                                                                sett_desc: 'ENABLE_ITEM_NOTES_IN_POS',
                                                                                                                sett_key: 'ENABLE_ITEM_NOTES_IN_POS',
                                                                                                                value_2: "Modules",
                                                                                                                value_3: "Checkbox",
                                                                                                            }
                                                                                                            if ($$("chkPosItemNotes").prop("checked")) {
                                                                                                                data23.value_1 = "true";
                                                                                                            } else {
                                                                                                                data23.value_1 = "false";
                                                                                                            }
                                                                                                            page.settService.updateSetting(data23, function () {
                                                                                                                $$("msgPanel").flash("Item Notes Updated...");
                                                                                                                var data23 = {
                                                                                                                    sett_no: page.chkCreateDefaultPrice,
                                                                                                                    sett_desc: 'ENABLE_CREATE_DEFAULT_PRICE',
                                                                                                                    sett_key: 'ENABLE_CREATE_DEFAULT_PRICE',
                                                                                                                    value_2: "Modules",
                                                                                                                    value_3: "Checkbox",
                                                                                                                }
                                                                                                                if ($$("chkCreateDefaultPrice").prop("checked")) {
                                                                                                                    data23.value_1 = "true";
                                                                                                                } else {
                                                                                                                    data23.value_1 = "false";
                                                                                                                }
                                                                                                                page.settService.updateSetting(data23, function () {
                                                                                                                    $$("msgPanel").flash("Default Price Updated...");
                                                                                                                    var data23 = {
                                                                                                                        sett_no: page.chkEnableEshoponUpload,
                                                                                                                        sett_desc: 'ENABLE_ESHOPON_UPLOAD',
                                                                                                                        sett_key: 'ENABLE_ESHOPON_UPLOAD',
                                                                                                                        value_2: "Modules",
                                                                                                                        value_3: "Checkbox",
                                                                                                                    }
                                                                                                                    if ($$("chkEnableEshoponUpload").prop("checked")) {
                                                                                                                        data23.value_1 = "true";
                                                                                                                    } else {
                                                                                                                        data23.value_1 = "false";
                                                                                                                    }
                                                                                                                    page.settService.updateSetting(data23, function () {
                                                                                                                        $$("msgPanel").flash("Eshopon Data Updated...");
                                                                                                                        var data23 = {
                                                                                                                            sett_no: page.chkEnableExcelUpload,
                                                                                                                            sett_desc: 'ENABLE_EXCEL_UPLOAD',
                                                                                                                            sett_key: 'ENABLE_EXCEL_UPLOAD',
                                                                                                                            value_2: "Modules",
                                                                                                                            value_3: "Checkbox",
                                                                                                                        }
                                                                                                                        if ($$("chkEnableExcelUpload").prop("checked")) {
                                                                                                                            data23.value_1 = "true";
                                                                                                                        } else {
                                                                                                                            data23.value_1 = "false";
                                                                                                                        }
                                                                                                                        page.settService.updateSetting(data23, function () {
                                                                                                                            $$("msgPanel").flash("Enable Excel Updated...");
                                                                                                                            var data23 = {
                                                                                                                                sett_no: page.chkMultipleImage,
                                                                                                                                sett_desc: 'ENABLE_MULTIPLE_IMAGE',
                                                                                                                                sett_key: 'ENABLE_MULTIPLE_IMAGE',
                                                                                                                                value_2: "Modules",
                                                                                                                                value_3: "Checkbox",
                                                                                                                            }
                                                                                                                            if ($$("chkMultipleImage").prop("checked")) {
                                                                                                                                data23.value_1 = "true";
                                                                                                                            } else {
                                                                                                                                data23.value_1 = "false";
                                                                                                                            }
                                                                                                                            page.settService.updateSetting(data23, function () {
                                                                                                                                $$("msgPanel").flash("Enable Multiple Image Updated...");
                                                                                                                                var data23 = {
                                                                                                                                    sett_no: page.chkItemClass,
                                                                                                                                    sett_desc: 'ENABLE_ITEM_CLASS',
                                                                                                                                    sett_key: 'ENABLE_ITEM_CLASS',
                                                                                                                                    value_2: "Modules",
                                                                                                                                    value_3: "Checkbox",
                                                                                                                                }
                                                                                                                                if ($$("chkItemClass").prop("checked")) {
                                                                                                                                    data23.value_1 = "true";
                                                                                                                                } else {
                                                                                                                                    data23.value_1 = "false";
                                                                                                                                }
                                                                                                                                page.settService.updateSetting(data23, function () {
                                                                                                                                    $$("msgPanel").flash("Enable Item Class Updated...");
                                                                                                                                    var data23 = {
                                                                                                                                        sett_no: page.chkDraftBill,
                                                                                                                                        sett_desc: 'ENABLE_DRAFT_BILL',
                                                                                                                                        sett_key: 'ENABLE_DRAFT_BILL',
                                                                                                                                        value_2: "Modules",
                                                                                                                                        value_3: "Checkbox",
                                                                                                                                    }
                                                                                                                                    if ($$("chkDraftBill").prop("checked")) {
                                                                                                                                        data23.value_1 = "true";
                                                                                                                                    } else {
                                                                                                                                        data23.value_1 = "false";
                                                                                                                                    }
                                                                                                                                    page.settService.updateSetting(data23, function () {
                                                                                                                                        $$("msgPanel").flash("Enable Draft Bill Updated...");
                                                                                                                                        var data23 = {
                                                                                                                                            sett_no: page.chkItemLevelPrice,
                                                                                                                                            sett_desc: 'ENABLE_ITEM_LEVEL_PRICE',
                                                                                                                                            sett_key: 'ENABLE_ITEM_LEVEL_PRICE',
                                                                                                                                            value_2: "Modules",
                                                                                                                                            value_3: "Checkbox",
                                                                                                                                        }
                                                                                                                                        if ($$("chkItemLevelPrice").prop("checked")) {
                                                                                                                                            data23.value_1 = "true";
                                                                                                                                        } else {
                                                                                                                                            data23.value_1 = "false";
                                                                                                                                        }
                                                                                                                                        page.settService.updateSetting(data23, function () {
                                                                                                                                            $$("msgPanel").flash("Enable Item Level Price Updated...");
                                                                                                                                            var data23 = {
                                                                                                                                                sett_no: page.chkVariationLevelPrice,
                                                                                                                                                sett_desc: 'ENABLE_VARIATION_LEVEL_PRICE',
                                                                                                                                                sett_key: 'ENABLE_VARIATION_LEVEL_PRICE',
                                                                                                                                                value_2: "Modules",
                                                                                                                                                value_3: "Checkbox",
                                                                                                                                            }
                                                                                                                                            if ($$("chkVariationLevelPrice").prop("checked")) {
                                                                                                                                                data23.value_1 = "true";
                                                                                                                                            } else {
                                                                                                                                                data23.value_1 = "false";
                                                                                                                                            }
                                                                                                                                            page.settService.updateSetting(data23, function () {
                                                                                                                                                $$("msgPanel").flash("Enable Variation Level Price Updated...");
                                                                                                                                                var data23 = {
                                                                                                                                                    sett_no: page.chkSubscriptionIpDetails,
                                                                                                                                                    sett_desc: 'ENABLE_SUBSCRIPTION_IP_DETAILS',
                                                                                                                                                    sett_key: 'ENABLE_SUBSCRIPTION_IP_DETAILS',
                                                                                                                                                    value_2: "Modules",
                                                                                                                                                    value_3: "Checkbox",
                                                                                                                                                }
                                                                                                                                                if ($$("chkSubscriptionIpDetails").prop("checked")) {
                                                                                                                                                    data23.value_1 = "true";
                                                                                                                                                } else {
                                                                                                                                                    data23.value_1 = "false";
                                                                                                                                                }
                                                                                                                                                page.settService.updateSetting(data23, function () {
                                                                                                                                                    $$("msgPanel").flash("Subscription IP Updated...");
                                                                                                                                                    var data23 = {
                                                                                                                                                        sett_no: page.chkSubscriptionLastMileDetails,
                                                                                                                                                        sett_desc: 'ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS',
                                                                                                                                                        sett_key: 'ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS',
                                                                                                                                                        value_2: "Modules",
                                                                                                                                                        value_3: "Checkbox",
                                                                                                                                                    }
                                                                                                                                                    if ($$("chkSubscriptionLastMileDetails").prop("checked")) {
                                                                                                                                                        data23.value_1 = "true";
                                                                                                                                                    } else {
                                                                                                                                                        data23.value_1 = "false";
                                                                                                                                                    }
                                                                                                                                                    page.settService.updateSetting(data23, function () {
                                                                                                                                                        $$("msgPanel").flash("Subscription Last Mile Updated...");
                                                                                                                                                        var data23 = {
                                                                                                                                                            sett_no: page.chkSubscriptionBillingDetails,
                                                                                                                                                            sett_desc: 'ENABLE_SUBSCRIPTION_BILLING_DETAILS',
                                                                                                                                                            sett_key: 'ENABLE_SUBSCRIPTION_BILLING_DETAILS',
                                                                                                                                                            value_2: "Modules",
                                                                                                                                                            value_3: "Checkbox",
                                                                                                                                                        }
                                                                                                                                                        if ($$("chkSubscriptionBillingDetails").prop("checked")) {
                                                                                                                                                            data23.value_1 = "true";
                                                                                                                                                        } else {
                                                                                                                                                            data23.value_1 = "false";
                                                                                                                                                        }
                                                                                                                                                        page.settService.updateSetting(data23, function () {
                                                                                                                                                            $$("msgPanel").flash("Subscription Billing Details Updated...");
                                                                                                                                                            var data23 = {
                                                                                                                                                                sett_no: page.chkSubscriptionInstallationAddress,
                                                                                                                                                                sett_desc: 'ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS',
                                                                                                                                                                sett_key: 'ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS',
                                                                                                                                                                value_2: "Modules",
                                                                                                                                                                value_3: "Checkbox",
                                                                                                                                                            }
                                                                                                                                                            if ($$("chkSubscriptionInstallationAddress").prop("checked")) {
                                                                                                                                                                data23.value_1 = "true";
                                                                                                                                                            } else {
                                                                                                                                                                data23.value_1 = "false";
                                                                                                                                                            }
                                                                                                                                                            page.settService.updateSetting(data23, function () {
                                                                                                                                                                $$("msgPanel").flash("Subscription Installation Address Updated...");
                                                                                                                                                                var data23 = {
                                                                                                                                                                    sett_no: page.chkNewItemInPos,
                                                                                                                                                                    sett_desc: 'ENABLE_NEW_ITEM_IN_POS',
                                                                                                                                                                    sett_key: 'ENABLE_NEW_ITEM_IN_POS',
                                                                                                                                                                    value_2: "Modules",
                                                                                                                                                                    value_3: "Checkbox",
                                                                                                                                                                }
                                                                                                                                                                if ($$("chkNewItemInPos").prop("checked")) {
                                                                                                                                                                    data23.value_1 = "true";
                                                                                                                                                                } else {
                                                                                                                                                                    data23.value_1 = "false";
                                                                                                                                                                }
                                                                                                                                                                page.settService.updateSetting(data23, function () {
                                                                                                                                                                    $$("msgPanel").flash("New Item In POS Updated...");
                                                                                                                                                                    var data23 = {
                                                                                                                                                                        sett_no: page.chkSKUInSales,
                                                                                                                                                                        sett_desc: 'SHOW_SKU_COLUMN_IN_SALES',
                                                                                                                                                                        sett_key: 'SHOW_SKU_COLUMN_IN_SALES',
                                                                                                                                                                        value_2: "Modules",
                                                                                                                                                                        value_3: "Checkbox",
                                                                                                                                                                    }
                                                                                                                                                                    if ($$("chkSKUInSales").prop("checked")) {
                                                                                                                                                                        data23.value_1 = "true";
                                                                                                                                                                    } else {
                                                                                                                                                                        data23.value_1 = "false";
                                                                                                                                                                    }
                                                                                                                                                                    page.settService.updateSetting(data23, function () {
                                                                                                                                                                        $$("msgPanel").flash("SKU In Sales Updated...");
                                                                                                                                                                        var data23 = {
                                                                                                                                                                            sett_no: page.chkShowCustomerCompanyInSales,
                                                                                                                                                                            sett_desc: 'SHOW_CUSTOMER_COMPANY_IN_SALES',
                                                                                                                                                                            sett_key: 'SHOW_CUSTOMER_COMPANY_IN_SALES',
                                                                                                                                                                            value_2: "Modules",
                                                                                                                                                                            value_3: "Checkbox",
                                                                                                                                                                        }
                                                                                                                                                                        if ($$("chkShowCustomerCompanyInSales").prop("checked")) {
                                                                                                                                                                            data23.value_1 = "true";
                                                                                                                                                                        } else {
                                                                                                                                                                            data23.value_1 = "false";
                                                                                                                                                                        }
                                                                                                                                                                        page.settService.updateSetting(data23, function () {
                                                                                                                                                                            $$("msgPanel").flash("Customer In Sales Updated...");
                                                                                                                                                                            var data23 = {
                                                                                                                                                                                sett_no: page.ddlSearchSKUMode,
                                                                                                                                                                                sett_desc: 'PURCHASE_SKU_SEARCH',
                                                                                                                                                                                sett_key: 'PURCHASE_SKU_SEARCH',
                                                                                                                                                                                value_2: "Modules",
                                                                                                                                                                                value_3: "Dropdown",
                                                                                                                                                                                value_1: $$("ddlSearchSKUMode").selectedValue()
                                                                                                                                                                            }
                                                                                                                                                                            page.settService.updateSetting(data23, function () {
                                                                                                                                                                                $$("msgPanel").flash("Purchase SKU Search Updated...");
                                                                                                                                                                                var data23 = {
                                                                                                                                                                                    sett_no: page.chkGlobalExpiryAlert,
                                                                                                                                                                                    sett_desc: 'ENABLE_GLOBAL_EXP_ALERT',
                                                                                                                                                                                    sett_key: 'ENABLE_GLOBAL_EXP_ALERT',
                                                                                                                                                                                    value_2: "Modules",
                                                                                                                                                                                    value_3: "Checkbox",
                                                                                                                                                                                }
                                                                                                                                                                                if ($$("chkGlobalExpiryAlert").prop("checked")) {
                                                                                                                                                                                    data23.value_1 = "true";
                                                                                                                                                                                } else {
                                                                                                                                                                                    data23.value_1 = "false";
                                                                                                                                                                                }
                                                                                                                                                                                page.settService.updateSetting(data23, function () {
                                                                                                                                                                                    $$("msgPanel").flash("Global Expiry Alert Updated...!!!");
                                                                                                                                                                                    var data23 = {
                                                                                                                                                                                        sett_no: page.txtCountDegitsAfterPoints,
                                                                                                                                                                                        sett_desc: 'COUNT_AFTER_POINTS',
                                                                                                                                                                                        sett_key: 'COUNT_AFTER_POINTS',
                                                                                                                                                                                        value_1:$$("txtCountDegitsAfterPoints").value(),
                                                                                                                                                                                        value_2: "Modules",
                                                                                                                                                                                        value_3: "Checkbox",
                                                                                                                                                                                    }
                                                                                                                                                                                    page.settService.updateSetting(data23, function () {
                                                                                                                                                                                        $$("msgPanel").flash("Count After Points Updated...!!!");
                                                                                                                                                                                        var data23 = {
                                                                                                                                                                                            sett_no: page.chkShowPOSFirstPanel,
                                                                                                                                                                                            sett_desc: 'POS_PENDING_SHOW_FIRST_PANEL',
                                                                                                                                                                                            sett_key: 'POS_PENDING_SHOW_FIRST_PANEL',
                                                                                                                                                                                            value_2: "Modules",
                                                                                                                                                                                            value_3: "Checkbox",
                                                                                                                                                                                        }
                                                                                                                                                                                        if ($$("chkShowPOSFirstPanel").prop("checked")) {
                                                                                                                                                                                            data23.value_1 = "true";
                                                                                                                                                                                        } else {
                                                                                                                                                                                            data23.value_1 = "false";
                                                                                                                                                                                        }
                                                                                                                                                                                        page.settService.updateSetting(data23, function () {
                                                                                                                                                                                            $$("msgPanel").flash("POS Pending First Panel Updated...!!!");
                                                                                                                                                                                            var data23 = {
                                                                                                                                                                                                sett_no: page.chkShowPOSSecondPanel,
                                                                                                                                                                                                sett_desc: 'POS_PENDING_SHOW_SECOND_PANEL',
                                                                                                                                                                                                sett_key: 'POS_PENDING_SHOW_SECOND_PANEL',
                                                                                                                                                                                                value_2: "Modules",
                                                                                                                                                                                                value_3: "Checkbox",
                                                                                                                                                                                            }
                                                                                                                                                                                            if ($$("chkShowPOSSecondPanel").prop("checked")) {
                                                                                                                                                                                                data23.value_1 = "true";
                                                                                                                                                                                            } else {
                                                                                                                                                                                                data23.value_1 = "false";
                                                                                                                                                                                            }
                                                                                                                                                                                            page.settService.updateSetting(data23, function () {
                                                                                                                                                                                                $$("msgPanel").flash("POS Pending Second Panel Updated...!!!");
                                                                                                                                                                                                var data23 = {
                                                                                                                                                                                                    sett_no: page.chkEnableRemove,
                                                                                                                                                                                                    sett_desc: 'ENABLE_REMOVE',
                                                                                                                                                                                                    sett_key: 'ENABLE_REMOVE',
                                                                                                                                                                                                    value_2: "Modules",
                                                                                                                                                                                                    value_3: "Checkbox",
                                                                                                                                                                                                }
                                                                                                                                                                                                if ($$("chkEnableRemove").prop("checked")) {
                                                                                                                                                                                                    data23.value_1 = "true";
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    data23.value_1 = "false";
                                                                                                                                                                                                }
                                                                                                                                                                                                page.settService.updateSetting(data23, function () {
                                                                                                                                                                                                    $$("msgPanel").flash("Remove Option Enabled Updated...!!!");
                                                                                                                                                                                                    page.afterapply();
                                                                                                                                                                                                });
                                                                                                                                                                                            });
                                                                                                                                                                                        });
                                                                                                                                                                                    });
                                                                                                                                                                                });
                                                                                                                                                                            });
                                                                                                                                                                        });
                                                                                                                                                                    });
                                                                                                                                                                });
                                                                                                                                                            });
                                                                                                                                                        });
                                                                                                                                                    });
                                                                                                                                                });
                                                                                                                                            });
                                                                                                                                        });
                                                                                                                                    });
                                                                                                                                });
                                                                                                                            });
                                                                                                                        });
                                                                                                                    });
                                                                                                                });
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            //var data55 = {
            //    sett_no: page.enablesalesexecutiverewards,
            //    sett_desc: 'ENABLE_SALES_EXECUTIVE_REWARD',
            //    sett_key: 'ENABLE_SALES_EXECUTIVE_REWARD',
            //    value_2: "Modules",
            //    value_3: "Checkbox",
            //}
            //if ($$("chkSalesExecutiveRewards").prop("checked")) {
            //    data55.value_1 = "true";
            //} else {
            //    data55.value_1 = "false";
            //}
            //$$("msgPanel").flash("Updating Sales Executive Rewards...");
            //page.settService.updateSetting(data55, function () {
            //    $$("msgPanel").flash("Sales Executive Rewards updated...!");
            //    page.afterapply();
            //});
            //var data23 = {
            //    sett_no: page.expirydaysmode,
            //    sett_desc: 'Expiry Days Modules',
            //    sett_key: 'ENABLE_EXP_DAYS_MODE',
            //    //value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
            //    value_2: "Modules",
            //    value_3: "Checkbox",
            //}
            //if ($$("chkExpiryDaysModules").prop("checked")) {
            //    data23.value_1 = "true";
            //} else {
            //    data23.value_1 = "false";
            //}
            //$$("msgPanel").flash("Updating expiry days modules...");
            //page.settService.updateSetting(data23, function () {
            //    $$("msgPanel").flash("Expiry days modules updated...!");
            //});
        }
        page.events.btnSaveComm_click = function () {
            page.saveComm();
        }
        page.saveComm = function () {
            //Updating Company Name
            var data1 = {
                sett_no: page.enable_receipt_print,
                sett_desc: 'Receipt',
                sett_key: 'ENABLE_RECEIPT_PRINT',
                //value_1: $$("ddlCompany").selectedValue(),
                value_2: "Communication",
                value_3: "Checkbox",
            }
            if ($$("chkReceipt").prop("checked")) {
                data1.value_1 = "true";
            } else {
                data1.value_1 = "false";
            }
            //$(".detail-info").progressBar("show")

            $$("msgPanel").show("Updating receipt...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").show("Receipt updated successfully...!");
            });
            //Period
            var data2 = {
                sett_no: page.enable_invoice_print,
                sett_desc: 'Invoice',
                sett_key: 'ENABLE_INVOICE_PRINT',
                //value_1: $$("ddlPeriod").selectedValue(),
                value_2: "Communication",
                value_3: "Checkbox",
            }
            if ($$("chkInvoice").prop("checked")) {
                data2.value_1 = "true";
            } else {
                data2.value_1 = "false";
            }
            $$("msgPanel").show("Updating invoice...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").show("Invoice Updated successfully...!");
            });
            //Sales Account Cash
            var data3 = {
                sett_no: page.enable_invoice_sms,
                sett_desc: 'SMS',
                sett_key: 'ENABLE_INVOCE_SMS',
                //value_1: $$("ddlSalesAccount").selectedValue(),
                value_2: "Communication",
                value_3: "Checkbox",
            }
            if ($$("chkSMS").prop("checked")) {
                data3.value_1 = "true";
            } else {
                data3.value_1 = "false";
            }
            $$("msgPanel").flash("Updating SMS...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("SMS Updated...!");
            });
            //Purchase Account Cash
            var data4 = {
                sett_no: page.enable_email,
                sett_desc: 'Email',
                sett_key: 'ENABLE_EMAIL',
                //value_1: $$("ddlPurchaseAccount").selectedValue(),
                value_2: "Communication",
                value_3: "Checkbox",
            }
            if ($$("chkEmail").prop("checked")) {
                data4.value_1 = "true";
            } else {
                data4.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Email...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Email updated...!");
            });
            var data4a = {
                sett_no: page.enable_jasper,
                sett_desc: 'Jasper',
                sett_key: 'ENABLE_JASPER',
                //value_1: $$("ddlPurchaseAccount").selectedValue(),
                value_2: "Communication",
                value_3: "Checkbox",
            }
            if ($$("chkJasper").prop("checked")) {
                data4a.value_1 = "true";
            } else {
                data4a.value_1 = "false";
            }
            $$("msgPanel").flash("Updating jasper...");
            page.settService.updateSetting(data4a, function () {
                $$("msgPanel").flash("Jasper updated...!");
            });
            var data4b = {
                sett_no: page.enable_image,
                sett_desc: 'Image',
                sett_key: 'ENABLE_IMAGE',
                //value_1: $$("ddlPurchaseAccount").selectedValue(),
                value_2: "Communication",
                value_3: "Checkbox",
            }
            if ($$("chkImage").prop("checked")) {
                data4b.value_1 = "true";
            } else {
                data4b.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Image...");
            page.settService.updateSetting(data4b, function () {
                $$("msgPanel").flash("Image updated...!");
            });
            var data5 = {
                sett_no: page.receipt_printer,
                sett_desc: 'Receipt Printer',
                sett_key: 'RECEIPT_PRINTER',
                value_1: $$("txtReciptPrinter").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating receipt printer...");
            page.settService.updateSetting(data5, function () {
                $$("msgPanel").flash("Receipt Printer Updated...!");
            });
            //Receipt Printer Name
            var data5a = {
                sett_no: page.receipt_printer_name,
                sett_desc: 'ReceiptPrinterName',
                sett_key: 'RECEIPT_PRINTER_NAME',
                value_1: $$("txtReciptPrinterName").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating receipt printer name...");
            page.settService.updateSetting(data5a, function () {
                $$("msgPanel").flash("Receipt Printer Name Updated...!");
            });
            var data5b = {
                sett_no: page.txtQRPrinterName,
                sett_desc: 'QR_PRINTER_NAME',
                sett_key: 'QR_PRINTER_NAME',
                value_1: $$("txtQRPrinterName").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating QR printer name...");
            page.settService.updateSetting(data5b, function () {
                $$("msgPanel").flash("QR Printer Name Updated...!");
            });
            //Purchase Account Bank
            var data6 = {
                sett_no: page.receipt_template,
                sett_desc: 'Receipt Template',
                sett_key: 'RECEIPT_TEMPLATE',
                value_1: $$("ddlReciptTemplate").selectedValue(),
                value_2: "Communication",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating receipt template...");
            page.settService.updateSetting(data6, function () {
                $$("msgPanel").flash("Purchase Packaging updated...!");
            });

            //Sales Account Reward
            var data7 = {
                sett_no: page.barcode_printer,
                sett_desc: 'Barcode Printer',
                sett_key: 'BARCODE_PRINTER',
                value_1: $$("txtBarcodePrinter").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating barcode printer...");
            page.settService.updateSetting(data7, function () {
                $$("msgPanel").flash("Touch POS Updated...!");
            });
            //Barcode Printer Name
            var data7a = {
                sett_no: page.barcode_printer_name,
                sett_desc: 'BarcodePrinterName',
                sett_key: 'BARCODE_PRINTER_NAME',
                value_1: $$("txtBarcodePrinterName").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating barcode printer name...");
            page.settService.updateSetting(data7a, function () {
                $$("msgPanel").flash("Barcode Printer Name Updated...!");
            });
            //Barcode Printer Name
            var data7b = {
                sett_no: page.txtBarcodePriceAlphabet,
                sett_desc: 'BarcodePriceName',
                sett_key: 'BARCODE_PRICE_ALPHABET',
                value_1: $$("txtBarcodePriceAlphabet").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating barcode printer Price...");
            page.settService.updateSetting(data7b, function () {
                $$("msgPanel").flash("Barcode Printer Price Updated...!");
            });
            //Purchase Account Reward
            var data8 = {
                sett_no: page.barcode_template,
                sett_desc: 'Barcode Template',
                sett_key: 'BARCODE_TEMPLATE',
                value_1: $$("ddlBarcodeTemplate").selectedValue(),
                value_2: "Communication",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating barcode template...");
            page.settService.updateSetting(data8, function () {
                $$("msgPanel").flash("Orders updated...!");
            });
            var data8a = {
                sett_no: page.ddlQrTemplate,
                sett_desc: 'QR Template',
                sett_key: 'QR_TEMPLATE',
                value_1: $$("ddlQrTemplate").selectedValue(),
                value_2: "Communication",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating Qr Code template...");
            page.settService.updateSetting(data8a, function () {
                $$("msgPanel").flash("Qr Code updated...!");
            });

            //Sales Account Coupon
            var data9 = {
                sett_no: page.invoice_printer,
                sett_desc: 'Invoice Printer',
                sett_key: 'INVOICE_PRINTER_URL',
                value_1: $$("txtInvoicePrinter").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating invoice printer...");
            page.settService.updateSetting(data9, function () {
                $$("msgPanel").flash("Marketing Updated...!");
            });
            //Purchase Account Coupon
            var data10 = {
                sett_no: page.invoice_template,
                sett_desc: 'Invoice Template',
                sett_key: 'INVOICE_TEMPLATE',
                value_1: $$("ddlInvoiceTemplate").selectedValue(),
                value_2: "Communication",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating invoice template...");
            page.settService.updateSetting(data10, function () {
                $$("msgPanel").flash("Multi Language updated...!");
            });
            var data11 = {
                sett_no: page.sms_gateway,
                sett_desc: 'SMS Gateway',
                sett_key: 'SMS_GATEWAY',
                value_1: $$("txtSGateWay").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating SMS Gateway...");
            page.settService.updateSetting(data11, function () {
                $$("msgPanel").flash("SMS Gateway updated...!");
            });
            var data12 = {
                sett_no: page.sms_user,
                sett_desc: 'SMS UserID',
                sett_key: 'SMS_USERID',
                value_1: $$("txtSUserId").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating SMS UserID...");
            page.settService.updateSetting(data12, function () {
                $$("msgPanel").flash("SMS UserID updated...!");
            });
            var data13 = {
                sett_no: page.sms_password,
                sett_desc: 'SMS Password',
                sett_key: 'SMS_PASSWORD',
                value_1: $$("txtSPassword").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating SMS Password...");
            page.settService.updateSetting(data13, function () {
                $$("msgPanel").flash("SMS Password updated...!");
            });
            var data13a = {
                sett_no: page.sms_url,
                sett_desc: 'SMS URL',
                sett_key: 'ENABLE_SMS_URL',
                value_1: $$("txtSSMSURL").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating SMS URL...");
            page.settService.updateSetting(data13a, function () {
                $$("msgPanel").flash("SMS URL updated...!");
            });
            var data13b = {
                sett_no: page.sms_cmp_id,
                sett_desc: 'SMSCompanyID',
                sett_key: 'SMS_COMPANY_ID',
                value_1: $$("txtSSMSCOMPID").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating SMS Company ID...");
            page.settService.updateSetting(data13b, function () {
                $$("msgPanel").flash("SMS Company ID updated...!");
            });
            var data13c = {
                sett_no: page.sms_send_no,
                sett_desc: 'SMSSendorNo',
                sett_key: 'SMS_SENDER_NO',
                value_1: $$("txtSSMSSENDERNO").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating SMS Sender No...");
            page.settService.updateSetting(data13c, function () {
                $$("msgPanel").flash("SMS Sender No updated...!");
            });
            var data14 = {
                sett_no: page.email_gateway,
                sett_desc: 'Email Gateway',
                sett_key: 'EMAIL_GATEWAY',
                value_1: $$("txtEGateWay").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating Email Gateway...");
            page.settService.updateSetting(data14, function () {
                $$("msgPanel").flash("Email Gateway updated...!");
            });
            var data15 = {
                sett_no: page.email_user,
                sett_desc: 'Email UserID',
                sett_key: 'EMAIL_USER_ID',
                value_1: $$("txtEUserId").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating Email UserID...");
            page.settService.updateSetting(data15, function () {
                $$("msgPanel").flash("Email UserID updated...!");
            });
            var data16 = {
                sett_no: page.email_password,
                sett_desc: 'Email Password',
                sett_key: 'EMAIL_PASSWORD',
                value_1: $$("txtEPassword").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating Email Password...");
            page.settService.updateSetting(data16, function () {
                $$("msgPanel").flash("Email Password updated...!");
            });
            var data17 = {
                sett_no: page.email_url,
                sett_desc: 'E-Mail URL',
                sett_key: 'ENABLE_EMAIL_URL',
                value_1: $$("txtEEMAILURL").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating Email URL...");
            page.settService.updateSetting(data17, function () {
                $$("msgPanel").flash("Email URL updated...!");
            });
            var data18 = {
                sett_no: page.imgupdurl,
                sett_desc: 'Image Upload URL',
                sett_key: 'ENABLE_IMAGE_UPLOAD_URL',
                value_1: $$("txtImgUpdURL").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating image upload url...");
            page.settService.updateSetting(data18, function () {
                $$("msgPanel").flash("Image upload url updated...!");
            });
            var data19 = {
                sett_no: page.imgfilepath,
                sett_desc: 'Image File Path',
                sett_key: 'ENABLE_IMAGE_FILE_PATH',
                value_1: $$("txtImgFilPath").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating image file path...");
            page.settService.updateSetting(data19, function () {
                $$("msgPanel").flash("Image file path updated...!");
            });
            var data20 = {
                sett_no: page.imgdndurl,
                sett_desc: 'Image Download URL',
                sett_key: 'ENABLE_IMAGE_DOWNLOAD_URL',
                value_1: $$("txtImgDnldURL").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating image download url...");
            page.settService.updateSetting(data20, function () {
                $$("msgPanel").flash("Image download url updated...!");
            });
            var data21 = {
                sett_no: page.imgdndpath,
                sett_desc: 'Image Download Path',
                sett_key: 'ENABLE_IMAGE_DOWNLOAD_PATH',
                value_1: $$("txtImgDnldPath").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating image download path...");
            page.settService.updateSetting(data21, function () {
                $$("msgPanel").flash("Image download path updated...!");
            });
            var data22 = {
                sett_no: page.reppath,
                sett_desc: 'REPORTPATH',
                sett_key: 'REPORT_PATH',
                value_1: $$("txtReportPath").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating report path...");
            page.settService.updateSetting(data22, function () {
                $$("msgPanel").flash("Report path updated...!");
            });
            var data23 = {
                sett_no: page.prtpersize,
                sett_desc: 'PRINTPAPERSIZE',
                sett_key: 'PRINT_PAPER_SIZE',
                value_1: $$("txtPrintPaperSize").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating print paper size...");
            page.settService.updateSetting(data23, function () {
                $$("msgPanel").flash("Image download path updated...!");
            });
            var data24 = {
                sett_no: page.jaspcmyname,
                sett_desc: 'JASPERCOMPANYNAME',
                sett_key: 'JASPER_COMPANY_NAME',
                value_1: $$("txtJaspCompName").val(),
                value_2: "Communication",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating image download path...");
            page.settService.updateSetting(data24, function () {
                $$("msgPanel").flash("Image download path updated...!");
                page.afterapply();
            });
        }
        //page.events.btnUploadImage_click = function () {
        //    var data = new FormData();

        //    var files = $("#fileUpload").get(0).files;

        //    // Add the uploaded image content to the form data collection
        //    if (files.length > 0) {
        //        data.append("file", files[0]);

        //        // Make Ajax request with the contentType = false, and procesDate = false
        //        var ajaxRequest = $.ajax({
        //            type: "POST",
        //            //url: "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
        //            url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
        //            headers: {
        //                //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
        //                //'file-path': "/opt/tomcat/webapps/images/upload/shopondev/"
        //                'file-path': CONTEXT.ImageFilePath //+ $$("lblItemNo").value() + '/'
        //                //'file-path': CONTEXT.REPORT_PATH
        //            },
        //            contentType: false,
        //            processData: false,
        //            data: data
        //        });

        //        ajaxRequest.done(function (xhr, textStatus) {
        //            //alert("Picture uploaded successfully.");
        //            $$("msgPanel").show("Picture uploaded successfully...!");
        //        });
        //    }
        //    else {
        //        //alert('Please select only the images before uploading it');
        //        $$("msgPanel").show("Please select only the images before uploading it");
        //    }
        //}
        page.events.btnSaveLayout_click = function () {
            //var x = $("#favcolor").val();
            //var y = x;
            page.saveLayout();
        }
        page.saveLayout = function () {
            var data1 = {
                sett_no: page.grd_head_font_size,
                sett_desc: 'Grid Header Font size',
                sett_key: 'GRID_HEADER_FONT',
                value_1: $$("txtGridHeaderFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating grid header font size...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").show("Grid header font size updated successfully...!");
            });
            //Period
            var data2 = {
                sett_no: page.font_size,
                sett_desc: 'Font Size',
                sett_key: 'FONT_SIZE',
                value_1: $$("txtFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating font size...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").show("Font size Updated successfully...!");
            });
            //Sales Account CashtxtInputFontsize
            var data3 = {
                sett_no: page.head_color,
                sett_desc: 'Heading Color',
                sett_key: 'HEADING_COLOR',
                value_1: $("#Headcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating heading color...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Heading color Updated...!");
            });
            //Purchase Account Cash
            var data4 = {
                sett_no: page.lab_color,
                sett_desc: 'label Background Color',
                sett_key: 'LABEL_COLOR',
                value_1: $("#LabBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating label background color...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Label background color updated...!");
            });

            //Sales Account Bank
            var data5 = {
                sett_no: page.prim_but_bg_color,
                sett_desc: 'primaryButton Background Color',
                sett_key: 'PRIMARY_READ_BUTTON',
                value_1: $("#PrimaryButtBGcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating primarybutton background color...");
            page.settService.updateSetting(data5, function () {
                $$("msgPanel").flash("Primarybutton background color Updated...!");
            });
            //Purchase Account Bank
            var data6 = {
                sett_no: page.sec_butt_bg_color,
                sett_desc: 'SecondaryButton BG color',
                sett_key: 'SECONDARY_BUTTON',
                value_1: $("#SecButtBGcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating secondarybutton background color...");
            page.settService.updateSetting(data6, function () {
                $$("msgPanel").flash("Secondarybutton background color updated...!");
            });

            //Sales Account Reward
            var data7 = {
                sett_no: page.grd_color,
                sett_desc: 'Grid Color',
                sett_key: 'GRID_COLOR',
                value_1: $("#Gridcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating grid color...");
            page.settService.updateSetting(data7, function () {
                $$("msgPanel").flash("Grid color Updated...!");
            });
            //Purchase Account Reward
            var data8 = {
                sett_no: page.txt_color,
                sett_desc: 'Text Color',
                sett_key: 'TEXT_COLOR',
                value_1: $("#Textcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating text color...");
            page.settService.updateSetting(data8, function () {
                $$("msgPanel").flash("Text color updated...!");
            });


            //Sales Account Coupon
            var data9 = {
                sett_no: page.input_color,
                sett_desc: 'Font Color For Textbox Drop down list',
                sett_key: 'INPUT_COLOR',
                value_1: $("#Inputcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating font color for textbox drop down list...");
            page.settService.updateSetting(data9, function () {
                $$("msgPanel").flash("Font color for textbox drop down list updated...!");
            });
            //Purchase Account Coupon
            var data10 = {
                sett_no: page.input_font,
                sett_desc: 'Font Size for Buttons. Labels Textbox',
                sett_key: 'INPUT_FONT',
                value_1: $$("txtInputFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating font size for buttons, labels textbox...");
            page.settService.updateSetting(data10, function () {
                $$("msgPanel").flash("Font size for buttons, labels and textbox updated...!");
            });
            var data11 = {
                sett_no: page.butt_font_color,
                sett_desc: 'Button Font Color',
                sett_key: 'INPUT_BUTTON_READ_COLOR',
                value_1: $("#InButReadcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating button font color...");
            page.settService.updateSetting(data11, function () {
                $$("msgPanel").flash("Button font color updated...!");
            });
            var data12 = {
                sett_no: page.butt_back_color,
                sett_desc: 'ButtonBackGround Color',
                sett_key: 'INPUT_BUTTON_READ_BG_COLOR',
                value_1: $("#InButBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating button background color...");
            page.settService.updateSetting(data12, function () {
                $$("msgPanel").flash("Button background color updated...!");
            });
            var data13 = {
                sett_no: page.butt_color_mouse_over,
                sett_desc: 'Button Color on Mouse Over',
                sett_key: 'INPUT_BUTTON_READ_HOVER_COLOR',
                value_1: $("#InButReadHovercolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating button color on mouse over...");
            page.settService.updateSetting(data13, function () {
                $$("msgPanel").flash("Button color on mouse over updated...!");
            });
            var data14 = {
                sett_no: page.right_butt_bg_color,
                sett_desc: 'Right Button Background Color',
                sett_key: 'INPUT_BUTTON_WRITE_COLOR',
                value_1: $("#InButWritecolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating right button background color...");
            page.settService.updateSetting(data14, function () {
                $$("msgPanel").flash("Right button background color updated...!");
            });
            var data15 = {
                sett_no: page.butt_font_color_mouse,
                sett_desc: 'Button Font Color on Mouse over',
                sett_key: 'INPUT_BUTTON_WRITE_BACK_COLOR',
                value_1: $("#InButWriteBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating button font color on mouse over...");
            page.settService.updateSetting(data15, function () {
                $$("msgPanel").flash("Button font color on mouse over updated...!");
            });
            var data16 = {
                sett_no: page.butt_write_hover_color,
                sett_desc: 'Right Button Background Color on Mouse Over',
                sett_key: 'INPUT_BUTTON_WRITE_HOVER_COLOR',
                value_1: $("#InButHovercolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating right button background color on mouse over...");
            page.settService.updateSetting(data16, function () {
                $$("msgPanel").flash("Right button background color on mouse over updated...!");
            });
            var data17 = {
                sett_no: page.input_butt_sec_color,
                sett_desc: 'Input Button Sec Color',
                sett_key: 'INPUT_BUTTON_SEC_COLOR',
                value_1: $("#InButSeccolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating Input button secondary color...");
            page.settService.updateSetting(data17, function () {
                $$("msgPanel").show("Input button secondary color updated...!");
            });
            //Period
            var data18 = {
                sett_no: page.input_butt_sec_back_color,
                sett_desc: 'Input Button Sec Back Color',
                sett_key: 'INPUT_BUTTON_SEC_BACK_COLOR',
                value_1: $("#InButSecBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating input button sec back color...");
            page.settService.updateSetting(data18, function () {
                $$("msgPanel").show("Input button sec back color Updated ...!");
            });
            //Sales Account Cash
            var data19 = {
                sett_no: page.butt_color,
                sett_desc: 'Button Color',
                sett_key: 'BUTTON_COLOR',
                value_1: $("#Buttoncolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating button color...");
            page.settService.updateSetting(data19, function () {
                $$("msgPanel").flash("Button color Updated...!");
            });
            //Purchase Account Cash
            var data20 = {
                sett_no: page.grd_row_font,
                sett_desc: 'Grid Row Font size',
                sett_key: 'GRID_ROW_FONT',
                value_1: $$("txtGridRowFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating grid row font size...");
            page.settService.updateSetting(data20, function () {
                $$("msgPanel").flash("Grid row font size updated...!");
            });

            //Sales Account Bank
            var data21 = {
                sett_no: page.tab_head_font,
                sett_desc: 'Tab Header Font Size',
                sett_key: 'TAB_HEADER_FONT',
                value_1: $$("txtTabHeadFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating tab header font size...");
            page.settService.updateSetting(data21, function () {
                $$("msgPanel").flash("Tab header font size Updated...!");
            });
            //Purchase Account Bank
            var data22 = {
                sett_no: page.tab_bg_color,
                sett_desc: 'Tab BackGround Color',
                sett_key: 'TAB_BACK_COLOR',
                value_1: $("#TabBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating tab background color...");
            page.settService.updateSetting(data22, function () {
                $$("msgPanel").flash("Tab background color updated...!");
            });

            //Sales Account Reward
            var data23 = {
                sett_no: page.tab_sel_color,
                sett_desc: 'Selected Tab Color',
                sett_key: 'TAB_SEL_COLOR',
                value_1: $("#SelectTabcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating selected tab color...");
            page.settService.updateSetting(data23, function () {
                $$("msgPanel").flash("Selected tab color Updated...!");
            });
            //Purchase Account Reward
            var data24 = {
                sett_no: page.tab_color,
                sett_desc: 'Tab Color',
                sett_key: 'TAB_COLOR',
                value_1: $("#Tabcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating tab color...");
            page.settService.updateSetting(data24, function () {
                $$("msgPanel").flash("Text color updated...!");
            });


            //Sales Account Coupon
            var data25 = {
                sett_no: page.lbl_font_size,
                sett_desc: 'Label Font size',
                sett_key: 'LABEL_FONT',
                value_1: $$("txtLabelFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating label font size...");
            page.settService.updateSetting(data25, function () {
                $$("msgPanel").flash("Label font size updated...!");
            });
            //Purchase Account Coupon
            var data26 = {
                sett_no: page.lbl_head_color,
                sett_desc: 'Label Header Color',
                sett_key: 'LABEL_HEADER_COLOR',
                value_1: $("#LabelHeadcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating label header color...");
            page.settService.updateSetting(data26, function () {
                $$("msgPanel").flash("Label header color updated...!");
            });
            var data27 = {
                sett_no: page.lbl_head_font,
                sett_desc: 'Label Header Font',
                sett_key: 'LABEL_HEADER_FONT',
                value_1: $$("txtLabelHeadFontsize").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating label header font...");
            page.settService.updateSetting(data27, function () {
                $$("msgPanel").flash("Label header font updated...!");
            });
            var data28 = {
                sett_no: page.msg_pnl_color,
                sett_desc: 'Message Panel Back Color',
                sett_key: 'MSG_PANEL_COLOR',
                value_1: $("#MessagePanelcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating message panel back color...");
            page.settService.updateSetting(data28, function () {
                $$("msgPanel").flash("Message panel back color updated...!");
            });
            var data29 = {
                sett_no: page.grd_back_color,
                sett_desc: 'Grid Background Color',
                sett_key: 'GRD_BACK_COLOR',
                value_1: $("#GridBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating grid background color...");
            page.settService.updateSetting(data29, function () {
                $$("msgPanel").flash("Grid background color updated...!");
            });
            var data30 = {
                sett_no: page.grd_head_color,
                sett_desc: 'Grid Header Color',
                sett_key: 'GRD_HEADER_COLOR',
                value_1: $("#GridHeadcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating grid header color...");
            page.settService.updateSetting(data30, function () {
                $$("msgPanel").flash("Grid header color updated...!");
            });
            var data31 = {
                sett_no: page.det_screen_back_color,
                sett_desc: 'Detail Screen Back Color',
                sett_key: 'DETAIL_BACK_COLOR',
                value_1: $("#DetailScreencolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating detail screen back color...");
            page.settService.updateSetting(data31, function () {
                $$("msgPanel").flash("Detail screen back color updated...!");
            });
            var data32 = {
                sett_no: page.act_screen_color,
                sett_desc: 'Action Screen Back Color',
                sett_key: 'ACTION_BACK_COLOR',
                value_1: $("#ActScreenBackcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating action screen back color...");
            page.settService.updateSetting(data32, function () {
                $$("msgPanel").flash("Action screen back color updated...!");
            });
            var data33 = {
                sett_no: page.sec_butt_color,
                sett_desc: 'Secondary Button Color',
                sett_key: 'S_BUTTON_COLOR',
                value_1: $("#SecButtoncolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating secondary button color...");
            page.settService.updateSetting(data33, function () {
                $$("msgPanel").flash("Secondary button color updated...!");
            });
            var data34 = {
                sett_no: page.grd_odd_row_color,
                sett_desc: 'Grid Odd Row Color',
                sett_key: 'GRD_ODD_ROW_COLOR',
                value_1: $("#GridOddRowcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating grid odd row color...");
            page.settService.updateSetting(data34, function () {
                $$("msgPanel").flash("Grid odd row color updated...!");
            });
            var data35 = {
                sett_no: page.grd_even_row_color,
                sett_desc: 'Grid Even Row Color',
                sett_key: 'GRD_EVEN_ROW_COLOR',
                value_1: $("#GridEvenRowcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating grid even row color...");
            page.settService.updateSetting(data35, function () {
                $$("msgPanel").flash("Grid even row color updated...!");
            });
            var data36 = {
                sett_no: page.background,
                sett_desc: 'Background',
                sett_key: 'BACK_GROUND',
                value_1: $("#Backgroundcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating background...");
            page.settService.updateSetting(data36, function () {
                $$("msgPanel").flash("Background updated...!");
            });
            var data37 = {
                sett_no: page.sear_pnl_bg_color,
                sett_desc: 'SearchPanel BG Color',
                sett_key: 'SEARCH_COLOR',
                value_1: $("#SearchPanelcolor").val(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating search panel back color...");
            page.settService.updateSetting(data37, function () {
                $$("msgPanel").flash("Search panel back color updated...!");
                page.afterapply();
            });
            var data38 = {
                sett_no: page.txtSearchGridHeight,
                sett_desc: 'SEARCH_GRID_HEIGHT',
                sett_key: 'SEARCH_GRID_HEIGHT',
                value_1: $$("txtSearchGridHeight").value(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating search grid height...");
            page.settService.updateSetting(data38, function () {
                $$("msgPanel").flash("Search grid height updated...!");
                page.afterapply();
            });
            var data39 = {
                sett_no: page.txtInputButtonHeight,
                sett_desc: 'INPUT_BUTTON_HEIGHT',
                sett_key: 'INPUT_BUTTON_HEIGHT',
                value_1: $$("txtInputButtonHeight").value(),
                value_2: "Layout",
                value_3: "Text",
            }
            $$("msgPanel").flash("Updating input button height...");
            page.settService.updateSetting(data39, function () {
                $$("msgPanel").flash("Input Button height updated...!");
                var data40 = {
                    sett_no: page.ddlCurrentLanguage,
                    sett_desc: 'CurrentLanguage',
                    sett_key: 'CurrentLanguage',
                    value_1: $$("ddlCurrentLanguage").selectedValue(),
                    value_2: "Layout",
                    value_3: "dropDown",
                }
                $$("msgPanel").flash("Updating Primary Language...");
                page.settService.updateSetting(data40, function () {
                    $$("msgPanel").flash("Primary Language updated...!");
                    var data41 = {
                        sett_no: page.txtSecondaryLanguage,
                        sett_desc: 'SecondaryLanguage',
                        sett_key: 'SecondaryLanguage',
                        value_1: $$("txtSecondaryLanguage").value(),
                        value_2: "Layout",
                        value_3: "Text",
                    }
                    $$("msgPanel").flash("Updating Secondary Language...");
                    page.settService.updateSetting(data41, function () {
                        $$("msgPanel").flash("Secondary Language updated...!");
                        var data42 = {
                            sett_no: page.ddlCurrentSecondaryLanguage,
                            sett_desc: 'CurrentSecondaryLanguage',
                            sett_key: 'CurrentSecondaryLanguage',
                            value_1: $$("ddlCurrentSecondaryLanguage").selectedValue(),
                            value_2: "Layout",
                            value_3: "dropDown",
                        }
                        $$("msgPanel").flash("Updating Current Secondary Language...");
                        page.settService.updateSetting(data42, function () {
                            $$("msgPanel").flash("Current Secondary Language updated...!");
                            var data43 = {
                                sett_no: page.chkSalesSecondaryLanguage,
                                sett_desc: 'ENABLE_SALES_SECONDARY_LANGUAGE',
                                sett_key: 'ENABLE_SALES_SECONDARY_LANGUAGE',
                                value_2: "Layout",
                                value_3: "dropDown",
                            }
                            if ($$("chkSalesSecondaryLanguage").prop("checked")) {
                                data43.value_1 = "true";
                            } else {
                                data43.value_1 = "false";
                            }
                            $$("msgPanel").flash("Updating Sales Secondary Language...");
                            page.settService.updateSetting(data43, function () {
                                $$("msgPanel").flash("Sales Secondary Language updated...!");
                                var data44 = {
                                    sett_no: page.chkPurchaseSecondaryLanguage,
                                    sett_desc: 'ENABLE_PURCHASE_SECONDARY_LANGUAGE',
                                    sett_key: 'ENABLE_PURCHASE_SECONDARY_LANGUAGE',
                                    value_2: "Layout",
                                    value_3: "dropDown",
                                }
                                if ($$("chkPurchaseSecondaryLanguage").prop("checked")) {
                                    data44.value_1 = "true";
                                } else {
                                    data44.value_1 = "false";
                                }
                                $$("msgPanel").flash("Updating Purchase Secondary Language...");
                                page.settService.updateSetting(data44, function () {
                                    $$("msgPanel").flash("Purchase Secondary Language updated...!");
                                    page.afterapply();
                                });
                            });
                        });
                    });
                });
            });
        }
        
        page.events.btnSavePurchase_click = function () {
            var data1 = {
                sett_no: page.enabilepurchasejasper,
                sett_desc: 'ENABLE_PURCHASE_JASPER',
                sett_key: 'ENABLE_PURCHASE_JASPER',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Purchase",
                value_3: "Checkbox",
            }
            if ($$("chkPurchaseJasper").prop("checked")) {
                data1.value_1 = "true";
            } else {
                data1.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Jasper Print...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").flash("Jasper Print Updated...!");
                
            
            var data2 = {
                sett_no: page.enabilepurchasemail,
                sett_desc: 'ENABLE_PURCHASE_EMAIL',
                sett_key: 'ENABLE_PURCHASE_EMAIL',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Purchase",
                value_3: "Checkbox",
            }
            if ($$("chkPurchaseEmail").prop("checked")) {
                data2.value_1 = "true";
            } else {
                data2.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Jasper Email...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").flash("Jasper Email Updated...!");
                
            
            var data3 = {
                sett_no: page.enabilepurchasexpense,
                sett_desc: 'ENABLE_PURCHASE_EXPENSE',
                sett_key: 'ENABLE_PURCHASE_EXPENSE',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Purchase",
                value_3: "Checkbox",
            }
            if ($$("chkPurchaseExpense").prop("checked")) {
                data3.value_1 = "true";
            } else {
                data3.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Jasper Expense...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Jasper Expense Updated...!");
               
            
            var data4 = {
                sett_no: page.defaultpurchase_pay_mode,
                sett_desc: 'PURCHASE_BILL_PAY_MODE',
                sett_key: 'PURCHASE_BILL_PAY_MODE',
                value_1: $$("ddlPurchasePayMode").selectedValue(),
                value_2: "Purchase",
                value_3: "Checkbox",
            }
            $$("msgPanel").flash("Updating Default Pay Mode...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Default Pay Mode Updated...!");
                var data5 = {
                    sett_no: page.chkPurchaseBillEdit,
                    sett_desc: 'ENABLE_PURCHASE_BILL_EDIT',
                    sett_key: 'ENABLE_PURCHASE_BILL_EDIT',
                    value_2: "Purchase",
                    value_3: "Checkbox",
                }
                if ($$("chkPurchaseBillEdit").prop("checked")) {
                    data5.value_1 = "true";
                } else {
                    data5.value_1 = "false";
                }
                $$("msgPanel").flash("Updating Purchase Bill Edit...");
                page.settService.updateSetting(data5, function () {
                    $$("msgPanel").flash("Purchase Bill Edit Updated...!");
                    var data6 = {
                        sett_no: page.chkPurchaseCancelBill,
                        sett_desc: 'ENABLE_PURCHASE_CANCEL_BILL',
                        sett_key: 'ENABLE_PURCHASE_CANCEL_BILL',
                        value_2: "Purchase",
                        value_3: "Checkbox",
                    }
                    if ($$("chkPurchaseCancelBill").prop("checked")) {
                        data6.value_1 = "true";
                    } else {
                        data6.value_1 = "false";
                    }
                    $$("msgPanel").flash("Updating Purchase Cancel Bill...");
                    page.settService.updateSetting(data6, function () {
                        $$("msgPanel").flash("Purchase Cancel Bill Updated...!");
                        page.events.btnPurchase_click();
                    });
                });
            });
            });
            });
            });
        }

        page.events.btnSaveSales_click = function () {
            var data1 = {
                sett_no: page.enablestockcolumn,
                sett_desc: 'SHOW_STOCK_COLUMN',
                sett_key: 'SHOW_STOCK_COLUMN',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesStock").prop("checked")) {
                data1.value_1 = "true";
            } else {
                data1.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Stock Column...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").flash("Sales Stock Column Updated...!");
            var data2 = {
                sett_no: page.enablegstcolumn,
                sett_desc: 'SHOW_GST_COLUMN',
                sett_key: 'SHOW_GST_COLUMN',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesGst").prop("checked")) {
                data2.value_1 = "true";
            } else {
                data2.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales GST Column...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").flash("Sales GST Column Updated...!");
            var data3 = {
                sett_no: page.enablefreecolumn,
                sett_desc: 'SHOW_FREE_COLUMN',
                sett_key: 'SHOW_FREE_COLUMN',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesFree").prop("checked")) {
                data3.value_1 = "true";
            } else {
                data3.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Free Column...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Sales Free Column Updated...!");
            var data4 = {
                sett_no: page.enablesalemail,
                sett_desc: 'ENABLE_SALES_EMAIL',
                sett_key: 'ENABLE_SALES_EMAIL',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesEmail").prop("checked")) {
                data4.value_1 = "true";
            } else {
                data4.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Email ...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Sales Email Updated...!");
                
            var data1 = {
                sett_no: page.salesemailurl,
                sett_desc: 'SALES_EMAIL_URL',
                sett_key: 'SALES_EMAIL_URL',
                value_1: $$("txtSaleEmailUrl").val(),
                value_2: "Sale",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating Sales Email URL...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").flash("Sales Email URL Updated...!");
                
            var data2 = {
                sett_no: page.default_pay_mode,
                sett_desc: 'SALES_BILL_PAY_MODE',
                sett_key: 'SALES_BILL_PAY_MODE',
                value_1: $$("ddlSalesPayMode").selectedValue(),
                value_2: "Sale",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating Dafault Pay Mode...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").flash("Dafault Pay Mode updated...!");
            });
            var data3 = {
                sett_no: page.salesexecutivelabelname,
                sett_desc: 'SALES_EXECUTIVE_LABEL_NAME',
                sett_key: 'SALES_EXECUTIVE_LABEL_NAME',
                value_1: $$("txtSaleExecutiveLabelName").val(),
                value_2: "Sale",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating Sales Executive Label Name...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Sales Executive Label Name Updated...!");
                
            
            var data4 = {
                sett_no: page.salespricelabelname,
                sett_desc: 'SALE_PRICE_NAME',
                sett_key: 'SALE_PRICE_NAME',
                value_1: $$("txtSalePriceLabelName").val(),
                value_2: "Sale",
                value_3: "Text",
            }
            $$("msgPanel").show("Updating Sales Executive Label Name...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("Sales Executive Label Name Updated...!");
                
            
            var data5 = {
                sett_no: page.enablesalesbuyingcost,
                sett_desc: 'ENABLE_SALES_BUYING_COST',
                sett_key: 'ENABLE_SALES_BUYING_COST',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesBuyingCost").prop("checked")) {
                data5.value_1 = "true";
            } else {
                data5.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Buying Cost ...");
            page.settService.updateSetting(data5, function () {
                $$("msgPanel").flash("Sales Buying Cost Updated...!");
            
            var data6 = {
                sett_no: page.enablesalesfrightcost,
                sett_desc: 'ENABLE_SALES_FRIGHT_CHARGE',
                sett_key: 'ENABLE_SALES_FRIGHT_CHARGE',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesFrightCharge").prop("checked")) {
                data6.value_1 = "true";
            } else {
                data6.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Fright Charge ...");
            page.settService.updateSetting(data6, function () {
                $$("msgPanel").flash("Sales Fright Charge Updated...!");
                
            
            var data7 = {
                sett_no: page.enablesalesreceipt,
                sett_desc: 'ENABLE_SALES_RECEIPT',
                sett_key: 'ENABLE_SALES_RECEIPT',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesReceipt").prop("checked")) {
                data7.value_1 = "true";
            } else {
                data7.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Receipt ...");
            page.settService.updateSetting(data7, function () {
                $$("msgPanel").flash("Sales Receipt Updated...!");
            
            var data9 = {
                sett_no: page.enablediscountinclusion,
                sett_desc: 'ENABLE_DISCOUNT_INCLUSION',
                sett_key: 'ENABLE_DISCOUNT_INCLUSION',
                //value_1: $$("ddlBillExpCreAccount").selectedValue(),
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkDiscountInclusion").prop("checked")) {
                data9.value_1 = "true";
            } else {
                data9.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Discount ...");
            page.settService.updateSetting(data9, function () {
                $$("msgPanel").flash("Sales Discount Updated...!");
            
            var data10 = {
                sett_no: page.enablebilladvance,
                sett_desc: 'ENABLE_BILL_ADVANCE',
                sett_key: 'ENABLE_BILL_ADVANCE',
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkBillAdvance").prop("checked")) {
                data10.value_1 = "true";
            } else {
                data10.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Bill Advance ...");
            page.settService.updateSetting(data10, function () {
                $$("msgPanel").flash("Bill Advance Updated...!");
            
            var data11 = {
                sett_no: page.enablesalesexecutivebarcode,
                sett_desc: 'ENABLE_SALES_EXECUTIVE_BARCODE',
                sett_key: 'ENABLE_SALES_EXECUTIVE_BARCODE',
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSalesExecutiveBarcode").prop("checked")) {
                data11.value_1 = "true";
            } else {
                data11.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Bill Advance ...");
            page.settService.updateSetting(data11, function () {
                $$("msgPanel").flash("Bill Advance Updated...!");
                
            var data12 = {
                sett_no: page.chkSaleReturnBill,
                sett_desc: 'ENABLE_SALE_RETURN_BILL',
                sett_key: 'ENABLE_SALE_RETURN_BILL',
                value_2: "Sale",
                value_3: "Checkbox",
            }
            if ($$("chkSaleReturnBill").prop("checked")) {
                data12.value_1 = "true";
            } else {
                data12.value_1 = "false";
            }
            $$("msgPanel").flash("Updating Sales Return Bill ...");
            page.settService.updateSetting(data12, function () {
                $$("msgPanel").flash("Sales Return Bill Updated...!");
                var data13 = {
                    sett_no: page.chkBillDiscount,
                    sett_desc: 'ENABLE_BILL_LEVEL_DISCOUNT',
                    sett_key: 'ENABLE_BILL_LEVEL_DISCOUNT',
                    value_2: "Sale",
                    value_3: "Checkbox",
                }
                if ($$("chkBillDiscount").prop("checked")) {
                    data13.value_1 = "true";
                } else {
                    data13.value_1 = "false";
                }
                $$("msgPanel").flash("Updating Bill Level Discount ...");
                page.settService.updateSetting(data13, function () {
                    $$("msgPanel").flash("Bill Level Discount Updated...!");
                    var data14 = {
                        sett_no: page.chkEMIPayment,
                        sett_desc: 'ENABLE_EMI_PAYMENT',
                        sett_key: 'ENABLE_EMI_PAYMENT',
                        value_2: "Sale",
                        value_3: "Checkbox",
                    }
                    if ($$("chkEMIPayment").prop("checked")) {
                        data14.value_1 = "true";
                    } else {
                        data14.value_1 = "false";
                    }
                    $$("msgPanel").flash("Updating EMI Bill ...");
                    page.settService.updateSetting(data14, function () {
                        $$("msgPanel").flash("EMI Bill Updated...!");
                        var data15 = {
                            sett_no: page.chkSalesBillEdit,
                            sett_desc: 'ENABLE_SALES_BILL_EDIT',
                            sett_key: 'ENABLE_SALES_BILL_EDIT',
                            value_2: "Sale",
                            value_3: "Checkbox",
                        }
                        if ($$("chkSalesBillEdit").prop("checked")) {
                            data15.value_1 = "true";
                        } else {
                            data15.value_1 = "false";
                        }
                        $$("msgPanel").flash("Updating Bill Edit ...");
                        page.settService.updateSetting(data15, function () {
                            $$("msgPanel").flash("Bill Edit Updated...!");
                            var data16 = {
                                sett_no: page.chkAlterPrice1,
                                sett_desc: 'ENABLE_ALTER_PRICE_1',
                                sett_key: 'ENABLE_ALTER_PRICE_1',
                                value_2: "Sale",
                                value_3: "Checkbox",
                            }
                            if ($$("chkAlterPrice1").prop("checked")) {
                                data16.value_1 = "true";
                            } else {
                                data16.value_1 = "false";
                            }
                            $$("msgPanel").flash("Updating Alter Price 1 ...");
                            page.settService.updateSetting(data16, function () {
                                $$("msgPanel").flash("Alter Price 1 Updated...!");
                                var data17 = {
                                    sett_no: page.chkAlterPrice2,
                                    sett_desc: 'ENABLE_ALTER_PRICE_2',
                                    sett_key: 'ENABLE_ALTER_PRICE_2',
                                    value_2: "Sale",
                                    value_3: "Checkbox",
                                }
                                if ($$("chkAlterPrice2").prop("checked")) {
                                    data17.value_1 = "true";
                                } else {
                                    data17.value_1 = "false";
                                }
                                $$("msgPanel").flash("Updating Alter Price 2 ...");
                                page.settService.updateSetting(data17, function () {
                                    $$("msgPanel").flash("Alter Price 2 Updated...!");
                                    var data17 = {
                                        sett_no: page.txtAlterPrice1LabelName,
                                        sett_desc: 'ALTER_PRICE_1_LABEL_NAME',
                                        sett_key: 'ALTER_PRICE_1_LABEL_NAME',
                                        value_1:$$("txtAlterPrice1LabelName").value(),
                                        value_2: "Sale",
                                        value_3: "Text",
                                    }
                                    $$("msgPanel").flash("Updating Alter Price 1 Label Name ...");
                                    page.settService.updateSetting(data17, function () {
                                        $$("msgPanel").flash("Alter Price 1 Label Name Updated...!");
                                        var data18 = {
                                            sett_no: page.txtAlterPrice2LabelName,
                                            sett_desc: 'ALTER_PRICE_2_LABEL_NAME',
                                            sett_key: 'ALTER_PRICE_2_LABEL_NAME',
                                            value_1: $$("txtAlterPrice2LabelName").value(),
                                            value_2: "Sale",
                                            value_3: "Text",
                                        }
                                        $$("msgPanel").flash("Updating Alter Price 2 Label Name ...");
                                        page.settService.updateSetting(data18, function () {
                                            $$("msgPanel").flash("Alter Price 2 Label Name Updated...!");
                                            var data18 = {
                                                sett_no: page.chkItemRate,
                                                sett_desc: 'ENABLE_ITEM_RATE',
                                                sett_key: 'ENABLE_ITEM_RATE',
                                                value_2: "Sale",
                                                value_3: "Checkbox",
                                            }
                                            if ($$("chkItemRate").prop("checked")) {
                                                data18.value_1 = "true";
                                            } else {
                                                data18.value_1 = "false";
                                            }
                                            $$("msgPanel").flash("Updating Item Rate ...");
                                            page.settService.updateSetting(data18, function () {
                                                $$("msgPanel").flash("Item Rate Updated...!");
                                                var data18 = {
                                                    sett_no: page.chkSalesItemDate,
                                                    sett_desc: 'ENABLE_SALES_ITEM_DATE',
                                                    sett_key: 'ENABLE_SALES_ITEM_DATE',
                                                    value_2: "Sale",
                                                    value_3: "Checkbox",
                                                }
                                                if ($$("chkSalesItemDate").prop("checked")) {
                                                    data18.value_1 = "true";
                                                } else {
                                                    data18.value_1 = "false";
                                                }
                                                $$("msgPanel").flash("Updating Item Date ...");
                                                page.settService.updateSetting(data18, function () {
                                                    $$("msgPanel").flash("Item Date Updated...!");
                                                    page.events.btnSales_click();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                       
                    });
                });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
            });
        }
        
        page.events.btnGeneral_click = function () {
            $$("pnlGeneral").show();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            page.salestaxService.getActiveSalesTax(function (data) {
                $$("ddlDefaultTax").dataBind(data, "sales_tax_no", "sales_tax_name", "None");
            });
            page.settService.getStoreByCompID(getCookie("user_company_id"), function (data) {
                $$("ddlCurrentStore").dataBind(data, "store_no", "store_name");
            });
            $$("ddlCurrentStore").selectionChange(function (data) {
                if (typeof data != "undefined") {
                    page.store_no = data.store_no;
                    page.settService.getRegisterByCompID(page.store_no, function (data) {
                        $$("ddlCurrentRegister").dataBind(data, "reg_no", "reg_name");
                    });
                }
            });
            $$("ddlCompany").selectionChange(function (data) {
                if (typeof data != "undefined") {
                    page.comp_id = data.comp_id;
                    page.revenueService.getPeriod($$("ddlCompany").selectedValue(), function (data) {
                    });
                }
            });
            page.settingApi.searchSettings("", "", "value_2='General' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                $(data).each(function (i, item) {
                    if (item.sett_key == "COMPANY_NAME") {
                        page.company_name = item.sett_no;
                        $$("txtCompanyGen").value(item.value_1);

                    }
                    if (item.sett_key == "COMPANY_OWNER_NAME") {
                        page.company_owner_name = item.sett_no;
                        $$("txtOwnerGen").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_LANDLINE_NO") {
                        page.company_land_no = item.sett_no;

                        $$("txtCmpnyLandlineNo").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_PHONE_NO") {
                        page.company_phoneno = item.sett_no;

                        $$("txtPhoneNo").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_ALTER_PHONE_NO") {
                        page.company_alterphoneno = item.sett_no;

                        $$("txtAlterPhoneNo").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_EMAIL") {
                        page.company_email = item.sett_no;

                        $$("txtEmail").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_WEB_ADDRESS") {
                        page.company_web_address = item.sett_no;

                        $$("txtWebAddress").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_GST_NO") {
                        page.companygstno = item.sett_no;

                        $$("txtCmpnyGSTNo").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_DL_NO") {
                        page.companydlno = item.sett_no;

                        $$("txtCmpnyDLNo").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_TIN_NO") {
                        page.companytinno = item.sett_no;

                        $$("txtCmpnyTINNo").value(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_ADDRESS_LINE1") {
                        page.company_address = item.sett_no;
                        $$("txtCmpnyAddGen").val(item.value_1);
                    }
                    if (item.sett_key == "COMPANY_ADDRESS_LINE2") {
                        page.company_address_line2 = item.sett_no;
                        $$("txtCmpnyAddGen1").val(item.value_1);
                    }
                    //if (item.sett_key == "LogoName") {
                    //    page.logo_name = item.sett_no;
                    //    $$("txtLogoName").val(item.value_1);
                    //    if (item.value_3 != "" || item.value_3 != null || item.value_3 != undefined) {
                    //        $("#output").attr("src", "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload" + '/' + item.value_3);
                    //        page.image_name = item.value_3;
                    //    }
                    //    else {
                    //        $('#fileUpload').val("")
                    //        $("#output").attr("src", "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload" + "");
                    //    }
                    //}
                    if (item.sett_key == "DEFAULT_SALES_TAX") {
                        page.salestaxService.getActiveSalesTax(function (data) {
                            $$("ddlDefaultTax").dataBind(data, "sales_tax_no", "sales_tax_name", "None");
                            page.tax_no = item.sett_no;
                            $$("ddlDefaultTax").selectedValue(item.value_1);
                        });
                    }
                    if (item.sett_key == "USER_DEFAULT_STORE") {
                        page.def_store = item.sett_no;
                        $$("ddlCurrentStore").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "USER_DEFAULT_REGISTER") {
                        page.def_reg = item.sett_no;
                        $$("ddlCurrentRegister").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_VARIATION_VENDOR") {
                        page.vendor = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkVendor").prop('checked', true);
                        }
                        else {
                            $$("chkVendor").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION_BUYING_COST") {
                        page.chkBuyingCost = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkBuyingCost").prop('checked', true);
                        }
                        else {
                            $$("chkBuyingCost").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION_MRP") {
                        page.mrp = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkMRP").prop('checked', true);
                        }
                        else {
                            $$("chkMRP").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION_MAN_DATE") {
                        page.mandate = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkManDate").prop('checked', true);
                        }
                        else {
                            $$("chkManDate").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION_EXP_DATE") {
                        page.expdate = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkExpDate").prop('checked', true);
                        }
                        else {
                            $$("chkExpDate").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION_BATCH") {
                        page.batchno = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkBatchNo").prop('checked', true);
                        }
                        else {
                            $$("chkBatchNo").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "FREE_MODE") {
                        page.freemode = item.sett_no;
                        $$("ddlFreeMode").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_FREE_MODULE=true && ENABLE_FREE_VARIATION=true") {
                        page.freemode = item.sett_no;
                        $$("ddlFreeMode").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_FREE_MODULE=true && ENABLE_FREE_VARIATION=false") {
                        page.freemode = item.sett_no;
                        $$("ddlFreeMode").selectedValue(item.value_1);
                    }
                });
            })
        }
        page.events.btnFinfacts_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").show();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            page.settingApi.searchSettings("", "", "value_2='Finfacts' and comp_id = " + getCookie("user_company_id"), "sett_no", function (finfactsData) {
                page.comp_id = localStorage.getItem("user_finfacts_comp_id");
                page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                    $$("ddlCompany").dataBind(data, "comp_id", "comp_name");
                    page.accaccountService.getAccount(page.comp_id, function (accounts) {
                        $$("ddlSalesAccount").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlPurchaseAccount").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlSalesAccountReward").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlPurchaseAccountReward").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlSalesAccountBank").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlPurchaseAccountBank").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlSalesAccountCoupon").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlPurchaseAccountCoupon").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlBillExpAccount").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlBillExpCategory").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlBillExpDeAccount").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlBillExpCreAccount").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlBillIncome").dataBind(accounts, "acc_id", "acc_name");
                        $$("ddlBillIncomeTarget").dataBind(accounts, "acc_id", "acc_name");
                        page.revenueService.getPeriod($$("ddlCompany").selectedValue(), function (periodData) {
                            $$("ddlPeriod").dataBind(periodData, "per_id", "per_name");
                            $(finfactsData).each(function (i, item) {
                                if (item.sett_key == "FINFACTS_COMPANY") {
                                    $$("ddlCompany").selectedValue(item.value_1);
                                    page.company = item.sett_no;
                                }
                                if (item.sett_key == "FINFACTS_CURRENT_PERIOD") {
                                    page.period = item.sett_no;
                                    $$("ddlPeriod").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_SALES_DEF_CASH_ACCOUNT") {
                                    page.sales_cash = item.sett_no;
                                    $$("ddlSalesAccount").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_PURCHASE_DEF_CASH_ACCOUNT") {
                                    page.purchase_cash = item.sett_no;
                                    $$("ddlPurchaseAccount").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_SALES_DEF_REWARD_ACCOUNT") {
                                    page.sales_reward = item.sett_no;
                                    $$("ddlSalesAccountReward").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_PURCHASE_DEF_REWARD_ACCOUNT") {
                                    page.purchase_reward = item.sett_no;
                                    $$("ddlPurchaseAccountReward").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_SALES_DEF_BANK_ACCOUNT") {
                                    page.sales_bank = item.sett_no;
                                    $$("ddlSalesAccountBank").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_PURCHASE_DEF_BANK_ACCOUNT") {
                                    page.purchase_bank = item.sett_no;
                                    $$("ddlPurchaseAccountBank").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_SALES_DEF_COUPON_ACCOUNT") {
                                    page.sales_coupon = item.sett_no;
                                    $$("ddlSalesAccountCoupon").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_PURCHASE_DEF_COUPON_ACCOUNT") {
                                    page.purchase_coupon = item.sett_no;
                                    $$("ddlPurchaseAccountCoupon").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "INCOME_ACCOUNT") {
                                    page.ddlBillIncome = item.sett_no;
                                    $$("ddlBillIncome").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "INCOME_TARGET_ACCOUNT") {
                                    page.ddlBillIncomeTarget = item.sett_no;
                                    $$("ddlBillIncomeTarget").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_BILL_EXPENSE_ACCOUNT") {
                                    page.billexpacc = item.sett_no;
                                    $$("ddlBillExpAccount").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_BILL_EXPENSE_CATEGORY") {
                                    page.billexpcate = item.sett_no;
                                    $$("ddlBillExpCategory").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR") {
                                    page.billexpaccdept = item.sett_no;
                                    $$("ddlBillExpDeAccount").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "FINFACTS_BILL_EXPENSE_ACCOUNT_CREDITOR") {
                                    page.billexpacccred = item.sett_no;
                                    $$("ddlBillExpCreAccount").selectedValue(item.value_1);
                                }
                                if (item.sett_key == "ENABLE_FINFACTS_MODULES") {
                                    page.enafinmode = item.sett_no;
                                    if (item.value_1 == "true") {
                                        $$("chkFinfactsModules").prop('checked', true);
                                    }
                                    else {
                                        $$("chkFinfactsModules").prop('checked', false);
                                    }
                                }
                                if (item.sett_key == "ENABLE_BILL_EXPENSE_MODULES") {
                                    page.enabillexp = item.sett_no;
                                    if (item.value_1 == "true") {
                                        $$("chkBillExpModules").prop('checked', true);
                                    }
                                    else {
                                        $$("chkBillExpModules").prop('checked', false);
                                    }
                                }
                            });
                        });
                    });
                    //$(finfactsData).each(function (i, item) {
                    //    if (item.sett_key == "FINFACTS_COMPANY") {
                    //        $$("ddlCompany").selectedValue(item.value_1);
                    //        page.comp_id = item.value_1;
                    //        page.company = item.sett_no;
                    //    }
                    //    if (item.sett_key == "FINFACTS_CURRENT_PERIOD") {
                    //        page.period = item.sett_no;
                    //        page.revenueService.getPeriod($$("ddlCompany").selectedValue(), function (periodData) {
                    //            $$("ddlPeriod").dataBind(periodData, "per_id", "per_name");
                    //            $$("ddlPeriod").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_SALES_DEF_CASH_ACCOUNT") {
                    //        page.sales_cash = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlSalesAccount").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlSalesAccount").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_PURCHASE_DEF_CASH_ACCOUNT") {
                    //        page.purchase_cash = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlPurchaseAccount").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlPurchaseAccount").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_SALES_DEF_REWARD_ACCOUNT") {
                    //        page.sales_reward = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlSalesAccountReward").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlSalesAccountReward").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_PURCHASE_DEF_REWARD_ACCOUNT") {
                    //        page.purchase_reward = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlPurchaseAccountReward").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlPurchaseAccountReward").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_SALES_DEF_BANK_ACCOUNT") {
                    //        page.sales_bank = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlSalesAccountBank").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlSalesAccountBank").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_PURCHASE_DEF_BANK_ACCOUNT") {
                    //        page.purchase_bank = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlPurchaseAccountBank").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlPurchaseAccountBank").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_SALES_DEF_COUPON_ACCOUNT") {
                    //        page.sales_coupon = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlSalesAccountCoupon").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlSalesAccountCoupon").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_PURCHASE_DEF_COUPON_ACCOUNT") {
                    //        page.purchase_coupon = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlPurchaseAccountCoupon").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlPurchaseAccountCoupon").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_BILL_EXPENSE_ACCOUNT") {
                    //        page.billexpacc = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlBillExpAccount").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlBillExpAccount").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_BILL_EXPENSE_CATEGORY") {
                    //        page.billexpcate = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlBillExpCategory").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlBillExpCategory").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR") {
                    //        page.billexpaccdept = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlBillExpDeAccount").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlBillExpDeAccount").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "FINFACTS_BILL_EXPENSE_ACCOUNT_CREDITOR") {
                    //        page.billexpacccred = item.sett_no;
                    //        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                    //            $$("ddlBillExpCreAccount").dataBind(accounts, "acc_id", "acc_name");
                    //            $$("ddlBillExpCreAccount").selectedValue(item.value_1);
                    //        });
                    //    }
                    //    if (item.sett_key == "ENABLE_FINFACTS_MODULES") {
                    //        page.enafinmode = item.sett_no;
                    //        if (item.value_1 == "true") {
                    //            $$("chkFinfactsModules").prop('checked', true);
                    //        }
                    //        else {
                    //            $$("chkFinfactsModules").prop('checked', false);
                    //        }
                    //    }
                    //    if (item.sett_key == "ENABLE_BILL_EXPENSE_MODULES") {
                    //        page.enabillexp = item.sett_no;
                    //        if (item.value_1 == "true") {
                    //            $$("chkBillExpModules").prop('checked', true);
                    //        }
                    //        else {
                    //            $$("chkBillExpModules").prop('checked', false);
                    //        }
                    //    }
                    //});
                });
            })
        }
        page.events.btnPurchase_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").show();
            $$("pnlSales").hide();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            page.settingApi.searchSettings("", "", "value_2='Purchase' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                $(data).each(function (i, item) {
                    if (item.sett_key == "ENABLE_PURCHASE_JASPER") {
                        page.enabilepurchasejasper = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPurchaseJasper").prop('checked', true);
                        }
                        else {
                            $$("chkPurchaseJasper").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PURCHASE_EMAIL") {
                        page.enabilepurchasemail = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPurchaseEmail").prop('checked', true);
                        }
                        else {
                            $$("chkPurchaseEmail").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PURCHASE_EXPENSE") {
                        page.enabilepurchasexpense = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPurchaseExpense").prop('checked', true);
                        }
                        else {
                            $$("chkPurchaseExpense").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "PURCHASE_BILL_PAY_MODE") {
                        page.defaultpurchase_pay_mode = item.sett_no;
                        $$("ddlPurchasePayMode").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_PURCHASE_BILL_EDIT") {
                        page.chkPurchaseBillEdit = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPurchaseBillEdit").prop('checked', true);
                        }
                        else {
                            $$("chkPurchaseBillEdit").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PURCHASE_CANCEL_BILL") {
                        page.chkPurchaseCancelBill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPurchaseCancelBill").prop('checked', true);
                        }
                        else {
                            $$("chkPurchaseCancelBill").prop('checked', false);
                        }
                    }
                    //if (item.sett_key == "DEFAULT_VARIATION_SUPPLIER_NO") {
                    //    page.chkDefaultVariationSupplierNo = item.sett_no;
                    //    if (item.value_1 == "true") {
                    //        $$("chkDefaultVariationSupplierNo").prop('checked', true);
                    //    }
                    //    else {
                    //        $$("chkDefaultVariationSupplierNo").prop('checked', false);
                    //    }
                    //}
                    //if (item.sett_key == "DEFAULT_VARIATION_BUYING_COST") {
                    //    page.chkDefaultVariationCost = item.sett_no;
                    //    if (item.value_1 == "true") {
                    //        $$("chkDefaultVariationCost").prop('checked', true);
                    //    }
                    //    else {
                    //        $$("chkDefaultVariationCost").prop('checked', false);
                    //    }
                    //}
                    //if (item.sett_key == "DEFAULT_VARIATION_MRP") {
                    //    page.chkDefaultVariationMrp = item.sett_no;
                    //    if (item.value_1 == "true") {
                    //        $$("chkDefaultVariationMrp").prop('checked', true);
                    //    }
                    //    else {
                    //        $$("chkDefaultVariationMrp").prop('checked', false);
                    //    }
                    //}
                    //if (item.sett_key == "DEFAULT_VARIATION_BATCH_NO") {
                    //    page.chkDefaultVariationBatchNo = item.sett_no;
                    //    if (item.value_1 == "true") {
                    //        $$("chkDefaultVariationBatchNo").prop('checked', true);
                    //    }
                    //    else {
                    //        $$("chkDefaultVariationBatchNo").prop('checked', false);
                    //    }
                    //}
                    //if (item.sett_key == "DEFAULT_VARIATION_MAN_DATE") {
                    //    page.chkDefaultVariationManDate = item.sett_no;
                    //    if (item.value_1 == "true") {
                    //        $$("chkDefaultVariationManDate").prop('checked', true);
                    //    }
                    //    else {
                    //        $$("chkDefaultVariationManDate").prop('checked', false);
                    //    }
                    //}
                    //if (item.sett_key == "DEFAULT_VARIATION_MAN_DATE") {
                    //    page.chkDefaultVariationManDate = item.sett_no;
                    //    if (item.value_1 == "true") {
                    //        $$("chkDefaultVariationManDate").prop('checked', true);
                    //    }
                    //    else {
                    //        $$("chkDefaultVariationManDate").prop('checked', false);
                    //    }
                    //}
                }); 
            })
        }
        page.events.btnSales_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").show();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            page.settingApi.searchSettings("", "", "value_2='Sale' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                $(data).each(function (i, item) {
                    if (item.sett_key == "SHOW_STOCK_COLUMN") {
                        page.enablestockcolumn = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesStock").prop('checked', true);
                        }
                        else {
                            $$("chkSalesStock").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SHOW_GST_COLUMN") {
                        page.enablegstcolumn = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesGst").prop('checked', true);
                        }
                        else {
                            $$("chkSalesGst").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SHOW_FREE_COLUMN") {
                        page.enablefreecolumn = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesFree").prop('checked', true);
                        }
                        else {
                            $$("chkSalesFree").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_EMAIL") {
                        page.enablesalemail = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesEmail").prop('checked', true);
                        }
                        else {
                            $$("chkSalesEmail").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SALES_EMAIL_URL") {
                        page.salesemailurl = item.sett_no;
                        $$("txtSaleEmailUrl").value(item.value_1);
                    }
                    if (item.sett_key == "SALES_EXECUTIVE_LABEL_NAME") {
                        page.salesexecutivelabelname = item.sett_no;
                        $$("txtSaleExecutiveLabelName").value(item.value_1);
                    }
                    if (item.sett_key == "SALE_PRICE_NAME") {
                        page.salespricelabelname = item.sett_no;
                        $$("txtSalePriceLabelName").value(item.value_1);
                    }
                    if (item.sett_key == "SALES_BILL_PAY_MODE") {
                        page.default_pay_mode = item.sett_no;
                        $$("ddlSalesPayMode").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_SALES_BUYING_COST") {
                        page.enablesalesbuyingcost = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesBuyingCost").prop('checked', true);
                        }
                        else {
                            $$("chkSalesBuyingCost").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_FRIGHT_CHARGE") {
                        page.enablesalesfrightcost = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesFrightCharge").prop('checked', true);
                        }
                        else {
                            $$("chkSalesFrightCharge").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_RECEIPT") {
                        page.enablesalesreceipt = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesReceipt").prop('checked', true);
                        }
                        else {
                            $$("chkSalesReceipt").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_EXECUTIVE_REWARD") {
                        page.enablesalesexecutivereward = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesExecutiveReward").prop('checked', true);
                        }
                        else {
                            $$("chkSalesExecutiveReward").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_DISCOUNT_INCLUSION") {
                        page.enablediscountinclusion = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkDiscountInclusion").prop('checked', true);
                        }
                        else {
                            $$("chkDiscountInclusion").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_BILL_ADVANCE") {
                        page.enablebilladvance = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkBillAdvance").prop('checked', true);
                        }
                        else {
                            $$("chkBillAdvance").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_EXECUTIVE_BARCODE") {
                        page.enablesalesexecutivebarcode = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesExecutiveBarcode").prop('checked', true);
                        }
                        else {
                            $$("chkSalesExecutiveBarcode").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALE_RETURN_BILL") {
                        page.chkSaleReturnBill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSaleReturnBill").prop('checked', true);
                        }
                        else {
                            $$("chkSaleReturnBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_BILL_LEVEL_DISCOUNT") {
                        page.chkBillDiscount = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkBillDiscount").prop('checked', true);
                        }
                        else {
                            $$("chkBillDiscount").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EMI_PAYMENT") {
                        page.chkEMIPayment = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEMIPayment").prop('checked', true);
                        }
                        else {
                            $$("chkEMIPayment").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_BILL_EDIT") {
                        page.chkSalesBillEdit = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesBillEdit").prop('checked', true);
                        }
                        else {
                            $$("chkSalesBillEdit").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ITEM_RATE") {
                        page.chkItemRate = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkItemRate").prop('checked', true);
                        }
                        else {
                            $$("chkItemRate").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ALTER_PRICE_1") {
                        page.chkAlterPrice1 = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkAlterPrice1").prop('checked', true);
                        }
                        else {
                            $$("chkAlterPrice1").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ALTER_PRICE_2") {
                        page.chkAlterPrice2 = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkAlterPrice2").prop('checked', true);
                        }
                        else {
                            $$("chkAlterPrice2").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ALTER_PRICE_1_LABEL_NAME") {
                        page.txtAlterPrice1LabelName = item.sett_no;
                        $$("txtAlterPrice1LabelName").value(item.value_1);
                    }
                    if (item.sett_key == "ALTER_PRICE_2_LABEL_NAME") {
                        page.txtAlterPrice2LabelName = item.sett_no;
                        $$("txtAlterPrice2LabelName").value(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_SALES_ITEM_DATE") {
                        page.chkSalesItemDate = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesItemDate").prop('checked', true);
                        }
                        else {
                            $$("chkSalesItemDate").prop('checked', false);
                        }
                    }
                });
            });
        }
        page.events.btnModules_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").show();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            page.settingApi.searchSettings("", "", "value_2='Modules' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                $(data).each(function (i, item) {
                    if (item.sett_key == "ENABLE_INVENTORY_MODULE") {
                        page.enable_inventory_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkInventory").prop('checked', true);
                        }
                        else {
                            $$("chkInventory").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_TAX_MODULE") {
                        page.enable_tax_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkTax").prop('checked', true);
                        }
                        else {
                            $$("chkTax").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_DISCOUNT_MODULE") {
                        page.enable_discount_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkDiscount").prop('checked', true);
                        }
                        else {
                            $$("chkDiscount").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_REWARD_MODULE") {
                        page.enable_reward_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkRewards").prop('checked', true);
                        }
                        else {
                            $$("chkRewards").prop('checked', false);
                        }
                    }

                    if (item.sett_key == "ENABLE_COUPON_MODULE") {
                        page.enable_coupon_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkCoupons").prop('checked', true);
                        }
                        else {
                            $$("chkCoupons").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PACKAGING_MODULE") {
                        page.enable_packaging_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkPackaging").prop('checked', true);
                        }
                        else {
                            $$("chkPackaging").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_TOUCH_POS_MODULE") {
                        page.enable_touch_pos_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkTouchPOS").prop('checked', true);
                        }
                        else {
                            $$("chkTouchPOS").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ORDER_MODULE") {
                        page.enable_order_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkOrders").prop('checked', true);
                        }
                        else {
                            $$("chkOrders").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MARKETING_MODULE") {
                        page.enable_marketing_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkMarketing").prop('checked', true);
                        }
                        else {
                            $$("chkMarketing").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MULTI_LANG_MODULE") {
                        page.enable_multi_lang_module = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkMultiLanguage").prop('checked', true);
                        }
                        else {
                            $$("chkMultiLanguage").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VEHICLE_NO") {
                        page.vehino = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkVehicleNo").prop('checked', true);
                        }
                        else {
                            $$("chkVehicleNo").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_DATE_FORMAT") {
                        page.dateformat = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkDateFormat").prop('checked', true);
                        }
                        else {
                            $$("chkDateFormat").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MRP") {
                        page.showmrp = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkShowMRP").prop('checked', true);
                        }
                        else {
                            $$("chkShowMRP").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MAN_DATE") {
                        page.showmandate = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkShowmanDate").prop('checked', true);
                        }
                        else {
                            $$("chkShowmanDate").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EXP_DATE") {
                        page.showexpdate = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkShowExpDate").prop('checked', true);
                        }
                        else {
                            $$("chkShowExpDate").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_BAT_NO") {
                        page.showbatno = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkShowBatchNo").prop('checked', true);
                        }
                        else {
                            $$("chkShowBatchNo").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_REORDER_LEVEL") {
                        page.showreordlel = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkShowReorLel").prop('checked', true);
                        }
                        else {
                            $$("chkShowReorLel").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_REORDER_QTY") {
                        page.showreordqty = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkShowReorQty").prop('checked', true);
                        }
                        else {
                            $$("chkShowReorQty").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MARKET_SHOPON") {
                        page.marketshopon = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkMarketShopOn").prop('checked', true);
                        }
                        else {
                            $$("chkMarketShopOn").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_TAX_CHANGES") {
                        page.taxchgedynamic = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkTaxChangesDynamically").prop('checked', true);
                        }
                        else {
                            $$("chkTaxChangesDynamically").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ADVANCE_SEARCH") {
                        page.advancedsearch = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkshowAdvanceSearch").prop('checked', true);
                        }
                        else {
                            $$("chkshowAdvanceSearch").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MODULE_TRAY") {
                        page.moduletray = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkModuleTray").prop('checked', true);
                        }
                        else {
                            $$("chkModuleTray").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EXP_DAYS_MODE") {
                        page.expirydaysmode = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkExpiryDaysModules").prop('checked', true);
                        }
                        else {
                            $$("chkExpiryDaysModules").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CUST_GST") {
                        page.showcustgst = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkCustGST").prop('checked', true);
                        }
                        else {
                            $$("chkCustGST").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_TAX_INCLUSIVE") {
                        page.taxinclusive = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkEnableTaxInsive").prop('checked', true);
                        }
                        else {
                            $$("chkEnableTaxInsive").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EXP_ALERT") {
                        page.expiryalert = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkExpiryAlert").prop('checked', true);
                        }
                        else {
                            $$("chkExpiryAlert").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_BILL_ADJUSTMENT") {
                        page.billadjustment = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkBillAdjustment").prop('checked', true);
                        }
                        else {
                            $$("chkBillAdjustment").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PRODUCT_TYPE") {
                        page.producttype = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkProductType").prop('checked', true);
                        }
                        else {
                            $$("chkProductType").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MANUFACTURE") {
                        page.enablemanufacture = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableManufacture").prop('checked', true);
                        }
                        else {
                            $$("chkEnableManufacture").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ALTER_UNIT") {
                        page.enablealternateunit = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkAlternateUnit").prop('checked', true);
                        }
                        else {
                            $$("chkAlternateUnit").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_STOCK_MAINTAINENCE") {
                        page.enablestockmain = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkStockMaintainence").prop('checked', true);
                        }
                        else {
                            $$("chkStockMaintainence").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SELLING_PRICE_EDITABLE") {
                        page.SellingPriceEditable = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSellingPriceEdit").prop('checked', true);
                        }
                        else {
                            $$("chkSellingPriceEdit").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SHOW_FREE") {
                        page.enablefree = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableFree").prop('checked', true);
                        }
                        else {
                            $$("chkEnableFree").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_RACK") {
                        page.enablerack = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableRack").prop('checked', true);
                        }
                        else {
                            $$("chkEnableRack").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SECOND_BILL") {
                        page.enablesecondbill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableSecondBill").prop('checked', true);
                        }
                        else {
                            $$("chkEnableSecondBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION") {
                        page.enablevariation = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableVariation").prop('checked', true);
                        }
                        else {
                            $$("chkEnableVariation").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_EXECUTIVE") {
                        page.enablesalesexecutive = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableSalesExecutive").prop('checked', true);
                        }
                        else {
                            $$("chkEnableSalesExecutive").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_HSN_CODE") {
                        page.enablehsncode = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableHsnCode").prop('checked', true);
                        }
                        else {
                            $$("chkEnableHsnCode").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SHOW_BARCODE") {
                        page.showbarcode = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkShowBarCode").prop('checked', true);
                        }
                        else {
                            $$("chkShowBarCode").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_POWISE_REPORT") {
                        page.showpowisereport = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPowiseReport").prop('checked', true);
                        }
                        else {
                            $$("chkPowiseReport").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SOWISE_REPORT") {
                        page.showsowisereport = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSowiseReport").prop('checked', true);
                        }
                        else {
                            $$("chkSowiseReport").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_STOCK_ALERT") {
                        page.enablestockalert = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableStockAlert").prop('checked', true);
                        }
                        else {
                            $$("chkEnableStockAlert").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CANCEL_BILL") {
                        page.enablecancelbill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkCancelBill").prop('checked', true);
                        }
                        else {
                            $$("chkCancelBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CASHIER_BILL") {
                        page.enablecashbill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkCashBill").prop('checked', true);
                        }
                        else {
                            $$("chkCashBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ITEM_DESCRIPTION") {
                        page.enableitemdescription = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkItemDescription").prop('checked', true);
                        }
                        else {
                            $$("chkItemDescription").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_INVENTORY_DETAILS") {
                        page.enableinventorydetails = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkInventoryDetails").prop('checked', true);
                        }
                        else {
                            $$("chkInventoryDetails").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_EXECUTIVE_REWARD") {
                        page.enablesalesexecutivereward = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesExecutiveRewards").prop('checked', true);
                        }
                        else {
                            $$("chkSalesExecutiveRewards").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PINCODE_MAPPING") {
                        page.chkPincodeMapping = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPincodeMapping").prop('checked', true);
                        }
                        else {
                            $$("chkPincodeMapping").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_QR_CODE") {
                        page.chkShowQRCode = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkShowQRCode").prop('checked', true);
                        }
                        else {
                            $$("chkShowQRCode").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_STOCK_MAINTANENCE") {
                        page.chkStockMaintain = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkStockMaintain").prop('checked', true);
                        }
                        else {
                            $$("chkStockMaintain").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SUBSCRIPTION") {
                        page.chkEnableSubscription = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableSubscription").prop('checked', true);
                        }
                        else {
                            $$("chkEnableSubscription").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "DEFAULT_BILL_DUE_DAYS") {
                        page.txtDefaultBillDueDays = item.sett_no;
                        $$("txtDefaultBillDueDays").value(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_CUSTOMER_LOGIN") {
                        page.chkEnableCustomerLogin = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableCustomerLogin").prop('checked', true);
                        }
                        else {
                            $$("chkEnableCustomerLogin").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SALES_EXECUTIVE_LOGIN") {
                        page.chkEnableSalesExecutiveLogin = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableSalesExecutiveLogin").prop('checked', true);
                        }
                        else {
                            $$("chkEnableSalesExecutiveLogin").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CASHIER_BARCODE") {
                        page.chkEnableCashierBarcode = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableCashierBarcode").prop('checked', true);
                        }
                        else {
                            $$("chkEnableCashierBarcode").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CUSTOMER_BANK_DETAILS") {
                        page.chkEnableCustomerBankDetails = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableCustomerBankDetails").prop('checked', true);
                        }
                        else {
                            $$("chkEnableCustomerBankDetails").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EXECUTIVE_BANK_DETAILS") {
                        page.chkEnableExecutiveBankDetails = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableExecutiveBankDetails").prop('checked', true);
                        }
                        else {
                            $$("chkEnableExecutiveBankDetails").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_DUE_DATE_ALERT") {
                        page.chkEnableDueDateAlert = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableDueDateAlert").prop('checked', true);
                        }
                        else {
                            $$("chkEnableDueDateAlert").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CUSTOMER_MOBILE") {
                        page.chkEnableCustomerMobile = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableCustomerMobile").prop('checked', true);
                        }
                        else {
                            $$("chkEnableCustomerMobile").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_DYNAMIC_BARCODE") {
                        page.chkEnableDynamicBarcode = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableDynamicBarcode").prop('checked', true);
                        }
                        else {
                            $$("chkEnableDynamicBarcode").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ITEM_SELECTION_MODE") {
                        page.ddlItemSelectionMode = item.sett_no;
                        $$("ddlItemSelectionMode").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_DC_BILL") {
                        page.chkEnableDCBill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableDCBill").prop('checked', true);
                        }
                        else {
                            $$("chkEnableDCBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CUSTOMER_IN_BILL") {
                        page.chkCustomerInBill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkCustomerInBill").prop('checked', true);
                        }
                        else {
                            $$("chkCustomerInBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VENDOR_IN_BILL") {
                        page.chkVendorInBill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkVendorInBill").prop('checked', true);
                        }
                        else {
                            $$("chkVendorInBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ATTRIBUTES_SEARCH") {
                        page.chkAttributeSearch = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkAttributeSearch").prop('checked', true);
                        }
                        else {
                            $$("chkAttributeSearch").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "CREDIT_DEBIT_NOTE") {
                        page.chkCreditDebitNote = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkCreditDebitNote").prop('checked', true);
                        }
                        else {
                            $$("chkCreditDebitNote").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SECONDARY_LANGUAGE") {
                        page.chkSecondaryLanguage = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSecondaryLanguage").prop('checked', true);
                        }
                        else {
                            $$("chkSecondaryLanguage").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "PACKAGE") {
                        page.chkItemPackage = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkItemPackage").prop('checked', true);
                        }
                        else {
                            $$("chkItemPackage").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PRICE_LIMIT") {
                        page.chkPriceLimit = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPriceLimit").prop('checked', true);
                        }
                        else {
                            $$("chkPriceLimit").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ADDITIONAL_TAX") {
                        page.chkAdditionalTax = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkAdditionalTax").prop('checked', true);
                        }
                        else {
                            $$("chkAdditionalTax").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SERIAL_NO_IN_POS") {
                        page.chkPosSerialNo = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPosSerialNo").prop('checked', true);
                        }
                        else {
                            $$("chkPosSerialNo").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ITEM_NOTES_IN_POS") {
                        page.chkPosItemNotes = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPosItemNotes").prop('checked', true);
                        }
                        else {
                            $$("chkPosItemNotes").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_CREATE_DEFAULT_PRICE") {
                        page.chkCreateDefaultPrice = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkCreateDefaultPrice").prop('checked', true);
                        }
                        else {
                            $$("chkCreateDefaultPrice").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ESHOPON_UPLOAD") {
                        page.chkEnableEshoponUpload = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableEshoponUpload").prop('checked', true);
                        }
                        else {
                            $$("chkEnableEshoponUpload").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EXCEL_UPLOAD") {
                        page.chkEnableExcelUpload = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableExcelUpload").prop('checked', true);
                        }
                        else {
                            $$("chkEnableExcelUpload").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_MULTIPLE_IMAGE") {
                        page.chkMultipleImage = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkMultipleImage").prop('checked', true);
                        }
                        else {
                            $$("chkMultipleImage").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ITEM_CLASS") {
                        page.chkItemClass = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkItemClass").prop('checked', true);
                        }
                        else {
                            $$("chkItemClass").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_DRAFT_BILL") {
                        page.chkDraftBill = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkDraftBill").prop('checked', true);
                        }
                        else {
                            $$("chkDraftBill").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_ITEM_LEVEL_PRICE") {
                        page.chkItemLevelPrice = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkItemLevelPrice").prop('checked', true);
                        }
                        else {
                            $$("chkItemLevelPrice").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_VARIATION_LEVEL_PRICE") {
                        page.chkVariationLevelPrice = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkVariationLevelPrice").prop('checked', true);
                        }
                        else {
                            $$("chkVariationLevelPrice").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SUBSCRIPTION_IP_DETAILS") {
                        page.chkSubscriptionIpDetails = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSubscriptionIpDetails").prop('checked', true);
                        }
                        else {
                            $$("chkSubscriptionIpDetails").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SUBSCRIPTION_LAST_MILE_DETAILS") {
                        page.chkSubscriptionLastMileDetails = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSubscriptionLastMileDetails").prop('checked', true);
                        }
                        else {
                            $$("chkSubscriptionLastMileDetails").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SUBSCRIPTION_BILLING_DETAILS") {
                        page.chkSubscriptionBillingDetails = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSubscriptionBillingDetails").prop('checked', true);
                        }
                        else {
                            $$("chkSubscriptionBillingDetails").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_SUBSCRIPTION_INSTALLATION_ADDRESS") {
                        page.chkSubscriptionInstallationAddress = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSubscriptionInstallationAddress").prop('checked', true);
                        }
                        else {
                            $$("chkSubscriptionInstallationAddress").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_NEW_ITEM_IN_POS") {
                        page.chkNewItemInPos = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkNewItemInPos").prop('checked', true);
                        }
                        else {
                            $$("chkNewItemInPos").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SHOW_SKU_COLUMN_IN_SALES") {
                        page.chkSKUInSales = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSKUInSales").prop('checked', true);
                        }
                        else {
                            $$("chkSKUInSales").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "SHOW_CUSTOMER_COMPANY_IN_SALES") {
                        page.chkShowCustomerCompanyInSales = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkShowCustomerCompanyInSales").prop('checked', true);
                        }
                        else {
                            $$("chkShowCustomerCompanyInSales").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "PURCHASE_SKU_SEARCH") {
                        page.ddlSearchSKUMode = item.sett_no;
                        $$("ddlSearchSKUMode").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_GLOBAL_EXP_ALERT") {
                        page.chkGlobalExpiryAlert = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkGlobalExpiryAlert").prop('checked', true);
                        }
                        else {
                            $$("chkGlobalExpiryAlert").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "COUNT_AFTER_POINTS") {
                        page.txtCountDegitsAfterPoints = item.sett_no;
                        $$("txtCountDegitsAfterPoints").value(item.value_1);
                    }
                    if (item.sett_key == "POS_PENDING_SHOW_FIRST_PANEL") {
                        page.chkShowPOSFirstPanel = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkShowPOSFirstPanel").prop('checked', true);
                        }
                        else {
                            $$("chkShowPOSFirstPanel").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "POS_PENDING_SHOW_SECOND_PANEL") {
                        page.chkShowPOSSecondPanel = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkShowPOSSecondPanel").prop('checked', true);
                        }
                        else {
                            $$("chkShowPOSSecondPanel").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_REMOVE") {
                        page.chkEnableRemove = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkEnableRemove").prop('checked', true);
                        }
                        else {
                            $$("chkEnableRemove").prop('checked', false);
                        }
                    }
                });
            });
        }
        page.events.btnCommunication_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").show();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            page.settingApi.searchSettings("", "", "value_2='Communication' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                $(data).each(function (i, item) {
                    if (item.sett_key == "ENABLE_RECEIPT_PRINT") {
                        page.enable_receipt_print = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkReceipt").prop('checked', true);
                        }
                        else {
                            $$("chkReceipt").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_INVOICE_PRINT") {
                        page.enable_invoice_print = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkInvoice").prop('checked', true);
                        }
                        else {
                            $$("chkInvoice").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_INVOCE_SMS") {
                        page.enable_invoice_sms = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkSMS").prop('checked', true);
                        }
                        else {
                            $$("chkSMS").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_EMAIL") {
                        page.enable_email = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkEmail").prop('checked', true);
                        }
                        else {
                            $$("chkEmail").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_JASPER") {
                        page.enable_jasper = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkJasper").prop('checked', true);
                        }
                        else {
                            $$("chkJasper").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_IMAGE") {
                        page.enable_image = item.sett_no;

                        if (item.value_1 == "true") {
                            $$("chkImage").prop('checked', true);
                        }
                        else {
                            $$("chkImage").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "RECEIPT_PRINTER") {
                        page.receipt_printer = item.sett_no;

                        $$("txtReciptPrinter").val(item.value_1);
                    }
                    if (item.sett_key == "RECEIPT_PRINTER_NAME") {
                        page.receipt_printer_name = item.sett_no;

                        $$("txtReciptPrinterName").val(item.value_1);
                    }
                    if (item.sett_key == "QR_PRINTER_NAME") {
                        page.txtQRPrinterName = item.sett_no;

                        $$("txtQRPrinterName").val(item.value_1);
                    }
                    if (item.sett_key == "RECEIPT_TEMPLATE") {
                        page.receipt_template = item.sett_no;

                        $$("ddlReciptTemplate").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "BARCODE_PRINTER") {
                        page.barcode_printer = item.sett_no;

                        $$("txtBarcodePrinter").val(item.value_1);
                    }
                    if (item.sett_key == "BARCODE_PRINTER_NAME") {
                        page.barcode_printer_name = item.sett_no;

                        $$("txtBarcodePrinterName").val(item.value_1);
                    }
                    if (item.sett_key == "BARCODE_PRICE_ALPHABET") {
                        page.txtBarcodePriceAlphabet = item.sett_no;

                        $$("txtBarcodePriceAlphabet").val(item.value_1);
                    }
                    if (item.sett_key == "BARCODE_TEMPLATE") {
                        page.barcode_template = item.sett_no;

                        $$("ddlBarcodeTemplate").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "QR_TEMPLATE") {
                        page.ddlQrTemplate = item.sett_no;

                        $$("ddlQrTemplate").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "INVOICE_PRINTER_URL") {
                        page.invoice_printer = item.sett_no;

                        $$("txtInvoicePrinter").val(item.value_1);
                    }
                    if (item.sett_key == "INVOICE_TEMPLATE") {
                        page.invoice_template = item.sett_no;

                        $$("ddlInvoiceTemplate").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "SMS_GATEWAY") {
                        page.sms_gateway = item.sett_no;

                        $$("txtSGateWay").val(item.value_1);
                    }
                    if (item.sett_key == "SMS_USERID") {
                        page.sms_user = item.sett_no;

                        $$("txtSUserId").val(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_SMS_URL") {
                        page.sms_url = item.sett_no;

                        $$("txtSSMSURL").val(item.value_1);
                    }
                    if (item.sett_key == "SMS_COMPANY_ID") {
                        page.sms_cmp_id = item.sett_no;

                        $$("txtSSMSCOMPID").val(item.value_1);
                    }
                    if (item.sett_key == "SMS_SENDER_NO") {
                        page.sms_send_no = item.sett_no;

                        $$("txtSSMSSENDERNO").val(item.value_1);
                    }
                    if (item.sett_key == "EMAIL_GATEWAY") {
                        page.email_gateway = item.sett_no;

                        $$("txtEGateWay").val(item.value_1);
                    }
                    if (item.sett_key == "EMAIL_USER_ID") {
                        page.email_user = item.sett_no;

                        $$("txtEUserId").val(item.value_1);
                    }
                    if (item.sett_key == "EMAIL_PASSWORD") {
                        page.email_password = item.sett_no;

                        $$("txtEPassword").val(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_EMAIL_URL") {
                        page.email_url = item.sett_no;

                        $$("txtEEMAILURL").val(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_IMAGE_UPLOAD_URL") {
                        page.imgupdurl = item.sett_no;

                        $$("txtImgUpdURL").val(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_IMAGE_FILE_PATH") {
                        page.imgfilepath = item.sett_no;

                        $$("txtImgFilPath").val(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_IMAGE_DOWNLOAD_URL") {
                        page.imgdndurl = item.sett_no;

                        $$("txtImgDnldURL").val(item.value_1);
                    }
                    if (item.sett_key == "ENABLE_IMAGE_DOWNLOAD_PATH") {
                        page.imgdndpath = item.sett_no;

                        $$("txtImgDnldPath").val(item.value_1);
                    }
                    if (item.sett_key == "REPORT_PATH") {
                        page.reppath = item.sett_no;

                        $$("txtReportPath").val(item.value_1);
                    }
                    if (item.sett_key == "PRINT_PAPER_SIZE") {
                        page.prtpersize = item.sett_no;

                        $$("txtPrintPaperSize").val(item.value_1);
                    }
                    if (item.sett_key == "JASPER_COMPANY_NAME") {
                        page.jaspcmyname = item.sett_no;

                        $$("txtJaspCompName").val(item.value_1);
                    }
                });
            });
        }
        page.events.btnLayout_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlOthersSettings").hide();
            $$("pnlOtherseShopOnSettings").hide();

            $$("pnlLayout").show();
            page.settingApi.searchSettings("", "", "value_2='Layout' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                $(data).each(function (i, item) {
                    if (item.sett_key == "GRID_HEADER_FONT") {
                        page.grd_head_font_size = item.sett_no;

                        $$("txtGridHeaderFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "FONT_SIZE") {
                        page.font_size = item.sett_no;

                        $$("txtFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "HEADING_COLOR") {
                        page.head_color = item.sett_no;

                        $("#Headcolor").val(item.value_1);
                    }
                    if (item.sett_key == "LABEL_COLOR") {
                        page.lab_color = item.sett_no;

                        $("#LabBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "PRIMARY_READ_BUTTON") {
                        page.prim_but_bg_color = item.sett_no;

                        $("#PrimaryButtBGcolor").val(item.value_1);
                    }
                    if (item.sett_key == "SECONDARY_BUTTON") {
                        page.sec_butt_bg_color = item.sett_no;

                        $("#SecButtBGcolor").val(item.value_1);
                    }
                    if (item.sett_key == "GRID_COLOR") {
                        page.grd_color = item.sett_no;

                        $("#Gridcolor").val(item.value_1);
                    }
                    if (item.sett_key == "TEXT_COLOR") {
                        page.txt_color = item.sett_no;

                        $("#Textcolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_COLOR") {
                        page.input_color = item.sett_no;

                        $("#Inputcolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_FONT") {
                        page.input_font = item.sett_no;

                        $$("txtInputFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_READ_COLOR") {
                        page.butt_font_color = item.sett_no;

                        $("#InButReadcolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_READ_BG_COLOR") {
                        page.butt_back_color = item.sett_no;

                        $("#InButBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_READ_HOVER_COLOR") {
                        page.butt_color_mouse_over = item.sett_no;

                        $("#InButReadHovercolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_WRITE_COLOR") {
                        page.right_butt_bg_color = item.sett_no;

                        $("#InButWritecolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_WRITE_BACK_COLOR") {
                        page.butt_font_color_mouse = item.sett_no;

                        $("#InButWriteBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_WRITE_HOVER_COLOR") {
                        page.butt_write_hover_color = item.sett_no;

                        $("#InButHovercolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_SEC_COLOR") {
                        page.input_butt_sec_color = item.sett_no;

                        $("#InButSeccolor").val(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_SEC_BACK_COLOR") {
                        page.input_butt_sec_back_color = item.sett_no;

                        $("#InButSecBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "BUTTON_COLOR") {
                        page.butt_color = item.sett_no;

                        $("#Buttoncolor").val(item.value_1);
                    }
                    if (item.sett_key == "GRID_ROW_FONT") {
                        page.grd_row_font = item.sett_no;

                        $$("txtGridRowFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "TAB_HEADER_FONT") {
                        page.tab_head_font = item.sett_no;

                        $$("txtTabHeadFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "TAB_BACK_COLOR") {
                        page.tab_bg_color = item.sett_no;

                        $("#TabBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "TAB_SEL_COLOR") {
                        page.tab_sel_color = item.sett_no;

                        $("#SelectTabcolor").val(item.value_1);
                    }
                    if (item.sett_key == "TAB_COLOR") {
                        page.tab_color = item.sett_no;

                        $("#Tabcolor").val(item.value_1);
                    }
                    if (item.sett_key == "LABEL_FONT") {
                        page.lbl_font_size = item.sett_no;

                        $$("txtLabelFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "LABEL_HEADER_COLOR") {
                        page.lbl_head_color = item.sett_no;

                        $("#LabelHeadcolor").val(item.value_1);
                    }
                    if (item.sett_key == "LABEL_HEADER_FONT") {
                        page.lbl_head_font = item.sett_no;

                        $$("txtLabelHeadFontsize").val(item.value_1);
                    }
                    if (item.sett_key == "MSG_PANEL_COLOR") {
                        page.msg_pnl_color = item.sett_no;

                        $("#MessagePanelcolor").val(item.value_1);
                    }
                    if (item.sett_key == "GRD_BACK_COLOR") {
                        page.grd_back_color = item.sett_no;

                        $("#GridBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "GRD_HEADER_COLOR") {
                        page.grd_head_color = item.sett_no;

                        $("#GridHeadcolor").val(item.value_1);
                    }
                    if (item.sett_key == "DETAIL_BACK_COLOR") {
                        page.det_screen_back_color = item.sett_no;

                        $("#DetailScreencolor").val(item.value_1);
                    }
                    if (item.sett_key == "ACTION_BACK_COLOR") {
                        page.act_screen_color = item.sett_no;

                        $("#ActScreenBackcolor").val(item.value_1);
                    }
                    if (item.sett_key == "S_BUTTON_COLOR") {
                        page.sec_butt_color = item.sett_no;

                        $("#SecButtoncolor").val(item.value_1);
                    }
                    if (item.sett_key == "GRD_ODD_ROW_COLOR") {
                        page.grd_odd_row_color = item.sett_no;

                        $("#GridOddRowcolor").val(item.value_1);
                    }
                    if (item.sett_key == "GRD_EVEN_ROW_COLOR") {
                        page.grd_even_row_color = item.sett_no;

                        $("#GridEvenRowcolor").val(item.value_1);
                    }
                    if (item.sett_key == "BACK_GROUND") {
                        page.background = item.sett_no;

                        $("#Backgroundcolor").val(item.value_1);
                    }
                    if (item.sett_key == "SEARCH_COLOR") {
                        page.sear_pnl_bg_color = item.sett_no;
                        $("#SearchPanelcolor").val(item.value_1);
                    }
                    if (item.sett_key == "SEARCH_GRID_HEIGHT") {
                        page.txtSearchGridHeight = item.sett_no;
                        $$("txtSearchGridHeight").value(item.value_1);
                    }
                    if (item.sett_key == "INPUT_BUTTON_HEIGHT") {
                        page.txtInputButtonHeight = item.sett_no;
                        $$("txtInputButtonHeight").value(item.value_1);
                    }
                    if (item.sett_key == "CurrentLanguage") {
                        page.ddlCurrentLanguage = item.sett_no;
                        $$("ddlCurrentLanguage").selectedValue(item.value_1);
                    }
                    if (item.sett_key == "SecondaryLanguage") {
                        page.txtSecondaryLanguage = item.sett_no;
                        $$("txtSecondaryLanguage").value(item.value_1);
                    }
                    if (item.sett_key == "CurrentSecondaryLanguage") {
                        page.ddlCurrentSecondaryLanguage = item.sett_no;
                        $$("ddlCurrentSecondaryLanguage").selectedValue(item.value_1);
                    }
                    //if (item.sett_key == "ENABLE_SALES_SECONDARY_LANGUAGE") {
                    //    page.ddlSalesSecondaryLanguage = item.sett_no;
                    //    $$("ddlSalesSecondaryLanguage").selectedValue(item.value_1);
                    //}
                    if (item.sett_key == "ENABLE_SALES_SECONDARY_LANGUAGE") {
                        page.chkSalesSecondaryLanguage = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkSalesSecondaryLanguage").prop('checked', true);
                        }
                        else {
                            $$("chkSalesSecondaryLanguage").prop('checked', false);
                        }
                    }
                    if (item.sett_key == "ENABLE_PURCHASE_SECONDARY_LANGUAGE") {
                        page.chkPurchaseSecondaryLanguage = item.sett_no;
                        if (item.value_1 == "true") {
                            $$("chkPurchaseSecondaryLanguage").prop('checked', true);
                        }
                        else {
                            $$("chkPurchaseSecondaryLanguage").prop('checked', false);
                        }
                    }
                });
            });
        }
        page.events.btnSaveShopOnOthers_click = function () {
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlLayout").hide();
            $$("pnlOthersSettings").show();
            $$("pnlOtherseShopOnSettings").show();

            $$("grdeShopOnSettings").height("480px");
            $$("grdeShopOnSettings").width("2000px");
            $$("grdeShopOnSettings").setTemplate({
                selection: "Single", paging: true, pageSize: 100,
                columns: [
                    { 'name': " ", 'rlabel': ' ', 'width': "50px", itemTemplate: '<button id="ideShopOnSaveSettings" >Save</button>' },
                    { 'name': "SETT NO", 'rlabel': 'SETT NO', 'width': "80px", 'dataField': "sett_no", filterType: "Text" },
                    { 'name': "KEY", 'rlabel': 'KEY', 'width': "100px", 'dataField': "sett_key", filterType: "Text", editable: true },
                    { 'name': "DESCRIPTION", 'DESCRIPTION': 'Item Name', 'width': "200px", 'dataField': "sett_desc", filterType: "Text", editable: true },
                    { 'name': "VALUE1", 'rlabel': 'VALUE1', 'width': "145px", 'dataField': "value_1", filterType: "Text", editable: true },
                    { 'name': "VALUE2", 'rlabel': 'VALUE2', 'width': "145px", 'dataField': "value_2", filterType: "Text", editable: true },
                    { 'name': "VALUE3", 'rlabel': 'VALUE3', 'width': "145px", 'dataField': "value_3", filterType: "Text", editable: true },


                ]
            });
            $$("grdeShopOnSettings").rowBound = function (row, item) {
                $(row).find("[id=ideShopOnSaveSettings]").click(function () {
                    var settData = {
                        sett_no: item.sett_no,
                        sett_key: $(row).find("[datafield=sett_key]").find("input").val(),
                        sett_desc: $(row).find("[dataField=sett_desc]").find("input").val(),
                        value_1: $(row).find("[dataField=value_1]").find("input").val(),
                        value_2: $(row).find("[dataField=value_2]").find("input").val(),
                        value_3: $(row).find("[dataField=value_3]").find("input").val(),
                    }
                    page.settingApi.eShopOnPutValue(settData, function (data) {
                        alert("Settings updated successfully...!");
                    })
                })
            }
            var settData = {
                select_expression: " count(*) cnt ",
                start_record: "",
                end_record: "",
                filter_expression: "comp_id=" + CONTEXT.ESHOPON_COMP_ID,
                sort_expression: "sett_key"
            }
            page.settingApi.eShopOnSearchValue(settData, function (data) {
                var totalRecord = data[0].cnt;
                $$("grdeShopOnSettings").dataBind({

                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        settData = {
                            select_expression: "",
                            start_record: start,
                            end_record: end,
                            filter_expression: "comp_id=" + CONTEXT.ESHOPON_COMP_ID,
                            sort_expression: "sett_key"
                        }
                        page.settingApi.eShopOnSearchValue(settData, function (data) {
                            callback(data, totalRecord);
                            $$("grdeShopOnSettings").edit(true);
                        })
                    }
                })

            });
        }
        page.events.btnOtherSettings_click = function () {
            page.events.btnSaveShopOnOthers_click();
            $$("pnlGeneral").hide();
            $$("pnlModules").hide();
            $$("pnlFinfacts").hide();
            $$("pnlCommunication").hide();
            $$("pnlPurchase").hide();
            $$("pnlSales").hide();
            $$("pnlOthersSettings").show();
            $$("pnlOtherseShopOnSettings").show();

            $$("grdShopOnSettings").height("480px");
            $$("grdShopOnSettings").width("2000px");
            $$("grdShopOnSettings").setTemplate({
                selection: "Single", paging: true, pageSize: 100,
                columns: [
                    { 'name': " ", 'rlabel': ' ', 'width': "50px", itemTemplate: '<button id="idSaveSettings" >Save</button>' },
                    { 'name': "SETT NO", 'rlabel': 'SETT NO', 'width': "80px", 'dataField': "sett_no", filterType: "Text" },
                    { 'name': "KEY", 'rlabel': 'KEY', 'width': "100px", 'dataField': "sett_key", filterType: "Text" , editable:true },
                    { 'name': "DESCRIPTION", 'DESCRIPTION': 'Item Name', 'width': "200px", 'dataField': "sett_desc", filterType: "Text", editable: true },
                    { 'name': "VALUE1", 'rlabel': 'VALUE1', 'width': "145px", 'dataField': "value_1", filterType: "Text", editable: true },
                    { 'name': "VALUE2", 'rlabel': 'VALUE2', 'width': "145px", 'dataField': "value_2", filterType: "Text", editable: true },
                    { 'name': "VALUE3", 'rlabel': 'VALUE3', 'width': "145px", 'dataField': "value_3", filterType: "Text", editable: true },
                    

                ]
            });
            $$("grdShopOnSettings").rowBound = function (row, item) {
                $(row).find("[id=idSaveSettings]").click(function () {
                    var settData = {
                        sett_no: item.sett_no,
                        sett_key: $(row).find("[datafield=sett_key]").find("input").val(),
                        sett_desc: $(row).find("[dataField=sett_desc]").find("input").val(),
                        value_1: $(row).find("[dataField=value_1]").find("input").val(),
                        value_2: $(row).find("[dataField=value_2]").find("input").val(),
                        value_3: $(row).find("[dataField=value_3]").find("input").val(),
                    }
                    page.settingApi.putValue(settData, function (data) {
                        alert("Settings updated successfully...!");
                    })
                })
            }
            var settData = {
                select_expression: " count(*) cnt ",
                start_record: "",
                end_record: "",
                filter_expression: "comp_id=" + getCookie("user_company_id"),
                sort_expression: "sett_key"
            }
            page.settingApi.searchValue(settData, function (data) {
                var totalRecord = data[0].cnt;
                $$("grdShopOnSettings").dataBind({

                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        settData = {
                            select_expression: "",
                            start_record: start,
                            end_record: end,
                            filter_expression: "comp_id=" + getCookie("user_company_id"),
                            sort_expression: "sett_key"
                        }
                        page.settingApi.searchValue(settData, function (data) {
                            callback(data, totalRecord);
                            $$("grdShopOnSettings").edit(true);
                            
                        })
                    }
                })
                
            });
        }
        page.events.page_load = function () {
            page.events.btnGeneral_click();
            if (CONTEXT.ENABLE_ESHOPON_UPLOAD) {
                $$("btnUploadGen").show();
                $$("btnDownloadGen").show();
            }
            else {
                $$("btnUploadGen").hide();
                $$("btnDownloadGen").hide();
            }
        }
    });
}

