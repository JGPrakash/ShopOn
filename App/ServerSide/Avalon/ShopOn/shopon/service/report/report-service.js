function ReportService() {


    this.getAllTimeTopCustomers = function (callback) {
        $.server.webMethod("Report.getAllTimeTopCustomers", "",callback);

    };
    this.getAllTimeTop5Customers = function (callback) {
        $.server.webMethod("Report.getAllTimeTop5Customers", "", callback);

    };

    this.getTopCustomersByDate= function (data, callback) {
        var map = new Map();
        map.add("fromDate",dbDate( data.fromDate));
        map.add("toDate",dbDate( data.toDate));
        $.server.webMethod("Report.getTopCustomersByDate",map.toString(),callback);

    };

    this.getAllTimePendingPO= function (callback) {
        $.server.webMethod("Report.getAllTimePendingPO", "", callback);

    };
    this.getPendingPOByDate= function (data, callback) {
        var map = new Map();
        map.add("fromDate", dbDate(data.fromDate));
        map.add("toDate", dbDate(data.toDate));

        $.server.webMethod("Report.getPendingPOByDate", map.toString(),callback);

    };

    this.getAllPOState = function ( callback) {
        $.server.webMethod("Report.getAllPOState", "", callback);
    }


    this.getPendingPOByDateAndStatus= function (data, callback) {
        var map = new Map();
        map.add("fromDate", dbDate(data.fromDate));
        map.add("toDate", dbDate(data.toDate));
        map.add("stateName", data.stateName);

        $.server.webMethod("Report.getPOByDateAndStatus", map.toString(), callback);

    };
    this.getStockDetailByItem= function (data, callback) {
        var map = new Map();
        //map.add("fromDate", data.fromDate, "Date");
       // map.add("toDate", data.toDate, "Date");
        map.add("itemNo", data.itemNo);
        $.server.webMethod("Report.getStockDetailByItem", map.toString(),callback);

    };
    this.getAllStockDetail= function (callback) {
        $.server.webMethod("Report.getAllStockDetail", "",callback);

    };
    this.getStockReorderLevelAlert= function (callback) {
        $.server.webMethod("Report.getStockReorderLevelAlert", "",callback);

    };
    this.getSalesAllTime= function (callback) {
        $.server.webMethod("Report.getSalesAllTime", "",callback);

    };
    this.getSalesByDate= function (data, callback) {
        var map = new Map();
        map.add("fromDate", dbDate(data.fromDate));
        map.add("toDate", dbDate(data.toDate));

        $.server.webMethod("Report.getSalesByDate", map.toString(), callback);

    };
    this.getSalesByItem= function (data, callback) {
        var map = new Map();
        map.add("fromDate", dbDate(data.fromDate));
        map.add("toDate", dbDate(data.toDate));
        map.add("itemNo", data.itemNo);
        $.server.webMethod("Report.getSalesByItem", map.toString(),callback);

    };
    this.getTopSellingItemByDate= function (data, callback) {
        var map = new Map();
        map.add("fromDate", dbDate(data.fromDate));
        map.add("toDate", dbDate(data.toDate));

        $.server.webMethod("Report.getTopSellingItemByDate", map.toString(),callback);

    };
    this.getTopSellingItemAllTime= function (callback) {
        $.server.webMethod("Report.getTopSellingItemAllTime", "",callback);

    };
    this.getStoreByComp = function (callback) {
        //map.add("comp_id", getCookie("user_company_id"));
        $.server.webMethod("Report.getStoreByComp", "comp_id;" + getCookie("user_company_id"), callback);

    };



}