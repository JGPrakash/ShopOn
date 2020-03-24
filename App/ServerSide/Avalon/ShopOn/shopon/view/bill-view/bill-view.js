$.fn.billViewer = function () {
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + '/shopon/view/bill-view/bill-view.html');
        page.purchaseBillService = new PurchaseBillService();
        page.billService = new BillService();
        page.billAPI = new BillAPI();

        page.interface.load = function (bill) {

            //show popup
            //getdata and display
            if (bill.bill_type == "Purchase") {
                //$$("lblBillNo").value(bill.bill_no);
                $$("lblBillNo").value(bill.bill_id);
                page.purchaseBillService.getBillItem(bill.bill_no, function (item) {
                    page.controls.grdBillItems.width("100%");
                    page.controls.grdBillItems.height("250px");
                    page.controls.grdBillItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "120px", 'dataField': "bill_no", visible: false },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "120px", 'dataField': "bill_code" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", visible: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_code" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name" },
                            { 'name': "Qty", 'rlabel': 'Qty', 'width': "60px", 'dataField': "qty" },
                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit" },
                            { 'name': "Cost", 'rlabel': 'Cost', 'width': "90px", 'dataField': "price" },
                            { 'name': "Discount", 'rlabel': 'Discount', 'width': "80px", 'dataField': "disc_val" },
                            { 'name': "Tax", 'rlabel': 'GST', 'width': "80px", 'dataField': "tax_per" },
                            { 'name': "Amount", 'rlabel': 'Amount', 'width': "120px", 'dataField': "total_price" }

                        ]
                    });
                    page.controls.grdBillItems.dataBind(item);
                })
            }
            if (bill.bill_type == "Sales") {
                $$("lblBillNo").value(bill.bill_id);
                //page.billService.getBillItem(bill.bill_no, function (item) {
                page.billAPI.getValue(bill.bill_no, function (data) {
                    page.controls.grdBillItems.width("100%");
                    page.controls.grdBillItems.height("150px");
                    page.controls.grdBillItems.setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "50px", 'dataField': "bill_no", visible: false },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "100px", 'dataField': "bill_code" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "60px", 'dataField': "item_no", visible: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "60px", 'dataField': "item_code" },
                            { 'name': "Item Name", 'width': "150px", 'dataField': "item_name" },
                            { 'name': "Qty", 'width': "50px", 'dataField': "qty" },
                            { 'name': "Unit", 'width': "60px", 'dataField': "unit" },
                            { 'name': "Cost", 'width': "60px", 'dataField': "price" },
                            { 'name': "Discount", 'width': "80px", 'dataField': "discount" },
                            { 'name': "Tax", 'width': "60px", 'dataField': "tax_per" },
                            { 'name': "Amount", 'width': "80px", 'dataField': "total_price" }

                        ]
                    });
                    page.controls.grdBillItems.rowBound = function (row, item) {
                        if (item.unit_identity == "1") {
                            item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));
                        }
                    }
                    page.controls.grdBillItems.dataBind(data.bill_items);
                })
            }
        }
    });
}