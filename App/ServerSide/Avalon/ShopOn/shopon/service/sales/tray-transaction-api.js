function EggTrayTransAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("settings/traytrans/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("settings/traytrans/" + id.tray_id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("settings/traytrans/", data, callback, errorCallback);
    }
    this.postAllValues = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.postValue(billItem, function () {
                self.postAllValues(i + 1, billItems, callback);
            });
        }
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("settings/traytrans/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("settings/traytrans/" + id, data, callback, callback, callback);
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
}