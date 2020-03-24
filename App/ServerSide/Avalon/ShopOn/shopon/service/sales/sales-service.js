function SalesService() {

    //Create a new sales order
    this.insertSalesOrder = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data.cust_no);
        map.add("order_no", data.order_no);
        if (data.expected_date!=undefined)
        map.add("expected_date", data.expected_date, "Date");
        map.add("status", 600);
        map.add("shipping_address", data.shipping_address, 'Text');
        map.add("delivery_address", data.delivery_address, 'Text');
        map.add("contact_no", data.contact_no, 'Text');
        map.add("email", data.email, 'Text');
        map.add("company", data.company, 'Text');
        map.add("sales_tax_no", data.sales_tax_no);
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "" || getCookie("user_store_id") == "-free")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("SalesOrder.insertSalesOrder", map.toString(), callback);
    }
    this.getCustomerPortal = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data);
        return $.server.webMethod("SalesOrder.getCustomerPortal", map.toString(), callback);
    }
    this.getTotalSalesDashBoard = function (callback) {
        var map = new Map();
        map.add("store_no", localStorage.getItem("user_store_no"));
        map.add("comp_id", localStorage.getItem("user_company_id"));
        return $.server.webMethod("SalesOrder.getTotalSalesDashBoard", map.toString(), callback);
    }
    this.getStockReorderLevel = function (callback) {
        var map = new Map();
        map.add("store_no", localStorage.getItem("user_store_no"));
        return $.server.webMethod("SalesOrder.getStockReorderLevel", map.toString(), callback);
    }
    this.getRecentSales = function (callback) {
        var map = new Map();
        map.add("store_no", localStorage.getItem("user_store_no"));
        return $.server.webMethod("SalesOrder.getRecentSales", map.toString(), callback);
    }
    this.getHotPrdSalesDashBoard = function (data, callback) {
        var map = new Map();
        map.add("Type", data);
        map.add("store_no", localStorage.getItem("user_store_no"));
        return $.server.webMethod("SalesOrder.getHotPrdSalesDashBoard", map.toString(), callback);
    }
    //Update a sale order
    this.updateBillNo = function (data, callback) {
        var map = new Map();

        map.add("order_id", data.order_id);
        map.add("bill_no", data.bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.updateSalesOrder", map.toString(), callback);
    }
    this.updateReturnBillNo = function (data, callback) {
        var map = new Map();

        map.add("order_id", data.order_id);
        map.add("return_bill_no", data.return_bill_no);
        $.server.webMethod("SalesOrder.updateSalesOrder", map.toString(), callback);
    }
    this.updateSalesOrder = function (data, callback) {
        if (data.jrn_id == undefined) {
            data.jrn_id = -1;
        }
        var map = new Map();

        map.add("order_id", data.order_id);
        if (data.state_no != undefined && data.state_no != "") {
            map.add("state_no", data.state_no);

        }
        if (data.state_text == "Created") {
            map.add("cust_no", data.cust_no);
            map.add("expected_date", data.expected_date, "Date");

            if (data.ordered_date != '')
                map.add("ordered_date", data.ordered_date, "Date");

            map.add("delivery_address", data.delivery_address, 'Text');
            map.add("contact_no", data.contact_no, 'Text');
            map.add("email", data.email, 'Text');
            map.add("company", data.company, 'Text');
            map.add("sales_tax_no", data.sales_tax_no);
            
        }
        else if (data.state_text == "Ordered") {

            if (data.fulfilled_date != undefined) {
                if (data.fulfilled_date == "" || data.fulfilled_date == null)
                    map.add("fulfilled_date", "null");
                else
                    map.add("fulfilled_date", data.fulfilled_date, "Date");
            }
               
            map.add("delivery_address", data.delivery_address, 'Text');
            map.add("contact_no", data.contact_no, 'Text');
            map.add("email", data.email, 'Text');
            map.add("company", data.company, 'Text');

        }
        else if (data.state_text == "Fulfilled") {

            if (data.delivered_date != '')
                map.add("delivered_date", data.delivered_date, "Date");

            map.add("delivery_address", data.delivery_address, 'Text');
            map.add("contact_no", data.contact_no, 'Text');
            map.add("email", data.email, 'Text');
            map.add("company", data.company, 'Text');
        }
        else if (data.state_text == "Delivered") {
            map.add("contact_no", data.contact_no, 'Text');  //Added to just avoid error happening when only one data is saved

            if (data.invoice_paid_date != '')
                map.add("invoice_paid_date", data.invoice_paid_date, "Date");
        }
        else if (data.state_text == "Invoice Paid") {

        }
        else if (data.state_text == "Return") {

        }
        else {

            map.add("bill_no", data.bill_no);
            map.add("jrn_id", data.jrn_id);
        }






        $.server.webMethod("SalesOrder.updateSalesOrder", map.toString(), callback);

    }



    this.orderSalesOrder = function (order_id,ordered_date, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        if (ordered_date != '')
            map.add("ordered_date", ordered_date, "Date");
        $.server.webMethod("SalesOrder.orderSalesOrder", map.toString(), callback);

    }
    this.fulfillSalesOrder = function (order_id,fulfilled_date, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        if (fulfilled_date != '')
            map.add("fulfilled_date", fulfilled_date, "Date");
        else
            map.add("fulfilled_date", $.datepicker.formatDate("dd-mm-yy", new Date()), "Date");

            
        $.server.webMethod("SalesOrder.fulfillSalesOrder", map.toString(), callback);

    }
    this.confirmedSalesOrder = function (order_id,confirm_date, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        if (confirm_date != '')
            map.add("confirm_date", confirm_date, "Date");
        $.server.webMethod("SalesOrder.confirmedSalesOrder", map.toString(), callback);

    }
    this.deliverSalesOrder = function (order_id, delivered_date,callback) {
        var map = new Map();
        map.add("order_id", order_id);
        if (delivered_date != '')
            map.add("delivered_date", delivered_date, "Date");
        else
            map.add("delivered_date", $.datepicker.formatDate("dd-mm-yy", new Date()), "Date");

        $.server.webMethod("SalesOrder.deliverSalesOrder", map.toString(), callback);

    }
    this.invoicePaidSalesOrder = function (order_id,invoice_paid_date, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        if (invoice_paid_date != '')
            map.add("invoice_paid_date", invoice_paid_date, "Date");
        else
            map.add("invoice_paid_date", $.datepicker.formatDate("dd-mm-yy", new Date()), "Date");

        $.server.webMethod("SalesOrder.invoicePaidSalesOrder", map.toString(), callback);

    }
    this.returnSalesOrder = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
       
        $.server.webMethod("SalesOrder.returnSalesOrder", map.toString(), callback);

    }
    this.cancelSalesOrder = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        $.server.webMethod("SalesOrder.cancelSalesOrder", map.toString(), callback);

    }





    var self = this;
    this.getItemAutoComplete = function (term, callback) {
        $.server.webMethod("Item.getItemAutoComplete", "term;%" + term + "%",callback);
    }

    this.getSOs = function (start, end, term, stateNo,orderPeriod, callback) {
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
        if (typeof orderPeriod != "undefined" && orderPeriod != null || orderPeriod != "")
        {
            map.add("orderPeriod", orderPeriod);
            //if(orderPeriod == "1"){
            //    map.add("orderPeriod", "(sot.ordered_date>=DATE_SUB(sysdate(),INTERVAL 0 DAY))", "Text");
            //}
            //if (orderPeriod == "2") {
            //    map.add("orderPeriod", "(sot.ordered_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY))", "Text");
            //}
            //if (orderPeriod == "3") {
            //    map.add("orderPeriod", "(sot.ordered_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY))", "Text");
            //}
        }
            //map.add("orderPeriod", orderPeriod);
        if (stateNo == -1 && term=="") {
            stateNo = '';
            $.server.webMethod("SalesOrder.getOneMonthSO", map.toString(), callback);
        }
        else {
            if (typeof term != "undefined")
                if (term == null || term == "")
                    map.add("term", "%%");
                else
                    map.add("term", "%" + term + "%");
            if (typeof stateNo != "undefined")
                if (stateNo == null || stateNo == "")
                    map.add("stateNo", "null");
                else
                    map.add("stateNo", stateNo);
            if (!isNaN(term))
                map.add("order_no", term);
            $.server.webMethod("SalesOrder.getSalesOrderBySearch", map.toString(), callback);
        }

    }
    this.getSOByNo = function (order_id, callback) {


        var map = new Map();
        map.add("order_id",order_id);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.getSIByNo", map.toString(), callback);
    }
    this.getState = function (callback) {
        var map = new Map();

        $.server.webMethod("SalesOrder.getState", map.toString(), callback);
    };
    this.getSOItems = function (term, callback) {
        
        //$.server.webMethod("SalesOrder.getSalesOrderItems", "order_id;" + term + ",store_no;"+getCookie("user_store_id"), callback);
        $.server.webMethod("SalesOrder.getSalesOrderItems", "order_id;" + term + ",store_no;" + getCookie("user_store_id"), function (data) {
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
    this.updateSendFulfillItems = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        $.server.webMethod("SalesOrder.updateSendFulfillItems", map.toString(), callback);
    }
    //this.getSOItemsByReferenceNo = function (term, callback) {
    //    $.server.webMethod("SalesOrder.getSalesOrderItemsByOrderRefNum", "order_id;" + term + ",store_no;" + getCookie("user_store_id"), function (data) {
    //        callback(data);
    //    });
    //}
   /* this.changeState = function (poNo, stateNo, callback) {
         $.server.webMethod("SalesOrder.changeState", "order_id;" + stateNo + "",callback);
    }*/

  
    this.deleteSalesOrder = function (data,callback) {
        var map = new Map();
        map.add("order_id", data.order_id);
        map.add("bill_no", data.bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.deleteSalesOrder", map.toString(), callback);

    }

    this.deleteSalesOrderItems = function (data,callback) {
        var map = new Map();
        map.add("order_id", data.order_id);
        map.add("order_item_id", data.order_item_id);

        $.server.webMethod("SalesOrder.deleteSalesOrderItems", map.toString(), callback);

    }



    this.payInvoiceBillSalesOrder= function (data, callback) {
        var map = new Map();
        map.add("bill_no", data.bill_no);
        map.add("amount", data.amount);
        map.add("pay_type", data.pay_type,'Text');
        map.add("pay_desc", data.pay_desc,'Text');
        map.add("pay_date", data.pay_date,"Date");
        map.add("collector_id", data.collector_id);

        if (typeof data.pay_mode != "undefined") {
            if(data.pay_mode == null || data.pay_mode == "")
                map.add("pay_mode", "null");
            else
                map.add("pay_mode", data.pay_mode, 'Text');
        }
        if (typeof data.card_type != "undefined") {
            if (data.card_type == null || data.card_type == "")
                map.add("card_type", "null");
            else
                map.add("card_type", data.card_type, 'Text');
        }
        if (typeof data.card_no != "undefined") {
            if (data.card_no == null || data.card_no == "")
                map.add("card_no", "null");
            else
                map.add("card_no", data.card_no, 'Text');
        }
        if (typeof data.coupon_no != "undefined") {
            if (data.coupon_no == null || data.coupon_no == "")
                map.add("coupon_no", "null");
            else
                map.add("coupon_no", data.coupon_no, 'Text');
        }
        if (typeof getCookie("user_store_id") != "undefined") {
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        }
        map.add("comp_id", getCookie("user_company_id"));
        if (typeof data.trans_id != "undefined") {
            if (data.trans_id == null || data.trans_id == "")
                map.add("trans_id", "null");
            else
                map.add("trans_id", data.trans_id);
        }
        if (typeof data.schedule_id != "undefined") {
            if (data.schedule_id == null || data.schedule_id == "")
                map.add("schedule_id", "null");
            else
                map.add("schedule_id", data.schedule_id);
        }

        $.server.webMethod("SalesOrder.payInvoiceBillSalesOrder", map.toString(), callback);

    }


    this.getInvoiceBillDetails= function (bill_id, callback) {


        var map = new Map();
        map.add("bill_id",bill_id);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.getInvoiceBillDetails", map.toString(), callback);
    }

    this.getTransactionDetails = function (order_id, callback) {


        var map = new Map();
        map.add("so_no", order_id);
        map.add("store_no", getCookie("user_store_id"));

        $.server.webMethod("SalesOrder.getTransactionDetails", map.toString(), callback);
    }


    this.getTotalPaidSO= function (bill_no, callback) {


        var map = new Map();
        map.add("bill_no",bill_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.getTotalPaidByBill", map.toString(), callback);
    }

    this.getAllPaymentCollector= function (callback) {

        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.getAllPaymentCollector", map.toString(), callback);
    }
   
    this.completeSalesOrder = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        $.server.webMethod("SalesOrder.completeSalesOrder", map.toString(), callback);

    }

    
    this.deliverPartialSalesOrder = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        $.server.webMethod("SalesOrder.deliverPartialSalesOrder", map.toString(), callback);

    }


    this.deleteSalesOrderItems = function (i,dataList, callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];
            $.server.webMethod("SalesOrder.deleteSalesOrderItems", "order_item_id;" + data.order_item_id + ",order_id;" + data.order_id + "", function () {
                self.deleteSalesOrderItems(i + 1, dataList, callback);
            });
        }

    };
    
    this.updateSalesOrderItems = function (i, dataList,callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];
            var map = new Map();
            var ori_qty;
            var ori_free_qty;
            if (data.qty_type == "Integer")
            {
                ori_qty = parseInt(data.quantity);
                ori_free_qty = parseInt(data.free_qty);
            }
            else {
                ori_qty = parseFloat(data.quantity);
                ori_free_qty = parseFloat(data.free_qty);
            }
            map.add("order_item_id", data.order_item_id);
           // map.add("item_no", data.item_no);
            map.add("order_id", data.order_id);

            if (typeof data.quantity != "undefined") {
                if (data.quantity == null || (data.quantity == "" && data.quantity != 0))
                    map.add("quantity", "null");
                else
                    map.add("quantity", ori_qty);
            }

            if (typeof data.price != "undefined") {
                if (data.price == null || (data.price == "" && data.price != 0))
                    map.add("price", "null");
                else
                    map.add("price", data.price);
            }

            if (typeof data.discount != "undefined") {
                if (data.discount == null || (data.discount == "" && data.discount != 0))
                    map.add("discount", "null");
                else
                    map.add("discount", data.discount);
            }


            if (typeof data.tax_per != "undefined") {
                if (data.tax_per == null || (data.tax_per == "" && data.tax_per != 0))
                    map.add("tax_per", "null");
                else
                    map.add("tax_per", data.tax_per);
            }

            if (typeof data.total_price != "undefined") {
                if (data.total_price == null || (data.total_price == "" && data.total_price != 0) || isNaN(data.total_price))
                    map.add("total_price", "null");
                else
                    map.add("total_price", data.total_price);
            }

            if (typeof data.tax_class_no != "undefined") {
                if (data.tax_class_no == null || (data.tax_class_no == "" && data.tax_class_no != 0))
                    map.add("tax_class_no", "null");
                else
                    map.add("tax_class_no", data.tax_class_no);
            }

            if (typeof data.sales_tax_class_no != "undefined") {
                if (data.sales_tax_class_no == null || (data.sales_tax_class_no == "" && data.sales_tax_class_no != 0))
                    map.add("sales_tax_class_no", "null");
                else
                    map.add("sales_tax_class_no", data.sales_tax_class_no);
            }



            //if (typeof data.tray_id != "undefined") {
            //    if (data.tray_id == null || (data.tray_id == "" && data.tray_id != 0))
            //        map.add("tray_id", "null");
            //    else
            //        map.add("tray_id", data.tray_id);
            //}


            //if (typeof data.tray_count != "undefined") {
            //    if (data.tray_count == null || (data.tray_count == "" && data.tray_count != 0))
            //        map.add("tray_count", "null");
            //    else
            //        map.add("tray_count", data.tray_count);
            //}

            if (typeof data.unit != "undefined") {
                if (data.unit == null || data.unit == "" )
                    map.add("unit", "null");
                else
                    map.add("unit", data.unit,"Text");
            }

            //if (typeof data.mrp != "undefined") {
            //    if (data.mrp == null || (data.mrp == "" && data.mrp != 0))
            //        map.add("mrp", "null");
            //    else
            //        map.add("mrp", data.mrp);
            //}


            //if (typeof data.expiry_date != "undefined") {
            //    if (data.expiry_date == null || data.expiry_date == "" )
            //        map.add("expiry_date", "null");
            //    else
            //        map.add("expiry_date", data.expiry_date, "Date");
            //}

            //if (typeof data.batch_no != "undefined") {
            //    if (data.batch_no == null || data.batch_no == "")
            //        map.add("batch_no", "null");
            //    else
            //        map.add("batch_no", data.batch_no, "Text");
            //}
           
           

            if (typeof data.delivered != "undefined") {
                if (data.delivered == null || data.delivered == "")
                    map.add("delivered", "null");
                else
                    map.add("delivered", data.delivered, "Text");
            }

            if (typeof data.free_qty != "undefined") {
                if (data.free_qty == null || (data.free_qty == "" && data.free_qty != 0))
                    map.add("free_qty", "null");
                else
                    map.add("free_qty", ori_free_qty);
            }

            //if (typeof data.variation_name != "undefined") {
            //    if (data.variation_name == null || (data.variation_name == "" && data.variation_name != 0))
            //        map.add("variation_name", "null");
            //    else
            //        map.add("variation_name", data.variation_name,"Text");
            //}
            if (typeof data.hsn_code != "undefined") {
                if (data.hsn_code == null || (data.hsn_code == "" && data.hsn_code != 0))
                    map.add("hsn_code", "null");
                else
                    map.add("hsn_code", data.hsn_code, "Text");
            }
            if (typeof data.cgst != "undefined") {
                if (data.cgst == null || (data.cgst == "" && data.cgst != 0))
                    map.add("cgst", "null");
                else
                    map.add("cgst", data.cgst);
            }
            if (typeof data.sgst != "undefined") {
                if (data.sgst == null || (data.sgst == "" && data.sgst != 0))
                    map.add("sgst", "null");
                else
                    map.add("sgst", data.sgst);
            }
            if (typeof data.igst != "undefined") {
                if (data.igst == null || (data.igst == "" && data.igst != 0))
                    map.add("igst", "null");
                else
                    map.add("igst", data.igst);
            }
            if (typeof data.unit_identity != "undefined") {
                if (data.unit_identity == null || (data.unit_identity == "" && data.unit_identity != 0))
                    map.add("unit_identity", "null");
                else
                    map.add("unit_identity", data.unit_identity);
            }
            if (typeof data.var_no != "undefined") {
                if (data.var_no == null || (data.var_no == "" && data.var_no != 0))
                    map.add("var_no", "null");
                else
                    map.add("var_no", data.var_no);
            }
            if (typeof data.stock_no != "undefined") {
                if (data.stock_no == null || (data.stock_no == "" && data.stock_no != 0))
                    map.add("stock_no", "0");
                else
                    map.add("stock_no", data.stock_no);
            }
            if (typeof data.sku_no != "undefined") {
                if (data.sku_no == null || (data.sku_no == "" && data.sku_no != 0))
                    map.add("sku_no", "0");
                else
                    map.add("sku_no", data.sku_no);
            }
            if (typeof data.serial_no != "undefined") {
                if (data.serial_no == null || data.serial_no == "") { }
                else
                    map.add("serial_no", data.serial_no, 'Text');
            }

            $.server.webMethod("SalesOrder.updateSalesOrderItems", map.toString(), function () {
                self.updateSalesOrderItems(i + 1, dataList, callback);
            });
        }

     };

    this.insertSalesOrderItems = function (i, dataList, callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];

            var map = new Map();
            var ori_qty;
            var ori_free_qty;
            if (data.qty_type == "Integer") {
                ori_qty = parseInt(data.quantity);
                ori_free_qty = parseInt(data.free_qty);
            }
            else {
                ori_qty = parseFloat(data.quantity);
                ori_free_qty = parseFloat(data.free_qty);
            }
            //map.add("item_no", data.item_no);
            map.add("order_id", data.order_id);


            if (typeof data.quantity != "undefined") {
                if (data.quantity == null || (data.quantity == "" && data.quantity != 0))
                    map.add("quantity", "null");
                else
                    map.add("quantity", ori_qty);
            }

            if (typeof data.price != "undefined") {
                if (data.price == null || (data.price == "" && data.price != 0))
                    map.add("price", "null");
                else
                    map.add("price", data.price);
            }

            if (typeof data.discount != "undefined") {
                if (data.discount == null || (data.discount == "" && data.discount != 0))
                    map.add("discount", "null");
                else
                    map.add("discount", data.discount);
            }


            if (typeof data.tax_per != "undefined") {
                if (data.tax_per == null || (data.tax_per == "" && data.tax_per != 0))
                    map.add("tax_per", "null");
                else
                    map.add("tax_per", data.tax_per);
            }

            if (typeof data.total_price != "undefined") {
                if (data.total_price == null || (data.total_price == "" && data.total_price != 0) || isNaN(data.total_price))
                    map.add("total_price", "0");
                else
                    map.add("total_price", data.total_price);
            }

            if (typeof data.tax_class_no != "undefined") {
                if (data.tax_class_no == null || (data.tax_class_no == "" && data.tax_class_no != 0))
                    map.add("tax_class_no", "null");
                else
                    map.add("tax_class_no", data.tax_class_no);
            }

            if (typeof data.sales_tax_class_no != "undefined") {
                if (data.sales_tax_class_no == null || (data.sales_tax_class_no == "" && data.sales_tax_class_no != 0))
                    map.add("sales_tax_class_no", "null");
                else
                    map.add("sales_tax_class_no", data.sales_tax_class_no);
            }
            //if (typeof data.cost != "undefined") {
            //    if (data.cost == null || (data.cost == "" && data.cost != 0))
            //        map.add("cost", "null");
            //    else
            //        map.add("cost", data.cost);
            //}



            //if (typeof data.tray_id != "undefined") {
            //    if (data.tray_id == null || (data.tray_id == "" && data.tray_id != 0))
            //        map.add("tray_id", "null");
            //    else
            //        map.add("tray_id", data.tray_id);
            //}


            //if (typeof data.tray_count != "undefined") {
            //    if (data.tray_count == null || (data.tray_count == "" && data.tray_count != 0))
            //        map.add("tray_count", "null");
            //    else
            //        map.add("tray_count", data.tray_count);
            //}

            if (typeof data.unit != "undefined") {
                if (data.unit == null || data.unit == "")
                    map.add("unit", "null");
                else
                    map.add("unit", data.unit, "Text");
            }

            //if (typeof data.mrp != "undefined") {
            //    if (data.mrp == null || (data.mrp == "" && data.mrp != 0))
            //        map.add("mrp", "null");
            //    else
            //        map.add("mrp", data.mrp);
            //}


            //if (typeof data.expiry_date != "undefined") {
            //    if (data.expiry_date == null || data.expiry_date == "")
            //        map.add("expiry_date", "null");
            //    else
            //        map.add("expiry_date", data.expiry_date, "Date");
            //}
            //if (typeof data.man_date != "undefined") {
            //    if (data.man_date == null || data.man_date == "")
            //        map.add("man_date", "null");
            //    else
            //        map.add("man_date", data.man_date, "Date");
            //}

            //if (typeof data.batch_no != "undefined") {
            //    if (data.batch_no == null || data.batch_no == "")
            //        map.add("batch_no", "null");
            //    else
            //        map.add("batch_no", data.batch_no, "Text");
            //}
            if (typeof data.delivered != "undefined") {
                if (data.delivered == null || data.delivered == "")
                    map.add("delivered", "null");
                else
                    map.add("delivered", data.delivered, "Text");
            }
            if (typeof data.free_qty != "undefined") {
                if (data.free_qty == null || (data.free_qty == "" && data.free_qty != 0))
                    map.add("free_qty", "null");
                else
                    map.add("free_qty", ori_free_qty);
            }
            //if (typeof data.variation_name != "undefined") {
            //    if (data.variation_name == null || (data.variation_name == "" && data.variation_name != 0))
            //        map.add("variation_name", "null");
            //    else
            //        map.add("variation_name", data.variation_name,"Text");
            //}
            if (typeof data.hsn_code != "undefined") {
                if (data.hsn_code == null || (data.hsn_code == "" && data.hsn_code != 0))
                    map.add("hsn_code", "null");
                else
                    map.add("hsn_code", data.hsn_code, "Text");
            }
            if (typeof data.cgst != "undefined") {
                if (data.cgst == null || (data.cgst == "" && data.cgst != 0))
                    map.add("cgst", "null");
                else
                    map.add("cgst", data.cgst);
            }
            if (typeof data.sgst != "undefined") {
                if (data.sgst == null || (data.sgst == "" && data.sgst != 0))
                    map.add("sgst", "null");
                else
                    map.add("sgst", data.sgst);
            }
            if (typeof data.igst != "undefined") {
                if (data.igst == null || (data.igst == "" && data.igst != 0))
                    map.add("igst", "null");
                else
                    map.add("igst", data.igst);
            }
            if (typeof data.unit_identity != "undefined") {
                if (data.unit_identity == null || (data.unit_identity == "" && data.unit_identity != 0))
                    map.add("unit_identity", "null");
                else
                    map.add("unit_identity", data.unit_identity);
            }
            if (typeof data.var_no != "undefined") {
                if (data.var_no == null || (data.var_no == "" && data.var_no != 0))
                    map.add("var_no", "null");
                else
                    map.add("var_no", data.var_no);
            }
            if (typeof data.stock_no != "undefined") {
                if (data.stock_no == null || (data.stock_no == "" && data.stock_no != 0))
                    map.add("stock_no", "0");
                else
                    map.add("stock_no", data.stock_no);
            }
            if (typeof data.sku_no != "undefined") {
                if (data.sku_no == null || (data.sku_no == "" && data.sku_no != 0))
                    map.add("sku_no", "0");
                else
                    map.add("sku_no", data.sku_no);
            }
            if (typeof data.serial_no != "undefined") {
                if (data.serial_no == null || data.serial_no == "" || data.serial_no == " ") { }
                else
                    map.add("serial_no", data.serial_no, 'Text');
            }

            // $.server.webMethod("SalesOrder.addSalesOrderItems", "item_no;'" + data.item_no + "',order_id;" + data.order_id + ",quantity;" + data.quantity + ",price;" + data.cost + ",discount;" + data.discount + ",tax_per;" + data.tax_per + ",total_price;" + data.total_price + ",tray_count;" + data.tray_count + ",tax_class_no;" + data.tax_class_no + ",unit;" +data.unit + ",mrp;" +data.mrp+",expiry_date;" +data.expiry_date+",batch_no;"+data.batch_no+"", function () {
            $.server.webMethod("SalesOrder.addSalesOrderItems", map.toString(), function () {
                self.insertSalesOrderItems(i + 1, dataList, callback);
            });
        }
    };



    this.getPendingAmount = function (cust_id, callback) {
        var map = new Map();
        map.add("cust_id", cust_id);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.getPendingAmount", map.toString(), callback);

    }
    this.reCreateSO = function (order_id, callback) {
        var map = new Map();
        map.add("order_id", order_id);
        map.add("bill_no", null);
        $.server.webMethod("SalesOrder.getSalesState", map.toString(), callback);

    }

    //TODO : Remove
    this.updateSOItemsRemoveitnot_used = function (i, dataList, callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];
            var map = new Map();
            map.add("order_item_id", data.order_item_id);
            map.add("item_no", data.item_no);
            map.add("order_id", data.order_id);
            map.add("fullfilled", data.fullfilled);
            map.add("delivered", data.delivered);

            $.server.webMethod("SalesOrder.updateSalesOrderItems", map.toString(), function () {
                self.updateSOItems(i + 1, dataList, callback);
            });
        }

    };

    this.payAllInvoiceBillSalesOrder = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.payInvoiceBillSalesOrder(billItem, function () {
                self.payAllInvoiceBillSalesOrder(i + 1, billItems, callback);
            });
        }
    }
    this.insertBillTransaction = function (data, callback) {
        var map = new Map();

        map.add("receive_amount", data.receive_amount);
        map.add("bill_amount", data.bill_amount);
        $.server.webMethod("SalesOrder.insertBillTransaction", map.toString(), callback);
    }
    this.createSalesOrder = function (data, callback) {
        var map = new Map();
        map.add("cust_no", data.cust_no);
        if (data.expected_date != undefined)
            map.add("expected_date", data.expected_date, "Date");
        if (data.ordered_date != undefined)
            map.add("ordered_date", data.ordered_date, "Date");
        map.add("status", data.status);
        map.add("shipping_address", data.shipping_address, 'Text');
        map.add("delivery_address", data.delivery_address, 'Text');
        map.add("contact_no", data.contact_no, 'Text');
        map.add("email", data.email, 'Text');
        map.add("company", data.company, 'Text');
        map.add("sales_tax_no", data.sales_tax_no);
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "" || getCookie("user_store_id") == "-free")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        return $.server.webMethod("SalesOrder.insertSalesOrder", map.toString(), callback);
    }

    this.getStoreBillReport = function (data, callback) {
        var map = new Map();
        map.add("store_no", data);
        $.server.webMethod("SalesOrder.getStoreBillReport", map.toString(), callback);

    }
}



function PrintData(dataList){

    var r=window.open("");
    var doc = r.document;

    var head = false;
    doc.write("<table>");
    $(dataList).each(function (i, data) {
        if (head == false) {
            doc.write("<tr>");
            for (var prop in data) {
                doc.write("<td>" + prop + "</td>");
            }
            doc.write("</tr>");
            head = true;
        }
        doc.write("<tr>");
        for (var prop in data) {
            doc.write("<td>" + data[prop] + "</td>");
        }
        doc.write("</tr>");
    });
    doc.write("</table>");
   
}


