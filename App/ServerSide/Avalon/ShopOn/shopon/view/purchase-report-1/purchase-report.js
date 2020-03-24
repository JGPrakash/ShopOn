$.fn.purchaseReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.dynaReportService = new DynaReportService();
        page.inventoryService = new InventoryService();
        page.purchaseService = new PurchaseService();
        page.reportService = new ReportService();
        page.registerAPI = new RegisterAPI();
        page.stockAPI = new StockAPI();

        page.reportAPI = new ReportAPI();
        page.shopOnStatesAPI = new ShopOnStatesAPI();
        page.vendorAPI = new VendorAPI();
        page.itemAPI = new ItemAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        var menu_ids = [];
        var reg_ids = [];
        var user_ids = [];

        document.title = "ShopOn - Purchase Report";

        page.events = {
            btnGenerate_click: function () {
                var filter={
                    viewMode: $$("ddlViewMode").selectedData().view_name ==-1 ? "" : $$("ddlViewMode").selectedData().view_name ,
                    fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: $$("ddlVendor").selectedValue()==-1 ? "" : $$("ddlVendor").selectedValue(),
                    item_no: $$("ddlItem").selectedValue()==-1 ? "" : $$("ddlItem").selectedValue(),
                    state_no: $$("ddlState").selectedValue() == "-1" ? "" : $$("ddlState").selectedValue(),
                    bill_type: $$("ddlBillType").selectedValue() == "All" ? "" : $$("ddlBillType").selectedValue(),
                    bill_payment_mode: $$("ddlPaymentType").selectedValue() == "All" || $$("ddlPaymentType").selectedValue() == "-1" ? "" : $$("ddlPaymentType").selectedValue(),
                    store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    reg_no: $$("ddlRegister").selectedValue() == "All" || $$("ddlRegister").selectedValue() == "-1" ? reg_ids.join(",") : $$("ddlRegister").selectedValue(),
                    user_no: $$("ddlLoginUser").selectedValue() == "All" || $$("ddlLoginUser").selectedValue() == "-1" ? user_ids.join(",") : $$("ddlLoginUser").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    due_date: ($$("ddlFilter").selectedValue() == "All" || $$("ddlFilter").selectedValue() == -1) ? "" : $$("ddlFilter").selectedValue(),
                    language: $$("ddlLanguage").selectedValue()
                };
                $$("msgPanel").show("Loading...!");
                page.reportAPI.purchaseReport(filter, function (data) {
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").height("400px");
                        $$("grdTransactions").width("1800px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "100%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                //{ 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_code" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                                { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date" },
                                { 'name': "Pay Date", 'rlabel': 'Pay Date', 'width': "90px", 'dataField': "pay_date" },
                                //{ 'name': "Supplier No", 'width': "90px", 'dataField': "vendor_no" },
                                //{ 'name': "Supplier Name", 'width': "180px", 'dataField': "vendor_name" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid Amt", 'rlabel': 'Paid Amt', 'width': "100px", 'dataField': "paid_amount" },
                                { 'name': "Tot Paid", 'rlabel': 'Tot Paid', 'width': "120px", 'dataField': "total_paid_amount" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "120px", 'dataField': "balance" },
                                { 'name': "Pay Mode", 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "120px", 'dataField': "tot_tax" },
                                //{ 'name': "CGST", 'width': "120px", 'dataField': "tot_cgst" },
                                //{ 'name': "SGST", 'width': "120px", 'dataField': "tot_sgst" },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "120px", 'dataField': "tot_discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "120px", 'dataField': "round_off" },
                                
                ]
                        });
                        var totalSales = 0;
                        var totalSalesPayment = 0;
                        var totalReturns = 0;
                        var totalReturnsPayment = 0;
                        var totalTax = 0;
                        var count = 0;

                        var lastSupNo = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            row.on("click", "[datafield=bill_code]", function () {
                                page.controls.pnlBillItemDetails.open();
                                page.controls.pnlBillItemDetails.title("Bill Items");
                                page.controls.pnlBillItemDetails.rlabel("Bill Items");
                                page.controls.pnlBillItemDetails.width(1000);
                                page.controls.pnlBillItemDetails.height(450);
                                page.stockAPI.getBill(item.bill_no, function (data) {
                                    page.controls.grdBill.width("4600px");
                                    page.controls.grdBill.height("auto");
                                    page.controls.grdBill.setTemplate({
                                        selection: true,
                                        columns: [
                                               { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                               { 'name': "Bar Code", 'rlabel': 'Barcode', 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                                               { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "230px", 'dataField': "item_name" },
                                               { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK},
                                               { 'name': "", 'width': "0px", 'dataField': "qty", editable: true },
                                               { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: true, visible: CONTEXT.SHOW_FREE },
                                               { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "temp_qty"},
                                               { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "100px", 'dataField': "temp_free_qty", visible: CONTEXT.SHOW_FREE },
                                               { 'name': "Tray", 'rlabel': 'Tray', 'width': "80px", 'dataField': "tray_received", visible: CONTEXT.ENABLE_MODULE_TRAY },
                                               //{ 'name': "Unit", 'width': "80px", 'dataField': "unit" },
                                               { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                                               { 'name': "Cost", 'rlabel': 'Cost', 'width': "130px", 'dataField': "temp_cost" },
                                               { 'name': "", 'width': "0px", 'dataField': "cost", editable: true, visible: false },
                                               { 'name': "Disc %", 'rlabel': 'Disc %', 'width': "130px", 'dataField': "disc_per" },
                                               { 'name': "Disc Value", 'rlabel': 'Disc Value', 'width': "130px", 'dataField': "disc_val" },
                                               { 'name': "GST %", 'rlabel': 'GST', 'width': "130px", 'dataField': "tax_per" },
                                               //{ 'name': "MRP", 'rlabel': 'MRP', 'width': "130px", 'dataField': "temp_mrp", editable: false, visible: CONTEXT.ENABLE_MRP },
                                               //{ 'name': "", 'rlabel': 'MRP', 'width': "0px", 'dataField': "mrp", editable: true, visible: false },
                                               
                                               { 'name': "Total", 'rlabel': 'Amount', 'width': "130px", 'dataField': "total_price" },
                                               //{ 'name': "Man Date", 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE && false, },// itemTemplate: "<div  id='prdManDate' style=''></div>" },
                                               //{ 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && false },
                                               //{ 'name': "Manufacture Date", 'rlabel': 'Man Date', 'width': "260px", 'dataField': "temp_man_date", visible: CONTEXT.ENABLE_MAN_DATE, itemTemplate: "<input type='date' dataField='temp_man_date'>" },
                                               //{ 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "260px", 'dataField': "temp_expiry_date", visible: CONTEXT.ENABLE_EXP_DATE, itemTemplate: "<input type='date' dataField='temp_expiry_date'>" },
                                               //{ 'name': "Batch No", 'rlabel': 'Batch No', 'width': "100px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                                        ]
                                    });
                                    page.controls.grdBill.rowBound = function (row, item) {
                                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdBill.allData().length);
                                        
                                        var htmlTemplate = [];
                                        if (CONTEXT.ENABLE_ALTER_UNIT) {
                                            if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                                                htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                                            }
                                            else {
                                                htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                                            }
                                        }
                                        else {
                                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                                        }
                                        $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                                        if (item.unit_identity == "1") {
                                            item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                                            $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));
                                            item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                                            $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                                            $(row).find("[id=itemUnit]").val(1);
                                            item.temp_cost = parseFloat(item.cost) * parseFloat(item.alter_unit_fact);
                                            $(row).find("[datafield=temp_cost]").find("div").html(parseFloat(item.temp_cost));
                                            item.temp_mrp = parseFloat(item.mrp) * parseFloat(item.alter_unit_fact);
                                            $(row).find("[datafield=temp_mrp]").find("div").html(parseFloat(item.temp_mrp));
                                        }
                                        else {
                                            item.cost = (typeof item.cost == "undefined" || item.cost == "") ? 0 : item.cost;
                                            item.temp_cost = parseFloat(item.cost);
                                            $(row).find("[datafield=temp_cost]").find("div").html(parseFloat(item.temp_cost));
                                            item.mrp = (typeof item.mrp == "undefined" || item.mrp == "") ? 0 : item.mrp;
                                            item.temp_mrp = parseFloat(item.mrp);
                                            $(row).find("[datafield=temp_mrp]").find("div").html(parseFloat(item.temp_mrp));
                                        }

                                    };
                                    $$("grdBill").dataBind(data.bill_items);
                                });
                            });
                            if ($$("ddlViewMode").selectedData().view_name  == "Standard") {
                                if (lastSupNo != item.vendor_no) {
                                    $(row).find(".header").show();
                                    //$(row).find(".header").html("<span id='groupbysupp' style='font-size 30px;'><b> Supplier No : " + item.vendor_no + ",  Supplier Name : " + item.vendor_name + ", Area : " + item.area + " </b> <span>");
                                    $(row).find(".header").html("<span id='groupbysupp' style='font-size 30px;'><b> <span style='color:red'>Supplier No : </span><span style='color:green'>" + item.vendor_no + "</span>,  <span style='color:red'>Supplier Name : </span><span style='color:green'>" + item.vendor_name + "</span>,<span style='color:red'> GST No : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>TIN : </span><span style='color:green'>" + item.tin_no + "</span>, <span style='color:red'>Area : </span><span style='color:green'>" + item.area + "</span> </b> <span>");
                                    //<span id='groupbycust' style='font-size 30px;'><b> Supplier No No : " + data.vendor_no + ",  Supplier Name : " + data.vendor_name + ", GST No : " + data.gst_no + ", TIN : " + data.tin_no + ", Area : " + data.area + " </b> <span>
                                }
                                else
                                    $(row).find(".header").hide();
                                if (item.bill_type == "Purchase") {
                                    if (count > 0) {
                                        if (data[count - 1].bill_no != data[count].bill_no) {
                                            totalSales = totalSales + parseFloat(item.total);
                                            totalTax = parseFloat(totalTax) + parseFloat(item.tot_tax);
                                            totalSalesPayment = totalSalesPayment + parseFloat(item.total_paid_amount);
                                        }
                                    }
                                    else {
                                        totalSales = totalSales + parseFloat(item.total);
                                        totalTax = parseFloat(totalTax) + parseFloat(item.tot_tax);
                                        totalSalesPayment = totalSalesPayment + parseFloat(item.total_paid_amount);
                                    }
                                }
                                else {
                                    if (count > 0) {
                                        if (data[count - 1].bill_no != data[count].bill_no) {
                                            totalReturns = totalReturns + parseFloat(item.total);
                                            totalTax = parseFloat(totalTax) - parseFloat(item.tot_tax);
                                            totalReturnsPayment = totalReturnsPayment + parseFloat(item.total_paid_amount);
                                        }
                                    }
                                    else {
                                        totalReturns = totalReturns + parseFloat(item.total);
                                        totalTax = parseFloat(totalTax) - parseFloat(item.tot_tax);
                                        totalReturnsPayment = totalReturnsPayment + parseFloat(item.total_paid_amount);
                                    }
                                    
                                }
                                lastSupNo = item.vendor_no;
                                count++;
                            }
                        }
                        //page.controls.grdTransactions.rowBound = function (row, item) {
                        //    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        //}
                        $$("grdTransactions").dataBind(data);
                        $$("msgPanel").hide();

                        $$("pnlSummary").show();
                        //$$("pnlGridSummary").hide();
                        $$("pnlLanguage").hide();
                        var load = false;
                        if(data.length <= 250)
                            load = true;
                        if (load) {
                            $$("lblTotalSales").value(totalSales.toFixed(2));
                            $$("lblTotalPayment").value(totalSalesPayment.toFixed(2));
                            $$("lblTotalReturns").value(totalReturns.toFixed(2));
                            $$("lblTotalReturnsPayment").value(totalReturnsPayment.toFixed(2));
                            $$("lblNetSales").value(parseFloat(totalSales.toFixed(2) - totalReturns.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblPurchaseBalance").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblReturnBalance").value(parseFloat(totalReturns.toFixed(2) - totalReturnsPayment.toFixed(2)).toFixed(2));
                        }
                        
                        //StoreWise Report
                        //$$("grdPurchaseReport").height("100px");
                        //$$("grdPurchaseReport").width("700px");
                        //$$("grdPurchaseReport").setTemplate({
                        //    selection: "Single", paging: true, pageSize: 100,
                        //    columns: [
                        //        { 'name': "Store Name", 'rlabel': 'Store Name', 'width': "100px", 'dataField': "store_name" },
                        //        { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "100px", 'dataField': "total_sales" },
                        //        { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "100px", 'dataField': "total_return_sales" },
                        //        { 'name': "Purchase Payment", 'rlabel': 'Purchase Payment', 'width': "100px", 'dataField': "total_sales_payment" },
                        //        { 'name': "Return Payment", 'rlabel': 'Return Payment', 'width': "100px", 'dataField': "total_return_sales_payment" },
                        //        //{ 'name': "Total Tax", 'width': "100px", 'dataField': "total_tax" },
                        //    ]
                        //});
                        //page.reportAPI.storePurchaseReport(filter, function (data) {
                        //    page.controls.grdPurchaseReport.dataBind(data);
                        //    $(data).each(function (i, items) {
                        //        if (!load) {
                        //            if (items.store_no == localStorage.getItem("user_store_no")) {
                        //                $$("lblTotalSales").value(items.total_sales);
                        //                $$("lblTotalPayment").value(items.total_sales_payment);
                        //                $$("lblTotalReturns").value(items.total_return_sales);
                        //                $$("lblTotalReturnsPayment").value(items.total_return_sales_payment);
                        //                $$("lblNetSales").value(parseFloat(items.total_sales) - parseFloat(items.total_return_sales));
                        //                $$("lblTotalTax").value(parseFloat(items.total_purchase_tax) - parseFloat(items.total_return_tax));
                        //            }
                        //        }
                        //    })
                        //});
                    }
                    else if ($$("ddlViewMode").selectedData().view_name  == "POWise") {
                        $$("grdTransactions").height("400px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "PO No", 'width': "70px", 'dataField': "po_no" },
                                //{ 'name': "Bill No", 'width': "70px", 'dataField': "bill_no" },
                                { 'name': "Bill No", 'width': "70px", 'dataField': "bill_code" },
                                { 'name': "Invoice No", 'width': "100px", 'dataField': "invoice_no" },
                                { 'name': "Supplier No", 'width': "100px", 'dataField': "vendor_no" },
                                { 'name': "Supplier Name", 'width': "180px", 'dataField': "vendor_name" },
                                { 'name': "Ordered Date", 'width': "130px", 'dataField': "ordered_date" },
                                { 'name': "Status", 'width': "120px", 'dataField': "state_text" },
                                 { 'name': "No of items", 'width': "100px", 'dataField': "no_of_items" },
                                { 'name': "Total Cost", 'width': "120px", 'dataField': "total_cost" },
                                { 'name': "Total Paid", 'width': "120px", 'dataField': "paid_amount" }



                            ]
                        });
                        page.controls.grdTransactions.rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        page.controls.grdTransactions.dataBind(data);
                        $$("msgPanel").hide();
                        $$("pnlSummary").hide();
                        //$$("pnlGridSummary").hide();
                        $$("pnlLanguage").hide();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SupplierWise") {
                        $$("grdTransactions").height("400px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                //{ 'name': "Supplier No", 'rlabel': 'Supplier No', 'width': "100px", 'dataField': "vendor_no" },
                                { 'name': "Supplier No", 'rlabel': 'Supplier No', 'width': "100px", 'dataField': "vendor_id" },
                                { 'name': "Supplier Name", 'rlabel': 'Supplier Name', 'width': "200px", 'dataField': "vendor_name" },
                                { 'name': "GST No", 'rlabel': 'GST No', 'width': "150px", 'dataField': "gst_no" },
                                { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "150px", 'dataField': "total_price" },
                                { 'name': "Total Paid", 'rlabel': 'Total Paid', 'width': "150px", 'dataField': "total_paid_amount" }



                            ]
                        });
                        page.controls.grdTransactions.rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        page.controls.grdTransactions.dataBind(data);
                        $$("msgPanel").hide();
                        $$("pnlSummary").hide();
                        //$$("pnlGridSummary").hide();
                        $$("pnlLanguage").hide();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                        $$("grdTransactions").height("400px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no" },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_code" },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name", visible: ($$("ddlLanguage").selectedValue() == "-1") },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name_tr", visible: ($$("ddlLanguage").selectedValue() != "-1") },
                                { 'name': "Unit", 'rlabel': 'Unit', 'width': "120px", 'dataField': "unit" },
                                { 'name': "Quantity", 'rlabel': 'Quantity', 'width': "120px", 'dataField': "qty" },
                                { 'name': "Cost", 'rlabel': 'Cost', 'width': "120px", 'dataField': "price" },
                                { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "120px", 'dataField': "free_qty",visible:false },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "120px", 'dataField': "total_price" },
                                { 'name': "Total Paid", 'rlabel': 'Total Paid', 'width': "120px", 'dataField': "total_paid_amount" }
                            ]
                        });
                        page.controls.grdTransactions.rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        page.controls.grdTransactions.dataBind(data);
                        $$("msgPanel").hide();
                        $$("pnlSummary").hide();
                        //$$("pnlGridSummary").hide();
                        $$("pnlLanguage").show();
                    }
                    else {
                        $$("grdTransactions").height("400px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                           /* columns: [
                                { 'name': "Date", 'width': "200px", 'dataField': "sum_date" },
                               
                                { 'name': "Total Amount", 'width': "200px", 'dataField': "total_price" },
                                { 'name': "Total Paid", 'width': "80px", 'dataField': "total_paid_amount" }



                            ]*/
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                { 'name': "Date", 'rlabel': 'Date', 'width': "150px", 'dataField': "sum_date" },

                                { 'name': "Total Purchase", 'rlabel': 'Total Purchase', 'width': "180px", 'dataField': "tot_sale" },

                                { 'name': "Total Payment", 'rlabel': 'Total Payment', 'width': "180px", 'dataField': "tot_pay" },
                            { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "180px", 'dataField': "tot_ret" },

                           { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "200px", 'dataField': "tot_ret_pay" }

                            ]
                        });
                        var newData = [];
                        var lastDate = "";
                        var lastItem = null;
                        $(data).each(function (i, item) {

                            if (item.sum_date != lastDate) {
                                newData.push(item)
                                lastItem = item;
                                lastItem.tot_sale = 0;
                                lastItem.tot_pay = 0;
                                lastItem.tot_ret = 0;
                                lastItem.tot_ret_pay = 0;
                            }
                            if (item.bill_type == "Purchase") {
                                lastItem.tot_sale = item.total_price;
                                lastItem.tot_pay = item.total_paid_amount;
                            }
                            else {
                                lastItem.tot_ret = item.total_price;
                                lastItem.tot_ret_pay = item.total_paid_amount;
                            }

                            lastDate = item.sum_date;
                        });
                        page.controls.grdTransactions.rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        page.controls.grdTransactions.dataBind(newData);
                        $$("msgPanel").hide();
                        //page.controls.grdTransactions.dataBind(data);

                        $$("pnlSummary").hide();
                        //$$("pnlGridSummary").hide();
                        $$("pnlLanguage").hide();
                    }
                   
                });
            },
            page_load: function () {
                var filterViewData = [];
                filterViewData.push({ view_no: "1", view_name: "Standard" }, { view_no: "2", view_name: "SummaryDay" }, { view_no: "3", view_name: "SummaryMonth" }, { view_no: "4", view_name: "SummaryYear" }, { view_no: "5", view_name: "SupplierWise" }, { view_no: "6", view_name: "ItemWise" })
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");
                var languageData = [];
                languageData.push({ view_no: "'en'", view_name: "English" }, { view_no: "'ta'", view_name: "Tamil" });
                $$("ddlLanguage").dataBind(languageData, "view_no", "view_name","Select");
                page.shopOnStatesAPI.searchValues("", "", "po_t=1", "", function (data) {

                    $$("ddlState").dataBind(data, "state_no", "state_name", "All");

                });

                //page.inventoryService.getAllVendors(function (data) {
                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlVendor").dataBind(data, "vendor_no", "vendor_name", "All");

                });

                //page.itemService.getAllItem("",function(data){
                page.itemAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlItem").dataBind(data, "item_no", "item_name", "All");

                });

                $$("grdTransactions").width("100%");
           
                $$("pnlSummary").hide();
                //$$("pnlGridSummary").hide();
                $$("ddlViewMode").selectionChange(function () {
                    if ($$("ddlViewMode").selectedData().view_name  == "Standard") {
                        $$("pnlItem").hide();
                        $$("pnlSales").hide();
                        $$("pnlFilter").show();
                        $$("pnlLanguage").hide();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                        $$("pnlLanguage").show();
                    }
                    else {
                        $$("pnlItem").show();
                        $$("pnlSales").show();
                        $$("pnlFilter").hide();
                        $$("pnlLanguage").hide();
                    }
                });
                $$("pnlItem").hide();
                $$("pnlSales").hide();

                //page.reportService.getStoreByComp(function (data) {
                var previlageData = {
                    obj_type: "Product::CompProd::Store",
                    obj_id: localStorage.getItem("prod_id"),
                };
                page.userpermissionAPI.getValue(previlageData, function (store_data) {
                    $(store_data).each(function (i, item) {
                        item.obj_id = item.obj_id.split("::")[2];
                        menu_ids.push(item.obj_id);
                    });
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "store_no in (" + menu_ids.join(",") + ")",
                        sort_expression: ""
                    }
                    page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlStore").dataBind(data, "store_no", "store_name", "All");
                        $$("ddlStore").selectedValue(getCookie("user_store_id"));
                    });
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                    sort_expression: ""
                }
                page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.controls.ddlRegister.dataBind(data, "reg_no", "reg_name", "All");
                    $(data).each(function (i, item) {
                        reg_ids.push(item.reg_no);
                    })
                });
                var payModeType = [];
                payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Mixed" }, { mode_type: "Loan" });
                page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type", "All");

                //setTimeout(function () {
                    $$("ddlLoginUser").dataBind(CONTEXT.USERIDACCESS, "user_id", "user_name", "All");
                    $(CONTEXT.USERIDACCESS).each(function (i, item) {
                        user_ids.push(item.user_id);
                    });
                //}, 5000);
        }

        }
        page.events.btnReport_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.rlabel("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(200);
            //PrintDataPR(0);
        }
        page.events.btnPrintJasperBill_click = function () {
            jasperReport();
        }
        page.events.btnPrint_click = function () {
            PrintData(0);
        }
        function jasperReport() {
            var detail_list = [];
            var filter={
                viewMode: $$("ddlViewMode").selectedData().view_name ==-1 ? "" : $$("ddlViewMode").selectedData().view_name ,
                fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: $$("ddlVendor").selectedValue()==-1 ? "" : $$("ddlVendor").selectedValue(),
                item_no: $$("ddlItem").selectedValue()==-1 ? "" : $$("ddlItem").selectedValue(),
                state_no: $$("ddlState").selectedValue() == "-1" ? "" : $$("ddlState").selectedValue(),
                bill_type: $$("ddlBillType").selectedValue() == "All" ? "" : $$("ddlBillType").selectedValue(),
                bill_payment_mode: $$("ddlPaymentType").selectedValue() == "All" || $$("ddlPaymentType").selectedValue() == "-1" ? "" : $$("ddlPaymentType").selectedValue(),
                store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                reg_no: $$("ddlRegister").selectedValue() == "All" || $$("ddlRegister").selectedValue() == "-1" ? reg_ids.join(",") : $$("ddlRegister").selectedValue(),
                user_no: $$("ddlLoginUser").selectedValue() == "All" || $$("ddlLoginUser").selectedValue() == "-1" ? user_ids.join(",") : $$("ddlLoginUser").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                due_date: ($$("ddlFilter").selectedValue() == "All" || $$("ddlFilter").selectedValue() == -1) ? "" : $$("ddlFilter").selectedValue(),
                language: $$("ddlLanguage").selectedValue()
            };
            page.reportAPI.purchaseReport(filter, function (data) {
                var detail = data;
                if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Bill No": (item.bill_no == null) ? "" : item.bill_no,
                            "Bill Type": (item.bill_type == null) ? "" : item.bill_type,
                            "Bill Date": (item.bill_date == null) ? "" : item.bill_date,
                            "Supp No": (item.vendor_no == null) ? "" : item.vendor_no,
                            "Supp Name": (item.vendor_name == null) ? "" : item.vendor_name,
                            "GST No": (item.gst_no == null) ? "" : item.gst_no,
                            "TIN No": (item.tin_no == null) ? "" : item.tin_no,
                            "CGST": (item.tot_tax == null) ? "" : parseFloat(item.tot_tax).toFixed(2),
                            "SGST": (item.tot_tax == null) ? "" : parseFloat(item.tot_tax).toFixed(2),
                            "GST": (item.tot_tax == null) ? "" : parseFloat(item.tot_tax).toFixed(2),
                            "Company": (item.company == null) ? "" : item.company,
                            "AREA": (item.area == null) ? "" : item.area,
                            "Amount": (item.total == null) ? "" : item.total,
                            "Sub Total": (item.sub_total == null) ? "" : item.sub_total,
                            "Discount": (item.tot_discount == null) ? "" : item.tot_discount,
                            "Rnd Off": (item.round_off == null) ? "" : item.round_off,
                            "Paid": (item.paid_amount == null) ? "" : item.paid_amount,
                            "Paid Mode": (item.pay_mode == null) ? "" : item.pay_mode,
                            "Total Amount": (item.total_paid_amount == null) ? "" : item.total_paid_amount,
                            "Balance": (item.balance == null) ? "" : item.balance

                        });
                    });
                    var accountInfo =
                                {
                                    "TotalPurchase": page.controls.lblTotalSales.value(),
                                    "TotalTax": page.controls.lblTotalTax.value(),
                                    "TotalPayment": page.controls.lblTotalPayment.value(),
                                    "TotalReturn": page.controls.lblTotalReturns.value(),
                                    "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                    "NetPurchase": page.controls.lblNetSales.value(),
                                    "ClosingBalance": "0.00",
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "CompanyCityStreetPincode": "",
                                    "ReportName": "Purchase Report ( Standard )",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Purchase-Report-Jasper/shopon-purchase-report new.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "POWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Order No": item.po_no,
                            "Order Date": item.ordered_date,
                            "Supp No": item.vendor_no,
                            "Supp Name": item.vendor_name,
                            "Status": item.state_text,
                            "Bill No": item.bill_no,
                            "Invoice No": item.invoice_no,
                            "No of items": item.no_of_items,
                            "Total Cost": item.total_cost,
                            "Paid": item.paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "ReportName": "Purchase Report ( Purchase Order Wise )",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Purchase-PO-Wise-Report/purchase-order-wise.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "SupplierWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Supp No": item.vendor_no,
                            "Supp Name": item.vendor_name,
                            "Total Price": item.total_price,
                            "Paid": item.total_paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "ReportName": "Purchase Report ( Supplier Wise )",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Purchase-Supplier-Wise/supplier-wise-purchase.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            //"Item No": item.item_no,
                            "Item No": item.item_code,
                            "Item Name": item.item_name,
                            "Unit": item.unit,
                            "Quantity": item.qty,
                            "Total Price": item.total_price,
                            "Cost": item.price,
                            "Paid": item.total_paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "ReportName": "Purchase Report ( Item Wise )",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Purchase-Item-Wise-Report/item-wise-purchase.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Date": item.sum_date,
                            "Total Sale": item.tot_sale,
                            "Total Payment": item.tot_pay,
                            "Total Return": item.tot_ret,
                            "Total Return Payment": item.tot_ret_pay
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    //"ReportName": "Sales Report ( Summary Day )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                    "Details": detail_list
                                };
                    if ($$("ddlViewMode").selectedData().view_name == "SummaryDay") {
                        accountInfo.ReportName = "Purchase Report ( Summary Day )";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryMonth") {
                        accountInfo.ReportName = "Purchase Report ( Summary Month )";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                        accountInfo.ReportName = "Purchase Report ( Summary Year )";
                    }
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Purchase-Report-Jasper/purchase-report-sum-day.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
            });
        }
        function PrintDataPRJ(dataList) {
            var accountInfo = {
                "viewMode": "Standard",
                "SDate": "20-01-2017",
                "EDate": "20-06-2017",
                "Supplier": "All",
                "BillType": "All",
                "Item": "All",
                "Status": "All",
                "TotalSales": "10830487.27",
                "TotalPayment": "4585595.29",
                "TotalReturn": "1346219.75",
                "TotalReturnPayment": "298240.00",
                "NetSales": "9484267.52",
                "ApplicaName": "Shopon Dev Region",
                "ApplsName": "SHOPON DEV REGION",
                "CompanyAddress": "NO.102G/32/4 POLPETTAI TUTICORIN DIST TUTICORIN-628002",
                "PhoneNo": "+919345345434",
                "CompanyDLNo": "TNT/161/20B-TNT/149/21B",
                "CompanyTINNo": "33586450443",
                "CompanyGST": "33APOPR2352F1ZV",
                "Standard": [
                    {
                        "BillNo": "16",
                        "BillType": "Purchase",
                        "BillDate": "19-07-2017",
                        "SupplierNo": "5",
                        "SupplierName": "Agarwals",
                        "Amount": "94860.00",
                        "Paid": "0.00",
                        "Balance": "94860.00"
                    },
                    {
                        "BillNo": "58",
                        "BillType": "Return",
                        "BillDate": "20-07-2017",
                        "SupplierNo": "1",
                        "SupplierName": "Test Supplier",
                        "Amount": "903.00",
                        "Paid": "0.00",
                        "Balance": "903.00"
                    },
                    {
                        "BillNo": "128",
                        "BillType": "Purchase",
                        "BillDate": "26-07-2017",
                        "SupplierNo": "1",
                        "SupplierName": "Test Supplier",
                        "Amount": "6048.00",
                        "Paid": "0.00",
                        "Balance": "6048.00"
                    }
                ],
                "Summary": [
                  {
                      "Date": "15-07-2017",
                      "TotalSale": "197533.20",
                      "TotalPayment": "163628.40",
                      "TotalReturn": "75000.00",
                      "TotalReturnPayment": "75000.00"
                  },
                  {
                      "Date": "17-07-2017",
                      "TotalSale": "693870.00",
                      "TotalPayment": "693870.00",
                      "TotalReturn": "98880.00",
                      "TotalReturnPayment": "98880.00"
                  },
                  {
                      "Date": "18-07-2017",
                      "TotalSale": "7900.00",
                      "TotalPayment": "7900.00",
                      "TotalReturn": "0.00",
                      "TotalReturnPayment": "0.00"
                  }
                ],
                "SupplierWise": [
                  {
                      "SupplierNo": "1",
                      "SupplierName": "Test Supplier",
                      "TotalAmount": "1072647.35",
                      "TotalPaid": "333983.60"
                  },
                  {
                      "SupplierNo": "2",
                      "SupplierName": "Test Supplier 2",
                      "TotalAmount": "472878.40",
                      "TotalPaid": "472878.40"
                  },
                  {
                      "SupplierNo": "3",
                      "SupplierName": "Elcliff Formulations PVT LTD",
                      "TotalAmount": "1970017.83",
                      "TotalPaid": "253067.49"
                  }
                ],
                "POWise": [
                  {
                      "PONo": "1",
                      "BillNo": "1",
                      "InvoiceNo": "123",
                      "SupplierNo": "1",
                      "SupplierName": "Test Supplier",
                      "OrderedDate": "15-07-2017",
                      "Status": "Completed",
                      "NoItems": "1",
                      "TotalCost": "50000.00",
                      "TotalPaid": "76000.00"
                  },
                  {
                      "PONo": "12",
                      "BillNo": "14",
                      "InvoiceNo": "111",
                      "SupplierNo": "5",
                      "SupplierName": "Agarwals",
                      "OrderedDate": "17-07-2017",
                      "Status": "Confirmed",
                      "NoItems": "3",
                      "TotalCost": "7300.00",
                      "TotalPaid": "7900.00"
                  },
                  {
                      "PONo": "36",
                      "BillNo": "90",
                      "InvoiceNo": "794765416",
                      "SupplierNo": "10",
                      "SupplierName": "Test1",
                      "OrderedDate": "24-07-2017",
                      "Status": "Confirmed",
                      "NoItems": "1",
                      "TotalCost": "600000.00",
                      "TotalPaid": "600000.00"
                  }
                ],
                "ItemWise": [
                  {
                      "ItemNo": "1",
                      "ItemName": "AZIFF",
                      "Unit": "Gram",
                      "Quantity": "1000.00",
                      "Cost": "10.00",
                      "Amount": "9997.99",
                      "TotalPaid": "9997.99"
                  },
                  {
                      "ItemNo": "121",
                      "ItemName": "Good day",
                      "Unit": "Pieces",
                      "Quantity": "2000.00",
                      "Cost": "50.00",
                      "Amount": "94860.00",
                      "TotalPaid": "0.00"
                  },
                  {
                      "ItemNo": "12",
                      "ItemName": "BIOTIFF SACHET",
                      "Unit": "No Unit",
                      "Quantity": "200.00",
                      "Cost": "4.00",
                      "Amount": "816.00",
                      "TotalPaid": "0.00"
                  }
                ]
            };
            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "PurchaseStandard.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }
        function PrintDataPR(dataList) {

            if ($$("ddlViewMode").selectedData().view_name  == "Standard") {
                var Standard = [];
                var Summary = [];
                var SupplierWise = [];
                var POWise = [];
                var ItemWise = [];
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                        Standard.push({
                            "BillNo": data.bill_no,
                            "BillType": data.bill_type,
                            "BillDate": data.bill_date,
                            "SupplierNo": data.vendor_no,
                            "SupplierName": data.vendor_name,
                            "Amount": data.total,
                            "Paid": data.total_paid_amount,
                            "Balance": data.balance
                        });
                });
                Summary.push({
                    "Date": "",
                    "TotalSale": "",
                    "TotalPayment": "",
                    "TotalReturn": "",
                    "TotalReturnPayment": ""
                });
                SupplierWise.push({
                    "SupplierNo": "",
                    "SupplierName": "",
                    "TotalAmount": "",
                    "TotalPaid": ""
                });
                POWise.push({
                    "PONo": "",
                    "BillNo": "",
                    "InvoiceNo": "",
                    "SupplierNo": "",
                    "SupplierName": "",
                    "OrderedDate": "",
                    "Status": "",
                    "NoItems": "",
                    "TotalCost": "",
                    "TotalPaid": ""
                });
                ItemWise.push({
                    "ItemNo": "",
                    "ItemName": "",
                    "Unit": "",
                    "Quantity": "",
                    "Cost": "",
                    "Amount": "",
                    "TotalPaid": ""
                });
                    var accountInfo =
                              {
                                  "viewMode": $$("ddlViewMode").selectedData().view_name ,
                                  "SDate": $$("txtStartDate").getDate(),
                                  "EDate": $$("txtEndDate").getDate(),
                                  "Supplier": $$("ddlVendor").selectedValue(),
                                  "BillType": $$("ddlBillType").selectedValue(),
                                  "Item": $$("ddlItem").selectedValue(),
                                  "Status": $$("ddlState").selectedValue(),
                                  "TotalSales": page.controls.lblTotalSales.value(),
                                  "TotalPayment": page.controls.lblTotalPayment.value(),
                                  "TotalReturn": page.controls.lblTotalReturns.value(),
                                  "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                  "NetSales": page.controls.lblNetSales.value(),
                                  "ApplicaName": CONTEXT.COMPANY_NAME,
                                  "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                  "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                  "PhoneNo": CONTEXT.COMPANY_PHONE_NO,
                                  "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                  "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                  "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                  "Standard": Standard,
                                  "Summary": Summary,
                                  "SupplierWise": SupplierWise,
                                  "POWise": POWise,
                                  "ItemWise": ItemWise
                              };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "purchase-report/PurchaseStandard.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                    //GeneratePrint(CONTEXT.ReportAppName, "purchase/Purchase.jrxml", accountInfo, "PDF", "purchase/PurStandard.jrxml");
                
            }
            else if ($$("ddlViewMode").selectedData().view_name  == "POWise") {
                var Standard = [];
                var Summary = [];
                var SupplierWise = [];
                var POWise = [];
                var ItemWise = [];
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    Standard.push({
                        "BillNo": "",
                        "BillType": "",
                        "BillDate": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "Amount": "",
                        "Paid": "",
                        "Balance": ""
                    });
                    Summary.push({
                        "Date": "",
                        "TotalSale": "",
                        "TotalPayment": "",
                        "TotalReturn": "",
                        "TotalReturnPayment": ""
                    });
                    SupplierWise.push({
                        "SupplierNo": "",
                        "SupplierName": "",
                        "TotalAmount": "",
                        "TotalPaid": ""
                    });
                    POWise.push({
                        "PONo": data.po_no,
                        "BillNo": data.bill_no,
                        "InvoiceNo": data.invoice_no,
                        "SupplierNo": data.vendor_no,
                        "SupplierName": data.vendor_name,
                        "OrderedDate": data.ordered_date,
                        "Status": data.state_text,
                        "NoItems": data.no_of_items,
                        "TotalCost": data.total_cost,
                        "TotalPaid": data.paid_amount
                    });
                    ItemWise.push({
                        "ItemNo": "",
                        "ItemName": "",
                        "Unit": "",
                        "Quantity": "",
                        "Cost": "",
                        "Amount": "",
                        "TotalPaid": ""
                    });
                });
                    var accountInfo =
                              {
                                  "viewMode": $$("ddlViewMode").selectedData().view_name ,
                                  "SDate": $$("txtStartDate").getDate(),
                                  "EDate": $$("txtEndDate").getDate(),
                                  "Supplier": $$("ddlVendor").selectedValue(),
                                  "BillType": $$("ddlBillType").selectedValue(),
                                  "Item": $$("ddlItem").selectedValue(),
                                  "Status": $$("ddlState").selectedValue(),
                                  "TotalSales": page.controls.lblTotalSales.value(),
                                  "TotalPayment": page.controls.lblTotalPayment.value(),
                                  "TotalReturn": page.controls.lblTotalReturns.value(),
                                  "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                  "NetSales": page.controls.lblNetSales.value(),
                                  "ApplicaName": CONTEXT.COMPANY_NAME,
                                  "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                  "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                  "PhoneNo": CONTEXT.COMPANY_PHONE_NO,
                                  "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                  "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                  "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                  "Standard": Standard,
                                  "Summary": Summary,
                                  "SupplierWise": SupplierWise,
                                  "POWise": POWise,
                                  "ItemWise": ItemWise
                              };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "purchase-report/PurchasePO.jrxml", accountInfo, $$("ddlExportType").selectedValue());

            }
            else if ($$("ddlViewMode").selectedData().view_name  == "SupplierWise") {
                var Standard = [];
                var Summary = [];
                var SupplierWise = [];
                var POWise = [];
                var ItemWise = [];
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    Standard.push({
                        "BillNo": "",
                        "BillType": "",
                        "BillDate": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "Amount": "",
                        "Paid": "",
                        "Balance": ""
                    });
                    Summary.push({
                        "Date": "",
                        "TotalSale": "",
                        "TotalPayment": "",
                        "TotalReturn": "",
                        "TotalReturnPayment": ""
                    });
                    SupplierWise.push({
                        "SupplierNo": data.vendor_no,
                        "SupplierName": data.vendor_name,
                        "TotalAmount": data.total_price,
                        "TotalPaid": data.total_paid_amount
                    });
                    POWise.push({
                        "PONo": "",
                        "BillNo": "",
                        "InvoiceNo": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "OrderedDate": "",
                        "Status": "",
                        "NoItems": "",
                        "TotalCost": "",
                        "TotalPaid": ""
                    });
                    ItemWise.push({
                        "ItemNo": "",
                        "ItemName": "",
                        "Unit": "",
                        "Quantity": "",
                        "Cost": "",
                        "Amount": "",
                        "TotalPaid": ""
                    });
                });
                    var accountInfo =
                              {
                                  "viewMode": $$("ddlViewMode").selectedData().view_name ,
                                  "SDate": $$("txtStartDate").getDate(),
                                  "EDate": $$("txtEndDate").getDate(),
                                  "Supplier": $$("ddlVendor").selectedValue(),
                                  "BillType": $$("ddlBillType").selectedValue(),
                                  "Item": $$("ddlItem").selectedValue(),
                                  "Status": $$("ddlState").selectedValue(),
                                  "TotalSales": page.controls.lblTotalSales.value(),
                                  "TotalPayment": page.controls.lblTotalPayment.value(),
                                  "TotalReturn": page.controls.lblTotalReturns.value(),
                                  "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                  "NetSales": page.controls.lblNetSales.value(),
                                  "ApplicaName": CONTEXT.COMPANY_NAME,
                                  "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                  "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                  "PhoneNo": CONTEXT.COMPANY_PHONE_NO,
                                  "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                  "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                  "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                  "Standard": Standard,
                                  "Summary": Summary,
                                  "SupplierWise": SupplierWise,
                                  "POWise": POWise,
                                  "ItemWise": ItemWise
                              };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "purchase-report/PurchaseSupp.jrxml", accountInfo, $$("ddlExportType").selectedValue());

            }
            else if ($$("ddlViewMode").selectedData().view_name  == "ItemWise") {
                var Standard = [];
                var Summary = [];
                var SupplierWise = [];
                var POWise = [];
                var ItemWise = [];
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    Standard.push({
                        "BillNo": "",
                        "BillType": "",
                        "BillDate": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "Amount": "",
                        "Paid": "",
                        "Balance": ""
                    });
                    Summary.push({
                        "Date": "",
                        "TotalSale": "",
                        "TotalPayment": "",
                        "TotalReturn": "",
                        "TotalReturnPayment": ""
                    });
                    SupplierWise.push({
                        "SupplierNo": "",
                        "SupplierName": "",
                        "TotalAmount": "",
                        "TotalPaid": ""
                    });
                    POWise.push({
                        "PONo": "",
                        "BillNo": "",
                        "InvoiceNo": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "OrderedDate": "",
                        "Status": "",
                        "NoItems": "",
                        "TotalCost": "",
                        "TotalPaid": ""
                    });
                    ItemWise.push({
                        "ItemNo": data.item_no,
                        "ItemName": data.item_name, 
                        "Unit": data.unit,
                        "Quantity": data.qty,
                        "Cost": data.price,
                        "Amount": data.total_price,
                        "TotalPaid": data.total_paid_amount
                    });
                });
                    var accountInfo =
                              {
                                  "viewMode": $$("ddlViewMode").selectedData().view_name ,
                                  "SDate": $$("txtStartDate").getDate(),
                                  "EDate": $$("txtEndDate").getDate(),
                                  "Supplier": $$("ddlVendor").selectedValue(),
                                  "BillType": $$("ddlBillType").selectedValue(),
                                  "Item": $$("ddlItem").selectedValue(),
                                  "Status": $$("ddlState").selectedValue(),
                                  "TotalSales": page.controls.lblTotalSales.value(),
                                  "TotalPayment": page.controls.lblTotalPayment.value(),
                                  "TotalReturn": page.controls.lblTotalReturns.value(),
                                  "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                  "NetSales": page.controls.lblNetSales.value(),
                                  "ApplicaName": CONTEXT.COMPANY_NAME,
                                  "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                  "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                  "PhoneNo": CONTEXT.COMPANY_PHONE_NO,
                                  "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                  "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                  "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                  "Standard": Standard,
                                  "Summary": Summary,
                                  "SupplierWise": SupplierWise,
                                  "POWise": POWise,
                                  "ItemWise": ItemWise
                              };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "purchase-report/PurchaseItem.jrxml", accountInfo, $$("ddlExportType").selectedValue());

            }
            else {
                var Standard = [];
                var Summary = [];
                var SupplierWise = [];
                var POWise = [];
                var ItemWise = [];
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    Standard.push({
                        "BillNo": "",
                        "BillType": "",
                        "BillDate": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "Amount": "",
                        "Paid": "",
                        "Balance": ""
                    });
                    Summary.push({
                        "Date": data.sum_date,
                        "TotalSale": data.tot_sale,
                        "TotalPayment": data.tot_pay,
                        "TotalReturn": data.tot_ret,
                        "TotalReturnPayment": data.tot_ret_pay
                    });
                    SupplierWise.push({
                        "SupplierNo": "",
                        "SupplierName": "",
                        "TotalAmount": "",
                        "TotalPaid": ""
                    });
                    POWise.push({
                        "PONo": "",
                        "BillNo": "",
                        "InvoiceNo": "",
                        "SupplierNo": "",
                        "SupplierName": "",
                        "OrderedDate": "",
                        "Status": "",
                        "NoItems": "",
                        "TotalCost": "",
                        "TotalPaid": ""
                    });
                    ItemWise.push({
                        "ItemNo": "",
                        "ItemName": "",
                        "Unit": "",
                        "Quantity": "",
                        "Cost": "",
                        "Amount": "",
                        "TotalPaid": ""
                    });
                });
                    var accountInfo =
                              {
                                  "viewMode": $$("ddlViewMode").selectedData().view_name ,
                                  "SDate": $$("txtStartDate").getDate(),
                                  "EDate": $$("txtEndDate").getDate(),
                                  "Supplier": $$("ddlVendor").selectedValue(),
                                  "BillType": $$("ddlBillType").selectedValue(),
                                  "Item": $$("ddlItem").selectedValue(),
                                  "Status": $$("ddlState").selectedValue(),
                                  "TotalSales": page.controls.lblTotalSales.value(),
                                  "TotalPayment": page.controls.lblTotalPayment.value(),
                                  "TotalReturn": page.controls.lblTotalReturns.value(),
                                  "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                  "NetSales": page.controls.lblNetSales.value(),
                                  "ApplicaName": CONTEXT.COMPANY_NAME,
                                  "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                  "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                  "PhoneNo": CONTEXT.COMPANY_PHONE_NO,
                                  "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                  "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                  "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                  "Standard": Standard,
                                  "Summary": Summary,
                                  "SupplierWise": SupplierWise,
                                  "POWise": POWise,
                                  "ItemWise": ItemWise
                              };
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "purchase-report/PurchaseSum.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }
            //doc.write("</table><footer> <h1>Woto Technologies,Tiruchendur, Tuticorin district - 628215</h1></footer></body></html>");
            
        }
        function PrintData(dataList) {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;
            //doc.write("<div><span style='float:right'>ORIGINAL</span></div>");
            doc.write("<div><h2><center>" + '' + CONTEXT.COMPANY_NAME + '' + "</center></h2></div>");
            doc.write("<div><h7><center>" + '' + CONTEXT.COMPANY_ADDRESS + '' + "</center></h7></div>");
            doc.write("<div><h7><center>" + '' + CONTEXT.COMPANY_PHONE_NO + '' + "</center></h7></div>");
            doc.write("<br><header align='center'> <h3>Purchase Report</h3></header>");
            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
            //doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
            //doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + '' + CONTEXT.COMPANY_TIN_NO + '' + "</span></div><br>");
            //doc.write("<div><span class='col-lg-12' style='float:right'>GST : </span></div>");
            if ($$("ddlViewMode").selectedData().view_name  == "Standard") {
                doc.write("<div><h3>Summary:</h3></div>");
                doc.write("<div style='width:500px;'>");
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Sales : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalSales.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Payment : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalPayment.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Return : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalReturns.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Return Payment : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalReturnsPayment.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Net Sales : </span><span style='width:150px;align-content:center'>" + page.controls.lblNetSales.value() + "</span><br></div>");
                doc.write("<div><h3>Details:</h3></div>");
                doc.write("<table align='center' style='width:790px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white; font-size: 13px;'>");
                doc.write("<th align='left'style=' width: 50px; height: 30px;'>B No</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;'>Bill Type</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;'>Bill Date</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Sub Total</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>GST</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Discount</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Rnd Off</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Amount</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Paid Amt</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>PayMode</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Tot Paid</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Balance</th></tr>");
                var lastVenNo = "";
                var lineCount = 0;
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        if (lastVenNo != data.vendor_no) {
                            //doc.write("<tr><td colspan='6'><span style='font-size 20px;'><b> CUST NAME : </b>" + data.cust_name.toUpperCase() + "  <span></td></tr>");
                            doc.write("<tr><td colspan='12'><span id='groupbysupp' style='font-size 30px;'><b> Supplier No : " + data.vendor_no + ",  Supplier Name : " + data.vendor_name + ", GST No : " + data.gst_no + ", TIN : " + data.tin_no + ", Area : " + data.area + " </b> <span></td></tr>");
                            //$(row).find(".header").html("<span id='groupbycust' style='font-size 30px;'><b> Cust No : " + item.cust_no + ",  Cust Name : " + item.cust_name + ", GST No : " + item.gst_no + ", TIN : " + item.tin_no + ", Area : " + item.area + " </b> <span>");
                        }
                        doc.write("<tr><td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.bill_no + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 13px;'>" + data.bill_type + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 13px;'>" + data.bill_date + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.sub_total + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.tot_tax + "</td>");
                        //doc.write("<td>" + data.tot_cgst + "</td>");
                        //doc.write("<td>" + data.tot_sgst + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.tot_discount + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.round_off + "</td>");
                        //doc.write("<td>" + data.cust_no + "</td>");
                        //doc.write("<td>" + data.cust_name + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.total + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.paid_amount + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.pay_mode + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.total_paid_amount + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 13px;'>" + data.balance + "</td>");
                        doc.write("</tr>");
                        head = true;
                        lineCount = lineCount + 1;
                        lastVenNo = data.vendor_no;
                        if (lineCount > 20) {
                            doc.write("</tr>");
                            //doc.write("<p style='page-break-after:always;'></p><div class='col-lg-12'>");
                            //                            doc.write("<hr/>");
                            doc.write("<div class='page-break'></div>");
                            doc.write("<tr>");
                            //                            doc.write("<hr/>");
                            lineCount = 0;
                        }
                    }
                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "POWise") {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:790px;' cellpadding='0' cellspacing='0' border='1'>");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>PO No</th>");
                doc.write("<th align='left'>Bill No</th>");
                doc.write("<th align='left'>Invoice No</th>");
                doc.write("<th align='left'>Supplier No</th>");
                doc.write("<th align='left'>Supplier Name</th>");
                doc.write("<th align='left'>Ordered Date</th>");
                doc.write("<th align='left'>Status</th>");
                doc.write("<th align='left'>No of items</th>");
                doc.write("<th align='left'>Total Cost</th>");
                doc.write("<th align='left'>Total Paid</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.po_no + "</td>");
                        doc.write("<td>" + data.bill_no + "</td>");
                        doc.write("<td>" + data.invoice_no + "</td>");
                        doc.write("<td>" + data.vendor_no + "</td>");
                        doc.write("<td>" + data.vendor_name + "</td>");
                        doc.write("<td>" + data.ordered_date + "</td>");
                        doc.write("<td>" + data.state_text + "</td>");
                        doc.write("<td>" + data.no_of_items + "</td>");
                        doc.write("<td>" + data.total_cost + "</td>");
                        doc.write("<td>" + data.paid_amount + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "SupplierWise") {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:790px;' cellpadding='0' cellspacing='0' border='1'>");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Supplier No</th>");
                doc.write("<th align='left'>Supplier Name</th>");
                doc.write("<th align='left'>GST No</th>");
                doc.write("<th align='left'>Total Amount</th>");
                doc.write("<th align='left'>Total Paid</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.vendor_no + "</td>");
                        doc.write("<td>" + data.vendor_name + "</td>");
                        doc.write("<td>" + data.gst_no + "</td>");
                        doc.write("<td>" + data.total_price + "</td>");
                        doc.write("<td>" + data.total_paid_amount + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:790px;' cellpadding='0' cellspacing='0' border='1'>");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Item No</th>");
                doc.write("<th align='left'>Item Name</th>");
                doc.write("<th align='left'>Unit</th>");
                doc.write("<th align='left'>Quantity</th>");
                doc.write("<th align='left'>Cost</th>");
                doc.write("<th align='left'>Amount</th>");
                doc.write("<th align='left'>Total Paid</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.item_no + "</td>");
                        doc.write("<td>" + data.item_name + "</td>");
                        doc.write("<td>" + data.unit + "</td>");
                        doc.write("<td>" + data.qty + "</td>");
                        doc.write("<td>" + data.price + "</td>");
                        doc.write("<td>" + data.total_price + "</td>");
                        doc.write("<td>" + data.total_paid_amount + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            else {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:790px;' cellpadding='0' cellspacing='0' border='1'>");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Date</th>");
                doc.write("<th align='left'>Total Sale</th>");
                doc.write("<th align='left'>Total Payment</th>");
                doc.write("<th align='left'>Total Return</th>");
                doc.write("<th align='left'>Total Return Payment</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.sum_date + "</td>");
                        doc.write("<td>" + data.tot_sale + "</td>");
                        doc.write("<td>" + data.tot_pay + "</td>");
                        doc.write("<td>" + data.tot_ret + "</td>");
                        doc.write("<td>" + data.tot_ret_pay + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            //doc.write("</table><footer> <h1>Woto Technologies,Tiruchendur, Tuticorin district - 628215</h1></footer></body></html>");
            //doc.write("</table><br> <br><br><br><div align='right'><h3>" + CONTEXT.AppName + "</h3></div>");
            //doc.write("<footer> <h2 align='center'></h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

            doc.close();
            r.focus();
            r.print();
        }
      } );
    
}
