function InvoiceService() {


    //search api to search purchase and sales bill
    this.searchInvoice = function (start_record, end_record, filterExpression, sort_expression, callback) {
        $.server.webMethodGET("shopon/invoice/search/main_search?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    };

    this.searchInvoiceCount = function (filterExpression, callback) {
        $.server.webMethodGET("shopon/invoice/search/main_search_count?filter_expression=" + encodeURIComponent(filterExpression), callback);
    };


    this.getInvoiceByNo = function (invoice_no, callback) {
        $.server.webMethodGET("shopon/invoice/" + invoice_no, callback);
    };

    this.insertInvoice = function (invoice, callback) {
        var invoice = {
            invoice_type: "",
            invoice_date: "",
            due_date: "",
            sales_tax_no: "",
            cust_no: "",
            reg_no: "",
            store_no: "",
            upd_user_id: "",

            invoice_no_par: "",
            order_no_ref: "",

            total: "",
            sub_total: "",
            discount: "",
            tax: "",
            round_off: "",

            invoice_items: [
               { var_no: "", qty:"",free_qty:"", price:"",tax:"",discount:"",total_price:""}
            ],
            expenses: [
                { exp_type: "", exp_amount: "" }
            ],
            discounts:[
                {disc_no:"",item_no:"",disc_per:"",disc_level:""}
            ],
            delivered_by:""
        };

        $.server.webMethodPOST("shopon/invoice/",invoice, callback);
    };

    this.updateInvoice = function (invoice, callback) {
        var invoice = {
            invoice_no:"",
            invoice_type: "",
            invoice_date: "",
            due_date: "",
            sales_tax_no: "",
            cust_no: "",
            reg_no: "",
            store_no: "",
            upd_user_id: "",

            invoice_no_par: "",
            order_no_ref: "",

            total: "",
            sub_total: "",
            discount: "",
            tax: "",
            round_off: "",

            invoice_items: [
               { var_no: "", qty: "", free_qty: "", price: "", tax: "", discount: "", total_price: "" }
            ],
            expenses: [
                { exp_type: "", exp_amount: "" }
            ],
            discounts: [
                { disc_no: "", item_no: "", disc_per: "", disc_level: "" }
            ],
            delivered_by: ""
        };

        $.server.webMethodPUT("shopon/invoice/" + invoice.invoice_no, invoice, callback);
    };


    //new->saved->approved->paid->cancelled
    this.updateInvoiceState = function (invoice_state, callback) {
        $.server.webMethodPUT("shopon/invoice/invoive_no/" + invoice_no + "/status/" + invoice_state, callback);
    };



























    this.getAllInvoice = function (start, end, searchInput,callback) {
        $.server.webMethodGET("shopon/?start=" + start + "&end=" + end + "&search_text=" + searchInput.search_text, callback);
    };

    this.getAllInvoiceCount = function (callback) {
        $.server.webMethodGET("shopon/invoic/countetemp", callback);
    };


    this.getAllDeliveyBoy = function (callback) {
        $.server.webMethodGET("shopon/invoice/deliveryBoy/all", callback);
    }
    this.getBill = function (bill_no, callback) {
        $.server.webMethodGET("shopon/invoice/bill/bill_no/"+bill_no, callback);
    };
    this.getAllDiscount = function (callback) {
        $.server.webMethodGET("shopon/invoice/discount/all", callback);
    };
    this.getAllItemDiscount = function (callback) {
        $.server.webMethodGET("shopon/invoice/discount/item", callback);
    };
    this.getAllSalestax = function (callback) {
        $.server.webMethodGET("shopon/invoice/tax/sales/all", callback);
    };
    this.getAllBillDiscount = function (bill_no, callback) {
        $.server.webMethodGET("shopon/invoice/discount/bill/"+bill_no, callback);
    };
    this.getItemAutoCompleteAllData = function (term, sales_tax_no, callback) {
        if (sales_tax_no == undefined) {
            sales_tax_no = "";
        }
        return $.server.webMethodGET("shopon/invoice/item/sales/all?sales_tax_no=1&term=" + term, callback);
        //$.server.webMethodGET("shopon/invoice/item/sales/all?sales_tax_no=" + sales_tax_no + "&term=" + term, callback);
    };
    this.getSalesTaxClass = function (sales_tax_no, callback) {
        return $.server.webMethodGET("shopon/invoice/item/sales/taxclass?sales_tax_no=1", callback);
       // $.server.webMethodGET("shopon/invoice/item/sales/taxclass?sales_tax_no=" + sales_tax_no, callback);
       // return $.server.webMethod("Bill.getSalesTaxClass", "sales_tax_no;" + sales_tax_no, callback);
    };
    this.getBillByNo = function (bill_no, callback) {
        $.server.webMethodGET("shopon/invoice/item/sales/bill/id?bill_no=" + bill_no , callback);
    }
    this.getBillItem = function (bill_no, callback) {
        $.server.webMethodGET("shopon/invoice/item/sales/bill/item?bill_no=" + bill_no, callback);
    };
    this.getItemDiscountAutocomplete = function (item_no, callback) {
        $.server.webMethodGET("shopon/invoice/item/sales/item/discount?item_no=" + item_no, callback);
        //$.server.webMethod("Item.getItemDiscountAutocomplete", "item_no;" + item_no, callback);
    };




    /*  Purchase Invoice*/
    this.getVendorByAll = function (term, callback) {
        $.server.webMethodGET("shopon/invoice/purchase/vendor/all?term="+term, callback);
    }





    this.searchSaleInvoiceCount = function (filter_expression, callback) {
        $.server.webMethodGET("shopon/invoice/search/sale/main_search_count?filter_expression=" + filter_expression, callback);
    };
    this.searchSaleInvoice = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/invoice/search/sale/main_search?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + filter_expression + "&sort_expression=" + sort_expression, callback);
    };


}