$.fn.salesReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.registerAPI = new RegisterAPI();
        page.shopOnStatesAPI = new ShopOnStatesAPI();
        page.customerAPI = new CustomerAPI();
        page.itemAPI = new ItemAPI();
        page.variationAPI = new VariationAPI();
        page.storeAPI = new StoreAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.userAPI = new UserAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.salesReportAPI = new SalesReportAPI();
        page.stockAPI = new StockAPI();
        page.accAccountService = new AccAccountService();
        page.billPaymentAPI = new BillPaymentAPI();
        var menu_ids = [];
        var reg_ids = [];
        var user_ids = [];
        var item_list = [];
        var variation_list = [];
        document.title = "ShopOn - Sales Report";
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
                page.events.btnGenerate_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnReport_click();
            }
        });
        page.events = {
            btnGenerate_click: function () {
                var filter = {};
                var totalSales = 0;
                var totalSalesPayment = 0;
                var balanceSales = 0;
                var totalReturns = 0;
                var totalReturnsPayment = 0;
                var balanceReturns = 0;
                var salestotalTax = 0;
                var returntotalTax = 0;
                var totalTax = 0;
                var executive_sales_points = 0;
                var executive_return_points = 0;
                var executive_net_points = 0;
                var tot_bills=0;
                var total_cash_amount = 0;
                var total_card_amount = 0;
                var total_cheque_amount = 0;
                var total_net_bank_amount = 0;
                var total_bill_amount = 0;
                var tot_qty = 0;
                var sales_tot_qty = 0;
                var return_tot_qty = 0;
                var tot_amount = 0;
                var item_profit = 0;
                var item_cost = 0;
                var item_price = 0;
                var temp_cost;
                var temp_price;
                var customer_sales_points = 0;
                var customer_return_points = 0;
                var sales_order = 0;
                var sales_order_return = 0;
                var sales_pos = 0;
                var sales_pos_return = 0;
                //var executive_sales_points = 0;
                //var executive_return_points = 0;
                var net_sales = 0;
                var net_profit = 0;
                var sales_profit = 0;
                var return_profit = 0;
                var totalPaymentDiscount = 0;
                var tot_net_balance = 0;
                var tot_finance = 0;
                var tot_credit = 0;
                var tot_credit_pay = 0;
                var tot_debit_pay = 0;
                //var lastCustNo = "";
                $$("lblTotalSales").value(parseFloat(0).toFixed(2));
                $$("lblTotalPayment").value(parseFloat(0).toFixed(2));
                $$("lblSalesBal").value(parseFloat(0).toFixed(2));
                $$("lblTotalSalesPoint").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturns").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturnsPayment").value(parseFloat(0).toFixed(2));
                $$("lblReturnBal").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturnsPoint").value(parseFloat(0).toFixed(2));
                $$("lblTotalTax").value(parseFloat(0).toFixed(2));
                $$("lblNetPoint").value(parseFloat(0).toFixed(2));
                $$("lblPaymentDiscount").value(parseFloat(0).toFixed(2));
                $$("lblTotalBills").value(parseFloat(0).toFixed(2));
                $$("lblNetSales").value(parseFloat(0).toFixed(2));
                $$("lblNetAmt").value(parseFloat(0).toFixed(2));
                $$("lblProfitAndTax").value(parseFloat(0).toFixed(2));
                $$("lblProfit").value(parseFloat(0).toFixed(2));
                $$("lblAmountFromPOS").value(parseFloat(0).toFixed(2));
                $$("lblAmountFromOrder").value(parseFloat(0).toFixed(2));
                $$("lblTotalPaymentAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCashAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCardAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalChequeAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalNetBankAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalFinanceAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCollectedAmt").value(parseFloat(0).toFixed(2));
                $$("lblTotalBalance").value(parseFloat(0).toFixed(2));
                $$("lblTotalSalesQty").value(parseFloat(0).toFixed(2));
                $$("lblTotalAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalPoints").value(parseFloat(0).toFixed(2));
                $$("lblTotalQty").value(parseFloat(0).toFixed(2));
                $$("lblTotalBuyingCost").value(parseFloat(0).toFixed(2));
                $$("lblSellingCost").value(parseFloat(0).toFixed(2));
                $$("lblTotalProfit").value(parseFloat(0).toFixed(2));
                $$("lblNetCredit").value(parseFloat(0).toFixed(2));
                $$("msgPanel").show("Loading...!");
                if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2100px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': " ", 'width': "50px", 'dataField': "", itemTemplate: "<input action='detail' type='button'  value='+' />" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "50px", 'dataField': "bill_no", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Customer", 'rlabel': 'Customer', 'width': "160px", 'dataField': "cust_name" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': 'Payment Type', 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': 'Cheque No', 'rlabel': 'Cheque No', 'width': "100px", 'dataField': "cheque_no",visible:$$("ddlPaymentType").selectedValue() == "Cheque" },
                                { 'name': 'Bank Name', 'rlabel': 'Bank Name', 'width': "100px", 'dataField': "cheque_bank_name", visible: $$("ddlPaymentType").selectedValue() == "Cheque" },
                                { 'name': 'Cheque Date', 'rlabel': 'Cheque Date', 'width': "100px", 'dataField': "cheque_date", visible: $$("ddlPaymentType").selectedValue() == "Cheque" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "70px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "70px", 'dataField': "balance" },
                                { 'name': "Credit Note", 'rlabel': 'Credit Note', 'width': "70px", 'dataField': "credit_amount" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "90px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "90px", 'dataField': "round_off" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "70px", 'dataField': "profit" },
                                { 'name': "", 'width': "90%", 'dataField': "sl_no,bill_no", itemTemplate: "<div id='detailGrid'></div>" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);

                            $(row).find("input[action=detail]").click(function () {
                                if ($(this).val() == "+") {
                                    $(this).val("-");
                                    page.billPaymentAPI.searchValues("", "", "bill_no = " + item.bill_no, "", function (data) {
                                        var htmlTemplate = [];
                                        htmlTemplate.push("<div class='col-xs-12' style='font-weight:bold;margin-bottom:5px;'><span class='col-xs-1'>Pay Date</span><span class='col-xs-1'>Pay Type</span><span class='col-xs-1'>Pay Mode</span><span class='col-xs-1'>Amount</span></div>");
                                        $(data).each(function (i, trans) {
                                            htmlTemplate.push("<div class='col-xs-12' style='margin-bottom:5px;'><span class='col-xs-1'>" + trans.pay_date + "</span><span class='col-xs-1'>" + trans.bill_type + "</span><span class='col-xs-1'>" + trans.pay_mode + "</span><span class='col-xs-1'>" + trans.amount_pay + "</span></div>");
                                        });
                                        $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                                    }); 
                                }
                                else {
                                    $(this).val("+");
                                    $(row).find("[id=detailGrid]").html("");
                                }

                            });

                        }
                        var from_bill = "", to_bill = "", today_month;
                        var today = new Date();
                        today_month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                        if ($$("txtFromBill").val() != "" && $$("txtFromBill").val() != null && typeof $$("txtFromBill").val() != "undefined") {
                            if ($$("txtFromBill").val().indexOf('-') > -1) {
                                from_bill = $$("txtFromBill").val();
                            }
                            else {
                                from_bill = today.getFullYear() + "" + today_month + "-" + $$("txtFromBill").value();
                            }
                        }
                        if ($$("txtToBill").val() != "" && $$("txtToBill").val() != null && typeof $$("txtToBill").val() != "undefined") {
                            if ($$("txtToBill").val().indexOf('-') > -1) {
                                to_bill = $$("txtToBill").val();
                            }
                            else {
                                to_bill = today.getFullYear() + "" + today_month + "-" + $$("txtToBill").value();
                            }
                        }
                        var reportdata = {
                                "viewMode":$$("ddlViewMode").selectedData().view_name,
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                                "from_bill": from_bill,
                                "to_bill": to_bill,
                                "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                                "paytype": ($$("ddlPayType").selectedValue() == "All") ? "" : $$("ddlPayType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            var last_bill_no = 0;
                            var bill_count = 0;
                            $(data).each(function (i, item) {
                                if (last_bill_no != item.bill_no) {
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    bill_count = parseInt(bill_count) + 1;
                                }
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    if (item.bill_type == "Sale") {
                                        if (last_bill_no != item.bill_no) {
                                            sales_profit = parseFloat(item.profit) + parseFloat(sales_profit);
                                            salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                            totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                            balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                            tot_credit = parseFloat(tot_credit) + parseFloat(item.credit_amount);
                                        }
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid) + parseFloat(item.credit_amount);
                                        //tot_credit_pay = parseFloat(tot_credit_pay) + parseFloat(item.credit_amount);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        if (last_bill_no != item.bill_no) {
                                            return_profit = parseFloat(item.profit) + parseFloat(return_profit);
                                            returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                            totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                            balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                            tot_credit = parseFloat(tot_credit) - parseFloat(item.credit_amount);
                                        }
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid) + parseFloat(item.credit_amount);
                                        //tot_debit_pay = parseFloat(tot_debit_pay) + parseFloat(item.credit_amount);
                                    }
                                    if (last_bill_no != item.bill_no) {
                                        if (item.order_type == "Order" && item.bill_type == "Sale") {
                                            sales_order = parseFloat(sales_order) + parseFloat(item.total);
                                        }
                                        if (item.order_type == "POS" && item.bill_type == "Sale") {
                                            sales_pos = parseFloat(sales_pos) + parseFloat(item.total);
                                        }
                                        if (item.order_type == "Order" && item.bill_type == "SaleReturn") {
                                            sales_order_return = parseFloat(sales_order_return) + parseFloat(item.total);
                                        }
                                        if (item.order_type == "POS" && item.bill_type == "SaleReturn") {
                                            sales_pos_return = parseFloat(sales_pos_return) + parseFloat(item.total);
                                        }
                                    }
                                    last_bill_no = item.bill_no;
                                
                            });

                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            $$("lblProfitAndTax").value((parseFloat(parseFloat(sales_profit) - parseFloat(return_profit)) + parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax))).toFixed(2));
                            //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblProfit").value(parseFloat(parseFloat(sales_profit).toFixed(2) - parseFloat(return_profit).toFixed(2)).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblAmountFromOrder").value(parseFloat(parseFloat(sales_order) - parseFloat(sales_order_return)).toFixed(2));
                            $$("lblAmountFromPOS").value(parseFloat(parseFloat(sales_pos) - parseFloat(sales_pos_return)).toFixed(2));
                            $$("lblTotalBills").value(bill_count);
                            $$("lblNetCredit").value(parseFloat(tot_credit).toFixed(2));
                            $$("msgPanel").hide();
                            var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_finfacts_comp_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_finfacts_comp_id") + "))"
                            if ($$("txtStartDate").getDate() != "") {
                                finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                            }
                            if ($$("txtEndDate").getDate() != "") {
                                finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                            }
                            page.accAccountService.searchValues(0, "", finfacts_data, "", function (data) {
                                $$("lblFinfactsExpenses").value(-(data[0].balance));
                                var cash = parseFloat($$("lblTotalPayment").value()) - parseFloat($$("lblTotalReturnsPayment").value()) - parseFloat($$("lblFinfactsExpenses").value());
                                $$("lblCashInHand").value(cash.toFixed(2));
                            });
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                        });
                        var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_finfacts_comp_id") + "))"

                        if ($$("txtStartDate").getDate() != "") {
                            finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                        }
                        if ($$("txtEndDate").getDate() != "") {
                            finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                        }

                        //var fin_data = "acc_id = " + CONTEXT.MISCELLANEOUS_ACNT

                        //if ($$("txtStartDate").getDate() != "") {
                        //    fin_data = fin_data + " and date(jrn_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                        //}
                        //if ($$("txtEndDate").getDate() != "") {
                        //    fin_data = fin_data + " and date(jrn_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                        //}
                }
                if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2200px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': " ", 'width': "50px", 'dataField': "", itemTemplate: "<input action='detail' type='button'  value='+' />" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "90px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_no", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "110px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "110px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': 'Payment Type', 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "110px", 'dataField': "balance" },
                                { 'name': "Credit Note", 'rlabel': 'Credit Note', 'width': "70px", 'dataField': "credit_amount" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "100px", 'dataField': "round_off" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "70px", 'dataField': "points" },
                                { 'name': "", 'width': "90%", 'dataField': "sl_no,bill_no", itemTemplate: "<div id='detailGrid'></div>" },
                            ]
                        });
                        var last_cust_no = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_cust_no != item.cust_no && item.cust_no != undefined && item.cust_no != null && item.cust_no!="") {
                                $(row).find(".header").show();
                                item.cust_no = item.cust_no == null ? "" : item.cust_no;
                                item.cust_name = item.cust_name == null ? "" : item.cust_name;
                                item.gst_no = item.gst_no == null ? "" : item.gst_no;
                                item.cust_address = item.cust_address == null ? "" : item.cust_address;
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Cust No : </span><span style='color:green'>" + item.cust_no + "</span>,  <span style='color:red'>Customer Name : </span><span style='color:green'>" + item.cust_name + "</span>,<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>Place Of Supply : </span><span style='color:green'>" + item.cust_address + "</span> </b> <span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_cust_no = item.cust_no;

                            $(row).find("input[action=detail]").click(function () {
                                if ($(this).val() == "+") {
                                    $(this).val("-");
                                    page.billPaymentAPI.searchValues("", "", "bill_no = " + item.bill_no, "", function (data) {
                                        var htmlTemplate = [];
                                        htmlTemplate.push("<div class='col-xs-12' style='font-weight:bold;margin-bottom:5px;'><span class='col-xs-1'>Pay Date</span><span class='col-xs-1'>Pay Type</span><span class='col-xs-1'>Pay Mode</span><span class='col-xs-1'>Amount</span></div>");
                                        $(data).each(function (i, trans) {
                                            htmlTemplate.push("<div class='col-xs-12' style='margin-bottom:5px;'><span class='col-xs-1'>" + trans.pay_date + "</span><span class='col-xs-1'>" + trans.bill_type + "</span><span class='col-xs-1'>" + trans.pay_mode + "</span><span class='col-xs-1'>" + trans.amount_pay + "</span></div>");
                                        });
                                        $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                                    });
                                }
                                else {
                                    $(this).val("+");
                                    $(row).find("[id=detailGrid]").html("");
                                }

                            });
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                            "paytype": ($$("ddlPayType").selectedValue() == "All") ? "" : $$("ddlPayType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            var last_bill_no = "";
                            var bill_count = 0;
                            $(data).each(function (i, item) {
                                if (last_bill_no != item.bill_no) {
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    bill_count = parseInt(bill_count) + 1;
                                }
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Sale") {
                                    
                                    if (last_bill_no != item.bill_no) {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                        customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                        tot_credit = parseFloat(tot_credit) + parseFloat(item.credit_amount);
                                        balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    }
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid) + parseFloat(item.credit_amount);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    
                                    if (last_bill_no != item.bill_no) {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                        customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                        tot_credit = parseFloat(tot_credit) - parseFloat(item.credit_amount);
                                        balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    }
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid) + parseFloat(item.credit_amount);
                                }
                                last_bill_no = item.bill_no;
                            });

                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(bill_count);
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("lblNetCredit").value(parseFloat(tot_credit).toFixed(2));
                            $$("msgPanel").hide();
                        });
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2300px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "90px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "110px", 'dataField': "bill_date" },
                                { 'name': "Total Bills", 'rlabel': "Total Bills", 'width': "110px", 'dataField': "bills" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "110px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': 'Payment Type', 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance" },
                                { 'name': "Credit Note", 'rlabel': 'Credit Note', 'width': "70px", 'dataField': "credit_amount" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "100px", 'dataField': "round_off" },
                                { 'name': "Cash Received", 'rlabel': 'Cash Received', 'width': "100px", 'dataField': "total_paid_amount" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "total_balance" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "70px", 'dataField': "points" },
                            ]
                        });
                        var last_cust_no = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_cust_no != item.cust_no && item.cust_no != undefined && item.cust_no != null && item.cust_no != "") {
                                $(row).find(".header").show();
                                item.cust_no = item.cust_no == null ? "" : item.cust_no;
                                item.cust_name = item.cust_name == null ? "" : item.cust_name;
                                item.gst_no = item.gst_no == null ? "" : item.gst_no;
                                item.cust_address = item.cust_address == null ? "" : item.cust_address;
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Cust No : </span><span style='color:green'>" + item.cust_no + "</span>,  <span style='color:red'>Customer Name : </span><span style='color:green'>" + item.cust_name + "</span>,<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>Place Of Supply : </span><span style='color:green'>" + item.cust_address + "</span> </b> <span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_cust_no = item.cust_no;
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                            "paytype": ($$("ddlPayType").selectedValue() == "All") ? "" : $$("ddlPayType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            var tot_bills = 0;
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills)
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid) + parseFloat(item.credit_amount);
                                    }
                                    tot_credit = parseFloat(tot_credit) + parseFloat(item.credit_amount);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid) + parseFloat(item.credit_amount);
                                    }
                                    tot_credit = parseFloat(tot_credit) - parseFloat(item.credit_amount);
                                }
                            });
                            var item = data[0];
                            totalSales = item.total_sales;
                            totalReturns = item.total_returns;
                            salestotalTax = item.total_sales_tax;
                            returntotalTax = item.total_return_tax;
                            tot_bills = item.total_bills;
                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value((parseFloat(totalSales) - parseFloat(totalSalesPayment)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("lblNetCredit").value(parseFloat(tot_credit).toFixed(2));

                            //$$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            //$$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            //$$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            //$$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            //$$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            //$$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            //$$("lblSalesBal").value((parseFloat(totalSales) - parseFloat(totalSalesPayment)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            //$$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            //$$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            //$$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            //$$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            //$$("lblNetCredit").value(parseFloat(tot_credit).toFixed(2));
                            $$("msgPanel").hide();
                        });
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "VariationWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Variation', 'rlabel': 'Variation', 'width': "180px", 'dataField': "variation_name" },
                                { 'name': "Item", 'rlabel': 'Item', 'width': "110px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Purchase Amount", 'rlabel': 'Purchase Amount', 'width': "200px", 'dataField': "cost" },
                                { 'name': "Sales Amount", 'rlabel': 'Sales Amount', 'width': "200px", 'dataField': "price" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "120px", 'dataField': "profit" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            //"store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "var_no": ($$("txtVariation").selectedValue() == "-1" || $$("txtVariation").selectedValue() == null) ? "" : $$("txtVariation").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            $$("grdTransactions").dataBind(data);
                            $$("msgPanel").hide();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    cost = (item.cost == null) ? "0" : item.cost;
                                    totalSales = parseFloat(totalSales) + parseFloat(cost);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.cost);
                                }
                            });
                            //$$("lblItemSales").value(parseFloat(totalSales).toFixed(2));
                            //$$("lblItemReturn").value(parseFloat(totalReturns).toFixed(2));
                            //$$("lblItemNetProfit").value(parseFloat(totalSales.toFixed(2) - totalReturns.toFixed(2)).toFixed(2));

                        });
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "trans_date" },
                                { 'name': 'Variation', 'rlabel': 'Variation', 'width': "150px", 'dataField': "variation_name" },
                                { 'name': "Item", 'rlabel': 'Item', 'width': "110px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Purchase Amount", 'rlabel': 'Purchase Amount', 'width': "200px", 'dataField': "cost" },
                                { 'name': "Sales Amount", 'rlabel': 'Sales Amount', 'width': "200px", 'dataField': "price" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "120px", 'dataField': "profit" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "var_no": ($$("txtVariation").selectedValue() == "-1" || $$("txtVariation").selectedValue() == null) ? "" : $$("txtVariation").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $$("msgPanel").hide();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    cost = (item.cost == null) ? "0" : item.cost;
                                    totalSales = parseFloat(totalSales) + parseFloat(cost);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.cost);
                                }
                            });
                            //$$("lblItemSales").value(parseFloat(totalSales).toFixed(2));
                            //$$("lblItemReturn").value(parseFloat(totalReturns).toFixed(2));
                            //$$("lblItemNetProfit").value(parseFloat(totalSales.toFixed(2) - totalReturns.toFixed(2)).toFixed(2));
                        });
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "SummaryDay" || $$("ddlViewMode").selectedData().view_name == "SummaryMonth" || $$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                    if ($$("ddlViewMode").selectedData().view_name == "SummaryDay") {
                        var day = "Date";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryMonth") {
                        var day = "Month";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                        var day = "Year";
                    }
                    else {
                        var day = "Date";
                    }
                    $$("grdTransactions").height("350px");
                    $$("grdTransactions").width("130%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "bill_date" },
                            { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                            { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                            { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment" },
                            { 'name': "Sales Balance", 'rlabel': 'Sales Balance', 'width': "110px", 'dataField': "sales_balance" },
                            { 'name': "Credit Note", 'rlabel': 'Credit Note', 'width': "70px", 'dataField': "credit_amount" },
                            { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "150px", 'dataField': "total_return" },
                            { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment" },
                            { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                            { 'name': "Debit Note", 'rlabel': 'Debit Note', 'width': "70px", 'dataField': "debit_amount" },
                            { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "150px", 'dataField': "discount" },
                            { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "100px", 'dataField': "tax" },
                            { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "150px", 'dataField': "net_sales" },
                            { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit" },
                        ]
                    });
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    }
                    var reportdata = {
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            page.resultFound();
                        }
                        else {
                            page.noResultFound();
                        }
                        $$("grdTransactions").dataBind(data);
                        $$("pnlGridFilter").show();
                        $(data).each(function (i, item) {
                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                            tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                            net_sales = parseFloat(item.net_sales) + parseFloat(net_sales);
                            totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                            balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                            totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment) + +parseFloat(item.credit_amount);
                            totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                            balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment) + parseFloat(item.debit_amount);
                            if (item.profit != null && item.profit != undefined && item.profit != "") {
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            }
                            tot_credit = parseFloat(tot_credit) + (parseFloat(item.credit_amount) - parseFloat(item.debit_amount));
                        });

                        $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                        $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                        $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                        $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                        $$("lblNetSales").value(parseFloat(net_sales).toFixed(2));
                        $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                        $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                        $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                        $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                        $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                        $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                        $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                        $$("lblNetCredit").value(parseFloat(tot_credit).toFixed(2));
                        $$("msgPanel").hide();
                    })
                }
                if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                    if ($$("ddlPaymentType").selectedData().mode_type == "All" && $$("ddlSummaryFilter").selectedValue() == "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "100px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Net Bank") {
                                    total_net_bank_amount = parseFloat(total_net_bank_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Finance") {
                                    tot_finance = parseFloat(tot_finance) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            $$("lblTotalNetBankAmount").value(parseFloat(total_net_bank_amount).toFixed(2));
                            $$("lblTotalFinanceAmount").value(parseFloat(tot_finance).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else if ($$("ddlPaymentType").selectedData().mode_type != "All" && $$("ddlSummaryFilter").selectedValue() == "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "100px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Date', 'rlabel': 'Date', 'width': "100px", 'dataField': "bill_date" },
                                { 'name': 'Pay mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Net Bank") {
                                    total_net_bank_amount = parseFloat(total_net_bank_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Finance") {
                                    tot_finance = parseFloat(tot_finance) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            $$("lblTotalNetBankAmount").value(parseFloat(total_net_bank_amount).toFixed(2));
                            $$("lblTotalFinanceAmount").value(parseFloat(tot_finance).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "100px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "bill_date" },
                                { 'name': 'Pay mode', 'rlabel': 'Pay mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Net Bank") {
                                    total_net_bank_amount = parseFloat(total_net_bank_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Finance") {
                                    tot_finance = parseFloat(tot_finance) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            $$("lblTotalNetBankAmount").value(parseFloat(total_net_bank_amount).toFixed(2));
                            $$("lblTotalFinanceAmount").value(parseFloat(tot_finance).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2000px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Order Id', 'rlabel': 'Order Id', 'width': "70px", 'dataField': "order_id", visible: false },
                                { 'name': 'Order Id', 'rlabel': 'Order Id', 'width': "70px", 'dataField': "order_no" },
                                { 'name': 'State', 'rlabel': 'Order State', 'width': "150px", 'dataField': "state_name", filterType: "Text" },
                                { 'name': 'Customer', 'rlabel': 'Customer', 'width': "150px", 'dataField': "cust_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid", filterType: "Text" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance", filterType: "Text" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "90px", 'dataField': "sub_total", filterType: "Text" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst", filterType: "Text" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst", filterType: "Text" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst", filterType: "Text" },
                                //{ 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", filterType: "Text" },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_per", filterType: "Text", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "120px", 'dataField': "round_off", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "status": ($$("ddlState").selectedValue() == "-1") ? "" : $$("ddlState").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue()=="-1") ? "" : $$("ddlCustomer").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                }
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            });
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("1800px");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': 'Orders', 'rlabel': 'Orders', 'width': "70px", 'dataField': "orders" },
                                    { 'name': 'State', 'rlabel': 'Order State', 'width': "150px", 'dataField': "state_name" },
                                    { 'name': 'Customer', 'rlabel': 'Customer', 'width': "70px", 'dataField': "cust_name" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "ordered_date" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                    { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid", filterType: "Text" },
                                    { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance", filterType: "Text" },
                                    { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "90px", 'dataField': "sub_total", filterType: "Text" },
                                    { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                    { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                    { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                    { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                    //{ 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per" },
                                    { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_val", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                    { 'name': "Discount ", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Round off", 'rlabel': 'Round Off', 'width': "90px", 'dataField': "round_off", filterType: "Text" },
                                    { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "status": ($$("ddlState").selectedValue() == "-1") ? "" : $$("ddlState").selectedValue(),
                                "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                var tot_orders = 0;
                                $(data).each(function (i, item) {
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    tot_orders = parseFloat(tot_orders) + parseFloat(item.orders);
                                    if (item.bill_type == "Sale") {
                                        salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                });
                                $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                                //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_orders).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                    if ($$("ddlDeliveryBy").selectedValue() == "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                //{ 'name': 'SE Barcode', 'rlabel': 'SE Barcode', 'width': "150px", 'dataField': "sales_executive_barcode" },
                                { 'name': 'Sales Executve', 'rlabel': 'Sales Executve', 'width': "150px", 'dataField': "sale_executive_name" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "tot_qty", filterType: "Text" },
                                { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "100px", 'dataField': "tot_amount", filterType: "Text" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "100px", 'dataField': "points", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "comp_id": localStorage.getItem("user_company_id"),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                            "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        }
                        if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                            reportdata.bill_type = $$("ddlBillType").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $$("msgPanel").hide();
                            $(data).each(function (i, item) {
                                item.tot_qty = (item.tot_qty == null) ? 0 : item.tot_qty;
                                item.tot_amount = (item.tot_amount == null) ? 0 : item.tot_amount;
                                item.points = (item.points == null) ? 0 : item.points;
                                if (item.bill_type == "Sale") {
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    sales_tot_qty = parseFloat(sales_tot_qty) + parseFloat(item.tot_qty);

                                    tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                    tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                    executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    return_tot_qty = parseFloat(return_tot_qty) + parseFloat(item.tot_qty);

                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                    tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                    executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                }
                            });
                            $$("pnlSalesSummary").hide();
                            $$("pnlSalesReturnSummary").hide();
                            $$("pnlTotalSalesPoint").hide();
                            $$("pnlTotalReturnsPoint").hide();
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(executive_net_points).toFixed(2));
                            //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblTotalSalesQty").value((parseFloat(sales_tot_qty) - parseFloat(return_tot_qty)).toFixed(2));
                            $$("lblTotalAmount").value(parseFloat(tot_amount).toFixed(2));
                            $$("lblTotalPoints").value(parseFloat(executive_net_points).toFixed(2));
                        })
                    }
                    else if ($$("ddlDeliveryBy").selectedValue() != "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                //{ 'name': 'SE Barcode', 'rlabel': 'SE Barcode', 'width': "150px", 'dataField': "sales_executive_barcode", filterType: "Text" },
                                { 'name': 'Sales Executve', 'rlabel': 'Sales Executve', 'width': "150px", 'dataField': "sale_executive_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "tot_qty", filterType: "Text" },
                                { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "90px", 'dataField': "tot_amount", filterType: "Text" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "90px", 'dataField': "points", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "comp_id": localStorage.getItem("user_company_id"),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                            "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        }
                        if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                            reportdata.bill_type = $$("ddlBillType").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                item.tot_qty = (item.tot_qty == null) ? 0 : item.tot_qty;
                                item.tot_amount = (item.tot_amount == null) ? 0 : item.tot_amount;
                                item.points = (item.points == null) ? 0 : item.points;
                                if (item.bill_type == "Sale") {
                                    executive_sales_points = parseFloat(executive_sales_points) + parseFloat(item.points);
                                    tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                    tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                    executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    executive_return_points = parseFloat(totalReturnsPayment) + parseFloat(item.points);
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                    tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                    executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                }
                                if (item.bill_type == "Sale") {
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                }
                            });
                            $$("pnlSalesSummary").show();
                            $$("pnlSalesReturnSummary").show();
                            $$("pnlTotalSalesPoint").show();
                            $$("pnlTotalReturnsPoint").show();
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblTotalSalesQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalAmount").value(parseFloat(tot_amount).toFixed(2));
                            $$("lblTotalPoints").value(parseFloat(executive_net_points).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "trans_date", filterType: "Text" },
                                    //{ 'name': 'SE Barcode', 'rlabel': 'SE Barcode', 'width': "150px", 'dataField': "sales_executive_barcode", filterType: "Text" },
                                    { 'name': 'Sales Executve', 'rlabel': 'Sales Executve', 'width': "150px", 'dataField': "sale_executive_name", filterType: "Text" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                    //{ 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                    { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "tot_qty", filterType: "Text" },
                                    { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "100px", 'dataField': "tot_amount", filterType: "Text" },
                                    { 'name': "Points", 'rlabel': 'Points', 'width': "90px", 'dataField': "points", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "comp_id": localStorage.getItem("user_company_id"),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                                "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            }
                            if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                                reportdata.bill_type = $$("ddlBillType").selectedValue();
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    item.tot_qty = (item.tot_qty == null) ? 0 : item.tot_qty;
                                    item.tot_amount = (item.tot_amount == null) ? 0 : item.tot_amount;
                                    item.points = (item.points == null) ? 0 : item.points;
                                    if (item.bill_type == "Sale") {
                                        customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                        tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                        tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                        executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                        tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                        executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                    }
                                });
                                $$("pnlSalesSummary").hide();
                                $$("pnlSalesReturnSummary").hide();
                                $$("pnlTotalSalesPoint").hide();
                                $$("pnlTotalReturnsPoint").hide();
                                $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                                $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                                //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                                $$("lblNetPoint").value(parseFloat(executive_net_points).toFixed(2));
                                $$("lblTotalSalesQty").value(parseFloat(tot_qty).toFixed(2));
                                $$("lblTotalAmount").value(parseFloat(tot_amount).toFixed(2));
                                $$("lblTotalPoints").value(parseFloat(executive_net_points).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no", filterType: "Text" },
                                { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "70px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "90px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "cost", filterType: "Text" },
                                { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "90px", 'dataField': "price", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "90px", 'dataField': "profit_per", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item.cost) + parseFloat(item_cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item.price) + parseFloat(item_price);
                                    } if (item.profit != null && item.profit != undefined && item.profit != "") {
                                        item_profit = parseFloat(item.profit) + parseFloat(item_profit);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item_cost) - parseFloat(item.cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item_price) - parseFloat(item.price);
                                    }
                                    if (item.profit != null && item.profit != undefined && item.profit != "") {
                                        item_profit = parseFloat(item_profit) - parseFloat(item.profit);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                            $$("lblSellingCost").value(parseFloat(item_price).toFixed(2));
                            $$("lblTotalProfit").value(parseFloat(item_profit).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no", filterType: "Text" },
                                { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "cost", filterType: "Text" },
                                { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "90px", 'dataField': "price", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item.cost)) + parseFloat(item_cost);
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item.price)) + parseFloat(item_price);
                                    item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item.profit)) + parseFloat(item_profit);
                                }
                                else {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item_cost) - parseFloat(item.cost));
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item_price) - parseFloat(item.price));
                                    item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item_profit) - parseFloat(item.profit));
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                            $$("lblSellingCost").value(parseFloat(item_price).toFixed(2));
                            $$("lblTotalProfit").value(parseFloat(item_profit).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0" && masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Register', 'rlabel': 'Register', 'width': "70px", 'dataField': "reg_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "70px", 'dataField': "user_name", filterType: "Text" },
                                { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                //{ 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "to_bill": $$("txtToBill").value(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        //if ($$("ddlRegister").selectedValue() != "-1") {
                        //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                        //}
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            //$$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "0" && masterPage.controls.ddlGlobalRegisterName.selectedValue() != "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Register', 'rlabel': 'Register', 'width': "70px", 'dataField': "reg_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "70px", 'dataField': "user_name", filterType: "Text" },
                                //{ 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                { 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            //"reg_no": ($$("ddlRegister").selectedValue() == "-1") ? "" : $$("ddlRegister").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "end_bill": $$("txtToBill").value(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        //if ($$("ddlRegister").selectedValue() != "-1") {
                        //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                        //}
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                //if (item.qty != undefined) {
                                //    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                //}
                                //tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            //$$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': 'Machine', 'rlabel': 'Machine', 'width': "70px", 'dataField': "reg_name", filterType: "Text" },
                                    { 'name': 'User', 'rlabel': 'User', 'width': "70px", 'dataField': "user_name", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                    { 'name': "Bills", 'rlabel': 'Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                    { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                    { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                                //"reg_no": ($$("ddlRegister").selectedValue() == "-1") ? "" : $$("ddlRegister").selectedValue(),
                                "from_bill": $$("txtFromBill").value(),
                                "end_bill": $$("txtToBill").value(),
                            }
                            reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                            //if ($$("ddlRegister").selectedValue() != "-1") {
                            //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                            //}
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    //if (item.qty != undefined) {
                                    //    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    //}
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                    if (item.bill_type == "Sale") {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) + parseFloat(item.qty);
                                        }
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                        }
                                    }
                                });
                                $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                //$$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                                $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "CollectorWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Collector No', 'rlabel': 'Collector No', 'width': "130px", 'dataField': "collector_no" },
                                { 'name': 'Collector', 'rlabel': 'Collector', 'width': "70px", 'dataField': "collector_name" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                                { 'name': "Collected Amount", 'rlabel': 'Collected Amount', 'width': "130px", 'dataField': "collected_amount", filterType: "Text" },
                                { 'name': "Balance Amount", 'rlabel': 'Balance Amount', 'width': "130px", 'dataField': "balance_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        $$("grdTransactions").dataBind([]);
                        $$("msgPanel").hide();
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "dat", filterType: "Text" },
                                { 'name': 'Collector No', 'rlabel': 'Collector No', 'width': "130px", 'dataField': "collector_no", filterType: "Text" },
                                { 'name': 'Collector', 'rlabel': 'Collector', 'width': "70px", 'dataField': "collector_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_code", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                                { 'name': "Collected Amount", 'rlabel': 'Collected Amount', 'width': "130px", 'dataField': "collected_amount", filterType: "Text" },
                                { 'name': "Balance Amount", 'rlabel': 'Balance Amount', 'width': "130px", 'dataField': "balance_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        $$("grdTransactions").dataBind([]);
                        $$("msgPanel").hide();
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("110%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills", filterType: "Text" },
                                { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                                { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment", filterType: "Text" },
                                { 'name': "Sales Balance", 'rlabel': 'Sales Balance', 'width': "110px", 'dataField': "sales_balance" },
                                { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                                { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_sales", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                                totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                                balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            });
                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetAmt").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(balanceSales).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                    { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name" },
                                    { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                    { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                                    { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment", filterType: "Text" },
                                    { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                    { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                    { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_sales", filterType: "Text" },
                                    { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                                });
                                $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblNetAmt").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblSalesBal").value(parseFloat(balanceSales).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                    if ($$("ddlLoginUser").selectedValue() == "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "150px", 'dataField': "user_name" },
                                { 'name': 'Machine', 'rlabel': 'Machine', 'width': "150px", 'dataField': "reg_name" },
                                //{ 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                //{ 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "-1" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        //if ($$("ddlRegister").selectedValue() != "-1") {
                        //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                        //}
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                }
                            });
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else if ($$("ddlLoginUser").selectedValue() != "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "150px", 'dataField': "user_name" },
                                { 'name': 'Machine', 'rlabel': 'Machine', 'width': "150px", 'dataField': "reg_name" },
                                //{ 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "total_bill" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        //if ($$("ddlRegister").selectedValue() != "-1") {
                        //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                        //}
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                }
                            });
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                    { 'name': 'User', 'rlabel': 'User', 'width': "150px", 'dataField': "user_name" },
                                    { 'name': 'Machine', 'rlabel': 'Machine', 'width': "150px", 'dataField': "reg_name" },
                                    { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type" },
                                    { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            }
                            reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                            //if ($$("ddlRegister").selectedValue() != "-1") {
                            //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                            //}
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                    if (item.bill_type == "Sale") {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    }
                                });
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "BillItemwise") {
                    $$("grdTransactions").height("400px");
                    $$("grdTransactions").width("100%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "50px", 'dataField': "item_no",visible:false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "100px", 'dataField': "item_code", },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name", },
                            { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "110px", 'dataField': "sub_total" },
                            { 'name': "GST", 'rlabel': 'GST', 'width': "100px", 'dataField': "tax" },
                            { 'name': "CGST", 'rlabel': 'CGST', 'width': "80px", 'dataField': "cgst" },
                            { 'name': "SGST", 'rlabel': 'SGST', 'width': "80px", 'dataField': "sgst" },
                            { 'name': "IGST", 'rlabel': 'IGST', 'width': "80px", 'dataField': "igst" },
                            { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "80px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "80px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                            { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "110px", 'dataField': "total_price" },
                        ]
                    });
                    var last_bill_no = "";
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        if (last_bill_no != item.bill_no && item.bill_no != undefined && item.bill_no != null && item.bill_no != "") {
                            $(row).find(".header").show();
                            item.bill_no = item.bill_no == null ? "" : item.bill_no;
                            item.bill_date = item.bill_date == null ? "" : item.bill_date;
                            item.bill_type = item.bill_type == null ? "" : item.bill_type;
                            item.cust_no = item.cust_no == null ? "" : item.cust_no;
                            item.cust_name = item.cust_name == null ? "" : item.cust_name;
                            item.gst_no = item.gst_no == null ? "" : item.gst_no;
                            item.cust_address = item.cust_address == null ? "" : item.cust_address;
                            $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Bill No : </span><span style='color:green'>" + item.bill_code + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Bill Date : </span><span style='color:green'>" + item.bill_date + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Bill Amount : </span><span style='color:green'>" + item.total + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Customer Name : </span><span style='color:green'>" + item.cust_name + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Cust Address : </span><span style='color:green'>" + item.cust_address + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Cust Mobile : </span><span style='color:green'>" + item.mobile_no + "</span></b> <span>");
                            tot_bills++;
                            $$("lblTotalBills").value(tot_bills);
                        }
                        else
                            $(row).find(".header").hide();
                        last_bill_no = item.bill_no;
                    }
                    var reportdata = {
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "from_bill": $$("txtFromBill").value(),
                        "to_bill": $$("txtToBill").value(),
                        "paymode": "",
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            page.resultFound();
                        }
                        else {
                            page.noResultFound();
                        }
                        $$("grdTransactions").dataBind(data);
                        $$("pnlGridFilter").show();
                        var lastBillNo;
                        $(data).each(function (i, item) {
                            item.discount = (item.discount == null || item.discount == "" || typeof item.discount == "undefined") ? "0" : item.discount;
                            item.tax = (item.tax == null || item.tax == "" || typeof item.tax == "undefined") ? "0" : item.tax;
                            item.total_price = (item.total_price == null || item.total_price == "" || typeof item.total_price == "undefined") ? "0" : item.total_price;
                            item.profit = (item.profit == null || item.profit == "" || typeof item.profit == "undefined") ? "0" : item.profit;

                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            if (item.bill_type == "Sale") {
                                salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                if (lastBillNo != item.bill_no)
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                //totalSales = parseFloat(totalSales) + parseFloat(item.total_price);
                            }
                            if (item.bill_type == "SaleReturn") {
                                returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                if (lastBillNo != item.bill_no)
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                //totalReturns = parseFloat(totalReturns) + parseFloat(item.total_price);
                            }
                            lastBillNo = item.bill_no;
                        });
                        $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                        $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                        $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                        $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                        $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                        $$("msgPanel").hide();
                    });
                }


                if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                    $$("lblSummaryName").value("Standard Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").hide();
                    $$("pnlExpense").show();
                    $$("pnlCashInHand").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").show();
                }
                if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                    $$("lblSummaryName").value("CustomerWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").show();
                    $$("pnlTotalReturnsPoint").show();
                    $$("pnlNetPoint").show();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").show();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "SummaryDay") {
                    $$("lblSummaryName").value("SummaryDay Summary");
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").show();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "SummaryMonth") {
                    $$("lblSummaryName").value("SummaryMonth Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").show();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "SummaryYear") {
                    $$("lblSummaryName").value("SummaryYear Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").show();
                }
                if ($$("ddlViewMode").selectedData().view_name == "VariationWise") {
                    $$("lblSummaryName").value("VariationWise Summary")
                    $$("pnlSummary").hide();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                    $$("lblSummaryName").value("PaymentWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").show();
                    $$("pnlTotalCardAmount").show();
                    $$("pnlTotalChequeAmount").show();
                    $$("pnlTotalNetBankAmount").show();
                    $$("pnlTotalFinanceAmount").show();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                    $$("lblSummaryName").value("OrderWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                    $$("lblSummaryName").value("SalesExecutiveWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlNetPoint").show();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").show();
                    $$("pnlTotalAmount").show();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "ItemWise") {
                    $$("lblSummaryName").value("ItemWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").show();
                    $$("pnlTotalBuyingCost").show();
                    $$("pnlSellingCost").show();
                    $$("pnlTotalProfit").show();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                    $$("lblSummaryName").value("MachineWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").show();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "CollectorWise") {
                    $$("lblSummaryName").value("CollectorWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").show();
                    $$("pnlTotalBalance").show();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                    $$("lblSummaryName").value("StoreWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").show();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                    $$("lblSummaryName").value("UserWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "BillItemwise") {
                    $$("lblSummaryName").value("Bill Itemwise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalNetBankAmount").hide();
                    $$("pnlTotalFinanceAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").hide();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetCredit").hide();
                }
            },
            page_load: function () {
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
                        start_record: 0,
                        end_record: "",
                        filter_expression: "store_no in (" + menu_ids.join(",") + ")",
                        sort_expression: ""
                    }
                    //page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //    $$("ddlStore").dataBind(data, "store_no", "store_name", "All");
                    //});
                });
                store_refresh = false;
                masterPage.controls.ddlGlobalStoreName.dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name", "All");
                masterPage.controls.ddlGlobalRegisterName.dataBind($.parseJSON(localStorage.getItem("user_register_data")), "reg_no", "reg_name", "All");
                masterPage.controls.ddlGlobalStoreName.selectedValue(localStorage.getItem("user_store_no"));
                masterPage.controls.ddlGlobalRegisterName.selectedValue(localStorage.getItem("user_register_id"));
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                    sort_expression: ""
                }
                page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.controls.ddlRegister.dataBind(data, "reg_no", "reg_name", "All");
                    $(data).each(function (i, item) {
                        reg_ids.push(item.reg_no);
                    })
                });
                page.salesexecutiveAPI.searchValues("", "", "saexe_active='1'", "", function (data) {
                    page.controls.ddlDeliveryBy.dataBind(data, "sale_executive_no", "sale_executive_name", "All");
                    page.controls.ddlItemSalesMan.dataBind(data, "sale_executive_no", "sale_executive_name", "All");
                });
                
                page.controls.ddlLoginUser.dataBind(CONTEXT.USERIDACCESS, "user_id", "user_name", "All");
                var summaryFilterData = [];
                summaryFilterData.push({ mode_no: "0", mode_name: "All" }, { mode_no: "1", mode_name: "SummaryDay" }, { mode_no: "2", mode_name: "SummaryMonth" }, { mode_no: "3", mode_name: "SummaryYear" })
                $$("ddlSummaryFilter").dataBind(summaryFilterData, "mode_no", "mode_name");
                $$("ddlSummaryFilter").selectionChange(function () {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("txtStartDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                        $$("txtEndDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    }
                    else {
                        $$("txtStartDate").selectedObject.val("");
                        $$("txtEndDate").selectedObject.val("");
                    }
                });
                var itemFilterData = [];
                itemFilterData.push({ item_mode_no: "1", item_mode_name: "Overall" }, { item_mode_no: "2", item_mode_name: "Saleswise" })
                $$("ddlItemFilter").dataBind(itemFilterData, "item_mode_no", "item_mode_name", "Select");
                var filterViewData = [];
                filterViewData.push({ view_no: "1", view_name: "Standard" }, { view_no: "2", view_name: "CustomerWise" },
                    //{ view_no: "3", view_name: "VariationWise" },
                    { view_no: "4", view_name: "SummaryDay" }, { view_no: "5", view_name: "SummaryMonth" }, { view_no: "6", view_name: "SummaryYear" }, { view_no: "7", view_name: "PaymentWise" }, { view_no: "10", view_name: "ItemWise" }, { view_no: "11", view_name: "MachineWise" },
                    //{ view_no: "12", view_name: "CollectorWise" },
                    { view_no: "13", view_name: "StoreWise" }, { view_no: "14", view_name: "UserWise" }, { view_no: "15", view_name: "BillItemwise" });
                if (CONTEXT.ENABLE_SALES_ORDER_REPORT)
                    filterViewData.push({ view_no: "8", view_name: "OrderWise" });
                if (CONTEXT.ENABLE_SALES_EXECUTIVE)
                    filterViewData.push({ view_no: "9", view_name: "SalesExecutiveWise" });
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");
                page.shopOnStatesAPI.searchValues("", "", "so_t=1", "", function (data) {
                    $$("ddlState").dataBind(data, "state_no", "state_name", "All");
                });
                page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                    $$("ddlCustomer").dataBind(data, "cust_no", "cust_name", "All");
                });
                page.controls.txtItem.dataBind({
                    getData: function (term, callback) {
                        callback(item_list);
                    }
                });
                page.itemAPI.searchValues("", "", "", "", function (data) {
                    item_list = data;
                });
                page.controls.txtVariation.dataBind({
                    getData: function (term, callback) {
                        callback(variations);
                    }
                });
                page.variationAPI.searchValues("", "", "", "", function (data1) {
                    variations = data1;
                });
                page.stockAPI.searchVariationsMain("select item_no from item_t where comp_id =" + localStorage.getItem("user_company_id"), localStorage.getItem("user_store_no"), function (data1) {
                    variation_list = data1;
                });
                $$("lblNetSaleName").click(function () {
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("pnlAmountFromPOS").toggle();
                        $$("pnlAmountFromOrder").toggle();
                    }
                })
                var bill_typedata = [];
                bill_typedata.push({ "bill_type": "Sale" }, { "bill_type": "SaleReturn" });//, { "bill_type": "SaleSaved" }
                $$("ddlBillType").dataBind(bill_typedata, "bill_type", "bill_type", "All");
                var payModeType = [];
                payModeType.push({ mode_type: "All" }, { mode_type: "Cash" }, { mode_type: "Card" });
                if (CONTEXT.ENABLE_CHEQUE_PAYMENT_MODE)
                    payMode.push({ mode_type: "Cheque" });
                if (CONTEXT.ENABLE_NET_BANK_PAYMENT_MODE)
                    payModeType.push({ mode_type: "Net Bank" });
                if (CONTEXT.ENABLE_FINANCE_PAYMENT_MODE)
                    payModeType.push({ mode_type: "Finance" });
                page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
                var payMode = [];
                payMode.push({ mode_type: "All" }, { mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Cheque" });
                if (CONTEXT.ENABLE_REWARD_MODULE == true)
                    payMode.push({ mode_type: "Points" })
                if (CONTEXT.ENABLE_COUPON_MODULE && false)
                    payMode.push({ mode_type: "Coupon" })
                payMode.push({ mode_type: "Mixed" });
                payMode.push({ mode_type: "Loan" });
                if (CONTEXT.ENABLE_EMI_PAYMENT) {
                    payMode.push({ mode_type: "EMI" });
                }
                payMode.push({ mode_type: "Net Bank" }, { mode_type: "Finance" });
                page.controls.ddlPayType.dataBind(payMode, "mode_type", "mode_type");
                $(".register-header").hide();
                $$("ddlViewMode").selectionChange(function (data) {
                    $(".register-header").hide();
                    if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").show();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").show();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").show();
                        $$("pnlNetCredit").show();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "VariationWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").show();
                        $$("pnlVariation").show();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("lblNetSaleName").attr("style", "user-select: none;cursor: pointer;");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").show();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").show();
                        $$("pnlNetCredit").show();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryDay" ||
                        $$("ddlViewMode").selectedData().view_name == "SummaryMonth" || $$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").show();
                        page.refreshAll();
                        $$("txtStartDate").selectedObject.val("");
                        $$("txtEndDate").selectedObject.val("");
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").show();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").show();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlTransType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").show();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").show();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                        $(".register-header").show();
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").show();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "CollectorWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").show();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").show();
                        $$("pnlLineman").hide();
                        $$("pnlUser").show();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetCredit").hide();
                        page.controls.ddlLoginUser.dataBind(CONTEXT.USERIDACCESS, "user_id", "user_name", "All");
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "BillItemwise") {
                        $$("lblNetSaleName").attr("style", "user-select: none;cursor: pointer;");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        //$$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").hide();
                        $$("pnlNetCredit").hide();
                        page.refreshAll();
                    }
                });
                setTimeout(function () {
                    $$("pnlFilterPanel").show();
                    $$("pnlItemSalesExecutive").hide();
                    $$("pnlBillType").show();
                    $$("pnlFromBill").show();
                    $$("pnlToBill").show();
                    //$$("pnlStore").show();
                    $$("pnlPayment").show();
                    $$("pnlPayMode").show();
                    $$("txtStartDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("txtEndDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("lblNetSaleName").attr("style", "user-select: none;cursor: pointer;");
                    $$("ddlViewMode").selectedObject.focus();
                }, 1000);
                //$$("ddlPayType").selectedObject.change(function () {
                //    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                //        $$("btnGenerate").focus();
                //    }
                //});
                $$("ddlExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
            },
            btnSTHideFilter_click: function () {
                $$("grdTransactions").clearFilter();
            },
            btnSTShowFilter_click: function () {
                $$("grdTransactions").showFilter();
            },
        }
        page.noResultFound = function () {
            $$("pnlEmptyGrid").show();
            $$("pnlSummary").hide();
            $$("pnlGridTransaction").hide();
        }
        page.resultFound = function () {
            $$("pnlEmptyGrid").hide();
            $$("pnlSummary").show();
            $$("pnlGridTransaction").show();
        }
        page.refreshAll = function () {
            $$("txtStartDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
            $$("txtEndDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
            //$$("txtStartDate").selectedObject.val("");
            //$$("txtEndDate").selectedObject.val("");
            $$("ddlCustomer").selectedValue(-1);
            $$("txtItem").selectedObject.val("");
            $$("txtVariation").selectedObject.val("");
            $$("ddlBillType").selectedValue(-1);
            $$("ddlStore").selectedValue(-1);
            $$("txtFromBill").value("");
            $$("txtToBill").value("");
            $$("ddlState").selectedValue(-1);
            $$("ddlDeliveryBy").selectedValue(-1);
            $$("ddlPaymentType").selectedValue("All");
            $$("ddlItemSalesMan").selectedValue(-1);
            $$("ddlRegister").selectedValue(-1);
            //$$("ddlLineman").selectedValue(-1);
            $$("ddlLoginUser").selectedValue(-1);
            $$("ddlItemFilter").selectedValue(-1);
            $$("ddlSummaryFilter").selectedValue(0);
        }
        page.events.jasperReport = function () {
            var detail_list = [];
            var filter = {};
            var net_profit = 0;
            var totalTax = 0;
            var filter = {};
            var totalSales = 0;
            var totalSalesPayment = 0;
            var balanceSales = 0;
            var totalReturns = 0;
            var totalReturnsPayment = 0;
            var balanceReturns = 0;
            var salestotalTax = 0;
            var returntotalTax = 0;
            var totalTax = 0;
            var executive_sales_points = 0;
            var executive_return_points = 0;
            var executive_net_points = 0;
            var tot_bills = 0;
            var total_cash_amount = 0;
            var total_card_amount = 0;
            var total_cheque_amount = 0;
            var total_bill_amount = 0;
            var tot_qty = 0;
            var sales_tot_qty = 0;
            var return_tot_qty = 0;
            var tot_amount = 0;
            var item_profit = 0;
            var item_cost = 0;
            var item_price = 0;
            var temp_cost;
            var temp_price;
            var customer_sales_points = 0;
            var customer_return_points = 0;
            var sales_order = 0;
            var sales_order_return = 0;
            var sales_pos = 0;
            var sales_pos_return = 0;
            var net_sales = 0;
            var net_profit = 0;
            var sales_profit = 0;
            var return_profit = 0;
            var totalPaymentDiscount = 0;
            var tot_net_balance = 0;
            var tot_finance = 0;
            var detail_list = [];
            var exp_type = $$("ddlExportType").selectedValue();
            
            if ($$("ddlViewMode").selectedData().view_name == "BillItemwise") {
                var reportdata = {
                    "viewMode": $$("ddlViewMode").selectedData().view_name,
                    "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                    "from_bill": $$("txtFromBill").value(),
                    "to_bill": $$("txtToBill").value(),
                    "paymode": "",
                }
                page.salesReportAPI.salesReport(reportdata, function (data) {
                    if (data.length > 0) {
                        $(data).each(function (i, item) {
                            page.data_size = parseFloat(data.length).toFixed(2);
                            detail_list.push({
                                "Sl No Name": "Sl No",
                                "Bill No Name": "Bill No : ",
                                "Bill Date Name": "Bill Date : ",
                                "Bill Amount Name": "Bill Amount : ",
                                "Customer Name": "Customer : ",
                                "Cust GST Name": "Cust GST : ",
                                "Cust Address Name": "Cust Address : ",
                                "Customer Mobile Name": "Customer Mobile : ",
                                "Item No Name": "Item No",
                                "Item Label Name": "Item Name",
                                "Sub Total Name": "Sub Total",
                                "GST Name": "GST",
                                "CGST Name": "CGST",
                                "SGST Name": "SGST",
                                "IGST Name": "IGST",
                                "Discount Name": "Discount",
                                "Net Amount Name": "Net Amount",
                                "Sl No": parseInt(i) + parseInt(1),
                                "Bill No": item.bill_code + " ",
                                "Bill Date": item.bill_date+" ",
                                "Bill Amount": item.total + " ",
                                "Customer": item.cust_name + " ",
                                "Cust Address": item.cust_address + " ",
                                "Cust GST": item.gst_no + " ",
                                "Customer Mobile": item.mobile_no + " ",
                                "Item No": item.item_code,
                                "Item Name": item.item_name,
                                "Sub Total": item.sub_total,
                                "GST": item.tax,
                                "CGST": item.cgst,
                                "SGST": item.sgst,
                                "IGST": item.igst,
                                "Discount": item.discount,
                                "Net Amount": item.total_price
                            })
                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            if (item.bill_type == "Sale") {
                                salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                totalSales = parseFloat(totalSales) + parseFloat(item.total_price);
                            }
                            if (item.bill_type == "SaleReturn") {
                                returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_price);
                            }
                        });
                        var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Total Sales Balance",
                                "Total Sales Reward Name": "Total Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Total Return Payment",
                                "Total Return Balance Name": "Total Return Balance",
                                "Total Return Reward Name": "Total Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": parseFloat(totalSales).toFixed(2),
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": parseFloat(totalReturns).toFixed(2),
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2),
                                "Discount": parseFloat(totalPaymentDiscount).toFixed(2),
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": $$("lblTotalBills").value(),
                                "Net Sales": parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "true",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "true",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "true",
                                "is Discount": "true",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "true",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "isBillItemWise": "true",
                                "BillItemWise": detail_list
                            };
                        GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                            $$("pnlPrintingPopup").close();
                            //page.controls.pnlPrintingPopup.close();
                            $$("pnlBillViewPopup").open();
                            $$("pnlBillViewPopup").title("Bill View");
                            $$("pnlBillViewPopup").rlabel("Bill View");
                            $$("pnlBillViewPopup").width("1000");
                            $$("pnlBillViewPopup").height("600");
                            $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                        });
                    }
                });
            }
            if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_company_id") + "))"
                if ($$("txtStartDate").getDate() != "") {
                    finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                }
                if ($$("txtEndDate").getDate() != "") {
                    finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                }
                page.accAccountService.searchValues(0, "", finfacts_data, "", function (data) {
                    page.std_balance = -(data[0].balance);
                });
                var reportdata = {
                    "viewMode": $$("ddlViewMode").selectedData().view_name,
                    //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                    "from_bill": $$("txtFromBill").value(),
                    "to_bill": $$("txtToBill").value(),
                    "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                }
                page.salesReportAPI.salesReport(reportdata, function (data) {
                    var detail = data;
                    if (data.length > 0) {
                        page.data_size = parseFloat(data.length).toFixed(2);
                        var last_bill_no;
                        $(data).each(function (i, item) {
                            detail_list.push({
                                "Sl No Name": "Sl No",
                                "Bill No Name": "Bill No",
                                "Bill Type Name": "Bill Type",
                                "Customer Name": "Customer",
                                "Bill Date Name": "Bill Date",
                                "Pay Mode Name": "Pay Mode",
                                "Payment Type Name": "Payment Type",
                                "Sub Total Name": "Sub Total",
                                "GST Name": "GST",
                                "CGST Name": "CGST",
                                "SGST Name": "SGST",
                                "IGST Name": "IGST",
                                "CESS PER Name": "CESS PER",
                                "CESS RATE Name": "CESS RATE",
                                "Discount Name": "Discount",
                                "Round Off Name": "Round Off",
                                "Net Amount Name": "Net Amount",
                                "Paid Name": "Paid",
                                "Balance Name": "Balance",
                                "Profit Name": "Profit",
                                "Sl No": parseInt(i) + parseInt(1),
                                "Bill No": item.bill_code,
                                "Bill Type": item.bill_type,
                                "Customer": item.cust_name,
                                "Bill Date": item.bill_date,
                                "Pay Mode": item.pay_mode,
                                "Payment Type": item.payment_mode,
                                "Sub Total": item.sub_total,
                                "GST": item.tax,
                                "CGST": item.cgst,
                                "SGST": item.sgst,
                                "IGST": item.igst,
                                "CESS PER": item.cess_per,
                                "CESS RATE": item.cess_rate,
                                "Discount": item.discount,
                                "Round Off": item.round_off,
                                "Net Amount": item.total,
                                "Paid": item.paid,
                                "Balance": item.balance,
                                "Profit": item.profit
                            })
                            if (last_bill_no != item.bill_no) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Sale") {
                                    sales_profit = parseFloat(item.profit) + parseFloat(sales_profit);
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    return_profit = parseFloat(item.profit) + parseFloat(return_profit);
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                }
                                if (item.order_type == "Order" && item.bill_type == "Sale") {
                                    sales_order = parseFloat(sales_order) + parseFloat(item.total);
                                }
                                if (item.order_type == "POS" && item.bill_type == "Sale") {
                                    sales_pos = parseFloat(sales_pos) + parseFloat(item.total);
                                }
                                if (item.order_type == "Order" && item.bill_type == "SaleReturn") {
                                    sales_order_return = parseFloat(sales_order_return) + parseFloat(item.total);
                                }
                                if (item.order_type == "POS" && item.bill_type == "SaleReturn") {
                                    sales_pos_return = parseFloat(sales_pos_return) + parseFloat(item.total);
                                }
                            }
                            last_bill_no = item.bill_no;
                        });
                        
                        page.net_balance = (parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2)) - (parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                        page.cash = parseFloat(totalSalesPayment) - parseFloat(totalReturnsPayment) - parseFloat(page.std_balance);
                        var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "Total Sales Name": "Total Sales",
                            "Total Sales Payment Name": "Total Sales Payment",
                            "Total Sales Balance Name": "Total Sales Balance",
                            "Total Sales Reward Name": "Total Sales Reward",
                            "Total Return Name": "Total Return",
                            "Total Return Payment Name": "Total Return Payment",
                            "Total Return Balance Name": "Total Return Balance",
                            "Total Return Reward Name": "Total Return Reward",
                            "Total Tax Name": "Total Tax",
                            "Discount Name": "Discount",
                            "Total Profit and Tax Name": "Total Profit and Tax",
                            "Profit Name": "Profit",
                            "Expense Name": "Expense",
                            "Net Balance Name": "Net Balance",
                            "Net Reward Name": "Net Reward",
                            "Total Bills Name": "Total Bills",
                            "Net Sales Name": "Net Sales",
                            "Net Amt Name": "Net Amt",
                            "Amt From POS Name": "Amt From POS",
                            "Amt From Order Name": "Amt From Order",
                            "Cash In Hand Name": "Cash In Hand",
                            "Total Bill Amount Name": "Total Bill Amount",
                            "Total Cash Name": "Total Cash",
                            "Total Card Name": "Total Card",
                            "Total Cheque Name": "Total Cheque",
                            "Total Collected Amt Name": "Total Collected Amt",
                            "Total Sales Qty Name": "Total Sales Qty",
                            "Total Amount Name": "Total Amount",
                            "Total Points Name": "Total Points",
                            "Total Qty Name": "Total Qty",
                            "Total Buying Cost Name": "Total Buying Cost",
                            "Total Selling Cost Name": "Total Selling Cost",
                            "Total Profit Name": "Total Profit",
                            "Total Sales": parseFloat($$("lblTotalSales").value()).toFixed(2),//parseFloat(totalSales).toFixed(2),
                            "Total Sales Payment": parseFloat($$("lblTotalPayment").value()).toFixed(2),//parseFloat(totalSalesPayment).toFixed(2),
                            "Total Sales Balance": parseFloat($$("lblSalesBal").value()).toFixed(2),//parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2),
                            "Total Sales Reward": "",
                            "Total Return": parseFloat($$("lblTotalReturns").value()).toFixed(2),//parseFloat(totalReturns).toFixed(2),
                            "Total Return Payment": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),//parseFloat(totalReturnsPayment).toFixed(2),
                            "Total Return Balance": parseFloat($$("lblReturnBal").value()).toFixed(2),//parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                            "Total Return Reward": "",
                            "Total Tax": parseFloat($$("lblTotalTax").value()).toFixed(2),//parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2),
                            "Discount": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),//parseFloat(totalPaymentDiscount).toFixed(2),
                            "Total Profit and Tax": parseFloat($$("lblProfitAndTax").value()).toFixed(2),//(parseFloat(parseFloat(sales_profit) - parseFloat(return_profit)) + parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax))).toFixed(2),
                            "Profit": parseFloat($$("lblProfit").value()).toFixed(2),//parseFloat(parseFloat(sales_profit).toFixed(2) - parseFloat(return_profit).toFixed(2)).toFixed(2),
                            "Expense": parseFloat($$("lblFinfactsExpenses").value()).toFixed(2),//page.std_balance,
                            "Net Balance": parseFloat($$("lblNetBalance").value()).toFixed(2),//page.net_balance,
                            "Net Reward": "",
                            "Total Bills": parseFloat($$("lblTotalBills").value()).toFixed(2),//page.data_size,
                            "Net Sales": parseFloat($$("lblNetSales").value()).toFixed(2),//parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                            "Net Amt": "",
                            "Amt From POS": parseFloat($$("lblAmountFromPOS").value()).toFixed(2),//parseFloat(parseFloat(sales_pos) - parseFloat(sales_pos_return)).toFixed(2),
                            "Amt From Order": parseFloat($$("lblAmountFromOrder").value()).toFixed(2),//parseFloat(parseFloat(sales_order) - parseFloat(sales_order_return)).toFixed(2),
                            "Cash In Hand": parseFloat($$("lblCashInHand").value()).toFixed(2),//page.cash.toFixed(2),
                            "Total Bill Amount": "",
                            "Total Cash": "",
                            "Total Card": "",
                            "Total Cheque": "",
                            "Total Collected Amt": "",
                            "Total Sales Qty": "",
                            "Total Amount": "",
                            "Total Points": "",
                            "Total Qty": "",
                            "Total Buying Cost": "",
                            "Total Selling Cost": "",
                            "Total Profit": "",
                            "is Total Sales": "true",
                            "is Total Sales Payment": "true",
                            "is Total Sales Balance": "true",
                            "is Total Sales Reward": "false",
                            "is Total Return": "true",
                            "is Total Return Payment": "true",
                            "is Total Return Balance": "true",
                            "is Total Return Reward": "false",
                            "is Total Tax": "true",
                            "is Discount": "true",
                            "is Total Profit and Tax": "true",
                            "is Profit": "true",
                            "is Expense": "true",
                            "is Net Balance": "true",
                            "is Net Reward": "false",
                            "is Total Bills": "true",
                            "is Net Sales": "true",
                            "is Net Amt": "false",
                            "is Amt From POS": "true",
                            "is Amt From Order": "true",
                            "is Cash In Hand": "true",
                            "is Total Bill Amount": "false",
                            "is Total Cash": "false",
                            "is Total Card": "false",
                            "is Total Cheque": "false",
                            "is Total Collected Amt": "false",
                            "is Total Sales Qty": "false",
                            "is Total Amount": "false",
                            "is Total Points": "false",
                            "is Total Qty": "false",
                            "is Total Buying Cost": "false",
                            "is Total Selling Cost": "false",
                            "is Total Profit": "false",
                            "isStandard": "true",
                            "isCustomerWise": "false",
                            "isPaymentWise": "false",
                            "isOrderWise": "false",
                            "isSalesExecutiveWise": "false",
                            "isItemWise": "false",
                            "isMachineWise": "false",
                            "isCollectorWise": "false",
                            "isStoreWise": "false",
                            "isUserWise": "false",
                            "isSummaryWise": "false",
                            "Standard": detail_list
                        };
                        GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                            $$("pnlPrintingPopup").close();
                            //page.controls.pnlPrintingPopup.close();
                            $$("pnlBillViewPopup").open();
                            $$("pnlBillViewPopup").title("Bill View");
                            $$("pnlBillViewPopup").rlabel("Bill View");
                            $$("pnlBillViewPopup").width("1000");
                            $$("pnlBillViewPopup").height("600");
                            $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                        });
                    }
                })
            }
            else if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                if ($$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        page.data_size = parseFloat(data.length).toFixed(2);
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                if (item.cust_no == null) {
                                    var cust_no = " ";
                                    var cust_no_name = "Cust No";
                                } else {
                                    var cust_no = " " + item.cust_no + "; ";
                                    var cust_no_name = "Cust No";
                                }
                                if (item.cust_name == null) {
                                    var cust = " ";
                                    var cust_name = "Customer";
                                } else {
                                    var cust = " " + item.cust_name + "; ";
                                    var cust_name = "Customer";
                                }
                                if (item.gst_no == null) {
                                    var cust_gst_no = " ";
                                    var cust_gst_no_name = "Cust GST";
                                } else {
                                    var cust_gst_no = " " + item.gst_no + "; ";
                                    var cust_gst_no_name = "Cust GST";
                                }
                                if (item.cust_address == null) {
                                    var cust_address = " ";
                                    var cust_address_name = "Place Of Supply";
                                } else {
                                    var cust_address = " " + item.cust_address + "; ";
                                    var cust_address_name = "Place Of Supply";
                                }
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Bill No Name": "Bill No",
                                    "Bill Date Name": "Bill Date",
                                    "Bill Type Name": "Bill Type",
                                    "Sub Total Name": "Sub Total",
                                    "Customer No Name": cust_no_name,
                                    "Customer Name": cust_name,
                                    "Customer GST Name": cust_gst_no_name,
                                    "Place Of Supply Name": cust_address_name,
                                    "GST Name": "GST",
                                    "CGST Name": "CGST",
                                    "SGST Name": "SGST",
                                    "IGST Name": "IGST",
                                    "CESS PER Name": "CESS PER",
                                    "CESS RATE Name": "CESS RATE",
                                    "Discount Name": "Discount",
                                    "Round Off Name": "Round Off",
                                    "Net Amount Name": "Net Amount",
                                    "Paid Name": "Paid",
                                    "Balance Name": "Balance",
                                    "Points Name": "Points",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Bill No": item.bill_code,
                                    "Bill Date": item.bill_date,
                                    "Bill Type": item.bill_type,
                                    "Sub Total": item.sub_total,
                                    "Customer NO": cust_no,
                                    "Customer": cust,
                                    "Customer GST": cust_gst_no,
                                    "Place Of Supply": cust_address,
                                    "GST": item.tax,
                                    "CGST": item.cgst,
                                    "SGST": item.sgst,
                                    "IGST": item.igst,
                                    "CESS PER": item.cess_per,
                                    "CESS RATE": item.cess_rate,
                                    "Discount": item.discount,
                                    "Round Off": item.round_off,
                                    "Net Amount": item.total,
                                    "Paid": item.paid,
                                    "Balance": item.balance,
                                    "Points": item.points
                                })
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": parseFloat($$("lblTotalSales").value()).toFixed(2),//parseFloat(totalSales).toFixed(2),
                                "Total Sales Payment": parseFloat($$("lblTotalPayment").value()).toFixed(2),//parseFloat(totalSalesPayment).toFixed(2),
                                "Total Sales Balance": parseFloat($$("lblSalesBal").value()).toFixed(2),//parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2),
                                "Total Sales Reward": parseFloat($$("lblTotalSalesPoint").value()).toFixed(2),//parseFloat(customer_sales_points).toFixed(2),
                                "Total Return": parseFloat($$("lblTotalReturns").value()).toFixed(2),//parseFloat(totalReturns).toFixed(2),
                                "Total Return Payment": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),//parseFloat(totalReturnsPayment).toFixed(2),
                                "Total Return Balance": parseFloat($$("lblReturnBal").value()).toFixed(2),//parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                                "Total Return Reward": parseFloat($$("lblTotalReturnsPoint").value()).toFixed(2),//parseFloat(customer_return_points).toFixed(2),
                                "Total Tax": parseFloat($$("lblTotalTax").value()).toFixed(2),//parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2),
                                "Discount": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),//parseFloat(totalPaymentDiscount).toFixed(2),
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": parseFloat($$("lblNetBalance").value()).toFixed(2),//parseFloat(parseFloat(balanceSales) - parseFloat(balanceReturns)).toFixed(2),
                                "Net Reward": parseFloat($$("lblNetPoint").value()).toFixed(2),//parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2),
                                "Total Bills": parseFloat($$("lblTotalBills").value()).toFixed(2),//page.data_size,
                                "Net Sales": parseFloat($$("lblNetSales").value()).toFixed(2),//parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "true",
                                "is Total Sales Payment": "true",
                                "is Total Sales Balance": "true",
                                "is Total Sales Reward": "true",
                                "is Total Return": "true",
                                "is Total Return Payment": "true",
                                "is Total Return Balance": "true",
                                "is Total Return Reward": "true",
                                "is Total Tax": "true",
                                "is Discount": "true",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "true",
                                "is Net Reward": "true",
                                "is Total Bills": "true",
                                "is Net Sales": "true",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "true",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "CustomerWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() == "1") {
                        var day = "Date";
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                        var day = "Month";
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                        var day = "Year";
                    }
                    else {
                        var day = "Date";
                    }
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                if (item.cust_no == null) {
                                    var cust_no = " ";
                                    var cust_no_name = "Cust No";
                                } else {
                                    var cust_no = " " + item.cust_no + "; ";
                                    var cust_no_name = "Cust No";
                                }
                                if (item.cust_name == null) {
                                    var cust = " ";
                                    var cust_name = "Customer";
                                } else {
                                    var cust = " " + item.cust_name + "; ";
                                    var cust_name = "Customer";
                                }
                                if (item.gst_no == null) {
                                    var cust_gst_no = " ";
                                    var cust_gst_no_name = "Cust GST";
                                } else {
                                    var cust_gst_no = " " + item.gst_no + "; ";
                                    var cust_gst_no_name = "Cust GST";
                                }
                                if (item.cust_address == null) {
                                    var cust_address = " ";
                                    var cust_address_name = "Place Of Supply";
                                } else {
                                    var cust_address = " " + item.cust_address + "; ";
                                    var cust_address_name = "Place Of Supply";
                                }
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Bill No Name": "Total Bills",
                                    "Bill Date Name": day,
                                    "Bill Type Name": "Bill Type",
                                    "Sub Total Name": "Sub Total",
                                    "Customer No Name": cust_no_name,
                                    "Customer Name": cust_name,
                                    "Customer GST Name": cust_gst_no_name,
                                    "Place Of Supply Name": cust_address_name,
                                    "GST Name": "GST",
                                    "CGST Name": "CGST",
                                    "SGST Name": "SGST",
                                    "IGST Name": "IGST",
                                    "CESS PER Name": "CESS PER",
                                    "CESS RATE Name": "CESS RATE",
                                    "Discount Name": "Discount",
                                    "Round Off Name": "Round Off",
                                    "Net Amount Name": "Net Amount",
                                    "Paid Name": "Paid",
                                    "Balance Name": "Balance",
                                    "Points Name": "Points",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Bill No": item.bills,
                                    "Bill Date": item.bill_date,
                                    "Bill Type": item.bill_type,
                                    "Sub Total": item.sub_total,
                                    "Customer NO": cust_no,
                                    "Customer": cust,
                                    "Customer GST": cust_gst_no,
                                    "Place Of Supply": cust_address,
                                    "GST": item.tax,
                                    "CGST": item.cgst,
                                    "SGST": item.sgst,
                                    "IGST": item.igst,
                                    "CESS PER": item.cess_per,
                                    "CESS RATE": item.cess_rate,
                                    "Discount": item.discount,
                                    "Round Off": item.round_off,
                                    "Net Amount": item.total,
                                    "Paid": item.total_paid_amount,
                                    "Balance": item.total_balance,
                                    "Points": item.points
                                })
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills)
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                }
                            });

                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": parseFloat($$("lblTotalSales").value()).toFixed(2),//parseFloat(totalSales).toFixed(2),
                                "Total Sales Payment": parseFloat($$("lblTotalPayment").value()).toFixed(2),//parseFloat(totalSalesPayment).toFixed(2),
                                "Total Sales Balance": parseFloat($$("lblSalesBal").value()).toFixed(2),//parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2),
                                "Total Sales Reward": parseFloat($$("lblTotalSalesPoint").value()).toFixed(2),//parseFloat(customer_sales_points).toFixed(2),
                                "Total Return": parseFloat($$("lblTotalReturns").value()).toFixed(2),//parseFloat(totalReturns).toFixed(2),
                                "Total Return Payment": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),//parseFloat(totalReturnsPayment).toFixed(2),
                                "Total Return Balance": parseFloat($$("lblReturnBal").value()).toFixed(2),//parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                                "Total Return Reward": parseFloat($$("lblTotalReturnsPoint").value()).toFixed(2),//parseFloat(customer_return_points).toFixed(2),
                                "Total Tax": parseFloat($$("lblTotalTax").value()).toFixed(2),//parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2),
                                "Discount": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),//parseFloat(totalPaymentDiscount).toFixed(2),
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": parseFloat($$("lblNetBalance").value()).toFixed(2),//parseFloat(parseFloat(balanceSales) - parseFloat(balanceReturns)).toFixed(2),
                                "Net Reward": parseFloat($$("lblNetPoint").value()).toFixed(2),//parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2),
                                "Total Bills": parseFloat($$("lblTotalBills").value()).toFixed(2),//page.data_size,
                                "Net Sales": parseFloat($$("lblNetSales").value()).toFixed(2),//parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "true",
                                "is Total Sales Payment": "true",
                                "is Total Sales Balance": "true",
                                "is Total Sales Reward": "true",
                                "is Total Return": "true",
                                "is Total Return Payment": "true",
                                "is Total Return Balance": "true",
                                "is Total Return Reward": "true",
                                "is Total Tax": "true",
                                "is Discount": "true",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "true",
                                "is Net Reward": "true",
                                "is Total Bills": "true",
                                "is Net Sales": "true",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "true",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "CustomerWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    });
                }
            }
            else if ($$("ddlViewMode").selectedData().view_name == "SummaryDay" || $$("ddlViewMode").selectedData().view_name == "SummaryMonth" || $$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                if ($$("ddlViewMode").selectedData().view_name == "SummaryDay") {
                    var day = "Date";
                }
                else if ($$("ddlViewMode").selectedData().view_name == "SummaryMonth") {
                    var day = "Month";
                }
                else if ($$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                    var day = "Year";
                }
                else {
                    var day = "Date";
                }
                var reportdata = {
                    "viewMode": $$("ddlViewMode").selectedData().view_name,
                    //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                    "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                }
                page.salesReportAPI.salesReport(reportdata, function (data) {
                    if (data.length > 0) {
                        $(data).each(function (i, item) {
                            detail_list.push({
                                "Sl No Name": "Sl No",
                                "Date Name": day,
                                "Total Bills Name": "Total Bills",
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Sales Balance Name": "Sales Balance",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Total Return Payment",
                                "Return Balance Name": "Return Balance",
                                "Total Discount Name": "Total Discount",
                                "Total Tax Name": "Total Tax",
                                "Net Amount Name": "Net Amount",
                                "Profit Name": "Profit",
                                "Sl No": parseInt(i) + parseInt(1),
                                "Date": item.bill_date,
                                "Total Bills": item.bills,
                                "Total Sales": item.total_sales,
                                "Total Sales Payment": item.total_sales_payment,
                                "Sales Balance": item.sales_balance,
                                "Total Return": item.total_return,
                                "Total Return Payment": item.total_return_payment,
                                "Return Balance": item.return_balance,
                                "Total Discount": item.discount,
                                "Total Tax": item.tax,
                                "Net Amount": item.net_sales,
                                "Profit": item.profit
                            })
                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                            tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                            net_sales = parseFloat(item.net_sales) + parseFloat(net_sales);
                            totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                            balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                            totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                            totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                            balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                            if (item.profit != null && item.profit != undefined && item.profit != "") {
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            }
                        });

                        var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "Total Sales Name": "Total Sales",
                            "Total Sales Payment Name": "Total Sales Payment",
                            "Total Sales Balance Name": "Sales Balance",
                            "Total Sales Reward Name": "Sales Reward",
                            "Total Return Name": "Total Return",
                            "Total Return Payment Name": "Return Payment",
                            "Total Return Balance Name": "Return Balance",
                            "Total Return Reward Name": "Return Reward",
                            "Total Tax Name": "Total Tax",
                            "Discount Name": "Discount",
                            "Total Profit and Tax Name": "Total Profit and Tax",
                            "Profit Name": "Profit",
                            "Expense Name": "Expense",
                            "Net Balance Name": "Net Balance",
                            "Net Reward Name": "Net Reward",
                            "Total Bills Name": "Total Bills",
                            "Net Sales Name": "Net Sales",
                            "Net Amt Name": "Net Amt",
                            "Amt From POS Name": "Amt From POS",
                            "Amt From Order Name": "Amt From Order",
                            "Cash In Hand Name": "Cash In Hand",
                            "Total Bill Amount Name": "Total Bill Amount",
                            "Total Cash Name": "Total Cash",
                            "Total Card Name": "Total Card",
                            "Total Cheque Name": "Total Cheque",
                            "Total Collected Amt Name": "Total Collected Amt",
                            "Total Sales Qty Name": "Total Sales Qty",
                            "Total Amount Name": "Total Amount",
                            "Total Points Name": "Total Points",
                            "Total Qty Name": "Total Qty",
                            "Total Buying Cost Name": "Total Buying Cost",
                            "Total Selling Cost Name": "Total Selling Cost",
                            "Total Profit Name": "Total Profit",
                            "Total Sales": parseFloat(totalSales).toFixed(2),
                            "Total Sales Payment": parseFloat(totalSalesPayment).toFixed(2),
                            "Total Sales Balance": parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2),
                            "Total Sales Reward": "",
                            "Total Return": parseFloat(totalReturns).toFixed(2),
                            "Total Return Payment": parseFloat(totalReturnsPayment).toFixed(2),
                            "Total Return Balance": parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                            "Total Return Reward": "",
                            "Total Tax": parseFloat(totalTax).toFixed(2),
                            "Discount": parseFloat(totalPaymentDiscount).toFixed(2),
                            "Total Profit and Tax": "",
                            "Profit": parseFloat(net_profit).toFixed(2),
                            "Expense": "",
                            "Net Balance": parseFloat(parseFloat(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2))) - parseFloat(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)))).toFixed(2),
                            "Net Reward": "",
                            "Total Bills": tot_bills.toFixed(2),
                            "Net Sales": parseFloat(net_sales).toFixed(2),
                            "Net Amt": "",
                            "Amt From POS": "",
                            "Amt From Order": "",
                            "Cash In Hand": "",
                            "Total Bill Amount": "",
                            "Total Cash": "",
                            "Total Card": "",
                            "Total Cheque": "",
                            "Total Collected Amt": "",
                            "Total Sales Qty": "",
                            "Total Amount": "",
                            "Total Points": "",
                            "Total Qty": "",
                            "Total Buying Cost": "",
                            "Total Selling Cost": "",
                            "Total Profit": "",
                            "is Total Sales": "true",
                            "is Total Sales Payment": "true",
                            "is Total Sales Balance": "true",
                            "is Total Sales Reward": "false",
                            "is Total Return": "true",
                            "is Total Return Payment": "true",
                            "is Total Return Balance": "true",
                            "is Total Return Reward": "false",
                            "is Total Tax": "true",
                            "is Discount": "true",
                            "is Total Profit and Tax": "false",
                            "is Profit": "true",
                            "is Expense": "false",
                            "is Net Balance": "true",
                            "is Net Reward": "false",
                            "is Total Bills": "true",
                            "is Net Sales": "true",
                            "is Net Amt": "false",
                            "is Amt From POS": "false",
                            "is Amt From Order": "false",
                            "is Cash In Hand": "false",
                            "is Total Bill Amount": "false",
                            "is Total Cash": "false",
                            "is Total Card": "false",
                            "is Total Cheque": "false",
                            "is Total Collected Amt": "false",
                            "is Total Sales Qty": "false",
                            "is Total Amount": "false",
                            "is Total Points": "false",
                            "is Total Qty": "false",
                            "is Total Buying Cost": "false",
                            "is Total Selling Cost": "false",
                            "is Total Profit": "false",
                            "isStandard": "false",
                            "isCustomerWise": "false",
                            "isPaymentWise": "false",
                            "isOrderWise": "false",
                            "isSalesExecutiveWise": "false",
                            "isItemWise": "false",
                            "isMachineWise": "false",
                            "isCollectorWise": "false",
                            "isStoreWise": "false",
                            "isUserWise": "false",
                            "isSummaryWise": "true",
                            "SummaryWise": detail_list
                        };
                        GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                            $$("pnlPrintingPopup").close();
                            $$("pnlBillViewPopup").open();
                            $$("pnlBillViewPopup").title("Bill View");
                            $$("pnlBillViewPopup").rlabel("Bill View");
                            $$("pnlBillViewPopup").width("1000");
                            $$("pnlBillViewPopup").height("600");
                            $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                        });
                    }
                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                if ($$("ddlPaymentType").selectedData().mode_type == "All" && $$("ddlSummaryFilter").selectedValue() == "-1") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Date Name": "Date",
                                    "Pay Mode Name": "Pay Mode",
                                    "Bill Amount Name": "Bill Amount",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Date": item.bill_date,
                                    "Pay Mode": item.pay_mode,
                                    "Bill Amount": item.bill_amount
                                })
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": total_bill_amount,
                                "Total Cash": total_cash_amount,
                                "Total Card": total_card_amount,
                                "Total Cheque": total_cheque_amount,
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "true",
                                "is Total Card": "true",
                                "is Total Cheque": "true",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "true",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "PaymentWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }

                    });
                }
                else if ($$("ddlPaymentType").selectedData().mode_type != "All" && $$("ddlSummaryFilter").selectedValue() == "-1") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Date Name": "Date",
                                    "Pay Mode Name": "Pay Mode",
                                    "Bill Amount Name": "Bill Amount",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Date": item.bill_date,
                                    "Pay Mode": item.pay_mode,
                                    "Bill Amount": item.bill_amount
                                })
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": total_bill_amount,
                                "Total Cash": total_cash_amount,
                                "Total Card": total_card_amount,
                                "Total Cheque": total_cheque_amount,
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "true",
                                "is Total Card": "true",
                                "is Total Cheque": "true",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "true",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "PaymentWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    });
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() == "1") {
                        var day = "Date";
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                        var day = "Month";
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                        var day = "Year";
                    }
                    else {
                        var day = "Date";
                    }
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Date Name": day,
                                    "Pay Mode Name": "Pay Mode",
                                    "Bill Amount Name": "Bill Amount",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Date": item.bill_date,
                                    "Pay Mode": item.pay_mode,
                                    "Bill Amount": item.bill_amount
                                })
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": total_bill_amount,
                                "Total Cash": total_cash_amount,
                                "Total Card": total_card_amount,
                                "Total Cheque": total_cheque_amount,
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "true",
                                "is Total Card": "true",
                                "is Total Cheque": "true",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "true",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "PaymentWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    });
                }
            }
            else if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                if ($$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "status": ($$("ddlState").selectedValue() == "-1") ? "" : $$("ddlState").selectedValue(),
                        "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Order Id Name": "Order Id",
                                    "State Name": "State",
                                    "Customer Name": "Customer",
                                    "Bill No Name": "Bill No",
                                    "Bill Date Name": "Bill Date",
                                    "Bill Type Name": "Bill Type",
                                    "Bill Amount Name": "Bill Amount",
                                    "GST Name": "GST",
                                    "CGST Name": "CGST",
                                    "SGST Name": "SGST",
                                    "IGST Name": "IGST",
                                    "CESS PER Name": "CESS PER",
                                    "CESS RATE Name": "CESS RATE",
                                    "Discount Name": "Discount",
                                    "Round Off Name": "Round Off",
                                    "Net Amount Name": "Net Amount",
                                    "Paid Name": "Paid",
                                    "Balance Name": "Balance",
                                    "Profit Name": "Profit",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Order Id": item.order_id,
                                    "State": item.state_name,
                                    "Customer": item.cust_name,
                                    "Bill No": item.bill_code,
                                    "Bill Date": item.bill_date,
                                    "Bill Type": item.bill_type,
                                    "Bill Amount": item.sub_total,
                                    "GST": item.tax,
                                    "CGST": item.cgst,
                                    "SGST": item.sgst,
                                    "IGST": item.igst,
                                    //"CESS PER": cess_per,
                                    "CESS RATE": item.cess_rate,
                                    "Discount": item.discount,
                                    "Round Off": item.round_off,
                                    "Net Amount": item.total,
                                    "Paid": item.paid,
                                    "Balance": item.balance,
                                    "Profit": item.profit
                                })
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                }
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": parseFloat(totalSales).toFixed(2),
                                "Total Sales Payment": parseFloat(totalSalesPayment).toFixed(2),
                                "Total Sales Balance": parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2),
                                "Total Sales Reward": "",
                                "Total Return": parseFloat(totalReturns).toFixed(2),
                                "Total Return Payment": parseFloat(totalReturnsPayment).toFixed(2),
                                "Total Return Balance": parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                                "Total Return Reward": "",
                                "Total Tax": parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2),
                                "Discount": parseFloat(totalPaymentDiscount).toFixed(2),
                                "Total Profit and Tax": "",
                                "Profit": parseFloat(net_profit).toFixed(2),
                                "Expense": "",
                                "Net Balance": parseFloat(parseFloat(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2))) - parseFloat(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)))).toFixed(2),
                                "Net Reward": "",
                                "Total Bills": parseFloat(data.length).toFixed(2),
                                "Net Sales": parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "true",
                                "is Total Sales Payment": "true",
                                "is Total Sales Balance": "true",
                                "is Total Sales Reward": "false",
                                "is Total Return": "true",
                                "is Total Return Payment": "true",
                                "is Total Return Balance": "true",
                                "is Total Return Reward": "false",
                                "is Total Tax": "true",
                                "is Discount": "true",
                                "is Total Profit and Tax": "false",
                                "is Profit": "true",
                                "is Expense": "false",
                                "is Net Balance": "true",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "true",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "true",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "OrderWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() != "0") {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        var tot_orders = 0;
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "status": ($$("ddlState").selectedValue()) ? "" : $$("ddlState").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                $(data).each(function (i, item) {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Order Id Name": "Orders",
                                        "State Name": "State",
                                        "Customer Name": "Customer",
                                        "Bill No Name": day,
                                        "Bill Date Name": "Bill Type",
                                        "Bill Type Name": "Bill Amount",
                                        "Bill Amount Name": "GST",
                                        "GST Name": "CGST",
                                        "CGST Name": "SGST",
                                        "SGST Name": "IGST",
                                        "IGST Name": "CESS PER",
                                        "CESS PER Name": "CESS RATE",
                                        "CESS RATE Name": "Discount",
                                        "Discount Name": "Round Off",
                                        "Round Off Name": "Net Amount",
                                        "Net Amount Name": "Paid",
                                        "Paid Name": "Balance",
                                        "Balance Name": "Profit",
                                        "Profit Name": "",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        "Order Id": item.orders,
                                        "State": item.state_name,
                                        "Customer": item.cust_name,
                                        "Bill No": item.ordered_date,
                                        "Bill Date": item.bill_type,
                                        "Bill Type": item.sub_total,
                                        "Bill Amount": item.tax,
                                        "GST": item.cgst,
                                        "CGST": item.sgst,
                                        "SGST": item.igst,
                                        "IGST": item.igst,
                                        "CESS PER": item.cess_rate,
                                        "CESS RATE": item.discount,
                                        "Discount": item.round_off,
                                        "Round Off": item.total,
                                        "Net Amount": item.paid,
                                        "Paid": item.balance,
                                        "Balance": item.profit,
                                        "Profit": ""
                                    })
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    tot_orders = parseFloat(tot_orders) + parseFloat(item.orders);
                                    if (item.bill_type == "Sale") {
                                        salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                });
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Payment Name": "Total Sales Payment",
                                    "Total Sales Balance Name": "Sales Balance",
                                    "Total Sales Reward Name": "Sales Reward",
                                    "Total Return Name": "Total Return",
                                    "Total Return Payment Name": "Return Payment",
                                    "Total Return Balance Name": "Return Balance",
                                    "Total Return Reward Name": "Return Reward",
                                    "Total Tax Name": "Total Tax",
                                    "Discount Name": "Discount",
                                    "Total Profit and Tax Name": "Total Profit and Tax",
                                    "Profit Name": "Profit",
                                    "Expense Name": "Expense",
                                    "Net Balance Name": "Net Balance",
                                    "Net Reward Name": "Net Reward",
                                    "Total Bills Name": "Total Bills",
                                    "Net Sales Name": "Net Sales",
                                    "Net Amt Name": "Net Amt",
                                    "Amt From POS Name": "Amt From POS",
                                    "Amt From Order Name": "Amt From Order",
                                    "Cash In Hand Name": "Cash In Hand",
                                    "Total Bill Amount Name": "Total Bill Amount",
                                    "Total Cash Name": "Total Cash",
                                    "Total Card Name": "Total Card",
                                    "Total Cheque Name": "Total Cheque",
                                    "Total Collected Amt Name": "Total Collected Amt",
                                    "Total Sales Qty Name": "Total Sales Qty",
                                    "Total Amount Name": "Total Amount",
                                    "Total Points Name": "Total Points",
                                    "Total Qty Name": "Total Qty",
                                    "Total Buying Cost Name": "Total Buying Cost",
                                    "Total Selling Cost Name": "Total Selling Cost",
                                    "Total Profit Name": "Total Profit",
                                    "Total Sales": parseFloat(totalSales).toFixed(2),
                                    "Total Sales Payment": parseFloat(totalSalesPayment).toFixed(2),
                                    "Total Sales Balance": parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2),
                                    "Total Sales Reward": "",
                                    "Total Return": parseFloat(totalReturns).toFixed(2),
                                    "Total Return Payment": parseFloat(totalReturnsPayment).toFixed(2),
                                    "Total Return Balance": parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                                    "Total Return Reward": "",
                                    "Total Tax": parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2),
                                    "Discount": parseFloat(totalPaymentDiscount).toFixed(2),
                                    "Total Profit and Tax": "",
                                    "Profit": parseFloat(net_profit).toFixed(2),
                                    "Expense": "",
                                    "Net Balance": parseFloat(parseFloat(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2))) - parseFloat(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)))).toFixed(2),
                                    "Net Reward": "",
                                    "Total Bills": parseFloat(tot_orders).toFixed(2),
                                    "Net Sales": parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                                    "Net Amt": "",
                                    "Amt From POS": "",
                                    "Amt From Order": "",
                                    "Cash In Hand": "",
                                    "Total Bill Amount": "",
                                    "Total Cash": "",
                                    "Total Card": "",
                                    "Total Cheque": "",
                                    "Total Collected Amt": "",
                                    "Total Sales Qty": "",
                                    "Total Amount": "",
                                    "Total Points": "",
                                    "Total Qty": "",
                                    "Total Buying Cost": "",
                                    "Total Selling Cost": "",
                                    "Total Profit": "",
                                    "is Total Sales": "true",
                                    "is Total Sales Payment": "true",
                                    "is Total Sales Balance": "true",
                                    "is Total Sales Reward": "false",
                                    "is Total Return": "true",
                                    "is Total Return Payment": "true",
                                    "is Total Return Balance": "true",
                                    "is Total Return Reward": "false",
                                    "is Total Tax": "true",
                                    "is Discount": "true",
                                    "is Total Profit and Tax": "false",
                                    "is Profit": "true",
                                    "is Expense": "false",
                                    "is Net Balance": "true",
                                    "is Net Reward": "false",
                                    "is Total Bills": "true",
                                    "is Net Sales": "true",
                                    "is Net Amt": "false",
                                    "is Amt From POS": "false",
                                    "is Amt From Order": "false",
                                    "is Cash In Hand": "false",
                                    "is Total Bill Amount": "false",
                                    "is Total Cash": "false",
                                    "is Total Card": "false",
                                    "is Total Cheque": "false",
                                    "is Total Collected Amt": "false",
                                    "is Total Sales Qty": "false",
                                    "is Total Amount": "false",
                                    "is Total Points": "false",
                                    "is Total Qty": "false",
                                    "is Total Buying Cost": "false",
                                    "is Total Selling Cost": "false",
                                    "is Total Profit": "false",
                                    "isStandard": "false",
                                    "isCustomerWise": "false",
                                    "isPaymentWise": "false",
                                    "isOrderWise": "true",
                                    "isSalesExecutiveWise": "false",
                                    "isItemWise": "false",
                                    "isMachineWise": "false",
                                    "isCollectorWise": "false",
                                    "isStoreWise": "false",
                                    "isUserWise": "false",
                                    "isSummaryWise": "false",
                                    "OrderWise": detail_list
                                };
                                GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                    $$("pnlPrintingPopup").close();
                                    $$("pnlBillViewPopup").open();
                                    $$("pnlBillViewPopup").title("Bill View");
                                    $$("pnlBillViewPopup").rlabel("Bill View");
                                    $$("pnlBillViewPopup").width("1000");
                                    $$("pnlBillViewPopup").height("600");
                                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                                });
                            }
                        })
                    }
                }
            }
            if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                if ($$("ddlDeliveryBy").selectedValue() == "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        "comp_id": localStorage.getItem("user_company_id"),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                        "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                    }
                    if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                        reportdata.bill_type = $$("ddlBillType").selectedValue();
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "SE Barcode Name": "SE Barcode",
                                    "Sales Executve Name": "Sales Executve",
                                    "Bill No Name": "Bill Type",
                                    "Bill Date Name": "Total Bills",
                                    "Bill Type Name": "Qty",
                                    "Total Bills Name": "Total Amount",
                                    "Qty Name": "Points",
                                    "Total Amount Name": "",
                                    "Points Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "SE Barcode": item.sales_executive_barcode,
                                    "Sales Executve": item.sale_executive_name,
                                    "Bill No": item.bill_type,
                                    "Bill Date": item.bills,
                                    "Bill Type": item.tot_qty,
                                    "Total Bills": item.tot_amount,
                                    "Qty": item.points,
                                    "Total Amount": "",
                                    "Points": ""
                                })
                                if (item.bill_type == "Sale") {
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    sales_tot_qty = parseFloat(sales_tot_qty) + parseFloat(item.tot_qty);

                                    tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                    tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                    executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    return_tot_qty = parseFloat(return_tot_qty) + parseFloat(item.tot_qty);

                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                    tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                    executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": parseFloat(executive_net_points).toFixed(2),
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": (parseFloat(sales_tot_qty) - parseFloat(return_tot_qty)).toFixed(2),
                                "Total Amount": parseFloat(tot_amount).toFixed(2),
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "true",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "true",
                                "is Total Amount": "true",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "true",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "SalesExecutiveWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else if ($$("ddlDeliveryBy").selectedValue() != "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        "comp_id": localStorage.getItem("user_company_id"),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                        "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                    }
                    if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                        reportdata.bill_type = $$("ddlBillType").selectedValue();
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "SE Barcode Name": "SE Barcode",
                                    "Sales Executve Name": "Sales Executve",
                                    "Bill No Name": "Bill No",
                                    "Bill Date Name": "Bill Type",
                                    "Bill Type Name": "Qty",
                                    "Total Bills Name": "Total Amount",
                                    "Qty Name": "Points",
                                    "Total Amount Name": "",
                                    "Points Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "SE Barcode": item.sales_executive_barcode,
                                    "Sales Executve": item.sale_executive_name,
                                    "Bill No": item.bill_code,
                                    "Bill Date": item.bill_type,
                                    "Bill Type": item.tot_qty,
                                    "Total Bills": item.tot_amount,
                                    "Qty": item.points,
                                    "Total Amount": "",
                                    "Points": ""
                                })
                                if (item.bill_type == "Sale") {
                                    executive_sales_points = parseFloat(executive_sales_points) + parseFloat(item.points);
                                    tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                    tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                    executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    executive_return_points = parseFloat(totalReturnsPayment) + parseFloat(item.points);
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                    tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                    executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                }
                                if (item.bill_type == "Sale") {
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": parseFloat(customer_sales_points).toFixed(2),
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": parseFloat(customer_return_points).toFixed(2),
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": parseFloat(executive_net_points).toFixed(2),
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": parseFloat(tot_qty).toFixed(2),
                                "Total Amount": parseFloat(tot_amount).toFixed(2),
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "true",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "true",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "true",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "true",
                                "is Total Amount": "true",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "true",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "SalesExecutiveWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() != "0") {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "comp_id": localStorage.getItem("user_company_id"),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                            "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                        }
                        if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                            reportdata.bill_type = $$("ddlBillType").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                $(data).each(function (i, item) {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "SE Barcode Name": day,
                                        "Sales Executve Name": "SE Barcode",
                                        "Bill No Name": "Sales Executve",
                                        "Bill Date Name": "Bill Type",
                                        "Bill Type Name": "Total Bills",
                                        "Total Bills Name": "Qty",
                                        "Qty Name": "Total Amount",
                                        "Total Amount Name": "Points",
                                        "Points Name": "",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        "SE Barcode": item.trans_date,
                                        "Sales Executve": item.sales_executive_barcode,
                                        "Bill No": item.sale_executive_name,
                                        "Bill Date": item.bill_type,
                                        "Bill Type": item.bills,
                                        "Total Bills": item.tot_qty,
                                        "Qty": item.tot_amount,
                                        "Total Amount": item.points,
                                        "Points": ""
                                    })
                                    if (item.bill_type == "Sale") {
                                        customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                        tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                        tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                        executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                        tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                        executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                    }
                                });
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Payment Name": "Total Sales Payment",
                                    "Total Sales Balance Name": "Sales Balance",
                                    "Total Sales Reward Name": "Sales Reward",
                                    "Total Return Name": "Total Return",
                                    "Total Return Payment Name": "Return Payment",
                                    "Total Return Balance Name": "Return Balance",
                                    "Total Return Reward Name": "Return Reward",
                                    "Total Tax Name": "Total Tax",
                                    "Discount Name": "Discount",
                                    "Total Profit and Tax Name": "Total Profit and Tax",
                                    "Profit Name": "Profit",
                                    "Expense Name": "Expense",
                                    "Net Balance Name": "Net Balance",
                                    "Net Reward Name": "Net Reward",
                                    "Total Bills Name": "Total Bills",
                                    "Net Sales Name": "Net Sales",
                                    "Net Amt Name": "Net Amt",
                                    "Amt From POS Name": "Amt From POS",
                                    "Amt From Order Name": "Amt From Order",
                                    "Cash In Hand Name": "Cash In Hand",
                                    "Total Bill Amount Name": "Total Bill Amount",
                                    "Total Cash Name": "Total Cash",
                                    "Total Card Name": "Total Card",
                                    "Total Cheque Name": "Total Cheque",
                                    "Total Collected Amt Name": "Total Collected Amt",
                                    "Total Sales Qty Name": "Total Sales Qty",
                                    "Total Amount Name": "Total Amount",
                                    "Total Points Name": "Total Points",
                                    "Total Qty Name": "Total Qty",
                                    "Total Buying Cost Name": "Total Buying Cost",
                                    "Total Selling Cost Name": "Total Selling Cost",
                                    "Total Profit Name": "Total Profit",
                                    "Total Sales": "",
                                    "Total Sales Payment": "",
                                    "Total Sales Balance": "",
                                    "Total Sales Reward": "",
                                    "Total Return": "",
                                    "Total Return Payment": "",
                                    "Total Return Balance": "",
                                    "Total Return Reward": "",
                                    "Total Tax": "",
                                    "Discount": "",
                                    "Total Profit and Tax": "",
                                    "Profit": "",
                                    "Expense": "",
                                    "Net Balance": "",
                                    "Net Reward": parseFloat(executive_net_points).toFixed(2),
                                    "Total Bills": "",
                                    "Net Sales": "",
                                    "Net Amt": "",
                                    "Amt From POS": "",
                                    "Amt From Order": "",
                                    "Cash In Hand": "",
                                    "Total Bill Amount": "",
                                    "Total Cash": "",
                                    "Total Card": "",
                                    "Total Cheque": "",
                                    "Total Collected Amt": "",
                                    "Total Sales Qty": parseFloat(tot_qty).toFixed(2),
                                    "Total Amount": parseFloat(tot_amount).toFixed(2),
                                    "Total Points": "",
                                    "Total Qty": "",
                                    "Total Buying Cost": "",
                                    "Total Selling Cost": "",
                                    "Total Profit": "",
                                    "is Total Sales": "false",
                                    "is Total Sales Payment": "false",
                                    "is Total Sales Balance": "false",
                                    "is Total Sales Reward": "false",
                                    "is Total Return": "false",
                                    "is Total Return Payment": "false",
                                    "is Total Return Balance": "false",
                                    "is Total Return Reward": "false",
                                    "is Total Tax": "false",
                                    "is Discount": "false",
                                    "is Total Profit and Tax": "false",
                                    "is Profit": "false",
                                    "is Expense": "false",
                                    "is Net Balance": "false",
                                    "is Net Reward": "true",
                                    "is Total Bills": "false",
                                    "is Net Sales": "false",
                                    "is Net Amt": "false",
                                    "is Amt From POS": "false",
                                    "is Amt From Order": "false",
                                    "is Cash In Hand": "false",
                                    "is Total Bill Amount": "false",
                                    "is Total Cash": "false",
                                    "is Total Card": "false",
                                    "is Total Cheque": "false",
                                    "is Total Collected Amt": "false",
                                    "is Total Sales Qty": "true",
                                    "is Total Amount": "true",
                                    "is Total Points": "false",
                                    "is Total Qty": "false",
                                    "is Total Buying Cost": "false",
                                    "is Total Selling Cost": "false",
                                    "is Total Profit": "false",
                                    "isStandard": "false",
                                    "isCustomerWise": "false",
                                    "isPaymentWise": "false",
                                    "isOrderWise": "false",
                                    "isSalesExecutiveWise": "true",
                                    "isItemWise": "false",
                                    "isMachineWise": "false",
                                    "isCollectorWise": "false",
                                    "isStoreWise": "false",
                                    "isUserWise": "false",
                                    "isSummaryWise": "false",
                                    "SalesExecutiveWise": detail_list
                                };
                                GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                    $$("pnlPrintingPopup").close();
                                    $$("pnlBillViewPopup").open();
                                    $$("pnlBillViewPopup").title("Bill View");
                                    $$("pnlBillViewPopup").rlabel("Bill View");
                                    $$("pnlBillViewPopup").width("1000");
                                    $$("pnlBillViewPopup").height("600");
                                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                                });
                            }
                        })
                    }
                }
            }
            if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                if ($$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Item No Name": "Item No",
                                    "Item Name Name": "Item Name",
                                    "Bill No Name": "Bill No",
                                    "Bill Date Name": "Bill Date",
                                    "Bill Type Name": "Bill Type",
                                    "Qty Name": "Qty",
                                    "Buying Cost Name": "Buying Cost",
                                    "Selling Cost Name": "Selling Cost",
                                    "Profit Name": "Profit",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Item No": item.item_no,
                                    "Item Name": item.item_name,
                                    "Bill No": item.bill_code,
                                    "Bill Date": item.bill_date,
                                    "Bill Type": item.bill_type,
                                    "Qty": item.qty,
                                    "Buying Cost": item.cost,
                                    "Selling Cost": item.price,
                                    "Profit": item.profit
                                })
                                if (item.bill_type == "Sale") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item.cost) + parseFloat(item_cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item.price) + parseFloat(item_price);
                                    } if (item.profit != null && item.profit != undefined && item.profit != "") {
                                        item_profit = parseFloat(item.profit) + parseFloat(item_profit);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item_cost) - parseFloat(item.cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item_price) - parseFloat(item.price);
                                    }
                                    if (item.profit != null && item.profit != undefined && item.profit != "") {
                                        item_profit = parseFloat(item_profit) - parseFloat(item.profit);
                                    }
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": parseFloat(executive_net_points).toFixed(2),
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": parseFloat(tot_qty).toFixed(2),
                                "Total Buying Cost": parseFloat(item_cost).toFixed(2),
                                "Total Selling Cost": parseFloat(item_price).toFixed(2),
                                "Total Profit": parseFloat(item_profit).toFixed(2),
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "true",
                                "is Total Buying Cost": "true",
                                "is Total Selling Cost": "true",
                                "is Total Profit": "true",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "true",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "ItemWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() == "1") {
                        var day = "Date";
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                        var day = "Month";
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                        var day = "Year";
                    }
                    else {
                        var day = "Date";
                    }
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Item No Name": "Item No",
                                    "Item Name Name": "Item Name",
                                    "Bill No Name": day,
                                    "Bill Date Name": "Bill Type",
                                    "Bill Type Name": "Qty",
                                    "Qty Name": "Buying Cost",
                                    "Buying Cost Name": "Selling Cost",
                                    "Selling Cost Name": "Profit",
                                    "Profit Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Item No": item.item_no,
                                    "Item Name": item.item_name,
                                    "Bill No": item.bill_date,
                                    "Bill Date": item.bill_type,
                                    "Bill Type": item.qty,
                                    "Qty": item.cost,
                                    "Buying Cost": item.price,
                                    "Selling Cost": item.profit,
                                    "Profit": ""
                                })
                                if (item.bill_type == "Sale") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item.cost)) + parseFloat(item_cost);
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item.price)) + parseFloat(item_price);
                                    item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item.profit)) + parseFloat(item_profit);
                                }
                                else {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item_cost) - parseFloat(item.cost));
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item_price) - parseFloat(item.price));
                                    item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item_profit) - parseFloat(item.profit));
                                }
                            });

                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": parseFloat(executive_net_points).toFixed(2),
                                "Total Bills": "",
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": parseFloat(tot_qty).toFixed(2),
                                "Total Buying Cost": parseFloat(item_cost).toFixed(2),
                                "Total Selling Cost": parseFloat(item_price).toFixed(2),
                                "Total Profit": parseFloat(item_profit).toFixed(2),
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "false",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "true",
                                "is Total Buying Cost": "true",
                                "is Total Selling Cost": "true",
                                "is Total Profit": "true",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "true",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "ItemWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
            }
            if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                if ($$("ddlSummaryFilter").selectedValue() == "0" && masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1") {//$$("ddlRegister").selectedValue()
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "from_bill": $$("txtFromBill").value(),
                        "to_bill": $$("txtToBill").value(),
                    }
                    reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                    //if ($$("ddlRegister").selectedValue() != "-1") {
                    //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                    //}
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Register Name": "Register",
                                    "User Name": "User",
                                    "Bill Date Name": "Total Bills",
                                    "Total Bills Name": "Bill Type",
                                    "Bill Type Name": "Qty",
                                    "Qty Name": "Bill Amount",
                                    "Bill Amount Name": "Profit",
                                    "Profit Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Register": item.reg_name,
                                    "User": item.user_name,
                                    "Bill Date": item.bills,
                                    "Total Bills": item.bill_type,
                                    "Bill Type": item.qty,
                                    "Qty": item.total,
                                    "Bill Amount": item.profit,
                                    "Profit": ""
                                })
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": parseFloat(tot_bills).toFixed(2),
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2),
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": parseFloat(tot_qty).toFixed(2),
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "true",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "true",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "MachineWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else if ($$("ddlSummaryFilter").selectedValue() == "0" && masterPage.controls.ddlGlobalRegisterName.selectedValue() != "-1") {
                    
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        //"reg_no": ($$("ddlRegister").selectedValue() == "-1") ? "" : $$("ddlRegister").selectedValue(),
                        "from_bill": $$("txtFromBill").value(),
                        "end_bill": $$("txtToBill").value(),
                    }
                    reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                    //if ($$("ddlRegister").selectedValue() != "-1") {
                    //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                    //}
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Register Name": "Register",
                                    "User Name": "User",
                                    "Bill Date Name": "Bill No",
                                    "Total Bills Name": "Bill Type",
                                    "Bill Type Name": "Qty",
                                    "Qty Name": "Bill Amount",
                                    "Bill Amount Name": "Profit",
                                    "Profit Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Register": item.reg_name,
                                    "User": item.user_name,
                                    "Bill Date": item.bill_code,
                                    "Total Bills": item.bill_type,
                                    "Bill Type": item.qty,
                                    "Qty": item.total,
                                    "Bill Amount": item.profit,
                                    "Profit": ""
                                })
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": parseFloat(data.length).toFixed(2),
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2),
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": parseFloat(tot_qty).toFixed(2),
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "true",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "true",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "MachineWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() != "0") {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            //"reg_no": ($$("ddlRegister").selectedValue() == "-1") ? "" : $$("ddlRegister").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "end_bill": $$("txtToBill").value(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        //if ($$("ddlRegister").selectedValue() != "-1") {
                        //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                        //}
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                $(data).each(function (i, item) {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Register Name": "Register",
                                        "User Name": "User",
                                        "Bill Date Name": day,
                                        "Total Bills Name": "Total Bills",
                                        "Bill Type Name": "Bill Type",
                                        "Qty Name": "Qty",
                                        "Bill Amount Name": "Bill Amount",
                                        "Profit Name": "Profit",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        "Register": item.reg_name,
                                        "User": item.user_name,
                                        "Bill Date": item.bill_date,
                                        "Total Bills": item.bills,
                                        "Bill Type": item.bill_type,
                                        "Qty": item.qty,
                                        "Bill Amount": item.total,
                                        "Profit": item.profit
                                    }) 
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    if (item.bill_type == "Sale") {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) + parseFloat(item.qty);
                                        }
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                        }
                                    }
                                });
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Payment Name": "Total Sales Payment",
                                    "Total Sales Balance Name": "Sales Balance",
                                    "Total Sales Reward Name": "Sales Reward",
                                    "Total Return Name": "Total Return",
                                    "Total Return Payment Name": "Return Payment",
                                    "Total Return Balance Name": "Return Balance",
                                    "Total Return Reward Name": "Return Reward",
                                    "Total Tax Name": "Total Tax",
                                    "Discount Name": "Discount",
                                    "Total Profit and Tax Name": "Total Profit and Tax",
                                    "Profit Name": "Profit",
                                    "Expense Name": "Expense",
                                    "Net Balance Name": "Net Balance",
                                    "Net Reward Name": "Net Reward",
                                    "Total Bills Name": "Total Bills",
                                    "Net Sales Name": "Net Sales",
                                    "Net Amt Name": "Net Amt",
                                    "Amt From POS Name": "Amt From POS",
                                    "Amt From Order Name": "Amt From Order",
                                    "Cash In Hand Name": "Cash In Hand",
                                    "Total Bill Amount Name": "Total Bill Amount",
                                    "Total Cash Name": "Total Cash",
                                    "Total Card Name": "Total Card",
                                    "Total Cheque Name": "Total Cheque",
                                    "Total Collected Amt Name": "Total Collected Amt",
                                    "Total Sales Qty Name": "Total Sales Qty",
                                    "Total Amount Name": "Total Amount",
                                    "Total Points Name": "Total Points",
                                    "Total Qty Name": "Total Qty",
                                    "Total Buying Cost Name": "Total Buying Cost",
                                    "Total Selling Cost Name": "Total Selling Cost",
                                    "Total Profit Name": "Total Profit",
                                    "Total Sales": "",
                                    "Total Sales Payment": "",
                                    "Total Sales Balance": "",
                                    "Total Sales Reward": "",
                                    "Total Return": "",
                                    "Total Return Payment": "",
                                    "Total Return Balance": "",
                                    "Total Return Reward": "",
                                    "Total Tax": "",
                                    "Discount": "",
                                    "Total Profit and Tax": "",
                                    "Profit": "",
                                    "Expense": "",
                                    "Net Balance": "",
                                    "Net Reward": "",
                                    "Total Bills": parseFloat(tot_bills).toFixed(2),
                                    "Net Sales": "",
                                    "Net Amt": "",
                                    "Amt From POS": "",
                                    "Amt From Order": "",
                                    "Cash In Hand": "",
                                    "Total Bill Amount": parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2),
                                    "Total Cash": "",
                                    "Total Card": "",
                                    "Total Cheque": "",
                                    "Total Collected Amt": "",
                                    "Total Sales Qty": "",
                                    "Total Amount": "",
                                    "Total Points": "",
                                    "Total Qty": parseFloat(tot_qty).toFixed(2),
                                    "Total Buying Cost": "",
                                    "Total Selling Cost": "",
                                    "Total Profit": "",
                                    "is Total Sales": "false",
                                    "is Total Sales Payment": "false",
                                    "is Total Sales Balance": "false",
                                    "is Total Sales Reward": "false",
                                    "is Total Return": "false",
                                    "is Total Return Payment": "false",
                                    "is Total Return Balance": "false",
                                    "is Total Return Reward": "false",
                                    "is Total Tax": "false",
                                    "is Discount": "false",
                                    "is Total Profit and Tax": "false",
                                    "is Profit": "false",
                                    "is Expense": "false",
                                    "is Net Balance": "false",
                                    "is Net Reward": "false",
                                    "is Total Bills": "true",
                                    "is Net Sales": "false",
                                    "is Net Amt": "false",
                                    "is Amt From POS": "false",
                                    "is Amt From Order": "false",
                                    "is Cash In Hand": "false",
                                    "is Total Bill Amount": "true",
                                    "is Total Cash": "false",
                                    "is Total Card": "false",
                                    "is Total Cheque": "false",
                                    "is Total Collected Amt": "false",
                                    "is Total Sales Qty": "false",
                                    "is Total Amount": "false",
                                    "is Total Points": "false",
                                    "is Total Qty": "true",
                                    "is Total Buying Cost": "false",
                                    "is Total Selling Cost": "false",
                                    "is Total Profit": "false",
                                    "isStandard": "false",
                                    "isCustomerWise": "false",
                                    "isPaymentWise": "false",
                                    "isOrderWise": "false",
                                    "isSalesExecutiveWise": "false",
                                    "isItemWise": "false",
                                    "isMachineWise": "true",
                                    "isCollectorWise": "false",
                                    "isStoreWise": "false",
                                    "isUserWise": "false",
                                    "isSummaryWise": "false",
                                    "MachineWise": detail_list
                                };
                                GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                    $$("pnlPrintingPopup").close();
                                    $$("pnlBillViewPopup").open();
                                    $$("pnlBillViewPopup").title("Bill View");
                                    $$("pnlBillViewPopup").rlabel("Bill View");
                                    $$("pnlBillViewPopup").width("1000");
                                    $$("pnlBillViewPopup").height("600");
                                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                                });
                            }
                        })
                    }
                }
            }
            if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                if ($$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Store Name": "Store",
                                    "Bill Date Name": "Total Bills",
                                    "Total Bills Name": "Total Sales",
                                    "Total Sales Name": "Total Sales Payment",
                                    "Total Sales Payment Name": "Sales Balance",
                                    "Sales Balance Name": "Total Return",
                                    "Total Return Name": "Total Return Payment",
                                    "Total Return Payment Name": "Return Balance",
                                    "Return Balance Name": "Total Discount",
                                    "Total Discount Name": "Total Tax",
                                    "Total Tax Name": "Net Amount",
                                    "Net Amount Name": "Profit",
                                    "Profit Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Store": item.store_name,
                                    "Bill Date": item.bills,
                                    "Total Bills": item.total_sales,
                                    "Total Sales": item.total_sales_payment,
                                    "Total Sales Payment": item.sales_balance,
                                    "Sales Balance": item.total_return,
                                    "Total Return": item.total_return_payment,
                                    "Total Return Payment": item.return_balance,
                                    "Return Balance": item.discount,
                                    "Total Discount": item.tax,
                                    "Total Tax": item.net_sales,
                                    "Net Amount": item.profit,
                                    "Profit": ""
                                })
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                                totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                                balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": parseFloat(totalSales).toFixed(2),
                                "Total Sales Payment": parseFloat(totalSalesPayment).toFixed(2),
                                "Total Sales Balance": parseFloat(balanceSales).toFixed(2),
                                "Total Sales Reward": "",
                                "Total Return": parseFloat(totalReturns).toFixed(2),
                                "Total Return Payment": parseFloat(totalReturnsPayment).toFixed(2),
                                "Total Return Balance": parseFloat(balanceReturns).toFixed(2),
                                "Total Return Reward": "",
                                "Total Tax": parseFloat(totalTax).toFixed(2),
                                "Discount": parseFloat(totalPaymentDiscount).toFixed(2),
                                "Total Profit and Tax": "",
                                "Profit": parseFloat(net_profit).toFixed(2),
                                "Expense": "",
                                "Net Balance": parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2),
                                "Net Reward": "",
                                "Total Bills": parseFloat(tot_bills).toFixed(2),
                                "Net Sales": "",
                                "Net Amt": parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2),
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": "",
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": parseFloat(tot_qty).toFixed(2),
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "true",
                                "is Total Sales Payment": "true",
                                "is Total Sales Balance": "true",
                                "is Total Sales Reward": "false",
                                "is Total Return": "true",
                                "is Total Return Payment": "true",
                                "is Total Return Balance": "true",
                                "is Total Return Reward": "false",
                                "is Total Tax": "true",
                                "is Discount": "true",
                                "is Total Profit and Tax": "false",
                                "is Profit": "true",
                                "is Expense": "false",
                                "is Net Balance": "true",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "false",
                                "is Net Amt": "true",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "false",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "true",
                                "isUserWise": "false",
                                "isSummaryWise": "false",
                                "StoreWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() != "0") {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                                { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment", filterType: "Text" },
                                { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_sales", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                $(data).each(function (i, item) {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Store Name": day,
                                        "Bill Date Name": "Store",
                                        "Total Bills Name": "Total Bills",
                                        "Total Sales Name": "Total Sales",
                                        "Total Sales Payment Name": "Total Sales Payment",
                                        "Sales Balance Name": "Total Return",
                                        "Total Return Name": "Total Return Payment",
                                        "Total Return Payment Name": "Total Discount",
                                        "Return Balance Name": "Total Tax",
                                        "Total Discount Name": "Net Amount",
                                        "Total Tax Name": "Profit",
                                        "Net Amount Name": "",
                                        "Profit Name": "",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        "Store": item.bill_date,
                                        "Bill Date": item.store_name,
                                        "Total Bills": item.bills,
                                        "Total Sales": item.total_sales,
                                        "Total Sales Payment": item.total_sales_payment,
                                        "Sales Balance": item.total_return,
                                        "Total Return": item.total_return_payment,
                                        "Total Return Payment": item.discount,
                                        "Return Balance": item.tax,
                                        "Total Discount": item.net_sales,
                                        "Total Tax": item.profit,
                                        "Net Amount": "",
                                        "Profit": ""
                                    })
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                                });
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Payment Name": "Total Sales Payment",
                                    "Total Sales Balance Name": "Sales Balance",
                                    "Total Sales Reward Name": "Sales Reward",
                                    "Total Return Name": "Total Return",
                                    "Total Return Payment Name": "Return Payment",
                                    "Total Return Balance Name": "Return Balance",
                                    "Total Return Reward Name": "Return Reward",
                                    "Total Tax Name": "Total Tax",
                                    "Discount Name": "Discount",
                                    "Total Profit and Tax Name": "Total Profit and Tax",
                                    "Profit Name": "Profit",
                                    "Expense Name": "Expense",
                                    "Net Balance Name": "Net Balance",
                                    "Net Reward Name": "Net Reward",
                                    "Total Bills Name": "Total Bills",
                                    "Net Sales Name": "Net Sales",
                                    "Net Amt Name": "Net Amt",
                                    "Amt From POS Name": "Amt From POS",
                                    "Amt From Order Name": "Amt From Order",
                                    "Cash In Hand Name": "Cash In Hand",
                                    "Total Bill Amount Name": "Total Bill Amount",
                                    "Total Cash Name": "Total Cash",
                                    "Total Card Name": "Total Card",
                                    "Total Cheque Name": "Total Cheque",
                                    "Total Collected Amt Name": "Total Collected Amt",
                                    "Total Sales Qty Name": "Total Sales Qty",
                                    "Total Amount Name": "Total Amount",
                                    "Total Points Name": "Total Points",
                                    "Total Qty Name": "Total Qty",
                                    "Total Buying Cost Name": "Total Buying Cost",
                                    "Total Selling Cost Name": "Total Selling Cost",
                                    "Total Profit Name": "Total Profit",
                                    "Total Sales": parseFloat(totalSales).toFixed(2),
                                    "Total Sales Payment": parseFloat(totalSalesPayment).toFixed(2),
                                    "Total Sales Balance": parseFloat(balanceSales).toFixed(2),
                                    "Total Sales Reward": "",
                                    "Total Return": parseFloat(totalReturns).toFixed(2),
                                    "Total Return Payment": parseFloat(totalReturnsPayment).toFixed(2),
                                    "Total Return Balance": parseFloat(balanceReturns).toFixed(2),
                                    "Total Return Reward": "",
                                    "Total Tax": parseFloat(totalTax).toFixed(2),
                                    "Discount": parseFloat(totalPaymentDiscount).toFixed(2),
                                    "Total Profit and Tax": "",
                                    "Profit": parseFloat(net_profit).toFixed(2),
                                    "Expense": "",
                                    "Net Balance": parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2),
                                    "Net Reward": "",
                                    "Total Bills": parseFloat(tot_bills).toFixed(2),
                                    "Net Sales": "",
                                    "Net Amt": parseFloat(parseFloat(balanceSales) - parseFloat(balanceReturns)).toFixed(2),
                                    "Amt From POS": "",
                                    "Amt From Order": "",
                                    "Cash In Hand": "",
                                    "Total Bill Amount": "",
                                    "Total Cash": "",
                                    "Total Card": "",
                                    "Total Cheque": "",
                                    "Total Collected Amt": "",
                                    "Total Sales Qty": "",
                                    "Total Amount": "",
                                    "Total Points": "",
                                    "Total Qty": "",
                                    "Total Buying Cost": "",
                                    "Total Selling Cost": "",
                                    "Total Profit": "",
                                    "is Total Sales": "true",
                                    "is Total Sales Payment": "true",
                                    "is Total Sales Balance": "true",
                                    "is Total Sales Reward": "false",
                                    "is Total Return": "true",
                                    "is Total Return Payment": "true",
                                    "is Total Return Balance": "true",
                                    "is Total Return Reward": "false",
                                    "is Total Tax": "true",
                                    "is Discount": "true",
                                    "is Total Profit and Tax": "false",
                                    "is Profit": "true",
                                    "is Expense": "false",
                                    "is Net Balance": "true",
                                    "is Net Reward": "false",
                                    "is Total Bills": "true",
                                    "is Net Sales": "false",
                                    "is Net Amt": "true",
                                    "is Amt From POS": "false",
                                    "is Amt From Order": "false",
                                    "is Cash In Hand": "false",
                                    "is Total Bill Amount": "false",
                                    "is Total Cash": "false",
                                    "is Total Card": "false",
                                    "is Total Cheque": "false",
                                    "is Total Collected Amt": "false",
                                    "is Total Sales Qty": "false",
                                    "is Total Amount": "false",
                                    "is Total Points": "false",
                                    "is Total Qty": "false",
                                    "is Total Buying Cost": "false",
                                    "is Total Selling Cost": "false",
                                    "is Total Profit": "false",
                                    "isStandard": "false",
                                    "isCustomerWise": "false",
                                    "isPaymentWise": "false",
                                    "isOrderWise": "false",
                                    "isSalesExecutiveWise": "false",
                                    "isItemWise": "false",
                                    "isMachineWise": "false",
                                    "isCollectorWise": "false",
                                    "isStoreWise": "true",
                                    "isUserWise": "false",
                                    "isSummaryWise": "false",
                                    "StoreWise": detail_list
                                };
                                GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                    $$("pnlPrintingPopup").close();
                                    $$("pnlBillViewPopup").open();
                                    $$("pnlBillViewPopup").title("Bill View");
                                    $$("pnlBillViewPopup").rlabel("Bill View");
                                    $$("pnlBillViewPopup").width("1000");
                                    $$("pnlBillViewPopup").height("600");
                                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                                });
                            }
                        })
                    }
                }
            }
            if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                if ($$("ddlLoginUser").selectedValue() == "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "-1" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                    }
                    reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                    //if ($$("ddlRegister").selectedValue() != "-1") {
                    //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                    //}
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                detail_list.push({
                                    "Sl No Name": "Sl No",
                                    "Store Name": "Store",
                                    "User Name": "User",
                                    "Bill Date Name": "Machine Name",
                                    "Machine Name": "Bill Type",
                                    "Bill Type Name": "Total Bills",
                                    "Total Bills Name": "Bill Amount",
                                    "Bill Amount Name": "",
                                    "Sl No": parseInt(i) + parseInt(1),
                                    "Store": item.store_name,
                                    "User": item.user_name,
                                    "Bill Date": item.reg_name,
                                    "Machine": item.bill_type,
                                    "Bill Type": item.bills,
                                    "Total Bills": item.total,
                                    "Bill Amount": ""
                                })
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": parseFloat(tot_bills).toFixed(2),
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2),
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "true",
                                "isSummaryWise": "false",
                                "UserWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else if ($$("ddlLoginUser").selectedValue() != "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                    }
                    reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                    //if ($$("ddlRegister").selectedValue() != "-1") {
                    //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                    //}
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                                $(data).each(function (i, item) {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Store Name": "Store",
                                        "User Name": "User",
                                        "Bill Date Name": "Machine Name",
                                        "Machine Name": "Bill No",
                                        "Bill Type Name": "Bill Date",
                                        "Total Bills Name": "Bill Type",
                                        "Bill Amount Name": "Bill Amount",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        "Store": item.store_name,
                                        "User": item.user_name,
                                        "Bill Date": item.reg_name,
                                        "Machine": item.bill_code,
                                        "Bill Type": item.bill_date,
                                        "Total Bills": item.bill_type,
                                        "Bill Amount": item.total
                                    })
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                }
                            });
                            var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Total Sales Name": "Total Sales",
                                "Total Sales Payment Name": "Total Sales Payment",
                                "Total Sales Balance Name": "Sales Balance",
                                "Total Sales Reward Name": "Sales Reward",
                                "Total Return Name": "Total Return",
                                "Total Return Payment Name": "Return Payment",
                                "Total Return Balance Name": "Return Balance",
                                "Total Return Reward Name": "Return Reward",
                                "Total Tax Name": "Total Tax",
                                "Discount Name": "Discount",
                                "Total Profit and Tax Name": "Total Profit and Tax",
                                "Profit Name": "Profit",
                                "Expense Name": "Expense",
                                "Net Balance Name": "Net Balance",
                                "Net Reward Name": "Net Reward",
                                "Total Bills Name": "Total Bills",
                                "Net Sales Name": "Net Sales",
                                "Net Amt Name": "Net Amt",
                                "Amt From POS Name": "Amt From POS",
                                "Amt From Order Name": "Amt From Order",
                                "Cash In Hand Name": "Cash In Hand",
                                "Total Bill Amount Name": "Total Bill Amount",
                                "Total Cash Name": "Total Cash",
                                "Total Card Name": "Total Card",
                                "Total Cheque Name": "Total Cheque",
                                "Total Collected Amt Name": "Total Collected Amt",
                                "Total Sales Qty Name": "Total Sales Qty",
                                "Total Amount Name": "Total Amount",
                                "Total Points Name": "Total Points",
                                "Total Qty Name": "Total Qty",
                                "Total Buying Cost Name": "Total Buying Cost",
                                "Total Selling Cost Name": "Total Selling Cost",
                                "Total Profit Name": "Total Profit",
                                "Total Sales": "",
                                "Total Sales Payment": "",
                                "Total Sales Balance": "",
                                "Total Sales Reward": "",
                                "Total Return": "",
                                "Total Return Payment": "",
                                "Total Return Balance": "",
                                "Total Return Reward": "",
                                "Total Tax": "",
                                "Discount": "",
                                "Total Profit and Tax": "",
                                "Profit": "",
                                "Expense": "",
                                "Net Balance": "",
                                "Net Reward": "",
                                "Total Bills": parseFloat(data.length).toFixed(2),
                                "Net Sales": "",
                                "Net Amt": "",
                                "Amt From POS": "",
                                "Amt From Order": "",
                                "Cash In Hand": "",
                                "Total Bill Amount": parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2),
                                "Total Cash": "",
                                "Total Card": "",
                                "Total Cheque": "",
                                "Total Collected Amt": "",
                                "Total Sales Qty": "",
                                "Total Amount": "",
                                "Total Points": "",
                                "Total Qty": "",
                                "Total Buying Cost": "",
                                "Total Selling Cost": "",
                                "Total Profit": "",
                                "is Total Sales": "false",
                                "is Total Sales Payment": "false",
                                "is Total Sales Balance": "false",
                                "is Total Sales Reward": "false",
                                "is Total Return": "false",
                                "is Total Return Payment": "false",
                                "is Total Return Balance": "false",
                                "is Total Return Reward": "false",
                                "is Total Tax": "false",
                                "is Discount": "false",
                                "is Total Profit and Tax": "false",
                                "is Profit": "false",
                                "is Expense": "false",
                                "is Net Balance": "false",
                                "is Net Reward": "false",
                                "is Total Bills": "true",
                                "is Net Sales": "false",
                                "is Net Amt": "false",
                                "is Amt From POS": "false",
                                "is Amt From Order": "false",
                                "is Cash In Hand": "false",
                                "is Total Bill Amount": "true",
                                "is Total Cash": "false",
                                "is Total Card": "false",
                                "is Total Cheque": "false",
                                "is Total Collected Amt": "false",
                                "is Total Sales Qty": "false",
                                "is Total Amount": "false",
                                "is Total Points": "false",
                                "is Total Qty": "false",
                                "is Total Buying Cost": "false",
                                "is Total Selling Cost": "false",
                                "is Total Profit": "false",
                                "isStandard": "false",
                                "isCustomerWise": "false",
                                "isPaymentWise": "false",
                                "isOrderWise": "false",
                                "isSalesExecutiveWise": "false",
                                "isItemWise": "false",
                                "isMachineWise": "false",
                                "isCollectorWise": "false",
                                "isStoreWise": "false",
                                "isUserWise": "true",
                                "isSummaryWise": "false",
                                "UserWise": detail_list
                            };
                            GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                $$("pnlPrintingPopup").close();
                                $$("pnlBillViewPopup").open();
                                $$("pnlBillViewPopup").title("Bill View");
                                $$("pnlBillViewPopup").rlabel("Bill View");
                                $$("pnlBillViewPopup").width("1000");
                                $$("pnlBillViewPopup").height("600");
                                $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    })
                }
                else {
                    if ($$("ddlSummaryFilter").selectedValue() != "0") {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        //if ($$("ddlRegister").selectedValue() != "-1") {
                        //    reportdata.reg_no = $$("ddlRegister").selectedValue();
                        //}
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                $(data).each(function (i, item) {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Store Name": "Store",
                                        "User Name": day,
                                        "Bill Date Name": "User",
                                        "Machine Name": "Machine Name",
                                        "Bill Type Name": "Bill Type",
                                        "Total Bills Name": "Total Bills",
                                        "Bill Amount Name": "Bill Amount",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        "Store": item.store_name,
                                        "User": item.bill_date,
                                        "Bill Date": item.user_name,
                                        "Machine": item.reg_name,
                                        "Bill Type": item.bill_type,
                                        "Total Bills": item.bills,
                                        "Bill Amount": item.total
                                    })
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                    if (item.bill_type == "Sale") {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    }
                                });
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Payment Name": "Total Sales Payment",
                                    "Total Sales Balance Name": "Sales Balance",
                                    "Total Sales Reward Name": "Sales Reward",
                                    "Total Return Name": "Total Return",
                                    "Total Return Payment Name": "Return Payment",
                                    "Total Return Balance Name": "Return Balance",
                                    "Total Return Reward Name": "Return Reward",
                                    "Total Tax Name": "Total Tax",
                                    "Discount Name": "Discount",
                                    "Total Profit and Tax Name": "Total Profit and Tax",
                                    "Profit Name": "Profit",
                                    "Expense Name": "Expense",
                                    "Net Balance Name": "Net Balance",
                                    "Net Reward Name": "Net Reward",
                                    "Total Bills Name": "Total Bills",
                                    "Net Sales Name": "Net Sales",
                                    "Net Amt Name": "Net Amt",
                                    "Amt From POS Name": "Amt From POS",
                                    "Amt From Order Name": "Amt From Order",
                                    "Cash In Hand Name": "Cash In Hand",
                                    "Total Bill Amount Name": "Total Bill Amount",
                                    "Total Cash Name": "Total Cash",
                                    "Total Card Name": "Total Card",
                                    "Total Cheque Name": "Total Cheque",
                                    "Total Collected Amt Name": "Total Collected Amt",
                                    "Total Sales Qty Name": "Total Sales Qty",
                                    "Total Amount Name": "Total Amount",
                                    "Total Points Name": "Total Points",
                                    "Total Qty Name": "Total Qty",
                                    "Total Buying Cost Name": "Total Buying Cost",
                                    "Total Selling Cost Name": "Total Selling Cost",
                                    "Total Profit Name": "Total Profit",
                                    "Total Sales": "",
                                    "Total Sales Payment": "",
                                    "Total Sales Balance": "",
                                    "Total Sales Reward": "",
                                    "Total Return": "",
                                    "Total Return Payment": "",
                                    "Total Return Balance": "",
                                    "Total Return Reward": "",
                                    "Total Tax": "",
                                    "Discount": "",
                                    "Total Profit and Tax": "",
                                    "Profit": "",
                                    "Expense": "",
                                    "Net Balance": "",
                                    "Net Reward": "",
                                    "Total Bills": parseFloat(tot_bills).toFixed(2),
                                    "Net Sales": "",
                                    "Net Amt": "",
                                    "Amt From POS": "",
                                    "Amt From Order": "",
                                    "Cash In Hand": "",
                                    "Total Bill Amount": parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2),
                                    "Total Cash": "",
                                    "Total Card": "",
                                    "Total Cheque": "",
                                    "Total Collected Amt": "",
                                    "Total Sales Qty": "",
                                    "Total Amount": "",
                                    "Total Points": "",
                                    "Total Qty": "",
                                    "Total Buying Cost": "",
                                    "Total Selling Cost": "",
                                    "Total Profit": "",
                                    "is Total Sales": "false",
                                    "is Total Sales Payment": "false",
                                    "is Total Sales Balance": "false",
                                    "is Total Sales Reward": "false",
                                    "is Total Return": "false",
                                    "is Total Return Payment": "false",
                                    "is Total Return Balance": "false",
                                    "is Total Return Reward": "false",
                                    "is Total Tax": "false",
                                    "is Discount": "false",
                                    "is Total Profit and Tax": "false",
                                    "is Profit": "false",
                                    "is Expense": "false",
                                    "is Net Balance": "false",
                                    "is Net Reward": "false",
                                    "is Total Bills": "true",
                                    "is Net Sales": "false",
                                    "is Net Amt": "false",
                                    "is Amt From POS": "false",
                                    "is Amt From Order": "false",
                                    "is Cash In Hand": "false",
                                    "is Total Bill Amount": "true",
                                    "is Total Cash": "false",
                                    "is Total Card": "false",
                                    "is Total Cheque": "false",
                                    "is Total Collected Amt": "false",
                                    "is Total Sales Qty": "false",
                                    "is Total Amount": "false",
                                    "is Total Points": "false",
                                    "is Total Qty": "false",
                                    "is Total Buying Cost": "false",
                                    "is Total Selling Cost": "false",
                                    "is Total Profit": "false",
                                    "isStandard": "false",
                                    "isCustomerWise": "false",
                                    "isPaymentWise": "false",
                                    "isOrderWise": "false",
                                    "isSalesExecutiveWise": "false",
                                    "isItemWise": "false",
                                    "isMachineWise": "false",
                                    "isCollectorWise": "false",
                                    "isStoreWise": "false",
                                    "isUserWise": "true",
                                    "isSummaryWise": "false",
                                    "UserWise": detail_list
                                };
                                GeneratePrint("ShopOnDev", "ShopOn-Sales-Report-New/ShopOn-sales-report-customerwise.jrxml", accountInfo, exp_type, function (responseData) {
                                    $$("pnlPrintingPopup").close();
                                    $$("pnlBillViewPopup").open();
                                    $$("pnlBillViewPopup").title("Bill View");
                                    $$("pnlBillViewPopup").rlabel("Bill View");
                                    $$("pnlBillViewPopup").width("1000");
                                    $$("pnlBillViewPopup").height("600");
                                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                                });
                            }
                        })
                    }
                }
            }
        }
        page.events.btnReport_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.rlabel("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(200);
        }
        page.events.btnPrintJasperBill_click = function () {
            page.events.jasperReport();
        }
    });

}
