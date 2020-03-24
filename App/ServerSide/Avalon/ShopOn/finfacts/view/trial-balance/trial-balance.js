/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.triaBalance = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.revenueService = new RevenueService();
        page.accountService = new AccountingService();
        page.userService = new UserService();
        page.companyService = new CompanyService();
        page.capital_group_acc = 9;
        page.capital_acc = 171;

        document.title = "ShopOn - Trial Balance";

        page.events.btnMoveClosing_click = function () {
            if (confirm("Are You Sure Want To Move This Transaction")) {
                $$("msgPanel").show("Transfering Account...!");
                var data = [];
                $($$("grdTrialBalance").allData()).each(function (i, items) {
                    var trans_type = "Credit";
                    if (parseFloat(items.closing_balance_1) > 0) {
                        trans_type = "Debit";
                    }
                    else {
                        trans_type = "Credit";
                    }
                    items.closing_balance_1 = (parseFloat(items.closing_balance_1) >= 0) ? parseFloat(items.closing_balance_1) : -parseFloat(items.closing_balance_1);
                    data.push({
                        per_id: $$("ddlPeriod2").selectedValue(),
                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        description: items.acc_group_name,
                        key_1: 0,
                        key_2: 0,
                        amount: items.closing_balance_1,
                        acc_id: items.acc_id,
                        acc_group_id: items.acc_group_id,
                        trans_type: trans_type,
                    });
                });
                page.revenueService.getAllMovingBalance(0, data, function (data1) {
                    page.revenueService.getRevenueAccount($$("ddlPeriod1").selectedValue(), function (data) {
                        var salessum = 0;
                        $(data).each(function (i, item) {
                            //Convert negative to positive
                            item.amount = item.amount;
                            salessum = parseFloat(salessum) + parseFloat(item.amount);
                        });
                        page.revenueService.getCostOfGoodAccount($$("ddlPeriod1").selectedValue(), function (data) {
                            var pursum = 0;
                            $(data).each(function (i, item) {
                                //Convert negative to positive
                                item.amount = item.amount;
                                pursum = parseFloat(pursum) + parseFloat(item.amount);
                            });
                            page.revenueService.getExpensesAccount($$("ddlPeriod1").selectedValue(), function (data) {
                                var expsum = 0;
                                $(data).each(function (i, item) {
                                    //Convert negative to positive
                                    item.amount = parseFloat(item.amount);
                                    expsum = parseFloat(expsum) + parseFloat(item.amount);
                                });
                                page.revenueService.getIncomeAccount($$("ddlPeriod1").selectedValue(), function (data) {
                                    var insum = 0;
                                    $(data).each(function (i, item) {
                                        //Convert negative to positive
                                        item.amount = parseFloat(item.amount);
                                        insum = parseFloat(insum) + parseFloat(item.amount);
                                    });
                                    var commonStock = parseFloat(Math.abs(insum + salessum) - Math.abs(expsum + pursum)).toFixed(2);
                                    var comm_trans = (parseFloat(commonStock) >= 0) ? "Credit" : "Debit";
                                    commonStock = (parseFloat(commonStock) >= 0) ? commonStock : -commonStock;
                                    var upd_data = {
                                        per_id: $$("ddlPeriod2").selectedValue(),
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        description: "Capital Account",
                                        key_1: 0,
                                        key_2: 0,
                                        amount: commonStock,
                                        acc_id: page.capital_acc,
                                        acc_group_id: page.capital_group_acc,
                                        trans_type: comm_trans,
                                    }
                                    page.revenueService.insertMovingBalance(upd_data, function (data) {
                                        alert("Success");
                                        $$("msgPanel").hide();
                                        $$("grdTrialBalance").width("100%");
                                        $$("grdTrialBalance").height("550px");
                                        $$("grdTrialBalance").setTemplate({
                                            Selection: "Single", paging: true, pageSize: 20,
                                            columns: [
                                                { 'name': "Accounts", 'width': "20%", 'dataField': "acc_name" },
                                                { 'name': $$("ddlPeriod1").selectedData().per_name + " | Opening", 'width': "25%", 'dataField': "opening_balance_1" },
                                                { 'name': $$("ddlPeriod1").selectedData().per_name + " | Closing", 'width': "15%", 'dataField': "closing_balance_1" },
                                                { 'name': $$("ddlPeriod2").selectedData().per_name + " | Opening", 'width': "15%", 'dataField': "opening_balance_2" },
                                                { 'name': $$("ddlPeriod2").selectedData().per_name + " | Closing", 'width': "15%", 'dataField': "closing_balance_2" },
                                            ]
                                        });

                                        page.revenueService.getTrialBalance($$("ddlPeriod1").selectedValue(), $$("ddlPeriod2").selectedValue(), function (data) {
                                            var newObject = {};
                                            $(data).each(function (i, item) {

                                                if (item.acc_group_id == "20" || item.acc_group_id == "19" || item.acc_group_id == "4" || item.acc_group_id == "10" || item.acc_group_id == "18" || item.acc_group_id == "9" || item.acc_group_id == "11" || item.acc_group_id == "12" || item.acc_group_id == "14" || item.acc_group_id == "17" || item.acc_group_id == "8") {
                                                    //if (item.acc_group_id == "10" || item.acc_group_id == "18" || item.acc_group_id == "20" || item.acc_group_id == "4" || item.acc_group_id == "11" || item.acc_group_id == "12") {//item.acc_group_id != "5"
                                                    if (typeof (newObject[item.acc_id]) == "undefined")
                                                        newObject[item.acc_id] = { acc_id: item.acc_id, acc_name: item.acc_name, acc_group_id: item.acc_group_id, acc_group_name: item.acc_group_name };
                                                    if (item.per_id == $$("ddlPeriod1").selectedValue()) {
                                                        newObject[item.acc_id].per_id_1 = item.per_id;
                                                        newObject[item.acc_id].opening_balance_1 = item.opening_balance;
                                                        newObject[item.acc_id].closing_balance_1 = item.closing_balance;
                                                    }
                                                    if (item.per_id == $$("ddlPeriod2").selectedValue()) {
                                                        newObject[item.acc_id].per_id_2 = item.per_id;
                                                        newObject[item.acc_id].opening_balance_2 = item.opening_balance;
                                                        newObject[item.acc_id].closing_balance_2 = item.closing_balance;
                                                    }
                                                }
                                                if (item.acc_group_id == "9") {
                                                    page.capital_group_acc = item.acc_group_id;
                                                    page.capital_acc = item.acc_id;
                                                }
                                            });

                                            var newArray = [];
                                            for (var prop in newObject)
                                                newArray.push(newObject[prop]);


                                            $$("grdTrialBalance").dataBind(newArray);
                                        });

                                    });
                                });
                            });
                        });
                    });
                })
            }
            //updatw with key_1=0  and key_2=0. Dont move income and expense and sales purchase to next year
            
        }
        page.events.page_load = function () {

            page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                $$("ddlCompanyName").dataBind(data, "comp_id", "comp_name", "Select");

                $$("msgPanel").hide();
            });

            $$("ddlCompanyName").selectionChange(function () {
                $$("msgPanel").show("Loading period for company...");
                page.revenueService.getPeriod($$("ddlCompanyName").selectedValue(), function (data) {
                    $$("ddlPeriod1").dataBind(data, "per_id", "per_name", "Select");
                    $$("msgPanel").hide();
                });
            });

            $$("ddlPeriod1").selectionChange(function () {
                var val = $$("ddlPeriod1").selectedValue();
                var push = [];
                page.revenueService.getPeriod($$("ddlCompanyName").selectedValue(), function (data) {
                    $(data).each(function (i, items) {
                        if (parseInt(items.per_id) > parseInt(val)) {
                            push.push({
                                per_id: items.per_id,
                                per_name: items.per_name,
                            })
                        }
                    })
                    $$("ddlPeriod2").dataBind(push, "per_id", "per_name", "Select");
                });
                
            });

            $$("ddlPeriod2").selectionChange(function () {
                $$("grdTrialBalance").width("100%");
                $$("grdTrialBalance").height("550px");
                $$("grdTrialBalance").setTemplate({
                    Selection: "Single", paging: true, pageSize: 20,
                    columns: [
                        { 'name': "Accounts", 'width': "20%", 'dataField': "acc_name" },
                        { 'name': $$("ddlPeriod1").selectedData().per_name + " | Opening", 'width': "25%", 'dataField': "opening_balance_1" },
                        { 'name': $$("ddlPeriod1").selectedData().per_name +  " | Closing", 'width': "15%", 'dataField': "closing_balance_1" },
                        { 'name': $$("ddlPeriod2").selectedData().per_name + " | Opening", 'width': "15%", 'dataField': "opening_balance_2" },
                        { 'name': $$("ddlPeriod2").selectedData().per_name + " | Closing", 'width': "15%", 'dataField': "closing_balance_2" },
                    ]
                });

                page.revenueService.getTrialBalance($$("ddlPeriod1").selectedValue(), $$("ddlPeriod2").selectedValue(), function (data) {
                    var newObject = {};
                    $(data).each(function (i, item) {

                        if (item.acc_group_id == "20" || item.acc_group_id == "19" || item.acc_group_id == "4" || item.acc_group_id == "10" || item.acc_group_id == "18" || item.acc_group_id == "9" || item.acc_group_id == "11" || item.acc_group_id == "12" || item.acc_group_id == "14" || item.acc_group_id == "17" || item.acc_group_id == "8") {
                        //if (item.acc_group_id == "10" || item.acc_group_id == "18" || item.acc_group_id == "20" || item.acc_group_id == "4" || item.acc_group_id == "11" || item.acc_group_id == "12") {//item.acc_group_id != "5"
                            if (typeof (newObject[item.acc_id]) == "undefined")
                                newObject[item.acc_id] = { acc_id: item.acc_id, acc_name: item.acc_name, acc_group_id: item.acc_group_id, acc_group_name: item.acc_group_name };
                            if (item.per_id == $$("ddlPeriod1").selectedValue()) {
                                newObject[item.acc_id].per_id_1 = item.per_id;
                                newObject[item.acc_id].opening_balance_1 = item.opening_balance;
                                newObject[item.acc_id].closing_balance_1 = item.closing_balance;
                            }
                            if (item.per_id == $$("ddlPeriod2").selectedValue()) {
                                newObject[item.acc_id].per_id_2 = item.per_id;
                                newObject[item.acc_id].opening_balance_2 = item.opening_balance;
                                newObject[item.acc_id].closing_balance_2 = item.closing_balance;
                            }
                        }
                        if (item.acc_group_id == "9") {
                            page.capital_group_acc = item.acc_group_id;
                            page.capital_acc = item.acc_id;
                        }
                    });

                    var newArray = [];
                    for (var prop in newObject)
                        newArray.push(newObject[prop]);


                    $$("grdTrialBalance").dataBind(newArray);
                });

                
            });
        };
      
      
    });
};