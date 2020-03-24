function BillExpenseService() {
    
    this.insertBillExpense = function (data, callback) {
        var map = new Map();
        map.add("bill_no", data.bill_no);
        map.add("exp_name", data.exp_name, 'Text');
        map.add("amount", data.amount);
        return $.server.webMethod("Expense.insertBillExpense", map.toString(), callback);
    }

    this.insertBillIncome = function (data, callback) {
        var map = new Map();
        map.add("bill_no", data.bill_no);
        map.add("exp_name", data.exp_name, 'Text');
        map.add("amount", data.amount);
        return $.server.webMethod("Expense.insertBillIncome", map.toString(), callback);
    }
}