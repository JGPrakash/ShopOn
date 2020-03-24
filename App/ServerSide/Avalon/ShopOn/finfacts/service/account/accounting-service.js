function AccountingService() {


    this.downloadSales = function ( callback) {
         
        $.server.webMethod("FinFacts.Accounting.downloadSales", "", callback);
    }

     this.getAutoAllAccounts = function (comp_id, callback) {
        $.server.webMethod("FinFacts.Accounting.getAutoAllAccounts", "comp_id;"+ comp_id, callback);
    } 
     this.getCashBankAccounts = function (comp_id, callback) {
         $.server.webMethod("FinFacts.Accounting.getCashBankAccounts", "comp_id;" + comp_id, callback);
     }

    this.getAutoIncomeAccounts = function (comp_id, callback) {
        $.server.webMethod("FinFacts.Accounting.getAutoIncomeAccounts", "comp_id;" + comp_id, callback);
    }

    this.getAutoExpenseAccounts = function (comp_id, callback) {
        $.server.webMethod("FinFacts.Accounting.getAutoExpenseAccounts", "comp_id;" + comp_id, callback);
    }

    this.getAutoPurchaseAccounts = function (comp_id, callback) {
        $.server.webMethod("FinFacts.Accounting.getAutoPurchaseAccounts", "comp_id;" + comp_id, callback);
    }

    this.getAutoSalesAccounts = function (comp_id, callback) {
        $.server.webMethod("FinFacts.Accounting.getAutoSalesAccounts", "comp_id;" + comp_id, callback);
    }

    this.getAllJournalEntries = function (per_id, callback) {
        var map = new Map();
        map.add("per_id", per_id);
        $.server.webMethod("FinFacts.Accounting.getAllJournalEntries", map.toString(), callback);
    }
    this.getJournalByCompAndAccount = function (key_id, callback) {
        var map = new Map();
        map.add("per_id", 15);
        map.add("key_id", key_id);

        $.server.webMethod("FinFacts.Accounting.getJournalByCompAndAccount", map.toString(), callback);
    }


    this.getSalesByYear = function (key_id, callback) {
         if(androidApp==true){ 
             AndroidProxy.execute("select * from local_customer_t where cust_id=" + key_id,function(data){
                 $(data).each(function(i,item){
            callback( [{debit_amount:item.total_sales,debit_amount:item.total_sales}]);
                 });
             });
          }
        else{
            var map = new Map();
            map.add("per_id", 15);
            map.add("key_id", key_id);

            $.server.webMethod("FinFacts.Accounting.getSalesByYear", map.toString(), callback);

        }
     }


    this.getSalesByMonth = function (key_id, callback) {
        if(androidApp==true){
            AndroidProxy.execute("select * from local_customer_t where cust_id=" + key_id,function(data){
                 $(data).each(function(i,item){
            callback( [{debit_amount:item.monthly_sales,debit_amount:item.monthly_sales}]);
                 });
             });
        }
        else{
            var map = new Map();
            map.add("per_id", 15);
            map.add("key_id", key_id);

            $.server.webMethod("FinFacts.Accounting.getSalesByMonth", map.toString(), callback);

        }
    }


    this.getPaymentOnSales = function (key_id, callback) {

        
         if(androidApp==true){
            AndroidProxy.execute("select * from local_customer_t where cust_id=" + key_id,function(data){
                 $(data).each(function(i,item){
                    callback( [{debit_amount:item.total_paid,debit_amount:item.total_paid}]);
                 });
             });
        }
        else{
        var map = new Map();
        map.add("per_id", 15);
        map.add("key_id", key_id);

        $.server.webMethod("FinFacts.Accounting.getPaymentOnSales", map.toString(), callback);
 
        }
   }

    this.getPaymentToday = function (key_id, callback) {

        if(androidApp==true){
            AndroidProxy.execute("select * from local_customer_t where cust_id=" + key_id,function(data){
                 $(data).each(function(i,item){
            callback( [{debit_amount:item.paid_amount,debit_amount:item.paid_amount}]);
                 });
             });

        }else{
            var map = new Map();
            map.add("per_id", 15);
            map.add("key_id", key_id);

            $.server.webMethod("FinFacts.Accounting.getPaymentToday", map.toString(), callback);

        }
    }





    this.insertJournal = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("acc_id", data.acc_id);
        if (data.comp_id != "" && data.comp_id!=undefined)
        map.add("comp_id", data.comp_id);

        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");

        map.add("trans_type", data.trans_type, "Text");
        map.add("amount", data.amount);

        if (data.key_1 != "" && data.key_1 != undefined)
            map.add("key_1", data.key_1);


        $.server.webMethod("FinFacts.Accounting.insertJournal", map.toString(), callback);
    }


    this.insertIncome = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("income_acc_id", data.income_acc_id);
        map.add("amount", data.amount);
        map.add("key_1", data.key_1,"Text");

        $.server.webMethod("FinFacts.Accounting.insertIncome", map.toString(), callback);
    }
    this.insertExpense = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("expense_acc_id", data.expense_acc_id);
        map.add("amount", data.amount);
        map.add("key_1", data.key_1, "Text");

        $.server.webMethod("FinFacts.Accounting.insertExpense", map.toString(), callback);
    }
    this.insertBillIncome = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("expense_acc_id", data.expense_acc_id);
        map.add("amount", data.amount);
        map.add("key_1", data.key_1, "Text");

        $.server.webMethod("FinFacts.Accounting.insertBillIncome", map.toString(), callback);
    }


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

        $.server.webMethod("FinFacts.Accounting.insertReceipt", map.toString(), callback);
    }

    this.insertStock = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("key_1", data.key_1);
        map.add("amount", data.amount);
        map.add("invent_type", data.invent_type);

        $.server.webMethod("FinFacts.Accounting.insertStock", map.toString(), callback);
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

        $.server.webMethod("FinFacts.Accounting.insertReturnReceipt", map.toString(), callback);
    }

    this.insertPayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("amount", data.amount);
        map.add("key_1", data.key_1);

        $.server.webMethod("FinFacts.Accounting.insertPayment", map.toString(), callback);
    }

    this.insertReturnPayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("amount", data.amount);
        map.add("key_1", data.key_1);

        $.server.webMethod("FinFacts.Accounting.insertReturnPayment", map.toString(), callback);
    }

    this.insertJournalManual = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);

        map.add("acc_id1", data.acc_id1);
        map.add("trans_type1", data.trans_type1, "Text");
        map.add("amount1", data.amount1);

        map.add("acc_id2", data.acc_id2);
        map.add("trans_type2", data.trans_type2, "Text");
        map.add("amount2", data.amount2);
        if (data.key_1 == undefined || data.key_1 == "")
            data.key_1 = -1;
        map.add("key_1", data.key_1);

        $.server.webMethod("FinFacts.Accounting.insertJournalManual", map.toString(), callback);
    }


    this.insertReceiptAndPayment = function (data, callback) {
        var map = new Map();
        map.add("acc_id", data.acc_id);
        //map.add("transaction_acct", data.transaction_acct);
        map.add("transaction_acct", data.transaction_acct);
        if (data.comp_id != "" && data.comp_id != undefined)

        map.add("comp_id", data.comp_id);

        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("screen_name", data.screen_name, "Text");

        map.add("trans_type", data.trans_type, "Text");
        map.add("amount", data.amount);


        $.server.webMethod("FinFacts.Accounting.insertReceiptAndPayment", map.toString(), callback);
    }


    this.insertTransaction = function (data, callback) {
        var map = new Map();

        map.add("acc_id", data.acc_id);
        map.add("jrn_id", data.jrn_id);

        map.add("trans_date", data.jrn_date, "Date");

        map.add("trans_type", data.trans_type, "Text");
        map.add("description", data.description, "Text");

        map.add("amount", data.amount);
        if (data.key_1 == undefined || data.key_1 == "")
            data.key_1 = -1;
        map.add("key_1", data.key_1);

        $.server.webMethod("FinFacts.Accounting.insertTransaction", map.toString(), callback);
    }


    this.deleteTransaction = function (data, callback) {

        var map = new Map();
        map.add("trans_id", data.trans_id);
        $.server.webMethod("FinFacts.Accounting.deleteTransaction", map.toString(), callback);
    }

    this.deleteJournal = function (data, callback) {

        var map = new Map();
        map.add("jrn_id", data.jrn_id);
        $.server.webMethod("FinFacts.Accounting.deleteJournal", map.toString(), callback);
    }

    this.getAccountsDetail = function (data, callback) {

        var map = new Map();
        map.add("acc_id", data);
        map.add("finfacts_comp_id", localStorage.getItem("user_finfacts_comp_id"));
        $.server.webMethod("FinFacts.Accounting.getAccountsDetail", map.toString(), callback);
    }

    this.getTransactions = function (acc_id,searchCriteria,callback) {
        var map = new Map();
        map.add("acc_id", acc_id);

        map.add("from_date", dbDate(searchCriteria.from_date));

        map.add("to_date",dbDate( searchCriteria.to_date));


        map.add("description", "%" + searchCriteria.description + "%");
        $.server.webMethod("FinFacts.AccAccount.getTransactions", map.toString(), callback);
    };


    this.getTransactionsByKey = function (searchCriteria,callback) {
        var map = new Map();
        map.add("key_1", searchCriteria.key_id);

        map.add("year",searchCriteria.year);

        $.server.webMethod("FinFacts.AccAccount.getTransactionsByKey", map.toString(), callback);
    };

    this.insertStockCredit = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("key_1", data.key_1);
        map.add("buying_cost", data.amount);
        map.add("invent_type", data.invent_type);

        $.server.webMethod("FinFacts.finfactsentry.insertStockCreditTransaction", map.toString(), callback);
    }
    this.insertStockDebit = function (data, callback) {
        var map = new Map();
        if (data.comp_id != "" && data.comp_id != undefined)

            map.add("comp_id", data.comp_id);
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("key_1", data.key_1);
        map.add("buying_cost", data.amount);
        map.add("invent_type", data.invent_type);

        $.server.webMethod("FinFacts.finfactsentry.insertStockDebitTransaction", map.toString(), callback);
    }

}
