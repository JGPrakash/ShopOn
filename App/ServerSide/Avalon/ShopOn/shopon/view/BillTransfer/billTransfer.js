var global_sales_bill_no = 1;
var global_purchase_bill_no = 1;
$.fn.billTransfer = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.doctorService = new DoctorService();
        page.purchaseBillService = new PurchaseBillService();
        page.stockAPI = new StockAPI();
        page.finfactsEntry = new FinfactsEntry();
        page.billService = new BillService();
        $("body").keydown(function (e) {

        });
        page.events = {
            page_load: function () {
            }
        };
        page.events.btnUploadPurchaseBill_click = function () {
            $$("msgPanel").show("Updating Bill...");
            page.events.btnUploadPurchase_click();
        }
        page.events.btnUploadPurchase_click = function () {
            page.updatePurchase(function (data) {
                getAllPurchaseBill(function (data) {
                    if (data.length != 0) {
                        page.events.btnUploadPurchase_click();
                    }
                });
            });
        };
        page.updatePurchase = function (callback) {
            getPurchaeBillDetails(global_purchase_bill_no, function (billDetails) {
                if (billDetails.bill_items.length != 0) {
                    var newBill = {
                        bill_no: "0",
                        bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        store_no: 1,
                        user_no: CONTEXT.user_no,

                        sub_total: billDetails.sub_total,
                        total: billDetails.total,
                        discount: billDetails.discount,
                        tax: billDetails.tax,

                        bill_type: billDetails.state_text,
                        state_no: (billDetails.state_text == "Purchase") ? "904" : "100",
                        pay_mode: "Cash",
                        round_off: (billDetails.round_off == null) ? "0" : billDetails.round_off,
                        sales_tax_no: "1",
                        mobile_no: billDetails.vendor_phone,
                        email_id: billDetails.vendor_email,
                        gst_no: billDetails.gst_no,

                        tot_qty_words: "",

                        bill_no_par: "",
                        vendor_no: billDetails.vendor_no == null ? "-1" : billDetails.vendor_no,
                        vendor_name: billDetails.vendor_name,
                        vendor_address: billDetails.vendor_address,
                        //FINFACTS ENTRY DATA
                        invent_type: "PurchaseCredit",
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        //fulfill:true
                    };
                    var rbillItems = [];
                    $(billDetails.bill_items).each(function (i, billItem) {
                        if (parseFloat(billItem.qty) > 0) {
                            rbillItems.push({
                                qty: parseFloat(billItem.qty),
                                free_qty: (billItem.free_qty == null) ? 0 : parseFloat(billItem.free_qty),
                                unit_identity: billItem.unit_identity,
                                price: parseFloat(billItem.cost).toFixed(5),
                                disc_val: billItem.disc_val,
                                disc_per: billItem.disc_per,
                                taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                                tax_per: billItem.tax_per,
                                total_price: billItem.total_price,
                                bill_type: billDetails.state_text,

                                tray_received: "0",
                                selling_price: null,
                                valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                free_selling_price: null,

                                store_no: getCookie("user_store_id"),
                                item_no: billItem.item_no,
                                cost: (billItem.cost == null) ? "0" : billItem.cost,

                                vendor_no: billDetails.vendor_no == null ? "-1" : billDetails.vendor_no,
                                active: "1",
                                tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                                amount: parseFloat(billItem.cost) * parseFloat(billItem.qty),

                                rate: billItem.cost
                            });
                        }
                        if (typeof billItem.var_no != "undefined" && billItem.var_no != "" && billItem.var_no != null && parseInt(billItem.var_no) != 0)
                            rbillItems[rbillItems.length - 1].var_no = billItem.var_no;
                        if (typeof billItem.variation_name != "undefined" && billItem.variation_name != "" && billItem.variation_name != null)
                            rbillItems[rbillItems.length - 1].variation_name = billItem.variation_name;
                        if (typeof billItem.free_var_no != "undefined" && billItem.free_var_no != "" && billItem.free_var_no != null)
                            rbillItems[rbillItems.length - 1].free_var_no = billItem.free_var_no;
                        if (CONTEXT.ENABLE_EXP_DATE) {
                            if (billItem.expiry_date == undefined || billItem.expiry_date == null || billItem.expiry_date == "" || billItem.expiry_date == "--") { }
                            else {
                                rbillItems[rbillItems.length - 1].expiry_date = dbDateTime(billItem.expiry_date);
                            }
                        }
                        if (CONTEXT.ENABLE_MAN_DATE) {
                            if (billItem.man_date == undefined || billItem.man_date == null || billItem.man_date == "" || billItem.man_date == "--") { }
                            else {
                                rbillItems[rbillItems.length - 1].man_date = dbDateTime(billItem.man_date);
                            }
                        }
                        if (CONTEXT.ENABLE_MRP) {
                            if (billItem.mrp == undefined || billItem.mrp == null || billItem.mrp == "") { }
                            else {
                                rbillItems[rbillItems.length - 1].mrp = billItem.mrp;
                            }
                        }
                        if (CONTEXT.ENABLE_BAT_NO) {
                            if (billItem.batch_no == undefined || billItem.batch_no == null || billItem.batch_no == "") { }
                            else {
                                rbillItems[rbillItems.length - 1].batch_no = billItem.batch_no;
                            }
                        }
                        if (CONTEXT.SHOW_FREE && CONTEXT.ENABLE_FREE_VARIATION) {
                            if (billItem.free_var_no == undefined || billItem.free_var_no == null || billItem.free_var_no == "") { }
                            else {
                                rbillItems[rbillItems.length - 1].free_var_no = billItem.free_var_no;
                            }
                        }
                    });
                    newBill.bill_items = rbillItems;
                    var billSO = [];
                    $(billDetails.payments).each(function (i, item) {
                        billSO.push({
                            collector_id: CONTEXT.user_no,
                            pay_desc: "POP Bill Payment",
                            amount: item.amount,
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_type: "Purchase",
                            pay_mode: item.pay_mode,
                            store_no: getCookie("user_store_id"),
                            card_type: null,
                            card_no: null
                        });
                    });
                    newBill.payments = billSO;
                    var expense = [];
                    newBill.expenses = expense;
                    if (billDetails.state_text == "Purchase") {
                        page.stockAPI.insertBill(newBill, function (data) {
                            currentBillNo = data;
                            $$("msgPanel").show("Bill Inserted Successfully");
                            $$("msgPanel").show("Updating Payments...");

                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                var p_with_tax = (parseFloat(billDetails.sub_total) - parseFloat(billDetails.discount));//- parseFloat($$("lblRndOff").value());
                                if (billDetails.state_text == "Purchase") {
                                    var data1 = {
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        description: "POP-" + currentBillNo,
                                        target_acc_id: (billDetails.state_text == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
                                        tax_amt: parseFloat(billDetails.tax).toFixed(5),
                                        buying_cost: parseFloat(billDetails.sub_total) - parseFloat(billDetails.discount),
                                        round_off: (billDetails.round_off == null) ? "0" : billDetails.round_off,
                                        key_1: currentBillNo,
                                        key_2: billDetails.vendor_no

                                    };
                                    page.finfactsEntry.cashPurchase(data1, function (response) {
                                        $$("msgPanel").show("POP payment is recorded successfully.");
                                        $$("msgPanel").hide();
                                        callback(global_purchase_bill_no);
                                    });
                                }
                                else {
                                    $$("msgPanel").show("POP payment is recorded successfully.");
                                    //callback(currentBillNo);
                                    $$("msgPanel").hide();
                                    callback(global_purchase_bill_no);
                                }
                            } else {
                                $$("msgPanel").show("POP payment is recorded successfully.");
                                //callback(currentBillNo);
                                $$("msgPanel").hide();
                                callback(global_purchase_bill_no);
                            }

                        });
                    }
                    else {
                        callback(global_purchase_bill_no);
                    }
                }
                else {
                    callback(global_purchase_bill_no);
                }
            }, function (data) {
                alert("Error Occured Please Try Again Later!!!");
                callback(global_purchase_bill_no);
            });
        }

        
        page.events.btnUploadSalesBill_click = function () {
            $$("msgPanel").show("Updating Bill...");
            page.events.btnUploadSales_click();
        }
        page.events.btnUploadSales_click = function () {
            page.updateSales(function (data) {
                getAllSaleBill(function (data) {
                    if (data.length != 0) {
                        page.events.btnUploadSales_click();
                    }
                });
            });
        };
        page.updateSales = function (callback) {

            getSaleBillDetails(global_sales_bill_no, function (billDetails) {

                if (billDetails.bill_items.length != 0) {
                    var buying_cost = 0;
                    var cus_name = billDetails.cust_name;
                    (billDetails.state_text == "Return") ? billDetails.state_text = "SaleReturn" : billDetails.state_text = "Sale";
                    var newBill = {
                        bill_no: "0",
                        bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        store_no: "1",
                        user_no: "1",

                        sub_total: billDetails.sub_total,
                        round_off: billDetails.round_off,
                        total: billDetails.total,
                        discount: billDetails.discount,
                        tax: billDetails.tax,

                        bill_type: billDetails.state_text,
                        state_no: billDetails.state_text == "SaleSaved" ? "100" : billDetails.state_text == "Sale" ? "200" : "300",
                        sales_tax_no: billDetails.sales_tax_no,
                        delivered_by: "-1",
                        expense: "",
                        cust_no: billDetails.cust_no,
                        cust_name: billDetails.cust_name,
                        mobile_no: billDetails.phone_no,
                        email_id: "",
                        cust_address: billDetails.address,
                        gst_no: billDetails.gst_no,
                        tot_qty_words: "",
                        bill_no_par: "",
                        pay_mode: "Cash",
                        bill_barcode: "",//Check It
                        sales_executive: "",
                        //FINFACTS ENTRY DATA
                        invent_type: "SaleCredit",
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        advance_amount: "",
                        advance_status: "",
                        adv_end_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        //fulfill: true,
                    };
                    var rbillItems = [];
                    $(billDetails.bill_items).each(function (i, billItem) {
                        billItem.free_qty == null ? billItem.free_qty = 0 : billItem.free_qty = billItem.free_qty;
                        rbillItems.push({
                            var_no: billItem.var_no,
                            qty: parseFloat(billItem.qty),
                            free_qty: (billItem.free_qty == null) ? 0 : parseFloat(billItem.free_qty),
                            unit_identity: billItem.unit_identity,
                            price: billItem.price,
                            discount: billItem.discount,
                            taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                            tax_per: billItem.tax_per,
                            total_price: billItem.total_price,
                            price_no: "0",
                            bill_type: billDetails.state_text,
                            tax_class_no: billItem.tax_class_no,
                            sub_total: parseFloat(billItem.total_price),

                            hsn_code: billItem.hsn_code,
                            cgst: billItem.cgst,//parseFloat(billItem.tax_per / 2),
                            sgst: billItem.sgst,//parseFloat(billItem.tax_per / 2),
                            igst: billItem.igst,
                            tray_received: "0",
                            cost: billItem.cost,
                            amount: parseFloat(billItem.cost) * parseFloat(billItem.qty)
                        });
                        buying_cost = parseFloat(buying_cost) + (parseFloat(billItem.cost) * (parseFloat(billItem.qty)));
                    });
                    newBill.bill_items = rbillItems;
                    var billSO = [];
                    var rewardSo = [];
                    var reward_amount = 0;
                    $(billDetails.payments).each(function (i, item) {
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: item.amount,
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: item.pay_mode,
                            store_no: getCookie("user_store_id"),
                            card_type: "",
                            card_no: "",
                            coupon_no: ""
                        });
                    });
                    newBill.payments = billSO;
                    newBill.reward = rewardSo;
                    newBill.discounts = [];
                    var expense = [];
                    newBill.expenses = expense;
                    //Insert Bill
                    if (billDetails.state_text == "Sale") {
                        page.stockAPI.insertBill(newBill, function (data) {
                            $$("msgPanel").flash("Bill Is Created....");
                            var currentBillNo = data;

                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                // page.inventoryService.insertStocks(0,newBill.bill_items,currentBillNo, function (temp) { });
                                if (billDetails.state_text == "Sale") {
                                    var s_with_tax = (parseFloat(billDetails.sub_total) - parseFloat(billDetails.discount));
                                    var data1 = {
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        description: "POS-" + currentBillNo,
                                        target_acc_id: "168",//CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                                        tax_amt: parseFloat(billDetails.tax).toFixed(5),
                                        buying_cost: buying_cost,
                                        round_off: billDetails.round_off,
                                        key_1: currentBillNo,
                                        key_2: billDetails.cust_no,

                                    };
                                    $$("msgPanel").show("Updating Finfacts...");
                                    page.finfactsEntry.cashSales(data1, function (response) {
                                        $$("msgPanel").show("POS payment is recorded successfully.");
                                        $$("msgPanel").hide();
                                        callback(global_sales_bill_no);
                                    });
                                }
                                else {
                                    callback(global_sales_bill_no);
                                }
                            } else {
                                $$("msgPanel").show("POS payment is recorded successfully.");
                                $$("msgPanel").hide();
                                //global_sales_bill_no++;
                                callback(global_sales_bill_no);
                            }
                        });
                    }
                    else {
                        callback(global_sales_bill_no);
                    }
                }
                else {
                    //global_sales_bill_no++;
                    callback(global_sales_bill_no);
                }
            });
        }
    });
}
getAllPurchaseBill = function (callback) {
    global_purchase_bill_no = global_purchase_bill_no + 1;
    localWebMethod("POBill.getAllBill", "bill_no;" + global_purchase_bill_no + ",store_no;" + 1 + ",comp_id;" + 1, callback);
};
getPurchaeBillDetails = function (bill_no, callback, errorCallback) {
    localWebMethodGET("purchase/bill/" + bill_no, callback, errorCallback);
};
getAllSaleBill = function (callback) {
    global_sales_bill_no = global_sales_bill_no + 1;
    localWebMethod("Bill.getAllBill", "bill_no;" + global_sales_bill_no + ",store_no;" + 1 + ",comp_id;" + 1, callback);
};
getSaleBillDetails = function (bill_no, callback, errorCallback) {
    localWebMethodGET("sale/bill/" + bill_no, callback, errorCallback);
};
function localWebMethod(methodName, inputData, callback, error, context) {
        var result = "";
        $.server.ASYNCACHE[$.server.ASYNCOUNTER] = context;
        $.ajax({
            type: "POST",

            url: "http://localhost:8080/ShopOnSourceWebSplit/DataServiceApp.jsp" + "?user_id=1&id=" + $.server.ASYNCOUNTER,
            data: {
                'user_id': '1',
                methodName: methodName,
                methodParam: inputData
            },
            xhrFields: {
                withCredentials: true
            },
            async: true, crossDomain: true,
            success: function (items) {
                items = JSON.parse(items);
                var cnt = $.util.queryString("id", this.url);
                var obj = $.server.ASYNCACHE[cnt];
                result = items;
                delete $.server.ASYNCACHE[cnt];
                if (typeof callback !== "undefined")
                    callback(result, obj);
            },
            error: function (err) {
                if (typeof AsyncError !== "undefined")
                    AsyncError(err.responseJSON);
                var cnt = $.util.queryString("id", this.url);
                delete $.server.ASYNCACHE[cnt];
                if (typeof error !== "undefined")
                    error(JSON.parse(err.responseText));


            }
        });
        $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;
}
function localWebMethodGET(methodName, callback, errorCallback) {
    var mainurl = "http://localhost:8080/ShopOnSourceRestAPI/api/v1/";
    var result = "";
    $.ajax({
        type: "GET",
        url: mainurl + methodName,
        async: true,
        headers: {
            "auth-token": "91dd9bc2-894f-11e7-8df1-0767ee757e1a",
            comp_id: "1"

        },
        success: function (items) {
            items = JSON.parse(items);
            var cnt = $.util.queryString("id", this.url);
            var obj = $.server.ASYNCACHE[cnt];
            result = items;
            delete $.server.ASYNCACHE[cnt];
            if (typeof callback !== "undefined")
                callback(result, obj);
        },
        error: function (err) {
            if (typeof AsyncError !== "undefined")
                AsyncError(err.responseJSON);
            var cnt = $.util.queryString("id", this.url);
            delete $.server.ASYNCACHE[cnt];
            if (typeof error !== "undefined")
                error(JSON.parse(err.responseText));
        }
    });
    $.server.ASYNCOUNTER = $.server.ASYNCOUNTER + 1;

}