function StockAPI() {

  

    /*Variation API*/
    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/variation/searchValue?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
    this.searchVariationsMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchStocksMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/stock/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchPricesMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/price/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };
    this.searchCurrentPricesMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/price/search/current_price_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };
    
    this.checkBillVariation = function (data, callback) {
        $.server.webMethodGET("shopon/variation/bill/variatiton?var_no=" + data.var_no +"&bill_no="+data.key1+"&trans_type="+data.trans_type, callback);
    };
    

    
    this.insertVariation = function (variation, callback, errorCallback) {
        $.server.webMethodPOST("shopon/variation", variation, callback, errorCallback);
    };

    
    this.updateVariation = function (var_no, variation, callback, errorCallback) {
        $.server.webMethodPUT("shopon/variation/" + var_no, variation, callback, errorCallback);
    };

  
    this.deleteVariation = function (var_no, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/variation/" + var_no, {}, callback, errorCallback);
    };


    this.insertVariationPrice = function (price, callback, errorCallback) {
        $.server.webMethodPOST("shopon/variation/"+ price.var_no+"/price", price, callback, errorCallback);
    };
    

    this.deleteVariationPrice = function (price_no, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/variation/price/" + price_no, { "price_no": price_no}, callback, errorCallback);
    };

    this.insertVariationStock = function (stock, callback, errorCallback) {
        $.server.webMethodPOST("shopon/variation/" + stock.var_no + "/stock", stock, callback, errorCallback);
    };


    this.deleteVariationStock = function (stock_no,data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/variation/stock/" + stock_no, data, callback, errorCallback);
    };
	
    this.insertBill = function (stock,callback, errorCallback) {
        $.server.webMethodPOST("purchase/bill", stock, callback, errorCallback);
    };
    this.updateBill = function (stock, callback, errorCallback) {
        $.server.webMethodPUT("purchase/bill" + stock.bill_no, stock, callback, errorCallback);
    };
    this.insertStock = function (stock, callback, errorCallback) {
        $.server.webMethodPOST("purchase/bill/stock", stock, callback, errorCallback);
    };
    
    this.getBill = function (bill_no, callback, errorCallback) {
        $.server.webMethodGET("purchase/bill/" + bill_no + "/?bill_no=" + bill_no + "&store_no=" + localStorage.getItem("user_store_no"), callback, errorCallback);
    };
    this.getSalesBill = function (bill_no, callback, errorCallback) {
        if (parseInt(bill_no) != 0)
            $.server.webMethodGET("sale/bill/" + bill_no, callback, errorCallback);
    };

    this.insertStockVar = function (stock, callback, errorCallback) {
        $.server.webMethodPOST("shopon/variation/" + stock.var_no + "/stock", stock, callback, errorCallback);
    };

    this.insertAllStockVar = function (i, items, callback) {
        var self = this;
        if (i == items.length) {
            callback();

        } else {
            var item = items[i];
            self.insertStockVar(item, function () {
                self.insertAllStockVar(i + 1, items, callback);
            });
        }
    }


    this.insertAllVariationPrice = function (i, priceItems, callback) {
        var self = this;
        if (i == priceItems.length) {
            callback();

        } else {
            var priceItem = priceItems[i];
            self.insertVariationPrice(priceItem, function () {
                self.insertAllVariationPrice(i + 1, priceItems, callback);
            });
        }
    }

    this.getVariationByItem = function (data, callback) {
        $.server.webMethodGET("shopon/variation/stock/variatiton/" + data.item_no + "?item_no=" + data.item_no + "&vendor_no=" + data.vendor_no, callback);
    };
    this.getSkuByItem = function (data, callback) {
        $.server.webMethodGET("shopon/variation/sku/item/" + data.item_no + "?item_no=" + data.item_no + "&vendor_no=" + data.vendor_no + "&search_mode=" + data.search_mode, callback);//+ "&store_no=" + localStorage.getItem("user_fulfillment_store_no")
    };

    this.getItemStockByVariation = function (data, callback) {
        $.server.webMethodGET("shopon/variation/stock/variatiton/qty/" + data.var_no + "?var_no=" + data.var_no + "", callback);
    };
    this.getStockByItem = function (data, callback) {
        $.server.webMethodGET("shopon/variation/stock/item/variation/" + data + "?item_no=" + data + "", callback);
    };
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        var url = "shopon/variation/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&store_no=" + localStorage.getItem("user_store_no");
        $.server.webMethodGET(url, callback);
        /*if (LCACHE.isEmpty(url)) {
            $.server.webMethodGET(url, function (result, obj) {
                LCACHE.set(url, result);
                callback(result, obj);
            });
        } else {
            callback(LCACHE.get(url));
        }*/
    }
    this.getattributesearch = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/sku/searchattribute", data, callback, errorCallback);
    };
}



