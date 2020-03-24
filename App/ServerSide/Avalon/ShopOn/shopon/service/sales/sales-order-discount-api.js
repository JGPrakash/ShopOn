function SalesOrderDiscountAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("sales/salesorderdiscount/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("sales/salesorderdiscount/" + id.order_id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("sales/salesorderdiscount/", data, callback, errorCallback);
    }
    this.postAllValue = function (order_id, i, discounts, maincallback) {
        var self = this;
        if (i == discounts.length) {
            maincallback();
        } else {
            var disItem = discounts[i];
            self.postValue({
                disc_no: disItem.disc_no,
                order_id: order_id,
                value_type: disItem.disc_type,
                value: disItem.disc_value,
                item_no: disItem.item_no
            }, function () {
                self.postAllValue(order_id, i + 1, discounts, maincallback);
            });
        }
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("sales/salesorderdiscount/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id,data, callback, errorCallback) {
        $.server.webMethodDELETE("sales/salesorderdiscount/" + id,data, callback, callback, callback);
    }
}