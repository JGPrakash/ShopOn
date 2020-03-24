/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.balanceSheetPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.revenueService = new RevenueService();
        page.accountService = new AccountingService();
        page.userService = new UserService();
        page.companyService = new CompanyService();
        document.title = "ShopOn - Balance Sheet";
        page.events.page_load = function () {
            $$("pnlReport").hide();
            $$("btnPrint").hide();
            $$("pnlAccountTransaction").hide();
            $$("pnlAllGrid").hide();
            $("#lblCompanyName").text('');
            $("#lblPeriod").text('');
            $$("msgPanel").show("Loading company...");
            page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                //page.revenueService.getCompanyName(function (data) {
                //    page.userService.getMyFinfactsCompany(function (res) {
                //        var temp = [];
                //        $(data).each(function (i, item) {
                //            if (res[0].obj_id == item.comp_id) {
                //                temp.push({
                //                    comp_id: item.comp_id,
                //                    comp_name: item.comp_name
                //                })
                //            }
                //        })
                $$("ddlCompanyName").dataBind(data, "comp_id", "comp_name","Select");
                        //$$("ddlCompanyName").dataBind(data, "comp_id", "comp_name", "Select");
                        $$("msgPanel").hide();
                   // });
                });
            $$("ddlCompanyName").selectionChange(function () {
                $$("msgPanel").show("Loading period for company...");
                page.revenueService.getPeriod($$("ddlCompanyName").selectedValue(), function (data) {
                    $$("ddlPeriod").dataBind(data, "per_id", "per_name", "Select");
                    $$("lblCompanyName").value($$("ddlCompanyName").selectedData().comp_name);
                    $$("msgPanel").hide();
                });
            });
            $$("ddlPeriod").selectionChange(function () {
                $$("btnPrint").show();
                $$("msgPanel").show("Loading period for balance sheet...");
                page.per_id = $$("ddlPeriod").selectedData().per_id;
                $$("pnlReport").show();
                $$("pnlAccountTransaction").hide();
                $$("pnlAllGrid").show();
                $(".report-panel").show();
                $$("lblPeriod").value($$("ddlPeriod").selectedData().per_name);
                $$("grdAccountTransaction").width("100%");
                $$("grdAccountTransaction").height("350px");
                if (window.mobile) {
                    $$("grdAccountTransaction").setTemplate({
                        Selection: "Single", paging: true, pageSize: 50,
                        columns: [
                            { 'name': "Date", 'width': "15%", 'dataField': "trans_date" },
                            { 'name': "Description", 'width': "25%", 'dataField': "description" },
                            { 'name': "Type", 'width': "15%", 'dataField': "trans_type" },
                            { 'name': "Amount", 'width': "15%", 'dataField': "amount" },
    //                        { 'name': "Balance", 'width': "130px", 'dataField': "balance" }
                        ]
                    });
                }
                else {
                    $$("grdAccountTransaction").setTemplate({
                        Selection: "Single", paging: true, pageSize: 50,
                        columns: [
                            { 'name': "Date", 'width': "120px", 'dataField': "trans_date" },
                            { 'name': "Description", 'width': "210px", 'dataField': "description" },
                            { 'name': "Type", 'width': "130px", 'dataField': "trans_type" },
                            { 'name': "Amount", 'width': "130px", 'dataField': "amount" },
    //                        { 'name': "Balance", 'width': "130px", 'dataField': "balance" }
                        ]
                    });
                }
                $$("grdAccountTransaction").dataBind([]);

                $$("grdCurrentAssets").width("100%");
                $$("grdCurrentAssets").height("100px");
                $$("grdCurrentAssets").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        { 'name': "Amount", 'width': "30%", 'dataField': "amount" }
                    ]
                });
                $$("lblTotalAssets").value(0);
                $$("lblTotalLiaEqui").value(0);

                $$("grdCurrentAssets").dataBind([]);
                $$("grdCurrentAssets").selectionChanged = function (row, item) {
                    page.acc_id = item.acc_id;
                    page.acc_name = item.acc_name;
                    getAccountDetails(page.acc_id);
                }
                page.revenueService.getCurrentAssetsAccount(page.per_id ,function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        if (item.acc_group_id == 4 || item.acc_group_id == 10 || item.acc_group_id == 20)
                            item.amount = -parseFloat(item.amount);
                        else
                            item.amount = parseFloat(item.amount);

                        sum = parseFloat(sum) + parseFloat(item.amount);
                    });
                    $$("lblTotalAssets").value(parseFloat(parseFloat($$("lblTotalAssets").value()) + parseFloat(sum)).toFixed(2));

                    $$("lblCurrentAssets").value(parseFloat(sum).toFixed(2));
                    $$("grdCurrentAssets").dataBind(data);
                    $$("msgPanel").hide();
                });
                $$("grdProperty").width("100%");
                $$("grdProperty").height("100px");
                $$("grdProperty").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        { 'name': "Amount", 'width': "30%", 'dataField': "amount" }
                    ]
                });
                $$("grdProperty").dataBind([]);
                $$("grdProperty").selectionChanged = function (row, item) {
                    page.acc_id = item.acc_id;
                    getAccountDetails(page.acc_id);
                }
                page.revenueService.getPropertyAccount(page.per_id, function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        item.amount = parseFloat(item.amount);
                        sum = parseFloat(sum) + parseFloat(item.amount);
                    });
                    $$("lblTotalAssets").value(parseFloat(parseFloat($$("lblTotalAssets").value()) + parseFloat(sum)).toFixed(2));
                    $$("lblProperty").value(parseFloat(sum).toFixed(2));
                    $$("grdProperty").dataBind(data);
                });
                $$("grdOtherAssets").width("100%");
                $$("grdOtherAssets").height("100px");
                $$("grdOtherAssets").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        { 'name': "Amount", 'width': "30%", 'dataField': "amount" }
                    ]
                });
                $$("grdOtherAssets").dataBind([]);
                $$("grdOtherAssets").selectionChanged = function (row, item) {
                    page.acc_id = item.acc_id;
                    getAccountDetails(page.acc_id);
                }
                page.revenueService.getOtherAssetsAccount(page.per_id, function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        item.amount = parseFloat(item.amount);
                        sum = parseFloat(sum) + parseFloat(item.amount);
                    });
                    $$("lblTotalAssets").value(parseFloat(parseFloat($$("lblTotalAssets").value()) + parseFloat(sum)).toFixed(2));
                    $$("lblOtherAssets").value(parseFloat(sum).toFixed(2));

                    $$("grdOtherAssets").dataBind(data);
                });
                $$("grdCurrentLiabilities").width("100%");
                $$("grdCurrentLiabilities").height("100px");
                $$("grdCurrentLiabilities").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        { 'name': "Amount", 'width': "30%", 'dataField': "amount" }
                    ]
                });
                $$("grdCurrentLiabilities").dataBind([]);
                $$("grdCurrentLiabilities").selectionChanged = function (row, item) {
                    page.acc_id = item.acc_id;
                    page.acc_name = item.acc_name;
                    getAccountDetails(page.acc_id);
                }
                page.revenueService.getCurrentLiabilities(page.per_id, function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        if (item.acc_name == "Stock Payable")
                            item.amount =- parseFloat(item.amount);
                        else
                            item.amount = parseFloat(item.amount);
                        sum = parseFloat(sum) + parseFloat(item.amount);
                    });
                    $$("lblTotalLiaEqui").value(parseFloat(parseFloat($$("lblTotalLiaEqui").value()) + parseFloat(sum)).toFixed(2));
                    $$("lblCurrentLiabilities").value(parseFloat(sum).toFixed(2));
                    $$("grdCurrentLiabilities").dataBind(data);
                });
                $$("grdShareholdersEquities").width("100%");
                $$("grdShareholdersEquities").height("100px");
                $$("grdShareholdersEquities").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        { 'name': "Amount", 'width': "30%", 'dataField': "amount" }
                    ]
                });
                $$("grdShareholdersEquities").dataBind([]);
                //$$("grdShareholdersEquities").selectionChanged = function (row, item) {
                //    page.acc_id = item.acc_id;
                //    getAccountDetails(page.acc_id);
                //}
                page.revenueService.getShareholdersEquities(page.per_id, function (dataShare) {
                    var commonStock = 0;
                    page.revenueService.getRevenueAccount(page.per_id, function (data) {
                        var salessum = 0;
                        $(data).each(function (i, item) {
                            //Convert negative to positive
                            item.amount =item.amount;
                            salessum = parseFloat(salessum) + parseFloat(item.amount);
                        });
                        page.revenueService.getCostOfGoodAccount(page.per_id, function (data) {
                            var pursum = 0;
                            $(data).each(function (i, item) {
                                //Convert negative to positive
                                item.amount = item.amount;
                                pursum = parseFloat(pursum) +parseFloat( item.amount);
                            });
                            page.revenueService.getExpensesAccount(page.per_id, function (data) {
                                var expsum = 0;
                                $(data).each(function (i, item) {
                                    //Convert negative to positive
                                    item.amount = parseFloat(item.amount);
                                    expsum = parseFloat(expsum) + parseFloat(item.amount);
                                });
                                page.revenueService.getIncomeAccount(page.per_id, function (data) {
                                    var insum = 0;
                                    $(data).each(function (i, item) {
                                        //Convert negative to positive
                                        item.amount = parseFloat(item.amount);
                                        insum = parseFloat(insum) + parseFloat(item.amount);
                                    });
                                    commonStock = parseFloat(Math.abs( insum+ salessum) - Math.abs( expsum + pursum)).toFixed(2);
                                    dataShare.push({ acc_name: "Common Stock", amount: commonStock });
                                    var sum = 0;
                                    $(dataShare).each(function (i, item) {
                                        
                                        item.amount = parseFloat(item.amount);
                                        sum = parseFloat(parseFloat(sum) + parseFloat(item.amount));
                                    });
                                    $$("lblTotalLiaEqui").value(parseFloat(parseFloat($$("lblTotalLiaEqui").value()) + parseFloat(sum)).toFixed(2));
                                    $$("lblShareholdersEquities").value(parseFloat(sum).toFixed(2));
                                    $$("grdShareholdersEquities").dataBind(dataShare);
                                });
                            });
                        });
                    });
                });
            });
        };
        page.events.btnBack_click = function () {
            $$("pnlReport").show();
            $$("pnlAccountTransaction").hide();
        };
        function getAccountDetails(acc_id) {
            //page.controls.pnlAccountTransaction.open();
            //page.controls.pnlAccountTransaction.title("Transaction Details");
            //page.controls.pnlAccountTransaction.width("auto");
            //page.controls.pnlAccountTransaction.height(450);
            $$("pnlReport").hide();
            $$("pnlAccountTransaction").show();
            $$("lblAcntName").value(page.acc_name);
            page.accountService.getAccountsDetail(page.acc_id, function (data) {
                page.controls.grdAccountTransaction.dataBind(data);
            });
        }

        page.events.btnReport_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(150);
        }
        page.events.btnPrintJasperBill_click = function () {
            jasperReport();
        }
        function jasperReport() {
            var ShareholdersEquities = [];
            var PropertyAndEquipments = [];
            var CurrentLiabilities = [];
            var CurrentAssets = [];
            var OtherAssets = [];

            $(page.controls.grdShareholdersEquities.allData()).each(function (i, item) {
                ShareholdersEquities.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdProperty.allData()).each(function (i, item) {
                PropertyAndEquipments.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdCurrentLiabilities.allData()).each(function (i, item) {
                CurrentLiabilities.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdCurrentAssets.allData()).each(function (i, item) {
                CurrentAssets.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdOtherAssets.allData()).each(function (i, item) {
                OtherAssets.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            var accountInfo =
            {
                "CompanyName": $$("lblCompanyName").value(),
                "CompanyAddressLine1": CONTEXT.COMPANY_ADDRESS_LINE1,
                "CompanyAddressLine2": CONTEXT.COMPANY_ADDRESS_LINE2,
                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                "Period": $$("lblPeriod").value(),
                "TotalShareholdersEquities": $$("lblShareholdersEquities").value(),
                "TotalPropertyAndEquipments": $$("lblProperty").value(),
                "TotalLiabilities": $$("lblCurrentLiabilities").value(),
                "TotalCurrentAssets": $$("lblCurrentAssets").value(),
                "TotalLiabilitiesAndShareholdersEquities": $$("lblTotalLiaEqui").value(),
                "TotalOtherAssets": $$("lblOtherAssets").value(),
                "Total Assets": $$("lblTotalAssets").value(),
                "ShareholdersEquities": ShareholdersEquities,
                "PropertyAndEquipments": PropertyAndEquipments,
                "CurrentLiabilities": CurrentLiabilities,
                "CurrentAssets": CurrentAssets,
                "OtherAssets": OtherAssets
            };
            GeneratePrint("ShopOnDev", "Finfacts/shopon_balance_sheet.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }
    });

};

