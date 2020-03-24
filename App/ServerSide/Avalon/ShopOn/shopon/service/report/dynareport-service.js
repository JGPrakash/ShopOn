function DynaReportService() {


    this.downloadCustomerAndSales = function (callback) {
        var self = this;
        var reportInput = { viewMode: "CustomerWise", fromDate: "", toDate: "", cust_no: "", item_no: "", bill_type: "" };
        self.getSalesReport(reportInput, function (data) {
            var customers = {};
            $(data).each(function (i, item) {
                customers[item.cust_no] = {
                    cust_no: item.cust_no,
                    cust_name: item.cust_name,
                    total_sales: item.total,
                    total_paid: item.paid,
                    monthly_sales: 0,  //TODO
                    paid_amount: 0,
                };
            });

            //Get current month sales. Refer sales report screen by setting payment date
            var date = new Date(),
                   y = date.getFullYear(),
                   m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);

            reportInput.fromDate = $.datepicker.formatDate("dd-mm-yy", firstDay);  //To Date set date
            reportInput.toDate = $.datepicker.formatDate("dd-mm-yy", lastDay);
            self.getSalesReport(reportInput, function (data) {
                $(data).each(function (i, item) {
                    customers[item.cust_no].monthly_sales = item.total;
                });

                var customeList = [];
                for (var prop in customers)
                    if (prop != -1 && prop != "null")
                        customeList.push(customers[prop]);

                callback(customeList);

            });



        });

    }


    this.getSalesReport = function (data, callback) {
        var map = new Map();
        if (data.fromDate != '')
            map.add("fromDate", dbDate(data.fromDate));
        if (data.toDate != '')
            map.add("toDate", dbDate(data.toDate));
        if (data.cust_no != '')
            map.add("cust_no", data.cust_no);
        if (data.item_no != '')
            map.add("item_no", data.item_no);
        if (data.bill_type != '')
            map.add("bill_type", data.bill_type, "Text");
        if (data.status != '' && data.status != undefined)
            map.add("status", data.status, "Text");
        if (data.bill_filter != '' && data.bill_filter != undefined)
            map.add("bill_filter", data.bill_filter, "Text");
        if (data.area != '' && data.area != undefined)
            map.add("area", data.area, "Text");
        
        map.add("store_no", getCookie("user_store_id"));

        if (data.sales_executive != '' && data.sales_executive != undefined)
            map.add("sales_executive", data.sales_executive, "Text");

        if (data.bill_cashier != '' && data.bill_cashier != undefined)
            map.add("bill_cashier", data.bill_cashier, "Text");
        if (data.item_sales_man != '' && data.item_sales_man != undefined)
            map.add("item_sales_man", data.item_sales_man, "Text");

        map.add("viewMode", data.viewMode);

        if(typeof data.bill_advance != "undefined")
            if (data.bill_advance != '')
                map.add("bill_advance", data.bill_advance);

        $.server.webMethod("DynaReport.getSalesReport", map.toString(), callback);

    };

    this.getPurchaseReport = function (data, callback) {
        var map = new Map();
        if (data.fromDate != '')
            map.add("fromDate", dbDate(data.fromDate));
        if (data.toDate != '')
            map.add("toDate", dbDate(data.toDate));
        map.add("vendor_no", data.vendor_no);
        map.add("item_no", data.item_no);
        //map.add("item_no", data.item_no);

        if (data.state_no != '')
            map.add("state_no", data.state_no);

        if (data.bill_type != '')
            map.add("bill_type", data.bill_type, "Text");
        
        map.add("store_no", getCookie("user_store_id"));

        map.add("viewMode", data.viewMode);


        $.server.webMethod("DynaReport.getPurchaseReport", map.toString(), callback);

    };

    this.getInventoryTransactionReport = function (data, callback) {
        var map = new Map();
        if (data.fromDate != '')
            map.add("fromDate", dbDate(data.fromDate));
        if (data.toDate != '')
            map.add("toDate", dbDate(data.toDate));
        map.add("item_no", data.item_no);
        //map.add("item_no", data.item_no);
        if (data.store_no != '')
            map.add("store_no", data.store_no);


        $.server.webMethod("DynaReport.getInventoryTransactionReport", map.toString(), callback);

    };

    this.getStockReport = function (data, callback) {
        var map = new Map();

        if (data.item_no != "")
            map.add("item_no", data.item_no);
        if (data.vendor_no != "")
            map.add("vendor_no", data.vendor_no);
        map.add("viewMode", data.viewMode);
        map.add("stock_view", data.stock_view);
        map.add("expiry_view", data.expiry_view);
        //map.add("store_no", getCookie("user_store_id"));

        map.add("store_no", data.store_no);
        map.add("comp_id", getCookie("user_company_id"));
        map.add("qty_view", data.qty_view);

        $.server.webMethod("DynaReport.getStockReport", map.toString(), callback);

    };

    this.getDueReport = function (data, callback) {
        var map = new Map();
        if (data.fromDate != '')
            map.add("fromDate", dbDate(data.fromDate));
        if (data.toDate != '')
            map.add("toDate", dbDate(data.toDate));
        if (data.cust_no != '')
            map.add("cust_no", data.cust_no);
        //if (data.item_no != '')
        //    map.add("item_no", data.item_no);
        if (data.bill_type != '')
            map.add("bill_type", data.bill_type, "Text");
        if (data.status != '' && data.status != undefined)
            map.add("status", data.status, "Text");
        //if (data.bill_filter != '' && data.bill_filter != undefined)
        //    map.add("bill_filter", data.bill_filter, "Text");
        //if (data.area != '' && data.area != undefined)
        //    map.add("area", data.area, "Text");

        map.add("store_no", getCookie("user_store_id"));

        //if (data.sales_executive != '' && data.sales_executive != undefined)
        //    map.add("sales_executive", data.sales_executive, "Text");

        map.add("viewMode", data.viewMode);

        //if (typeof data.bill_advance != "undefined")
        //    if (data.bill_advance != '')
        //        map.add("bill_advance", data.bill_advance);

        $.server.webMethod("DynaReport.getDueReport", map.toString(), callback);

    };
}