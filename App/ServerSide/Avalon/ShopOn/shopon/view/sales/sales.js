/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$.fn.salesEntryPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {

        page.customerService = new CustomerService();
        page.trayService = new TrayService();
        page.itemService = new ItemService();
        page.billService = new BillService();
        page.dynaReportService = new DynaReportService();


        //#region "Main Actions"

        //Create a new Sale Bill
        page.events.btnSaveSales_click = function () {

            if (androidApp == true) {
                $(".detail-area").progressBar("show");
                page.controls.pnlSalesPopup.close();
                AndroidProxy.execute("insert into local_sales_t values('" + $$("txtCustomerName").selectedValue() + "','" + $$("ddlItem").selectedValue() + "','" + $$("txtPrice").value() + "','" + $$("txtQuantity").value() + "','" + $$("txtAmount").value() + "')", function (data) {
                    $$("msgPanel").show("Sales Bill is successfully created.");
                    $(".detail-area").progressBar("hide");
                    page.loadData();
                });

            } else {
                $(".detail-area").progressBar("show");
                page.controls.pnlSalesPopup.close();
                page.billService.createSales($$("txtCustomerName").selectedValue(), $$("ddlItem").selectedValue(), $$("txtPrice").value(), $$("txtQuantity").value(), $$("txtAmount").value(), function () {
                    $$("msgPanel").show("Sales Bill is successfully created.");
                    $(".detail-area").progressBar("hide");
                    page.loadData();
                });
            }
            page.controls.ddlItem.selectedValue('');
            page.controls.txtPrice.val('');
            page.controls.txtQuantity.val('');  
            page.controls.txtAmount.val('');
        }

        //Make tray transaction
        page.events.btnTransactionPayOK_click = function () {
            page.controls.pnlTrayPopup.close();
            $(".detail-area").progressBar("show");
            if (confirm("Are you want to save the details") == true) {
                if (androidApp == true) {
                    var data = {
                        tray_in: page.controls.txtTrayIn.value(),
                        tray_out: page.controls.txtTrayOut.value(),
                        cust_no: $$("txtCustomerName").selectedValue(),
                        tray_id: $$("ddlTray").selectedValue()
                    }
                    AndroidProxy.execute("insert into local_tray_sales_t values('" + data.cust_no + "','" + data.tray_id + "','" + data.tray_in + "','" + data.tray_out + "')", function (data) {
                        $$("msgPanel").show("Tray In & Out detail is saved successfully!");
                        $(".detail-area").progressBar("hide")
                        page.loadData();
                    });
                } else {

                    var transIn = {
                        tray_count: page.controls.txtTrayIn.value(),
                        trans_date: page.controls.dsBillPayDate.getDate(),
                        trans_type: "Customer Sales",
                        tray_id: page.controls.ddlTray.selectedValue(),
                        cust_id: page.controls.txtCustomerName.selectedValue(),
                        bill_id: -1
                    };
                    var transOut = {
                        tray_count: page.controls.txtTrayOut.value(),
                        trans_date: page.controls.dsBillPayDate.getDate(),
                        trans_type: "Customer Return",
                        tray_id: page.controls.ddlTray.selectedValue(),
                        cust_id: page.controls.txtCustomerName.selectedValue(),
                        bill_id: -1
                    };

                    $$("msgPanel").show("Updating tray details...");
                    if (transIn.tray_count != '') {
                        page.trayService.insertEggTrayTransaction(transIn, function (data) {
                            $$("msgPanel").show("Tray In detail is saved successfully!");
                            $(".detail-area").progressBar("hide")
                            page.loadData();
                        });
                    }
                    if (transOut.tray_count != '') {
                        page.trayService.insertEggTrayTransaction(transOut, function (data) {
                            $$("msgPanel").show("Tray Out detail is saved successfully!");
                            $(".detail-area").progressBar("hide");
                            page.loadData();
                        });
                    }

                }
            }
        }

        //Make Payment
        page.events.btnSavePayment_click = function () {
            var payAmount = parseFloat($$("txtAmount1").value());
            if (androidApp == true) {
                var data = {
                    amount1: page.controls.txtAmount1.value(),
                    key_1: $$("txtCustomerName").selectedValue()
                }
                page.controls.pnlPaymentPopup.close();
                AndroidProxy.execute("update local_customer_t set paid_amount='" + payAmount + "' where cust_no=" + $$("txtCustomerName").selectedValue(), function (data) {
                    $$("msgPanel").show("Payment is updated successfully.")
                    page.loadData();
                });
            } else {
                page.controls.pnlPaymentPopup.close();
                $(".detail-area").progressBar("show");
                page.billService.payAllPendingBills($$("txtCustomerName").selectedValue(), payAmount, function (msg, excessAmount) {
                    $$("msgPanel").show("Payments made =>" + msg);
                    if (excessAmount > 0) {
                        $$("msgPanel").show("Amount " + excessAmount + " is excess and it is not utilised.");
                    }
                    $(".detail-area").progressBar("hide");
                    page.loadData();
                });
            }
            $$("txtAmount1").val('');
        }

        //Monthly Sales
        page.events.btnMonthlySales_click = function () {

            page.controls.pnlMonthlySalesPopup.open();
            page.controls.pnlMonthlySalesPopup.title("Tray Transaction");
            page.controls.pnlMonthlySalesPopup.width(700);
            page.controls.pnlMonthlySalesPopup.height(500);

            if (androidApp == true) {
                page.controls.pnlMonthlySalesPopup.selectedObject.parent().css("height", "1000px");
            }

            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);

            var data1 = {
                viewMode: "Standard",
                fromDate: $.datepicker.formatDate("dd-mm-yy", firstDay),
                toDate: $.datepicker.formatDate("dd-mm-yy", lastDay),
                cust_no: $$("txtCustomerName").selectedValue(),
                item_no: "",
                bill_type: ""
            }

           /* if(androidApp == true){
                AndroidProxy.execute("select * from local_sales_t where cust_no='" + data1.cust_no + "'", function(data2){
                    $$("grdSales").dataBind(data2);
                })*/
            
            //Get data from sales report
            page.dynaReportService.getSalesReport(data1, function (data1) {
                $$("grdSales").dataBind(data1);
            });

        }

        page.events.btnmytransaction_click = function () {

            page.controls.pnlMyTransactionPopup.open();
            page.controls.pnlMyTransactionPopup.title("Tray Transaction");
            page.controls.pnlMyTransactionPopup.width("90%");
            page.controls.pnlMyTransactionPopup.height(500);
            $$("ddlTray1").selectedValue(-1);

            page.controls.lblTrayNo.html('');
            page.controls.lblTrayName.html('');
            page.controls.lblTrayTotalCount.html('');
            page.controls.lblTrayCount.html('');
            page.controls.grdTransactions.dataBind([]);
           


            ////////////////////////
            if (androidApp == true) {
                page.controls.pnlMyTransactionPopup.selectedObject.parent().css("height", "1000px");
            }

            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);

            var data1 = {
                viewMode: "Standard",
                fromDate: $.datepicker.formatDate("dd-mm-yy", firstDay),
                toDate: $.datepicker.formatDate("dd-mm-yy", lastDay),
                cust_no: $$("txtCustomerName").selectedValue(),
                item_no: "",
                bill_type: ""
            }

           /* if(androidApp == true){
                AndroidProxy.execute("select * from local_sales_t where cust_no='" + data1.cust_no + "'", function(data2){
                    $$("grdSales").dataBind(data2);
                })*/
            
            //Get data from sales report
            page.dynaReportService.getSalesReport(data1, function (data1) {
                $$("grdSales").dataBind(data1);
            });

        }



        //#endregion

        //#region Download Upload"

        //Dowload Data
        page.events.btnDownload_click = function () {

            AndroidProxy.execute("DROP TABLE IF EXISTS local_customer_t", function () {
                AndroidProxy.execute("DROP TABLE IF EXISTS local_item_t", function () {
                    AndroidProxy.execute("DROP TABLE IF EXISTS local_sales_t", function () {
                        AndroidProxy.execute("DROP TABLE IF EXISTS local_tray_t", function () {
                            AndroidProxy.execute("DROP TABLE IF EXISTS local_tray_sales_t", function () {
                                AndroidProxy.execute("create table local_customer_t (cust_no integer primary key,cust_name text,total_sales text,total_paid text,monthly_sales text,paid_amount text );", function () {
                                    AndroidProxy.execute("CREATE TABLE `local_sales_t` ( `cust_no` integer, `item_no` integer, `cost` text, `qty` text,  `amount` text, PRIMARY KEY ( cust_no, item_no) ) ", function () {
                                        AndroidProxy.execute("CREATE TABLE `local_item_t` (" + "  `item_no` integer," + "  `item_name` text," + "  `price` text" + ") ", function () {
                                            AndroidProxy.execute("CREATE TABLE `local_tray_t` (" + "  `tray_id` integer," + "  `tray_name` text," + "  `total_stock` text," + "  `current_stock` text" + ") ", function () {
                                                AndroidProxy.execute("CREATE TABLE `local_tray_sales_t` (" + "  `cust_no` integer," + "  `tray_id` integer," + "  `tray_in` text," + "  `tray_out` text" + ") ", function () {

                                                    //insert into local_customer_t                                                                                                      
                                                    page.dynaReportService.downloadCustomerAndSales(function (customerList) {
                                                        page.customerList = customerList;
                                                        //$$("txtCustomerName").dataBind(customerList, "cust_no", "cust_name", "Select Customer");
                                                        $(customerList).each(function (k, cust) {
                                                            //AndroidProxy.execute("update shopon.local_customer_t set tray_in='" + item2.tray_in + "',tray_out='" + item2.tray_out + "',tray_total='" + item2.tray_count + "'where cust_id=" + item2.cust_no)
                                                            AndroidProxy.execute("insert into local_customer_t values('" + cust.cust_no + "','" + cust.cust_name + "','" + cust.total_sales + "','" + cust.total_paid + "','" + cust.monthly_sales + "','0')", function () {

                                                            });

                                                        });
                                                    });

                                                    //insert into local_item_t 
                                                    page.itemService.downloadItem(function (itemList, callback) {
                                                        $(itemList).each(function (l, item) {
                                                            AndroidProxy.execute("insert into local_item_t values('" + item.item_no + "','" + item.item_name + "','" + item.price + "')");
                                                        });
                                                    })

                                                    //insert into local_tray_t 
                                                    page.trayService.downloadTray(function (trayList) {
                                                        $$("ddlTray").dataBind(trayList, "tray_id", "tray_name");
                                                        $(trayList).each(function (l, tray) {
                                                            AndroidProxy.execute("insert into local_tray_t values('" + tray.tray_id + "','" + tray.tray_name + "','" + tray.total_stock + "','" + tray.current_stock + "')");
                                                        });
                                                    });
                                                });
                                            });

                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

        }


        //Upload Data
        page.events.btnUpload_click = function () {
            $(".detail-area").progressBar("show");
            AndroidProxy.execute("SELECT * FROM local_sales_t", function (data, callback) {
                $$("msgPanel").show("Uploading Sales...");
                page.billService.createAllSales(0, data, function () {

                    $$("msgPanel").show("Uploading Payment...");
                    AndroidProxy.execute("select * from local_customer_t", function (data1) {
                        $(data1).each(function (i, item) {
                            item.amount = item.paid_amount;
                        });
                        page.billService.payAllPendingBillsMulti(0, data1, function () {
                            $(".detail-area").progressBar("hide");
                            $$("msgPanel").show("Uploading Completed...");
                        });
                    });

                });

            });
        }
        //#endregion


        //#region Popups"


        //Sale Button click
        page.events.btnSalesSO_click = function () {
            page.controls.pnlSalesPopup.open();
            page.controls.pnlSalesPopup.title("Sales Entry");
            page.controls.pnlSalesPopup.width(340);
            page.controls.pnlSalesPopup.height(400);
            $$("txtDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            $$("txtQuantity").value("1");
            if (androidApp == true) {
                page.controls.pnlSalesPopup.selectedObject.parent().css("height", "1000px");

            }
        }

        //Payment Button click
        page.events.btnPaymentSO_click = function () {
            page.controls.pnlPaymentPopup.open();
            page.controls.pnlPaymentPopup.title("Payment Entry");
            page.controls.pnlPaymentPopup.width(340);
            page.controls.pnlPaymentPopup.height(300);
            $$("txtDate1").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            if (androidApp == true) {
                page.controls.pnlPaymentPopup.selectedObject.parent().css("height", "1000px");

            }
        }

        //Tray Button click
        page.events.btnTraySO_click = function () {
            //var person = prompt("Please enter amount paid", "");
            if (CONTEXT.ENABLE_MODULE_TRAY) {
                $$("pnlTrayShow").show();
            }
            else {
                $$("pnlTrayShow").hide();
            }
            page.controls.pnlTrayPopup.open();
            page.controls.txtTrayIn.value('');
            page.controls.txtTrayOut.value('');
            $$("ddlTray").selectedValue(-1);

            if (androidApp == true) {
                page.controls.pnlTrayPopup.title("Update previously entered Tray entry");
                $$("lblAndroidInfo").html("Note : You are only updating your previous entry. In Android mode : you can only update and cannot create new tray transaction..");
            }
            else {
                page.controls.pnlTrayPopup.title("Make a new Tray Entry");
                $$("lblAndroidInfo").html("");
            }
                
            
            page.controls.pnlTrayPopup.width(340);
            page.controls.pnlTrayPopup.height(450);
            $$("dsBillPayDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            if (androidApp == true) {
                page.controls.pnlTrayPopup.selectedObject.parent().css("height", "1000px");

            }

            if (androidApp == true) {
                AndroidProxy.execute("select * from local_tray_t", function (data) {
                    $$("ddlTray").dataBind(data, "tray_id", "tray_name", "Select Tray");
                    $$("lblCustomerStock").html("");
                });
            } else {
                page.trayService.downloadTray(function (data) {
                    $$("ddlTray").dataBind(data, "tray_id", "tray_name", "Select Tray");
                    $$("lblCustomerStock").html("");
                });
            }

        }

        //Tray history click
        page.events.btnTrayTransaction_click = function () {
            /*     //var person = prompt("Please enter amount paid", "");
             page.controls.pnlTransactionPayPopup.open();
             page.controls.pnlTransactionPayPopup.title("Tray Transaction");
             page.controls.pnlTransactionPayPopup.width(650);
             page.controls.pnlTransactionPayPopup.height(500);
             if (androidApp == true) {
                 page.controls.pnlTransactionPayPopup.selectedObject.parent().css("height", "1000px");
 
             }
             page.trayService.getTrayDetailsCustomer($$("ddlCustomerName").selectedValue(), function (data) {
                 $$("grdTray").dataBind(data);
             });
             page.trayService.getTrayCountByCustomer($$("ddlCustomerName").selectedValue(), function (data) {
                 page.controls.lblTotalTray.html(data[0].tray_count);
                 page.controls.lblBalanceTray.html(data[0].tray_count);
             });*/
        }

        

        //#endregion
      



        page.loadData = function () {
            if (androidApp == true) {
                AndroidProxy.execute("select * from local_customer_t where cust_no='" + $$("txtCustomerName").selectedValue() + "'", function (data, callback) {
                    $(data).each(function (i, item) {
                        page.controls.lblTotalSales.html(item.total_sales);
                        page.controls.lblCurrentSales.html(item.monthly_sales); //Month
                        page.controls.lblSalesPending.html(parseFloat(item.total_sales) - parseFloat(item.total_paid));
                        // page.controls.lblTotalTray.html(item.tray_total); //Cannot show this..
                        // Wrong design

                        page.controls.lblTotalPaidToday.html(item.paid_amount);

                        AndroidProxy.execute("select sum(amount) sales from local_sales_t where cust_no='" + $$("txtCustomerName").selectedValue() + "'", function (data) {
                            data[0].sales = data[0].sales == null ? 0 : data[0].sales;
                            page.controls.lblSalesToday.html(data[0].sales);
                            page.controls.lblPendingToday.html(parseFloat(data[0].sales) - parseFloat(item.paid_amount));
                        });
                    });

                });
            }
            else {
                var data1 = {
                    viewMode: "Customer Wise",
                    fromDate: "",
                    toDate: "",
                    cust_no: $$("txtCustomerName").selectedValue(),
                    item_no: "",
                    bill_type: ""
                }

                page.dynaReportService.getSalesReport(data1, function (data2) {
                    if (data2.length == 0)
                        data2 = [{
                            total: 0,
                            paid: 0
                        }];

                    page.controls.lblTotalSales.html(data2[0].total_price);
                    page.controls.lblNetSales.html(data2[0].total_price);
                    page.pendingAmount = parseFloat(data2[0].total_price) - parseFloat(data2[0].total_paid_amount);
                    page.controls.lblSalesPending.html(page.pendingAmount);
                    page.controls.lblBalToPay.html(page.pendingAmount);
                });

                //$.datepicker.formatDate("dd-mm-yy", new Date())
                var date = new Date(),
                    y = date.getFullYear(),
                    m = date.getMonth();
                var firstDay = new Date(y, m, 1);
                var lastDay = new Date(y, m + 1, 0);

                var data1 = {
                    viewMode: "Customer Wise",
                    fromDate: $.datepicker.formatDate("dd-mm-yy", firstDay),
                    toDate: $.datepicker.formatDate("dd-mm-yy", lastDay),
                    cust_no: $$("txtCustomerName").selectedValue(),
                    item_no: "",
                    bill_type: ""
                }

                page.dynaReportService.getSalesReport(data1, function (data3) {
                    if (data3.length == 0)
                        data3 = [{
                            total_price: 0
                        }];
                    page.controls.lblCurrentSales.html(data3[0].total_price);
                });

                var date = new Date();

                // add a day

                var data1 = {
                    viewMode: "Customer Wise",
                    fromDate: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    toDate: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    cust_no: $$("txtCustomerName").selectedValue(),
                    item_no: "",
                    bill_type: "",
                    status: ""
                }

                page.dynaReportService.getSalesReport(data1, function (data4) {
                    if (data4.length == 0)
                        data4 = [{
                            total_paid_amount: 0
                        }];
                    page.controls.lblTotalPaidToday.html(data4[0].total_paid_amount);
                });


                $$("grdTray").setTemplate({
                    selection: "Single",
                    columns: [{
                        'name': "Trans Date",
                        'width': "100px",
                        'dataField': "trans_date"
                    }, {
                        'name': "Description",
                        'width': "100px",
                        'dataField': "bill_date"
                    }, {
                        'name': "Tray Count",
                        'width': "100px",
                        'dataField': "tray_count"
                    }, {
                        'name': "Balance",
                        'width': "140px",
                        'dataField': "cust_name"
                    }, ]
                });
                $$("grdTray").dataBind([]);

                /*
                page.trayService.getTrayCountByCustomer($$("ddlCustomerName").selectedData().cust_no, function (data) {
                    page.controls.lblTotalTray.html(Math.abs(data[0].tray_count));
                    page.controls.lblBalanceTray.html(data[0].tray_count);
                });
                page.trayService.getTrayDetailsByDay($$("ddlCustomerName").selectedData().cust_no, function (data) {
                    page.controls.lblTrayIn.html(data[0].tray_in);
                    page.controls.lblTrayOut.html(Math.abs(data[0].tray_out));
                });
                */
            }
        }

        page.events.page_load = function () {
            $$("txtCustomerName").selectedObject.val();
            if (androidApp == true) {

                $$("pnlSalesToday").show();
            } else {
                $$("pnlSalesToday").hide();
            }

                var pri, qual, total;
                $$("pnlAllGrid").hide();
                $("#lblCustName").text('');
                $("#lblPeriod").text('');

                //Load Tray
                if (androidApp == true) {
                    AndroidProxy.execute("select * from local_tray_t", function (data) {
                        $$("ddlTray").dataBind(data, "tray_id", "tray_name", "Select Tray");
                        $$("ddlTray1").dataBind(data, "tray_id", "tray_name", "Select Tray");
                    });
                } else {
                    page.trayService.downloadTray( function (data) {
                        $$("ddlTray").dataBind(data, "tray_id", "tray_name", "Select Tray");
                        $$("ddlTray1").dataBind(data, "tray_id", "tray_name", "Select Tray");
                    });
                }


                $$("ddlTray").selectionChange(function (data) {
                    $$("lblCustomerStock").html(data.current_stock);
                });
                $$("ddlTray1").selectionChange(function () {
                    page.trayService.getTrayByNo($$("ddlTray1").selectedValue(), function (data, callback) {
                        $(data).each(function(i, item){
                        page.controls.lblTrayNo.html(item.tray_id);
                        page.controls.lblTrayName.html(item.tray_name);
                        page.controls.lblTrayTotalCount.html(item.total_stock);
                        page.controls.lblTrayCount.html(item.current_stock);
                    
                    page.trayService.getTrayTransaction($$("txtCustomerName").selectedValue(),item.tray_id, function(data1) {
                        page.controls.grdTransactions.width("800px");
                        page.controls.grdTransactions.height("134px");

                        $$("grdTransactions").setTemplate({
                            selection: "Single",
                            columns: [
                                { 'name': "Trans Id", 'width': "70px", 'dataField': "trans_id" },
                                { 'name': "Tray Count", 'width': "110px", 'dataField': "tray_count" },
                                { 'name': "Trans Type", 'width': "140px", 'dataField': "trans_type" },
                                { 'name': "Trans Date", 'width': "90px", 'dataField': "trans_date" },
                                { 'name': "Customer/Vendor", 'width': "130px", 'dataField': "cust_name" },
                                { 'name': "Invoice", 'width': "50px", 'dataField': "bill_id" },
                                {
                                    'name': "Action",
                                    'width': "100px",
                                    'dataField': "trans_id",
                                    itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Delete' value='Delete' /> "
                                }
                            ]
                        });

                        page.controls.grdTransactions.dataBind(data1);
                    });
                });
                });
                });


                //Load Items
                if (androidApp == true) {
                    AndroidProxy.execute("select * from local_item_t", function (data) {
                        $$("ddlItem").dataBind(data, "item_no", "item_name", "Select item");
                        $$("lblCustomerStock").html("");
                    });
                } else {
                    page.itemService.getItems("", function (data) {
                        $$("ddlItem").dataBind(data, "item_no", "item_name", "Select item");
                        $$("lblCustomerStock").html("");
                    });

                }
             


               

                $$("txtQuantity").change(function () {
                    pri = $$("txtPrice").value();
                    qual = $$("txtQuantity").value();
                    total = parseFloat(pri) * parseFloat(qual);
                    $$("txtAmount").value(total);
                });

                $$("txtPrice").change(function () {
                    pri = $$("txtPrice").value();
                    qual = $$("txtQuantity").value();
                    total = parseFloat(pri) * parseFloat(qual);
                    $$("txtAmount").value(total);
                });

                $$("ddlItem").selectionChange(function (data) {

                    if (androidApp == true) {
                        AndroidProxy.execute("select * from local_item_t where item_no='" + data.item_no + "'", function (data1) {
                            if (data1[0].price == null) {
                                data1[0].price = 0;
                            }
                            $$("txtPrice").value(data1[0].price);
                            $$("txtQuantity").value(1);
                            pri = $$("txtPrice").value();
                            qual = $$("txtQuantity").value();
                            total = parseFloat(pri) * parseFloat(qual);
                            $$("txtAmount").value(total);
                        });
                    } else {
                        page.itemService.getItemByNo(data.item_no, function (data1) {
                            if (data1[0].price == null) {
                                data1[0].price = 0;
                            }
                            $$("txtPrice").value(data1[0].price);
                            $$("txtQuantity").value(1);
                            pri = $$("txtPrice").value();
                            qual = $$("txtQuantity").value();
                            total = parseFloat(pri) * parseFloat(qual);
                            $$("txtAmount").value(total);
                        });

                    }                 
                });


                if (androidApp == true) {
                    AndroidProxy.execute("select * from local_customer_t", function (data1) {
                        page.customerList = data1;
                        // $$("txtCustomerName").dataBind(data1, "cust_no", "cust_name", "Select Customer");
                    });
                } else {
                    page.customerService.getCustomerSalesByAll("%", function (data) {
                        page.customerList = data;
                    });
                     
                }
              
           //Customer autocomplete
            page.controls.txtCustomerName.dataBind({
                getData: function (term, callback) {
                    //$(page.customerList).each(function (i, cust) {
                    //    cust.value = cust.cust_no;
                    //    cust.label = cust.cust_name;
                    //});
                    callback(page.customerList);
                    // page.customerService.getCustomerByAll(term, callback);
                }
            });
 
                $$("txtCustomerName").select(function () {
                    $$("pnlAllGrid").show();
                    $(".detail-area").show();                
                    $$("grdSales").width("100%");
                    $$("grdSales").height("auto");


                    $$("lblCustName").value($$("txtCustomerName").selectedObject.val());

                    $$("grdSales").setTemplate({
                        selection: "Single",
                        columns: [{
                            'name': "Bill No",
                            'width': "100px",
                            'dataField': "bill_no"
                        },
                            {
                                'name': "Bill Date",
                                'width': "100px",
                                'dataField': "bill_date"
                            },

                            {
                                'name': "Total",
                                'width': "70px",
                                'dataField': "total_price"
                            },
                            {
                                'name': "Paid",
                                'width': "70px",
                                'dataField': "total_paid_amount"
                            },
                            {
                                'name': "Action",
                                'width': "100px",
                                'dataField': "jrn_date",
                                itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Delete' value='Delete' /> "
                            }
                        ]
                    });

                    $$("grdSales").rowCommand = function (action, actionElement, rowId, row, rowData) {
                        if (action == "delete") {
                            page.billService.deleteBill(rowData.bill_no, function (callback) {
                                alert("Delete the transaction successfully");
                                page.loadData();
                            });
                        }
                    }
                    page.loadData();

                   

                  
                });

                $$("grdTransactions").rowCommand = function(obj) {
                    
                    if (obj.action == "delete") {
                        var data;

                        page.trayService.deleteTrayTransaction(obj.currentData.trans_id, function() {
                            var temp=obj.currentData.tray_id;
                            alert('Transaction deleted successfully');
                            page.trayService.getTrayItems(temp, function(data) {
                                page.controls.grdTransactions.dataBind(data);

                                page.trayService.getTrayByNo(temp, function(data) {

                                    page.controls.lblTrayTotalCount.html(data[0].total_stock);
                                    page.controls.lblTrayCount.html(data[0].current_stock);
                                });

                            });
                        });
                    }





                }


            };


    });
};

var AndroidProxy = {};

AndroidProxy.execute = function (sqlQuery, callback) {
    if (androidDev == false) {
        try {
            var data = Android.execute(sqlQuery);
            if (typeof callback != "undefined")
                callback(eval(data));
        } catch (err) {
            alert(err);
        }

    } else {
        $.server.webMethod("DB.execute", sqlQuery, callback);
    }


}