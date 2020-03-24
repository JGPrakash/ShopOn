$.fn.salesReturn = function () {

    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.billService = new BillService();
        page.accService = new AccountingService();
        page.salesService = new SalesService();
        page.finfactsEntry = new FinfactsEntry();
        page.expenseBillService = new BillExpenseService();
        page.taxclassService = new TaxClassService();
        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.settingService = new SettingService();
        page.rewardService = new RewardService();
        page.finfactsService = new FinfactsService();
        page.stockAPI = new StockAPI();
        page.template("/" + appConfig.root + "/shopon/view/sales-pos/sales-return.html");

        page.selectedBill = null;
        page.productList = [];
        page.manualDiscountValue = 0;
        page.manualDiscountbillLevel = false;
        page.currentCust_no = 0;
        page.currentBillNo = 0;
        page.currentCustNo = 0;
        page.currentReturnBillNo = 0;

        page.interface.currentProductList = null;

        page.selectedPayment = {};
        page.tax = [];
        page.plan_id = null;

        page.events.btnOpenBill_click = function (bill) {

            var obj = page.createBillView(bill.bill_no);
            obj.viewBill(bill.bill_no);
            $$("pnlSales").hide();
            $$("pnlBill").show();


        }



        $(page.selectedObject).keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this


            //now we caught the key code, yabadabadoo!!
            var keyCode = e.keyCode || e.which;

            //your keyCode contains the key code, F1 to F12 
            //is among 112 and 123. Just it.
            // console.log(keyCode);
            if (keyCode == 114) {
                e.preventDefault();
                page.events.btnPayment_click();
            }
            if (keyCode == 115) {
                e.preventDefault();
                page.events.btnSave_click();
            }


        });

        function confirmManualDisc() {
            var defer = $.Deferred();

            $("#dialog-form").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#manualDiscount");
                        //Do your code here
                        page.manualDiscountValue = text1.val();
                        defer.resolve("Ok");
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        defer.resolve("Cancel");

                        $(this).dialog("close");
                    }
                }
            });

            //$("#dialog-form").dialog("open");

            return defer.promise();
        }
        page.loadSelectedBill = function (bill, callback) {
            
            page.selectedBill = bill;

            $$("txtCustomerName").customText(bill.cust_name);
            $$("hdnCustomerNo").val(bill.cust_no);
            $$("lblPhoneNo").value(bill.phone_no);
            $$("lblAddress").value(bill.address);
            $$("lblBillNo").value(bill.bill_no);
           // $$("lblBillDate").value(bill.bill_date);
            $$("txtBillDate").setDate(nvl(bill.bill_date, ""));


            $$("lblSubTotal").value(bill.sub_total);
            $$("lblRndOff").value(bill.round_off);
            $$("lblTotal").value(bill.total);
            page.interface.setBillAmount(bill.total);
            $$("lblDiscount").value(bill.discount);
            $$("lblTax").value(bill.tax);
            $$("lblEmailId").value(bill.email);
            $$("lblGst").value(bill.gst_no);
            $$("ddlDeliveryBy").selectedValue(bill.sales_executive);
            page.customerService.getTotalPoint(bill.cust_no, function (data, callback) {
                $$("lblAvalablePoints").value(data[0].points);

            });
            //Expense
            $$("txtExpenseName").value((bill.exp_name == "0") ? "" : bill.exp_name);
            $$("txtExpense").value((bill.exp_amount == "0") ? "" : bill.exp_amount);
            if (bill.state_text == "NewReturn") {

                $$("grdReturnItemSelection").width("100%");
                $$("grdReturnItemSelection").height("220px");
                $$("grdReturnItemSelection").setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Item No", 'width': "75px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "170px", 'dataField': "item_name" },
                        { 'name': "Qty", 'width': "100px", 'dataField': "qty", },
                        { 'name': "Free Qty", 'width': "100px", 'dataField': "free_qty", },
                        { 'name': "Unit", 'width': "100px", 'dataField': "unit", },
                        { 'name': "Qty in Hand", 'width': "100px", 'dataField': "qty_stock", },
                        { 'name': "Mrp", 'width': "80px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Price", 'width': "100px", 'dataField': "price" },
                        { 'name': "Disc", 'width': "100px", 'dataField': "discount" },
                        { 'name': "Tax", 'width': "100px", 'dataField': "tax_per" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no" },
                        { 'name': "Amount", 'width': "120px", 'dataField': "total_price" },
                       // { 'name': "", 'width': "250px", 'dataField': "", visible: true, editable: false, itemTemplate: "<input type='button' value='Send Email' action='SendEmail' control='salesPOS.primaryWriteButton' controlid='btnSendMail' event='click:btnSendMail_click'/>" }
                    ]
                });
                $$("grdReturnItemSelection").dataBind(bill.billItems);
                $$("grdReturnItemSelection").selectionChanged = function (row, rowId) {
                    var total = 0;
                    var sub_total = 0;
                    var discount = 0;
                    var tax = 0;
                    $(page.controls.grdReturnItemSelection.selectedData()).each(function (i, item) {
                        total = parseFloat(parseFloat(total) + parseFloat(item.total_price)).toFixed(2);
                        sub_total = parseFloat(parseFloat(sub_total) + parseFloat(item.price)).toFixed(2);
                        discount = parseFloat(parseFloat(discount) + parseFloat(item.discount)).toFixed(2);

                        tax = parseFloat(parseFloat(tax) + (parseFloat(item.price) * parseFloat(item.qty) - parseFloat(item.total_price) - parseFloat(item.discount))).toFixed(2);
                    });

                    page.controls.lblSubTotal.value(sub_total);
                    page.controls.lblTotal.value(total);
                    page.interface.setBillAmount(total);
                    page.controls.lblDiscount.value(discount);
                    page.controls.lblTax.value(Math.abs(tax));
                };
            }
            else {
                page.pingGrid(page.selectedBill.state_text, bill.billItems);

                var dataList = [];
                $(page.interface.currentProductList).each(function (i, item) {
                        dataList.push(item);
                });
                page.productList = dataList;
            }

            //$$("grdDiscount").dataBind(bill.discounts);
            //$$("ddlSalesTax").selectedValue(bill.sales_tax_no);  //Should ser page.sales_tax  

            
            page.view.UIState(bill.state_text);
            if (callback)
                callback();
        }
        page.loadSalesTaxClasses = function (sales_tax_no, callback) {
            if (sales_tax_no == -1) {
                callback([]);
            } else {
                page.billService.getSalesTaxClass(sales_tax_no, function (sales_tax_class) {
                    callback(sales_tax_class);
                });
            }
        }
        page.pingGrid = function (state_text, billItems) {
            var gwidth = 1200;
            CONTEXT.POSShowGST = true;
            if (CONTEXT.POSShowFree == true)
                gwidth = gwidth + 200;
            if (CONTEXT.POSShowStock == true)
                gwidth = gwidth + 600;
            if (CONTEXT.POSShowGST == true)
                gwidth = gwidth + 400;

            //CONTEXT.POSShowStock = true;
            if (CONTEXT.POSShowFree == false && CONTEXT.POSShowStock == false && CONTEXT.POSShowGST == false)
                $$("grdBill").width("100%");
            else
                $$("grdBill").width(gwidth + "px");
            $$("grdBill").height("auto;min-height:150px;overflow-y:auto");

            //Set The Grid For Mobile
            if (window.mobile) {
                $$("grdBill").height("auto");
                page.controls.grdBill.setTemplate({
                    selection: false,
                    columns: [
                            { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                                { 'name': "Item No", 'width': "80px", 'dataField': "item_no", editable: false },
                                { 'name': "Item Name", 'width': "150px", 'dataField': "item_name", editable: false },
                                { 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                               { 'name': "Stocked", 'width': "60px", 'dataField': "qty", editable: false },
                               { 'name': "Returned", 'width': "90px", 'dataField': "qty_returned", editable: false },
                                { 'name': "Return Qty", 'width': "100px", 'dataField': "ret_qty", editable: true },
                                { 'name': "Free Qty", 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.showFree },
                                { 'name': "Returned Free", 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.showFree },
                                { 'name': "Free Item", 'width': "100px", 'dataField': "ret_free", editable: true, visible: CONTEXT.showFree },
                                { 'name': "Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                                { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.showVariation },
                                { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                                { 'name': "Man Date", 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                                { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },//, editable: false },
                                { 'name': "Tax", 'width': "40px", 'dataField': "tax_per", visible: false },
                                { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", visible: CONTEXT.showHsnCode },
                                { 'name': "CGST", 'width': "60px", 'dataField': "cgst" },
                                { 'name': "SGST", 'width': "60px", 'dataField': "sgst" },
                                { 'name': "IGST", 'width': "60px", 'dataField': "igst" },
                                { 'name': "Amount", 'width': "100px", 'dataField': "tot_amount" },
                                { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                              { 'name': "", 'width': "0px", 'dataField': "amount" },
                              { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                              { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                              { 'name': "", 'width': "1px", 'dataField': "cost" },
                              { 'name': "", 'width': "1px", 'dataField': "var_no" },
                              { 'name': "", 'width': "0px", 'dataField': "taxable_value", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                    ]
                });
            }
            else {
                page.controls.grdBill.setTemplate({
                    selection: false,
                    columns: [
                            //{ 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                                { 'name': "Item No", 'width': "80px", 'dataField': "item_no", editable: false },
                                { 'name': "Item Name", 'width': "150px", 'dataField': "item_name", editable: false },
                                { 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                               { 'name': "Stocked", 'width': "60px", 'dataField': "qty", editable: false },
                               { 'name': "Returned", 'width': "90px", 'dataField': "qty_returned", editable: false },
                                { 'name': "", 'width': "0px", 'dataField': "ret_qty", editable: true },
                                { 'name': "Return Qty", 'width': "100px", 'dataField': "temp_ret_qty", editable: true },
                                { 'name': "Free Qty", 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.showFree },
                                { 'name': "Returned Free", 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.showFree },
                                { 'name': "", 'width': "0px", 'dataField': "ret_free", editable: true, visible: CONTEXT.showFree },
                                { 'name': "Free Item", 'width': "100px", 'dataField': "temp_ret_free", editable: true, visible: CONTEXT.showFree },
                                { 'name': "Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                                { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: false },
                                { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                                { 'name': "Man Date", 'width': "100px", 'dataField': "man_date", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: false },
                                { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },//, editable: false },
                                { 'name': "Tax", 'width': "40px", 'dataField': "tax_per", visible: false },
                                { 'name': "HSN Code", 'width': "100px", 'dataField': "hsn_code", visible: false },
                                { 'name': "CGST", 'width': "60px", 'dataField': "cgst", visible: false },
                                { 'name': "SGST", 'width': "60px", 'dataField': "sgst", visible: false },
                                { 'name': "IGST", 'width': "60px", 'dataField': "igst", visible: false },
                                { 'name': "Amount", 'width': "100px", 'dataField': "tot_amount" },
                                { 'name': "", 'width': "0px", 'dataField': "price", editable: false, visible: false },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const", visible: false },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "amount", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "unit_identity", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact", visible: false },
                              { 'name': "", 'width': "1px", 'dataField': "cost", visible: false },
                              { 'name': "", 'width': "1px", 'dataField': "var_no", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "taxable_value", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "tax_inclusive", visible: false },
                    ]
                });
            }
            page.controls.grdBill.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Delete") {
                    page.controls.grdBill.deleteRow(rowId);
                    page.calculate();
                    // if (page.currentBillNo != null)
                    //     page.billService.deleteBillItem(page.currentBillNo, rowData.item_no);
                }
            }
            page.controls.grdBill.rowBound = function (row, item) {
                if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                    item.free_qty_return = 0;
                if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                    item.free_qty = 0;
                //  item.qty_returned = parseFloat(item.qty_returned) - parseFloat(item.free_qty);
                //var tax = parseFloat(item.item_price - item.cost).toFixed(2);
                var qty_fact = 1;
                var item_unit = item.unit;
                if (item.unit_identity == "1") {
                    qty_fact = item.alter_unit_fact;
                    item_unit = item.alter_unit;
                }
                if (item.discount != null && item.discount != undefined) {
                    item.discount = parseFloat(item.discount) / (parseFloat(item.ordered_qty) / parseFloat(qty_fact));
                }
                if (window.mobile) {
                    row.find("div[datafield=item_no]").css("display", "none");
                    row.find("div[datafield=cgst]").css("display", "none");
                    row.find("div[datafield=sgst]").css("display", "none");
                    row.find("div[datafield=igst]").css("display", "none");
                    row.find("div[datafield=variation_name]").css("display", "none");
                    row.find("div[datafield=cot_of_good]").css("display", "none");
                }
                //Check the expiry items or not
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        var EnteredDate = item.expiry_date;
                        var date = "28";
                        var month = EnteredDate.substring(0,2);
                        var year = EnteredDate.substring(3, 7);

                        var myDate = new Date(year, month - 1, date);
                        var today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (CONTEXT.ENABLE_EXP_ALERT) {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                    row[0].style.color = "red";
                                }
                            }
                            else {
                                myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                                if (myDate <= today) {
                                    alert("This Product Will Be Expire On " + item.expiry_date);
                                    row[0].style.color = "orange";
                                }
                            } 
                        } else {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                    row[0].style.color = "red";
                                }
                            }
                        }
                    }
                }
                else {
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        var EnteredDate = item.expiry_date;
                        var date = EnteredDate.substring(0, 2);
                        var month = EnteredDate.substring(3, 5);
                        var year = EnteredDate.substring(6, 10);

                        var myDate = new Date(year, month - 1, date);
                        var today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (CONTEXT.ENABLE_EXP_ALERT) {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                }
                                row[0].style.color = "red";
                            }
                            else {
                                myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                                if (myDate <= today) {
                                    alert("This Product Will Be Expire On " + item.expiry_date);
                                    row[0].style.color = "orange";
                                }
                            } 
                        } else {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                }
                                row[0].style.color = "red";
                            }
                        }
                    }
                }
                
                if (item.tray_id == "-1" || item.tray_id == null) {
                    row.find("div[datafield=tray_received]").css("visibility", "hidden");
                }
                var htmlTemplate = [];
                if (CONTEXT.showAlternativeUnit) {
                    if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                        htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                    } else {
                        htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                    }
                } else {
                    htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                }
                
                $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                if (item.unit_identity == "1") {
                    item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.qty)) {
                        item.qty = 0;
                        item.qty = 0;
                    }
                    $(row).find("[datafield=qty]").find("div").html(parseFloat(item.qty));
                    item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.qty_returned)) {
                        item.qty_returned = 0;
                        item.qty_returned = 0;
                    }
                    $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));

                    item.free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.free_qty)) {
                        item.free_qty = 0;
                        item.free_qty = 0;
                    }
                    $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.free_qty));
                    item.free_qty_return = parseFloat(item.free_qty_return) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.free_qty_return)) {
                        item.free_qty_return = 0;
                        item.free_qty_return = 0;
                    }
                    $(row).find("[datafield=free_qty_return]").find("div").html(parseFloat(item.free_qty_return));

                    $(row).find("[id=itemUnit]").val(1);
                } 

                row.on('keyup keydown keypress onDOMAttrModified propertychange change', "input[dataField=qty]", function (evt) {
                    row.find("[dataField=total_price]").children("div").html(parseInt(row.find("[dataField=price]").children("div").html()) * parseInt(row.find("input[dataField=qty]").val()));
                });
                $(row).find("[datafield=qty] input").css("width", "40px");
                $(row).find("[datafield=item_name] input").css("width", "175px");
                $(row).find("[datafield=discount]").attr("action", "discount");
                
                row.on("change", "input[datafield=temp_ret_qty]", function () {
                    if (item.unit_identity == "0") {
                        item.ret_qty = parseFloat(item.temp_ret_qty);
                    } else {
                        item.ret_qty = parseFloat(item.temp_ret_qty) * parseFloat(item.alter_unit_fact);
                    }
                    page.calculate();
                });
             
                row.on("change", "input[datafield=temp_ret_free]", function () {
                    if (item.unit_identity == "0") {
                        item.ret_free = parseFloat(item.temp_ret_free);
                    } else {
                        item.ret_free = parseFloat(item.temp_ret_free) * parseFloat(item.alter_unit_fact);
                    }
                });
                
            };

            $$("grdBill").dataBind(billItems);
            $$("grdBill").edit(true);

            $$("grdBill").selectedObject.find(".grid_header:last-child").hide();
            $$("grdBill").selectedObject.append("<div class='grid_bill_footer'>" + $$("grdBill").selectedObject.find(".grid_header:first-child").html() + "</div>");
            $$("grdBill").selectedObject.find(".grid_bill_footer div").html("");

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=price]").html("Total");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html("0");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html("0");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html("0");

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").attr("cursor", "pointer");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").click(function () {
                $$("lblDiscountLabel").selectedObject.click();
            });

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").attr("cursor", "pointer");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").click(function () {
                $$("lblTaxLabel").selectedObject.click();
            });




            ////if (billItems.length>0)
            ////    page.calculate();
        }

        page.calculate = function (callback) {

            var finalsubtotal = 0;
            var finaltotal = 0;
            //var comm_tax = 0;
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var soItem = page.controls.grdBill.getRowData(row);
                //CALCULATE THE SUBTOTAL VALUE
                soItem.ret_qty = (soItem.ret_qty == "" || soItem.ret_qty == null || typeof soItem.ret_qty == "undefined") ? "0" : soItem.ret_qty;
                var subtotal = parseFloat(soItem.ret_qty) * parseFloat(soItem.item_price);
                // SUBTOTAL IS SAME FOR TOTAL IN ITEM
                var total = subtotal;

                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(2));
                $(row).find("[datafield=tax_per]").find("div").html(soItem.tax_per);
                $(row).find("[datafield=tot_amount]").find("div").html(soItem.total_price)
                soItem.total_price = total;
                //soItem.buying_cost = buying_cost;
                finalsubtotal = finalsubtotal + subtotal;
                finaltotal = finaltotal + total;
            });
            //Show the subtotal
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(2));


            var data = page.controls.grdBill.allData();
            // page.controls.lblSubTotal.value(parseFloat(sub_total).toFixed(2));
            page.controls.lblDiscount.value(parseFloat(0).toFixed(2));
            page.controls.lblTax.value(parseFloat(0).toFixed(2));

            var total_after_Rnd_off = Math.round(parseFloat(finaltotal)); total_after_Rnd_off
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(finaltotal)).toFixed(2);

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(2));

            //delivery charge
            if ($$("txtExpense").value() != "" && $$("txtExpense").value() != 0 && isInt($$("txtExpense").value() != 0) && page.controls.lblSubTotal.value() != 0) {
                var expAmount = $$("txtExpense").value();
                var tot_with_expense = parseFloat(expAmount) + parseFloat(total_after_Rnd_off);
                tot_with_expense = tot_with_expense.toFixed(2);
                page.controls.lblTotal.value(parseFloat(tot_with_expense).toFixed(2));
            }
            else
                page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(2));

            page.interface.setBillAmount(parseFloat(total_after_Rnd_off).toFixed(2));
            if (page.controls.lblTotal.value() == 0 || page.controls.lblTotal.value() == "" || page.controls.lblTotal.value() == undefined) {
                $$("txtExpense").value('');
            }


            if (CONTEXT.EnableTotalQtyInBill) {
                var alldataqty = page.controls.grdBill.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = obj.ret_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.ret_qty);
                    }
                    if (!temp[obj.alter_unit]) {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = obj.ret_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.ret_qty);
                    }
                }
                var result = "";
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + ",";
                }
                $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=unit]").html(result);
            }
            
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
            

        }

        //$("[controlid=txtExpense]").bind('change', function (e) {
        //$("[controlid=txtExpense]").keypress(function () {
        //    page.calculate();
        //});
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        var $input = $("[controlid=txtExpense]");

        //on keyup, start the countdown
        $input.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        });

        //on keydown, clear the countdown 
        $input.on('keydown', function () {
            clearTimeout(typingTimer);
        });

        //user is "finished typing," do something
        function doneTyping() {
            page.calculate();
        }
        page.insertBill = function (bill_type,pay_mode, callback) {
            try{
                var result = "";
                if (CONTEXT.EnableTotalQtyInBill) {
                    var alldataqty = page.controls.grdBill.allData();
                    var temp = {};
                    var obj = null;
                    for (var i = 0; i < alldataqty.length; i++) {
                        obj = alldataqty[i];

                        if (!temp[obj.unit]) {
                            if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                                temp[obj.unit] = obj.temp_qty;
                        } else {
                            if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                                temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                        }
                        if (!temp[obj.alter_unit]) {
                            if (parseInt(obj.unit_identity) == 1)
                                temp[obj.alter_unit] = obj.temp_qty;
                        } else {
                            if (parseInt(obj.unit_identity) == 1)
                                temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                        }
                    }
                    for (var i in temp) {
                        result = result + temp[i] + ":" + i + "/";
                    }
                }
                var buying_cost = 0;
                var cus_name = $$("txtCustomerName").selectedObject.val().split('_');
                var newBill = {
                    bill_no: "0",
                    bill_date: dbDateTime($$("txtBillDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    user_no: CONTEXT.user_no,

                    sub_total: page.controls.lblSubTotal.value(),
                    round_off: page.controls.lblRndOff.value(),
                    total: page.controls.lblTotal.value(),
                    discount: page.controls.lblDiscount.value(),
                    tax: page.controls.lblTax.value(),

                    bill_type: "SaleReturn",
                    state_no: "300",
                    sales_tax_no: "-1",
                    //pay_type: $$("ddlPayType").selectedValue(),
                    delivered_by: $$("ddlDeliveryBy").selectedValue(),
                    expense: ($$("txtExpense").value() == "" || $$("txtExpense").value() == null) ? 0 : $$("txtExpense").value(),
                    cust_no: page.controls.hdnCustomerNo.val(),
                    cust_name: cus_name[0],//$$("txtCustomerName").selectedObject.val(),
                    mobile_no: $$("lblPhoneNo").value(),
                    email_id: $$("lblEmailId").value(),
                    cust_address: $$("lblAddress").value().replace(/,/g, '-'),
                    gst_no: $$("lblGst").value(),
                    tot_qty_words: result,
                    bill_no_par: $$("lblBillNo").value(),
                    pay_mode: $$("ddlPayType").selectedValue(),
                    bill_barcode: "",//Check It
                    sales_executive: $$("ddlDeliveryBy").selectedValue(),
                    //FINFACTS ENTRY DATA
                    invent_type: "SaleReturnCredit",
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    //fulfill: true,
                };
                var rbillItems = [];
                $(page.controls.grdBill.allData()).each(function (i, billItem) {
                    var qty = billItem.free_qty;
                    if (isNaN(qty))
                        qty = 0;
                    if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
                        var start = billItem.qty.length - billItem.alter_unit.length;
                        if (!isNaN(start)) {
                            var lastChar = billItem.qty.substring(start, billItem.qty.length);
                            if (lastChar == billItem.alter_unit) {
                                billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
                            }
                        }
                    }
                    if (billItem.tray_received == "" || billItem.tray_received == null || typeof billItem.tray_received == "undefined") {
                        billItem.tray_received = 0;
                    }
                    if (isNaN(billItem.tray_received) || billItem.tray_received < 0) {
                        throw "Tray shold be a number and non negative";
                    }
                    rbillItems.push({
                        var_no: billItem.var_no,
                        qty: billItem.ret_qty,
                        free_qty: billItem.ret_free,
                        unit_identity: billItem.unit_identity,
                        price: billItem.item_price,
                        discount: "0",
                        taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                        tax_per: billItem.tax_per,
                        total_price: billItem.total_price,
                        price_no: billItem.price_no,
                        bill_type: "SaleReturn",
                        tax_class_no: billItem.tax_class_no,

                        hsn_code: billItem.hsn_code,
                        cgst: billItem.cgst,
                        sgst: billItem.sgst,
                        igst: billItem.igst,
                        tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined") ? "0" : billItem.tray_received,
                        amount: parseFloat(billItem.cost) * (parseFloat(billItem.ret_qty) + parseFloat(billItem.ret_free))
                    });
                    buying_cost = buying_cost + (parseFloat(billItem.cost) * (parseFloat(billItem.qty) + parseFloat(billItem.free_qty)));
                });
                newBill.bill_items = rbillItems;
                var billSO = [];
                var rewardSo = [];
                if (pay_mode == "Cash") {
                    billSO.push({
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_desc: "POS Bill Payment",
                        amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                        collector_id: CONTEXT.user_no,
                        pay_type: "SaleReturn",
                        pay_mode: page.controls.ddlPayType.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: "",
                        coupon_no: ""
                    });
                }
                else if (pay_mode == "Rewards") {
                    rewardSo.push({
                        trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        reward_plan_id: page.plan_id,
                        points: parseFloat(page.controls.lblTotal.value()) * 4,
                        trans_type: "Debit",
                        setteled_amount: page.controls.lblTotal.value()
                    });
                    billSO.push({
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_desc: "POS Bill Payment",
                        amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                        collector_id: CONTEXT.user_no,
                        pay_type: "SaleReturn",
                        pay_mode: page.controls.ddlPayType.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: "",
                        coupon_no: ""
                    });
                }
                else if (pay_mode == "Mixed") {
                    var reward_amount = 0;
                    $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                        if (item.points != "") {
                            reward_amount = parseFloat(reward_amount) + parseFloat(item.amount);
                        }
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: item.amount,
                            collector_id: CONTEXT.user_no,
                            pay_type: "SaleReturn",
                            pay_mode: item.pay_type,
                            store_no: getCookie("user_store_id"),
                            card_type: item.card_type,
                            card_no: item.card_no,
                            coupon_no: item.coupon_no
                        });
                    });
                }
                else {
                    var billSO = [];
                }
                newBill.payments = billSO;
                newBill.reward = rewardSo;
                newBill.discounts = page.selectedBill.discounts;
                var expense = [];
                if ($$("txtExpenseName").value() != "" && $$("txtExpenseName").value() != null && $$("txtExpenseName").value() != undefined) {
                    expense.push({
                        exp_name: $$("txtExpenseName").value(),
                        amount: $$("txtExpense").value()
                    });
                }
                newBill.expenses = expense;
                //Insert Bill
                page.stockAPI.insertBill(newBill, function (data) {
                    page.currentReturnBillNo = data;
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        $$("msgPanel").show('Updating Finfacts!');
                        var round_off = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount)) + (parseFloat(newBill.tax));
                        var s_with_tax = parseFloat((parseFloat(newBill.sub_total) - parseFloat(newBill.discount))).toFixed(2);
                        var data1 = {
                            comp_id: CONTEXT.FINFACTS_COMPANY,
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            description: "POS Return-" + page.currentReturnBillNo,
                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            target_acc_id: ($$("ddlPayType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlReturnPayBillType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlReturnPayBillType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlReturnPayBillType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                            sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                            tax_amt: parseFloat(newBill.tax).toFixed(2),
                            buying_cost: buying_cost,
                            round_off: parseFloat(parseFloat(round_off) - Math.round(parseFloat(round_off))).toFixed(2),
                            key_1: page.currentReturnBillNo,
                            key_2: newBill.cust_no,
                        };
                        page.finfactsEntry.cashReturnSales(data1, function (response) {
                            $$("msgPanel").flash('Finfacts entry updated!');
                            ShowDialogBox('Message', 'Successfully returned...!', 'Ok', '', null);
                            callback(page.currentReturnBillNo);
                        });
                        if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                            var expenseData1 = {
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                                expense_acc_id: CONTEXT.ExpenseCategory,
                                amount: $$("txtExpense").value(),
                                description: "POS Income-" + page.currentBillNo,
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                key_1: page.currentBillNo,
                                key_2: newBill.cust_no,
                            };
                            if (expenseData1.amount == null || expenseData1.amount == undefined || expenseData1.amount == "" || parseFloat(expenseData1.amount == 0)) { } else {
                                page.accService.insertBillIncome(expenseData1, function (response) { });
                                callback(page.currentReturnBillNo);
                            }
                        }
                    }
                    else {
                        callback(page.currentReturnBillNo);
                    }
                    //page.returnPay(data1);
                    if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                        page.addTray(newBill);
                    }
                    if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                        var newItem = {};
                        if (page.currentCust_no != "" && page.currentCust_no != null)
                            page.customerService.getCustomerById(page.currentCust_no, function (data) {
                                page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                                    if (data2.length != 0) {
                                        page.billService.getBill(page.currentReturnBillNo, function (data1) {
                                            newItem.cust_no = data[0].cust_no;
                                            newItem.reward_plan_id = data[0].reward_plan_id;
                                            //page.customerList = data;
                                            newItem.bill_no = data1[0].bill_no;
                                            newItem.trans_date = data1[0].bill_date;
                                            newItem.points = data1[0].total / data2[0].reward_plan_point;
                                            newItem.trans_type = "Debit";
                                            newItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                            page.customerService.insertCustomerRewardt(newItem, function (data) {
                                                $$("msgPanel").flash("Points added successfully.");
                                            });
                                        });
                                    } else {
                                        $$("msgPanel").flash("Customer cannot have reward plans.");
                                    }

                                });
                            });
                    }
                    $$("msgPanel").hide();
                });
            } catch (e) {
                alert(e);
            }
        }

        //Save Bill Not Using Rest Api
        page.saveBill = function (bill_type, callback) {
            var result = "";
            if (CONTEXT.EnableTotalQtyInBill) {
                var alldataqty = page.controls.grdBill.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                    }
                    if (!temp[obj.alter_unit]) {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                    }
                }
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + "/";
                }
            }
            var buying_cost = 0;
            var cus_name = $$("txtCustomerName").selectedObject.val().split('_');
            var newBill = {
                bill_no: page.currentBillNo,
                bill_date:$$("txtBillDate").getDate(),
               // store_no: CONTEXT.store_no,
                //reg_no: CONTEXT.reg_no,
                user_no: CONTEXT.user_no,

                sub_total: page.controls.lblSubTotal.value(),
                round_off: page.controls.lblRndOff.value(),
                total: page.controls.lblTotal.value(),
                discount: page.controls.lblDiscount.value(),
                tax: page.controls.lblTax.value(),

                bill_type: bill_type,
                state_no: bill_type == "Saved" ? 100 : bill_type == "Sale" ? 200 : 300,
                sales_tax_no: page.selectedBill.sales_tax_no,
                //pay_type: $$("ddlPayType").selectedValue(),
                delivered_by: $$("ddlDeliveryBy").selectedValue(),
                expense: ($$("txtExpense").value() == "" || $$("txtExpense").value() == null) ? 0 : $$("txtExpense").value(),

                cust_name: cus_name[0],//$$("txtCustomerName").selectedObject.val(),
                mobile_no: $$("lblPhoneNo").value(),
                email_id: $$("lblEmailId").value(),
                cust_address: $$("lblAddress").value().replace(/,/g, '-'),
                gst_no: $$("lblGst").value(),
                tot_qty_words: result,
            };

            if (page.controls.hdnCustomerNo.val() != "") {
                newBill.cust_no = page.controls.hdnCustomerNo.val()
            }
            if (bill_type == "Return") {
                newBill.return_bill_no = page.selectedBill.bill_no;
            }


            var rbillItems = [];
            $(bill_type == "Return" ? page.controls.grdReturnItemSelection.selectedData() : page.controls.grdBill.allData()).each(function (i, billItem) {

                //if (billItem.qty_type == "Integer") {
                //    billItem.qty = parseInt(billItem.qty);
                //    billItem.free_qty = parseInt(billItem.free_qty);
                //}
                //else {
                //    billItem.qty = parseFloat(billItem.qty);
                //    billItem.free_qty = parseFloat(billItem.free_qty);
                //}
                var qty = billItem.free_qty;
                if (isNaN(qty))
                    qty = 0;
                if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
                    var start = billItem.qty.length - billItem.alter_unit.length;
                    if (!isNaN(start)) {
                        var lastChar = billItem.qty.substring(start, billItem.qty.length);
                        if (lastChar == billItem.alter_unit) {
                            billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
                        }
                    }
                }
                // updqty = parseFloat(parseFloat(billItem.qty) + qty).toFixed(2);
                rbillItems.push({
                    bill_no: page.currentBillNo,
                    item_no: billItem.item_no,
                    qty: (billItem.qty_type == "Integer") ? parseInt(billItem.qty) : parseFloat(billItem.qty),
                    price: billItem.price,
                    tax_class_no: billItem.tax_class_no,
                    tax_per: billItem.tax_per,
                    discount: billItem.discount,
                    total_price: billItem.total_price,
                    mrp: billItem.mrp,
                    expiry_date: billItem.expiry_date,
                    man_date: billItem.man_date,
                    batch_no: billItem.batch_no,
                    qty_stock: billItem.qty_stock,
                    free_qty: billItem.free_qty,
                    cost: billItem.cost,
                    variation_name: billItem.variation_name,
                    hsn_code: billItem.hsn_code,
                    cgst: billItem.cgst,
                    sgst: billItem.sgst,
                    igst: billItem.igst,
                    unit_identity: billItem.unit_identity,

                });
                buying_cost = buying_cost + (parseFloat(billItem.cost) * (parseFloat(billItem.qty) + parseFloat(billItem.free_qty)));
            });

            //Insert or  [update - will delete all bill items]
            page.billService.saveBill(newBill, function (currentBillNo) {
                //Insert Bill Items
                page.msgPanel.flash("POS Saved successfully.");
                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                    var expenseData = {
                        bill_no: currentBillNo,
                        exp_name: "1",
                        amount: $$("txtExpense").value()
                    }
                    if (expenseData.amount == null || expenseData.amount == undefined || expenseData.amount == "") { } else {
                        page.expenseBillService.insertBillExpense(expenseData, function () {
                        });
                    }
                }
                //page.expenseService.insertExpense(expenseData, function () {
                page.billService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

                    //Adjust stock for sale and return
                    if (bill_type == "Sale" || bill_type == "Return") {
                        var inventItems = [];
                        $(rbillItems).each(function (i, data) {
                            //var date = (data.expiry_date).split("-");
                            //var oridate = date[2] + "-" + date[1] + "-" + date[0];//+" " + "11:59:59";
                            var inventItem = {
                                item_no: data.item_no,
                                cost: data.cost,
                                qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                comments: "",
                                invent_type: bill_type == "Sale" ? "Sale" : "SaleReturn",
                                key1: currentBillNo,
                                mrp: data.mrp,
                                expiry_date: data.expiry_date,
                                man_date: data.man_date,
                                batch_no: data.batch_no,
                                variation_name: data.variation_name,
                            };
                            if (page.controls.hdnCustomerNo.val() != "" && page.controls.hdnCustomerNo.val() != undefined) {
                                inventItem.cust_no = page.controls.hdnCustomerNo.val()
                            }
                            inventItems.push(inventItem);

                        });

                        //Make inventory entry
                        page.inventoryService.insertInventoryItems(0, inventItems, function () {
                            var allBillSO = [];
                            //Get all payment details in grid
                            //$(page.controls.grdAllPayment.allData()).each(function (i, item) {
                            //    allBillSO.push({
                            //        collector_id: CONTEXT.user_no,
                            //        pay_desc: "POS Bill Payment",
                            //        amount: item.amount,
                            //        bill_id: currentBillNo,
                            //        pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            //        //pay_type: bill_type == "Sale" ? "Sale" : "Return",
                            //        pay_type: "Sale",
                            //        pay_mode: item.pay_type,
                            //        card_type: item.card_type,
                            //        card_no: item.card_no,
                            //        coupon_no: item.coupon_no
                            //    });
                            //});
                            var billSO = {
                                collector_id: CONTEXT.user_no,
                                pay_desc: "POS Bill Payment",
                                amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                bill_id: currentBillNo,
                                pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                //pay_type: bill_type == "Sale" ? "Sale" : "Return",
                                pay_type: "Sale",
                                pay_mode: page.controls.ddlPayType.selectedValue()

                            };

                            page.msgPanel.show("Updating Payments...");
                            if (page.controls.ddlPayType.selectedValue() == "Loan") {
                                //If finfacts module is enabled then make entry in finfacts.
                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    if (bill_type == "Sale") {
                                        var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                                        var data1 = {
                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            description: "POS-" + currentBillNo,
                                            target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            //sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                            sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                            tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                            buying_cost: buying_cost,
                                            round_off: $$("lblRndOff").value(),

                                            key_1: currentBillNo,
                                            key_2: $$("txtCustomerName").selectedValue(),

                                        };

                                        page.msgPanel.show("Updating Finfacts...");
                                        page.finfactsEntry.creditSales(data1, function (response) {
                                            //page.finfactsService.insertReceipt(data1, function (response) {
                                            callback(currentBillNo);
                                            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                                var expenseData1 = {
                                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                    target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                                                    expense_acc_id: CONTEXT.ExpenseCategory,
                                                    amount: $$("txtExpense").value() == ""?0:$$("txtExpense").value(),
                                                    description: "POS Expense-" + currentBillNo,
                                                    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    comp_id: CONTEXT.FINFACTS_COMPANY,
                                                    key_1: currentBillNo,
                                                    key_2: $$("txtCustomerName").selectedValue(),
                                                };
                                                page.accService.insertExpense(expenseData1, function (response) { });
                                            }
                                            page.msgPanel.show("POS payment is recorded successfully.");

                                        });
                                        /* page.accService.insertReceipt(data1, function (response) {
                                             callback(currentBillNo);
                                              page.msgPanel.show("POS payment is recorded successfully.");
 
                                         });*/
                                    }
                                    else {
                                        var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                                        var data1 = {
                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            //sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                            sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                            tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                            description: "POS Return-" + currentBillNo,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            buying_cost: buying_cost,
                                            key_1: currentBillNo,
                                            //key_2: newBill.cust_no,

                                        };
                                        page.msgPanel.show("Updating Finfacts...");
                                        page.finfactsService.creditReturnSales(data1, function (response) {
                                            //page.finfactsService.insertReturnReceipt(data1, function (response) {
                                            callback(currentBillNo);
                                            page.msgPanel.show("POS payment is returned successfully.");

                                        });
                                    }
                                } else {
                                    page.msgPanel.show("POS payment is recorded successfully.");
                                    callback(currentBillNo);
                                }
                            }
                            else {
                                page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {
                                    // page.salesService.payAllInvoiceBillSalesOrder(0, allBillSO, function (data) {
                                    //If finfacts module is enabled then make entry in finfacts.
                                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                        if (bill_type == "Sale") {
                                            var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                                            //if (page.expense == true)
                                            //    s_with_tax = parseFloat(s_with_tax) + parseFloat(expenseData.amount);
                                            var data1 = {
                                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                description: "POS-" + currentBillNo,
                                                target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                                //sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                                sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                                tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                                buying_cost: buying_cost,
                                                round_off: $$("lblRndOff").value(),

                                                key_1: currentBillNo,
                                                key_2: $$("txtCustomerName").selectedValue(),

                                            };
                                            page.msgPanel.show("Updating Finfacts...");
                                            page.finfactsEntry.cashSales(data1, function (response) {
                                                //page.finfactsService.insertReceipt(data1, function (response) {
                                                
                                                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                                    var expenseData1 = {
                                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,
                                                        expense_acc_id: CONTEXT.ExpenseCategory,
                                                        amount: newBill.expense == "" ? 0 : newBill.expense,//$$("txtExpense").value(),
                                                        description: "POS Expense-" + currentBillNo,
                                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                                        key_1: currentBillNo,
                                                        key_2: $$("txtCustomerName").selectedValue(),
                                                    };
                                                    page.accService.insertExpense(expenseData1, function (response) { });
                                                }
                                                page.msgPanel.show("POS payment is recorded successfully.");
                                            });
                                            /* page.accService.insertReceipt(data1, function (response) {
                                                 callback(currentBillNo);
                                                  page.msgPanel.show("POS payment is recorded successfully.");
     
                                             });*/
                                        }
                                        else {
                                            var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                                            var data1 = {
                                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                                //sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                                sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                                tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                                description: "POS Return-" + currentBillNo,
                                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                key_1: currentBillNo,
                                                //key_2: newBill.cust_no,

                                            };
                                            page.msgPanel.show("Updating Finfacts...");
                                            page.finfactsService.cashReturnSales(data1, function (response) {
                                                //page.finfactsService.insertReturnReceipt(data1, function (response) {
                                                callback(currentBillNo);
                                                page.msgPanel.show("POS payment is returned successfully.");

                                            });
                                        }
                                        callback(currentBillNo);
                                    } else {
                                        page.msgPanel.show("POS payment is recorded successfully.");
                                        callback(currentBillNo);
                                    }

                                });
                            }
                        });

                    }
                    else {
                        // page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
                        callback();
                    }
                    //Insert Bill Discount
                    page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);

                });
                // callback();
                //});
            });

        }
        page.saveRewardBill = function (bill_type, callback) {
            var result = "";
            if (CONTEXT.EnableTotalQtyInBill) {
                var alldataqty = page.controls.grdBill.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                    }
                    if (!temp[obj.alter_unit]) {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                    }
                }
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + "/";
                }
            }
            var cus_name = $$("txtCustomerName").selectedObject.val().split('_');
            var newBill = {
                bill_no: page.currentBillNo,
                bill_date: $$("txtBillDate").getDate(),
                store_no: CONTEXT.store_no,
                reg_no: CONTEXT.reg_no,
                user_no: CONTEXT.user_no,

                sub_total: page.controls.lblSubTotal.value(),
                round_off: page.controls.lblRndOff.value(),
                total: page.controls.lblTotal.value(),
                discount: page.controls.lblDiscount.value(),
                tax: page.controls.lblTax.value(),

                bill_type: bill_type,
                state_no: bill_type == "Saved" ? 100 : bill_type == "Sale" ? 200 : 300,
                sales_tax_no: page.selectedBill.sales_tax_no,
                //pay_type: $$("ddlPayType").selectedValue(),
                delivered_by: $$("ddlDeliveryBy").selectedValue(),
                expense: $$("txtExpense").value(),
                cust_name: cus_name[0],//$$("txtCustomerName").selectedObject.val(),
                mobile_no: $$("lblPhoneNo").value(),
                email_id: $$("lblEmailId").value(),
                cust_address: $$("lblAddress").value().replace(/,/g, '-'),
                gst_no: $$("lblGst").value(),
                tot_qty_words: result,
            };

            if (page.controls.hdnCustomerNo.val() != "") {
                newBill.cust_no = page.controls.hdnCustomerNo.val()
            }
            if (bill_type == "Return") {
                newBill.return_bill_no = page.selectedBill.bill_no;
            }


            var rbillItems = [];
            $(bill_type == "Return" ? page.controls.grdReturnItemSelection.selectedData() : page.controls.grdBill.allData()).each(function (i, billItem) {

                if (billItem.qty_type == "Integer") {
                    billItem.qty = parseInt(billItem.qty);
                    billItem.free_qty = parseInt(billItem.free_qty);
                }
                else {
                    billItem.qty = parseFloat(billItem.qty);
                    billItem.free_qty = parseFloat(billItem.free_qty);
                }
                var qty = billItem.free_qty;
                if (isNaN(qty))
                    qty = 0;
                // updqty = parseFloat(parseFloat(billItem.qty) + qty).toFixed(2);
                rbillItems.push({
                    bill_no: page.currentBillNo,
                    item_no: billItem.item_no,
                    qty: billItem.qty,
                    price: billItem.price,
                    tax_class_no: billItem.tax_class_no,
                    tax_per: billItem.tax_per,
                    discount: billItem.discount,
                    total_price: billItem.total_price,
                    mrp: billItem.mrp,
                    expiry_date: billItem.expiry_date,
                    man_date: billItem.man_date,
                    batch_no: billItem.batch_no,
                    qty_stock: billItem.qty_stock,
                    free_qty: billItem.free_qty,
                    cost: billItem.cost,
                    variation_name: billItem.variation_name,
                    hsn_code: billItem.hsn_code,
                    cgst: billItem.cgst,
                    sgst: billItem.sgst,
                    igst: billItem.igst,
                    unit_identity: billItem.unit_identity,
                });
            });

            //Insert or  [update - will delete all bill items]
            page.billService.saveBill(newBill, function (currentBillNo) {
                //Insert Bill Items
                page.msgPanel.flash("POS Saved successfully.");
                page.billService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

                    //Adjust stock for sale and return
                    if (bill_type == "Sale" || bill_type == "Return") {
                        var inventItems = [];
                        $(rbillItems).each(function (i, data) {
                            //var date = (data.expiry_date).split("-");
                            //var oridate = date[2] + "-" + date[1] + "-" + date[0];//+" " + "11:59:59";
                            var inventItem = {
                                item_no: data.item_no,
                                cost: data.cost,
                                qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                comments: "",
                                invent_type: bill_type == "Sale" ? "Sale" : "SaleReturn",
                                key1: currentBillNo,
                                mrp: data.mrp,
                                expiry_date: data.expiry_date,
                                man_date: data.man_date,
                                batch_no: data.batch_no,
                                variation_name: data.variation_name
                            };
                            if (page.controls.hdnCustomerNo.val() != "" && page.controls.hdnCustomerNo.val() != undefined) {
                                inventItem.vendor_no = page.controls.hdnCustomerNo.val()
                            }
                            inventItems.push(inventItem);

                        });

                        //Make inventory entry
                        page.inventoryService.insertInventoryItems(0, inventItems, function () {
                            var allBillSO = [];
                            var billSO = {
                                collector_id: CONTEXT.user_no,
                                pay_desc: "POS Bill Payment",
                                amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                bill_id: currentBillNo,
                                pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                //pay_type: bill_type == "Sale" ? "Sale" : "Return",
                                pay_type: "Sale",
                                pay_mode: page.controls.ddlPayType.selectedValue()

                            };

                            var reward_data = {
                                cust_no: page.controls.hdnCustomerNo.val(),
                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                reward_plan_id: page.plan_id,
                                points: parseFloat(page.controls.lblTotal.value()) * 4,
                                trans_type: "Debit",
                                setteled_amount: page.controls.lblTotal.value()
                            }
                            page.customerService.insertCustomerRewardt(reward_data, function (reward_data) {
                                page.msgPanel.show("Updating Payments...");
                                page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {
                                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                        var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                                        //if (bill_type == "Sale") {
                                        var data1 = {
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            target_acc_id: (billSO.pay_mode == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (billSO.pay_mode == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (billSO.pay_mode == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (billSO.pay_mode == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            //amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                            sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                            sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                            tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                            description: "POS-" + currentBillNo,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            key_1: currentBillNo,
                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                        };
                                        page.msgPanel.show("Updating Finfacts...");
                                        page.finfactsEntry.cashSales(data1, function (response) {
                                            //page.finfactsService.insertReceiptForPoints(data1, function (response) {
                                            callback(currentBillNo);
                                            page.msgPanel.show("POS payment is recorded successfully.");

                                        });
                                        //}
                                        //else {
                                        //    var data1 = {
                                        //        per_id: CONTEXT.PeriodId,
                                        //        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        //        amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                        //        description: "POS Return-" + currentBillNo,
                                        //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        //        key_1: currentBillNo,
                                        //        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        //    };
                                        //    page.msgPanel.show("Updating Finfacts...");
                                        //    page.finfactsService.insertReturnReceipt(data1, function (response) {
                                        //        callback(currentBillNo);
                                        //        page.msgPanel.show("POS payment is returned successfully.");

                                        //    });
                                        //}
                                    } else {
                                        page.msgPanel.show("POS payment is recorded successfully.");
                                        callback(currentBillNo);
                                    }

                                });
                            });


                        });

                    }
                    else {
                        callback();
                    }
                    page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);

                });
            });
        }
        page.payMixedBill = function (bill_type, callback) {
            var result = "";
            if (CONTEXT.EnableTotalQtyInBill) {
                var alldataqty = page.controls.grdBill.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                    }
                    if (!temp[obj.alter_unit]) {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                    }
                }
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + "/";
                }
            }
            var buying_cost = 0;
            var cus_name = $$("txtCustomerName").selectedObject.val().split('_');
            var newBill = {
                bill_no: page.currentBillNo,
                bill_date: $$("txtBillDate").getDate(),
                store_no: CONTEXT.store_no,
                reg_no: CONTEXT.reg_no,
                user_no: CONTEXT.user_no,

                sub_total: page.controls.lblSubTotal.value(),
                round_off: page.controls.lblRndOff.value(),
                total: page.controls.lblTotal.value(),
                discount: page.controls.lblDiscount.value(),
                tax: page.controls.lblTax.value(),

                bill_type: bill_type,
                state_no: bill_type == "Saved" ? 100 : bill_type == "Sale" ? 200 : 300,
                sales_tax_no: page.selectedBill.sales_tax_no,
                //pay_type: $$("ddlPayType").selectedValue(),
                delivered_by: $$("ddlDeliveryBy").selectedValue(),
                expense: $$("txtExpense").value(),
                cust_name: cus_name[0],//$$("txtCustomerName").selectedObject.val(),
                mobile_no: $$("lblPhoneNo").value(),
                email_id: $$("lblEmailId").value(),
                cust_address: $$("lblAddress").value().replace(/,/g, '-'),
                gst_no: $$("lblGst").value(),
                tot_qty_words: result,
            };

            if (page.controls.hdnCustomerNo.val() != "") {
                newBill.cust_no = page.controls.hdnCustomerNo.val()
            }
            if (bill_type == "Return") {
                newBill.return_bill_no = page.selectedBill.bill_no;
            }


            var rbillItems = [];
            $(bill_type == "Return" ? page.controls.grdReturnItemSelection.selectedData() : page.controls.grdBill.allData()).each(function (i, billItem) {

                if (billItem.qty_type == "Integer") {
                    billItem.qty = parseInt(billItem.qty);
                    billItem.free_qty = parseInt(billItem.free_qty);
                }
                else {
                    billItem.qty = parseFloat(billItem.qty);
                    billItem.free_qty = parseFloat(billItem.free_qty);
                }
                var qty = billItem.free_qty;
                if (isNaN(qty))
                    qty = 0;
                // updqty = parseFloat(parseFloat(billItem.qty) + qty).toFixed(2);
                rbillItems.push({
                    bill_no: page.currentBillNo,
                    item_no: billItem.item_no,
                    qty: billItem.qty,
                    price: billItem.price,
                    tax_class_no: billItem.tax_class_no,
                    tax_per: billItem.tax_per,
                    discount: billItem.discount,
                    total_price: billItem.total_price,
                    mrp: billItem.mrp,
                    expiry_date: billItem.expiry_date,
                    man_date: billItem.man_date,
                    batch_no: billItem.batch_no,
                    qty_stock: billItem.qty_stock,
                    free_qty: billItem.free_qty,
                    cost: billItem.cost,
                    variation_name: billItem.variation_name,
                    hsn_code: billItem.hsn_code,
                    cgst: billItem.cgst,
                    sgst: billItem.sgst,
                    igst: billItem.igst,
                    unit_identity: billItem.unit_identity,
                });
                buying_cost = buying_cost + (parseFloat(billItem.cost) * (parseFloat(billItem.qty) + parseFloat(billItem.free_qty)));
            });

            //Insert or  [update - will delete all bill items]
            page.billService.saveBill(newBill, function (currentBillNo) {
                //Insert Bill Items
                page.msgPanel.flash("POS Saved successfully.");
                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                    var expenseData = {
                        bill_no: currentBillNo,
                        exp_name: "1",
                        amount: $$("txtExpense").value()
                    }
                    page.expenseBillService.insertBillExpense(expenseData, function () {
                    });
                }
                page.billService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

                    //Adjust stock for sale and return
                    if (bill_type == "Sale" || bill_type == "Return") {
                        var inventItems = [];
                        $(rbillItems).each(function (i, data) {
                            //var date = (data.expiry_date).split("-");
                            //var oridate = date[2] + "-" + date[1] + "-" + date[0];//+" " + "11:59:59";
                            var inventItem = {
                                item_no: data.item_no,
                                cost: data.cost,
                                qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                comments: "",
                                invent_type: bill_type == "Sale" ? "Sale" : "SaleReturn",
                                key1: currentBillNo,
                                mrp: data.mrp,
                                expiry_date: data.expiry_date,
                                man_date: data.man_date,
                                batch_no: data.batch_no,
                                variation_name: data.variation_name
                            };
                            if (page.controls.hdnCustomerNo.val() != "" && page.controls.hdnCustomerNo.val() != undefined) {
                                inventItem.vendor_no = page.controls.hdnCustomerNo.val()
                            }
                            inventItems.push(inventItem);

                        });

                        //Make inventory entry
                        page.inventoryService.insertInventoryItems(0, inventItems, function () {
                            var allBillSO = [];
                            var reward_amount = 0;

                            if (($$("ddlPaymentType").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                                throw "Card no should be mantatory";
                            if (($$("ddlPaymentType").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                                throw "Coupon no should be mantatory";
                            var data = {
                                pay_type: $$("ddlPaymentType").selectedValue(),
                                card_type: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Coupon") ? "" : $$("ddlCardType").selectedValue(),
                                card_no: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Coupon") ? "" : $$("txtCardNo").val(),
                                coupon_no: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Card") ? "" : $$("txtCouponNo").val(),
                                amount: $$("txtAmount").val()
                            }
                            //Get all payment details in grid
                            $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                                if (item.points != "") {
                                    reward_amount = parseFloat(reward_amount) + parseFloat(item.amount);
                                }
                                allBillSO.push({
                                    collector_id: CONTEXT.user_no,
                                    pay_desc: "POS Bill Payment",
                                    amount: item.amount,
                                    bill_id: currentBillNo,
                                    pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                    //pay_type: bill_type == "Sale" ? "Sale" : "Return",
                                    pay_type: "Sale",
                                    pay_mode: item.pay_type,
                                    card_type: item.card_type,
                                    card_no: item.card_no,
                                    coupon_no: item.coupon_no
                                });

                            });
                            page.msgPanel.show("Updating Payments...");
                            //page.salesService.payInvoiceBillSalesOrder(billSO, function (data) {
                            page.salesService.payAllInvoiceBillSalesOrder(0, allBillSO, function (data) {
                                //If finfacts module is enabled then make entry in finfacts.
                                //var tax_Cal = (parseFloat(page.controls.lblTax.value()) / (parseFloat(page.controls.lblTotal.value())));

                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                    if (bill_type == "Sale") {
                                        $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                                            var grdAllPayment_length = page.controls.grdAllPayment.allData().length;
                                            var discount = parseFloat(parseFloat(page.controls.lblDiscount.value()) / parseFloat(grdAllPayment_length)).toFixed(2);
                                            //var tax_amt = parseFloat(item.amount) * parseFloat(tax_Cal);
                                            var tax_amt = parseFloat(parseFloat(page.controls.lblTax.value()) / parseFloat(grdAllPayment_length)).toFixed(2);

                                            //var s_with_out_tax = (parseFloat(item.amount) - parseFloat(tax_amt)); //- parseFloat(page.controls.lblRndOff.value());

                                            var rndOff = parseFloat($$("lblRndOff").value() / parseFloat(grdAllPayment_length)).toFixed(2);

                                            var sub_total = (parseFloat(parseFloat(item.amount) - parseFloat(tax_amt)) + (parseFloat(rndOff) + parseFloat(discount)));
                                            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                                var expense_amt = parseFloat($$("txtExpense").value() / parseFloat(grdAllPayment_length)).toFixed(2);
                                                sub_total = parseFloat(sub_total) - parseFloat(expense_amt);
                                            }
                                            //s_with_out_tax = (parseFloat(sub_total) + parseFloat(expense_amt) + parseFloat(tax_amt)) - (parseFloat(rndOff) - parseFloat(discount))
                                            s_with_out_tax = parseFloat((parseFloat(sub_total) - parseFloat(discount)));//- parseFloat(rndOff)).toFixed(2);
                                            var data1 = {
                                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                description: "POS-" + currentBillNo,
                                                target_acc_id: (item.card_type == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (item.card_type == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (item.card_type == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (item.card_type == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                                sales_with_out_tax: parseFloat(s_with_out_tax).toFixed(2),
                                                tax_amt: parseFloat(tax_amt).toFixed(2),
                                                buying_cost: buying_cost,
                                                round_off: rndOff,
                                                //target_acc_id: ($$("ddlPaymentType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPaymentType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTBank : ($$("ddlPaymentType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPaymentType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,

                                                //amount: reward_amount,
                                                //sales_with_tax: parseFloat(item.amount).toFixed(2),



                                                key_1: currentBillNo,
                                                key_2: $$("txtCustomerName").selectedValue(),

                                            };
                                            //page.finfactsService.insertReceiptForPoints(data2, function (response) {
                                            page.finfactsEntry.cashSales(data1, function (response) {
                                                callback(currentBillNo);
                                                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                                    var expenseData1 = {
                                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,
                                                        expense_acc_id: CONTEXT.ExpenseCategory,
                                                        amount: newBill.expense == ""?0:newBill.expense,//expense_amt,
                                                        description: "POS Expense-" + currentBillNo,
                                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                                        key_1: currentBillNo,
                                                        key_2: $$("txtCustomerName").selectedValue(),
                                                    };
                                                    page.accService.insertExpense(expenseData1, function (response) { });
                                                }
                                            });
                                        });
                                        //if (reward_amount != 0) {
                                        //    var tax_amt = parseFloat(tax_Cal) * parseFloat(reward_amount);
                                        //    var s_with_out_tax = (parseFloat(reward_amount) - parseFloat(tax_amt)); //- parseFloat(page.controls.lblRndOff.value());
                                        //    var data2 = {
                                        //        per_id: CONTEXT.PeriodId,

                                        //        //target_acc_id: ($$("ddlPaymentType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPaymentType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTBank : ($$("ddlPaymentType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPaymentType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        //        target_acc_id: (data.card_type == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (data.card_type == "Card") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTBank : (data.card_type == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (data.card_type == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        //        //amount: reward_amount,
                                        //        sales_with_tax: parseFloat(reward_amount).toFixed(2),
                                        //        sales_with_out_tax: parseFloat(s_with_out_tax).toFixed(2),
                                        //        tax_amt: parseFloat(tax_amt).toFixed(2),
                                        //        description: "POS-" + currentBillNo,
                                        //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        //        key_1: currentBillNo,
                                        //        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        //    };
                                        //    //page.finfactsService.insertReceiptForPoints(data2, function (response) {
                                        //    page.finfactsEntry.cashSales(data2, function (response) {
                                        //        callback(currentBillNo);

                                        //    });
                                        //}
                                        //if (parseInt(reward_amount) != parseInt(page.controls.lblTotal.value())) {
                                        //    var tot_amt = parseFloat(page.controls.lblTotal.value()) - parseFloat(reward_amount);
                                        //    var tax_amt = parseFloat(tax_Cal) * parseFloat(tot_amt);
                                        //    var s_with_out_tax = (parseFloat(tot_amt) - parseFloat(tax_amt));//- parseFloat(page.controls.lblRndOff.value());
                                        //    var data1 = {
                                        //        per_id: CONTEXT.PeriodId,
                                        //        target_acc_id: (data.card_type == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (data.card_type == "Card") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTBank : (data.card_type == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (data.card_type == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        //        //amount: parseFloat(page.controls.lblTotal.value()) - parseFloat(reward_amount),
                                        //        sales_with_tax: parseFloat(tot_amt).toFixed(2),
                                        //        sales_with_out_tax: parseFloat(s_with_out_tax).toFixed(2),
                                        //        tax_amt: parseFloat(tax_amt).toFixed(2),
                                        //        description: "POS-" + currentBillNo,
                                        //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        //        key_1: currentBillNo,
                                        //        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        //    };
                                        //    page.msgPanel.show("Updating Finfacts...");
                                        //    page.finfactsEntry.cashSales(data1, function (response) {
                                        //    //page.finfactsService.insertReceipt(data1, function (response) {
                                        //        callback(currentBillNo);
                                        //        page.msgPanel.show("POS payment is recorded successfully.");

                                        //    });
                                        //}

                                    }
                                    else {
                                        var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                                        var data1 = {
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            target_acc_id: ($$("ddlPaymentType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPaymentType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPaymentType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPaymentType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                            //sales_with_tax: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                            //sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                            //tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                            description: "POS Return-" + currentBillNo,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            key_1: currentBillNo,
                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                        };
                                        page.msgPanel.show("Updating Finfacts...");
                                        //page.finfactsEntry.cashReturnSales(data1, function (response) {
                                        page.finfactsService.insertReturnReceipt(data1, function (response) {
                                            callback(currentBillNo);
                                            page.msgPanel.show("POS payment is returned successfully.");

                                        });
                                    }
                                } else {
                                    page.msgPanel.show("POS payment is recorded successfully.");
                                    callback(currentBillNo);
                                }
                            });
                        });
                    }
                    else {
                        // page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
                        callback(currentBillNo);
                    }
                    //Insert Bill Discount
                    page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);

                });
            });
        }
        page.addpoints = function (billno) {
            var newItem = {};
            var cust_no = page.controls.hdnCustomerNo.val();
            if (cust_no != "")
                page.customerService.getCustomerById(cust_no, function (data) {
                    page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                        if (data2.length != 0) {
                            page.billService.getBill(billno, function (data1) {
                                newItem.cust_no = data[0].cust_no;
                                newItem.reward_plan_id = data[0].reward_plan_id;
                                newItem.bill_no = data1[0].bill_no;
                                newItem.trans_date = data1[0].bill_date;
                                newItem.points = data1[0].total / data2[0].reward_plan_point;
                                newItem.trans_type = "Credit";
                                newItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                page.customerService.insertCustomerRewardt(newItem, function (data) {
                                    page.msgPanel.show("Points added successfully.");
                                });
                            });
                        } else {
                            page.msgPanel.show("Customer cannot have reward plans.");
                        }

                    });
                });

        }

        page.addTray = function (currentBillNo) {
            try {
                var trayItems = [];
                $(page.controls.grdBill.allData()).each(function (i, item) {
                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null)
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Customer Return",
                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                cust_id: page.controls.txtCustomerName.selectedValue(),
                                bill_id: currentBillNo
                    });
                });
                page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                });

            } catch (e) {
                page.msgPanel.flash(e);
            }

        }

        page.interface.createBill = function () {
            //if (CONTEXT.showFree == true) {
            //    $("#free").show();
            //} else {
            //    $("#free").hide();
            //}

            $$("btnSave").show();
            //New Bill
            var newBill = {
                cust_no: "",
                cust_name: "",
                phone_no: "",
                address: "",

                sub_total: 0,
                total: 0,
                discount: 0,
                tax: 0,

                sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                billItems: [],
                discounts: [],
                bill_no: null,
                state_text: "NewBill"
            };


            //  page.msgPanel.show("Generating a new bill...");
            page.loadSelectedBill(newBill,false, function () {
                //Get the current tax structure for sales sax selected
                //  page.msgPanel.show("Loading Tax Details...");
                page.loadSalesTaxClasses(newBill.sales_tax_no, function (sales_tax_class) {
                    newBill.sales_tax_class = sales_tax_class;

                    //  page.msgPanel.show("Calculating Bill Summary...");
                    page.calculate();
                    setTimeout(function () { $$("txtItemSearch").selectedObject.focus(); }, 100);


                    // page.msgPanel.show("New Bill is ready to start...");
                });

            });


        }

        page.interface.returnBill = function (billNo) {
            var currentBillNo = billNo;  //page.currentBillNo;
            page.currentBillNo = billNo;
            //if (typeof currentBillNo == "undefined" || !currentBillNo ) {
            //    currentBillNo = page.controls.grdSales.selectedData()[0].bill_no;

            //}
            page.billService.getBill(currentBillNo, function (data) {
                var bill = data[0];
                var saleBill = {
                    cust_no: bill.cust_no,
                    cust_name: bill.cust_name,
                    phone_no: bill.phone_no,
                    address: bill.address,
                    email: bill.email,

                    sub_total: 0,
                    total: 0,
                    discount: 0,
                    tax: 0,

                    sales_tax_no: -1,
                    billItems: [],
                    discounts: [],
                    bill_no: currentBillNo,
                    state_text: "NewReturn"
                };

                page.billService.getBillItem(saleBill.bill_no, function (billItems) {
                    saleBill.billItems = billItems;
                    page.loadSelectedBill(saleBill,false);
                });
            });
            page.billService.getBillByNo(page.currentBillNo, function (data) {
                $$("ddlPayType").selectedValue(data[0].pay_type);
            });
        }

        page.interface.viewBill = function (billNo,bill) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            if (CONTEXT.RESTAPI) {
                page.billService.getReturnedPOSBillByNo(bill.bill_no, function (rdata) {
                    var openBill = {
                        cust_no: bill.cust_no,
                        cust_name: bill.cust_name,
                        email: bill.email,
                        phone_no: bill.mobile_no,
                        address: bill.cust_address.replace(/-/g, ","),
                        sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,
                        sub_total: bill.sub_total,
                        round_off: 0,
                        total: bill.total,
                        discount: bill.discount,
                        tax: 0,
                        bill_no: bill.bill_no,
                        bill_date: bill.bill_date,
                        state_text: bill.state_text,
                        gst_no: bill.gst_no,
                        expenses: 0,
                        //sales_executive: bill.delivered_by,
                        exp_name: rdata[0].exp_name,
                        exp_amount: rdata[0].exp_amount
                    };
            openBill.billItems = rdata;
                page.msgPanel.show("Getting Bill Discounts...");
                    page.msgPanel.show("Loading data...");
                    page.loadSelectedBill(openBill, function () {
                        if (openBill.state_text == "Sale" || openBill.state_text == "SaleAdjustment") {
                            page.billService.getBillReturn(openBill.bill_no, function (data) {
                                if (data.length > 0) {
                                    page.controls.grdBillReturn.display("");
                                    page.controls.grdBillReturn.dataBind(data);
                                }
                            });
                            page.calculate();
                        }
                        page.billService.getBillByNo(page.currentBillNo, function (data) {
                            $$("ddlPayType").selectedValue(data[0].pay_type);
                        });
                        page.msgPanel.flash("Bill is opened...");
                    });
                });
            }
        }
        page.events.page_load = function () {


            //$$("chkShowStock").prop('checked', true);
            //CONTEXT.POSShowStock = true;
            $("[controlid=txtItemSearch]").bind("keypress", function (e) {
                // access the clipboard using the api
                var self = this;
                setTimeout(function () {
                    var str = $(self).val();
                    if (str.startsWith("00")) {
                        $(self).val(parseInt(str.substring(0, str.length - 1)));
                       // $(self).keydown();
                    }
                }, 300)
            });

            page.billService.getActiveDeliveyBoy(function (data) {
                page.controls.ddlDeliveryBy.dataBind(data, "sale_executive_no", "sale_executive_name", "Select");
            })

            page.billService.getAllDiscount(function (data) {
                page.controls.ddlDiscount.dataBind(data, "disc_no", "disc_name", "None");
            });
            page.billService.getAllItemDiscount(function (data) {
                page.controls.ddlItemDiscount.dataBind(data, "disc_no", "disc_name", "None");
            });
            page.billService.getAllSalestax(function (data) {
                page.controls.ddlSalesTax.dataBind(data, "sales_tax_no", "sales_tax_name", "None");
            });

            $$("lblTaxLabel").selectedObject.click(function () {
                if (CONTEXT.ENABLE_TAX_CHANGES) {
                    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                    page.controls.pnlTaxPopup.open();
                    page.controls.pnlTaxPopup.title("Tax Selection");
                    page.controls.pnlTaxPopup.width(600);
                    page.controls.pnlTaxPopup.height(150);
                    if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {
                        $$("btnTaxOK").show();
                    }
                    else {
                        $$("btnTaxOK").hide();
                    }
                }else{}
            });

            $$("lblDiscountLabel").selectedObject.click(function () {
                page.controls.pnlDiscountPopup.open();
                page.controls.pnlDiscountPopup.title("Discount(s) Applied For Bill");
                page.controls.pnlDiscountPopup.width(1000);
                page.controls.pnlDiscountPopup.height(400);


                page.controls.grdDiscount.width("100%");
                page.controls.grdDiscount.height("220px");
                page.controls.grdDiscount.setTemplate({
                    selection: "Single",

                    columns: [
                        { 'name': "Disc No", 'width': "100px", 'dataField': "disc_no" },
                        { 'name': "Disc Name", 'width': "200px", 'dataField': "disc_name" },
                        { 'name': "Disc Type", 'width': "150px", 'dataField': "disc_type" },
                        { 'name': "Disc Value", 'width': "150px", 'dataField': "disc_value" },
                         { 'name': "Item No", 'width': "150px", 'dataField': "item_no" },

                    ]
                });
                page.controls.grdDiscount.dataBind(page.selectedBill.discounts);
                if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {

                    $$("btnDiscountOK").show();
                    $$("btnDiscountRemove").show();


                }
                else {

                    $$("btnDiscountOK").hide();
                    $$("btnDiscountRemove").hide();

                }
            });


            page.view.UIState("New");

            ////Load all sales
            //page.billService.getAllBill(function (data) {
            //    page.view.salesList(data);
            //});

            page.customerService.getCustomerByAll("%", function (data) {
                page.customerList = data;
            });


            //Customer autocomplete
            page.controls.txtCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                    // page.customerService.getCustomerByAll(term, callback);
                }
            });
            page.controls.txtCustomerName.select(function (item) {
                //page.controls.btnAddCustomer.hide();
                if (item == null)
                    item = { cust_no: "", phone_no: "", address: "" };
                page.controls.hdnCustomerNo.val(item.cust_no);
                page.controls.lblPhoneNo.value(item.phone_no);
                page.controls.lblEmailId.value((typeof item.email=="undefined") ? "" : item.email);
                page.controls.lblGst.value((typeof item.gst_no == "undefined") ? "" : item.gst_no);
                page.controls.lblAddress.value(item.address);
                page.plan_id = item.reward_plan_id;
                page.controls.txtItemSearch.selectedObject.focus();

                page.customerService.getTotalPoint(item.cust_no, function (data, callback) {
                    $$("lblAvalablePoints").value(data[0].points);

                });

            });
            page.controls.txtCustomerName.noRecordFound(function (txt) {
                txt.val("");

                page.controls.btnAddCustomer.show();
                page.controls.hdnCustomerNo.val("");
                page.controls.lblPhoneNo.value("");
                page.controls.lblAddress.value("");
                page.controls.lblAvalablePoints.value("");
                page.controls.lblGst.value("");
                page.controls.txtCustomerName.selectedObject.focus();
            });

            //Item autocomplete
            page.controls.txtItemSearch.itemTemplate = function (item) {
                if (parseInt(item.cost) == 0) {
                    return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>    <span style='margin:right:30px'><span> [Price:" + item.price + "]-Free</a>";
                } else {
                    return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>    <span style='margin:right:30px'><span> [Price:" + item.price + "]</a>";
                }
            }
            page.controls.txtItemSearch.dataBind({
                getData: function (term, callback) {
                    var arr = jQuery.grep(page.productList, function (item, i) {
                        if (item.item_name.toUpperCase().indexOf(term.toUpperCase()) > -1 || item.item_no.toUpperCase().indexOf(term.toUpperCase()) > -1 || (item.barcode == null ? true : item.barcode.toUpperCase().indexOf(term.toUpperCase()) > -1)) {
                            return (item);
                        }
                        //    return item.item_name.toUpperCase().indexOf(term.toUpperCase()) > -1;
                    });
                    callback(arr.slice(0, 50));
                   // callback(arr);
                    // callback(page.productList);
                }
            });
            page.controls.txtItemSearch.select(function (item) {
                var tax_per = 0, cgst = 0, sgst = 0, igst = 0;
                if (item != null) {
                    if (typeof item.item_no != "undefined") {

                        //populate discount
                        page.itemService.getItemDiscountAutocomplete(item.item_no, function (data) {
                            if (item.tax_class_no == null || item.tax_class_no == "" || item.tax_class_no == undefined)
                                item.tax_class_no = -1;
                            $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                                if (item.tax_class_no == tax_data.tax_class_no) {
                                    tax_per = tax_data.tax_per;
                                    cgst = tax_data.cgst;
                                    sgst = tax_data.sgst;
                                    igst = tax_data.igst;
                                }
                            });
                          //  page.taxclassService.getTaxByItem(page.selectedBill.sales_tax_no, item.tax_class_no, function (taxData) {
                                if (data != '' && data != undefined) {
                                    $(data).each(function (i, ditem) {
                                        page.selectedBill.discounts.push({
                                            disc_no: ditem.disc_no,
                                            disc_type: ditem.disc_type,
                                            disc_name: ditem.disc_name,
                                            disc_value: ditem.disc_value,
                                            item_no: item.item_no
                                        });
                                    });

                                }
                                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                    var monthex;
                                    var yearex
                                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                                        monthex = item.expiry_date.substring(3, 5);
                                        yearex = item.expiry_date.substring(6, 10);
                                        item.expiry_date = monthex + "-" + yearex;
                                    }
                                    if (item.man_date != null && item.man_date != undefined && item.man_date != "") {
                                        monthex = item.man_date.substring(3, 5);
                                        yearex = item.man_date.substring(6, 10);
                                        item.man_date = monthex + "-" + yearex;
                                    }
                                }
                                var newitem = {
                                    item_no: item.item_no,
                                    item_name: item.item_name,
                                    discount: 0,
                                    //tax: item.tax,
                                    tax: tax_per,
                                    tax_per: tax_per,
                                    tax_class_no: item.tax_class_no,
                                    qty: 1,
                                    temp_qty: 1,
                                    //free_item:item.free_item,
                                    qty_const: item.qty_stock,
                                    free_qty: 0,
                                    qty_stock: item.qty_stock,
                                    // price: (item.tax_inclusive == "0") ? parseFloat(item.price).toFixed(2) : parseFloat(parseFloat(item.price) / ((100 + parseFloat(item.tax)) / 100)).toFixed(4),
                                    price: item.price,
                                    //price: item.price,
                                    unit: item.unit,
                                    mrp: item.mrp,
                                    expiry_date: item.expiry_date,
                                    batch_no: item.batch_no,

                                    total_price: item.price * 1 - item.tax * item.price * 1,
                                    tray_id: item.tray_no,
                                    qty_type: item.qty_type,
                                    cost: item.cost == null ? 0 : parseFloat(item.cost).toFixed(2),
                                    tax_inclusive: item.tax_inclusive,
                                    variation_name: item.variation_name,
                                    var_no: item.var_no,
                                    hsn_code: item.hsn_code,
                                    cgst: cgst,//parseFloat(item.cgst).toFixed(2),
                                    sgst: sgst,//parseFloat(item.sgst).toFixed(2),
                                    igst: igst,//parseFloat(item.igst).toFixed(2),
                                    cot_of_good: item.cost,
                                    man_date: item.man_date,
                                    alter_unit: item.alter_unit,
                                    alter_unit_fact: item.alter_unit_fact,
                                    unit_identity: 0,
                                    expiry_alert_days: item.expiry_alert_days,
                                    price_no:item.price_no==null?"0":item.price_no
                                };

                                //Populate 
                                var rows = page.controls.grdBill.getRow({
                                    //item_no: newitem.item_no
                                    variation_name: item.variation_name
                                });


                                if (rows.length == 0) {
                                    page.controls.grdBill.createRow(newitem);
                                    page.controls.grdBill.edit(true);
                                    rows = page.controls.grdBill.getRow({
                                        //item_no: newitem.item_no
                                        variation_name: item.variation_name
                                    });
                                    rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                                } else {
                                    var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                    //txtQty.val(parseInt(txtQty.val()) + 1);
                                    txtQty.val(parseFloat(txtQty.val()) + 1);
                                    txtQty.trigger('change');
                                    txtQty.focus();
                                }
                                page.controls.txtItemSearch.customText("");
                                page.calculate();
                         //   })
                            
                        });
                    }
                }

            });
            if (CONTEXT.ENABLE_EMAIL == "true") {
                $$("btnSendMail").show();
            } else {
                $$("btnSendMail").hide();
            }
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                $$("btnSendSMS").show();
            } else {
                $$("btnSendSMS").hide();
            }
            if (CONTEXT.isSalesExecutive == "true") {
                $$("pnlSalesExecutive").show();
            }
            else {
                $$("pnlSalesExecutive").hide();
            }

            //$$("ddlPaymentType").selectionChange(function () {
            //    if ($$("ddlPaymentType").selectedValue() == "Cash") {
            //        $$("pnlCard").hide();
            //        $$("pnlCoupon").hide();
            //    }
            //    else if ($$("ddlPaymentType").selectedValue() == "Coupon") {
            //        $$("pnlCard").hide();
            //        $$("pnlCoupon").show();
            //    }
            //    else if ($$("ddlPaymentType").selectedValue() == "Card") {
            //        $$("pnlCard").show();
            //        $$("pnlCoupon").hide();
            //    }
            //    else {
            //        $$("pnlCard").hide();
            //        $$("pnlCoupon").hide();
            //    }
            //});

            page.view.selectedPayment([]);

            //page.billService.getAllBillTax(function (data) {
            //    $(data).each(function (i, item) {
            //        page.tax.push({
            //            sales_tax_no: item.sales_tax_no,
            //            sales_tax_name: item.sales_tax_name,
            //            sales_tax_level: item.sales_tax_level,
            //            sales_tax_value: item.sales_tax_value
            //        })
            //    })
            //    page.controls.grdTax.width("100%");
            //    page.controls.grdTax.height("220px");
            //    page.controls.grdTax.setTemplate({
            //        selection: "Single",

            //        columns: [
            //            { 'name': "Tax No", 'width': "100px", 'dataField': "sales_tax_no" },
            //            { 'name': "Tax Name", 'width': "200px", 'dataField': "sales_tax_name" },
            //            { 'name': "Tax Type", 'width': "150px", 'dataField': "sales_tax_level" },
            //            { 'name': "Percentage", 'width': "150px", 'dataField': "sales_tax_value" },
            //        ]
            //    });

            //    page.controls.grdTax.dataBind(page.tax);
            //})
            var payModeType = [];
            payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" });
            if (CONTEXT.ENABLE_REWARD_MODULE == true)
                payModeType.push({ mode_type: "Points" })
            payModeType.push({ mode_type: "Mixed" });
            page.controls.ddlPayType.dataBind(payModeType, "mode_type", "mode_type");
            payModeType.push({ mode_type: "Loan" });
            page.controls.ddlPayType.dataBind(payModeType, "mode_type", "mode_type");

            (CONTEXT.ENABLE_REWARD_MODULE == true) ? $$("pnlCustPoints").show() : $$("pnlCustPoints").hide();

            (CONTEXT.ENABLE_CUST_GST == true) ? $$("pnlCustGst").show() : $$("pnlCustGst").hide();

            CONTEXT.POSShowFree = false;
            CONTEXT.POSShowStock = false;
            CONTEXT.POSShowGST = false;
            $$("chkShowFree").change(function () {
                if ($$("chkShowFree").prop("checked")) {

                    CONTEXT.POSShowFree = true;
                    //page.controls.grdBill.dataBind(page.controls.grdBill.allData());
                    //page.controls.grdBill.dataBind([]);
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    page.calculate();
                } else {
                    CONTEXT.POSShowFree = false;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.controls.grdBill.dataBind(page.controls.grdBill.allData());
                    page.calculate();
                }
            });
            $$("chkShowStock").change(function () {
                if ($$("chkShowStock").prop("checked")) {
                    CONTEXT.POSShowStock = true;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.controls.grdBill.dataBind(page.controls.grdBill.allData());
                    page.calculate();
                } else {
                    CONTEXT.POSShowStock = false;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.controls.grdBill.dataBind(page.controls.grdBill.allData());
                    page.calculate();
                }
            });
            $$("chkShowGst").change(function () {
                if ($$("chkShowGst").prop("checked")) {
                    CONTEXT.POSShowGST = true;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.controls.grdBill.dataBind(page.controls.grdBill.allData());
                    page.calculate();
                } else {
                    CONTEXT.POSShowGST = false;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.controls.grdBill.dataBind(page.controls.grdBill.allData());
                    page.calculate();
                }
            });
            if (CONTEXT.showFree == true) {
                $$("chkShowFree").show();
                $$("lblFree").show();
            } else {
                $$("chkShowFree").hide();
                $$("lblFree").hide();
            }
            if (CONTEXT.showStock == true) {
                $$("chkShowStock").show();
                $$("lblFreeStock").show();
            } else {
                $$("chkShowStock").hide();
                $$("lblFreeStock").hide();
            }
            if (CONTEXT.showGst == true) {
                $$("chkShowGst").show();
                $$("lblGst1").show();
            } else {
                $$("chkShowGst").hide();
                $$("lblGst1").hide();
            }
            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                $$("pnlExpenses").show();
                $$("pnlExpenseName").show();
            } else {
                $$("pnlExpenses").hide();
                $$("pnlExpenseName").hide();
            }
            if (CONTEXT.ENABLE_ADVANCE_SEARCH) {
                $$("btnSearchItem").show();
            } else {
                $$("btnSearchItem").hide();
            }

            page.billService.getSalesTaxClass(CONTEXT.DEFAULT_SALES_TAX, function (data) {
                if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                    page.selectedBill.sales_tax_class = data;
                }
            });

        }

        page.interface.setMessagePanel = function (msgPanel) {
            page.msgPanel = msgPanel;
        }

        page.interface.launchNewBill = null;
        //Insert bill, transaction, and bill_pay
        page.events.btnPay_now_click = function () {
            page.controls.pnlPayNow.open();
            page.controls.pnlPayNow.title("Make Payment.");
            page.controls.pnlPayNow.width(800);
            page.controls.pnlPayNow.height(400);
            $$("pnlCard").hide();
            $$("pnlCoupon").hide();
            $$("pnlAmount").show();
            $$("pnlBalance").show();
            $$("pnlPoints").hide();
            $$("lblBalance").value(parseFloat(page.controls.lblTotal.value()));
            $$("txtAmount").val('');
            $$("ddlPaymentType").selectionChange(function () {
                if ($$("ddlPaymentType").selectedValue() == "Cash") {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                else if ($$("ddlPaymentType").selectedValue() == "Coupon") {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").show();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                else if ($$("ddlPaymentType").selectedValue() == "Card") {
                    $$("pnlCard").show();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                else if ($$("ddlPaymentType").selectedValue() == "Points") {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").show();
                    $$("pnlAmount").hide();
                    $$("pnlBalance").hide();
                }
                else {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
            });
        }
        page.events.btnAddPayment_click = function () {
            var amount = 0;
            try {
                var amt = parseInt($$("lblBalance").value()) - parseInt($$("txtAmount").val());
                if (!$$("ddlPaymentType").selectedValue() == "Points")
                    if (parseInt($$("txtAmount").val()) == 0 || $$("txtAmount").val() == null || $$("txtAmount").val() == undefined || isNaN(parseFloat($$("txtAmount").val())) || parseFloat($$("txtAmount").val()) <= 0 || $$("txtAmount").val() == "")
                        throw "Amount should be number and positive";
                if (($$("ddlPaymentType").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                    throw "Card no should be mantatory";
                if (($$("ddlPaymentType").selectedValue() == "Cash") && page.controls.txtAmount.val() == 0)
                    throw "Amount should not be zero";
                if (($$("ddlPaymentType").selectedValue() == "Card") && page.controls.txtAmount.val() == 0)
                    throw "Amount should not be zero";
                if (($$("ddlPaymentType").selectedValue() == "Cash") && parseInt(amt) < parseInt(0))
                    throw "Amount should not be exceed total amount";
                if (($$("ddlPaymentType").selectedValue() == "Card") && parseInt(amt) < parseInt(0))
                    throw "Amount should not be exceed total amount";
                if (($$("ddlPaymentType").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                    throw "Coupon no should be mantatory";
                if (($$("ddlPaymentType").selectedValue() == "Points") && ($$("txtPoints").val() == ""))
                    throw "Coupon no should be mantatory";
                if ($$("ddlPaymentType").selectedValue() == "Points") {
                    if (page.controls.txtCustomerName.selectedObject.val() == "" || page.controls.txtCustomerName.selectedObject.val() == null || page.controls.txtCustomerName.selectedObject.val() == undefined)
                        throw "Customer should be selected";
                    if (page.controls.lblAvalablePoints.value() == "" || page.controls.lblAvalablePoints.value() == null || page.controls.lblAvalablePoints.value() == undefined)
                        throw "Customer should have the points";
                    if (parseFloat(page.controls.lblTotal.value()) > parseFloat(page.controls.lblAvalablePoints.value()) / 4)
                        throw "Customer not having the enought points"
                    if (parseFloat(page.controls.txtPoints.value()) > parseFloat(page.controls.lblAvalablePoints.value()))
                        throw "Points Exceeds"
                }
                var data = {
                    pay_type: $$("ddlPaymentType").selectedValue(),
                    card_type: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Coupon" || $$("ddlPaymentType").selectedValue() == "Points") ? "" : $$("ddlCardType").selectedValue(),
                    card_no: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Coupon" || $$("ddlPaymentType").selectedValue() == "Points") ? "" : $$("txtCardNo").val(),
                    coupon_no: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Card" || $$("ddlPaymentType").selectedValue() == "Points") ? "" : $$("txtCouponNo").val(),
                    points: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Card" || $$("ddlPaymentType").selectedValue() == "Coupon") ? "" : $$("txtPoints").val(),
                    amount: ($$("ddlPaymentType").selectedValue() == "Points") ? parseFloat($$("txtPoints").val()) / 4 : $$("txtAmount").val()
                }
                page.controls.grdAllPayment.createRow(data);
                $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                    amount = parseFloat(data.amount) + parseFloat(amount);
                });
                $$("lblBalance").value(parseFloat(page.controls.lblTotal.value()) - parseFloat(amount));
                // page.view.selectedPayment(data);
                $$("txtAmount").val('');

            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        },
        page.events.btnMixedPayment_click = function () {
            var amount = 0;
            try {
                if (page.controls.grdAllPayment.allData() == 0)
                    throw "Payment details not entered";
                $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                    amount = parseFloat(data.amount) + amount;
                });
                if (amount > parseFloat(page.controls.lblTotal.value()))
                    throw "Amount should not be exceeds than the total amount";
                if (CONTEXT.RESTAPI) {
                    page.insertBill("Sale","Mixed", function (currentBillNo) {
                        page.controls.pnlPayNow.close();
                        if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                            page.addpoints(currentBillNo);
                        }
                        if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                            page.addTray(currentBillNo);
                        }
                        if (CONTEXT.ENABLE_EMAIL == "true") {
                            page.events.btnSendMail_click();
                        }
                        if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                            page.events.btnSendSMS_click();
                        }
                        if (CONTEXT.ENBLE_BILL_BARCODE) {
                            var data = {
                                bill_no: currentBillNo,
                                bill_barcode: getFullCode(currentBillNo)
                            }
                            page.billService.updateBillBarcode(data, function (data) {
                                if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                                    page.interface.printBill(currentBillNo);
                                }
                            });
                        } else {
                            if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                                page.interface.printBill(currentBillNo);
                            }
                        }
                        if (CONTEXT.ENABLE_JASPER) {
                            page.printJasper(currentBillNo, "PDF");
                        }

                        page.interface.closeBill();
                        page.interface.launchNewBill();
                    });
                }
                else {
                    page.payMixedBill("Sale", function (currentBillNo) {
                        page.controls.pnlPayNow.close();
                        if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                            page.addpoints(currentBillNo);
                        }
                        if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                            page.addTray();
                        }
                        if (CONTEXT.ENABLE_EMAIL == "true") {
                            page.events.btnSendMail_click();
                        }
                        if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                            page.events.btnSendSMS_click();
                        }
                        if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                            page.interface.printBill(currentBillNo);
                        }
                        if (CONTEXT.ENABLE_JASPER) {
                            // PrintService.PrintReceipt("");
                            page.printJasper(currentBillNo, "PDF");
                        }

                        //page.interface.printBill(currentBillNo);
                        page.interface.closeBill();
                        page.interface.launchNewBill();
                    });
                }
            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        },
        page.events.btnPayment_click = function () {
            var err_count = 0;
            var item_count =true;
            try {
                $(page.controls.grdBill.allData()).each(function (i, item) {

                    item.unit_identity == "1" ? item.alter_unit_fact = item.alter_unit_fact : item.alter_unit_fact = 1;
                    item.qty_returned = parseFloat(item.qty_returned) * parseFloat(item.alter_unit_fact);
                    item.ret_free = parseFloat(item.ret_free) * parseFloat(item.alter_unit_fact);
                    //Set default value if empty
                    if (item.ret_qty == null || item.ret_qty == "" || typeof item.ret_qty == "undefined" || isNaN(item.ret_qty)) {
                        item.ret_qty = 0;
                    }
                    if (item.ret_free == null || item.ret_free == "" || typeof item.ret_free == "undefined" || isNaN(item.ret_free)) {
                        item.ret_free = 0;
                    }
                    if (item.free_qty_return == null || item.free_qty_return == "" || typeof item.free_qty_return == "undefined") {
                        item.free_qty_return = 0;
                    }
                    if (item.free_qty == null || item.free_qty == "" || typeof item.free_qty == "undefined") {
                        item.free_qty = 0;
                    }
                    //Validate number and non negative
                    if (isNaN(item.ret_qty) || parseFloat(item.ret_qty) < 0) //If not a number or negative set flag=1
                        throw "Quantity to return should be a number and non negative.";
                    if (isNaN(item.ret_free) || parseFloat(item.ret_free) < 0) //If not a number or negative set flag=1
                        throw "Free quantity to return should be a number and non negative.";

                    if (parseFloat(item.free_qty) < (parseFloat(item.free_qty_return) + parseFloat(item.ret_free)))
                        throw "Free qty cannot be greater than the total free qty";
                    if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                        item.tray_received = 0;
                    if (parseFloat(item.tray_received) < 0 || isNaN(item.tray_received))
                        throw "Tray qty should be number and positive";

                    if (parseFloat(item.qty) < (parseFloat(item.ret_qty) + parseFloat(item.qty_returned))) //If not a number or negative set flag=1
                        throw "Total return quantity cannot be greater than ordered quantity.";
                });
                if ($$("txtExpense").value() != "" && $$("txtExpense").value() != 0 && !isInt($$("txtExpense").value())) {
                    page.expense = false;
                } else
                    page.expense = true;
                if (err_count == 0) {
                    if (page.controls.grdBill.allData().length == 0) {
                        alert("No item(s) can be sale");
                    }
                    else if ($$("ddlPayType").selectedValue() == "Mixed") {
                        page.events.btnPay_now_click();
                    }
                    else {
                        if (CONTEXT.RESTAPI) {
                            var pay_mode = (page.controls.ddlPayType.selectedValue() == "Loan") ? "Loan" : "Cash";
                            page.insertBill("Sale", pay_mode, function (currentBillNo) {
                                if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                                    page.addpoints(currentBillNo);
                                }
                                if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                    page.addTray(currentBillNo);
                                }
                                if (CONTEXT.ENABLE_EMAIL == "true") {
                                    page.events.btnSendMail_click();
                                }
                                if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                                    page.events.btnSendSMS_click();
                                }

                                if (CONTEXT.ENBLE_BILL_BARCODE) {
                                    var data = {
                                        bill_no: currentBillNo,
                                        bill_barcode: getFullCode(currentBillNo)
                                    }
                                    page.billService.updateBillBarcode(data, function (data) {
                                        if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                                            page.interface.printBill(currentBillNo);
                                        }
                                    });
                                } else {
                                    if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                                        page.interface.printBill(currentBillNo);
                                    }
                                }
                                if (CONTEXT.ENABLE_JASPER) {
                                    page.printJasper(currentBillNo, "PDF");
                                }
                                page.interface.closeBill();
                                page.interface.launchNewBill();
                                page.currentBillNo = null;
                            });
                        }
                    }
                }

            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        }
        // Advance Search
        $("[controlid=txtAdvVendor]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.selectedBill.sales_tax_no);
        });
        $("[controlid=txtAdvManufacturer]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.selectedBill.sales_tax_no);
        });
        page.advanceItemSearch = function (ven_name, man_name, sales_tax_no) {
            page.itemService.getTouchItemAdvanceSearch(ven_name, man_name, sales_tax_no, function (data) {
                page.controls.grdAdvSearchItem.hide();
                //page.controls.grdTouchAdvSearchItem.width("100%");
                //page.controls.grdTouchAdvSearchItem.height("220px");
                page.controls.grdTouchAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                            { 'name': "", 'width': "0px", 'dataField': "item_no" },
                            { 'name': "", 'width': "0px", 'dataField': "item_name" },
                            { 'name': "", 'width': "0px", 'dataField': "item_code" },
                            { 'name': "", 'width': "0px", 'dataField': "vendor_name" },
                            { 'name': "", 'width': "0px", 'dataField': "man_name" },
                            { 'name': "", 'width': "0px", 'dataField': "tax" },
                            { 'name': "", 'width': "0px", 'dataField': "price" },
                            { 'name': "", 'width': "0px", 'dataField': "mrp" },
                            { 'name': "Select Items", 'width': "100%", 'dataField': "item_no", itemTemplate: "<div id='detailGrid'></div>" }

                    ]
                })

                $$("grdTouchAdvSearchItem").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<div><img id='output' style='max-width:150px; max-height:150px; min-height:150px;' src='" + CONTEXT.ImageDownloadPath + item.item_no + '/' + item.image_name + "'/><BR><p style='background-color:orange;'><span > Vendor : " + item.vendor_name + "<BR> Manufacturer : " + item.man_name + "<BR> MRP : " + item.mrp + "</span></p></div>");

                    $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                }

                //page.controls.grdTouchAdvSearchItem.createRow(item);
                page.controls.grdTouchAdvSearchItem.dataBind(data);

                //page.controls.grdTouchAdvSearchItem.dataBind(data);
            });
        }
        // Advance Search
        page.events.btnTouchAdvaSearchItem_click = function () {
            $("div.touch").show();
            $$("txtAdvVendor").val('');
            $$("txtAdvManufacturer").val('');
            $$("txtAdvVendor").focus();
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.selectedBill.sales_tax_no);
            page.controls.grdAdvSearchItem.hide();
            //page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
        }
        page.events.btnAdvSearchItem_click = function () {
            $("div.touch").hide();
            page.controls.pnlAdvSearchItemPopup.open();
            page.controls.pnlAdvSearchItemPopup.title("Item Advance Search");
            page.controls.pnlAdvSearchItemPopup.width(1300);
            page.controls.pnlAdvSearchItemPopup.height(600);
            $$("txtAdvItemSearch").val('');
            page.controls.grdAdvSearchItem.hide();
        }
        page.events.btnAdvaSearchItem_click = function () {
            $("div.touch").hide();
            page.controls.grdAdvSearchItem.show();

            page.itemService.getItemAdvanceSearchPO($$("txtAdvItemSearch").val(), function (data) {

                page.controls.grdAdvSearchItem.width("100%");
                //page.controls.grdAdvSearchItem.height("220px");
                page.controls.grdAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "120px", 'dataField': "item_name" },
                        { 'name': "Item Code", 'width': "75px", 'dataField': "item_code" },
                        { 'name': "Default Vendor", 'width': "130px", 'dataField': "vendor_name" },
                        { 'name': "Manufacturer", 'width': "100px", 'dataField': "man_name" },
                        { 'name': "Tax", 'width': "60px", 'dataField': "tax" },
                        { 'name': "Price", 'width': "80px", 'dataField': "price" },
                        { 'name': "MRP", 'width': "80px", 'dataField': "mrp" },

                    ]
                });
                page.controls.grdAdvSearchItem.dataBind(data);

            });
        }
        page.events.btnAddAdvaSearchItem_click = function () {
            var data = {};
            if ($('div.touch').css('display') == 'none') {
                data = page.controls.grdAdvSearchItem.selectedData();
            }
            else {
                data = page.controls.grdTouchAdvSearchItem.selectedData();
            }
            page.advSearchItemSelect(data);
            page.controls.pnlAdvSearchItemPopup.close();
        }
        page.advSearchItemSelect = function (item) {
            if (item != null) {
                $(item).each(function (i, item) {
                    if (typeof item.item_no != "undefined") {

                        //populate discount
                        page.itemService.getItemDiscountAutocomplete(item.item_no, function (data) {
                            if (data != '' && data != undefined) {
                                $(data).each(function (i, ditem) {
                                    page.selectedBill.discounts.push({
                                        disc_no: ditem.disc_no,
                                        disc_type: ditem.disc_type,
                                        disc_name: ditem.disc_name,
                                        disc_value: ditem.disc_value,
                                        item_no: item.item_no
                                    });
                                });

                            }

                            var newitem = {
                                item_no: item.item_no,
                                item_name: item.item_name,
                                discount: 0,
                                tax: item.tax,
                                tax_class_no: item.tax_class_no,
                                qty: 1,
                                qty_const: item.qty_stock,
                                free_qty: 0,
                                qty_stock: item.qty_stock,
                                price: item.price,
                                unit: item.unit,
                                mrp: item.mrp,
                                expiry_date: item.expiry_date,
                                batch_no: item.batch_no,

                                total_price: item.price * 1 - item.tax * item.price * 1,
                                tray_id: item.tray_no,
                                qty_type: item.qty_type,
                            };

                            //Populate 
                            var rows = page.controls.grdBill.getRow({
                                item_no: newitem.item_no
                            });


                            if (rows.length == 0) {
                                page.controls.grdBill.createRow(newitem);
                                page.controls.grdBill.edit(true);
                                rows = page.controls.grdBill.getRow({
                                    item_no: newitem.item_no
                                });
                                rows[0].find("[datafield=qty]").find("input").focus();
                            } else {
                                var txtQty = rows[0].find("[datafield=qty]").find("input");
                                //txtQty.val(parseInt(txtQty.val()) + 1);
                                txtQty.val(parseFloat(txtQty.val()) + 1);
                                txtQty.trigger('change');
                                txtQty.focus();
                            }
                            page.controls.txtItemSearch.customText("");
                            page.calculate();

                        });
                    }
                });
            }

        }


        page.printJasper = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no,
            }
            page.billService.getSalesPrint(billdata, function (data) {
                page.events.btnprintInvoiceJson_click(data, exp_type);
            });
        }


        page.events.btnprintInvoiceJson_click = function (billItem, exp_type) {
            var data = billItem[0];
            var bill_item = [];
            var s_no = 0;
            $(billItem).each(function (i, item) {
                s_no = s_no + 1;
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    var monthex;
                    var yearex
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        monthex = item.expiry_date.substring(3, 5);
                        yearex = item.expiry_date.substring(6, 10);
                        item.expiry_date = monthex + "-" + yearex;
                    }
                }
                bill_item.push({
                    "BillItemNo": s_no,
                    "ProductName": item.item_name,	// nonstandard unquoted field name
                    "Pack": item.packing,	// nonstandard single-quoted field name
                    "Batch": item.batch_no,	// standard double-quoted field name
                    "Exp": item.expiry_date,
                    "Qty": item.qty,
                    "Per": item.unit_per,
                    //"Qty_unit": item.qty_unit,
                    "Qty_unit": item.qty,
                    //"Unit": parseFloat(item.mrp).toFixed(2),
                    "FreeQty": item.free_qty,
                    "Rate": parseFloat(item.price).toFixed(2),
                    "PDis": parseFloat(item.discount).toFixed(2),
                    "MRP": parseFloat(item.mrp).toFixed(2),
                    "CGST": item.tax_cgst,
                    "SGST": item.tax_sgst,
                    "GST": parseInt(item.tax_per),
                    "GValue": parseFloat(item.total_price).toFixed(2)
                });
            });
            //var BillWordings = inWords(parseFloat(data.total).toFixed(2));
            var accountInfo =
                        {
                            "BillType": "INVOICE",
                            "Pay Mode": data.pay_mode,
                            "CustomerName": data.cust_name,	// standard double-quoted field name
                            "Phone": data.phone_no,
                            "CustAddress": data.address1,
                            "CustCityStreetZipCode": data.address2,
                            "DLNo": data.license_no,
                            "isSalesExe": CONTEXT.isSalesExecutive,
                            "GST": data.gst_no,
                            "TIN": data.tin_no,
                            "Area": data.sales_exe_area,
                            "SalesExecutiveName": data.sales_exe_name,
                            "VehicleNo": data.vehicle_no,
                            "BillNo": data.bill_no,
                            "BillDate": data.bill_date,
                            "NoofItems": data.no_of_items,
                            "Quantity": data.no_of_qty,
                            "Abdeen": "Abdeen:",
                            "AbdeenMobile": CONTEXT.MobileNo,
                            "Off": "Off:",
                            "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                            //"+9199444 10350",
                            "Home": "LL:",
                            "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                            "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                            "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                            "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                            "BillAmount": parseFloat(data.total).toFixed(2),
                            "ApplicaName": CONTEXT.COMPANY_NAME,
                            "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "CompanyName1": CONTEXT.CompanyName1, //"New",
                            "CompanyName": CONTEXT.CompanyName,//"Essar Steel Corporation",
                            "CompanyName2": CONTEXT.CompanyName2,//"Dealer : Steel & Pipes",
                            "CompanyAdd1": CONTEXT.COMPANY_ADDRESS,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                            "CompanyAdd2": CONTEXT.CompanyAdd2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                            "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                            "Cell": "Cell : ",
                            "Cell No": CONTEXT.MobileNo,//"94434 63089",
                            "Home": "Phone : ",
                            "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                            "CompanyCityStreetPincode": "",
                            "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                            "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                            "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                            "CompanyGST": CONTEXT.COMPANY_GST_NO,
                            //"33CCKPS9949CIZ4",
                            "SSSS": "DUPLICATE",
                            "ShipAmt": data.expense_amt,
                            "Original": "ORIGINAL",
                            "RoundAmount": parseFloat(data.round_off).toFixed(2),
                            "BillItem": bill_item
                        };

            if (page.PrintBillType == "Return") {
                accountInfo.BillName = "ORIGINAL RETURN BILL";
            }
            else {
                accountInfo.BillName = "ORIGINAL BILL";
            }

            if (CONTEXT.PRINT_PAPER_SIZE.toUpperCase() == "A5") {
                PrintService.PrintFile("sales-bill-print/main-sales-bill-short-new1.jrxml", accountInfo);
            } else {
                accountInfo.Original = "Original";
                PrintService.PrintFile("sales-bill-print/main-sales-bill-short-new1.jrxml", accountInfo);
            }

        }
        var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        function inWords(num) {
            if ((num = num.toString()).length > 9) return 'overflow';
            n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return; var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
            return str;
        }
        page.events.btnSave_click = function () {
            try {
                //Create a Saved Bill
                $(page.controls.grdBill.allData()).each(function (i, items) {
                    if (parseFloat(items.qty) > parseFloat(items.qty_const)) {
                        if (CONTEXT.POS_SHOW_STOCK_EMPTY_ALERT)
                            if (!confirm("Item Quanity cannot not be higher than stock level for " + items.item_name + ""))
                                throw "Please remove the item " + items.item_name + " to continue sales.";
                        //throw "Qty is Higher Than The Stock";
                    }
                    if (parseFloat(items.qty) <= 0 || items.qty == undefined || items.qty == null || items.qty == "" || isNaN(items.qty))
                        throw "Item qty should be number and positive";
                    if ((parseFloat(items.free_qty) + parseFloat(items.qty)) > parseFloat(items.qty_const)) {
                        items.free_qty =0;
                    }
                    if (parseFloat(items.free_qty) < 0 || (items.free_qty == "" && items.free_qty != 0) || isNaN(items.free_qty)){
                        items.free_qty=0;
                    }
                    if (items.free_qty == null || items.free_qty == undefined)
                        items.free_qty = 0;

                });
                if (page.controls.grdBill.allData().length == 0) {
                    alert("No item(s) can be purchase");
                } else {
                    if (CONTEXT.RESTAPI) {
                        page.insertBill("SaleSaved", "Cash", function (currentBillNo) {
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                        });
                    }
                    //else {
                    //    page.saveBill("Saved", function (currentBillNo) {
                    //        page.interface.closeBill();
                    //        page.interface.launchNewBill();
                    //        //page.controls.btnNewBill_click();
                    //        //Load all sales
                    //        //page.loadSales(function (data) {

                }
            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        }

        page.events.btnReturn_click = function () {
            var selItem = $$("grdReturnItemSelection").selectedData()[0];
            if (selItem == undefined) {
                //alert("No items to be selected");
                ShowDialogBox('Warning', 'No items selected...!', 'Ok', '', null);
            }
            else {
                var currentBillNo = page.currentBillNo;
                page.billService.getSOByBillNo(currentBillNo, function (data) {
                    page.currentData = data[0];

                    if (page.currentData == null) {
                        //Create a Saved Bill
                        page.saveBill("Return", function (currentBillNo) {
                            //Load all sales
                            page.interface.closeBill();
                            page.interface.launchNewBill();

                        });
                    } else {
                        page.msgPanel.show("Bill cant be returned from POS since it is associated with sales order number" + data[0].order_id + "");
                    }
                });
            }
        }

        page.events.btnAddCustomer_click = function () {
            page.controls.pnlNewCustomer.open();
            page.controls.pnlNewCustomer.title("New Customer");
            page.controls.pnlNewCustomer.width(550);
            page.controls.pnlNewCustomer.height(630);

            page.controls.ucCustomerEdit.select({});

        }
        page.events.btnSaveCustomer_click = function () {
            page.controls.ucCustomerEdit.save(function (data) {
                page.controls.txtCustomerName.customText(data.cust_name);
                page.controls.hdnCustomerNo.val(data.cust_no);
                page.controls.lblPhoneNo.value(data.phone_no);
                page.controls.lblAddress.value(data.address);
                page.controls.lblEmailId.value(data.email);
                page.controls.lblGst.value(data.gst_no);
                page.controls.pnlNewCustomer.close();
            });
        }
        page.events.btnSaveCustomerTemp_click = function () {
            page.controls.ucCustomerEdit.returnCustomer(function (data) {
                page.controls.txtCustomerName.customText(data.cust_name);
                page.controls.hdnCustomerNo.val(data.cust_no);
                page.controls.lblPhoneNo.value(data.phone_no);
                page.controls.lblAddress.value(data.address);
                page.controls.lblEmailId.value(data.email);
                page.controls.lblGst.value(data.gst_no);
                page.controls.pnlNewCustomer.close();
            });
        }
        page.events.btnManualDiscountCancel_click = function () {
            page.controls.pnlManualDiscountPopUp.close();
        }
        page.events.btnManualDiscountOK_click = function () {
            //var data = page.controls.ddlItemDiscount.selectedData();
            var data = page.discountData;
            if (page.manualDiscountbillLevel == false) {
                page.selectedBill.discounts.push({
                    disc_no: data.disc_no,
                    disc_type: data.disc_type,
                    disc_name: data.disc_name,
                    disc_level: data.disc_level,
                    disc_value: $$("txtManualDiscount").val(),
                    item_no: page.discount_item_no,
                    variation_name: page.discount_item_variation_name
                });
            }
            else {
                page.selectedBill.discounts.push({
                    disc_no: data.disc_no,
                    disc_type: data.disc_type,
                    disc_name: data.disc_name,
                    disc_level: data.disc_level,
                    disc_value: $$("txtManualDiscount").val()
                });
            }
            page.calculate();
            //alert("Discount successfully applied");
            ShowDialogBox('Message', 'Discount successfully applied...!', 'Ok', '', null);
            page.controls.pnlManualDiscountPopUp.close();
        }
        //function ShowDialogBox(title, content, btn1text, btn2text, parameterList) {
        //    var btn1css;
        //    var btn2css;

        //    if (btn1text == '') {
        //        btn1css = "hidecss";
        //    } else {
        //        btn1css = "showcss";
        //    }

        //    if (btn2text == '') {
        //        btn2css = "hidecss";
        //    } else {
        //        btn2css = "showcss";
        //    }
        //    $("#lblMessage").html(content);

        //    $("#dialog").dialog({
        //        resizable: false,
        //        title: title,
        //        modal: true,
        //        width: '400px',
        //        height: 'auto',
        //        bgiframe: false,
        //        hide: { effect: 'scale', duration: 400 },

        //        buttons: [
        //                        {
        //                            text: btn1text,
        //                            "class": btn1css,
        //                            "controlid": "btnOk",
        //                            click: function () {

        //                                $("#dialog").dialog('close');

        //                            }
        //                        },
        //                        {
        //                            text: btn2text,
        //                            "class": btn2css,
        //                            "controlid": "btnCancel",
        //                            click: function () {
        //                                $("#dialog").dialog('close');
        //                            }
        //                        }
        //        ]
        //    });
        //}
        page.events.btnItemDiscountOK_click = function () {

            var data = page.controls.ddlItemDiscount.selectedData();
            if (typeof data != "undefined" && data != null) {
                if (data.disc_name != null && (data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    page.manualDiscountbillLevel = false;
                    page.controls.pnlManualDiscountPopUp.open();
                    page.controls.pnlManualDiscountPopUp.title("Manual Discount");
                    //data.variation_name = page.discount_item_variation_name;
                    page.discountData = data;
                    //confirmManualDisc().then(function (answer) {
                    //    if (answer == "Ok") {
                    //        page.selectedBill.discounts.push({
                    //            disc_no: data.disc_no,
                    //            disc_type: data.disc_type,
                    //            disc_name: data.disc_name,
                    //            disc_level: data.disc_level,
                    //            disc_value: page.manualDiscountValue,
                    //            item_no: page.discount_item_no
                    //        });
                    //        page.calculate();
                    //        alert("Discount successfully applied");
                    //    }
                    //});
                }
                else {

                    page.selectedBill.discounts.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_level: data.disc_level,
                        disc_value: data.disc_value,
                        item_no: page.discount_item_no,
                        variation_name: page.discount_item_variation_name
                    });
                    page.calculate();
                    //alert("Discount successfully applied");
                    ShowDialogBox('Message', 'Discount successfully applied...!', 'Ok', '', null);

                }
            }
            /*  var arr = jQuery.grep(page.selectedBill.discounts, function (n, i) {
                  return (n.disc_no == 7 && n.item_no == page.discount_item_no);
              });
  
              if (arr.length > 0) {
                  arr[0].disc_value = page.controls.txtItemDiscountValue.val();
              } else {
                  page.selectedBill.discounts.push({
                      disc_no: $$("ddlItemDiscount").selectedValue(),
                      disc_type: "Fixed",
                      disc_name: "Manual Discount by User",
                      disc_value: page.controls.txtItemDiscountValue.val(),
                      item_no: page.discount_item_no
                  });
              }
  
  
              page.calculate();
              page.controls.txtItemDiscountValue.val("");
              page.controls.pnlItemDiscountPopup.close();*/
        }

        page.events.btnDiscountOK_click = function () {
            var data = page.controls.ddlDiscount.selectedData();
            if (typeof data != "undefined") {
                if (data.disc_name != null && (data.disc_name == "Manual Discount of x percent" || data.disc_name == "Manual Discount of x value" || data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    page.manualDiscountbillLevel = true;
                    page.controls.pnlManualDiscountPopUp.open();
                    page.controls.pnlManualDiscountPopUp.title("Manual Discount");
                    page.discountData = data;
                    //confirmManualDisc().then(function (answer) {
                    //    if (answer == "Ok") {
                    //        page.selectedBill.discounts.push({
                    //            disc_no: data.disc_no,
                    //            disc_type: data.disc_type,
                    //            disc_name: data.disc_name,
                    //            disc_level: data.disc_level,
                    //            disc_value: page.manualDiscountValue
                    //        });
                    //        page.calculate();
                    //    }
                    //});

                }
                else {

                    page.selectedBill.discounts.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_level: data.disc_level,
                        disc_value: data.disc_value
                    });
                    page.calculate();

                }
            }
        }
        page.events.btnDiscountRemove_click = function () {
            var data = $$("grdDiscount").selectedData();
            if (data.length > 0) {
                for (var i = page.selectedBill.discounts.length - 1; i >= 0; i--) {
                    if (page.selectedBill.discounts[i].disc_no == data[0].disc_no && page.selectedBill.discounts[i].item_no == data[0].item_no) {
                        page.selectedBill.discounts.splice(i, 1);
                    }
                }
                page.calculate();
            }

        }
        page.events.btnItemDiscountRemove_click = function () {
            var data = $$("grdItemDiscount").selectedData();
            if (data.length > 0) {
                for (var i = page.selectedBill.discounts.length - 1; i >= 0; i--) {
                    if (page.selectedBill.discounts[i].disc_no == data[0].disc_no && page.selectedBill.discounts[i].item_no == data[0].item_no && page.selectedBill.discounts[i].variation_name == data[0].variation_name) {
                        page.selectedBill.discounts.splice(i, 1);
                    }
                }
                page.calculate();
            }

        }


        page.events.btnTaxOK_click = function () {
            if (page.controls.ddlSalesTax.selectedValue() == -1) {
                page.selectedBill.sales_tax_class = [];
                page.selectedBill.sales_tax_no = -1;
                page.calculate();
            } else {
                var data = page.controls.ddlSalesTax.selectedData();
                page.selectedBill.sales_tax_no = data.sales_tax_no;
                page.billService.getSalesTaxClass(data.sales_tax_no, function (data) {
                    page.selectedBill.sales_tax_class = data;
                    page.calculate();
                }); //[{ sales_tax_no: 1, tax_class_no: 1, tax_perc: 12 }];
            }
            page.msgPanel.show("Tax added in current session...");
            page.controls.pnlTaxPopup.close();
            page.msgPanel.hide();

        }

        //Remove a ItemDiscount to be used for Current Sales order.
        //page.events.btnTaxRemove_click = function () {
        //    var data = $$("grdTax").selectedData();
        //    if (data.length > 0) {
        //        for (var i = page.tax.length - 1; i >= 0; i--) {
        //            if (page.tax[i].sales_tax_no == data[0].sales_tax_no) {
        //                page.tax.splice(i, 1);
        //            }
        //        }
        //    }
        //    var itemDisount = [];
        //    $(page.tax).each(function (i, data) {
        //        //Get discount for current item and discounts applied to all item
        //        if (typeof data.sales_tax_no != "undefined") {
        //            itemDisount.push(data);
        //        }
        //    });
        //    page.controls.grdTax.dataBind(itemDisount);
        //    page.calculate();
        //    // page.controls.pnlItemDiscountPopup.close();
        //}

        page.events.btnSendMail_click = function () {
            if (CONTEXT.ENABLE_EMAIL == "true") {
                try {
                    var sms_error_count = 0;
                    var bill = page.selectedBill;
                    if (page.controls.txtCustomerName.selectedValue() == null || page.controls.txtCustomerName.selectedValue() == "" || typeof page.controls.txtCustomerName.selectedValue() == "undefined") {
                        sms_error_count++;
                        throw "Customer Not Selected For Sending Email";
                    }
                    if (page.controls.hdnCustomerNo.val() == null || page.controls.hdnCustomerNo.val() == "" || typeof page.controls.hdnCustomerNo.val() == "undefined") {
                        sms_error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.lblEmailId.value() == "" || page.controls.lblEmailId.value() == null || page.controls.lblEmailId.value() == undefined) {
                        sms_error_count++;
                        throw "No email id is proviced for the customer";
                    } 
                    if (sms_error_count == 0) {
                        var itemLists = [];
                        page.customerService.getTotalPoints(page.controls.txtCustomerName.selectedValue(), function (data, callback) {
                            $(bill.billItems).each(function (i, item) {
                                itemLists.push({ "itemNo": item.item_no + "", "itemName": item.item_name + "", "qty": item.qty + "", "unit": item.unit + "", "price": item.price + "", "discount": item.discount + "", "totalPrice": item.total_price + "", });
                            });

                            // page.billService.getCustomerBillsByAll(openBill.bill_no, function (itemList) {
                            //       $(itemList).each(function (i, item) {
                            var accountInfosp = {
                                // "billNo": page.controls.lblBillNo.value(),
                                //bill.bill_no,
                                // "billDate": page.controls.lblBillDate.value(),
                                //bill.bill_date,
                                //"2015-03-25T12:00:00Z",
                                "appName": CONTEXT.COMPANY_NAME,
                                "companyId": CONTEXT.FINFACTS_COMPANY,
                                "clientAddress": CONTEXT.COMPANY_ADDRESS,
                                "customerNumber": page.controls.txtCustomerName.selectedValue(),
                                "customerName": page.controls.txtCustomerName.selectedObject.val().split("_")[0],
                                "tax": page.controls.lblTax.value(),
                                "subTotal": page.controls.lblSubTotal.value(),
                                "discount": page.controls.lblDiscount.value(),
                                "totalPaid": page.controls.lblTotal.value(),
                                "totalRewardPoint": data[0].points,
                                "billType": page.controls.ddlPayType.selectedValue(),
                                //"2300",
                                "emailAddressList": [page.controls.lblEmailId.value()],
                                //["sam.info85@gmail.com"],
                                // [bill.email],
                                //["balumanoj85@gmail.com"],
                                //["sundaralingam48@gmail.com","wototech@outlook.com","balumanoj85@gmail.com"],

                                "billItemList": itemLists,
                            };
                            var accountInfoposJson = JSON.stringify(accountInfosp);

                            $.ajax({
                                type: "POST",
                                //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/pos-bill",
                                url: CONTEXT.POSEmailURL,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfosp),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);
                                    $(".detail-info").progressBar("hide");
                                    page.msgPanel.show("Email Sent Successfully..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);
                                    $(".detail-info").progressBar("hide");
                                    page.msgPanel.show("Email Sent Failed..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
                                }
                            });

                        });
                    }
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            } else {
                //alert("Sorry!.. Your settings blocks email sending");
                ShowDialogBox('Warning', 'Sorry!.. Your settings blocks email sending...!', 'Ok', '', null);
            }
        }
        page.events.btnSendSMS_click = function () {
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                try {
                    var error_count = 0;
                    var bill = page.selectedBill;
                    if (page.controls.txtCustomerName.selectedValue() == null || page.controls.txtCustomerName.selectedValue() == "" || typeof page.controls.txtCustomerName.selectedValue()=="undefined") {
                        error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.hdnCustomerNo.val() == null || page.controls.hdnCustomerNo.val() == "" || typeof page.controls.hdnCustomerNo.val() == "undefined") {
                        error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.hdnCustomerNo.val() == null || page.controls.hdnCustomerNo.val() == "" || typeof page.controls.hdnCustomerNo.val() == "undefined") {
                        error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.lblPhoneNo.value() == "" || page.controls.lblPhoneNo.value() == null || typeof page.controls.lblPhoneNo.value() == "undefined")
                    {
                        error_count++;
                        throw "Customer mobile number not provided";
                    }
                    if(error_count==0){
                        page.customerService.getTotalPoints(page.controls.txtCustomerName.selectedValue(), function (data, callback) {
                            var accountInfo =
                            {
                                "appName": CONTEXT.COMPANY_NAME,

                                "senderNumber": CONTEXT.SMS_SENDER_NO,
                                "companyId": CONTEXT.SMS_COMPANY_ID,
                                //"+917338898011",
                                //"919486342575",
                                //("txtSenderNumber").val(),
                                "message": //"Hai",
                                    "Dear " + page.controls.txtCustomerName.selectedObject.val().split("_")[0] + "," + "\n" +
                                    "Thankyou For Purchasing " +
                                    "Your Total Amount is Rs. " + page.controls.lblTotal.value() + "\n" +
                                    "Your Total Reward Points " + data[0].points + "\n" +
                                    "Regards as " + CONTEXT.COMPANY_NAME + "",
                                "receiverNumber": "+91" + page.controls.lblPhoneNo.value(),
                                // "+918098453314",
                                // $$("lblPOVendorPhone").html(),
                                //"919003300929",
                                //$$("txtReceiverNumber").val(),
                                //"mobileNumber":
                                //"9486342575",
                                //"7338898011",
                            };

                            var accountInfoJson = JSON.stringify(accountInfo);

                            $.ajax({
                                type: "POST",
                                //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                                url: CONTEXT.SMSURL,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfo),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);

                                    $$("msgPanel").flash("SMS Sent Successfully...");
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);

                                    $$("msgPanel").show("SMS Sent Failed...");
                                }
                            });
                        });
                    }
                    
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            } else {
                //alert("Sorry!.. your settings block sending messages");
                ShowDialogBox('Warning', 'Sorry!.. your settings block sending messages...!', 'Ok', '', null);
            }
        }


        page.events.btnReturnItemOK_click = function () {
            page.controls.grdBill.dataBind(page.controls.grdReturnItemSelection.selectedData());
        }



        page.view = {

            UIState: function (state) {

                if (state == "NewBill") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    $$("btnReturn").hide();
                    $$("btnPayment").show();
                    $$("btnAddCustomer").show();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtCustomerName").selectedObject.removeAttr('readonly');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    //$$("btnSendEmail").show();
                    $$("txtBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    $$("grdBillAdjustment").hide();
                    
                }
                if (state == "Saved") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    $$("btnReturn").hide();
                    $$("pnlBillNo").show();
                    $$("btnSave").show();
                    $$("btnPayment").show();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtCustomerName").selectedObject.removeAttr('readonly');


                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    // $$("btnSendEmail").show();
                    //$$("txtBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()))
                    $$("grdBillAdjustment").hide();
                    
                }
                if (state == "Sale") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    $$("btnReturn").show();
                    $$("btnSave").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();
                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();

                    $$("grdBill").edit(true);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    //TODO : show if return is there
                    // $$("btnSendEmail").show();
                    $$("txtBillDate").disable(false);
                    $$("txtBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    $$("grdBillAdjustment").hide();
                    
                }

                if (state == "Return") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    $$("btnReturn").hide();
                    $$("btnSave").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();
                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();

                    $$("grdBill").edit(false);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    // $$("btnSendEmail").show();
                    $$("txtBillDate").disable(true);
                    $$("grdBillAdjustment").hide();
                    
                }
                if (state == "NewReturn") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    $$("btnReturn").show();
                    $$("btnSave").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").hide();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").hide();
                    $$("grdReturnItemSelection").show();
                    $$("grdBillReturn").hide();
                    //$$("btnSendEmail").show();
                    $$("grdBillAdjustment").hide();
                    
                }

                
                if (state == "New") {
                    page.controls.grdBillReturn.display("none");
                    page.controls.lblDiscountLabel.selectedObject.css("cursor", "pointer");
                    page.controls.lblTaxLabel.selectedObject.css("cursor", "pointer");
                    page.controls.lblDiscountLabel.selectedObject.hover(function () {
                        $(this).css("text-decoration", "underline");
                    }, function () {
                        $(this).css("text-decoration", "");
                    });
                    page.controls.lblTaxLabel.selectedObject.hover(function () {
                        $(this).css("text-decoration", "underline");
                    }, function () {
                        $(this).css("text-decoration", "");
                    });

                    page.pingGrid("NewBill", []);
                    page.controls.grdBillReturn.width("1200px");
                    if (window.mobile) {
                        page.controls.grdBillReturn.height("auto");
                    }
                    else {
                        page.controls.grdBillReturn.height("100px");
                    }
                    page.controls.grdBillReturn.setTemplate({
                        selection: false,
                        columns: [
                            { 'name': "Bill No", 'width': "70px", 'dataField': "bill_no" },
                            { 'name': "Bill Date", 'width': "120px", 'dataField': "bill_date" },
                            { 'name': "Cust Name", 'width': "240px", 'dataField': "cust_name" },
                            { 'name': "Total Amount", 'width': "145px", 'dataField': "total" },
                            { 'name': "State", 'width': "85px", 'dataField': "state_text" },

                        ]
                    });
                    page.controls.grdBillReturn.dataBind([]);

                }
            },
            //Show grid for Payment
            selectedPayment: function (data) {
                page.controls.grdAllPayment.width("100%");
                page.controls.grdAllPayment.height("200px");
                page.controls.grdAllPayment.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Pay Type", 'width': "70px", 'dataField': "pay_type" },
                        { 'name': "Amount", 'width': "100px", 'dataField': "amount" },
                        { 'name': "Card Type", 'width': "100px", 'dataField': "card_type" },
                        { 'name': "Card No", 'width': "120px", 'dataField': "card_no" },
                        { 'name': "Coupon No", 'width': "85px", 'dataField': "coupon_no", visible: CONTEXT.ENABLE_COUPON_MODULE == "true", },
                        { 'name': "Points", 'width': "85px", 'dataField': "points", visible: CONTEXT.ENABLE_REWARD_MODULE == true, },
                        { 'name': "", 'width': "50px", 'dataField': "pay_type", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }

                    ]
                });
                //Handle Row Command
                page.controls.grdAllPayment.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    var amount = 0;
                    //To Handle removing an item from list.
                    if (action == "Delete") {
                        page.controls.grdAllPayment.deleteRow(rowId);
                        $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                            amount = parseFloat(data.amount) + parseFloat(amount);
                        });
                        $$("lblBalance").value(parseFloat(page.controls.lblTotal.value()) - parseFloat(amount));
                    }
                }
                //Bind the data
                page.controls.grdAllPayment.dataBind(data);
            }
        }


    });
}