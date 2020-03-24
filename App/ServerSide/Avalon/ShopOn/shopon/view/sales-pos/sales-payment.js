$.fn.salesPayment = function () {

    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/sales-pos/sales-payment.html");

        page.billService = new BillService();
        page.accService = new AccountingService();
        page.salesService = new SalesService();
        page.finfactsEntry = new FinfactsEntry();

        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.settingService = new SettingService();
        page.finfactsService = new FinfactsService();
        page.rewardService = new RewardService();
        page.stockAPI = new StockAPI();
        page.salesExecutiveRewardService = new SalesExecutiveRewardService();
        page.expenseBillService = new BillExpenseService();
        page.invoiceService = new InvoiceService();
        page.stockService = new StockService();
        page.billScheduleAPI = new BillScheduleAPI();

        page.customerAPI = new CustomerAPI();
        page.customerrewardAPI = new CustomerRewardAPI();
        page.billAPI = new BillAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.billPaymentAPI = new BillPaymentAPI();
        page.billPayTransactionAPI = new BillPayTransactionAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.rewardplanAPI = new RewardPlanAPI();
        page.salesExecutiveRewardPlanAPI = new SalesExecutiveRewardPlanAPI();
        page.salesexecutiverewardAPI = new SalesExecutiveRewardAPI();
        page.SubscriptionPlanAPI = new SubscriptionPlanAPI();
        page.reportAPI = new ReportAPI();

        $(page.selectedObject).keydown(function (event) {
            if (event.keyCode == 120) {
                $$("txtPendingPaymentDiscount").selectedObject.focus().select();
            }
            if (event.keyCode == 35) {
                page.events.btnPayPending_click();
            }
        });
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        var $inputSearchBillNo = $("[controlid=txtSearchBillNo]");
        var $inputPendingDiscuount = $("[controlid=txtPendingPaymentDiscount]");
        var $inputReceivedAmount = $("[controlid=txtReceivedAmount]");
        $inputSearchBillNo.on('keydown', function (e) {
            if (e.which == 32) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { $$("txtReceivedAmount").selectedObject.focus().select(); $$("txtSearchBillNo").value(""); }, doneTypingInterval);
            }
        });
        $inputPendingDiscuount.on('keydown', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { $$("txtReceivedAmount").selectedObject.focus().select(); }, doneTypingInterval);
            }
            else if ($$("txtPendingPaymentDiscount").value() == "" || $$("txtPendingPaymentDiscount").value() == null || typeof $$("txtPendingPaymentDiscount").value() == "undefined" || parseFloat($$("txtPendingPaymentDiscount").value()) < 0) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(donePendingDiscount, doneTypingInterval);
            }
            else {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(donePendingDiscount, doneTypingInterval);
            }
        });
        $inputPendingDiscuount.on('keyup', function (e) {
            if ($$("txtPendingPaymentDiscount").value() == "" || $$("txtPendingPaymentDiscount").value() == " ") {
                $$("pnlDiscountAlert").hide();
            }
            else {
                if (parseFloat($$("txtPendingPaymentDiscount").value()) != 0)
                    $$("pnlDiscountAlert").show();
                else
                    $$("pnlDiscountAlert").hide();
            }
        });
        $inputReceivedAmount.on('keyup', function (e) {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(donePaymentBalance, doneTypingInterval);
        });
        $inputReceivedAmount.on('focusout', function (e) {
            if (parseFloat($$("txtReceivedAmount").value()) < parseFloat($$("lblTotalAmount").value())) {
                alert("Please Change Amount For Appropriate Bill In The Grid");
                $$("txtReceivedAmount").value($$("lblTotalAmount").value());
                $$("lblPaymentBalance").value("0.00");
                if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                    $$("lblCustomerBalance").html("Return From Customer");
                }
                else {
                    $$("lblCustomerBalance").html("Return To Customer");
                }
            }
        });
        function donePendingDiscount() {
            var discount = 0;
            if ($$("txtPendingPaymentDiscount").value().startsWith("%")) {
                discount = (parseFloat($$("lblTotalAmount").value()) * parseFloat($$("txtPendingPaymentDiscount").value().substring(1, $$("txtPendingPaymentDiscount").value().length))) / 100;
            }
            else
                discount = $$("txtPendingPaymentDiscount").value();
            if (discount == "" || typeof discount == "undefined" || discount == null || isNaN(discount))
                discount = 0;
            page.discount = discount;
            $$("lblTotalAmount").value(parseFloat(parseFloat($$("lblTotalPendingAmount").value() - parseFloat(discount))).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            $$("txtReceivedAmount").value(parseFloat($$("lblTotalAmount").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            donePaymentBalance();
        }
        function donePaymentBalance() {
            $$("lblPaymentBalance").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                $$("lblCustomerBalance").html("Return From Customer");
            }
            else {
                $$("lblCustomerBalance").html("Return To Customer");
            }
        }

        page.interface.createPending = function () {
        }
        page.interface.focus = function (outsidefilter) {
            //page.events.page_load();
            $$("txtSearchBillNo").focus();
            if (typeof outsidefilter != "undefined") {
                page.events.btnSearchBill_click(outsidefilter);
            }
            page.view.selectedPendingPayment([]);
            //setTimeout(function () {
            //    page.view.selectedPendingPayment([]);
            //}, 1000);
        }

        page.events.page_load = function () {
            $$("lblTotalAmount").value("0");
            $$("lblTotalPendingAmount").value(0);
            $$("txtReceivedAmount").value("0");
            $$("lblPaymentBalance").value("0.00");
            if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                $$("lblCustomerBalance").html("Return From Customer");
            }
            else {
                $$("lblCustomerBalance").html("Return To Customer");
            }
            $$("txtPendingPaymentDiscount").value("0");
            $$("txtChequeNo").value("");
            $$("txtChequeBank").value("");
            $$("txtReceivedAmount").disable(false);
            $$("btnPayPending").disable(false);
            $$("btnPayPending").show();
            page.discount = 0;
            $("br").css("display", "none");
            page.view.selectedPendingPayment([]);
            $$("pnlCardType").hide();
            $$("pnlCouponNo").hide();
            $$("pnlCardNo").hide();
            $$("pnlChequeNo").hide();
            $$("pnlChequeBank").hide();
            $$("pnlChequeDate").hide();
            $$("txtSearchBillNo").value("");
            $$("txtSearchBillNo").focus();
            $$("ddlBillView").selectedValue("Bill View");
            $$("ddlPayBillType").selectedValue("Select");
            $$("ddlPayMode").selectedValue("Cash");
            if (CONTEXT.ENABLE_CASHIER_BILL) {
                $$("chkPrintBill").prop('checked', true);
            }
            else {
                $$("chkPrintBill").prop('checked', false);
            }

            page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                $$("ddlCustName").dataBind(data, "cust_no", "cust_name", "All");
            });

            $$("txtPendingPayDesc").value("CurrentBill");
            $$("dsPendingPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
            $$("dsChequeDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

            $$("ddlCustName").selectionChange(function () {
                $$("ddlBillView").selectedValue("Bill View");
            });

            $$("ddlBillView").selectionChange(function () {
                $$("lblTotalAmount").value("0");
                $$("lblTotalPendingAmount").value(0);
                $$("txtReceivedAmount").value("0");
                $$("lblPaymentBalance").value("0.00");
                if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                    $$("lblCustomerBalance").html("Return From Customer");
                }
                else {
                    $$("lblCustomerBalance").html("Return To Customer");
                }
                $$("txtPendingPaymentDiscount").value("0");
                $$("lblBillAmount").html("0");
                $$("lblBillAmountBalance").html("0");
                $$("lblBillAmountPaid").html("0");
                var loan_data = {};
                loan_data.cust_no = $$("ddlCustName").selectedValue();
                loan_data.bill_type = $$("ddlPayBillType").selectedValue();

                if ($$("ddlBillView").selectedValue() == "Payment View") {
                    $$("pnlPendingReceivedAmount").hide();
                    $$("pnlPendingPayButton").hide();
                    $$("pnlPendingPaidAmount").hide();
                    var loan_data = {};
                    loan_data.cust_no = $$("ddlCustName").selectedValue();
                    loan_data.bill_type = $$("ddlPayBillType").selectedValue();
                    var filter = "";
                    var bill_code = ($$("txtSearchBillNo").value().indexOf('-') > -1) ? true : false;
                    if (bill_code) {
                        bill_code = $$("txtSearchBillNo").value();
                    }
                    else {
                        var today = new Date();
                        var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                        bill_code = today.getFullYear() + "" + month + "-" + $$("txtSearchBillNo").value();
                    }
                    if ($$("ddlPayBillType").selectedValue() != "Select") {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "bill_type like '" + $$("ddlPayBillType").selectedValue() + "'";
                    }
                    if ($$("ddlCustName").selectedValue() != -1) {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "cust_no = " + $$("ddlCustName").selectedValue();
                    }
                    if ($$("txtSearchBillNo").value() != "") {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "bill_code like '" + bill_code + "'";
                    }
                    page.billPaymentAPI.searchValues("", "", filter, "", function (data) {
                        page.view.selectedPendingPayment(data);
                        page.controls.grdPendingPayment.edit(false);
                    });
                }
                else {
                    $$("pnlPendingReceivedAmount").show();
                    $$("pnlPendingPayButton").show();
                    $$("pnlPendingPaidAmount").show();
                    try {
                        var str = $$("txtSearchBillNo").value();
                        if (str.startsWith("000")) {
                            str = ((str.substring(0, str.length - 1)));
                            str = str.substring(3);
                            //    //str = (parseInt(str.substring(0, str.length)));
                        }
                        else if (str.startsWith("00")) {
                            str = ((str.substring(0, str.length - 1)));
                            str = str.substring(2);
                        }
                        $$("txtSearchBillNo").value(str);
                        var bill_code = ($$("txtSearchBillNo").value().indexOf('-') > -1) ? true : false;
                        if (bill_code) {
                            bill_code = $$("txtSearchBillNo").value();
                        }
                        else {
                            var today = new Date();
                            var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                            bill_code = today.getFullYear() + "" + month + "-" + $$("txtSearchBillNo").value();
                        }
                        var filter = "ifnull(b.pay_mode,'') <> 'EMI' and b.so_no is null";
                        if ($$("ddlPayBillType").selectedValue() != "Select") {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "b.bill_type like '" + $$("ddlPayBillType").selectedValue() + "'";
                        }
                        if ($$("ddlCustName").selectedValue() != -1) {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "b.cust_no = " + $$("ddlCustName").selectedValue();
                        }
                        if ($$("txtSearchBillNo").value() != "") {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "b.bill_code like '" + bill_code + "'";
                        }
                        if (filter != "ifnull(b.pay_mode,'') <> 'EMI' and b.so_no is null")
                        page.billAPI.searchValues("", "", filter, "", function (data) {
                            var payment_data = [];
                            $(data).each(function (i, item) {
                                if (parseFloat(item.balance) != 0) {
                                    if (item.so_no == null) {
                                        payment_data.push({
                                            bill_no: item.bill_no,
                                            bill_id: item.bill_id,
                                            bill_code: item.bill_code,
                                            bill_date: item.bill_date,
                                            bill_type: item.bill_type,
                                            cust_no: item.cust_no,
                                            cust_name: item.cust_name,
                                            total: item.total,
                                            total_paid_amount: item.paid,
                                            expense_amt: item.expense,
                                            balance: parseFloat(item.total) - parseFloat(item.paid),
                                            sch_id: item.sch_id,
                                            due_date: item.due_date
                                        })
                                    }
                                }
                            });
                            //if (payment_data.length != 0) {
                            //    var rows = page.controls.grdPendingPayment.getRow({
                            //        bill_no: payment_data[0].bill_no
                            //    });
                            //    if (rows.length == 0) {
                            //        page.controls.grdPendingPayment.createRow(payment_data[0]);
                            //        page.controls.grdPendingPayment.edit(true);
                            //    }
                            //    else {
                            //        page.view.selectedPendingPayment([]);
                            //    }
                            //}
                            //else {
                            //    //alert("Incorrect Bill No Or No Balance");
                            //}
                            page.view.selectedPendingPayment(payment_data);
                        });
                    }
                    catch (e) {

                    }
                    //var filter = {};
                    //filter.viewMode = "Standard";
                    //filter.fromDate = "";
                    //filter.toDate = "";
                    //filter.bill_type = $$("ddlPayBillType").selectedValue();
                    //filter.item_no = "";
                    //filter.status = "";
                    //filter.cust_no = $$("ddlCustName").selectedValue();
                    //var payment_data = [];
                    //if (filter.cust_no == "" || filter.cust_no == "-1") {
                    //    page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "'", "", function (data) {
                    //        $(data).each(function (i, item) {
                    //            if (parseFloat(item.total) != parseFloat(item.paid)) {
                    //                payment_data.push({
                    //                    bill_no: item.bill_no,
                    //                    bill_id: item.bill_id,
                    //                    bill_code: item.bill_code,
                    //                    bill_date: item.bill_date,
                    //                    bill_type: item.bill_type,
                    //                    cust_no: item.cust_no,
                    //                    cust_name: item.cust_name,
                    //                    total: item.total,
                    //                    total_paid_amount: item.paid,
                    //                    expense_amt: item.expense,
                    //                    balance: parseFloat(item.total) - parseFloat(item.paid),
                    //                    sch_id: item.sch_id,
                    //                    due_date: item.due_date
                    //                })
                    //            }
                    //        })
                    //        page.view.selectedPendingPayment(payment_data);
                    //    });
                    //}
                    //else {
                    //    page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "' and ifnull(b.cust_no,'')=" + filter.cust_no, "", function (data) {
                    //        $(data).each(function (i, item) {
                    //            if (parseFloat(item.total) != parseFloat(item.paid)) {
                    //                payment_data.push({
                    //                    bill_no: item.bill_no,
                    //                    bill_id: item.bill_id,
                    //                    bill_code: item.bill_code,
                    //                    bill_date: item.bill_date,
                    //                    bill_type: item.bill_type,
                    //                    cust_no: item.cust_no,
                    //                    cust_name: item.cust_name,
                    //                    total: item.total,
                    //                    total_paid_amount: item.paid,
                    //                    expense_amt: item.expense,
                    //                    balance: parseFloat(item.total) - parseFloat(item.paid),
                    //                    sch_id: item.sch_id,
                    //                    due_date: item.due_date
                    //                })
                    //            }
                    //        })
                    //        page.view.selectedPendingPayment(payment_data);
                    //    });
                    //}
                }
            });
            $$("ddlPayBillType").selectionChange(function () {
                $$("lblTotalAmount").value(parseFloat(0));
                $$("lblTotalPendingAmount").value(0);
                $$("txtReceivedAmount").value(parseFloat(0));
                $$("lblPaymentBalance").value("0.00");
                if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                    $$("lblCustomerBalance").html("Return From Customer");
                }
                else {
                    $$("lblCustomerBalance").html("Return To Customer");
                }
                $$("lblBillAmount").html("0");
                $$("lblBillAmountBalance").html("0");
                $$("lblBillAmountPaid").html("0");
                //Get the all bill details
                //var filter = {};
                //filter.viewMode = "Standard";
                //filter.fromDate = "";
                //filter.toDate = "";
                //filter.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();
                //filter.item_no = "";
                //filter.status = "";
                //filter.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                //var payment_data = [];
                //if (filter.cust_no == "" || filter.cust_no == "-1") {
                //    page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "'", "", function (data) {
                //        $(data).each(function (i, item) {
                //            if (parseFloat(item.total) != parseFloat(item.paid)) {
                //                payment_data.push({
                //                    bill_no: item.bill_no,
                //                    bill_id: item.bill_id,
                //                    bill_code: item.bill_code,
                //                    bill_date: item.bill_date,
                //                    bill_type: item.bill_type,
                //                    cust_no: item.cust_no,
                //                    cust_name: item.cust_name,
                //                    total: item.total,
                //                    total_paid_amount: item.paid,
                //                    expense_amt: item.expense,
                //                    balance: parseFloat(item.total) - parseFloat(item.paid),
                //                    sch_id: item.sch_id,
                //                    due_date: item.due_date
                //                })
                //            }
                //        })
                //        page.view.selectedPendingPayment(payment_data);
                //    });
                //}
                //else {
                //    page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "' and ifnull(b.cust_no,'')=" + filter.cust_no, "", function (data) {
                //        $(data).each(function (i, item) {
                //            if (parseFloat(item.total) != parseFloat(item.paid)) {
                //                payment_data.push({
                //                    bill_no: item.bill_no,
                //                    bill_id: item.bill_id,
                //                    bill_code: item.bill_code,
                //                    bill_date: item.bill_date,
                //                    bill_type: item.bill_type,
                //                    cust_no: item.cust_no,
                //                    cust_name: item.cust_name,
                //                    total: item.total,
                //                    total_paid_amount: item.paid,
                //                    expense_amt: item.expense,
                //                    balance: parseFloat(item.total) - parseFloat(item.paid),
                //                    sch_id: item.sch_id,
                //                    due_date: item.due_date
                //                })
                //            }
                //        })
                //        page.view.selectedPendingPayment(payment_data);
                //    });
                //}
                try {
                    if ($$("ddlBillView").selectedValue() == "Payment View") {
                        $$("pnlPendingReceivedAmount").hide();
                        $$("pnlPendingPayButton").hide();
                        $$("pnlPendingPaidAmount").hide();
                        var loan_data = {};
                        loan_data.cust_no = $$("ddlCustName").selectedValue();
                        loan_data.bill_type = $$("ddlPayBillType").selectedValue();
                        var filter = "";
                        var bill_code = ($$("txtSearchBillNo").value().indexOf('-') > -1) ? true : false;
                        if (bill_code) {
                            bill_code = $$("txtSearchBillNo").value();
                        }
                        else {
                            var today = new Date();
                            var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                            bill_code = today.getFullYear() + "" + month + "-" + $$("txtSearchBillNo").value();
                        }
                        if ($$("ddlPayBillType").selectedValue() != "Select") {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "bill_type like '" + $$("ddlPayBillType").selectedValue() + "'";
                        }
                        if ($$("ddlCustName").selectedValue() != -1) {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "cust_no = " + $$("ddlCustName").selectedValue();
                        }
                        if ($$("txtSearchBillNo").value() != "") {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "bill_code like '" + bill_code + "'";
                        }
                        page.billPaymentAPI.searchValues("", "", filter, "", function (data) {
                            page.view.selectedPendingPayment(data);
                            page.controls.grdPendingPayment.edit(false);
                        });
                    }
                    else {
                        var str = $$("txtSearchBillNo").value();
                        if (str.startsWith("000")) {
                            str = ((str.substring(0, str.length - 1)));
                            str = str.substring(3);
                            //    //str = (parseInt(str.substring(0, str.length)));
                        }
                        else if (str.startsWith("00")) {
                            str = ((str.substring(0, str.length - 1)));
                            str = str.substring(2);
                        }
                        $$("txtSearchBillNo").value(str);
                        var bill_code = ($$("txtSearchBillNo").value().indexOf('-') > -1) ? true : false;
                        if (bill_code) {
                            bill_code = $$("txtSearchBillNo").value();
                        }
                        else {
                            var today = new Date();
                            var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                            bill_code = today.getFullYear() + "" + month + "-" + $$("txtSearchBillNo").value();
                        }
                        var filter = "ifnull(b.pay_mode,'') <> 'EMI' and b.so_no is null";
                        if ($$("ddlPayBillType").selectedValue() != "Select") {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "b.bill_type like '" + $$("ddlPayBillType").selectedValue() + "'";
                        }
                        if ($$("ddlCustName").selectedValue() != -1) {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "b.cust_no = " + $$("ddlCustName").selectedValue();
                        }
                        if ($$("txtSearchBillNo").value() != "") {
                            filter = (filter == "") ? filter : filter + " and ";
                            filter = filter + "b.bill_code like '" + bill_code + "'";
                        }
                        if (filter != "ifnull(b.pay_mode,'') <> 'EMI' and b.so_no is null")
                            page.billAPI.searchValues("", "", filter, "", function (data) {
                                var payment_data = [];
                                $(data).each(function (i, item) {
                                    if (parseFloat(item.balance) != 0) {
                                        if (item.so_no == null) {
                                            payment_data.push({
                                                bill_no: item.bill_no,
                                                bill_id: item.bill_id,
                                                bill_code: item.bill_code,
                                                bill_date: item.bill_date,
                                                bill_type: item.bill_type,
                                                cust_no: item.cust_no,
                                                cust_name: item.cust_name,
                                                total: item.total,
                                                total_paid_amount: item.paid,
                                                expense_amt: item.expense,
                                                balance: parseFloat(item.total) - parseFloat(item.paid),
                                                sch_id: item.sch_id,
                                                due_date: item.due_date
                                            })
                                        }
                                    }
                                });
                                //if (payment_data.length != 0) {
                                //    page.view.selectedPendingPayment(payment_data);
                                //    //var rows = page.controls.grdPendingPayment.getRow({
                                //    //    bill_no: payment_data[0].bill_no
                                //    //});
                                //    //if (rows.length == 0) {
                                //    //    page.controls.grdPendingPayment.createRow(payment_data[0]);
                                //    //    page.controls.grdPendingPayment.edit(true);
                                //    //}
                                //    //else {
                                //    //    //alert("This Bill Is Already Scanned");
                                //    //}
                                //}
                                //else {
                                //    page.view.selectedPendingPayment([]);
                                //}
                                page.view.selectedPendingPayment(payment_data);
                            });
                    }
                }
                catch (e) {

                }
            })

            $$("ddlPayMode").selectionChange(function () {
                $$("txtCardNo").value("");
                $$("txtCouponNo").value("");
                $$("txtChequeNo").value("");
                $$("txtChequeBank").value("");
                $$("txtChequeNo").value("");
                $$("dsChequeDate").setDate(dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())));
                if ($$("ddlPayMode").selectedValue() == "Cash") {
                    $$("pnlCardType").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlCouponNo").hide();
                    $$("pnlChequeNo").hide();
                    $$("pnlChequeBank").hide();
                    $$("pnlChequeDate").hide();
                }
                if ($$("ddlPayMode").selectedValue() == "Card") {
                    $$("pnlCardType").hide();
                    $$("pnlCouponNo").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlChequeNo").hide();
                    $$("pnlChequeBank").hide();
                    $$("pnlChequeDate").hide();
                }
                if ($$("ddlPayMode").selectedValue() == "Coupon") {
                    $$("pnlCardType").hide();
                    $$("pnlCouponNo").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlChequeNo").hide();
                    $$("pnlChequeBank").hide();
                    $$("pnlChequeDate").hide();
                }
                if ($$("ddlPayMode").selectedValue() == "Cheque") {
                    $$("pnlCardType").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlCouponNo").hide();
                    $$("pnlChequeNo").show();
                    $$("pnlChequeBank").show();
                    $$("pnlChequeDate").show();
                }
                if ($$("ddlPayMode").selectedValue() == "Net Bank") {
                    $$("pnlCardType").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlCouponNo").hide();
                    $$("pnlChequeNo").hide();
                    $$("pnlChequeBank").hide();
                    $$("pnlChequeDate").hide();
                }
                if ($$("ddlPayMode").selectedValue() == "Finance") {
                    $$("pnlCardType").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlCouponNo").hide();
                    $$("pnlChequeNo").hide();
                    $$("pnlChequeBank").hide();
                    $$("pnlChequeDate").hide();
                }
            });

            (CONTEXT.POS_PENDING_SHOW_FIRST_PANEL) ? $$("pnlPendingPaymentPanel1").show() : $$("pnlPendingPaymentPanel1").hide();
            (CONTEXT.POS_PENDING_SHOW_SECOND_PANEL) ? $$("pnlPendingPaymentPanel2").show() : $$("pnlPendingPaymentPanel2").hide();
        }
        page.events.btnSearchBill_click = function (outsidefilter) {
            try {
                if ($$("ddlBillView").selectedValue() == "Payment View") {
                    $$("pnlPendingReceivedAmount").hide();
                    $$("pnlPendingPayButton").hide();
                    $$("pnlPendingPaidAmount").hide();
                    var loan_data = {};
                    loan_data.cust_no = $$("ddlCustName").selectedValue();
                    loan_data.bill_type = $$("ddlPayBillType").selectedValue();
                    var filter = "";
                    var bill_code = ($$("txtSearchBillNo").value().indexOf('-') > -1) ? true : false;
                    if (bill_code) {
                        bill_code = $$("txtSearchBillNo").value();
                    }
                    else {
                        var today = new Date();
                        var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                        bill_code = today.getFullYear() + "" + month + "-" + $$("txtSearchBillNo").value();
                    }
                    if ($$("ddlPayBillType").selectedValue() != "Select") {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "bill_type like '" + $$("ddlPayBillType").selectedValue() + "'";
                    }
                    if ($$("ddlCustName").selectedValue() != -1) {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "cust_no = " + $$("ddlCustName").selectedValue();
                    }
                    if ($$("txtSearchBillNo").value() != "") {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "bill_code like '" + bill_code + "'";
                    }
                    page.billPaymentAPI.searchValues("", "", filter, "", function (data) {
                        page.view.selectedPendingPayment(data);
                        page.controls.grdPendingPayment.edit(false);
                        $$("txtSearchBillNo").value("");
                    });
                }
                else {
                    var str = $$("txtSearchBillNo").value();
                    if (str.startsWith("000")) {
                        str = ((str.substring(0, str.length - 1)));
                        str = str.substring(3);
                        //    //str = (parseInt(str.substring(0, str.length)));
                    }
                    else if (str.startsWith("00")) {
                        str = ((str.substring(0, str.length - 1)));
                        str = str.substring(2);
                    }
                    $$("txtSearchBillNo").value(str);
                    var bill_code = ($$("txtSearchBillNo").value().indexOf('-') > -1) ? true : false;
                    if (bill_code) {
                        bill_code = $$("txtSearchBillNo").value();
                    }
                    else {
                        var today = new Date();
                        var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                        bill_code = today.getFullYear() + "" + month + "-" + $$("txtSearchBillNo").value();
                    }
                    var filter = "ifnull(b.pay_mode,'') <> 'EMI' and b.so_no is null";
                    if ($$("ddlPayBillType").selectedValue() != "Select") {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "b.bill_type like '" + $$("ddlPayBillType").selectedValue() + "'";
                    }
                    if ($$("ddlCustName").selectedValue() != -1) {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + "b.cust_no = " + $$("ddlCustName").selectedValue();
                    }
                    if ($$("txtSearchBillNo").value() != "") {
                        filter = (filter == "") ? filter : filter + " and ";
                        filter = filter + " (b.bill_code like '" + bill_code + "' or (cust_no in (select cust_no from customer_t where concat(ifnull(first_name,''),'',ifnull(last_name,'')) like '%" + $$("txtSearchBillNo").value() + "%')))";
                    }
                    if (filter != "ifnull(b.pay_mode,'') <> 'EMI' and b.so_no is null" || typeof outsidefilter != "undefined") {
                        if (typeof outsidefilter != "undefined") {
                            filter = outsidefilter;
                        }
                        page.billAPI.searchValues("", "", filter, "", function (data) {
                            var payment_data = [];
                            $(data).each(function (i, item) {
                                if (parseFloat(item.balance) != 0) {
                                    if (item.so_no == null) {
                                        payment_data.push({
                                            bill_no: item.bill_no,
                                            bill_id: item.bill_id,
                                            bill_code: item.bill_code,
                                            bill_date: item.bill_date,
                                            bill_type: item.bill_type,
                                            cust_no: item.cust_no,
                                            cust_name: item.cust_name,
                                            total: item.total,
                                            total_paid_amount: item.paid,
                                            expense_amt: item.expense,
                                            balance: parseFloat(item.total) - parseFloat(item.paid),
                                            sch_id: item.sch_id,
                                            due_date: item.due_date
                                        });
                                        $$("grdPendingPayment").createRow(payment_data[i]);
                                    }
                                }
                            });
                            //page.view.selectedPendingPayment(payment_data);
                            
                            //if (payment_data.length != 0) {
                            //    $(payment_data).each(function (i, item) {
                            //        var rows = page.controls.grdPendingPayment.getRow({
                            //            bill_no: item.bill_no
                            //        });
                            //        if (rows.length == 0) {
                            //            page.controls.grdPendingPayment.createRow(item);
                            //        }
                            //    });
                            //    //else {
                            //    //    alert("This Bill Is Already Scanned");
                            //    //}
                            //}
                            page.controls.grdPendingPayment.edit(true);
                            //else {
                            //    page.view.selectedPendingPayment([]);
                            //    alert("Incorrect Bill No Or No Balance");
                            //}
                            $$("txtSearchBillNo").value("");
                        });
                    }
                        
                }
            }
            catch (e) {

            }
        }
        page.events.btnPayPending_click = function () {
            $$("btnPayPending").disable(true);
            $$("btnPayPending").hide();
            var allBillSO = [];
            var data1 = [];
            var data2 = [];
            var finfacts_expense = [];
            var bill_no_par = 0;
            var bill_no_par_check = true;
            try {
                var countNoAmount = false;
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (parseFloat(item.amount_pay) < 0)
                        countNoAmount = true;
                    if (parseFloat(item.balance) == 0)
                        countNoAmount = true;
                    if (parseFloat(item.amount_pay) > parseFloat(item.balance))
                        countNoAmount = true;
                });
                if (countNoAmount)
                    throw "Please check the amount...!";
                if ($$("ddlPayMode").selectedValue() == "" || $$("ddlPayMode").selectedValue() == null)
                    throw "Select mode of pay...!";
                var bill_trans_data = {
                    receive_amount: $$("txtReceivedAmount").value(),
                    bill_amount: $$("lblTotalAmount").value(),
                }
                if ($$("ddlPayMode").selectedValue() == "Cheque") {
                    if ($$("txtChequeNo").value() == "" || $$("txtChequeNo").value() == null || typeof $$("txtChequeNo").value() == "undefined")
                        throw "Cheque No Is Not Empty";
                    if ($$("txtChequeBank").value() == "" || $$("txtChequeBank").value() == null || typeof $$("txtChequeBank").value() == "undefined")
                        throw "Bank Name Is Not Empty";
                    if ($$("dsChequeDate").getDate() == "" || $$("dsChequeDate").getDate() == null || typeof $$("dsChequeDate").getDate() == "undefined")
                        throw "Cheque Date Is Not Empty";
                    if (isNaN($$("txtChequeNo").value()) || $$("txtChequeNo").value().length != 9)
                        throw "Cheque Number Should Be A 9 Digit Interger Value";
                }
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (parseFloat(item.amount_pay) > 0) {
                        page.expense_amt = item.expense_amt;
                        if (bill_no_par_check) {
                            bill_no_par = item.bill_no;
                            bill_no_par_check = false;
                        }
                        allBillSO.push({
                            collector_id: CONTEXT.user_no,
                            pay_desc: "POS Bill Payment",
                            amount: item.amount_pay,
                            bill_no: item.bill_no,
                            bill_type:item.bill_type,
                            pay_date: dbDateTime($$("dsPendingPayDate").getDate()),//$.datepicker.formatDate("dd-mm-yy", new Date()),
                            pay_type: $$("ddlPayBillType").selectedValue(),
                            pay_mode: $$("ddlPayMode").selectedValue(),
                            card_type: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Coupon") ? "" : $$("ddlCardType").selectedValue(),
                            card_no: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Coupon") ? "" : $$("txtCardNo").val(),
                            coupon_no: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Card") ? "" : $$("txtCouponNo").val(),
                            cheque_no: ($$("ddlPayMode").selectedValue() == "Cheque") ? $$("txtChequeNo").value() : "",
                            cheque_bank_name: ($$("ddlPayMode").selectedValue() == "Cheque") ? $$("txtChequeBank").value() : "",
                            cheque_date: ($$("ddlPayMode").selectedValue() == "Cheque") ? dbDateTime($$("dsChequeDate").getDate()) : "",
                            store_no: getCookie("user_store_id"),
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        });
                        if (item.bill_type == "Sale") {
                            data1.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPayMode").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POS Bill Payment-" + item.bill_code,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: item.bill_no,
                                key_2: $$("ddlCustName").selectedValue(),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                        else {
                            data2.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPayMode").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POS Return Bill Payment-" + item.bill_code,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: item.bill_no,
                                key_2: $$("ddlCustName").selectedValue(),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                    }
                });
                if (parseInt(page.discount) != 0) {
                    finfacts_expense.push({
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,
                        expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                        amount: parseInt(page.discount),
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        key_2: $$("ddlCustName").selectedValue(),
                    });
                }
                var data = {
                    receive_amount: parseFloat($$("txtReceivedAmount").value()) + parseFloat(page.discount),
                    bill_amount: parseFloat($$("lblTotalAmount").value()) + parseFloat(page.discount),
                    payment_data: allBillSO,
                    finfacts_sale_data: data1,
                    finfacts_return_data: data2,
                    discount_amount: page.discount,
                    finfacts_expense: finfacts_expense,
                    bill_no_par: bill_no_par,
                }
                page.billPaymentAPI.postAllValue(data, function (data) {
                    $$("msgPanel").flash("Successfully paid...!");
                    $$("btnPayPending").disable(false);
                    $$("btnPayPending").show();
                    if ($$("chkPrintBill").prop("checked")) {
                        $$("msgPanel").flash("Printing the selected Bill.Please wait.");
                        var sl_no = 1;
                        var grand_total = 0;
                        var offset = 0;
                        var printBox = {
                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                            Width: 280,
                            Height: 1500,
                            Lines: []
                        };
                        var date = new Date();
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        var strTime = hours + ':' + minutes + ' ' + ampm;
                        var currentDate = strTime;

                        var t1 = (CONTEXT.COMPANY_NAME).length;
                        (t1 > 22) ? t1 = 22 : t1 = t1;
                        var t2 = t1 / 2;
                        var t3 = t2 * 12.72;
                        //var com_start = parseInt(140 - t3);
                        var com_start = Math.round(t1 / 2);
                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                        (t4 > 22) ? t4 = 22 : t4 = t4;
                        var t5 = t4 / 2;
                        var t6 = t5 * 12;
                        var add_start = parseInt(140 - t6);
                        var refundAmount = (parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())) < 0 ? 0 : (parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value()));
                        var bills = [];
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            bills.push({
                                SlNo: i + 1,
                                BillNo: convertBitString(item.bill_code.toString(), 13),
                                Amount: (item.bill_type == "Sale") ? item.total : -item.total
                            });
                        });
                        var printData = {
                            CompanyName: CONTEXT.COMPANY_NAME,
                            Address: CONTEXT.COMPANY_ADDRESS_LINE1.substring(0, 15),
                            Copies: 1,
                            Cashier: CONTEXT.user_name,
                            Date: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear(),
                            Time: currentDate,
                            TotalAmount: parseFloat(parseFloat($$("lblTotalAmount").value()) + parseFloat(page.discount)).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            Discount: parseFloat(page.discount).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            CashAmount: parseFloat($$("lblTotalAmount").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            Received: parseFloat($$("txtReceivedAmount").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            Refund: parseFloat(refundAmount).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            Bills: bills
                        }
                        PrintService.PrintPOSCashReceipt(printData);
                        //page.view.selectedPendingPayment([]);
                        //$$("txtPendingPaymentDiscount").value("");
                        //$$("lblPaymentBalance").value("0.00");
                        //page.discount = 0;
                        //$$("txtSearchBillNo").focus();
                        page.events.page_load();
                    }
                    else {
                        //page.view.selectedPendingPayment([]);
                        //$$("txtPendingPaymentDiscount").value("");
                        //$$("lblPaymentBalance").value("0.00");
                        //page.discount = 0;
                        //$$("txtSearchBillNo").focus();
                        page.events.page_load();
                    }
                    if (CONTEXT.ENABLE_SUBSCRIPTION) {
                        $$("lblTotalAmount").value(parseFloat(0));
                        $$("lblTotalPendingAmount").value(parseFloat(0));
                        $$("txtReceivedAmount").value(parseFloat(0));
                        $$("lblBillAmount").html("0");
                        $$("lblBillAmountBalance").html("0");
                        $$("lblBillAmountPaid").html("0");
                        var filter = {};
                        filter.viewMode = "Standard";
                        filter.fromDate = "";
                        filter.toDate = "";
                        filter.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();
                        filter.item_no = "";
                        filter.status = "";
                        filter.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                        var payment_data = [];
                        if (filter.cust_no == "" || filter.cust_no == "-1") {
                            page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "'", "", function (data) {
                                $(data).each(function (i, item) {
                                    if (parseFloat(item.total) != parseFloat(item.paid)) {
                                        payment_data.push({
                                            bill_no: item.bill_no,
                                            bill_code: item.bill_code,
                                            bill_date: item.bill_date,
                                            bill_type: item.bill_type,
                                            cust_no: item.cust_no,
                                            cust_name: item.cust_name,
                                            total: item.total,
                                            total_paid_amount: item.paid,
                                            expense_amt: item.expense,
                                            balance: parseFloat(item.total) - parseFloat(item.paid),
                                            sch_id: item.sch_id,
                                            due_date: item.due_date
                                        })
                                    }
                                })
                                page.view.selectedPendingPayment(payment_data);

                            });
                        }
                        else {
                            page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "' and ifnull(b.cust_no,'')=" + filter.cust_no, "", function (data) {
                                $(data).each(function (i, item) {
                                    if (parseFloat(item.total) != parseFloat(item.paid)) {
                                        payment_data.push({
                                            bill_no: item.bill_no,
                                            bill_code: item.bill_code,
                                            bill_date: item.bill_date,
                                            bill_type: item.bill_type,
                                            cust_no: item.cust_no,
                                            cust_name: item.cust_name,
                                            total: item.total,
                                            total_paid_amount: item.paid,
                                            expense_amt: item.expense,
                                            balance: parseFloat(item.total) - parseFloat(item.paid),
                                            sch_id: item.sch_id,
                                            due_date: item.due_date
                                        })
                                    }
                                })
                                page.view.selectedPendingPayment(payment_data);
                            });
                        }
                    }

                });
            } catch (e) {
                alert(e);
                $$("btnPayPending").disable(false);
                $$("btnPayPending").show();
            }
        }

        page.view = {
            selectedPendingPayment: function (data) {
                $$("lblTotalAmount").value("0");
                $$("lblTotalPendingAmount").value(parseFloat(0));
                $$("txtReceivedAmount").value("0");
                $$("lblBillAmount").html("0");
                $$("lblBillAmountBalance").html("0");
                $$("lblBillAmountPaid").html("0");
                $$("grdPendingPayment").width("100%");
                $$("grdPendingPayment").height("220px");
                $$("grdPendingPayment").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "50px", 'dataField': "pay_type", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />", visible: ($$("ddlBillView").selectedValue() == "Bill View") },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_code" },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "80px", 'dataField': "bill_id", visible: false },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "80px", 'dataField': "bill_no", visible: false },
                        { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                        { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "100px", 'dataField': "bill_type" },
                        { 'name': "Bill Month", 'rlabel': 'Bill Month', 'width': "90px", 'dataField': "sch_id", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                        { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                        { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "130px", 'dataField': "total" },
                        { 'name': "Payment Date", 'rlabel': 'Payment Date', 'width': "130px", 'dataField': "pay_date", visible: ($$("ddlBillView").selectedValue() == "Payment View") },
                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "total_paid_amount" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance", visible: ($$("ddlBillView").selectedValue() != "Payment View") },
                        { 'name': "", 'width': "0px", 'dataField': "expense_amt" },
                        { 'name': "Amount Pay", 'rlabel': 'Amount Pay', 'width': "120px", 'dataField': "amount_pay", editable: true },
                    ]
                });
                //Handle Row Command
                page.controls.grdPendingPayment.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    var amount = 0;
                    //To Handle removing an item from list.
                    if (action == "Delete") {
                        page.controls.grdPendingPayment.deleteRow(rowId);
                        var amount = 0;
                        var payAmount = 0;
                        var bill_amount = 0;
                        var paid_amount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.bill_type == "Sale") {
                                amount = parseFloat(amount) + parseFloat(item.balance);
                                payAmount = parseFloat(payAmount) + parseFloat(item.amount_pay);
                                bill_amount = parseFloat(bill_amount) + parseFloat(item.total);
                                paid_amount = parseFloat(paid_amount) + parseFloat(item.total_paid_amount);
                            }
                            else if (item.bill_type == "SaleReturn") {
                                amount = parseFloat(amount) - parseFloat(item.balance);
                                payAmount = parseFloat(payAmount) - parseFloat(item.amount_pay);
                                bill_amount = parseFloat(bill_amount) - parseFloat(item.total);
                                paid_amount = parseFloat(paid_amount) - parseFloat(item.total_paid_amount);
                            }
                        });
                        $$("lblTotalPendingAmount").value(parseFloat(amount));
                        $$("lblTotalAmount").value(parseFloat(parseFloat(amount) - parseFloat($$("txtPendingPaymentDiscount").value())).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("txtReceivedAmount").value(parseFloat(payAmount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblPaymentBalance").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmount").html(bill_amount);
                        $$("lblBillAmountPaid").html(parseFloat(parseFloat(bill_amount) - parseFloat(payAmount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmountBalance").html(payAmount);
                        $$("lblBillAmountPaid").html(paid_amount);
                        if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                            $$("lblCustomerBalance").html("Return From Customer");
                        }
                        else {
                            $$("lblCustomerBalance").html("Return To Customer");
                        }
                    }
                }
                $$("grdPendingPayment").rowBound = function (row, item) {
                    item.amount_pay = parseFloat(item.balance);
                    if (item.bill_type == "Sale") {
                        $$("lblTotalAmount").value(parseFloat(parseFloat($$("lblTotalAmount").value()) + parseFloat(item.balance)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblTotalPendingAmount").value(parseFloat($$("lblTotalAmount").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("txtReceivedAmount").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) + parseFloat(item.amount_pay)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmount").html(parseFloat(parseFloat($$("lblBillAmount").html()) + parseFloat(item.total)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmountBalance").html(parseFloat(parseFloat($$("lblBillAmountBalance").html()) + parseFloat(item.amount_pay)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmountPaid").html(parseFloat(parseFloat($$("lblBillAmountPaid").html()) + parseFloat(item.total_paid_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    }
                    else if (item.bill_type == "SaleReturn") {
                        $$("lblTotalAmount").value(parseFloat(parseFloat($$("lblTotalAmount").value()) - parseFloat(item.balance)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblTotalPendingAmount").value(parseFloat($$("lblTotalAmount").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("txtReceivedAmount").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat(item.amount_pay)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmount").html(parseFloat(parseFloat($$("lblBillAmount").html()) - parseFloat(item.total)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmountBalance").html(parseFloat(parseFloat($$("lblBillAmountBalance").html()) - parseFloat(item.amount_pay)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("lblBillAmountPaid").html(parseFloat(parseFloat($$("lblBillAmountPaid").html()) - parseFloat(item.total_paid_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                        row[0].style.color = "red";
                    }
                    $$("lblPaymentBalance").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                        $$("lblCustomerBalance").html("Return From Customer");
                    }
                    else {
                        $$("lblCustomerBalance").html("Return To Customer");
                    }
                    row.on("change", "input[datafield=amount_pay]", function () {
                        var amount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.bill_type == "Sale")
                                amount = parseFloat(amount) + parseFloat(item.amount_pay);
                            else if (item.bill_type == "SaleReturn")
                                amount = parseFloat(amount) - parseFloat(item.amount_pay);
                        });
                        $$("txtReceivedAmount").value(parseFloat(amount));
                        $$("lblPaymentBalance").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        if (parseFloat($$("lblPaymentBalance").value()) < 0) {
                            $$("lblCustomerBalance").html("Return From Customer");
                            $$("lblPaymentBalance").value(Math.abs($$("lblPaymentBalance").value()));
                        }
                        else {
                            $$("lblCustomerBalance").html("Return To Customer");
                        }
                    });
                }

                page.controls.grdPendingPayment.dataBind(data);
                page.controls.grdPendingPayment.edit(true);
            },
        }

    });
}