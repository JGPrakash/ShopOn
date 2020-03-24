/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function FinfactsService() {
    this.getAccount = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        $.server.webMethod("FinFacts.AccAccount.getAccount", map.toString(), callback);
    };

    this.insertReceipt = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertReceipt", map.toString(), callback);
    }
    this.insertReturnReceipt = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        //map.add("comp_id", data.comp_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertReturnReceipt", map.toString(), callback);
    }
    this.insertCreditSales = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        //map.add("comp_id", data.comp_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditSales", map.toString(), callback);
    }
    this.insertCreditReturnSales = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        //map.add("comp_id", data.comp_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditReturnSales", map.toString(), callback);
    }
    this.insertCreditReceipt = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditReceipt", map.toString(), callback);
    }
    this.insertCreditReturnReceipt = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditReturnReceipt", map.toString(), callback);
    }
    this.insertCreditPurchase = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditPurchase", map.toString(), callback);
    }
    this.insertCreditReturnPurchase = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditReturnPurchase", map.toString(), callback);
    }
    this.insertCreditPayment = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditPayment", map.toString(), callback);
    }
    this.insertCreditReturnPayment = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertCreditReturnPayment", map.toString(), callback);
    }
    this.insertAllCreditPayment = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertCreditPayment(billItem, function () {
                self.insertAllCreditPayment(i + 1, billItems, callback);
            });
        }
    }
    this.insertAllCreditReturnPayment = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertCreditReturnPayment(billItem, function () {
                self.insertAllCreditReturnPayment(i + 1, billItems, callback);
            });
        }
    }

    this.insertAllReceipt = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertReceipt(billItem, function () {
                self.insertAllReceipt(i + 1, billItems, callback);
            });
        }
    }

    this.insertAllReturnReceipt = function (i, billItems, callback) {
        var self = this;
        if (i == billItems.length) {
            callback();
        } else {
            var billItem = billItems[i];
            self.insertReturnReceipt(billItem, function () {
                self.insertAllReturnReceipt(i + 1, billItems, callback);
            });
        }
    }

    this.insertReceiptForPoints = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        $.server.webMethod("FinFacts.finfacts.insertReceiptForPoints", map.toString(), callback);
    }

}