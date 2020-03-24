$.fn.collectionReport = function () {
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
        page.subscriptionAPI = new SubscriptionAPI();
        page.reportAPI = new ReportAPI();
        page.customerAPI = new CustomerAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        var menu_ids = [];
        document.title = "ShopOn - Collection Report";
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
                $$("lblTotalCollection").value(0);
                $$("lblTotalCollectionPayment").value(0);
                $$("lblTotalCollectionPending").value(0);
                var filter = {};


                filter.viewMode = $$("ddlViewMode").selectedData().view_name;
                filter.fromDate = ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate());
                filter.toDate = ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate());
                filter.cust_no = $$("ddlCustomer").selectedValue() == -1 ? "" : $$("ddlCustomer").selectedValue();
                filter.bill_type = $$("ddlBillType").selectedValue() == "All" ? "" : $$("ddlBillType").selectedValue();
                filter.status = $$("ddlState").selectedValue() == "All" ? "" : $$("ddlState").selectedValue();
                //filter.store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                filter.store_no = masterPage.controls.ddlGlobalStoreName.selectedValue() == "All" || masterPage.controls.ddlGlobalStoreName.selectedValue() == "-1" ? menu_ids.join(",") : masterPage.controls.ddlGlobalStoreName.selectedValue(),
                filter.area = $$("ddlArea").selectedValue() == "-1" ? "" : $$("ddlArea").selectedValue();
                filter.comp_id = localStorage.getItem("user_company_id");
                filter.pay_mode = $$("ddlEMIPayMode").selectedValue() == "All" ? "" : $$("ddlEMIPayMode").selectedValue();
                //filter.report_filter = $$("ddlReportFilter").selectedValue();
                filter.tax = $$("ddlTax").selectedValue();
                filter.plan_type = $$("ddlPlanBillType").selectedValue();
                $$("msgPanel").show("Loading...!");
                //page.dynaReportService.getDueReport(filter, function (data) {
                page.reportAPI.collectionReport(filter, function (data) {
                    $$("grdTransactions").height("400px");
                    $$("grdTransactions").width("1650px");
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_code" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                                { 'name': "Bill Month", 'rlabel': 'Bill Month', 'width': "90px", 'dataField': "sch_id" },
                                { 'name': "Plan Name", 'rlabel': 'Plan Name', 'width': "120px", 'dataField': "plan_name" },
                                { 'name': "Plan Type", 'rlabel': 'Plan Type', 'width': "120px", 'dataField': "plan_bill_type" },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "90px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance" },
                                { 'name': "Payment Mode", 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': "Customer", 'rlabel': 'Customer', 'width': "90px", 'dataField': "cust_name" },
                                { 'name': "Mobile No", 'rlabel': 'Mobile No', 'width': "90px", 'dataField': "mobile_no" },
                                { 'name': "Address", 'rlabel': 'Address', 'width': "200px", 'dataField': "cust_address" },
                                { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date" },
                                { 'name': "Status", 'rlabel': 'Status', 'width': "90px", 'dataField': "status" },
                            ]
                        });
                        var totalDueAmount = 0;
                        var totalDuePayment = 0;
                        var totalDuePending = 0;
                        $$("grdTransactions").rowBound = function (row, item) {
                            //if (item.status == "Open") {
                            totalDuePending = parseFloat(totalDuePending) + parseFloat(item.balance);
                            // }
                            //if (item.status == "Paid") {
                            totalDuePayment = parseFloat(totalDuePayment) + parseFloat(item.paid);
                            // }
                            totalDueAmount = parseFloat(totalDueAmount) + parseFloat(item.balance) + parseFloat(item.paid);
                            $$("lblTotalCollection").value(parseFloat(totalDueAmount).toFixed(2));
                            $$("lblTotalCollectionPayment").value(parseFloat(totalDuePayment).toFixed(2));
                            $$("lblTotalCollectionPending").value(parseFloat(totalDuePending).toFixed(2));
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
                        //$(data).each(function (i, item) {
                        //    var data1 = {
                        //        bill_no: item.bill_no,
                        //        bill_date: item.bill_date,
                        //        total: item.total,
                        //        paid: item.paid,
                        //        balance: item.balance,
                        //        cust_name: item.cust_name,
                        //        mobile_no: item.mobile_no,
                        //        cust_address: item.cust_address,
                        //        due_date: item.due_date,
                        //        status: item.status,
                        //        sch_id: item.sch_id,
                        //        plan_name: item.plan_name,
                        //        plan_bill_type: item.plan_bill_type
                        //    }
                        //    $$("grdTransactions").createRow(data1);
                        //})
                        $$("grdTransactions").dataBind(data);
                        $$("msgPanel").hide();
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
                    }
                });
                $$("pnlSummary").show();
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
                        if (item.obj_id.startsWith("6"))
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
                page.subscriptionAPI.getValue({sub_id:-1}, function (data) {
                    $$("ddlArea").dataBind(data, "bill_area", "bill_area", "All");
                });
                $$("pnlSummary").hide();

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
            var sl_no = 1;
            if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                $(detail).each(function (i, item) {
                    detail_list.push({
                        "Sl No": sl_no,
                        "Cust Name": (item.cust_name == null) ? "" : item.cust_name,
                        "Mobile No": (item.mobile_no == null || item.mobile_no == "null") ? "" : item.mobile_no,
                        "Plan Name": (item.plan_name == null) ? "" : item.plan_name,
                        "Bill Month": (item.sch_id == null) ? "" : item.sch_id,
                        "Due Date": (item.due_date == null) ? "" : item.due_date,
                        "Amount": (item.total == null) ? "" : item.total,
                        "Paid": (item.paid == null) ? "" : item.paid,
                        "Balance": (item.balance == null) ? "" : item.balance,
                    });
                    ++sl_no;
                });
                var accountInfo =
                {
                    "CompName": CONTEXT.COMPANY_NAME,
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "ReportName": "Collection Report",
                    "SummaryHeadingName": "Summary",
                    "SummaryHeading1": "Total Collection Amount",
                    "SummaryValue1": $$("lblTotalCollection").value(),
                    "SummaryHeading2": "Total Collection Payment",
                    "SummaryValue2": $$("lblTotalCollectionPayment").value(),
                    "SummaryHeading3": "Total Collection Balance",
                    "SummaryValue3": $$("lblTotalCollectionPending").value(),
                    "Details": detail_list
                };
                GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report/main-collection-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }

        }
        function PrintTestDueJasper() {
            var accountInfo =
            {
                "CompName": "Shop On Dev",
                "CompanyAddress": "NO.102G/32/4 POLPETTAI",
                "ReportName": "Collection Report",
                "Details": [
                  {
                      "Sl No": "6",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Plan Name": "ABCD",
                      "Bill Month": "02-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Paid": "16800.00",
                      "Balance": "1000"
                  },
      {
          "Sl No": "6",
          "Cust Name": "AJITH KUMAR",
          "Mobile No": "8888888888",
          "Plan Name": "ABCD",
          "Bill Month": "02-2018",
          "Due Date": "10-10-2018",
          "Amount": "1000",
          "Paid": "16800.00",
          "Balance": "1000"
      },
      {
          "Sl No": "6",
          "Cust Name": "AJITH KUMAR",
          "Mobile No": "8888888888",
          "Plan Name": "ABCD",
          "Bill Month": "02-2018",
          "Due Date": "10-10-2018",
          "Amount": "1000",
          "Paid": "16800.00",
          "Balance": "1000"
      },
      {
          "Sl No": "6",
          "Cust Name": "AJITH KUMAR",
          "Mobile No": "8888888888",
          "Plan Name": "ABCD",
          "Bill Month": "02-2018",
          "Due Date": "10-10-2018",
          "Amount": "1000",
          "Paid": "16800.00",
          "Balance": "1000"
      },
      {
          "Sl No": "6",
          "Cust Name": "AJITH KUMAR",
          "Mobile No": "8888888888",
          "Plan Name": "ABCD",
          "Bill Month": "02-2018",
          "Due Date": "10-10-2018",
          "Amount": "1000",
          "Paid": "16800.00",
          "Balance": "1000"
      }
                ]
            };

            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report/main-collection-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }

    });

}
