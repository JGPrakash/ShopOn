function BillPaymentAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("salesbill/payment/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("salesbill/payment/" + id.so_no + "/?so_no=" + id.so_no, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("salesbill/payment/", data, callback, errorCallback);
    }
    this.postAllValue = function (data, callback) {
        //var self = this;
        //if (i == Items.length) {
        //    callback();
        //} else {
        //    var item = Items[i];
        //    self.postValue(item, function () {
        //        self.postAllValue(i + 1, Items, callback);
        //    });
        //}
        $.server.webMethodPOST("salesbill/payment/multipayment/", data, callback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("salesbill/payment/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("salesbill/payment/" + id, data, callback, callback, callback);
    }
}