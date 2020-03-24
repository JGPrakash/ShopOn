function InventoryService() {
    
    this.removeInventory = function (trans_no, callback) {
        $.server.webMethod("Invent.removeInventory", "trans_no;" + trans_no,callback);
    }
    this.insertInventory = function (data, callback, errorCallback) {
        var map = new Map();
        //map.add("item_no", data.item_no);
        map.add("var_no", data.var_no);
        map.add("qty", data.qty);

        //if (typeof data.free_item != "undefined") {
        //    if (data.free_item == null || (data.free_item == "" && data.free_item != 0))
        //        map.add("free_item", "null");
        //    else
        //        map.add("free_item", data.free_item,"Text");
        //}
        if (typeof data.item_no != "undefined") {
            if (data.item_no == null || (data.item_no == "" && data.item_no != 0))
            { }
            else
                map.add("item_no", data.item_no);
        }
        //if (typeof data.cost != "undefined") {
        //    if (data.cost == null || (data.cost == "" && data.cost != 0))
        //    { }
        //    else
        //        map.add("cost", data.cost);
        //}


        //if(data.cost != undefined)
        //    map.add("cost", data.cost);
      
        if (typeof data.vendor_no != "undefined") {
            if (data.vendor_no == null || (data.vendor_no == "" && data.vendor_no != 0) || data.vendor_no == -1)
            { }
            else
                map.add("vendor_no", data.vendor_no);
        }

        //if (data.vendor_no != undefined)
        //    map.add("vendor_no", data.vendor_no);

        if (typeof data.comments != "undefined") {
            if (data.comments == null || (data.comments == ""))
                map.add("comments", "null");
            else
                map.add("comments", data.comments,"Text");
        }

        //if(data.comments != undefined)
        //    map.add("comments", data.comments, "Text");

        //if (typeof data.invent_type != "undefined") {
        //    if (data.invent_type == null || (data.invent_type == ""))
        //        map.add("invent_type", "null");
        //    else
        //        map.add("invent_type", data.invent_type);
        //}
        map.add("trans_type", data.trans_type, "Text");

        if (typeof data.mrp != "undefined") {
            if (data.mrp == null || (data.mrp == ""))
            { }
            else
                map.add("mrp", data.mrp);
        }

        //if (data.mrp != undefined)
        //    map.add("mrp", data.mrp);

        if (typeof data.expiry_date != "undefined")
            if (data.expiry_date == null || data.expiry_date == "")
            { }
            else
                //map.add("expiry_date", data.expiry_date, "Date"); 
                map.add("expiry_date", data.expiry_date + " 23:59:59", 'Date');

        if (typeof data.man_date != "undefined")
            if (data.man_date == null || data.man_date == "")
            { }
            else
                map.add("man_date", data.man_date, 'Date');

        if (typeof data.batch_no != "undefined")
            if (data.batch_no == null || data.batch_no == "")
            { }
            else
                map.add("batch_no", data.batch_no, "Text");

        if (typeof data.key1 != "undefined")
            if (data.key1 == null || data.key1 == "")
                map.add("key1", 'null');
            else
                map.add("key1", data.key1, "Text");

        //if (typeof data.variation_name != "undefined")
        //    if (data.variation_name == null || data.variation_name == "" || data.variation_name == "-free")
        //        map.add("variation_name", data.item_no + "-" + getCookie("user_store_id") + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date + "" + data.variation_name, "Text");
        //    else
        //        map.add("variation_name", data.variation_name, "Text");
        
        //Save Store No
        //if (typeof getCookie("user_store_id") != "undefined")
        //    if (getCookie("user_store_id") == null || getCookie("user_store_id") == "" || getCookie("user_store_id") == "-free")
        //        map.add("store_no", "null");
        //    else
        //        map.add("store_no", getCookie("user_store_id"));
        //if (typeof getCookie("user_company_id") != "undefined")
        //    if (getCookie("user_company_id") == null || getCookie("user_company_id") == "" || getCookie("user_company_id") == "-free")
        //        map.add("comp_id", "null");
        //    else
        //        map.add("comp_id", getCookie("user_company_id"));
        

        if (data.var_no == undefined || data.var_no == null || data.var_no == "" || data.var_no == "-free") {
            data.active = 1;
            if (typeof data.var_no == "undefined" || data.var_no == null || data.var_no == "")
            { } else {
                data.variation_name = data.item_no + "-" + getCookie("user_store_id") + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date + "" + data.variation_name;
            }
            this.insertStockVariation(data, function () { });
        }

        if (data.chk_new_var == "1") {
            data.active = 1;
            this.insertStockVariation(data, function () { });
        }
        //if (data.chk_new_free_var == "1") {
        //    data.active = 1;
        //    this.insertStockVariation(data, function () { });
        //}


        var date = $.datepicker.formatDate("dd-mm-yy", new Date());
        //if (data.invent_type == "Sale" || data.invent_type == "PurchaseReturn" || data.invent_type == "ManualRemove") {
        var mapfinfacts = new Map();  

        mapfinfacts.add("per_id", CONTEXT.FINFACTS_CURRENT_PERIOD);
        mapfinfacts.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        mapfinfacts.add("key_1", data.var_no);
        mapfinfacts.add("description", data.trans_type, "Text");
        mapfinfacts.add("jrn_date", date, "Date");
        mapfinfacts.add("invent_type", data.trans_type);
        if (typeof data.cost != "undefined") {
            if (data.cost == null || (data.cost == "" && data.cost != 0))
                mapfinfacts.add("amount", "null");
            else
                mapfinfacts.add("amount", parseFloat(data.cost) * parseFloat(data.qty));
        }

        $.server.webMethod("FinFacts.Accounting.insertStock", mapfinfacts.toString());
       // }
        //if (data.invent_type == "SaleReturn" || data.invent_type == "Purchase" || data.invent_type == "Manual") {
        //    var mapfinfacts = new Map();

        //    mapfinfacts.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        //    mapfinfacts.add("per_id", CONTEXT.PeriodId);
        //    mapfinfacts.add("key_1", data.item_no);
        //    mapfinfacts.add("description", data.invent_type, "Text");
        //    mapfinfacts.add("jrn_date", date, "Date");
        //    if (typeof data.cost != "undefined") {
        //        if (data.cost == null || (data.cost == "" && data.cost != 0))
        //            mapfinfacts.add("amount", "null");
        //        else
        //            mapfinfacts.add("amount", parseFloat(data.cost) * parseFloat(data.qty));
        //    }

        //    $.server.webMethod("FinFacts.Accounting.insertStockCredit", mapfinfacts.toString());
        //}
        $.server.webMethod("Invent.insertInventory", map.toString(), callback, errorCallback);

        //$.server.webMethod("Invent.insertInventory", map.toString(), function (data) {
        //    $.server.webMethod("Invent.getInventTransById", "trans_no;" + data[0].key_value, callback);
        //});

       
        
    }
    this.updateInventory = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("cost", data.cost);
        map.add("qty", data.qty);
        if (data.vendor_no != undefined)
            map.add("vendor_no", data.vendor_no);
        if (data.comments != undefined)
            map.add("comments", data.comments, "Text");
        map.add("invent_type", data.invent_type, "Text");
        if (data.mrp != undefined)
            map.add("mrp", data.mrp);
        if (data.expiry_date != undefined)
            if (data.expiry_date == null || data.expiry_date == "")
                map.add("expiry_date", 'null');
            else
                map.add("expiry_date", data.expiry_date, 'Date');
        if (data.batch_no != undefined)
            if (data.batch_no == null || data.batch_no == "")
                map.add("batch_no", 'null');
            else
                map.add("batch_no", data.batch_no, "Text");
        if (data.key1 != undefined)
            map.add("key1", data.key1);
        if (data.selling_price != undefined)
            if (data.selling_price != "")
                map.add("selling_price", data.selling_price);
        if (data.qty_instock != undefined)
            if (data.qty_instock == null || data.qty_instock == "")
                map.add("qty_instock", "null");
            else
                map.add("qty_instock", data.qty_instock);

        $.server.webMethod("Invent.updateInventory", map.toString(), function (data) {
            $.server.webMethod("Invent.getInventTransById", "trans_no;" + data[0].key_value, callback);
        });



    }
    this.getInventTransById = function (trans_no, callback) {
        $.server.webMethod("Invent.getInventTransById", "trans_no;" + trans_no, callback);

    }


    this.insertInventoryItems = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
                callback();
            
        } else {
            var billItem = billItems[i];
            self.insertInventory(billItem, function () {
                self.insertInventoryItems(i + 1, billItems, callback);
            });
        }
    }
  
    

    this.getItemInventory = function (item_no, callback) {

        //new StockAPI().getStockTransactions(item_no, callback)
        var map = new Map();
        map.add("item_no", item_no);
        if (typeof getCookie("user_store_id") != "undefined")
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "" || getCookie("user_store_id") == "-free")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Invent.getItemInventory", map.toString(), callback);
       
    }

    this.getAllVendors = function (callback) {
        $.server.webMethod("Invent.getAllVendors", "comp_id;" + getCookie("user_company_id"), callback);
    }

    this.getVendorById = function (vendor_no, callback) {
        var map = new Map();
        map.add("vendor_no", vendor_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Invent.getVendorById", map.toString(), callback);
    }



    //Variation starts here






    this.insertStockVariation = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("cost", data.cost);

        if (data.vendor_no != undefined) {
            if(data.vendor_no == null || data.vendor_no == "")
                map.add("vendor_no", "null");
            else
                map.add("vendor_no", data.vendor_no);
        }

        if (data.mrp != undefined) {
            if (data.mrp == null || data.mrp == "")
                map.add("mrp", "null");
            else
                map.add("mrp", data.mrp);
        }

        if (typeof data.expiry_date != "undefined") {
            if (data.expiry_date == null || data.expiry_date == "")
                map.add("expiry_date", 'null');
            else
                map.add("expiry_date", data.expiry_date + " 23:59:59", 'Date');
        }

        if (data.man_date != undefined) {
            if (data.man_date == null || data.man_date == "")
                map.add("man_date", "null");
            else
                map.add("man_date", data.man_date, "Date");
        }

        if (data.batch_no != undefined) {
            if (data.batch_no == null || data.batch_no == "")
                map.add("batch_no", "null");
            else
                map.add("batch_no", data.batch_no,"Text");
        }
        if (data.variation_name != undefined) {
            if (data.variation_name == null || data.variation_name == "")
                map.add("variation_name", "null");
            else
                map.add("variation_name", data.variation_name, "Text");
        }

        if (typeof getCookie("user_store_id") != "undefined") {
            if (getCookie("user_store_id") == null || getCookie("user_store_id") == "" || getCookie("user_store_id") == "-free")
                map.add("store_no", "null");
            else
                map.add("store_no", getCookie("user_store_id"));
        }
        map.add("active", data.active);
        $.server.webMethod("Invent.insertStockVariation", map.toString(), callback);

    }

    this.insertStocks = function (i, datas, bill_no, callback) {
        var self = this;
        if (i == datas.length) {
           // callback();

        } else {
            var data = datas[i];
            self.insertStock(data,bill_no, function () {
                self.insertStocks(i + 1, datas,bill_no, callback);
            });
        }
    }

    this.insertStock = function (data,bill_no, callback) {
        var date = $.datepicker.formatDate("dd-mm-yy", new Date());
        var mapfinfacts = new Map();

        mapfinfacts.add("per_id", CONTEXT.FINFACTS_CURRENT_PERIOD);
        mapfinfacts.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        mapfinfacts.add("key_1", bill_no);
        mapfinfacts.add("description", data.bill_type + "-" + bill_no, "Text");
        mapfinfacts.add("jrn_date", date, "Date");
        mapfinfacts.add("invent_type", data.bill_type);
        if (typeof data.cost != "undefined") {
            if (data.cost == null || (data.cost == "" && data.cost != 0))
                mapfinfacts.add("amount", "null");
            else
                mapfinfacts.add("amount", parseFloat(data.cost) * parseFloat(data.qty));
        }

        $.server.webMethod("FinFacts.Accounting.insertStock", mapfinfacts.toString(),callback);
    }


}

function masterService() {

    this.getAllMaster = function (callback) {
        $.server.webMethod("Invent.getAllVendors", "", callback);
    }

    this.insertVendor = function (data, callback) {
        var map = new Map();
        map.add("vendor_no", data.vendor_no);
        map.add("vendor_name", data.vendor_name);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Invent.insertVendor", map.toString(), callback);
    }

    this.updateVendor = function (data, callback) {
        var map = new Map();
        map.add("vendor_no", data.vendor_no);
        map.add("vendor_name", data.vendor_name);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Invent.updateVendor", map.toString(), callback);
    }
    this.deleteVendor = function (data, callback) {
        var map = new Map();
        map.add("vendor_no", data.vendor_no);
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Invent.deleteVendor", map.toString(), callback);
    }
    
}

