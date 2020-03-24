//Actually Variation Service
function StockService() {




    this.getStockVarInventoryItem = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("cost", data.cost);
        map.add("mrp", data.mrp);
        map.add("batch_no", data.batch_no, "Text");
        //map.add("expiry_date", data.expiry_date , 'Date');
        map.add("expiry_date", dbDate(data.expiry_date));
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Item.checkDuplicatePrice", map.toString(), callback);
    };

    this.getStockVarInventoryItem = function (item_no, callback) {
        $.server.webMethod("Stock.getStockVarInventoryItem", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);

    };

    this.stopVariation = function (data, callback) {
        $.server.webMethod("Stock.stopVariation", "item_no;" + data.item_no + ",variation_name;" + data.variation_name + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.activeVariation = function (data, callback) {
        $.server.webMethod("Stock.activeVariation", "item_no;" + data.item_no + ",variation_name;" + data.variation_name + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.removeVariation = function (data, callback) {
        $.server.webMethod("Stock.removeVariation", "item_no;" + data.item_no + ",variation_name;" + data.variation_name + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };

    this.getAllVariationByItem = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        if (typeof data.vendor_no == "undefined" || data.vendor_no == null || (data.vendor_no == "" && data.vendor_no != 0))
            map.add("vendor_no", "null");
        else
            map.add("vendor_no", data.vendor_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Stock.getAllVariationByItem", map.toString(), callback);
    };
    this.getStockSalesByVarName = function (data, callback) {
        //$.server.webMethod("Stock.getStockSalesByVarName", "item_no;" + data.item_no + ",variation_name;" + data.variation_name + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
        $.server.webMethod("Stock.getStockSalesByVarName", "var_no;" + data, callback);
    };

    this.getStockVarByItemNo = function (item_no, callback) {
        $.server.webMethod("Stock.getStockVarByItemNo", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getActiveStockVarByItemNo = function (item_no, callback) {
        $.server.webMethod("Stock.getActiveStockVarByItemNo", "item_no;" + item_no + ",store_no;" + getCookie("user_store_id") + ",comp_id;" + getCookie("user_company_id"), callback);
    };
    this.getVariationByValue = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("mrp", data.mrp);
        map.add("batch_no", data.batch_no);
        map.add("expiry_date", data.expiry_date, "Date");
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Stock.getVariationByValue", map.toString(), callback);
    };
    this.getVariationByCost = function (data, callback) {
        var map = new Map();
        map.add("item_no", data.item_no);
        map.add("cost", data.cost);
        if (typeof data.vendor_no == "undefined" || data.vendor_no == null || (data.vendor_no == "" && data.vendor_no != 0))
            map.add("vendor_no", "null");
        else
            map.add("vendor_no", data.vendor_no);
        map.add("store_no", getCookie("user_store_id"));
        map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Stock.getVariationByCost", map.toString(), callback);
    };

    this.insertReturnAdvanceItems = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();

        } else {
            var billItem = billItems[i];
            self.insertReturnAdvanceItem(billItem, function () {
                self.insertReturnAdvanceItems(i + 1, billItems, callback);
            });
        }
    }
    this.insertReturnAdvanceItem = function (data, callback) {
        var map = new Map();
        map.add("var_no", data.var_no);
        map.add("trans_type", data.trans_type,"Text");
        map.add("qty", data.qty);
        map.add("trans_date", data.trans_date, "Date");
        map.add("key1", data.key1);
        map.add("key2", data.key2);
        map.add("key3", data.key3);
        $.server.webMethod("Stock.insertReturnAdvanceItem", map.toString(), callback);
    };
}