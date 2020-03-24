function SalesExecutiveRewardAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/salestaxexecutivereward/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("shopon/salestaxexecutivereward/" + id.reward_no, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/salestaxexecutivereward/", data, callback, errorCallback);
    }
    this.postAllValue = function (i, data, callback) {
        var self = this;
        if (i == data.length) {
            callback();
        } else {
            var item = data[i];
            self.postValue(item, function () {
                self.postAllValue(i + 1, data, callback);
            });
        }
    }
    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/salestaxexecutivereward/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/salestaxexecutivereward/" + id, data, callback, callback, callback);
    }
}