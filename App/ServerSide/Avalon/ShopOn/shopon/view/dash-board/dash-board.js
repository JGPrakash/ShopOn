/// <reference path="../sales-pos/sales-pos.html" />

$.fn.dashBoard = function () {
    return $.pageController.getControl(this, function (page,$$) {
        //Import Services required
        page.salesService = new SalesService();
        page.purchaseService = new PurchaseService();
        page.revenueService = new RevenueService();
        page.dashBoardService = new DashBoardService();
        page.dashBoardAPI = new DashBoardAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.accAccountService = new AccAccountService();
        page.revenueService = new RevenueService();
        document.title = "ShopOn - Dashboard";
        var menu_ids = [];
        var reg_ids = [];
        var user_ids = [];
        loadDashBoard = function (data) {
            var previlageData = {
                obj_type: "Product::CompProd::Store",
                obj_id: localStorage.getItem("prod_id"),
            };
            page.userpermissionAPI.getValue(previlageData, function (store_data) {
                $(store_data).each(function (i, item) {
                    item.obj_id = item.obj_id.split("::")[2];
                    menu_ids.push(item.obj_id);
                });
                var data = {
                    comp_id: localStorage.getItem("user_company_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    store_no: menu_ids.join(","),
                    start_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    end_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                }
                page.dashBoardAPI.postValue(data, function (data) {
                    var string = "";
                    page.clearFields(function (temp) {
                        $(data).each(function (i, item) {
                            if (item.keyvalue == "Expense" && item.ver_no == "1") {
                                $$("lblExpenseYear").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblExpenseYear]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblExpenseYear]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "Revenue" && item.ver_no == "1") {
                                $$("lblRevenueYear").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblRevenueYear]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblRevenueYear]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "Income" && item.ver_no == "1") {
                                $$("lblOtherIncomeYear").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblOtherIncomeYear]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblOtherIncomeYear]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "CostOfGoods" && item.ver_no == "1") {
                                $$("lblCostOfGoodsYear").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblCostOfGoodsYear]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblCostOfGoodsYear]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "Profit" && item.ver_no == "1") {
                                $$("lblProfitYear").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblProfitYear]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblProfitYear]").removeClass("negative");
                                }
                            }

                            if (item.keyvalue == "Expense" && item.ver_no == "2") {
                                $$("lblExpenseToday").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblExpenseToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblExpenseToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "Revenue" && item.ver_no == "2") {
                                $$("lblRevenueToday").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblRevenueToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblRevenueToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "Income" && item.ver_no == "2") {
                                $$("lblOtherIncomeToday").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblOtherIncomeToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblOtherIncomeToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "CostOfGoods" && item.ver_no == "2") {
                                $$("lblCostOfGoodsToday").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblCostOfGoodsToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblCostOfGoodsToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "Profit" && item.ver_no == "2") {
                                $$("lblProfitToday").value("&#8377; " + item.amount);
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblProfitToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblProfitToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "OpeningCash" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblOpeningCash").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblOpeningCash]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblOpeningCash]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "ClosingCash" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblClosingCash").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblClosingCash]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblClosingCash]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "OpeningBank" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblOpeningBank").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblOpeningBank]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblOpeningBank]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "ClosingBank" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblClosingBank").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblClosingBank]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblClosingBank]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "CurrentAssert" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblAmountReceivable").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblAmountReceivable]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblAmountReceivable]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "CurrentAssertToday" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblAmountReceivableToday").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblAmountReceivableToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblAmountReceivableToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "CurrentLiablities" && item.ver_no == "3") {
                                //item.amount = -parseFloat(item.amount);
                                $$("lblAmountPayable").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblAmountPayable]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblAmountPayable]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "CurrentLiablitiesToday" && item.ver_no == "3") {
                                //item.amount = -parseFloat(item.amount);
                                $$("lblAmountPayableToday").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblAmountPayableToday]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblAmountPayableToday]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "TotalPurchase" && item.ver_no == "3") {
                                item.amount = -parseFloat(item.amount);
                                $$("lblPurchaseYear").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblPurchaseYear]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblPurchaseYear]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "TodaySale" && item.ver_no == "4") {
                                $$("lblTodayRevenue").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblTodayRevenue]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblTodayRevenue]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "WeekSale" && item.ver_no == "4") {
                                $$("lblWeekRevenue").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblWeekRevenue]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblWeekRevenue]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "MonthSale" && item.ver_no == "4") {
                                $$("lblMonthRevenue").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblMonthRevenue]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblMonthRevenue]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "TodayPurchase" && item.ver_no == "4") {
                                $$("lblTodayPurchase").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblTodayPurchase]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblTodayPurchase]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "WeekPurchase" && item.ver_no == "4") {
                                $$("lblWeekPurchase").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblWeekPurchase]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblWeekPurchase]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "MonthPurchase" && item.ver_no == "4") {
                                $$("lblMonthPurchase").value(("&#8377; " + item.amount));
                                if (parseFloat(item.amount) < 0) {
                                    $("[controlid=lblMonthPurchase]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblMonthPurchase]").removeClass("negative");
                                }
                            }

                            if (item.ver_no == "5") {
                                item.keyvalue = (item.keyvalue == null) ? "No User" : item.keyvalue;
                                string = string + "<div class='col-xs-12 col-sm-3'><div class='card col-xs-12'><div class='card-block'><div class='col-xs-12 col-lg-4'><img src='Images/sales-dashboard.png' style='width:100px;' /></div><div class='col-xs-12 col-lg-8'><div class='div-head'>" + item.keyvalue + "</div><div class='div-body'>" + item.amount + "</div></div></div></div></div>";
                                $$("lblGrdUser").html(string);
                            }

                            if (item.keyvalue == "outOfStock" && item.ver_no == "6") {
                                $$("lblOutOfStock").value("Qty : " + item.amount);
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblOutOfStock]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblOutOfStock]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "reorderLevel" && item.ver_no == "6") {
                                $$("lblBelowReorderLevel").value("Qty : " + item.amount);
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblBelowReorderLevel]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblBelowReorderLevel]").removeClass("negative");
                                }
                            }
                            if (item.keyvalue == "oldItems" && item.ver_no == "6") {
                                $$("lblOldItems").value("Qty : " + item.amount);
                                if (parseFloat(item.amount) > 0) {
                                    $("[controlid=lblOldItems]").addClass("negative");
                                }
                                else {
                                    $("[controlid=lblOldItems]").removeClass("negative");
                                }
                            }
                        });
                    })
                });
            });
            
            
            /*
            var date = new Date();

            var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =10 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            var month = (date.getMonth() + 1);
            month = (month.toString().length == 1) ? "0" + month : month;
            finfacts_data = finfacts_data + " and date(trans_date) < '" + date.getFullYear() + "-" + month +"-"+date.getDate()+ "'";
            page.accAccountService.searchValues(0, "", finfacts_data, "", function (data) {
                data[0].balance = -data[0].balance;
                $$("lblOpeningCash").value(("&#8377; " + data[0].balance));
            });

            var finData = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =10 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            page.accAccountService.searchValues(0, "", finData, "", function (data) {
                data[0].balance  = - data[0].balance;
                $$("lblClosingCash").value(("&#8377; " + data[0].balance));
            });

            var purFinData = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =4 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            purFinData = purFinData + " and date(trans_date) < '" + date.getFullYear() + "-" + month + "-" + date.getDate() + "'";
            page.accAccountService.searchValues(0, "", purFinData, "", function (data) {
                data[0].balance = -data[0].balance;
                $$("lblOpeningBank").value(("&#8377; " + data[0].balance));
            });

            var purData = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =4 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            page.accAccountService.searchValues(0, "", purData, "", function (data) {
                data[0].balance = -data[0].balance;
                $$("lblClosingBank").value(("&#8377; " + data[0].balance));
            });

            page.revenueService.getCurrentAssetsAccount(CONTEXT.FINFACTS_CURRENT_PERIOD, function (data) {
                $(data).each(function (i, item) {
                    if (item.acc_group_id == "20") {
                        item.amount = -item.amount;
                        $$("lblAmountReceivable").value(("&#8377; " + item.amount));
                    }
                });
            });
            page.revenueService.getCurrentLiabilities(CONTEXT.FINFACTS_CURRENT_PERIOD, function (data) {
                $$("lblAmountPayable").value(("&#8377; " + data[0].amount));
            });*/

        }
        page.clearFields = function (callback) {
            $$("lblExpenseYear").value("&#8377; " + 0);
            $$("lblRevenueYear").value("&#8377; " + 0);
            $$("lblOtherIncomeYear").value("&#8377; " + 0);
            $$("lblCostOfGoodsYear").value("&#8377; " + 0);
            $$("lblProfitYear").value("&#8377; " + 0);
            $$("lblExpenseToday").value("&#8377; " + 0);
            $$("lblRevenueToday").value("&#8377; " + 0);
            $$("lblOtherIncomeToday").value("&#8377; " + 0);
            $$("lblCostOfGoodsToday").value("&#8377; " + 0);
            $$("lblProfitToday").value("&#8377; " + 0);
            $$("lblOpeningCash").value(("&#8377; " + 0));
            $$("lblClosingCash").value(("&#8377; " + 0));
            $$("lblOpeningBank").value(("&#8377; " + 0));
            $$("lblClosingBank").value(("&#8377; " + 0));
            $$("lblAmountReceivable").value(("&#8377; " + 0));
            $$("lblAmountReceivableToday").value(("&#8377; " + 0));
            $$("lblAmountPayable").value(("&#8377; " + 0));
            $$("lblAmountPayableToday").value(("&#8377; " + 0));
            $$("lblPurchaseYear").value(("&#8377; " + 0));
            $$("lblTodayRevenue").value(("&#8377; " + 0));
            $$("lblWeekRevenue").value(("&#8377; " + 0));
            $$("lblMonthRevenue").value(("&#8377; " + 0));
            $$("lblTodayPurchase").value(("&#8377; " + 0));
            $$("lblWeekPurchase").value(("&#8377; " + 0));
            $$("lblMonthPurchase").value(("&#8377; " + 0));
            $$("lblOutOfStock").value("Qty : " + 0);
            $$("lblBelowReorderLevel").value("Qty : " + 0);
            $$("lblOldItems").value("Qty : " + 0);
            callback({});
        }
        page.events = {

            page_load: function () {
                //$(document).ready(function () {
                    
                //});
                //var previlageData = {
                //    obj_type: "Product::CompProd::Store",
                //    obj_id: localStorage.getItem("prod_id"),
                //};
                //page.userpermissionAPI.getValue(previlageData, function (store_data) {
                //    $(store_data).each(function (i, item) {
                //        item.obj_id = item.obj_id.split("::")[2];
                //        menu_ids.push(item.obj_id);
                //    });
                //});
                //    var data = {
                //        start_record: 0,
                //        end_record: "",
                //        filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                //        sort_expression: ""
                //    }
                //    page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //        $(data).each(function (i, item) {
                //            reg_ids.push(item.reg_no);
                //        });
                //        $(CONTEXT.USERIDACCESS).each(function (i, item) {
                //            user_ids.push(item.user_id);
                //        });
                //        page.events.btnRefresh_click();
                //    });
                //});
                page.events.btnRefresh_click();

                //page.controls.grdUserSales.width("100%");
                //page.controls.grdUserSales.setTemplate({
                //    selection: "Single",
                //    columns: [
                //            { 'name': "User Name", 'width': "150px", 'dataField': "user_name" },
                //            { 'name': "Bills", 'width': "120px", 'dataField': "total" },
                //            { 'name': "Amount", 'width': "160px", 'dataField': "amount" },
                //    ]
                //});
                //$$("grdUserSales").dataBind([]);
            }
        }
        page.events.btnRefresh_click =function () {
            
            loadDashBoard();

            /*
            page.salesService.getTotalSalesDashBoard(function (data) {
                $(data).each(function (i, item) {
                    if (item.keyvalue == "TodaySale") {
                        item.amount = (item.amount == null || item.amount == "" || typeof item.amount == "undefined") ? "0.00" : item.amount;
                        $$("lblTodayRevenue").value("&#8377; " + item.amount);
                    }
                    if (item.keyvalue == "WeekSale")
                        $$("lblWeekRevenue").value("&#8377; " + item.amount);
                    if (item.keyvalue == "MonthSale")
                        $$("lblMonthRevenue").value("&#8377; " + item.amount);
                    if (item.keyvalue == "TodayPurchase")
                        $$("lblTodayPurchase").value("&#8377; " + item.amount);
                    if (item.keyvalue == "WeekPurchase")
                        $$("lblWeekPurchase").value("&#8377; " + item.amount);
                    if (item.keyvalue == "MonthPurchase")
                        $$("lblMonthPurchase").value("&#8377; " + item.amount);
                });
            });
            page.dashBoardService.getUserBills(function (data) {
                var string = "";
                $(data).each(function (i, item) {
                    item.user_name = (item.user_name == null) ? "No User" : item.user_name;
                    string = string + "<div class='col-xs-12 col-sm-3'><div class='card'><div class='card-block'><div class='col-xs-12 col-sm-4'><img src='Images/sales-dashboard.png' style='width:100px;' /></div><div class='col-xs-12 col-sm-8'><div class='div-head'>" + item.user_name + "</div><div class='div-head'>" + item.amount + " (" + item.total + ")</div></div></div></div></div>";
                });
                $$("lblGrdUser").html(string);
            });
            var previlageData = {
                obj_type: "Product::CompProd::Store",
                obj_id: localStorage.getItem("prod_id"),
            };
            page.userpermissionAPI.getValue(previlageData, function (store_data) {
                $(store_data).each(function (i, item) {
                    item.obj_id = item.obj_id.split("::")[2];
                    menu_ids.push(item.obj_id);
                });
                page.dashBoardAPI.getStockDashboard(menu_ids.join(","), function (data) {
                    $(data).each(function (i, item) {
                        if (item.key1 == "outOfStock")
                            $$("lblOutOfStock").value("Qty : " + item.value1);
                        if (item.key1 == "reorderLevel")
                            $$("lblBelowReorderLevel").value("Qty : " + item.value1);
                        if (item.key1 == "oldItems")
                            $$("lblOldItems").value("Qty : " + item.value1);
                    });
                });
            });
            */
        }
    });



}
