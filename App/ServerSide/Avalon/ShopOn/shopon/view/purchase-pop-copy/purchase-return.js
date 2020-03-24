$.fn.purchaseReturn = function () {

    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.billService = new BillService();
        page.accService = new AccountingService();
        page.salesService = new SalesService();
        page.finfactsService = new FinfactsService();
        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.settingService = new SettingService();
        page.rewardService = new RewardService();
        page.vendorService = new VendorService();
        page.purchaseBillService = new PurchaseBillService();
        page.finfactsEntry = new FinfactsEntry();
        page.stockService = new StockService();
        page.taxclassService = new TaxClassService();
        page.stockAPI = new StockAPI();
        page.template("/" + appConfig.root + "/shopon/view/purchase-pop/purchase-return.html");

        page.interface.currentProductList = null;
        page.selectedBill = null;
        page.productList = [];
        page.manualDiscountValue = 0;
        page.variation_data = {};
        page.selectedPayment = {};
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

            $$("txtVendorName").customText(bill.vendor_name);
            $$("hdnVendorNo").val(bill.vendor_no);
            $$("lblPhoneNo").value(bill.phone_no);
            $$("lblAddress").value(bill.address);
            $$("lblEmail").value(bill.email);
            $$("lblRndOff").value(bill.round_off);
            $$("lblBillNo").value(bill.bill_no);
            $$("txtBillDate").setDate(nvl(bill.bill_date, ""));

            $$("lblSubTotal").value(bill.sub_total);
            $$("lblTotal").value(bill.total);
            page.interface.setBillAmount(bill.total);
            $$("lblDiscount").value(bill.discount);
            $$("lblTax").value(bill.tax);
            $$("lblGst").value(bill.gst_no);

            //Expense
            $$("ddlExpName").selectedValue((bill.expenses == undefined) ? "-1" : (bill.expenses.length == 0) ? "-1" : bill.expenses[bill.expenses.length - 1].exp_name);
            $$("txtExpAmount").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length - 1].amount);
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
            if (bill.state_text == "NewReturn") {

                $$("grdReturnItemSelection").width("100%");
                $$("grdReturnItemSelection").height("220px");
                $$("grdReturnItemSelection").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Item No", 'width': "80px", 'dataField': "item_no" },
                           { 'name': "Item Name", 'width': "180px", 'dataField': "item_name" },
                           { 'name': "Qty", 'width': "70px", 'dataField': "qty", },
                           { 'name': "Free Qty", 'width': "100px", 'dataField': "free_qty", },
                           { 'name': "Unit", 'width': "80px", 'dataField': "unit" },
                           { 'name': "Cost", 'width': "80px", 'dataField': "price", },
                           { 'name': "Disc %", 'width': "80px", 'dataField': "disc_per", },
                           { 'name': "Disc Value", 'width': "90px", 'dataField': "disc_val", },
                           { 'name': "Tax %", 'width': "70px", 'dataField': "tax_per", },
                           { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", },
                           { 'name': "Batch No", 'width': "100px", 'dataField': "batch_no", },
                           { 'name': "MRP", 'width': "70px", 'dataField': "mrp", },
                           { 'name': "Selling Price", 'width': "120px", 'dataField': "selling_price", },
                           { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                           { 'name': "Buying Cost", '90px': "100px", 'dataField': "buying_cost" },
                        { 'name': "", 'width': "50px", 'dataField': "", visible: false, editable: false, itemTemplate: "<input type='button' value='Send Email' action='SendEmail' control='purchasePOP.primaryWriteButton' controlid='btnSendMail' event='click:btnSendMail_click'/>" }
                    ]
                });
                $$("grdReturnItemSelection").dataBind(bill.billItems);
                //$$("grdReturnItemSelection").selectionChanged = function (row, rowId) {
                //    var total = 0;
                //    var sub_total = 0;
                //    var discount = 0;
                //    var tax = 0;
                //    $(page.controls.grdReturnItemSelection.selectedData()).each(function (i, item) {
                //        total = parseFloat(parseFloat(total) + parseFloat(item.total_price)).toFixed(2);
                //        sub_total = parseFloat(parseFloat(sub_total) + parseFloat(item.price)).toFixed(2);
                //        discount = parseFloat(parseFloat(discount) + parseFloat(item.discount)).toFixed(2);

                //        tax = parseFloat(parseFloat(tax) + (parseFloat(item.price) * parseFloat(item.qty) - parseFloat(item.total_price) - parseFloat(item.discount))).toFixed(2);
                //    });

                //    page.controls.lblSubTotal.value(sub_total);
                //    page.controls.lblTotal.value(total);
                //    page.interface.setBillAmount(total);
                //    page.controls.lblDiscount.value(discount);
                //    page.controls.lblTax.value(Math.abs(tax));
                //};
            }
            else {
                page.controls.grdBill.setTemplate({
                    selection: true,
                    columns: [
                           { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                            { 'name': "Item No", 'width': "80px", 'dataField': "item_no", editable: false },
                            { 'name': "Item Name", 'width': "150px", 'dataField': "item_name", editable: false },
                            { 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                           { 'name': "Stocked", 'width': "60px", 'dataField': "qty", editable: false },
                           { 'name': "Returned", 'width': "90px", 'dataField': "qty_returned", editable: false },
                           { 'name': "", 'width': "0px", 'dataField': "ret_qty", editable: false, visible: false },
                            { 'name': "Return Qty", 'width': "100px", 'dataField': "temp_ret_qty", editable: true },
                            { 'name': "Free Qty", 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.showFree },
                            { 'name': "Returned Free", 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.showFree },
                            { 'name': "", 'width': "0px", 'dataField': "ret_free", editable: true, visible: CONTEXT.showFree },
                            { 'name': "Free Item", 'width': "100px", 'dataField': "temp_ret_free", editable: true, visible: CONTEXT.showFree },
                            { 'name': "Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "GST(%)", 'width': "70px", 'dataField': "tax_per" },
                            { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Man Date", 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Amount", 'width': "100px", 'dataField': "tot_amount" },
                            { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                          { 'name': "", 'width': "0px", 'dataField': "amount" },
                          { 'name': "", 'width': "0px", 'dataField': "cost" },
                          { 'name': "", 'width': "0px", 'dataField': "tax_per" },
                          { 'name': "", 'width': "0px", 'dataField': "var_no" },
                          { 'name': "", 'width': "0px", 'dataField': "free_var_no" },

                          { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                          { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                          { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },

                    ]
                });
                $$("grdBill").dataBind(bill.billItems);
                $$("grdBill").edit(true);

                ////Get Items with new tax data
                //page.msgPanel.show("Please Wait Your Product Is Loading...");
                //page.itemService.getItemAutoComplete("%",page.selectedBill.sales_tax_no, function (data) {
                //    $(data).each(function (i, item) {
                //        // item.label = item.label + " <span style='margin:right:30px'><span> [MRP:" + item.price + "] <span style='margin:right:30px'><span> " + item.mrp

                //    });
                //    page.productList = data;
                //    page.msgPanel.show("Your Purchase Is Ready");
                //    page.msgPanel.hide();
                //});
                page.productList = page.interface.currentProductList;
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
        page.checkItems = function (callback) {
            var err_count = 0;
            
            $(page.controls.grdBill.allData()).each(function (i, billItem) {
                try {
                    if (billItem.ret_qty == undefined || billItem.ret_qty == "" || billItem.ret_qty == null || parseFloat(billItem.ret_qty) <= 0 || isNaN(billItem.ret_qty)) {
                        err_count++;
                        throw "Return Qty should be number and positive for item " + billItem.item_name + "";
                    }
                    if (billItem.ret_free == undefined || billItem.ret_free == "" || billItem.ret_free == null)
                        billItem.ret_free = 0;
                    if (parseFloat(billItem.ret_free) < 0 || isNaN(billItem.ret_free)) {
                        err_count++;
                        throw "Free qty should be number and positive for item " + billItem.item_name + "";
                    }
                    if (parseFloat(billItem.free_qty) < (parseFloat(billItem.free_qty_return) + parseFloat(billItem.ret_free))) {
                        err_count++;
                        throw "Return Free Qty Should Not Exceed Than The Actual Return Qty For Item" + billItem.item_name + "";
                    }
                    if (parseFloat(billItem.qty) < (parseFloat(billItem.qty_returned) + parseFloat(billItem.ret_qty))) {
                        err_count++;
                        throw "Return Qty Should Not Exceed Than The Actual Return Qty For Item" + billItem.item_name + "";
                    }
                    
                } catch (e) {
                    page.msgPanel.show(e);
                }
            });
            if (err_count == 0)
                callback(true);
        }
        page.calculate = function (callback) {
            //INITIALIZE THE VARIABLES
            var finalsubtotal = 0;
            var finaltotal = 0;
            var net_rate = 0;

            //GET ALL THE VALUES OF GRID
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var poItem = page.controls.grdBill.getRowData(row);
                //CALCULATE THE SUBTOTAL VALUE
                poItem.ret_qty=(poItem.ret_qty == "" || poItem.ret_qty == null || typeof poItem.ret_qty == "undefined") ? "0" : poItem.ret_qty;
                var subtotal = parseFloat(poItem.ret_qty) * parseFloat(poItem.item_price);
                // SUBTOTAL IS SAME FOR TOTAL IN ITEM
                var total = subtotal;
                
                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(2));
                $(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);
                $(row).find("[datafield=tot_amount]").find("div").html(poItem.total_price)
                poItem.total_price = total;
                //poItem.buying_cost = buying_cost;
                finalsubtotal = finalsubtotal + subtotal;
                finaltotal = finaltotal + total;
            });

            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(finaltotal)).toFixed(2);

            //SET BILL AMOUNT DETAILS
            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(2));
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(2));
            page.controls.lblDiscount.value(parseFloat(0).toFixed(2));
            page.controls.lblTax.value(parseFloat(0).toFixed(2));
            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(2));
        }

        page.saveBill = function (bill_type, callback) {
            var err_count = 0;
            try {

                $(".detail-info").progressBar("show")
                var newBill = {
                    bill_no: page.currentBillNo,
                    bill_date: $$("txtBillDate").getDate(),
                    //store_no: CONTEXT.store_no,
                    //reg_no: CONTEXT.reg_no,
                    user_no: CONTEXT.user_no,

                    sub_total: page.controls.lblSubTotal.value(),
                    total: page.controls.lblTotal.value(),
                    discount: page.controls.lblDiscount.value(),
                    tax: page.controls.lblTax.value(),

                    bill_type: bill_type,
                    state_no: (bill_type == "Purchase") ? 904 : 100,
                    pay_type: $$("ddlPayMode").selectedValue(),
                    round_off: page.controls.lblRndOff.value(),
                };

                if (page.controls.hdnVendorNo.val() != "") {
                    newBill.vendor_no = page.controls.hdnVendorNo.val()
                }
                if (bill_type == "Return") {
                    newBill.return_bill_no = page.selectedBill.bill_no;
                }

                var rbillItems = [];
                // Insert or  [update - will delete all bill items]
                page.purchaseBillService.saveBill(newBill, function (data) {
                    //currentBillNo = data[0].key_value;
                    currentBillNo = data;
                    $(page.controls.grdBill.allData()).each(function (i, billItem) {
                        try {
                            if (billItem.qty == undefined || billItem.qty == "" || billItem.qty == null || parseFloat(billItem.qty) <= 0 || isNaN(billItem.qty)) {
                                err_count++;
                                throw "Qty should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.free_qty == undefined || billItem.free_qty == "" || billItem.free_qty == null)
                                billItem.free_qty = 0;
                            if (parseFloat(billItem.free_qty) < 0 || isNaN(billItem.free_qty)) {
                                err_count++;
                                throw "Free qty should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.cost == undefined || billItem.cost == "" || billItem.cost == null || parseFloat(billItem.cost) <= 0 || isNaN(billItem.cost)) {
                                err_count++;
                                throw "Cost should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.disc_per == undefined || billItem.disc_per == "" || billItem.disc_per == null)
                                billItem.disc_per = 0;
                            if (parseFloat(billItem.disc_per) < 0 || isNaN(billItem.disc_per)) {
                                err_count++;
                                throw "Discount should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.disc_val == undefined || billItem.disc_val == "" || billItem.disc_val == null)
                                billItem.disc_val = 0;
                            if (parseFloat(billItem.disc_val) < 0 || isNaN(billItem.disc_val)) {
                                err_count++;
                                throw "Discount should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.tax_per == undefined || billItem.tax_per == "" || billItem.tax_per == null)
                                billItem.tax_per = 0;
                            if (parseFloat(billItem.tax_per) < 0 || isNaN(billItem.tax_per)) {
                                err_count++;
                                throw "Tax should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.mrp == "" || billItem.mrp == null || typeof billItem.mrp == "undefined") {
                                billItem.mrp = 0;
                            }
                            if (parseFloat(billItem.mrp) < 0 || isNaN(billItem.mrp)) {
                                err_count++;
                                throw "MRP should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.var_no == "" || billItem.var_no == null || typeof billItem.var_no == "undefined") {
                                billItem.var_no = 0;
                            }
                            if (billItem.free_var_no == "" || billItem.free_var_no == null || typeof billItem.free_var_no == "undefined") {
                                billItem.free_var_no = 0;
                            }
                            if (billItem.selling_price != undefined) {
                                if (parseFloat(billItem.selling_price) < 0 || isNaN(billItem.selling_price)) {
                                    err_count++;
                                    throw "Selling Price should be number and positive for item " + billItem.item_name + "";
                                }
                            }
                            if (!CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
                                    var EnteredDate = billItem.expiry_date;
                                    var date = EnteredDate.substring(0, 2);
                                    var month = EnteredDate.substring(3, 5);
                                    var year = EnteredDate.substring(6, 10);

                                    var myDate = new Date(year, month - 1, date);
                                    var today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (myDate <= today) {
                                        err_count++;
                                        throw "Expiry date is not valid for item " + billItem.item_name + "";
                                    }
                                }
                            }
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
                                    var len = billItem.expiry_date.length;
                                    var month = billItem.expiry_date.substring(len - 7, len - 5);
                                    var year = billItem.expiry_date.substring(len - 4, len);
                                    billItem.expiry_date = "28-" + month + "-" + year;
                                }
                            }
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (billItem.man_date != undefined && billItem.man_date != null && billItem.man_date != "") {
                                    len = billItem.man_date.length;
                                    month = billItem.man_date.substring(len - 7, len - 5);
                                    year = billItem.man_date.substring(len - 4, len);
                                    billItem.man_date = "28-" + month + "-" + year;
                                }
                            }
                            if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                if (parseInt(billItem.expiry_days) != 0) {
                                    var date = new Date();
                                    var newdate = new Date(date);
                                    newdate.setDate(newdate.getDate() + parseInt(billItem.expiry_days));
                                    var nd = new Date(newdate);
                                    var expiry_date = $.datepicker.formatDate("dd-mm-yy", new Date(newdate));
                                    billItem.expiry_date = expiry_date;
                                }
                            }
                            //if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
                            //    var start = billItem.qty.length - billItem.alter_unit.length;
                            //    if (!isNaN(start)) {
                            //        var lastChar = billItem.qty.substring(start, billItem.qty.length);
                            //        if (lastChar == billItem.alter_unit) {
                            //            billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
                            //        }
                            //    }
                            //}
                            //if (billItem.variation_name == undefined || billItem.variation_name == "" || billItem.variation_name == null) {
                            //    billItem.variation_name = billItem.item_no + "-" + billItem.cost + "-" + billItem.mrp + "-" + billItem.batch_no + "-" + billItem.expiry_date;
                            //}
                            //if (parseFloat(billItem.var_cost).toFixed(2) != parseFloat(billItem.buying_cost).toFixed(2)) {
                            //    err_count++;
                            //    throw "Varation cost should not matced with the buying cost";
                            //}
                            if (parseFloat(billItem.qty) > 0) {
                                rbillItems.push({
                                    bill_no: currentBillNo,
                                    item_no: billItem.item_no,
                                    qty: parseFloat(billItem.qty),
                                    //free_item:billItem.free_item,
                                    //price: parseFloat(parseFloat(billItem.total_price) / parseFloat(billItem.qty)).toFixed(2),
                                    price: parseFloat(billItem.cost).toFixed(2),
                                    //tax_class_no: 0,
                                    tax_per: billItem.tax_per,
                                    disc_val: billItem.disc_val,
                                    disc_per: billItem.disc_per,
                                    total_price: billItem.total_price,
                                    free_qty: billItem.free_qty,
                                    mrp: (billItem.mrp == undefined) ? "" : parseFloat(billItem.mrp).toFixed(2),
                                    expiry_date: (billItem.expiry_date == undefined) ? "" : billItem.expiry_date,
                                    batch_no: (billItem.batch_no == undefined) ? "" : billItem.batch_no,
                                    selling_price: billItem.selling_price,
                                    variation_name: (billItem.variation_name == undefined) ? "" : billItem.variation_name,
                                    buying_cost: parseFloat(billItem.buying_cost).toFixed(2),
                                    man_date: (billItem.man_date == undefined) ? "" : billItem.man_date,
                                    chk_new_var: billItem.chk_new_var,
                                    free_variation_name: billItem.free_variation_name,
                                    free_variation_id: billItem.free_variation_id,
                                    unit_identity: billItem.unit_identity,
                                    //chk_new_free_var: billItem.chk_new_free_var,
                                    var_no: billItem.var_no,
                                    free_var_no: billItem.free_var_no
                                });
                            }
                        } catch (e) {
                            page.msgPanel.show(e);
                        }
                    });
                    if (err_count == 0)
                        page.purchaseBillService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

                            //Adjust stock for sale and return
                            if (bill_type == "Purchase") {
                                var inventItems = [];
                                var priceItems = [];
                                $(rbillItems).each(function (i, data) {
                                    if (CONTEXT.enableFreeVariation) {
                                        if (data.free_qty != 0) {

                                            var inventItemNonFree = {
                                                item_no: data.item_no,
                                                cost: parseFloat(data.buying_cost).toFixed(2),
                                                qty: parseFloat(data.qty),
                                                comments: "",
                                                invent_type: "Purchase",
                                                key1: currentBillNo,
                                                mrp: data.mrp,
                                                expiry_date: data.expiry_date,
                                                batch_no: data.batch_no,
                                                variation_name: data.variation_name,
                                                //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                man_date: data.man_date,
                                                chk_new_var: data.chk_new_var,
                                                // chk_new_free_var: data.chk_new_free_var,
                                                var_no: data.var_no,
                                            };
                                            if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                                inventItemNonFree.vendor_no = page.controls.hdnVendorNo.val()
                                            }
                                            var inventItemFree = {
                                                item_no: data.item_no,
                                                cost: "0",
                                                qty: parseFloat(data.free_qty),
                                                comments: "",
                                                invent_type: "Purchase",
                                                key1: currentBillNo,
                                                mrp: data.mrp,
                                                expiry_date: data.expiry_date,
                                                batch_no: data.batch_no,
                                                //variation_name: data.variation_name + "-free",
                                                variation_name: data.free_variation_name,//(data.free_variation_id == true) ? data.free_variation_name : (data.variation_name == "") ? "-free" : data.variation_name + "-free",
                                                man_date: data.man_date,
                                                chk_new_var: data.chk_new_var,
                                                // chk_new_free_var: data.chk_new_free_var,
                                                var_no: data.free_var_no,
                                            };
                                            if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                                inventItemFree.vendor_no = page.controls.hdnVendorNo.val()
                                            }
                                            inventItems.push(inventItemNonFree);
                                            inventItems.push(inventItemFree);
                                            if (data.selling_price > 0) {
                                                priceItems.push({
                                                    item_no: data.item_no,
                                                    price: parseFloat(data.selling_price).toFixed(2),
                                                    mrp: data.mrp,
                                                    //selling_price: data.selling_price,
                                                    batch_no: data.batch_no,
                                                    expiry_date: data.expiry_date,
                                                    valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    cost: parseFloat(data.buying_cost).toFixed(2),
                                                    //variation_name: data.variation_name,
                                                    variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                    man_date: data.man_date,
                                                    var_no: data.var_no,
                                                });
                                                priceItems.push({
                                                    item_no: data.item_no,
                                                    price: parseFloat(data.selling_price).toFixed(2),
                                                    mrp: data.mrp,
                                                    //selling_price: data.selling_price,
                                                    batch_no: data.batch_no,
                                                    expiry_date: data.expiry_date,
                                                    valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    cost: "0",
                                                    variation_name: (data.free_variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date + "-free" : data.free_variation_name,
                                                    //(data.free_variation_id == true) ? data.free_variation_name : (data.variation_name == "") ? "-free" : data.variation_name + "-free",
                                                    //variation_name: (data.variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date + "-free" : data.variation_name + "-free",
                                                    man_date: data.man_date,
                                                    var_no: data.free_var_no,
                                                });
                                            }
                                        }
                                        else {
                                            var inventItem = {
                                                item_no: data.item_no,
                                                cost: parseFloat(data.buying_cost).toFixed(2),
                                                qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                                comments: "",
                                                invent_type: "Purchase",
                                                key1: currentBillNo,
                                                mrp: data.mrp,
                                                expiry_date: data.expiry_date,
                                                batch_no: data.batch_no,
                                                variation_name: data.variation_name,
                                                man_date: data.man_date,
                                                chk_new_var: data.chk_new_var,
                                                //chk_new_free_var: data.chk_new_free_var,
                                                var_no: data.var_no,
                                            };
                                            if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                                inventItem.vendor_no = page.controls.hdnVendorNo.val()
                                            }
                                            inventItems.push(inventItem);
                                            if (data.selling_price > 0) {
                                                priceItems.push({
                                                    item_no: data.item_no,
                                                    price: parseFloat(data.selling_price).toFixed(2),
                                                    mrp: data.mrp,
                                                    //selling_price: data.selling_price,
                                                    batch_no: data.batch_no,
                                                    expiry_date: data.expiry_date,
                                                    valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    //cost: parseFloat(data.price).toFixed(2),
                                                    cost: parseFloat(data.buying_cost).toFixed(2),
                                                    //variation_name: data.variation_name,
                                                    variation_name: (data.variation_name == "") ? data.item_no + "-" + getCookie("user_store_id") + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date : data.variation_name,
                                                    man_date: data.man_date,
                                                    var_no: data.var_no,
                                                });
                                            }
                                        }
                                    } else {
                                        var inventItem = {
                                            item_no: data.item_no,
                                            cost: parseFloat(data.buying_cost).toFixed(2),
                                            qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                            comments: "",
                                            invent_type: "Purchase",
                                            key1: currentBillNo,
                                            mrp: data.mrp,
                                            expiry_date: data.expiry_date,
                                            batch_no: data.batch_no,
                                            variation_name: data.variation_name,
                                            man_date: data.man_date,
                                            chk_new_var: data.chk_new_var,
                                            //chk_new_free_var: data.chk_new_free_var,
                                            var_no: data.var_no,
                                        };
                                        if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                            inventItem.vendor_no = page.controls.hdnVendorNo.val()
                                        }
                                        inventItems.push(inventItem);
                                        if (data.selling_price > 0) {
                                            priceItems.push({
                                                item_no: data.item_no,
                                                price: parseFloat(data.selling_price).toFixed(2),
                                                mrp: data.mrp,
                                                //selling_price: data.selling_price,
                                                batch_no: data.batch_no,
                                                expiry_date: data.expiry_date,
                                                valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                //cost: parseFloat(data.price).toFixed(2),
                                                cost: parseFloat(data.buying_cost).toFixed(2),
                                                variation_name: data.variation_name,
                                                //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                man_date: data.man_date,
                                                var_no: data.var_no,
                                            });
                                        }
                                    }
                                });

                                //Make inventory entry
                                page.inventoryService.insertInventoryItems(0, inventItems, function () {
                                    page.msgPanel.show("Updating item price...");
                                    page.itemService.insertPriceItems(0, priceItems, function (pricedata) {

                                        var billSO = {
                                            bill_no: currentBillNo,
                                            collector_id: CONTEXT.user_no,
                                            pay_desc: "POP Bill Payment",
                                            amount: parseFloat(page.controls.lblTotal.value()),
                                            //po_no: page.currentPO.po_no,
                                            pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            pay_type: "Purchase",
                                            pay_mode: page.controls.ddlPayMode.selectedValue()

                                        };

                                        page.msgPanel.show("Updating Payments...");
                                        if (page.controls.ddlPayMode.selectedValue() == "Loan") {
                                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                                var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                                                if (billSO.pay_type == "Purchase") {
                                                    var data1 = {
                                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                        description: "POP-" + currentBillNo,
                                                        target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                                        //amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                                        //pur_with_tax: parseFloat($$("lblTotal").value()).toFixed(2),
                                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                                        tax_amt: parseFloat($$("lblTax").value()).toFixed(2),
                                                        buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                                        round_off: $$("lblRndOff").value(),
                                                        key_1: currentBillNo,
                                                        key_2: $$("txtVendorName").selectedValue()

                                                    };
                                                    //var data2 = {
                                                    //    per_id: CONTEXT.PeriodId,
                                                    //    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                                    //    amount: billSO.amount,
                                                    //    key_1: page.currentPO.po_no,
                                                    //    description: "Purchase Order-" + page.currentPO.po_no,
                                                    //    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    //    comp_id: CONTEXT.FINFACTS_COMPANY,
                                                    //};
                                                    page.finfactsEntry.cashPurchase(data1, function (response) {
                                                        page.msgPanel.show("POP payment is recorded successfully.");
                                                    });
                                                    //page.finfactsService.insertCreditPayment(data2, function (response) {
                                                    //});

                                                }
                                                else {
                                                    page.msgPanel.show("POP payment is recorded successfully.");
                                                }

                                            } else {
                                                page.msgPanel.show("POP payment is recorded successfully.");
                                                callback(currentBillNo);
                                            }
                                        }
                                        else {
                                            page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {

                                                //If finfacts module is enabled then make entry in finfacts.
                                                if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                                    var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                                                    if (billSO.pay_type == "Purchase") {
                                                        var data1 = {
                                                            comp_id: CONTEXT.FINFACTS_COMPANY,
                                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                            description: "POP-" + currentBillNo,
                                                            target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                                            //amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                                            //pur_with_tax: parseFloat($$("lblTotal").value()).toFixed(2),
                                                            pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                                            tax_amt: parseFloat($$("lblTax").value()).toFixed(2),
                                                            buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                                            round_off: $$("lblRndOff").value(),
                                                            key_1: currentBillNo,
                                                            key_2: $$("txtVendorName").selectedValue()

                                                        };
                                                        //var data2 = {
                                                        //    per_id: CONTEXT.PeriodId,
                                                        //    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                                        //    amount: billSO.amount,
                                                        //    key_1: page.currentPO.po_no,
                                                        //    description: "Purchase Order-" + page.currentPO.po_no,
                                                        //    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                        //    comp_id: CONTEXT.FINFACTS_COMPANY,
                                                        //};
                                                        page.finfactsEntry.cashPurchase(data1, function (response) {
                                                            page.msgPanel.show("POP payment is recorded successfully.");
                                                        });
                                                        //page.finfactsService.insertCreditPayment(data2, function (response) {
                                                        //});

                                                    }
                                                    else {
                                                        page.msgPanel.show("POP payment is recorded successfully.");
                                                    }

                                                } else {
                                                    page.msgPanel.show("POP payment is recorded successfully.");
                                                    callback(currentBillNo);
                                                }

                                            });
                                        }
                                    });

                                });

                            }
                            else {
                                //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
                                callback(currentBillNo);
                            }
                            //Insert Bill Discount
                            //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
                            callback(currentBillNo);
                        });


                });
            } catch (e) {
                page.msgPanel.show(e);
            }
        }

        page.payMixedBill = function (bill_type, callback) {
            var err_count = 0;
            try {

                $(".detail-info").progressBar("show")
                var newBill = {
                    bill_no: page.currentBillNo,
                    bill_date: $$("txtBillDate").getDate(),
                    //store_no: CONTEXT.store_no,
                    //reg_no: CONTEXT.reg_no,
                    user_no: CONTEXT.user_no,

                    sub_total: page.controls.lblSubTotal.value(),
                    total: page.controls.lblTotal.value(),
                    discount: page.controls.lblDiscount.value(),
                    tax: page.controls.lblTax.value(),

                    bill_type: bill_type,
                    state_no: (bill_type == "Purchase") ? 904 : 100,
                    pay_type: $$("ddlPaymentType").selectedValue(),
                    round_off: page.controls.lblRndOff.value(),
                };

                if (page.controls.hdnVendorNo.val() != "") {
                    newBill.vendor_no = page.controls.hdnVendorNo.val()
                }
                if (bill_type == "Return") {
                    newBill.return_bill_no = page.selectedBill.bill_no;
                }

                var rbillItems = [];
                // Insert or  [update - will delete all bill items]
                page.purchaseBillService.saveBill(newBill, function (data) {
                    //currentBillNo = data[0].key_value;
                    currentBillNo = data;
                    $(page.controls.grdBill.allData()).each(function (i, billItem) {
                        try {
                            if (billItem.qty == undefined || billItem.qty == "" || billItem.qty == null || parseFloat(billItem.qty) <= 0 || isNaN(billItem.qty)) {
                                err_count++;
                                throw "Qty should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.free_qty == undefined || billItem.free_qty == "" || billItem.free_qty == null)
                                billItem.free_qty = 0;
                            if (parseFloat(billItem.free_qty) < 0 || isNaN(billItem.free_qty)) {
                                err_count++;
                                throw "Free qty should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.cost == undefined || billItem.cost == "" || billItem.cost == null || parseFloat(billItem.cost) <= 0 || isNaN(billItem.cost)) {
                                err_count++;
                                throw "Cost should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.disc_per == undefined || billItem.disc_per == "" || billItem.disc_per == null)
                                billItem.disc_per = 0;
                            if (parseFloat(billItem.disc_per) < 0 || isNaN(billItem.disc_per)) {
                                err_count++;
                                throw "Discount should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.disc_val == undefined || billItem.disc_val == "" || billItem.disc_val == null)
                                billItem.disc_val = 0;
                            if (parseFloat(billItem.disc_val) < 0 || isNaN(billItem.disc_val)) {
                                err_count++;
                                throw "Discount should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.tax_per == undefined || billItem.tax_per == "" || billItem.tax_per == null)
                                billItem.tax_per = 0;
                            if (parseFloat(billItem.tax_per) < 0 || isNaN(billItem.tax_per)) {
                                err_count++;
                                throw "Tax should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.mrp == "" || billItem.mrp == null || typeof billItem.mrp == "undefined") {
                                billItem.mrp = 0;
                            }
                            if (parseFloat(billItem.mrp) < 0 || isNaN(billItem.mrp)) {
                                err_count++;
                                throw "MRP should be number and positive for item " + billItem.item_name + "";
                            }
                            if (billItem.var_no == "" || billItem.var_no == null || typeof billItem.var_no == "undefined") {
                                billItem.var_no = 0;
                            }
                            if (billItem.free_var_no == "" || billItem.free_var_no == null || typeof billItem.free_var_no == "undefined") {
                                billItem.free_var_no = 0;
                            }
                            if (billItem.selling_price != undefined) {
                                if (parseFloat(billItem.selling_price) < 0 || isNaN(billItem.selling_price)) {
                                    err_count++;
                                    throw "Selling Price should be number and positive for item " + billItem.item_name + "";
                                }
                            }
                            if (!CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
                                    var EnteredDate = billItem.expiry_date;
                                    var date = EnteredDate.substring(0, 2);
                                    var month = EnteredDate.substring(3, 5);
                                    var year = EnteredDate.substring(6, 10);

                                    var myDate = new Date(year, month - 1, date);
                                    var today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (myDate <= today) {
                                        err_count++;
                                        throw "Expiry date is not valid for item " + billItem.item_name + "";
                                    }
                                }
                            }
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
                                    var len = billItem.expiry_date.length;
                                    var month = billItem.expiry_date.substring(len - 7, len - 5);
                                    var year = billItem.expiry_date.substring(len - 4, len);
                                    billItem.expiry_date = "28-" + month + "-" + year;
                                }
                            }
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (billItem.man_date != undefined && billItem.man_date != null && billItem.man_date != "") {
                                    len = billItem.man_date.length;
                                    month = billItem.man_date.substring(len - 7, len - 5);
                                    year = billItem.man_date.substring(len - 4, len);
                                    billItem.man_date = "28-" + month + "-" + year;
                                }
                            }
                            if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                if (parseInt(billItem.expiry_days) != 0) {
                                    var date = new Date();
                                    var newdate = new Date(date);
                                    newdate.setDate(newdate.getDate() + parseInt(billItem.expiry_days));
                                    var nd = new Date(newdate);
                                    var expiry_date = $.datepicker.formatDate("dd-mm-yy", new Date(newdate));
                                    billItem.expiry_date = expiry_date;
                                }
                            }
                            //if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
                            //    var start = billItem.qty.length - billItem.alter_unit.length;
                            //    if (!isNaN(start)) {
                            //        var lastChar = billItem.qty.substring(start, billItem.qty.length);
                            //        if (lastChar == billItem.alter_unit) {
                            //            billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
                            //        }
                            //    }
                            //}
                            //if (billItem.variation_name == undefined || billItem.variation_name == "" || billItem.variation_name == null) {
                            //    billItem.variation_name = billItem.item_no + "-" + billItem.cost + "-" + billItem.mrp + "-" + billItem.batch_no + "-" + billItem.expiry_date;
                            //}
                            //if (parseFloat(billItem.var_cost).toFixed(2) != parseFloat(billItem.buying_cost).toFixed(2)) {
                            //    err_count++;
                            //    throw "Varation cost should not matced with the buying cost";
                            //}
                            if (parseFloat(billItem.qty) > 0) {
                                rbillItems.push({
                                    bill_no: currentBillNo,
                                    item_no: billItem.item_no,
                                    qty: parseFloat(billItem.qty),
                                    //free_item:billItem.free_item,
                                    //price: parseFloat(parseFloat(billItem.total_price) / parseFloat(billItem.qty)).toFixed(2),
                                    price: parseFloat(billItem.cost).toFixed(2),
                                    //tax_class_no: 0,
                                    tax_per: billItem.tax_per,
                                    disc_val: billItem.disc_val,
                                    disc_per: billItem.disc_per,
                                    total_price: billItem.total_price,
                                    free_qty: billItem.free_qty,
                                    mrp: (billItem.mrp == undefined) ? "" : parseFloat(billItem.mrp).toFixed(2),
                                    expiry_date: (billItem.expiry_date == undefined) ? "" : billItem.expiry_date,
                                    batch_no: (billItem.batch_no == undefined) ? "" : billItem.batch_no,
                                    selling_price: billItem.selling_price,
                                    variation_name: (billItem.variation_name == undefined) ? "" : billItem.variation_name,
                                    free_variation_name: billItem.free_variation_name,
                                    buying_cost: parseFloat(billItem.buying_cost).toFixed(2),
                                    man_date: (billItem.man_date == undefined) ? "" : billItem.man_date,
                                    chk_new_var: billItem.chk_new_var,
                                    free_variation_name: billItem.free_variation_name,
                                    free_variation_id: billItem.free_variation_id,
                                    unit_identity: billItem.unit_identity,
                                    chk_new_free_var: billItem.chk_new_free_var,
                                    var_no: billItem.var_no,
                                    free_var_no: billItem.free_var_no
                                });
                            }
                        } catch (e) {
                            page.msgPanel.show(e);
                        }

                    });
                    if (err_count == 0)
                        page.purchaseBillService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

                            //Adjust stock for sale and return
                            if (bill_type == "Purchase") {
                                var inventItems = [];
                                var priceItems = [];
                                $(rbillItems).each(function (i, data) {
                                    if (CONTEXT.enableFreeVariation) {
                                        if (data.free_qty != 0) {
                                            var inventItemFree = {
                                                item_no: data.item_no,
                                                cost: "0",
                                                qty: parseFloat(data.free_qty),
                                                comments: "",
                                                invent_type: "Purchase",
                                                key1: currentBillNo,
                                                mrp: data.mrp,
                                                expiry_date: data.expiry_date,
                                                batch_no: data.batch_no,
                                                //variation_name: data.variation_name + "-free",
                                                variation_name: data.free_variation_name,//(data.free_variation_id == true)?data.free_variation_name:(data.variation_name == "") ?"-free" : data.variation_name + "-free",
                                                man_date: data.man_date,
                                                chk_new_var: data.chk_new_var,
                                                chk_new_free_var: data.chk_new_free_var,
                                                var_no: data.free_var_no
                                            };
                                            if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                                inventItemFree.vendor_no = page.controls.hdnVendorNo.val()
                                            }
                                            var inventItemNonFree = {
                                                item_no: data.item_no,
                                                cost: parseFloat(data.buying_cost).toFixed(2),
                                                qty: parseFloat(data.qty),
                                                comments: "",
                                                invent_type: "Purchase",
                                                key1: currentBillNo,
                                                mrp: data.mrp,
                                                expiry_date: data.expiry_date,
                                                batch_no: data.batch_no,
                                                variation_name: data.variation_name,
                                                //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                man_date: data.man_date,
                                                chk_new_var: data.chk_new_var,
                                                chk_new_free_var: data.chk_new_free_var,
                                                var_no: data.var_no
                                            };
                                            if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                                inventItemNonFree.vendor_no = page.controls.hdnVendorNo.val()
                                            }
                                            inventItems.push(inventItemNonFree);
                                            inventItems.push(inventItemFree);
                                            if (data.selling_price > 0) {
                                                priceItems.push({
                                                    item_no: data.item_no,
                                                    price: parseFloat(data.selling_price).toFixed(2),
                                                    mrp: data.mrp,
                                                    //selling_price: data.selling_price,
                                                    batch_no: data.batch_no,
                                                    expiry_date: data.expiry_date,
                                                    valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    cost: parseFloat(data.buying_cost).toFixed(2),
                                                    variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                    //variation_name: data.variation_name,
                                                    //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                    man_date: data.man_date,
                                                    var_no: data.var_no
                                                });
                                                priceItems.push({
                                                    item_no: data.item_no,
                                                    price: parseFloat(data.selling_price).toFixed(2),
                                                    mrp: data.mrp,
                                                    //selling_price: data.selling_price,
                                                    batch_no: data.batch_no,
                                                    expiry_date: data.expiry_date,
                                                    valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    cost: "0",
                                                    variation_name: (data.free_variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date + "-free" : data.free_variation_name,
                                                    //variation_name: (data.variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date + "-free" : data.variation_name + "-free",
                                                    man_date: data.man_date,
                                                    var_no: data.free_var_no
                                                });
                                            }
                                        }
                                        else {
                                            var inventItem = {
                                                item_no: data.item_no,
                                                cost: parseFloat(data.buying_cost).toFixed(2),
                                                qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                                comments: "",
                                                invent_type: "Purchase",
                                                key1: currentBillNo,
                                                mrp: data.mrp,
                                                expiry_date: data.expiry_date,
                                                batch_no: data.batch_no,
                                                variation_name: data.variation_name,
                                                man_date: data.man_date,
                                                chk_new_var: data.chk_new_var,
                                                chk_new_free_var: data.chk_new_free_var,
                                                var_no: data.var_no
                                            };
                                            if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                                inventItem.vendor_no = page.controls.hdnVendorNo.val()
                                            }
                                            inventItems.push(inventItem);
                                            if (data.selling_price > 0) {
                                                priceItems.push({
                                                    item_no: data.item_no,
                                                    price: parseFloat(data.selling_price).toFixed(2),
                                                    mrp: data.mrp,
                                                    //selling_price: data.selling_price,
                                                    batch_no: data.batch_no,
                                                    expiry_date: data.expiry_date,
                                                    valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                    //cost: parseFloat(data.price).toFixed(2),
                                                    cost: parseFloat(data.buying_cost).toFixed(2),
                                                    variation_name: (data.variation_name == "") ? data.item_no + "-" + getCookie("user_store_id") + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date : data.variation_name,
                                                    man_date: data.man_date,
                                                    var_no: data.var_no
                                                });
                                            }
                                        }
                                    } else {
                                        var inventItem = {
                                            item_no: data.item_no,
                                            cost: parseFloat(data.buying_cost).toFixed(2),
                                            qty: parseFloat(data.qty) + parseFloat(data.free_qty),
                                            comments: "",
                                            invent_type: "Purchase",
                                            key1: currentBillNo,
                                            mrp: data.mrp,
                                            expiry_date: data.expiry_date,
                                            batch_no: data.batch_no,
                                            variation_name: data.variation_name,
                                            man_date: data.man_date,
                                            chk_new_var: data.chk_new_var,
                                            chk_new_free_var: billItem.chk_new_free_var,
                                            var_no: data.var_no
                                        };
                                        if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
                                            inventItem.vendor_no = page.controls.hdnVendorNo.val()
                                        }
                                        inventItems.push(inventItem);
                                        if (data.selling_price > 0) {
                                            priceItems.push({
                                                item_no: data.item_no,
                                                price: parseFloat(data.selling_price).toFixed(2),
                                                mrp: data.mrp,
                                                //selling_price: data.selling_price,
                                                batch_no: data.batch_no,
                                                expiry_date: data.expiry_date,
                                                valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                //cost: parseFloat(data.price).toFixed(2),
                                                cost: parseFloat(data.buying_cost).toFixed(2),
                                                variation_name: data.variation_name,
                                                //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
                                                man_date: data.man_date,
                                                var_no: data.var_no
                                            });
                                        }
                                    }
                                });

                                //Make inventory entry
                                page.inventoryService.insertInventoryItems(0, inventItems, function () {

                                    page.msgPanel.show("Updating item price...");
                                    page.itemService.insertPriceItems(0, priceItems, function (pricedata) {
                                        var allBillSO = [];
                                        var reward_amount = 0;
                                        $(page.controls.grdAllPayment.allData()).each(function (i, item) {

                                            allBillSO.push({
                                                collector_id: CONTEXT.user_no,
                                                pay_desc: "POS Bill Payment",
                                                amount: item.amount,
                                                bill_no: currentBillNo,
                                                pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                //pay_type: bill_type == "Sale" ? "Sale" : "Return",
                                                pay_type: "Purchase",
                                                pay_mode: item.pay_type,
                                                card_type: item.card_type,
                                                card_no: item.card_no,
                                                coupon_no: item.coupon_no
                                            });

                                        });
                                        page.msgPanel.show("Updating Payments...");
                                        page.purchaseService.payAllInvoiceBillSalesOrder(0, allBillSO, function (data) {

                                            //If finfacts module is enabled then make entry in finfacts.
                                            if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                                var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                                                if (allBillSO[0].pay_type == "Purchase") {
                                                    var data1 = {
                                                        comp_id: CONTEXT.FINFACTS_COMPANY,
                                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                                        description: "POP-" + currentBillNo,
                                                        target_acc_id: ($$("ddlPaymentType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                                        //amount: parseFloat(page.controls.lblTotal.value()).toFixed(2),
                                                        //pur_with_tax: parseFloat($$("lblTotal").value()).toFixed(2),
                                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                                        tax_amt: parseFloat($$("lblTax").value()).toFixed(2),
                                                        buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                                        round_off: $$("lblRndOff").value(),
                                                        key_1: currentBillNo,
                                                        key_2: $$("txtVendorName").selectedValue()

                                                    };
                                                    page.finfactsEntry.cashPurchase(data1, function (response) {
                                                        page.msgPanel.show("POP payment is recorded successfully.");
                                                    });
                                                }
                                                else {
                                                    page.msgPanel.show("POP payment is recorded successfully.");
                                                }

                                            } else {
                                                page.msgPanel.show("POP payment is recorded successfully.");
                                                callback(currentBillNo);
                                            }

                                        });
                                    });

                                });

                            }
                            else {
                                //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
                                callback(currentBillNo);
                            }
                            //Insert Bill Discount
                            //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
                            callback(currentBillNo);
                        });


                });
            }
            catch (e) {
                page.msgPanel.show(e);
            }

        }
       
        page.saveBill_click = function (bill_type, pay_mode, callback) {
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

            try {
                var currentBillNo = 0;

                $(".detail-info").progressBar("show");
                var vendor_name = $$("txtVendorName").selectedObject.val().split('_');
                var newBill = {
                    bill_no: "0",
                    bill_date: dbDateTime($$("txtBillDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    user_no: CONTEXT.user_no,

                    sub_total: page.controls.lblSubTotal.value(),
                    total: page.controls.lblTotal.value(),
                    discount: 0,
                    tax: 0,

                    bill_type: "PurchaseReturn",
                    state_no: "300",
                    pay_mode: $$("ddlPayMode").selectedValue(),
                    round_off: page.controls.lblRndOff.value(),
                    sales_tax_no: page.selectedBill.sales_tax_no,
                    mobile_no: page.controls.lblPhoneNo.value(),
                    email_id: page.controls.lblEmail.value(),
                    gst_no: page.controls.lblGst.value(),

                    tot_qty_words: result,

                    bill_no_par: page.currentBillNo,
                    vendor_no: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : page.controls.hdnVendorNo.val(),
                    vendor_name: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : vendor_name[0],
                    vendor_address: (page.controls.lblAddress.value() == "" || page.controls.lblAddress.value() == undefined || page.controls.lblAddress.value() == null) ? "" : vendor_name[0],
                    //FINFACTS ENTRY DATA
                    invent_type: "PurchaseReturnCredit",
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    //fulfill:true
                };

                var rbillItems = [];
                $(page.controls.grdBill.allData()).each(function (i, billItem) {
                    if (parseFloat(billItem.ret_qty) > 0) {
                        rbillItems.push({
                            qty: parseFloat(billItem.ret_qty),
                            free_qty: billItem.ret_free,
                            //free_var_no: billItem.free_var_no,
                            unit_identity: billItem.unit_identity,
                            price: parseFloat(billItem.cost).toFixed(2),
                            disc_val: "0",
                            disc_per: "0",
                            taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                            tax_per: billItem.tax_per,
                            total_price: billItem.total_price,
                            bill_type: "PurchaseReturn",

                            tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined") ? "0" : billItem.tray_received,
                            selling_price: billItem.selling_price,
                            valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            free_selling_price: (billItem.free_selling_price == null || billItem.free_selling_price == "" || typeof billItem.free_selling_price == "undefined") ? billItem.selling_price : billItem.free_selling_price,

                            store_no: getCookie("user_store_id"),
                            item_no: billItem.item_no,
                            cost: parseFloat(billItem.cost).toFixed(2),
                            var_no: billItem.var_no,

                            vendor_no: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : page.controls.hdnVendorNo.val(),
                            active: "1",
                            tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                            amount: parseFloat(billItem.cost) * parseFloat(billItem.ret_qty)
                        });
                    }
                    if (CONTEXT.showFree && CONTEXT.enableFreeVariation) {
                        if (billItem.free_var_no == undefined || billItem.free_var_no == null || billItem.free_var_no == "") { }
                        else {
                            rbillItems[rbillItems.length - 1].free_var_no = billItem.free_var_no;
                        }
                    }
                });
                newBill.bill_items = rbillItems;
                var billSO = [];
                if (pay_mode == "Mixed") {
                    $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                        billSO.push({
                            collector_id: CONTEXT.user_no,
                            pay_desc: "POP Bill Payment",
                            amount: item.amount,
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_type: "Purchase",
                            pay_mode: item.pay_type,
                            store_no: getCookie("user_store_id"),
                            card_type: item.card_type,
                            card_no: (item.card_no == null || item.card_no == "" || item.card_no == undefined) ? "" : item.card_no
                        });
                    });
                }
                else if (pay_mode == "Loan") {
                    billSO = [];
                }
                else {
                    billSO.push({
                        collector_id: CONTEXT.user_no,
                        pay_desc: "POP Bill Payment",
                        amount: parseFloat(page.controls.lblTotal.value()),
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_type: "Purchase",
                        pay_mode: page.controls.ddlPayMode.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: ""
                    });
                }
                newBill.payments = billSO;
                var expense = [];
                if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && $$("txtExpAmount").value() != undefined) {
                    expense.push({
                        exp_name: $$("ddlExpName").selectedValue(),
                        amount: $$("txtExpAmount").value()
                    });
                }
                newBill.expenses = expense;
                page.stockAPI.insertBill(newBill, function (data) {
                    currentBillNo = data;
                    page.msgPanel.show("Bill Inserted Successfully");
                    page.msgPanel.show("Updating Payments...");
                    if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                        if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && $$("txtExpAmount").value() != undefined) {
                            var expenseData1 = {
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_CREDITOR,//CONTEXT.ExpenseAccount,
                                expense_acc_id: CONTEXT.ExpenseCategory,//CONTEXT.ExpenseCategory,
                                amount: $$("txtExpAmount").value(),//$$("txtExpense").value(),
                                description: "POP Return Expense-" + currentBillNo + $$("ddlExpName").selectedValue(),
                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                comp_id: CONTEXT.FINFACTS_COMPANY,
                                key_1: currentBillNo,
                                key_2: $$("txtVendorName").selectedValue(),
                            };
                            page.accService.insertBillIncome(expenseData1, function (response) { });
                        }
                    }
                    if (page.controls.ddlPayMode.selectedValue() == "Loan") {
                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            // page.inventoryService.insertStocks(0, newBill.bill_items, currentBillNo, function (temp) { });
                            var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                            if (bill_type == "Purchase") {
                                var data1 = {
                                    comp_id: CONTEXT.FINFACTS_COMPANY,
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                    description: "POP Return-" + currentBillNo,
                                    target_acc_id: ($$("ddlReturnPayBillType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                    pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                    tax_amt: parseFloat($$("lblTax").value()).toFixed(2),
                                    buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                    round_off: $$("lblRndOff").value(),
                                    key_1: currentBillNo,
                                    key_2: $$("txtVendorName").selectedValue()
                                };
                                page.finfactsEntry.cashReturnPurchase(data1, function (response) {
                                    page.msgPanel.show("POP payment is recorded successfully.");
                                    callback(currentBillNo);
                                });
                            }
                            else {
                                page.msgPanel.show("POP payment is recorded successfully.");
                                callback(currentBillNo);
                                page.msgPanel.hide();
                            }

                        } else {
                            page.msgPanel.show("POP payment is recorded successfully.");
                            callback(currentBillNo);
                            page.msgPanel.hide();
                        }
                    }
                    else {
                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                            if (bill_type == "Purchase") {
                                var data1 = {
                                    comp_id: CONTEXT.FINFACTS_COMPANY,
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                    description: "POP-" + currentBillNo,
                                    target_acc_id: ($$("ddlReturnPayBillType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                    pur_with_out_tax: parseFloat(p_with_tax).toFixed(2),
                                    tax_amt: parseFloat($$("lblTax").value()).toFixed(2),
                                    buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                    round_off: ($$("lblRndOff").value()),
                                    key_1: currentBillNo,
                                    key_2: $$("txtVendorName").selectedValue()

                                };
                                page.finfactsEntry.cashReturnPurchase(data1, function (response) {
                                    page.msgPanel.show("POP payment is recorded successfully.");
                                    callback(currentBillNo);
                                    page.msgPanel.hide();
                                });
                            }
                            else {
                                page.msgPanel.show("POP payment is recorded successfully.");
                                callback(currentBillNo);
                                page.msgPanel.hide();
                            }

                        } else {
                            page.msgPanel.show("POP payment is recorded successfully.");
                            callback(currentBillNo);
                            page.msgPanel.hide();
                        }
                    }
                });

            } catch (e) {
                page.msgPanel.show(e);
            }
        }
        page.interface.createBill = function () {


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
            page.loadSelectedBill(newBill, function () {
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
                    page.loadSelectedBill(saleBill);
                });
            });
        }

        page.interface.viewBill = function (billNo,bill) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            //page.stockAPI.getBill(page.currentBillNo, function (data) {
            page.purchaseBillService.getReturnedPOPBillByNo(bill.bill_no, function (rdata) {
                //var bill = data;
                var openBill = {
                    vendor_no: bill.vendor_no,
                    vendor_name: bill.vendor_name,
                    email: bill.vendor_email,

                    phone_no: bill.vendor_phone,
                    address: bill.vendor_address,
                    sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,

                    sub_total: bill.sub_total,
                    total: bill.total,
                    discount: bill.discount,
                    tax: bill.tax,
                    bill_no: bill.bill_no,
                    bill_date: bill.bill_date,
                    state_text: bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                    gst_no: bill.gst_no,
                    round_off: bill.round_off,
                    expenses: "0"
                };
                // page.purchaseBillService.getPOSBillItem(openBill.bill_no, function (billItems) {
                openBill.billItems = rdata;
                page.msgPanel.show("Getting Bill Discounts...");
                page.msgPanel.show("Loading data...");
                page.loadSelectedBill(openBill, function () {
                    if (openBill.state_text == "Purchase") {
                                page.calculate();
                    }
                    page.msgPanel.show("Bill is opened...");
                });
                page.msgPanel.hide();
            });
            
        }
        page.events.page_load = function () {

            $("[controlid=txtItemSearch]").bind("keypress", function (e) {
                // access the clipboard using the api
                var self = this;
                setTimeout(function () {
                    var str = $(self).val();
                    if (str.startsWith("00")) {
                        //$(self).val(parseInt(str.substring(0, str.length - 1)));
                        $(self).keydown();
                    }
                }, 300)
            });

            page.view.UIState("New");

            page.vendorService.getVendorByAll("%", function (data) {
                page.vendorList = data;
                $$("ddlAddInventVendor").dataBind(data, "vendor_no", "vendor_name");
            });


            //Customer autocomplete
            page.controls.txtVendorName.dataBind({
                getData: function (term, callback) {
                    callback(page.vendorList);
                    // page.customerService.getCustomerByAll(term, callback);
                }
            });
            page.controls.txtVendorName.select(function (item) {
                //page.controls.btnAddVendor.hide();
                if (item == null)
                    item = { vendor_no: "", vendor_phone: "", vendor_address: "" };
                page.controls.hdnVendorNo.val(item.vendor_no);
                page.controls.lblPhoneNo.value(item.vendor_phone);
                page.controls.lblAddress.value(item.vendor_address);
                page.controls.lblEmail.value(item.vendor_email);
                page.controls.lblGst.value(item.gst_no);
                //page.controls.txtItemSearch.selectedObject.focus();

                //    page.customerService.getTotalPoint(item.cust_no, function (data, callback) {
                //   $$("lblAvalablePoints").value(data[0].points);

                //});

            });
            page.controls.txtVendorName.noRecordFound = function (txt) {
                txt.val("");

                page.controls.btnAddVendor.show();
                page.controls.hdnVendorNo.val("");
                page.controls.lblPhoneNo.value("");
                page.controls.lblAddress.value("");
                page.controls.lblGst.value("");
                page.controls.lblEmail.value("");
            }

            //Item autocomplete
            page.controls.txtItemSearch.itemTemplate = function (item) {
                // return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>  [mrp: " + item.mrp + "]  <span style='margin:right:30px'><span> " + item.price + "</a>";
                return "<a>" + item.item_name + "_" + item.item_no + "</a>";
            }
            page.controls.txtItemSearch.dataBind({
                getData: function (term, callback) {
                    //page.itemService.getItemAutoComplete(term, page.sales_tax_no, callback);
                    var arr = jQuery.grep(page.productList, function (item, i) {
                        if (item.item_name.toUpperCase().indexOf(term.toUpperCase()) > -1 || item.item_no.toUpperCase().indexOf(term.toUpperCase()) > -1 || (item.barcode == null ? true : item.barcode.toUpperCase().indexOf(term.toUpperCase()) > -1)) {
                            return (item);
                        }
                        // return (item.item_name.toUpperCase().indexOf(term.toUpperCase()) > -1);
                    });
                    callback(arr.slice(0, 50));
                    //callback(arr);
                    // callback(page.productList);
                }
            });
            page.controls.txtItemSearch.select(function (item) {
                if (item != null) {
                    if (item.tax_class_no == null || item.tax_class_no == undefined)
                        item.tax_class_no = 0;
                    var tax_per = 0;
                    // page.taxclassService.getTaxByItem(page.selectedBill.sales_tax_no, item.tax_class_no, function (taxData) {
                    $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                        if (item.tax_class_no == tax_data.tax_class_no)
                            tax_per = tax_data.tax_per;
                    });
                    if (typeof item.item_no != "undefined") {
                        var discountVal = 0;
                        var newitem = {
                            item_no: item.item_no,
                            item_name: item.item_name,
                            unit: item.unit,
                            qty: 1,
                            temp_qty: 1,
                            qty_type: item.qty_type,
                            tray_id: item.tray_no,
                            barcode: item.barcode,
                            qty_stock: item.qty_stock,
                            alter_unit: item.alter_unit,
                            alter_unit_fact: item.alter_unit_fact,
                            tax_per: tax_per,//taxData[0].tax,
                            expiry_days: item.expiry_days,
                            unit_identity: 0,
                            //profit: "0",
                            //selling_price:"0",
                            state_no: "00",
                            temp_free_qty: "0",
                            tax_class_no: item.tax_class_no,
                            tax_inclusive: item.tax_inclusive
                        };
                        var rows = page.controls.grdBill.getRow({
                            item_no: newitem.item_no
                        });


                        if (rows.length == 0) {
                            page.controls.grdBill.createRow(newitem);
                            page.controls.grdBill.edit(true);
                            rows = page.controls.grdBill.getRow({
                                item_no: newitem.item_no
                            });
                            page.controls.grdBill.getAllRows()[parseInt(rows.length) - 1].click();
                            rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                        } else {
                            var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                            txtQty.val(parseInt(txtQty.val()) + 1);
                            txtQty.trigger('change');
                            txtQty.focus();
                        }
                        page.currentPO = item;
                        page.currentPOItem = [];
                        page.currentPOItem = $.util.clone(page.controls.grdBill.allData());

                        page.controls.txtItemSearch.customText("");
                        page.calculate();
                    }
                    // });
                }

            });
            page.controls.txtItemSearch.noRecordFound(function () {
                page.itemService.getTaxClass(function (data) {
                    page.controls.ddlNewTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                });
                $$("txtNewItemCode").value("");
                $$("txtNewItemName").value("");
                $$("itemNewUnit").selectedValue("-1");
                $$("txtNewBarcode").value("");
                $$("ddlNewTax").selectedValue("-1");
                $$("chkNewInclusive").prop('checked', false);
                page.controls.txtNewBarcode.value(page.controls.txtItemSearch.selectedValue());
                page.controls.pnlNewItem.open();
                page.controls.pnlNewItem.title("New Item");
                page.controls.pnlNewItem.width(500);
                page.controls.pnlNewItem.height(450);
                $$("txtNewItemCode").focus();
                //$('#ddlNewTax').change(function () {
                //    $$("btnSaveNewItem").focus();
                //})
                if (CONTEXT.showItemCode) {
                    $$("pnltemCode").show();
                    $$("txtNewItemCode").focus();
                } else {
                    $$("pnltemCode").hide();
                    $$("txtNewItemName").focus();
                }
                if (CONTEXT.showBarCode) {
                    $$("pnlBarCode").show();
                } else {
                    $$("pnlBarCode").hide();
                }
            });
            page.view.selectedPayment([]);
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
                }
            });
            if (CONTEXT.ENABLE_EXP_DATE) {
                $$("pnlExpiryDate").show();
            }
            else {
                $$("pnlExpiryDate").hide();
            }
            if (CONTEXT.ENABLE_MAN_DATE) {
                $$("pnlManDate").show();
            }
            else {
                $$("pnlManDate").hide();
            }
            page.billService.getSalesTaxClass(CONTEXT.DEFAULT_SALES_TAX, function (data) {
                if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                    page.selectedBill.sales_tax_class = data;
                }
            });
            var ex_data = [{
                exp_acc_id: CONTEXT.ExpenseCategory,
                exp_acc_name: "Loading Charge"
            }];
            page.controls.ddlExpName.dataBind(ex_data, "exp_acc_id", "exp_acc_name", "None");

            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                $$("pnlExpenseName").show();
                $$("pnlExpenseAmount").show();
            }
            else {
                $$("pnlExpenseName").hide();
                $$("pnlExpenseAmount").hide();
            }
        }
        page.events.btnNewVariation_click = function () {
            page.vendorService.getActiveVendor(function (data) {
                page.vendorList = data;
                $$("ddlAddInventVendor").dataBind(data, "vendor_no", "vendor_name");

                var searchViewData = [];
                page.controls.pnlNewVariation.open();
                page.controls.pnlNewVariation.title("New Variation");
                page.controls.pnlNewVariation.width("900");
                page.controls.pnlNewVariation.height(300);
                $$("txtNewVariation").focus();
                $$("ddlAddInventVendor").selectedValue(page.controls.txtVendorName.selectedValue());
                //$$("ddlAddInventVendor").disable(true);
                //$$("txtAddInventCost").value(page.controls.grdPOItems.selectedData()[0].buying_cost);
                //$$("txtAddInventCost").disable(true);
                $$("txtNewVariation").val(page.controls.grdBill.selectedData()[0].variation_name);
                $$("txtAddInventCost").val(parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(2));
                $$("txtAddMrp").val(page.controls.grdBill.selectedData()[0].mrp);
                $$("txtAddBatchNo").val(page.controls.grdBill.selectedData()[0].batch_no);
                $$("dsAddExpiryDate").setDate(page.controls.grdBill.selectedData()[0].expiry_date);
                searchViewData.push({ view_no: parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(2), view_name: parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(2) })
                //$$("ddlAddInventCost").dataBind(searchViewData, "view_no", "view_name");
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
            var payModeType = [];
            payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" });
            //if (CONTEXT.ENABLE_REWARD_MODULE == true)
            //    payModeType.push({ mode_type: "Points" })
            //if (CONTEXT.ENABLE_COUPON_MODULE == "true")
            //    payModeType.push({ mode_type: "Coupon" })
            page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
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
                    //else if ($$("ddlPaymentType").selectedValue() == "Coupon") {
                    //    $$("pnlCard").hide();
                    //    $$("pnlCoupon").show();
                    //    $$("pnlPoints").hide();
                    //    $$("pnlAmount").show();
                    //    $$("pnlBalance").show();
                    //}
                else if ($$("ddlPaymentType").selectedValue() == "Card") {
                    $$("pnlCard").show();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                    //else if ($$("ddlPaymentType").selectedValue() == "Points") {
                    //    $$("pnlCard").hide();
                    //    $$("pnlCoupon").hide();
                    //    $$("pnlPoints").show();
                    //    $$("pnlAmount").hide();
                    //    $$("pnlBalance").hide();
                    //}
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
                    throw "Amount should not be exceed than the total amount";
                if (CONTEXT.RESTAPI) {
                    page.checkItems(function () {
                        page.saveBill_click("Purchase", "Mixed", function (currentBillNo) {
                            page.controls.pnlPayNow.close();
                            //if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                            //    page.addpoints(currentBillNo);
                            //}
                            if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                page.addTray();
                            }
                            if (CONTEXT.ENABLE_EMAIL == "true") {
                                page.events.btnSendMail_click();
                            }
                            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                                page.events.btnSendSMS_click();
                            }
                            //if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                            //    page.interface.printBill(currentBillNo);
                            //}
                            if (CONTEXT.ENABLE_JASPER) {
                                // PrintService.PrintReceipt("");
                                page.printJasper(currentBillNo, "PDF");
                            }

                            //page.interface.printBill(currentBillNo);
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                        })
                    });
                }
                else {
                    page.payMixedBill("Purchase", function (currentBillNo) {
                        page.controls.pnlPayNow.close();
                        //if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                        //    page.addpoints(currentBillNo);
                        //}
                        if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                            page.addTray();
                        }
                        if (CONTEXT.ENABLE_EMAIL == "true") {
                            page.events.btnSendMail_click();
                        }
                        if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                            page.events.btnSendSMS_click();
                        }
                        //if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                        //    page.interface.printBill(currentBillNo);
                        //}
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
            if (page.controls.grdBill.allData().length == 0) {
                alert("No item(s) can be purchase");
            }
            else if ($$("ddlPayMode").selectedValue() == "Mixed") {
                page.events.btnPay_now_click();
            }
            else {
                if (CONTEXT.RESTAPI) {
                    page.checkItems(function () {
                        var pay_mode = ($$("ddlPayMode").selectedValue() == "Loan") ? "Loan" : "Cash";
                        page.saveBill_click("Purchase", pay_mode, function (currentBillNo) {
                            if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                page.addTray(currentBillNo);
                            }
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                        });
                    });
                }
                else {
                    //Create a purchase Bill
                    page.saveBill("Purchase", function (currentBillNo) {
                        // page.interface.printBill(currentBillNo);
                        // page.printJasper(currentBillNo, "PDF");
                        if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                            page.addTray(currentBillNo);
                        }
                        //if (CONTEXT.ENABLE_JASPER)
                        //    page.printJasper(currentBillNo, "PDF");
                        page.interface.closeBill();
                        page.interface.launchNewBill();
                    });
                }
            }
        }
        page.events.btnSave_click = function () {
            if (page.controls.grdBill.allData().length == 0) {
                alert("No item(s) can be purchase");
            } else {
                if (CONTEXT.RESTAPI) {
                    page.checkItems(function () {
                        page.saveBill_click("PurchaseSave", "PurchaseSave", function (currentBillNo) {
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                        });
                    });
                }
                else {
                    //Create a Saved Bill
                    page.saveBill("Saved", function (currentBillNo) {
                        page.interface.closeBill();
                        page.interface.launchNewBill();
                    });
                }
            }
        }
        
        page.events.btnItemDiscountOK_click = function () {
            var arr = jQuery.grep(page.selectedBill.discounts, function (n, i) {
                return (n.disc_no == 7 && n.item_no == page.discount_item_no);
            });

            if (arr.length > 0) {
                arr[0].disc_value = page.controls.txtItemDiscountValue.val();
            } else {
                page.selectedBill.discounts.push({
                    disc_no: 7,
                    disc_type: "Fixed",
                    disc_name: "Manual Discount by User",
                    disc_value: page.controls.txtItemDiscountValue.val(),
                    item_no: page.discount_item_no
                });
            }


            page.calculate();
            page.controls.txtItemDiscountValue.val("");
            //page.controls.pnlItemDiscountPopup.close();
        }

        page.events.btnSendMail_click = function () {
           
        }
        page.events.btnSendSMS_click = function () {
            
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

        page.view = {

            UIState: function (state) {

                if (state == "NewBill") {
                    $$("btnReturn").hide();
                    $$("btnPayment").show();
                    $$("btnAddVendor").show();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.removeAttr('readonly');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                    $$("txtBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));

                }
                if (state == "Saved") {
                    $$("btnReturn").hide();
                    $$("btnSave").show();
                    $$("btnPayment").show();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.removeAttr('readonly');


                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                }
                if (state == "Purchase") {
                    $$("btnReturn").show();
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").hide();
                    page.state = "Purchase";
                    $$("pnlItemSearch").hide();
                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();    //TODO : show if return is there
                    $$("txtBillDate").disable(true);
                }

                if (state == "Return") {
                    $$("btnReturn").hide();
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();
                    $$("grdBill").edit(false);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(true);

                }
                if (state == "NewReturn") {
                    $$("btnReturn").hide();
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").hide();
                    $$("grdReturnItemSelection").show();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                }
                if (state == "New") {
                    page.controls.grdBillReturn.display("none");
                    page.controls.grdBill.width("3500px");
                    page.controls.grdBill.height("200px");
                    page.controls.grdBill.setTemplate({
                        selection: true,

                        columns: [
                           { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                            { 'name': "Item No", 'width': "80px", 'dataField': "item_no", editable: false },
                            { 'name': "Item Name", 'width': "150px", 'dataField': "item_name", editable: false },
                            { 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                           { 'name': "Stocked", 'width': "60px", 'dataField': "qty", editable: false },
                           { 'name': "Returned", 'width': "90px", 'dataField': "qty_returned", editable: false },
                           { 'name': "", 'width': "0px", 'dataField': "ret_qty", editable: false,visible:false },
                            { 'name': "Return Qty", 'width': "100px", 'dataField': "temp_ret_qty", editable: true },
                            { 'name': "Free Qty", 'width': "80px", 'dataField': "free_qty", editable: false,visible:CONTEXT.showFree },
                            { 'name': "Returned Free", 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.showFree },
                            { 'name': "", 'width': "0px", 'dataField': "ret_free", editable: true, visible: CONTEXT.showFree },
                            { 'name': "Free Item", 'width': "100px", 'dataField': "temp_ret_free", editable: true, visible: CONTEXT.showFree },
                            { 'name': "Tray", 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "GST(%)", 'width': "70px", 'dataField': "tax_per" },
                            { 'name': "MRP", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Man Date", 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "Price to return", 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Amount", 'width': "100px", 'dataField': "tot_amount" },
                            { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                          { 'name': "", 'width': "0px", 'dataField': "amount" },
                          { 'name': "", 'width': "0px", 'dataField': "cost" },
                          { 'name': "", 'width': "0px", 'dataField': "tax_per" },
                          { 'name': "", 'width': "0px", 'dataField': "var_no" },
                          { 'name': "", 'width': "0px", 'dataField': "free_var_no" },

                          { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                          { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                          { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },

                        ]
                    });
                    page.controls.grdBill.rowCommand = function (action, actionElement, rowId, row, rowData) {
                        if (action == "Delete") {
                            page.controls.grdBill.deleteRow(rowId);
                            page.calculate();
                            if (page.currentBillNo != null)
                                page.billService.deleteBillItem(page.currentBillNo, rowData.item_no);
                        }
                        if (action == "New") {
                            if (page.state != "Purchase")
                                page.events.btnNewVariation_click();
                        }
                    }
                    page.controls.grdBill.beforeRowBound = function (row, item) {
                        item.buying_cost = parseFloat(parseFloat(item.total_price) / parseFloat(item.qty)).toFixed(2);
                        item.chk_new_var = 0;

                    }
                    page.controls.grdBill.rowBound = function (row, item) {

                        if (item.expiry_date == undefined || item.expiry_date == null || item.expiry_date == "") {

                        } else {
                            $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                            item.expiry_date = item.expiry_date;
                            $(row).find("[datafield=expiry_date]").find("div").html(item.expiry_date);
                        }

                        if (item.man_date == undefined || item.man_date == null || item.man_date == "") {

                        } else {
                            $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));
                            item.man_date = item.man_date;
                            $(row).find("[datafield=man_date]").find("div").html(item.man_date);
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
                            item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));

                            item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));

                            item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty_returned]").find("div").html(parseFloat(item.qty_returned));

                            $(row).find("[id=itemUnit]").val(1);
                        }

                        row.find("div[datafield=btn_variation_name]").css("visibility", "false");
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
                            page.calculate();
                        });
                        if (item.state_no == "100" || item.state_no == "200" || item.state_no == "300" || item.state_no == "904") {
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                                    var len = item.expiry_date.length;
                                    var month = item.expiry_date.substring(len - 7, len - 5);
                                    var year = item.expiry_date.substring(len - 4, len);
                                    item.expiry_date = month + "-" + year;
                                    row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                    $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-" + item.expiry_date));
                                }
                                if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                                    var len = item.man_date.length;
                                    var month = item.man_date.substring(len - 7, len - 5);
                                    var year = item.man_date.substring(len - 4, len);
                                    item.man_date = month + "-" + year;
                                    row.find("input[datafield=man_date]").val(item.man_date);
                                    $(row).find("[datafield=temp_man_date]").find("input").val(dbDate("28-" + item.man_date));
                                }
                            }
                            else {
                                item.expiry_date = item.expiry_date;
                                item.man_date = item.man_date;
                                row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                row.find("input[datafield=man_date]").val(item.man_date);
                            }
                        }
                        //else {
                        //    //To Automatically select first variation for selected item
                        //    //store the variation dta agaist item
                        //    //TODO : last select variation.

                        //    // sett vendor enable  -> vendor(empty possible)   disable - null
                        //    var data = {
                        //        item_no: item.item_no,
                        //    }
                        //    if (CONTEXT.ENABLE_VARIATION_VENDOR_NO)
                        //        data.vendor_no = page.controls.txtVendorName.selectedValue();

                        //    //  if (typeof item.variation_data == "undefined" || item.variation_data == null) {
                        //    //todo : new variation item.variation_data need to be updated
                        //    page.stockService.getAllVariationByItem(data, function (data) {
                        //        //page.variation_data.push(data);
                        //        item.variation_data = data;
                        //        var length = 0;
                        //        // page.variation_data = data;
                        //        if (data.length != 0) {
                        //            parseInt(data[data.length - 1].cost) != 0 ? length = data.length - 1 : length = data.length - 2;
                        //            parseInt(data.length) < 2 ? length = 0 : "";
                        //            item.cost = data[length].cost;
                        //            item.variation_name = data[length].variation_name;
                        //            item.mrp = data[length].mrp;
                        //            item.batch_no = data[length].batch_no;
                        //            item.buying_cost = data[length].cost;
                        //            item.var_no = data[length].var_no;

                        //            row.find("input[datafield=cost]").val(data[length].cost);
                        //            row.find("input[datafield=buying_cost]").val(data[length].cost);
                        //            row.find("input[datafield=variation_name]").val(data[length].variation_name);
                        //            $(row).find("input[datafield=mrp]").val(data[length].mrp);
                        //            $(row).find("input[datafield=batch_no]").val(data[length].batch_no);
                        //            $(row).find("input[datafield=var_no]").val(data[length].var_no);

                        //            //page.calculate();
                        //            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        //                if (data[length].expiry_date != undefined && data[length].expiry_date != null && data[length].expiry_date != "") {
                        //                    var len = data[length].expiry_date.length;
                        //                    var month = data[length].expiry_date.substring(len - 7, len - 5);
                        //                    var year = data[length].expiry_date.substring(len - 4, len);
                        //                    item.expiry_date = month + "-" + year;
                        //                    row.find("input[datafield=expiry_date]").val(item.expiry_date);
                        //                    $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-" + item.expiry_date));
                        //                }
                        //                if (data[length].man_date != undefined && data[length].man_date != null && data[length].man_date != "") {
                        //                    var len = data[length].man_date.length;
                        //                    var month = data[length].man_date.substring(len - 7, len - 5);
                        //                    var year = data[length].man_date.substring(len - 4, len);
                        //                    item.man_date = month + "-" + year;
                        //                    row.find("input[datafield=man_date]").val(item.man_date);
                        //                    $(row).find("[datafield=temp_man_date]").find("input").val(dbDate("28-" + item.man_date));
                        //                }
                        //            }
                        //            else {
                        //                item.expiry_date = data[length].expiry_date;
                        //                item.man_date = data[length].man_date;
                        //                row.find("input[datafield=expiry_date]").val(data[length].expiry_date);
                        //                row.find("input[datafield=man_date]").val(data[length].man_date);
                        //                $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                        //                $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));
                        //            }
                        //            if (data[length].active == "0")
                        //                row.find("input[datafield=variation_name]").css("color", "red");
                        //            else
                        //                row.find("input[datafield=variation_name]").css("color", "black");
                        //        }
                        //    });
                        //    //  }
                        //}

                    };
                    page.controls.grdBill.dataBind([]);
                    page.controls.grdBill.edit(true);


                    page.controls.grdBillReturn.width("100%");
                    page.controls.grdBillReturn.height("100px");
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

        page.addTray = function (currentBillNo) {
            try {
                var trayItems = [];
                $(page.controls.grdBill.allData()).each(function (i, item) {

                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null && item.tray_id != "-1" && typeof item.tray_id != "undefined")
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Vendor Purchase",
                                trans_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                cust_id: page.controls.txtVendorName.selectedValue(),
                                bill_id: currentBillNo
                            });
                });
                page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                });

            } catch (e) {
                page.msgPanel.flash(e);
            }

        }

        page.printJasper = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no,
            }
            page.purchaseBillService.getPurchasePrint(billdata, function (data) {
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
                    var month = item.expiry_date.substring(3, 5);
                    var year = item.expiry_date.substring(6, 10);
                    item.expiry_date = month + "/" + year;
                }
                bill_item.push({
                    "BillItemNo": s_no,
                    "ProductName": item.item_name,	// nonstandard unquoted field name
                    "Pack": item.packing,	// nonstandard single-quoted field name
                    "Mfr": item.man_name,
                    "Batch": item.batch_no,	// standard double-quoted field name
                    "Exp": item.expiry_date,
                    "Qty": item.qty,
                    "FreeQty": item.free_qty,
                    "Rate": parseFloat(item.price).toFixed(2),
                    "PDis": parseFloat(item.discount).toFixed(2),
                    "MRP": parseFloat(item.mrp).toFixed(2),
                    "CGST": parseFloat(item.item_gst_tax).toFixed(2),
                    "SGST": parseFloat(item.item_gst_tax).toFixed(2),
                    "GValue": parseFloat(item.total_price).toFixed(2),
                    "TotalPrice": parseFloat(item.total_price).toFixed(2),
                });
            });
            var accountInfo =
                        {
                            "BillType": "INVOICE",
                            "SupplierName": CONTEXT.COMPANY_NAME,
                            "Phone": CONTEXT.COMPANY_PHONE_NO,
                            "SuppAddress": CONTEXT.COMPANY_ADDRESS,
                            "SuppCityStreetZipCode": "",
                            "DLNo": CONTEXT.COMPANY_DL_NO,
                            "GST": CONTEXT.COMPANY_GST_NO,
                            "TIN": CONTEXT.COMPANY_TIN_NO,
                            //"SupplierName": data.vendor_name,	// standard double-quoted field name
                            //"Phone": data.phone_no,
                            //"SuppAddress": data.address,
                            //"SuppCityStreetZipCode": "",
                            //"DLNo": "",
                            //"GST": "",
                            //"TIN": "",
                            "BillNo": data.bill_no,
                            "BillDate": data.bill_date,
                            "NoofItems": data.no_of_items,
                            "Quantity": data.no_of_qty,
                            "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                            "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                            "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                            "BillAmount": parseFloat(data.total).toFixed(2),
                            "ApplicaName": data.vendor_name,
                            "ApplsName": data.vendor_name.toUpperCase(),
                            "CompanyAddress": data.address,
                            "CompanyCityStreetPincode": "",
                            "CompanyPhoneNoEtc": data.phone_no,
                            "CompanyDLNo": "",
                            "CompanyTINNo": "",
                            "CompanyGST": "",
                            //"ApplicaName": CONTEXT.AppName,
                            //"ApplsName": CONTEXT.AppName.toUpperCase(),
                            //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                            //"CompanyCityStreetPincode": "",
                            //"CompanyPhoneNoEtc": CONTEXT.PhoneNo,
                            //"CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                            //"CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                            //"CompanyGST": CONTEXT.COMPANY_GST_NO,
                            "SSSS": "ORIGINAL",
                            "Original": "ORIGINAL",
                            "RoundAmount": parseFloat(data.round_off).toFixed(2),
                            "BillItem": bill_item
                        };
            if (page.PrintBillType == "Return") {
                accountInfo.BillName = "PURCHASE RETURN BILL";
            }
            else {
                accountInfo.BillName = "PURCHASE BILL";
            }
            //GeneratePrint("ShopOnDev", "ShopOnPOS1.jrxml", accountInfo, exp_type);
            //GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill.jrxml", accountInfo, exp_type);
            PrintService.PrintFile(accountInfo);
            //GeneratePrint("ShopOnDev", "POS.jrxml", accountInfo, exp_type);
            //GeneratePrint("ShopOnDev", "Wood.jrxml", accountInfo, "PDF");
        }
    });
}