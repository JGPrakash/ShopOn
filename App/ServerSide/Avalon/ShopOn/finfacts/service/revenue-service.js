/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function RevenueService()
{
    

    this.getCurrentLiabilities = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getCurrentLiabilities", map.toString(), callback);
    };

    this.getShareholdersEquities = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getShareholdersEquities", map.toString(), callback);
    };


    this.getCurrentAssetsAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getCurrentAssetsAccount", map.toString(), callback);
    };
    this.getPropertyAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getPropertyAccount", map.toString(), callback);
    };
    this.getOtherAssetsAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getOtherAssetsAccount", map.toString(), callback);
    };









    this.getSalesAccount = function (per_id,callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getSalesAccount", map.toString(), callback);
    };
    this.getPurchaseAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getPurchaseAccount", map.toString(), callback);
    };


    this.getRevenueAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getRevenueAccount", map.toString(), callback);
    };
    this.getCostOfGoodAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getCostOfGoodAccount", map.toString(), callback);
    };
    this.getExpensesAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getExpensesAccount", map.toString(), callback);
    };
    this.getIncomeAccount = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Revenue.getIncomeAccount", map.toString(), callback);
    };
     this.getCompanyName = function (callback) {
        var map = new Map();

        $.server.webMethod("FinFacts.Revenue.getCompanyName", map.toString(), callback);
    };
     this.getPeriod = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id",comp_id);
        $.server.webMethod("FinFacts.Revenue.getPeriod", map.toString(), callback);
     };

     this.getTrialBalance = function (per_id_1, per_id_2, callback) {
         var map = new Map();
         map.add("per_id_1", per_id_1);
         map.add("per_id_2", per_id_2);
         $.server.webMethod("FinFacts.Revenue.getTrialBalance", map.toString(), callback);
     };

     this.getMovingBalance = function (data, callback) {
         var i = 0;
         var map = new Map();
         map.add("per_id", data.per_id);
         map.add("key_1", "0");
         map.add("key_2", "0");
         $.server.webMethod("FinFacts.Revenue.getMovingBalance", map.toString(), function (data1) {
             if (data1.length == 0) {
                 this.insertMovingBalance(data[i], function () { });
             } else {
                 data[i].jrn_id = data1[i].jrn_id;
                 this.updateMovingBalance(data[i], function () { });
             }
             i++;
         });
     };

     this.insertMovingBalance = function (data, callback) {
         var map = new Map();
         map.add("per_id", data.per_id);
         map.add("jrn_date", data.jrn_date,"Date");
         map.add("description", data.description, "Text");
         map.add("trans_type", data.trans_type, "Text");
         map.add("key_1", "0");
         map.add("key_2", "0");
         map.add("amount", data.amount);
         map.add("acc_id", data.acc_id);
         map.add("acc_group_id", data.acc_group_id);
         $.server.webMethod("FinFacts.Revenue.insertMovingBalance", map.toString(), callback);
     };
     this.insertAllMovingBalance = function (i, datas, callback) {
         var self = this;
         if (i == datas.length) {
             callback();
         } else {
             var data = datas[i];
             self.insertMovingBalance(data, function () {
                 self.insertAllMovingBalance(i + 1, datas, callback);
             });
         }
     }

     this.updateMovingBalance = function (data, callback) {
         var map = new Map();
         map.add("jrn_id", data.jrn_id);
         map.add("per_id", data.per_id);
         map.add("jrn_date", data.jrn_date,"Date");
         map.add("description", data.description,"Text");
         map.add("key_1", "0");
         map.add("key_2", "0");
         map.add("amount", data.amount);
         map.add("acc_id", data.acc_id);
         $.server.webMethod("FinFacts.Revenue.insertMovingBalance", map.toString(), callback);
     };
     this.updateAllMovingBalance = function (i,jrn_id, datas, callback) {
         var self = this;
         if (i == datas.length) {
             callback();
         } else {
             var data = datas[i];
             data.jrn_id = jrn_id;
             self.updateMovingBalance(data, function () {
                 self.updateAllMovingBalance(i + 1,jrn_id, datas, callback);
             });
         }
     }

     this.getAllMovingBalance = function (i, datas, callback) {
         var self = this;
         if (i == datas.length) {
             callback();
         } else {
             var data = datas[i];
             self.deleteMovingBalance(data, function () {
                 self.insertMovingBalance(data, function () {
                     self.getAllMovingBalance(i + 1, datas, callback);
                 });
             });
         }
     }

     this.deleteMovingBalance = function (data, callback) {
         var map = new Map();
         map.add("per_id", data.per_id);
         map.add("jrn_date", data.jrn_date, "Date");
         map.add("description", data.description, "Text");
         map.add("key_1", "0");
         map.add("key_2", "0");
         map.add("amount", data.amount);
         map.add("acc_id", data.acc_id);
         $.server.webMethod("FinFacts.Revenue.deleteMovingBalance", map.toString(), callback);
     };
     this.getsummaryDashboard = function (callback) {
         var map = new Map();
         map.add("per_id", CONTEXT.FINFACTS_CURRENT_PERIOD);
         $.server.webMethod("FinFacts.Revenue.getsummaryDashboard", map.toString(), callback);
     };
}