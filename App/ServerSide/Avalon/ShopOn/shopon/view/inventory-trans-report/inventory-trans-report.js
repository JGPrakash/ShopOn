$.fn.inventoryTrans = function () {
    return $.pageController.getPage(this, function (page, $$) {
     //   page.memberService = new MemberService();
      //  page.paymentService = new PaymentService();
        //page.userService = new UserService();
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.dynaReportService = new DynaReportService();
        page.inventoryService = new InventoryService();
        page.purchaseService = new PurchaseService();
        page.reportService = new ReportService();

        page.reportAPI = new ReportAPI();
        page.itemAPI = new ItemAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        var menu_ids = [];

        function PrintData() {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;
            doc.write("<div><h2><center>" + '' + CONTEXT.COMPANY_NAME + '' + "</center></h2></div>");
            doc.write("<div><h7><center>" + '' + CONTEXT.COMPANY_ADDRESS + '' + "</center></h7></div>");
            doc.write("<div><h7><center>" + '' + CONTEXT.COMPANY_PHONE_NO + '' + "</center></h7></div>");
            doc.write("<br><header align='center'> <h3>Inventory Transaction Report</h3></header>");
            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
            
                //doc.write("<div><h3>Summary:</h3></div>");
                doc.write("<div style='width:500px;'>");
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                //doc.write("<span style='font-weight:bold;width:150px;'>Total Sales : </span><span style='width:150px;align-content:right'>" + page.controls.lblTotalSales.value() + "</span><br>");
                //doc.write("<span style='font-weight:bold;width:150px;'>Total Payment : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalPayment.value() + "</span><br>");
                //doc.write("<span style='font-weight:bold;width:150px;'>Total Return : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalReturns.value() + "</span><br>");
                //doc.write("<span style='font-weight:bold;width:150px;'>Total Return Payment : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalReturnsPayment.value() + "</span><br>");
                //doc.write("<span style='font-weight:bold;width:150px;'>Net Sales : </span><span style='width:150px;align-content:center'>" + page.controls.lblNetSales.value() + "</span><br></div>");
                //doc.write("<span style='font-weight:bold;width:150px;'>Closing Balance : </span><span style='width:150px;align-content:center'>" + page.controls.lblClosingBal.value() + "</span><br></div>");
                doc.write("<div><h3>Details:</h3></div>");
                doc.write("<table align='center' style='width:1000px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white; font-size: 15px;'>");
                doc.write("<th align='left'style=' width: 50px; height: 30px;font-size: 15px;'>Item No</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;font-size: 15px;'>Item Name</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;font-size: 15px;'>Trans Date</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;font-size: 15px;'>Opening Balance</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;font-size: 15px;'>Closing Balance</th></tr>");
                var lastCustNo = "";
                var lineCount = 0;
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.item_no + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 14px;'>" + data.item_name + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 14px;'>" + data.transact_date + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.opening_balance + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.closing_balance + "</td>");
                        head = true;
                        lineCount = lineCount + 1;
                        if (lineCount > 20) {
                            doc.write("</tr>");
                            doc.write("<div class='page-break'></div>");
                            doc.write("<tr>");
                            lineCount = 0;
                        }
                    }
                });


            doc.close();
            r.focus();
            r.print();
        }
        function jasperReport() {
            var detail_list = [];
            var detail = page.controls.grdTransactions.allData();
            $(detail).each(function (i, item) {
                detail_list.push({
                    //"Item No": item.item_no,
                    "Item No": item.item_code,
                    "Item Name": item.item_name,
                    "Trans Date": item.transact_date,
                    "Opening": item.opening_balance,
                    "Closing": item.closing_balance,
                    "Sales": item.sales,
                    "Qty": item.qty
                });
            });
            if ($$("ddlViewMode").selectedValue() == "1") {
                var accountInfo = {
                    "CompName": CONTEXT.COMPANY_NAME,
                    "ReportName": "Inventory Transaction Report ( Standard )",
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "Details": detail_list
                };
                GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Inventory-Report-Standard/inventory-report-standard.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }
            else if ($$("ddlViewMode").selectedValue() == "2") {
                var accountInfo = {
                    "CompName": CONTEXT.COMPANY_NAME,
                    "ReportName": "Hot Sales Report",
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "Details": detail_list
                };
                GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Inventory-Report-Standard/inventory-report-hotsales-standard.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }
            else {
                var accountInfo = {
                    "CompName": CONTEXT.COMPANY_NAME,
                    "ReportName": "Hot Purchase Report",
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "Details": detail_list
                };
                GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "Inventory-Report-Standard/inventory-report-hotsales-standard.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }
        }
        page.events = {
            btnReport_click : function () {
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
            },
            btnPrintJasperBill_click : function () {
                jasperReport();
            },
            btnPrint_click: function(){
                PrintData();
            },
            btnGenerate_click: function () {
                var filter = {
                    viewMode: $$("ddlViewMode").selectedData().view_name,
                    fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    item_no: $$("ddlItem").selectedValue() == -1 ? "" : $$("ddlItem").selectedValue(),
                    language: $$("ddlLanguage").selectedValue()
                };
                filter.store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue();
                filter.comp_id = localStorage.getItem("user_company_id");
                $$("msgPanel").show("Loading...!");
                //page.dynaReportService.getInventoryTransactionReport(filter, function (data) {
                page.reportAPI.inventoryReport(filter, function (data) {
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "120px", 'dataField': "item_no" },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "120px", 'dataField': "item_code" },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name", visible: ($$("ddlLanguage").selectedValue() == "-1") },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name_tr", visible: ($$("ddlLanguage").selectedValue() != "-1") },
                                { 'name': "MRP", 'rlabel': 'MRP', 'width': "90px", 'dataField': "mrp" },
                                { 'name': "Cost", 'rlabel': 'Cost', 'width': "90px", 'dataField': "cost" },
                                { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "90px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Exp Date", 'rlabel': 'Exp Date', 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "MRF Date", 'rlabel': 'Man Date', 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Trans Date", 'rlabel': 'Trans Date', 'width': "90px", 'dataField': "transact_date" },
                                { 'name': "Opening Bal", 'rlabel': 'Opening Bal', 'width': "120px", 'dataField': "opening_balance" },
                                { 'name': "Opening AMT", 'rlabel': 'Opening AMT', 'width': "120px", 'dataField': "opening_balance_amount" },
                                { 'name': "Closing Bal", 'rlabel': 'Closing Bal', 'width': "120px", 'dataField': "closing_balance" },
                                { 'name': "Closing AMT", 'rlabel': 'Closing AMT', 'width': "120px", 'dataField': "closing_balance_amount" },
                                { 'name': "Sales Qty", 'rlabel': 'Sales Qty', 'width': "120px", 'dataField': "sales" }
                            ]
                        });
                        page.controls.grdTransactions.rowBound = function (row, item) {
                            $(row).find("[datafield=expiry_Date]").find("div").html(item.expiry_date);
                            $(row).find("[datafield=man_date]").find("div").html(item.man_date);
                            $(row).find("[datafield=batch_no]").find("div").html(item.batch_no);
                        }
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "Hot Sales" || $$("ddlViewMode").selectedData().view_name == "Hot Purchase") {
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                                //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "120px", 'dataField': "item_no" },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "120px", 'dataField': "item_code" },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name", visible: ($$("ddlLanguage").selectedValue() == "-1") },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "200px", 'dataField': "item_name_tr", visible: ($$("ddlLanguage").selectedValue() != "-1") },
                                { 'name': "MRP", 'rlabel': 'MRP', 'width': "90px", 'dataField': "mrp" },
                                { 'name': "Cost", 'rlabel': 'Cost', 'width': "90px", 'dataField': "cost" },
                                { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "90px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Exp Date", 'rlabel': 'Exp Date', 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "MRF Date", 'rlabel': 'Man Date', 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Qty", 'rlabel': 'Quantity', 'width': "90px", 'dataField': "qty" },
                                { 'name': "", 'width': "0px", 'dataField': "var_no" },
                            ]
                        });
                    }
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    }
                    page.controls.grdTransactions.dataBind(data);
                    $$("msgPanel").hide();
                });
            },

            page_load: function () {
                var languageData = [];
                languageData.push({ view_no: "'en'", view_name: "English" }, { view_no: "'ta'", view_name: "Tamil" });
                $$("ddlLanguage").dataBind(languageData, "view_no", "view_name", "Select");
                page.itemAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlItem").dataBind(data, "item_no", "item_name","All");
                });

                $$("grdTransactions").width("2000px");
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
                var filterViewData = [];
                filterViewData.push({ view_no: "1", view_name: "Standard" }, { view_no: "2", view_name: "Hot Sales" }, { view_no: "3", view_name: "Hot Purchase" });
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");
        }

    }
      } );
    
}
