$.fn.dueReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        //   page.memberService = new MemberService();
        //  page.paymentService = new PaymentService();
        //page.userService = new UserService();
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.reportService = new ReportService();
        page.billService = new BillService();

        page.reportAPI = new ReportAPI();
        page.customerAPI = new CustomerAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        var menu_ids = [];
        document.title = "ShopOn - Due Report";
        $("body").keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
            //your keyCode contains the key code, F1 to F2 
            //is among 112 and 123. Just it.
            //console.log(keyCode);
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnGenerate_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnReport_click();
            }
        });

        page.events = {
            btnGenerate_click: function () {
                $$("lblTotalDue").value(0);
                $$("lblTotalDuePayment").value(0);
                $$("lblTotalDuePending").value(0);
                var filter = {};

                filter.viewMode = $$("ddlViewMode").selectedData().view_name;
                filter.fromDate = ($$("txtStartDate").getDate()=="") ? "" : dbDate($$("txtStartDate").getDate());
                filter.toDate = ($$("txtEndDate").getDate()=="") ? "" : dbDate($$("txtEndDate").getDate());
                filter.cust_no = $$("ddlCustomer").selectedValue() == -1 ? "" : $$("ddlCustomer").selectedValue();
                filter.bill_type = $$("ddlBillType").selectedValue() == "All" ? "" : $$("ddlBillType").selectedValue();
                filter.status = $$("ddlState").selectedValue() == "All" ? "" : $$("ddlState").selectedValue();
                //filter.store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                filter.store_no = masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                filter.comp_id = localStorage.getItem("user_company_id");
                filter.report_filter = $$("ddlReportFilter").selectedValue();
                filter.tax = $$("ddlTax").selectedValue();
                filter.pay_mode = $$("ddlPaymentMode").selectedValue() == "All" ? "" : $$("ddlPaymentMode").selectedValue();
                var bill_code = $$("txtBillNo").value();
                if (bill_code != "") {
                    var bill_code = ($$("txtBillNo").value().indexOf('-') > -1) ? true : false;
                    if (bill_code) {
                        bill_code = $$("txtBillNo").value();
                    }
                    else {
                        var today = new Date();
                        var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
                        bill_code = today.getFullYear() + "" + month + "-" + $$("txtBillNo").value();
                    }
                }
                filter.bill_no = bill_code;
                $$("msgPanel").show("Loading...!");
                //page.dynaReportService.getDueReport(filter, function (data) {
                page.reportAPI.dueReport(filter, function (data) {
                    $$("grdTransactions").height("400px");
                    $$("grdTransactions").width("110%");
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 50,
                            columns: [
                                { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_code" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid Amt', 'width': "100px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance" },
                                { 'name': "Payment Mode", 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': "Customer", 'rlabel': 'Customer', 'width': "120px", 'dataField': "cust_name" },
                                { 'name': "Mobile No", 'rlabel': 'Mobile No', 'width': "100px", 'dataField': "mobile_no" },
                                { 'name': "Address", 'rlabel': 'Address', 'width': "205px", 'dataField': "cust_address" },
                                { 'name': "Sch Id", 'rlabel': 'Sch Id', 'width': "90px", 'dataField': "temp_schedule_id", visible: $$("ddlReportFilter").selectedValue() != "2" },
                                { 'name': "Sch Date", 'rlabel': 'Sch Date', 'width': "90px", 'dataField': "schedule_date", visible: $$("ddlReportFilter").selectedValue() != "2" },
                                { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date", visible: $$("ddlReportFilter").selectedValue() != "2" },
                                
                                { 'name': "Status", 'rlabel': 'Status', 'width': "90px", 'dataField': "status" },
                            ]
                        });
                        var totalDueAmount = 0;
                        var totalDuePayment = 0;
                        var totalDuePending = 0;
                        var last_bill_no = "",total_bill_amount = 0, total_down_payment = 0;
                        $$("grdTransactions").rowBound = function (row, item) {
                            //if (item.status == "Open") {
                                totalDuePending = parseFloat(totalDuePending) + parseFloat(item.balance);
                           // }
                            //if (item.status == "Paid") {
                                totalDuePayment = parseFloat(totalDuePayment) + parseFloat(item.paid);
                           // }
                            totalDueAmount = parseFloat(totalDueAmount) + parseFloat(item.balance) + parseFloat(item.paid);
                            $$("lblTotalDue").value(parseFloat(totalDueAmount).toFixed(2));
                            $$("lblTotalDuePayment").value(parseFloat(totalDuePayment).toFixed(2));
                            $$("lblTotalDuePending").value(parseFloat(totalDuePending).toFixed(2));

                            if (item.status == "Paid") {
                                row[0].style.color = "#368605";
                                $(row[0]).css("font-weight", "bold")
                            }
                            else if (item.status == "Open") {
                                row[0].style.color = "red";
                                $(row[0]).css("font-weight", "bold")
                            }
                        }
                        $$("grdTransactions").dataBind([]);
                        $(data).each(function (i, item) {
                            //var data1 = {
                            //    bill_id: item.bill_id,
                            //    bill_code: item.bill_code,
                            //    bill_no: item.bill_no,
                            //    bill_date: item.bill_date,
                            //    total: item.total,
                            //    paid: item.paid,
                            //    balance: item.balance,
                            //    cust_name: item.cust_name,
                            //    mobile_no: item.mobile_no,
                            //    cust_address: item.cust_address,
                            //    temp_schedule_id: item.temp_schedule_id,
                            //    schedule_date: item.schedule_date,
                            //    due_date: item.due_date,
                            //    status: item.status
                            //}
                            //$$("grdTransactions").createRow(data1);
                            if (last_bill_no != item.bill_no) {
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                total_down_payment = parseFloat(total_down_payment) + parseFloat(item.tot_paid);
                                last_bill_no = item.bill_no;
                            }
                        })
                        $$("grdTransactions").dataBind(data);
                        $$("lblTotalBillAmount").value(parseFloat(total_bill_amount).toFixed(2));
                        //$$("lblTotalDownPayment").value(parseFloat(total_down_payment).toFixed(2));
                        $$("lblTotalDownPayment").value(parseFloat(parseFloat($$("lblTotalBillAmount").value()) - parseFloat($$("lblTotalDue").value())).toFixed(2));
                        $$("msgPanel").hide();
                    }
                    if (data.length == 0) {
                        $$("pnlSummary").hide();
                        $$("pnlGrid").hide();
                        $$("pnlEmptyGrid").show();
                    }
                    else {
                        $$("pnlSummary").show();
                        $$("pnlGrid").show();
                        $$("pnlEmptyGrid").hide();
                    }
                });
                if ($$("ddlReportFilter").selectedValue() != "2") {
                    $$("pnlSummary").show();
                }
                else{
                    $$("pnlSummary").hide();
                }
            },
            btnPrintSalesReport_click: function () {
                page.itemService.getItemStockByItemNo(page.item_no, function (data) {
                    PrintData(data);
                });

            },
            page_load: function () {
                var filterViewData = [];
                filterViewData.push({ view_no: "1", view_name: "Standard" })
                
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");

                //page.customerService.getActiveCustomer("", function (data) {
                page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                    $$("ddlCustomer").dataBind(data, "cust_no", "cust_name", "");
                });
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
                var searchViewData = [];
                if (CONTEXT.ENABLE_EMI_PAYMENT) {
                    searchViewData.push({ view_no: "1", view_name: "EMI" });
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION) {
                    searchViewData.push({ view_no: "2", view_name: "Subscription" });
                }
                $$("ddlReportFilter").dataBind(searchViewData, "view_no", "view_name");
                $$("pnlSummary").hide();
                $$("pnlTax").hide();
                $$("ddlReportFilter").selectionChange(function () {
                    if ($$("ddlReportFilter").selectedValue() == "2") {
                        $$("pnlTax").show();
                    }
                    else {
                        $$("pnlTax").hide();
                    }
                });

                store_refresh = false;
                masterPage.controls.ddlGlobalStoreName.dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name", "All");
                masterPage.controls.ddlGlobalRegisterName.dataBind($.parseJSON(localStorage.getItem("user_register_data")), "reg_no", "reg_name", "All");
                masterPage.controls.ddlGlobalStoreName.selectedValue(localStorage.getItem("user_store_no"));
                masterPage.controls.ddlGlobalRegisterName.selectedValue(localStorage.getItem("user_register_id"));

                $$("ddlExportType").dataBind(CONTEXT.JASPER_SUPPORTING_FORMATS, "value", "value");
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
            //PrintTestDueJasper();
        }
        function jasperReport() {
            var detail_list = [];
            var detail = page.controls.grdTransactions.allData();
            if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                $(detail).each(function (i, item) {
                    detail_list.push({
                        //"Bill No": (item.bill_no == null) ? "" : item.bill_no,
                        "Bill No": (item.bill_code == null) ? "" : item.bill_code,
                        "Bill Date": (item.bill_date == null) ? "" : item.bill_date,
                        "Total": (item.total == null) ? "" : item.total,
                        "Paid": (item.paid == null) ? "" : item.paid,
                        "Cust Name": (item.cust_name == null) ? "" : item.cust_name,
                        "Mobile No": (item.mobile_no == null) ? "" : item.mobile_no,
                        "Address": (item.cust_address == null) ? "" : item.cust_address,
                        "Sch Id": (item.temp_schedule_id == null) ? "" : item.temp_schedule_id,
                        "Sch Date": (item.schedule_date == null) ? "" : item.schedule_date,
                        "Due Date": (item.due_date == null) ? "" : item.due_date,
                        "Amount": (item.amount == null) ? "" : item.amount,
                        "Status": (item.status == null) ? "" : item.status
                    });
                });
                var accountInfo =
                {
                    "CompName": CONTEXT.COMPANY_NAME,
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "ReportName": "Due Report",
                    "SummaryHeadingName": "Summary",
                    "SummaryHeading1": "Total Due Amount",
                    "SummaryValue1": $$("lblTotalDue").value(),
                    "SummaryHeading2": "Total Due Payment",
                    "SummaryValue2": $$("lblTotalDuePayment").value(),
                    "SummaryHeading3": "Total Due Balance",
                    "SummaryValue3": $$("lblTotalDuePending").value(),
                    "SummaryHeading4": "Total Bill Amount",
                    "SummaryValue4": $$("lblTotalBillAmount").value(),
                    "SummaryHeading5": "Total Down Payment",
                    "SummaryValue5": $$("lblTotalDownPayment").value(),
                    "SummaryHeading6": "",
                    "SummaryValue6": "",
                    "Details": detail_list
                };
                GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report/main-due-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }

        }
        function PrintTestDueJasper() {
            var accountInfo =
            {
                "CompName": "Shop On Dev",
                "CompanyAddress": "NO.102G/32/4 POLPETTAI",
                "ReportName": "Due Report",
                "Details": [
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  }
                ]
            };

            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report/main-due-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }
        
    });

}
