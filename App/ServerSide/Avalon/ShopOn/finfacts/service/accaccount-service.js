/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function AccAccountService()
{
    this.getAccount = function (comp_id, callback) {
        var map = new Map();
        map.add("comp_id",comp_id);
        $.server.webMethod("FinFacts.AccAccount.getAccount", map.toString(), callback);
    };
    this.getAccountByAccId = function (data, callback) {
        var map = new Map();
        map.add("comp_id", data.comp_id);
        map.add("acc_id", data.acc_id);
        $.server.webMethod("FinFacts.AccAccount.getAccountByAccId", map.toString(), callback);
    };
   
    this.insertAccount = function (data, comp_id, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        if(data.acc_name != "" || data.acc_name != undefined)
            map.add("acc_name", data.acc_name, 'Text');
        if (data.acc_no == "" || data.acc_no == undefined || data.acc_no == null)
            data.acc_no = 0;
        map.add("acc_no", data.acc_no, 'Text');
        if(data.acc_group_id != "" || data.acc_group_id != undefined)
            map.add("acc_group_id", data.acc_group_id);
            

        $.server.webMethod("FinFacts.AccAccount.getNewAccount", map.toString(), callback);
    };
    
     this.updateAccount = function (data, callback) {
        var map = new Map();
        
       map.add("acc_name", data.acc_name, 'Text');
            map.add("acc_no", data.acc_no);
            map.add("acc_group_id", data.acc_group_id);
            
            
        map.add("acc_id",data.acc_id);
        
    $.server.webMethod("FinFacts.AccAccount.getAllUpdate", map.toString(), callback);

    };
    
    this.deleteAccount = function (acc_id, callback) {
      var map = new Map();
        map.add("acc_id",acc_id);
       $.server.webMethod("FinFacts.AccAccount.deleteAccount", map.toString(), callback);
    };
    this.getTransactions = function (acc_id,searchCriteria,callback) {
         var map = new Map();
         map.add("acc_id", acc_id);
         
         map.add("from_date", dbDate(searchCriteria.from_date));
        
         map.add("to_date",dbDate( searchCriteria.to_date));

        
         map.add("description", "%" + searchCriteria.description + "%");
         map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.AccAccount.getTransactions", map.toString(), callback);
    };
    this.getTransactionsCount = function (acc_id,acc_group_id,searchCriteria, callback) {
        var map = new Map();
        map.add("acc_id", acc_id);
        map.add("acc_group_id", acc_group_id);
        map.add("comp_id", localStorage.getItem("user_finfacts_comp_id"));
        map.add("from_date", dbDate(searchCriteria.from_date));
        map.add("to_date", dbDate(searchCriteria.to_date));
        map.add("description", "%" + searchCriteria.description + "%");
        $.server.webMethod("FinFacts.AccAccount.getTransactionsCount", map.toString(), callback);
    };
    this.getAccountGroup = function (callback) {
        var map= new Map();
        $.server.webMethod("FinFacts.AccAccount.getAccountGroup", map.toString(), callback);
    };
    this.getAccountbyGroup = function (data,callback) {
        var map = new Map();
        map.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        if (data.acc_group_id != "" && data.acc_group_id != undefined)
            map.add("acc_group_id", data.acc_group_id);

        $.server.webMethod("FinFacts.AccAccount.getAccountbyGroup", map.toString(), callback);
    };
    this.getAccountReport = function (data, callback) {
        var map = new Map();
        map.add("comp_id", CONTEXT.FINFACTS_COMPANY);
        //if (data.acc_id != "" && data.acc_id != undefined)
        map.add("acc_id", data.acc_id);
        map.add("key_1", data.key_1);
        map.add("key_2", data.key_2);
        map.add("trans_type", data.trans_type);
        if (data.acc_group_id != "" && data.acc_group_id != undefined)
            map.add("acc_group_id", data.acc_group_id);
        if (data.fromDate != "" && data.fromDate != undefined)
            map.add("fromDate", data.fromDate, "Date");
        if (data.toDate != "" && data.toDate != undefined)
            map.add("toDate", data.toDate, "Date");
        $.server.webMethod("FinFacts.AccAccount.getAccountReport", map.toString(), callback);
    };
    this.getAccAccountById = function (acc_id, callback) {
      
      $.server.webMethod("FinFacts.AccAccount.getAccAccountById", "acc_id;" + acc_id, callback);
    };

    this.getAccountByIdName = function (comp_id,term, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        map.add("term", "%" + term + "%");
        $.server.webMethod("FinFacts.AccAccount.getAccountByIdName", map.toString(), callback);
    };
    this.getOneWeekTransaction = function (comp_id,trans_type, callback) {
        var map = new Map();
        map.add("comp_id", comp_id);
        map.add("trans_type", trans_type);
        $.server.webMethod("FinFacts.AccAccount.getOneWeekTransaction", map.toString(), callback);
    };

    this.getAccDetByCompId = function (comp_id, callback) {

        $.server.webMethod("FinFacts.AccAccount.getAccDetByCompId", "comp_id;" + comp_id, callback);
    };
    this.getAmountDetailsByComp = function (comp_id, callback) {
        $.server.webMethod("FinFacts.AccAccount.getAmountDetailsByComp", "comp_id;" + comp_id, callback);
    };

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("finfacts/transaction/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.searchJournal = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("finfacts/transaction/journal/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}