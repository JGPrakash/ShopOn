function SalesItemAPI() {

    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, search_mode, callback) {

        //$.server.webMethodGET("sales/item/?sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX + "&start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&search_mode=" + search_mode, callback);
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("sales/item/?sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX + "&start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression+"&search_mode="+search_mode, function (data) {
            //$(data).each(function (i, item) {
            //    //to add property dynamically
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

    this.getValue = function (id, callback) {
        //$.server.webMethodGET("sales/item/1?item_no=" + encodeURIComponent(id.item_no) + "&sales_tax_no=" + id.sales_tax_no, callback, callback);
        $.server.webMethodGET("sales/item/1?item_no=" + encodeURIComponent(id.item_no) + "&sales_tax_no=" + id.sales_tax_no, function (data) {
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

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("sales/item/", data, callback, errorCallback);
    }

    this.postAllValue = function (i, items, callback) {
        var self = this;
        if (i == items.length) {
            callback();

        } else {
            var item = items[i];
            self.postValue(item, function () {
                self.postAllValue(i + 1, items, callback);
            });
        }
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("sales/item/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("sales/item/" + id, data, callback, callback, callback);
    }
    

    /*
    this.searchItem = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("sale/item/search/main_search?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };

    this.searchItemCount = function (filter_expression, callback) {
        $.server.webMethodGET("sale/item/search/main_search_count?filter_expression=" + encodeURIComponent(filter_expression), callback);
    };



    this.searchVariationsMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("sale/variation/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchStocksMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("sale/variation/stock/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchPricesMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("sale/variation/price/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };
    */


}