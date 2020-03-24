function AccountingService() {


    this.getAutoAllAccounts = function (term, callback) {
        $.server.webMethod("Accounting.getAutoAllAccounts", "term;%" + term + "%", callback);
    }


    this.getAutoIncomeAccounts = function (term, callback) {
        $.server.webMethod("Accounting.getAutoIncomeAccounts", "term;%" + term + "%", callback);
    }

    this.getAutoExpenseAccounts = function (term, callback) {
        $.server.webMethod("Accounting.getAutoExpenseAccounts", "term;%" + term + "%", callback);
    }

    this.getAutoPurchaseAccounts = function (term, callback) {
        $.server.webMethod("Accounting.getAutoPurchaseAccounts", "term;%" + term + "%", callback);
    }

    this.getAutoSalesAccounts = function (term, callback) {
        $.server.webMethod("Accounting.getAutoSalesAccounts", "term;%" + term + "%", callback);
    }

    this.getAllJournalEntries = function (callback) {
        var map = new Map();
        $.server.webMethod("Accounting.getAllJournalEntries", map.toString(), callback);
    }

    this.insertJournal = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("acc_id", data.acc_id);

        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");

        map.add("trans_type", data.trans_type, "Text");
        map.add("amount", data.amount);


        $.server.webMethod("Accounting.insertJournal", map.toString(), callback);
    }


    this.insertIncome = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("income_acc_id", data.income_acc_id);
        map.add("amount", data.amount);

        $.server.webMethod("Accounting.insertIncome", map.toString(), callback);
    }
    this.insertExpense = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("expense_acc_id", data.expense_acc_id);
        map.add("amount", data.amount);

        $.server.webMethod("Accounting.insertExpense", map.toString(), callback);
    }


    this.insertReceipt = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);

        map.add("amount", data.amount);

        $.server.webMethod("Accounting.insertReceipt", map.toString(), callback);
    }

    this.insertPayment = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("target_acc_id", data.target_acc_id);
        map.add("amount", data.amount);

        $.server.webMethod("Accounting.insertPayment", map.toString(), callback);
    }

    this.insertJournalManual = function (data, callback) {
        var map = new Map();
        map.add("per_id", data.per_id);
        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");

        map.add("acc_id1", data.acc_id1);
        map.add("trans_type1", data.trans_type1, "Text");
        map.add("amount1", data.amount1);

        map.add("acc_id2", data.acc_id2);
        map.add("trans_type2", data.trans_type2, "Text");
        map.add("amount2", data.amount2);

        $.server.webMethod("Accounting.insertJournalManual", map.toString(), callback);
    }


    this.insertReceiptAndPayment = function (data, callback) {
        var map = new Map();
        map.add("acc_id", data.acc_id);
        //map.add("transaction_acct", data.transaction_acct);
        map.add("transaction_acct", data.transaction_acct);

        map.add("jrn_date", data.jrn_date, "Date");
        map.add("description", data.description, "Text");
        map.add("screen_name", data.screen_name, "Text");

        map.add("trans_type", data.trans_type, "Text");
        map.add("amount", data.amount);


        $.server.webMethod("Accounting.insertReceiptAndPayment", map.toString(), callback);
    }


    this.insertTransaction = function (data, callback) {
        var map = new Map();

        map.add("acc_id", data.acc_id);
        map.add("jrn_id", data.jrn_id);

        map.add("trans_date", data.jrn_date, "Date");

        map.add("trans_type", data.trans_type, "Text");
        map.add("description", data.description, "Text");

        map.add("amount", data.amount);


        $.server.webMethod("Accounting.insertTransaction", map.toString(), callback);
    }


    this.deleteTransaction = function (data, callback) {

        var map = new Map();
        map.add("trans_id", data.trans_id);
        $.server.webMethod("Accounting.deleteTransaction", map.toString(), callback);
    }

    this.deleteJournal = function (data, callback) {

        var map = new Map();
        map.add("jrn_id", data.jrn_id);
        $.server.webMethod("Accounting.deleteJournal", map.toString(), callback);
    }





}