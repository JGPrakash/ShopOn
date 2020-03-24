function BillAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("sale/bill/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
        //var url = "sale/bill/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression;
        //if (LCACHE.isEmpty(url)) {
        //    $.server.webMethodGET(url, function (result, obj) {
        //        LCACHE.set(url, result,60000);
        //        callback(result, obj);
        //    });
        //} else {
        //    callback(LCACHE.get(url));
        //}
    }

    this.getValue = function (bill_no, callback, errorCallback) {
        if (parseInt(bill_no) != 0)
            //$.server.webMethodGET("sale/bill/" + bill_no + "/?bill_no=" + bill_no + "&store_no=" + localStorage.getItem("user_store_no"), callback, errorCallback);
            $.server.webMethodGET("sale/bill/" + bill_no + "/?bill_no=" + bill_no + "&store_no=" + localStorage.getItem("user_store_no"), function (data) {
                //$(data.bill_items).each(function (i, item) {
                //    //to add property dynamically
                //    item[item.attr_type1] = item.attr_value1;
                //    item[item.attr_type2] = item.attr_value2;
                //    item[item.attr_type3] = item.attr_value3;
                //    item[item.attr_type4] = item.attr_value4;
                //    item[item.attr_type5] = item.attr_value5;
                //    item[item.attr_type6] = item.attr_value6;
                //});
                callback(data);
            }, errorCallback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/reward/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("sale/bill/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/reward/" + id, data, callback, callback, callback);
    }
    this.getReturnBill = function (bill_no, callback, errorCallback) {
        if (parseInt(bill_no) != 0) {
            $.server.webMethodGET("sale/bill/return/" + bill_no + "/?bill_no=" + bill_no + "&store_no=" + localStorage.getItem("user_store_no"), function (data) {
                //$(data).each(function (i, item) {
                //    item[item.attr_type1] = item.attr_value1;
                //    item[item.attr_type2] = item.attr_value2;
                //    item[item.attr_type3] = item.attr_value3;
                //    item[item.attr_type4] = item.attr_value4;
                //    item[item.attr_type5] = item.attr_value5;
                //    item[item.attr_type6] = item.attr_value6;
                //});
                callback(data);
            }, errorCallback);
        }
            //$.server.webMethodGET("sale/bill/return/" + bill_no + "/?bill_no=" + bill_no + "&store_no=" + localStorage.getItem("user_store_no"), callback, errorCallback);
    }
}