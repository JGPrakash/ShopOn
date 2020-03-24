/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.fn.revenuePage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.revenueService = new RevenueService();
        page.userService = new UserService();
        page.companyService = new CompanyService();
        page.billAPI = new BillAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        var menu_ids = [];
        page.bill_count = 0
        document.title = "ShopOn - Profit & Loss";

        

        page.events.page_load = function () {
            $("[controlid=lblNetIncome]").on('DOMSubtreeModified', function () {
                if (parseFloat($$("lblNetIncome").value()) >= 0) {
                    $("#netIncome").removeClass("negative-income");
                }
                else {
                    $("#netIncome").addClass("negative-income");
                }
            });
            $$("pnlAllGrid").hide();
            $$("btnPrint").hide();
            $("#lblCompanyName").text('');
            $("#lblPeriod").text('');
            $$("msgPanel").show("Loading company...");
            page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                
                $$("ddlCompanyName").dataBind(data, "comp_id", "comp_name", "Select");
                //$$("ddlCompanyName").dataBind(data, "comp_id", "comp_name", "Select");
                $$("msgPanel").hide();
                // });
            });
            $$("ddlCompanyName").selectionChange(function () {
                $$("msgPanel").show("Loading period for company...");
                page.revenueService.getPeriod($$("ddlCompanyName").selectedValue(), function (data) {
                    $$("ddlPeriod").dataBind(data, "per_id", "per_name","Select");
                    $$("lblCompanyName").value($$("ddlCompanyName").selectedData().comp_name);
                    $$("msgPanel").hide();
                });

            });
            $$("ddlPeriod").selectionChange(function () {
                $$("btnPrint").show();
                $$("msgPanel").show("Loading period for income statement...");
                page.per_id = $$("ddlPeriod").selectedData().per_id;
                $$("pnlAllGrid").show();
                $(".report-panel").show();
                $$("lblPeriod").value($$("ddlPeriod").selectedData().per_name);
                $$("grdRevenue").width("100%");
                $$("grdRevenue").height("auto");
                $$("grdRevenue").setTemplate({
                    selection: "Single",
                    columns: [
                        {'name': "Account", 'width': "60%", 'dataField': "acc_name"},
                        {'name': "Amount", 'width': "30%", 'dataField': "amount"}
                    ]

                });

                $$("lblNetIncome").value(0);
                page.controls.grdRevenue.selectionChanged = page.events.grdRevenue_select;
                $$("grdRevenue").dataBind([]);
                page.revenueService.getRevenueAccount(page.per_id, function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        //Convert negative to positive
                        item.amount = Math.abs(parseFloat(item.amount));
                        sum = sum + item.amount;
                    });
                    $$("lblNetIncome").value((parseFloat($$("lblNetIncome").value()) + sum).toFixed(2));

                    $$("lblNetSales").value(sum);
                    $$("grdRevenue").dataBind(data);
                    $$("msgPanel").hide();
                });

                $$("grdPurchase").width("100%");
                $$("grdPurchase").height("auto");
                $$("grdPurchase").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        {'name': "Amount", 'width': "30%", 'dataField': "amount"}
                    ]
                });
                $$("grdPurchase").dataBind([]);
                page.revenueService.getCostOfGoodAccount(page.per_id, function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        //Convert negative to positive
                        item.amount = Math.abs(parseFloat(item.amount));
                        sum = sum + item.amount;
                    });
                    $$("lblNetIncome").value((parseFloat($$("lblNetIncome").value()) - sum).toFixed(2));
                    $$("lblGoodsSold").value(sum);
                    $$("grdPurchase").dataBind(data);
                });
                $$("grdExpenses").width("100%");
                $$("grdExpenses").height("auto");
                $$("grdExpenses").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        {'name': "Amount", 'width': "30%", 'dataField': "amount"}
                    ]
                });
                $$("grdExpenses").dataBind([]);
                page.revenueService.getExpensesAccount(page.per_id, function (data) {
                    var sum = 0;
                    $(data).each(function (i, item) {
                        //Convert negative to positive
                        item.amount = Math.abs(parseFloat(item.amount));
                        sum = sum + item.amount;
                    });
                    $$("lblNetIncome").value((parseFloat($$("lblNetIncome").value()) - sum).toFixed(2));
                    $$("lblTotalExpenses").value(sum);

                    $$("grdExpenses").dataBind(data);
                });
                $$("grdIncome").width("100%");
                $$("grdIncome").height("auto");
                $$("grdIncome").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Account", 'width': "60%", 'dataField': "acc_name" },
                        {'name': "Amount", 'width': "30%", 'dataField': "amount"}
                    ]
                });
                $$("grdIncome").dataBind([]);
                page.revenueService.getIncomeAccount(page.per_id, function (data) {
                  

                    var sum = 0;
                    $(data).each(function (i, item) {
                        //Convert negative to positive
                        item.amount = Math.abs(parseFloat(item.amount));
                        sum = sum + item.amount;
                    });
                    $$("lblNetIncome").value((parseFloat($$("lblNetIncome").value()) + sum).toFixed(2));
                    $$("lblIncome").value(sum);
                    $$("grdIncome").dataBind(data);
                });
            });

            $$("lblStatementName").html(CONTEXT.INCOME_STATEMENT_LABEL_NAME);
            var previlageData = {
                obj_type: "Product::CompProd::Store",
                obj_id: localStorage.getItem("prod_id"),
            };
            page.userpermissionAPI.getValue(previlageData, function (store_data) {
                $(store_data).each(function (i, item) {
                    item.obj_id = item.obj_id.split("::")[2];
                    menu_ids.push(item.obj_id);
                });
                page.billAPI.searchValues("", "", "b.store_no in (" + menu_ids.join(",") + ")", "bill_no desc", function (data) {
                    page.bill_count = data.length;
                });
            });
            
        };
        page.events.grdRevenue_select = function (row, item) {
            if (item.acc_name == "Sales Account") {
                var previlageData = {
                    obj_type: "Product::CompProd::Store",
                    obj_id: localStorage.getItem("prod_id"),
                };
                page.userpermissionAPI.getValue(previlageData, function (store_data) {
                    $(store_data).each(function (i, item) {
                        if (item.obj_id.startsWith("6"))
                            item.obj_id = item.obj_id.split("::")[2];
                        menu_ids.push(item.obj_id);
                    });
                    $$("pnlReport").hide();
                    $$("pnlAccountTransaction").show();
                    $$("lblAcntName").value(item.acc_name);
                    page.controls.grdBillHistory.width("100%");
                    page.controls.grdBillHistory.height("400px");
                    page.controls.grdBillHistory.setTemplate({
                        selection: "Single", paging: true, pageSize: 50,
                        columns: [
                            { 'name': "Bill No", 'width': "80px", 'dataField': "bill_code" },
                            { 'name': "Bill Type", 'width': "100px", 'dataField': "state_text" },
                            { 'name': "Bill Date", 'width': "110px", 'dataField': "bill_date" },
                            { 'name': "Customer", 'width': "180px", 'dataField': "cust_name" },
                            { 'name': "GST No", 'width': "180px", 'dataField': "gst_no" },
                            { 'name': "Total Amount", 'width': "100px", 'dataField': "total" },
                            //{ 'name': "Paid", 'width': "100px", 'dataField': "paid" },
                            //{ 'name': "Balance", 'width': "110px", 'dataField': "balance" },
                        ]
                    });
                    $$("grdBillHistory").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues(start, end, "b.store_no in (" + menu_ids.join(",") + ") and b.bill_type <> 'SaleSaved'", " bill_no desc", function (data) {
                                callback(data, page.bill_count);
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                });
            }
        }
        page.events.btnBack_click = function () {
            $$("pnlReport").show();
            $$("pnlAccountTransaction").hide();
        };
        page.events.btnReport_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(150);
            //PrintDataPR(0);
        }
        page.events.btnPrintJasperBill_click = function () {
            jasperReport();
        }
        function jasperReport() {
            var revenue_list = [];
            var cost_of_goods_sold_list = [];
            var expenses_list = [];
            var income_list = [];
            var detail = page.controls.grdRevenue.allData();
            
            $(page.controls.grdRevenue.allData()).each(function (i, item) {
                revenue_list.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdPurchase.allData()).each(function (i, item) {
                cost_of_goods_sold_list.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdExpenses.allData()).each(function (i, item) {
                expenses_list.push({
                    "Account": item.acc_name,
                    "Amount": item.amount
                });
            });
            $(page.controls.grdIncome.allData()).each(function (i, item) {
                income_list.push({
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
                "CompanyYear": $$("lblPeriod").value(),
                "NetSales": $$("lblNetSales").value(),
                "GrossProfit": $$("lblGoodsSold").value(),
                "TotalExpense": $$("lblTotalExpenses").value(),
                "TotalIncome": $$("lblIncome").value(),
                "NetIncome": $$("lblNetIncome").value(),
                "Revenue": revenue_list,
                "CostOfGood": cost_of_goods_sold_list,
                "Expenses": expenses_list,
                "StatementName": CONTEXT.INCOME_STATEMENT_LABEL_NAME,
                "Income": income_list
            };
            GeneratePrint("ShopOnDev", "Finfacts/shopon_profit_and_loss.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }
    });
};

