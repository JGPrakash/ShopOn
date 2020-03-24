function SalesOrderItemAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("sales/salesorderitem/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("sales/salesorderitem/" + id.order_id, callback, callback);
    }
    this.getReturnValue = function (id, callback) {
        $.server.webMethodGET("sales/salesorderitem/return/" + id.order_id+"/?order_id="+ id.order_id+"&bill_no="+id.bill_no, callback, callback);
    }
    this.postValue = function (data, callback, errorCallback) {
        var root = {};
        root.order_id = data.order_id;
        if (typeof data.quantity != "undefined") {
            if (data.quantity == null || (data.quantity == "" && data.quantity != 0))
                root.quantity = "0";
            else
                root.quantity = data.quantity;
        }

        if (typeof data.price != "undefined") {
            if (data.price == null || (data.price == "" && data.price != 0))
                root.price = "0";
            else
                root.price = data.price;
        }

        if (typeof data.discount != "undefined") {
            if (data.discount == null || (data.discount == "" && data.discount != 0))
                root.discount = "0";
            else
                root.discount = data.discount;
        }


        if (typeof data.tax_per != "undefined") {
            if (data.tax_per == null || (data.tax_per == "" && data.tax_per != 0))
                root.tax_per = "0";
            else
                root.tax_per = data.tax_per;
        }

        if (typeof data.total_price != "undefined") {
            if (data.total_price == null || (data.total_price == "" && data.total_price != 0))
                root.total_price = "0";
            else
                root.total_price=data.total_price;
        }

        if (typeof data.tax_class_no != "undefined") {
            if (data.tax_class_no == null || (data.tax_class_no == "" && data.tax_class_no != 0))
                root.tax_class_no = "0";
            else
                root.tax_class_no=data.tax_class_no;
        }

        if (typeof data.sales_tax_class_no != "undefined") {
            if (data.sales_tax_class_no == null || (data.sales_tax_class_no == "" && data.sales_tax_class_no != 0))
                root.sales_tax_class_no="0";
            else
                root.sales_tax_class_no=data.sales_tax_class_no;
        }
        if (typeof data.unit != "undefined") {
            if (data.unit == null || data.unit == "")
                root.unit = "0";
            else
                root.unit = data.unit;
        }
        if (typeof data.delivered != "undefined") {
            if (data.delivered == null || data.delivered == "")
                root.delivered = "0";
            else
                root.delivered = data.delivered;
        }
        if (typeof data.free_qty != "undefined") {
            if (data.free_qty == null || (data.free_qty == "" && data.free_qty != 0))
                root.free_qty = "0";
            else
                root.free_qty = data.free_qty;
        }
        if (typeof data.hsn_code != "undefined") {
            if (data.hsn_code == null || (data.hsn_code == "" && data.hsn_code != 0))
                root.hsn_code = "0";
            else
                root.hsn_code = data.hsn_code;
        }
        if (typeof data.cgst != "undefined") {
            if (data.cgst == null || (data.cgst == "" && data.cgst != 0))
                root.cgst = "0";
            else
                root.cgst = data.cgst;
        }
        if (typeof data.sgst != "undefined") {
            if (data.sgst == null || (data.sgst == "" && data.sgst != 0))
                root.sgst = "0";
            else
                root.sgst = data.sgst;
        }
        if (typeof data.igst != "undefined") {
            if (data.igst == null || (data.igst == "" && data.igst != 0))
                root.igst = "0";
            else
                root.igst = data.igst;
        }
        if (typeof data.unit_identity != "undefined") {
            if (data.unit_identity == null || (data.unit_identity == "" && data.unit_identity != 0))
                root.unit_identity = "0";
            else
                root.unit_identity = data.unit_identity;
        }
        if (typeof data.var_no != "undefined") {
            if (data.var_no == null || (data.var_no == "" && data.var_no != 0))
                root.var_no = "0";
            else
                root.var_no = data.var_no;
        }
        $.server.webMethodPOST("sales/salesorderitem/", root, callback, errorCallback);
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
    this.putValue = function (id, data, callback, errorCallback) {
        var root = {};
        root.order_id = data.order_id;
        root.order_item_id = data.order_item_id;
        if (typeof data.quantity != "undefined") {
            if (data.quantity == null || (data.quantity == "" && data.quantity != 0))
            {}
            else
                root.quantity = data.quantity;
        }

        if (typeof data.price != "undefined") {
            if (data.price == null || (data.price == "" && data.price != 0))
            { }
            else
                root.price = data.price;
        }

        if (typeof data.discount != "undefined") {
            if (data.discount == null || (data.discount == "" && data.discount != 0))
            { }
            else
                root.discount = data.discount;
        }


        if (typeof data.tax_per != "undefined") {
            if (data.tax_per == null || (data.tax_per == "" && data.tax_per != 0))
            { }
            else
                root.tax_per = data.tax_per;
        }

        if (typeof data.total_price != "undefined") {
            if (data.total_price == null || (data.total_price == "" && data.total_price != 0))
            { }
            else
                root.total_price = data.total_price;
        }

        if (typeof data.tax_class_no != "undefined") {
            if (data.tax_class_no == null || (data.tax_class_no == "" && data.tax_class_no != 0))
            { }
            else
                root.tax_class_no = data.tax_class_no;
        }

        if (typeof data.sales_tax_class_no != "undefined") {
            if (data.sales_tax_class_no == null || (data.sales_tax_class_no == "" && data.sales_tax_class_no != 0))
            { }
            else
                root.sales_tax_class_no = data.sales_tax_class_no;
        }
        if (typeof data.unit != "undefined") {
            if (data.unit == null || data.unit == "")
            { }
            else
                root.unit = data.unit;
        }
        if (typeof data.delivered != "undefined") {
            if (data.delivered == null || data.delivered == "")
            { }
            else
                root.delivered = data.delivered;
        }
        if (typeof data.free_qty != "undefined") {
            if (data.free_qty == null || (data.free_qty == "" && data.free_qty != 0))
            { }
            else
                root.free_qty = data.free_qty;
        }
        if (typeof data.hsn_code != "undefined") {
            if (data.hsn_code == null || (data.hsn_code == "" && data.hsn_code != 0))
            { }
            else
                root.hsn_code = data.hsn_code;
        }
        if (typeof data.cgst != "undefined") {
            if (data.cgst == null || (data.cgst == "" && data.cgst != 0))
            { }
            else
                root.cgst = data.cgst;
        }
        if (typeof data.sgst != "undefined") {
            if (data.sgst == null || (data.sgst == "" && data.sgst != 0))
            { }
            else
                root.sgst = data.sgst;
        }
        if (typeof data.igst != "undefined") {
            if (data.igst == null || (data.igst == "" && data.igst != 0))
            { }
            else
                root.igst = data.igst;
        }
        if (typeof data.unit_identity != "undefined") {
            if (data.unit_identity == null || (data.unit_identity == "" && data.unit_identity != 0))
            { }
            else
                root.unit_identity = data.unit_identity;
        }
        if (typeof data.var_no != "undefined") {
            if (data.var_no == null || (data.var_no == "" && data.var_no != 0))
            { }
            else
                root.var_no = data.var_no;
        }
        
        $.server.webMethodPUT("sales/salesorderitem/" + id, root, callback, errorCallback);
    }
    this.putAllValue = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.putValue(billItem.order_id, billItem, function () {
                self.putAllValue(i + 1, billItems, callback);
            });
        }
    }
    this.deleteValue = function (id, data, callback, errorCallback) {
        var root = {};
        root.order_id = data.order_id;
        root.order_item_id = data.order_item_id;
        $.server.webMethodDELETE("sales/salesorderitem/" + id, root, callback, callback, callback);
    }
    this.deleteAllValue = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.deleteValue(billItem.order_id, billItem, function () {
                self.deleteAllValue(i + 1, billItems, callback);
            });
        }
    }
}