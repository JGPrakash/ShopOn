function InvoiceCollectionService() {
    this.getAllInvoiceCollection = function (comp_id,callback) {
        $.server.webMethodGET("invoicecollection/invoice/invoiceCollection?comp_id=" + comp_id, callback, callback);
        
    };
    this.insertRequest = function (data, callback, errorCallback) {
        $.server.webMethodPOST("invoicecollection/invoice/Request", data, callback, errorCallback);
    }
    this.insertDirectInvoice = function (data, callback, errorCallback) {
        $.server.webMethodPOST("invoicecollection/invoice/DirectInvoice", { invoice: data }, callback, errorCallback);
    }
}


