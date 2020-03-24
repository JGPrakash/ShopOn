/// <reference path="../sales-pos/sales-pos.html" />

$.fn.collectionInvoice = function () {
    return $.pageController.getControl(this, function (page,$$) {
        //Import Services required

        page.invoiceCollectionService = new InvoiceCollectionService();

        page.events.page_load = function () {
            $$("msgPanel").show("Loading please wait.....");
            $$("grdAllPendingInvoice").width("100%");
            $$("grdAllPendingInvoice").height("510px");
            $$("grdAllPendingInvoice").setTemplate({
                selection: "Multiple",
                columns: [
                    { 'name': "Bill No", 'width': "100px", 'dataField': "bill_no" },
                    { 'name': "Bill Date", 'width': "100px", 'dataField': "bill_date" },
                    { 'name': "Due Date", 'width': "100px", 'dataField': "due_date" },
                    { 'name': "Customer", 'width': "120px", 'dataField': "cust_name" },
                    { 'name': "Bill Amount", 'width': "120px", 'dataField': "pay_amount" },
                    { 'name': "Paid Amount", 'width': "120px", 'dataField': "paid_amount" },
                    { 'name': "Pay Amount", 'width': "120px", 'dataField': "collection_amount" },
                ]
            });
            $$("grdAllPendingInvoice").dataBind([]);
            page.comp_id = "1";
            page.invoiceCollectionService.getAllInvoiceCollection(page.comp_id, function (data) {
                $$("grdAllPendingInvoice").dataBind(data);
                $$("msgPanel").hide();
            })
        }
        page.events.btnRefresh_click = function () {
            $$("msgPanel").show("Refreshing please wait.....");
            
            page.invoiceCollectionService.getAllInvoiceCollection(page.comp_id,function (data) {
                $$("grdAllPendingInvoice").dataBind(data);
                $$("msgPanel").hide();
            })
        }
        page.events.btnSendForCollect_click = function () {

            page.invoiceData = $$("grdAllPendingInvoice").selectedData();
            if (page.invoiceData.length == 0) {
                $$("msgPanel").show("Please select any bill...!!!");
            }
            else {
                page.pay_data = [];
                //page.req_id = 0;
                var req_name = "Request " + moment(new Date()).format("DD-MMM-YYYY h:mm:ss A")
                var data = {
                    comp_id : "71",
                    req_name: req_name,
                    req_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    start_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    end_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    description: "ShopOn Sales"

                }
                page.invoiceCollectionService.insertRequest(data,function (data) {
                    page.req_id = data.data[0].key_value;
                    $(page.invoiceData).each(function (i, sendData) {
                        var insert_data = {
                            "ref_invoice_id": sendData.bill_no,
                            "req_id": page.req_id,
                            "due_date": sendData.due_date,
                            "amount": sendData.pay_amount,
                            "collection_amount": sendData.collection_amount,
                            "category": "ShopOn Sales",
                            "cust_ref_id": sendData.cust_no,
                            "cust_name": sendData.cust_name,
                            "phone_no": sendData.phone_no,
                            "address": sendData.cust_address,
                        };
                        page.pay_data.push(insert_data);
                    })
                    page.invoiceCollectionService.insertDirectInvoice(page.pay_data,function () {
                        $$("msgPanel").flash("Datas Exported successfully...!!!");
                    })
                })

            }

        }

    });





}
