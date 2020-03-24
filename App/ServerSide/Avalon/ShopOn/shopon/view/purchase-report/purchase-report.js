$.fn.purchaseReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.itemService = new ItemService();
        page.registerAPI = new RegisterAPI();
        page.shopOnStatesAPI = new ShopOnStatesAPI();
        page.itemAPI = new ItemAPI();
        page.variationAPI = new VariationAPI();
        page.storeAPI = new StoreAPI();
        page.userAPI = new UserAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.stockAPI = new StockAPI();
        page.accAccountService = new AccAccountService();
        page.vendorAPI = new VendorAPI();
        page.purchaseReportAPI = new PurchaseReportAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.purchaseBillPaymentAPI = new PurchaseBillPaymentAPI();
        var menu_ids = [];
        var reg_ids = [];
        var user_ids = [];
        var item_list = [];
        var variation_list = [];
        document.title = "ShopOn - Purchase Report";
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;
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
                var totalPurchase = 0;
                var totalPurchasePayment = 0;
                var balancePurchase = 0;
                var totalReturns = 0;
                var totalReturnsPayment = 0;
                var balanceReturns = 0;
                var purchasetotalTax = 0;
                var returntotalTax = 0;
                var totalTax = 0;
                var executive_sales_points = 0;
                var executive_return_points = 0;
                var executive_net_points = 0;
                var tot_bills = 0;
                var total_cash_amount = 0;
                var total_card_amount = 0;
                var total_cheque_amount = 0;
                var total_net_bank_amount = 0;
                var total_bill_amount = 0;
                var tot_qty = 0;
                var Purchase_tot_qty = 0;
                var return_tot_qty = 0;
                var tot_amount = 0;
                var item_profit = 0;
                var item_cost = 0;
                var item_price = 0;
                var temp_cost;
                var temp_price;
                var purchase_order = 0;
                var purchase_order_return = 0;
                var purchase_pop = 0;
                var purchase_pop_return = 0;
                var net_purchase = 0;
                var totalPaymentDiscount = 0;
                var tot_net_balance = 0;
                var tot_debit = 0;
                var lastSuppNo = "";
                $$("lblTotalPurchase").value(parseFloat(0).toFixed(2));
                $$("lblTotalPayment").value(parseFloat(0).toFixed(2));
                $$("lblPurchaseBal").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturns").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturnsPayment").value(parseFloat(0).toFixed(2));
                $$("lblReturnBal").value(parseFloat(0).toFixed(2));
                $$("lblTotalTax").value(parseFloat(0).toFixed(2));
                $$("lblPaymentDiscount").value(parseFloat(0).toFixed(2));
                $$("lblTotalBills").value(parseFloat(0).toFixed(2));
                $$("lblNetAmt").value(parseFloat(0).toFixed(2));
                $$("lblAmountFromPOP").value(parseFloat(0).toFixed(2));
                $$("lblAmountFromOrder").value(parseFloat(0).toFixed(2));
                $$("lblTotalPaymentAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCashAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCardAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalChequeAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalBalance").value(parseFloat(0).toFixed(2));
                $$("lblTotalPurchaseQty").value(parseFloat(0).toFixed(2));
                $$("lblTotalAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalQty").value(parseFloat(0).toFixed(2));
                $$("lblTotalBuyingCost").value(parseFloat(0).toFixed(2));
                $$("lblTotalNetRate").value(parseFloat(0).toFixed(2));
                $$("lblNetDebit").value(parseFloat(0).toFixed(2));
                if ($$("ddlViewMode").selectedValue() == "Standard") {
                    $$("grdTransactions").height("350px");
                    $$("grdTransactions").width("2050px");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': " ", 'width': "50px", 'dataField': "", itemTemplate: "<input action='detail' type='button'  value='+' />" },
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "50px", 'dataField': "bill_no", visible: false },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_code", },
                            { 'name': "Invoice No", 'rlabel': 'Invoice No', 'width': "100px", 'dataField': "invoice_no", },
                            { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "100px", 'dataField': "bill_type", filterType: "Text" },
                            { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "160px", 'dataField': "vendor_name" },
                            { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                            { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                            { 'name': 'Payment Type', 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                            { 'name': 'Cheque No', 'rlabel': 'Cheque No', 'width': "100px", 'dataField': "cheque_no", visible: $$("ddlPaymentType").selectedValue() == "Cheque" },
                            { 'name': 'Bank Name', 'rlabel': 'Bank Name', 'width': "100px", 'dataField': "cheque_bank_name", visible: $$("ddlPaymentType").selectedValue() == "Cheque" },
                            { 'name': 'Cheque Date', 'rlabel': 'Cheque Date', 'width': "100px", 'dataField': "cheque_date", visible: $$("ddlPaymentType").selectedValue() == "Cheque" },
                            { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total" },
                            { 'name': "Paid", 'rlabel': 'Paid', 'width': "70px", 'dataField': "paid" },
                            { 'name': "Balance", 'rlabel': 'Balance', 'width': "70px", 'dataField': "balance" },
                            { 'name': "Debit Note", 'rlabel': 'Debit Note', 'width': "70px", 'dataField': "debit_amount" },
                            { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "90px", 'dataField': "sub_total" },
                            { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                            { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                            { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                            { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                            { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "Discount", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount" },
                            { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "90px", 'dataField': "round_off" },
                            { 'name': "", 'width': "90%", 'dataField': "sl_no,bill_no", itemTemplate: "<div id='detailGrid'></div>" },
                        ]
                    });
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);

                        $(row).find("input[action=detail]").click(function () {
                            if ($(this).val() == "+") {
                                $(this).val("-");
                                page.purchaseBillPaymentAPI.searchValues("", "", "bill_no = " + item.bill_no, "", function (data) {
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
                        "viewMode": $$("ddlViewMode").selectedValue(),
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
                    page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                        if (data.length > 0) {
                            page.resultFound();
                        }
                        else {
                            page.noResultFound();
                        }
                        $$("grdTransactions").dataBind(data);
                        $$("pnlGridFilter").show();
                        var last_bill_no = 0;
                        $(data).each(function (i, item) {
                            if (last_bill_no != item.bill_no) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Purchase") {
                                    //sales_profit = parseFloat(item.profit) + parseFloat(sales_profit);
                                    purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                    balancePurchase = parseFloat(balancePurchase) + parseFloat(item.balance);
                                    totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.paid);
                                    tot_debit = parseFloat(tot_debit) + parseFloat(item.debit_amount);
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    //return_profit = parseFloat(item.profit) + parseFloat(return_profit);
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    tot_debit = parseFloat(tot_debit) - parseFloat(item.debit_amount);
                                }
                                if (item.order_type == "Order" && item.bill_type == "Purchase") {
                                    purchase_order = parseFloat(purchase_order) + parseFloat(item.total);
                                }
                                if (item.order_type == "POP" && item.bill_type == "Purchase") {
                                    purchase_pop = parseFloat(purchase_pop) + parseFloat(item.total);
                                }
                                if (item.order_type == "Order" && item.bill_type == "PurchaseReturn") {
                                    purchase_order_return = parseFloat(purchase_order_return) + parseFloat(item.total);
                                }
                                if (item.order_type == "POP" && item.bill_type == "PurchaseReturn") {
                                    purchase_pop_return = parseFloat(purchase_pop_return) + parseFloat(item.total);
                                }

                                last_bill_no = item.bill_no;
                            }
                        });

                        $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                        $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                        $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                        $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                        $$("lblNetPurchase").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                        $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                        $$("lblPurchaseBal").value(parseFloat(totalPurchase.toFixed(2) - totalPurchasePayment.toFixed(2)).toFixed(2));
                        $$("lblTotalTax").value(parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2));
                        //$$("lblProfitAndTax").value((parseFloat(parseFloat(sales_profit) - parseFloat(return_profit)) + parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax))).toFixed(2));
                        //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                        //$$("lblProfit").value(parseFloat(parseFloat(sales_profit).toFixed(2) - parseFloat(return_profit).toFixed(2)).toFixed(2));
                        $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                        $$("lblAmountFromOrder").value(parseFloat(parseFloat(purchase_order) - parseFloat(purchase_order_return)).toFixed(2));
                        $$("lblAmountFromPOP").value(parseFloat(parseFloat(purchase_pop) - parseFloat(purchase_pop_return)).toFixed(2));
                        $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                        $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                        $$("lblNetDebit").value(parseFloat(tot_debit).toFixed(2));
                        $$("msgPanel").hide();
                        //var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_finfacts_comp_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_finfacts_comp_id") + "))"
                        //if ($$("txtStartDate").getDate() != "") {
                        //    finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                        //}
                        //if ($$("txtEndDate").getDate() != "") {
                        //    finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                        //}
                        //page.accAccountService.searchValues(0, "", finfacts_data, "", function (data) {
                        //    $$("lblFinfactsExpenses").value(-(data[0].balance));
                        //    var cash = parseFloat($$("lblTotalPayment").value()) - parseFloat($$("lblTotalReturnsPayment").value()) - parseFloat($$("lblFinfactsExpenses").value());
                        //    $$("lblCashInHand").value(cash.toFixed(2));
                        //});
                    });
                    //var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_finfacts_comp_id") + "))"

                    //if ($$("txtStartDate").getDate() != "") {
                    //    finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                    //}
                    //if ($$("txtEndDate").getDate() != "") {
                    //    finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                    //}

                    //var fin_data = "acc_id = " + CONTEXT.MISCELLANEOUS_ACNT

                    //if ($$("txtStartDate").getDate() != "") {
                    //    fin_data = fin_data + " and date(jrn_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                    //}
                    //if ($$("txtEndDate").getDate() != "") {
                    //    fin_data = fin_data + " and date(jrn_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                    //}
                }
                if ($$("ddlViewMode").selectedValue() == "SupplierWise") {
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
                                { 'name': "Debit Note", 'rlabel': 'Debit Note', 'width': "70px", 'dataField': "debit_amount" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "100px", 'dataField': "round_off" },
                                { 'name': "", 'width': "90%", 'dataField': "sl_no,bill_no", itemTemplate: "<div id='detailGrid'></div>" },
                            ]
                        });
                        var last_supplier_no = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_supplier_no != item.vendor_no && item.vendor_no != undefined && item.vendor_no != null && item.vendor_no != "") {
                                $(row).find(".header").show();
                                item.vendor_no = item.vendor_no == null ? "" : item.vendor_no;
                                item.vendor_name = item.vendor_name == null ? "" : item.vendor_name;
                                item.gst_no = item.gst_no == null ? "" : item.gst_no;
                                item.vendor_address = item.vendor_address == null ? "" : item.vendor_address;
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Supplier No : </span><span style='color:green'>" + item.vendor_no + "</span>,  <span style='color:red'>Supplier Name : </span><span style='color:green'>" + item.vendor_name + "</span>,<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>Address : </span><span style='color:green'>" + item.vendor_address + "</span> </b> <span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_supplier_no = item.vendor_no;

                            $(row).find("input[action=detail]").click(function () {
                                if ($(this).val() == "+") {
                                    $(this).val("-");
                                    page.purchaseBillPaymentAPI.searchValues("", "", "bill_no = " + item.bill_no, "", function (data) {
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
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                            "paytype": ($$("ddlPayType").selectedValue() == "All") ? "" : $$("ddlPayType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Purchase") {
                                    
                                    if (last_bill_no != item.bill_no) {
                                        totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                        purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                        tot_debit = parseFloat(tot_debit) + parseFloat(item.debit_amount);
                                        balancePurchase = parseFloat(balancePurchase) + parseFloat(item.balance);
                                    }
                                    totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.paid);

                                    //customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    if (last_bill_no != item.bill_no) {
                                        returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                        tot_debit = parseFloat(tot_debit) - parseFloat(item.debit_amount);
                                    }
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    //customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                }
                                last_bill_no = item.bill_no;
                            });

                            $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetPurchase").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblPurchaseBal").value(parseFloat(totalPurchase.toFixed(2) - totalPurchasePayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(bill_count);
                            //$$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            //$$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("lblNetDebit").value(parseFloat(tot_debit).toFixed(2));
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
                        $$("grdTransactions").width("2100px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "90px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "110px", 'dataField': "bill_date" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "110px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Total Bills", 'rlabel': "Total Bills", 'width': "110px", 'dataField': "bills" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': 'Payment Type', 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance" },
                                { 'name': "Debit Note", 'rlabel': 'Debit Note', 'width': "70px", 'dataField': "debit_amount" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "100px", 'dataField': "round_off" },
                            ]
                        });
                        var last_supplier_no = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_supplier_no != item.vendor_no && item.vendor_no != undefined && item.vendor_no != null && item.vendor_no != "") {
                                $(row).find(".header").show();
                                item.vendor_no = item.vendor_no == null ? "" : item.vendor_no;
                                item.vendor_name = item.vendor_name == null ? "" : item.vendor_name;
                                item.gst_no = item.gst_no == null ? "" : item.gst_no;
                                item.vendor_address = item.vendor_address == null ? "" : item.vendor_address;
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Supplier No : </span><span style='color:green'>" + item.vendor_no + "</span>,  <span style='color:red'>Supplier Name : </span><span style='color:green'>" + item.vendor_name + "</span>,<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>Address : </span><span style='color:green'>" + item.vendor_address + "</span> </b> <span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_supplier_no = item.vendor_no;
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                            "paytype": ($$("ddlPayType").selectedValue() == "All") ? "" : $$("ddlPayType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills)
                                if (item.bill_type == "Purchase") {
                                    purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                    balancePurchase = parseFloat(balancePurchase) + parseFloat(item.balance);
                                    //customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.paid);
                                    }
                                    tot_debit = parseFloat(tot_debit) + parseFloat(item.debit_amount);
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    //customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                    tot_debit = parseFloat(tot_debit) - parseFloat(item.debit_amount);
                                }
                            });
                            var item = data[0];
                            totalPurchase = item.total_purchase;
                            totalReturns = item.total_returns;
                            purchasetotalTax = item.total_purchase_tax;
                            returntotalTax = item.total_return_tax;
                            tot_bills = item.total_bills;
                            $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetPurchase").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblPurchaseBal").value((parseFloat(totalPurchase) - parseFloat(totalPurchasePayment)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            //$$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("lblNetDebit").value(parseFloat(tot_debit).toFixed(2));
                            $$("msgPanel").hide();
                        });
                    }
                }
                if ($$("ddlViewMode").selectedValue() == "VariationWise") {
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
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "var_no": ($$("txtVariation").selectedValue() == "-1" || $$("txtVariation").selectedValue() == null) ? "" : $$("txtVariation").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "var_no": ($$("txtVariation").selectedValue() == "-1" || $$("txtVariation").selectedValue() == null) ? "" : $$("txtVariation").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                if ($$("ddlViewMode").selectedValue() == "SummaryDay" || $$("ddlViewMode").selectedValue() == "SummaryMonth" || $$("ddlViewMode").selectedValue() == "SummaryYear") {
                    if ($$("ddlViewMode").selectedValue() == "SummaryDay") {
                        var day = "Date";
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryMonth") {
                        var day = "Month";
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryYear") {
                        var day = "Year";
                    }
                    else {
                        var day = "Date";
                    }
                    $$("grdTransactions").height("350px");
                    $$("grdTransactions").width("120%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "bill_date" },
                            { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                            { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "90px", 'dataField': "total_purchase", filterType: "Text" },
                            { 'name': "Total Purchase Payment", 'rlabel': 'Total Purchase Payment', 'width': "150px", 'dataField': "total_purchase_payment" },
                            { 'name': "Purchase Balance", 'rlabel': 'Purchase Balance', 'width': "110px", 'dataField': "purchase_balance" },
                            { 'name': "Debit Note", 'rlabel': 'Debit Note', 'width': "70px", 'dataField': "debit_amount" },
                            { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "150px", 'dataField': "total_return" },
                            { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment" },
                            { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                            { 'name': "Credit Note", 'rlabel': 'Credit Note', 'width': "70px", 'dataField': "credit_amount" },
                            { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "150px", 'dataField': "discount" },
                            { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "100px", 'dataField': "tax" },
                            { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "150px", 'dataField': "net_purchase" },
                            //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit" },
                        ]
                    });
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    }
                    var reportdata = {
                        "viewMode": $$("ddlViewMode").selectedValue(),
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "cust_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                    }
                    page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                            net_purchase = parseFloat(item.net_purchase) + parseFloat(net_purchase);
                            totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total_purchase);
                            balancePurchase = parseFloat(balancePurchase) + parseFloat(item.purchase_balance);
                            totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.total_purchase_payment);
                            totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                            balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                            tot_debit = parseFloat(tot_debit) + (parseFloat(item.debit_amount) - parseFloat(item.credit_amount));
                            //if (item.profit != null && item.profit != undefined && item.profit != "") {
                            //    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            //}
                        });

                        $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                        $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                        $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                        $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                        $$("lblNetPurchase").value(parseFloat(net_purchase).toFixed(2));
                        $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                        $$("lblPurchaseBal").value(parseFloat(totalPurchase.toFixed(2) - totalPurchasePayment.toFixed(2)).toFixed(2));
                        $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                        $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                        $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                        //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                        $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                        $$("lblNetDebit").value(parseFloat(tot_debit).toFixed(2));
                        $$("msgPanel").hide();
                    })
                }
                if ($$("ddlViewMode").selectedValue() == "PaymentWise") {
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
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //if (item.pay_mode == "Net Bank") {
                                //    total_net_bank_amount = parseFloat(total_net_bank_amount) + parseFloat(item.bill_amount);
                                //}
                                //if (item.pay_mode == "Finance") {
                                //    tot_finance = parseFloat(tot_finance) + parseFloat(item.bill_amount);
                                //}
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            //$$("lblTotalNetBankAmount").value(parseFloat(total_net_bank_amount).toFixed(2));
                            //$$("lblTotalFinanceAmount").value(parseFloat(tot_finance).toFixed(2));
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
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //if (item.pay_mode == "Net Bank") {
                                //    total_net_bank_amount = parseFloat(total_net_bank_amount) + parseFloat(item.bill_amount);
                                //}
                                //if (item.pay_mode == "Finance") {
                                //    tot_finance = parseFloat(tot_finance) + parseFloat(item.bill_amount);
                                //}
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            //$$("lblTotalNetBankAmount").value(parseFloat(total_net_bank_amount).toFixed(2));
                            //$$("lblTotalFinanceAmount").value(parseFloat(tot_finance).toFixed(2));
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
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //if (item.pay_mode == "Net Bank") {
                                //    total_net_bank_amount = parseFloat(total_net_bank_amount) + parseFloat(item.bill_amount);
                                //}
                                //if (item.pay_mode == "Finance") {
                                //    tot_finance = parseFloat(tot_finance) + parseFloat(item.bill_amount);
                                //}
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            //$$("lblTotalNetBankAmount").value(parseFloat(total_net_bank_amount).toFixed(2));
                            //$$("lblTotalFinanceAmount").value(parseFloat(tot_finance).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                }
                if ($$("ddlViewMode").selectedValue() == "OrderWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2000px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Order Id', 'rlabel': 'Order Id', 'width': "70px", 'dataField': "po_id" },
                                { 'name': 'State', 'rlabel': 'Order State', 'width': "150px", 'dataField': "state_name", filterType: "Text" },
                                { 'name': 'Supplier', 'rlabel': 'Supplier', 'width': "150px", 'dataField': "vendor_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid", filterType: "Text" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "sub_total", filterType: "Text" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst", filterType: "Text" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst", filterType: "Text" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst", filterType: "Text" },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_per", filterType: "Text", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "120px", 'dataField': "round_off", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "state_no": ($$("ddlState").selectedValue() == "-1") ? "" : $$("ddlState").selectedValue(),
                            "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                if (item.bill_type == "Purchase") {
                                    purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                    balancePurchase = parseFloat(balancePurchase) + parseFloat(item.balance);
                                    totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.paid);
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                }
                                //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            });
                            $$("lblNetPurchase").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblPurchaseBal").value(parseFloat(totalPurchase.toFixed(2) - totalPurchasePayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
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
                                    { 'name': 'Supplier', 'rlabel': 'Supplier', 'width': "70px", 'dataField': "vendor_name" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "ordered_date" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                    { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid", filterType: "Text" },
                                    { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance", filterType: "Text" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "sub_total", filterType: "Text" },
                                    { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                    { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                    { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                    { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                    { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_val", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                    { 'name': "Discount ", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Round off", 'rlabel': 'Round Off', 'width': "90px", 'dataField': "round_off", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedValue(),
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "state_no": ($$("ddlState").selectedValue() == "-1") ? "" : $$("ddlState").selectedValue(),
                                "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                            }
                            page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                    //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    tot_orders = parseFloat(tot_orders) + parseFloat(item.orders);
                                    if (item.bill_type == "Purchase") {
                                        purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                        totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                        balancePurchase = parseFloat(balancePurchase) + parseFloat(item.balance);
                                        totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.paid);
                                    }
                                    if (item.bill_type == "PurchaseReturn") {
                                        returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                });
                                $$("lblNetPurchase").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblPurchaseBal").value(parseFloat(totalPurchase.toFixed(2) - totalPurchasePayment.toFixed(2)).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2));
                                //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_orders).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                
                if ($$("ddlViewMode").selectedValue() == "ItemWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("120%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_code", filterType: "Text" },
                                { 'name': 'Barcode', 'rlabel': 'Barcode', 'width': "110px", 'dataField': "barcode", filterType: "Text", visible: CONTEXT.SHOW_BARCODE },
                                { 'name': 'Main Product Type', 'rlabel': 'Main Product Type', 'width': "130px", 'dataField': "mpt_name", filterType: "Text" },
                                { 'name': 'Product Type', 'rlabel': 'Product Type', 'width': "130px", 'dataField': "ptype_name", filterType: "Text" },
                                { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "110px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "110px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "120px", 'dataField': "cost", filterType: "Text" },
                                { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "120px", 'dataField': "price", filterType: "Text" },
                                //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "90px", 'dataField': "profit_per", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                            "invoice_no": $$("txtInvoiceNo").value(),
                            "main_prod_type": ($$("ddlMainProdType").selectedValue() == "All" || $$("ddlMainProdType").selectedValue() == "-1") ? "" : $$("ddlMainProdType").selectedValue(),
                            "prod_type": ($$("ddlProdType").selectedValue() == "All" || $$("ddlProdType").selectedValue() == "-1") ? "" : $$("ddlProdType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Purchase") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item.cost) + parseFloat(item_cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item.price) + parseFloat(item_price);
                                    }
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item_cost) - parseFloat(item.cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item_price) - parseFloat(item.price);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                            $$("lblTotalNetRate").value(parseFloat(item_price).toFixed(2));
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
                        $$("grdTransactions").width("120%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_code", filterType: "Text" },
                                { 'name': 'Barcode', 'rlabel': 'Barcode', 'width': "110px", 'dataField': "barcode", filterType: "Text", visible: CONTEXT.SHOW_BARCODE },
                                { 'name': 'Main Product Type', 'rlabel': 'Main Product Type', 'width': "130px", 'dataField': "mpt_name", filterType: "Text" },
                                { 'name': 'Product Type', 'rlabel': 'Product Type', 'width': "130px", 'dataField': "ptype_name", filterType: "Text" },
                                { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "90px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "110px", 'dataField': "cost", filterType: "Text" },
                                { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "110px", 'dataField': "price", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "100px", 'dataField': "bill_type", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "invoice_no": $$("txtInvoiceNo").value(),
                            "main_prod_type": ($$("ddlMainProdType").selectedValue() == "All" || $$("ddlMainProdType").selectedValue() == "-1") ? "" : $$("ddlMainProdType").selectedValue(),
                            "prod_type": ($$("ddlProdType").selectedValue() == "All" || $$("ddlProdType").selectedValue() == "-1") ? "" : $$("ddlProdType").selectedValue(),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Purchase") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item.cost)) + parseFloat(item_cost);
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item.price)) + parseFloat(item_price);
                                    //item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item.profit)) + parseFloat(item_profit);
                                }
                                else {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item_cost) - parseFloat(item.cost));
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item_price) - parseFloat(item.price));
                                    //item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item_profit) - parseFloat(item.profit));
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                            $$("lblTotalNetRate").value(parseFloat(item_price).toFixed(2));
                            //$$("lblTotalProfit").value(parseFloat(item_profit).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                }
                
                if ($$("ddlViewMode").selectedValue() == "StoreWise") {
                    var last_store_no = "";
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                //{ 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills", filterType: "Text" },
                                { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "90px", 'dataField': "total_Purchases", filterType: "Text" },
                                { 'name': "Total Purchase Payment", 'rlabel': 'Total Purchase Payment', 'width': "150px", 'dataField': "total_Purchases_payment", filterType: "Text" },
                                { 'name': "Purchase Balance", 'rlabel': 'Purchase Balance', 'width': "110px", 'dataField': "Purchases_balance" },
                                { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                                { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_Purchases", filterType: "Text" },
                                //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_store_no != item.store_no && item.store_no != undefined && item.store_no != null && item.store_no != "") {
                                $(row).find(".header").show();
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Store Name : </span><span style='color:green'>" + item.store_name + "</span></b></span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_store_no = item.store_no;
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total_Purchases);
                                totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.total_Purchases_payment);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                balancePurchase = parseFloat(balancePurchase) + parseFloat(item.Purchases_balance);
                                balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            });
                            $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetAmt").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblPurchaseBal").value(parseFloat(balancePurchase).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblPurchaseBal").value())).toFixed(2));
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
                                    { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                    //{ 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name" },
                                    { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                    { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "90px", 'dataField': "total_Purchases", filterType: "Text" },
                                    { 'name': "Total Purchase Payment", 'rlabel': 'Total Purchase Payment', 'width': "150px", 'dataField': "total_Purchases_payment", filterType: "Text" },
                                    { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                    { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                    { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_Purchases", filterType: "Text" },
                                    //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);

                                if (last_store_no != item.store_no && item.store_no != undefined && item.store_no != null && item.store_no != "") {
                                    $(row).find(".header").show();
                                    $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Store Name : </span><span style='color:green'>" + item.store_name + "</span></b></span>");
                                }
                                else
                                    $(row).find(".header").hide();
                                last_store_no = item.store_no;

                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedValue(),
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            }
                            page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                    //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total_Purchases);
                                    totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.total_Purchases_payment);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    balancePurchase = parseFloat(balancePurchase) + parseFloat(item.Purchases_balance);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                                });
                                $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblNetAmt").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblPurchaseBal").value(parseFloat(balancePurchase).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                
                if ($$("ddlViewMode").selectedValue() == "BillItemwise") {
                    $$("grdTransactions").height("400px");
                    $$("grdTransactions").width("100%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "50px", 'dataField': "item_no", visible: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "100px", 'dataField': "item_code", },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name", },
                            { 'name': "Qty", 'rlabel': 'Qty', 'width': "90px", 'dataField': "qty", },
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
                            item.vendor_no = item.vendor_no == null ? "" : item.vendor_no;
                            item.vendor_name = item.vendor_name == null ? "" : item.vendor_name;
                            item.gst_no = item.gst_no == null ? "" : item.gst_no;
                            item.vendor_address = item.vendor_address == null ? "" : item.vendor_address;
                            $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Bill No : </span><span style='color:green'>" + item.bill_code + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Bill Date : </span><span style='color:green'>" + item.bill_date + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Invoice No : </span><span style='color:green'>" + item.invoice_no + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Bill Amount : </span><span style='color:green'>" + item.total + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Vendor Name : </span><span style='color:green'>" + item.vendor_name + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Vendor Address : </span><span style='color:green'>" + item.vendor_address + "</span>," +
                                "&nbsp;&nbsp;&nbsp;<span style='color:red'>Vendor Mobile : </span><span style='color:green'>" + item.mobile_no + "</span></b> <span>");
                            tot_bills++;
                            $$("lblTotalBills").value(tot_bills);
                        }
                        else
                            $(row).find(".header").hide();
                        last_bill_no = item.bill_no;
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
                        "viewMode": $$("ddlViewMode").selectedValue(),
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "from_bill": from_bill,
                        "to_bill": to_bill,
                        "paymode": "",
                        "invoice_no": $$("txtInvoiceNo").value(),
                        "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                    }
                    page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                        if (data.length > 0) {
                            page.resultFound();
                        }
                        else {
                            page.noResultFound();
                        }
                        $$("grdTransactions").dataBind(data);
                        $$("pnlGridFilter").show();
                        $(data).each(function (i, item) {
                            item.discount = (item.discount == null) ? 0 : item.discount;
                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            item.tax = (item.tax == null) ? 0 : item.tax;
                            item.total_price = (item.total_price == null) ? 0 : item.total_price;
                            if (item.bill_type == "Purchase") {
                                purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total_price);
                            }
                            if (item.bill_type == "PurchaseReturn") {
                                returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_price);
                            }
                        });
                        $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                        $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                        $$("lblNetPurchase").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                        $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                        $$("lblTotalTax").value(parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2));
                        $$("msgPanel").hide();
                    });
                }

                if ($$("ddlViewMode").selectedValue() == "Attributewise") {
                    $$("grdTransactions").height("350px");
                    $$("grdTransactions").width("140%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_code", filterType: "Text" },
                            { 'name': 'Barcode', 'rlabel': 'Barcode', 'width': "110px", 'dataField': "barcode", filterType: "Text", visible: CONTEXT.SHOW_BARCODE },
                            { 'name': 'Main Product Type', 'rlabel': 'Main Product Type', 'width': "130px", 'dataField': "mpt_name", filterType: "Text" },
                            { 'name': 'Product Type', 'rlabel': 'Product Type', 'width': "130px", 'dataField': "ptype_name", filterType: "Text" },
                            { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text", visible: false },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code", },
                            { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                            { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "110px", 'dataField': "bill_type", filterType: "Text" },
                            { 'name': "Qty", 'rlabel': 'Qty', 'width': "110px", 'dataField': "qty", filterType: "Text" },
                            { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "120px", 'dataField': "cost", filterType: "Text" },
                            { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "120px", 'dataField': "price", filterType: "Text" },
                            { 'name': "MRP", 'rlabel': 'MRP', 'width': "100px", 'dataField': "mrp", visible: ($$("ddlAttributeFilter").selectedValue() == "-1" || $$("ddlAttributeFilter").selectedValue() == "mrp"), filterType: "Text" },
                            { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "100px", 'dataField': "batch_no", visible: ($$("ddlAttributeFilter").selectedValue() == "-1" || $$("ddlAttributeFilter").selectedValue() == "batch_no"), filterType: "Text" },
                            { 'name': "Man Date", 'rlabel': 'Man Date', 'width': "100px", 'dataField': "man_date", visible: ($$("ddlAttributeFilter").selectedValue() == "-1" || $$("ddlAttributeFilter").selectedValue() == "man_date"), filterType: "Text" },
                            { 'name': "Expiry Date", 'rlabel': 'Expiry Date', 'width': "100px", 'dataField': "exp_date", visible: ($$("ddlAttributeFilter").selectedValue() == "-1" || $$("ddlAttributeFilter").selectedValue() == "exp_date"), filterType: "Text" },
                        ]
                    });
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    }
                    var reportdata = {
                        "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                        "viewMode": $$("ddlViewMode").selectedValue(),
                        //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                        "vendor_no": ($$("ddlVendor").selectedValue() == "-1") ? "" : $$("ddlVendor").selectedValue(),
                        "invoice_no": $$("txtInvoiceNo").value(),
                        "attr_type": ($$("ddlAttributeFilter").selectedValue() == "-1") ? "" : $$("ddlAttributeFilter").selectedValue(),
                        "attr_value": $$("txtAttributeText").value(),
                        "main_prod_type": ($$("ddlMainProdType").selectedValue() == "All" || $$("ddlMainProdType").selectedValue() == "-1") ? "" : $$("ddlMainProdType").selectedValue(),
                        "prod_type": ($$("ddlProdType").selectedValue() == "All" || $$("ddlProdType").selectedValue() == "-1") ? "" : $$("ddlProdType").selectedValue(),
                    }
                    page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                        if (data.length > 0) {
                            page.resultFound();
                        }
                        else {
                            page.noResultFound();
                        }
                        $$("grdTransactions").dataBind(data);
                        $$("pnlGridFilter").show();
                        $(data).each(function (i, item) {
                            if (item.bill_type == "Purchase") {
                                tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                if (item.cost != null && item.cost != undefined && item.cost != "") {
                                    item_cost = parseFloat(item.cost) + parseFloat(item_cost);
                                }
                                if (item.price != null && item.price != undefined && item.price != "") {
                                    item_price = parseFloat(item.price) + parseFloat(item_price);
                                }
                            }
                            if (item.bill_type == "PurchaseReturn") {
                                tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                if (item.cost != null && item.cost != undefined && item.cost != "") {
                                    item_cost = parseFloat(item_cost) - parseFloat(item.cost);
                                }
                                if (item.price != null && item.price != undefined && item.price != "") {
                                    item_price = parseFloat(item_price) - parseFloat(item.price);
                                }
                            }
                        });
                        $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                        $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                        $$("lblTotalNetRate").value(parseFloat(item_price).toFixed(2));
                        $$("msgPanel").hide();
                    })
                }

                if ($$("ddlViewMode").selectedValue() == "StoreWise") {
                    var last_store_no = "";
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                //{ 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills", filterType: "Text" },
                                { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "90px", 'dataField': "total_Purchases", filterType: "Text" },
                                { 'name': "Total Purchase Payment", 'rlabel': 'Total Purchase Payment', 'width': "150px", 'dataField': "total_Purchases_payment", filterType: "Text" },
                                { 'name': "Purchase Balance", 'rlabel': 'Purchase Balance', 'width': "110px", 'dataField': "Purchases_balance" },
                                { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                                { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_Purchases", filterType: "Text" },
                                //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_store_no != item.store_no && item.store_no != undefined && item.store_no != null && item.store_no != "") {
                                $(row).find(".header").show();
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Store Name : </span><span style='color:green'>" + item.store_name + "</span></b></span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_store_no = item.store_no;
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedValue(),
                            //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        }
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total_Purchases);
                                totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.total_Purchases_payment);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                balancePurchase = parseFloat(balancePurchase) + parseFloat(item.Purchases_balance);
                                balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            });
                            $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetAmt").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblPurchaseBal").value(parseFloat(balancePurchase).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblPurchaseBal").value())).toFixed(2));
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
                                    { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                    //{ 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name" },
                                    { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                    { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "90px", 'dataField': "total_Purchases", filterType: "Text" },
                                    { 'name': "Total Purchase Payment", 'rlabel': 'Total Purchase Payment', 'width': "150px", 'dataField': "total_Purchases_payment", filterType: "Text" },
                                    { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                    { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                    { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_Purchases", filterType: "Text" },
                                    //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);

                                if (last_store_no != item.store_no && item.store_no != undefined && item.store_no != null && item.store_no != "") {
                                    $(row).find(".header").show();
                                    $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Store Name : </span><span style='color:green'>" + item.store_name + "</span></b></span>");
                                }
                                else
                                    $(row).find(".header").hide();
                                last_store_no = item.store_no;

                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedValue(),
                                //"store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            }
                            page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                    //net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total_Purchases);
                                    totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.total_Purchases_payment);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    balancePurchase = parseFloat(balancePurchase) + parseFloat(item.Purchases_balance);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                                });
                                $$("lblTotalPurchase").value(parseFloat(totalPurchase).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalPurchasePayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblNetAmt").value(parseFloat(parseFloat(totalPurchase).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblPurchaseBal").value(parseFloat(balancePurchase).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblPurchaseBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
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
                                { 'name': 'Register', 'rlabel': 'Register', 'width': "120px", 'dataField': "reg_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "120px", 'dataField': "user_name", filterType: "Text" },
                                { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "120px", 'dataField': "bills", filterType: "Text" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "120px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "100px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "120px", 'dataField': "total", filterType: "Text" },
                                //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "to_bill": $$("txtToBill").value(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                if (item.bill_type == "Purchase") {
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalPurchase) - parseFloat(totalReturns)).toFixed(2));
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
                                { 'name': 'Register', 'rlabel': 'Register', 'width': "120px", 'dataField': "reg_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "120px", 'dataField': "user_name", filterType: "Text" },
                                { 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "120px", 'dataField': "bill_no", filterType: "Text", visible: false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "120px", 'dataField': "bill_code", },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "120px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "100px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "120px", 'dataField': "total", filterType: "Text" },
                                //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "to_bill": $$("txtToBill").value(),
                        }
                        reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                        page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Purchase") {
                                    totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "PurchaseReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalPurchase) - parseFloat(totalReturns)).toFixed(2));
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
                                    { 'name': 'Machine', 'rlabel': 'Machine', 'width': "120px", 'dataField': "reg_name", filterType: "Text" },
                                    { 'name': 'User', 'rlabel': 'User', 'width': "120px", 'dataField': "user_name", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "120px", 'dataField': "bill_date", filterType: "Text" },
                                    { 'name': "Bills", 'rlabel': 'Bills', 'width': "120px", 'dataField': "bills", filterType: "Text" },
                                    { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "120px", 'dataField': "bill_type", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "100px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "120px", 'dataField': "total", filterType: "Text" },
                                    //{ 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                                "store_no": masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                                "from_bill": $$("txtFromBill").value(),
                                "to_bill": $$("txtToBill").value(),
                            }
                            reportdata.reg_no = masterPage.controls.ddlGlobalRegisterName.selectedValue() == "All" || masterPage.controls.ddlGlobalRegisterName.selectedValue() == "-1" ? "" : masterPage.controls.ddlGlobalRegisterName.selectedValue();
                            page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
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
                                    if (item.bill_type == "Purchase") {
                                        totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) + parseFloat(item.qty);
                                        }
                                    }
                                    if (item.bill_type == "PurchaseReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                        }
                                    }
                                });
                                $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalPurchase) - parseFloat(totalReturns)).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }



                if ($$("ddlViewMode").selectedValue() == "Standard") {
                    $$("lblSummaryName").value("Standard Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").hide();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").show();
                }
                if ($$("ddlViewMode").selectedValue() == "SupplierWise") {
                    $$("lblSummaryName").value("SupplierWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").show();
                }
                if ($$("ddlViewMode").selectedValue() == "SummaryDay") {
                    $$("lblSummaryName").value("SummaryDay Summary");
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").show();
                }
                if ($$("ddlViewMode").selectedValue() == "SummaryMonth") {
                    $$("lblSummaryName").value("SummaryMonth Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").show();
                }
                if ($$("ddlViewMode").selectedValue() == "SummaryYear") {
                    $$("lblSummaryName").value("SummaryYear Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").show();
                }
                if ($$("ddlViewMode").selectedValue() == "VariationWise") {
                    $$("lblSummaryName").value("VariationWise Summary")
                    $$("pnlSummary").hide();
                    $$("pnlPurchaseSummary").hide();
                    $$("pnlTotalPurchase").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlPurchaseBalance").hide();
                    $$("pnlPurchaseReturnBalance").hide();
                    $$("pnlPurchaseReturnSummary").hide();
                    $$("pnlPurchaseTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetPurchase").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetDebit").hide();
                }
                if ($$("ddlViewMode").selectedValue() == "PaymentWise") {
                    $$("lblSummaryName").value("PaymentWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").hide();
                    $$("pnlPurchaseBalance").hide();
                    $$("pnlPurchaseReturnBalance").hide();
                    $$("pnlPurchaseReturnSummary").hide();
                    $$("pnlPurchaseTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetPurchase").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").show();
                    $$("pnlTotalCardAmount").show();
                    $$("pnlTotalChequeAmount").show();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetDebit").hide();
                }
                if ($$("ddlViewMode").selectedValue() == "OrderWise") {
                    $$("lblSummaryName").value("OrderWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").hide();
                }
                if ($$("ddlViewMode").selectedValue() == "ItemWise" || $$("ddlViewMode").selectedValue() == "Attributewise") {
                    $$("lblSummaryName").value("ItemWise Summary")
                    if ($$("ddlViewMode").selectedValue() == "Attributewise") {
                        $$("lblSummaryName").value("AttributeWise Summary")
                    }
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").hide();
                    $$("pnlTotalPurchase").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlPurchaseBalance").hide();
                    $$("pnlPurchaseReturnBalance").hide();
                    $$("pnlPurchaseReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlPurchaseTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetPurchase").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").show();
                    $$("pnlTotalBuyingCost").show();
                    $$("pnlTotalNetRate").show();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetDebit").hide();
                }
                if ($$("ddlViewMode").selectedValue() == "StoreWise") {
                    $$("lblSummaryName").value("StoreWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlPurchaseBalance").show();
                    $$("pnlPurchaseReturnBalance").show();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").hide();
                    $$("pnlNetAmt").show();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlNetBalance").show();
                    $$("pnlNetDebit").hide();
                }
                if ($$("ddlViewMode").selectedValue() == "BillItemwise") {
                    $$("lblSummaryName").value("Bill Itemwise Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").show();
                    $$("pnlTotalPurchase").show();
                    $$("pnlTotalPayment").hide();
                    $$("pnlPurchaseBalance").hide();
                    $$("pnlPurchaseReturnBalance").hide();
                    $$("pnlPurchaseReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlPurchaseTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetDebit").hide();
                }
                if ($$("ddlViewMode").selectedValue() == "MachineWise") {
                    $$("lblSummaryName").value("MachineWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlPurchaseSummary").hide();
                    $$("pnlTotalPurchase").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlPurchaseBalance").hide();
                    $$("pnlPurchaseReturnBalance").hide();
                    $$("pnlPurchaseReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlPurchaseTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetPurchase").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOP").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalPurchaseQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").show();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlTotalNetRate").hide();
                    $$("pnlGridFilter").hide();
                    $$("pnlNetBalance").hide();
                    $$("pnlNetDebit").hide();
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
                    page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlStore").dataBind(data, "store_no", "store_name", "All");
                    });
                });
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
                itemFilterData.push({ item_mode_no: "1", item_mode_name: "Overall" }, { item_mode_no: "2", item_mode_name: "Purchasewise" })
                $$("ddlItemFilter").dataBind(itemFilterData, "item_mode_no", "item_mode_name", "Select");
                var filterViewData = [];
                filterViewData.push({ view_no: "Standard", view_name: "Standard" }, { view_no: "SupplierWise", view_name: "Supplier Wise" },
                    { view_no: "SummaryDay", view_name: "Summary Day" }, { view_no: "SummaryMonth", view_name: "Summary Month" }, { view_no: "SummaryYear", view_name: "Summary Year" },
                    { view_no: "PaymentWise", view_name: "Payment Wise" }, { view_no: "ItemWise", view_name: "Item Wise" },// { view_no: "OrderWise", view_name: "Order Wise" },
                    { view_no: "StoreWise", view_name: "Store Wise" }, { view_no: "BillItemwise", view_name: "Invoice Wise" }, { view_no: "Attributewise", view_name: "Attribute Wise" }, { view_no: "MachineWise", view_name: "MachineWise" }),
                    
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");
                page.shopOnStatesAPI.searchValues("", "", "po_t=1", "", function (data) {
                    $$("ddlState").dataBind(data, "state_no", "state_name", "All");
                });
                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlVendor").dataBind(data, "vendor_no", "vendor_name", "All");
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
                $$("lblNetPurchaseName").click(function () {
                    if ($$("ddlViewMode").selectedValue() == "Standard") {
                        $$("pnlAmountFromPOP").toggle();
                        $$("pnlAmountFromOrder").toggle();
                    }
                })
                var bill_typedata = [];
                bill_typedata.push({ "bill_type": "Purchase" }, { "bill_type": "PurchaseReturn" });//, { "bill_type": "SaleSaved" }
                $$("ddlBillType").dataBind(bill_typedata, "bill_type", "bill_type", "All");
                var payModeType = [];
                payModeType.push({ mode_type: "All" }, { mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Cheque" });

                page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
                var payMode = [];
                payMode.push({ mode_type: "All" }, { mode_type: "Cash" }, { mode_type: "Card" });
                if (CONTEXT.ENABLE_CHEQUE_PAYMENT_MODE)
                    payMode.push({ mode_type: "Cheque" });
                payMode.push({ mode_type: "Mixed" });
                payMode.push({ mode_type: "Loan" });
                page.controls.ddlPayType.dataBind(payMode, "mode_type", "mode_type");

                var attributeData = [];
                attributeData.push({ view_no: "exp_date", view_name: "Expiry Date" },{ view_no: "man_date", view_name: "Man Date" },{ view_no: "cost", view_name: "Cost" },{ view_no: "mrp", view_name: "MRP" },{ view_no: "batch_no", view_name: "Batch No" }),

                $$("ddlAttributeFilter").dataBind(attributeData, "view_no", "view_name","All");
                $(".register-header").hide();
                $$("ddlViewMode").selectionChange(function (data) {
                    $(".register-header").hide();
                    if ($$("ddlViewMode").selectedValue() == "SupplierWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").show();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlPayMode").show();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").show();
                        $$("pnlNetDebit").show();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "VariationWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").hide();
                        $$("pnlItem").show();
                        $$("pnlVariation").show();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "Standard") {
                        $$("lblNetPurchaseName").attr("style", "user-select: none;cursor: pointer;");
                        $$("pnlVendor").hide();
                        $$("pnlItem").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").show();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").show();
                        $$("pnlNetDebit").show();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryDay" || $$("ddlViewMode").selectedValue() == "SummaryMonth" || $$("ddlViewMode").selectedValue() == "SummaryYear") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").show();
                        page.refreshAll();
                        $$("txtStartDate").selectedObject.val("");
                        $$("txtEndDate").selectedObject.val("");
                    }
                    else if ($$("ddlViewMode").selectedValue() == "PaymentWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "OrderWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").show();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").show();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                    
                    else if ($$("ddlViewMode").selectedValue() == "ItemWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").show();
                        $$("pnlItem").show();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").show();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").show();
                        $$("pnlProdType").show();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "StoreWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "UserWise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").show();
                        $$("pnlLineman").hide();
                        $$("pnlUser").show();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").hide();
                        page.controls.ddlLoginUser.dataBind(CONTEXT.USERIDACCESS, "user_id", "user_name", "All");
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "BillItemwise") {
                        $$("lblNetPurchaseName").attr("style", "user-select: none;cursor: pointer;");
                        $$("pnlVendor").show();
                        $$("pnlItem").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        $$("pnlInvoiceNo").show();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").hide();
                        $$("pnlNetDebit").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "Attributewise") {
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").show();
                        $$("pnlItem").show();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").show();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").show();
                        $$("pnlProdType").show();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "MachineWise") {
                        $(".register-header").show();
                        $$("lblNetPurchaseName").attr("style", "");
                        $$("pnlVendor").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        $$("pnlInvoiceNo").hide();
                        $$("pnlAttributeFilter").hide();
                        $$("pnlAttributeText").hide();
                        //$$("pnlStore").show();
                        $$("pnlStatus").hide();
                        //$$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlMainProdType").hide();
                        $$("pnlProdType").hide();
                        $$("pnlNetDebit").hide();
                        page.refreshAll();
                    }
                });
                setTimeout(function () {
                    $$("pnlFilterPanel").show();
                    $$("pnlItemSalesExecutive").hide();
                    $$("pnlBillType").show();
                    $$("pnlFromBill").show();
                    $$("pnlToBill").show();
                    $$("pnlInvoiceNo").hide();
                    $$("pnlAttributeFilter").hide();
                    $$("pnlAttributeText").hide();
                    //$$("pnlStore").show();
                    $$("pnlPayment").show();
                    $$("pnlPayMode").show();
                    $$("txtStartDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("txtEndDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("lblNetPurchaseName").attr("style", "user-select: none;cursor: pointer;");
                    $$("ddlViewMode").selectedObject.focus();
                }, 1000);


                $$("ddlAttributeFilter").selectionChange(function () {
                    if ($$("ddlAttributeFilter").selectedValue() == "-1") {
                        $$("pnlAttributeText").hide();
                    }
                    else {
                        $$("pnlAttributeText").show();
                    }
                })
                
                page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlMainProdType").dataBind(data, "mpt_no", "mpt_name", "All");
                });
                page.productTypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlProdType").dataBind(data, "ptype_no", "ptype_name", "All");
                });
                $$("ddlMainProdType").selectionChange(function () {
                    var filter = "";
                    if ($$("ddlMainProdType").selectedValue() != "-1" && $$("ddlMainProdType").selectedValue() != null && $$("ddlMainProdType").selectedValue() != "All") {
                        filter = "mptt.mpt_no = " + $$("ddlMainProdType").selectedValue();
                    }
                    page.productTypeAPI.searchValues("", "", filter, "", function (data) {
                        $$("ddlProdType").dataBind(data, "ptype_no", "ptype_name", "All");
                    });
                });

                store_refresh = false;
                masterPage.controls.ddlGlobalStoreName.dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name", "All");
                masterPage.controls.ddlGlobalRegisterName.dataBind($.parseJSON(localStorage.getItem("user_register_data")), "reg_no", "reg_name", "All");
                masterPage.controls.ddlGlobalStoreName.selectedValue(localStorage.getItem("user_store_no"));
                masterPage.controls.ddlGlobalRegisterName.selectedValue(localStorage.getItem("user_register_id"));

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
            $$("ddlVendor").selectedValue(-1);
            $$("txtItem").selectedObject.val("");
            $$("txtVariation").selectedObject.val("");
            $$("ddlBillType").selectedValue(-1);
            $$("ddlStore").selectedValue(-1);
            $$("txtFromBill").value("");
            $$("txtToBill").value("");
            $$("txtInvoiceNo").value("");
            $$("ddlState").selectedValue(-1);
            $$("ddlPaymentType").selectedValue("All");
            $$("ddlItemSalesMan").selectedValue(-1);
            $$("ddlRegister").selectedValue(-1);
            $$("ddlLoginUser").selectedValue(-1);
            $$("ddlItemFilter").selectedValue(-1);
            $$("ddlSummaryFilter").selectedValue(0);
            $$("ddlAttributeFilter").selectedValue(-1);
            $$("txtAttributeText").value("");
            $$("ddlMainProdType").selectedValue("-1");
            $$("ddlProdType").selectedValue("All");
        }
        page.events.jasperReport = function () {
            var filter = {};
            var totalPurchase = 0;
            var totalPurchasePayment = 0;
            var balancePurchase = 0;
            var totalReturns = 0;
            var totalReturnsPayment = 0;
            var balanceReturns = 0;
            var purchasetotalTax = 0;
            var returntotalTax = 0;
            var totalTax = 0;
            var executive_sales_points = 0;
            var executive_return_points = 0;
            var executive_net_points = 0;
            var tot_bills = 0;
            var total_cash_amount = 0;
            var total_card_amount = 0;
            var total_cheque_amount = 0;
            var total_net_bank_amount = 0;
            var total_bill_amount = 0;
            var tot_qty = 0;
            var Purchase_tot_qty = 0;
            var return_tot_qty = 0;
            var tot_amount = 0;
            var item_profit = 0;
            var item_cost = 0;
            var item_price = 0;
            var temp_cost;
            var temp_price;
            var purchase_order = 0;
            var purchase_order_return = 0;
            var purchase_pop = 0;
            var purchase_pop_return = 0;
            var net_purchase = 0;
            var totalPaymentDiscount = 0;
            var tot_net_balance = 0;

            var lastSuppNo = "";
            var detail_list = [];

            if ($$("ddlViewMode").selectedValue() == "Standard") {
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
                    "viewMode": $$("ddlViewMode").selectedValue(),
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
                page.purchaseReportAPI.purchaseReport(reportdata, function (data) {
                    var last_bill_no = 0;
                    $(data).each(function (i, item) {
                        if (last_bill_no != item.bill_no) {
                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            if (item.bill_type == "Purchase") {
                                purchasetotalTax = parseFloat(item.tax) + parseFloat(purchasetotalTax);
                                totalPurchase = parseFloat(totalPurchase) + parseFloat(item.total);
                                balancePurchase = parseFloat(balancePurchase) + parseFloat(item.balance);
                                totalPurchasePayment = parseFloat(totalPurchasePayment) + parseFloat(item.paid);
                            }
                            if (item.bill_type == "PurchaseReturn") {
                                returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                            }
                            if (item.order_type == "Order" && item.bill_type == "Purchase") {
                                purchase_order = parseFloat(purchase_order) + parseFloat(item.total);
                            }
                            if (item.order_type == "POP" && item.bill_type == "Purchase") {
                                purchase_pop = parseFloat(purchase_pop) + parseFloat(item.total);
                            }
                            if (item.order_type == "Order" && item.bill_type == "PurchaseReturn") {
                                purchase_order_return = parseFloat(purchase_order_return) + parseFloat(item.total);
                            }
                            if (item.order_type == "POP" && item.bill_type == "PurchaseReturn") {
                                purchase_pop_return = parseFloat(purchase_pop_return) + parseFloat(item.total);
                            }
                            last_bill_no = item.bill_no;
                        }
                    });
                    $$("msgPanel").hide();
                    $(data).each(function (i, item) {
                        detail_list.push({
                            "Heading": "",
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Bill No",
                            "Data2": item.bill_code,
                            "Heading3": "Invoice No",
                            "Data3": item.invoice_no,
                            "Heading4": "Bill Type",
                            "Data4": item.bill_type,
                            "Heading5": "Supplier",
                            "Data5": item.vendor_name,
                            "Heading6": "Bill Date",
                            "Data6": item.bill_date,
                            "Heading7": "Pay Mode",
                            "Data7": item.pay_mode,
                            "Heading8": "Sub Total",
                            "Data8": item.sub_total,
                            "Heading9": "GST",
                            "Data9": item.tax,
                            "Heading10": "Discount",
                            "Data10": item.discount,
                            "Heading11": "Net Amt",
                            "Data11": item.total,
                            "Heading12": "Paid",
                            "Data12": item.paid,
                            "Heading13": "Balance",
                            "Data13": item.balance
                        });
                    });
                    var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": "Purchase Report ( Standard )",
                            "SummaryHeading1": "Total Purchase",
                            "SummaryData1": parseFloat(totalPurchase).toFixed(2),
                            "SummaryHeading2": "Total Return",
                            "SummaryData2": parseFloat(totalReturns).toFixed(2),
                            "SummaryHeading3": "Purchase Payment",
                            "SummaryData3": parseFloat(totalPurchasePayment).toFixed(2),
                            "SummaryHeading4": "Return Payment",
                            "SummaryData4": parseFloat(totalReturnsPayment).toFixed(2),
                            "SummaryHeading5": "Purchase Balance",
                            "SummaryData5": parseFloat(totalPurchase.toFixed(2) - totalPurchasePayment.toFixed(2)).toFixed(2),
                            "SummaryHeading6": "Return Balance",
                            "SummaryData6": parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2),
                            "SummaryHeading7": "Total Tax",
                            "SummaryData7": parseFloat(parseFloat(purchasetotalTax) - parseFloat(returntotalTax)).toFixed(2),
                            "SummaryHeading8": "Total Discount",
                            "SummaryData8": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),
                            "SummaryHeading9": "Net Balance",
                            "SummaryData9": parseFloat($$("lblNetBalance").value()).toFixed(2),
                            "SummaryHeading10": "Net Purchase",
                            "SummaryData10": parseFloat($$("lblNetPurchase").value()).toFixed(2),
                            "SummaryHeading11": "Total Bills",
                            "SummaryData11": parseFloat($$("lblTotalBills").value()).toFixed(2),
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Standard",
                            "Details": detail_list
                        };
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                        $$("pnlPrintingPopup").close();
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                });
            }
            if ($$("ddlViewMode").selectedValue() == "SupplierWise") {
                $($$("grdTransactions").allData()).each(function (i, item) {
                    var heading = "";
                    var bill_title = "Bill No", bill_no = "Bill date",bills = item.bill_date;
                    var bill_date = item.bill_code;
                    if ($$("ddlSummaryFilter").selectedValue() == "1") {
                        bill_title = "Date";
                        bill_date = item.bill_date;
                        bill_no = "Total Bills";
                        bills = item.bills;
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                        bill_title = "Month";
                        bill_date = item.bill_date;
                        bill_no = "Total Bills";
                        bills = item.bills;
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                        bill_title = "Year";
                        bill_date = item.bill_date;
                        bill_no = "Total Bills";
                        bills = item.bills;
                    }
                    if (lastSuppNo != item.vendor_no) {
                        heading = "Supplier No : " + item.vendor_no + " | Supplier Name : " + item.vendor_name + " | GST :" + item.gst_no + " | Address :  " + item.vendor_address;
                    }
                    detail_list.push({
                        "Heading": heading,
                        "Heading1": "Sl No",
                        "Data1": i+1,
                        "Heading2": bill_title,
                        "Data2": bill_date,
                        "Heading3": bill_no,
                        "Data3": bills,
                        "Heading4": "Bill Type",
                        "Data4": item.bill_type,
                        "Heading5": "Sub Total",
                        "Data5": item.sub_total,
                        "Heading6": "GST",
                        "Data6": item.tax,
                        "Heading7": "Discount",
                        "Data7": item.discount,
                        "Heading8": "Net Amount",
                        "Data8": item.total,
                        "Heading9": "Paid",
                        "Data9": item.paid,
                        "Heading10": "Balance",
                        "Data10": item.balance,
                        "Heading11": "",
                        "Data11": "",
                        "Heading12": "",
                        "Data12": "",
                        "Heading13": "",
                        "Data13": ""
                    });
                    lastSuppNo = item.vendor_no;
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": "Purchase Report ( Supplierwise )",
                            "SummaryHeading1": "Total Purchase",
                            "SummaryData1": parseFloat($$("lblTotalPurchase").value()).toFixed(2),
                            "SummaryHeading2": "Total Return",
                            "SummaryData2": parseFloat($$("lblTotalReturns").value()).toFixed(2),
                            "SummaryHeading3": "Purchase Payment",
                            "SummaryData3": parseFloat($$("lblTotalPayment").value()).toFixed(2),
                            "SummaryHeading4": "Return Payment",
                            "SummaryData4": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),
                            "SummaryHeading5": "Purchase Balance",
                            "SummaryData5": parseFloat($$("lblPurchaseBal").value()).toFixed(2),
                            "SummaryHeading6": "Return Balance",
                            "SummaryData6": parseFloat($$("lblReturnBal").value()).toFixed(2),
                            "SummaryHeading7": "Total Tax",
                            "SummaryData7": parseFloat($$("lblTotalTax").value()).toFixed(2),
                            "SummaryHeading8": "Total Discount",
                            "SummaryData8": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),
                            "SummaryHeading9": "Net Balance",
                            "SummaryData9": parseFloat($$("lblNetBalance").value()).toFixed(2),
                            "SummaryHeading10": "Net Purchase",
                            "SummaryData10": parseFloat($$("lblNetPurchase").value()).toFixed(2),
                            "SummaryHeading11": "Total Bills",
                            "SummaryData11": parseFloat($$("lblTotalBills").value()).toFixed(2),
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Supplierwise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "SummaryDay" || $$("ddlViewMode").selectedValue() == "SummaryMonth" || $$("ddlViewMode").selectedValue() == "SummaryYear") {
                var bill_title = "Date";
                var report_title = ""
                $($$("grdTransactions").allData()).each(function (i, item) {
                    if ($$("ddlViewMode").selectedValue() == "SummaryDay") {
                        bill_title = "Date";
                        bill_date = item.bill_date;
                        report_title = "Summary Day";
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryMonth") {
                        bill_title = "Month";
                        bill_date = item.bill_date;
                        report_title = "Summary Month";
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryYear") {
                        bill_title = "Year";
                        bill_date = item.bill_date;
                        report_title = "Summary Year";
                    }
                    detail_list.push({
                        "Heading1": "Sl No",
                        "Data1": i + 1,
                        "Heading2": bill_title,
                        "Data2": bill_date,
                        "Heading3": "Total Bills",
                        "Data3": item.bills,
                        "Heading4": "Total Purchase",
                        "Data4": item.total_purchase,
                        "Heading5": "Total Purchase Payment",
                        "Data5": item.total_purchase_payment,
                        "Heading6": "Purchase Balance",
                        "Data6": item.purchase_balance,
                        "Heading7": "Total Return",
                        "Data7": item.total_return,
                        "Heading8": "Total Return Payment",
                        "Data8": item.total_return_payment,
                        "Heading9": "Return Balance",
                        "Data9": item.return_balance,
                        "Heading10": "Total Tax",
                        "Data10": item.tax,
                        "Heading11": "Total Discount",
                        "Data11":item.discount,
                        "Heading12": "Net Amount",
                        "Data12": item.net_purchase,
                    });
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": "Purchase Report ( " + report_title + " )",
                            "SummaryHeading1": "Total Purchase",
                            "SummaryData1": parseFloat($$("lblTotalPurchase").value()).toFixed(2),
                            "SummaryHeading2": "Total Return",
                            "SummaryData2": parseFloat($$("lblTotalReturns").value()).toFixed(2),
                            "SummaryHeading3": "Purchase Payment",
                            "SummaryData3": parseFloat($$("lblTotalPayment").value()).toFixed(2),
                            "SummaryHeading4": "Return Payment",
                            "SummaryData4": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),
                            "SummaryHeading5": "Purchase Balance",
                            "SummaryData5": parseFloat($$("lblPurchaseBal").value()).toFixed(2),
                            "SummaryHeading6": "Return Balance",
                            "SummaryData6": parseFloat($$("lblReturnBal").value()).toFixed(2),
                            "SummaryHeading7": "Total Tax",
                            "SummaryData7": parseFloat($$("lblTotalTax").value()).toFixed(2),
                            "SummaryHeading8": "Total Discount",
                            "SummaryData8": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),
                            "SummaryHeading9": "Net Balance",
                            "SummaryData9": parseFloat($$("lblNetBalance").value()).toFixed(2),
                            "SummaryHeading10": "Net Purchase",
                            "SummaryData10": parseFloat($$("lblNetPurchase").value()).toFixed(2),
                            "SummaryHeading11": "Total Bills",
                            "SummaryData11": parseFloat($$("lblTotalBills").value()).toFixed(2),
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "SummaryDay",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "PaymentWise") {
                var bill_title = "Date";
                var report_title = "Payment Wise"
                $($$("grdTransactions").allData()).each(function (i, item) {
                    var bill_date = item.bill_date;
                    if ($$("ddlViewMode").selectedValue() == "SummaryDay") {
                        bill_title = "Date";
                        bill_date = item.bill_date;
                        report_title = report_title + " - Summary Day";
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryMonth") {
                        bill_title = "Month";
                        bill_date = item.bill_date;
                        report_title = report_title + " - Summary Month";
                    }
                    else if ($$("ddlViewMode").selectedValue() == "SummaryYear") {
                        bill_title = "Year";
                        bill_date = item.bill_date;
                        report_title = report_title + " - Summary Year";
                    }
                    detail_list.push({
                        "Heading1": "Sl No",
                        "Data1": i + 1,
                        "Heading2": bill_title,
                        "Data2": bill_date,
                        "Heading3": "Pay Mode",
                        "Data3": item.pay_mode,
                        "Heading4": "Bill Amount",
                        "Data4": item.bill_amount,
                    });
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": report_title,
                            "SummaryHeading1": "Payment Amount",
                            "SummaryData1": parseFloat($$("lblTotalPaymentAmount").value()).toFixed(2),
                            "SummaryHeading2": "Cash",
                            "SummaryData2": parseFloat($$("lblTotalCashAmount").value()).toFixed(2),
                            "SummaryHeading3": "Card",
                            "SummaryData3": parseFloat($$("lblTotalCardAmount").value()).toFixed(2),
                            "SummaryHeading4": "Cheque",
                            "SummaryData4": parseFloat($$("lblTotalChequeAmount").value()).toFixed(2),
                            "SummaryHeading5": "",
                            "SummaryData5": "",
                            "SummaryHeading6": "",
                            "SummaryData6": "",
                            "SummaryHeading7": "",
                            "SummaryData7": "",
                            "SummaryHeading8": "",
                            "SummaryData8": "",
                            "SummaryHeading9": "",
                            "SummaryData9": "",
                            "SummaryHeading10": "",
                            "SummaryData10": "",
                            "SummaryHeading11": "",
                            "SummaryData11": "",
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Paymentwise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "OrderWise") {
                var report_title = "OrderWise";
                $($$("grdTransactions").allData()).each(function (i, item) {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Order Id",
                            "Data2": item.po_id,
                            "Heading3": "State",
                            "Data3": item.state_name,
                            "Heading4": "Supplier",
                            "Data4": item.vendor_name,
                            "Heading5": "Bill No",
                            "Data5": item.bill_code,
                            "Heading6": "Bill Amount",
                            "Data6": item.sub_total,
                            "Heading7": "GST",
                            "Data7": item.tax,
                            "Heading8": "Discount",
                            "Data8": item.discount,
                            "Heading9": "Net Amount",
                            "Data9": item.total,
                            "Heading10": "Paid",
                            "Data10": item.paid,
                            "Heading11": "Balance",
                            "Data11": item.balance,
                            "Heading12": "",
                            "Data12": "",
                            "Heading13": "",
                            "Data13": "",
                        });
                    }
                    else {
                        var day = "Date";
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            day = "Date";
                            report_title = "OrderWise - Summary Day";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            day = "Month";
                            report_title = "OrderWise - Summary Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            day = "Year";
                            report_title = "OrderWise - Summary Year";
                        }
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Orders",
                            "Data2": item.orders,
                            "Heading3": "State",
                            "Data3": item.state_name,
                            "Heading4": "Supplier",
                            "Data4": item.vendor_name,
                            "Heading5": day,
                            "Data5": item.ordered_date,
                            "Heading6": "Bill Amount",
                            "Data6": item.sub_total,
                            "Heading7": "GST",
                            "Data7": item.tax,
                            "Heading8": "Discount",
                            "Data8": item.discount,
                            "Heading9": "Net Amount",
                            "Data9": item.total,
                            "Heading10": "Paid",
                            "Data10": item.paid,
                            "Heading11": "Balance",
                            "Data11": item.balance,
                            "Heading12": "",
                            "Data12": "",
                            "Heading13": "",
                            "Data13": "",
                        });
                    }
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": report_title,
                            "SummaryHeading1": "Total Purchase",
                            "SummaryData1": parseFloat($$("lblTotalPurchase").value()).toFixed(2),
                            "SummaryHeading2": "Total Return",
                            "SummaryData2": parseFloat($$("lblTotalReturns").value()).toFixed(2),
                            "SummaryHeading3": "Purchase Payment",
                            "SummaryData3": parseFloat($$("lblTotalPayment").value()).toFixed(2),
                            "SummaryHeading4": "Return Payment",
                            "SummaryData4": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),
                            "SummaryHeading5": "Purchase Balance",
                            "SummaryData5": parseFloat($$("lblPurchaseBal").value()).toFixed(2),
                            "SummaryHeading6": "Return Balance",
                            "SummaryData6": parseFloat($$("lblReturnBal").value()).toFixed(2),
                            "SummaryHeading7": "Total Tax",
                            "SummaryData7": parseFloat($$("lblTotalTax").value()).toFixed(2),
                            "SummaryHeading8": "Total Discount",
                            "SummaryData8": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),
                            "SummaryHeading9": "Net Balance",
                            "SummaryData9": parseFloat($$("lblNetBalance").value()).toFixed(2),
                            "SummaryHeading10": "Net Purchase",
                            "SummaryData10": parseFloat($$("lblNetPurchase").value()).toFixed(2),
                            "SummaryHeading11": "Total Bills",
                            "SummaryData11": parseFloat($$("lblTotalBills").value()).toFixed(2),
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Orderwise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "ItemWise") {
                var report_title = "ItemWise";
                $($$("grdTransactions").allData()).each(function (i, item) {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Item No",
                            "Data2": item.item_code,
                            "Heading3": "Barcode",
                            "Data3": item.barcode,
                            "Heading4": "Item Name",
                            "Data4": item.item_name,
                            "Heading5": "Bill No",
                            "Data5": item.bill_code,
                            "Heading6": "Bill Date",
                            "Data6": item.bill_date,
                            "Heading7": "Bill Type",
                            "Data7": item.bill_type,
                            "Heading8": "Qty",
                            "Data8": item.qty,
                            "Heading9": "Buying Cost",
                            "Data9": item.cost,
                            "Heading10": "Selling Cost",
                            "Data10": item.price,
                            "Heading11": "",
                            "Data11": "",
                            "Heading12": "",
                            "Data12": "",
                            "Heading13": "",
                            "Data13": "",
                        });
                    }
                    else {
                        var day = "Date";
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            day = "Date";
                            report_title = "ItemWise - Summary Day";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            day = "Month";
                            report_title = "ItemWise - Summary Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            day = "Year";
                            report_title = "ItemWise - Summary Year";
                        }
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Item No",
                            "Data2": item.item_code,
                            "Heading3": "Barcode",
                            "Data3": item.barcode,
                            "Heading4": "Item Name",
                            "Data4": item.item_name,
                            "Heading5": day,
                            "Data5": item.bill_date,
                            "Heading6": "Qty",
                            "Data6": item.qty,
                            "Heading7": "Buying Cost",
                            "Data7": item.cost,
                            "Heading8": "Selling Cost",
                            "Data8": item.price,
                            "Heading9": "",
                            "Data9": "",
                            "Heading10": "",
                            "Data10": "",
                            "Heading11": "",
                            "Data11": "",
                            "Heading12": "",
                            "Data12": "",
                            "Heading13": "",
                            "Data13": "",
                        });
                    }
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": report_title,
                            "SummaryHeading1": "Total Qty",
                            "SummaryData1": parseFloat($$("lblTotalQty").value()).toFixed(2),
                            "SummaryHeading2": "Total Cost",
                            "SummaryData2": parseFloat($$("lblTotalBuyingCost").value()).toFixed(2),
                            "SummaryHeading3": "Total Net Rate",
                            "SummaryData3": parseFloat($$("lblTotalNetRate").value()).toFixed(2),
                            "SummaryHeading4": "",
                            "SummaryData4": "",
                            "SummaryHeading5": "",
                            "SummaryData5": "",
                            "SummaryHeading6": "",
                            "SummaryData6": "",
                            "SummaryHeading7": "",
                            "SummaryData7": "",
                            "SummaryHeading8": "",
                            "SummaryData8": "",
                            "SummaryHeading9": "",
                            "SummaryData9": "",
                            "SummaryHeading10": "",
                            "SummaryData10": "",
                            "SummaryHeading11": "",
                            "SummaryData11": "",
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Itemwise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "StoreWise") {
                var bill_title = "Date";
                var report_title = "StoreWise"
                var bill_date = "";
                $($$("grdTransactions").allData()).each(function (i, item) {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Store",
                            "Data2": item.store_name,
                            "Heading3": "Total Bills",
                            "Data3": item.bills,
                            "Heading4": "Total Purchase",
                            "Data4": item.total_Purchases,
                            "Heading5": "Total Purchase Payment",
                            "Data5": item.total_Purchases_payment,
                            "Heading6": "Purchase Balance",
                            "Data6": item.Purchases_balance,
                            "Heading7": "Total Return",
                            "Data7": item.total_return,
                            "Heading8": "Total Return Payment",
                            "Data8": item.total_return_payment,
                            "Heading9": "Return Balance",
                            "Data9": item.return_balance,
                            "Heading10": "Total Tax",
                            "Data10": item.tax,
                            "Heading11": "Total Discount",
                            "Data11": item.discount,
                            "Heading12": "Net Amount",
                            "Data12": item.net_Purchases,
                        });
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            bill_title = "Date";
                            report_title = "StoreWise - Summary Day";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            bill_title = "Month";
                            report_title = "StoreWise - Summary Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            bill_title = "Year";
                            report_title = "StoreWise - Summary Year";
                        }
                        else {
                            bill_date = item.bills;
                        }
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": bill_title,
                            "Data2": item.bill_date,
                            "Heading3": "Store",
                            "Data3": item.store_name,
                            "Heading4": "Total Bills",
                            "Data4": item.bills,
                            "Heading5": "Total Purchase",
                            "Data5": item.total_Purchases,
                            "Heading6": "Total Purchase Payment",
                            "Data6": item.total_Purchases_payment,
                            "Heading7": "Total Return",
                            "Data7": item.total_return,
                            "Heading8": "Total Return Payment",
                            "Data8": item.total_return_payment,
                            "Heading9": "Total Discount",
                            "Data9": item.discount,
                            "Heading10": "Total Tax",
                            "Data10": item.tax,
                            "Heading11": "Net Amount",
                            "Data11": item.net_Purchases,
                            "Heading12": "",
                            "Data12": "",
                        });
                    }
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": report_title,
                            "SummaryHeading1": "Total Purchase",
                            "SummaryData1": parseFloat($$("lblTotalPurchase").value()).toFixed(2),
                            "SummaryHeading2": "Total Return",
                            "SummaryData2": parseFloat($$("lblTotalReturns").value()).toFixed(2),
                            "SummaryHeading3": "Purchase Payment",
                            "SummaryData3": parseFloat($$("lblTotalPayment").value()).toFixed(2),
                            "SummaryHeading4": "Return Payment",
                            "SummaryData4": parseFloat($$("lblTotalReturnsPayment").value()).toFixed(2),
                            "SummaryHeading5": "Purchase Balance",
                            "SummaryData5": parseFloat($$("lblPurchaseBal").value()).toFixed(2),
                            "SummaryHeading6": "Return Balance",
                            "SummaryData6": parseFloat($$("lblReturnBal").value()).toFixed(2),
                            "SummaryHeading7": "Total Tax",
                            "SummaryData7": parseFloat($$("lblTotalTax").value()).toFixed(2),
                            "SummaryHeading8": "Total Discount",
                            "SummaryData8": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),
                            "SummaryHeading9": "Net Balance",
                            "SummaryData9": parseFloat($$("lblNetBalance").value()).toFixed(2),
                            "SummaryHeading10": "Net Amount",
                            "SummaryData10": parseFloat($$("lblNetAmt").value()).toFixed(2),
                            "SummaryHeading11": "Total Bills",
                            "SummaryData11": parseFloat($$("lblTotalBills").value()).toFixed(2),
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Storewise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "BillItemwise") {
                var last_bill_no = "",heading = "";
                $($$("grdTransactions").allData()).each(function (i, item) {
                    if (last_bill_no != item.bill_no && item.bill_no != undefined && item.bill_no != null && item.bill_no != "") {
                        item.bill_no = item.bill_no == null ? "" : item.bill_no;
                        item.bill_date = item.bill_date == null ? "" : item.bill_date;
                        item.bill_type = item.bill_type == null ? "" : item.bill_type;
                        item.vendor_no = item.vendor_no == null ? "" : item.vendor_no;
                        item.vendor_name = item.vendor_name == null ? "" : item.vendor_name;
                        item.gst_no = item.gst_no == null ? "" : item.gst_no;
                        item.vendor_address = item.vendor_address == null ? "" : item.vendor_address;
                        heading = "Bill No : " + item.bill_code + " Bill Date : " + item.bill_date + " Invoice No : " + item.invoice_no + " Bill Amount : " + item.total + " Vendor Name : " + item.vendor_name + " GST : " + item.gst_no + " Vendor Address : " + item.vendor_address + " Vendor Mobile : " + item.mobile_no;
                    }
                    detail_list.push({
                        "Heading": heading,
                        "Heading1": "Sl No",
                        "Data1": i + 1,
                        "Heading2": "Item No",
                        "Data2": item.item_code,
                        "Heading3": "Item Name",
                        "Data3": item.item_name,
                        "Heading4": "Qty",
                        "Data4": item.qty,
                        "Heading5": "Sub Total",
                        "Data5": item.sub_total,
                        "Heading6": "GST",
                        "Data6": item.tax,
                        "Heading7": "Discount",
                        "Data7": item.discount,
                        "Heading8": "Net Amount",
                        "Data8": item.total_price,
                        "Heading9": "",
                        "Data9": "",
                        "Heading10": "",
                        "Data10": "",
                        "Heading11": "",
                        "Data11": "",
                        "Heading12": "",
                        "Data12": "",
                    });
                    last_bill_no = item.bill_no
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": "InvoiceWise Report",
                            "SummaryHeading1": "Total Purchase",
                            "SummaryData1": parseFloat($$("lblTotalPurchase").value()).toFixed(2),
                            "SummaryHeading2": "Total Return",
                            "SummaryData2": parseFloat($$("lblTotalReturns").value()).toFixed(2),
                            "SummaryHeading3": "Total Tax",
                            "SummaryData3": parseFloat($$("lblTotalTax").value()).toFixed(2),
                            "SummaryHeading4": "Total Discount",
                            "SummaryData4": parseFloat($$("lblPaymentDiscount").value()).toFixed(2),
                            "SummaryHeading5": "Total Bills",
                            "SummaryData5": parseFloat($$("lblTotalBills").value()).toFixed(2),
                            "SummaryHeading6": "Net Purchase",
                            "SummaryData6": parseFloat($$("lblNetPurchase").value()).toFixed(2),
                            "SummaryHeading7": "",
                            "SummaryData7": "",
                            "SummaryHeading8": "",
                            "SummaryData8": "",
                            "SummaryHeading9": "",
                            "SummaryData9": "",
                            "SummaryHeading10": "",
                            "SummaryData10": "",
                            "SummaryHeading11": "",
                            "SummaryData11": "",
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Invoicerwise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedValue() == "Attributewise") {
                var report_title = "AttributeWise";
                $($$("grdTransactions").allData()).each(function (i, item) {
                    detail_list.push({
                        "Heading1": "Sl No",
                        "Data1": i + 1,
                        "Heading2": "Item No",
                        "Data2": item.item_code,
                        "Heading3": "Barcode",
                        "Data3": item.barcode,
                        "Heading4": "Item Name",
                        "Data4": item.item_name,
                        "Heading5": "Bill No",
                        "Data5": item.bill_code,
                        "Heading6": "Bill Date",
                        "Data6": item.bill_date,
                        "Heading7": "Bill Type",
                        "Data7": item.bill_type,
                        "Heading8": "Qty",
                        "Data8": item.qty,
                        "Heading9": "Buying Cost",
                        "Data9": item.cost,
                        "Heading10": "Selling Cost",
                        "Data10": item.price,
                        "Heading11": "MRP",
                        "Data11": item.mrp,
                        "Heading12": "",
                        "Data12": "",
                        "Heading13": "",
                        "Data13": "",
                    });
                });
                var accountInfo =
                        {
                            "CompName": CONTEXT.COMPANY_NAME,
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                            "ReportName": report_title,
                            "SummaryHeading1": "Total Qty",
                            "SummaryData1": parseFloat($$("lblTotalQty").value()).toFixed(2),
                            "SummaryHeading2": "Total Cost",
                            "SummaryData2": parseFloat($$("lblTotalBuyingCost").value()).toFixed(2),
                            "SummaryHeading3": "Total Net Rate",
                            "SummaryData3": parseFloat($$("lblTotalNetRate").value()).toFixed(2),
                            "SummaryHeading4": "",
                            "SummaryData4": "",
                            "SummaryHeading5": "",
                            "SummaryData5": "",
                            "SummaryHeading6": "",
                            "SummaryData6": "",
                            "SummaryHeading7": "",
                            "SummaryData7": "",
                            "SummaryHeading8": "",
                            "SummaryData8": "",
                            "SummaryHeading9": "",
                            "SummaryData9": "",
                            "SummaryHeading10": "",
                            "SummaryData10": "",
                            "SummaryHeading11": "",
                            "SummaryData11": "",
                            "SummaryHeading12": "",
                            "SummaryData12": "",
                            "report": "Itemwise",
                            "Details": detail_list
                        };
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                    $$("pnlPrintingPopup").close();
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                if ($$("ddlSummaryFilter").selectedValue() == "0") {
                    var report_title = "Machine Wise";
                    $($$("grdTransactions").allData()).each(function (i, item) {
                        detail_list.push({
                            "Heading1": "Sl No",
                            "Data1": i + 1,
                            "Heading2": "Register",
                            "Data2": item.reg_name,
                            "Heading3": "User",
                            "Data3": item.user_name,
                            "Heading4": "Bill No",
                            "Data4": item.bill_code,
                            "Heading5": "Bill Type",
                            "Data5": item.bill_type,
                            "Heading6": "Qty",
                            "Data6": item.qty,
                            "Heading7": "Bill Amount",
                            "Data7": item.total,
                            "Heading8": "",
                            "Data8": "",
                            "Heading9": "",
                            "Data9": "",
                            "Heading10": "",
                            "Data10": "",
                            "Heading11": "",
                            "Data11": "",
                            "Heading12": "",
                            "Data12": "",
                            "Heading13": "",
                            "Data13": "",
                        });
                    });
                    var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "ReportName": report_title,
                                "SummaryHeading1": "Total Bills",
                                "SummaryData1": parseInt($$("lblTotalBills").value()),
                                "SummaryHeading2": "Total Bill Amount",
                                "SummaryData2": parseFloat($$("lblTotalPaymentAmount").value()).toFixed(2),
                                "SummaryHeading3": "Total Qty",
                                "SummaryData3": parseFloat($$("lblTotalQty").value()).toFixed(2),
                                "SummaryHeading4": "",
                                "SummaryData4": "",
                                "SummaryHeading5": "",
                                "SummaryData5": "",
                                "SummaryHeading6": "",
                                "SummaryData6": "",
                                "SummaryHeading7": "",
                                "SummaryData7": "",
                                "SummaryHeading8": "",
                                "SummaryData8": "",
                                "SummaryHeading9": "",
                                "SummaryData9": "",
                                "SummaryHeading10": "",
                                "SummaryData10": "",
                                "SummaryHeading11": "",
                                "SummaryData11": "",
                                "SummaryHeading12": "",
                                "SummaryData12": "",
                                "report": "Itemwise",
                                "Details": detail_list
                            };
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                        $$("pnlPrintingPopup").close();
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
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
                        var report_title = "AttributeWise";
                        $($$("grdTransactions").allData()).each(function (i, item) {
                            detail_list.push({
                                "Heading1": "Sl No",
                                "Data1": i + 1,
                                "Heading2": "Register",
                                "Data2": item.reg_name,
                                "Heading3": "User",
                                "Data3": item.user_name,
                                "Heading4": day,
                                "Data4": item.bill_date,
                                "Heading5": "Bills",
                                "Data5": item.bills,
                                "Heading6": "Bill Type",
                                "Data6": item.bill_type,
                                "Heading7": "Qty",
                                "Data7": item.qty,
                                "Heading8": "Bill Amount",
                                "Data8": item.total,
                                "Heading9": "",
                                "Data9": "",
                                "Heading10": "",
                                "Data10": "",
                                "Heading11": "",
                                "Data11": "",
                                "Heading12": "",
                                "Data12": "",
                                "Heading13": "",
                                "Data13": "",
                            });
                        });
                        var accountInfo =
                            {
                                "CompName": CONTEXT.COMPANY_NAME,
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                "ReportName": report_title,
                                "SummaryHeading1": "Total Bills",
                                "SummaryData1": parseInt($$("lblTotalBills").value()),
                                "SummaryHeading2": "Total Bill Amount",
                                "SummaryData2": parseFloat($$("lblTotalPaymentAmount").value()).toFixed(2),
                                "SummaryHeading3": "Total Qty",
                                "SummaryData3": parseFloat($$("lblTotalQty").value()).toFixed(2),
                                "SummaryHeading4": "",
                                "SummaryData4": "",
                                "SummaryHeading5": "",
                                "SummaryData5": "",
                                "SummaryHeading6": "",
                                "SummaryData6": "",
                                "SummaryHeading7": "",
                                "SummaryData7": "",
                                "SummaryHeading8": "",
                                "SummaryData8": "",
                                "SummaryHeading9": "",
                                "SummaryData9": "",
                                "SummaryHeading10": "",
                                "SummaryData10": "",
                                "SummaryHeading11": "",
                                "SummaryData11": "",
                                "SummaryHeading12": "",
                                "SummaryData12": "",
                                "report": "Itemwise",
                                "Details": detail_list
                            };
                        GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-report.jrxml", accountInfo, $$("ddlExportType").selectedValue(), function (responseData) {
                            $$("pnlPrintingPopup").close();
                            $$("pnlBillViewPopup").open();
                            $$("pnlBillViewPopup").title("Bill View");
                            $$("pnlBillViewPopup").rlabel("Bill View");
                            $$("pnlBillViewPopup").width("1000");
                            $$("pnlBillViewPopup").height("600");
                            $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                        });
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
