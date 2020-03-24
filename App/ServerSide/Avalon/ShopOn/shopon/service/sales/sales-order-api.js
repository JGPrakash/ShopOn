function SalesOrderAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("sales/salesorder/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("sales/salesorder/" + id.order_id+"?order_id="+id.order_id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("sales/salesorder/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("sales/salesorder/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("sales/salesorder/" + id, data, callback, callback, callback);
    }
}

function ReturnOrderAPI() {
    var self = this;
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("return/returnorder/", data, callback, errorCallback);
    }
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("return/returnorder/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("return/returnorder/" + id, data, callback, errorCallback);
    }
}
function ReturnOrderItemAPI() {
    var self = this;
    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("return/returnorderitem/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("return/returnorderitem/", data, callback, errorCallback);
    }
    this.postAllValue = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.postValue(billItem, function () {
                self.postAllValue(i + 1, billItems, callback);
            });
        }
    }
}