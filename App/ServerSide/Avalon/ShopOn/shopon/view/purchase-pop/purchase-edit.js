$.fn.purchaseEditBill = function () {

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
	    page.vendorAPI = new VendorAPI();
        page.stockAPI = new StockAPI();
        page.template("/" + appConfig.root + "/shopon/view/purchase-pop/purchase-edit.html");
	    page.purchaseItemAPI = new PurchaseItemAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.salestaxAPI = new SalesTaxAPI();
        page.salestaxclassAPI = new SalesTaxClassAPI();
        page.itemAPI = new ItemAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.purchaseBillAPI = new PurchaseBillAPI();

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
            $$("txtExpAmount").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length-1].amount);
            
            $$("lblMoreSupplier").value(bill.vendor_name);
            $$("lblMoreTotalPurchase").value(bill.vendor_tot_purchase);
            $$("lblMoreTotalReturn").value(bill.vendor_tot_return);
            $$("lblMoreTotalPurchasePayment").value(bill.vendor_tot_purchase_payment);
            $$("lblMoreTotalReturnPayment").value(bill.vendor_tot_ret_payment);
            $$("lblMorePendingPayment").value(bill.vendor_tot_pending_pay);
            $$("lblMorePendingSettlement").value(bill.vendor_tot_pending_settlement);

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
                //        total = parseFloat(parseFloat(total) + parseFloat(item.total_price)).toFixed(5);
                //        sub_total = parseFloat(parseFloat(sub_total) + parseFloat(item.price)).toFixed(5);
                //        discount = parseFloat(parseFloat(discount) + parseFloat(item.discount)).toFixed(5);

                //        tax = parseFloat(parseFloat(tax) + (parseFloat(item.price) * parseFloat(item.qty) - parseFloat(item.total_price) - parseFloat(item.discount))).toFixed(5);
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
                        { 'name': "  ", 'width': "50px", 'dataField': "item_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='background-image: url(https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-128.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 23px;    border: none;    cursor: pointer;' />" },
                        { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                           
                           { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                           { 'name': "Item Name", 'width': "230px", 'dataField': "item_name" },
                           { 'name': "Item No", 'width': "80px", 'dataField': "item_no" },
                           { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                           { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                           { 'name': "", 'width': "0px", 'dataField': "qty", editable: true },
                           { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: true, visible: CONTEXT.SHOW_FREE },
                           { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: true },
                           { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: true, visible: CONTEXT.SHOW_FREE },
                           { 'name': "Tray", 'width': "80px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                           //{ 'name': "Unit", 'width': "80px", 'dataField': "unit" },
                           { 'name': "Unit", 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                           { 'name': "Cost", 'width': "80px", 'dataField': "cost", editable: true },
                           { 'name': "Disc %", 'width': "80px", 'dataField': "disc_per", editable: true },
                           { 'name': "Disc Value", 'width': "90px", 'dataField': "disc_val", editable: true },
                           { 'name': "GST %", 'width': "70px", 'dataField': "tax_per", editable: false },
                           { 'name': "Net Rate", 'width': "100px", 'dataField': "net_rate", editable: false },
                           { 'name': "MRP", 'width': "70px", 'dataField': "mrp", editable: true, visible: CONTEXT.ENABLE_MRP },
                           { 'name': "Prev" + CONTEXT.SALE_PRICE_NAME, 'width': "130px", 'dataField': "pre_selling_price", editable: false },
                           { 'name': "Profit %", 'width': "120px", 'dataField': "profit", editable: true },
                           { 'name': CONTEXT.SALE_PRICE_NAME, 'width': "120px", 'dataField': "selling_price", editable: true },
                           { 'name': "Free" + CONTEXT.SALE_PRICE_NAME, 'width': "150px", 'dataField': "free_selling_price", editable: true },

                           //Rate Configuration
                           { 'name': "Pre" + CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'width': "150px", 'dataField': "pre_alter_price_1", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "New" + CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'width': "120px", 'dataField': "alter_price_1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "Pre" + CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'width': "150px", 'dataField': "pre_alter_price_2", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                           { 'name': "New" + CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'width': "120px", 'dataField': "alter_price_2", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },

                           { 'name': "Total", 'width': "90px", 'dataField': "total_price" },
                           { 'name': "Man Date", 'width': "120px", 'dataField': "man_date", editable: true, visible: CONTEXT.ENABLE_MAN_DATE && false, },// itemTemplate: "<div  id='prdManDate' style=''></div>" },
                           { 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", editable: true, visible: CONTEXT.ENABLE_EXP_DATE && false },
                           { 'name': "Manufacture Date", 'width': "260px", 'dataField': "temp_man_date", visible: CONTEXT.ENABLE_MAN_DATE, itemTemplate: "<input type='date' dataField='temp_man_date'>" },
                           { 'name': "Expiry Date", 'width': "260px", 'dataField': "temp_expiry_date", visible: CONTEXT.ENABLE_EXP_DATE, itemTemplate: "<input type='date' dataField='temp_expiry_date'>" },
                           { 'name': "Batch No", 'width': "100px", 'dataField': "batch_no", editable: true, visible: CONTEXT.ENABLE_BAT_NO },
                           { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: true, visible: CONTEXT.ENABLE_VARIATION },
                           { 'name': "", 'width': "50px", 'dataField': "btn_variation_name", editable: false, visible: CONTEXT.ENABLE_VARIATION, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='New' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/new-icon.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                           { 'name': "Free Variation", 'width': "150px", 'dataField': "free_variation_name", visible: CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE },
                           { 'name': "Buying Cost", '90px': "100px", 'dataField': "buying_cost" },
                           //{ 'name': "", 'width': "", 'dataField': "free_variation_name", editable: false, visible: false },
                           { 'name': "", 'width': "", 'dataField': "free_variation_id", editable: false, visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_cost" },
                           { 'name': "", 'width': "0px", 'dataField': "chk_new_var" },
                           { 'name': "", 'width': "0px", 'dataField': "chk_new_free_var" },
                           { 'name': "", 'width': "0px", 'dataField': "expiry_days" },
                           { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                           { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                           { 'name': "", 'width': "0px", 'dataField': "var_no" },
                           { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                           { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                           { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                           //{ 'name': "", 'width': "0px", 'dataField': "man_date", editable: true, visible: CONTEXT.ENABLE_MAN_DATE, },// itemTemplate: "<div  id='prdManDate' style=''></div>" },
                           //{ 'name': "Expiry Date", 'width': "100px", 'dataField': "expiry_date", editable: true, visible: CONTEXT.ENABLE_EXP_DATE },
                           //{ 'name': "", 'width': "0px", 'dataField': "expiry_date", editable: true, visible: CONTEXT.ENABLE_EXP_DATE },
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
                //page.billService.getSalesTaxClass(sales_tax_no, function (sales_tax_class) {
                //page.salestaxclassAPI.getValue({ sales_tax_class_no: sales_tax_no }, function (sales_tax_class) {
                page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + sales_tax_no, "", function (sales_tax_class) {
                    callback(sales_tax_class);
                });
            }
        }
        page.checkItems = function (callback) {
            var err_count = 0;
            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                if ($$("ddlExpName").selectedValue() != "-1") {
                    if (isNaN($$("txtExpAmount").value() == "") || $$("txtExpAmount").value() == "" || $$("txtExpAmount").value() == null || parseInt($$("txtExpAmount").value()) <= 0) {
                        alert("Expense Amount Should Be A Number and non negative");
                        err_count++;
                    }
                }
                else {
                    if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && parseInt($$("txtExpAmount").value()) <= 0) {
                        alert("Please Select the Expense Name");
                        err_count++;
                    }
                }
            }
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
                    if (CONTEXT.ENABLE_MRP) {
                        if (parseFloat(billItem.mrp) < parseFloat(billItem.cost)) {
                            if (!confirm("MRP should not be less than the buying cost for item " + billItem.item_name + "")) {
                                err_count++;
                                throw "MRP should not be less than the buying cost for item " + billItem.item_name + "";
                            }
                        }
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
                    if (billItem.free_selling_price != undefined) {
                        if (parseFloat(billItem.free_selling_price) < 0 || isNaN(billItem.free_selling_price)) {
                            err_count++;
                            throw "Free Qty Selling Price should be number and positive for item " + billItem.item_name + "";
                        }
                    }
                    if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                        if (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined" || isNaN(billItem.tray_received)) {
                            billItem.tray_received = 0;
                        }
                        if (parseFloat(billItem.tray_received) < 0)
                        {
                            err_count++;
                            throw "Tray qty should be number and positive for item " + billItem.item_name + "";
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
                        if (billItem.expiry_days != null && billItem.expiry_days != "" && typeof billItem.expiry_days != "undefined") {
                            if (parseInt(billItem.expiry_days) != 0) {
                                var date = new Date();
                                var newdate = new Date(date);
                                newdate.setDate(newdate.getDate() + parseInt(billItem.expiry_days));
                                var nd = new Date(newdate);
                                var expiry_date = $.datepicker.formatDate("dd-mm-yy", new Date(newdate));
                                billItem.expiry_date = expiry_date;
                            }
                        }
                    }
                } catch (e) {
                    page.msgPanel.show(e);
                    $$("btnSave").show();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                }
            });
            if (err_count == 0) {
                $$("btnSave").hide();
                $$("btnPayment").disable(true);
                $$("btnPayment").hide();
                callback(true);
            }
        }
        page.calculate = function (callback) {
            var finalsubtotal = 0;
            var finaldiscount = 0;
            var finaltax = 0;
            var finaltotal = 0;
            var net_rate=0;

            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var poItem = page.controls.grdBill.getRowData(row);
                if (poItem.cost == "" || poItem.cost == null || poItem.cost == undefined)
                    poItem.cost = 0;
                if (poItem.disc_per == "" || poItem.disc_per == null || poItem.disc_per == undefined)
                    poItem.disc_per = 0;
                if (poItem.disc_val == "" || poItem.disc_val == null || poItem.disc_val == undefined)
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || poItem.tax_per == undefined)
                    poItem.tax_per = 0;
                if (poItem.free_qty == "" || poItem.free_qty == null || poItem.free_qty == undefined)
                    poItem.free_qty = 0;
                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = parseFloat(item.tax_per);
                        }
                    });
                    return rdata;
                }
                poItem.tax_per = parseFloat(getTaxPercent(poItem.tax_class_no));
                //var temp_price = poItem.cost;
                //if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                //    if (poItem.tax_inclusive == "1")
                //        temp_price = parseFloat(temp_price) / parseFloat((parseFloat(poItem.tax_per) / 100) + 1);
                //}
                var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                var discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                
                
                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                var total = subtotal - discount + tax;
                if (CONTEXT.FREE_AVG_BUYING_COST) {
                    var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty) + parseFloat(poItem.free_qty));
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(5);
                } else {
                    var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty));
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(5);
                }
                
                //net_rate = parseFloat(parseFloat(total) / (parseFloat(poItem.qty))).toFixed(5);
                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(5));
                $(row).find("[datafield=buying_cost]").find("div").html(buying_cost);
                $(row).find("[datafield=net_rate]").find("div").html(net_rate);
                $(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);
                
                poItem.net_rate = net_rate;

                //if (poItem.profit.startsWith("#")) {
                //    poItem.profit = poItem.profit.replace(/#/g, 0);
                //    var profper = (parseFloat(poItem.mrp) * parseFloat(poItem.profit)) / 100;
                //    var selling_price = parseFloat(poItem.mrp) - parseFloat(profper);
                //    poItem.selling_price = selling_price;
                //    $(row).find("[datafield=selling_price]").find("div").html(selling_price);

                //} else {
                //    var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(5);
                //    poItem.selling_price = selling_price;
                //    $(row).find("[datafield=selling_price]").find("div").html(selling_price);
                //}

                poItem.total_price = total;
                poItem.buying_cost = buying_cost;
                finalsubtotal = finalsubtotal + subtotal;
                finaldiscount = finaldiscount + discount;
                finaltax = finaltax + tax;
                finaltotal = finaltotal + total;
            });

            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(finaltotal)).toFixed(5);

            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(5));
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(5));
            page.controls.lblDiscount.value(parseFloat(finaldiscount).toFixed(5));
            page.controls.lblTax.value(parseFloat(finaltax).toFixed(5));



            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(5));

            //var remainingAmount = parseFloat(page.controls.lblTotal.value()) - parseFloat(page.controls.lblTotalAmtPaid.html());
            //// page.controls.lblTotalAmtRemaining.html(remainingAmount);
            //page.controls.lblTotalAmtRemaining.value(parseFloat(remainingAmount).toFixed(5));

        }

        //page.cost = function (callback) {
        //    $(page.controls.grdBill.getAllRows()).each(function (i, row) {
        //        var poItem = page.controls.grdBill.getRowData(row);
        //        var var_data = {
        //            item_no: poItem.item_no,
        //            buying_cost: parseFloat(poItem.total_price)/parseFloat(poItem.qty),
        //        }
        //        page.itemService.getAllVariationByItem(var_data, function (vari_data) {
        //            var variation = [];

        //            $(vari_data).each(function (i, item) {
        //                if (item.variation_name != null) {
        //                    var var_data = {
        //                        value: item.variation_name,
        //                        label: item.variation_name,
        //                        mrp: item.mrp,
        //                        batch_no: item.batch_no,
        //                        expiry_date: item.expiry_date
        //                    }
        //                    variation.push(var_data);
        //                }
        //            })
        //            $(row).find("input[datafield=variation_name]").autocomplete({
        //                minLength: 0,
        //                source: variation,
        //                focus: function (event, ui) {
        //                    $(row).find("input[datafield=variation_name]").val(ui.item.label);
        //                    return false;
        //                },
        //                select: function (event, ui) {
        //                    $(row).find("input[datafield=variation_name]").val(ui.item.label);
        //                    $(row).find("input[datafield=mrp]").val(ui.item.mrp);
        //                    $(row).find("input[datafield=batch_no]").val(ui.item.batch_no);
        //                    $(row).find("input[datafield=expiry_date]").val(ui.item.expiry_date);
        //                    return false;
        //                }
        //            })
        //        });
        //    });
        //}
        page.variation = function (row, billItem,callback) {
            var var_data = [];
            $(billItem.variation_data).each(function (i, item) {
                if (item.variation_name != null) {
                    if (parseInt(item.cost) != 0) {
                        var_data.push({
                            value: item.variation_name,
                            label: item.variation_name,
                            mrp: item.mrp,
                            batch_no: item.batch_no,
                            expiry_date: item.expiry_date,
                            cost: item.cost,
                            man_date: item.man_date,
                            active: item.active,
                            var_no: item.var_no,
                            selling_price: item.selling_price,
                            pre_alter_price_1: item.pre_alter_price_1,
                            pre_alter_price_2: item.pre_alter_price_2
                        });
                    }
                }
            })
            callback(var_data);
        }
        page.check_variation = function (row, billItem) {

            billItem.var_no = null;
            billItem.variation_name = null;
            billItem.free_var_no = null;
            billItem.free_variation_name = null;
            billItem.man_date=(billItem.man_date == null) ? "" : billItem.man_date;
            billItem.batch_no = (billItem.batch_no == null) ? "" : billItem.batch_no;
            billItem.expiry_date = (billItem.expiry_date == null) ? "" : billItem.expiry_date;

            $(billItem.variation_data).each(function (i, item) {
                // $(vari_item).each(function (j, item) {
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                        var len = item.expiry_date.length;
                        var month = item.expiry_date.substring(len - 7, len - 5);
                        var year = item.expiry_date.substring(len - 4, len);
                        item.expiry_date = month + "-" + year;
                    }
                    if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
                        len = billItem.expiry_date.length;
                        month = billItem.expiry_date.substring(len - 7, len - 5);
                        year = billItem.expiry_date.substring(len - 4, len);
                        billItem.expiry_date = month + "-" + year;
                    }
                    if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                        len = item.man_date.length;
                        month = item.man_date.substring(len - 7, len - 5);
                        year = item.man_date.substring(len - 4, len);
                        item.man_date = month + "-" + year;
                    }
                    if (billItem.man_date != undefined && billItem.man_date != null && billItem.man_date != "") {
                        len = billItem.man_date.length;
                        month = billItem.man_date.substring(len - 7, len - 5);
                        year = billItem.man_date.substring(len - 4, len);
                        billItem.man_date = month + "-" + year;
                    }
                }

                if (!CONTEXT.ENABLE_VARIATION_VENDOR_NO) {
                    billItem.vendor_no = 0;
                    item.vendor_no = 0;
                }
                var billItem_mrp = isNaN(parseFloat(billItem.mrp)) ? 0 : billItem.mrp;
                var item_mrp = isNaN(parseFloat(item.mrp)) ? 0 : item.mrp;
                if (parseFloat(billItem_mrp) == parseFloat(item_mrp) && billItem.batch_no == item.batch_no &&
                    billItem.vendor_no == item.vendor_no &&
                    billItem.expiry_date == item.expiry_date && billItem.man_date == item.man_date &&
                        parseFloat(billItem.buying_cost) == parseFloat(item.cost)) {

                    billItem.var_no = item.var_no;
                    billItem.variation_name = item.variation_name;
                    row.find("input[datafield=variation_name]").val(billItem.variation_name);
                    if (item.active == "0")
                        row.find("input[datafield=variation_name]").css("color", "red");
                    else
                        row.find("input[datafield=variation_name]").css("color", "black");
                }
                if (CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE) {
                    if (parseFloat(billItem_mrp) == parseFloat(item_mrp) && billItem.batch_no == item.batch_no &&
                   billItem.vendor_no == item.vendor_no &&
                   billItem.expiry_date == item.expiry_date &&
                   billItem.man_date == item.man_date &&
                   parseFloat(item.cost).toFixed(5) == parseFloat(0).toFixed(5)) {

                        billItem.free_var_no = item.var_no;
                        billItem.free_variation_name = item.variation_name;
                        $(row).find("[datafield=free_variation_name]").find("div").html(billItem.free_variation_name);
                        if (item.active == "0")
                            $(row).find("[datafield=free_variation_name]").find("div").css("color", "red");
                        else
                            $(row).find("[datafield=free_variation_name]").find("div").css("color", "black");
                    }
                }


            });

            //if no match founnd
            if (billItem.var_no == null)
                row.find("input[datafield=variation_name]").val("");
            if (billItem.free_var_no == null)
                $(row).find("[datafield=free_variation_name]").find("div").html("");

         


        }
        page.ini_check_variation = function (callback) {
            $(page.controls.grdBill.selectedData()).each(function (i, items) {
                var data = {
                    item_no: items.item_no,
                    mrp: items.mrp,
                    batch_no: items.batch_no,
                    expiry_date: items.expiry_date,
                    buying_cost: items.buying_cost,
                    man_date: items.man_date,
                }
                var che_data = [];
                $(page.variation_data).each(function (i, item) {
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                            var len = item.expiry_date.length;
                            var month = item.expiry_date.substring(len - 7, len - 5);
                            var year = item.expiry_date.substring(len - 4, len);
                            item.expiry_date = month + "-" + year;
                        }
                        if (data.expiry_date != undefined && data.expiry_date != null && data.expiry_date != "") {
                            len = data.expiry_date.length;
                            month = data.expiry_date.substring(len - 7, len - 5);
                            year = data.expiry_date.substring(len - 4, len);
                            data.expiry_date = month + "-" + year;
                        }
                        if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                            len = item.man_date.length;
                            month = item.man_date.substring(len - 7, len - 5);
                            year = item.man_date.substring(len - 4, len);
                            item.man_date = month + "-" + year;
                        }
                        if (data.man_date != undefined && data.man_date != null && data.man_date != "") {
                            len = data.man_date.length;
                            month = data.man_date.substring(len - 7, len - 5);
                            year = data.man_date.substring(len - 4, len);
                            data.man_date = month + "-" + year;
                        }
                    }
                    //    if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost) == parseFloat(item.cost)) {
                    //        che_data.push({
                    //            batch_no: item.batch_no,
                    //            expiry_date: item.expiry_date,
                    //            man_date: item.man_date,
                    //            mrp: item.mrp,
                    //            variation_name: item.variation_name,
                    //            free_variation_id: false,
                    //            cost: item.cost
                    //        });
                    //    }
                    //    if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost).toFixed(5) == parseFloat(0).toFixed(5)) {
                    //        var free_variation_name = item.variation_name;
                    //        var ori_variation_name = item.variation_name.split("-free");
                    //        che_data.push({
                    //            batch_no: item.batch_no,
                    //            expiry_date: item.expiry_date,
                    //            man_date: item.man_date,
                    //            mrp: item.mrp,
                    //            variation_name: ori_variation_name[0],//item.variation_name,
                    //            free_variation_id: true,
                    //            cost: item.cost,
                    //            free_variation_name: free_variation_name
                    //        });
                    //    }
                    //} else {
                        // $(vari_item).each(function (j, item) {
                    if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(data.buying_cost).toFixed(5) == parseFloat(item.cost).toFixed(5)) {
                        che_data.push({
                            batch_no: item.batch_no,
                            expiry_date: item.expiry_date,
                            man_date: item.man_date,
                            mrp: item.mrp,
                            variation_name: item.variation_name,
                            free_variation_id: false,
                            cost: item.cost
                        });
                    }
                    if (parseFloat(data.mrp) == parseFloat(item.mrp) && data.batch_no == item.batch_no && data.expiry_date == item.expiry_date && data.man_date == item.man_date && parseFloat(0).toFixed(5) == parseFloat(item.cost).toFixed(5)) {
                        var free_variation_name = item.variation_name;
                        var ori_variation_name = item.variation_name.split("-free");
                        che_data.push({
                            batch_no: item.batch_no,
                            expiry_date: item.expiry_date,
                            man_date: item.man_date,
                            mrp: item.mrp,
                            variation_name: ori_variation_name[0],
                            free_variation_id: true,
                            cost: item.cost,
                            free_variation_name: free_variation_name
                        });
                    }
                   //}
                 //   })
                })
                callback(che_data);
            });
        }
        //page.saveBill = function (bill_type, callback) {
        //    var err_count = 0;
        //    try { 

        //    $(".detail-info").progressBar("show")
        //    var newBill = {
        //        bill_no: page.currentBillNo,
        //        bill_date: $$("txtBillDate").getDate(),
        //         //store_no: CONTEXT.store_no,
        //         //reg_no: CONTEXT.reg_no,
        //         user_no: CONTEXT.user_no,
 
        //         sub_total: page.controls.lblSubTotal.value(),
        //         total: page.controls.lblTotal.value(),
        //         discount: page.controls.lblDiscount.value(),
        //         tax: page.controls.lblTax.value(),
 
        //         bill_type: bill_type,
        //         state_no: (bill_type == "Purchase")?904:100,
        //         pay_type: $$("ddlPayMode").selectedValue(),
        //        round_off: page.controls.lblRndOff.value(),
        //     };
 
        //     if (page.controls.hdnVendorNo.val() != "") {
        //         newBill.vendor_no = page.controls.hdnVendorNo.val()
        //     }
        //     if (bill_type == "Return") {
        //         newBill.return_bill_no = page.selectedBill.bill_no;
        //     }
 
        //     var rbillItems = [];
        //    // Insert or  [update - will delete all bill items]
        //     page.purchaseBillService.saveBill(newBill, function (data) {
        //         //currentBillNo = data[0].key_value;
        //         currentBillNo = data;
        //         $(page.controls.grdBill.allData()).each(function (i, billItem) {
        //             try { 
        //                 if (billItem.qty == undefined || billItem.qty == "" || billItem.qty == null || parseFloat(billItem.qty) <= 0 || isNaN(billItem.qty))
        //                 {
        //                     err_count++;
        //                     throw "Qty should be number and positive for item " + billItem.item_name + "";
        //                 }
        //                 if (billItem.free_qty == undefined || billItem.free_qty == "" || billItem.free_qty == null || isNaN(billItem.free_qty))
        //                 billItem.free_qty = 0;
        //                 if (parseFloat(billItem.free_qty) < 0 ) {
        //                     err_count++;
        //                     throw "Free qty should be number and positive for item " + billItem.item_name + "";
        //                 }
        //                 if (billItem.cost == undefined || billItem.cost == "" || billItem.cost == null || parseFloat(billItem.cost) <= 0 || isNaN(billItem.cost)) {
        //                     err_count++;
        //                     throw "Cost should be number and positive for item " + billItem.item_name + "";
        //                 }
        //             if (billItem.disc_per == undefined || billItem.disc_per == "" || billItem.disc_per == null)
        //                 billItem.disc_per = 0;
        //             if (parseFloat(billItem.disc_per) < 0 || isNaN(billItem.disc_per)) {
        //                 err_count++;
        //                 throw "Discount should be number and positive for item " + billItem.item_name + "";
        //             }
        //             if (billItem.disc_val == undefined || billItem.disc_val == "" || billItem.disc_val == null)
        //                 billItem.disc_val = 0;
        //             if (parseFloat(billItem.disc_val) < 0 || isNaN(billItem.disc_val)) {
        //                 err_count++;
        //                 throw "Discount should be number and positive for item " + billItem.item_name + "";
        //             }
        //             if (billItem.tax_per == undefined || billItem.tax_per == "" || billItem.tax_per == null)
        //                 billItem.tax_per = 0;
        //             if (parseFloat(billItem.tax_per) < 0 || isNaN(billItem.tax_per)) {
        //                 err_count++;
        //                 throw "Tax should be number and positive for item " + billItem.item_name + "";
        //             }
        //             if (billItem.mrp == "" || billItem.mrp == null || typeof billItem.mrp == "undefined") {
        //                 billItem.mrp = 0;
        //             }
        //             if (parseFloat(billItem.mrp) < 0 || isNaN(billItem.mrp)) {
        //                 err_count++;
        //                 throw "MRP should be number and positive for item " + billItem.item_name + "";
        //             }
        //             if (billItem.var_no == "" || billItem.var_no == null || typeof billItem.var_no == "undefined") {
        //                 billItem.var_no = 0;
        //             }
        //             if (billItem.free_var_no == "" || billItem.free_var_no == null || typeof billItem.free_var_no == "undefined") {
        //                 billItem.free_var_no = 0;
        //             }
        //             if (billItem.selling_price != undefined) {
        //                 if (parseFloat(billItem.selling_price) < 0 || isNaN(billItem.selling_price)) {
        //                     err_count++;
        //                     throw "Selling Price should be number and positive for item " + billItem.item_name + "";
        //                 }  
        //             }
        //             if (!CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                 if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
        //                 var EnteredDate = billItem.expiry_date;
        //                 var date = EnteredDate.substring(0, 2);
        //                 var month = EnteredDate.substring(3, 5);
        //                 var year = EnteredDate.substring(6, 10);

        //                 var myDate = new Date(year, month - 1, date);
        //                 var today = new Date();
        //                 today.setHours(0, 0, 0, 0);
        //                 if (myDate <= today) {
        //                     err_count++;
        //                     throw "Expiry date is not valid for item " + billItem.item_name + "";
        //                 }
        //             }
        //             }
        //             if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                 if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
        //                     var len = billItem.expiry_date.length;
        //                     var month = billItem.expiry_date.substring(len - 7, len - 5);
        //                     var year = billItem.expiry_date.substring(len - 4, len);
        //                     billItem.expiry_date = "28-"+month + "-" + year;
        //                 }
        //             }
        //             if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                 if (billItem.man_date != undefined && billItem.man_date != null && billItem.man_date != "") {
        //                     len = billItem.man_date.length;
        //                     month = billItem.man_date.substring(len - 7, len - 5);
        //                     year = billItem.man_date.substring(len - 4, len);
        //                     billItem.man_date = "28-" + month + "-" + year;
        //                 }
        //             }
        //             if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
        //                 if (parseInt(billItem.expiry_days) != 0) {
        //                     var date = new Date();
        //                     var newdate = new Date(date);
        //                     newdate.setDate(newdate.getDate() + parseInt(billItem.expiry_days));
        //                     var nd = new Date(newdate);
        //                     var expiry_date = $.datepicker.formatDate("dd-mm-yy", new Date(newdate));
        //                     billItem.expiry_date = expiry_date;
        //                 }
        //             }
        //             //if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
        //             //    var start = billItem.qty.length - billItem.alter_unit.length;
        //             //    if (!isNaN(start)) {
        //             //        var lastChar = billItem.qty.substring(start, billItem.qty.length);
        //             //        if (lastChar == billItem.alter_unit) {
        //             //            billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
        //             //        }
        //             //    }
        //             //}
        //             //if (billItem.variation_name == undefined || billItem.variation_name == "" || billItem.variation_name == null) {
        //             //    billItem.variation_name = billItem.item_no + "-" + billItem.cost + "-" + billItem.mrp + "-" + billItem.batch_no + "-" + billItem.expiry_date;
        //             //}
        //             //if (parseFloat(billItem.var_cost).toFixed(5) != parseFloat(billItem.buying_cost).toFixed(5)) {
        //             //    err_count++;
        //             //    throw "Varation cost should not matced with the buying cost";
        //             //}
        //             if (parseFloat(billItem.qty) > 0) {
        //                 rbillItems.push({
        //                     bill_no: currentBillNo,
        //                     item_no: billItem.item_no,
        //                     qty: parseFloat(billItem.qty),
        //                     //free_item:billItem.free_item,
        //                     //price: parseFloat(parseFloat(billItem.total_price) / parseFloat(billItem.qty)).toFixed(5),
        //                     price:parseFloat(billItem.cost).toFixed(5),
        //                     //tax_class_no: 0,
        //                     tax_per: billItem.tax_per,
        //                     disc_val: billItem.disc_val,
        //                     disc_per: billItem.disc_per,
        //                     total_price: billItem.total_price,
        //                     free_qty: billItem.free_qty,
        //                     mrp: (billItem.mrp == undefined) ? "" : parseFloat(billItem.mrp).toFixed(5),
        //                     expiry_date: (billItem.expiry_date == undefined) ? "" : billItem.expiry_date,
        //                     batch_no: (billItem.batch_no == undefined) ? "" : billItem.batch_no,
        //                     selling_price: billItem.selling_price,
        //                     variation_name: (billItem.variation_name == undefined) ? "" : billItem.variation_name,
        //                     buying_cost: parseFloat(billItem.buying_cost).toFixed(5),
        //                     man_date: (billItem.man_date == undefined) ? "" : billItem.man_date,
        //                     chk_new_var: billItem.chk_new_var,
        //                     free_variation_name: billItem.free_variation_name,
        //                     free_variation_id: billItem.free_variation_id,
        //                     unit_identity: billItem.unit_identity,
        //                     //chk_new_free_var: billItem.chk_new_free_var,
        //                     var_no: billItem.var_no,
        //                     free_var_no: billItem.free_var_no
        //                 });
        //             }
        //             } catch (e) {
        //                 page.msgPanel.show(e);
        //             }  
        //         });
        //         if (err_count == 0)
        //         page.purchaseBillService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

        //             //Adjust stock for sale and return
        //             if (bill_type == "Purchase") {
        //                 var inventItems = [];
        //                 var priceItems = [];
        //                 $(rbillItems).each(function (i, data) {
        //                     if (CONTEXT.ENABLE_FREE_VARIATION) {
        //                       if (data.free_qty != 0) {
                                 
        //                         var inventItemNonFree = {
        //                             item_no: data.item_no,
        //                             cost: parseFloat(data.buying_cost).toFixed(5),
        //                             qty: parseFloat(data.qty),
        //                             comments: "",
        //                             invent_type: "Purchase",
        //                             key1: currentBillNo,
        //                             mrp: data.mrp,
        //                             expiry_date: data.expiry_date,
        //                             batch_no: data.batch_no,
        //                             variation_name: data.variation_name,
        //                             //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                             man_date: data.man_date,
        //                             chk_new_var: data.chk_new_var,
        //                             // chk_new_free_var: data.chk_new_free_var,
        //                             var_no: data.var_no,
        //                         };
        //                         if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                             inventItemNonFree.vendor_no = page.controls.hdnVendorNo.val()
        //                         }
        //                         var inventItemFree = {
        //                             item_no: data.item_no,
        //                             cost: "0",
        //                             qty: parseFloat(data.free_qty),
        //                             comments: "",
        //                             invent_type: "Purchase",
        //                             key1: currentBillNo,
        //                             mrp: data.mrp,
        //                             expiry_date: data.expiry_date,
        //                             batch_no: data.batch_no,
        //                             //variation_name: data.variation_name + "-free",
        //                             variation_name: data.free_variation_name,//(data.free_variation_id == true) ? data.free_variation_name : (data.variation_name == "") ? "-free" : data.variation_name + "-free",
        //                             man_date: data.man_date,
        //                             chk_new_var: data.chk_new_var,
        //                             // chk_new_free_var: data.chk_new_free_var,
        //                             var_no: data.free_var_no,
        //                         };
        //                         if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                             inventItemFree.vendor_no = page.controls.hdnVendorNo.val()
        //                         }
        //                         inventItems.push(inventItemNonFree);
        //                         inventItems.push(inventItemFree);
        //                         if (data.selling_price > 0) {
        //                             priceItems.push({
        //                                 item_no: data.item_no,
        //                                 price: parseFloat(data.selling_price).toFixed(5),
        //                                 mrp: data.mrp,
        //                                 //selling_price: data.selling_price,
        //                                 batch_no: data.batch_no,
        //                                 expiry_date: data.expiry_date,
        //                                 valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                 cost: parseFloat(data.buying_cost).toFixed(5),
        //                                 //variation_name: data.variation_name,
        //                                 variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                                 man_date: data.man_date,
        //                                 var_no: data.var_no,
        //                             });
        //                             priceItems.push({
        //                                 item_no: data.item_no,
        //                                 price: parseFloat(data.selling_price).toFixed(5),
        //                                 mrp: data.mrp,
        //                                 //selling_price: data.selling_price,
        //                                 batch_no: data.batch_no,
        //                                 expiry_date: data.expiry_date,
        //                                 valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                 cost: "0",
        //                                 variation_name: (data.free_variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date+"-free" : data.free_variation_name,
        //                                     //(data.free_variation_id == true) ? data.free_variation_name : (data.variation_name == "") ? "-free" : data.variation_name + "-free",
        //                                 //variation_name: (data.variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date + "-free" : data.variation_name + "-free",
        //                                 man_date: data.man_date,
        //                                 var_no: data.free_var_no,
        //                             });
        //                         }
        //                     }
        //                     else {
        //                         var inventItem = {
        //                             item_no: data.item_no,
        //                             cost: parseFloat(data.buying_cost).toFixed(5),
        //                             qty: parseFloat(data.qty) + parseFloat(data.free_qty),
        //                             comments: "",
        //                             invent_type: "Purchase",
        //                             key1: currentBillNo,
        //                             mrp: data.mrp,
        //                             expiry_date: data.expiry_date,
        //                             batch_no: data.batch_no,
        //                             variation_name: data.variation_name,
        //                             man_date: data.man_date,
        //                             chk_new_var: data.chk_new_var,
        //                             //chk_new_free_var: data.chk_new_free_var,
        //                             var_no: data.var_no,
        //                         };
        //                         if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                             inventItem.vendor_no = page.controls.hdnVendorNo.val()
        //                         }
        //                         inventItems.push(inventItem);
        //                         if (data.selling_price > 0) {
        //                             priceItems.push({
        //                                 item_no: data.item_no,
        //                                 price: parseFloat(data.selling_price).toFixed(5),
        //                                 mrp: data.mrp,
        //                                 //selling_price: data.selling_price,
        //                                 batch_no: data.batch_no,
        //                                 expiry_date: data.expiry_date,
        //                                 valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                 //cost: parseFloat(data.price).toFixed(5),
        //                                 cost: parseFloat(data.buying_cost).toFixed(5),
        //                                 //variation_name: data.variation_name,
        //                                 variation_name: (data.variation_name == "") ? data.item_no + "-" + getCookie("user_store_id") +"-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date : data.variation_name,
        //                                 man_date: data.man_date,
        //                                 var_no: data.var_no,
        //                             });
        //                         }
        //                          }
        //                     } else {
        //                         var inventItem = {
        //                             item_no: data.item_no,
        //                             cost: parseFloat(data.buying_cost).toFixed(5),
        //                             qty: parseFloat(data.qty) + parseFloat(data.free_qty),
        //                             comments: "",
        //                             invent_type: "Purchase",
        //                             key1: currentBillNo,
        //                             mrp: data.mrp,
        //                             expiry_date: data.expiry_date,
        //                             batch_no: data.batch_no,
        //                             variation_name: data.variation_name,
        //                             man_date: data.man_date,
        //                             chk_new_var: data.chk_new_var,
        //                             //chk_new_free_var: data.chk_new_free_var,
        //                             var_no: data.var_no,
        //                         };
        //                         if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                             inventItem.vendor_no = page.controls.hdnVendorNo.val()
        //                         }
        //                         inventItems.push(inventItem);
        //                         if (data.selling_price > 0) {
        //                             priceItems.push({
        //                                 item_no: data.item_no,
        //                                 price: parseFloat(data.selling_price).toFixed(5),
        //                                 mrp: data.mrp,
        //                                 //selling_price: data.selling_price,
        //                                 batch_no: data.batch_no,
        //                                 expiry_date: data.expiry_date,
        //                                 valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                 //cost: parseFloat(data.price).toFixed(5),
        //                                 cost: parseFloat(data.buying_cost).toFixed(5),
        //                                 variation_name: data.variation_name,
        //                                 //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                                 man_date: data.man_date,
        //                                 var_no: data.var_no,
        //                             });
        //                         }
        //                     }
        //                 });
 
        //                 //Make inventory entry
        //                 page.inventoryService.insertInventoryItems(0, inventItems, function () {
        //                     page.msgPanel.show("Updating item price...");
        //                     page.itemService.insertPriceItems(0, priceItems, function (pricedata) {

        //                         var billSO = {
        //                             bill_no: currentBillNo,
        //                             collector_id: CONTEXT.user_no,
        //                             pay_desc: "POP Bill Payment",
        //                             amount: parseFloat(page.controls.lblTotal.value()),
        //                             //po_no: page.currentPO.po_no,
        //                             pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                             pay_type: "Purchase",
        //                             pay_mode: page.controls.ddlPayMode.selectedValue()

        //                         };

        //                         page.msgPanel.show("Updating Payments...");
        //                         if (page.controls.ddlPayMode.selectedValue() == "Loan") {
        //                             if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
        //                                 var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
        //                                 if (billSO.pay_type == "Purchase") {
        //                                     var data1 = {
        //                                         comp_id: localStorage.getItem("user_finfacts_comp_id"),
        //                                         per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
        //                                         jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                         description: "POP-" + currentBillNo,
        //                                         target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
        //                                         //amount: parseFloat(page.controls.lblTotal.value()).toFixed(5),
        //                                         //pur_with_tax: parseFloat($$("lblTotal").value()).toFixed(5),
        //                                         pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
        //                                         tax_amt: parseFloat($$("lblTax").value()).toFixed(5),
        //                                         buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
        //                                         round_off: $$("lblRndOff").value(),
        //                                         key_1: currentBillNo,
        //                                         key_2: $$("txtVendorName").selectedValue()

        //                                     };
        //                                     //var data2 = {
        //                                     //    per_id: CONTEXT.PeriodId,
        //                                     //    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
        //                                     //    amount: billSO.amount,
        //                                     //    key_1: page.currentPO.po_no,
        //                                     //    description: "Purchase Order-" + page.currentPO.po_no,
        //                                     //    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                     //    comp_id: CONTEXT.FINFACTS_COMPANY,
        //                                     //};
        //                                     page.finfactsEntry.cashPurchase(data1, function (response) {
        //                                         page.msgPanel.show("POP payment is recorded successfully.");
        //                                     });
        //                                     //page.finfactsService.insertCreditPayment(data2, function (response) {
        //                                     //});

        //                                 }
        //                                 else {
        //                                     page.msgPanel.show("POP payment is recorded successfully.");
        //                                 }

        //                             } else {
        //                                 page.msgPanel.show("POP payment is recorded successfully.");
        //                                 callback(currentBillNo);
        //                             }
        //                         }
        //                         else {
        //                             page.purchaseService.payInvoiceBillSalesOrder(billSO, function (data) {

        //                                 //If finfacts module is enabled then make entry in finfacts.
        //                                 if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
        //                                     var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
        //                                     if (billSO.pay_type == "Purchase") {
        //                                         var data1 = {
        //                                             comp_id: localStorage.getItem("user_finfacts_comp_id"),
        //                                             per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
        //                                             jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                             description: "POP-" + currentBillNo,
        //                                             target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
        //                                             //amount: parseFloat(page.controls.lblTotal.value()).toFixed(5),
        //                                             //pur_with_tax: parseFloat($$("lblTotal").value()).toFixed(5),
        //                                             pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
        //                                             tax_amt: parseFloat($$("lblTax").value()).toFixed(5),
        //                                             buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
        //                                             round_off: $$("lblRndOff").value(),
        //                                             key_1: currentBillNo,
        //                                             key_2: $$("txtVendorName").selectedValue()

        //                                         };
        //                                         //var data2 = {
        //                                         //    per_id: CONTEXT.PeriodId,
        //                                         //    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
        //                                         //    amount: billSO.amount,
        //                                         //    key_1: page.currentPO.po_no,
        //                                         //    description: "Purchase Order-" + page.currentPO.po_no,
        //                                         //    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                         //    comp_id: CONTEXT.FINFACTS_COMPANY,
        //                                         //};
        //                                         page.finfactsEntry.cashPurchase(data1, function (response) {
        //                                             page.msgPanel.show("POP payment is recorded successfully.");
        //                                         });
        //                                         //page.finfactsService.insertCreditPayment(data2, function (response) {
        //                                         //});

        //                                     }
        //                                     else {
        //                                         page.msgPanel.show("POP payment is recorded successfully.");
        //                                     }

        //                                 } else {
        //                                     page.msgPanel.show("POP payment is recorded successfully.");
        //                                     callback(currentBillNo);
        //                                 }

        //                             });
        //                         }
        //                     });
 
        //                 });
 
        //             }
        //             else {
        //                  //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
        //                 callback(currentBillNo);
        //             }
        //             //Insert Bill Discount
        //             //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
        //             callback(currentBillNo);
        //         });
                  
 
        //     });
        //    } catch (e) {
        //        page.msgPanel.show(e);
        //    }
        //}

        //page.payMixedBill = function (bill_type, callback) {
        //    var err_count = 0;
        //    try { 

        //        $(".detail-info").progressBar("show")
        //        var newBill = {
        //            bill_no: page.currentBillNo,
        //            bill_date: $$("txtBillDate").getDate(),
        //            //store_no: CONTEXT.store_no,
        //            //reg_no: CONTEXT.reg_no,
        //            user_no: CONTEXT.user_no,
 
        //            sub_total: page.controls.lblSubTotal.value(),
        //            total: page.controls.lblTotal.value(),
        //            discount: page.controls.lblDiscount.value(),
        //            tax: page.controls.lblTax.value(),
 
        //            bill_type: bill_type,
        //            state_no: (bill_type == "Purchase")?904:100,
        //            pay_type: $$("ddlPaymentType").selectedValue(),
        //            round_off: page.controls.lblRndOff.value(),
        //        };
 
        //        if (page.controls.hdnVendorNo.val() != "") {
        //            newBill.vendor_no = page.controls.hdnVendorNo.val()
        //        }
        //        if (bill_type == "Return") {
        //            newBill.return_bill_no = page.selectedBill.bill_no;
        //        }
 
        //        var rbillItems = [];
        //        // Insert or  [update - will delete all bill items]
        //        page.purchaseBillService.saveBill(newBill, function (data) {
        //            //currentBillNo = data[0].key_value;
        //            currentBillNo = data;
        //            $(page.controls.grdBill.allData()).each(function (i, billItem) {
        //                try { 
        //                    if (billItem.qty == undefined || billItem.qty == "" || billItem.qty == null || parseFloat(billItem.qty) <= 0 || isNaN(billItem.qty))
        //                    {
        //                        err_count++;
        //                        throw "Qty should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.free_qty == undefined || billItem.free_qty == "" || billItem.free_qty == null) 
        //                        billItem.free_qty = 0;
        //                    if (parseFloat(billItem.free_qty) < 0 || isNaN(billItem.free_qty)) {
        //                        err_count++;
        //                        throw "Free qty should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.cost == undefined || billItem.cost == "" || billItem.cost == null || parseFloat(billItem.cost) <= 0 || isNaN(billItem.cost)) {
        //                        err_count++;
        //                        throw "Cost should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.disc_per == undefined || billItem.disc_per == "" || billItem.disc_per == null)
        //                        billItem.disc_per = 0;
        //                    if (parseFloat(billItem.disc_per) < 0 || isNaN(billItem.disc_per)) {
        //                        err_count++;
        //                        throw "Discount should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.disc_val == undefined || billItem.disc_val == "" || billItem.disc_val == null)
        //                        billItem.disc_val = 0;
        //                    if (parseFloat(billItem.disc_val) < 0 || isNaN(billItem.disc_val)) {
        //                        err_count++;
        //                        throw "Discount should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.tax_per == undefined || billItem.tax_per == "" || billItem.tax_per == null)
        //                        billItem.tax_per = 0;
        //                    if (parseFloat(billItem.tax_per) < 0 || isNaN(billItem.tax_per)) {
        //                        err_count++;
        //                        throw "Tax should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.mrp == "" || billItem.mrp == null || typeof billItem.mrp == "undefined") {
        //                        billItem.mrp = 0;
        //                    }
        //                    if (parseFloat(billItem.mrp) < 0 || isNaN(billItem.mrp)) {
        //                        err_count++;
        //                        throw "MRP should be number and positive for item " + billItem.item_name + "";
        //                    }
        //                    if (billItem.var_no == "" || billItem.var_no == null || typeof billItem.var_no == "undefined") {
        //                        billItem.var_no = 0;
        //                    }
        //                    if (billItem.free_var_no == "" || billItem.free_var_no == null || typeof billItem.free_var_no == "undefined") {
        //                        billItem.free_var_no = 0;
        //                    }
        //                    if (billItem.selling_price != undefined) {
        //                        if (parseFloat(billItem.selling_price) < 0 || isNaN(billItem.selling_price)) {
        //                            err_count++;
        //                            throw "Selling Price should be number and positive for item " + billItem.item_name + "";
        //                        }  
        //                    }
        //                    if (!CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                        if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
        //                            var EnteredDate = billItem.expiry_date;
        //                            var date = EnteredDate.substring(0, 2);
        //                            var month = EnteredDate.substring(3, 5);
        //                            var year = EnteredDate.substring(6, 10);

        //                            var myDate = new Date(year, month - 1, date);
        //                            var today = new Date();
        //                            today.setHours(0, 0, 0, 0);
        //                            if (myDate <= today) {
        //                                err_count++;
        //                                throw "Expiry date is not valid for item " + billItem.item_name + "";
        //                            }
        //                        }
        //                    }
        //                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                        if (billItem.expiry_date != undefined && billItem.expiry_date != null && billItem.expiry_date != "") {
        //                            var len = billItem.expiry_date.length;
        //                            var month = billItem.expiry_date.substring(len - 7, len - 5);
        //                            var year = billItem.expiry_date.substring(len - 4, len);
        //                            billItem.expiry_date = "28-"+month + "-" + year;
        //                        }
        //                    }
        //                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
        //                        if (billItem.man_date != undefined && billItem.man_date != null && billItem.man_date != "") {
        //                            len = billItem.man_date.length;
        //                            month = billItem.man_date.substring(len - 7, len - 5);
        //                            year = billItem.man_date.substring(len - 4, len);
        //                            billItem.man_date = "28-" + month + "-" + year;
        //                        }
        //                    }
        //                    if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
        //                        if (parseInt(billItem.expiry_days) != 0) {
        //                            var date = new Date();
        //                            var newdate = new Date(date);
        //                            newdate.setDate(newdate.getDate() + parseInt(billItem.expiry_days));
        //                            var nd = new Date(newdate);
        //                            var expiry_date = $.datepicker.formatDate("dd-mm-yy", new Date(newdate));
        //                            billItem.expiry_date = expiry_date;
        //                        }
        //                    }
        //                    //if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
        //                    //    var start = billItem.qty.length - billItem.alter_unit.length;
        //                    //    if (!isNaN(start)) {
        //                    //        var lastChar = billItem.qty.substring(start, billItem.qty.length);
        //                    //        if (lastChar == billItem.alter_unit) {
        //                    //            billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
        //                    //        }
        //                    //    }
        //                    //}
        //                    //if (billItem.variation_name == undefined || billItem.variation_name == "" || billItem.variation_name == null) {
        //                    //    billItem.variation_name = billItem.item_no + "-" + billItem.cost + "-" + billItem.mrp + "-" + billItem.batch_no + "-" + billItem.expiry_date;
        //                    //}
        //                    //if (parseFloat(billItem.var_cost).toFixed(5) != parseFloat(billItem.buying_cost).toFixed(5)) {
        //                    //    err_count++;
        //                    //    throw "Varation cost should not matced with the buying cost";
        //                    //}
        //                    if (parseFloat(billItem.qty) > 0) {
        //                        rbillItems.push({
        //                            bill_no: currentBillNo,
        //                            item_no: billItem.item_no,
        //                            qty: parseFloat(billItem.qty),
        //                            //free_item:billItem.free_item,
        //                            //price: parseFloat(parseFloat(billItem.total_price) / parseFloat(billItem.qty)).toFixed(5),
        //                            price:parseFloat(billItem.cost).toFixed(5),
        //                            //tax_class_no: 0,
        //                            tax_per: billItem.tax_per,
        //                            disc_val: billItem.disc_val,
        //                            disc_per: billItem.disc_per,
        //                            total_price: billItem.total_price,
        //                            free_qty: billItem.free_qty,
        //                            mrp: (billItem.mrp == undefined) ? "" : parseFloat(billItem.mrp).toFixed(5),
        //                            expiry_date: (billItem.expiry_date == undefined) ? "" : billItem.expiry_date,
        //                            batch_no: (billItem.batch_no == undefined) ? "" : billItem.batch_no,
        //                            selling_price: billItem.selling_price,
        //                            variation_name: (billItem.variation_name == undefined) ? "" : billItem.variation_name,
        //                            free_variation_name: billItem.free_variation_name,
        //                            buying_cost: parseFloat(billItem.buying_cost).toFixed(5),
        //                            man_date: (billItem.man_date == undefined) ? "" : billItem.man_date,
        //                            chk_new_var: billItem.chk_new_var,
        //                            free_variation_name: billItem.free_variation_name,
        //                            free_variation_id: billItem.free_variation_id,
        //                            unit_identity: billItem.unit_identity,
        //                            chk_new_free_var: billItem.chk_new_free_var,
        //                            var_no: billItem.var_no,
        //                            free_var_no:billItem.free_var_no
        //                        });
        //                    }
        //                } catch (e) {
        //                    page.msgPanel.show(e);
        //                }
                         
        //            });
        //            if (err_count == 0)
        //                page.purchaseBillService.insertAllBillItems(currentBillNo, 0, rbillItems, function () {

        //                    //Adjust stock for sale and return
        //                    if (bill_type == "Purchase") {
        //                        var inventItems = [];
        //                        var priceItems = [];
        //                        $(rbillItems).each(function (i, data) {
        //                            if (CONTEXT.ENABLE_FREE_VARIATION) {
        //                                if (data.free_qty != 0) {
        //                                    var inventItemFree = {
        //                                        item_no: data.item_no,
        //                                        cost: "0",
        //                                        qty: parseFloat(data.free_qty),
        //                                        comments: "",
        //                                        invent_type: "Purchase",
        //                                        key1: currentBillNo,
        //                                        mrp: data.mrp,
        //                                        expiry_date: data.expiry_date,
        //                                        batch_no: data.batch_no,
        //                                        //variation_name: data.variation_name + "-free",
        //                                        variation_name: data.free_variation_name,//(data.free_variation_id == true)?data.free_variation_name:(data.variation_name == "") ?"-free" : data.variation_name + "-free",
        //                                        man_date: data.man_date,
        //                                        chk_new_var: data.chk_new_var,
        //                                        chk_new_free_var: data.chk_new_free_var,
        //                                        var_no:data.free_var_no
        //                                    };
        //                                    if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                                        inventItemFree.vendor_no = page.controls.hdnVendorNo.val()
        //                                    }
        //                                    var inventItemNonFree = {
        //                                        item_no: data.item_no,
        //                                        cost: parseFloat(data.buying_cost).toFixed(5),
        //                                        qty: parseFloat(data.qty),
        //                                        comments: "",
        //                                        invent_type: "Purchase",
        //                                        key1: currentBillNo,
        //                                        mrp: data.mrp,
        //                                        expiry_date: data.expiry_date,
        //                                        batch_no: data.batch_no,
        //                                        variation_name: data.variation_name,
        //                                        //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                                        man_date: data.man_date,
        //                                        chk_new_var: data.chk_new_var,
        //                                        chk_new_free_var: data.chk_new_free_var,
        //                                        var_no:data.var_no
        //                                    };
        //                                    if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                                        inventItemNonFree.vendor_no = page.controls.hdnVendorNo.val()
        //                                    }
        //                                    inventItems.push(inventItemNonFree);
        //                                    inventItems.push(inventItemFree);
        //                                    if (data.selling_price > 0) {
        //                                        priceItems.push({
        //                                            item_no: data.item_no,
        //                                            price: parseFloat(data.selling_price).toFixed(5),
        //                                            mrp: data.mrp,
        //                                            //selling_price: data.selling_price,
        //                                            batch_no: data.batch_no,
        //                                            expiry_date: data.expiry_date,
        //                                            valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                            cost: parseFloat(data.buying_cost).toFixed(5),
        //                                            variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                                            //variation_name: data.variation_name,
        //                                            //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                                            man_date: data.man_date,
        //                                            var_no: data.var_no
        //                                        });
        //                                        priceItems.push({
        //                                            item_no: data.item_no,
        //                                            price: parseFloat(data.selling_price).toFixed(5),
        //                                            mrp: data.mrp,
        //                                            //selling_price: data.selling_price,
        //                                            batch_no: data.batch_no,
        //                                            expiry_date: data.expiry_date,
        //                                            valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                            cost: "0",
        //                                            variation_name: (data.free_variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date+"-free" : data.free_variation_name,
        //                                            //variation_name: (data.variation_name == "") ? data.item_no + "-0-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date + "-free" : data.variation_name + "-free",
        //                                            man_date: data.man_date,
        //                                            var_no: data.free_var_no
        //                                        });
        //                                    }
        //                                }
        //                                else {
        //                                    var inventItem = {
        //                                        item_no: data.item_no,
        //                                        cost: parseFloat(data.buying_cost).toFixed(5),
        //                                        qty: parseFloat(data.qty) + parseFloat(data.free_qty),
        //                                        comments: "",
        //                                        invent_type: "Purchase",
        //                                        key1: currentBillNo,
        //                                        mrp: data.mrp,
        //                                        expiry_date: data.expiry_date,
        //                                        batch_no: data.batch_no,
        //                                        variation_name: data.variation_name,
        //                                        man_date: data.man_date,
        //                                        chk_new_var: data.chk_new_var,
        //                                        chk_new_free_var: data.chk_new_free_var,
        //                                        var_no: data.var_no
        //                                    };
        //                                    if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                                        inventItem.vendor_no = page.controls.hdnVendorNo.val()
        //                                    }
        //                                    inventItems.push(inventItem);
        //                                    if (data.selling_price > 0) {
        //                                        priceItems.push({
        //                                            item_no: data.item_no,
        //                                            price: parseFloat(data.selling_price).toFixed(5),
        //                                            mrp: data.mrp,
        //                                            //selling_price: data.selling_price,
        //                                            batch_no: data.batch_no,
        //                                            expiry_date: data.expiry_date,
        //                                            valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                            //cost: parseFloat(data.price).toFixed(5),
        //                                            cost: parseFloat(data.buying_cost).toFixed(5),
        //                                            variation_name: (data.variation_name == "") ? data.item_no + "-" + getCookie("user_store_id") + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.man_date + "-" + data.expiry_date : data.variation_name,
        //                                            man_date: data.man_date,
        //                                            var_no: data.var_no
        //                                        });
        //                                    }
        //                                }
        //                            } else {
        //                                var inventItem = {
        //                                    item_no: data.item_no,
        //                                    cost: parseFloat(data.buying_cost).toFixed(5),
        //                                    qty: parseFloat(data.qty) + parseFloat(data.free_qty),
        //                                    comments: "",
        //                                    invent_type: "Purchase",
        //                                    key1: currentBillNo,
        //                                    mrp: data.mrp,
        //                                    expiry_date: data.expiry_date,
        //                                    batch_no: data.batch_no,
        //                                    variation_name: data.variation_name,
        //                                    man_date: data.man_date,
        //                                    chk_new_var: data.chk_new_var,
        //                                    chk_new_free_var: billItem.chk_new_free_var,
        //                                    var_no: data.var_no
        //                                };
        //                                if (page.controls.hdnVendorNo.val() != "" && page.controls.hdnVendorNo.val() != undefined) {
        //                                    inventItem.vendor_no = page.controls.hdnVendorNo.val()
        //                                }
        //                                inventItems.push(inventItem);
        //                                if (data.selling_price > 0) {
        //                                    priceItems.push({
        //                                        item_no: data.item_no,
        //                                        price: parseFloat(data.selling_price).toFixed(5),
        //                                        mrp: data.mrp,
        //                                        //selling_price: data.selling_price,
        //                                        batch_no: data.batch_no,
        //                                        expiry_date: data.expiry_date,
        //                                        valid_from: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                        //cost: parseFloat(data.price).toFixed(5),
        //                                        cost: parseFloat(data.buying_cost).toFixed(5),
        //                                        variation_name: data.variation_name,
        //                                        //variation_name: (data.variation_name == "") ? data.item_no + "-" + data.buying_cost + "-" + data.mrp + "-" + data.batch_no + "-" + data.expiry_date : data.variation_name,
        //                                        man_date: data.man_date,
        //                                        var_no: data.var_no
        //                                    });
        //                                }
        //                            }
        //                        });
 
        //                        //Make inventory entry
        //                        page.inventoryService.insertInventoryItems(0, inventItems, function () {
                                    
        //                            page.msgPanel.show("Updating item price...");
        //                            page.itemService.insertPriceItems(0, priceItems, function (pricedata) {
        //                                var allBillSO = [];
        //                                var reward_amount = 0;
        //                                $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                                            
        //                                    allBillSO.push({
        //                                        collector_id: CONTEXT.user_no,
        //                                        pay_desc: "POS Bill Payment",
        //                                        amount: item.amount,
        //                                        bill_no: currentBillNo,
        //                                        pay_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                        //pay_type: bill_type == "Sale" ? "Sale" : "Return",
        //                                        pay_type: "Purchase",
        //                                        pay_mode: item.pay_type,
        //                                        card_type: item.card_type,
        //                                        card_no: item.card_no,
        //                                        coupon_no: item.coupon_no
        //                                    });

        //                                });
        //                                page.msgPanel.show("Updating Payments...");
        //                                page.purchaseService.payAllInvoiceBillSalesOrder(0, allBillSO, function (data) {

        //                                    //If finfacts module is enabled then make entry in finfacts.
        //                                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
        //                                        var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
        //                                        if (allBillSO[0].pay_type == "Purchase") {
        //                                            var data1 = {
        //                                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
        //                                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
        //                                                jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
        //                                                description: "POP-" + currentBillNo,
        //                                                target_acc_id: ($$("ddlPaymentType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
        //                                                //amount: parseFloat(page.controls.lblTotal.value()).toFixed(5),
        //                                                //pur_with_tax: parseFloat($$("lblTotal").value()).toFixed(5),
        //                                                pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
        //                                                tax_amt: parseFloat($$("lblTax").value()).toFixed(5),
        //                                                buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
        //                                                round_off: $$("lblRndOff").value(),
        //                                                key_1: currentBillNo,
        //                                                key_2: $$("txtVendorName").selectedValue()

        //                                            };
        //                                            page.finfactsEntry.cashPurchase(data1, function (response) {
        //                                                page.msgPanel.show("POP payment is recorded successfully.");
        //                                            });
        //                                        }
        //                                        else {
        //                                            page.msgPanel.show("POP payment is recorded successfully.");
        //                                        }

        //                                    } else {
        //                                        page.msgPanel.show("POP payment is recorded successfully.");
        //                                        callback(currentBillNo);
        //                                    }

        //                                });
        //                            });

        //                        });

        //                    }
        //                    else {
        //                        //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
        //                        callback(currentBillNo);
        //                    }
        //                    //Insert Bill Discount
        //                    //page.billService.reinsertBillDisount(currentBillNo, page.selectedBill.discounts);
        //                    callback(currentBillNo);
        //                });


        //        });
        //    }
        //    catch (e) {
        //        page.msgPanel.show(e);
        //    }

        //}
        //page.addpoints = function (billno) {
        //    var newItem = {};
        //    var cust_no = page.controls.hdnVendorNo.val();
        //    if (cust_no != "")
        //        page.customerService.getCustomerById(cust_no, function (data) {
        //            page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
        //                page.billService.getBill(billno, function (data1) {
        //                    newItem.cust_no = data[0].cust_no;
        //                    newItem.reward_plan_id = data[0].reward_plan_id;
        //                    //page.vendorList = data;
        //                    newItem.bill_no = data1[0].bill_no;
        //                    newItem.trans_date = data1[0].bill_date;
        //                    newItem.points = data1[0].total * data2[0].reward_plan_point;
        //                    newItem.trans_type = "Credit";
        //                    newItem.setteled_amount = data1[0].total * data2[0].reward_plan_point;
        //                    page.customerService.insertCustomerRewardt(newItem, function (data) {
        //                        page.msgPanel.show("Points added successfully.");
        //                    });
        //                });

        //            });
        //        });
        //}
        page.saveBill_click = function (bill_type,pay_mode, callback) {
            var result = "";
            if (CONTEXT.ENABLE_TOTAL_QTY_IN_BILL) {
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
                    bill_no: (page.currentBillNo == undefined || page.currentBillNo == "" || page.currentBillNo == null) ? "0" : page.currentBillNo,
                    bill_date: dbDateTime($$("txtBillDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    reg_no: localStorage.getItem("user_register_id"),
                    user_no: localStorage.getItem("app_user_id"),

                    sub_total: page.controls.lblSubTotal.value(),
                    total: page.controls.lblTotal.value(),
                    discount: page.controls.lblDiscount.value(),
                    tax: page.controls.lblTax.value(),

                    bill_type: bill_type,
                    state_no: (bill_type == "Purchase") ? "904" : "100",
                    pay_mode: $$("ddlPayMode").selectedValue(),
                    round_off: page.controls.lblRndOff.value(),
                    sales_tax_no: page.selectedBill.sales_tax_no,
                    mobile_no: page.controls.lblPhoneNo.value(),
                    email_id: page.controls.lblEmail.value(),
                    gst_no: page.controls.lblGst.value(),

                    tot_qty_words: result,

                    bill_no_par: (bill_type == "PurchaseReturn") ? page.selectedBill.bill_no : "",
                    vendor_no: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : page.controls.hdnVendorNo.val(),
                    vendor_name: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : vendor_name[0],
                    vendor_address: (page.controls.lblAddress.value() == "" || page.controls.lblAddress.value() == undefined || page.controls.lblAddress.value() == null) ? "" : vendor_name[0],
                    //FINFACTS ENTRY DATA
                    invent_type: "PurchaseCredit",
                    finfacts_comp_id:localStorage.getItem("user_finfacts_comp_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    //fulfill:true
                };

                var rbillItems = [];
                $(page.controls.grdBill.allData()).each(function (i, billItem) {
                    if (parseFloat(billItem.qty) > 0) {
                        rbillItems.push({
                            qty: parseFloat(billItem.qty),
                            free_qty: billItem.free_qty,
                            unit_identity: billItem.unit_identity,
                            price: parseFloat(billItem.cost).toFixed(5),
                            disc_val: billItem.disc_val,
                            disc_per: billItem.disc_per,
                            taxable_value: (parseFloat(billItem.total_price)*parseFloat(billItem.tax_per))/100,
                            tax_per: billItem.tax_per,
                            total_price: billItem.total_price,
                            bill_type: bill_type,

                            tray_received:(billItem.tray_received == null||billItem.tray_received==""||typeof billItem.tray_received=="undefined")?"0":billItem.tray_received,
                            store_no: getCookie("user_store_id"),
                            item_no: billItem.item_no,
                            cost: parseFloat(billItem.buying_cost).toFixed(5),

                            vendor_no: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : page.controls.hdnVendorNo.val(),
                            active: "1",
                            tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                            //amount: parseFloat(billItem.cost) * parseFloat(billItem.qty),
                            amount: (parseFloat(billItem.cost) * parseFloat(billItem.qty)) - ((parseFloat(billItem.cost) * parseFloat(billItem.qty)) * parseFloat(billItem.disc_per) / 100 + (parseFloat(billItem.disc_val) * parseFloat(billItem.qty))),
                            rate: billItem.cost,
                            user_no: CONTEXT.user_no,
                        });
                        if (typeof billItem.selling_price != "undefined" && billItem.selling_price != "" && billItem.selling_price != null && parseInt(billItem.selling_price) != 0) {
                            if (parseFloat(billItem.selling_price) != parseFloat(billItem.pre_selling_price)) {
                                rbillItems[rbillItems.length - 1].selling_price = billItem.selling_price;
                                rbillItems[rbillItems.length - 1].valid_from = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date()));
                                rbillItems[rbillItems.length - 1].free_selling_price = billItem.free_selling_price;
                            }
                            //Rate Price Configuration
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                if (billItem.alter_price_1 == 0 && billItem.alter_price_1 == null || typeof billItem.alter_price_1 == "undefined") {
                                    billItem.alter_price_1 = 0;
                                }
                                rbillItems[rbillItems.length - 1].alter_price_1 = billItem.alter_price_1;
                            }
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                if (billItem.alter_price_2 == 0 && billItem.alter_price_2 == null || typeof billItem.alter_price_2 == "undefined") {
                                    billItem.alter_price_2 = 0;
                                }
                                rbillItems[rbillItems.length - 1].alter_price_2 = billItem.alter_price_2;
                            }
                        }
                    }
                    if(typeof billItem.var_no != "undefined" && billItem.var_no != "" && billItem.var_no != null && parseInt(billItem.var_no) != 0)
                        rbillItems[rbillItems.length - 1].var_no = billItem.var_no;
                    if (typeof billItem.variation_name != "undefined" && billItem.variation_name != "" && billItem.variation_name != null)
                        rbillItems[rbillItems.length - 1].variation_name = billItem.variation_name;
                    if (typeof billItem.free_var_no != "undefined" && billItem.free_var_no != "" && billItem.free_var_no != null)
                        rbillItems[rbillItems.length - 1].free_var_no = billItem.free_var_no;
                    if (CONTEXT.ENABLE_EXP_DATE) {
                        if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                            if (billItem.expiry_days == "0" || billItem.expiry_days == "" || billItem.expiry_days == null || typeof billItem.expiry_days == "undefined") {
                                if (billItem.expiry_date == undefined || billItem.expiry_date == null || billItem.expiry_date == "" || billItem.expiry_date == "--") { }
                                else {
                                    rbillItems[rbillItems.length - 1].expiry_date = dbDateTime(billItem.expiry_date);
                                }
                            }
                            else {
                                if (billItem.expiry_date == undefined || billItem.expiry_date == null || billItem.expiry_date == "" || billItem.expiry_date == "--") {
                                    var today = new Date();
                                    today.setDate(today.getDate() + parseInt(billItem.expiry_days));
                                    rbillItems[rbillItems.length - 1].expiry_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", today));
                                }
                                else {
                                    rbillItems[rbillItems.length - 1].expiry_date = dbDateTime(billItem.expiry_date);
                                }
                            }
                        }
                        else {
                            if (billItem.expiry_date == undefined || billItem.expiry_date == null || billItem.expiry_date == "" || billItem.expiry_date == "--") { }
                            else {
                                rbillItems[rbillItems.length - 1].expiry_date = dbDateTime(billItem.expiry_date);
                            }
                        }
                    }
                    if (CONTEXT.ENABLE_MAN_DATE) {
                        if (billItem.man_date == undefined || billItem.man_date == null || billItem.man_date == "" || billItem.man_date == "--") { }
                        else {
                            rbillItems[rbillItems.length - 1].man_date = dbDateTime(billItem.man_date);
                        }
                    }
                    if (CONTEXT.ENABLE_MRP) {
                        if (billItem.mrp == undefined || billItem.mrp == null || billItem.mrp == "") { }
                        else {
                            rbillItems[rbillItems.length - 1].mrp = billItem.mrp;
                        }
                    }
                    if (CONTEXT.ENABLE_BAT_NO) {
                        if (billItem.batch_no == undefined || billItem.batch_no == null || billItem.batch_no == "") { }
                        else {
                            rbillItems[rbillItems.length - 1].batch_no = billItem.batch_no;
                        }
                    }
                    
                    if (CONTEXT.SHOW_FREE && CONTEXT.ENABLE_FREE_VARIATION) {
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
                            card_no: (item.card_no == null || item.card_no == "" || item.card_no==undefined) ? "" : item.card_no
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
                if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && $$("txtExpAmount").value() != undefined)
                {
                    expense.push({
                        exp_name: $$("ddlExpName").selectedValue(),
                        amount: $$("txtExpAmount").value()
                    });
                }
                newBill.expenses = expense;
                page.stockAPI.insertBill(newBill, function (data) {
                    currentBillNo = data;
                    page.msgPanel.show("Bill Inserted Successfully");
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        page.msgPanel.show("Updating Payments...");
                        if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                            if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && $$("txtExpAmount").value() != undefined) {
                                var expenseData1 = {
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,//CONTEXT.ExpenseAccount,
                                    expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,//CONTEXT.ExpenseCategory,
                                    amount: $$("txtExpAmount").value(),//$$("txtExpense").value(),
                                    description: "POP Expense-" + currentBillNo + $$("ddlExpName").selectedValue(),
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    key_1: currentBillNo,
                                    key_2: $$("txtVendorName").selectedValue(),
                                };
                                //page.accService.insertExpense(expenseData1, function (response) { });
                                page.finfactsEntryAPI.insertExpense(expenseData1, function (response) { });
                            }
                        }
                        if (page.controls.ddlPayMode.selectedValue() == "Loan") {
                            //if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            // page.inventoryService.insertStocks(0, newBill.bill_items, currentBillNo, function (temp) { });
                            var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                            //if (bill_type == "Purchase") {
                            var data1 = {
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                description: "POP-" + currentBillNo,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
                                tax_amt: parseFloat($$("lblTax").value()).toFixed(5),
                                buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                rnd_off: $$("lblRndOff").value(),
                                key_1: currentBillNo,
                                key_2: $$("txtVendorName").selectedValue()
                            };
                            //page.finfactsEntry.creditPurchase(data1, function (response) {
                            page.finfactsEntryAPI.creditPurchase(data1, function (response) {
                                page.msgPanel.show("Finfacts Entry can be added successfully....");
                                callback(currentBillNo);
                            });
                            //page.finfactsEntry.cashPurchase(data1, function (response) {
                            //    page.msgPanel.show("POP payment is recorded successfully.");
                            //    callback(currentBillNo);
                            //});
                            //}
                            //else {
                            //    page.msgPanel.show("POP payment is recorded successfully.");
                            //    callback(currentBillNo);
                            //    page.msgPanel.hide();
                            //}

                            //} else {
                            //    page.msgPanel.show("POP payment is recorded successfully.");
                            //    callback(currentBillNo);
                            //    page.msgPanel.hide();
                            //}
                        }
                        else if (page.controls.ddlPayMode.selectedValue() == "Mixed") {
                            //if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                                //if (bill_type == "Purchase") {
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        description: "POP-" + currentBillNo,
                                        target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
                                        tax_amt: parseFloat($$("lblTax").value()).toFixed(5),
                                        buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                        rnd_off: $$("lblRndOff").value(),
                                        key_1: currentBillNo,
                                        key_2: $$("txtVendorName").selectedValue()
                                    };
                                    var data2 = [];
                                    $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                                        data2.push({
                                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                            paid_amount: item.amount,
                                            description: "POP-" + currentBillNo,
                                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            key_1: currentBillNo,
                                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        });
                                    });

                                    page.finfactsEntryAPI.creditPurchase(data1, function (response) {
                                        page.finfactsEntryAPI.allcreditPurchasePayment(0, data2, function (response) {
                                            page.msgPanel.show("Finfacts Entry can be added successfully....");
                                            callback(currentBillNo);
                                        });
                                    });
                                //}
                                //else {
                                //    page.msgPanel.show("POP payment is recorded successfully.");
                                //    callback(currentBillNo);
                                //    page.msgPanel.hide();
                                //}

                            //}
                            //else {
                            //    page.msgPanel.show("POP payment is recorded successfully.");
                            //    callback(currentBillNo);
                            //    page.msgPanel.hide();
                            //}
                        }
                        else {
                            //if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                //  page.inventoryService.insertStocks(0, newBill.bill_items, currentBillNo, function (temp) { });
                                var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                                //if (bill_type == "Purchase") {
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        description: "POP-" + currentBillNo,
                                        target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                        pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
                                        tax_amt: parseFloat($$("lblTax").value()).toFixed(5),
                                        buying_cost: parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                                        round_off: ($$("lblRndOff").value()),
                                        key_1: currentBillNo,
                                        key_2: $$("txtVendorName").selectedValue()
                                    };
                                    //var data2 = [];
                                    //data2.push({
                                    //    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    //    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    //    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                    //    paid_amount: page.controls.lblTotal.value(),
                                    //    description: "POP-" + currentBillNo,
                                    //    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                    //    key_1: currentBillNo,
                                    //    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    //});
                                    page.finfactsEntryAPI.cashPurchase(data1, function (response) {
                                        //page.finfactsEntry.allcreditPurchasePayment(0, data2, function (response) {
                                        page.msgPanel.show("Finfacts Entry can be added successfully....");
                                        page.msgPanel.hide();
                                        callback(currentBillNo);
                                        //});
                                    });
                                //}
                                //else {
                                //    page.msgPanel.show("POP payment is recorded successfully.");
                                //    callback(currentBillNo);
                                //    page.msgPanel.hide();
                                //}

                            //} else {
                            //    page.msgPanel.show("POP payment is recorded successfully.");
                            //    callback(currentBillNo);
                            //    page.msgPanel.hide();
                            //}
                        }
                    }
                    else {
                        page.msgPanel.show("POP payment is recorded successfully.");
                        callback(currentBillNo);
                        page.msgPanel.hide();
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
                    page.loadSelectedBill(saleBill);
                });
            });
        }

        page.interface.viewBill = function (billNo) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            page.stockAPI.getBill(page.currentBillNo, function (data) {
                var bill = data;
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
                    expenses: bill.expenses,

                    vendor_tot_purchase: bill.total_purchase,
                    vendor_tot_return: bill.total_purchase_return,
                    vendor_tot_purchase_payment: bill.total_purchase_payment,
                    vendor_tot_ret_payment: bill.total_purchase_return_payment,
                    vendor_tot_pending_pay: bill.total_pending_payment,
                    vendor_tot_pending_settlement: bill.total_pending_settlement,
                };
               // page.purchaseBillService.getPOSBillItem(openBill.bill_no, function (billItems) {
                    openBill.billItems = data.bill_items;
                    page.msgPanel.show("Getting Bill Discounts...");
                    page.msgPanel.show("Loading data...");
                    page.loadSelectedBill(openBill, function () {
                        if (openBill.state_text == "Saved")
                            page.calculate();
                        if (bill.state_text == "Purchase") {
                            //page.billService.getSalesTaxClass(openBill.sales_tax_no, function (data) {
                            page.salestaxclassAPI.getValue({ sales_tax_class_no: openBill.sales_tax_no }, function (data) {
                                if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                                    page.selectedBill.sales_tax_class = data;
                                }
                                //page.purchaseBillService.getBillReturn(openBill.bill_no, function (data) {
                                page.purchaseBillAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                                    if (data.length > 0) {
                                        page.controls.grdBillReturn.display("");
                                        page.controls.grdBillReturn.dataBind(data);
                                    }
                                   // page.calculate();
                                });
                            });
                        }
                        if (bill.state_text == "Return") {
                            //page.calculate();
                        }
                        page.msgPanel.show("Bill is opened...");
                    });
                //  });
                    page.msgPanel.hide();
            });
            //page.purchaseBillService.getBill(page.currentBillNo, function (data) {
            //    var bill = data[0];
            //    var openBill = {
            //        vendor_no: bill.vendor_no,
            //        vendor_name: bill.vendor_name,
            //        email: bill.vendor_email,

            //        phone_no: bill.vendor_phone,
            //        address: bill.vendor_address,
            //        sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,

            //        sub_total: bill.sub_total,
            //        total: bill.total,
            //        discount: bill.discount,
            //        tax: bill.tax,
            //        //billItems: [],
            //        //discounts: [],
            //        bill_no: bill.bill_no,
            //        bill_date: bill.bill_date,
            //        state_text: bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
            //        gst_no: bill.gst_no,
            //        round_off:bill.round_off
            //    };

            //   // page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
            //        //openBill.sales_tax_class = sales_tax_class;

            //    page.purchaseBillService.getPOSBillItem(openBill.bill_no, function (billItems) {
            //            openBill.billItems = billItems;

            //            page.msgPanel.show("Getting Bill Discounts...");
            //            //page.billService.getAllBillDiscount(openBill.bill_no, function (discounts) {
            //            //    openBill.discounts = [];
            //            //    $(discounts).each(function (i, item) {
            //            //        openBill.discounts.push({
            //            //            disc_no: item.disc_no,
            //            //            disc_type: item.value_type,
            //            //            disc_name: item.disc_name,
            //            //            disc_value: item.value,
            //            //            item_no: item.item_no
            //            //        });
            //            //    });


            //                page.msgPanel.show("Loading data...");
            //                page.loadSelectedBill(openBill, function () {

            //                    //Recalculae for only saved type
            //                    if (openBill.state_text == "Saved")
            //                        page.calculate();

            //                    if (bill.state_text == "Purchase") {
            //                        //Show return bills if any
            //                        page.purchaseBillService.getBillReturn(openBill.bill_no, function (data) {
            //                            if (data.length > 0) {
            //                                page.controls.grdBillReturn.display("");
            //                                page.controls.grdBillReturn.dataBind(data);
            //                            }
            //                        });
            //                        page.calculate();
            //                        // $$("btnReturn").show();
            //                    }
            //                    if (bill.state_text == "Return") {
            //                        page.calculate();
            //                    }
            //                    page.msgPanel.show("Bill is opened...");
            //                });

            //         //   });

            //        });
            //   // });
            //});
        }

        page.interface.btnSaveBill_click = function () {
            page.events.btnSave_click();
        }
        page.interface.btnPayBill_click = function () {
            page.events.btnPayment_click();
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

            page.vendorAPI.searchValues("", "", "", "", function (data) {
            //page.vendorService.getVendorByAll("%", function (data) {
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
                
                //Vendor More Details
                $$("lblMoreSupplier").value(page.controls.txtVendorName.selectedObject.val().split("_")[0]);
                $$("lblMoreTotalPurchase").value(item.total_purchase);
                $$("lblMoreTotalReturn").value(item.total_purchase_return);
                $$("lblMoreTotalPurchasePayment").value(item.total_purchase_payment);
                $$("lblMoreTotalReturnPayment").value(item.total_purchase_return_payment);
                $$("lblMorePendingPayment").value(parseFloat(item.total_purchase) - parseFloat(item.total_purchase_payment));
                $$("lblMorePendingSettlement").value(parseFloat(item.total_purchase_return) - parseFloat(item.total_purchase_return_payment));
            });
            page.controls.txtVendorName.noRecordFound = function (txt) {
                txt.val("");

                page.controls.btnAddVendor.show();
                page.controls.hdnVendorNo.val("");
                page.controls.lblPhoneNo.value("");
                page.controls.lblAddress.value("");
                page.controls.lblGst.value("");
                page.controls.lblEmail.value("");

                //Vendor More Details
                $$("lblMoreSupplier").value("");
                $$("lblMoreTotalPurchase").value("");
                $$("lblMoreTotalReturn").value("");
                $$("lblMoreTotalPurchasePayment").value("");
                $$("lblMoreTotalReturnPayment").value("");
                $$("lblMorePendingPayment").value("");
                $$("lblMorePendingSettlement").value("");
            }

            //Item autocomplete
            page.controls.txtItemSearch.itemTemplate = function (item) {
                // return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>  [mrp: " + item.mrp + "]  <span style='margin:right:30px'><span> " + item.price + "</a>";
                return "<a>" + item.item_name + "_" + item.item_no + "</a>";
            }
            page.controls.txtItemSearch.dataBind({
                getData: function (term, callback) {
                    //page.itemService.getItemAutoComplete(term, page.sales_tax_no, function (data) {
                    page.purchaseItemAPI.getValue({ item_no: term, sales_tax_no: page.sales_tax_no }, function (data) {
                        callback(data);
                    });
                    //page.itemService.getItemAutoComplete(term, page.sales_tax_no, callback);
                    //var arr = jQuery.grep(page.productList, function (item, i) {
                    //    if (item.item_name.toUpperCase().indexOf(term.toUpperCase()) > -1 || item.item_no.toUpperCase().indexOf(term.toUpperCase()) > -1 || (item.barcode==null?true: item.barcode.toUpperCase().indexOf(term.toUpperCase()) > -1)) {
                    //        return (item);
                    //    }
                    //   // return (item.item_name.toUpperCase().indexOf(term.toUpperCase()) > -1);
                    //});
                    //callback(arr.slice(0, 50));
                    //callback(arr);
                   // callback(page.productList);
                }
            });
            page.controls.txtItemSearch.select(function (item) {
                if (item != null) {
                    if (item.tax_class_no == null || item.tax_class_no == undefined)
                        item.tax_class_no = 0;
                    var tax_per=0;
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
                                tax_inclusive: item.tax_inclusive,
                                rack_no:item.rack_no
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
                                page.controls.grdBill.getAllRows()[parseInt(rows.length)-1].click();
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
                page.taxclassAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlNewTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                });
                $$("txtNewItemCode").value("");
                $$("txtNewItemName").selectedObject.val("");
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

                if (CONTEXT.showItemCode) {
                    $$("pnltemCode").show();
                } else {
                    $$("pnltemCode").hide();
                }
                if (CONTEXT.SHOW_BARCODE) {
                    $$("pnlBarCode").show();
                } else {
                    $$("pnlBarCode").hide();
                }
                $$("txtNewItemName").selectedObject.focus();
                page.controls.txtNewItemName.dataBind({
                    getData: function (term, callback) {
                        callback(page.itemList);
                    }
                });
                page.controls.txtNewItemName.select(function (item) {
                    $$("txtNewItemCode").value(item.item_code);
                    $$("itemNewUnit").selectedValue(item.unit);
                    $$("txtNewBarcode").value("");
                    $$("itemNewUnit").selectedValue(item.unit);
                    $$("ddlNewTax").selectedValue(item.tax_class_no);
                    if (item.tax_inclusive == 1) {
                        $$("chkNewInclusive").prop('checked', true);
                    }
                    else {
                        $$("chkNewInclusive").prop('checked', false);
                    }
                });
                page.controls.txtNewItemName.noRecordFound(function () {
                    $$("txtNewItemCode").value("");
                    $$("itemNewUnit").selectedValue("");
                    $$("txtNewBarcode").value("");
                    $$("itemNewUnit").selectedValue("");
                    $$("ddlNewTax").selectedValue("");
                    $$("chkNewInclusive").prop('checked', false);
                });
                page.controls.txtNewItemName.allowCustomText(function (item) {
                    page.controls.txtNewItemName.selectedObject.val(item.val());
                });
            });
		    page.view.selectedPayment([]);
            //page.billService.getAllSalestax(function (data) {
		    page.salestaxAPI.searchValues("", "", "", "", function (data) {
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
                        $$("btnTaxOK").show();
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
            //page.billService.getSalesTaxClass(CONTEXT.DEFAULT_SALES_TAX, function (data) {
            //page.salestaxclassAPI.getValue({ sales_tax_class_no: CONTEXT.DEFAULT_SALES_TAX }, function (data) {
            page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX, "", function (data) {
                if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                    page.selectedBill.sales_tax_class = data;
                }
            });
            var ex_data = [{
                exp_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
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

            var payModeType = [];
            payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Mixed" }, { mode_type: "Loan" });
            page.controls.ddlPayMode.dataBind(payModeType, "mode_type", "mode_type");
            $$("ddlPayMode").selectedValue(CONTEXT.PURCHASE_BILL_PAY_MODE);
            page.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;

            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.itemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.itemList = data;
            });
        }
        page.events.btnNewVariation_click = function () {
            //page.vendorService.getActiveVendor(function (data) {
            page.vendorAPI.searchValues("", "", "", "", function (data) {
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
                $$("txtAddInventCost").val(parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(5));
                $$("txtAddMrp").val(page.controls.grdBill.selectedData()[0].mrp);
                $$("txtAddBatchNo").val(page.controls.grdBill.selectedData()[0].batch_no);
                $$("dsAddExpiryDate").setDate(page.controls.grdBill.selectedData()[0].expiry_date);
                searchViewData.push({ view_no: parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(5), view_name: parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(5) })
                    //$$("ddlAddInventCost").dataBind(searchViewData, "view_no", "view_name");
            });
        }
        page.events.btnAddVariation_click = function () {
            var count = 0;
            var vari_data = {
                item_no: page.controls.grdBill.selectedData()[0].item_no,
                //st: $$("ddlAddInventCost").val(),
                cost: $$("txtAddInventCost").val(),
                vendor_no: $$("ddlAddInventVendor").selectedValue(),
                mrp: $$("txtAddMrp").value(),
                expiry_date: $$("dsAddExpiryDate").getDate(),
                man_date: $$("dsAddManDate").getDate(),
                batch_no: $$("txtAddBatchNo").value(),
                variation_name: $$("txtNewVariation").value(),
                active: 1,
                user_no: CONTEXT.user_no,
                store_no: localStorage.getItem("user_store_no"),
            }
            //if ($$("dsAddExpiryDate").getDate() == "" || $$("dsAddExpiryDate").getDate() == null || typeof $$("dsAddExpiryDate").getDate() == "undefined") { }
            //else {
            //    vari_data.expiry_date = dbDateTime($$("dsAddExpiryDate").getDate());
            //}
            //if ($$("dsAddManDate").getDate() == "" || $$("dsAddManDate").getDate() == null || typeof $$("dsAddManDate").getDate() == "undefined") { }
            //else {
            //    vari_data.man_date = dbDateTime($$("dsAddManDate").getDate());
            //}
            if ($$("txtNewVariation").value() == "") {
                alert("Enter variation name...!");
                $$("txtNewVariation").focus();
            }
            else if($$("ddlAddInventVendor").selectedValue() == "-1" || $$("ddlAddInventVendor").selectedValue() == undefined || $$("ddlAddInventVendor").selectedValue() == null){
                alert("Supplier name is not empty...!");
            }
            else {
                //page.stockService.getStockVarByItemNo(vari_data.item_no, function (data) {
                page.stockAPI.searchStocksMain(vari_data.item_no, localStorage.getItem("user_store_no"), function (data) {
                    try {
                        $(data).each(function (i, item) {
                            if (vari_data.variation_name == item.variation_name && parseFloat(vari_data.mrp) == parseFloat(item.mrp) && vari_data.batch_no == item.batch_no && vari_data.expiry_date == item.expiry_date && parseFloat(vari_data.cost) == parseFloat(item.cost)) {
                                throw "Duplicate entry not accepted";
                                count++;
                            }
                            if (vari_data.variation_name == item.variation_name) {
                                throw "Variation name is not duplicated";
                            }
                        })
                        if (count == 0) {
                            $(".detail-info").progressBar("show")
                            //$$("msgPanel").flash("Inserting inventory...");
                            //page.inventoryService.insertStockVariation(vari_data, function (data) {
                            page.stockAPI.insertVariation(vari_data, function (data) {
                                alert("Variation Added Successfully");
                                page.controls.pnlNewVariation.close();
                                //$$("msgPanel").flash("Inventory inserted...");
                                $$("txtNewVariation").value("");
                                $$("txtAddMrp").value("");
                                $$("txtAddBatchNo").value("");
                                $$("dsAddExpiryDate").setDate("");
                                $$("dsAddManDate").setDate("");
                                var item = page.controls.grdBill.selectedData()[0];
                                if (parseFloat(vari_data.cost) == 0){
                                    item.free_var_no = data[0].key_value;
                                    item.free_variation_name = vari_data.variation_name;
                                } 
                                else {
                                    item.var_no = data[0].key_value;
                                    item.variation_name = vari_data.variation_name;
                                    item.mrp = vari_data.mrp;
                                    item.batch_no = vari_data.batch_no;
                                    item.expiry_date = vari_data.expiry_date;
                                    item.man_date = vari_data.man_date;
                                    item.cost = vari_data.cost;
                                }
                                
                                var row = page.controls.grdBill.selectedRows()[0];
                                if (parseFloat(vari_data.cost) == 0) {
                                    row.find("[datafield=free_var_no]").find("div").html(data[0].key_value)
                                    row.find("[datafield=free_variation_name]").find("div").html(vari_data.variation_name)
                                }  
                                else {
                                    row.find("input[datafield=var_no]").val(data[0].key_value);
                                    row.find("input[datafield=variation_name]").val(vari_data.variation_name);
                                    row.find("input[datafield=mrp]").val(vari_data.mrp);
                                    row.find("input[datafield=batch_no]").val(vari_data.batch_no);
                                    row.find("input[datafield=expiry_date]").val(vari_data.expiry_date);
                                    row.find("input[datafield=man_date]").val(vari_data.man_date);
                                    row.find("input[datafield=cost]").val(vari_data.cost);
                                }
                                var var_data = {
                                    mrp: vari_data.mrp,
                                    batch_no: vari_data.batch_no,
                                    expiry_date: vari_data.expiry_date,
                                    man_date: vari_data.man_date,
                                    cost: vari_data.cost,
                                    
                                }
                                if (parseFloat(vari_data.cost) == 0) {
                                    var_data.var_no = data[0].key_value;
                                    var_data.variation_name = vari_data.variation_name;
                                }
                                else {
                                    var_data.var_no = data[0].key_value;
                                    var_data.variation_name = vari_data.variation_name;
                                }
                                var grid_data = page.controls.grdBill.selectedData();
                                grid_data[0].variation_data.push(var_data);
                                
                                
                               // row.find("input[datafield=var_cost]").val(ui.item.cost).change();

                            });
                        } else {
                            throw "Sorry same variation can be used";
                        }
                    } catch (e) {
                        alert(e);
                    }
                });
            }
        }
        page.events.btnGenBarCode_click=function(){
            $$("txtBarcode").value(getFullCode($$("lblItemNo").value()));
        },
        page.events.btnNewGenBarCode_click = function () {
            $$("txtNewBarcode").value(getFullCode($$("lblItemNo").value()));
        },
        page.events.btnSaveNewItem_click = function () {
            var active;
            if ($$("chkNewInclusive").prop("checked"))
                active = 1;
            else
                active = 0;
            var data = {
                item_name: $$("txtNewItemName").selectedObject.val(),
                item_code: $$("txtNewItemCode").value(),
                barcode: $$("txtNewBarcode").value(),
                unit: $$("itemNewUnit").selectedValue(),
                tax_class_no: $$("ddlNewTax").selectedValue(),
                tax_inclusive: active,
                comp_id: localStorage.getItem("user_company_id")
            }
            if (data.item_name == "" || data.item_name == null || typeof data.item_name == "undefined") {
                alert("Item Name Should Not Be Empty");
            }
            else {
                //page.itemService.insertItem(data, function (data1) {
                page.itemAPI.postValue(data, function (data1) {
                    //page.itemService.getItemAutoComplete($$("txtNewItemName").value(), page.selectedBill.sales_tax_no, function (data) {
                    page.purchaseItemAPI.getValue({ item_no: $$("txtNewItemName").selectedObject.val(), sales_tax_no: page.selectedBill.sales_tax_no }, function (data) {
                        var selected_data = data[data.length - 1];
                        var newitem = {
                            item_no: selected_data.item_no,
                            item_name: selected_data.item_name,
                            unit: selected_data.unit,
                            qty: 1,
                            temp_qty: 1,
                            qty_type: selected_data.qty_type,
                            tray_id: selected_data.tray_no,
                            barcode: selected_data.barcode,
                            qty_stock: selected_data.qty_stock,
                            alter_unit: selected_data.alter_unit,
                            alter_unit_fact: selected_data.alter_unit_fact,
                            tax_per: selected_data.tax,
                            tax_class_no: selected_data.tax_class_no,
                            unit_identity: "0"
                        };
                        alert("Item inserted successfully....");
                        page.controls.pnlNewItem.close();
                        //  data.item_no = data1[0].key_value;
                        //page.controls.grdBill.createRow(newitem);
                        //page.controls.grdBill.edit(true);
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
                            page.calculate();
                        } else {
                            var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                            txtQty.val(parseInt(txtQty.val()) + 1);
                            txtQty.trigger('change');
                            txtQty.focus();
                            page.calculate();
                        }
                    });
                })
            }
        }
        page.events.btnSaveItem_click = function () {
            var active;
            if ($$("chkInclusive").prop("checked"))
                active = 1;
            else
                active = 0;
            page.itemAPI.putValue($$("lblItemNo").value(), {
                item_no: $$("lblItemNo").value(),
                item_name: $$("txtItemName").value(),
                item_code: $$("txtItemCode").value(),
                barcode: $$("txtBarcode").value(),
                unit: $$("itemUnit").selectedValue(),
                qty_type: $$("qty_type").selectedValue(),
                //key_word: $$("txtKeyWord").val(),
                //packing: $$("txtPacking").value(),
                tax_inclusive: active,
            }, function (data) {
                alert("Item detaild updated successfully...");
                //page.itemService.getItemsAutoComplete($$("txtItemName").value(), function (data) {
                page.purchaseItemAPI.getValue({ item_no: $$("txtItemName").value(), sales_tax_no: page.sales_tax_no }, function (data) {
                    $$("grdBill").updateRow($$("grdBill").selectedRowIds()[0], data[0]);
                    $$("grdBill").edit(true);
                    $$("grdBill").selectedRows()[0].click();
                    $$("grdBill").edit(true);
                });
                page.controls.pnlItemEdit.close();
            });
        }
        page.interface.setMessagePanel = function (msgPanel) {
            page.msgPanel = msgPanel;
        }

        page.interface.launchNewBill = null;
        //Insert bill, transaction, and bill_pay
        page.events.btnPay_now_click = function () {
            $$("btnPayment").disable(false);
            $$("btnPayment").show();
            $$("btnPayPending").disable(false);
            $$("btnPayPending").show();
            $$("btnSave").show();
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
            $$("txtAmount").focus();
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
                        throw "Supplier should be selected";
                    if (page.controls.lblAvalablePoints.value() == "" || page.controls.lblAvalablePoints.value() == null || page.controls.lblAvalablePoints.value() == undefined)
                        throw "Supplier should have the points";
                    if (parseFloat(page.controls.lblTotal.value()) > parseFloat(page.controls.lblAvalablePoints.value()) / 4)
                        throw "Supplier not having the enought points"
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
            $$("btnPayPending").disable(true);
            $$("btnPayPending").hide();
            $$("btnSave").hide();
            $$("btnPayment").disable(true);
            $$("btnPayment").hide();
            var amount = 0;
            try {
                if (page.controls.grdAllPayment.allData() == 0)
                    throw "Payment details not entered";
                $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                    amount = parseFloat(data.amount) + amount;
                });
                if (amount > parseFloat(page.controls.lblTotal.value()))
                    throw "Amount should not be exceed than the total amount";
                if (CONTEXT.RESTAPI)
                {
                    page.checkItems(function () {
                        page.saveBill_click("Purchase", "Mixed", function (currentBillNo) {
                            page.controls.pnlPayNow.close();
                            if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                page.addTray(currentBillNo);
                            }
                            if ($$("chkPrintBill").prop("checked")) {
                                if (CONTEXT.ENABLE_JASPER) {
                                    page.interface.printBill(currentBillNo, "PDF");
                                }
                            }
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                        })
                    });
                }
                
            } catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayPending").disable(false);
                $$("btnPayPending").show();
                $$("btnSave").show();
                $$("btnPayment").disable(false);
                $$("btnPayment").show();
            }
        },
        page.events.btnPayment_click = function () {
            $$("btnPayment").disable(true);
            $$("btnPayment").hide();
            $$("btnSave").hide();
            if (page.controls.grdBill.allData().length == 0) {
                alert("No item(s) can be purchase");
                $$("btnSave").show();
                $$("btnPayment").disable(false);
                $$("btnPayment").show();
            }
            else if ($$("ddlPayMode").selectedValue() == "Mixed") {
                try {
                    if (page.controls.txtVendorName.selectedObject.val() == "" || page.controls.txtVendorName.selectedObject.val() == null || page.controls.txtVendorName.selectedObject.val() == undefined)
                        throw "Supplier should be selected";
                    page.events.btnPay_now_click();
                }
                catch (e) {
                    ShowDialogBox('Warning', e, 'Ok', '', null);
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                    $$("btnSave").show();
                }
            }
            else {
                if (CONTEXT.RESTAPI) {
                    page.checkItems(function () {
                        var pay_mode = ($$("ddlPayMode").selectedValue() == "Loan") ? "Loan" : "Cash";
                        try{
                            var check;
                            check = ($$("ddlPayMode").selectedValue() == "Loan") && (page.controls.txtVendorName.selectedObject.val() == "" || page.controls.txtVendorName.selectedObject.val() == null || page.controls.txtVendorName.selectedObject.val() == undefined) ? true : false;
                            if (check)
                                throw "Supplier Should Be Selected"
                            page.saveBill_click("Purchase", pay_mode, function (currentBillNo) {
                                if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                    page.addTray(currentBillNo);
                                }
                                if ($$("chkPrintBill").prop("checked")) {
                                    if (CONTEXT.ENABLE_JASPER) {
                                        page.interface.printBill(currentBillNo, "PDF");
                                    }
                                }
                                page.interface.closeBill();
                                page.interface.launchNewBill();
                            });
                        }
                        catch (e) {
                            ShowDialogBox('Warning', e, 'Ok', '', null);
                            $$("btnPayment").disable(false);
                            $$("btnPayment").show();
                            $$("btnSave").show();
                        }
                    });
                }
            }
        }
        page.events.btnSave_click = function () {
            $$("btnSave").hide();
            $$("btnPayment").disable(true);
            $$("btnPayment").hide();
            if (page.controls.grdBill.allData().length == 0) {
                alert("No item(s) can be purchase");
                $$("btnSave").show();
                $$("btnPayment").disable(false);
                $$("btnPayment").show();
            } else {
                if (CONTEXT.RESTAPI) {
                    page.checkItems(function () {
                        page.saveBill_click("PurchaseSave", "PurchaseSave", function (currentBillNo) {
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                        });
                    });
                }
            }
        }

        page.events.btnAddVendor_click = function () {
            page.controls.pnlNewVendor.open();
            page.controls.pnlNewVendor.title("New Supplier");
            page.controls.pnlNewVendor.width(550);
            page.controls.pnlNewVendor.height(600);

            page.controls.ucVendorEdit.select({});

        }
        page.events.btnSaveVendor_click = function () {
            page.controls.ucVendorEdit.save(function (data) {
                page.controls.txtVendorName.customText(data[0].vendor_name);
                page.controls.hdnVendorNo.val(data[0].vendor_no);
                page.controls.lblPhoneNo.value(data[0].vendor_phone);
                page.controls.lblEmail.value(data[0].vendor_email);
                page.controls.lblAddress.value(data[0].vendor_address);
                page.controls.lblGst.value(data[0].gst_no);
                page.controls.pnlNewVendor.close();
            });

        }
        page.events.btnVendorMoreDetails_click = function () {
            page.controls.pnlVendorDetails.open();
            page.controls.pnlVendorDetails.title("Supplier Details");
            page.controls.pnlVendorDetails.width(550);
            page.controls.pnlVendorDetails.height(350);

            if (page.controls.txtVendorName.selectedObject.val().split("_")[0] == "") {
                $$("lblMoreSupplier").value("");
                $$("lblMoreTotalPurchase").value("");
                $$("lblMoreTotalReturn").value("");
                $$("lblMoreTotalPurchasePayment").value("");
                $$("lblMoreTotalReturnPayment").value("");
                $$("lblMorePendingPayment").value("");
                $$("lblMorePendingSettlement").value("");
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

        //page.events.btnDiscountOK_click = function () {
        //    //  if (page.controls.ddlDiscount.selectedValue() == -1)
        //    //      page.discount = {};
        //    //   else
        //    //     page.discount = page. v controls.ddlDiscount. selectedData(); // { disc_no: 1, disc_type: "Percent", disc_value: 10 };;
        //    var data = page.controls.ddlDiscount.selectedData();



        //    if (typeof data != "undefined") {
        //        if (data.disc_name != null && (data.disc_name == "Manual Discount of x percent" || data.disc_name == "Manual Discount of x value")) {
        //            confirmManualDisc().then(function (answer) {
        //                if (answer == "Ok") {
        //                    page.selectedBill.discounts.push({
        //                        disc_no: data.disc_no,
        //                        disc_type: data.disc_type,
        //                        disc_name: data.disc_name,
        //                        disc_value: page.manualDiscountValue
        //                    });
        //                    page.calculate();
        //                }
        //            });

        //        }
        //        else {

        //            page.selectedBill.discounts.push({
        //                disc_no: data.disc_no,
        //                disc_type: data.disc_type,
        //                disc_name: data.disc_name,
        //                disc_value: data.disc_value
        //            });
        //            page.calculate();

        //        }
        //    }
        //}
        //page.events.btnDiscountRemove_click = function () {
        //    var data = $$("grdDiscount").selectedData();
        //    if (data.length > 0) {
        //        for (var i = page.selectedBill.discounts.length - 1; i >= 0; i--) {
        //            if (page.selectedBill.discounts[i].disc_no == data[0].disc_no && page.selectedBill.discounts[i].item_no == data[0].item_no) {
        //                page.selectedBill.discounts.splice(i, 1);
        //            }
        //        }
        //        page.calculate();
        //    }

        //}


        //page.events.btnTaxOK_click = function () {
        //    if (page.controls.ddlSalesTax.selectedValue() == -1) {
        //        page.selectedBill.sales_tax_class = [];
        //        page.selectedBill.sales_tax_no = -1;
        //        page.calculate();
        //    } else {
        //        var data = page.controls.ddlSalesTax.selectedData();
        //        page.selectedBill.sales_tax_no = data.sales_tax_no;
        //        page.billService.getSalesTaxClass(data.sales_tax_no, function (data) {
        //            page.selectedBill.sales_tax_class = data;
        //            page.calculate();
        //        }); //[{ sales_tax_no: 1, tax_class_no: 1, tax_perc: 12 }];
        //    }
        //    page.msgPanel.show("Tax added in current session...");
        //    page.controls.pnlTaxPopup.close();

        //}
        page.events.btnSendMail_click = function () {
            //var bill = page.selectedBill;
            //if (bill.cust_no == null) {
            //    alert("Customer Not Selected");
            //}
            //else {
            //    var itemLists = [];
            //    page.customerService.getTotalPoints(bill.cust_no, function (data, callback) {
            //        $(bill.billItems).each(function (i, item) {
            //            itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.qty, "unit": item.unit, "price": item.price, "discount": item.discount, "totalPrice": item.total_price, });
            //        });


            //        // page.billService.getCustomerBillsByAll(openBill.bill_no, function (itemList) {
            //        //       $(itemList).each(function (i, item) {
            //        var accountInfosp = {
            //            "billNo": bill.bill_no,
            //            "billDate": //bill.bill_date,
            //                "2015-03-25T12:00:00Z",
            //            "appName": CONTEXT.COMPANY_NAME,
            //            "clientAddress": CONTEXT.ClientAddress,
            //            "customerNumber": bill.cust_no,
            //            "customerName": bill.cust_name,
            //            "tax": bill.tax,
            //            "subTotal": bill.sub_total,
            //            "discount": bill.discount,
            //            "totalPaid": bill.total,
            //            "totalRewardPoint": data[0].points,
            //            //"2300",
            //            "emailAddressList": //[bill.email],
            //                //["sam.info85@gmail.com"],
            //                ["jgprakash33@gmail.com"],
            //            //["balumanoj85@gmail.com"],
            //            //["sundaralingam48@gmail.com","wototech@outlook.com","balumanoj85@gmail.com"],

            //            "billItemList": itemLists,
            //        };
            //        var accountInfoposJson = JSON.stringify(accountInfosp);

            //        $.ajax({
            //            type: "POST",
            //            //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/pos-bill",
            //            url:CONTEXT.POEmailURL,
            //            headers: {
            //                'Content-Type': 'application/json'
            //            },
            //            crossDomain: false,
            //            data: JSON.stringify(accountInfosp),
            //            dataType: 'json',
            //            success: function (responseData, status, xhr) {
            //                console.log(responseData);
            //                $(".detail-info").progressBar("hide");
            //                page.msgPanel.show("Email Sent Successfully..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
            //            },
            //            error: function (request, status, error) {
            //                console.log(request.responseText);
            //                $(".detail-info").progressBar("hide");
            //                page.msgPanel.show("Email Sent Failed..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
            //            }
            //        });

            //    });
            //}
        }
        page.events.btnSendSMS_click = function () {
            //var bill = page.selectedBill;
            //if (bill.cust_no == null) {
            //    alert("Customer Not Selected");
            //}
        }
        page.events.btnTaxOK_click = function () {
            if (page.controls.ddlSalesTax.selectedValue() == -1) {
                page.selectedBill.sales_tax_class = [];
                page.selectedBill.sales_tax_no = -1;
                page.calculate();
            } else {
                var data = page.controls.ddlSalesTax.selectedData();
                page.selectedBill.sales_tax_no = data.sales_tax_no;
                //page.billService.getSalesTaxClass(data.sales_tax_no, function (data) {
                //page.salestaxclassAPI.getValue({ sales_tax_class_no: data.sales_tax_no }, function (data) {
                page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + data.sales_tax_no, "", function (data) {
                    page.selectedBill.sales_tax_class = data;
                    page.calculate();
                }); //[{ sales_tax_no: 1, tax_class_no: 1, tax_perc: 12 }];
            }
            page.msgPanel.show("Tax added in current session...");
            page.controls.pnlTaxPopup.close();
            page.msgPanel.hide();

        }


        //page.events.btnReturnItemOK_click = function () {
        //    page.controls.grdBill.dataBind(page.controls.grdReturnItemSelection.selectedData());
        //}


        page.view = {

            UIState: function (state) {

                if (state == "NewBill") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    //$$("btnReturn").hide();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                    $$("btnAddVendor").show();

                    //$$("pnlBillNo").hide();
                    //$$("pnlBillDate").hide();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.removeAttr('readonly');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                    $$("txtBillDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

                }
                if (state == "Saved") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    //$$("btnReturn").hide();
                    //$$("pnlBillNo").hide();
                    $$("btnSave").show();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();

                    //$$("pnlBillNo").show();
                    //$$("pnlBillDate").hide();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.removeAttr('readonly');


                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                }
                if (state == "Purchase") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    //$$("btnReturn").hide();
                    $$("btnSave").hide();
                    $$("btnAddVendor").show();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                    page.state = "Purchase";
                    $$("pnlItemSearch").show();
                    //$$("pnlBillNo").show();
                    //$$("pnlBillDate").show();

                    $$("grdBill").edit(true);
                    //$$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();    //TODO : show if return is there
                    $$("txtBillDate").disable(false);
                    $$("txtItemSearch").selectedObject.focus();
                }

                if (state == "Return") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    //$$("btnReturn").hide();
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();
                    //$$("pnlBillNo").show();
                    //$$("pnlBillDate").show();

                    $$("grdBill").edit(false);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(true);

                }
                if (state == "NewReturn") {
                    //$$("pnlSales").hide();
                    //$$("pnlBill").show();

                    //$$("btnReturn").show();
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    //$$("pnlBillNo").hide();
                    //$$("pnlBillDate").hide();
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
                    //page.controls.lblDiscountLabel.selectedObject.css("cursor", "pointer");
                    //page.controls.lblTaxLabel.selectedObject.css("cursor", "pointer");
                    //page.controls.lblDiscountLabel.selectedObject.hover(function () {
                    //    $(this).css("text-decoration", "underline");
                    //}, function () {
                    //    $(this).css("text-decoration", "");
                    //});
                    //page.controls.lblTaxLabel.selectedObject.hover(function () {
                    //    $(this).css("text-decoration", "underline");
                    //}, function () {
                    //    $(this).css("text-decoration", "");
                    //});


                    page.controls.grdBill.width("4250px");
                    page.controls.grdBill.height("200px");
                    page.controls.grdBill.setTemplate({
                        selection: true,

                        columns: [
                           { 'name': "  ", 'width': "50px", 'dataField': "item_no", editable: false, itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='background-image: url(https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-128.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 23px;    border: none;    cursor: pointer;' />" },
                           { 'name': "Sl No", 'width': "70px", 'dataField': "sl_no" },
                           { 'name': "Bar Code", 'width': "150px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE },
                           { 'name': "Item Name", 'width': "230px", 'dataField': "item_name" },
                           { 'name': "Item No", 'width': "80px", 'dataField': "item_no" },
                           { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                           { 'name': "In Stock", 'width': "100px", 'dataField': "qty_stock" },
                           { 'name': "", 'width': "0px", 'dataField': "qty", editable: true },
                           { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: true, visible: CONTEXT.SHOW_FREE },
                           { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: true },
                           { 'name': "Free Qty", 'width': "100px", 'dataField': "temp_free_qty", editable: true, visible: CONTEXT.SHOW_FREE },
                           { 'name': "Tray", 'width': "80px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                           //{ 'name': "Unit", 'width': "80px", 'dataField': "unit" },
                           { 'name': "Unit", 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                           { 'name': "Cost", 'width': "130px", 'dataField': "cost", editable: true },
                           { 'name': "Disc %", 'width': "130px", 'dataField': "disc_per", editable: true },
                           { 'name': "Disc Value", 'width': "130px", 'dataField': "disc_val", editable: true },
                           { 'name': "GST %", 'width': "130px", 'dataField': "tax_per", editable: false },
                           { 'name': "Net Rate", 'width': "130px", 'dataField': "net_rate", editable: false },
                           { 'name': "MRP", 'width': "130px", 'dataField': "mrp", editable: true, visible: CONTEXT.ENABLE_MRP },
                           { 'name': "Prev Selling", 'width': "130px", 'dataField': "pre_selling_price", editable: false },
                           { 'name': "Profit %", 'width': "120px", 'dataField': "profit", editable: true },
                           { 'name': "Selling Rate", 'width': "120px", 'dataField': "selling_price", editable: true },
                           { 'name': "Free Selling Rate", 'width': "150px", 'dataField': "free_selling_price", editable: true },

                           //Rate Configuration
                           { 'name': "Pre Rate B", 'width': "150px", 'dataField': "pre_alter_price_1", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "New Rate B", 'width': "120px", 'dataField': "alter_price_1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "Pre Rate C", 'width': "150px", 'dataField': "pre_alter_price_2", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                           { 'name': "New Rate C", 'width': "120px", 'dataField': "alter_price_2", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },

                           { 'name': "Total", 'width': "130px", 'dataField': "total_price" },
                           { 'name': "Man Date", 'width': "100px", 'dataField': "man_date", editable: true, visible: CONTEXT.ENABLE_MAN_DATE && false, },// itemTemplate: "<div  id='prdManDate' style=''></div>" },
                           { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", editable: true, visible: CONTEXT.ENABLE_EXP_DATE && false },
                           { 'name': "Manufacture Date", 'width': "260px", 'dataField': "temp_man_date", visible: CONTEXT.ENABLE_MAN_DATE, itemTemplate: "<input type='date' dataField='temp_man_date'>" },
                           { 'name': "Expiry Date", 'width': "260px", 'dataField': "temp_expiry_date", visible: CONTEXT.ENABLE_EXP_DATE, itemTemplate: "<input type='date' dataField='temp_expiry_date'>" },
                           { 'name': "Batch No", 'width': "100px", 'dataField': "batch_no", editable: true, visible: CONTEXT.ENABLE_BAT_NO },
                           { 'name': "Variation", 'width': "120px", 'dataField': "variation_name", editable: true, visible: CONTEXT.ENABLE_VARIATION },
                           { 'name': "", 'width': "50px", 'dataField': "btn_variation_name", editable: false, visible: CONTEXT.ENABLE_VARIATION, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='New' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/new-icon.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" },
                           { 'name': "Free Variation", 'width': "150px", 'dataField': "free_variation_name", visible: CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE },
                           { 'name': "Buying Cost", '90px': "100px", 'dataField': "buying_cost" },
                           //{ 'name': "", 'width': "", 'dataField': "free_variation_name", editable: false, visible: false },
                           { 'name': "", 'width': "", 'dataField': "free_variation_id", editable: false, visible: false },

                           { 'name': "", 'width': "0px", 'dataField': "var_cost" },
                           { 'name': "", 'width': "0px", 'dataField': "chk_new_var" },
                           { 'name': "", 'width': "0px", 'dataField': "chk_new_free_var" },
                           { 'name': "", 'width': "0px", 'dataField': "expiry_days" },
                           { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                           { 'name': "", 'width': "0px", 'dataField': "variation_data" },
                           { 'name': "", 'width': "0px", 'dataField': "var_no" },
                           { 'name': "", 'width': "0px", 'dataField': "free_var_no" },
                           { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                           { 'name': "", 'width': "0px", 'dataField': "man_date", editable: true, visible: CONTEXT.ENABLE_MAN_DATE, },// itemTemplate: "<div  id='prdManDate' style=''></div>" },
                           { 'name': "", 'width': "0px", 'dataField': "expiry_date", editable: true, visible: CONTEXT.ENABLE_EXP_DATE },
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
                            if(page.state!="Purchase")
                            page.events.btnNewVariation_click();
                        }
                    }
                    page.controls.grdBill.beforeRowBound = function (row, item) {
                        item.buying_cost = parseFloat(parseFloat(item.total_price) / parseFloat(item.qty)).toFixed(5);
                        item.chk_new_var = 0;

                    }
                    page.controls.grdBill.rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdBill.allData().length);
                       // DATE PICKER FOR EXPIRY DATE
                        $(row).find("input[dataField=temp_expiry_date]").change(function () {
                            var temp_date = $(row).find("[datafield=temp_expiry_date]").find("input").val();
                            var day = temp_date.substring(8, 10);
                            var month = temp_date.substring(5, 7);
                            var year = temp_date.substring(0, 4);

                            item.expiry_date = day + "-" + month + "-" + year;
                            $(row).find("[datafield=expiry_date]").find("div").html(item.expiry_date);
                            page.check_variation(row, item);
                        });
                        if (item.expiry_date == undefined || item.expiry_date == null || item.expiry_date == "") {
                            
                        } else {
                            $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                            item.expiry_date = item.expiry_date;
                            $(row).find("[datafield=expiry_date]").find("div").html(item.expiry_date);
                        }

                       // DATE PICKER FOR MANUFACTURE DATE
                        $(row).find("input[dataField=temp_man_date]").change(function () {
                            var temp_date = $(row).find("[datafield=temp_man_date]").find("input").val();
                            var day = temp_date.substring(8, 10);
                            var month = temp_date.substring(5, 7);
                            var year = temp_date.substring(0, 4);

                            item.man_date = day + "-" + month + "-" + year;
                            $(row).find("[datafield=man_date]").find("div").html(item.man_date);
                            page.check_variation(row, item);
                        });
                        if (item.man_date == undefined || item.man_date == null || item.man_date == "") {

                        } else {
                            $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));
                            item.man_date = item.man_date;
                            $(row).find("[datafield=man_date]").find("div").html(item.man_date);
                        }

                        var htmlTemplate = [];
                        if (CONTEXT.ENABLE_ALTER_UNIT) {
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
                            if ($(this).val() == "0") {
                                item.qty = parseFloat(item.temp_qty);
                                
                                $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty));
                                item.free_qty = parseFloat(item.temp_free_qty);
                                
                                $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                                item.unit_identity = 0;
                                $(row).find("[datafield=unit_identity]").find("div").html(0);
                            } else {
                                item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                                item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact));
                                item.unit_identity = 1;
                                $(row).find("[datafield=unit_identity]").find("div").html(1);
                            }
                            page.calculate();
                        });
                        if (item.unit_identity == "1") {
                            item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                            
                            $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));

                            item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                            
                            $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));

                            $(row).find("[id=itemUnit]").val(1);
                        }

                        row.find("div[datafield=btn_variation_name]").css("visibility", "false");

                        row.on("change", "input[datafield=temp_qty]", function () {
                            if ($(row).find("[id=itemUnit]").val() == "0") {
                                item.qty = parseFloat(item.temp_qty);
                            } else {
                                item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            }
                            page.calculate();
                            page.check_variation(row, item);
                            if (item.profit!= undefined && item.profit!= null && item.profit!= "") {
                                if (item.profit.startsWith("0")) {
                                item.profit = item.profit.replace(/#/g, 0);
                                var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }

                            } else {
                                var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }
                            }
                            }
                        });
                        row.on("change", "input[datafield=temp_free_qty]", function () {
                            if ($(row).find("[id=itemUnit]").val() == "0") {
                                item.free_qty = parseFloat(item.temp_free_qty);
                            } else {
                                item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                            }
                            page.calculate();
                            page.check_variation(row, item);
                        });
                        
                        row.on("focus", "input[datafield=expiry_date]", function () {
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true")
                                row.find("input[datafield=expiry_date]").attr("placeholder", "mm-yyyy");
                            else
                                row.find("input[datafield=expiry_date]").attr("placeholder", "dd-mm-yyyy");
                        });
                        row.on("focus", "input[datafield=man_date]", function () {
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true")
                                row.find("input[datafield=man_date]").attr("placeholder", "mm-yyyy");
                            else
                                row.find("input[datafield=man_date]").attr("placeholder", "dd-mm-yyyy");
                        });
                        row.on("keydown", "input[datafield=temp_qty]", function (e) {
                            if (e.which == 9) {
                                page.calculate();
                                page.check_variation(row, item);
                                var nextRow = $(this).closest("grid_row").next();
                                if (nextRow.length == 0) {
                                    nextRow.find("input[datafield=temp_free_qty]").focus();
                                } else {
                                    nextRow.find("input[datafield=temp_free_qty]").focus();
                                }
                                page.calculate();
                            }
                        });

                        row.on("change", "input[datafield=cost]", function () {
                            page.calculate();
                            page.check_variation(row, item);
                            if (item.profit != undefined && item.profit != null && item.profit != "") {
                                if (item.profit.startsWith("0")) {
                                    item.profit = item.profit.replace(/#/g, 0);
                                    var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                    var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }

                                } else {
                                    var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }
                                }
                            }
                        });
                        row.on("change", "input[datafield=disc_per]", function () {
                            page.calculate();
                            page.check_variation(row, item);
                            if (item.profit != undefined && item.profit != null && item.profit != "") {
                                if (item.profit.startsWith("0")) {
                                    item.profit = item.profit.replace(/#/g, 0);
                                    var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                    var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }

                                } else {
                                    var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }
                                }
                            }
                        });
                        row.on("change", "input[datafield=disc_val]", function () {
                            page.calculate();
                            page.check_variation(row, item);
                            if (item.profit != undefined && item.profit != null && item.profit != "") {
                                if (item.profit.startsWith("0")) {
                                    item.profit = item.profit.replace(/#/g, 0);
                                    var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                    var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }

                                } else {
                                    var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }
                                }
                            }
                        });
                        row.on("change", "input[datafield=tax_per]", function () {
                            page.calculate();
                            page.check_variation(row, item);
                        });

                        row.on("change", "input[datafield=expiry_date]", function () {
                            page.check_variation(row, item);
                        });
                        row.on("change", "input[datafield=man_date]", function () {
                            page.check_variation(row, item);
                        });
                        row.on("change", "input[datafield=batch_no]", function () {
                            page.check_variation(row, item);
                        });
                        row.on("change", "input[datafield=mrp]", function () {
                            page.check_variation(row, item);
                            if (item.profit != undefined && item.profit != null && item.profit != "") {
                                if (item.profit.startsWith("0")) {
                                    item.profit = item.profit.replace(/#/g, 0);
                                    var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                    var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }

                                } else {
                                    var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }
                                }
                            }
                        });
                        row.on("focus", "input[datafield=variation_name]", function () {
                            page.variation(row, item, function (data) {
                                row.find("input[datafield=variation_name]").autocomplete({
                                    minLength: 0,
                                    source: data,
                                    focus: function (event, ui) {
                                        row.find("input[datafield=variation_name]").val(ui.item.label);
                                        return false;
                                    },
                                    select: function (event, ui) {
                                        item.mrp = ui.item.mrp;
                                        item.batch_no = ui.item.batch_no;
                                        item.expiry_date = ui.item.expiry_date;
                                        item.man_date = ui.item.man_date;
                                        item.var_cost = ui.item.cost;
                                        item.var_no = ui.item.var_no;
                                        //item.cost = ui.item.cost;
                                        item.variation_name = ui.item.label;
                                        item.disc_per = "";
                                        item.disc_val = "";
                                        row.find("input[datafield=variation_name]").val(ui.item.label);
                                        //row.find("input[datafield=cost]").val(ui.item.cost);
                                        row.find("input[datafield=var_cost]").val(ui.item.cost);
                                        $(row).find("input[datafield=mrp]").val(ui.item.mrp);
                                        $(row).find("input[datafield=batch_no]").val(ui.item.batch_no);
                                        row.find("input[datafield=expiry_date]").val(ui.item.expiry_date);
                                        row.find("input[datafield=man_date]").val(ui.item.man_date);
                                        row.find("input[datafield=var_no]").val(ui.item.var_no);
                                        row.find("input[datafield=disc_per]").val("");
                                        row.find("input[datafield=disc_val]").val("");
                                        if (ui.item.active == "0")
                                            row.find("input[datafield=variation_name]").css("color", "red");
                                        else
                                            row.find("input[datafield=variation_name]").css("color", "black");
                                        $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                                        $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));

                                        if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                            if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                                                var len = item.expiry_date.length;
                                                var month = item.expiry_date.substring(len - 7, len - 5);
                                                var year = item.expiry_date.substring(len - 4, len);
                                                item.expiry_date = month + "-" + year;
                                                row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                                $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-"+item.expiry_date));
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

                                        item.free_var_no = null;
                                        item.free_variation_name = null;
                                        $(item.variation_data).each(function (i, items) {
                                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                                if (items.expiry_date != undefined && items.expiry_date != null && items.expiry_date != "") {
                                                    var len = items.expiry_date.length;
                                                    var month = items.expiry_date.substring(len - 7, len - 5);
                                                    var year = items.expiry_date.substring(len - 4, len);
                                                    items.expiry_date = month + "-" + year;
                                                }
                                                if (items.man_date != undefined && items.man_date != null && items.man_date != "") {
                                                    len = items.man_date.length;
                                                    month = items.man_date.substring(len - 7, len - 5);
                                                    year = items.man_date.substring(len - 4, len);
                                                    items.man_date = month + "-" + year;
                                                }
                                            }
                                            if (!CONTEXT.ENABLE_VARIATION_VENDOR_NO) {
                                                item.vendor_no = 0;
                                                items.vendor_no = 0;
                                            }
                                            if (CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE) {
                                                if (parseFloat(items.mrp) == parseFloat(item.mrp) && items.batch_no == item.batch_no &&
                                               items.vendor_no == item.vendor_no &&
                                               items.expiry_date == item.expiry_date &&
                                               items.man_date == item.man_date &&
                                               parseFloat(items.cost).toFixed(5) == parseFloat(0).toFixed(5)) {
                                                    item.free_var_no = items.var_no;
                                                    item.free_variation_name = items.variation_name;
                                                    $(row).find("[datafield=free_variation_name]").find("div").html(item.free_variation_name);
                                                }
                                            }
                                        });

                                        //if no match founnd
                                        if (item.free_var_no == null)
                                            $(row).find("[datafield=free_variation_name]").find("div").html("");

                                        var cost = parseFloat(ui.item.cost) * (parseFloat(item.qty)) / parseFloat(item.qty);
                                        item.cost = cost;
                                        row.find("input[datafield=cost]").val(cost);

                                        var poItem = page.controls.grdBill.getRowData(row);
                                        row.find("[datafield=pre_selling_price]").find("div").html(ui.item.selling_price);
                                        row.find("[datafield=pre_alter_price_1]").find("div").html(ui.item.pre_alter_price_1);
                                        row.find("[datafield=pre_alter_price_2]").find("div").html(ui.item.pre_alter_price_2);
                                        poItem.pre_selling_price = ui.item.selling_price;
                                        poItem.pre_alter_price_1 = ui.item.pre_alter_price_1;
                                        poItem.pre_alter_price_2 = ui.item.pre_alter_price_2;

                                        page.calculate();
                                        return false;
                                    },
                                    change: function (event, ui) {
                                        if (ui.item == null) {
                                            row.find("div[datafield=btn_variation_name]").css("visibility", "true");
                                            item.chk_new_var = 1;
                                        }
                                    }
                                })
                            });
                        });
                        row.on("focus", "input[datafield=free_variation_name]", function () {
                            page.variation(function (data) {
                                row.find("input[datafield=free_variation_name]").autocomplete({
                                    minLength: 0,
                                    source: data,
                                    focus: function (event, ui) {
                                        row.find("input[datafield=free_variation_name]").val(ui.item.label);
                                        return false;
                                    },
                                    select: function (event, ui) {

                                        item.free_variation_name = ui.item.label;

                                        row.find("input[datafield=free_variation_name]").val(ui.item.label);

                                        page.calculate();
                                        return false;
                                    },
                                    change: function (event, ui) {
                                        if (ui.item == null) {
                                            row.find("div[datafield=btn_variation_name]").css("visibility", "true");
                                            item.chk_new_free_var = 1;
                                        }
                                    }
                                })
                            });
                        });
                        row.on("keydown", "input[datafield=variation_name]", function (e) {
                            if (e.which == 9) {
                                e.preventDefault();
                                var nextRow = $(this).closest("grid_row").next();
                                if (nextRow.length == 0) {
                                    page.controls.txtItemSearch.selectedObject.focus();
                                } else {
                                    nextRow.find("input[datafield=temp_qty]").focus();
                                }

                            }
                        });
                        row.on("keydown", "input[datafield=selling_price]", function (e) {
                            //if (e.which == 9) {
                            //    e.preventDefault();
                            //    var nextRow = $(this).closest("grid_row").next();
                            //    if (nextRow.length == 0) {
                            //        page.controls.txtItemSearch.selectedObject.focus();
                            //    } else {
                            //        nextRow.find("input[datafield=temp_qty]").focus();
                            //    }

                            //}
                        });

                        row.on("keydown", "input[datafield=expiry_date]", function (e) {
                            //if (e.which == 9) {
                            //    e.preventDefault();
                            //    var nextRow = $(this).closest("grid_row").next();
                            //    if (nextRow.length == 0) {
                            //        page.controls.txtItemSearch.selectedObject.focus();
                            //    } else {
                            //        nextRow.find("input[datafield=temp_qty]").focus();
                            //    }

                            //}
                        });
                        row.on("change", "input[datafield=selling_price]", function () {
                            var profit = parseFloat(((parseFloat(item.selling_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(5);
                            item.profit = profit;
                            row.find("input[datafield=profit]").val(profit);
                        });
                        row.on("change", "input[datafield=profit]", function () {
                            if (item.profit.startsWith("#")) {
                                item.profit = item.profit.replace(/#/g, 0);
                                var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }

                            } else {
                                var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }
                            }
                            
                        });
                        row.on("click", "[datafield=item_name]", function () {
                            page.controls.pnlItemEdit.open();
                            page.controls.pnlItemEdit.title("Edit Item");
                            page.controls.pnlItemEdit.width(500);
                            page.controls.pnlItemEdit.height(450);
                            var item_details = page.controls.grdBill.selectedData()[0];
                            $$("lblItemNo").value(item_details.item_no)
                            $$("txtItemCode").val(item_details.item_code);
                            $$("txtItemName").val(item_details.item_name);
                            $$("txtItemName").val(item_details.item_name);
                            $$("qty_type").selectedValue(item_details.qty_type);
                            $$("itemUnit").selectedValue(item_details.unit);

                            $$("txtBarcode").value(item_details.bar_code);
                            if (item_details.tax_inclusive == 1) {
                                $$("chkInclusive").prop('checked', true);
                            }
                            else {
                                $$("chkInclusive").prop('checked', false);
                            }
                            if (item.barcode == null || (item.barcode).length == 0) {
                                $$("btnGenBarCode").show();
                            } else {
                                $$("btnGenBarCode").hide();
                            }
                        });
                        //if (item.state_no == "100" || item.state_no == "200" || item.state_no == "300" || item.state_no == "904") {
                        //    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        //        if (item.expiry_date != undefined && item.expiry_date != null && item.expiry_date != "") {
                        //            var len = item.expiry_date.length;
                        //            var month = item.expiry_date.substring(len - 7, len - 5);
                        //            var year = item.expiry_date.substring(len - 4, len);
                        //            item.expiry_date = month + "-" + year;
                        //            row.find("input[datafield=expiry_date]").val(item.expiry_date);
                        //            $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-" + item.expiry_date));
                        //        }
                        //        if (item.man_date != undefined && item.man_date != null && item.man_date != "") {
                        //            var len = item.man_date.length;
                        //            var month = item.man_date.substring(len - 7, len - 5);
                        //            var year = item.man_date.substring(len - 4, len);
                        //            item.man_date = month + "-" + year;
                        //            row.find("input[datafield=man_date]").val(item.man_date);
                        //            $(row).find("[datafield=temp_man_date]").find("input").val(dbDate("28-" + item.man_date));
                        //        }
                        //    }
                        //    else {
                        //        item.expiry_date = item.expiry_date;
                        //        item.man_date = item.man_date;
                        //        row.find("input[datafield=expiry_date]").val(item.expiry_date);
                        //        row.find("input[datafield=man_date]").val(item.man_date);
                        //    }
                        //}
                        //else {
                            //To Automatically select first variation for selected item
                            //store the variation dta agaist item
                            //TODO : last select variation.

                            // sett vendor enable  -> vendor(empty possible)   disable - null
                        var data = {
                            item_no: item.item_no,
                        }
                        if (CONTEXT.ENABLE_VARIATION_VENDOR_NO)
                            data.vendor_no = page.controls.txtVendorName.selectedValue();
                        else
                            data.vendor_no = null;

                          //  if (typeof item.variation_data == "undefined" || item.variation_data == null) {
                                //todo : new variation item.variation_data need to be updated
                            //page.stockService.getAllVariationByItem(data, function (data) {
                        page.stockAPI.getVariationByItem({ item_no: item.item_no, vendor_no: data.vendor_no }, function (data) {
                                //page.variation_data.push(data);
                                var poItem = page.controls.grdBill.getRowData(row);
                                item.variation_data = data;
                                var length = 0;
                                // page.variation_data = data;
                                if (data.length != 0) {
                                    parseInt(data[data.length - 1].cost) != 0 ? length = data.length - 1 : length = data.length - 2;
                                    parseInt(data.length)<2?length =0:"";                                          
                                    item.cost = data[length].cost;
                                    item.variation_name = data[length].variation_name;
                                    item.mrp = data[length].mrp;
                                    item.batch_no = data[length].batch_no;
                                    item.buying_cost = data[length].cost;
                                    item.var_no = data[length].var_no;

                                    row.find("input[datafield=cost]").val(data[length].rate);
                                    row.find("input[datafield=disc_val]").val(data[length].disc_val);
                                    row.find("input[datafield=disc_per]").val(data[length].disc_per);
                                    row.find("input[datafield=buying_cost]").val(data[length].cost);
                                    row.find("input[datafield=variation_name]").val(data[length].variation_name);
                                    $(row).find("input[datafield=mrp]").val(data[length].mrp);
                                    $(row).find("input[datafield=batch_no]").val(data[length].batch_no);
                                    $(row).find("input[datafield=var_no]").val(data[length].var_no);
                                    //row.find("input[datafield=pre_selling_price]").html(data[length].selling_price);
                                    row.find("[datafield=pre_selling_price]").find("div").html(data[length].selling_price);
                                    row.find("[datafield=pre_alter_price_1]").find("div").html(data[length].pre_alter_price_1);
                                    row.find("[datafield=pre_alter_price_2]").find("div").html(data[length].pre_alter_price_2);
                                        
                                    poItem.cost = data[length].rate;
                                    poItem.disc_val = data[length].disc_val;
                                    poItem.disc_per = data[length].disc_per;
                                    poItem.pre_alter_price_1 = data[length].pre_alter_price_1;
                                    poItem.pre_alter_price_2 = data[length].pre_alter_price_2;

                                    //page.calculate();
                                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                        if (data[length].expiry_date != undefined && data[length].expiry_date != null && data[length].expiry_date != "") {
                                            var len = data[length].expiry_date.length;
                                            var month = data[length].expiry_date.substring(len - 7, len - 5);
                                            var year = data[length].expiry_date.substring(len - 4, len);
                                            item.expiry_date = month + "-" + year;
                                            row.find("input[datafield=expiry_date]").val(item.expiry_date);
                                            $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate("28-"+item.expiry_date));
                                        }
                                        if (data[length].man_date != undefined && data[length].man_date != null && data[length].man_date != "") {
                                            var len = data[length].man_date.length;
                                            var month = data[length].man_date.substring(len - 7, len - 5);
                                            var year = data[length].man_date.substring(len - 4, len);
                                            item.man_date = month + "-" + year;
                                            row.find("input[datafield=man_date]").val(item.man_date);
                                            $(row).find("[datafield=temp_man_date]").find("input").val(dbDate("28-" + item.man_date));
                                        }
                                    }
                                    else {
                                        item.expiry_date = data[length].expiry_date;
                                        item.man_date = data[length].man_date;
                                        row.find("input[datafield=expiry_date]").val(data[length].expiry_date);
                                        row.find("input[datafield=man_date]").val(data[length].man_date);
                                        $(row).find("[datafield=temp_expiry_date]").find("input").val(dbDate(item.expiry_date));
                                        $(row).find("[datafield=temp_man_date]").find("input").val(dbDate(item.man_date));
                                    }
                                    if (data[length].active == "0")
                                        row.find("input[datafield=variation_name]").css("color", "red");
                                    else
                                        row.find("input[datafield=variation_name]").css("color", "black");
                                }
                            });
                          //  }
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
        //QR Code Scan
        page.events.btnQrScan_click = function () {
            page.controls.pnlQrScan.open();
            page.controls.pnlQrScan.title("QR Scanning Screen");
            page.controls.pnlQrScan.width(750);
            page.controls.pnlQrScan.height(550);
            let scanner = new Instascan.Scanner({ video: $(page.controls.preview.selectedObject)[0] });
            scanner.addListener('scan', function (content) {
                page.controls.pnlQrScan.close();
                page.controls.txtItemSearch.selectedText(content);
                scanner.stop();
            });
            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
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
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                cust_id: (page.controls.txtVendorName.selectedValue() == null) ? "-1" : page.controls.txtVendorName.selectedValue(),
                                bill_id: currentBillNo,
                                store_no: localStorage.getItem("user_store_no")
                            });
                });
                //page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {});
                page.eggtraytransAPI.postAllValues(0, trayItems, function (data) {
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
                    "Rate": parseFloat(item.price).toFixed(5),
                    "PDis": parseFloat(item.discount).toFixed(5),
                    "MRP": parseFloat(item.mrp).toFixed(5),
                    "CGST": parseFloat(item.item_gst_tax).toFixed(5),
                    "SGST": parseFloat(item.item_gst_tax).toFixed(5),
                    "GValue": parseFloat(item.total_price).toFixed(5),
                    "TotalPrice": parseFloat(item.total_price).toFixed(5),
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
                            "BSubTotal": parseFloat(data.sub_total).toFixed(5),
                            "DiscountAmount": parseFloat(data.tot_discount).toFixed(5),
                            "BCGST": parseFloat(data.tot_gst_tax).toFixed(5),
                            "BSGST": parseFloat(data.tot_gst_tax).toFixed(5),
                            "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(5),
                            "BillAmount": parseFloat(data.total).toFixed(5),
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
                            "RoundAmount": parseFloat(data.round_off).toFixed(5),
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