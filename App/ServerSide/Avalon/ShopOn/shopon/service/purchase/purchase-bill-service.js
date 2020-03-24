function PurchaseBillService() {
    var self = this;
    
    this.insertBill = function (bill, callback) {
        var map = new Map();
        //if (bill.po_no != undefined) {
        //    if (bill.po_no == null || bill.po_no == "")
        //        map.add("po_no", "null");
        //    else
        //        map.add("po_no", bill.po_no);
        //}
        if (typeof bill.po_no != undefined)
            if (bill.po_no == null || bill.po_no == "")
                map.add("po_no", "null");
            else
                map.add("po_no", bill.po_no);
        if (typeof bill.bill_date != undefined)
            if (bill.bill_date == null || bill.bill_date == "")
                map.add("bill_date", $.datepicker.formatDate("dd-mm-yy", new Date()),"Date");
            else
                map.add("bill_date", bill.bill_date,"Date");
        map.add("total", bill.total);
        map.add("sub_total", bill.sub_total);
        map.add("discount", bill.discount);
        map.add("tax", bill.tax);

        if (typeof bill.vendor_no != undefined)
            if (bill.vendor_no == null || bill.vendor_no == "")
                map.add("vendor_no", "null");
            else
                map.add("vendor_no", bill.vendor_no);

        //if (typeof bill.return_bill_no != undefined)
        //    if (bill.return_bill_no == null || bill.return_bill_no == "")
        //        map.add("return_bill_no", "null");
        //    else
        //        map.add("return_bill_no", bill.return_bill_no);

        //map.add("reg_no", bill.reg_no);
       // map.add("store_no", bill.store_no);
        map.add("user_no", bill.user_no);
        map.add("state_no", bill.state_no);

        map.add("bill_type", bill.bill_type, "Text");
        //if (bill.pay_type != undefined)
        //    if (bill.pay_type == null || bill.pay_type == "")
        //        map.add("bill.pay_type", "null");
        //    else
        //        map.add("pay_type", bill.pay_type, "Text");

        //map.add("sales_tax_no", bill.sales_tax_no);
        if (typeof bill.pay_mode != undefined)
            if (bill.pay_mode == null || bill.pay_mode == "")
                map.add("pay_mode", "null");
            else
                map.add("pay_mode", bill.pay_mode, "Text");

        if (typeof bill.bill_no_par != undefined)
            if (bill.bill_no_par == null || bill.bill_no_par == "")
                map.add("bill_no_par", "null");
            else
                map.add("bill_no_par", bill.bill_no_par);
        if (bill.round_off != undefined) {
            if (bill.round_off == null || bill.round_off == "")
                map.add("round_off", "0");
            else
                map.add("round_off", bill.round_off);
        }
        //if (typeof getCookie("user_store_id") != "undefined")
        //    if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
        //        map.add("store_no", "null");
        //    else
        //        map.add("store_no", getCookie("user_store_id"));
        //if (typeof getCookie("user_register_id") != "undefined")
        //    if (getCookie("user_register_id") == null || getCookie("user_register_id") == "")
        //        map.add("reg_no", "null");
        //    else
        //        map.add("reg_no", getCookie("user_register_id"));
        //map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("POBill.insertBill", map.toString(), callback);
    };

    this.getPaymentWise = function (bill, callback) {
        var map = new Map();
        if (bill.vendor_no != undefined) {
            map.add("vendor_no", bill.vendor_no);
        }
        if (bill.bill_type != undefined && bill.bill_type != "" && bill.bill_type != null) {
            map.add("bill_type", bill.bill_type, "Text");
        }
        if (bill.bill_no != undefined && bill.bill_no != "" && bill.bill_no != null) {
            map.add("bill_no", bill.bill_no, "Text");
        }
        map.add("store_no", getCookie("user_store_id"));
        return $.server.webMethod("POBill.getPaymentWise", map.toString(), callback);
    }
    //Update a sale order TODO : Not needed. Can get corresponding bill from bill_t itself
    this.updatePurchaseBillNo = function (data, callback) {
        var map = new Map();

        map.add("po_no", data.po_no);
        map.add("po_bill_no", data.po_bill_no);
        $.server.webMethod("POBill.updatePurchaseBillNo", map.toString(), callback);
    }


    this.updateBill = function (bill, callback) {
        var map = new Map();
        map.add("bill_no", bill.bill_no);
        if (typeof bill.bill_date != undefined)
            if (bill.bill_date == null || bill.bill_date == "")
                map.add("bill_date", $.datepicker.formatDate("dd-mm-yy", new Date()), "Date");
            else
                map.add("bill_date", bill.bill_date,"Date");
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
        if (typeof bill.vendor_no != "undefined")
            map.add("vendor_no", bill.vendor_no);
        if (typeof bill.return_bill_no != "undefined")
            map.add("return_bill_no", bill.return_bill_no);
        //map.add("reg_no", bill.reg_no);
        //map.add("store_no", bill.store_no);
        map.add("reg_no", getCookie("user_register_id"));
        map.add("comp_id", getCookie("user_company_id"));
        map.add("user_no", bill.user_no);
        map.add("state_no", bill.state_no);
        map.add("bill_type", bill.bill_type, "Text");
        map.add("store_no", getCookie("user_store_id"));
        //map.add("sales_tax_no", bill.sales_tax_no);

        return $.server.webMethod("POBill.updateBill", map.toString(), callback);
    };

    this.saveBill = function (bill, callback) {
        var self = this;
        if (typeof bill.bill_no == "undefined" || bill.bill_no == "0" || bill.bill_no == null || bill.bill_no=="") {
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
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("POBill.deleteBill", map.toString(), callback);
    };


    this.deleteBillItems = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("POBill.deleteBillItems", map.toString(), callback);
    };
    this.insertBillItem = function (bill, callback) {
        var map = new Map();
        map.add("bill_no", bill.bill_no);
        map.add("item_no", bill.item_no);

        if (bill.qty != undefined)
            if (bill.qty == null || (bill.qty == "" && bill.qty !=0 ))
                map.add("qty", "null");
            else
                map.add("qty", bill.qty);

        //if (bill.qty_returned != undefined)
        //    if (bill.qty_returned == null || bill.qty_returned == "")
        //        map.add("qty_returned", "null");
        //    else
        //        map.add("qty_returned", bill.qty_returned);
        //if (bill.free_item != undefined)
        //    if (bill.free_item == null || (bill.free_item == "" && bill.free_item != 0))
        //        map.add("free_item", "null");
        //    else
        //        map.add("free_item", bill.free_item,"Text");
        if (bill.price != undefined)
            if (bill.price == null || (bill.price == "" && bill.price !=0 ))
                map.add("price", "null");
            else
                map.add("price", bill.price);

        if (bill.total_price != undefined)
            if (bill.total_price == null || (bill.total_price == "" && bill.total_price !=0 ))
                map.add("total_price", "null");
            else
                map.add("total_price", bill.total_price);

        if (bill.disc_val != undefined)
            if (bill.disc_val == null || (bill.disc_val == "" && bill.disc_val !=0 ))
                map.add("disc_val", "null");
            else
                map.add("disc_val", bill.disc_val);

        if (bill.disc_per != undefined)
            if (bill.disc_per == null || (bill.disc_per == "" && bill.disc_per !=0 ))
                map.add("disc_per", "null");
            else
                map.add("disc_per", bill.disc_per);

        if (bill.tax_per != undefined)
            if (bill.tax_per == null || (bill.tax_per == "" && bill.tax_per !=0 ))
                map.add("tax_per", "null");
            else
                map.add("tax_per", bill.tax_per);

        if (bill.free_qty != undefined)
            if (bill.free_qty == null || (bill.free_qty == "" && bill.free_qty != 0))
                map.add("free_qty", "null");
            else
                map.add("free_qty", bill.free_qty);

        //if (bill.variation_name != undefined)
        //    if (bill.variation_name == null || bill.variation_name == ""  || bill.variation_name == "-free")
        //        map.add("variation_name", bill.item_no + "-" + getCookie("user_store_id") + "-" + bill.buying_cost + "-" + bill.mrp + "-" + bill.batch_no + "-" + bill.man_date + "-" + bill.expiry_date + "" + bill.variation_name, "Text");
        //    else
        //        map.add("variation_name", bill.variation_name, "Text");
        //if (bill.free_variation_name != undefined)
        //    if (bill.free_variation_name == null || bill.free_variation_name == "" || bill.variation_name == "-free")
        //        map.add("free_variation_name", bill.item_no + "-" + getCookie("user_store_id") + "-0-" + bill.mrp + "-" + bill.batch_no + "-" + bill.man_date + "-" + bill.expiry_date + "" + bill.variation_name, "Text");
        //    else
        //        map.add("free_variation_name", bill.free_variation_name, "Text");
        if (bill.unit_identity != undefined)
            if (bill.unit_identity == null || (bill.unit_identity == "" && bill.unit_identity != 0))
                map.add("unit_identity", "null");
            else
                map.add("unit_identity", bill.unit_identity);
        //if (bill.man_date != undefined)
        //    if (bill.man_date == null || (bill.man_date == "" && bill.man_date != 0) || bill.man_date=="--")
        //        map.add("man_date", "null");
        //    else
        //        map.add("man_date", bill.man_date, "Date");
    

        //if (bill.mrp != undefined)
        //    if (bill.mrp == null || bill.mrp == "")
        //        map.add("mrp", "null");
        //    else
        //        map.add("mrp", bill.mrp);
        //if (bill.expiry_date != undefined) {
        //    if (bill.expiry_date == null || bill.expiry_date == "")
        //        map.add("expiry_date", "null");
        //    else
        //        map.add("expiry_date", bill.expiry_date,"Date");
        //}
        //if (bill.batch_no != undefined) {
        //    if (bill.batch_no == null || bill.batch_no == "")
        //        map.add("batch_no", "null");
        //    else
        //        map.add("batch_no", bill.batch_no);
        //}
        //if (bill.selling_price != undefined) {
        //    if (bill.selling_price == null || bill.selling_price == "")
        //        map.add("selling_price", "null");
        //    else
        //        map.add("selling_price", bill.selling_price);
        //}
        
      
        //if (typeof (bill.disc_no) != "undefined") // undefined when no discount is applied
        //    map.add("disc_no", bill.disc_no);

        //if (typeof (bill.tax_class_no) != "undefined")
        //    map.add("tax_class_no", bill.tax_class_no);
        if (bill.var_no != undefined)
            if (bill.var_no == null || (bill.var_no == "" && bill.var_no != 0))
                map.add("var_no", "null");
            else
                map.add("var_no", bill.var_no);
        if (bill.free_var_no != undefined)
            if (bill.free_var_no == null || (bill.free_var_no == "" && bill.free_var_no != 0))
                map.add("free_var_no", "null");
            else
                map.add("free_var_no", bill.free_var_no);

        $.server.webMethod("POBill.insertBillItem", map.toString(), callback);
    };

    this.insertAllBillItems = function (bill_no, i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertBillItem(billItem, function () {
                self.insertAllBillItems(bill_no, i + 1, billItems, callback);
            });
        }
    }
    this.updateBillItem = function (bill, callback) {
        var map = new Map();
        map.add("bill_no", bill.bill_no);
        map.add("item_no", bill.item_no);
        map.add("qty", bill.qty);
        if (bill.qty_returned != undefined)
            if (bill.qty_returned == null || bill.qty_returned == "")
                map.add("qty_returned", "null");
            else
                map.add("qty_returned", bill.qty_returned);
        map.add("price", bill.price);
        map.add("total_price", bill.total_price);
        map.add("discount", bill.discount);
        map.add("discount_per", bill.discount_per);
        map.add("mrp", bill.mrp);
        map.add("expiry_date", bill.expiry_date);
        map.add("batch_no", bill.batch_no);
        if (bill.selling_price != undefined) {
            if (bill.selling_price == null || bill.selling_price == "")
                map.add("selling_price", "null");
            else
                map.add("selling_price", bill.selling_price);
        }
        if (bill.qty_delivered != undefined) {
            if (bill.qty_delivered == null || bill.qty_delivered == "")
                map.add("qty_delivered", "null");
            else
                map.add("qty_delivered", bill.qty_delivered);
        }

        map.add("tax_per", bill.tax_per);
        if (typeof (bill.disc_no) != "undefined") // undefined when no discount is applied
            map.add("disc_no", bill.disc_no);

        if (typeof (bill.tax_class_no) != "undefined")
            map.add("tax_class_no", bill.tax_class_no);

        $.server.webMethod("POBill.updateBillItem", map.toString(), callback);
    };
    this.updateAllBillItems = function (bill_no, i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.updateBillItem({
                bill_no: bill_no,
                item_no: billItem.item_no,
                qty: billItem.qty,
                qty_returned: billItem.qty_returned,
                price: billItem.price,
                tax_class_no: billItem.tax_class_no,
                tax_per: billItem.tax_per,
                discount: billItem.discount,
                discount_per: billItem.discount_per,

                total_price: billItem.total_price,
                mrp: billItem.mrp,
                expiry_date: billItem.expiry_date,
                batch_no: billItem.batch_no,
                qty_stock: billItem.qty_stock,
                selling_price: billItem.selling_price,
                qty_delivered: billItem.qty_delivered
            }, function () {
                self.updateAllBillItems(bill_no, i + 1, billItems, callback);
            });
        }
    }


    this.getAllBill = function (callback) {
        $.server.webMethod("POBill.getAllBill", "store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getAllOneWeekBill = function (callback) {
        $.server.webMethod("POBill.getAllOneWeekBill", "store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getAllOneMonthBill = function (callback) {
        $.server.webMethod("POBill.getAllOneMonthBill", "store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getBill = function (bill_no, callback) {
        $.server.webMethod("POBill.getBill", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getBillReturn = function (bill_no, callback) {
        $.server.webMethod("POBill.getBillReturn", "bill_no;" + bill_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getBillItem = function (bill_no, callback) {
        $.server.webMethod("POBill.getBillItem", "bill_no;" + bill_no, callback);
    };

    this.getPOSBillItem = function (bill_no, callback) {
        $.server.webMethod("POBill.getPOSBillItem", "bill_no;" + bill_no, callback);
    };

    this.getBillItemByOrder = function (sales_order_no, callback) {
        $.server.webMethod("POBill.getBillItemByOrder", "sales_order_no;" + sales_order_no, callback);
    };
    this.getBillItemByReturnOrder = function (sales_order_no, callback) {
        $.server.webMethod("POBill.getBillItemByReturnOrder", "sales_order_no;" + sales_order_no, callback);
    };

       this.getBillByNo = function (bill_no, callback) {
        var map = new Map();
        map.add("bill_no", bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("POBill.getBillByNo", map.toString(), callback);
       }
       this.getBillPrintPO = function (bill_no, callback) {
           var map = new Map();
           map.add("bill_no", bill_no);
           return $.server.webMethod("POBill.getBillPrintPO", map.toString(), callback);
       }
       this.getReturnedBillByNo = function (po_no,bill_no, callback) {
           var map = new Map();
           map.add("bill_no", bill_no);
           map.add("po_no", po_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getReturnedBillByNo", map.toString(), callback);
       }
       this.getReturnDeliveryBillByNo = function (po_no, bill_no, callback) {
           var map = new Map();
           map.add("bill_no", bill_no);
           map.add("po_no", po_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getReturnDeliveryBillByNo", map.toString(), callback);
       }

       this.getReturnedActiveBillByNo = function (bill_no, callback) {
           var map = new Map();
           map.add("po_no", bill_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getReturnedActiveBillByNo", map.toString(), callback);
       }
       this.getReturnedBillAmtByNo = function (data, callback) {
           var map = new Map();
           map.add("po_no", data.po_no);
           map.add("bill_no", data.bill_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getReturnedBillAmtByNo", map.toString(), callback);
       }
       this.updateActiveReturn = function (data, callback) {
           var map = new Map();
           map.add("po_no", data.po_no);
           map.add("bill_no", data.bill_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.updateActiveReturn", map.toString(), callback);
       }

       this.getRetItemDet = function (data, callback) {
           var map = new Map();
           if (data.po_no != undefined) {
               if (data.po_no == null || data.po_no == "")
                   map.add("key1", "null");
               else
                   map.add("key1", data.po_no);
           }
           if (data.mrp != undefined) {
               if (data.mrp == null || data.mrp == "")
                   map.add("mrp", "null");
               else
                   map.add("mrp", data.mrp);
           }
           if (data.expiry_date != undefined) {
               if (data.expiry_date == null || data.expiry_date == "")
                   map.add("expiry_date", "null");
               else
                   map.add("expiry_date", data.expiry_date);
           }
           if (data.batch_no != undefined) {
               if (data.batch_no == null || data.batch_no == "")
                   map.add("batch_no", "null");
               else
                   map.add("batch_no", data.batch_no);
           }
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getRetItemDet", map.toString(), callback);
       }
       this.getBillByPO = function (po_no, callback) {
           var map = new Map();
           map.add("po_no", po_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getBillByPO", map.toString(), callback);
       }
       this.getPOAllBill = function (start, end, callback) {
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
           $.server.webMethod("POBill.getAllBill", map.toString(), callback);
       };
       this.getPOAllOneWeekBill = function (start, end, callback) {
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
           $.server.webMethod("POBill.getPOAllOneWeekBill", map.toString(), callback);
       };
       this.getPOAllOneMonthBill = function (start, end, callback) {
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
           $.server.webMethod("POBill.getPOAllOneMonthBill", map.toString(), callback);
       };
       this.getPOAllSavedBill = function (start, end, callback) {
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
           $.server.webMethod("POBill.getPOAllSavedBill", map.toString(), callback);
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
           $.server.webMethod("POBill.getAllOneMonthReturnBill", map.toString(), callback);
       };
       this.getReturnedPOPBillByNo = function (bill_no, callback) {
           var map = new Map();
           map.add("bill_no", bill_no);
           map.add("store_no", getCookie("user_store_id"));
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getReturnedPOPBillByNo", map.toString(), callback);
       }
       this.getPurchasePrint = function (data, callback) {
           var map = new Map();
           map.add("bill_no", data.bill_no);
           if (typeof (data.po_no) != "undefined")
               map.add("po_no", data.po_no);
           return $.server.webMethod("POBill.getPurchasePrint", map.toString(), function (data) {
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
       this.getPendingReport = function (data, callback) {
           var map = new Map();
           map.add("vendor_no", data.vendor_no);
           map.add("bill_type", data.bill_type);
           map.add("store_no", localStorage.getItem("user_store_no"));
           if (typeof data.search_filter != "undefined") {
               if (data.search_filter == null || data.search_filter == "") {
                   map.add("search_filter", "%%");
                   map.add("filter", "all");
               }
               else {
                   map.add("search_filter", "%" + data.search_filter + "%","Text");
                   if (isNaN(data.search_filter)) {
                       map.add("filter", "text");
                   }
                   else {
                       map.add("filter", "number");
                   }
               }
           }
           //if (typeof data.search_filter != "undefined" && data.search_filter != "" && data.search_filter != null) {
           //    map.add("search_filter", data.search_filter, "Text");
           //}
           return $.server.webMethod("POBill.getPendingReport", map.toString(), callback);
       }
       this.getReturnBillByBill = function (bill_no, callback) {
           var map = new Map();
           map.add("bill_no", bill_no);
           map.add("comp_id", getCookie("user_company_id"));
           return $.server.webMethod("POBill.getReturnBillByBill", map.toString(), callback);
       }
}