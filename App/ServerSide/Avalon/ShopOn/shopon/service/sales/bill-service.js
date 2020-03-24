function BillService() {

    this.insertBill = function (bill, callback) {
        var map = new Map();
        if (bill.so_no != undefined) {
            if (bill.so_no == null || bill.so_no == "")
                map.add("so_no", "null");
            else
                map.add("so_no", bill.so_no);
        }
        if (bill.round_off != undefined) {
            if (bill.round_off == null || bill.round_off == "")
                map.add("round_off", "0");
            else
                map.add("round_off", bill.round_off);
        }
        map.add("total", bill.total);
        map.add("sub_total", bill.sub_total);
        map.add("discount", bill.discount);
        map.add("tax", bill.tax);
        if (typeof bill.cust_no != "undefined")
            map.add("cust_no", bill.cust_no);
        if (typeof bill.bill_no_par != "undefined")
            map.add("bill_no_par", bill.bill_no_par);
        //map.add("reg_no", bill.reg_no);
       // map.add("store_no", bill.store_no);
        map.add("user_no", bill.user_no);
        map.add("state_no", bill.state_no);
        map.add("bill_type", bill.bill_type, "Text");
        if (bill.pay_type != undefined) {
            if (bill.pay_type == null || bill.pay_type == "")
                map.add("pay_type", "null");
            else
                map.add("pay_type", bill.pay_type, "Text");
        }
        if (bill.delivered_by != undefined) {
            if (bill.delivered_by == null || bill.delivered_by == "")
                map.add("delivered_by", "null");
            else
                map.add("delivered_by", bill.delivered_by);
        }
        if (bill.expense != undefined) {
            if (bill.expense == null || bill.expense == "")
                map.add("expense", "null");
            else
                map.add("expense", bill.expense);
        }
        map.add("sales_tax_no", bill.sales_tax_no);
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        if (typeof getCookie("user_register_id") != "undefined")
            if (getCookie("user_register_id") == null || getCookie("user_register_id") == "")
                map.add("reg_no", "null");
            else
                map.add("reg_no", getCookie("user_register_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (bill.bill_date != undefined) {
            if (bill.bill_date == null || bill.bill_date == "")
                map.add("bill_date", "null");
            else
                map.add("bill_date", bill.bill_date, "Date");
        }
        if (bill.cust_name != undefined) {
            if (bill.cust_name == null || bill.cust_name == "")
                map.add("cust_name", "null");
            else
                map.add("cust_name", bill.cust_name, "Text");
        }
        if (bill.mobile_no != undefined) {
            if (bill.mobile_no == null || bill.mobile_no == "")
                map.add("mobile_no", "null");
            else
                map.add("mobile_no", bill.mobile_no, "Text");
        }
        if (bill.email_id != undefined) {
            if (bill.email_id == null || bill.email_id == "")
                map.add("email_id", "null");
            else
                map.add("email_id", bill.email_id, "Text");
        }
        if (bill.cust_address != undefined) {
            if (bill.cust_address == null || bill.cust_address == "")
                map.add("cust_address", "null");
            else
                map.add("cust_address", bill.cust_address, "Text");
        }
        if (bill.gst_no != undefined) {
            if (bill.gst_no == null || bill.gst_no == "")
                map.add("gst_no", "null");
            else
                map.add("gst_no", bill.gst_no, "Text");
        }
        if (bill.tot_qty_words != undefined) {
            if (bill.tot_qty_words == null || bill.tot_qty_words == "")
                map.add("tot_qty_words", "null");
            else
                map.add("tot_qty_words", bill.tot_qty_words, "Text");
        }
        return $.server.webMethod("Bill.insertBill", map.toString(), callback);
    };

    this.changeBillType = function (bill, callback) {
        var map = new Map();
        map.add("bill_no", bill.bill_no);
        map.add("state_no", bill.state_no);
        map.add("bill_type", bill.bill_type, "Text");
        map.add("pay_mode", bill.pay_mode, "Text");
        return $.server.webMethod("Bill.updateBill", map.toString(), callback);
    }
    this.getPaymentWise = function (bill, callback) {
        var map = new Map();
        if (bill.cust_no != undefined) {
            map.add("cust_no", bill.cust_no);
        }
        if (bill.bill_type != undefined) {
            map.add("bill_type", bill.bill_type, "Text");
        }
        if (bill.order_id != undefined) {
            map.add("order_id", bill.order_id);
        }
        return $.server.webMethod("Bill.getPaymentWise", map.toString(), callback);
    }
    this.updateBill = function (bill, callback) {
        var map = new Map();
        if (bill.so_no != undefined) {
            if (bill.so_no == null || bill.so_no == "")
                map.add("so_no", "null");
            else
                map.add("so_no", bill.so_no);
        }
        if (bill.round_off != undefined) {
            if (bill.round_off == null || bill.round_off == "")
                map.add("round_off", "0");
            else
                map.add("round_off", bill.round_off);
        }
        if (bill.bill_date != undefined) {
            if (bill.bill_date == null || bill.bill_date == "")
                map.add("bill_date", "null");
            else
                map.add("bill_date", bill.bill_date, "Date");
        }
        map.add("bill_no", bill.bill_no);
        map.add("total", bill.total);
        map.add("sub_total", bill.sub_total);
        map.add("discount", bill.discount);
        map.add("tax", bill.tax);
        if (typeof bill.cust_no != "undefined")
            map.add("cust_no", bill.cust_no);
        if (typeof bill.return_bill_no != "undefined")
            map.add("return_bill_no", bill.return_bill_no);
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        if (typeof getCookie("user_register_id") != "undefined")
            if (getCookie("user_register_id") == null || getCookie("user_register_id") == "")
                map.add("reg_no", "null");
            else
                map.add("reg_no", getCookie("user_register_id"));
        map.add("user_no", bill.user_no);
        map.add("state_no", bill.state_no);
        map.add("bill_type", bill.bill_type, "Text");

        if (typeof bill.delivered_by != "undefined") {
            if (bill.delivered_by == null || bill.delivered_by == "")
                map.add("delivered_by", "null");
            else
                map.add("delivered_by", bill.delivered_by);
        }
        if (bill.cust_name != undefined) {
            if (bill.cust_name == null || bill.cust_name == "")
                map.add("cust_name", "null");
            else
                map.add("cust_name", bill.cust_name, "Text");
        }
        if (bill.mobile_no != undefined) {
            if (bill.mobile_no == null || bill.mobile_no == "")
                map.add("mobile_no", "null");
            else
                map.add("mobile_no", bill.mobile_no, "Text");
        }
        if (bill.email_id != undefined) {
            if (bill.email_id == null || bill.email_id == "")
                map.add("email_id", "null");
            else
                map.add("email_id", bill.email_id, "Text");
        }
        if (bill.cust_address != undefined) {
            if (bill.cust_address == null || bill.cust_address == "")
                map.add("cust_address", "null");
            else
                map.add("cust_address", bill.cust_address, "Text");
        }
        if (bill.gst_no != undefined) {
            if (bill.gst_no == null || bill.gst_no == "")
                map.add("gst_no", "null");
            else
                map.add("gst_no", bill.gst_no, "Text");
        }

        map.add("sales_tax_no", bill.sales_tax_no);
        if (bill.expense != undefined) {
            if (bill.expense == null || bill.expense == "")
                map.add("expense", "null");
            else
                map.add("expense", bill.expense);
        }
        if (bill.tot_qty_words != undefined) {
            if (bill.tot_qty_words == null || bill.tot_qty_words == "")
                map.add("tot_qty_words", "null");
            else
                map.add("tot_qty_words", bill.tot_qty_words, "Text");
        }

        return $.server.webMethod("Bill.updateBill", map.toString(), callback);
    };

    this.saveBill = function (bill, callback) {
        var self = this;
        if (typeof bill.bill_no == "undefined" || bill.bill_no == null || parseInt(bill.bill_no) == 0) {
            self.insertBill(bill, function (data) {
                callback(data[0].key_value);
            });
        } else {
            self.updateBill(bill, function () {
                //Delete all bill items
                self.deleteBillItems(bill.bill_no, function () {
                    callback(bill.bill_no);
                });
            });
        }
    }


    this.deleteBill = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("comp_id", getCookie("user_company_id"));
        map.add("store_no", getCookie("user_store_id"));
        return $.server.webMethod("Bill.deleteBill", map.toString(), callback);
    };


    this.deleteBillItems = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        return $.server.webMethod("Bill.deleteBillItems", map.toString(), callback);
    };
    this.insertBillItem = function (bill, callback) {
        var map = new Map();
        map.add("bill_no", bill.bill_no);
        //map.add("item_no", bill.item_no);
        if (bill.qty != undefined) {
            if (bill.qty == null || (bill.qty == "" && bill.qty != 0))
                map.add("qty", "null");
            else
                map.add("qty", bill.qty);
        }
        if (bill.price != undefined) {
            if (bill.price == null || (bill.price == "" && bill.price != 0))
                map.add("price", "null");
            else
                map.add("price", bill.price);
        }
        if (bill.total_price != undefined) {
            if (bill.total_price == null || (bill.total_price == "" && bill.total_price != 0))
                map.add("total_price", "null");
            else
                map.add("total_price", bill.total_price);
        }
        if (bill.discount != undefined) {
            if (bill.discount == null || bill.discount == "") {
                bill.discount = "0";
                map.add("discount", bill.discount);
            }
            else
                map.add("discount", bill.discount);
        }
        if (bill.tax_per != undefined) {
            if (bill.tax_per == null || bill.tax_per == "") {
                bill.tax_per = "0";
                map.add("tax_per", bill.tax_per);
            }
            else
                map.add("tax_per", bill.tax_per);
        }
        if (typeof (bill.disc_no) != "undefined") // undefined when no discoun is applied
            map.add("disc_no", bill.disc_no);

        if (typeof (bill.tax_class_no) != "undefined")
            map.add("tax_class_no", bill.tax_class_no);
        /* if (bill.qty_returned != undefined) {
             if (bill.qty_returned == null || bill.qty_returned == "")
                 map.add("qty_returned", "null");
             else
                 map.add("qty_returned", bill.qty_returned);
         }*/
        //if (bill.expiry_date != undefined) {
        //    if (bill.expiry_date == null || bill.expiry_date == "")
        //        map.add("expiry_date", "null");
        //    else
        //        map.add("expiry_date", bill.expiry_date, "Date");
        //}
        //if (bill.batch_no != undefined) {
        //    if (bill.batch_no == null || bill.batch_no == "")
        //        map.add("batch_no", "null");
        //    else
        //        map.add("batch_no", bill.batch_no, "Text");
        //}
        if (bill.free_qty != undefined) {
            if (bill.free_qty == null || bill.free_qty == "")
                map.add("free_qty", "null");
            else
                map.add("free_qty", bill.free_qty);
        }

        //if (bill.qty_stock != undefined) {
        //    if (bill.qty_stock == null || bill.qty_stock == "" || isNaN(bill.qty_stock))
        //        map.add("qty_stock", "null");
        //    else
        //        map.add("qty_stock", bill.qty_stock);
        //}

        //if (bill.cost != undefined) {
        //    if (bill.cost == null || bill.cost == "")
        //        map.add("cost", "null");
        //    else
        //        map.add("cost", bill.cost);
        //}
        //if (bill.mrp != undefined) {
        //    if (bill.mrp == null || bill.mrp == "")
        //        map.add("mrp", "null");
        //    else
        //        map.add("mrp", bill.mrp);
        //}
        //if (bill.variation_name != undefined) {
        //    if (bill.variation_name == null || bill.variation_name == "")
        //        map.add("variation_name", "null");
        //    else
        //        map.add("variation_name", bill.variation_name,"Text");
        //}
        if (bill.hsn_code != undefined) {
            if (bill.hsn_code == null || bill.hsn_code == "")
                map.add("hsn_code", "null");
            else
                map.add("hsn_code", bill.hsn_code, "Text");
        }
        if (bill.cgst != undefined) {
            if (bill.cgst == null || bill.cgst == "")
                map.add("cgst", "null");
            else
                map.add("cgst", bill.cgst);
        }
        if (bill.sgst != undefined) {
            if (bill.sgst == null || bill.sgst == "")
                map.add("sgst", "null");
            else
                map.add("sgst", bill.sgst);
        }
        if (bill.igst != undefined) {
            if (bill.igst == null || bill.igst == "")
                map.add("igst", "null");
            else
                map.add("igst", bill.igst);
        }
        if (bill.unit_identity != undefined) {
            if (bill.unit_identity == null || bill.unit_identity == "")
                map.add("unit_identity", "null");
            else
                map.add("unit_identity", bill.unit_identity);
        }
        if (typeof bill.var_no != "undefined") {
            if (bill.var_no == null || (bill.var_no == "" && bill.var_no != 0))
                map.add("var_no", "null");
            else
                map.add("var_no", bill.var_no);
        }

        $.server.webMethod("Bill.insertBillItem", map.toString(), callback);
    };

    this.insertAllBillItems = function (bill_no, i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertBillItem({
                bill_no: bill_no,
                item_no: billItem.item_no,
                qty: billItem.qty,
                qty_returned: billItem.qty_returned,
                price: billItem.price,
                tax_class_no: billItem.tax_class_no,
                tax_per: billItem.tax_per,
                discount: billItem.discount,
                total_price: billItem.total_price,
                mrp: billItem.mrp,
                expiry_date: billItem.expiry_date,
                batch_no: billItem.batch_no,
                qty_stock: billItem.qty_stock,
                free_qty: billItem.free_qty,
                cost: billItem.cost,
                variation_name: billItem.variation_name,
                hsn_code: billItem.hsn_code,
                cgst: billItem.cgst,
                sgst: billItem.sgst,
                igst: billItem.igst,
                unit_identity: billItem.unit_identity,
                var_no: billItem.var_no,
            }, function () {
                self.insertAllBillItems(bill_no, i + 1, billItems, callback);
            });
        }
    }


    this.createAllSales = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.createSales(billItem.cust_no, billItem.item_no, billItem.cost, billItem.qty, billItem.amount, function () {
                self.createAllSales(i + 1, billItems, callback);
            });
        }
    }
    this.payAllPendingBillsMulti = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.payAllPendingBills(billItem.cust_no, billItem.amount, function () {
                self.payAllPendingBillsMulti(i + 1, billItems, callback);
            });
        }
    }


    this.createSales = function (scustNo, sItemNo, sPrice, sQuantity, sTotal, finalCallback) {
        var self = this;


        //Prepare bill data 123
        var newBill = {
            store_no: 1,
            reg_no: 1,
            user_no: 1,

            sub_total: sTotal,
            total: sTotal,
            discount: 0,
            tax: 0,

            bill_type: "Sale",
            cust_no: scustNo,
            state_no: 200, //200 is sales
            sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,

        };

        //Create a new Bill
        self.insertBill(newBill, function (data, callback) {

            var currentBillNo = data[0].key_value

            var allItems = [];
            allItems.push({
                bill_no: currentBillNo,
                item_no: sItemNo,
                qty: sQuantity,
                price: sPrice,
                tax_class_no: 0,
                tax_per: 0,
                discount: 0,
                total_price: sTotal
            });

            //Create all Bill items
            self.insertAllBillItems(currentBillNo, 0, allItems, function (callback) {

                //Prepare inventory data
                var inventItems = [];
                inventItems.push({
                    item_no: sItemNo,
                    cost: sPrice, //why needed
                    qty: sQuantity,
                    vendor_no: scustNo,
                    comments: "",
                    invent_type: "Sale",
                    key1: currentBillNo
                });
                //Make inventory entry
                var inventoryService = new InventoryService();
                inventoryService.insertInventoryItems(0, inventItems, function (callback) {
                    finalCallback();

                });
            });
        });





    }

    this.payAllPendingBills = function (cust_no, payAmount, mycallback) {
        var self = this;

        var msg = "";
        self.getPendingBills(cust_no, function (data) {
            $(data).each(function (i, item) {
                if (payAmount > 0) {   //ex payAmount=150,payAmount=50
                    var balance = parseFloat(item.total) - parseFloat(item.paid);  //balance=100,balance=100
                    var actualPayAmount = balance;  //actualPayAmount=100,actualPayAmount=50
                    if (payAmount < balance)
                        actualPayAmount = payAmount;

                    var billSO = {
                        collector_id: 1,
                        pay_desc: "",
                        amount: actualPayAmount,
                        bill_id: item.bill_no,
                        pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                        pay_type: "Sales"
                    };
                    msg = msg + "Bill No " + item.bill_no + " : " + actualPayAmount + ",";
                    //Pay for the correstponding bill_no
                    var salesService = new SalesService();
                    salesService.payInvoiceBillSalesOrder(billSO, function (data) {


                        var data1 = {
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                            amount: parseFloat(actualPayAmount).toFixed(2),
                            description: "Bill : " + item.bill_no,
                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            key_1: item.bill_no,
                            comp_id: CONTEXT.CompanyName,
                        };

                        var accService = new AccountingService();
                        accService.insertReceipt(data1, function (response) {

                        });

                    });
                    payAmount = payAmount - actualPayAmount;  //payAmount=50,payAmount=0
                }
            });
            mycallback(msg, payAmount);
        });

    }

    this.getAllDiscount = function (callback) {
        return $.server.webMethod("Bill.getAllDiscount", "comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getAllItemDiscount = function (callback) {
        return $.server.webMethod("Bill.getAllItemDiscount", "comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getAllBillDiscount = function (bill_no, callback) {
        return $.server.webMethod("Bill.getAllBillDiscount", "bill_no;" + bill_no + ",comp_id" + getCookie("user_company_id"), callback);
    };


    this.getSalesTaxClass = function (sales_tax_no, callback) {
        return $.server.webMethod("Bill.getSalesTaxClass", "sales_tax_no;" + sales_tax_no + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getAllSalestax = function (callback) {
        return $.server.webMethod("Bill.getAllSalestax", "comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getPendingBills = function (cust_no, callback) {
        $.server.webMethod("Bill.getPendingBills", "cust_no;" + cust_no + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getAllBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllBill", map.toString(), callback);
    };
    this.getAllOneWeekBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllOneWeekBill", map.toString(), callback);
    };
    this.getAllOneMonthBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllOneMonthBill", map.toString(), callback);
    };
    this.getAllOneMonthReturnBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllOneMonthReturnBill", map.toString(), callback);
    };
    this.getAllEMIBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllEMIBill", map.toString(), callback);
    };
    this.getAllSavedBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllSavedBill", map.toString(), callback);
    };
    this.getAllCashBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllCashBill", map.toString(), callback);
    };
    this.getAllCardBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllCardBill", map.toString(), callback);
    };
    this.getAllCouponBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllCouponBill", map.toString(), callback);
    };
    this.getAllPointBill = function (start, end, callback) {
        var map = new Map();
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof start != "undefined")
            if (start == null || start == "")
                map.add("start_record", "null");
            else
                map.add("start_record", start);
        if (typeof end != "undefined")
            if (end == null || end == "")
                map.add("end_record", "null");
            else
                map.add("end_record", end);
        $.server.webMethod("Bill.getAllPointBill", map.toString(), callback);
    }
    this.getBill = function (bill_no, callback) {
        $.server.webMethod("Bill.getBill", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getPayBillByNo = function (bill_no, callback) {
        $.server.webMethod("Bill.getPayBillByNo", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getBillReturn = function (bill_no, callback) {
        $.server.webMethod("Bill.getBillReturn", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getBillSale = function (bill_no, callback) {
        $.server.webMethod("Bill.getBillSale", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getPOAllBill = function (callback) {
        $.server.webMethod("Bill.getPOAllBill", "store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getPOAllOneWeekBill = function (callback) {
        $.server.webMethod("Bill.getPOAllOneWeekBill", "store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getPOAllOneMonthBill = function (callback) {
        $.server.webMethod("Bill.getPOAllOneMonthBill", "store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    //send mail
    this.getAllBillTax = function (callback) {
        $.server.webMethod("Bill.getAllBillTax", "comp_id;" + getCookie("user_company_id"), callback);
    };


    this.getBillItem = function (bill_no, callback) {
        var map = new Map();

        map.add("bill_no", bill_no);
        // map.add("so_no", data.so_no);

        $.server.webMethod("Bill.getBillItem", map.toString(), callback);
    };

    this.getBillPrintSO = function (bill_no, callback) {
        var map = new Map();

        map.add("bill_no", bill_no);
        // map.add("so_no", data.so_no);

        $.server.webMethod("Bill.getBillPrintSO", map.toString(), callback);
    };

    this.getBillPrintPOS = function (bill_no, callback) {
        var map = new Map();

        map.add("bill_no", bill_no);
        // map.add("so_no", data.so_no);

        $.server.webMethod("Bill.getBillPrintPOS", map.toString(), callback);
    };

    this.getBillItemByOrder = function (sales_order_no, callback) {
        $.server.webMethod("Bill.getBillItemByOrder", "sales_order_no;" + sales_order_no, callback);
    };
    this.getBillItemByReturnOrder = function (sales_order_no, callback) {
        $.server.webMethod("Bill.getBillItemByReturnOrder", "sales_order_no;" + sales_order_no, callback);
    };

    this.getBillsByState = function (state, callback) {
        if (state == "All")
            this.getAllBill(callback);
        else
            $.server.webMethod("Bill.getBillsByState", "state_no;" + state, callback);
    };

    this.getAllSODiscount = function (order_id, callback) {
        $.server.webMethod("Bill.getAllSODiscount", "order_id;" + order_id + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getAllBillDiscount = function (bill_no, callback) {
        $.server.webMethod("Bill.getAllBillDiscount", "bill_no;" + bill_no + ",comp_id;" + getCookie("user_company_id"), callback);
    };





    this.insertDiscount = function (data, callback) {
        var map = new Map();

        map.add("disc_no", data.disc_no);
        map.add("bill_no", data.bill_no);
        map.add("value_type", data.value_type, "Text");
        map.add("value", data.value);
        if (typeof (data.item_no) != "undefined")
            map.add("item_no", data.item_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Bill.insertDiscount", map.toString(), callback);

    };

    this.removeAllBillDiscount = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Bill.removeAllBillDiscount", map.toString(), callback);

    };

    this.reinsertBillDisount = function (billNo, discounts) {
        var self = this;
        self.removeAllBillDiscount(billNo, function (data3, callback) {
            $(discounts).each(function (i, data2) {

                var temp = {
                    disc_no: data2.disc_no,
                    bill_no: billNo,
                    value_type: data2.disc_type,
                    value: data2.disc_value,
                    item_no: data2.item_no
                }
                self.insertDiscount(temp, function (data3, callback) {
                });

            });
        });
    }



    this.insertSODiscount = function (data, callback) {
        var map = new Map();

        map.add("disc_no", data.disc_no);
        map.add("order_id", data.order_id);
        map.add("value_type", data.value_type, "Text");
        map.add("value", data.value);
        if (typeof (data.item_no) != "undefined")
            map.add("item_no", data.item_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Bill.insertSODiscount", map.toString(), callback);

    };

    this.removeAllSODiscount = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Bill.removeAllSODiscount", map.toString(), callback);

    };

    this.reinsertSODisount = function (order_id, i, discounts, maincallback) {
        var self = this;


        if (i == discounts.length) {
            maincallback();
        } else {
            var disItem = discounts[i];
            self.insertSODiscount({
                disc_no: disItem.disc_no,
                order_id: order_id,
                value_type: disItem.disc_type,
                value: disItem.disc_value,
                item_no: disItem.item_no
            }, function () {
                self.reinsertSODisount(order_id, i + 1, discounts, maincallback);
            });
        }


        /*
        $(discounts).each(function (i, data2) {

            var temp = {
                disc_no: data2.disc_no,
                order_id: order_id,
                value_type: data2.disc_type,
                value: data2.disc_value,
                item_no: data2.item_no
            }
            self.insertSODiscount(temp, function (data3, callback) {
            });

        });

        */

    }

    this.getBillByNo = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getBillByNo", map.toString(), callback);
    }
    this.getSOByBillNo = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getSOByBillNo", map.toString(), callback);
    }

    

    this.getReturnedBillByNo = function (so_no, bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("so_no", so_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getReturnedBillByNo", map.toString(), function (data) {
            //$(data).each(function (i, item) {
            //    item[item.attr_type1] = item.attr_value1;
            //    item[item.attr_type2] = item.attr_value2;
            //    item[item.attr_type3] = item.attr_value3;
            //    item[item.attr_type4] = item.attr_value4;
            //    item[item.attr_type5] = item.attr_value5;
            //    item[item.attr_type6] = item.attr_value6;
            //});
            callback(data);
        });
    }

    this.getReturnedPOSBillByNo = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getReturnedPOSBillByNo", map.toString(), callback);
    }

    this.getReturnedActiveBillByNo = function (bill_no, callback) {
        var map = new Map();
        map.add("so_no", bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getReturnedActiveBillByNo", map.toString(), callback);
    }
    this.getSalesPrint = function (data, callback) {
        var map = new Map();
        map.add("bill_no", data.bill_no);
        map.add("langcode", CONTEXT.CurrentSecondaryLanguage);
        map.add("comp_id", localStorage.getItem("user_company_id"));
        if (typeof (data.so_no) != "undefined")
            map.add("so_no", data.so_no);
        return $.server.webMethod("Bill.getSalesPrint", map.toString(), callback);
    }
    this.getReturnedBillAmtByNo = function (data, callback) {
        var map = new Map();
        map.add("so_no", data.so_no);
        map.add("bill_no", data.bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getReturnedBillAmtByNo", map.toString(), callback);
    }
    this.getBillBySO = function (so_no, callback) {
        var map = new Map();
        map.add("so_no", so_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getBillBySO", map.toString(), callback);
    }
    this.getAllDeliveyBoy = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Bill.getAllDeliveyBoy", map.toString(), callback);
    }
    this.getActiveDeliveyBoy = function (callback) {
        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Bill.getActiveDeliveyBoy", map.toString(), callback);
    }
    this.updateBillBarcode = function (data, callback) {
        var map = new Map();
        map.add("bill_no", data.bill_no);
        map.add("bill_barcode", data.bill_barcode, "Text");
        return $.server.webMethod("Bill.updateBillBarcode", map.toString(), callback);
    }
    this.getPendingReport = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data.cust_no);
        map.add("bill_type", data.bill_type);
        map.add("store_no", getCookie("user_store_id"));
        if (data.order_id != undefined)
            map.add("order_id", data.order_id);
        map.add("store_no", localStorage.getItem("user_store_no"));
        return $.server.webMethod("Bill.getPendingReport", map.toString(), callback);
    }
    this.getReturnBillByBill = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.getReturnBillByBill", map.toString(), callback);
    }
    this.getBillByReceipt = function (bill_no, callback) {
        $.server.webMethod("Bill.getBillByReceipt", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.updateBillAdvance = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("Bill.updateBillAdvance", map.toString(), callback);
    }
}