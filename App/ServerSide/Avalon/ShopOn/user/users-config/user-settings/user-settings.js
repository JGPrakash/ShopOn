$.fn.settingsManagePage = function () {
    return $.pageController.getPage(this, function (page, $$) {

        page.settService = new SettingService();
        page.revenueService = new RevenueService();
        page.accaccountService = new AccAccountService();
        page.salestaxService = new SalesTaxService();


        page.events.btnReset_click = function () {
            if(confirm("Do you wish to factory reset datas. you may lose all your datas...!!!"))
            {
                $$("msgPanel").show("Reseting data...");
                    page.settService.factoryReset(function (data) {
                        $$("msgPanel").show("Factory rest done successfully...!");
                        });
            }
            $$("msgPanel").hide();
        },
        page.events.btnUploadImage_click = function () {
            var data = new FormData();

            var files = $("#fileUpload").get(0).files;

            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                data.append("file", files[0]);

                // Make Ajax request with the contentType = false, and procesDate = false
                var ajaxRequest = $.ajax({
                    type: "POST",
                     url: "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
                    //url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                    headers: {
                        //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
                        //'file-path': "/opt/tomcat/webapps/images/upload/shopondev/"
                        //'file-path': CONTEXT.ImageFilePath + $$("lblItemNo").value() + '/'
                        'file-path': CONTEXT.REPORT_PATH
                },
                    contentType: false,
                    processData: false,
                    data: data
                });

                ajaxRequest.done(function (xhr, textStatus) {
                    //alert("Picture uploaded successfully.");
                    $$("msgPanel").show("Picture uploaded successfully...!");
                });
            }
            else {
                //alert('Please select only the images before uploading it');
                $$("msgPanel").show("Please select only the images before uploading it");
            }
        }
        page.saveGeneral = function () {
            $("textarea").each(function () {
                this.value = this.value.replace(/,/g, "-");
            });
            //Company Name
            var data1 = {
                sett_desc: 'Company Name',
                sett_key: 'CompanyName',
                value_1: $$("txtCompanyGen").val(),
                value_2: "General",
                value_3: "Text",
            }
            $$("msgPanel").show("Inserting company name...");
            page.settService.getMaxSettingDetails(function (maxNo, callback) {
                sett_no = maxNo[0].sett_no;
                page.settService.insertSettings(data1, sett_no, function () {

                    //Owner Name
                    var data2 = {
                        sett_desc: 'Owner Name',
                        sett_key: 'OwnerName',
                        value_1: $$("txtOwnerGen").val(),
                        value_2: "General",
                        value_3: "Text",
                    }
                    $$("msgPanel").show("Company name inserted successfully...!");
                    $$("msgPanel").show("Inserting owner name...");
                    page.settService.getMaxSettingDetails(function (maxNo, callback) {
                        sett_no = maxNo[0].sett_no;
                        page.settService.insertSettings(data2, sett_no, function () {

                            //Phone No
                            var data3 = {
                                sett_desc: 'Phone No',
                                sett_key: 'PhoneNo',
                                value_1: $$("txtPhoneNo").val(),
                                value_2: "General",
                                value_3: "Text",
                            }
                            $$("msgPanel").show("owner name inserted successfully...!");
                            $$("msgPanel").show("Inserting phone no...");
                            page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                sett_no = maxNo[0].sett_no;
                                page.settService.insertSettings(data3, sett_no, function () {

                                    //E-mail
                                    var data4 = {
                                        sett_desc: 'E-mail',
                                        sett_key: 'E-mail',
                                        value_1: $$("txtEmail").val(),
                                        value_2: "General",
                                        value_3: "Text",
                                    }
                                    $$("msgPanel").show("Phone no inserted successfully...!");
                                    $$("msgPanel").show("Inserting e-mail address...");
                                    page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                        sett_no = maxNo[0].sett_no;
                                        page.settService.insertSettings(data4, sett_no, function () {
                                            //Company Address
                                            var data5 = {
                                                sett_desc: 'Company Address',
                                                sett_key: 'CompanyAddress',
                                                value_1: $$("txtCmpnyAddGen").val(),
                                                value_2: "General",
                                                value_3: "Text",
                                            }
                                            $$("msgPanel").show("E-mail address inserted successfully...!");
                                            $$("msgPanel").show("Inserting company address...");
                                            page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                sett_no = maxNo[0].sett_no;
                                                page.settService.insertSettings(data5, sett_no, function () {
                                                    $$("msgPanel").show("Company address inserted successfully...!");
                                                    var data6 = {
                                                        sett_desc: 'Logo Name',
                                                        sett_key: 'LogoName',
                                                        value_1: $$("txtLogoName").val(),
                                                        value_2: "General",
                                                        value_3: "Text",
                                                    }
                                                    $$("msgPanel").show("Inserting logo name...");
                                                    page.settService.getMaxSettingDetails(function (maxNo, callback) {
                                                        sett_no = maxNo[0].sett_no;
                                                        page.settService.insertSettings(data6, sett_no, function () {
                                                            $$("msgPanel").show("Logo name inserted successfully...!");
                                                            $$("msgPanel").hide();
                                                        });
                                                    });
                                                    //page.loadGen();
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

        //Updating Company Details in Settings for General Tab
        page.events.btnSaveGen_click = function () {
            if ($$("txtCompanyGen").val() == "")
            {
                $$("msgPanel").show("Enter company name...!");
                $$("txtCompanyGen").focus();
            }
            else if ($$("txtOwnerGen").val() == "")
            {
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
            
        };
        $("[controlid=txtCmpnyAddGen]").bind("keypress", function (e) {

        });
        page.loadGen = function () {
            $$("txtCompanyGen").val('');
            $$("txtOwnerGen").val('');
            $$("txtPhoneNo").val('');
            $$("txtEmail").val('');
            $$("txtCmpnyAddGen").val('');
        };

        // Update the setting values
        page.events.btnUpdate_click = function () {
            
            //Updating Company Name
            var data1 = {
                sett_no: 5,
                sett_desc: 'finfacts company',
                sett_key: 'CompanyId',
                value_1: $$("ddlCompany").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            //$(".detail-info").progressBar("show")

            $$("msgPanel").show("Updating company...");
            page.settService.updateSetting(data1, function () {
                $$("msgPanel").show("Company updated successfully...!");
            });
            //Period
            var data2 = {
                sett_no: 6,
                sett_desc: 'Period',
                sett_key: 'PeriodId',
                value_1: $$("ddlPeriod").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").show("Updating period...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").show("Period Updated successfully...!");
            });
            //Sales Account Cash
            var data2 = {
                sett_no: 7,
                sett_desc: 'SalesAccountCash',
                sett_key: 'SalesAccount',
                value_1: $$("ddlSalesAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("updating SalesAccount...");
            page.settService.updateSetting(data2, function () {
                $$("msgPanel").flash("SalesAccount Updated...!");
            });
            //Purchase Account Cash
            var data3 = {
                sett_no: 8,
                sett_desc: 'PurchaseAccountCash',
                sett_key: 'PurchaseAccount',
                value_1: $$("ddlPurchaseAccount").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating purchase account...");
            page.settService.updateSetting(data3, function () {
                $$("msgPanel").flash("Purchase account updated...!");
            });

            //Sales Account Bank
            var data4 = {
                sett_no: 186,
                sett_desc: 'SalesAccountBank',
                sett_key: 'SalesAccountBank',
                value_1: $$("ddlSalesAccountBank").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("updating SalesAccountBank...");
            page.settService.updateSetting(data4, function () {
                $$("msgPanel").flash("SalesAccountBank Updated...!");
            });
            //Purchase Account Bank
            var data5 = {
                sett_no: 187,
                sett_desc: 'PurchaseAccountBank',
                sett_key: 'PurchaseAccountBank',
                value_1: $$("ddlPurchaseAccountBank").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating PurchaseAccountBank account...");
            page.settService.updateSetting(data5, function () {
                $$("msgPanel").flash("Purchase PurchaseAccountBank updated...!");
            });

            //Sales Account Reward
            var data6 = {
                sett_no: 188,
                sett_desc: 'SalesAccountReward',
                sett_key: 'SalesAccountReward',
                value_1: $$("ddlSalesAccountReward").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("updating SalesAccountReward...");
            page.settService.updateSetting(data6, function () {
                $$("msgPanel").flash("SalesAccountReward Updated...!");
            });
            //Purchase Account Reward
            var data7 = {
                sett_no: 189,
                sett_desc: 'PurchaseAccountReward',
                sett_key: 'PurchaseAccountReward',
                value_1: $$("ddlPurchaseAccountReward").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating PurchaseAccountReward account...");
            page.settService.updateSetting(data7, function () {
                $$("msgPanel").flash("Purchase PurchaseAccountReward updated...!");
            });


            //Sales Account Coupon
            var data8 = {
                sett_no: 190,
                sett_desc: 'SalesAccountCoupon',
                sett_key: 'SalesAccountCoupon',
                value_1: $$("ddlSalesAccountCoupon").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating SalesAccountCoupon...");
            page.settService.updateSetting(data8, function () {
                $$("msgPanel").flash("SalesAccountCoupon Updated...!");
            });
            //Purchase Account Coupon
            var data9 = {
                sett_no: 191,
                sett_desc: 'PurchaseAccountCoupon',
                sett_key: 'PurchaseAccountCoupon',
                value_1: $$("ddlPurchaseAccountCoupon").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").flash("Updating PurchaseAccountCoupon account...");
            page.settService.updateSetting(data9, function () {
                $$("msgPanel").flash("Purchase PurchaseAccountCoupon updated...!");
            });

            //var data4 = {
            //    sett_no: 14,
            //    sett_desc: 'backgroundcolor',
            //    sett_key: 'BackgroundColor',
            //    value_1: document.getElementById("background-color").value,
            //    value_2: "Color",
            //    value_3: "Dropdown",
            //}
            //$$("msgPanel").show("Updating BackgroundColor...");
            //page.settService.updateSetting(data4, function () {
            //    $$("msgPanel").show("PurchaseAccount Updated...");
            //});
            var data10 = {
                sett_no: 44,
                sett_desc: 'tax',
                sett_key: 'defaultTax',
                value_1: $$("ddlDefaultTax").selectedValue(),
                value_2: "Finfacts",
                value_3: "Dropdown",
            }
            $$("msgPanel").show("Updating tax...");
            page.settService.updateSetting(data10, function () {
                $$("msgPanel").show("Purchase account updated...!");
                //$(".detail-info").progressBar("hide")

            });

            //$(".detail-info").progressBar("hide")
            $$("msgPanel").hide();  
        };

        //page.events = {

        


        page.events.page_load= function () {
        var companyDataFinfacts = [];
       /* page.revenueService.getCompanyName(function (compData) {
            $(compData).each(function (i, dataItem) {
                companyDataFinfacts.push({
                    value: dataItem.comp_id,
                    text: dataItem.comp_name
                });
            });

        });*/
        $$("pnlDetail").show();
       
    
        $$("ddlCompany").selectionChange(function (data) {
            page.comp_id = data.comp_id;
            page.revenueService.getPeriod($$("ddlCompany").selectedValue(), function (data) {
                $$("ddlPeriod").dataBind(data, "per_id", "per_name");
                page.accaccountService.getAccount(page.comp_id, function (data) {
                    $$("ddlSalesAccount").dataBind(data, "acc_id", "acc_name");
                    $$("ddlPurchaseAccount").dataBind(data, "acc_id", "acc_name");
                    $$("ddlSalesAccountReward").dataBind(data, "acc_id", "acc_name");
                    $$("ddlPurchaseAccountReward").dataBind(data, "acc_id", "acc_name");
                    $$("ddlSalesAccountBank").dataBind(data, "acc_id", "acc_name");
                    $$("ddlPurchaseAccountBank").dataBind(data, "acc_id", "acc_name");
                    $$("ddlSalesAccountCoupon").dataBind(data, "acc_id", "acc_name");
                    $$("ddlPurchaseAccountCoupon").dataBind(data, "acc_id", "acc_name");

                });
                page.salestaxService.getActiveSalesTax(function (data) {
                    $$("ddlDefaultTax").dataBind(data, "sales_tax_no", "sales_tax_name","None");
                });
            });

        });
        $$("ddlPeriod").selectionChange(function (data) {
            page.per_id = data.per_id;
        });


        page.settService.getFinfactsettings(function (finfactsData) {
            page.revenueService.getCompanyName(function (data) {
                $$("ddlCompany").dataBind(data, "comp_id", "comp_name","Select");
        
                $(finfactsData).each(function (i, item) {
                    if (item.sett_key == "CompanyId") {
                        $$("ddlCompany").selectedValue(item.value_1);
                        page.comp_id = item.value_1;

                    }
                    if (item.sett_key == "PeriodId"){
                       
                        page.revenueService.getPeriod($$("ddlCompany").selectedValue(), function (periodData) {
                            $$("ddlPeriod").dataBind(periodData, "per_id", "per_name");
                            $$("ddlPeriod").selectedValue(item.value_1);
                        });

                    }
                    if (item.sett_key == "SalesAccount") {

                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlSalesAccount").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlSalesAccount").selectedValue(item.value_1);

                        });
                    }
                    if (item.sett_key == "PurchaseAccount") {
                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlPurchaseAccount").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlPurchaseAccount").selectedValue(item.value_1);


                        });



                    }

                    if (item.sett_key == "SalesAccountReward") {

                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlSalesAccountReward").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlSalesAccountReward").selectedValue(item.value_1);

                        });
                    }
                    if (item.sett_key == "PurchaseAccountReward") {
                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlPurchaseAccountReward").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlPurchaseAccountReward").selectedValue(item.value_1);


                        });



                    }


                    if (item.sett_key == "SalesAccountBank") {

                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlSalesAccountBank").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlSalesAccountBank").selectedValue(item.value_1);

                        });
                    }
                    if (item.sett_key == "PurchaseAccountBank") {
                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlPurchaseAccountBank").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlPurchaseAccountBank").selectedValue(item.value_1);


                        });



                    }



                    if (item.sett_key == "SalesAccountCoupon") {

                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlSalesAccountCoupon").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlSalesAccountCoupon").selectedValue(item.value_1);

                        });
                    }
                    if (item.sett_key == "PurchaseAccountCoupon") {
                        page.accaccountService.getAccount(page.comp_id, function (accounts) {
                            $$("ddlPurchaseAccountCoupon").dataBind(accounts, "acc_id", "acc_name");
                            $$("ddlPurchaseAccountCoupon").selectedValue(item.value_1);


                        });



                    }

                    //if (item.sett_key == "BackgroundColor") {
                    //        $("#background-color").val(item.value_1);
                    //}

                    if (item.sett_key == "defaultTax") {
                        page.salestaxService.getActiveSalesTax(function (data) {
                            $$("ddlDefaultTax").dataBind(data, "sales_tax_no", "sales_tax_name");
                            $$("ddlDefaultTax").selectedValue(item.value_1);
                        });
                    }
                    
            });
            });

        });


        page.settService.getAllSettings(function (finfactsData) {

                $(finfactsData).each(function (i, item) {
                    if (item.sett_key == "CompanyName") {
                        $$("txtCompanyGen").value(item.value_1);

                    }
                    if (item.sett_key == "OwnerName") {
                        $$("txtOwnerGen").value(item.value_1);
                    }
                    if (item.sett_key == "PhoneNo") {
                        $$("txtPhoneNo").value(item.value_1);
                    }
                    if (item.sett_key == "E-mail") {
                        $$("txtEmail").value(item.value_1);
                    }
                    if (item.sett_key == "CompanyAddress") {
                        $$("txtCmpnyAddGen").val(item.value_1);
                    }
                    if (item.sett_key == "LogoName") {
                        $$("txtLogoName").val(item.value_1);
                    }
                });

        });



        page.moduleList = [];
        page.printerList = [];
        page.printerAccessList = [];
        page.inventoryList = [];
        page.purchaseList = [];
        page.salesList = [];
        page.layoutList = [];
        page.parameterList = [];
        page.settService.getAllSettings(function (data) {
            $(data).each(function (i, item) {
                /*
                if (item.sett_no == 3 || item.sett_no == 4 || item.sett_no == 35 || item.sett_no == 27 || item.sett_no == 28) {
                    page.moduleList.push(item);
                }

                if (item.sett_no == 30 || item.sett_no == 31 || item.sett_no == 32 || item.sett_no == 37) {
                    page.inventoryList.push(item);
                }
                if (item.sett_no == 8) {
                    page.purchaseList.push(item);
                }
                if (item.sett_no == 7) {
                    page.salesList.push(item);
                }
                if (item.sett_no == 9) {
                    page.layoutList.push(item);
                }
                */
                if (item.value_3 == "Modules") {
                    page.moduleList.push(item);
                }

                if (item.value_3 == "Inventory") {
                    page.inventoryList.push(item);
                }
                if (item.value_3 == "Purchase") {
                    page.purchaseList.push(item);
                }
                if (item.value_3 == "Sales") {
                    page.salesList.push(item);
                }
                if (item.value_3 == "Layout") {
                    page.layoutList.push(item);
                }
                if (item.value_3 == "Parameter") {
                    page.parameterList.push(item);
                }

            });

            page.settService.getPrinterSetting(function (data1) {
                $(data1).each(function (i, item1) {

                    if (item1.sett_key == "ReceiptPrinter" || item1.sett_key == "BarcodePrinter") {
                        page.printerList.push(item1);
                    }


                    if (item1.sett_key == "DefaultReceiptPrinter" || item1.sett_key == "DefaultBarcodePrinter" || item1.sett_key == "RegisterReceiptPrinter" || item1.sett_key == "UserBarcodePrinter" || item1.sett_key == "UserBarcodePrinter") {
                        page.printerAccessList.push(item1);
                    }
                });


                page.settService.getAllSettings(function (data) {


                    $$("ucModuleEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                callback(page.moduleList);
                                //  page.settService.getAllSettings(callback);
                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Modules';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        
                        columns: [
                            { 'name': "Sett No", 'width': "60px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "250px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "220px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value1", 'width': "120px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }

                        ],


                    });

                    $$("ucPrinterEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                // page.settService.getPrinterSetting(callback);
                                callback(page.printerList);

                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Printer';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                currentData.value_3 = 'Printer';

                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "100px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "150px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "150px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                        { 'name': "Key Value1", 'width': "100px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "450px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "150px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }
                        ],


                    });

                    $$("ucPrinterAccessEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                //page.settService.getPrinterSetting(callback);
                                callback(page.printerAccessList);

                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Printer';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                currentData.value_3 = 'Printer';

                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "100px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "180px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "180px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                        { 'name': "Key Value1", 'width': "120px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }
                        ],


                    });

                    $$("ucInventoryEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                callback(page.inventoryList);
                                //  page.settService.getAllSettings(callback);
                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Inventory';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "60px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "180px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "220px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value1", 'width': "120px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }

                        ],


                    });

                    $$("ucPurchaseEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                callback(page.purchaseList);
                                //  page.settService.getAllSettings(callback);
                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Purchase';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "60px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "180px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "180px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value1", 'width': "120px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }

                        ],


                    });

                    $$("ucSalesEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                callback(page.salesList);
                                //  page.settService.getAllSettings(callback);
                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Sales';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "60px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "180px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "180px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value1", 'width': "120px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }

                        ],


                    });


                    $$("ucLayoutEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                callback(page.layoutList);
                                //  page.settService.getAllSettings(callback);
                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Layout';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "60px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "180px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "180px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value1", 'width': "120px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }

                        ],


                    });

                    $$("ucSystemParameterEntityManage").load({
                        keyColumn: "sett_no",
                        service: {
                            getAllData: function (callback) {
                                callback(page.parameterList);
                                //  page.settService.getAllSettings(callback);
                                //callback([
                                //    { class_id: "1", class_name: "LKG", board_id: "1", board_name: "State  Board" }
                                //]);
                            },
                            insertData: function (currentData, callback) {
                                var section_id;
                                page.settService.getMaxSettingDetails(function (maxNo) {
                                    sett_no = maxNo[0].sett_no;
                                    currentData.value_3 = 'Parameter';
                                    page.settService.insertSettings(currentData, sett_no, callback);
                                    location.reload();

                                });

                            },
                            updateData: function (currentData, callback) {
                                page.settService.updateSetting(currentData, callback);
                            },
                            deleteData: function (keyColumn, callback) {
                                page.settService.deleteSettingDetails(keyColumn, callback);
                            }

                        },
                        columns: [
                            { 'name': "Sett No", 'width': "60px", 'dataField': "sett_no", templateStyle: "label", lookUpValues: [] },

                            { 'name': "Sett Desc", 'width': "180px", 'dataField': "sett_desc", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Sett Key", 'width': "180px", 'dataField': "sett_key", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value1", 'width': "450px", 'dataField': "value_1", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value2", 'width': "120px", 'dataField': "value_2", templateStyle: "TextBox", lookUpValues: [] },
                            { 'name': "Key Value3", 'width': "120px", 'dataField': "value_3", templateStyle: "TextBox", lookUpValues: [] }

                        ],


                    });

                });


            });

        });
            
        }
        
    });
}

