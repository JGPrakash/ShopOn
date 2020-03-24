$.fn.stockReport = function() {
    return $.pageController.getPage(this, function(page, $$) {
        page.customerService = new CustomerService();
        page.dynaReportService = new DynaReportService();
        page.inventoryService = new InventoryService();
        page.reportService = new ReportService();

        page.reportAPI = new ReportAPI();
        page.itemAPI = new ItemAPI();
        page.vendorAPI = new VendorAPI();
        page.customerAPI = new CustomerAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.stockReportAPI = new StockReportAPI();
        page.stockAPI = new StockAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.eggtrayAPI = new EggTrayAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        var menu_ids = [];
        var item_list = [];
        document.title = "ShopOn - Stock Report";
        page.events = {
            btnGenerate_click: function () {
                $$("lblTotalTrayPurchaseReturn").val(0);
                $$("lblTotalTraySaleReturn").val(0);
                $$("lblTotalTrayPurchase").val(0);
                $$("lblTotalTraySale").val(0);
                $$("lblTotalTray").val(0);
                $$("lblCustomerInHand").val(0);
                $$("lblNonEmptyTray").val(0);
                $$("lblEmptyTray").val(0);
                var sort_expression = "";
                if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                    sort_expression = "purchase_stock desc"
                }
                if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                    sort_expression = "sales_stock desc"
                }
                var filter = {
                    viewMode: $$("ddlViewMode").selectedValue(),
                    fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    prod_type_no: ($$("ddlProductType").selectedValue() == null || $$("ddlProductType").selectedValue() == "-1") ? "" : $$("ddlProductType").selectedValue(),
                    //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                    language: $$("ddlLanguage").selectedValue(),
                    sort_expression: sort_expression,
                    search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue(),
                    cust_id: ($$("ddldefcustomer").selectedValue() == null || $$("ddldefcustomer").selectedValue() == "-1") ? "" : $$("ddldefcustomer").selectedValue(),
                    trans_type: ($$("ddldeftrayTrans").selectedValue() == null || $$("ddldeftrayTrans").selectedValue() == "All") ? "" : $$("ddldeftrayTrans").selectedValue(),
                    tray_id: ($$("ddlTray").selectedValue() == null || $$("ddlTray").selectedValue() == "-1" || $$("ddlTray").selectedValue() == "All") ? "" : $$("ddlTray").selectedValue(),
                    attribute: ($$("ddlattributeview").selectedValue() == null || $$("ddlattributeview").selectedValue() == "-1" || $$("ddlattributeview").selectedValue() == "All") ? "" : $$("ddlattributeview").selectedValue(),
                    attribute_text: ($$("txtAttributeText").value() == "" || $$("txtAttributeText").value() == null) ? "" : $$("txtAttributeText").value()
                }
                page.stockReportAPI.stockReport(filter, function (data) {
                    if (data.length == 0) {
                        $$("pnlGridTransaction").hide();
                        $$("pnlEmptyGrid").show();
                    }
                    else {
                        $$("pnlGridTransaction").show();
                        $$("pnlEmptyGrid").hide();
                        page.view.selectedTransaction(data);
                    }
                    page.setSummaryPanel();
                });
                var transDate = new Date(filter.toDate);
                transDate.setDate(transDate.getDate() - 1);
                var minusOneDay = transDate.getFullYear() + "-" + (((transDate.getMonth()+1) < 10) ? "0" + transDate.getMonth()+1 : transDate.getMonth()+1) + "-" + ((transDate.getDate() < 10) ? "0" + transDate.getDate() : transDate.getDate());
                var transaction_filter = {
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    //toDate: ($$("txtEndDate").getDate() == "") ? "" : minusOneDay + " 10:10:10",
                    getDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    prod_type_no: ($$("ddlProductType").selectedValue() == null || $$("ddlProductType").selectedValue() == "-1") ? "" : $$("ddlProductType").selectedValue(),
                    attribute: ($$("ddlattributeview").selectedValue() == null || $$("ddlattributeview").selectedValue() == "-1" || $$("ddlattributeview").selectedValue() == "All") ? "" : $$("ddlattributeview").selectedValue(),
                    attribute_text: ($$("txtAttributeText").value() == "" || $$("txtAttributeText").value() == null) ? "" : $$("txtAttributeText").value()
                }
                page.stockReportAPI.getStockSummary(transaction_filter, function (data) {
                    $$("lblOpeningStock").val(data[0].stock_qty);
                    $$("lblOpeningStockAmount").val(data[0].stock_amount);
                });
                var closing_filter = {
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    prod_type_no: ($$("ddlProductType").selectedValue() == null || $$("ddlProductType").selectedValue() == "-1") ? "" : $$("ddlProductType").selectedValue(),
                    attribute: ($$("ddlattributeview").selectedValue() == null || $$("ddlattributeview").selectedValue() == "-1" || $$("ddlattributeview").selectedValue() == "All") ? "" : $$("ddlattributeview").selectedValue(),
                    attribute_text: ($$("txtAttributeText").value() == "" || $$("txtAttributeText").value() == null) ? "" : $$("txtAttributeText").value()
                }
                page.stockReportAPI.getStockSummary(closing_filter, function (data) {
                    $$("lblTotalStock").val(data[0].stock_qty);
                    $$("lblTotalStockAmount").val(data[0].stock_amount);
                });
                
                page.stockReportAPI.getStockSummary(filter, function (data) {
                    $$("lblPurchaseStock").val(data[0].purchase_stock_qty);
                    $$("lblPurchaseStockAmount").val(data[0].purchase_stock_amount);
                    $$("lblSaleStock").val(data[0].sale_stock_qty);
                    $$("lblSaleStockAmount").val(data[0].sale_stock_amount);
                });
                var stock_filter = {
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    attribute: ($$("ddlattributeview").selectedValue() == null || $$("ddlattributeview").selectedValue() == "-1" || $$("ddlattributeview").selectedValue() == "All") ? "" : $$("ddlattributeview").selectedValue(),
                    attribute_text: ($$("txtAttributeText").value() == "" || $$("txtAttributeText").value() == null) ? "" : $$("txtAttributeText").value()
                }
                page.stockReportAPI.getStockSummary(stock_filter, function (data) {
                    $$("lblCurrentStock").val(data[0].stock_qty);
                    $$("lblCurrentStockAmount").val(data[0].stock_amount);
                });
            },
            btnReport_click: function () {
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
            },
            btnPrintJasperBill_click: function () {
                if ($$("ddlViewMode").selectedValue() == "TraywiseReport" || $$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                    var tot_stock = 0, tot_tray = 0, tot_empty = 0, tot_cust_tray = 0, OpeningStock, ClosingStock, StockPurchased, PurchasedStockAmount, StockInHand, StockInHandAmount;
                    var detail_list = [];
                    var exp_type = $$("ddlExportType").selectedValue();
                    var filter = {
                        viewMode: $$("ddlViewMode").selectedValue(),
                        fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                        item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                        main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                        //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        comp_id: localStorage.getItem("user_company_id"),
                        expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                        language: $$("ddlLanguage").selectedValue(),
                        sort_expression: sort_expression,
                        search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue(),
                        cust_id: ($$("ddldefcustomer").selectedValue() == null || $$("ddldefcustomer").selectedValue() == "-1") ? "" : $$("ddldefcustomer").selectedValue(),
                        trans_type: ($$("ddldeftrayTrans").selectedValue() == null || $$("ddldeftrayTrans").selectedValue() == "All") ? "" : $$("ddldeftrayTrans").selectedValue(),
                        tray_id: ($$("ddlTray").selectedValue() == null || $$("ddlTray").selectedValue() == "-1" || $$("ddlTray").selectedValue() == "All") ? "" : $$("ddlTray").selectedValue(),
                    }
                    var transDate = new Date(filter.toDate);
                    transDate.setDate(transDate.getDate() - 1);
                    var minusOneDay = transDate.getFullYear() + "-" + (((transDate.getMonth() + 1) < 10) ? "0" + transDate.getMonth() + 1 : transDate.getMonth() + 1) + "-" + ((transDate.getDate() < 10) ? "0" + transDate.getDate() : transDate.getDate());
                    var transaction_filter = {
                        item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                        //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        comp_id: localStorage.getItem("user_company_id"),
                        //toDate: ($$("txtEndDate").getDate() == "") ? "" : minusOneDay + " 10:10:10",
                        getDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                        main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    }
                    page.stockReportAPI.getStockSummary(transaction_filter, function (data) {
                        OpeningStock = data[0].stock_qty;
                    });
                    var closing_filter = {
                        item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                        //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        comp_id: localStorage.getItem("user_company_id"),
                        toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                        main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    }
                    page.stockReportAPI.getStockSummary(closing_filter, function (data) {
                        ClosingStock = data[0].stock_qty;
                    });
                    page.stockReportAPI.getStockSummary(filter, function (data) {
                        StockPurchased = data[0].purchase_stock_qty;
                        PurchasedStockAmount = data[0].purchase_stock_amount;
                    });
                    var stock_filter = {
                        item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                        //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                        comp_id: localStorage.getItem("user_company_id")
                    }
                    page.stockReportAPI.getStockSummary(stock_filter, function (data) {
                        StockInHand = data[0].stock_qty;
                        StockInHandAmount = data[0].stock_amount;
                    });
                    var sort_expression = "";
                    if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                        sort_expression = "purchase_stock desc"
                    }
                    if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                        sort_expression = "sales_stock desc"
                    }
                    page.stockReportAPI.stockReport(filter, function (data) {
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                if ($$("ddlViewMode").selectedValue() == "TraywiseReport") {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Tray No Name": "Tray No",
                                        "Tray Name": "Tray",
                                        "Total Stock Name": "Total Stock",
                                        "Tray Stock Name": "Tray Stock",
                                        "Empty Tray Name": "Empty Tray",
                                        "Non Empty Tray Name": "Non Empty Tray",
                                        "Tray In Customer Hand Name": "Tray In Customer Hand",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        //"Tray No": item.tray_id,
                                        "Tray No": item.tray_no,
                                        "Tray": item.tray_name,
                                        "Total Stock": item.stock_qty,
                                        "Tray Stock": item.tray_qty,
                                        "Empty Tray": item.tray_empty,
                                        "Non Empty Tray": item.stock_qty,
                                        "Tray In Customer Hand": item.customer,
                                    });
                                    tot_stock = parseFloat(tot_stock) + parseFloat(item.stock_qty);
                                    tot_tray = parseFloat(tot_tray) + parseFloat(item.tray_qty);
                                    tot_empty = parseFloat(tot_empty) + parseFloat(item.tray_empty);
                                    tot_cust_tray = parseFloat(tot_cust_tray) + parseFloat(item.customer);
                                }
                                if ($$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                                    detail_list.push({
                                        "Sl No Name": "Sl No",
                                        "Tray No Name": "Tray No",
                                        "Tray Name": "Tray",
                                        "Tray Type Name": "Tray Type",
                                        "Tray Qty Name": "Tray Qty",
                                        "Sl No": parseInt(i) + parseInt(1),
                                        //"Tray No": item.tray_id,
                                        "Tray No": item.tray_no,
                                        "Tray": item.tray_name,
                                        "Tray Type": item.trans_type,
                                        "Tray Qty": item.tray_count

                                    });
                                    if (item.trans_type == "Vendor Purchase") {
                                        tot_stock = parseFloat(tot_stock) + parseFloat(item.tray_count);
                                    }
                                    if (item.trans_type == "Vendor Return") {
                                        tot_tray = parseFloat(tot_tray) + parseFloat(item.tray_count);
                                    }
                                    if (item.trans_type == "Customer Sales") {
                                        tot_empty = parseFloat(tot_empty) + parseFloat(item.tray_count);
                                    }
                                    if (item.trans_type == "Customer Return") {
                                        tot_cust_tray = parseFloat(tot_cust_tray) + parseFloat(item.tray_count);
                                    }
                                }
                            })
                            if ($$("ddlViewMode").selectedValue() == "TraywiseReport") {
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Opening Stock Summary Name": "",
                                    "Purchased Stock Summary Name": "",
                                    "Current Stock Summary Name": "",
                                    "Opeining Stock Name": "Total Tray",
                                    "Closing Stock Name": "Non Empty Tray",
                                    "Stock Purchased Name": "Customer In Hand",
                                    "Purchased Stock Amount Name": "Empty Tray",
                                    "Stock In Hand Name": "",
                                    "Stock In Hand Amount Name": "",
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Return Name": "Total Sales Return",
                                    "Total Purchase Name": "Total Purchase",
                                    "Total Purchase Return Name": "Total Purchase Return",
                                    "Opeining Stock": tot_stock,
                                    "Closing Stock": tot_tray,
                                    "Stock Purchased": tot_cust_tray,
                                    "Purchased Stock Amount": tot_empty,
                                    "Stock In Hand": "",
                                    "Stock In Hand Amount": "",
                                    "Total Sales": "",
                                    "Total Sales Return": "",
                                    "Total Purchase": "",
                                    "Total Purchase Return": "",
                                    "is Opeining Stock Summary": "true",
                                    "is Purchased Stock Summary": "true",
                                    "is Current Stock Summary": "true",
                                    "is Opeining Stock": "true",
                                    "is Closing Stock": "true",
                                    "is Stock Purchased": "true",
                                    "is Purchased Stock Amount": "true",
                                    "is Stock In Hand": "true",
                                    "is Stock In Hand Amount": "true",
                                    "is Total Sales": "false",
                                    "is Total Sales Return": "false",
                                    "is Total Purchase": "false",
                                    "is Total Purchase Return": "false",
                                    "isTrayWise": "true",
                                    "isCustomerWise": "false",
                                    "TrayWise": detail_list
                                };
                            }
                            if ($$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                                var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "ReportName": "Sales Report ( " + $$("ddlViewMode").selectedData().view_name + " )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "Opening Stock Summary Name": "Opening / Closing Stock Summary",
                                    "Purchased Stock Summary Name": "Purchased Stock Summary",
                                    "Current Stock Summary Name": "Current Stock Summary",
                                    "Opeining Stock Name": "Opeining Stock",
                                    "Closing Stock Name": "Closing Stock",
                                    "Stock Purchased Name": "Stock Purchased",
                                    "Purchased Stock Amount Name": "Purchased Stock Amount",
                                    "Stock In Hand Name": "Stock In Hand",
                                    "Stock In Hand Amount Name": "Stock In Hand Amount",
                                    "Total Sales Name": "Total Sales",
                                    "Total Sales Return Name": "Total Sales Return",
                                    "Total Purchase Name": "Total Purchase",
                                    "Total Purchase Return Name": "Total Purchase Return",
                                    "Opeining Stock": "",
                                    "Closing Stock": "",
                                    "Stock Purchased": "",
                                    "Purchased Stock Amount": "",
                                    "Stock In Hand": "",
                                    "Stock In Hand Amount": "",
                                    "Total Sales": tot_empty,
                                    "Total Sales Return": tot_cust_tray,
                                    "Total Purchase": tot_stock,
                                    "Total Purchase Return": tot_tray,
                                    "is Opeining Stock Summary": "false",
                                    "is Purchased Stock Summary": "false",
                                    "is Current Stock Summary": "false",
                                    "is Opeining Stock": "false",
                                    "is Closing Stock": "false",
                                    "is Stock Purchased": "false",
                                    "is Purchased Stock Amount": "false",
                                    "is Stock In Hand": "false",
                                    "is Stock In Hand Amount": "false",
                                    "is Total Sales": "true",
                                    "is Total Sales Return": "true",
                                    "is Total Purchase": "true",
                                    "is Total Purchase Return": "true",
                                    "isTrayWise": "false",
                                    "isCustomerWise": "true",
                                    "CustomerWise": detail_list
                                };
                            }
                            GeneratePrint("ShopOnDev", "ShopOn-Stock-Report-New/ShopOn-stock-report.jrxml", accountInfo, exp_type, function (responseData) {
                                //$$("pnlPrintingPopup").close();
                                ////page.controls.pnlPrintingPopup.close();
                                //$$("pnlBillViewPopup").open();
                                //$$("pnlBillViewPopup").title("Bill View");
                                //$$("pnlBillViewPopup").rlabel("Bill View");
                                //$$("pnlBillViewPopup").width("1000");
                                //$$("pnlBillViewPopup").height("600");
                                //$$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                            });
                        }
                    });
                }
                else {
                    page.events.btnPrintJasperBillStock_click();
                }
            },
            btnPrintJasperBillStock_click: function () {
                var bill_item = [];
                var hsn_code, hsn_name;
                var sl_no=1;
                var exp_type = $$("ddlExportType").selectedValue();
                var sort_expression = "";
                if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                    sort_expression = "purchase_stock desc"
                }
                if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                    sort_expression = "sales_stock desc"
                }
                var filter = {
                    viewMode: $$("ddlViewMode").selectedValue(),
                    fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                    language: $$("ddlLanguage").selectedValue(),
                    sort_expression: sort_expression,
                    search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
                }
                page.stockReportAPI.stockReport(filter, function (bill) {
                    $(bill).each(function (i, item) {
                        if ($$("ddlViewMode").selectedValue() == "ItemWiseStockReport" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryDay" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryWeek" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryMonth" || $$("ddlViewMode").selectedValue() == "Hot Purchase" || $$("ddlViewMode").selectedValue() == "Hot Sales") {
                            hsn_code = item.hsn_code;
                            hsn_name = "HSN Code";
                        }
                        else if ($$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All") {
                            hsn_code = item.variation_name;
                            hsn_name = "Variation";
                        }
                        else {
                            hsn_code = item.variation_name;
                            hsn_name = "Variation";
                        }
                        bill_item.push({
                            "SI No Name": "SI No",
                            "Item No Name": "Item No",
                            "Item Name": "Item",
                            "HSN Code Name": hsn_name,
                            "Opn Stock Name": "Opn Stock(" + $$("txtStartDate").getDate() + ")",
                            "Cls Stock Name": "Cls Stock(" + $$("txtEndDate").getDate() + ")",
                            "Pur Stock Name": "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")",
                            "Pur Value Name": "Pur Value",
                            "Sal Stock Name": "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")",
                            "Sal Value Name": "Sal Value",
                            "Profit Name": "Profit",
                            "SI No": sl_no+i,
                            "Item No": item.item_no,
                            "Item": item.item_name,
                            "HSN Code": hsn_code,
                            "Opn Stock": item.opening_stock,
                            "Cls Stock": item.closing_stock,
                            "Pur Stock": item.purchase_stock,
                            "Pur Value": item.purchase_value,
                            "Sal Stock": item.sales_stock,
                            "Sal Value": item.sales_value,
                            "Profit": item.profit
                        });
                    });
                    page.opening_summery(function (opening_stock_qty, opening_stock_amount){
                        page.stock_summery(function (current_stock_qty, current_stock_amount){
                            page.closing_summery(function (closing_stock_qty, closing_stock_amount){
                                page.purchase_stock_summery(function (purchase_stock_qty, purchase_stock_amount){
                                var accountInfo =
                                    {
                                        "CompName": CONTEXT.COMPANY_NAME,
                                        "ReportName": "Stock Report",
                                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                        "Summary Name": "Summary",
                                        "Stock Summary Name": "Opening / Closing Stock Summary",
                                        "Opening Stock Name": "Opening Stock",
                                        "Closing Stock Name": "Closing Stock",
                                        "Opening Stock Amount Name": "Opening Stock Amount",
                                        "Closing Stock Amount Name": "Closing Stock Amount",
                                        "Purchased Summary Name": "Purchased / Current Stock Summary",
                                        "Stock Purchased Name": "Stock Purchased",
                                        "Current Stock Name": "Current Stock",
                                        "Purchased Stock Amount Name": "Purchased Stock Amount",
                                        "Current Stock Amount Name": "Current Stock Amount",
                                        "Opening Stock": opening_stock_qty,
                                        "Closing Stock": closing_stock_qty,
                                        "Opening Stock Amount": opening_stock_amount,
                                        "Closing Stock Amount": closing_stock_amount,
                                        "Stock Purchased": purchase_stock_qty,
                                        "Current Stock": current_stock_qty,
                                        "Purchased Stock Amount": purchase_stock_amount,
                                        "Current Stock Amount": current_stock_amount,
                                        "Details": bill_item,
                                    }
                                GeneratePrint("ShopOnDev", "Stock-Report-Standard/velan-stock-standard-main-report.jrxml", accountInfo, exp_type);
                                })
                            })
                        })
                    })
                });
            },
            page_load: function () {
                page.controls.ddlItem.dataBind({
                    getData: function (term, callback) {
                        callback(item_list);
                    }
                });
                page.itemAPI.searchValues("", "", "", "", function (data) {
                    item_list = data;
                });
                
                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    $$("ddldefsupplier").dataBind(data, "vendor_no", "vendor_name", "All");

                });
                page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                    $$("ddldefcustomer").dataBind(data, "cust_no", "cust_name", "All");
                });
                $$("grdTransactions").width("80%");

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
                var languageData = [];
                languageData.push({ view_no: "'en'", view_name: "English" }, { view_no: "'ta'", view_name: "Tamil" });
                $$("ddlLanguage").dataBind(languageData, "view_no", "view_name", "Select");

                var searchViewData = [];
                searchViewData.push({ view_no: "ItemWiseStockReport", view_name: "Item Wise Stock Report" }, { view_no: "VariationWiseStockReport", view_name: "Variation Wise Stock Report" }, { view_no: "StockVariationWiseReport", view_name: "Stock Variation Wise Report" }, { view_no: "ItemWiseSummaryDay", view_name: "Item Wise Summary Day" }, { view_no: "ItemWiseSummaryWeek", view_name: "Item Wise Summary Week" }, { view_no: "ItemWiseSummaryMonth", view_name: "Item Wise Summary Month" }
                , { view_no: "VariationWiseStockSummaryDay", view_name: "Variation Wise Stock Summary Day" }, { view_no: "VariationWiseStockSummaryWeek", view_name: "Variation Wise Stock Summary Week" }, { view_no: "VariationWiseStockSummaryMonth", view_name: "Variation Wise Stock Summary Month" }
                , { view_no: "StockVariationWiseSummaryDay", view_name: "Stock Variation Wise Summary Day" }, { view_no: "StockVariationWiseSummaryWeek", view_name: "Stock Variation Wise Summary Week" }, { view_no: "StockVariationWiseSummaryMonth", view_name: "Stock Variation Wise Summary Month" }, { view_no: "Hot Purchase", view_name: "Hot Purchase" }, { view_no: "Hot Sales", view_name: "Hot Sales" });
                //if (CONTEXT.ENABLE_MODULE_TRAY) {
                //    searchViewData.push({ view_no: "ItemwiseTrayReport", view_name: "Itemwise Tray Report" }, { view_no: "CustomerwiseTrayReport", view_name: "Customer/Vendorwise Tray Report" }, { view_no: "SkuwiseTrayReport", view_name: "Skuwise Tray Report" });
                //}
                if (CONTEXT.ENABLE_MODULE_TRAY) {
                    searchViewData.push({ view_no: "ItemwiseTrayReport", view_name: "Itemwise Tray Report" }, { view_no: "TraywiseReport", view_name: "Traywise Report" }, { view_no: "CustomerwiseTrayReport", view_name: "Customer/Vendorwise Tray Report" });
                }
                if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                    searchViewData.push({ view_no: "MainProductTypeReport", view_name: "Main Product Type Report" }, { view_no: "ProductTypeReport", view_name: "Product Type Report" });
                }
                $$("ddlViewMode").dataBind(searchViewData, "view_no", "view_name");
                $$("ddlViewMode").selectionChange(function () {
                    
                    if ($$("ddlViewMode").selectedValue() == "TraywiseReport" || $$("ddlViewMode").selectedValue() == "ItemwiseTrayReport" || $$("ddlViewMode").selectedValue() == "SkuwiseTrayReport") {
                        $$("pnlItem").hide();
                        $$("pnlSupplier").hide();
                        $$("pnlMainProductType").hide();
                        $$("pnlProductType").hide();
                        $$("pnlLanguage").hide();
                        $$("pnlStock").hide();
                        $$("pnlExpiry").hide();
                        $$("pnlCustomer").hide();
                        $$("pnlTrayTrans").hide();
                        $$("pnlTray").show();
                        $("[controlid=pnlTray]").show();
                    }
                    else if ($$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                        $$("pnlItem").hide();
                        $$("pnlSupplier").show();
                        $$("pnlMainProductType").hide();
                        $$("pnlProductType").hide();
                        $$("pnlLanguage").hide();
                        $$("pnlStock").hide();
                        $$("pnlExpiry").hide();
                        $$("pnlCustomer").show();
                        $$("pnlTrayTrans").hide();
                        $$("pnlTray").show();
                        $("[controlid=pnlTray]").show();
                    }
                    else {
                        $$("pnlItem").show();
                        $$("pnlSupplier").show();
                        if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                            $$("pnlMainProductType").show();
                            $$("pnlProductType").show();
                        }
                        else {
                            $$("pnlMainProductType").hide();
                            $$("pnlProductType").hide();
                        }
                        if (CONTEXT.ENABLE_SECONDARY_LANGUAGE)
                            $$("pnlLanguage").show();
                        else
                            $$("pnlLanguage").hide();
                        $$("pnlStock").show();
                        if (CONTEXT.ENABLE_EXP_DATE) {
                            $$("pnlExpiry").show();
                        }
                        else {
                            $$("pnlExpiry").hide();
                        }
                        $$("pnlCustomer").hide();
                        $$("pnlTrayTrans").hide();
                        $$("pnlTray").hide();
                        $("[controlid=pnlTray]").hide();
                    }
                    if ($$("ddlViewMode").selectedValue() == "StockVariationWiseReport" || $$("ddlViewMode").selectedValue() == "VariationWiseStockReport") {
                        $$("pnlAttribute").show();
                        $$("pnlAttributeText").hide();
                        $$("ddlattributeview").selectedValue("-1");
                        $$("pnlTrayTrans").hide();
                        $$("pnlTray").hide();
                        $("[controlid=pnlTray]").hide();
                    }
                    else {
                        $$("pnlAttribute").hide();
                        $$("pnlAttributeText").hide();
                        $$("ddlattributeview").selectedValue("-1");
                        $$("pnlTrayTrans").hide();
                        //$$("pnlTray").hide();
                        //$("[controlid=pnlTray]").hide();
                    }
                    if ($$("ddlViewMode").selectedValue() == "StockVariationWiseReport") {
                        if (CONTEXT.ENABLE_EXP_DATE) {
                            $$("pnlExpiry").show();
                        }
                        else {
                            $$("pnlExpiry").hide();
                        }
                    }
                    else {
                        $$("pnlExpiry").hide();
                    }
                    if ($$("ddlViewMode").selectedValue() == "ItemWiseStockReport") {
                        $$("pnlStock").show();
                    }
                    else {
                        $$("pnlStock").hide();
                    }
                });
                $$("txtStartDate").setDate(dbDate($.datepicker.formatDate("dd-mm-yy", new Date())));
                $$("txtEndDate").setDate(dbDate($.datepicker.formatDate("dd-mm-yy", new Date())));
                $$("lblTotalStock").disable(true);
                $$("lblTotalStockAmount").disable(true);

                page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlMainProductType").dataBind(data, "mpt_no", "mpt_name", "All");
                });
                $$("ddlMainProductType").selectionChange(function () {
                    var filter = "";
                    if ($$("ddlMainProductType").selectedValue() != "-1" && $$("ddlMainProductType").selectedValue() != null) {
                        filter = "mptt.mpt_no = " + $$("ddlMainProductType").selectedValue();
                    }
                    page.productTypeAPI.searchValues("", "", filter, "", function (data) {
                        $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "All");
                    });
                });
                page.productTypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "All");
                });
                page.eggtrayAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlTray").dataBind(data, "tray_id", "tray_name", "All");
                });
                page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {// attr_no_key not in(100,101,102)
                    $$("ddlattributeview").dataBind(data, "attr_name", "attr_no", "All");
                });
                $$("ddlattributeview").selectionChange(function () {
                    if ($$("ddlattributeview").selectedValue() == "-1" || $$("ddlattributeview").selectedValue() == null) {
                        $$("pnlAttributeText").hide();
                        $$("txtAttributeText").value("");
                    }
                    else {
                        $$("pnlAttributeText").show();
                        $$("txtAttributeText").value("");
                    }
                });
                if (CONTEXT.ENABLE_SECONDARY_LANGUAGE)
                    $$("pnlLanguage").show();
                else
                    $$("pnlLanguage").hide();
                $$("pnlTrayTrans").hide();
                $$("pnlTray").hide();
                $("[controlid=pnlTray]").hide();

                store_refresh = false;
                masterPage.controls.ddlGlobalStoreName.dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name", "All");
                masterPage.controls.ddlGlobalRegisterName.dataBind($.parseJSON(localStorage.getItem("user_register_data")), "reg_no", "reg_name", "All");
                masterPage.controls.ddlGlobalStoreName.selectedValue(localStorage.getItem("user_store_no"));
                masterPage.controls.ddlGlobalRegisterName.selectedValue(localStorage.getItem("user_register_id"));

                $$("ddlExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
            }
        }
        page.stock_summery = function (callback) {
            var current_stock_qty, current_stock_amount;
            var stock_filter = {
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                comp_id: localStorage.getItem("user_company_id")
            }
            page.stockReportAPI.getStockSummary(stock_filter, function (data4) {
                current_stock_qty = data4[0].stock_qty;
                current_stock_amount = data4[0].stock_amount;
                if (callback != undefined && data4.length > 0) {
                    callback(current_stock_qty, current_stock_amount);
                } else {
                    current_stock_qty = 0;
                    current_stock_qty = 0;
                    callback(current_stock_qty, current_stock_amount);
                }
            });
        }
        page.purchase_stock_summery = function (callback) {
            var sort_expression = "";
            if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                sort_expression = "purchase_stock desc"
            }
            if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                sort_expression = "sales_stock desc"
            }
            var purchase_stock_qty, purchase_stock_amount;
            var filter = {
                viewMode: $$("ddlViewMode").selectedValue(),
                fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                prod_type_no: ($$("ddlProductType").selectedValue() == null || $$("ddlProductType").selectedValue() == "-1") ? "" : $$("ddlProductType").selectedValue(),
                //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                language: $$("ddlLanguage").selectedValue(),
                sort_expression: sort_expression,
                search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
            }
            page.stockReportAPI.getStockSummary(filter, function (data3) {
                purchase_stock_qty = data3[0].purchase_stock_qty;
                purchase_stock_amount = data3[0].purchase_stock_amount;
                if (callback != undefined && data3.length > 0) {
                    callback(purchase_stock_qty, purchase_stock_amount);
                } else {
                    purchase_stock_qty = 0;
                    purchase_stock_amount = 0;
                    callback(purchase_stock_qty, purchase_stock_amount);
                }
            });
        }
        page.closing_summery = function (callback) {
            var closing_stock_qty, closing_stock_amount;
            var closing_filter = {
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                prod_type_no: ($$("ddlProductType").selectedValue() == null || $$("ddlProductType").selectedValue() == "-1") ? "" : $$("ddlProductType").selectedValue(),
            }
            page.stockReportAPI.getStockSummary(closing_filter, function (data2) {
                closing_stock_qty = data2[0].stock_qty;
                closing_stock_amount = data2[0].stock_amount;
                if (callback != undefined && data2.length > 0) {
                    callback(closing_stock_qty, closing_stock_amount);
                } else {
                    closing_stock_qty = 0;
                    closing_stock_amount = 0;
                    callback(closing_stock_qty, closing_stock_amount);
                }
            });
        }
        page.opening_summery = function (callback) {
            var sort_expression = "";
            if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                sort_expression = "purchase_stock desc"
            }
            if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                sort_expression = "sales_stock desc"
            }
            var opening_stock_qty, opening_stock_amount;
            var filter = {
                viewMode: $$("ddlViewMode").selectedValue(),
                fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                prod_type_no: ($$("ddlProductType").selectedValue() == null || $$("ddlProductType").selectedValue() == "-1") ? "" : $$("ddlProductType").selectedValue(),
                //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                language: $$("ddlLanguage").selectedValue(),
                sort_expression: sort_expression,
                search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
            }
            var transDate = new Date(filter.toDate);
            transDate.setDate(transDate.getDate() - 1);
            var minusOneDay = transDate.getFullYear() + "-" + (((transDate.getMonth() + 1) < 10) ? "0" + transDate.getMonth() + 1 : transDate.getMonth() + 1) + "-" + ((transDate.getDate() < 10) ? "0" + transDate.getDate() : transDate.getDate());
            var transaction_filter = {
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                //store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                store_no: masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                //toDate: ($$("txtEndDate").getDate() == "") ? "" : minusOneDay + " 10:10:10",
                getDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
            }
            page.stockReportAPI.getStockSummary(transaction_filter, function (data1) {
                opening_stock_qty = data1[0].stock_qty;
                opening_stock_amount = data1[0].stock_amount;
                if (callback != undefined && data1.length>0) {
                    callback(opening_stock_qty, opening_stock_amount);
                } else {
                    opening_stock_qty = 0;
                    opening_stock_amount = 0;
                    callback(opening_stock_qty, opening_stock_amount);
                }
            });
        }
        page.setSummaryPanel = function () {
            if ($$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                $$("pnlOpeningStockSummary").hide();
                $$("pnlTray").hide();
                $("[controlid=pnlTray]").hide();
                $$("pnlTray2").show();
                $$("pnlPurchaseStockSummary").hide();
                $$("pnlSaleStockSummary").hide();
                $$("pnlTray1").hide();
                $$("pnlTray3").show();
                $$("pnlCurrentStockSummary").hide();
            }
            else if ($$("ddlViewMode").selectedValue() == "TraywiseReport" || $$("ddlViewMode").selectedValue() == "ItemwiseTrayReport" || $$("ddlViewMode").selectedValue() == "SkuwiseTrayReport") {
                $$("pnlOpeningStockSummary").hide();
                $$("pnlTray").show();
                $("[controlid=pnlTray]").show();
                $$("pnlTray2").hide();
                $$("pnlPurchaseStockSummary").hide();
                $$("pnlSaleStockSummary").hide();
                $$("pnlTray1").show();
                $$("pnlTray3").hide();
                $$("pnlCurrentStockSummary").hide();
            }
            else {
                $$("pnlOpeningStockSummary").show();
                $$("pnlTray").hide();
                $("[controlid=pnlTray]").hide();
                $$("pnlTray2").hide();
                $$("pnlPurchaseStockSummary").show();
                $$("pnlSaleStockSummary").show();
                $$("pnlTray1").hide();
                $$("pnlTray3").hide();
                $$("pnlCurrentStockSummary").show();
            }
        }
        page.view = {
            selectedTransaction: function (data) {
                var tot_tray = 0, tot_stock = 0, tot_empty = 0, tot_cust_tray = 0;
                $$("grdTransactions").height("480px");
                $$("grdTransactions").width("2000px");
                if ($$("ddlViewMode").selectedValue() == "ItemWiseStockReport" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryDay" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryWeek" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryMonth" || $$("ddlViewMode").selectedValue() == "Hot Purchase" || $$("ddlViewMode").selectedValue() == "Hot Sales") {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "90px", 'dataField': "item_no", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "450px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "HSN Code", 'rlabel': 'HSN Code', 'width': "90px", 'dataField': "hsn_code", filterType: "Text" },
                            { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "145px", 'dataField': "opening_stock", filterType: "Text" },
                            { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "145px", 'dataField': "closing_stock", filterType: "Text" },
                            { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "purchase_stock", filterType: "Text" },
                            { 'name': "Pur Value", 'width': "130px", 'dataField': "purchase_value", filterType: "Text" },
                            { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "sales_stock", filterType: "Text" },
                            //{ 'name': "Sal Value", 'width': "110px", 'dataField': "sales_value", filterType: "Text" },
                            //{ 'name': "Profit", 'width': "90px", 'dataField': "profit", filterType: "Text" },
                        ]
                    });
                }
                else if ($$("ddlViewMode").selectedValue() == "VariationWiseStockReport" || $$("ddlViewMode").selectedValue() == "VariationWiseStockSummaryDay" || $$("ddlViewMode").selectedValue() == "VariationWiseStockSummaryWeek" || $$("ddlViewMode").selectedValue() == "VariationWiseStockSummaryMonth") {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_code", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "230px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "230px", 'dataField': "variation_name", filterType: "Text" },
                            { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "140px", 'dataField': "opening_stock", filterType: "Text" },
                            { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "140px", 'dataField': "closing_stock", filterType: "Text" },
                            { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "215px", 'dataField': "purchase_stock", filterType: "Text" },
                            { 'name': "Pur Value", 'width': "120px", 'dataField': "purchase_value", filterType: "Text" },
                            { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "215px", 'dataField': "sales_stock", filterType: "Text" },
                            //{ 'name': "Sal Value", 'width': "100px", 'dataField': "sales_value", filterType: "Text" },
                            //{ 'name': "Profit", 'width': "80px", 'dataField': "profit", filterType: "Text" },
                        ]
                    });
                }
                else if ($$("ddlViewMode").selectedValue() == "StockVariationWiseReport" || $$("ddlViewMode").selectedValue() == "StockVariationWiseSummaryDay" || $$("ddlViewMode").selectedValue() == "StockVariationWiseSummaryWeek" || $$("ddlViewMode").selectedValue() == "StockVariationWiseSummaryMonth") {
                    if ($$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All") {
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", filterType: "Text" },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "230px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "SKU", 'rlabel': 'SKU', 'width': "230px", 'dataField': "variation_name", filterType: "Text" },
                                { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "140px", 'dataField': "opening_stock", filterType: "Text" },
                                { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "140px", 'dataField': "closing_stock", filterType: "Text" },
                                { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "215px", 'dataField': "purchase_stock", filterType: "Text" },
                                { 'name': "Pur Value", 'width': "120px", 'dataField': "purchase_value", filterType: "Text" },
                                { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "215px", 'dataField': "sales_stock", filterType: "Text" },
                                //{ 'name': "Sal Value", 'width': "100px", 'dataField': "sales_value", filterType: "Text" },
                                //{ 'name': "Profit", 'width': "80px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                    }
                    else {
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "50px", 'dataField': "item_no", filterType: "Text" },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "180px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "SKU", 'rlabel': 'SKU', 'width': "200px", 'dataField': "variation_name", filterType: "Text" },
                                { 'name': "Stock", 'width': "120px", 'dataField': "stock", filterType: "Text" },
                                { 'name': "Expiry Date", 'width': "150px", 'dataField': "attr_value1", filterType: "Text" },
                                //{ 'name': "Man Date", 'width': "120px", 'dataField': "man_date", filterType: "Text" },
                                //{ 'name': "Batch No", 'width': "140px", 'dataField': "batch_no", filterType: "Text" },
                                //{ 'name': "MRP", 'width': "100px", 'dataField': "mrp", filterType: "Text" },
                                { 'name': "Cost", 'width': "120px", 'dataField': "cost", filterType: "Text" }
                            ]
                        });
                    }
                }
                else if ($$("ddlViewMode").selectedValue() == "TraywiseReport" || $$("ddlViewMode").selectedValue() == "ItemwiseTrayReport" || $$("ddlViewMode").selectedValue() == "SkuwiseTrayReport") {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "80px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "100px", 'dataField': "item_code", visible: $$("ddlViewMode").selectedValue() == "ItemwiseTrayReport", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "450px", 'dataField': "item_name", visible: $$("ddlViewMode").selectedValue() == "ItemwiseTrayReport", filterType: "Text" },
                            { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "100px", 'dataField': "tray_id", visible: $$("ddlViewMode").selectedValue() == "TraywiseReport", filterType: "Text", visible: false },
                            { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "80px", 'dataField': "tray_no", visible: $$("ddlViewMode").selectedValue() == "TraywiseReport", filterType: "Text" },
                            { 'name': "Tray Name", 'rlabel': 'Tray Name', 'width': "150px", 'dataField': "tray_name", visible: $$("ddlViewMode").selectedValue() == "TraywiseReport", filterType: "Text" },
                            { 'name': "Total Stock", 'rlabel': 'Total Stock', 'width': "180px", 'dataField': "stock_qty", filterType: "Text" },
                            { 'name': "Tray Stock", 'rlabel': 'Tray Stock', 'width': "180px", 'dataField': "tray_qty", filterType: "Text" },
                            { 'name': "Empty Tray", 'rlabel': 'Empty Tray', 'width': "180px", 'dataField': "tray_empty", filterType: "Text" },
                            { 'name': "Non Empty Tray", 'rlabel': 'Non Empty Tray', 'width': "180px", 'dataField': "stock_qty", filterType: "Text" },
                            { 'name': "Tray In Customer Hand", 'rlabel': 'Tray In Customer Hand', 'width': "200px", 'dataField': "customer", filterType: "Text" }
                        ]
                    });
                }
                else if ($$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "60px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "80px", 'dataField': "tray_id", filterType: "Text", visible: false },
                            { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "100px", 'dataField': "tray_no", visible: $$("ddlViewMode").selectedValue() == "TraywiseReport", filterType: "Text" },
                            { 'name': "Tray Name", 'rlabel': 'Tray Name', 'width': "150px", 'dataField': "tray_name", filterType: "Text" },
                            { 'name': "Tray Type", 'rlabel': 'Tray Type', 'width': "150px", 'dataField': "trans_type", filterType: "Text" },
                            { 'name': "Tray Qty", 'rlabel': 'Tray Qty', 'width': "150px", 'dataField': "tray_count", filterType: "Text" },
                        ]
                    });
                }
                else if ($$("ddlViewMode").selectedValue() == "MainProductTypeReport") {
                    $$("grdTransactions").width("100%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "No", 'rlabel': 'No', 'width': "90px", 'dataField': "mpt_no", filterType: "Text" },
                            { 'name': "Name", 'rlabel': 'Name', 'width': "180px", 'dataField': "main_product_name", filterType: "Text" },
                            { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "145px", 'dataField': "opening_stock", filterType: "Text" },
                            { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "145px", 'dataField': "closing_stock", filterType: "Text" },
                            { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "purchase_stock", filterType: "Text" },
                            { 'name': "Pur Value", 'width': "130px", 'dataField': "purchase_value", filterType: "Text" },
                            { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "sales_stock", filterType: "Text" },
                        ]
                    });
                }
                else if ($$("ddlViewMode").selectedValue() == "ProductTypeReport") {
                    $$("grdTransactions").width("100%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "No", 'rlabel': 'No', 'width': "90px", 'dataField': "ptype_no", filterType: "Text" },
                            { 'name': "Name", 'rlabel': 'Name', 'width': "180px", 'dataField': "product_name", filterType: "Text" },
                            { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "145px", 'dataField': "opening_stock", filterType: "Text" },
                            { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "145px", 'dataField': "closing_stock", filterType: "Text" },
                            { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "purchase_stock", filterType: "Text" },
                            { 'name': "Pur Value", 'width': "130px", 'dataField': "purchase_value", filterType: "Text" },
                            { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "sales_stock", filterType: "Text" },
                        ]
                    });
                }
                else {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "50px", 'dataField': "item_no", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "450px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "100px", 'dataField': "variation_name", filterType: "Text" },
                            { 'name': "Stock", 'width': "90px", 'dataField': "stock", filterType: "Text" },
                            { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", filterType: "Text" },
                            { 'name': "Man Date", 'width': "100px", 'dataField': "man_date", filterType: "Text" },
                            { 'name': "Batch No", 'width': "100px", 'dataField': "batch_no", filterType: "Text" },
                            { 'name': "MRP", 'width': "100px", 'dataField': "mrp", filterType: "Text" },
                            { 'name': "Cost", 'width': "100px", 'dataField': "cost", filterType: "Text" }
                        ]
                    });
                }
                page.controls.grdTransactions.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    row.on("click", "[datafield=purchase_stock]", function () {
                        page.controls.pnlItemDetails.open();
                        page.controls.pnlItemDetails.title("Items Purchase Details");
                        page.controls.pnlItemDetails.rlabel("Items Purchase Details");
                        page.controls.pnlItemDetails.width(700);
                        page.controls.pnlItemDetails.height(300);
                        //var i_store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue();
                        var i_store_no = masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue();
                        //page.stockAPI.searchValues("", "", "svt.item_no=" + item.item_no + " and (ipt.trans_type like 'Purchase' or ipt.trans_type like 'PurchaseReturn')", "", function (item_data) {
                        var sub_filter = "";
                        sub_filter = "svt.item_no= (select item_no from item_t where item_code = " + item.item_no;
                        if ($$("ddlViewMode").selectedValue() == "MainProductTypeReport")
                            sub_filter = "svt.item_no in (select item_no from item_t where mpt_no = " + item.mpt_no;
                        if ($$("ddlViewMode").selectedValue() == "ProductTypeReport")
                            sub_filter = "svt.item_no in (select item_no from item_t where ptype_no = " + item.ptype_no;
                        if ($$("txtStartDate").getDate() != "") {
                            sub_filter = (sub_filter == "") ? "" : sub_filter + " and ";
                            sub_filter = sub_filter + " date(ipt.trans_date) >= date('" + dbDate($$("txtStartDate").getDate()) + "') ";
                        }
                        if ($$("txtEndDate").getDate() != "") {
                            sub_filter = (sub_filter == "") ? "" : sub_filter + " and ";
                            sub_filter = sub_filter + " date(ipt.trans_date) <= date('" + dbDate($$("txtEndDate").getDate()) + "') ";
                        }
                        //toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        page.stockAPI.searchValues("", "", sub_filter+" and comp_id = " + localStorage.getItem("user_company_id") + ") and (ipt.trans_type like 'Purchase' or ipt.trans_type like 'PurchaseReturn') and ist.store_no in ("+i_store_no+")", "", function (item_data) {
                            $$("grdItemDetails").height("auto");
                            $$("grdItemDetails").width("100%");
                            page.controls.grdItemDetails.setTemplate({
                                selection: false, paging: true, pageSize: 50,
                                columns: [
                                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "trans_date", filterType: "Select" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "purchase_bill_id", filterType: "Text" },
                                    { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "110px", 'dataField': "vendor_name", filterType: "Select" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost", filterType: "Text" },
                                 ]
                            });
                            $$("grdItemDetails").dataBind(item_data);
                        });
                    });
                    row.on("click", "[datafield=sales_stock]", function () {
                        page.controls.pnlItemDetails.open();
                        page.controls.pnlItemDetails.title("Items Sales Details");
                        page.controls.pnlItemDetails.rlabel("Items Sales Details");
                        page.controls.pnlItemDetails.width(700);
                        page.controls.pnlItemDetails.height(300);
                        //var i_store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue();
                        var i_store_no = masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue();
                        var sub_filter = "";
                        sub_filter = "svt.item_no= (select item_no from item_t where item_code = " + item.item_no;
                        if ($$("ddlViewMode").selectedValue() == "MainProductTypeReport")
                            sub_filter = "svt.item_no in (select item_no from item_t where mpt_no = " + item.mpt_no;
                        if ($$("ddlViewMode").selectedValue() == "ProductTypeReport")
                            sub_filter = "svt.item_no in (select item_no from item_t where ptype_no = " + item.ptype_no;
                        if ($$("txtStartDate").getDate() != "") {
                            sub_filter = (sub_filter == "") ? "" : sub_filter + " and ";
                            sub_filter = sub_filter + " date(ipt.trans_date) >= date('" + dbDate($$("txtStartDate").getDate()) + "') ";
                        }
                        if ($$("txtEndDate").getDate() != "") {
                            sub_filter = (sub_filter == "") ? "" : sub_filter + " and ";
                            sub_filter = sub_filter + " date(ipt.trans_date) <= date('" + dbDate($$("txtEndDate").getDate()) + "') ";
                        }
                        page.stockAPI.searchValues("", "", sub_filter + " and comp_id = " + localStorage.getItem("user_company_id") + ") and (ipt.trans_type like 'Sale' or ipt.trans_type like 'SaleReturn') and ist.store_no in (" + i_store_no + ")", "", function (item_data) {
                        //page.stockAPI.searchValues("", "", "svt.item_no= (select item_no from item_t where item_code = " + item.item_no + " and comp_id = " + localStorage.getItem("user_company_id") + ") and (ipt.trans_type like 'Sale' or ipt.trans_type like 'SaleReturn') and svt.store_no in (" + i_store_no + ")", "", function (item_data) {
                            $$("grdItemDetails").height("auto");
                            $$("grdItemDetails").width("100%");
                            page.controls.grdItemDetails.setTemplate({
                                selection: false, paging: true, pageSize: 50,
                                columns: [
                                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "trans_date", filterType: "Select" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "110px", 'dataField': "sales_bill_id", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost", filterType: "Text" },
                                ]
                            });
                            $$("grdItemDetails").dataBind(item_data);
                        });
                    });
                    row.on("click", "[datafield=sales_value]", function () {
                        page.controls.pnlItemDetails.open();
                        page.controls.pnlItemDetails.title("Items Sales Details");
                        page.controls.pnlItemDetails.rlabel("Items Sales Details");
                        page.controls.pnlItemDetails.width(500);
                        page.controls.pnlItemDetails.height(300);
                        page.stockAPI.searchPricesMain(item.item_no, getCookie("user_store_id"), function (data) {
                            $$("grdItemDetails").height("auto");
                            $$("grdItemDetails").width("100%");
                            page.controls.grdItemDetails.setTemplate({
                                selection: false, paging: true, pageSize: 50,
                                columns: [
                                    { 'name': "From Date", 'rlabel': 'From Date', 'width': "150px", 'dataField': "valid_from", filterType: "Select" },
                                    { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': 'Selling Price', 'width': "80px", 'dataField': "price", filterType: "Text" },
                                    { 'name': CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'Selling Price1', 'width': "100px", 'dataField': "alter_price_1", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                                    { 'name': CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'Selling Price2', 'width': "100px", 'dataField': "alter_price_2", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                                ]
                            });
                            $$("grdItemDetails").dataBind(data);
                        });
                    });
                    row.on("click", "[datafield=customer]", function () {
                        if ($$("ddlViewMode").selectedValue() == "TraywiseReport") {
                            page.controls.pnlCustTrayDetails.open();
                            page.controls.pnlCustTrayDetails.title("Customer Tray Details");
                            page.controls.pnlCustTrayDetails.rlabel("Customer Tray Details");
                            page.controls.pnlCustTrayDetails.width(700);
                            page.controls.pnlCustTrayDetails.height(300);
                            var filter = {
                                viewMode: "CustomerTray",
                                tray_id: item.tray_id
                            }
                            page.stockReportAPI.stockReport(filter, function (data) {
                                $$("grdCustTrayDetails").height("auto");
                                $$("grdCustTrayDetails").width("100%");
                                page.controls.grdCustTrayDetails.setTemplate({
                                    selection: false, paging: true, pageSize: 50,
                                    columns: [
                                        { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "100px", 'dataField': "tray_id", filterType: "Select", visible: false },
                                        { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "100px", 'dataField': "tray_no", filterType: "Select" },
                                        { 'name': "Tray Name", 'rlabel': 'Tray Name', 'width': "160px", 'dataField': "tray_name", filterType: "Text" },
                                        { 'name': "Cust Name", 'rlabel': 'Cust Name', 'width': "120px", 'dataField': "cust_name", filterType: "Text" },
                                        { 'name': "Tray Count", 'rlabel': 'Tray Count', 'width': "100px", 'dataField': "stock", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                                    ]
                                });
                                $$("grdCustTrayDetails").dataBind(data);
                            });
                        }
                    });
                }
                $$("grdTransactions").dataBind(data);
                if ($$("ddlViewMode").selectedValue() == "TraywiseReport" || $$("ddlViewMode").selectedValue() == "ItemwiseTrayReport" || $$("ddlViewMode").selectedValue() == "SkuwiseTrayReport") {
                    $(data).each(function (i, item) {
                        tot_stock = parseFloat(tot_stock) + parseFloat(item.stock_qty);
                        tot_tray = parseFloat(tot_tray) + parseFloat(item.tray_qty);
                        tot_empty = parseFloat(tot_empty) + parseFloat(item.tray_empty);
                        tot_cust_tray = parseFloat(tot_cust_tray) + parseFloat(item.customer);
                    });
                    $$("lblTotalTray").val(tot_tray);
                    $$("lblCustomerInHand").val(tot_cust_tray);
                    $$("lblNonEmptyTray").val(tot_stock);
                    $$("lblEmptyTray").val(tot_empty);
                }
                if ($$("ddlViewMode").selectedValue() == "CustomerwiseTrayReport") {
                    $(data).each(function (i, item) {
                        if (item.trans_type == "Vendor Purchase")
                            tot_stock = parseFloat(tot_stock) + parseFloat(item.tray_count);
                        if (item.trans_type == "Vendor Return")
                            tot_tray = parseFloat(tot_tray) + parseFloat(item.tray_count);
                        if (item.trans_type == "Customer Sales")
                            tot_empty = parseFloat(tot_empty) + parseFloat(item.tray_count);
                        if (item.trans_type == "Customer Return")
                            tot_cust_tray = parseFloat(tot_cust_tray) + parseFloat(item.tray_count);
                    });
                    $$("lblTotalTrayPurchaseReturn").val(tot_tray);
                    $$("lblTotalTraySaleReturn").val(tot_cust_tray);
                    $$("lblTotalTrayPurchase").val(tot_stock);
                    $$("lblTotalTraySale").val(tot_empty);
                }
            },
        }
    });

}





    $.widget( "custom.combobox", {
        _create: function() {
            this.wrapper = $( "<span>" )
              .addClass( "custom-combobox" )
              .insertAfter( this.element );
 
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },
 
        _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
              value = selected.val() ? selected.text() : "";
 
            this.input = $( "<input>" )
              .appendTo( this.wrapper )
              .val( value )
              .attr( "title", "" )
              .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
              .autocomplete({
                  delay: 0,
                  minLength: 0,
                  source: $.proxy( this, "_source" )
              })
              .tooltip({
                  classes: {
                      "ui-tooltip": "ui-state-highlight"
                  }
              });
 
            this._on( this.input, {
                autocompleteselect: function( event, ui ) {
                    ui.item.option.selected = true;
                    this._trigger( "select", event, {
                        item: ui.item.option
                    });
                },
 
                autocompletechange: "_removeIfInvalid"
            });
        },
 
        _createShowAllButton: function() {
            var input = this.input,
              wasOpen = false;
 
            $( "<a>" )
              .attr( "tabIndex", -1 )
              .attr( "title", "Show All Items" )
              .tooltip()
              .appendTo( this.wrapper )
              .button({
                  icons: {
                      primary: "ui-icon-triangle-1-s"
                  },
                  text: false
              })
              .removeClass( "ui-corner-all" )
              .addClass( "custom-combobox-toggle ui-corner-right" )
              .on( "mousedown", function() {
                  wasOpen = input.autocomplete( "widget" ).is( ":visible" );
              })
              .on( "click", function() {
                  input.trigger( "focus" );
 
                  // Close if already visible
                  if ( wasOpen ) {
                      return;
                  }
 
                  // Pass empty string as value to search for, displaying all results
                  input.autocomplete( "search", "" );
              });
        },
 
        _source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            response( this.element.children( "option" ).map(function() {
                var text = $( this ).text();
                if ( this.value && ( !request.term || matcher.test(text) ) )
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }) );
        },
 
        _removeIfInvalid: function( event, ui ) {
 
            // Selected an item, nothing to do
            if ( ui.item ) {
                return;
            }
 
            // Search for a match (case-insensitive)
            var value = this.input.val(),
              valueLowerCase = value.toLowerCase(),
              valid = false;
            this.element.children( "option" ).each(function() {
                if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                    this.selected = valid = true;
                    return false;
                }
            });
 
            // Found a match, nothing to do
            if ( valid ) {
                return;
            }
 
            // Remove invalid value
            this.input
              .val( "" )
              .attr( "title", value + " didn't match any item" )
              .tooltip( "open" );
            this.element.val( "" );
            this._delay(function() {
                this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";
        },
 
        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });
    
 