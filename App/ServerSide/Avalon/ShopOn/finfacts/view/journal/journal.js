$.fn.journalPage = function () {
    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.accService = new AccountingService();
        page.revenueService = new RevenueService();
        page.accAccountService = new AccAccountService();
        page.finfactsEntry = new FinfactsEntry();
        page.lookupService = new LookupService();
        page.companyService = new CompanyService();
        page.businessService = new BusinessService();
        page.userService = new UserService();
        document.title = "ShopOn - Journal";
        page.supplierList = [], page.newSupplier = false;
        page.customerList = [], page.newCustomer = false;
        page.loadJournal = function () {
            $$("msgPanel").show("Loading...");
            page.accService.getAllJournalEntries(page.per_id, function (data) {
                var ndata = [];
                var jrn_id = '';
                var last_jrn_data = null;
                $(data).each(function (i, item) {
                    if (jrn_id != item.jrn_id) {
                        last_jrn_data = { jrn_id: item.jrn_id, jrn_date: item.jrn_date, description: item.description, debit: [], credit: [] };
                        ndata.push(last_jrn_data);
                        jrn_id = item.jrn_id;
                    }
                    if (item.trans_type == 'Credit')
                        last_jrn_data.credit.push({ acc_id: item.acc_id, acc_name: item.acc_name, amount: item.amount });
                    if (item.trans_type == 'Debit')
                        last_jrn_data.debit.push({ acc_id: item.acc_id, acc_name: item.acc_name, amount: item.amount });
                });


                $$("grdJournalEntrySimple").dataBind(ndata);
                $$("grdJournalEntry").dataBind(ndata);
                //$$("msgPanel").hide();
                $$("msgPanel").hide();
            });

            $$("pnlCashPurchase").hide();
            $$("pnlCreditPurchase").hide();
            $$("pnlPaymentPurchase").hide();
            $$("pnlReturnCashPurchase").hide();
            $$("pnlReturnCreditPurchase").hide();
            $$("pnlReturnPurchasePayment").hide();
            $$("pnlCashSales").hide();
            $$("pnlCreditSales").hide();
            $$("pnlPaymentSales").hide();
            $$("pnlReturnCashSales").hide();
            $$("pnlReturnCreditSales").hide();
            $$("pnlReturnSalesPayment").hide();
            $$("pnlInventory").hide();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").hide();
            //$$("pnlManuelJournal").hide();
            $$("pnlNewJournal").hide();
            $$("pnlNewTransfer").hide();
            $('a').removeClass("active_menu");
        }
        page.clearEntries = function () {
            //CLEAR MAUAL JOURNAL ENTRIES
            $$("dsJournalDate").selectedObject.val("");
            $$("txtJournalDescription").value("");
            //$$("aclMainAccount").selectedValue("1");
            //$$("aclTranAccount1").selectedValue("1");
            //$$("aclTranAccount2").selectedValue("1");
            //$$("aclTranAccount3").selectedValue("1");
            $$("txtMainAmountDebit").value("");
            $$("txtTranAmountDebit1").value("");
            $$("txtTranAmountDebit2").value("");
            $$("txtTranAmountDebit3").value("");
            $$("txtMainAmountCredit").value("");
            $$("txtTranAmountCredit1").value("");
            $$("txtTranAmountCredit2").value("");
            $$("txtTranAmountCredit3").value("");

            //CLEAR SALES ENTIRES
            $$("dsCashSalesJournalDate").selectedObject.val("");
            $$("txtCashSalesDescription").value("");
            $$("txtCashSalesBillNo").value("");
            $$("txtCashSalesBCost").value("");
            $$("txtCashSalesTaxAmt").value("");
            $$("txtCashSalesSCost").value("");
            $$("txtCashSalesRndOff").value("");

            //CLEAR CREDIT SALES ENTRIES
            $$("dsCreditSalesJournalDate").selectedObject.val("");
            $$("txtCreditSalesDescription").value("");
            $$("txtCreditSalesBillNo").value("");
            $$("txtCreditSalesBCost").value("");
            $$("txtCreditSalesTaxAmt").value("");
            $$("txtCreditSalesRndOff").value("");
            $$("txtCreditSalesSCost").value("");

            //CLEAR PAYMENT SALES ENTRIES
            $$("dsCreditSalesPayJournalDate").selectedObject.val("");
            $$("txtCreditSalesPayDescription").value("");
            $$("txtPaySalesBillNo").value("");
            $$("txtPaySalesAmount").value("");

            //CLEAR RETURN SALES ENTRIES
            $$("dsReCashSalesJournalDate").selectedObject.val("");
            $$("txtReCashSalesDescription").value("");
            $$("txtReCashSalesBillNo").value("");
            $$("txtReCashSalesBCost").value("");
            $$("txtReCashSalesTaxAmt").value("");
            $$("txtReCashSalesSCost").value("");
            $$("txtReCashRndOff").value("");

            //CLEAR RETURN CREDIT SALES ENTRIES
            $$("dsReCreditSalesJournalDate").selectedObject.val("");
            $$("txtReCreditSalesDescription").value("");
            $$("txtReCreditSalesBillNo").value("");
            $$("txtReCreditSalesBCost").value("");
            $$("txtReCreditSalesTaxAmt").value("");
            $$("txtReCreditSalesSCost").value("");
            $$("txtReCreditSalesRndOff").value("");

            //CLEAR RETURN SALES PAYMENT ENTRIES
            $$("dsReSalesPayJournalDate").selectedObject.val("");
            $$("txtReSalesPayDescription").value("");
            $$("txtRPaySalesBillNo").value("");
            $$("txtRPaySalesAmount").value("");

            //CLEAR CASH PURCHASE
            $$("dsCashPurchaseJournalDate").selectedObject.val("");
            $$("txtCashPurchaseDescription").value("");
            $$("txtCashPurchaseBillNo").value("");
            $$("txtCashPurchaseQty").value("");
            $$("txtCashPurchaseTaxAmt").value("");
            $$("txtCashPurchaseSCost").value("");
            $$("txtCashPurchaseRndOff").value("");

            //CLEAR CREDIT PURCHASE
            $$("dsCreditPurchaseJournalDate").selectedObject.val("");
            $$("txtCreditPurchaseDescription").value("");
            $$("txtCreditPurchaseBillNo").value("");
            $$("txtCreditPurchaseTaxAmt").value("");
            $$("txtCreditPurchaseSCost").value("");
            $$("txtCreditPurchaseRndOff").value("");

            //CLEAR PAYMENT PURCHASE
            $$("dsPayPurchasePaymentJournalDate").selectedObject.val("");
            $$("txtPayPurchasePaymentDescription").value("");
            $$("txtPayPurchaseBillNo").value("");
            $$("txtPayPurchaseAmount").value("");

            //CLEAR RETURN CASH PURCHASE
            $$("dsReCashPurchaseJournalDate").selectedObject.val("");
            $$("txtReCashPurchaseDescription").value("");
            $$("txtReCashPurchaseBillNo").value("");
            $$("txtReCashPurchaseTaxAmt").value("");
            $$("txtReCashPurchaseSCost").value("");
            $$("txtReCashPurchaseRndOff").value("");

            //CLEAR RETURN CREDIT   PURCHASE
            $$("dsReCreditPurchaseJournalDate").selectedObject.val("");
            $$("txtReCreditPurchaseDescription").value("");
            $$("txtReCreditPurchaseBillNo").value("");
            $$("txtReCreditPurchaseTaxAmt").value("");
            $$("txtReCreditPurchaseSCost").value("");
            $$("txtReCreditPurchaseRndOff").value("");

            //CLEAR RETURN PURCHASE PAYMENT
            $$("dsRePayPurchasePaymentJournalDate").selectedObject.val("");
            $$("txtRePayPurchasePaymentDescription").value("");
            $$("txtRePayPurchaseBillNo").value("");
            $$("txtRePayPurchaseAmount").value("");

            //CLEAR INVENTORY
            $$("dsInventoryJournalDate").selectedObject.val("");
            $$("txtInventoryDescription").value("");
            $$("txtInventoryBillNo").value("");
            $$("txtInventoryBCost").value("");

            //CLEAR NEW INCOME
            $$("dsIncomeJournalDate").selectedObject.val("");
            $$("txtIncomeDescription").value("");
            $$("txtIncomeAmount").value("");

            //CLEAR NEW EXPENSE
            $$("dsExpenseJournalDate").selectedObject.val("");
            $$("txtExpenseDescription").value("");
            $$("txtExpenseAmount").value("");

            //CLEAR NEW TRANSFER
            $$("dsTransferJournalDate").selectedObject.val("");
            $$("txtTransferDescription").value("");
            $$("txtTransferBCost").value("");

            page.controls.txtCashPurchaseCustomerName.selectedObject.val("");
            page.controls.txtCreditPurchaseCustomerName.selectedObject.val("");
            page.controls.txtPayPurchaseCustomerName.selectedObject.val("");
            page.controls.txtReCashPurchaseCustomerName.selectedObject.val("");
            page.controls.txtReCreditPurchaseCustomerName.selectedObject.val("");
            page.controls.txtRePayPurchaseCustomerName.selectedObject.val("");

            page.controls.txtCashSaleCust.selectedObject.val("");
            page.controls.txtCreditSaleCust.selectedObject.val("");
            page.controls.txtCreditSalePayCust.selectedObject.val("");
            page.controls.txtReCashSalePayCust.selectedObject.val("");
            page.controls.txtReCreditSalePayCust.selectedObject.val("");
            page.controls.txtReSalePayCust.selectedObject.val("");
        }
        page.events.btnNewJournal_click = function () {
            $$("pnlNewReceipt").hide();
            $$("pnlNewPayment").hide();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").hide();
            $$("pnlNewJournal").show();
            $$("txtJournalDescription").focus();
        }
        //page.events.btnNewIncome_click = function () {
        //    $$("pnlNewReceipt").hide();
        //    $$("pnlNewPayment").hide();
        //    $$("pnlNewIncome").show();
        //    $$("pnlNewExpense").hide();
        //    $$("pnlNewJournal").hide();


        //}
        page.events.btnNewExpense_click = function () {
            $$("pnlNewReceipt").hide();
            $$("pnlNewPayment").hide();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").show();
            $$("pnlNewJournal").hide();


        }
        page.events.btnNewReceipt_click = function () {
            $$("pnlNewReceipt").show();
            $$("pnlNewPayment").hide();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").hide();
            $$("pnlNewJournal").hide();
            $$("txtCustomerName").focus();
            /*  page.controls.txtReceiptCategory.dataBind({
                  getData: function (term, callback) {
                      page.accService.getAutoSalesAccounts(term, callback);
                  }
              });*/

        }
        page.events.btnNewPayment_click = function () {
            $$("pnlNewReceipt").hide();
            $$("pnlNewPayment").show();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").hide();
            $$("pnlNewJournal").hide();

            /* page.controls.txtPaymentCategory.dataBind({
                 getData: function (term, callback) {
                     page.accService.getAutoPurchaseAccounts(term, callback);
                 }
             });*/

        }

        page.events.btnNewJournalShowMore_click = function () {
            $$("aclTranAccount2").show();
            $$("aclTranAccount3").show();
            $$("txtTranAmountCredit2").show();
            $$("txtTranAmountCredit3").show();
            $$("txtTranAmountDebit2").show();
            $$("txtTranAmountDebit3").show();

            $$("btnNewJournalShowMore").hide();
            $$("btnNewJournalShowLess").show();
            //$$("showMoreFlag").value("enabled");
        }
        page.events.btnNewJournalShowLess_click = function () {
            $$("aclTranAccount2").hide();
            $$("aclTranAccount3").hide();
            $$("txtTranAmountCredit2").hide();
            $$("txtTranAmountCredit3").hide();
            $$("txtTranAmountDebit2").hide();
            $$("txtTranAmountDebit3").hide();

            $$("btnNewJournalShowMore").show();
            $$("btnNewJournalShowLess").hide();
            //$$("showMoreFlag").value("disabled");
            //$$("msgPanel").hide();
        }
        page.events.btnNewJournalSave_click = function () {
            /*var count = 0;
            if ($$("txtMainAmountCredit").value() == "") {
                if ($$("txtMainAmountDebit").value() == "")
                    count++;
            }
            if ($$("txtMainAmountDebit").value() == "") {
                if ($$("txtMainAmountCredit").value() == "")
                    count++;
            }
            if ($$("txtTranAmountDebit1").value() == "") {
                if ($$("txtTranAmountCredit1").value() == "")
                    count++;
            }
            if ($$("txtTranAmountCredit1").value() == "") {
                if ($$("txtTranAmountDebit1").value() == "")
                    count++;
            }
            if ($$("txtTranAmountDebit2").value() == "") {
                if ($$("txtTranAmountCredit2").value() == "")
                    count++;
            }
            if ($$("txtTranAmountCredit2").value() == "") {
                if ($$("txtTranAmountDebit2").value() == "")
                    count++;
            }

            if (isNaN($$("txtTranAmountCredit2").value()) || isNaN($$("txtTranAmountDebit2").value()) || $$("txtTranAmountCredit1").value()) || isNaN($$("txtTranAmountDebit1").value()) || isNaN($$("txtMainAmountCredit").value()) || isNaN($$("txtMainAmountDebit").value()))
                count++;
            if (count == 0) {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting income entry...");
                var trans_type1 = $$("txtMainAmountDebit").value() == "" ? "Credit" : "Debit";
                var trans_type2 = $$("txtTranAmountDebit1").value() == "" ? "Credit" : "Debit";
                var trans_type3 = $$("txtTranAmountDebit2").value() == "" ? "Credit" : "Debit";
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    acc_id1: $$("aclMainAccount").selectedValue(),
                    trans_type1: trans_type1,
                    amount1: trans_type1 == "Debit" ? $$("txtMainAmountDebit").value() : $$("txtMainAmountCredit").value(),

                    acc_id2: $$("aclTranAccount1").selectedValue(),
                    trans_type2: trans_type2,
                    amount2: trans_type2 == "Debit" ? $$("txtTranAmountDebit1").value() : $$("txtTranAmountCredit1").value(),

                    acc_id3: $$("aclTranAccount2").selectedValue(),
                    trans_type3: trans_type3,
                    amount3: trans_type2 == "Debit" ? $$("txtTranAmountDebit2").value() : $$("txtTranAmountCredit2").value(),

                    description: $$("txtJournalDescription").value(),
                    jrn_date: $$("dsJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue()
                };
                page.accService.insertJournalManual(data1, function (response) {
                    $$("msgPanel").show("Income entry saved successfully...!");
                    page.loadJournal();
                    //$(".detail-info").progressBar("hide")

                })
            } else {
                $$("msgPanel").show("Amount should not be empty...!");
            }*/
            try {
                if ($$("dsJournalDate").getDate() == "") {
                    throw "Journal Date Is Not Empty";
                }
                var trans_type1 = $$("txtMainAmountDebit").value() == "" ? "Credit" : "Debit";
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    acc_id: $$("aclMainAccount").selectedValue(),
                    amount: trans_type1 == "Debit" ? $$("txtMainAmountDebit").value() : $$("txtMainAmountCredit").value(),
                    trans_type: trans_type1,
                    description: $$("txtJournalDescription").value(),
                    jrn_date: $$("dsJournalDate").getDate()
                };

                var trans_type2 = $$("txtTranAmountDebit1").value() == "" ? "Credit" : "Debit";
                var data2 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    acc_id: $$("aclTranAccount1").selectedValue(),
                    amount: trans_type2 == "Debit" ? $$("txtTranAmountDebit1").value() : $$("txtTranAmountCredit1").value(),
                    trans_type: trans_type2,
                    description: $$("txtJournalDescription").value(),
                    jrn_date: $$("dsJournalDate").getDate()
                };

                var trans_type3 = $$("txtTranAmountDebit2").value() == "" ? "Credit" : "Debit";
                var data3 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    acc_id: $$("aclTranAccount2").selectedValue(),
                    amount: trans_type3 == "Debit" ? $$("txtTranAmountDebit2").value() : $$("txtTranAmountCredit2").value(),
                    trans_type: trans_type3,
                    description: $$("txtJournalDescription").value(),
                    jrn_date: $$("dsJournalDate").getDate()
                };

                var trans_type4 = $$("txtTranAmountDebit3").value() == "" ? "Credit" : "Debit";
                var data4 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    acc_id: $$("aclTranAccount3").selectedValue(),
                    amount: trans_type4 == "Debit" ? $$("txtTranAmountDebit3").value() : $$("txtTranAmountCredit3").value(),
                    trans_type: trans_type4,
                    description: $$("txtJournalDescription").value(),
                    jrn_date: $$("dsJournalDate").getDate()
                };

                page.accService.insertJournal(data1, function (response) {
                    data1.jrn_id = response[0].key_value;
                    page.accService.insertTransaction(data1, function () {
                        data2.jrn_id = response[0].key_value;
                        page.loadJournal();
                        if ($$("txtTranAmountDebit1").value() != "" || $$("txtTranAmountCredit1").value() != "") {
                            page.accService.insertTransaction(data2, function () {
                                page.loadJournal();
                                if ($$("txtTranAmountDebit2").value() != "" || $$("txtTranAmountCredit2").value() != "") {
                                    data3.jrn_id = response[0].key_value;
                                    page.accService.insertTransaction(data3, function () {
                                        page.loadJournal();
                                        if ($$("txtTranAmountDebit3").value() != "" || $$("txtTranAmountCredit3").value() != "") {
                                            data4.jrn_id = response[0].key_value;
                                            page.accService.insertTransaction(data4, function () {
                                                page.loadJournal();
                                                alert("Journal Entry saved successfully!!");
                                            });
                                        }
                                        alert("Journal Entry saved successfully!!");
                                    });
                                }
                            });
                        }
                    })
                });
            }
            catch (e) {
                alert(e);
            }
            


        }

        //function validateJournal(data1, data2) {
        //    if ((data1.acc_id == null || data1.acc_id == "" || data1.acc_id == undefined) || (data1.description == null || data1.description == "" || data1.description == undefined) || (data1.amount == null || data1.amount == "" || data1.amount == undefined) || (data1.jrn_date == null || data1.jrn_date == "" || data1.jrn_date == undefined) ||
        //        (data2.acc_id == null || data2.acc_id == "" || data2.acc_id == undefined) || (data2.description == null || data2.description == "" || data2.description == undefined) || (data2.amount == null || data2.amount == "" || data2.amount == undefined) || (data2.jrn_date == null || data2.jrn_date == "" || data2.jrn_date == undefined)) {
        //        return true;
        //    }

        //    return false;
        //}
        //function validateJournalEntry3(data1, data2, data3) {
        //    if ($$("showMoreFlag").value() == "enabled") {
        //        if ((data3.acc_id == null || data3.acc_id == "" || data3.acc_id == undefined) || (data3.description == null || data3.description == "" || data3.description == undefined) || (data3.amount == null || data3.amount == "" || data3.amount == undefined) || (data3.jrn_date == null || data3.jrn_date == "" || data3.jrn_date == undefined)) {
        //            return true;
        //        }
        //        if (parseFloat(data1.amount) - (parseFloat(data2.amount) + parseFloat(data3.amount)) != 0) {
        //            return true;
        //        }
        //    }

        //    else if (parseFloat(data1.amount) - (parseFloat(data2.amount)) != 0) {
        //        return true;
        //    }

        //    else {
        //        return false;
        //    }
        //}
        page.events.btnNewCashSalesSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsCashSalesJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsCashSalesJournalDate").selectedObject.focus();
            }
            else if ($$("txtCashSalesBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtCashSalesBillNo").focus();
            }
            else if ($$("txtCashSalesBCost").value() == "") {
                $$("msgPanel").show("Enter cost of goods ...!");
                $$("txtCashSalesBCost").focus();
            }
            else if (isNaN(parseFloat($$("txtCashSalesBCost").val()))) {
                $$("msgPanel").show("Cost of goods should be a number ...!");
                $$("txtCashSalesBCost").focus();
            }
            else if ($$("txtCashSalesTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtCashSalesTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtCashSalesTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtCashSalesTaxAmt").focus();
            }
            else if ($$("txtCashSalesSCost").value() == "") {
                $$("msgPanel").show("Enter total sales ...!");
                $$("txtCashSalesSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtCashSalesSCost").val()))) {
                $$("msgPanel").show("Total sales should be a number ...!");
                $$("txtCashSalesSCost").focus();
            }
            else if ( $$("txtCashSalesRndOff").value() != "" && isNaN(parseFloat($$("txtCashSalesRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtCashSalesRndOff").focus();
            }

            else {
                $$("msgPanel").show("Inserting new finfacts entry...");
                var sales_with_tax = parseFloat($$("txtCashSalesSCost").val()) + parseFloat($$("txtCashSalesTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    sales_with_tax: parseFloat(sales_with_tax).toFixed(2),
                    sales_with_out_tax: parseFloat($$("txtCashSalesSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtCashSalesTaxAmt").val()).toFixed(2),
                    description: "Manual - " + $$("txtCashSalesDescription").val(),
                    buying_cost: parseFloat($$("txtCashSalesBCost").val()).toFixed(2),
                    round_off: $$("txtCashSalesRndOff").val() == "" ? 0 :parseFloat( $$("txtCashSalesRndOff").val()).toFixed(2),
                    jrn_date: $$("dsCashSalesJournalDate").getDate(),
                    key_1: $$("txtCashSalesBillNo").value(),
                    key_2: $$("txtCashSaleCust").selectedObject.val(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };
                page.finfactsEntry.cashSales(data1, function (response) {
                    $$("msgPanel").show("Cash sales updated successfully ...!");
                    if (page.newCustomer) {
                        var data = {
                            lookup_id: "21",
                            key_value: page.controls.txtCashSaleCust.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Customer", function (data) {
                                page.customerList = data;
                            });
                        });
                        page.newCustomer = false;
                    }
                    page.loadJournal();
                });
            }

        }
        page.events.btnNewCreditSalesSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsCreditSalesJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsCreditSalesJournalDate").selectedObject.focus();
            }
            else if ($$("txtCreditSalesBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtCreditSalesBillNo").focus();
            }
            else if ($$("txtCreditSalesBCost").value() == "") {
                $$("msgPanel").show("Enter cost of goods ...!");
                $$("txtCreditSalesBCost").focus();
            }
            else if (isNaN(parseFloat($$("txtCreditSalesBCost").val()))) {
                $$("msgPanel").show("Cost of goods should be a number ...!");
                $$("txtCreditSalesBCost").focus();
            }
            else if ($$("txtCreditSalesTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtCreditSalesTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtCreditSalesTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtCreditSalesTaxAmt").focus();
            }
            else if ($$("txtCreditSalesRndOff").value() != "" && isNaN(parseFloat($$("txtCreditSalesRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtCreditSalesRndOff").focus();
            }
            else if ($$("txtCreditSalesSCost").value() == "") {
                $$("msgPanel").show("Enter total sales ...!");
                $$("txtCreditSalesSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtCreditSalesSCost").val()))) {
                $$("msgPanel").show("Total sales should be a number ...!");
                $$("txtCreditSalesSCost").focus();
            }


            else {
                $$("msgPanel").show("Inserting new finfacts entry...");
                var sales_with_tax = parseFloat($$("txtCreditSalesSCost").val()) + parseFloat($$("txtCreditSalesTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    //target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    sales_with_tax: parseFloat(sales_with_tax).toFixed(2),
                    sales_with_out_tax: parseFloat($$("txtCreditSalesSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtCreditSalesTaxAmt").val()).toFixed(2),
                    buying_cost: parseFloat($$("txtCreditSalesBCost").val()).toFixed(2),
                    round_off: $$("txtCreditSalesRndOff").val() == "" ? 0 : parseFloat($$("txtCreditSalesRndOff").val()).toFixed(2),
                    description: "Manual - "+ $$("txtCreditSalesDescription").val(),
                    jrn_date: $$("dsCreditSalesJournalDate").getDate(),
                    key_1: $$("txtCreditSalesBillNo").value(),
                    key_2: $$("txtCreditSaleCust").selectedObject.val(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };
                page.finfactsEntry.creditSales(data1, function (response) {
                    $$("msgPanel").show("credit sales updated successfully ...!");
                    if (page.newCustomer) {
                        var data = {
                            lookup_id: "21",
                            key_value: page.controls.txtCreditSaleCust.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Customer", function (data) {
                                page.customerList = data;
                            });
                        });
                        page.newCustomer = false;
                    }
                    page.loadJournal();
                });
            }

        }
        page.events.btnNewPaymentSalesSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsCreditSalesPayJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsCreditSalesPayJournalDate").selectedObject.focus();
            }
            else if ($$("txtPaySalesBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtPaySalesBillNo").focus();
            }
            else if ($$("txtPaySalesAmount").value() == "") {
                $$("msgPanel").show("Enter amount ...!");
                $$("txtPaySalesAmount").focus();
            }
            else if (isNaN(parseFloat($$("txtPaySalesAmount").val()))) {
                $$("msgPanel").show("amount should be a number ...!");
                $$("txtPaySalesAmount").focus();
            }
            else {
                $$("msgPanel").show("Inserting new finfacts entry...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    paid_amount: parseFloat($$("txtPaySalesAmount").val()).toFixed(2),
                    description: "Manual - "+ $$("txtCreditSalesPayDescription").val(),
                    jrn_date: $$("dsCreditSalesPayJournalDate").getDate(),
                    key_1: $$("txtPaySalesBillNo").value(),
                    key_2: $$("txtCreditSalePayCust").selectedObject.val(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };
                page.finfactsEntry.creditSalesPayment(data1, function (response) {
                    $$("msgPanel").show("Sales payment updated successfully ...!");
                    if (page.newCustomer) {
                        var data = {
                            lookup_id: "21",
                            key_value: page.controls.txtCreditSalePayCust.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Customer", function (data) {
                                page.customerList = data;
                            });
                        });
                        page.newCustomer = false;
                    }
                    page.loadJournal();
                });
            }

        }
        page.events.btnReCashSalesSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsReCashSalesJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsReCashSalesJournalDate").selectedObject.focus();
            }
            else if ($$("txtReCashSalesBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtReCashSalesBillNo").focus();
            }
            else if ($$("txtReCashSalesBCost").value() == "") {
                $$("msgPanel").show("Enter cost of goods ...!");
                $$("txtReCashSalesBCost").focus();
            }
            else if (isNaN(parseFloat($$("txtReCashSalesBCost").val()))) {
                $$("msgPanel").show("Cost of goods should be a number ...!");
                $$("txtReCashSalesBCost").focus();
            }
            else if ($$("txtReCashSalesTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtReCashSalesTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtReCashSalesTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtReCashSalesTaxAmt").focus();
            }
            else if ($$("txtReCashSalesSCost").value() == "") {
                $$("msgPanel").show("Enter total sales ...!");
                $$("txtReCashSalesSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtReCashSalesSCost").val()))) {
                $$("msgPanel").show("Total sales should be a number ...!");
                $$("txtReCashSalesSCost").focus();
            }
            else if ($$("txtReCashRndOff").val() != "" && isNaN(parseFloat($$("txtReCashRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtReCashRndOff").focus();
            }

            else {
                $$("msgPanel").show("Inserting new finfacts entry...");
                var sales_with_tax = parseFloat($$("txtReCashSalesSCost").val()) + parseFloat($$("txtReCashSalesTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    sales_with_tax: parseFloat(sales_with_tax).toFixed(2),
                    sales_with_out_tax: parseFloat($$("txtReCashSalesSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtReCashSalesTaxAmt").val()).toFixed(2),
                    buying_cost: parseFloat($$("txtReCashSalesBCost").val()).toFixed(2),
                    round_off: $$("txtReCashRndOff").val() == "" ? 0 : parseFloat($$("txtReCashRndOff").val()).toFixed(2),
                    description: "Manual - " + $$("txtReCashSalesDescription").val(),
                    jrn_date: $$("dsReCashSalesJournalDate").getDate(),
                    key_1: $$("txtReCashSalesBillNo").value(),
                    key_2: $$("txtReCashSalePayCust").selectedObject.val(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };
                page.finfactsEntry.cashReturnSales(data1, function (response) {
                    $$("msgPanel").show("Return cash sales updated successfully ...!");
                    if (page.newCustomer) {
                        var data = {
                            lookup_id: "21",
                            key_value: page.controls.txtReCashSalePayCust.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Customer", function (data) {
                                page.customerList = data;
                            });
                        });
                        page.newCustomer = false;
                    }
                    page.loadJournal();
                });
            }

        }
        page.events.btnReCreditSalesSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsReCreditSalesJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsReCreditSalesJournalDate").selectedObject.focus();
            }
            else if ($$("txtReCreditSalesBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtReCreditSalesBillNo").focus();
            }
            else if ($$("txtReCreditSalesBCost").value() == "") {
                $$("msgPanel").show("Enter cost of goods ...!");
                $$("txtReCreditSalesBCost").focus();
            }
            else if (isNaN(parseFloat($$("txtReCreditSalesBCost").val()))) {
                $$("msgPanel").show("Cost of goods should be a number ...!");
                $$("txtReCreditSalesBCost").focus();
            }
            else if ($$("txtReCreditSalesTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtReCreditSalesTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtReCreditSalesTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtReCreditSalesTaxAmt").focus();
            }
            else if ($$("txtReCreditSalesSCost").value() == "") {
                $$("msgPanel").show("Enter total sales ...!");
                $$("txtReCreditSalesSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtReCreditSalesSCost").val()))) {
                $$("msgPanel").show("Total sales should be a number ...!");
                $$("txtReCreditSalesSCost").focus();
            }
            else if ($$("txtReCreditSalesRndOff").value() != "" && isNaN(parseFloat($$("txtReCreditSalesRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtReCreditSalesRndOff").focus();
            }

            else {
                $$("msgPanel").show("Inserting new finfacts entry...");
                var sales_with_tax = parseFloat($$("txtReCreditSalesSCost").val()) + parseFloat($$("txtReCreditSalesTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    //target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    sales_with_tax: parseFloat(sales_with_tax).toFixed(2),
                    sales_with_out_tax: parseFloat($$("txtReCreditSalesSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtReCreditSalesTaxAmt").val()).toFixed(2),
                    buying_cost: parseFloat($$("txtReCreditSalesBCost").val()).toFixed(2),
                    round_off: $$("txtReCreditSalesRndOff").val() == "" ? 0 : parseFloat($$("txtReCreditSalesRndOff").val()).toFixed(2),
                    description: "Manual - " + $$("txtReCreditSalesDescription").val(),
                    jrn_date: $$("dsReCreditSalesJournalDate").getDate(),
                    key_1: $$("txtReCreditSalesBillNo").value(),
                    key_2: $$("txtReCreditSalePayCust").selectedObject.val(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };
                page.finfactsEntry.creditReturnSales(data1, function (response) {
                    $$("msgPanel").show("Return credit sales updated successfully ...!");
                    if (page.newCustomer) {
                        var data = {
                            lookup_id: "21",
                            key_value: page.controls.txtReCreditSalePayCust.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Customer", function (data) {
                                page.customerList = data;
                            });
                        });
                        page.newCustomer = false;
                    }
                    page.loadJournal();
                });
            }

        }
        page.events.btnReSalesPaySave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsReSalesPayJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsReSalesPayJournalDate").selectedObject.focus();
            }
            else if ($$("txtRPaySalesBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtRPaySalesBillNo").focus();
            }
            else if ($$("txtRPaySalesAmount").value() == "") {
                $$("msgPanel").show("Enter amount ...!");
                $$("txtRPaySalesAmount").focus();
            }
            else if (isNaN(parseFloat($$("txtRPaySalesAmount").val()))) {
                $$("msgPanel").show("amount should be a number ...!");
                $$("txtRPaySalesAmount").focus();
            }
            else {
                $$("msgPanel").show("Inserting new finfacts entry...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    paid_amount: parseFloat($$("txtRPaySalesAmount").val()).toFixed(2),
                    description: "Manual - " + $$("txtReSalesPayDescription").val(),
                    jrn_date: $$("dsReSalesPayJournalDate").getDate(),
                    key_1: $$("txtRPaySalesBillNo").value(),
                    key_2: $$("txtReSalePayCust").selectedObject.val(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };
                page.finfactsEntry.creditReturnSalesPayment(data1, function (response) {
                    $$("msgPanel").show("Return sales payment updated successfully ...!");
                    if (page.newCustomer) {
                        var data = {
                            lookup_id: "21",
                            key_value: page.controls.txtReSalePayCust.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Customer", function (data) {
                                page.customerList = data;
                            });
                        });
                        page.newCustomer = false;
                    }
                    page.loadJournal();
                });
            }

        }
        page.events.btnBackJournal_click = function () {
            page.loadJournal();
        }

        page.events.btnNewIncomeSave_click = function () {
            if ($$("txtIncomeAmount").value() == "" || isNaN($$("txtIncomeAmount").value())) {
                $$("msgPanel").show("Check the amount...!");
                $$("txtIncomeAmount").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new income...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: $$("txtIncomeAccount").selectedValue(),
                    income_acc_id: $$("txtIncomeCategory").selectedValue(),
                    amount: $$("txtIncomeAmount").value(),
                    description: $$("txtIncomeDescription").value(),
                    jrn_date: $$("dsIncomeJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    key_1: $$("txtItemSearch").selectedObject.val()
                };
                if ((data1.jrn_date == null || data1.jrn_date == "" || data1.jrn_date == undefined)) {
                    $$("msgPanel").show("Please select date...!");
                }
                else if ((data1.description == null || data1.description == "" || data1.description == undefined)) {
                    $$("msgPanel").show("Please description...!");
                }
                else if ((data1.target_acc_id == null || data1.target_acc_id == "" || data1.target_acc_id == undefined)) {
                    $$("msgPanel").show("Please select account...!");
                }
                else if ((data1.income_acc_id == null || data1.income_acc_id == "" || data1.income_acc_id == undefined)) {
                    $$("msgPanel").show("Please select account...!");
                }

                else if ((data1.amount == null || data1.amount == "" || data1.amount == undefined)) {
                    $$("msgPanel").show("Please enter amount...!");
                }
                else {
                    page.accService.insertIncome(data1, function (response) {
                        page.loadJournal();
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Income entry saved successfully...!");
                        $$("txtIncomeAccount").selectedValue('');
                        $$("txtIncomeCategory").selectedValue('');
                        $$("txtIncomeAmount").val('');
                        $$("txtIncomeDescription").val('');
                        $$("dsIncomeJournalDate").setDate('');
                        $$("msgPanel").hide();
                    })
                }
            }
        }

        page.events.btnNewExpenseSave_click = function () {
            if ($$("txtExpenseAmount").value() == "" || isNaN($$("txtExpenseAmount").value())) {
                $$("msgPanel").show("Check the amount...!");
                $$("txtExpenseAmount").focus();
            }
            else if ($$("txtExpenseAccount").selectedValue() == "-1") {
                $$("msgPanel").show("Please choose the from account...!");
            }
            else if ($$("txtExpenseCategory").selectedValue() == "-1") {
                $$("msgPanel").show("Please choose to account...!");
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new expense...");
                var trans_type1 = "Depit";
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: $$("txtExpenseAccount").selectedValue(),
                    expense_acc_id: $$("txtExpenseCategory").selectedValue(),
                    amount: $$("txtExpenseAmount").value(),
                    description: $$("txtExpenseDescription").value(),
                    jrn_date: $$("dsExpenseJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    key_1: $$("txtItemExpense").selectedObject.val()
                };

                if ((data1.target_acc_id == null || data1.target_acc_id == "" || data1.target_acc_id == undefined) || (data1.expense_acc_id == null || data1.expense_acc_id == "" || data1.expense_acc_id == undefined) || (data1.description == null || data1.description == "" || data1.description == undefined) || (data1.amount == null || data1.amount == "" || data1.amount == undefined) || (data1.jrn_date == null || data1.jrn_date == "" || data1.jrn_date == undefined)) {
                    $$("msgPanel").show("Please enter account, description, amount  and date...!");
                }
                else {
                    page.accService.insertExpense(data1, function (response) {
                        page.loadJournal();
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Expense entry saved successfully!!");
                        $$("txtExpenseAccount").selectedValue('');
                        $$("txtExpenseCategory").selectedValue('');
                        $$("txtExpenseAmount").val('');
                        $$("txtExpenseDescription").val('');
                        $$("dsExpenseJournalDate").setDate('');
                        $$("msgPanel").hide();
                    });
                }
            }
        }

        page.events.btnNewReceiptSave_click = function () {

            if ($$("txtReceiptAmount").value() == "" || isNaN($$("txtReceiptAmount").value())) {
                $$("msgPanel").show("Check the amount...!");
                $$("txtReceiptAmount").focus();
            } else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new receipt...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: $$("txtReceiptAccount").selectedValue(),
                    amount: $$("txtReceiptAmount").value(),
                    key_1: $$("txtReceiptBillNo").value(),
                    description: $$("txtReceiptDescription").value(),
                    jrn_date: $$("dsReceiptJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue()
                };

                if ((data1.target_acc_id == null || data1.target_acc_id == "" || data1.target_acc_id == undefined) || (data1.description == null || data1.description == "" || data1.description == undefined) || (data1.key_1 == null || data1.key_1 == "" || data1.key_1 == undefined) || (data1.amount == null || data1.amount == "" || data1.amount == undefined) || (data1.jrn_date == null || data1.jrn_date == "" || data1.jrn_date == undefined)) {
                    $$("msgPanel").show("Please enter account, description, amount  and date...!");
                }
                else {
                    page.accService.insertReceipt(data1, function (response) {
                        page.loadJournal();
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Receipt entry saved successfully...!");
                        $$("txtReceiptAccount").selectedValue('');
                        $$("txtReceiptAmount").val();
                        $$("txtReceiptBillNo").val();
                        $$("txtReceiptDescription").val();
                        $$("dsReceiptJournalDate").setDate('');
                        $$("msgPanel").hide();
                    });
                }
            }
        }

        page.events.btnNewPaymentSave_click = function () {
            if ($$("txtPaymentAmount").value() == "" || isNaN($$("txtPaymentAmount").value())) {
                $$("msgPanel").show("Check the amount...!");
                $$("txtPaymentAmount").focus();
            } else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new payment...");
                var trans_type1 = "Depit";
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: $$("txtPaymentAccount").selectedValue(),
                    amount: $$("txtPaymentAmount").value(),
                    key_1: $$("txtPaymentBillNo").value(),
                    description: $$("txtPaymentDescription").value(),
                    jrn_date: $$("dsPaymentJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue()
                };

                if ((data1.target_acc_id == null || data1.target_acc_id == "" || data1.target_acc_id == undefined) || (data1.description == null || data1.description == "" || data1.description == undefined) || (data1.key_1 == null || data1.key_1 == "" || data1.key_1 == undefined) || (data1.amount == null || data1.amount == "" || data1.amount == undefined) || (data1.jrn_date == null || data1.jrn_date == "" || data1.jrn_date == undefined)) {
                    $$("msgPanel").show("Please enter account, description, amount, category  and date...!");
                }
                else {
                    page.accService.insertPayment(data1, function (response) {
                        page.loadJournal();
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Payment entry saved successfully!!");
                        $$("txtPaymentAccount").selectedValue('');
                        $$("txtPaymentAmount").val('');
                        $$("txtPaymentBillNo").val('');
                        $$("txtPaymentDescription").val('');
                        $$("dsPaymentJournalDate").setDate('');
                        $$("msgPanel").hide();
                    });
                }
            }
        }

        page.events.btnNewTransferSave_click = function () {
            if ($$("txtTransferBCost").value() == "" || isNaN($$("txtTransferBCost").value())) {
                $$("msgPanel").show("Check the amount...!");
                $$("txtTransferBCost").focus();
            } else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new transfer...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: $$("txtTransferFromAccount").selectedValue(),
                    expense_acc_id: $$("txtTransferToAccount").selectedValue(),
                    amount: $$("txtTransferBCost").value(),
                    description: $$("txtTransferDescription").value(),
                    jrn_date: $$("dsTransferJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue()
                };
                page.finfactsEntry.insertTransfer(data1, function (response) {
                    $$("msgPanel").show("Data inserted successfully...");
                    page.loadJournal();
                });
            }
        }

        page.events.btnNewCashPurchaseSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsCashPurchaseJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsCashPurchaseJournalDate").selectedObject.focus();
            }
            else if ($$("txtCashPurchaseBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtCashPurchaseBillNo").focus();
            }
            //else if ($$("txtCashPurchaseBCost").value() == "") {
            //    $$("msgPanel").show("Enter cost of goods ...!");
            //    $$("txtCashPurchaseBCost").focus();
            //}
            //else if (isNaN(parseFloat($$("txtCashPurchaseBCost").val()))) {
            //    $$("msgPanel").show("Cost of goods should be a number ...!");
            //    $$("txtCashPurchaseBCost").focus();
            //}
            else if ($$("txtCashPurchaseTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtCashPurchaseTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtCashPurchaseTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtCashPurchaseTaxAmt").focus();
            }
            else if ($$("txtCashPurchaseSCost").value() == "") {
                $$("msgPanel").show("Enter total purchase ...!");
                $$("txtCashPurchaseSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtCashPurchaseSCost").val()))) {
                $$("msgPanel").show("Total purchase should be a number ...!");
                $$("txtCashPurchaseSCost").focus();
            }
            else if ($$("txtCashPurchaseRndOff").value() != "" && isNaN(parseFloat($$("txtCashPurchaseRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtCashPurchaseRndOff").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new finfacts entry...");
                var pur_with_tax = parseFloat($$("txtCashPurchaseSCost").val()) + parseFloat($$("txtCashPurchaseTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                    pur_with_tax: parseFloat(pur_with_tax).toFixed(2),
                    pur_with_out_tax: parseFloat($$("txtCashPurchaseSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtCashPurchaseTaxAmt").value()).toFixed(2),
                    buying_cost: parseFloat($$("txtCashPurchaseSCost").val()).toFixed(2),
                    round_off: $$("txtCashPurchaseRndOff").val() == "" ? 0 : parseFloat($$("txtCashPurchaseRndOff").val()).toFixed(2),
                    key_1: $$("txtCashPurchaseBillNo").value(),
                    key_2: $$("txtCashPurchaseCustomerName").selectedObject.val(),
                    description: "Manual - "+$$("txtCashPurchaseDescription").value(),
                    jrn_date: $$("dsCashPurchaseJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                };

                page.finfactsEntry.cashPurchase(data1, function (response) {
                    $$("msgPanel").show("Cash Purchase updated successfully...!");
                    if (page.newSupplier) {
                        var data = {
                            lookup_id: "22",
                            key_value: page.controls.txtCashPurchaseCustomerName.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data,data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Supplier", function (data) {
                                page.supplierList = data;
                            });
                        });
                        page.newSupplier = false;
                    }
                    page.loadJournal();
                });
            }
        }
        page.events.btnNewCashPurchaseBack_click = function () {
            page.loadJournal();
        }
        page.events.btnCreditPurchaseSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsCreditPurchaseJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsCreditPurchaseJournalDate").selectedObject.focus();
            }
            else if ($$("txtCreditPurchaseBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtCreditPurchaseBillNo").focus();
            }
            //else if ($$("txtCreditPurchaseBCost").value() == "") {
            //    $$("msgPanel").show("Enter cost of goods ...!");
            //    $$("txtCreditPurchaseBCost").focus();
            //}
            //else if (isNaN(parseFloat($$("txtCreditPurchaseBCost").val()))) {
            //    $$("msgPanel").show("Cost of goods should be a number ...!");
            //    $$("txtCreditPurchaseBCost").focus();
            //}
            else if ($$("txtCreditPurchaseTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtCreditPurchaseTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtCreditPurchaseTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtCreditPurchaseTaxAmt").focus();
            }
            else if ($$("txtCreditPurchaseSCost").value() == "") {
                $$("msgPanel").show("Enter total purchase ...!");
                $$("txtCreditPurchaseSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtCreditPurchaseSCost").val()))) {
                $$("msgPanel").show("Total purchase should be a number ...!");
                $$("txtCreditPurchaseSCost").focus();
            }
            else if ($$("txtCreditPurchaseRndOff").value() != "" && isNaN(parseFloat($$("txtCreditPurchaseRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtCreditPurchaseRndOff").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting finfacts entry...!");
                var pur_with_tax = parseFloat($$("txtCreditPurchaseSCost").val()) + parseFloat($$("txtCreditPurchaseTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    // target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                    pur_with_tax: parseFloat(pur_with_tax).toFixed(2),
                    pur_with_out_tax: parseFloat($$("txtCreditPurchaseSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtCreditPurchaseTaxAmt").value()).toFixed(2),
                    buying_cost: parseFloat($$("txtCreditPurchaseSCost").val()).toFixed(2),
                    rnd_off: $$("txtCreditPurchaseRndOff").val() == "" ? 0 : parseFloat($$("txtCreditPurchaseRndOff").val()).toFixed(2),
                    key_1: $$("txtCreditPurchaseBillNo").value(),
                    key_2: $$("txtCreditPurchaseCustomerName").selectedObject.val(),
                    description: "Manual - "+$$("txtCreditPurchaseDescription").value(),
                    jrn_date: $$("dsCreditPurchaseJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    
                };

                page.finfactsEntry.creditPurchase(data1, function (response) {
                    $$("msgPanel").show("Credit Purchase updated successfully...!");
                    if (page.newSupplier) {
                        var data = {
                            lookup_id: "22",
                            key_value: page.controls.txtCreditPurchaseCustomerName.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Supplier", function (data) {
                                page.supplierList = data;
                            });
                        });
                        page.newSupplier = false;
                    }
                    page.loadJournal();
                });
            }
        }
        page.events.btnCreditPurchaseBack_click = function () {
            page.loadJournal();
        }
        page.events.btnNewPaymentPurchaseSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsPayPurchasePaymentJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsPayPurchasePaymentJournalDate").selectedObject.focus();
            }
            else if ($$("txtPayPurchaseBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtPayPurchaseBillNo").focus();
            }
            else if ($$("txtPayPurchaseAmount").value() == "") {
                $$("msgPanel").show("Enter amount ...!");
                $$("txtPayPurchaseAmount").focus();
            }
            else if (isNaN(parseFloat($$("txtPayPurchaseAmount").val()))) {
                $$("msgPanel").show("amount should be a number ...!");
                $$("txtPayPurchaseAmount").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new finfacts entry...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                    paid_amount: $$("txtPayPurchaseAmount").value(),
                    description: "Manual - "+$$("txtPayPurchasePaymentDescription").value(),
                    key_1: $$("txtPayPurchaseBillNo").value(),
                    jrn_date: $$("dsPayPurchasePaymentJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    key_2: $$("txtPayPurchaseCustomerName").selectedObject.val()
                };
                page.finfactsEntry.creditPurchasePayment(data1, function (response) {
                    $$("msgPanel").show("Data inserted successfully...");
                    if (page.newSupplier) {
                        var data = {
                            lookup_id: "22",
                            key_value: page.controls.txtPayPurchaseCustomerName.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Supplier", function (data) {
                                page.supplierList = data;
                            });
                        });
                        page.newSupplier = false;
                    }
                    page.loadJournal();
                });
            }
        }

        page.events.btnNewPaymentPurchaseBack_click = function () {
            page.loadJournal();
        }
        page.events.btnReCashPurchaseSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsReCashPurchaseJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsReCashPurchaseJournalDate").selectedObject.focus();
            }
            else if ($$("txtReCashPurchaseBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtReCashPurchaseBillNo").focus();
            }
            //else if ($$("txtReCashPurchaseBCost").value() == "") {
            //    $$("msgPanel").show("Enter cost of goods ...!");
            //    $$("txtReCashPurchaseBCost").focus();
            //}
            //else if (isNaN(parseFloat($$("txtReCashPurchaseBCost").val()))) {
            //    $$("msgPanel").show("Cost of goods should be a number ...!");
            //    $$("txtReCashPurchaseBCost").focus();
            //}
            else if ($$("txtReCashPurchaseTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtReCashPurchaseTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtReCashPurchaseTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtReCashPurchaseTaxAmt").focus();
            }
            else if ($$("txtReCashPurchaseSCost").value() == "") {
                $$("msgPanel").show("Enter total purchase ...!");
                $$("txtReCashPurchaseSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtReCashPurchaseSCost").val()))) {
                $$("msgPanel").show("Total purchase should be a number ...!");
                $$("txtReCashPurchaseSCost").focus();
            }
            else if ($$("txtReCashPurchaseRndOff").value() != "" && isNaN(parseFloat($$("txtReCashPurchaseRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtReCashPurchaseRndOff").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new finfacts entry...");
                var pur_with_tax = parseFloat($$("txtReCashPurchaseSCost").val()) + parseFloat($$("txtReCashPurchaseTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                    pur_with_tax: parseFloat(pur_with_tax).toFixed(2),
                    pur_with_out_tax: parseFloat($$("txtReCashPurchaseSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtReCashPurchaseTaxAmt").val()).toFixed(2),
                    buying_cost: parseFloat($$("txtReCashPurchaseSCost").val()).toFixed(2),
                    round_off: $$("txtReCashPurchaseRndOff").val() == "" ? 0 : parseFloat($$("txtReCashPurchaseRndOff").val()).toFixed(2),
                    key_1: $$("txtReCashPurchaseBillNo").value(),
                    description: "Manual - "+$$("txtReCashPurchaseDescription").value(),
                    jrn_date: $$("dsReCashPurchaseJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    key_2: $$("txtReCashPurchaseCustomerName").selectedObject.val()
                };

                page.finfactsEntry.cashReturnPurchase(data1, function (response) {
                    $$("msgPanel").show("Return cash purchase updated successfully...");
                    if (page.newSupplier) {
                        var data = {
                            lookup_id: "22",
                            key_value: page.controls.txtReCashPurchaseCustomerName.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Supplier", function (data) {
                                page.supplierList = data;
                            });
                        });
                        page.newSupplier = false;
                    }
                    page.loadJournal();
                });
            }
        }
        page.events.btnReCashPurchaseBack_click = function () {
            page.loadJournal();
        }
        page.events.btnReCreditPurchaseSave_click = function () {
            if ($$("ddlCompanyName").selectedValue() == -1 || $$("ddlCompanyName").selectedValue() == null) {
                $$("msgPanel").show("Select company...!");
                $$("ddlCompanyName").selectedObject.focus();
            }
            else if ($$("ddlPeriod").selectedValue() == null || $$("ddlPeriod").selectedValue() == -1) {
                $$("msgPanel").show("Select period...!");
                $$("ddlPeriod").selectedObject.focus();
            }
            else if ($$("dsReCreditPurchaseJournalDate").getDate() == "") {
                $$("msgPanel").show("Select Date...!");
                $$("dsReCreditPurchaseJournalDate").selectedObject.focus();
            }
            else if ($$("txtReCreditPurchaseBillNo").value() == "") {
                $$("msgPanel").show("Enter bill no...!");
                $$("txtReCreditPurchaseBillNo").focus();
            }
            //else if ($$("txtReCreditPurchaseBCost").value() == "") {
            //    $$("msgPanel").show("Enter cost of goods ...!");
            //    $$("txtReCreditPurchaseBCost").focus();
            //}
            //else if (isNaN(parseFloat($$("txtReCreditPurchaseBCost").val()))) {
            //    $$("msgPanel").show("Cost of goods should be a number ...!");
            //    $$("txtReCreditPurchaseBCost").focus();
            //}
            else if ($$("txtReCreditPurchaseTaxAmt").value() == "") {
                $$("msgPanel").show("Enter total tax ...!");
                $$("txtReCreditPurchaseTaxAmt").focus();
            }
            else if (isNaN(parseFloat($$("txtReCreditPurchaseTaxAmt").val()))) {
                $$("msgPanel").show("Total tax should be a number ...!");
                $$("txtReCreditPurchaseTaxAmt").focus();
            }
            else if ($$("txtReCreditPurchaseSCost").value() == "") {
                $$("msgPanel").show("Enter total purchase ...!");
                $$("txtReCreditPurchaseSCost").focus();
            }
            else if (isNaN(parseFloat($$("txtReCreditPurchaseSCost").val()))) {
                $$("msgPanel").show("Total purchase should be a number ...!");
                $$("txtReCreditPurchaseSCost").focus();
            }
            else if ($$("txtReCreditPurchaseRndOff").value() != "" && isNaN(parseFloat($$("txtReCreditPurchaseRndOff").val()))) {
                $$("msgPanel").show("Round Off should be a number ...!");
                $$("txtReCreditPurchaseRndOff").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new finfacts entry...");
                var pur_with_tax = parseFloat($$("txtReCreditPurchaseSCost").val()) + parseFloat($$("txtReCreditPurchaseTaxAmt").val())
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    // target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                    pur_with_tax: parseFloat(pur_with_tax).toFixed(2),
                    pur_with_out_tax: parseFloat($$("txtReCreditPurchaseSCost").value()).toFixed(2),
                    tax_amt: parseFloat($$("txtReCreditPurchaseTaxAmt").val()).toFixed(2),
                    buying_cost: parseFloat($$("txtReCreditPurchaseSCost").val()).toFixed(2),
                    round_off: $$("txtReCreditPurchaseRndOff").val() == "" ? 0 : parseFloat($$("txtReCreditPurchaseRndOff").val()).toFixed(2),
                    key_1: $$("txtReCreditPurchaseBillNo").value(),
                    description: "Manual - " + $$("txtReCreditPurchaseDescription").value(),
                    jrn_date: $$("dsReCreditPurchaseJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    key_2: $$("txtReCreditPurchaseCustomerName").selectedObject.val()
                };

                page.finfactsEntry.creditReturnPurchase(data1, function (response) {
                    $$("msgPanel").show("Return credit purchase updated successfully...!");
                    if (page.newSupplier) {
                        var data = {
                            lookup_id: "22",
                            key_value: page.controls.txtReCreditPurchaseCustomerName.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Supplier", function (data) {
                                page.supplierList = data;
                            });
                        });
                        page.newSupplier = false;
                    }
                    page.loadJournal();
                });
            }
        }
        page.events.btnReCashPurchaseBack_click = function () {
            page.loadJournal();
        }
        page.events.btnNewInventorySave_click = function () {
            if ($$("txtInventoryBillNo").value() == "") {
                $$("msgPanel").show("Enter Bill No...!");
                $$("txtInventoryBillNo").focus();
            }
           else if ($$("txtInventoryBCost").value() == "" ){
                $$("msgPanel").show("Enter amount...!");
                $$("txtInventoryBCost").focus();
            }
            else if (isNaN($$("txtInventoryBCost").value())) {
                $$("msgPanel").show("Amount should be a number...!");
                $$("txtInventoryBCost").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new finfacts entry...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    //target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                    amount: $$("txtInventoryBCost").value(),
                    description: "Manual - " +$$("txtInventoryDescription").value(),
                    key_1: $$("txtInventoryBillNo").value(),
                    jrn_date: $$("dsInventoryJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    invent_type: $$("ddlInventoryType").selectedValue(),
                    //key_2: $$("txtRePayPurchaseCustomerName").value()
                };
                page.accService.insertStock(data1, function (response) {
                        $$("msgPanel").show("Data inserted successfully...");
                        page.loadJournal();
                    });
            }
        }
        page.events.btnRePurchasePayBack_click = function () {
            page.loadJournal();
        };
        page.events.btnRePurchasePaySave_click = function () {
            if ($$("txtRePayPurchaseAmount").value() == "" || isNaN($$("txtRePayPurchaseAmount").value())) {
                $$("msgPanel").show("Amount should be mantatory...!");
                $$("txtRePayPurchaseAmount").focus();
            }
            else {
                //$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting new payment...");
                var data1 = {
                    per_id: $$("ddlPeriod").selectedValue(),
                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                    paid_amount: $$("txtRePayPurchaseAmount").value(),
                    description: "Manual - "+$$("txtRePayPurchasePaymentDescription").value(),
                    key_1: $$("txtRePayPurchaseBillNo").value(),
                    jrn_date: $$("dsRePayPurchasePaymentJournalDate").getDate(),
                    comp_id: $$("ddlCompanyName").selectedValue(),
                    key_2: $$("txtRePayPurchaseCustomerName").selectedObject.val()
                };

                page.finfactsEntry.creditReturnPurchasePayment(data1, function (response) {
                    $$("msgPanel").show("Data inserted successfully...");
                    if (page.newSupplier) {
                        var data = {
                            lookup_id: "22",
                            key_value: page.controls.txtRePayPurchaseCustomerName.selectedObject.val()
                        }
                        page.lookupService.insertLookupValue(data, data.lookup_id, function (data) {
                            page.lookupService.getCustomerLookup("Supplier", function (data) {
                                page.supplierList = data;
                            });
                        });
                        page.newSupplier = false;
                    }
                    page.loadJournal();
                });
            }
        }



        page.events.page_load = function () {

            $(".nav a").click(function () {
                $(".journal-panel > div").hide();
                $(".journal-panel > div[controlid=" + $(this).attr("target") + "]").show();
            });

            $$("msgPanel").show("loading company....");

            
         

            page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                //page.userService.getMyFinfactsCompany(function (res) {
                //    var temp = [];
                //    $(data).each(function (i, item) {
                //        if (res[0].obj_id == item.comp_id) {
                //            temp.push({
                //                comp_id: item.comp_id,
                //                comp_name: item.comp_name
                //            })
                //        }
                //    })
                    $$("ddlCompanyName").dataBind(data, "comp_id", "comp_name");
                    $$("txtExpenseCategory").selectionChange(function () {
                        page.lookupService.getLookupValueByName($$("txtExpenseCategory").selectedData().label, function (data) {
                            page.productList = data;
                            page.controls.txtItemExpense.dataBind({
                                getData: function (term, callback) {
                                    callback(page.productList);
                                }
                            });
                        });

                    })
                    page.events.getDetail_click();
                    page.events.btnMenuShow_click();
               
               
                
            });

            $$("ddlCompanyName").selectionChange(function () {
                page.events.btnMenuShow_click();
                $$("msgPanel").show("Loading ...");
                page.comp_id = $$("ddlCompanyName").selectedValue();
                page.accAccountService.getAccount(page.comp_id, function (data) {
                    page.controls.aclMainAccount.dataBind(data, "acc_id", "acc_name");
                    page.controls.aclTranAccount1.dataBind(data, "acc_id", "acc_name");
                    page.controls.aclTranAccount2.dataBind(data, "acc_id", "acc_name");
                    page.controls.aclTranAccount3.dataBind(data, "acc_id", "acc_name");
                    //page.controls.ddlCashSalesTargetAccount.dataBind(data, "acc_id", "acc_name");
                });
                page.revenueService.getPeriod(page.comp_id, function (data) {
                    $$("ddlPeriod").dataBind(data, "per_id", "per_name", "Select");

                });

                page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                    page.controls.txtIncomeAccount.dataBind(data, "value", "label","Select");
                });

                page.accService.getAutoIncomeAccounts(page.comp_id, function (data) {
                    page.controls.txtIncomeCategory.dataBind(data, "value", "label","Select");
                });

                page.accService.getAutoExpenseAccounts(page.comp_id, function (data) {
                    page.controls.txtExpenseCategory.dataBind(data, "value", "label","Select");
                });

                page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                    page.controls.txtExpenseAccount.dataBind(data, "value", "label","Select");

                });

                page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                    page.controls.txtReceiptAccount.dataBind(data, "value", "label");
                    
                });

                page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                    page.controls.txtPaymentAccount.dataBind(data, "value", "label");
                    $$("msgPanel").hide();
                });

                page.accService.getCashBankAccounts(page.comp_id, function (data) {
                    page.controls.txtTransferFromAccount.dataBind(data, "value", "label");
                    page.controls.txtTransferToAccount.dataBind(data, "value", "label");
                });
                //page.lookupService.getCustomerLookup("Customer", function (data) {
                    //page.controls.txtCashSaleCust.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtCreditSaleCust.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtCreditSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtReCashSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtReCreditSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtReSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                //})
                //page.lookupService.getCustomerLookup("Supplier", function (data) {
                    //page.controls.txtCashPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtCreditPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtPayPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtReCashPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtReCreditPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                    //page.controls.txtRePayPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                //})

                $$("txtIncomeCategory").selectionChange(function () {
                    page.lookupService.getLookupValueByName($$("txtIncomeCategory").selectedData().label, function (data) {
                        page.productList = data;
                        page.controls.txtItemSearch.dataBind({
                            getData: function (term, callback) {
                                callback(page.productList);
                            }
                        });
                    });
                    
                })

                $$("txtExpenseCategory").selectionChange(function () {
                    page.lookupService.getLookupValueByName($$("txtExpenseCategory").selectedData().label, function (data) {
                        page.productList = data;
                        page.controls.txtItemExpense.dataBind({
                            getData: function (term, callback) {
                                callback(page.productList);
                            }
                        });
                    });

                })
                var data = {
                    comp_id: CONTEXT.FINFACTS_COMPANY
                }
                page.companyService.getCompanyById(data, function (data) {
                    page.businessService.getTemplateForComp(data[0].bus_id, function (data) {
                        $(data).each(function (i, item) {
                            if (item.template_name == "Sales") {
                                $$("pnlMenuSale").show();
                            }
                            if (item.template_name == "ManualJournal") {
                                $$("pnlMenuManualJournal").show();
                            }
                            if (item.template_name == "Purchase") {
                                $$("pnlMenuPurchase").show();
                            }
                            if (item.template_name == "Inventory") {
                                $$("pnlMenuInventory").show();
                            }
                            if (item.template_name == "Income") {
                                $$("pnlMenuIncome").show();
                            }
                            if (item.template_name == "Expense") {
                                $$("pnlMenuExpense").show();
                            }
                            if (item.template_name == "Transfer") {
                                $$("pnlMenuTransfer").show();
                            }
                        })
                    })
                })
            });
            $$("grdJournalEntry").hide();
            $$("pnlNewReceipt").hide();
            $$("pnlNewPayment").hide();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").hide();
            $$("pnlNewJournal").hide();
            //$$("pnlJournalAction").hide();
            $$("pnlJournalView").hide();
            $$("grdJournalEntry").hide();

            //Initial Menu
            page.events.btnMenuHide_click();

            $$("ddlPeriod").selectionChange(function () {
                $$("msgPanel").show("Loading...");
                //$$("pnlJournalAction").show();
                $$("pnlJournalView").show();
                $$("grdJournalEntry").show();
                page.per_id = $$("ddlPeriod").selectedValue();
                page.loadJournal();

            })

            $$("grdJournalEntry").rowBound = function (row, item) {
                $(row).css("background-colour", "white");
                $(item.debit).each(function (i, item) {
                    $(row).find("[dataField=acc_name]").children("div").append("<div>" + item.acc_name + "</div>");
                    $(row).find("[dataField=debit_amount]").children("div").append("<div>" + item.amount + "</div>");
                    $(row).find("[dataField=credit_amount]").children("div").append("<div>&nbsp;</div>");
                });
                $(item.credit).each(function (i, item) {
                    $(row).find("[dataField=acc_name]").children("div").append("<div style='margin-left:30px;margin-top:4px;margin-bottom:4px;'>" + item.acc_name + "</div>");
                    $(row).find("[dataField=credit_amount]").children("div").append("<div>" + item.amount + "</div>");
                });
                $(row).find("[dataField=acc_name]").children("div").append("<div>[" + item.description + "]</div>");
            }

            $$("pnlNewReceipt").hide();
            $$("pnlNewPayment").hide();
            $$("pnlNewIncome").hide();
            $$("pnlNewExpense").hide();
            $$("pnlNewJournal").hide();

            //   $$("aclMainAccount").customText("");
            //  $$("aclTranAccount1").customText("");

            page.events.btnNewJournalShowLess_click();

            

            //Design the Journal Grid
            $$("grdJournalEntry").width("100%");
            $$("grdJournalEntry").height("460px");
            if (window.mobile) {
                $$("grdJournalEntry").setTemplate({
                    selection: true, paging: true, pageSize: 50,
                    columns: [
                          //{ 'name': "Date", 'width': "150px", 'dataField': "jrn_date" },
                          { 'name': "Account Name", 'width': "38%", 'dataField': "acc_name", itemTemplate: "<div></div>", filterType: "Text" },
                          { 'name': "Debit", 'width': "23%", 'dataField': "debit_amount", itemTemplate: "<div></div>", filterType: "Text" },
                          { 'name': "Credit", 'width': "23%", 'dataField': "credit_amount", itemTemplate: "<div></div>", filterType: "Text" },
                          //{ 'name': "Action", 'width': "80px", 'dataField': "item_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='Delete' action='Delete' />" }

                    ]
                });
            }
            else {
                $$("grdJournalEntry").setTemplate({
                    selection: true, paging: true, pageSize: 50,
                    columns: [
                          { 'name': "Date", 'width': "150px", 'dataField': "jrn_date" },
                          { 'name': "Account Name", 'width': "440px", 'dataField': "acc_name", itemTemplate: "<div></div>", filterType: "Text" },
                          { 'name': "Debit", 'width': "140px", 'dataField': "debit_amount", itemTemplate: "<div></div>", filterType: "Text" },
                          { 'name': "Credit", 'width': "140px", 'dataField': "credit_amount", itemTemplate: "<div></div>", filterType: "Text" },
                          { 'name': "Action", 'width': "80px", 'dataField': "item_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='Delete' action='Delete' />" }

                    ]
                });
            }

            page.controls.grdJournalEntry.rowCommand = function (e) {
                if (e.action == "Delete") {
                    //$(".detail-info").progressBar("show")
                    $$("msgPanel").show("Deleting journal details...");
                    page.accService.deleteJournal({ jrn_id: e.currentData.jrn_id }, function () {
                        //$(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Journal removed successfully...!");
                        page.controls.grdJournalEntry.deleteRow(e.currentRowId);
                        $$("msgPanel").hide();
                    });
                }
            }

            //Design the Simple Journal Grid
            $$("grdJournalEntrySimple").width("100%");
            $$("grdJournalEntrySimple").height("460px");
            if (window.mobile) {
                $$("grdJournalEntrySimple").setTemplate({
                    selection: true, paging: true, pageSize: 50,
                    columns: [
                       // { 'name': "Date", 'width': "120px", 'dataField': "jrn_date" },
                        { 'name': "From Account", 'width': "30%", 'dataField': "to_acc_name", itemTemplate: "<div></div>" },
                        { 'name': "To Account", 'width': "27%", 'dataField': "from_acc_name", itemTemplate: "<div></div>" },
                        { 'name': "Amount", 'width': "27%", 'dataField': "credit_amount", itemTemplate: "<div></div>" },
                        //  { 'name': "description", 'width': "160px", 'dataField': "description", itemTemplate: "<div></div>" },
                        // { 'name': "Action", 'width': "90px", 'dataField': "item_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='Delete' action='Delete' />" }


                    ]
                });
            }
            else {
                $$("grdJournalEntrySimple").setTemplate({
                    selection: true, paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Date", 'width': "120px", 'dataField': "jrn_date" },
                        { 'name': "From Account", 'width': "440px", 'dataField': "to_acc_name", itemTemplate: "<div></div>" },
                        { 'name': "To Account", 'width': "140px", 'dataField': "from_acc_name", itemTemplate: "<div></div>" },
                        { 'name': "Amount", 'width': "140px", 'dataField': "credit_amount", itemTemplate: "<div></div>" },
                          { 'name': "description", 'width': "160px", 'dataField': "description", itemTemplate: "<div></div>" },
                         { 'name': "Action", 'width': "90px", 'dataField': "item_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='Delete' action='Delete' />" }


                    ]
                });
            }
            $$("grdJournalEntrySimple").rowCommand = function (e) {
                if (e.action == "Delete") {
                    //$(".detail-info").progressBar("show")
                    $$("msgPanel").show("Deleting journal...");
                    page.accService.deleteJournal({ jrn_id: e.currentData.jrn_id }, function () {
                        //  $(".detail-info").progressBar("hide")
                        $$("msgPanel").show("Journal removed successfully...!");
                        $$("grdJournalEntrySimple").deleteRow(e.currentRowId);
                        $$("msgPanel").hide();
                    });
                }
            }
            $$("grdJournalEntrySimple").rowBound = function (row, item) {
                $(row).css("background-color", "white");
                if (item.debit.length > 0)
                    $(row).find("[dataField=from_acc_name]").children("div").html(item.debit[0].acc_name);
                if (item.credit.length > 0)
                    $(row).find("[dataField=to_acc_name]").children("div").html(item.credit[0].acc_name);
                if (item.debit.length > 0)
                    $(row).find("[dataField=credit_amount]").children("div").html(item.debit[0].amount);
                $(row).find("[dataField=description]").children("div").html(item.description);

                //$(item.debit).each(function (i, item) {
                //    $(row).find("[dataField=acc_name]").children("div").append("<div>" + item.acc_name + "</div>");
                //    $(row).find("[dataField=debit_amount]").children("div").append("<div>" + item.amount + "</div>");
                //    $(row).find("[dataField=credit_amount]").children("div").append("<div>&nbsp;</div>");
                //});
                //$(item.credit).each(function (i, item) {
                //    $(row).find("[dataField=acc_name]").children("div").append("<div style='margin-left:30px;margin-top:4px;margin-bottom:4px;'>" + item.acc_name + "</div>");
                //    $(row).find("[dataField=credit_amount]").children("div").append("<div>" + item.amount + "</div>");
                //});
                //$(row).find("[dataField=acc_name]").children("div").append("<div>[" + item.description + "]</div>");
            }


            $$("ddlViewMode").selectionChange(function () {
                if ($$("ddlViewMode").selectedValue() == "Journal Entry Simple") {
                    $$("grdJournalEntry").hide();
                    $$("grdJournalEntrySimple").show();
                    $$("btnSTShowFilter").hide();
                    $$("btnSTHideFilter").hide();
                } else {
                    $$("grdJournalEntry").show();
                    $$("grdJournalEntrySimple").hide();
                    $$("btnSTShowFilter").hide();
                    $$("btnSTHideFilter").hide();
                }
                page.loadJournal();
            });

            $$("ddlViewMode").selectionChange();

            $$("pnlMenuManualJournal").click(function () {
                page.clearEntries();
            })
            $$("pnlMenuSale").click(function () {
                page.clearEntries();
            })
            $$("pnlMenuPurchase").click(function () {
                page.clearEntries();
            })
            $$("pnlMenuInventory").click(function () {
                page.clearEntries();
            })
            $$("pnlMenuIncome").click(function () {
                page.clearEntries();
            })
            $$("pnlMenuExpense").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuCashPurchase").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuCreditPurchase").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuPurchasePayment").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuReturnCashPurchase").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuReturnCreditPurchase").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuReturnPurchasePayment").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuCashSale").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuCreditSale").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuSalePayment").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuReturnCashSale").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuReturnCreditSale").click(function () {
                page.clearEntries();
            });
            $$("pnlMenuReturnSalePayment").click(function () {
                page.clearEntries();
            });

            CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT=168;
            CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT = 168;

            $('a').click(function () {
                $('a').removeClass("active_menu");
                $(this).addClass("active_menu");
            });

            //ToDo: Supplier Code Start
            page.lookupService.getCustomerLookup("Supplier", function (data) {
                page.supplierList = data;
            });
            page.controls.txtCashPurchaseCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.supplierList);
                }
            });
            page.controls.txtCashPurchaseCustomerName.noRecordFound(function (text) {
                page.newSupplier = true;
            });
            page.controls.txtCashPurchaseCustomerName.allowCustomText(function (text) {
                page.controls.txtCashPurchaseCustomerName.selectedObject.val(text.val());
            });

            page.controls.txtCreditPurchaseCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.supplierList);
                }
            });
            page.controls.txtCreditPurchaseCustomerName.noRecordFound(function (text) {
                page.newSupplier = true;
            });
            page.controls.txtCreditPurchaseCustomerName.allowCustomText(function (text) {
                page.controls.txtCreditPurchaseCustomerName.selectedObject.val(text.val());
            });

            page.controls.txtPayPurchaseCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.supplierList);
                }
            });
            page.controls.txtPayPurchaseCustomerName.noRecordFound(function (text) {
                page.newSupplier = true;
            });
            page.controls.txtPayPurchaseCustomerName.allowCustomText(function (text) {
                page.controls.txtPayPurchaseCustomerName.selectedObject.val(text.val());
            });

            page.controls.txtReCashPurchaseCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.supplierList);
                }
            });
            page.controls.txtReCashPurchaseCustomerName.noRecordFound(function (text) {
                page.newSupplier = true;
            });
            page.controls.txtReCashPurchaseCustomerName.allowCustomText(function (text) {
                page.controls.txtReCashPurchaseCustomerName.selectedObject.val(text.val());
            });
            
            page.controls.txtReCreditPurchaseCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.supplierList);
                }
            });
            page.controls.txtReCreditPurchaseCustomerName.noRecordFound(function (text) {
                page.newSupplier = true;
            });
            page.controls.txtReCreditPurchaseCustomerName.allowCustomText(function (text) {
                page.controls.txtReCreditPurchaseCustomerName.selectedObject.val(text.val());
            });

            page.controls.txtRePayPurchaseCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.supplierList);
                }
            });
            page.controls.txtRePayPurchaseCustomerName.noRecordFound(function (text) {
                page.newSupplier = true;
            });
            page.controls.txtRePayPurchaseCustomerName.allowCustomText(function (text) {
                page.controls.txtRePayPurchaseCustomerName.selectedObject.val(text.val());
            });
            //ToDo: Supplier Code End

            //ToDo: Customer Code Start
            page.lookupService.getCustomerLookup("Customer", function (data) {
                page.customerList = data;
            });
            page.controls.txtCashSaleCust.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                }
            });
            page.controls.txtCashSaleCust.noRecordFound(function (text) {
                page.newCustomer = true;
            });
            page.controls.txtCashSaleCust.allowCustomText(function (text) {
                page.controls.txtCashSaleCust.selectedObject.val(text.val());
            });
            
            page.controls.txtCreditSaleCust.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                }
            });
            page.controls.txtCreditSaleCust.noRecordFound(function (text) {
                page.newCustomer = true;
            });
            page.controls.txtCreditSaleCust.allowCustomText(function (text) {
                page.controls.txtCreditSaleCust.selectedObject.val(text.val());
            });
            
            page.controls.txtCreditSalePayCust.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                }
            });
            page.controls.txtCreditSalePayCust.noRecordFound(function (text) {
                page.newCustomer = true;
            });
            page.controls.txtCreditSalePayCust.allowCustomText(function (text) {
                page.controls.txtCreditSalePayCust.selectedObject.val(text.val());
            });
            
            page.controls.txtReCashSalePayCust.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                }
            });
            page.controls.txtReCashSalePayCust.noRecordFound(function (text) {
                page.newCustomer = true;
            });
            page.controls.txtReCashSalePayCust.allowCustomText(function (text) {
                page.controls.txtReCashSalePayCust.selectedObject.val(text.val());
            });
            
            page.controls.txtReCreditSalePayCust.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                }
            });
            page.controls.txtReCreditSalePayCust.noRecordFound(function (text) {
                page.newCustomer = true;
            });
            page.controls.txtReCreditSalePayCust.allowCustomText(function (text) {
                page.controls.txtReCreditSalePayCust.selectedObject.val(text.val());
            });
            
            page.controls.txtReSalePayCust.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                }
            });
            page.controls.txtReSalePayCust.noRecordFound(function (text) {
                page.newCustomer = true;
            });
            page.controls.txtReSalePayCust.allowCustomText(function (text) {
                page.controls.txtReSalePayCust.selectedObject.val(text.val());
            });
            //ToDo: Customer Code End
        }

        page.events.getDetail_click = function () {
            $$("msgPanel").show("Loading ...");
            page.comp_id = $$("ddlCompanyName").selectedValue();
            page.accAccountService.getAccount(page.comp_id, function (data) {
                page.controls.aclMainAccount.dataBind(data, "acc_id", "acc_name");
                page.controls.aclTranAccount1.dataBind(data, "acc_id", "acc_name");
                page.controls.aclTranAccount2.dataBind(data, "acc_id", "acc_name");
                page.controls.aclTranAccount3.dataBind(data, "acc_id", "acc_name");
                //page.controls.ddlCashSalesTargetAccount.dataBind(data, "acc_id", "acc_name");
            });
            page.revenueService.getPeriod(page.comp_id, function (data) {
                $$("ddlPeriod").dataBind(data, "per_id", "per_name");
                $$("msgPanel").show("Loading...");
                //$$("pnlJournalAction").show();
                $$("pnlJournalView").show();
                $$("grdJournalEntry").show();
                page.per_id = $$("ddlPeriod").selectedValue();
                page.loadJournal();
            });

            page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                page.controls.txtIncomeAccount.dataBind(data, "value", "label", "Select");
            });

            page.accService.getAutoIncomeAccounts(page.comp_id, function (data) {
                page.controls.txtIncomeCategory.dataBind(data, "value", "label", "Select");
            });

            page.accService.getAutoExpenseAccounts(page.comp_id, function (data) {
                page.controls.txtExpenseCategory.dataBind(data, "value", "label", "Select");
            });

            page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                page.controls.txtExpenseAccount.dataBind(data, "value", "label", "Select");

            });

            page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                page.controls.txtReceiptAccount.dataBind(data, "value", "label");
                //page.controls.txtTransferFromAccount.dataBind(data, "value", "label");
            });

            page.accService.getAutoAllAccounts(page.comp_id, function (data) {
                page.controls.txtPaymentAccount.dataBind(data, "value", "label");
                $$("msgPanel").hide();
            });

            page.accService.getCashBankAccounts(page.comp_id, function (data) {
                page.controls.txtTransferFromAccount.dataBind(data, "value", "label");
                page.controls.txtTransferToAccount.dataBind(data, "value", "label");
            });
            //page.lookupService.getCustomerLookup("Customer", function (data) {
                //page.controls.txtCashSaleCust.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtCreditSaleCust.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtCreditSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtReCashSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtReCreditSalePayCust.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtReSalePayCust.dataBind(data, "key_value", "key_value", "Select");
            //})
            //page.lookupService.getCustomerLookup("Supplier", function (data) {
                //page.controls.txtCashPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtCreditPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtPayPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtReCashPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtReCreditPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
                //page.controls.txtRePayPurchaseCustomerName.dataBind(data, "key_value", "key_value", "Select");
            //})

            $$("txtIncomeCategory").selectionChange(function () {
                page.lookupService.getLookupValueByName($$("txtIncomeCategory").selectedData().label, function (data) {
                    page.productList = data;
                    page.controls.txtItemSearch.dataBind({
                        getData: function (term, callback) {
                            callback(page.productList);
                        }
                    });
                });

            })
        }
        page.events.btnMenuShow_click = function () {
            page.events.btnMenuHide_click();
            var data = {
                //comp_id: CONTEXT.user_id
                comp_id:$$("ddlCompanyName").selectedValue()
            }
            page.companyService.getCompanyById(data, function (data) {
                page.businessService.getTemplateForComp(data[0].bus_id, function (data) {
                    $(data).each(function (i, item) {
                        if (item.template_name == "Sales") {
                            $$("pnlMenuSale").show();
                        }
                        if (item.template_name == "ManualJournal") {
                            $$("pnlMenuManualJournal").show();
                        }
                        if (item.template_name == "Purchase") {
                            $$("pnlMenuPurchase").show();
                        }
                        if (item.template_name == "Inventory") {
                            $$("pnlMenuInventory").show();
                        }
                        if (item.template_name == "Income") {
                            $$("pnlMenuIncome").show();
                        }
                        if (item.template_name == "Expense") {
                            $$("pnlMenuExpense").show();
                        }
                        if (item.template_name == "Transfer") {
                            $$("pnlMenuTransfer").show();
                        }
                    })
                })
            })
        }
        page.events.btnMenuHide_click = function () {
            $$("pnlMenuSale").hide();
            $$("pnlMenuManualJournal").hide();
            $$("pnlMenuPurchase").hide();
            $$("pnlMenuInventory").hide();
            $$("pnlMenuIncome").hide();
            $$("pnlMenuExpense").hide();
            $$("pnlMenuTransfer").hide();
        }

        page.events.btnSTShowFilter_click = function () {
            $$("grdJournalEntry").showFilter();
            $$("btnSTHideFilter").show();
            $$("btnSTShowFilter").hide();
        }
        page.events.btnSTHideFilter_click = function () {
            $$("grdJournalEntry").clearFilter();
            $$("btnSTHideFilter").hide();
            $$("btnSTShowFilter").show();
        }
    });
}