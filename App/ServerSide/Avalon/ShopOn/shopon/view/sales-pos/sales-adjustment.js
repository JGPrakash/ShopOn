$.fn.salesAdjustment = function () {

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
        page.template("/" + appConfig.root + "/shopon/view/sales-pos/sales-adjustment.html");

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

        page.loadSelectedBill = function (bill, billAdjustment, callback) {

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
            $$("txtExpenseName").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length - 1].exp_name);
            $$("txtExpense").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length - 1].amount);
            //$$("txtExpense").value(bill.expense);
            /* if (bill.state_text == "Return") {
                 $$("btnReturnBill").hide();
             } else {
                 $$("btnReturnBill").show();
             }
             if (bill.state_text == "Saved") {
                 $$("btnDeleteBill").show();
             } else {
                 $$("btnDeleteBill").hide();
             }*/
            if (bill.state_text == "NewReturn" && !(billAdjustment)) {

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
            else if (billAdjustment) {
                $$("grdBill").width("100%");
                $$("grdBill").height("auto;min-height:150px;overflow-y:auto");
                page.controls.grdBillAdjustment.setTemplate({
                    selection: false,
                    columns: [
                        //{ 'name': "", 'width': "40px", 'dataField': "", visible: state_text == "NewBill" || state_text == "Saved", editable: false, itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },

                        { 'name': "Item No", 'width': "70px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "230px", 'dataField': "item_name" },
                        { 'name': "", 'width': "0px", 'dataField': "qty", editable: false },
                        { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: false },
                        { 'name': "Adjustment Qty", 'width': "120px", 'dataField': "adjustment_qty", editable: true },
                        { 'name': "Price", 'width': "120px", 'dataField': "price", editable: false },
                        { 'name': "Adjustment Price", 'width': "120px", 'dataField': "adjustment_price", editable: true },
                        { 'name': "Disc", 'width': "80px", 'dataField': "discount", visible: CONTEXT.ENABLE_DISCOUNT_MODULE },
                        { 'name': "GST", 'width': "60px", 'dataField': "tax_per", visible: CONTEXT.ENABLE_TAX_MODULE },
                        { 'name': "Amount", 'width': "90px", 'dataField': "total_price" },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: false, visible: CONTEXT.showFree },
                        { 'name': "Free Qty", 'width': "90px", 'dataField': "temp_free_qty", editable: false, visible: CONTEXT.showFree },
                        { 'name': "Tray", 'width': "90px", 'dataField': "tray_received", editable: false, visible: CONTEXT.ENABLE_MODULE_TRAY },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "HSN Code", 'width': "120px", 'dataField': "hsn_code", visible: false },
                        { 'name': "CGST", 'width': "60px", 'dataField': "cgst", visible: false },
                        { 'name': "SGST", 'width': "60px", 'dataField': "sgst", visible: false },
                        { 'name': "IGST", 'width': "60px", 'dataField': "igst", visible: false },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: false },
                        { 'name': "Cost Of Good", 'width': "110px", 'dataField': "cot_of_good", visible: false },
                        { 'name': "Mrp", 'width': "70px", 'dataField': "mrp", visible: false },
                        { 'name': "Stock", 'width': "90px", 'dataField': "qty_stock", editable: false, visible: false },
                        //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", visible: CONTEXT.POSShowStock },
                        { 'name': "Unit", 'width': "160px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//, visible: CONTEXT.POSShowStock },
                        { 'name': "Manufacture Date", 'width': "150px", 'dataField': "man_date", visible: false },
                        { 'name': "Expiry Date", 'width': "110px", 'dataField': "expiry_date", visible: false },
                        { 'name': "Batch No", 'width': "110px", 'dataField': "batch_no", visible: false },

                        { 'name': "", 'width': "0px", 'dataField': "qty_const", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "cost", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "price_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tax_inclusive", visible: false },
                    ]
                });
                page.controls.grdBillAdjustment.beforeRowBound = function (row, item) {
                    if (item.unit_identity == "1") {
                        $(row).find("[datafield=adjustment_qty]").find("input").val(item.qty / item.alter_unit_fact);
                        $(row).find("[datafield=temp_qty]").find("input").val(item.qty / item.alter_unit_fact);
                        $(row).find("[datafield=temp_free_qty]").find("input").val(item.free_qty / item.alter_unit_fact);
                    }
                    else {
                        $(row).find("[datafield=adjustment_qty]").find("input").val(item.qty);
                        $(row).find("[datafield=temp_qty]").find("input").val(item.qty);
                        $(row).find("[datafield=temp_free_qty]").find("input").val(item.free_qty);
                    }

                    $(row).find("[datafield=adjustment_price]").find("input").val(item.price);
                }
                page.controls.grdBillAdjustment.rowBound = function (row, item) {
                    if (item.unit_identity == "1")
                        item.price = (parseFloat(item.total_price) - parseFloat(item.discount)) / (parseFloat(item.qty) / parseFloat(item.alter_unit_fact));
                    else
                        item.price = (parseFloat(item.total_price) - parseFloat(item.discount)) / parseFloat(item.qty);

                    $(row).find("[datafield=price]").find("div").html(parseFloat(item.price));
                    row.on("change", "input[datafield=adjustment_qty]", function () {
                        page.adjustmentcalculate();
                    });
                    row.on("change", "input[datafield=adjustment_price]", function () {
                        page.adjustmentcalculate();
                    });
                }
                $$("grdBillAdjustment").dataBind(bill.billItems);
                $$("grdBillAdjustment").edit(true);
            }
            else {
                //CONTEXT.POSShowFree = true;
                //CONTEXT.POSShowStock = true;
                //CONTEXT.POSShowGST = true;
                page.pingGrid(page.selectedBill.state_text, bill.billItems);


                //Get Items with new tax data
                //page.msgPanel.show("Please Wait Your Product Is Loading....");
                //page.itemService.getItemAutoCompleteAllData("%", page.selectedBill.sales_tax_no, function (data) {
                //    var dataList = [];
                //    $(data).each(function (i, item) {
                //        // item.label = item.label + " <span style='margin:right:30px'><span> [MRP:" + item.price + "] <span style='margin:right:30px'><span> " + item.mrp
                //        if (parseFloat(item.qty_stock) != 0)
                //            dataList.push(item);
                //    });
                //    page.productList = dataList;
                //    page.msgPanel.show("Your Sale Is Ready");
                //    page.msgPanel.hide();
                //    //page.productList = data;
                //});

                var dataList = [];
                $(page.interface.currentProductList).each(function (i, item) {
                    // item.label = item.label + " <span style='margin:right:30px'><span> [MRP:" + item.price + "] <span style='margin:right:30px'><span> " + item.mrp
                    // if (parseFloat(item.qty_stock) != 0)
                    dataList.push(item);
                });
                page.productList = dataList;
            }

            $$("grdDiscount").dataBind(bill.discounts);
            $$("ddlSalesTax").selectedValue(bill.sales_tax_no);  //Should ser page.sales_tax  

            if (billAdjustment)
                bill.state_text = "Adjustment";
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
                        { 'name': "", 'width': "5%", 'dataField': "", visible: state_text == "NewBill" || state_text == "Saved", editable: false, itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },

                        { 'name': "Item No", 'width': "0px", 'dataField': "item_no", visible: false },
                        { 'name': "Item Name", 'width': "200px", 'dataField': "item_name" },
                        { 'name': "", 'width': "0px", 'dataField': "qty", editable: state_text == "NewBill" || state_text == "Saved", visible: false },
                        { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: state_text == "NewBill" || state_text == "Saved" },
                        { 'name': "Price", 'width': "80px", 'dataField': "price", editable: CONTEXT.SellingPriceEditable },
                        { 'name': "Disc", 'width': "80px", 'dataField': "discount", visible: CONTEXT.ENABLE_DISCOUNT_MODULE },
                        { 'name': "GST", 'width': "60px", 'dataField': "tax_per", visible: CONTEXT.ENABLE_TAX_MODULE },
                        { 'name': "Amount", 'width': "90px", 'dataField': "total_price" },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.showFree },
                        { 'name': "Free Qty", 'width': "90px", 'dataField': "temp_free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.showFree },
                        { 'name': "Tray", 'width': "90px", 'dataField': "tray_received", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.ENABLE_MODULE_TRAY },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "HSN Code", 'width': "0px", 'dataField': "hsn_code", visible: CONTEXT.POSShowGST && CONTEXT.showHsnCode, visible: false },
                        { 'name': "CGST", 'width': "0px", 'dataField': "cgst", visible: CONTEXT.POSShowGST, visible: false },
                        { 'name': "SGST", 'width': "0px", 'dataField': "sgst", visible: CONTEXT.POSShowGST, visible: false },
                        { 'name': "IGST", 'width': "0px", 'dataField': "igst", visible: CONTEXT.POSShowGST, visible: false },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "Variation", 'width': "0px", 'dataField': "variation_name", visible: CONTEXT.POSShowStock && CONTEXT.showVariation, visible: false },
                        { 'name': "Cost Of Good", 'width': "0px", 'dataField': "cot_of_good", visible: CONTEXT.POSShowStock && CONTEXT.showCostOfGoods, visible: false },
                        { 'name': "Mrp", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.POSShowStock && CONTEXT.ENABLE_MRP },
                        { 'name': "Stock", 'width': "70px", 'dataField': "qty_stock", editable: false, visible: CONTEXT.POSShowStock && CONTEXT.showStock },
                        //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", visible: CONTEXT.POSShowStock },
                        { 'name': "Unit", 'width': "70px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//, visible: CONTEXT.POSShowStock },
                        { 'name': "Manufacture Date", 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE && CONTEXT.POSShowStock },
                        { 'name': "Expiry Date", 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && CONTEXT.POSShowStock },
                        { 'name': "Batch No", 'width': "70px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && CONTEXT.POSShowStock },

                        { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no" },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                        { 'name': "", 'width': "0px", 'dataField': "cost" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                        { 'name': "", 'width': "0px", 'dataField': "price_no" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                    ]
                });
            }
            else {
                page.controls.grdBill.setTemplate({
                    selection: false,
                    columns: [
                        { 'name': "", 'width': "40px", 'dataField': "", visible: state_text == "NewBill" || state_text == "Saved", editable: false, itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },

                        { 'name': "Item No", 'width': "70px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "230px", 'dataField': "item_name" },
                        { 'name': "", 'width': "0px", 'dataField': "qty", editable: state_text == "NewBill" || state_text == "Saved" },
                        { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: state_text == "NewBill" || state_text == "Saved" },
                        { 'name': "Price", 'width': "120px", 'dataField': "price", editable: CONTEXT.SellingPriceEditable },
                        { 'name': "Disc", 'width': "80px", 'dataField': "discount", visible: CONTEXT.ENABLE_DISCOUNT_MODULE },
                        { 'name': "GST", 'width': "60px", 'dataField': "tax_per", visible: CONTEXT.ENABLE_TAX_MODULE },
                        { 'name': "Amount", 'width': "90px", 'dataField': "total_price" },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.showFree },
                        { 'name': "Free Qty", 'width': "90px", 'dataField': "temp_free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.showFree },
                        { 'name': "Tray", 'width': "90px", 'dataField': "tray_received", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.ENABLE_MODULE_TRAY },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "HSN Code", 'width': "120px", 'dataField': "hsn_code", visible: CONTEXT.POSShowGST && CONTEXT.showHsnCode },
                        { 'name': "CGST", 'width': "60px", 'dataField': "cgst", visible: CONTEXT.POSShowGST },
                        { 'name': "SGST", 'width': "60px", 'dataField': "sgst", visible: CONTEXT.POSShowGST },
                        { 'name': "IGST", 'width': "60px", 'dataField': "igst", visible: CONTEXT.POSShowGST },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.POSShowStock && CONTEXT.showVariation },
                        { 'name': "Cost Of Good", 'width': "110px", 'dataField': "cot_of_good", visible: CONTEXT.POSShowStock && CONTEXT.showCostOfGoods },
                        { 'name': "Mrp", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.POSShowStock && CONTEXT.ENABLE_MRP },
                        { 'name': "Stock", 'width': "90px", 'dataField': "qty_stock", editable: false, visible: CONTEXT.POSShowStock && CONTEXT.showStock },
                        //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", visible: CONTEXT.POSShowStock },
                        { 'name': "Unit", 'width': "160px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//, visible: CONTEXT.POSShowStock },
                        { 'name': "Manufacture Date", 'width': "150px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE && CONTEXT.POSShowStock },
                        { 'name': "Expiry Date", 'width': "110px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && CONTEXT.POSShowStock },
                        { 'name': "Batch No", 'width': "110px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && CONTEXT.POSShowStock },

                        { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no" },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                        { 'name': "", 'width': "0px", 'dataField': "cost" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                        { 'name': "", 'width': "0px", 'dataField': "price_no" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
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
                if (window.mobile) {
                    row.find("div[datafield=item_no]").css("display", "none");
                    row.find("div[datafield=cgst]").css("display", "none");
                    row.find("div[datafield=sgst]").css("display", "none");
                    row.find("div[datafield=igst]").css("display", "none");
                    row.find("div[datafield=variation_name]").css("display", "none");
                    row.find("div[datafield=cot_of_good]").css("display", "none");
                }
                //Check Expiry Alert
                //if (CONTEXT.ENABLE_EXP_ALERT) {
                //    //var today = new Date();
                //    //today.setDate(today.getDate() - parseInt(CONTEXT.ENABLE_EXP_ALERTDays));
                //    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                //        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                //            var EnteredDate = item.expiry_date;
                //            var date = "28";
                //            var month = EnteredDate.substring(0, 2);
                //            var year = EnteredDate.substring(3, 7);

                //            var myDate = new Date(year, month - 1, date);
                //            myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                //            today = new Date();
                //            today.setHours(0, 0, 0, 0);
                //            if (myDate <= today) {
                //                alert("This Product Will Be Expire On " + item.expiry_date);
                //                row[0].style.color = "orange";
                //            }
                //        }
                //    } else {
                //        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                //            var EnteredDate = item.expiry_date;
                //            var date = EnteredDate.substring(0, 2);
                //            var month = EnteredDate.substring(3, 5);
                //            var year = EnteredDate.substring(6, 10);

                //            var myDate = new Date(year, month - 1, date);
                //            myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                //            var today = new Date();
                //            today.setHours(0, 0, 0, 0);
                //            if (myDate <= today) {
                //                alert("This Product Will Be Expire On " + item.expiry_date);
                //                row[0].style.color = "orange";
                //            }

                //        }
                //    }
                //}

                //Check the expiry items or not
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        var EnteredDate = item.expiry_date;
                        var date = "28";
                        var month = EnteredDate.substring(0, 2);
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
                if (CONTEXT.POS_SHOW_STOCK_EMPTY_COLOR) {
                    if (parseInt(item.qty_stock) <= 0) {
                        row.find("div[datafield=variation_name]").css("color", "blue");
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

                $(row).find("[id=itemUnit]").change(function () {
                    if ($(row).find("[id=itemUnit]").val() == "0") {
                        item.qty = parseFloat(item.temp_qty);
                        if (isNaN(item.temp_qty)) {
                            item.temp_qty = 0;
                            item.qty = 0;
                        }
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty));
                        item.free_qty = parseFloat(item.temp_free_qty);
                        if (isNaN(item.temp_free_qty)) {
                            item.temp_free_qty = 0;
                            item.free_qty = 0;
                        }
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        item.unit_identity = 0;
                        $(row).find("[datafield=unit_identity]").find("div").html(0);
                    } else {
                        item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                        if (isNaN(item.temp_qty)) {
                            item.temp_qty = 0;
                            item.qty = 0;
                        }
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                        item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                        if (isNaN(item.temp_free_qty)) {
                            item.temp_free_qty = 0;
                            item.free_qty = 0;
                        }
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact));
                        item.unit_identity = 1;
                        $(row).find("[datafield=unit_identity]").find("div").html(1);
                    }
                    page.calculate();
                });

                if (item.unit_identity == "1") {
                    item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.temp_free_qty)) {
                        item.temp_free_qty = 0;
                        item.free_qty = 0;
                    }
                    $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));

                    item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.temp_free_qty)) {
                        item.temp_free_qty = 0;
                        item.free_qty = 0;
                    }
                    $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_free_qty));

                    $(row).find("[id=itemUnit]").val(1);
                }

                row.on('keyup keydown keypress onDOMAttrModified propertychange change', "input[dataField=qty]", function (evt) {
                    row.find("[dataField=total_price]").children("div").html(parseInt(row.find("[dataField=price]").children("div").html()) * parseInt(row.find("input[dataField=qty]").val()));
                });
                $(row).find("[datafield=qty] input").css("width", "40px");
                $(row).find("[datafield=item_name] input").css("width", "175px");
                $(row).find("[datafield=discount]").attr("action", "discount");
                row.on("click", "[datafield=discount]", function () {
                    page.controls.pnlItemDiscountPopup.open();
                    page.controls.pnlItemDiscountPopup.title("Discount(s) Applied For Item:" + item.item_name + "");
                    page.controls.pnlItemDiscountPopup.width(1000);
                    page.controls.pnlItemDiscountPopup.height(400);

                    page.controls.grdItemDiscount.width("100%");
                    page.controls.grdItemDiscount.height("220px");
                    page.controls.grdItemDiscount.setTemplate({
                        selection: "Single",

                        columns: [
                            { 'name': "Disc No", 'width': "100px", 'dataField': "disc_no" },
                            { 'name': "Disc Name", 'width': "200px", 'dataField': "disc_name" },
                            { 'name': "Disc Type", 'width': "150px", 'dataField': "disc_type" },
                            { 'name': "Disc Value", 'width': "150px", 'dataField': "disc_value" },
                            { 'name': "Item No", 'width': "150px", 'dataField': "item_no" },
                        ]
                    });
                    page.discount_item_no = item.item_no;
                    page.discount_item_variation_name = item.variation_name;
                    var itemDisount = [];
                    $(page.selectedBill.discounts).each(function (i, data) {
                        if (typeof data.item_no == "undefined" || item.item_no == data.item_no) {
                            itemDisount.push(data);
                        }
                    });
                    page.controls.grdItemDiscount.dataBind(itemDisount);

                    if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {

                        $$("btnItemDiscountOK").show();

                    }
                    else {
                        $$("btnItemDiscountOK").hide();

                    }
                });
                //row.on("change", "input[datafield=qty]", function () {
                //    if (item.qty_type == "Integer")
                //        $(this).val(parseInt($(this).val()));
                //    page.calculate();
                //});
                row.on("change", "input[datafield=price]", function () {
                    if (item.qty_type == "Integer")
                        $(this).val(parseInt($(this).val()));
                    page.calculate();
                });
                row.on("change", "input[datafield=temp_qty]", function () {
                    if ($(row).find("[id=itemUnit]").val() == "0") {
                        item.qty = parseFloat(item.temp_qty);
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty))
                    } else {
                        item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact))
                    }
                    page.calculate();
                    var ori_stock = parseFloat(item.qty_const) - (parseFloat(item.qty) + parseFloat(item.free_qty));
                    item.qty_stock = parseFloat(ori_stock).toFixed(2);
                    $(row).find("[datafield=qty_stock]").find("div").html(ori_stock.toFixed(2));
                });
                //row.on("focus", "input[datafield=qty]", function () {
                //    $(this).select();
                //});
                row.on("change", "input[datafield=temp_free_qty]", function () {
                    if ($(row).find("[id=itemUnit]").val() == "0") {
                        item.free_qty = parseFloat(item.temp_free_qty);
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty))
                    } else {
                        item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact))
                    }
                    if (item.qty_type == "Integer")
                        $(this).val(parseInt($(this).val()));
                    page.calculate();
                    var ori_stock = parseFloat(item.qty_const) - (parseFloat(item.qty) + parseFloat(item.free_qty));
                    item.qty_stock = parseFloat(ori_stock).toFixed(2);
                    $(row).find("[datafield=qty_stock]").find("div").html(ori_stock.toFixed(2));
                });
                //row.on("keydown", "input[datafield=qty]", function (e) {
                //    if (e.which == 9) {
                //        e.preventDefault();
                //        var nextRow = $(this).closest("grid_row").next();
                //        if (nextRow.length == 0) {
                //             page.controls.txtItemSearch.selectedObject.focus();
                //            //nextRow.find("input[datafield=price]").focus();
                //        } else {
                //            page.controls.txtItemSearch.selectedObject.focus();
                //            //nextRow.find("input[datafield=qty]").focus();
                //            //nextRow.find("input[datafield=price]").focus();
                //        }

                //    }
                //});
                row.on("keydown", "input[datafield=temp_qty]", function (e) {
                    if (e.which == 9) {
                        e.preventDefault();
                        var nextRow = $(this).closest("grid_row").next();
                        if (nextRow.length == 0) {
                            page.controls.txtItemSearch.selectedObject.focus();
                            //nextRow.find("input[datafield=price]").focus();
                        } else {
                            page.controls.txtItemSearch.selectedObject.focus();
                            //nextRow.find("input[datafield=price]").focus();
                        }

                    }
                });
                row.on("keydown", "input[datafield=price]", function (e) {
                    if (e.which == 9) {
                        e.preventDefault();
                        var nextRow = $(this).closest("grid_row").next();
                        if (nextRow.length == 0) {
                            page.controls.txtItemSearch.selectedObject.focus();
                        } else {
                            //nextRow.find("input[datafield=qty]").focus();
                            nextRow.find("input[datafield=temp_qty]").focus();
                        }

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


            //Bill level discount + Item level discounts
            page.controls.grdDiscount.dataBind(page.selectedBill.discounts);

            //Item level discount +  Item level discount applied to all items
            var itemDiscounts = arr = jQuery.grep(page.selectedBill.discounts, function (dis, i) {
                if (dis.disc_level == "Item") {
                    if (typeof dis.item_no == "undefined" || dis.item_no == undefined || dis.item_no == "" || dis.item_no == null)
                        return true;
                    else if (dis.item_no == page.discount_item_no)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            });
            page.controls.grdItemDiscount.dataBind(itemDiscounts);



            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;
            //var comm_tax = 0;

            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var item_no = parseFloat($(row).find("[datafield=item_no]").find("div").html());
                if (CONTEXT.SellingPriceEditable) {
                    var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    }
                } else {
                    var price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    }
                }

                // var qty = parseFloat($(row).find("[datafield=qty]").find("input").val());
                //var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                var qty = $(row).find("[datafield=qty]").find("div").html();
                var qty_stock = $(row).find("[datafield=qty_stock]").find("div");
                var qty_val = parseFloat($(row).find("[datafield=qty_const]").find("div").html());
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var txtDiscount = $(row).find("[datafield=discount]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());
                var variation_name = $(row).find("[datafield=variation_name]").find("div").html();
                var cgst = $(row).find("[datafield=cgst]").find("div");
                var sgst = $(row).find("[datafield=sgst]").find("div");
                var tax_inclusive = $(row).find("[datafield=tax_inclusive]").find("div").html();

                //if(CONTEXT.showVariation){
                //    var variation_name = $(row).find("[datafield=variation_name]").find("input").val();
                //}else{
                //    var variation_name = $(row).find("[datafield=variation_name]").find("div").html();
                //}

                page.controls.grdBill.getRowData(row)
                var alldata = page.controls.grdBill.allData();
                var free_qty;
                $(alldata).each(function (index, item) {
                    if (i == index) {
                        free_qty = parseFloat(item.free_qty);
                    }
                });



                if (isNaN(qty_val))
                    qty_val = parseFloat($(row).find("[datafield=qty_stock]").find("div").html());

                if (isNaN(free_qty))
                    free_qty = 0;


                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = parseFloat(item.tax_per);

                        }
                    });
                    return rdata;
                }
                var tax = parseFloat(getTaxPercent(tax_class_no));// + parseFloat(txtTax.html());
                //tax = tax;


                var discount = 0; //calculate using rules in future
                var count = 1;
                $(page.selectedBill.discounts).each(function (j, data) {

                    if (data.item_no == item_no) {
                        //Discount for all items
                        if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {

                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                discount = discount + ((price * qty) * data.disc_value / 100);

                            }

                        } else if (data.item_no == item_no) {
                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                //discount = discount + txtAmountVal * data.disc_value / 100;
                                discount = discount + ((price * qty) * data.disc_value / 100);
                            }

                        }
                    }
                    else if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed")
                            discount = discount + data.disc_value * qty;
                        else if (data.disc_type == "Percent") {
                            discount = discount + ((price * qty) * data.disc_value / 100);
                        }
                    }

                });


                tot_discount = tot_discount + discount;
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    if (tax_inclusive == "1")
                        price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1);
                    else
                        price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                } else {
                    price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                var qty_price = (price * qty);
                sub_total = sub_total + qty_price;
                // var disc_price = qty_price - discount
                //var tax_amount = (disc_price * tax / 100);
                var tax_amount = (qty_price * tax / 100);
                tot_sales_tax = tot_sales_tax + tax_amount;
                //var amount = disc_price + tax_amount;
                var amount = qty_price + tax_amount;
                var rem_qty = qty_val - qty - parseFloat(free_qty);

                txtTax.html(tax);
                cgst.html(parseFloat(tax) / 2);
                sgst.html(parseFloat(tax) / 2);
                //$(row).find("[datafield=cgst]").find("div").html(parseFloat(tax) / 2);
                //$(row).find("input[datafield=cgst]").html(parseFloat(tax) / 2);
                //$(row).find("[datafield=sgst]").find("div").html(parseFloat(tax) / 2);
                //$(row).find("input[datafield=sgst]").html(parseFloat(tax) / 2);
                txtDiscount.html(parseFloat(discount).toFixed(2));
                txtAmount.html(parseFloat(amount).toFixed(2));

                var currentData = page.controls.grdBill.getRowData(row); //set the grid value
                currentData.tax_per = tax;
                currentData.discount = discount;
                currentData.total_price = amount;
                //currentData.disc_no = page.discount.disc_no;
            });
            //Show the subtotal
            page.controls.lblSubTotal.value(parseFloat(sub_total).toFixed(2));

            //var billdiscountval = 0;
            //var billdiscountper = 0
            //var comm_tax = 0;
            //var comm_tax_per = 0;
            //$(page.selectedBill.discounts).each(function (j, data) {

            //    //    if (data.disc_level == "Bill") {

            //    //if discount typ is bill -> add to bill disc
            //    if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {

            //        if (data.disc_type == "Fixed")
            //            billdiscountval = billdiscountval + parseFloat(data.disc_value);
            //        else if (data.disc_type == "Percent") {
            //            billdiscountval = billdiscountval + (parseFloat(page.controls.lblSubTotal.value()) * data.disc_value / 100);
            //        }

            //    }
            //    //     }
            //});
            //tot_discount = tot_discount + billdiscountval;

            //$(page.controls.grdTax.allData()).each(function (j, items) {
            //    if (items.sales_tax_value != null)
            //        comm_tax_per = parseFloat(comm_tax_per) + parseFloat(items.sales_tax_value);
            //})
            //comm_tax = ((parseFloat(page.controls.lblSubTotal.value()) - tot_discount) * comm_tax_per / 100);

            total = sub_total + tot_sales_tax;// - tot_discount;

            var data = page.controls.grdBill.allData();
            // page.controls.lblSubTotal.value(parseFloat(sub_total).toFixed(2));
            page.controls.lblDiscount.value(parseFloat(tot_discount).toFixed(2));
            page.controls.lblTax.value(parseFloat(tot_sales_tax).toFixed(2));

            var total_after_Rnd_off = Math.round(parseFloat(total)); total_after_Rnd_off
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(total)).toFixed(2);

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
                var result = "";
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + ",";
                }
                $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=unit]").html(result);
            }

            //result.push(temp[prop]);
            //var f_unit = 0;
            //var f_unit_name ="";
            //var s_unit = 0;
            //var s_unit_name="";
            //$(alldataqty).each(function (i, items) {
            //    if (items.unit_identity == 0) {
            //        f_unit_name = (items.unit == undefined || items.unit == null) ? "" : items.unit;
            //        f_unit = f_unit + items.qty;
            //    } else {
            //        s_unit_name = (items.alter_unit == undefined || items.alter_unit == null) ? "" : items.alter_unit;
            //        s_unit = s_unit + items.qty;
            //    }
            //});
            //var t_qty = f_unit + "" + f_unit_name + "  " + s_unit + "" + s_unit_name;
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());


        }

        page.adjustmentcalculate = function (callback) {
            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;

            $(page.controls.grdBillAdjustment.getAllRows()).each(function (i, row) {
                var item_no = parseFloat($(row).find("[datafield=item_no]").find("div").html());

                if (CONTEXT.SellingPriceEditable) {
                    var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    }
                } else {
                    var price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    }
                }
                //GET THE QTY AND PRICE
                var adjustment_qty = $(row).find("[datafield=adjustment_qty]").find("input").val();
                var adjustment_price = $(row).find("[datafield=adjustment_price]").find("input").val();
                var qty = $(row).find("[datafield=qty]").find("div").html();
                if (isNaN(parseFloat(qty)))
                    qty = 0;
                if (isNaN(parseFloat(adjustment_qty)))
                    adjustment_qty = 0;
                if (isNaN(parseFloat(adjustment_price)))
                    adjustment_price = 0;
                qty = parseFloat(qty) - parseFloat(adjustment_qty);
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());
                var tax_inclusive = $(row).find("[datafield=tax_inclusive]").find("div").html();

                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = parseFloat(item.tax_per);
                        }
                    });
                    return rdata;
                }
                var tax = parseFloat(getTaxPercent(tax_class_no));// + parseFloat(txtTax.html());

                var qty_price = (parseFloat(price) * parseFloat(qty)) + ((parseFloat(price) + parseFloat(adjustment_price)) * parseFloat(adjustment_qty));
                sub_total = sub_total + qty_price;
                var tax_amount = (qty_price * tax / 100);
                tot_sales_tax = tot_sales_tax + tax_amount;
                var amount = qty_price + tax_amount;

                txtTax.html(tax);

                txtAmount.html(parseFloat(amount).toFixed(2));

                //var currentData = page.controls.grdBill.getRowData(row); //set the grid value
                //currentData.tax_per = tax;
                //currentData.discount = discount;
                //currentData.total_price = amount;
            });
            //Show the subtotal
            page.controls.lblSubTotal.value(parseFloat(sub_total).toFixed(2));

            total = sub_total + tot_sales_tax;// - tot_discount;

            var data = page.controls.grdBill.allData();
            page.controls.lblDiscount.value(parseFloat(tot_discount).toFixed(2));
            page.controls.lblTax.value(parseFloat(tot_sales_tax).toFixed(2));

            var total_after_Rnd_off = Math.round(parseFloat(total)); total_after_Rnd_off
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(total)).toFixed(2);

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
        page.insertBill = function (bill_type, pay_mode, callback) {
            try {
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

                    bill_type: "SaleAdjustment",
                    state_no: "200",
                    sales_tax_no: page.selectedBill.sales_tax_no,
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
                    bill_no_par: (bill_type == "Return") ? page.selectedBill.bill_no : "",
                    pay_mode: $$("ddlPayType").selectedValue(),
                    bill_barcode: "",//Check It
                    sales_executive: $$("ddlDeliveryBy").selectedValue(),
                    //FINFACTS ENTRY DATA
                    invent_type: "SaleCredit",
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    //fulfill: true,
                };
                var rbillItems = [];
                $(page.controls.grdBillAdjustment.allData()).each(function (i, billItem) {
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
                        qty: parseFloat(billItem.adjustment_qty),
                        free_qty: billItem.free_qty,
                        unit_identity: billItem.unit_identity,
                        price: billItem.adjustment_price,
                        discount: billItem.discount,
                        taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                        tax_per: billItem.tax_per,
                        total_price: billItem.total_price,
                        price_no: billItem.price_no,
                        bill_type: bill_type,
                        tax_class_no: billItem.tax_class_no,

                        hsn_code: billItem.hsn_code,
                        cgst: parseFloat(billItem.tax_per / 2),
                        sgst: parseFloat(billItem.tax_per / 2),
                        igst: billItem.igst,
                        tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined") ? "0" : billItem.tray_received,
                        cost: billItem.cost,
                        amount: parseFloat(billItem.cost) * parseFloat(billItem.qty)
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
                        pay_type: "Sale",
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
                        pay_type: "Sale",
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
                            pay_type: "Sale",
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
                    var currentBillNo = data;
                    if (bill_type == "Sale") {
                        if (page.controls.ddlPayType.selectedValue() == "Loan") {
                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                //page.inventoryService.insertStocks(0,newBill.bill_items, currentBillNo, function (temp) { });
                                if (bill_type == "Sale") {
                                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                                    var data1 = {
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        description: "POS-" + currentBillNo,
                                        target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                        buying_cost: buying_cost,
                                        round_off: $$("lblRndOff").value(),

                                        key_1: currentBillNo,
                                        key_2: $$("txtCustomerName").selectedValue(),
                                    };
                                    page.msgPanel.show("Updating Finfacts...");
                                    page.finfactsEntry.creditSales(data1, function (response) {
                                        callback(currentBillNo);
                                        if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                            var expenseData1 = {
                                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                                                expense_acc_id: CONTEXT.ExpenseCategory,
                                                amount: $$("txtExpense").value() == "" ? 0 : $$("txtExpense").value(),
                                                description: "POS Expense-" + currentBillNo,
                                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                                key_1: currentBillNo,
                                                key_2: $$("txtCustomerName").selectedValue(),
                                            };
                                            page.accService.insertExpense(expenseData1, function (response) { });
                                        }
                                        page.msgPanel.show("POS payment is recorded successfully.");
                                        page.msgPanel.hide();
                                    });
                                }
                                else {
                                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                                    var data1 = {
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                        description: "POS Return-" + currentBillNo,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        buying_cost: buying_cost,
                                        key_1: currentBillNo,
                                    };
                                    page.msgPanel.show("Updating Finfacts...");
                                    page.finfactsService.creditReturnSales(data1, function (response) {
                                        callback(currentBillNo);
                                        page.msgPanel.show("POS payment is returned successfully.");
                                        page.msgPanel.hide();
                                    });
                                }
                            } else {
                                page.msgPanel.show("POS payment is recorded successfully.");
                                callback(currentBillNo);
                                page.msgPanel.hide();
                            }
                        }
                        else {
                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                // page.inventoryService.insertStocks(0,newBill.bill_items,currentBillNo, function (temp) { });
                                if (bill_type == "Sale") {
                                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                                    var data1 = {
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        description: "POS-" + currentBillNo,
                                        target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                        buying_cost: buying_cost,
                                        round_off: $$("lblRndOff").value(),
                                        key_1: currentBillNo,
                                        key_2: $$("txtCustomerName").selectedValue(),

                                    };
                                    page.msgPanel.show("Updating Finfacts...");
                                    page.finfactsEntry.cashSales(data1, function (response) {
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
                                        page.msgPanel.hide();
                                    });
                                }
                                else {
                                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value())) - parseFloat(page.controls.lblRndOff.value());
                                    var data1 = {
                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(2),
                                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(2),
                                        description: "POS Return-" + currentBillNo,
                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                        key_1: currentBillNo,
                                    };
                                    page.msgPanel.show("Updating Finfacts...");
                                    page.finfactsService.cashReturnSales(data1, function (response) {
                                        callback(currentBillNo);
                                        page.msgPanel.show("POS payment is returned successfully.");
                                        page.msgPanel.hide();

                                    });
                                }
                                callback(currentBillNo);
                            } else {
                                page.msgPanel.show("POS payment is recorded successfully.");
                                callback(currentBillNo);
                                page.msgPanel.hide();
                            }
                        }
                    } else {
                        callback(currentBillNo);
                    }

                });
            } catch (e) {
                alert(e);
            }
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
                                //page.customerList = data;
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
                                trans_type: "Customer Sales",
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
            page.loadSelectedBill(newBill, false, function () {
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

        page.interface.viewBill = function (billNo, billAdjustment) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            if (CONTEXT.RESTAPI) {
                page.stockAPI.getSalesBill(page.currentBillNo, function (data) {
                    var bill = data;
                    var openBill = {
                        cust_no: bill.cust_no,
                        cust_name: bill.cust_name,
                        email: bill.email_id,
                        phone_no: bill.phone_no,
                        address: bill.address.replace(/-/g, ","),
                        sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,
                        sub_total: bill.sub_total,
                        round_off: bill.round_off,
                        total: bill.total,
                        discount: bill.discount,
                        tax: bill.tax,
                        bill_no: bill.bill_no,
                        bill_date: bill.bill_date,
                        state_text: bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                        //expense: bill.expense,
                        gst_no: bill.gst_no,
                        expenses: bill.expenses,
                        sales_executive: bill.sales_executive,
                    };
                    page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
                        openBill.sales_tax_class = sales_tax_class;
                        openBill.billItems = bill.bill_items;
                        page.msgPanel.show("Getting Bill Discounts...");
                        page.billService.getAllBillDiscount(openBill.bill_no, function (discounts) {
                            openBill.discounts = [];
                            $(discounts).each(function (i, item) {
                                openBill.discounts.push({
                                    disc_no: item.disc_no,
                                    disc_type: item.value_type,
                                    disc_name: item.disc_name,
                                    disc_value: item.value,
                                    item_no: item.item_no
                                });
                            });
                            page.msgPanel.show("Loading data...");
                            page.loadSelectedBill(openBill, billAdjustment, function () {
                                if (openBill.state_text == "Saved")
                                    page.calculate();
                                if (bill.state_text == "Sale") {
                                    page.billService.getBillReturn(openBill.bill_no, function (data) {
                                        if (data.length > 0) {
                                            page.controls.grdBillReturn.display("");
                                            page.controls.grdBillReturn.dataBind(data);
                                        }
                                    });
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());

                                }
                                if (bill.state_text == "Return") {
                                    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                                    page.billService.getBillSale(openBill.bill_no, function (data) {
                                        if (data.length > 0) {
                                            page.controls.grdBillReturn.display("");
                                            page.controls.grdBillReturn.dataBind(data);
                                        }
                                    });
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());

                                }
                                page.billService.getBillByNo(page.currentBillNo, function (data) {
                                    $$("ddlPayType").selectedValue(data[0].pay_type);
                                });
                                page.msgPanel.flash("Bill is opened...");
                            });
                        });
                    });
                });
            }
            else {
                page.billService.getBill(page.currentBillNo, function (data) {
                    var bill = data[0];
                    var openBill = {
                        cust_no: bill.cust_no,
                        cust_name: bill.cust_name,
                        email: bill.email_id,

                        phone_no: bill.phone_no,
                        address: bill.address.replace(/-/g, ","),
                        sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,

                        sub_total: bill.sub_total,
                        round_off: bill.round_off,
                        total: bill.total,
                        discount: bill.discount,
                        tax: bill.tax,
                        //billItems: [],
                        //discounts: [],
                        bill_no: bill.bill_no,
                        bill_date: bill.bill_date,
                        state_text: bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                        //expense: bill.expense,
                        gst_no: bill.gst_no
                    };

                    page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
                        openBill.sales_tax_class = sales_tax_class;

                        page.billService.getBillItem(openBill.bill_no, function (billItems) {
                            openBill.billItems = billItems;

                            page.msgPanel.show("Getting Bill Discounts...");
                            page.billService.getAllBillDiscount(openBill.bill_no, function (discounts) {
                                openBill.discounts = [];
                                $(discounts).each(function (i, item) {
                                    openBill.discounts.push({
                                        disc_no: item.disc_no,
                                        disc_type: item.value_type,
                                        disc_name: item.disc_name,
                                        disc_value: item.value,
                                        item_no: item.item_no
                                    });
                                });


                                page.msgPanel.show("Loading data...");
                                page.loadSelectedBill(openBill, billAdjustment, function () {

                                    //Recalculae for only saved type
                                    if (openBill.state_text == "Saved")
                                        page.calculate();

                                    if (bill.state_text == "Sale") {
                                        //Show return bills if any
                                        //page.billService.getBillReturn(openBill.bill_no, function (data) {
                                        //    if (data.length > 0) {
                                        //        page.controls.grdBillReturn.display("");
                                        //        page.controls.grdBillReturn.dataBind(data);
                                        //    }

                                        //});

                                        // $$("btnReturn").show();
                                        page.calculate();
                                    }
                                    page.billService.getBillByNo(page.currentBillNo, function (data) {
                                        $$("ddlPayType").selectedValue(data[0].pay_type);
                                    });
                                    // page.pingGrid();
                                    page.msgPanel.flash("Bill is opened...");
                                });

                            });

                        });
                    });
                });
            }
        }
        page.events.page_load = function () {

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
                } else { }
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
                page.controls.lblEmailId.value((typeof item.email == "undefined") ? "" : item.email);
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
                                price_no: item.price_no == null ? "0" : item.price_no
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
            if (CONTEXT.ENABLE_COUPON_MODULE == "true")
                payModeType.push({ mode_type: "Coupon" })
            page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
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
                    page.insertBill("Sale", "Mixed", function (currentBillNo) {
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
            var item_count = true;
            try {
                $(page.controls.grdBillAdjustment.allData()).each(function (i, items) {
                    if (parseFloat(items.adjustment_qty) > parseFloat(items.qty)) {
                        if (item_count) {
                            if (CONTEXT.EnableStockMaintainence)
                                if (!confirm("Item Quanity cannot not be higher than stock level for " + items.item_name + ""))
                                    throw "Please remove the item " + items.item_name + " to continue sales.";
                            item_count = false;
                        }
                    }
                    if (parseFloat(items.adjustment_qty) <= 0 || items.adjustment_qty == undefined || items.adjustment_qty == null || items.adjustment_qty == "")// || isNaN(items.qty))
                        throw "Adjustment Qty should be number and positive";
                    if (parseFloat(items.free_qty) < 0 || (items.free_qty == "" && items.free_qty != 0) || isNaN(items.free_qty))
                        throw "Item free qty should be number and positive";
                    if (items.free_qty == null || items.free_qty == undefined)
                        items.free_qty = 0;
                    if (items.tray_received == undefined || items.tray_received == null || items.tray_received == "")
                        items.tray_received = 0;
                    if (parseFloat(items.tray_received) < 0 || isNaN(items.tray_received))
                        throw "Tray qty should be number and positive";
                });
                if ($$("txtExpense").value() != "" && $$("txtExpense").value() != 0 && !isInt($$("txtExpense").value())) {
                    page.expense = false;
                } else
                    page.expense = true;
                if (err_count == 0) {
                    if (page.controls.grdBillAdjustment.allData().length == 0) {
                        alert("No item(s) can be sale");
                    }
                    else if ($$("ddlPayType").selectedValue() == "Mixed") {
                        page.events.btnPay_now_click();
                    }
                    else if ($$("ddlPayType").selectedValue() == "Points") {
                        try {
                            if (page.controls.txtCustomerName.selectedObject.val() == "" || page.controls.txtCustomerName.selectedObject.val() == null || page.controls.txtCustomerName.selectedObject.val() == undefined)
                                throw "Customer should be selected";
                            if (page.controls.lblAvalablePoints.value() == "" || page.controls.lblAvalablePoints.value() == null || page.controls.lblAvalablePoints.value() == undefined)
                                throw "Customer should have the points";
                            if (parseFloat(page.controls.lblTotal.value()) > parseFloat(page.controls.lblAvalablePoints.value()) / 4)
                                throw "Customer should not have the enought points"
                            if (CONTEXT.RESTAPI) {
                                page.insertBill("Sale", "Rewards", function (currentBillNo) {
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
                        } catch (e) {
                            ShowDialogBox('Warning', e, 'Ok', '', null);
                        }
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
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        }
        page.events.btnAdjust_click = function () {
            var err_count = 0;
            var item_count = true;
            try {
                $(page.controls.grdBillAdjustment.allData()).each(function (i, items) {
                    if (parseFloat(items.adjustment_qty) > parseFloat(items.qty)) {
                        err_count++;
                        throw "Please check the item " + items.item_name + " to continue sales.";
                    }
                    if (parseFloat(items.adjustment_qty) < 0 || isNaN(parseFloat(items.adjustment_qty))) {
                        err_count++;
                        throw "Item Qty Should be number and non negative for item" + items.item_name + "";
                    }
                    if (isNaN(parseFloat(items.adjustment_price))) {
                        err_count++;
                        throw "Item Price Should be number for item" + items.item_name + "";
                    }
                    if (parseFloat(items.qty) <= 0 || items.qty == undefined || items.qty == null || items.qty == "")// || isNaN(items.qty))
                        throw "Qty should be number and positive";
                    if (items.free_qty == null || items.free_qty == undefined)
                        items.free_qty = 0;
                    if (items.tray_received == undefined || items.tray_received == null || items.tray_received == "")
                        items.tray_received = 0;
                    if (parseFloat(items.tray_received) < 0 || isNaN(items.tray_received))
                        throw "Tray qty should be number and positive";
                });
                if (err_count == 0) {
                    if (page.controls.grdBillAdjustment.allData().length == 0) {
                        alert("No item(s) can be sale");
                    }
                    if (CONTEXT.RESTAPI) {
                        page.insertBill("Sale", "Cash", function (currentBillNo) {
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

            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
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
                    if (page.controls.txtCustomerName.selectedValue() == null || page.controls.txtCustomerName.selectedValue() == "" || typeof page.controls.txtCustomerName.selectedValue() == "undefined") {
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
                    if (page.controls.lblPhoneNo.value() == "" || page.controls.lblPhoneNo.value() == null || typeof page.controls.lblPhoneNo.value() == "undefined") {
                        error_count++;
                        throw "Customer mobile number not provided";
                    }
                    if (error_count == 0) {
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
                    $$("btnAdjust").hide();
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
                    $$("btnAdjust").hide();
                }
                if (state == "Sale") {
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
                    //TODO : show if return is there
                    // $$("btnSendEmail").show();
                    $$("txtBillDate").disable(true);
                    $$("grdBillAdjustment").hide();
                    $$("btnAdjust").hide();
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
                    $$("btnAdjust").hide();
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
                    $$("btnAdjust").hide();
                }

                if (state == "Adjustment") {
                    $$("btnReturn").hide();
                    $$("btnSave").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").hide();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").hide();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("grdBillAdjustment").show();
                    $$("chkShowFree").hide();
                    $$("chkShowStock").hide();
                    $$("chkShowGst").hide();
                    $$("btnAdjust").show();
                    $$("lblFree").hide();
                    $$("lblFreeStock").hide();
                    $$("lblGst1").hide();
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