function PurchaseBillPaymentAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("purchasebill/payment/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("purchasebill/payment/" + id.tray_id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("purchasebill/payment/", data, callback, errorCallback);
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
        $.server.webMethodPOST("purchasebill/payment/multipayment/", data, callback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("purchasebill/payment/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("purchasebill/payment/" + id, data, callback, callback, callback);
    }
}