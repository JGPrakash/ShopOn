function ItemAPI() {


    //search api to search purchase and sales bill
    this.searchItem = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/item/search/main_search?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };

    this.searchItemCount = function (filter_expression, callback) {
        $.server.webMethodGET("shopon/item/search/main_search_count?filter_expression=" + encodeURIComponent(filter_expression), callback);
    };

    /*Variation API*/

    this.searchVariationsMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchStocksMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/stock/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchPricesMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("shopon/variation/price/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };



}