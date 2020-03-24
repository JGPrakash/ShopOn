function FinfactsEntryAPI() {
    var self = this;

    this.cashSales = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/cashSales", data, callback, errorCallback);
    }
    this.cashPurchase = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/cashPurchase", data, callback, errorCallback);
    }
    this.allCashPurchasePayment = function (i, Items, callback) {
        var self = this;
        if (i == Items.length) {
            callback();
        } else {
            var item = Items[i];
            self.cashPurchase(item, function () {
                self.allCashPurchasePayment(i + 1, Items, callback);
            });
        }
    }
    this.cashReturnPurchase = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/cashReturnPurchase", data, callback, errorCallback);
    }
    this.allCashReturnPurchasePayment = function (i, Items, callback) {
        var self = this;
        if (i == Items.length) {
            callback();
        } else {
            var item = Items[i];
            self.cashReturnPurchase(item, function () {
                self.allCashReturnPurchasePayment(i + 1, Items, callback);
            });
        }
    }
    this.cashReturnSales = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/cashReturnSales", data, callback, errorCallback);
    }

    this.salesAdvancePayment = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/salesAdvancePayment", data, callback, errorCallback);
    }
    this.salesAdvanceReturnPayment = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/salesAdvanceReturnPayment", data, callback, errorCallback);
    }
    this.insertExpense = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/insertExpense", data, callback, errorCallback);
    }
    this.creditSales = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditSales", data, callback, errorCallback);
    }
    this.allcreditSalesPayment = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.creditSalesPayment(billItem, function () {
                self.allcreditSalesPayment(i + 1, billItems, callback);
            });
        }
    }
    this.creditSalesPayment = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditSalesPayment", data, callback, errorCallback);
    }
    this.insertJournal = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/insertJournal", data, callback, errorCallback);
    }
    this.insertTransaction = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/insertTransaction", data, callback, errorCallback);
    }

    this.allcreditReturnSalesPayment = function (i, Items, callback) {
        var self = this;
        if (i == Items.length) {
            callback();
        } else {
            var item = Items[i];
            self.creditReturnSalesPayment(item, function () {
                self.allcreditReturnSalesPayment(i + 1, Items, callback);
            });
        }
    }
    this.creditReturnSalesPayment = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditReturnSalesPayment", data, callback, errorCallback);
    }
    this.insertBillIncome = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/insertBillIncome", data, callback, errorCallback);
    }
    this.creditReturnSales = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditReturnSales", data, callback, errorCallback);
    }
    this.creditPurchase = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditPurchase", data, callback, errorCallback);
    }
    this.allcreditPurchasePayment = function (i, Items, callback) {
        var self = this;
        if (i == Items.length) {
            callback();
        } else {
            var item = Items[i];
            self.creditPurchasePayment(item, function () {
                self.allcreditPurchasePayment(i + 1, Items, callback);
            });
        }
    }
    this.creditPurchasePayment = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditPurchasePayment", data, callback, errorCallback);
    }
    this.allcreditReturnPurchasePayment = function (i, Items, callback) {
        var self = this;
        if (i == Items.length) {
            callback();
        } else {
            var item = Items[i];
            self.creditReturnPurchasePayment(item, function () {
                self.allcreditReturnPurchasePayment(i + 1, Items, callback);
            });
        }
    }
    this.creditReturnPurchasePayment = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditReturnPurchasePayment", data, callback, errorCallback);
    }
    this.creditReturnPurchase = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/creditReturnPurchase", data, callback, errorCallback);
    }
    this.discountAfterSales = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/discountAfterSales", data, callback, errorCallback);
    }
    this.discountAfterPurchase = function (data, callback, errorCallback) {
        $.server.webMethodPOST("journal/shopon/discountAfterPurchase", data, callback, errorCallback);
    }
}