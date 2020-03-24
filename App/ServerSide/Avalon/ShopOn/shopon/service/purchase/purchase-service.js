function PurchaseService() {
    var self = this;


    this.getItemAutoComplete = function (term, callback) {
        $.server.webMethod("Item.getItemAutoComplete", "term;%" + term + "%,comp_id;" + getCookie("user_company_id"), callback);
    }

    this.getPOs = function (start, end, term, stateNo, orderPeriod, callback) {
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
        if (stateNo == -1) {
            stateNo = '';
        }
        if (typeof term != "undefined") {
            if (term == null || term == ""){
                map.add("term", "%%");
                map.add("filter", "all");
            }
            else {
                map.add("term", "%" + term + "%");
                if (isNaN(term)) {
                    map.add("filter", "text");
                }
                else {
                    map.add("filter", "number");
                }
            }
        }
        if (typeof stateNo != "undefined")
            if (stateNo == null || stateNo == "")
                map.add("stateNo", "");
            else
                map.add("stateNo", stateNo);
        if (typeof orderPeriod != "undefined" && orderPeriod != null || orderPeriod != "") {
            map.add("orderPeriod", orderPeriod);
        }
        $.server.webMethod("Purchase.getPOBySearch", map.toString(), callback);

    }

    this.getPOStateResult = function (state_no, callback) {
        var map = new Map();
        map.add("state_no", state_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.getPOStateResult", map.toString(), callback);

    }

    this.getRecentPurchase = function (callback) {
        var map = new Map();
        map.add("store_no", localStorage.getItem("user_store_no"));
        $.server.webMethod("Purchase.getRecentPurchase", map.toString(), callback);
    }

    this.payInvoiceBillSalesOrder = function (data, callback) {
        var map = new Map();

        if (data.po_no != undefined) {
            if (data.po_no == null || data.po_no == "" || typeof data.po_no == "undefined")
                map.add("po_no", "null");
            else
                map.add("po_no", data.po_no);
        }
        if (data.bill_no != undefined) {
            if (data.bill_no == null || data.bill_no == "")
                map.add("bill_no", "null");
            else
                map.add("bill_no", data.bill_no);
        }
        if (data.pay_mode != undefined || data.pay_mode == null || data.pay_mode == "") {
            map.add("pay_mode", "Cash", 'Text');
        }
        else
            map.add("pay_mode", data.pay_mode, 'Text');
        map.add("amount", data.amount);
        map.add("pay_type", data.pay_type, 'Text');
        map.add("pay_desc", data.pay_desc, 'Text');
        map.add("pay_date", data.pay_date, "Date");
        map.add("collector_id", data.collector_id);

        //if (data.pay_mode != undefined) {
        //    if (data.pay_mode == null || data.pay_mode == "")
        //        map.add("pay_mode", "null");
        //    else
        //        map.add("pay_mode", data.pay_mode, "Text");
        //}
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
        if (typeof getCookie("user_store_id") != "undefined") {
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        }
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.payInvoiceBillPO", map.toString(), callback);

    }


    this.getInvoiceBillDetails = function (po_no, callback) {


        var map = new Map();
        map.add("po_no", po_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.getInvoiceBillDetails", map.toString(), callback);
    }
    this.getBillByPO = function (po_no, callback) {


        var map = new Map();
        map.add("po_no", po_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.getBillByPO", map.toString(), callback);
    }
    this.getAmountInvoiceBillPO = function (po_no, callback) {


        var map = new Map();
        map.add("po_no", po_no);


        $.server.webMethod("Purchase.getAmountInvoiceBillPO", map.toString(), callback);
    }

    this.getPurchaseStock = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.getPurchaseStock", map.toString(), callback);
    }


    this.getTotalPaidPO = function (po_no, callback) {


        var map = new Map();
        map.add("po_no", po_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.getTotalPaidPO", map.toString(), callback);
    }



    this.getPOByNo = function (po_no, callback) {

        $.server.webMethod("Purchase.getPOByNo", "po_no;" + po_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    }
    this.getPOItems = function (term, callback) {

        $.server.webMethod("Purchase.getPOItems", "po_no;" + term + "", callback);
    }
    this.changeState = function (poNo, stateNo, callback) {
        $.server.webMethod("Purchase.changeState", "po_no;" + stateNo + "", callback);
    }
    this.getState = function (callback) {
        var map = new Map();

        $.server.webMethod("Purchase.getState", map.toString(), callback);
    };

    this.getStateForSales = function (callback) {
        var map = new Map();
        $.server.webMethod("Purchase.getStateForSales", map.toString(), callback);
    };

    this.getAllPaymentCollector = function (callback) {

        var map = new Map();
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("SalesOrder.getAllPaymentCollector", map.toString(), callback);
    }



    this.insertPO = function (data, callback) {
        var map = new Map();
        map.add("vendor_no", data.vendor_no);
        map.add("po_id", data.po_id);
        if (data.expected_date != undefined)
            if (data.expected_date != "" || data.expected_date != null)
                map.add("expected_date", data.expected_date, "Date");
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "" || getCookie("user_store_id") == "-free")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        map.add("state_no", 600);
        return $.server.webMethod("Purchase.insertPO", map.toString(), callback);
    }
    this.updatePO = function (data, callback) {
        var map = new Map();
        if (data.jrn_id == undefined) {
            data.jrn_id = -1;
        }
        map.add("vendor_no", data.vendor_no);
        if (data.expected_date != undefined)
            if (data.expected_date != "" || data.expected_date != null)
                map.add("expected_date", data.expected_date, "Date");
        map.add("po_no", data.po_no);
        if (data.invoice_no != "")
            map.add("invoice_no", data.invoice_no, "Text");
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        //map.add("jrn_id", data.jrn_id);

        $.server.webMethod("Purchase.updatePO", map.toString(), callback);

    }
    this.deletePO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.deletePO", map.toString(), callback);

    }
    this.updateReturnPO = function (data, callback) {
        var map = new Map();
        map.add("po_no", data.po_no);
        map.add("po_return_bill_no", data.po_return_bill_no);
        $.server.webMethod("Purchase.updateReturnPO", map.toString(), callback);

    }

    this.orderPO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.orderPO", map.toString(), callback);

    }
    this.recreatePO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.recreatePO", map.toString(), callback);

    }
    this.stockedPO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.stockedPO", map.toString(), callback);

    }
    this.deliverPO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.deliverPO", map.toString(), callback);

    }
    this.invoiceMatchedPO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.invoiceMatchedPO", map.toString(), callback);

    }

    this.invoiceConfirmedPO = function (data, callback) {
        var map = new Map();
        map.add("po_no", data.po_no);
        map.add("due_date", data.due_date, "Date");
        $.server.webMethod("Purchase.invoiceConfirmedPO", map.toString(), callback);

    }
    this.completePO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.completePO", map.toString(), callback);

    }
    this.deliverPartialPO = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.deliverPartialPO", map.toString(), callback);

    }
    this.returnPurchaseOrder = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.returnPurchaseOrder", map.toString(), callback);

    }
    this.returnPOItems = function (po_no, callback) {
        var map = new Map();
        map.add("po_no", po_no);
        $.server.webMethod("Purchase.returnPOItems", map.toString(), callback);

    }


    this.getReorderStock = function (item_no, callback) {
        var map = new Map();
        map.add("item_no", item_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Purchase.getReorderStock", map.toString(), callback);

    }

    this.deletePOItems = function (i, dataList, callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];
            $.server.webMethod("Purchase.deletePOItems", "item_no;" + data.item_no + ",po_no;" + data.po_no + "", function () {
                self.deletePOItems(i + 1, dataList, callback);
            });
        }


        //$(dataList).each(function (i, data) {
        //    try{
        //        $.server.webMethod("Purchase.deletePOItems", "item_no;" + data.item_no + ",po_no;" + data.po_no + "", callback)
        //} catch (e) { }
        //});

    };


    //TODO:SUNDAR::Why this method is required??? we can have PO no as part of dataList
    this.updatePOItems = function (i, dataList, callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];
            //$.server.webMethod("Purchase.updatePOItems", "item_no;" + data.item_no + ",po_no;" + data.po_no + ",tray_count;" + data.tray_count + ",qty;" + data.qty + ",cost;" + data.cost + "", function() {
            //$.server.webMethod("Purchase.updatePOItems", "item_no;'" + data.item_no + "',po_no;" + data.po_no + ",tray_count;" + data.tray_count + ",qty;" + data.qty + ",cost;" + data.cost + ",unit;'" + data.unit + "',disc_per;'" + data.disc_per + "',disc_val;'" + data.disc_val + "',tax_per;'" + data.tax_per + "',mrp;'" + data.total_price + "'", function () {

            var map = new Map();
            map.add("po_no", data.po_no);
            map.add("item_no", data.item_no);


            //if (typeof data.tray_count != "undefined") {
            //    if (data.tray_count == null || data.tray_count == "")
            //        map.add("tray_count", "null");
            //    else
            //        map.add("tray_count", data.tray_count);
            //}

            if (typeof data.qty != "undefined") {
                if (data.qty == null || (data.qty == "" && data.qty != 0))
                    map.add("qty", "null");
                else
                    map.add("qty", data.qty);
            }

            //if (typeof data.free_qty != "undefined") {
            //    if (data.free_qty == null || (data.free_qty == "" && data.free_qty != 0))
            //        map.add("free_qty", "null");
            //    else
            //        map.add("free_qty", data.free_qty);
            //}

            //if (typeof data.free_item != "undefined") {
            //    if (data.free_item == null || (data.free_item == "" && data.free_item != 0))
            //        map.add("free_item", "null");
            //    else
            //        map.add("free_item", data.free_item,"Text");
            //}

            if (typeof data.cost != "undefined") {
                if (data.cost == null || (data.cost == "" && data.cost != 0))
                    map.add("cost", "null");
                else
                    map.add("cost", data.cost);
            }

            if (typeof data.unit != "undefined") {
                if (data.unit == null || data.unit == "")
                    map.add("unit", "null");
                else
                    map.add("unit", data.unit, "Text");
            }

            if (typeof data.disc_per != "undefined") {
                if (data.disc_per == null || (data.disc_per == "" && data.disc_per != 0))
                    map.add("disc_per", "null");
                else
                    map.add("disc_per", data.disc_per, "Text");
            }

            if (typeof data.disc_val != "undefined") {
                if (data.disc_val == null || (data.disc_val == "" && data.disc_val != 0))
                    map.add("disc_val", "null");
                else
                    map.add("disc_val", data.disc_val, "Text");
            }

            if (typeof data.tax_per != "undefined") {
                if (data.tax_per == null || (data.tax_per == "" && data.tax_per != 0))
                    map.add("tax_per", "null");
                else
                    map.add("tax_per", data.tax_per, "Text");
            }
            if (typeof data.unit_identity != "undefined") {
                if (data.unit_identity == null || (data.unit_identity == "" && data.unit_identity != 0))
                    map.add("unit_identity", "null");
                else
                    map.add("unit_identity", data.unit_identity);
            }
            //if (typeof data.tray_id != "undefined") {
            //    if (data.tray_id == null || (data.tray_id == "" && data.tray_id != 0))
            //        map.add("tray_id", "null");
            //    else
            //        map.add("tray_id", data.tray_id);
            //}

            //if (typeof data.mrp != "undefined") {
            //    if (data.mrp == null || data.mrp == "")
            //        map.add("mrp", "null");
            //    else
            //        map.add("mrp", data.mrp, "Text");
            //}

            //if (typeof data.batch_no != "undefined") {
            //    if(data.batch_no == null || data.batch_no == "")
            //        map.add("batch_no", "null");
            //    else
            //        map.add("batch_no", data.batch_no, "Text");
            //}

            //if (typeof data.expiry_date != "undefined") {
            //    if (data.expiry_date == null || data.expiry_date == "")
            //        map.add("expiry_date", "null");
            //    else
            //        map.add("expiry_date", data.expiry_date, "Date");
            //}

            //if (typeof data.selling_price != "undefined") {
            //    if (data.selling_price == null || data.selling_price == "")
            //        map.add("selling_price", "null");
            //    else
            //        map.add("selling_price", data.selling_price, "Text");
            //}

            if (typeof data.total_price != "undefined") {
                if (data.total_price == null || (data.total_price == "" && data.total_price != 0) || isNaN(data.total_price))
                    map.add("total_price", "null");
                else
                    map.add("total_price", data.total_price, "Text");
            }

            //if (typeof data.addStock != "undefined") {
            //    if (data.addStock == null || data.addStock == "")
            //        map.add("addStock", "null");
            //    else
            //        map.add("addStock", data.addStock, "Text");
            //}

            if (typeof data.qty_delivered != "undefined") {
                if (data.qty_delivered == null || data.qty_delivered == "")
                    map.add("qty_delivered", data.qty_delivered);
                else
                    map.add("qty_delivered", data.qty_delivered);
            }
            //if (typeof data.barcode != "undefined") {
            //    if (data.barcode == null || data.barcode == "")
            //        map.add("barcode", "null");
            //    else
            //        map.add("barcode", data.barcode);
            //}

            $.server.webMethod("Purchase.updatePOItems", map.toString(), function () {
                self.updatePOItems(i + 1, dataList, callback);
            });
        }


    };

    this.addPOItems = function (i, dataList, callback) {
        if (i == dataList.length) {
            callback();
        } else {
            var data = dataList[i];
            //if (data.disc_per == "undefined" || data.disc_per == "") {
            //    data.disc_per = "0";
            //}
            //if (data.disc_val == "undefined" || data.disc_val == "") {
            //    data.disc_val = "0";
            //}
            //if (data.tax_per == "undefined" || data.tax_per == "") {
            //    data.tax_per = "0";
            //}
            var map = new Map();
            map.add("po_no", data.po_no);
            map.add("item_no", data.item_no);
            //map.add("tray_count", data.tray_count);
            map.add("qty", data.qty);
            if (data.unit != undefined) {
                if (data.unit == null || (data.unit == "" && data.unit != 0))
                    map.add("unit", "null");
                else
                    map.add("unit", data.unit, "Text");
            }
            //if (data.free_item != undefined) {
            //    if (data.free_item == null || (data.free_item == "" && data.free_item != 0))
            //        map.add("free_item", "null");
            //    else
            //        map.add("free_item", data.free_item, "Text");
            //}
            //if (data.tray_id != undefined) {
            //    if (data.tray_id == null || (data.tray_id == "" && data.tray_id != 0))
            //        map.add("tray_id", "null");
            //        else
            //        map.add("tray_id", data.tray_id);
            //}
            //if (typeof data.cost != undefined)
            //    if (data.cost == null || data.cost == "")
            //        map.add("cost", "null");
            //    else
            //        map.add("cost", data.cost);
            //if (typeof data.unit != undefined)
            //    if (data.unit == null || data.unit == "")
            //        map.add("unit", "null");
            //    else
            //        map.add("unit", data.unit, "Text");
            //if (typeof data.disc_per != undefined)
            //    if (data.disc_per == null || data.disc_per == "")
            //        map.add("disc_per", "null");
            //    else
            //        map.add("disc_per", data.disc_per, "Text");
            //if (typeof data.disc_val != undefined)
            //    if (data.disc_val == null || data.disc_val == "")
            //        map.add("disc_val", "null");
            //    else
            //        map.add("disc_val", data.disc_val, "Text");
            if (typeof data.tax_per != undefined)
                if (data.tax_per == null || data.tax_per == "")
                    map.add("tax_per", "null");
                else
                    map.add("tax_per", data.tax_per, "Text");
            //if (typeof data.mrp != undefined)
            //    if (data.mrp == null || data.mrp == "")
            //        map.add("mrp", "null");
            //    else
            //        map.add("mrp", data.mrp, "Text");
            //if (typeof data.batch_no != "undefined") {
            //    if (data.batch_no == null || data.batch_no == '')
            //        map.add("batch_no", "null");
            //    else
            //        map.add("batch_no", data.batch_no, "Text");
            //}
            ////map.add("batch_no", data.batch_no, "Text");
            //if (typeof data.expiry_date != "undefined") {
            //    if (data.expiry_date == null || data.expiry_date == '')
            //        map.add("expiry_date", "null");
            //    else
            //        map.add("expiry_date", data.expiry_date, "Date");
            //}
            //if(!isNaN(data.total_price))
            //if (typeof data.total_price != undefined)
            //    if (data.total_price == null || data.total_price == "")
            //        map.add("total_price", "null");
            //    else
            //        map.add("total_price", data.total_price, "Text");
            //if (typeof data.selling_price != undefined)
            //    if (data.selling_price == null || data.selling_price == "")
            //        map.add("selling_price", "null");
            //    else
            //        map.add("selling_price", data.selling_price, "Text");

            //if (data.addStock != undefined) {
            //    if (data.addStock == null || data.addStock == "")
            //        map.add("addStock", "null");
            //    else
            //        map.add("addStock", data.addStock, "Text");
            //}
            //if (typeof data.barcode != undefined)
            //    if (data.barcode == null || data.barcode == "")
            //        map.add("barcode", "null");
            //    else
            //        map.add("barcode", data.barcode, "Text");
            if (typeof data.unit_identity != undefined)
                if (data.unit_identity == null || (data.unit_identity == "" && data.unit_identity != 0))
                    map.add("unit_identity", "null");
                else
                    map.add("unit_identity", data.unit_identity);

            if (typeof data.free_qty != "undefined") {
                if (data.free_qty == null || (data.free_qty == "" && data.free_qty != 0))
                    map.add("free_qty", "null");
                else
                    map.add("free_qty", data.free_qty);
            }

            $.server.webMethod("Purchase.addPOItems", map.toString(), function () {
                self.addPOItems(i + 1, dataList, callback);
            });
        }


        //$(dataList).each(function (i, data) {
        //    try{
        //    $.server.webMethodSync()
        //} catch (e) { }
        //});


    };

    this.payAllPendingPayments = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.payInvoiceBillSalesOrder(billItem, function () {
                self.payAllPendingPayments(i + 1, billItems, callback);
            });
        }
    }
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

    this.getTotalPurchaseDashBoard = function (callback) {
        var map = new Map();
        map.add("store_no", localStorage.getItem("user_store_no"));
        return $.server.webMethod("Purchase.getTotalPurchaseDashBoard", map.toString(), callback);
    }
}



function PrintData(dataList) {

    var r = window.open("");
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