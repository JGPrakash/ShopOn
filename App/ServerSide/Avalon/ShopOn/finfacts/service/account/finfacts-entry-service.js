function FinfactsEntry() {


    this.cashSales = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("target_acc_id", data.target_acc_id);
        map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("buying_cost", data.buying_cost);
        map.add("round_off", data.round_off);
        //map.add("key_1", data.key_1);
        if (data.key_1 == "" || data.key_1 == undefined) {
            //map.add("key_1", "null");
        }
        else {
            map.add("key_1", data.key_1);
        }
        
        if (data.key_2 == "" || data.key_2 == undefined) {
            map.add("key_2", "null");
        }
        else {
            map.add("key_2", data.key_2,'Text');
        }
        
        $.server.webMethod("FinFacts.finfactsentry.cashSales", map.toString(), callback);
    }
    this.allcashSales = function (i, billItems, callback) {      //not yet used
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.cashSales(billItem, function () {
                self.allcashSales(i + 1, billItems, callback);
            });
        }
    }
    this.creditSales = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("comp_id", data.comp_id);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");

        map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("round_off", data.round_off);
        map.add("buying_cost", data.buying_cost);

        map.add("key_1", data.key_1, "Text");
        if (data.key_1 != null && data.key_1 != "" && typeof data.key_1 != "undefined")
            map.add("remove_key", data.key_1);
        if (data.key_2 != "" && data.key_2 != undefined)
            map.add("key_2", data.key_2, "Text");
        
        $.server.webMethod("FinFacts.finfactsentry.creditSales", map.toString(), callback);


    }

    this.creditSalesPayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("target_acc_id", data.target_acc_id);
        //map.add("sales_with_tax", data.sales_with_tax);
        //map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("paid_amount", data.paid_amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        if (data.key_2 != "" && data.key_2 != undefined)
            map.add("key_2", data.key_2, "Text");
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        $.server.webMethod("FinFacts.finfactsentry.creditSalesPayment", map.toString(), callback);
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

    this.cashPurchase = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("buying_cost", data.buying_cost);
        map.add("round_off", data.round_off);
        if (data.key_1 == "" || data.key_1 == undefined) {
            map.add("key_1", "null");
        }
        else {
            map.add("key_1", data.key_1);
        }

        if (data.key_2 == "" || data.key_2 == undefined) {
            map.add("key_2", "null");
        }
        else {
            map.add("key_2", data.key_2,'Text');
        }

        $.server.webMethod("FinFacts.finfactsentry.cashPurchase", map.toString(), callback);
    }

    this.creditPurchase = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("round_off", data.rnd_off);
        map.add("key_1", data.key_1, "Text");
        map.add("key_2", data.key_2, "Text");
        
        $.server.webMethod("FinFacts.finfactsentry.creditPurchase", map.toString(), callback);
    }

    this.creditPurchasePayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("target_acc_id", data.target_acc_id);
        //map.add("sales_with_tax", data.sales_with_tax);
        //map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("paid_amount", data.paid_amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        //if (data.cust_no != "" && data.cust_no != undefined)
        //    map.add("key_2", data.cust_no);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");

        $.server.webMethod("FinFacts.finfactsentry.creditPurchasePayment", map.toString(), callback);
    }
    this.allcreditPurchasePayment = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.creditPurchasePayment(billItem, function () {
                self.allcreditPurchasePayment(i + 1, billItems, callback);
            });
        }
    }
    this.cashReturnSales = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("target_acc_id", data.target_acc_id);
        map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("buying_cost", data.buying_cost);
        map.add("round_off", data.round_off);
        
        if (data.key_1 == "" || data.key_1 == undefined) {
            map.add("key_1", "null");
        }
        else {
            map.add("key_1", data.key_1);
        }

        if (data.key_2 == "" || data.key_2 == undefined) {
            map.add("key_2", "null");
        }
        else {
            map.add("key_2", data.key_2, "Text");
        }
        
        $.server.webMethod("FinFacts.finfactsentry.cashReturnSales", map.toString(), callback);
    }

    this.creditReturnSales = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("buying_cost", data.buying_cost);
        map.add("round_off", data.round_off);
        map.add("key_1", data.key_1);
        if (data.key_2 != "" && data.key_2 != undefined)
            map.add("key_2", data.key_2, "Text");
        
        $.server.webMethod("FinFacts.finfactsentry.creditReturnSales", map.toString(), callback);
    }

    this.creditReturnSalesPayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("target_acc_id", data.target_acc_id);
        //map.add("sales_with_tax", data.sales_with_tax);
        //map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("paid_amount", data.paid_amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        if (data.key_2 != "" && data.key_2 != undefined)
            map.add("key_2", data.key_2, "Text");
        if (data.key_3 != "" && data.key_3 != undefined)
            map.add("key_3", data.key_3, "Text");
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        $.server.webMethod("FinFacts.finfactsentry.creditReturnSalesPayment", map.toString(), callback);
    }

    this.allcreditReturnSalesPayment = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.creditReturnSalesPayment(billItem, function () {
                self.allcreditReturnSalesPayment(i + 1, billItems, callback);
            });
        }
    }
    this.cashReturnPurchase = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("target_acc_id", data.target_acc_id);
        map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("buying_cost", data.buying_cost);
        map.add("round_off", data.round_off);
        if (data.key_1 == "" || data.key_1 == undefined) {
            map.add("key_1", "null");
        }
        else {
            map.add("key_1", data.key_1);
        }

        if (data.key_2 == "" || data.key_2 == undefined) {
            map.add("key_2", "null");
        }
        else {
            map.add("key_2", data.key_2, "Text");
        }

        $.server.webMethod("FinFacts.finfactsentry.cashReturnPurchase", map.toString(), callback);
    }

    this.creditReturnPurchase = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("tax_amt", data.tax_amt);
        map.add("buying_cost", data.buying_cost);
        map.add("round_off", data.round_off);
        map.add("key_1", data.key_1);
        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");

        $.server.webMethod("FinFacts.finfactsentry.creditReturnPurchase", map.toString(), callback);
    }

    this.creditReturnPurchasePayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("target_acc_id", data.target_acc_id);
        //map.add("sales_with_tax", data.sales_with_tax);
        //map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("paid_amount", data.paid_amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        //if (data.cust_no != "" && data.cust_no != undefined)
        //    map.add("key_2", data.cust_no);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");
        if (data.key_3 != "" && data.key_3 != undefined)
            map.add("key_3", data.key_3, "Text");

        $.server.webMethod("FinFacts.finfactsentry.creditReturnPurchasePayment", map.toString(), callback);
    }
    this.allcreditReturnPurchasePayment = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.creditReturnPurchasePayment(billItem, function () {
                self.allcreditReturnPurchasePayment(i + 1, billItems, callback);
            });
        }
    }
    this.creditInventory = function (data, callback) {
        var mapfinfacts = new Map();
        mapfinfacts.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        mapfinfacts.add("per_id", CONTEXT.FINFACTS_CURRENT_PERIOD);
        mapfinfacts.add("key_1", data.amount);
        mapfinfacts.add("description", data.description, "Text");
        mapfinfacts.add("jrn_date", data.jrn_date, "Date");
        mapfinfacts.add("amount", data.amount);
        $.server.webMethod("FinFacts.Accounting.insertStockCredit", mapfinfacts.toString(), callback);
    }
    this.debitInventory = function (data, callback) {
        var mapfinfacts = new Map();

        mapfinfacts.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        mapfinfacts.add("per_id", CONTEXT.FINFACTS_CURRENT_PERIOD);
        mapfinfacts.add("key_1", data.amount);
        mapfinfacts.add("description", data.description, "Text");
        mapfinfacts.add("jrn_date", data.jrn_date, "Date");
        mapfinfacts.add("amount", data.amount);
        $.server.webMethod("FinFacts.Accounting.insertStockDebit", mapfinfacts.toString(), callback);
    }
    this.insertTransfer = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("target_acc_id", data.target_acc_id);
        map.add("expense_acc_id", data.expense_acc_id);
        //map.add("sales_with_out_tax", data.sales_with_out_tax);
        map.add("amount", data.amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        $.server.webMethod("FinFacts.finfactsentry.insertTransfer", map.toString(), callback);
    }

    this.creditPurchaseStock = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        //map.add("target_acc_id", data.target_acc_id);
        //.add("pur_with_tax", data.pur_with_tax);
        //map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("amount", data.pur_with_out_tax);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        //if (data.cust_no != "" && data.cust_no != undefined)
        //    map.add("key_2", data.cust_no);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);
        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");

        $.server.webMethod("FinFacts.finfactsentry.creditPurchaseStock", map.toString(), callback);
    }

    this.debitPurchaseStock = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        //map.add("target_acc_id", data.target_acc_id);
        //.add("pur_with_tax", data.pur_with_tax);
        //map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("amount", data.amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        //if (data.cust_no != "" && data.cust_no != undefined)
        //    map.add("key_2", data.cust_no);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);
        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");

        $.server.webMethod("FinFacts.finfactsentry.debitPurchaseStock", map.toString(), callback);
    }

    this.creditSaleStock = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        //map.add("target_acc_id", data.target_acc_id);
        //.add("pur_with_tax", data.pur_with_tax);
        //map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("amount", data.sales_with_out_tax);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        //if (data.cust_no != "" && data.cust_no != undefined)
        //    map.add("key_2", data.cust_no);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);
        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");

        $.server.webMethod("FinFacts.finfactsentry.creditSaleStock", map.toString(), callback);
    }
    this.debitSaleStock = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        //map.add("target_acc_id", data.target_acc_id);
        //.add("pur_with_tax", data.pur_with_tax);
        //map.add("pur_with_out_tax", data.pur_with_out_tax);
        map.add("amount", data.sales_with_out_tax);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        //if (data.cust_no != "" && data.cust_no != undefined)
        //    map.add("key_2", data.cust_no);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);
        if (data.key_2 == null || data.key_2 == "" || data.key_2 == undefined)
        { }
        else
            map.add("key_2", data.key_2, "Text");

        $.server.webMethod("FinFacts.finfactsentry.debitSaleStock", map.toString(), callback);
    }

    this.salesAdvancePayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("paid_amount", data.paid_amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        $.server.webMethod("FinFacts.finfactsentry.salesAdvancePayment", map.toString(), callback);
    }
    this.salesAdvanceReturnPayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("paid_amount", data.paid_amount);
        map.add("description", data.description, "Text");
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("key_1", data.key_1);
        if (data.comp_id != "" && data.comp_id != undefined)
            map.add("comp_id", data.comp_id);

        $.server.webMethod("FinFacts.finfactsentry.salesAdvanceReturnPayment", map.toString(), callback);
    }
}
