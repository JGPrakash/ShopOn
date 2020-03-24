$.fn.purchaseBill = function () {

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
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.template("/" + appConfig.root + "/shopon/view/purchase-pop/purchase-bill.html");

        page.vendorAPI = new VendorAPI();
        page.stockAPI = new StockAPI();
        page.purchaseItemAPI = new PurchaseItemAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.salestaxAPI = new SalesTaxAPI();
        page.salestaxclassAPI = new SalesTaxClassAPI();
        page.itemAPI = new ItemAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.purchaseBillAPI = new PurchaseBillAPI();
        page.discountAPI = new DiscountAPI();

        page.interface.currentProductList = null;
        page.selectedBill = {};
        page.productList = [];
        page.manualDiscountValue = 0;
        page.variation_data = {};
        page.selectedPayment = {};
        CONTEXT.POPShowMore = false;
        page.clickCount = 0;
        page.loadGrid = true;
        page.attr_list = [];
        page.searchAttributes = "text";
        page.bill_discount_no = "-1";

        $(page.selectedObject).keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 114 || keyCode == 35) {
                e.preventDefault();
                page.events.btnPayment_click();
            }
            if (keyCode == 115) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            //if (keyCode == 120) {
            //    $$("txtProfitPercentage").selectedObject.focus().select();
            //}
            if (e.altKey && e.which == 83) {
                $$("txtVendorName").selectedObject.focus();
            }
            if (e.altKey && e.which == 73) {
                $$("txtItemSearch").selectedObject.focus();
            }
            if (e.altKey && e.which == 80) {
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").focus().select();
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

        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        var $input = $("[controlid=txtBillDiscount]");
        var $inputPercent = $("[controlid=txtBillDiscountPercent]");
        var $inputGst = $("[controlid=txtBillGstAmount]");
        var $inputExpense = $("[controlid=txtExpAmount]");
        //var $inputProfitPercentage = $("[controlid=txtProfitPercentage]");
        //var $inputPrice1ProfitPercentage = $("[controlid=txtPrice1ProfitPercentage]");
        //var $inputPrice2ProfitPercentage = $("[controlid=txtPrice2ProfitPercentage]");
        var $inputtxtInvoiceNo = $("[controlid=txtInvoiceNo]");
        var $inputVendorName = $("[controlid=txtVendorName]");
        var $inputItemSearch = $("[controlid=txtItemSearch]");
        $input.on('keyup', function (e) {
            if (e.which == 13) {
                page.selectedBill.discounts = [];
                page.calculateTotal(function (subTotal) {
                    var disc_val = ($$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null) ? "0" : $$("txtBillDiscount").value();
                    if (isNaN(disc_val))
                        disc_val = 0;
                    disc_val = (parseFloat(disc_val) / parseFloat($$("lblSubTotal").value())) * 100;
                    var per = ($$("txtBillDiscountPercent").value() == "" || $$("txtBillDiscountPercent").value() == null) ? "0" : $$("txtBillDiscountPercent").value();

                    page.selectedBill.discounts.push({
                        disc_no: page.bill_discount_no,
                        disc_name: "Manual Discount of x percent",
                        item_no: null,
                        disc_type: "Percent",
                        disc_level: "Item",
                        disc_value: parseFloat(per) + parseFloat(disc_val)
                    });

                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(doneTyping, doneTypingInterval);
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(doneTyping, doneTypingInterval);
                });
                if ($$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || parseFloat($$("txtBillDiscount").value()) == 0) {
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=item_disc]").css("display", "none");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=item_disc]").css("display", "none");
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=bill_disc]").css("display", "none");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=bill_disc]").css("display", "none");
                }
                else {
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=item_disc]").css("display", "inline-block");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=item_disc]").css("display", "inline-block");
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=bill_disc]").css("display", "inline-block");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=bill_disc]").css("display", "inline-block");
                }
            }
        });
        $inputPercent.on('keyup', function (e) {
            if (e.which == 13) {
                page.selectedBill.discounts = [];
                page.calculateTotal(function (subTotal) {
                    var disc_val = ($$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null) ? "0" : $$("txtBillDiscount").value();
                    if (isNaN(disc_val))
                        disc_val = 0;
                    disc_val = (parseFloat(disc_val) / parseFloat($$("lblSubTotal").value())) * 100;
                    var per = ($$("txtBillDiscountPercent").value() == "" || $$("txtBillDiscountPercent").value() == null) ? "0" : $$("txtBillDiscountPercent").value();

                    page.selectedBill.discounts.push({
                        disc_no: page.bill_discount_no,
                        disc_name: "Manual Discount of x percent",
                        item_no: null,
                        disc_type: "Percent",
                        disc_level: "Item",
                        disc_value: parseFloat(per) + parseFloat(disc_val)
                    });

                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(doneTyping, doneTypingInterval);
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(doneTyping, doneTypingInterval);
                });
                if ($$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || parseFloat($$("txtBillDiscount").value()) == 0) {
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=item_disc]").css("display", "none");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=item_disc]").css("display", "none");
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=bill_disc]").css("display", "none");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=bill_disc]").css("display", "none");
                }
                else {
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=item_disc]").css("display", "inline-block");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=item_disc]").css("display", "inline-block");
                    page.controls.grdBill.selectedObject.find(".grid_header div[datafield=bill_disc]").css("display", "inline-block");
                    page.controls.grdBill.selectedObject.find(".grid_data div[datafield=bill_disc]").css("display", "inline-block");
                }
            }
        });
        $inputGst.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        });
        $inputExpense.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        });
        //$inputProfitPercentage.on('keydown', function (e) {
        //    if (e.which == 13) {
        //        clearTimeout(typingTimer);
        //        typingTimer = setTimeout(doneProfitCalculate, doneTypingInterval);
        //    }
        //});
        //$inputPrice1ProfitPercentage.on('keydown', function (e) {
        //    if (e.which == 13) {
        //        clearTimeout(typingTimer);
        //        typingTimer = setTimeout(donePrice1ProfitCalculate, doneTypingInterval);
        //    }
        //});
        //$inputPrice2ProfitPercentage.on('keydown', function (e) {
        //    if (e.which == 13) {
        //        clearTimeout(typingTimer);
        //        typingTimer = setTimeout(donePrice2ProfitCalculate, doneTypingInterval);
        //    }
        //});
        $inputtxtInvoiceNo.on('keydown', function (e) {
            if (e.which == 13 || e.which == 9) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                        var poItem = page.controls.grdBill.getRowData(row);
                        page.setAttributes(row, poItem);
                    });
                    $$("txtItemSearch").selectedObject.focus();
                }, doneTypingInterval);
            }
        });
        $inputVendorName.on('keydown', function (e) {
            if (e.which == 13 || e.which == 9) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { $$("txtInvoiceNo").focus(); }, doneTypingInterval);
            }
            if (e.altKey && e.which == 78) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { page.events.btnAddVendor_click(); }, doneTypingInterval);
            }
        });
        $inputItemSearch.on('keydown', function (e) {
            if (e.altKey && e.which == 78) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { page.events.btnNewItem_click(); }, doneTypingInterval);
            }
        });
        $("[controlid=txtCreditAmount]").on('keydown', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { page.calculate();}, doneTypingInterval);
            }
        });
        function doneTyping() {
            page.calculate();
        }
        function doneProfitCalculate(e) {
            //if ($$("txtProfitPercentage").value() != "" && $$("txtProfitPercentage").value() != null && typeof $$("txtProfitPercentage").value() != "undefined") {
            if ($$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").val() != "" && $$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").val() != null && typeof $$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").val() != "undefined") {
                $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdBill.getRowData(row);
                    poItem.profit = $$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").val();
                    if (poItem.profit.startsWith("#")) {
                        poItem.profit = poItem.profit.replace(/#/g, 0);
                        var profper = (parseFloat(poItem.mrp) * parseFloat(poItem.profit)) / 100;
                        //var selling_price = Math.round(parseFloat(poItem.mrp) - parseFloat(profper));
                        var selling_price = parseFloat(poItem.mrp) - parseFloat(profper);
                        poItem.selling_price = selling_price;
                        $(row).find("input[datafield=selling_price]").val(selling_price);
                        if (CONTEXT.PRICE_EQUAL_FREE) {
                            poItem.free_selling_price = selling_price;
                            $(row).find("input[datafield=free_selling_price]").val(selling_price);
                        }
                    }
                    else if (poItem.profit.startsWith("@")) {
                        poItem.profit = poItem.profit.slice(1, poItem.profit.length);
                        var selling_price = poItem.profit;
                        poItem.selling_price = selling_price;
                        $(row).find("input[datafield=selling_price]").val(selling_price);
                        if (CONTEXT.PRICE_EQUAL_FREE) {
                            poItem.free_selling_price = selling_price;
                            $(row).find("input[datafield=free_selling_price]").val(selling_price);
                        }
                    }
                    else {
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }

                        var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                        if (isNaN(poItem.disc_per)) {
                            poItem.disc_per = 0;
                        }
                        if (isNaN(poItem.disc_val)) {
                            poItem.disc_val = 0;
                        }
                        discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                        var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                        if (parseFloat(poItem.additional_tax) != 0)
                            tax = parseFloat(tax) + parseFloat(poItem.additional_tax);

                        var net_rate = 0;
                        if (CONTEXT.FREE_AVG_BUYING_COST) {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        } else {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        }
                        poItem.net_rate = net_rate;
                        //var selling_price = Math.round(parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        poItem.selling_price = selling_price;
                        $(row).find("input[datafield=selling_price]").val(selling_price);
                        if (CONTEXT.PRICE_EQUAL_FREE) {
                            poItem.free_selling_price = selling_price;
                            $(row).find("input[datafield=free_selling_price]").val(selling_price);
                        }
                    }
                    $$("txtItemName").selectedObject.focus();
                });
            }
        }
        function donePrice1ProfitCalculate(e) {
            if ($$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").val() != "" && $$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").val() != null && typeof $$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").val() != "undefined") {
                $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdBill.getRowData(row);
                    poItem.profit = $$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").val();
                    if (poItem.profit.startsWith("#")) {
                        poItem.profit = poItem.profit.replace(/#/g, 0);
                        var profper = (parseFloat(item.mrp) * parseFloat(poItem.profit)) / 100;
                        //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                        var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                        poItem.selling_price = selling_price;
                        $(row).find("input[datafield=selling_price]").val(selling_price);
                        if (CONTEXT.PRICE_EQUAL_FREE) {
                            poItem.free_selling_price = selling_price;
                            $(row).find("input[datafield=free_selling_price]").val(selling_price);
                        }
                    }
                    else if (poItem.profit.startsWith("@")) {
                        poItem.profit = poItem.profit.slice(1, poItem.profit.length);
                        var selling_price = poItem.profit;
                        poItem.alter_price_1 = selling_price;
                        $(row).find("input[datafield=alter_price_1]").val(selling_price);
                    }
                    else {
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }

                        var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                        if (isNaN(poItem.disc_per)) {
                            poItem.disc_per = 0;
                        }
                        if (isNaN(poItem.disc_val)) {
                            poItem.disc_val = 0;
                        }
                        discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                        var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                        if (parseFloat(poItem.additional_tax) != 0)
                            tax = parseFloat(tax) + parseFloat(poItem.additional_tax);

                        var net_rate = 0;
                        if (CONTEXT.FREE_AVG_BUYING_COST) {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        } else {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        }
                        poItem.net_rate = net_rate;
                        //var selling_price = Math.round(parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        poItem.alter_price_1 = selling_price;
                        $(row).find("input[datafield=alter_price_1]").val(selling_price);

                    }
                    $$("txtItemName").selectedObject.focus();
                });
            }
        }
        function donePrice2ProfitCalculate(e) {
            if ($$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").val() != "" && $$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").val() != null && typeof $$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").val() != "undefined") {
                $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdBill.getRowData(row);
                    poItem.profit = $$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").val();
                    if (poItem.profit.startsWith("#")) {
                        poItem.profit = poItem.profit.replace(/#/g, 0);
                        var profper = (parseFloat(item.mrp) * parseFloat(poItem.profit)) / 100;
                        //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                        var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                        poItem.selling_price = selling_price;
                        $(row).find("input[datafield=selling_price]").val(selling_price);
                        if (CONTEXT.PRICE_EQUAL_FREE) {
                            poItem.free_selling_price = selling_price;
                            $(row).find("input[datafield=free_selling_price]").val(selling_price);
                        }
                    }
                    else if (poItem.profit.startsWith("@")) {
                        poItem.profit = poItem.profit.slice(1, poItem.profit.length);
                        var selling_price = poItem.profit;
                        poItem.alter_price_2 = selling_price;
                        $(row).find("input[datafield=alter_price_2]").val(selling_price);
                    }
                    else {
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }

                        var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                        if (isNaN(poItem.disc_per)) {
                            poItem.disc_per = 0;
                        }
                        if (isNaN(poItem.disc_val)) {
                            poItem.disc_val = 0;
                        }
                        discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                        var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                        if (parseFloat(poItem.additional_tax) != 0)
                            tax = parseFloat(tax) + parseFloat(poItem.additional_tax);

                        var net_rate = 0;
                        if (CONTEXT.FREE_AVG_BUYING_COST) {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        } else {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        }
                        poItem.net_rate = net_rate;
                        //var selling_price = Math.round(parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        var selling_price = parseFloat(parseFloat(poItem.net_rate) * ((100 + parseFloat(poItem.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        poItem.alter_price_2 = selling_price;
                        $(row).find("input[datafield=alter_price_2]").val(selling_price);

                    }
                    $$("txtItemName").selectedObject.focus();
                });
            }
        }
        $("[controlid=txtInvoiceNo]").on('focusout', function () {
            if (page.controls.txtInvoiceNo.val() != "" && page.controls.txtInvoiceNo.val() != null) {
                page.purchaseBillAPI.searchValues("", "", "invoice_no like '" + page.controls.txtInvoiceNo.val() + "'", "", function (data) {
                    if (data.length > 0) {
                        if (!confirm("This Invoice No Is Already Precent Are You Sure To Register It Again")) {
                            page.controls.txtInvoiceNo.val("");
                            page.controls.txtInvoiceNo.focus();
                        }
                    }
                });
            }
        });

        page.loadSelectedBill = function (bill, callback) {
            page.selectedBill = bill;

            $$("txtVendorName").customText(bill.vendor_name);
            $$("hdnVendorNo").val(bill.vendor_no);
            $$("lblPhoneNo").value(bill.phone_no);
            $$("lblAddress").value(bill.address);
            $$("lblEmail").value(bill.email);
            $$("lblRndOff").value(bill.round_off);
            //$$("lblBillNo").value(bill.bill_no);
            //$$("lblBillNo").value(bill.bill_id);
            $$("lblBillNo").value(bill.bill_code);
            $$("txtInvoiceNo").value(bill.invoice_no);
            $$("txtBillDate").setDate(nvl(bill.bill_date, ""));
            $$("txtBillDueDate").setDate(nvl(bill.due_date, ""));
            $$("txtBillDiscount").value(bill.bill_discount);
            $$("txtBillDiscountPercent").value(bill.bill_disc_per);
            $$("txtBillGstAmount").value(bill.gst_amount);

            $$("lblSubTotal").value(bill.sub_total);
            $$("lblTotal").value(bill.total);
            $$("lblTotalNet").value(parseFloat(bill.total)-parseFloat(bill.bill_discount));
            page.interface.setBillAmount(bill.total);
            $$("lblDiscount").value(bill.discount);
            $$("lblItemDisc").value(bill.item_disc_val);
            $$("lblBillDisc").value(bill.bill_disc_val);
            $$("lblTax").value(bill.tax);
            $$("lblGst").value(bill.gst_no);
            $$("txtCreditAmount").value(bill.bill_credit);

            $$("lblMoreSupplier").value(bill.vendor_name);
            $$("lblMoreTotalPurchase").value(bill.vendor_tot_purchase);
            $$("lblMoreTotalReturn").value(bill.vendor_tot_return);
            $$("lblMoreTotalPurchasePayment").value(bill.vendor_tot_purchase_payment);
            $$("lblMoreTotalReturnPayment").value(bill.vendor_tot_ret_payment);
            $$("lblMorePendingPayment").value(bill.vendor_tot_pending_pay);
            $$("lblMorePendingSettlement").value(bill.vendor_tot_pending_settlement);

            //Expense
            $$("ddlExpName").selectedValue((bill.expenses == undefined) ? "-1" : (bill.expenses.length == 0) ? "-1" : bill.expenses[bill.expenses.length - 1].exp_name);
            $$("txtExpAmount").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length-1].amount);
            
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
                
            }
            else {
                page.view.selectedBill(bill.billItems);
                page.productList = page.interface.currentProductList;
            }

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
            if (CONTEXT.ENABLE_VENDOR_IN_BILL) {
                if (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) {
                    alert("Please Select The Vendor");
                    err_count++;
                    $$("btnSave").show();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                }
            }
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
            var error_mrp = true;
            var error_mrp_cost = true;
            $(page.controls.grdBill.allData()).each(function (i, billItem) {
                try {
                    if (billItem.qty == undefined || billItem.qty == "" || billItem.qty == null || parseFloat(billItem.qty) <= 0 || isNaN(billItem.qty)) {
                        billItem.qty = 0;
                    }
                    if (billItem.free_qty == undefined || billItem.free_qty == "" || billItem.free_qty == null)
                        billItem.free_qty = 0;
                    if (parseFloat(billItem.free_qty) < 0 || isNaN(billItem.free_qty)) {
                        billItem.free_qty = 0;
                    }
                    if ((parseFloat(billItem.qty) + parseFloat(billItem.free_qty)) <= 0) {
                        err_count++;
                        throw "Qty should be number and positive for item " + billItem.item_name + "";
                    }
                    if (billItem.cost == undefined || billItem.cost == "" || billItem.cost == null || parseFloat(billItem.cost) <= 0 || isNaN(billItem.cost)) {
                        billItem.cost = 0;
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
                        billItem.tax_per = 0;
                    }
                    if (billItem.mrp == "" || billItem.mrp == null || typeof billItem.mrp == "undefined") {
                        billItem.mrp = 0;
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
                } catch (e) {
                    //page.msgPanel.show(e);
                    alert(e);
                    $$("btnSave").show();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                }
            });
            if (err_count == 0) {
                //$$("btnSave").hide();
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
            var tax_inclusive = 0;
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            var tot_attr_price = 0;
            var maxWidth = 0;
            var final_item_level_disc = 0;
            var tot_qty = 0;

            $(page.controls.grdBill.getAllRows()).each(function (i, row) {

                //Function to auto calclate width
                $(row).find("div[datafield=attributes]").width("auto");
                var curWidth = $(row).find("div[datafield=attributes]").width();
                if (curWidth > maxWidth)
                    maxWidth = curWidth;
                if (maxWidth < 100)
                    maxWidth = 100;


                var poItem = page.controls.grdBill.getRowData(row);
                $(row).find("[datafield=sl_no]").find("div").html(i + 1);
                $(row).find("[datafield=sl_no]").find("div").val(i + 1);
                poItem.sl_no = i + 1;
                var temp_cost;
                if (poItem.cost == "" || poItem.cost == null || poItem.cost == undefined)
                    poItem.cost = 0;
                if (poItem.disc_per == "" || poItem.disc_per == null || poItem.disc_per == undefined) {
                    poItem.disc_per = 0;
                }
                if (poItem.disc_val == "" || poItem.disc_val == null || poItem.disc_val == undefined)
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || poItem.tax_per == undefined)
                    poItem.tax_per = 0;
                if (poItem.free_qty == "" || poItem.free_qty == null || poItem.free_qty == undefined)
                    poItem.free_qty = 0;
                if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                    poItem.additional_tax = 0;

                if (poItem.cess_qty == "" || poItem.cess_qty == null || typeof poItem.cess_qty == "undefined")
                    poItem.cess_qty = 1;
                if (poItem.cess_qty_amount == "" || poItem.cess_qty_amount == null || typeof poItem.cess_qty_amount == "undefined")
                    poItem.cess_qty_amount = 0;

                poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                if (poItem.additional_tax == 0) {
                    poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                }
                poItem.bill_disc = 0;
                $(page.selectedBill.discounts).each(function (i, data) {
                    if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed") {
                            poItem.disc_per = parseFloat(parseFloat(data.disc_value) * 100 / (parseFloat(poItem.cost) * parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                            poItem.bill_disc = poItem.disc_per;
                            $(row).find("div[datafield=bill_disc]").html(poItem.disc_per);
                        }
                        else if (data.disc_type == "Percent") {
                            poItem.disc_per = data.disc_value;
                            $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                            poItem.bill_disc = poItem.disc_per;
                            $(row).find("div[datafield=bill_disc]").html(poItem.disc_per);
                        }
                    }
                });
                poItem.item_disc = (poItem.item_disc == null || typeof poItem.item_disc == "undefined" || poItem.item_disc == "") ? 0 : poItem.item_disc;
                poItem.disc_per = parseFloat(poItem.bill_disc) + parseFloat(poItem.item_disc);
                $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                

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

                var discount = 0;
                temp_cost = poItem.cost;

                var subtotal = parseFloat(temp_cost) * parseFloat(poItem.qty);
                discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                //Calculate Item Level Discount
                final_item_level_disc = parseFloat(final_item_level_disc) + (subtotal * parseFloat(poItem.item_disc) / 100);

                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                if (parseFloat(poItem.additional_tax) != 0)
                    tax = parseFloat(tax) + parseFloat(poItem.additional_tax);
                var total = subtotal;// - discount + tax;

                if (CONTEXT.FREE_AVG_BUYING_COST) {
                    var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty) + parseFloat(poItem.free_qty));
                    buying_cost = (isNaN(buying_cost)) ? 0 : buying_cost;
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    net_rate = (isNaN(net_rate)) ? 0 : net_rate;
                    
                } else {
                    var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty));
                    buying_cost = (isNaN(buying_cost)) ? 0 : buying_cost;
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    net_rate = (isNaN(net_rate)) ? 0 : net_rate;
                }
                //net_rate = parseFloat(parseFloat(total) / (parseFloat(poItem.qty))).toFixed(5);
                $(row).find("[datafield=gross_amt]").find("div").html(parseFloat(parseFloat(poItem.cost) * parseFloat(poItem.qty)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=additional_tax]").find("div").html(parseFloat(poItem.additional_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=buying_cost]").find("div").html(buying_cost.toFixed(CONTEXT.COUNT_AFTER_POINTS));
                //here
                if (poItem.attr_type1 == "cost") {
                    $(row).find("input[dataField=attr_value1]").val(buying_cost);
                    poItem.attr_value1 = buying_cost;
                }
                else if (poItem.attr_type2 == "cost") {
                    $(row).find("input[dataField=attr_value2]").val(buying_cost);
                    poItem.attr_value2 = buying_cost;
                }
                else if (poItem.attr_type3== "cost") {
                    $(row).find("input[dataField=attr_value3]").val(buying_cost);
                    poItem.attr_value3 = buying_cost;
                }
                else if (poItem.attr_type4 == "cost") {
                    $(row).find("input[dataField=attr_value4]").val(buying_cost);
                    poItem.attr_value4 = buying_cost;
                }
                else if (poItem.attr_type5 == "cost") {
                    $(row).find("input[dataField=attr_value5]").val(buying_cost);
                    poItem.attr_value5 = buying_cost;
                }
                else if (poItem.attr_type6 == "cost") {
                    $(row).find("input[dataField=attr_value6]").val(buying_cost);
                    poItem.attr_value6 = buying_cost;
                }
                //
                //$(row).find("[datafield=net_rate]").find("div").html(net_rate);
                $(row).find("input[dataField=net_rate]").val(net_rate);//.change();
                $(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);

                $(row).find("[datafield=cgst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.cgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=sgst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.sgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=igst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.igst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=cess_per_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=tax_per_amt]").find("div").html(parseFloat(tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                poItem.cgst_val = parseFloat((subtotal - discount) * parseFloat(poItem.cgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.sgst_val = parseFloat((subtotal - discount) * parseFloat(poItem.sgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.igst_val = parseFloat((subtotal - discount) * parseFloat(poItem.igst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.cess_per_val = parseFloat((subtotal - discount) * parseFloat(poItem.cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.tax_per_amt = parseFloat((subtotal - discount) * parseFloat(tax) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);

                poItem.net_rate = net_rate;

                poItem.total_price = total;
                total = subtotal - discount + tax;
                poItem.buying_cost = buying_cost.toFixed(CONTEXT.COUNT_AFTER_POINTS);
                finalsubtotal = finalsubtotal + subtotal;
                finaldiscount = finaldiscount + discount;
                finaltax = finaltax + tax;
                finaltotal = finaltotal + total;
                if (parseFloat(poItem.additional_tax) != 0)
                    tax = parseFloat(tax) - parseFloat(poItem.additional_tax);
                cgst_value = parseFloat(cgst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.cgst_per) / 100);
                sgst_value = parseFloat(sgst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.sgst_per) / 100);
                igst_value = parseFloat(igst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.igst_per) / 100);
                cess_per_value = parseFloat(cess_per_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.cess_per) / 100);
                cess_amt_value = parseFloat(cess_amt_value) + parseFloat(poItem.additional_tax);

                if ($(row).prev().find("[datafield=item_no]").find("div").html() != poItem.item_no)
                    tot_attr_price = 0;
                tot_attr_price = parseFloat(tot_attr_price) + parseFloat(total);
                poItem.total_attr_price = tot_attr_price;
                $(row).find("[datafield=total_attr_price]").find("div").html(tot_attr_price);

                tot_qty = parseFloat(tot_qty) + (parseFloat(poItem.qty) + parseFloat(poItem.free_qty));
                for (var i = page.controls.grdBill.allData().length - 1; i >= 0; i--) {
                    var attrRow = page.controls.grdBill.getRow()[i];
                    var attrData = page.controls.grdBill.getRowData(attrRow);
                    if (attrData.item_no == poItem.item_no) {
                        attrData.total_attr_price = tot_attr_price;
                        $(attrRow).find("[datafield=total_attr_price]").find("div").html(tot_attr_price);
                    }
                }


                if ($(row).prev().find("[datafield=item_no]").find("div").html() != $(row).find("[datafield=item_no]").find("div").html()) {
                    $(row).find("[datafield=item_name]").css("visibility", "visible");
                    $(row).find("[datafield=barcode]").css("visibility", "visible");
                    $(row).find("[datafield=item_code]").css("visibility", "visible");
                    $(row).find("[datafield=qty_stock]").css("visibility", "hidden"); 
                    $(row).find("[id=stockDetail]").css("visibility", "visible");
                    var htmlTemplate = [];
                    htmlTemplate.push("<input type='button' title='New Stock'  class='grid-button' value='' action='NewStock' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/plus.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />");
                    $(row).find("[id=stockDetail]").html(htmlTemplate.join(""));
                }
            });

            //Set the auto calclated width
            $($$("grdBill").selectedObject).find("div[datafield=attributes]").width(maxWidth);

            var expAmount = 0;
            if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != 0 && isInt($$("txtExpAmount").value() != 0) && page.controls.lblSubTotal.value() != 0) {
                var expAmount = $$("txtExpAmount").value();
            }
            finaltotal = parseFloat(finaltotal) + parseFloat(expAmount);
            if ($$("txtCreditAmount").value() != "" && $$("txtCreditAmount").value() != null && typeof $$("txtCreditAmount").value() != "undefined") {
                if ($$("txtCreditAmount").value()[$$("txtCreditAmount").value().length - 1] == "%") {
                    $$("txtCreditAmount").value($$("txtCreditAmount").value().slice(0, -1));
                    $$("txtCreditAmount").value(parseFloat(finaltotal) * parseFloat($$("txtCreditAmount").value()) / 100);
                }
                finaltotal = parseFloat(finaltotal) - parseFloat($$("txtCreditAmount").value());
            }
            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            if ($$("chkBillRoundOff").prop("checked")) {
                total_after_Rnd_off = parseFloat(finaltotal);
            }
            
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(finaltotal)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
            page.controls.lblTotalNet.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblDiscount.value(parseFloat(finaldiscount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTax.value(parseFloat(finaltax).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            $$("lblItemDisc").value(parseFloat(final_item_level_disc).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            $$("lblBillDisc").value(parseFloat(parseFloat(finaldiscount) - parseFloat(final_item_level_disc)).toFixed(CONTEXT.COUNT_AFTER_POINTS))

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=item_name]").html("Total Qty : " + parseFloat(tot_qty).toFixed(CONTEXT.COUNT_AFTER_POINTS));
        }
        page.calculateTotal = function (callback) {
            var finalsubtotal = 0;
            var finaldiscount = 0;
            var finaltax = 0;
            var finaltotal = 0;
            var net_rate = 0;
            var tax_inclusive = 0;
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            var tot_attr_price = 0;
            var maxWidth = 0;
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                //Function to auto calclate width
                $(row).find("div[datafield=attributes]").width("auto");
                var curWidth = $(row).find("div[datafield=attributes]").width();
                if (curWidth > maxWidth)
                    maxWidth = curWidth;
                if (maxWidth < 100)
                    maxWidth = 100;
                var poItem = page.controls.grdBill.getRowData(row);
                $(row).find("[datafield=sl_no]").find("div").html(i + 1);
                $(row).find("[datafield=sl_no]").find("div").val(i + 1);
                poItem.sl_no = i + 1;
                var temp_cost;
                if (poItem.cost == "" || poItem.cost == null || poItem.cost == undefined)
                    poItem.cost = 0;
                if (poItem.disc_per == "" || poItem.disc_per == null || poItem.disc_per == undefined) {
                    poItem.disc_per = 0;
                }
                if (poItem.disc_val == "" || poItem.disc_val == null || poItem.disc_val == undefined)
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || poItem.tax_per == undefined)
                    poItem.tax_per = 0;
                if (poItem.free_qty == "" || poItem.free_qty == null || poItem.free_qty == undefined)
                    poItem.free_qty = 0;
                if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                    poItem.additional_tax = 0;

                if (poItem.cess_qty == "" || poItem.cess_qty == null || typeof poItem.cess_qty == "undefined")
                    poItem.cess_qty = 1;
                if (poItem.cess_qty_amount == "" || poItem.cess_qty_amount == null || typeof poItem.cess_qty_amount == "undefined")
                    poItem.cess_qty_amount = 0;

                poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                if (poItem.additional_tax == 0) {
                    poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                }

                poItem.bill_disc = 0;
                $(page.selectedBill.discounts).each(function (i, data) {
                    if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed") {
                            poItem.disc_per = parseFloat(parseFloat(data.disc_value) * 100 / (parseFloat(poItem.cost) * parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                            poItem.bill_disc = poItem.disc_per;
                            $(row).find("div[datafield=bill_disc]").html(poItem.disc_per);
                        }
                        else if (data.disc_type == "Percent") {
                            poItem.disc_per = data.disc_value;
                            $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                            poItem.bill_disc = poItem.disc_per;
                            $(row).find("div[datafield=bill_disc]").html(poItem.disc_per);
                        }
                    }
                });
                poItem.item_disc = (poItem.item_disc == null || typeof poItem.item_disc == "undefined" || poItem.item_disc == "") ? 0 : poItem.item_disc;
                poItem.disc_per = parseFloat(poItem.bill_disc) + parseFloat(poItem.item_disc);
                $(row).find("input[datafield=disc_per]").val(poItem.disc_per);

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

                var discount = 0;
                temp_cost = poItem.cost;

                var subtotal = parseFloat(temp_cost) * parseFloat(poItem.qty);
                discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));

                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                if (parseFloat(poItem.additional_tax) != 0)
                    tax = parseFloat(tax) + parseFloat(poItem.additional_tax);
                var total = subtotal;// - discount + tax;

                if (CONTEXT.FREE_AVG_BUYING_COST) {
                    var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty) + parseFloat(poItem.free_qty));
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                } else {
                    var buying_cost = (subtotal - discount) / (parseFloat(poItem.qty));
                    net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                }
                $(row).find("[datafield=gross_amt]").find("div").html(parseFloat(parseFloat(poItem.cost) * parseFloat(poItem.qty)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=additional_tax]").find("div").html(parseFloat(poItem.additional_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=total_price]").find("div").html(total.toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=buying_cost]").find("div").html(buying_cost.toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=net_rate]").find("div").html(net_rate);
                $(row).find("[datafield=tax_per]").find("div").html(poItem.tax_per);

                $(row).find("[datafield=cgst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.cgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=sgst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.sgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=igst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.igst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=cess_per_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=tax_per_amt]").find("div").html(parseFloat(tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                poItem.cgst_val = parseFloat((subtotal - discount) * parseFloat(poItem.cgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.sgst_val = parseFloat((subtotal - discount) * parseFloat(poItem.sgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.igst_val = parseFloat((subtotal - discount) * parseFloat(poItem.igst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.cess_per_val = parseFloat((subtotal - discount) * parseFloat(poItem.cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.tax_per_amt = parseFloat((subtotal - discount) * parseFloat(tax) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);

                poItem.net_rate = net_rate;

                poItem.total_price = total;
                total = subtotal - discount + tax;
                poItem.buying_cost = buying_cost.toFixed(CONTEXT.COUNT_AFTER_POINTS);
                finalsubtotal = finalsubtotal + subtotal;
                finaldiscount = finaldiscount + discount;
                finaltax = finaltax + tax;
                finaltotal = finaltotal + total;
                if (parseFloat(poItem.additional_tax) != 0)
                    tax = parseFloat(tax) - parseFloat(poItem.additional_tax);
                cgst_value = parseFloat(cgst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.cgst_per) / 100);
                sgst_value = parseFloat(sgst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.sgst_per) / 100);
                igst_value = parseFloat(igst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.igst_per) / 100);
                cess_per_value = parseFloat(cess_per_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.cess_per) / 100);
                cess_amt_value = parseFloat(cess_amt_value) + parseFloat(poItem.additional_tax);

                if ($(row).prev().find("[datafield=item_no]").find("div").html() != poItem.item_no)
                    tot_attr_price = 0;
                tot_attr_price = parseFloat(tot_attr_price) + parseFloat(total);
                poItem.total_attr_price = tot_attr_price;
                $(row).find("[datafield=total_attr_price]").find("div").html(tot_attr_price);
                for (var i = page.controls.grdBill.allData().length - 1; i >= 0; i--) {
                    var attrRow = page.controls.grdBill.getRow()[i];
                    var attrData = page.controls.grdBill.getRowData(attrRow);
                    if (attrData.item_no == poItem.item_no) {
                        attrData.total_attr_price = tot_attr_price;
                        $(attrRow).find("[datafield=total_attr_price]").find("div").html(tot_attr_price);
                    }
                }

                callback(finalsubtotal);

            });

            //Set the auto calclated width
            $($$("grdBill").selectedObject).find("div[datafield=attributes]").width(maxWidth);

            var expAmount = 0;
            if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != 0 && isInt($$("txtExpAmount").value() != 0) && page.controls.lblSubTotal.value() != 0) {
                var expAmount = $$("txtExpAmount").value();
            }
            finaltotal = parseFloat(finaltotal) + parseFloat(expAmount);

            var total_after_Rnd_off = Math.round(parseFloat(finaltotal));
            if ($$("chkBillRoundOff").prop("checked")) {
                total_after_Rnd_off = parseFloat(finaltotal);
            }
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(finaltotal)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
            page.controls.lblTotalNet.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSubTotal.value(parseFloat(finalsubtotal).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblDiscount.value(parseFloat(finaldiscount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTax.value(parseFloat(finaltax).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));

        }
        page.billCalculate = function (data) {
            var tax_inclusive = 0;
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            var tot_attr_price = 0;
            $(data).each(function (i, poItem) {
                var temp_cost;
                if (poItem.cost == "" || poItem.cost == null || poItem.cost == undefined)
                    poItem.cost = 0;
                if (poItem.disc_per == "" || poItem.disc_per == null || typeof poItem.disc_per == "undefined") {
                    poItem.disc_per = 0;
                }
                if (poItem.disc_val == "" || poItem.disc_val == null || typeof poItem.disc_val == "undefined")
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || typeof poItem.tax_per == "undefined")
                    poItem.tax_per = 0;

                if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                    poItem.additional_tax = 0;

                if (poItem.cess_qty == "" || poItem.cess_qty == null || typeof poItem.cess_qty == "undefined")
                    poItem.cess_qty = 1;
                if (poItem.cess_qty_amount == "" || poItem.cess_qty_amount == null || typeof poItem.cess_qty_amount == "undefined")
                    poItem.cess_qty_amount = 0;

                if (poItem.disc_per != null && poItem.disc_per != "0" && typeof poItem.disc_per != "undefined") {
                    poItem.disc_per = parseFloat(parseFloat(poItem.disc_val) * 100 / (parseFloat(poItem.cost) * parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                }
                else if (poItem.disc_val != null && poItem.disc_val != "0" && typeof poItem.disc_val != "undefined") {
                    poItem.disc_per = poItem.disc_val;
                }

                var discount = 0;
                temp_cost = poItem.cost;

                var subtotal = parseFloat(temp_cost) * parseFloat(poItem.qty);
                discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));

                cgst_value = parseFloat(cgst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.cgst_per) / 100);
                sgst_value = parseFloat(sgst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.sgst_per) / 100);
                igst_value = parseFloat(igst_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.igst_per) / 100);
                cess_per_value = parseFloat(cess_per_value) + (parseFloat(subtotal - discount) * parseFloat(poItem.cess_per) / 100);
                cess_amt_value = parseFloat(cess_amt_value) + parseFloat(poItem.additional_tax);


            });
            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var poItem = page.controls.grdBill.getRowData(row);

                var temp_cost;
                if (poItem.cost == "" || poItem.cost == null || poItem.cost == undefined)
                    poItem.cost = 0;
                if (poItem.disc_per == "" || poItem.disc_per == null || poItem.disc_per == undefined) {
                    poItem.disc_per = 0;
                }
                if (poItem.disc_val == "" || poItem.disc_val == null || poItem.disc_val == undefined)
                    poItem.disc_val = 0;
                if (poItem.tax_per == "" || poItem.tax_per == null || poItem.tax_per == undefined)
                    poItem.tax_per = 0;
                if (poItem.free_qty == "" || poItem.free_qty == null || poItem.free_qty == undefined)
                    poItem.free_qty = 0;
                if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                    poItem.additional_tax = 0;

                if (poItem.cess_qty == "" || poItem.cess_qty == null || typeof poItem.cess_qty == "undefined")
                    poItem.cess_qty = 1;
                if (poItem.cess_qty_amount == "" || poItem.cess_qty_amount == null || typeof poItem.cess_qty_amount == "undefined")
                    poItem.cess_qty_amount = 0;

                poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                if (poItem.additional_tax == 0) {
                    poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                }

                poItem.bill_disc = 0;
                $(page.selectedBill.discounts).each(function (i, data) {
                    if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed") {
                            poItem.disc_per = parseFloat(parseFloat(data.disc_value) * 100 / (parseFloat(poItem.cost) * parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                            poItem.bill_disc = poItem.disc_per;
                            $(row).find("div[datafield=bill_disc]").html(poItem.disc_per);
                        }
                        else if (data.disc_type == "Percent") {
                            poItem.disc_per = data.disc_value;
                            $(row).find("input[datafield=disc_per]").val(poItem.disc_per);
                            poItem.bill_disc = poItem.disc_per;
                            $(row).find("div[datafield=bill_disc]").html(poItem.disc_per);
                        }
                    }
                });
                poItem.item_disc = (poItem.item_disc == null || typeof poItem.item_disc == "undefined" || poItem.item_disc == "") ? 0 : poItem.item_disc;
                poItem.disc_per = parseFloat(poItem.bill_disc) + parseFloat(poItem.item_disc);
                $(row).find("input[datafield=disc_per]").val(poItem.disc_per);

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

                var discount = 0;
                temp_cost = poItem.cost;

                var subtotal = parseFloat(temp_cost) * parseFloat(poItem.qty);
                discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                poItem.tax_per = parseFloat(poItem.cgst_per) + parseFloat(poItem.sgst_per) + parseFloat(poItem.igst_per) + parseFloat(poItem.cess_per);
                var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                if (parseFloat(poItem.additional_tax) != 0)
                    tax = parseFloat(tax) + parseFloat(poItem.additional_tax);
                var total = subtotal;// - discount + tax;
                $(row).find("[datafield=cgst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.cgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=sgst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.sgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=igst_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.igst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=cess_per_val]").find("div").html(parseFloat((subtotal - discount) * parseFloat(poItem.cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=tax_per_amt]").find("div").html(parseFloat(tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                poItem.cgst_val = parseFloat((subtotal - discount) * parseFloat(poItem.cgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.sgst_val = parseFloat((subtotal - discount) * parseFloat(poItem.sgst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.igst_val = parseFloat((subtotal - discount) * parseFloat(poItem.igst_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.cess_per_val = parseFloat((subtotal - discount) * parseFloat(poItem.cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                poItem.tax_per_amt = parseFloat(tax).toFixed(CONTEXT.COUNT_AFTER_POINTS);

                if ($(row).prev().find("[datafield=item_no]").find("div").html() != poItem.item_no)
                    tot_attr_price = 0;
                tot_attr_price = parseFloat(tot_attr_price) + parseFloat(subtotal);
                poItem.total_attr_price = tot_attr_price;
                $(row).find("[datafield=total_attr_price]").find("div").html(tot_attr_price);
                for (var i = page.controls.grdBill.allData().length - 1; i >= 0; i--) {
                    var attrRow = page.controls.grdBill.getRow()[i];
                    var attrData = page.controls.grdBill.getRowData(attrRow);
                    if (attrData.item_no == poItem.item_no) {
                        attrData.total_attr_price = tot_attr_price;
                        $(attrRow).find("[datafield=total_attr_price]").find("div").html(tot_attr_price);
                    }
                }
            })

        }

        page.variation = function (row, billItem, callback) {
            var var_data = [];
            $(billItem.variation_data).each(function (i, item) {
                if (item.variation_name != null) {
                    if (true) {//if (parseInt(item.cost) != 0) {
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

            var item_vendor_no, item_cost, item_mrp, item_batch_no, item_man_date, item_exp_date;
            var bill_item_vendor_no, bill_item_cost, bill_item_mrp, bill_item_batch_no, bill_item_man_date, bill_item_exp_date;

            bill_item_vendor_no = (billItem.vendor_no == null || billItem.vendor_no == "" || typeof billItem.vendor_no == "undefined") ? "" : billItem.vendor_no;
            bill_item_cost = (billItem.buying_cost == null || billItem.buying_cost == "" || typeof billItem.buying_cost == "undefined" || isNaN(parseFloat(billItem.buying_cost))) ? "" : parseFloat(billItem.buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS);
            bill_item_mrp = (billItem.mrp == null || billItem.mrp == "" || typeof billItem.mrp == "undefined" || isNaN(parseFloat(billItem.mrp))) ? 0 : parseFloat(billItem.mrp).toFixed(CONTEXT.COUNT_AFTER_POINTS);
            bill_item_batch_no = (billItem.batch_no == null || billItem.batch_no == "" || typeof billItem.batch_no == "undefined") ? "" : billItem.batch_no;
            bill_item_man_date = (billItem.man_date == null || billItem.man_date == "" || typeof billItem.man_date == "undefined") ? "" : billItem.man_date;
            bill_item_exp_date = (billItem.expiry_date == null || billItem.expiry_date == "" || typeof billItem.expiry_date == "undefined") ? "" : billItem.expiry_date;

            $(billItem.variation_data).each(function (i, item) {
                item_vendor_no = (item.vendor_no == null || item.vendor_no == "" || typeof item.vendor_no == "undefined") ? "" : item.vendor_no;
                item_cost = (item.cost == null || item.cost == "" || typeof item.cost == "undefined" || isNaN(parseFloat(item.cost))) ? "" : parseFloat(item.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                item_mrp = (item.mrp == null || item.mrp == "" || typeof item.mrp == "undefined" || isNaN(parseFloat(item.mrp))) ? 0 : parseFloat(item.mrp).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                item_batch_no = (item.batch_no == null || item.batch_no == "" || typeof item.batch_no == "undefined") ? "" : item.batch_no;
                item_man_date = (item.man_date == null || item.man_date == "" || typeof item.man_date == "undefined") ? "" : item.man_date;
                item_exp_date = (item.expiry_date == null || item.expiry_date == "" || typeof item.expiry_date == "undefined") ? "" : item.expiry_date;

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

                if (billItem.var_supp_no != "1") {
                    bill_item_vendor_no = "";
                    item_vendor_no = "";
                }
                if (billItem.var_buying_cost != "1") {
                    bill_item_cost = 0;
                    item_cost = 0;
                }
                if (billItem.var_mrp != "1") {
                    bill_item_mrp = 0;
                    item_mrp = 0;
                }
                if (billItem.var_batch_no != "1") {
                    bill_item_batch_no = "";
                    item_batch_no = "";
                }
                if (billItem.var_man_date != "1") {
                    bill_item_man_date = "";
                    item_man_date = "";
                }
                if (billItem.var_expiry_date != "1") {
                    bill_item_exp_date = "";
                    item_exp_date = "";
                }
                if (parseFloat(bill_item_mrp) == parseFloat(item_mrp) && bill_item_batch_no == item_batch_no &&
                    bill_item_vendor_no == item_vendor_no &&
                    bill_item_exp_date == item_exp_date && bill_item_man_date == item_man_date &&
                        parseFloat(bill_item_cost) == parseFloat(item_cost)) {
                    billItem.var_no = item.var_no;
                    billItem.variation_name = item.variation_name;
                    row.find("input[datafield=variation_name]").val(billItem.variation_name);
                    if (item.active == "0")
                        row.find("input[datafield=variation_name]").css("color", "red");
                    else
                        row.find("input[datafield=variation_name]").css("color", "black");
                }
                if (CONTEXT.ENABLE_FREE_VARIATION && CONTEXT.SHOW_FREE) {
                    if (parseFloat(bill_item_mrp) == parseFloat(item_mrp) && bill_item_batch_no == item_batch_no &&
                   bill_item_vendor_no == item_vendor_no &&
                   bill_item_exp_date == item_exp_date &&
                   bill_item_man_date == item_man_date &&
                   parseFloat(bill_item_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS) == parseFloat(0).toFixed(CONTEXT.COUNT_AFTER_POINTS)) {

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
        page.setAttributes = function (row, billItem) {

            $(billItem.var_stock_attribute.split(",")).each(function (i, item) {
                var value = "-1";
                if (item == "cost") {
                    //if (billItem.cost != "" && billItem.cost != null && typeof billItem.cost != "undefined") {
                    //    value = parseFloat(billItem.cost).toFixed(2);
                    //}
                    //here
                    if (billItem.buying_cost != "" && billItem.buying_cost != null && typeof billItem.buying_cost != "undefined") {
                        value = parseFloat(billItem.buying_cost).toFixed(2);
                    }
                    //
                }
                if (item == "invoice_no") {
                    if ($$("txtInvoiceNo").value() != "" && $$("txtInvoiceNo").value() != null && typeof $$("txtInvoiceNo").value() != "undefined") {
                        value = $$("txtInvoiceNo").value();
                    }
                }
                if (item == "vendor_no") {
                    if ($$("txtVendorName").selectedObject.val() != "" && $$("txtVendorName").selectedObject.val() != null && typeof $$("txtVendorName").selectedObject.val() != "undefined") {
                        value = $$("hdnVendorNo").val();
                    }
                }
                if (value != "-1") {
                    if (i == 0) {
                        billItem.attr_value1 = value;
                        $(row).find("input[dataField=attr_value1]").val(billItem.attr_value1).change();
                    }
                    if (i == 1) {
                        billItem.attr_value2 = value;
                        $(row).find("input[dataField=attr_value2]").val(billItem.attr_value2).change();
                    }
                    if (i == 2) {
                        billItem.attr_value3 = value;
                        $(row).find("input[dataField=attr_value3]").val(billItem.attr_value3).change();
                    }
                    if (i == 3) {
                        billItem.attr_value4 = value;
                        $(row).find("input[dataField=attr_value4]").val(billItem.attr_value4).change();
                    }
                    if (i == 4) {
                        billItem.attr_value5 = value;
                        $(row).find("input[dataField=attr_value5]").val(billItem.attr_value5).change();
                    }
                    if (i == 5) {
                        billItem.attr_value6 = value;
                        $(row).find("input[dataField=attr_value6]").val(billItem.attr_value6).change();
                    }
                }
            });
        }

        page.saveBill_click = function (bill_type, pay_mode, callback) {
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
                var bill_buying_cost = 0;

                $(".detail-info").progressBar("show");
                var vendor_name = $$("txtVendorName").selectedObject.val().split('_');
                var newBill = {
                    bill_no: (page.currentBillNo == undefined || page.currentBillNo == "" || page.currentBillNo == null) ? "0" : page.currentBillNo,
                    bill_date: dbDateTime($$("txtBillDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    fulfillment_store_no: localStorage.getItem("user_fulfillment_store_no"),
                    storewise_bill:CONTEXT.STOREWISE_BILL_NO,
                    reg_no: localStorage.getItem("user_register_id"),
                    user_no: localStorage.getItem("app_user_id"),
                    invoice_no: $$("txtInvoiceNo").value(),
                    due_date: dbDateTime($$("txtBillDueDate").getDate()),
                    bill_discount: $$("txtBillDiscount").value(),
                    bill_disc_per: $$("txtBillDiscountPercent").value(),
                    gst_amount: $$("txtBillGstAmount").value(),

                    sub_total: page.controls.lblSubTotal.value(),
                    total: page.controls.lblTotal.value(),
                    discount: page.controls.lblDiscount.value(),
                    item_disc_val: page.controls.lblItemDisc.value(),
                    bill_disc_val: page.controls.lblBillDisc.value(),
                    tax: page.controls.lblTax.value(),

                    bill_type: bill_type,
                    state_no: (bill_type == "Purchase") ? "904" : "100",
                    pay_mode: $$("ddlPayMode").selectedValue(),
                    round_off: page.controls.lblRndOff.value(),
                    sales_tax_no: page.selectedBill.sales_tax_no,
                    mobile_no: page.controls.lblPhoneNo.value(),
                    email_id: page.controls.lblEmail.value(),
                    gst_no: page.controls.lblGst.value(),

                    tot_qty_words: "",

                    bill_no_par: (bill_type == "PurchaseReturn") ? page.selectedBill.bill_no : "",
                    vendor_no: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : page.controls.hdnVendorNo.val(),
                    vendor_name: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : vendor_name[0],
                    vendor_address: (page.controls.lblAddress.value() == "" || page.controls.lblAddress.value() == undefined || page.controls.lblAddress.value() == null) ? "" : page.controls.lblAddress.value(),
                    //FINFACTS ENTRY DATA
                    invent_type: "PurchaseCredit",
                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    bill_credit: $$("txtCreditAmount").value(),
                };

                var rbillItems = [];
                $(page.controls.grdBill.allData()).each(function (i, billItem) {
                    //var var_name = billItem.item_name;
                    //if (typeof billItem.attr_type1 != "undefined" && billItem.attr_type1 != null && billItem.attr_type1 == "") {
                    //    var_name = var_name + "-" + billItem.attr_type1 + ":" + billItem.attr_value1;
                    //}
                    //if (typeof billItem.attr_type2 != "undefined" && billItem.attr_type2 != null && billItem.attr_type2 == "") {
                    //    var_name = var_name + "-" + billItem.attr_type2 + ":" + billItem.attr_value2;
                    //}
                    //if (typeof billItem.attr_type3 != "undefined" && billItem.attr_type3 != null && billItem.attr_type3 == "") {
                    //    var_name = var_name + "-" + billItem.attr_type3 + ":" + billItem.attr_value3;
                    //}
                    //if (typeof billItem.attr_type4 != "undefined" && billItem.attr_type4 != null && billItem.attr_type4 == "") {
                    //    var_name = var_name + "-" + billItem.attr_type4 + ":" + billItem.attr_value4;
                    //}
                    //if (typeof billItem.attr_type5 != "undefined" && billItem.attr_type5 != null && billItem.attr_type5 == "") {
                    //    var_name = var_name + "-" + billItem.attr_type5 + ":" + billItem.attr_value5;
                    //}
                    //if (typeof billItem.attr_type6 != "undefined" && billItem.attr_type6 != null && billItem.attr_type6 == "") {
                    //    var_name = var_name + "-" + billItem.attr_type6 + ":" + billItem.attr_value6;
                    //}
                    if ((parseFloat(billItem.qty) + parseFloat(billItem.free_qty)) > 0) {
                        var create_free_sku = "false";
                        if (billItem.attr_type1 == "cost" || billItem.attr_type2 == "cost" || billItem.attr_type3 == "cost" || billItem.attr_type4 == "cost" || billItem.attr_type5 == "cost" || billItem.attr_type6 == "cost")
                            create_free_sku = "true";
                        rbillItems.push({
                            sl_no: (billItem.sl_no == null || typeof billItem.sl_no == "undefined")?i+1:billItem.sl_no,
                            qty: parseFloat(billItem.qty),
                            free_qty: billItem.free_qty,
                            unit_identity: billItem.unit_identity,
                            price: parseFloat(billItem.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            disc_val: billItem.disc_val,
                            disc_per: billItem.disc_per,
                            item_disc: billItem.item_disc,
                            bill_disc: billItem.bill_disc,
                            taxable_value: (parseFloat(billItem.total_price) * parseFloat(billItem.tax_per)) / 100,
                            tax_per: billItem.tax_per,
                            total_price: billItem.total_price,
                            bill_type: bill_type,

                            tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined") ? "0" : ""+billItem.tray_received+"",
                            tray_id: (billItem.tray_id == null) ? "-1" : billItem.tray_id,
                            tray_mode: billItem.tray_mode,//"SKU",
                            tray_trans_type: "Vendor Purchase",
                            trans_type: "Vendor Purchase",
                            store_no: getCookie("user_store_id"),
                            fulfillment_store_no: localStorage.getItem("user_fulfillment_store_no"),
                            item_no: billItem.item_no,
                            item_name: billItem.item_name,
                            comp_id1: localStorage.getItem("user_company_id"),
                            comp_id: localStorage.getItem("user_company_id"),
                            cost: parseFloat(billItem.buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS),

                            vendor_no: (page.controls.hdnVendorNo.val() == "" || page.controls.hdnVendorNo.val() == undefined || page.controls.hdnVendorNo.val() == null) ? "" : page.controls.hdnVendorNo.val(),
                            active: "1",
                            tax_class_no: (billItem.tax_class_no == null || billItem.tax_class_no == "" || typeof billItem.tax_class_no == "undefined") ? "" : billItem.tax_class_no,
                            amount: (parseFloat(billItem.cost) * parseFloat(billItem.qty)) - ((parseFloat(billItem.cost) * parseFloat(billItem.qty)) * parseFloat(billItem.disc_per) / 100 + (parseFloat(billItem.disc_val) * parseFloat(billItem.qty))),
                            rate: billItem.cost,
                            user_no: CONTEXT.user_no,
                            var_supp_no: billItem.var_supp_no,
                            var_buying_cost: billItem.var_buying_cost,
                            var_mrp: billItem.var_mrp,
                            var_batch_no: billItem.var_batch_no,
                            var_expiry_date: billItem.var_expiry_date,
                            var_man_date: billItem.var_man_date,
                            additional_tax: billItem.additional_tax,
                            attr_type1: (billItem.var_stock_attr_key.split(",").length - 1 >= 0) ? (typeof billItem.attr_type1 == "undefined" || billItem.attr_type1 == null || billItem.attr_type1 == "") ? "" : billItem.attr_type1 : "",
                            attr_value1: (billItem.var_stock_attr_key.split(",").length - 1 >= 0) ? (typeof billItem.attr_value1 == "undefined" || billItem.attr_value1 == null || billItem.attr_value1 == "") ? "" : billItem.attr_value1 : "",
                            attr_type2: (billItem.var_stock_attr_key.split(",").length - 1 >= 1) ? (typeof billItem.attr_type2 == "undefined" || billItem.attr_type2 == null || billItem.attr_type2 == "") ? "" : billItem.attr_type2 : "",
                            attr_value2: (billItem.var_stock_attr_key.split(",").length - 1 >= 1) ? (typeof billItem.attr_value2 == "undefined" || billItem.attr_value2 == null || billItem.attr_value2 == "") ? "" : billItem.attr_value2 : "",
                            attr_type3: (billItem.var_stock_attr_key.split(",").length - 1 >= 2) ? (typeof billItem.attr_type3 == "undefined" || billItem.attr_type3 == null || billItem.attr_type3 == "") ? "" : billItem.attr_type3 : "",
                            attr_value3: (billItem.var_stock_attr_key.split(",").length - 1 >= 2) ? (typeof billItem.attr_value3 == "undefined" || billItem.attr_value3 == null || billItem.attr_value3 == "") ? "" : billItem.attr_value3 : "",
                            attr_type4: (billItem.var_stock_attr_key.split(",").length - 1 >= 3) ? (typeof billItem.attr_type4 == "undefined" || billItem.attr_type4 == null || billItem.attr_type4 == "") ? "" : billItem.attr_type4 : "",
                            attr_value4: (billItem.var_stock_attr_key.split(",").length - 1 >= 3) ? (typeof billItem.attr_value4 == "undefined" || billItem.attr_value4 == null || billItem.attr_value4 == "") ? "" : billItem.attr_value4 : "",
                            attr_type5: (billItem.var_stock_attr_key.split(",").length - 1 >= 4) ? (typeof billItem.attr_type5 == "undefined" || billItem.attr_type5 == null || billItem.attr_type5 == "") ? "" : billItem.attr_type5 : "",
                            attr_value5: (billItem.var_stock_attr_key.split(",").length - 1 >= 4) ? (typeof billItem.attr_value5 == "undefined" || billItem.attr_value5 == null || billItem.attr_value5 == "") ? "" : billItem.attr_value5 : "",
                            attr_type6: (billItem.var_stock_attr_key.split(",").length - 1 >= 5) ? (typeof billItem.attr_type6 == "undefined" || billItem.attr_type6 == null || billItem.attr_type6 == "") ? "" : billItem.attr_type6 : "",
                            attr_value6: (billItem.var_stock_attr_key.split(",").length - 1 >= 5) ? (typeof billItem.attr_value6 == "undefined" || billItem.attr_value6 == null || billItem.attr_value6 == "") ? "" : billItem.attr_value6 : "",
                            var_attr_key: billItem.var_attr_key,
                            var_stock_attr_key: billItem.var_stock_attr_key,
                            create_free_sku: create_free_sku,
                            //variation_name: var_name
                            
                        });
                        if (typeof billItem.selling_price != "undefined" && billItem.selling_price != "" && billItem.selling_price != null && parseInt(billItem.selling_price) != 0) {
                            //if (parseFloat(billItem.selling_price) != parseFloat(billItem.pre_selling_price)) {
                                rbillItems[rbillItems.length - 1].selling_price = billItem.selling_price;
                                rbillItems[rbillItems.length - 1].valid_from = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date()));
                                rbillItems[rbillItems.length - 1].free_selling_price = billItem.free_selling_price;
                            //}
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
                            if (billItem.price_limit == 0 && billItem.price_limit == null || typeof billItem.price_limit == "undefined") {
                                billItem.price_limit = 0;
                            }
                            rbillItems[rbillItems.length - 1].price_limit = billItem.price_limit;
                        }
                    }
                    bill_buying_cost = parseFloat(bill_buying_cost) + parseFloat((parseFloat(billItem.cost) * parseFloat(billItem.qty)) - ((parseFloat(billItem.cost) * parseFloat(billItem.qty)) * parseFloat(billItem.disc_per) / 100 + (parseFloat(billItem.disc_val) * parseFloat(billItem.qty))));
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
                newBill.discounts = page.selectedBill.discounts;
                page.stockAPI.insertBill(newBill, function (data) {
                    currentBillNo = data.bill_no;
                    var bill_code = data.bill_code;
                    var payment_id = data.payment_id;
                    page.msgPanel.show("Bill Inserted Successfully");
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        var gst_amt = 0;
                        if (!isNaN($$("txtBillGstAmount").value()))
                            gst_amt = parseFloat($$("txtBillGstAmount").value());
                        page.msgPanel.show("Updating Payments...");
                        if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                            if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && $$("txtExpAmount").value() != undefined) {
                                var expenseData1 = {
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,//CONTEXT.ExpenseAccount,
                                    expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,//CONTEXT.ExpenseCategory,
                                    amount: $$("txtExpAmount").value(),//$$("txtExpense").value(),
                                    description: "POP Expense-" + bill_code + $$("ddlExpName").selectedValue(),
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    key_1: currentBillNo,
                                    key_2: $$("txtVendorName").selectedValue(),
                                };
                                //page.accService.insertExpense(expenseData1, function (response) { });
                                page.finfactsEntryAPI.insertExpense(expenseData1, function (response) { });
                            }
                            if ($$("txtCreditAmount").value() != "" && $$("txtCreditAmount").value() != null && typeof $$("txtCreditAmount").value() != "undefined") {
                                var expenseData1 = {
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    target_acc_id: CONTEXT.INCOME_TARGET_ACCOUNT,
                                    expense_acc_id: CONTEXT.INCOME_ACCOUNT,
                                    amount: $$("txtCreditAmount").value(),
                                    description: "POP Income-" + bill_code,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    key_1: currentBillNo,
                                    key_2: $$("txtVendorName").selectedValue(),
                                };
                                page.finfactsEntryAPI.insertBillIncome(expenseData1, function (response) { });
                            }
                        }
                        var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                        var data1 = {
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            description: "POP-" + bill_code,
                            target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                            pur_with_out_tax: parseFloat(p_with_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            tax_amt: parseFloat($$("lblTax").value()),
                            buying_cost: bill_buying_cost,//parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                            rnd_off: $$("lblRndOff").value(),
                            key_1: currentBillNo,
                            key_2: $$("txtVendorName").selectedValue()
                        };
                        page.finfactsEntryAPI.creditPurchase(data1, function (response) {});
                        if (page.controls.ddlPayMode.selectedValue() == "Loan") {
                            page.msgPanel.flash("Finfacts Entry can be added successfully....");
                            callback(currentBillNo, newBill);
                            //var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                            //var data1 = {
                            //    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            //    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            //    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            //    description: "POP-" + bill_code,
                            //    target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                            //    pur_with_out_tax: parseFloat(p_with_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            //    tax_amt: parseFloat($$("lblTax").value()),
                            //    buying_cost: bill_buying_cost,//parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                            //    rnd_off: $$("lblRndOff").value(),
                            //    key_1: currentBillNo,
                            //    key_2: $$("txtVendorName").selectedValue()
                            //};
                            //page.finfactsEntryAPI.creditPurchase(data1, function (response) {
                            //    page.msgPanel.show("Finfacts Entry can be added successfully....");
                            //    callback(currentBillNo, newBill);
                            //});
                        }
                        else if (page.controls.ddlPayMode.selectedValue() == "Mixed") {
                            //var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                            //var data1 = {
                            //    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            //    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            //    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            //    description: "POP-" + bill_code,
                            //    target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                            //    pur_with_out_tax: parseFloat(p_with_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            //    tax_amt: parseFloat($$("lblTax").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            //    buying_cost: bill_buying_cost,//parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                            //    rnd_off: $$("lblRndOff").value(),
                            //    key_1: currentBillNo,
                            //    key_2: $$("txtVendorName").selectedValue()
                            //};
                            var data2 = [];
                            $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                                data2.push({
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                    paid_amount: item.amount,
                                    description: "POP-" + bill_code,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    key_1: currentBillNo,
                                    key_3:payment_id.split(",")[i],
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                });
                            });

                            //page.finfactsEntryAPI.creditPurchase(data1, function (response) {
                                page.finfactsEntryAPI.allcreditPurchasePayment(0, data2, function (response) {
                                    page.msgPanel.flash("Finfacts Entry can be added successfully....");
                                    callback(currentBillNo, newBill);
                                });
                            //});
                        }
                        else {
                            var data2 = [];
                            data2.push({
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                paid_amount: page.controls.lblTotal.value(),
                                description: "POP-" + bill_code,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: currentBillNo,
                                key_3: payment_id.split(",")[0],
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                            page.finfactsEntryAPI.allcreditPurchasePayment(0, data2, function (response) {
                                page.msgPanel.flash("Finfacts Entry can be added successfully....");
                                callback(currentBillNo, newBill);
                            });
                            //var p_with_tax = (parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()));//- parseFloat($$("lblRndOff").value());
                            //var data1 = {
                            //    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            //    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            //    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            //    description: "POP-" + bill_code,
                            //    target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                            //    pur_with_out_tax: parseFloat(p_with_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            //    tax_amt: parseFloat($$("lblTax").value()).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            //    buying_cost: bill_buying_cost,//parseFloat($$("lblSubTotal").value()) - parseFloat($$("lblDiscount").value()),
                            //    round_off: ($$("lblRndOff").value()),
                            //    key_1: currentBillNo,
                            //    key_2: $$("txtVendorName").selectedValue()
                            //};
                            ////page.finfactsEntryAPI.cashPurchase(data1, function (response) {
                            //page.finfactsEntryAPI.creditPurchase(data1, function (response) {
                            //    page.msgPanel.show("Finfacts Entry can be added successfully....");
                            //    page.msgPanel.hide();
                            //    callback(currentBillNo, newBill);
                            //});
                        }
                    }
                    else {
                        page.msgPanel.show("POP payment is recorded successfully.");
                        callback(currentBillNo, newBill);
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
                bill_id: null,
                state_text: "NewBill",
                bill_credit:""
            };

            page.loadSelectedBill(newBill, function () {
                page.loadSalesTaxClasses(newBill.sales_tax_no, function (sales_tax_class) {
                    newBill.sales_tax_class = sales_tax_class;

                    page.calculate();
                    setTimeout(function () { $$("txtVendorName").selectedObject.focus(); $($$("grdBill").selectedObject).find("div[datafield=attributes]").width(100); }, 10);
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
                    item_disc_val: bill.item_disc_val,
                    bill_disc_val: bill.bill_disc_val,
                    tax: bill.tax,
                    bill_no: bill.bill_no,
                    bill_id: bill.bill_id,
                    bill_code: bill.bill_code,
                    bill_date: bill.bill_date,
                    invoice_no: bill.invoice_no,
                    bill_discount: bill.bill_discount,
                    bill_disc_per: bill.bill_disc_per,
                    gst_amount: bill.gst_amount,
                    bill_credit:bill.bill_credit,

                    due_date: bill.due_date,
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

                openBill.billItems = data.bill_items;
                openBill.discounts = data.discounts;
                page.selectedBill.discounts = data.discounts;

                page.msgPanel.show("Getting Bill Discounts...");
                page.msgPanel.show("Loading data...");
                page.loadSelectedBill(openBill, function () {
                    if (openBill.state_text == "Saved") {
                        page.selectedBill.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                        page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX, "", function (data) {
                            page.selectedBill.sales_tax_class = data;
                            page.calculate();
                        });
                    }
                    if (bill.state_text == "Purchase") {
                        page.salestaxclassAPI.getValue({ sales_tax_class_no: openBill.sales_tax_no }, function (data) {
                            if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                                page.selectedBill.sales_tax_class = data;
                            }
                            page.purchaseBillAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                                if (data.length > 0) {
                                    page.controls.grdBillReturn.display("");
                                    page.controls.grdBillReturn.dataBind(data);
                                }
                            });
                        });
                        page.billCalculate(openBill.billItems);
                    }
                    if (bill.state_text == "Return") {
                        //page.calculate();
                        page.billCalculate(openBill.billItems);
                    }
                    page.selectedBill.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                    page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX, "", function (data) {
                        page.selectedBill.sales_tax_class = data;
                        page.calculate();
                    });
                    page.msgPanel.show("Bill is opened...");
                });

                page.msgPanel.hide();
            });
        }
        page.interface.editBill = function (billNo) {
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
                    item_disc_val: bill.item_disc_val,
                    bill_disc_val: bill.bill_disc_val,
                    tax: bill.tax,
                    bill_no: bill.bill_no,
                    bill_id: bill.bill_id,
                    bill_code: bill.bill_code,
                    bill_date: bill.bill_date,
                    invoice_no: bill.invoice_no,
                    bill_discount: bill.bill_discount,
                    bill_disc_per: bill.bill_disc_per,
                    gst_amount: bill.gst_amount,

                    due_date: bill.due_date,
                    state_text: "Saved",//bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
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
                bill.state_text = "NewBill";
                openBill.billItems = data.bill_items;
                openBill.discounts = data.discounts;
                page.selectedBill.discounts = data.discounts;

                page.msgPanel.show("Getting Bill Discounts...");
                page.msgPanel.show("Loading data...");
                page.loadSelectedBill(openBill, function () {
                    if (openBill.state_text == "Saved")
                        page.calculate();
                    if (bill.state_text == "Purchase") {
                        page.salestaxclassAPI.getValue({ sales_tax_class_no: openBill.sales_tax_no }, function (data) {
                            if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                                page.selectedBill.sales_tax_class = data;
                            }
                            page.purchaseBillAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                                if (data.length > 0) {
                                    page.controls.grdBillReturn.display("");
                                    page.controls.grdBillReturn.dataBind(data);
                                }
                            });
                        });
                    }
                    if (bill.state_text == "Return") {
                    }
                    page.selectedBill.sales_tax_no = CONTEXT.DEFAULT_SALES_TAX;
                    page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX, "", function (data) {
                        page.selectedBill.sales_tax_class = data;
                        page.calculate();
                    });
                    page.msgPanel.show("Bill is opened...");
                });
                page.msgPanel.hide();
            });
        }
        page.interface.btnSaveBill_click = function () {
            page.events.btnSave_click();
        }
        page.interface.btnPayBill_click = function () {
            page.events.btnPayment_click();
        }
        page.events.page_load = function () {
            page.attr_list = attr_list;
            $("[controlid=txtItemSearch]").bind("keypress", function (e) {

                if (e.ctrlKey == true && e.which == 0) {
                    if ($(this).attr("search_mode") == "text") {
                        $(this).attr("search_mode", "barcode");
                        $(this).attr("placeholder", "Enter Your Barcode");
                        page.searchAttributes = "barcode";
                        $$("imgBarcode").show();
                    }
                    else {
                        $(this).attr("search_mode", "text");
                        $(this).attr("placeholder", "Item No,Item Name or Scan.");
                        page.searchAttributes = "text";
                        $$("imgBarcode").hide();
                    }
                }

                if ($(this).attr("search_mode") == "barcode" && e.which == 13) {
                    page.searchStock_click();
                }

                // access the clipboard using the api
                var self = this;
                setTimeout(function () {
                    var str = $(self).val();
                    if (str.startsWith("00")) {
                        $(self).val(parseInt(str.substring(0, str.length - 1)));
                        $(self).keydown();
                    }
                }, 300)
            });

            page.view.UIState("New");

            page.vendorAPI.searchValues("", "", "", "", function (data) {
                page.vendorList = data;
                $$("ddlAddInventVendor").dataBind(data, "vendor_no", "vendor_name");
            });


            //Customer autocomplete
            page.controls.txtVendorName.dataBind({
                getData: function (term, callback) {
                    callback(page.vendorList);
                }
            });
            page.controls.txtVendorName.select(function (item) {
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

                $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdBill.getRowData(row);
                    page.setAttributes(row, poItem);
                });

                //page.controls.txtItemSearch.selectedObject.focus();
                $$("txtInvoiceNo").focus();
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
                return "<a>" + item.item_name + "_" + item.item_code + "</a>";
            }
            page.controls.txtItemSearch.dataBind({
                getData: function (term, callback) {
                    if (page.searchAttributes == "text") {
                        var search = term;
                        var flag = false;
                        var filter = "";
                        var sort = "";
                        if (search.startsWith("S") || search.startsWith("s")) {
                            var no = search.substring(1, search.length);
                            if (!isNaN(no)) {
                                filter = "c.item_no in ((select key2 from item_stock_t where stock_no='" + search.substring(1, search.length) + "'))";
                                flag = true;
                            }
                        }
                        if (flag) {
                            page.purchaseItemAPI.searchValues("", "", filter, sort, function (data) {
                                if (data.length == 1) {
                                    page.selectItem(data[0]);
                                    callback([]);
                                }
                                else {
                                    callback(data);
                                }
                            });
                        }
                        else {
                            page.purchaseItemAPI.getValue({ item_no: term, sales_tax_no: page.sales_tax_no }, function (data) {
                                if (data.length == 1) {
                                    page.selectItem(data[0]);
                                    callback([]);
                                }
                                else {
                                    callback(data);
                                }
                            });
                        }
                    }
                    else {
                        callback([]);
                    }
                }
            });
            page.controls.txtItemSearch.select(function (item) {
                if (item != null) {
                    if (item.tax_class_no == null || item.tax_class_no == undefined)
                        item.tax_class_no = 0;
                    var tax_per = 0;
                    var cess_qty = 0;
                    var cess_qty_amount = 0, cess_per = 0, sgst_per = 0, cgst_per = 0, igst_per = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                        if (item.tax_class_no == tax_data.tax_class_no)
                        {
                            tax_per = tax_data.tax_per;
                            cess_qty = tax_data.cess_qty;
                            cess_qty_amount = tax_data.cess_qty_amount;
                            cess_per = tax_data.cess_per;
                            sgst_per = tax_data.sgst;
                            cgst_per = tax_data.cgst;
                            igst_per = tax_data.igst;
                        }
                    });
                    if (typeof item.item_no != "undefined") {
                        var discountVal = 0;
                        item.var_stock_attr_key = (item.var_stock_attr_key == "" || item.var_stock_attr_key == null || typeof item.var_stock_attr_key == "undefined") ? "" : item.var_stock_attr_key;
                        item.var_stock_attribute = (item.var_stock_attribute == "" || item.var_stock_attribute == null || typeof item.var_stock_attribute == "undefined") ? "" : item.var_stock_attribute;
                        item.var_attribute = (item.var_attribute == "" || item.var_attribute == null || typeof item.var_attribute == "undefined") ? "" : item.var_attribute;
                        item.var_attr_key = (item.var_attr_key == "" || item.var_attr_key == null || typeof item.var_attr_key == "undefined") ? "" : item.var_attr_key;
                        var newitem = {
                            sl_no:"1",
                            item_no: item.item_no,
                            item_code: item.item_code,
                            item_name: item.item_name,
                            item_name_tr: item.item_name_tr,
                            unit: item.unit,
                            qty: 1,
                            temp_qty: 1,
                            qty_type: item.qty_type,
                            tray_id: item.tray_no,
                            tray_mode:item.tray_mode,
                            barcode: item.barcode,
                            qty_stock: item.qty_stock,
                            alter_unit: item.alter_unit,
                            alter_unit_fact: item.alter_unit_fact,
                            tax_per: tax_per,
                            expiry_days: item.expiry_days,
                            unit_identity: 0,
                            state_no: "00",
                            temp_free_qty: "0",
                            additional_tax: "0",
                            tax_class_no: item.tax_class_no,
                            tax_inclusive: item.tax_inclusive,
                            rack_no: item.rack_no,
                            var_supp_no: item.var_supp_no,
                            var_buying_cost: item.var_buying_cost,
                            var_mrp: item.var_mrp,
                            var_batch_no: item.var_batch_no,
                            var_man_date: item.var_man_date,
                            var_expiry_date: item.var_expiry_date,
                            cess_qty: cess_qty,
                            cess_qty_amount: cess_qty_amount,
                            cess_per: cess_per,
                            sgst_per: sgst_per,
                            cgst_per: cgst_per,
                            igst_per: igst_per,
                            cgst_val: 0,
                            sgst_val: 0,
                            igst_val: 0,
                            cess_per_val: 0,
                            tax_per_amt: 0,
                            var_attribute: item.var_attribute,
                            var_stock_attribute: item.var_stock_attribute,
                            var_attr_key: item.var_attr_key,
                            var_stock_attr_key: item.var_stock_attr_key,

                            attr_type1: item.attr_type1,
                            attr_value1: "",
                            attr_type2: (item.var_stock_attr_key.split(",").length-1 >= 1)?item.attr_type2:"",
                            attr_value2: "",
                            attr_type3: (item.var_stock_attr_key.split(",").length - 1 >= 2) ? item.attr_type3 : "",
                            attr_value3: "",
                            attr_type4: (item.var_stock_attr_key.split(",").length - 1 >= 3) ? item.attr_type4 : "",
                            attr_value4: "",
                            attr_type5: (item.var_stock_attr_key.split(",").length - 1 >= 4) ? item.attr_type5 : "",
                            attr_value5: "",
                            attr_type6: (item.var_stock_attr_key.split(",").length - 1 >= 5) ? item.attr_type6 : "",
                            attr_value6: "",
                            get_sku: "1",
                            tray_received: "1",
                            item_disc: 0,
                            bill_disc:0
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
                        $$("txtItemSearch").clear();
                        $$("txtItemSearch").clearLastTerm();
                        page.controls.txtItemSearch.clearLastTerm();
                    }
                }

            });
            page.controls.txtItemSearch.noRecordFound(function () {
                
            });
		    page.view.selectedPayment([]);
		    page.salestaxAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlSalesTax.dataBind(data, "sales_tax_no", "sales_tax_name", "None");
            });

            $$("lblTaxLabel").selectedObject.click(function () {
                if (CONTEXT.ENABLE_TAX_CHANGES) {
                    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                    page.controls.pnlTaxPopup.open();
                    page.controls.pnlTaxPopup.title("Tax Selection");
                    page.controls.pnlTaxPopup.rlabel("Tax");
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

            if (CONTEXT.ENABLE_PURCHASE_EXPENSE) {
                $$("pnlExpenseName").show();
                $$("pnlExpenseAmount").show();
                $$("pnlBillCredit").show();
            }
            else {
                $$("pnlExpenseName").hide();
                $$("pnlExpenseAmount").hide();
                $$("pnlBillCredit").hide();
            }

            var payModeType = [];
            payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Mixed" }, { mode_type: "Loan" });
            page.controls.ddlPayMode.dataBind(payModeType, "mode_type", "mode_type");
            $$("ddlPayMode").selectedValue(CONTEXT.PURCHASE_BILL_PAY_MODE);
            $$("ddlPayMode").selectionChange(function () {
                if ($$("ddlPayMode").selectedValue() == "Loan") {
                    $$("pnlDueDate").show();
                }
                else {
                    $$("pnlDueDate").hide();
                }
            });
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
            
            $$("chkShowMore").change(function () {
                if ($$("chkShowMore").prop("checked")) {
                    CONTEXT.POPShowMore = true;
                    page.loadGrid = false;
                    page.view.selectedBill(page.controls.grdBill.allData());
                    page.billCalculate(page.controls.grdBill.allData());
                    //page.calculate();
                    page.loadGrid = true;
                } else {
                    CONTEXT.POPShowMore = false;
                    page.loadGrid = false;
                    page.view.selectedBill(page.controls.grdBill.allData());
                    page.billCalculate(page.controls.grdBill.allData());
                    //page.calculate();
                    page.loadGrid = true;
                }
            });
            if (CONTEXT.ENABLE_QR_CODE) {
                $$("btnQrScan").show();
            }
            else {
                $$("btnQrScan").hide();
            }
            page.discountAPI.searchValues("", "", "disc_level='Item'", "", function (data) {
                page.controls.ddlDiscount.dataBind(data, "disc_no", "disc_name", "None");
                if(data.length != 0)
                    page.bill_discount_no = data[0].disc_no;
            });
            $$("lblDiscountLabel").selectedObject.click(function () {
                page.controls.pnlDiscountPopup.open();
                page.controls.pnlDiscountPopup.title("Discount(s) Applied For Bill");
                page.controls.pnlDiscountPopup.rlabel("Discount");
                page.controls.pnlDiscountPopup.width(1000);
                page.controls.pnlDiscountPopup.height(400);


                page.controls.grdDiscount.width("100%");
                page.controls.grdDiscount.height("220px");
                page.controls.grdDiscount.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Disc No", 'rlabel': 'Disc No', 'width': "100px", 'dataField': "disc_no" },
                        { 'name': "Disc Name", 'rlabel': 'Disc Name', 'width': "200px", 'dataField': "disc_name" },
                        { 'name': "Disc Type", 'rlabel': 'Discount Type', 'width': "150px", 'dataField': "disc_type" },
                        { 'name': "Disc Value", 'rlabel': 'Discount Value', 'width': "150px", 'dataField': "disc_value" },
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "150px", 'dataField': "item_no" },
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
            $$("chkBillRoundOff").click(function () {
                page.calculate();
            });

            $$("lblDiscount").selectedObject.click(function () {
                $$("pnlDiscountDetails").selectedObject.toggle();
            });
        }
        page.selectItem = function (item) {
            if (item != null) {
                if (item.tax_class_no == null || item.tax_class_no == undefined)
                    item.tax_class_no = 0;
                var tax_per = 0;
                var cess_qty = 0;
                var cess_qty_amount = 0, cess_per = 0, sgst_per = 0, cgst_per = 0, igst_per = 0;
                $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                    if (item.tax_class_no == tax_data.tax_class_no)
                    {
                        tax_per = tax_data.tax_per;
                        cess_qty = tax_data.cess_qty;
                        cess_qty_amount = tax_data.cess_qty_amount;
                        cess_per = tax_data.cess_per;
                        sgst_per = tax_data.sgst;
                        cgst_per = tax_data.cgst;
                        igst_per = tax_data.igst;
                    }
                });
                if (typeof item.item_no != "undefined") {
                    var discountVal = 0;
                    item.var_stock_attr_key = (item.var_stock_attr_key == "" || item.var_stock_attr_key == null || typeof item.var_stock_attr_key == "undefined") ? "" : item.var_stock_attr_key;
                    item.var_stock_attribute = (item.var_stock_attribute == "" || item.var_stock_attribute == null || typeof item.var_stock_attribute == "undefined") ? "" : item.var_stock_attribute;
                    item.var_attribute = (item.var_attribute == "" || item.var_attribute == null || typeof item.var_attribute == "undefined") ? "" : item.var_attribute;
                    item.var_attr_key = (item.var_attr_key == "" || item.var_attr_key == null || typeof item.var_attr_key == "undefined") ? "" : item.var_attr_key;
                    var newitem = {
                        sl_no: "1",
                        item_no: item.item_no,
                        item_code: item.item_code,
                        item_name: item.item_name,
                        item_name_tr: item.item_name_tr,
                        unit: item.unit,
                        qty: 1,
                        temp_qty: 1,
                        qty_type: item.qty_type,
                        tray_id: item.tray_no,
                        tray_mode: item.tray_mode,
                        barcode: item.barcode,
                        qty_stock: item.qty_stock,
                        alter_unit: item.alter_unit,
                        alter_unit_fact: item.alter_unit_fact,
                        tax_per: tax_per,//taxData[0].tax,
                        expiry_days: item.expiry_days,
                        unit_identity: 0,
                        state_no: "00",
                        temp_free_qty: "0",
                        tax_class_no: item.tax_class_no,
                        tax_inclusive: item.tax_inclusive,
                        rack_no: item.rack_no,
                        var_supp_no: item.var_supp_no,
                        var_buying_cost: item.var_buying_cost,
                        var_mrp: item.var_mrp,
                        var_batch_no: item.var_batch_no,
                        var_man_date: item.var_man_date,
                        var_expiry_date: item.var_expiry_date,
                        cess_qty: cess_qty,
                        cess_qty_amount: cess_qty_amount,
                        cess_per: cess_per,
                        sgst_per: sgst_per,
                        cgst_per: cgst_per,
                        igst_per: igst_per,
                        cgst_val: 0,
                        sgst_val: 0,
                        igst_val: 0,
                        cess_per_val: 0,
                        tax_per_amt: 0,
                        var_attribute: item.var_attribute,
                        var_stock_attribute: item.var_stock_attribute,
                        var_attr_key: item.var_attr_key,
                        var_stock_attr_key: item.var_stock_attr_key,

                        attr_type1: item.attr_type1,
                        attr_value1: "",
                        attr_type2: (item.var_stock_attr_key.split(",").length - 1 >= 1) ? item.attr_type2 : "",
                        attr_value2: "",
                        attr_type3: (item.var_stock_attr_key.split(",").length - 1 >= 2) ? item.attr_type3 : "",
                        attr_value3: "",
                        attr_type4: (item.var_stock_attr_key.split(",").length - 1 >= 3) ? item.attr_type4 : "",
                        attr_value4: "",
                        attr_type5: (item.var_stock_attr_key.split(",").length - 1 >= 4) ? item.attr_type5 : "",
                        attr_value5: "",
                        attr_type6: (item.var_stock_attr_key.split(",").length - 1 >= 5) ? item.attr_type6 : "",
                        attr_value6: "",
                        get_sku: "1",
                        tray_received: "1",
                        item_disc: 0,
                        bill_disc: 0
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
                    page.controls.txtItemSearch.clearLastTerm();
                    page.calculate();
                    $$("txtItemSearch").clear();
                    $$("txtItemSearch").clearLastTerm();
                }
            }
        }
        page.searchStock_click = function () {
            var term = $$("txtItemSearch").selectedObject.val();
            var search = term;
            var flag = false;
            var filter = "";
            var sort = "";
            if (search.startsWith("S") || search.startsWith("s")) {
                var no = search.substring(1, search.length);
                if (!isNaN(no)) {
                    filter = "c.item_no in ((select key2 from item_stock_t where stock_no='" + search.substring(1, search.length) + "'))";
                    flag = true;
                }
            }
            if (flag) {
                page.purchaseItemAPI.searchValues("", "", filter, sort, function (data) {
                    page.selectItem(data[0]);
                });
            }
            else {
                page.purchaseItemAPI.getValue({ item_no: term, sales_tax_no: page.sales_tax_no }, function (data) {
                    page.selectItem(data[0]);
                });
            }
        }
        page.events.btnNewVariation_click = function () {
            page.vendorAPI.searchValues("", "", "", "", function (data) {
                page.vendorList = data;
                $$("ddlAddInventVendor").dataBind(data, "vendor_no", "vendor_name");

                var searchViewData = [];
                page.controls.pnlNewVariation.open();
                page.controls.pnlNewVariation.title("New Variation");
                page.controls.pnlNewVariation.rlabel("New Variation");
                page.controls.pnlNewVariation.width("900");
                page.controls.pnlNewVariation.height(300);
                $$("txtNewVariation").focus();
                $$("ddlAddInventVendor").selectedValue(page.controls.txtVendorName.selectedValue());
                $$("txtNewVariation").val(page.controls.grdBill.selectedData()[0].variation_name);
                $$("txtAddInventCost").val(parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $$("txtAddMrp").val(page.controls.grdBill.selectedData()[0].mrp);
                $$("txtAddBatchNo").val(page.controls.grdBill.selectedData()[0].batch_no);
                $$("dsAddExpiryDate").setDate(page.controls.grdBill.selectedData()[0].expiry_date);
                searchViewData.push({ view_no: parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS), view_name: parseFloat(page.controls.grdBill.selectedData()[0].buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS) })

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
            if ($$("txtNewVariation").value() == "") {
                alert("Enter variation name...!");
                $$("txtNewVariation").focus();
            }
            else if ($$("ddlAddInventVendor").selectedValue() == "-1" || $$("ddlAddInventVendor").selectedValue() == undefined || $$("ddlAddInventVendor").selectedValue() == null) {
                alert("Supplier name is not empty...!");
            }
            else {
                page.stockAPI.searchStocksMain(vari_data.item_no, localStorage.getItem("user_store_no"), function (data) {
                    try {
                        $(data).each(function (i, item) {
                            if (var_supp_no != "1") {
                                item.vendor_no = "-1";
                                vari_data.vendor_no = "-1";
                            }
                            if (var_buying_cost != "1") {
                                item.cost = "0";
                                vari_data.cost = "0";
                            }
                            if (var_mrp != "1") {
                                item.mrp = "0";
                                vari_data.mrp = "0";
                            }
                            if (var_batch_no != "1") {
                                item.batch_no = "";
                                vari_data.batch_no = "";
                            }
                            if (var_expiry_date != "1") {
                                item.expiry_date = "";
                                vari_data.expiry_date = "";
                            }
                            if (var_man_date != "1") {
                                item.man_date = "";
                                vari_data.man_date = "";
                            }
                            if (vari_data.variation_name == item.variation_name && parseFloat(vari_data.mrp) == parseFloat(item.mrp) && vari_data.batch_no == item.batch_no && vari_data.expiry_date == item.expiry_date && parseFloat(vari_data.cost) == parseFloat(item.cost)) {
                                throw "Duplicate entry not accepted";
                                count++;
                            }
                            if (vari_data.variation_name == item.variation_name) {
                                throw "Variation name is not duplicated";
                            }
                        });
                        if (count == 0) {
                            $(".detail-info").progressBar("show");
                            page.inventoryService.insertStockVariation(vari_data, function (data) {
                                alert("Variation Added Successfully");
                                page.controls.pnlNewVariation.close();
                                $$("txtNewVariation").value("");
                                $$("txtAddMrp").value("");
                                $$("txtAddBatchNo").value("");
                                $$("dsAddExpiryDate").setDate("");
                                $$("dsAddManDate").setDate("");
                                var item = page.controls.grdBill.selectedData()[0];
                                item.pre_selling_price = "";
                                if (parseFloat(vari_data.cost) == 0) {
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
        page.events.btnGenBarCode_click = function () {
            $$("txtBarcode").value(getFullCode($$("lblItemNo").value()));
        },
        page.events.btnNewGenBarCode_click = function () {
            $$("txtNewBarcode").value(getFullCode($$("lblItemNo").value()));
        },
        page.events.btnSaveNewItem_click = function () {
            try {
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
                    tax_class_no: ($$("ddlNewTax").selectedValue() == null) ? "-1" : $$("ddlNewTax").selectedValue(),
                    tax_inclusive: active,
                    comp_id: localStorage.getItem("user_company_id"),
                    alter_unit: $$("txtAlterUnit").value(),
                    alter_unit_fact: $$("txtAlterUnitFact").value(),
                    var_attribute: "",
                    var_stock_attribute: "",
                    var_attr_key: "",
                    var_stock_attr_key: "",
                    mpt_no: ($$("ddlMainProductType").selectedValue() == null) ? "-1" : $$("ddlMainProductType").selectedValue(),
                    ptype_no: ($$("ddlProductType").selectedValue() == null) ? "-1" : $$("ddlProductType").selectedValue(),
                }
                $($$("grdItemVariation").selectedData()).each(function (i, item) {
                    var bit_added = "";
                    if (parseInt(item.attr_no_key) < 10)
                        bit_added = "000";
                    if (parseInt(item.attr_no_key) >= 10 && parseInt(item.attr_no_key) < 100)
                        bit_added = "00";
                    if (parseInt(item.attr_no_key) >= 100 && parseInt(item.attr_no_key) < 1000)
                        bit_added = "0";
                    bit_added = bit_added + "" + item.attr_no_key;

                    if (data.var_attribute == "")
                        data.var_attribute = bit_added + "" + item.attr_no;
                    else
                        data.var_attribute = data.var_attribute + "," + bit_added + "" + item.attr_no;

                    if (data.var_attr_key == "")
                        data.var_attr_key = item.attr_no_key;
                    else
                        data.var_attr_key = data.var_attr_key + "," + item.attr_no_key;
                });
                data.var_stock_attribute = data.var_attribute;
                data.var_stock_attr_key = data.var_attr_key;
                $($$("grdItemStockVariation").selectedData()).each(function (i, item) {
                    var bit_added = "";
                    if (parseInt(item.attr_no_key) < 10)
                        bit_added = "000";
                    if (parseInt(item.attr_no_key) >= 10 && parseInt(item.attr_no_key) < 100)
                        bit_added = "00";
                    if (parseInt(item.attr_no_key) >= 100 && parseInt(item.attr_no_key) < 1000)
                        bit_added = "0";
                    bit_added = bit_added + "" + item.attr_no_key;

                    if (data.var_stock_attribute == "")
                        data.var_stock_attribute = bit_added + "" + item.attr_no;
                    else
                        data.var_stock_attribute = data.var_stock_attribute + "," + bit_added + "" + item.attr_no;

                    if (data.var_stock_attr_key == "")
                        data.var_stock_attr_key = item.attr_no_key;
                    else
                        data.var_stock_attr_key = data.var_stock_attr_key + "," + item.attr_no_key;
                });
                data.var_attribute = data.var_attribute.split(",");
                data.var_attribute.sort();
                for (var i = 0; i < data.var_attribute.length; i++) {
                        data.var_attribute[i] = data.var_attribute[i].slice(4, data.var_attribute[i].length);
                }
                data.var_attribute = data.var_attribute.join(",");
                data.var_stock_attribute = data.var_stock_attribute.split(",");
                data.var_stock_attribute.sort();
                for (var i = 0; i < data.var_stock_attribute.length; i++) {
                        data.var_stock_attribute[i] = data.var_stock_attribute[i].slice(4, data.var_stock_attribute[i].length);
                }
                data.var_stock_attribute = data.var_stock_attribute.join(",");
                data.var_stock_attr_key = data.var_stock_attr_key.split(",");
                data.var_stock_attr_key.sort();
                
                data.var_stock_attr_key.sort(function (a, b) { return parseInt(a) - parseInt(b) });

                data.var_stock_attr_key = data.var_stock_attr_key.join(",");
                //if ($$("grdItemStockVariation").selectedData().length == 0)
                //    throw "Please Select The Item SKU Variation";
                if (data.item_name == "" || data.item_name == null || typeof data.item_name == "undefined") {
                    throw "Item Name Should Not Be Empty";
                }
                if ((parseInt($$("grdItemVariation").selectedData().length) + parseInt($$("grdItemStockVariation").selectedData().length)) > 6) {
                    throw "Maximum 6 variations only choosen";
                }
                page.itemAPI.postValue(data, function (data1) {
                    page.purchaseItemAPI.getValue({ item_no: $$("txtNewItemName").selectedObject.val(), sales_tax_no: page.selectedBill.sales_tax_no }, function (data) {
                        var selected_data = data[data.length - 1];
                        var cess_qty = 0;
                        var cess_qty_amount = 0, cess_per = 0, sgst_per = 0, cgst_per = 0, igst_per = 0;
                        $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                            if (selected_data.tax_class_no == tax_data.tax_class_no) {
                                tax_per = tax_data.tax_per;
                                cess_qty = tax_data.cess_qty;
                                cess_qty_amount = tax_data.cess_qty_amount;
                                cess_per = tax_data.cess_per;
                                sgst_per = tax_data.sgst;
                                cgst_per = tax_data.cgst;
                                igst_per = tax_data.igst;
                            }
                        });
                        var newitem = {
                            item_no: selected_data.item_no,
                            item_code: selected_data.item_code,
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
                            tax_inclusive: selected_data.tax_inclusive,
                            unit_identity: "0",
                            cess_qty: cess_qty,
                            cess_qty_amount: cess_qty_amount,
                            cess_qty: cess_qty,
                            cess_per: cess_per,
                            sgst_per: sgst_per,
                            cgst_per: cgst_per,
                            igst_per: igst_per,
                            cgst_val: 0,
                            sgst_val: 0,
                            igst_val: 0,
                            cess_per_val: 0,
                            tax_per_amt: 0,
                            temp_free_qty: "0",
                            var_attribute: selected_data.var_attribute,
                            var_stock_attribute: selected_data.var_stock_attribute,
                            var_attr_key: selected_data.var_attr_key,
                            var_stock_attr_key: selected_data.var_stock_attr_key,

                            attr_type1: selected_data.attr_type1,
                            attr_value1: "",
                            attr_type2: selected_data.attr_type2,
                            attr_value2: "",
                            attr_type3: selected_data.attr_type3,
                            attr_value3: "",
                            attr_type4: selected_data.attr_type4,
                            attr_value4: "",
                            attr_type5: selected_data.attr_type5,
                            attr_value5: "",
                            attr_type6: selected_data.attr_type6,
                            attr_value6: "",
                            tray_mode:"SKU"
                        };
                        alert("Item inserted successfully....");
                        page.controls.pnlNewItem.close();
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
            catch (e) {
                alert(e);
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
                tax_class_no: $$("ddlEditTax").selectedValue(),
                tax_inclusive: active,
                alter_unit: $$("txtEditAlterUnit").selectedValue(),
                alter_unit_fact: $$("txtEditAlterUnitFact").value(),
            }, function (data) {
                alert("Item detaild updated successfully...");
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
        page.events.btnPay_now_click = function () {
            $$("btnPayment").disable(false);
            $$("btnPayment").show();
            $$("btnPayPending").disable(false);
            $$("btnPayPending").show();
            $$("btnSave").show();
            page.controls.pnlPayNow.open();
            page.controls.pnlPayNow.title("Mixed Paymode Popup");
            page.controls.pnlPayNow.rlabel("Mixed Paymode Popup");
            page.controls.pnlPayNow.width(800);
            page.controls.pnlPayNow.height(420);
            var payModeType = [];
            payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" });
            page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
            $$("pnlCard").hide();
            $$("pnlCoupon").hide();
            $$("pnlAmount").show();
            $$("pnlBalance").show();
            $$("pnlPoints").hide();
            $$("lblBalance").value(parseFloat(page.controls.lblTotal.value()));
            $$("txtAmount").val('');
            //$$("ddlPaymentType").selectionChange(function () {
            //    if ($$("ddlPaymentType").selectedValue() == "Cash") {
            //        $$("pnlCard").hide();
            //        $$("pnlCoupon").hide();
            //        $$("pnlPoints").hide();
            //        $$("pnlAmount").show();
            //        $$("pnlBalance").show();
            //    }
            //    else if ($$("ddlPaymentType").selectedValue() == "Card") {
            //        $$("pnlCard").show();
            //        $$("pnlCoupon").hide();
            //        $$("pnlPoints").hide();
            //        $$("pnlAmount").show();
            //        $$("pnlBalance").show();
            //    }
            //    else {
            //        $$("pnlCard").hide();
            //        $$("pnlCoupon").hide();
            //        $$("pnlPoints").hide();
            //        $$("pnlAmount").show();
            //        $$("pnlBalance").show();
            //    }
            //});
            $$("txtAmount").focus();
        }
        page.events.btnAddPayment_click = function () {
            var amount = 0;
            try {
                var amt = parseInt($$("lblBalance").value()) - parseInt($$("txtAmount").val());
                if (!$$("ddlPaymentType").selectedValue() == "Points")
                    if (parseInt($$("txtAmount").val()) == 0 || $$("txtAmount").val() == null || $$("txtAmount").val() == undefined || isNaN(parseFloat($$("txtAmount").val())) || parseFloat($$("txtAmount").val()) <= 0 || $$("txtAmount").val() == "")
                        throw "Amount should be number and positive";
                //if (($$("ddlPaymentType").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                //    throw "Card no should be mantatory";
                if (($$("ddlPaymentType").selectedValue() == "Cash") && page.controls.txtAmount.val() == 0)
                    throw "Amount should not be zero";
                if (($$("ddlPaymentType").selectedValue() == "Card") && page.controls.txtAmount.val() == 0)
                    throw "Amount should not be zero";
                if (($$("ddlPaymentType").selectedValue() == "Cash") && parseInt(amt) < parseInt(0))
                    throw "Amount should not be exceed total amount";
                if (($$("ddlPaymentType").selectedValue() == "Card") && parseInt(amt) < parseInt(0))
                    throw "Amount should not be exceed total amount";
                //if (($$("ddlPaymentType").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                //    throw "Coupon no should be mantatory";
                //if (($$("ddlPaymentType").selectedValue() == "Points") && ($$("txtPoints").val() == ""))
                //    throw "Coupon no should be mantatory";
                //if ($$("ddlPaymentType").selectedValue() == "Points") {
                //    if (page.controls.txtCustomerName.selectedObject.val() == "" || page.controls.txtCustomerName.selectedObject.val() == null || page.controls.txtCustomerName.selectedObject.val() == undefined)
                //        throw "Supplier should be selected";
                //    if (page.controls.lblAvalablePoints.value() == "" || page.controls.lblAvalablePoints.value() == null || page.controls.lblAvalablePoints.value() == undefined)
                //        throw "Supplier should have the points";
                //    if (parseFloat(page.controls.lblTotal.value()) > parseFloat(page.controls.lblAvalablePoints.value()) / 4)
                //        throw "Supplier not having the enought points"
                //    if (parseFloat(page.controls.txtPoints.value()) > parseFloat(page.controls.lblAvalablePoints.value()))
                //        throw "Points Exceeds"
                //}
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
                $$("txtAmount").val('');

            } catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        },
        page.events.btnMixedPayment_click = function () {
            $$("btnPayPending").disable(true);
            $$("btnPayPending").hide();
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
                page.checkItems(function () {
                    page.saveBill_click("Purchase", "Mixed", function (currentBillNo, bill) {
                        page.controls.pnlPayNow.close();
                        if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                            page.addTray(currentBillNo, bill);
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
            //here
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var poItem = page.controls.grdBill.getRowData(row);
                page.setAttributes(row, poItem);
            });
            //
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
                page.checkItems(function () {
                    var pay_mode = ($$("ddlPayMode").selectedValue() == "Loan") ? "Loan" : "Cash";
                    try {
                        var check;
                        check = ($$("ddlPayMode").selectedValue() == "Loan") && (page.controls.txtVendorName.selectedObject.val() == "" || page.controls.txtVendorName.selectedObject.val() == null || page.controls.txtVendorName.selectedObject.val() == undefined) ? true : false;
                        if (check)
                            throw "Supplier should be selected"
                        page.saveBill_click("Purchase", pay_mode, function (currentBillNo, bill) {
                            if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                page.addTray(currentBillNo, bill);
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
        page.events.btnSave_click = function () {
            if (page.controls.grdBill.allData().length == 0) {
                alert("No item(s) can be purchase");
            } else {
                page.checkItems(function () {
                    page.saveBill_click("PurchaseSave", "PurchaseSave", function (currentBillNo) {
                        page.interface.closeBill();
                        page.interface.launchNewBill();
                    });
                });
            }
        }
        page.events.btnNewItem_click = function () {
            page.taxclassAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlNewTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
            });
            page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlMainProductType").dataBind(data, "mpt_no", "mpt_name", "None");
            });
            $$("ddlMainProductType").selectionChange(function () {
                var filter = "";
                if ($$("ddlMainProductType").selectedValue() != "-1" && $$("ddlMainProductType").selectedValue() != null) {
                    filter = "mptt.mpt_no = " + $$("ddlMainProductType").selectedValue();
                }
                page.productTypeAPI.searchValues("", "", filter, "", function (data) {
                    $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "None");
                });
            });
            page.productTypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "None");
            });
            $$("txtNewItemCode").value("");
            $$("txtNewItemName").selectedObject.val("");
            $$("itemNewUnit").selectedValue("-1");
            $$("txtNewBarcode").value("");
            if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                $$("chkNewInclusive").prop("checked", true);
            }
            else {
                $$("chkNewInclusive").prop("checked", false);
            }
            $$("txtAlterUnit").value("");
            $$("txtAlterUnitFact").value("");
            page.controls.txtNewBarcode.value(page.controls.txtItemSearch.selectedValue());
            page.controls.pnlNewItem.open();
            page.controls.pnlNewItem.title("New Item");
            page.controls.pnlNewItem.rlabel("New Item");
            page.controls.pnlNewItem.width("75%");
            page.controls.pnlNewItem.height(490);

            if (CONTEXT.ENABLE_ALTER_UNIT) {
                $$("pnlAlternativeUnit").show();
                $$("pnlAlternativeUnitFactor").show();
            } else {
                $$("pnlAlternativeUnit").hide();
                $$("pnlAlternativeUnitFactor").hide();
            }
            $$("txtNewItemCode").focus();

            if (CONTEXT.showItemCode) {
                $$("pnltemCode").show();
            }
            else {
                $$("pnltemCode").hide();
            }
            if (CONTEXT.SHOW_BARCODE) {
                $$("pnlBarCode").show();
            } else {
                $$("pnlBarCode").hide();
            }
            if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                $$("pnlMainProductType").show();
                $$("pnlProductType").show();
            }
            else {
                $$("pnlMainProductType").hide();
                $$("pnlProductType").hide();
            }
            $$("txtNewItemName").selectedObject.focus();
            page.controls.txtNewItemName.dataBind({
                getData: function (term, callback) {
                    callback(page.itemList);
                }
            });
            page.controls.txtNewItemName.selectedObject.val(page.controls.txtItemSearch.selectedObject.val());
            page.controls.txtNewItemName.select(function (item) {
                if (item != null) {
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
                }
            });
            page.controls.txtNewItemName.noRecordFound(function () {
                $$("txtNewItemCode").value("");
                $$("itemNewUnit").selectedValue("");
                $$("txtNewBarcode").value("");
                $$("itemNewUnit").selectedValue("");
                $$("ddlNewTax").selectedValue("None");
                $$("chkNewInclusive").prop('checked', false);
            });
            page.controls.txtNewItemName.allowCustomText(function (item) {
                page.controls.txtNewItemName.selectedObject.val(item.val());
            });

            page.controls.grdItemVariation.width("100%");
            page.controls.grdItemVariation.height("300px");
            page.controls.grdItemVariation.setTemplate({
                selection: "Multiple",
                columns: [
                    { 'name': "Name", 'width': "150px", 'dataField': "attr_name" },
                    { 'name': "", 'width': "0px", 'dataField': "attr_no", visible: false },
                    { 'name': "", 'width': "0px", 'dataField': "attr_no_key", visible: false }
                ]
            });
            page.controls.grdItemVariation.selectionChanged = function (row, item1) {
                page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {//attr_no_key in (1,2,3,4,5,6)
                    var list = data;
                    $($$("grdItemVariation").selectedData()).each(function (i, item2) {
                        var index = list.findIndex(function (item) {
                            return item.attr_no === item2.attr_no;
                        })
                        if (index !== -1) list.splice(index, 1);
                    });
                    $$("grdItemStockVariation").dataBind(list);
                });
            }
            $$("grdItemVariation").dataBind([]);

            page.controls.grdItemStockVariation.width("100%");
            page.controls.grdItemStockVariation.height("300px");
            page.controls.grdItemStockVariation.setTemplate({
                selection: "Multiple",
                columns: [
                    { 'name': "Name", 'width': "150px", 'dataField': "attr_name" },
                    { 'name': "", 'width': "0px", 'dataField': "attr_no", visible: false }
                ]
            });
            $$("grdItemStockVariation").dataBind([]);

            $$("grdItemVariation").dataBind(page.attr_list);
            $$("grdItemStockVariation").dataBind(page.attr_list);
        }
        page.events.btnAddVendor_click = function () {
            page.controls.pnlNewVendor.open();
            page.controls.pnlNewVendor.title("New Supplier");
            page.controls.pnlNewVendor.rlabel("Supplier");
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
                $$("txtInvoiceNo").focus();
            });

        }
        page.events.btnVendorMoreDetails_click = function () {
            page.controls.pnlVendorDetails.open();
            page.controls.pnlVendorDetails.title("Supplier Details");
            page.controls.pnlVendorDetails.rlabel("Supplier");
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
        page.events.btnBillMoreDetails_click = function () {
            var height = 330;
            if (CONTEXT.ENABLE_CUST_GST) {
                $$("pnlCGSTTax").show();
                $$("pnlSGSTTax").show();
                $$("pnlIGSTTax").show();
                height = height + 100;
            }
            else {
                $$("pnlCGSTTax").hide();
                $$("pnlSGSTTax").hide();
                $$("pnlIGSTTax").hide();
            }
            if (CONTEXT.ENABLE_ADDITIONAL_TAX) {
                $$("pnlCessTax").show();
                $$("pnlCessRateTax").show();
                height = height + 100;
            }
            else {
                $$("pnlCessTax").hide();
                $$("pnlCessRateTax").hide();
            }
            
            page.controls.pnlBillDetails.open();
            page.controls.pnlBillDetails.title("Bill Details");
            page.controls.pnlBillDetails.rlabel("Bill Details");
            page.controls.pnlBillDetails.width(550);
            page.controls.pnlBillDetails.height(height);
        }
        page.events.btnSaveMoreDetailsPopup_click = function () {
            page.controls.pnlBillDetails.close();
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
        page.events.btnSendSMS_click = function () { }
        page.events.btnTaxOK_click = function () {
            if (page.controls.ddlSalesTax.selectedValue() == -1) {
                page.selectedBill.sales_tax_class = [];
                page.selectedBill.sales_tax_no = -1;
                page.calculate();
            } else {
                var data = page.controls.ddlSalesTax.selectedData();
                page.selectedBill.sales_tax_no = data.sales_tax_no;
                page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + data.sales_tax_no, "", function (data) {
                    page.selectedBill.sales_tax_class = data;
                    page.calculate();
                });
            }
            page.msgPanel.show("Tax added in current session...");
            page.controls.pnlTaxPopup.close();
            page.msgPanel.hide();

        }

        page.view = {

            UIState: function (state) {
                $$("chkBillRoundOff").prop('checked', false);
                if (state == "NewBill") {
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                    $$("btnAddVendor").show();

                    $$("pnlItemSearch").show();
                    //$$("txtProfitPercentage").show();
                    //if (CONTEXT.ENABLE_ALTER_PRICE_1){
                    //    $$("txtPrice1ProfitPercentage").show();
                    //}
                    //else {
                    //    $$("txtPrice1ProfitPercentage").hide();
                    //}
                    //if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                    //    $$("txtPrice2ProfitPercentage").show();
                    //}
                    //else {
                    //    $$("txtPrice2ProfitPercentage").hide();
                    //}

                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.removeAttr('readonly');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                    $$("txtBillDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("txtBillDueDate").disable(false);
                    var today = new Date();
                    var newdate = new Date();
                    newdate.setDate(today.getDate() + parseInt(CONTEXT.DEFAULT_BILL_DUE_DAYS));
                    $$("txtBillDueDate").setDate(newdate);
                    $$("txtInvoiceNo").disable(false);
                    $$("txtBillDiscount").disable(false);
                    $$("txtBillDiscountPercent").disable(false);
                    $$("txtBillGstAmount").disable(false);
                    $$("txtCreditAmount").disable(false);

                    page.selectedBill.state_text = "NewBill";
                    page.selectedBill.discounts = [];
                }
                if (state == "Saved") {
                    $$("btnSave").show();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();

                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtVendorName").selectedObject.removeAttr('readonly');


                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                    $$("txtBillDueDate").disable(false);
                    $$("txtInvoiceNo").disable(false);
                    $$("txtBillDiscount").disable(false);
                    $$("txtBillDiscountPercent").disable(false);
                    $$("txtBillGstAmount").disable(false);
                    $$("txtCreditAmount").disable(false);

                    page.selectedBill.state_text = "Saved";

                    //$$("txtProfitPercentage").show();
                    //if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                    //    $$("txtPrice1ProfitPercentage").show();
                    //}
                    //else {
                    //    $$("txtPrice1ProfitPercentage").hide();
                    //}
                    //if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                    //    $$("txtPrice2ProfitPercentage").show();
                    //}
                    //else {
                    //    $$("txtPrice2ProfitPercentage").hide();
                    //}
                }
                if (state == "Purchase") {
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();
                    page.state = "Purchase";
                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();    //TODO : show if return is there
                    $$("txtBillDate").disable(true);
                    $$("txtBillDueDate").disable(true);
                    $$("txtInvoiceNo").disable(true);
                    $$("txtBillDiscount").disable(true);
                    $$("txtBillDiscountPercent").disable(true);
                    $$("txtBillGstAmount").disable(true);
                    $$("txtCreditAmount").disable(true);

                    page.selectedBill.state_text = "Purchase";

                    //$$("txtProfitPercentage").hide();
                    //$$("txtPrice1ProfitPercentage").hide();
                    //$$("txtPrice2ProfitPercentage").hide();
                }

                if (state == "Return") {
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(true);
                    $$("txtBillDueDate").disable(true);
                    $$("txtInvoiceNo").disable(true);
                    $$("txtBillDiscount").disable(true);
                    $$("txtBillDiscountPercent").disable(true);
                    $$("txtBillGstAmount").disable(true);
                    $$("txtCreditAmount").disable(true);

                    page.selectedBill.state_text = "Return";

                    //$$("txtProfitPercentage").hide();
                    //$$("txtPrice1ProfitPercentage").hide();
                    //$$("txtPrice2ProfitPercentage").hide();
                }
                if (state == "NewReturn") {
                    $$("btnSave").hide();
                    $$("btnAddVendor").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtVendorName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").hide();
                    $$("grdReturnItemSelection").show();
                    $$("grdBillReturn").hide();
                    $$("txtBillDate").disable(false);
                    $$("txtBillDueDate").disable(false);
                    $$("txtInvoiceNo").disable(true);
                    $$("txtBillDiscount").disable(true);
                    $$("txtBillDiscountPercent").disable(true);
                    $$("txtBillGstAmount").disable(true);
                    $$("txtCreditAmount").disable(true);

                    //$$("txtProfitPercentage").hide();
                    //$$("txtPrice1ProfitPercentage").hide();
                    //$$("txtPrice2ProfitPercentage").hide();
                }

                if (state == "New") {
                    page.controls.grdBillReturn.display("none");

                    page.view.selectedBill([]);

                    page.controls.grdBillReturn.width("100%");
                    page.controls.grdBillReturn.height("100px");
                    page.controls.grdBillReturn.setTemplate({
                        selection: false,
                        columns: [
                            //{ 'name': "Bill No", 'width': "70px", 'dataField': "bill_no" },
                            { 'name': "Bill No", 'width': "70px", 'dataField': "bill_id" },
                            { 'name': "Bill Date", 'width': "120px", 'dataField': "bill_date" },
                            { 'name': "Cust Name", 'width': "240px", 'dataField': "cust_name" },
                            { 'name': "Total Amount", 'width': "145px", 'dataField': "total" },
                            { 'name': "State", 'width': "85px", 'dataField': "state_text" },

                        ]
                    });
                    page.controls.grdBillReturn.dataBind([]);

                    page.selectedBill.discounts = [];
                }
            },
            selectedPayment: function (data) {
                page.controls.grdAllPayment.width("100%");
                page.controls.grdAllPayment.height("150px");
                page.controls.grdAllPayment.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Pay Type", 'rlabel': 'Pay Type', 'width': "150px", 'dataField': "pay_type" },
                        { 'name': "Amount", 'rlabel': 'Amount', 'width': "150px", 'dataField': "amount" },
                        { 'name': "Card Type", 'rlabel': 'Card Type', 'width': "150px", 'dataField': "card_type", visible: false },
                        { 'name': "Card No", 'rlabel': 'Card No', 'width': "150px", 'dataField': "card_no",visible:false },
                        { 'name': "Coupon No", 'rlabel': 'Coupon No', 'width': "85px", 'dataField': "coupon_no", visible: false && CONTEXT.ENABLE_COUPON_MODULE == "true", },
                        { 'name': "Points", 'rlabel': 'Points', 'width': "85px", 'dataField': "points", visible: false && CONTEXT.ENABLE_REWARD_MODULE == true, },
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
            },
            selectedBill: function (data) {
                var grid_width = 0;
                if (!CONTEXT.POPShowMore) {
                    grid_width = 2300;
                    if (CONTEXT.SHOW_FREE) {
                        grid_width = grid_width + 100;
                    }
                    if (CONTEXT.ENABLE_TAX_MODULE) {
                        grid_width = grid_width + 160;
                    }
                    if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                        grid_width = grid_width + 390;
                    }
                    if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                        grid_width = grid_width + 390;
                    }
                    if (CONTEXT.ENABLE_PRICE_LIMIT) {
                        grid_width = grid_width + 300;
                    }
                }
                else {
                    grid_width = 2600;
                    if (CONTEXT.ENABLE_MODULE_TRAY) {
                        grid_width = grid_width + 80;
                    }
                    if (CONTEXT.SHOW_BARCODE) {
                        grid_width = grid_width + 150;
                    }
                    if (CONTEXT.ENABLE_RACK) {
                        grid_width = grid_width + 100;
                    }
                    if (CONTEXT.SHOW_FREE) {
                        grid_width = grid_width + 100;
                    }
                    if (CONTEXT.SHOW_POP_GROSS_AMOUNT) {
                        grid_width = grid_width + 130;
                    }
                    if (CONTEXT.ENABLE_CUST_GST) {
                        grid_width = grid_width + 420;
                    }
                    if (CONTEXT.ENABLE_TAX_MODULE) {
                        grid_width = grid_width + 160;
                    }
                    if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                        grid_width = grid_width + 390;
                    }
                    if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                        grid_width = grid_width + 390;
                    }
                    if (CONTEXT.ENABLE_PRICE_LIMIT) {
                        grid_width = grid_width + 300;
                    }
                    if (CONTEXT.ENABLE_ADDITIONAL_TAX) {
                        grid_width = grid_width + 400;
                    }
                }
                page.controls.grdBill.width(grid_width+"px");
                page.controls.grdBill.height("200px");
                page.controls.grdBill.setTemplate({
                    selection: "Single", sort: false,
                    columns: [
                           { 'name': "  ", 'width': "25px", 'dataField': "", editable: false, itemTemplate: "<input id='Cancel' type='button' class='grid-button' value='' action='Delete' style='background-image: url(https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-128.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 23px;    border: none;    cursor: pointer;' />" },
                           { 'name': "S No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no" },
                           { 'name': "Item No", 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_code" },
                           { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "220px", 'dataField': "item_name", visible: !CONTEXT.ENABLE_PURCHASE_SECONDARY_LANGUAGE },
                           { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "220px", 'dataField': "item_name_tr", visible: CONTEXT.ENABLE_PURCHASE_SECONDARY_LANGUAGE },
                           { 'name': "Attributes", 'rlabel': 'Attributes', 'width': "100px", 'dataField': "attributes", itemTemplate: "<div  id='Attributes'></div>" },
                           { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "temp_qty", editable: true },
                           { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "100px", 'dataField': "temp_free_qty", editable: true, visible: CONTEXT.SHOW_FREE },
                           { 'name': "", 'width': "30px", itemTemplate: "<div  id='stockDetail'></div>" },
                           { 'name': "Unit", 'rlabel': 'Unit', 'width': "90px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                           { 'name': "Cost", 'rlabel': 'Cost', 'width': "100px", 'dataField': "temp_cost", editable: true },
                           { 'name': "Disc %", 'rlabel': 'Disc %', 'width': "100px", 'dataField': "disc_per", editable: true, visible: CONTEXT.POPShowMore },
                           { 'name': "Disc Value", 'rlabel': 'Disc Value', 'width': "100px", 'dataField': "disc_val", editable: true, visible: CONTEXT.POPShowMore },
                           { 'name': "GST %", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax_per", editable: false, visible: CONTEXT.ENABLE_TAX_MODULE },
                           { 'name': "GST Amt", 'rlabel': 'GST Amt', 'width': "60px", 'dataField': "tax_per_amt", visible: CONTEXT.ENABLE_TAX_MODULE },
                           { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "110px", 'dataField': "net_rate", itemTemplate: "<div  id='pnlNetRate' style=''></div>" },
                           { 'name': "Prev Selling", 'rlabel': 'Prev Selling', 'width': "120px", 'dataField': "pre_selling_price", editable: false, visible: true },
                           { 'name': "Profit %", 'rlabel': 'Profit %', 'width': "100px", 'dataField': "profit", editable: true, visible: (page.selectedBill.state_text == "NewBill" || page.selectedBill.state_text == "Saved"), headerTemplate: "<div><span style='width:100px;'>" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Profit %"] + "</span><input type='text' id='profitPrice' style='width:100px;margin-top:3px;' placeholder='" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Profit %"] + "'></div>" },
                           { 'name': "Selling Rate", 'rlabel': 'Selling Rate', 'width': "110px", 'dataField': "selling_price", editable: true, visible: (page.selectedBill.state_text == "NewBill" || page.selectedBill.state_text == "Saved") },
                           { 'name': "Pre Rate B", 'rlabel': 'Pre Rate B', 'width': "150px", 'dataField': "pre_alter_price_1", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                           { 'name': "Price1%", 'rlabel': 'Price1%', 'width': "120px", 'dataField': "price1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1 && (page.selectedBill.state_text == "NewBill" || page.selectedBill.state_text == "Saved"), headerTemplate: "<div><span style='width:100px;'>" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price1%"] + "</span><input type='text' id='profitPrice1' style='width:120px;margin-top:3px;' placeholder='" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price1%"] + "'></div>" },
                           { 'name': "New Rate B", 'rlabel': 'New Rate B', 'width': "120px", 'dataField': "alter_price_1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1 && (page.selectedBill.state_text == "NewBill" || page.selectedBill.state_text == "Saved") },
                           { 'name': "Pre Rate C", 'rlabel': 'Pre Rate C', 'width': "150px", 'dataField': "pre_alter_price_2", editable: false, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                           { 'name': "Price2%", 'rlabel': 'Price2%', 'width': "120px", 'dataField': "price2", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_2 && (page.selectedBill.state_text == "NewBill" || page.selectedBill.state_text == "Saved"), headerTemplate: "<div><span style='width:100px;'>" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price2%"] + "</span><input type='text' id='profitPrice2' style='width:120px;margin-top:3px;' placeholder='" + WEBUI.LANG[CONTEXT.CurrentLanguage]["Price2%"] + "'></div>" },
                           { 'name': "New Rate C", 'rlabel': 'New Rate C', 'width': "120px", 'dataField': "alter_price_2", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                           { 'name': "Pre Price Limit", 'rlabel': 'Pre Price Limit', 'width': "150px", 'dataField': "pre_price_limit", editable: false, visible: CONTEXT.ENABLE_PRICE_LIMIT },
                           { 'name': "New Price Limit", 'rlabel': 'New Price Limit', 'width': "150px", 'dataField': "price_limit", editable: true, visible: CONTEXT.ENABLE_PRICE_LIMIT },
                           { 'name': "Total", 'rlabel': 'Amount', 'width': "90px", 'dataField': "total_price", visible: true },
                           { 'name': "Total", 'rlabel': 'Amount', 'width': "90px", 'dataField': "total_attr_price", visible: false },
                           { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "buying_cost" },

                           { 'name': "Tray", 'rlabel': 'Tray', 'width': "80px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY && CONTEXT.POPShowMore },
                           { 'name': "Bar Code", 'rlabel': 'Barcode', 'width': "100px", 'dataField': "barcode", visible: CONTEXT.SHOW_BARCODE && CONTEXT.POPShowMore },
                           { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "80px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK && CONTEXT.POPShowMore },
                           { 'name': "In Stock", 'rlabel': 'In Stock', 'width': "90px", 'dataField': "qty_stock", visible: CONTEXT.POPShowMore },
                           { 'name': "Gross Amt", 'rlabel': 'Gross Amt', 'width': "100px", 'dataField': "gross_amt", editable: false, visible: CONTEXT.SHOW_POP_GROSS_AMOUNT },
                           { 'name': "CGST", 'width': "80px", 'dataField': "cgst_per", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_CUST_GST },
                           { 'name': "CGST Amt", 'rlabel': 'CGST Amt', 'width': "60px", 'dataField': "cgst_val", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_CUST_GST },
                           { 'name': "SGST", 'width': "80px", 'dataField': "sgst_per", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_CUST_GST },
                           { 'name': "SGST Amt", 'rlabel': 'SGST Amt', 'width': "60px", 'dataField': "sgst_val", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_CUST_GST },
                           { 'name': "IGST", 'width': "80px", 'dataField': "igst_per", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_CUST_GST },
                           { 'name': "IGST Amt", 'rlabel': 'IGST Amt', 'width': "60px", 'dataField': "igst_val", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_CUST_GST },
                           { 'name': "Cess Per", 'width': "80px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POPShowMore },
                           { 'name': "Cess Amt", 'rlabel': 'Cess Amt', 'width': "60px", 'dataField': "cess_per_val", visible: CONTEXT.POPShowMore && CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POPShowMore },
                           { 'name': "Cess Rate", 'rlabel': 'Cess Rate', 'width': "130px", 'dataField': "cess_qty_amount", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POPShowMore },
                           { 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "130px", 'dataField': "additional_tax", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POPShowMore },
                           


                           { 'name': "", 'width': "0px", 'dataField': "cost", editable: true, visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "free_qty", visible: false },
                           { 'name': "Item Disc", 'rlabel': 'Item Disc', 'width': "100px", 'dataField': "item_disc", editable: false, visible: false },
                           { 'name': "Bill Disc", 'rlabel': 'Bill Disc', 'width': "100px", 'dataField': "bill_disc", editable: false, visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "qty", editable: true, visible: false },
                           { 'name': "", 'rlabel': '', 'width': "0px", 'dataField': "item_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "variation_data", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "free_var_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "tax_class_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "tax_inclusive", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_supp_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_buying_cost", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_mrp", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_batch_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_expiry_date", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_man_date", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "stock_no", visible: false },
			               { 'name': "", 'width': "0px", 'dataField': "cess_qty", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "tray_mode", visible: false },
                           { 'name': "", 'width': "", 'dataField': "free_variation_id", editable: false, visible: false },
                    ]
                });
                page.controls.grdBill.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        page.controls.grdBill.deleteRow(rowId);
                        page.calculate();
                    }
                    if (action == "New") {
                        if (page.state != "Purchase")
                            page.events.btnNewVariation_click();
                    }
                    if (action == "NewStock") {
                        var nrow = row, mrow = row;
                        while (rowData.item_no == $(nrow).find("[datafield=item_no]").find("div").html()) {
                            if ($(nrow).next().length == 0) {
                                mrow = nrow;
                                break;
                            }
                            else {
                                mrow = nrow;
                                nrow = $(nrow).next();
                            }
                                
                        }
                        page.selectGridBill(rowData, mrow);
                        $(mrow).next().focus();
                    }
                }
                page.controls.grdBill.beforeRowBound = function (row, item) {
                    item.buying_cost = parseFloat(parseFloat(item.total_price) / parseFloat(item.qty)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    item.chk_new_var = 0;
                }
                page.controls.grdBill.rowBound = function (row, item) {
                    //Show Or Hide The Attributes Field
                    var attrTemplate = [];
                    if (typeof item.var_stock_attr_key != "undefined" && item.var_stock_attr_key != "" && item.var_stock_attr_key != null)
                    {
                        if (item.var_stock_attr_key.split(",").length - 1 >= 0) {
                            if (item.attr_type1 == "exp_date" || item.attr_type1 == "man_date") {
                                attrTemplate.push("<span style='padding-right: 5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "</span><input type='date' dataField='attr_value1' style='width:130px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' >");
                            }
                            else {
                                attrTemplate.push("<span style='padding-right: 5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "</span><input type='text' dataField='attr_value1' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[0]) + "' >");
                            }
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 1) {
                            if (item.attr_type2 == "man_date") {
                                attrTemplate.push("<span style='padding-right: 5px;padding-left:5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "</span><input type='date' dataField='attr_value2' style='width:130px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' >");
                            }
                            else {
                                attrTemplate.push("<span style='padding-right: 5px;padding-left:5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "</span><input type='text' dataField='attr_value2' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[1]) + "' >");
                            }
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 2) {
                            attrTemplate.push("<span style='padding-right: 5px;padding-left:5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[2]) + "</span><input type='text' dataField='attr_value3' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[2]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[2]) + "' >");
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 3) {
                            attrTemplate.push("<span style='padding-right: 5px;padding-left:5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[3]) + "</span><input type='text' dataField='attr_value4' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[3]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[3]) + "' >");
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 4) {
                            attrTemplate.push("<span style='padding-right: 5px;padding-left:5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[4]) + "</span><input type='text' dataField='attr_value5' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[4]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[4]) + "' >");
                        }
                        if (item.var_stock_attr_key.split(",").length - 1 >= 5) {
                            attrTemplate.push("<span style='padding-right: 5px;padding-left:5px;'>" + getAttributeName(item.var_stock_attr_key.split(",")[5]) + "</span><input type='text' dataField='attr_value6' style='width:80px;' placeholder='" + getAttributeName(item.var_stock_attr_key.split(",")[5]) + "' title='" + getAttributeName(item.var_stock_attr_key.split(",")[5]) + "' >");
                        }
                    }
                    else {
                        item.var_stock_attr_key = "";
                        row.find("input[dataField=var_stock_attr_key]").val("");
                        item.var_stock_attribute = "";
                        row.find("input[dataField=var_stock_attribute]").val("");
                        item.var_attribute = "";
                        row.find("input[dataField=var_attribute]").val("");
                        item.var_attr_key = "";
                        row.find("input[dataField=var_attr_key]").val("");
                    }
                    $(row).find("[id=Attributes]").html(attrTemplate.join(""));
                    var maxWidth = 0;
                    $(row).find("div[datafield=attributes]").width("auto");
                    var curWidth = $(row).find("div[datafield=attributes]").width();
                    if (curWidth > maxWidth)
                        maxWidth = curWidth;
                    if (maxWidth < 100)
                        maxWidth = 100;
                    $($$("grdBill").selectedObject).find("div[datafield=attributes]").width(maxWidth);


                    var htmlTemplate = [];
                    if (row.prev().find("[datafield=item_no]").find("div").html() == item.item_no) {
                        //row.find("[datafield=temp_cost]").css("visibility", "hidden");
                        //row.find("[datafield=disc_per]").css("visibility", "hidden");
                        //row.find("[datafield=disc_val]").css("visibility", "hidden");
                        //row.find("[datafield=tax_per]").css("visibility", "hidden");
                        //row.find("[datafield=net_rate]").css("visibility", "hidden");
                        row.find("[datafield=temp_mrp]").css("visibility", "hidden");
                        row.find("[datafield=mrp]").css("visibility", "hidden");
                        //row.find("[datafield=free_selling_price]").css("visibility", "hidden");
                        //row.find("[datafield=total_price]").css("visibility", "hidden");
                        //row.find("[datafield=total_attr_price]").css("visibility", "hidden");
                        //row.find("[datafield=buying_cost]").css("visibility", "hidden");

                        row.find("[datafield=item_name]").css("visibility", "hidden");
                        row.find("[datafield=barcode]").css("visibility", "hidden");
                        row.find("[datafield=item_code]").css("visibility", "hidden");
                    }
                    else {
                        htmlTemplate.push("<input type='button' title='New Stock'  class='grid-button' value='' action='NewStock' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/plus.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />");
                    }
                    $(row).find("[id=stockDetail]").html(htmlTemplate.join(""));
                    if (page.selectedBill.state_text == "NewBill" || page.selectedBill.state_text == "Saved") {
                        $(row).find("[id=stockDetail]").css("visibility", "true");
                        $(row).find("[id=Cancel]").css("visibility", "true");
                    }
                    else {
                        $(row).find("[id=stockDetail]").css("visibility", "hidden");
                        $(row).find("[id=Cancel]").css("visibility", "hidden");
                        $(row).find("input[dataField=attr_value1]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value2]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value3]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value4]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value5]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value6]").attr("disabled", true);
                    }

                    $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                        $(row).find("[datafield=sl_no]").find("div").html(i + 1);
                    });
                    
                    $(row).find("input[dataField=attr_value1]").change(function () {
                        item.attr_value1 = $(this).val();
                    });
                    $(row).find("input[dataField=attr_value2]").change(function () {
                        item.attr_value2 = $(this).val();
                    });
                    $(row).find("input[dataField=attr_value3]").change(function () {
                        item.attr_value3 = $(this).val();
                    });
                    $(row).find("input[dataField=attr_value4]").change(function () {
                        item.attr_value4 = $(this).val();
                    });
                    $(row).find("input[dataField=attr_value5]").change(function () {
                        item.attr_value5 = $(this).val();
                    });
                    $(row).find("input[dataField=attr_value6]").change(function () {
                        item.attr_value6 = $(this).val();
                    });
                    $(row).find("input[dataField=attr_value1]").val(item.attr_value1).change();
                    $(row).find("input[dataField=attr_value2]").val(item.attr_value2).change();
                    $(row).find("input[dataField=attr_value3]").val(item.attr_value3).change();
                    $(row).find("input[dataField=attr_value4]").val(item.attr_value4).change();
                    $(row).find("input[dataField=attr_value5]").val(item.attr_value5).change();
                    $(row).find("input[dataField=attr_value6]").val(item.attr_value6).change();
                    if (item.attr_type1 == "cost" || item.attr_type1 == "vendor_no" || item.attr_type1 == "invoice_no")
                    {
                        $(row).find("input[dataField=attr_value1]").css("display", "none");
                        $(row).find("input[dataField=attr_value1]").prev().hide();
                    }
                    if (item.attr_type2 == "cost" || item.attr_type2 == "vendor_no" || item.attr_type2 == "invoice_no") {
                        $(row).find("input[dataField=attr_value2]").css("display", "none");
                        $(row).find("input[dataField=attr_value2]").prev().hide();
                    }
                    if (item.attr_type3 == "cost" || item.attr_type3 == "vendor_no" || item.attr_type3 == "invoice_no") {
                        $(row).find("input[dataField=attr_value3]").css("display", "none");
                        $(row).find("input[dataField=attr_value3]").prev().hide();
                    }
                    if (item.attr_type4 == "cost" || item.attr_type4 == "vendor_no" || item.attr_type4 == "invoice_no") {
                        $(row).find("input[dataField=attr_value4]").css("display", "none");
                        $(row).find("input[dataField=attr_value4]").prev().hide();
                    }
                    if (item.attr_type5 == "cost" || item.attr_type5 == "vendor_no" || item.attr_type5 == "invoice_no") {
                        $(row).find("input[dataField=attr_value5]").css("display", "none");
                        $(row).find("input[dataField=attr_value5]").prev().hide();
                    }
                    if (item.attr_type6 == "cost" || item.attr_type6 == "vendor_no" || item.attr_type6 == "invoice_no") {
                        $(row).find("input[dataField=attr_value6]").css("display", "none");
                        $(row).find("input[dataField=attr_value6]").prev().hide();
                    }
                    
                    var htmlTemplate = [];
                    if (CONTEXT.ENABLE_ALTER_UNIT) {
                        if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                            htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                        }
                        else {
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

                            item.cost = item.temp_cost;
                            $(row).find("[datafield=cost]").find("div").html(parseFloat(item.temp_cost));
                            //item.mrp = item.temp_mrp;
                            //$(row).find("[datafield=mrp]").find("div").html(parseFloat(item.temp_mrp));

                            if (item.tray_mode == "SKU") {
                                item.tray_received = item.qty;
                                row.find("input[datafield=tray_received]").val(item.tray_received);
                            }
                        }
                        else {
                            item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                            item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                            $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact));
                            item.unit_identity = 1;
                            $(row).find("[datafield=unit_identity]").find("div").html(1);

                            item.cost = item.temp_cost;
                            $(row).find("[datafield=cost]").find("div").html(parseFloat(item.temp_cost));
                            //item.cost = parseFloat(item.temp_cost) / parseFloat(item.alter_unit_fact);
                            //$(row).find("[datafield=cost]").find("div").html(parseFloat(item.cost));
                            //item.mrp = parseFloat(item.temp_mrp) / parseFloat(item.alter_unit_fact);
                            //$(row).find("[datafield=mrp]").find("div").html(parseFloat(item.mrp));

                            if (item.tray_mode == "SKU") {
                                item.tray_received = item.qty;
                                row.find("input[datafield=tray_received]").val(item.tray_received);
                            }
                        }
                        page.calculate();
                    });
                    if (item.unit_identity == "1") {
                        item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));
                        item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        $(row).find("[id=itemUnit]").val(1);
                        item.temp_cost = parseFloat(item.cost) * parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=temp_cost]").find("div").html(parseFloat(item.temp_cost));
                        item.mrp = isNaN(item.mrp) ? 0 : item.mrp;
                        item.temp_mrp = parseFloat(item.mrp) * parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=temp_mrp]").find("div").html(parseFloat(item.temp_mrp));
                    }
                    else {
                        item.cost = (typeof item.cost == "undefined" || item.cost == "") ? 0 : item.cost;
                        item.temp_cost = parseFloat(item.cost);
                        $(row).find("[datafield=temp_cost]").find("div").html(parseFloat(item.temp_cost));
                        item.mrp = (typeof item.mrp == "undefined" || item.mrp == "") ? 0 : item.mrp;
                        item.mrp = isNaN(item.mrp) ? 0 : item.mrp;
                        item.temp_mrp = parseFloat(item.mrp);
                        $(row).find("[datafield=temp_mrp]").find("div").html(parseFloat(item.temp_mrp));
                    }

                    row.find("div[datafield=btn_variation_name]").css("visibility", "false");

                    row.on("change", "input[datafield=temp_qty]", function () {
                        try {
                            
                            if ($(row).find("[id=itemUnit]").val() == "0") {
                                item.qty = parseFloat(item.temp_qty);
                            } else {
                                item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                            }
                            if (item.tray_mode == "SKU") {
                                item.tray_received = item.qty;
                                row.find("input[datafield=tray_received]").val(item.tray_received);
                            }
                            page.calculate();
                            //page.check_variation(row, item);//profit
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
                                    var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                    item.selling_price = selling_price;
                                    row.find("input[datafield=selling_price]").val(selling_price);
                                    if (CONTEXT.PRICE_EQUAL_FREE) {
                                        item.free_selling_price = selling_price;
                                        row.find("input[datafield=free_selling_price]").val(selling_price);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            alert(e);
                        }
                    });
                    row.on("change", "input[datafield=temp_free_qty]", function () {
                        if ($(row).find("[id=itemUnit]").val() == "0") {
                            item.free_qty = parseFloat(item.temp_free_qty);
                        } else {
                            item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                        }
                        page.calculate();
                        //page.check_variation(row, item);
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
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            page.calculate();
                            page.check_variation(row, item);
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                if (CONTEXT.POPShowMore){
                                    if(CONTEXT.SHOW_FREE){
                                        row.find("input[datafield=temp_free_qty]").focus().select();
                                    }
                                    else
                                        row.find("input[datafield=temp_cost]").focus().select();
                                }
                                else {
                                    if (row.prev().find("[datafield=item_no]").find("div").html() == item.item_no) {
                                        row.find("input[datafield=profit]").focus().select();
                                    }
                                    else {
                                        row.find("input[datafield=temp_cost]").focus().select();
                                    }
                                }
                            }
                            else {
                                if (CONTEXT.POPShowMore)
                                    row.find("input[datafield=temp_free_qty]").focus().select();
                                else {
                                    if (row.prev().find("[datafield=item_no]").find("div").html() == item.item_no) {
                                        row.find("input[datafield=profit]").focus().select();
                                    }
                                    else {
                                        row.find("input[datafield=temp_cost]").focus().select();
                                    }
                                }
                            }
                            try{
                                if (item.qty_type == "Integer" && CheckDecimal(item.temp_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.temp_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=temp_qty]").focus().select();
                            }
                            //page.calculate();
                        }
                    });
                    row.on("keydown", "input[datafield=temp_free_qty]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                row.find("input[datafield=temp_cost]").focus().select();
                            } else {
                                row.find("input[datafield=temp_cost]").focus().select();
                            }
                            try {
                                if (item.qty_type == "Integer" && CheckDecimal(item.temp_free_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                                if (item.qty_type == "Decimal" && !CheckDecimal(item.temp_free_qty)) {
                                    throw "Incorrect Quantity Type";
                                }
                            }
                            catch (e) {
                                alert(e);
                                row.find("input[datafield=temp_free_qty]").focus().select();
                            }
                        }
                    });
                    row.on("change", "input[datafield=cost]", function () {
                        if ($(row).next().find("input[datafield=item_no]").html() == item.item_no)
                            $(row).next().find("input[datafield=cost]").val($(this).val()).change();
                        page.calculate();
                        page.check_variation(row, item);
                        //profit
                        if (item.profit != undefined && item.profit != null && item.profit != "") {
                            if (item.profit.startsWith("0")) {
                                item.profit = item.profit.replace(/#/g, 0);
                                var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                                var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                item.selling_price = (selling_price);
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }

                            } else {
                                //var selling_price = Math.round(parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5));
                                var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }
                            }
                        }
                        row.find("input[datafield=cost]").val(item.cost);
                    });
                    row.on("change", "input[datafield=temp_cost]", function () {
                        if (item.unit_identity == "1") {
                            item.cost = parseFloat(item.temp_cost) / parseFloat(item.alter_unit_fact);
                        }
                        else {
                            item.cost = parseFloat(item.temp_cost);
                        }
                        if (row.next().find("[datafield=item_no]").find("div").html() == item.item_no) {
                            $(row).next().find("input[datafield=cost]").val($(this).val()).change();
                            //$(row).next().find("input[datafield=temp_cost]").val($(this).val()).change();
                        }
                        page.calculate();
                        page.check_variation(row, item);
                        if (item.profit != undefined && item.profit != null && item.profit != "") {
                            if (item.profit.startsWith("0")) {
                                item.profit = item.profit.replace(/#/g, 0);
                                var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                                //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                                var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }

                            } else {
                                //var selling_price = Math.round(parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                                var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }
                            }
                        }
                        row.find("input[datafield=cost]").val(item.cost);
                        page.setAttributes(row, item);
                    });
                    row.on("keydown", "input[datafield=temp_cost]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                if (CONTEXT.POPShowMore)
                                    row.find("input[datafield=disc_per]").focus().select();
                                else
                                    row.find("input[datafield=profit]").focus().select();
                            } else {
                                if (CONTEXT.POPShowMore)
                                    row.find("input[datafield=disc_per]").focus().select();
                                else
                                    row.find("input[datafield=profit]").focus().select();
                            }
                        }
                    });
                    row.on("change", "input[datafield=disc_per]", function () {
                        if (row.next().find("[datafield=item_no]").find("div").html() == item.item_no) {
                            row.find("input[datafield=disc_per]").val(item.disc_per);
                            row.find("div[datafield=item_disc]").html(item.disc_per);
                            item.item_disc = item.disc_per;
                            page.calculate();
                            //$(row).next().find("input[datafield=disc_per]").val($(this).val()).change();
                        } else {
                            row.find("input[datafield=disc_per]").val(item.disc_per);
                            row.find("div[datafield=item_disc]").html(item.disc_per);
                            item.item_disc = item.disc_per;
                            page.calculate();
                        }
                        /*
                        row.find("input[datafield=disc_per]").val(item.disc_per);
                        row.find("div[datafield=item_disc]").html(item.disc_per);
                        item.item_disc = item.disc_per;
                        */
                        
                    });
                    row.on("keydown", "input[datafield=disc_per]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                row.find("input[datafield=disc_val]").focus().select();
                            } else {
                                row.find("input[datafield=disc_val]").focus().select();
                            }
                        }
                    });
                    row.on("change", "input[datafield=disc_val]", function () {
                        if (row.next().find("[datafield=item_no]").find("div").html() == item.item_no) {
                            //$(row).next().find("input[datafield=disc_val]").val($(this).val()).change();
                        }
                        page.calculate();
                        //page.check_variation(row, item);
                        //if (item.profit != undefined && item.profit != null && item.profit != "") {
                        //    if (item.profit.startsWith("0")) {
                        //        item.profit = item.profit.replace(/#/g, 0);
                        //        var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                        //        var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                        //        item.selling_price = selling_price;
                        //        row.find("input[datafield=selling_price]").val(selling_price);
                        //        if (CONTEXT.PRICE_EQUAL_FREE) {
                        //            item.free_selling_price = selling_price;
                        //            row.find("input[datafield=free_selling_price]").val(selling_price);
                        //        }

                        //    } else {
                        //        var selling_price = Math.round(parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5));
                        //        item.selling_price = selling_price;
                        //        row.find("input[datafield=selling_price]").val(selling_price);
                        //        if (CONTEXT.PRICE_EQUAL_FREE) {
                        //            item.free_selling_price = selling_price;
                        //            row.find("input[datafield=free_selling_price]").val(selling_price);
                        //        }
                        //    }
                        //}
                        row.find("input[datafield=disc_val]").val(item.disc_val);
                    });
                    row.on("keydown", "input[datafield=disc_val]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                row.find("input[datafield=profit]").focus().select();
                            } else {
                                row.find("input[datafield=profit]").focus().select();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=profit]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                row.find("input[datafield=selling_price]").focus().select();
                            } else {
                                row.find("input[datafield=selling_price]").focus().select();
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
                    row.on("keydown", "input[datafield=additional_tax]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (nextRow.length == 0) {
                                if (CONTEXT.POPShowMore)
                                    row.find("input[datafield=temp_mrp]").focus().select();
                                else
                                    row.find("input[datafield=temp_mrp]").focus().select();
                            } else {
                                if (CONTEXT.POPShowMore)
                                    row.find("input[datafield=temp_mrp]").focus().select();
                                else
                                    row.find("input[datafield=temp_mrp]").focus().select();
                            }
                            page.calculate();
                        }
                    });
                    row.on("change", "input[datafield=mrp]", function () {
                        item.cost = parseFloat(item.temp_cost) / parseFloat(item.alter_unit_fact);
                        //item.temp_mrp = (item.temp_mrp == "" || item.temp_mrp == null || typeof item.temp_mrp == "undefined") ? 0 : item.temp_mrp
                        item.mrp = parseFloat(item.temp_mrp) / parseFloat(item.alter_unit_fact);
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
                                var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                item.selling_price = selling_price;
                                row.find("input[datafield=selling_price]").val(selling_price);
                                if (CONTEXT.PRICE_EQUAL_FREE) {
                                    item.free_selling_price = selling_price;
                                    row.find("input[datafield=free_selling_price]").val(selling_price);
                                }
                            }
                        }
                    });
                    row.on("change", "input[datafield=temp_mrp]", function () {
                        if (item.unit_identity == "1") {
                            item.temp_mrp = (item.temp_mrp == "" || item.temp_mrp == null || typeof item.temp_mrp == "undefined") ? 0 : item.temp_mrp
                            item.mrp = parseFloat(item.temp_mrp) / parseFloat(item.alter_unit_fact);
                        }
                        else {
                            item.temp_mrp = (item.temp_mrp == "" || item.temp_mrp == null || typeof item.temp_mrp == "undefined") ? 0 : item.temp_mrp
                            item.mrp = parseFloat(item.temp_mrp);
                        }
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
                                var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
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
                                    item.temp_cost = ui.item.cost;
                                    item.temp_mrp = ui.item.mrp;
                                    item.variation_name = ui.item.label;
                                    item.disc_per = "";
                                    item.disc_val = "";
                                    row.find("input[datafield=variation_name]").val(ui.item.label);
                                    //row.find("input[datafield=cost]").val(ui.item.cost);
                                    row.find("input[datafield=var_cost]").val(ui.item.cost);
                                    row.find("input[datafield=temp_cost]").val(ui.item.cost);
                                    $(row).find("input[datafield=temp_mrp]").val(ui.item.mrp);
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
                                           parseFloat(items.cost).toFixed(CONTEXT.COUNT_AFTER_POINTS) == parseFloat(0).toFixed(CONTEXT.COUNT_AFTER_POINTS)) {
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
                                    row.find("input[datafield=temp_cost]").val(cost);
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
                            });
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
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                row.find("input[datafield=price1]").focus().select();
                            }
                            else if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                row.find("input[datafield=alter_price_2]").focus().select();
                            }
                            else if (CONTEXT.ENABLE_PRICE_LIMIT) {
                                row.find("input[datafield=price_limit]").focus().select();
                            }
                            else {
                                page.controls.txtItemSearch.selectedObject.focus();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=price1]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                row.find("input[datafield=alter_price_1]").focus().select();
                            }
                            else if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                row.find("input[datafield=alter_price_2]").focus().select();
                            }
                            else if (CONTEXT.ENABLE_PRICE_LIMIT) {
                                row.find("input[datafield=price_limit]").focus().select();
                            }
                            else {
                                page.controls.txtItemSearch.selectedObject.focus();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=alter_price_1]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                row.find("input[datafield=price2]").focus().select();
                            }
                            else if (CONTEXT.ENABLE_PRICE_LIMIT) {
                                row.find("input[datafield=price_limit]").focus().select();
                            }
                            else {
                                page.controls.txtItemSearch.selectedObject.focus();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=price2]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                row.find("input[datafield=alter_price_2]").focus().select();
                            }
                            else if (CONTEXT.ENABLE_PRICE_LIMIT) {
                                row.find("input[datafield=price_limit]").focus().select();
                            }
                            else {
                                page.controls.txtItemSearch.selectedObject.focus();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=alter_price_2]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            if (CONTEXT.ENABLE_PRICE_LIMIT) {
                                row.find("input[datafield=price_limit]").focus().select();
                            }
                            else {
                                page.controls.txtItemSearch.selectedObject.focus();
                            }
                        }
                    });
                    row.on("keydown", "input[datafield=price_limit]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            e.preventDefault();
                            var nextRow = $(this).closest("grid_row").next();
                            page.controls.txtItemSearch.selectedObject.focus();
                        }
                    });

                    row.on("keydown", "input[datafield=expiry_date]", function (e) {

                    });
                    row.on("change", "input[datafield=selling_price]", function () {
                        var poItem = page.controls.grdBill.getRowData(row);
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                        if (isNaN(poItem.disc_per)) {
                            poItem.disc_per = 0;
                        }
                        if (isNaN(poItem.disc_val)) {
                            poItem.disc_val = 0;
                        }
                        discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                        var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;

                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }
                        if (parseFloat(poItem.additional_tax) != 0)
                            tax = parseFloat(tax) + parseFloat(poItem.additional_tax);

                        var net_rate = 0;
                        if (CONTEXT.FREE_AVG_BUYING_COST) {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        } else {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        }
                        item.net_rate = net_rate;
                        var profit = parseFloat(((parseFloat(item.selling_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                        item.profit = profit;
                        row.find("input[datafield=profit]").val(profit);
                    });
                    //profit
                    row.on("change", "input[datafield=profit]", function () {
                        var poItem = page.controls.grdBill.getRowData(row);
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }

                        if (poItem.profit.startsWith("#")) {
                            poItem.profit = poItem.profit.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(poItem.profit)) / 100;
                            //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            selling_price = (isNaN(selling_price) || selling_price == "Infinity") ? "0" : selling_price;
                            item.selling_price = selling_price;
                            row.find("input[datafield=selling_price]").val(selling_price);
                            if (CONTEXT.PRICE_EQUAL_FREE) {
                                item.free_selling_price = selling_price;
                                row.find("input[datafield=free_selling_price]").val(selling_price);
                            }

                        }
                        else {
                            var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                            if (isNaN(poItem.disc_per)) {
                                poItem.disc_per = 0;
                            }
                            if (isNaN(poItem.disc_val)) {
                                poItem.disc_val = 0;
                            }
                            discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                            var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                            if (parseFloat(poItem.additional_tax) != 0)
                                tax = parseFloat(tax) + parseFloat(poItem.additional_tax);
                            var net_rate = 0;
                            if (CONTEXT.FREE_AVG_BUYING_COST) {
                                net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            } else {
                                net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            }
                            item.net_rate = net_rate;
                            //var selling_price = Math.round(parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            selling_price = (isNaN(selling_price) || selling_price == "Infinity") ? "0" : selling_price;
                            item.selling_price = selling_price;
                            row.find("input[datafield=selling_price]").val(selling_price);
                            if (CONTEXT.PRICE_EQUAL_FREE) {
                                item.free_selling_price = selling_price;
                                row.find("input[datafield=free_selling_price]").val(selling_price);
                            }
                        }
                    });
                    row.on("change", "input[datafield=alter_price_1]", function () {
                        var poItem = page.controls.grdBill.getRowData(row);
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                        if (isNaN(poItem.disc_per)) {
                            poItem.disc_per = 0;
                        }
                        if (isNaN(poItem.disc_val)) {
                            poItem.disc_val = 0;
                        }
                        discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                        var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;

                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }
                        if (parseFloat(poItem.additional_tax) != 0)
                            tax = parseFloat(tax) + parseFloat(poItem.additional_tax);

                        var net_rate = 0;
                        if (CONTEXT.FREE_AVG_BUYING_COST) {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        } else {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        }
                        item.net_rate = net_rate;
                        var profit = parseFloat(((parseFloat(item.alter_price_1) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                        item.price1 = profit;
                        row.find("input[datafield=price1]").val(profit);
                    });
                    row.on("change", "input[datafield=price1]", function () {
                        var poItem = page.controls.grdBill.getRowData(row);
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }

                        if (poItem.price1.startsWith("#")) {
                            poItem.price1 = poItem.price1.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(poItem.price1)) / 100;
                            //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            selling_price = (isNaN(selling_price) || selling_price == "Infinity") ? "0" : selling_price;
                            item.selling_price = selling_price;
                            row.find("input[datafield=selling_price]").val(selling_price);
                            if (CONTEXT.PRICE_EQUAL_FREE) {
                                item.free_selling_price = selling_price;
                                row.find("input[datafield=free_selling_price]").val(selling_price);
                            }
                        }
                        else {
                            var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                            if (isNaN(poItem.disc_per)) {
                                poItem.disc_per = 0;
                            }
                            if (isNaN(poItem.disc_val)) {
                                poItem.disc_val = 0;
                            }
                            discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                            var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                            if (parseFloat(poItem.additional_tax) != 0)
                                tax = parseFloat(tax) + parseFloat(poItem.additional_tax);
                            var net_rate = 0;
                            if (CONTEXT.FREE_AVG_BUYING_COST) {
                                net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            } else {
                                net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            }
                            item.net_rate = net_rate;
                            //var selling_price = Math.round(parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price1)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price1)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            selling_price = (isNaN(selling_price) || selling_price == "Infinity") ? "0" : selling_price;
                            item.alter_price_1 = selling_price;
                            row.find("input[datafield=alter_price_1]").val(selling_price);
                        }
                    });
                    row.on("change", "input[datafield=alter_price_2]", function () {
                        var poItem = page.controls.grdBill.getRowData(row);
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                        if (isNaN(poItem.disc_per)) {
                            poItem.disc_per = 0;
                        }
                        if (isNaN(poItem.disc_val)) {
                            poItem.disc_val = 0;
                        }
                        discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                        var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;

                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }
                        if (parseFloat(poItem.additional_tax) != 0)
                            tax = parseFloat(tax) + parseFloat(poItem.additional_tax);

                        var net_rate = 0;
                        if (CONTEXT.FREE_AVG_BUYING_COST) {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        } else {
                            net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        }
                        item.net_rate = net_rate;
                        var profit = parseFloat(((parseFloat(item.alter_price_2) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                        item.price2 = profit;
                        row.find("input[datafield=price2]").val(profit);
                    });
                    row.on("change", "input[datafield=price2]", function () {
                        var poItem = page.controls.grdBill.getRowData(row);
                        if (poItem.additional_tax == "" || poItem.additional_tax == null || typeof poItem.additional_tax == "undefined")
                            poItem.additional_tax = 0;
                        poItem.additional_tax = Math.floor(parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                        if (poItem.additional_tax == 0) {
                            poItem.additional_tax = (parseFloat(poItem.qty) / parseFloat(poItem.cess_qty)) * parseFloat(poItem.cess_qty_amount);
                        }

                        if (poItem.price2.startsWith("#")) {
                            poItem.price2 = poItem.price2.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(poItem.price2)) / 100;
                            //var selling_price = Math.round(parseFloat(item.mrp) - parseFloat(profper));
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            selling_price = (isNaN(selling_price) || selling_price == "Infinity") ? "0" : selling_price;
                            item.selling_price = selling_price;
                            row.find("input[datafield=selling_price]").val(selling_price);
                            if (CONTEXT.PRICE_EQUAL_FREE) {
                                item.free_selling_price = selling_price;
                                row.find("input[datafield=free_selling_price]").val(selling_price);
                            }
                        }
                        else {
                            var subtotal = parseFloat(poItem.cost) * parseFloat(poItem.qty);
                            if (isNaN(poItem.disc_per)) {
                                poItem.disc_per = 0;
                            }
                            if (isNaN(poItem.disc_val)) {
                                poItem.disc_val = 0;
                            }
                            discount = subtotal * parseFloat(poItem.disc_per) / 100 + (parseFloat(poItem.disc_val) * parseFloat(poItem.qty));
                            var tax = (subtotal - discount) * parseFloat(poItem.tax_per) / 100;
                            if (parseFloat(poItem.additional_tax) != 0)
                                tax = parseFloat(tax) + parseFloat(poItem.additional_tax);
                            var net_rate = 0;
                            if (CONTEXT.FREE_AVG_BUYING_COST) {
                                net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            } else {
                                net_rate = parseFloat(((subtotal - discount) / (parseFloat(poItem.qty))) + (tax / parseFloat(poItem.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            }
                            item.net_rate = net_rate;
                            //var selling_price = Math.round(parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price2)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price2)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            selling_price = (isNaN(selling_price) || selling_price == "Infinity") ? "0" : selling_price;
                            item.alter_price_2 = selling_price;
                            row.find("input[datafield=alter_price_2]").val(selling_price);
                        }

                    });
                    row.on("click", "[datafield=item_name]", function () {
                        page.clickCount++;
                        if (page.clickCount == 2) {
                            page.clickCount = 0;
                            page.controls.pnlItemEdit.open();
                            page.controls.pnlItemEdit.title("Edit Item");
                            page.controls.pnlItemEdit.rlabel("Item");
                            page.controls.pnlItemEdit.width(500);
                            page.controls.pnlItemEdit.height(510);
                            var item_details = page.controls.grdBill.selectedData()[0];
                            $$("lblItemNo").value(item_details.item_no)
                            $$("txtItemCode").val(item_details.item_code);
                            $$("txtItemName").val(item_details.item_name);
                            $$("txtItemName").val(item_details.item_name);
                            $$("qty_type").selectedValue(item_details.qty_type);
                            $$("itemUnit").selectedValue(item_details.unit);
                            $$("txtEditAlterUnit").selectedValue(item_details.alter_unit),
                            $$("txtEditAlterUnitFact").value(item_details.alter_unit_fact),

                            $$("txtBarcode").value(item_details.barcode);
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
                            if (CONTEXT.ENABLE_ALTER_UNIT) {
                                $$("pnlEditAlternativeUnit").show();
                                $$("pnlEditAlternativeUnitFactor").show();
                            } else {
                                $$("pnlEditAlternativeUnit").hide();
                                $$("pnlEditAlternativeUnitFactor").hide();
                            }
                            page.taxclassAPI.searchValues("", "", "", "", function (data) {
                                page.controls.ddlEditTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                                $$("ddlEditTax").selectedValue(item_details.tax_class_no);
                            });
                        }
                    });
                    if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {
                        page.setAttributes(row, item);
                        if (item.get_sku == "1") {
                            if (CONTEXT.PURCHASE_SKU_SEARCH != "Manual") {
                                page.stockAPI.getSkuByItem({ item_no: item.item_no, vendor_no: page.controls.hdnVendorNo.val(), search_mode: CONTEXT.PURCHASE_SKU_SEARCH }, function (data) {
                                    if (data.length > 1) {
                                        $(row).find("[id=Cancel]").click();
                                        $(data).each(function (i, item1) {
                                            var item_data = item;
                                            item_data.attr_type1 = item1.attr_type1;
                                            item_data.attr_type2 = item1.attr_type2;
                                            item_data.attr_type3 = item1.attr_type3;
                                            item_data.attr_type4 = item1.attr_type4;
                                            item_data.attr_type5 = item1.attr_type5;
                                            item_data.attr_type6 = item1.attr_type6;
                                            item_data.attr_value1 = (item1.attr_value1 == null || typeof item1.attr_value1 == "undefined") ? "" : item1.attr_value1;
                                            item_data.attr_value2 = (item1.attr_value2 == null || typeof item1.attr_value2 == "undefined") ? "" : item1.attr_value2;
                                            item_data.attr_value3 = (item1.attr_value3 == null || typeof item1.attr_value3 == "undefined") ? "" : item1.attr_value3;
                                            item_data.attr_value4 = (item1.attr_value4 == null || typeof item1.attr_value4 == "undefined") ? "" : item1.attr_value4;
                                            item_data.attr_value5 = (item1.attr_value5 == null || typeof item1.attr_value5 == "undefined") ? "" : item1.attr_value5;
                                            item_data.attr_value6 = (item1.attr_value6 == null || typeof item1.attr_value6 == "undefined") ? "" : item1.attr_value6;
                                            item_data.cost = item1.avg_buying_cost;
                                            item_data.temp_cost = item1.avg_buying_cost;
                                            item_data.pre_selling_price = item1.pre_price;
                                            item_data.pre_alter_price_1 = item1.alter_price_1;
                                            item_data.pre_alter_price_2 = item1.alter_price_2;
                                            item_data.pre_price_limit = item1.price_limit;
                                            item_data.get_sku = "0";
                                            if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                                if (item.attr_type1 == "exp_date") {
                                                    if (item.expiry_days != null && typeof item.expiry_days != "undefined" && item.expiry_days != "" && item.expiry_days != "0") {
                                                        var today = new Date();
                                                        var numberOfDaysToAdd = parseInt(item.expiry_days);
                                                        today.setDate(today.getDate() + numberOfDaysToAdd);
                                                        var year = today.getFullYear();
                                                        var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
                                                        var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                                        item_data.attr_value1 = year + "-" + month + "-" + date;
                                                    }
                                                }
                                            }

                                            page.controls.grdBill.createRow(item_data);
                                        });
                                    }
                                    else if (data.length == 1) {
                                        var poItem = page.controls.grdBill.getRowData(row);
                                        poItem.cost = data[0].avg_buying_cost;
                                        poItem.temp_cost = data[0].avg_buying_cost;
                                        row.find("input[datafield=cost]").val(data[0].avg_buying_cost);
                                        row.find("input[datafield=temp_cost]").val(data[0].avg_buying_cost);
                                        poItem.pre_selling_price = data[0].pre_price;
                                        poItem.pre_alter_price_1 = data[0].alter_price_1;
                                        poItem.pre_alter_price_2 = data[0].alter_price_2;
                                        poItem.pre_price_limit = data[0].price_limit;
                                        row.find("input[datafield=pre_selling_price]").val(data[0].pre_price);
                                        row.find("input[datafield=pre_alter_price_1]").val(data[0].alter_price_1);
                                        row.find("input[datafield=pre_alter_price_2]").val(data[0].alter_price_2);
                                        row.find("input[datafield=pre_price_limit]").val(data[0].price_limit);
                                        row.find("[datafield=pre_selling_price]").html(data[0].pre_price);
                                        row.find("[datafield=pre_alter_price_1]").html(data[0].alter_price_1);
                                        row.find("[datafield=pre_alter_price_2]").html(data[0].alter_price_2);
                                        row.find("[datafield=pre_price_limit]").html(data[0].price_limit);
                                        if (row.prev().find("[datafield=item_no]").find("div").html() != item.item_no) {
                                            $(row).find("input[dataField=attr_value1]").val(data[0].attr_value1).change();
                                            $(row).find("input[dataField=attr_value2]").val(data[0].attr_value2).change();
                                            $(row).find("input[dataField=attr_value3]").val(data[0].attr_value3).change();
                                            $(row).find("input[dataField=attr_value4]").val(data[0].attr_value4).change();
                                            $(row).find("input[dataField=attr_value5]").val(data[0].attr_value5).change();
                                            $(row).find("input[dataField=attr_value6]").val(data[0].attr_value6).change();
                                        }
                                        if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                            if (item.attr_type1 == "exp_date") {
                                                if (item.expiry_days != null && typeof item.expiry_days != "undefined" && item.expiry_days != "" && item.expiry_days != "0") {
                                                    var today = new Date();
                                                    var numberOfDaysToAdd = parseInt(item.expiry_days);
                                                    today.setDate(today.getDate() + numberOfDaysToAdd);
                                                    var year = today.getFullYear();
                                                    var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
                                                    var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                                    $(row).find("input[dataField=attr_value1]").val(year + "-" + month + "-" + date).change();
                                                }
                                            }
                                        }

                                    }
                                    else {
                                        var poItem = page.controls.grdBill.getRowData(row);
                                        poItem.cost = "0";
                                        poItem.temp_cost = "0";
                                        row.find("input[datafield=cost]").val("0");
                                        row.find("input[datafield=temp_cost]").val("0");
                                        poItem.pre_selling_price = "";
                                        poItem.pre_alter_price_1 = "";
                                        poItem.pre_alter_price_2 = "";
                                        poItem.pre_price_limit = "";
                                        row.find("input[datafield=pre_selling_price]").val("");
                                        row.find("input[datafield=pre_alter_price_1]").val("");
                                        row.find("input[datafield=pre_alter_price_2]").val("");
                                        row.find("input[datafield=pre_price_limit]").val("");
                                        row.find("[datafield=pre_selling_price]").html("");
                                        row.find("[datafield=pre_alter_price_1]").html("");
                                        row.find("[datafield=pre_alter_price_2]").html("");
                                        row.find("[datafield=pre_price_limit]").html("");
                                        if (row.prev().find("[datafield=item_no]").find("div").html() != item.item_no) {
                                            $(row).find("input[dataField=attr_value1]").val("").change();
                                            $(row).find("input[dataField=attr_value2]").val("").change();
                                            $(row).find("input[dataField=attr_value3]").val("").change();
                                            $(row).find("input[dataField=attr_value4]").val("").change();
                                            $(row).find("input[dataField=attr_value5]").val("").change();
                                            $(row).find("input[dataField=attr_value6]").val("").change();
                                        }
                                        if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                                            if (item.attr_type1 == "exp_date") {
                                                if (item.expiry_days != null && typeof item.expiry_days != "undefined" && item.expiry_days != "" && item.expiry_days != "0") {
                                                    var today = new Date();
                                                    var numberOfDaysToAdd = parseInt(item.expiry_days);
                                                    today.setDate(today.getDate() + numberOfDaysToAdd);
                                                    var year = today.getFullYear();
                                                    var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
                                                    var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                                    $(row).find("input[dataField=attr_value1]").val(year + "-" + month + "-" + date).change();
                                                }
                                            }
                                        }
                                    }
                                    $$("grdBill").edit(true);
                                    page.calculate();
                                    page.setAttributes(row, item);
                                    if (data.length > 0) {
                                        if (data[0].pre_price != "" && data[0].pre_price != null && typeof data[0].pre_price != "undefined") {
                                            var profit = parseFloat(((parseFloat(data[0].pre_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                            profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                                            row.find("[datafield=pre_selling_price]").html(data[0].pre_price + " (" + profit + "%)");
                                        }
                                        if (data[0].alter_price_1 != "" && data[0].alter_price_1 != null && typeof data[0].alter_price_1 != "undefined") {
                                            profit = parseFloat(((parseFloat(data[0].alter_price_1) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                            profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                                            row.find("[datafield=pre_alter_price_1]").html(data[0].alter_price_1 + " (" + profit + "%)");
                                        }
                                        if (data[0].alter_price_2 != "" && data[0].alter_price_2 != null && typeof data[0].alter_price_2 != "undefined") {
                                            profit = parseFloat(((parseFloat(data[0].alter_price_2) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                                            profit = (isNaN(profit) || profit == "Infinity") ? "100" : profit;
                                            row.find("[datafield=pre_alter_price_2]").html(data[0].alter_price_2 + " (" + profit + "%)");
                                        }
                                    }
                                    row.find("[datafield=temp_qty]").find("input").focus().select();
                                });
                            }
                        }
                        row.find("[datafield=temp_qty]").find("input").focus().select();

                    }
                    if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {
                        var netRateTemplate = [];
                        if (item.tax_inclusive == "1") {
                            netRateTemplate.push("<input type='text' dataField='net_rate' style='width:120px;' placeholder='Net Rate' >");
                        }
                        else {
                            netRateTemplate.push("<input type='text' dataField='net_rate' style='width:120px;' placeholder='Net Rate' disabled >");
                        }
                        $(row).find("[id=pnlNetRate]").html(netRateTemplate.join(""));
                    }
                    else {
                        var netRateTemplate = [];
                        netRateTemplate.push("<input type='text' dataField='net_rate' style='width:120px;' placeholder='Net Rate' disabled >");
                        //$(row).find("input[dataField=net_rate]").val(item.net_rate);//.change();
                        $(row).find("[id=pnlNetRate]").html(netRateTemplate.join(""));
                    }
                    row.on("change", "input[datafield=net_rate]", function (e) {
                        item.net_rate = this.value;
                        //var buying_cost = parseFloat(item.net_rate) - (parseFloat(item.net_rate) / 100) * parseFloat(item.tax_per);
                        var buying_cost = (parseFloat(parseFloat(item.net_rate)) / parseFloat((parseFloat(item.tax_per) / 100) + 1));
                        item.temp_cost = buying_cost;
                        item.cost = buying_cost;
                        //$(row).find("input[dataField=net_rate]").val(item.net_rate).change();
                        $(row).find("input[dataField=temp_cost]").val(parseFloat(buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $(row).find("input[dataField=cost]").val(parseFloat(buying_cost).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        page.calculate();
                    });
                    //row.on("focusout", "input[datafield=net_rate]", function (e) {
                    //    page.calculate();
                    //});
                    //calculate netrate
                    var subtotal = parseFloat(item.cost) * parseFloat(item.qty);
                    var discount = subtotal * parseFloat(item.disc_per) / 100 + (parseFloat(item.disc_val) * parseFloat(item.qty));
                    var tax = (subtotal - discount) * parseFloat(item.tax_per) / 100;
                    var net_rate = parseFloat(((subtotal - discount) / (parseFloat(item.qty))) + (tax / parseFloat(item.qty))).toFixed(CONTEXT.COUNT_AFTER_POINTS);

                    if (item.cess_qty_amount != "0" && item.cess_qty_amount != null && typeof item.cess_qty_amount != "undefined") {
                        net_rate = parseFloat(net_rate) + parseFloat(item.cess_qty_amount);
                    }
                    net_rate = (isNaN(net_rate) || net_rate == "Infinity") ? "0" : net_rate;
                    //$(row).find("[datafield=net_rate]").find("div").html(net_rate);
                    $(row).find("input[dataField=net_rate]").val(net_rate);//.change();
                    $(row).find("[datafield=gross_amt]").find("div").html(parseFloat(parseFloat(item.cost) * parseFloat(item.qty)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                };
                $$("grdBill").dataBind(data);
                $$("grdBill").edit(true);

                $$("grdBill").selectedObject.find(".grid_header:last-child").hide();
                $$("grdBill").selectedObject.append("<div class='grid_bill_footer'>" + $$("grdBill").selectedObject.find(".grid_header:first-child").html() + "</div>");
                $$("grdBill").selectedObject.find(".grid_bill_footer div").html("");
                $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=item_name]").html("Total Qty : 0");
                
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").on('keyup', function (e) {
                    if (e.which == 13) {
                        doneProfitCalculate();
                        if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                            $$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").focus().select();
                        }
                        else {
                            $$("txtItemSearch").selectedObject.focus();
                        }
                    }
                });
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice]").on('focusout', function (e) {
                    doneProfitCalculate();
                });
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").on('keyup', function (e) {
                    if (e.which == 13) {
                        donePrice1ProfitCalculate();
                        if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                            $$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").focus().select();
                        }
                        else {
                            $$("txtItemSearch").selectedObject.focus();
                        }
                    }
                });
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice1]").on('focusout', function (e) {
                    donePrice1ProfitCalculate();
                });
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").on('keyup', function (e) {
                    if (e.which == 13) {
                        donePrice2ProfitCalculate();
                        $$("txtItemSearch").selectedObject.focus();
                    }
                });
                $$("grdBill").selectedObject.find(".grid_header [id=profitPrice2]").on('focusout', function (e) {
                    donePrice2ProfitCalculate();
                    $$("txtItemSearch").selectedObject.focus();
                });
            }
        }
        function getAttributeName(id) {
            var value = "";
            $(page.attr_list).each(function (i, item) {
                if (item.attr_no_key == id)
                    value = item.attr_name;
            })
            return(value);
        }
        //QR Code Scan
        page.events.btnQrScan_click = function () {
            page.controls.pnlQrScan.open();
            page.controls.pnlQrScan.title("QR Scanning Screen");
            page.controls.pnlQrScan.rlabel("QR Code");
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
        page.addTray = function (currentBillNo, bill) {
            try {
                var trayItems = [];
                $(bill.bill_items).each(function (i, item) {
                    if (item.tray_mode != "SKU" && item.tray_mode != null && typeof item.tray_mode != "undefined") {
                        if (parseFloat(item.tray_received) > 0)
                            if (item.tray_id != null && item.tray_id != "-1" && typeof item.tray_id != "undefined")
                                trayItems.push({
                                    tray_id: item.tray_id,
                                    tray_count: parseInt(item.tray_received),
                                    trans_type: "Vendor Purchase",
                                    trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    cust_id: (bill.vendor_no == null) ? "-1" : bill.vendor_no,
                                    bill_id: currentBillNo,
                                    store_no: localStorage.getItem("user_store_no")
                                });
                    }
                });
                //page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {});
                page.eggtraytransAPI.postAllValues(0, trayItems, function (data) {
                });

            } catch (e) {
                page.msgPanel.flash(e);
            }

        }
        page.selectGridBill = function (item, currentRow) {
            var newitem = {
                item_no: item.item_no,
                item_code: item.item_code,
                item_name: item.item_name,
                item_name_tr: item.item_name_tr,
                unit: item.unit,
                qty: 1,
                temp_qty: 1,
                temp_free_qty: "0",
                additional_tax: "0",
                qty_type: item.qty_type,
                //tray_id: item.tray_no,
                barcode: item.barcode,
                temp_cost: item.cost,
                cost: item.cost,
                buying_cost: item.buying_cost,
                disc_per: item.disc_per,
                disc_val: item.disc_val,

                tray_id: item.tray_id,
                tray_mode: item.tray_mode,
                tray_received: "1",

                qty_stock: item.qty_stock,
                alter_unit: item.alter_unit,
                alter_unit_fact: item.alter_unit_fact,
                tax_per: item.tax_per,//taxData[0].tax,
                expiry_days: item.expiry_days,
                unit_identity: 0,
                state_no: "00",
                temp_free_qty: "0",
                tax_class_no: item.tax_class_no,
                tax_inclusive: item.tax_inclusive,
                rack_no: item.rack_no,
                var_supp_no: item.var_supp_no,
                var_buying_cost: item.var_buying_cost,
                var_mrp: item.var_mrp,
                var_batch_no: item.var_batch_no,
                var_man_date: item.var_man_date,
                var_expiry_date: item.var_expiry_date,

                cess_qty: item.cess_qty,
                cess_qty_amount: item.cess_qty_amount,
                cess_per: item.cess_per,
                sgst_per: item.sgst_per,
                cgst_per: item.cgst_per,
                igst_per: item.igst_per,
                cgst_val: 0,
                sgst_val: 0,
                igst_val: 0,
                cess_per_val: 0,
                tax_per_amt: 0,

                var_attribute: item.var_attribute,
                var_stock_attribute: item.var_stock_attribute,
                var_attr_key: item.var_attr_key,
                var_stock_attr_key: item.var_stock_attr_key,

                attr_type1: item.attr_type1,
                attr_value1: "",
                attr_type2: item.attr_type2,
                attr_value2: "",
                attr_type3: item.attr_type3,
                attr_value3: "",
                attr_type4: item.attr_type4,
                attr_value4: "",
                attr_type5: item.attr_type5,
                attr_value5: "",
                attr_type6: item.attr_type6,
                attr_value6: "",


            };


            page.controls.grdBill.createRow(newitem, currentRow);

            page.controls.grdBill.edit(true);
            var rows = page.controls.grdBill.getRow({
                item_no: newitem.item_no
            });
            page.controls.grdBill.getAllRows()[parseInt(rows.length) - 1].click();
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
                    "Rate": parseFloat(item.price).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                    "PDis": parseFloat(item.discount).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                    "MRP": parseFloat(item.mrp).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                    "CGST": parseFloat(item.item_gst_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                    "SGST": parseFloat(item.item_gst_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                    "GValue": parseFloat(item.total_price).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                    "TotalPrice": parseFloat(item.total_price).toFixed(CONTEXT.COUNT_AFTER_POINTS),
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
                            "BillNo": data.bill_id,
                            "BillDate": data.bill_date,
                            "NoofItems": data.no_of_items,
                            "Quantity": data.no_of_qty,
                            "BSubTotal": parseFloat(data.sub_total).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "DiscountAmount": parseFloat(data.tot_discount).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "BCGST": parseFloat(data.tot_gst_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "BSGST": parseFloat(data.tot_gst_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "BillAmount": parseFloat(data.total).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "ApplicaName": data.vendor_name,
                            "ApplsName": data.vendor_name.toUpperCase(),
                            "CompanyAddress": data.address,
                            "CompanyCityStreetPincode": "",
                            "CompanyPhoneNoEtc": data.phone_no,
                            "CompanyDLNo": "",
                            "CompanyTINNo": "",
                            "CompanyGST": "",
                            "SSSS": "ORIGINAL",
                            "Original": "ORIGINAL",
                            "RoundAmount": parseFloat(data.round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS),
                            "BillItem": bill_item
                        };
            if (page.PrintBillType == "Return") {
                accountInfo.BillName = "PURCHASE RETURN BILL";
            }
            else {
                accountInfo.BillName = "PURCHASE BILL";
            }
            PrintService.PrintFile(accountInfo);
        }

        page.events.btnDiscountOK_click = function () {
            var data = page.controls.ddlDiscount.selectedData();
            if (typeof data != "undefined") {
                if (data.disc_name != null && (data.disc_name == "Manual Discount of x percent" || data.disc_name == "Manual Discount of x value" || data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    page.manualDiscountbillLevel = true;
                    page.controls.pnlManualDiscountPopUp.open();
                    page.controls.pnlManualDiscountPopUp.title("Manual Discount");
                    page.controls.pnlManualDiscountPopUp.rlabel("Manual Discount");
                    page.discountData = data;
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
                $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                    var poItem = page.controls.grdBill.getRowData(row);
                    poItem.disc_per = 0;
                    $(row).find("input[datafield=disc_per]").val(poItem.disc_per)
                    $(page.selectedBill.discounts).each(function (i, data) {
                        if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                            if (data.disc_type == "Fixed") {
                                poItem.disc_per = parseFloat(data.disc_value) * 100 / (parseFloat(poItem.cost) * parseFloat(poItem.qty));
                                $(row).find("input[datafield=disc_per]").val(poItem.disc_per)
                            }
                            else if (data.disc_type == "Percent") {
                                poItem.disc_per = data.disc_value;
                                $(row).find("input[datafield=disc_per]").val(poItem.disc_per)
                            }
                        }
                    });
                });
                page.calculate();
                $$("grdDiscount").dataBind(page.selectedBill.discounts);
            }

        }
        page.events.btnManualDiscountOK_click = function () {
            var data = page.discountData;
            page.selectedBill.discounts.push({
                disc_no: data.disc_no,
                disc_type: data.disc_type,
                disc_name: data.disc_name,
                disc_level: data.disc_level,
                disc_value: $$("txtManualDiscount").val()
            });
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var poItem = page.controls.grdBill.getRowData(row);
                poItem.disc_per = 0;
                $(row).find("input[datafield=disc_per]").val(poItem.disc_per)
            });
            page.calculate();
            alert("Discount successfully applied...!");
            page.controls.pnlManualDiscountPopUp.close();
            $$("grdDiscount").dataBind(page.selectedBill.discounts);
        }
        page.events.btnManualDiscountCancel_click = function () {
            page.controls.pnlManualDiscountPopUp.close();
        }


        page.events.btnNewMainProductType_click = function(){
            page.controls.pnlNewMainProductType.open();
            page.controls.pnlNewMainProductType.title("Main Product Type");
            page.controls.pnlNewMainProductType.rlabel("Main Product Type");
            page.controls.pnlNewMainProductType.width(400);
            page.controls.pnlNewMainProductType.height(200);
            $$("txtNewMainProductTypeName").focus();
        }
        page.events.btnNewMainProductTypeSave_click = function () {
            var mainproduct = {
                mpt_name: $$("txtNewMainProductTypeName").value(),
                mpt_desc: "Main Product",
                comp_id: localStorage.getItem("user_company_id"),
            };
            try{
                if (mainproduct.mpt_name == "" || mainproduct.mpt_name == null || mainproduct.mpt_name == undefined) {
                    throw"Main product name is mandatory ...!";
                }
                if (mainproduct.mpt_name != "" && isInt(mainproduct.mpt_name)) {
                    throw"Main product name should only contains characters ...!";
                }
                page.mainproducttypeAPI.postValue(mainproduct, function (data) {
                    var mpt_no = data[0].key_value;
                    page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                        $$("ddlMainProductType").dataBind(data, "mpt_no", "mpt_name", "None");
                        $$("ddlMainProductType").selectedValue(mpt_no);
                        alert("Data Saved Successfully...!!!");
                        page.controls.pnlNewMainProductType.close();
                    });
                });
            }
            catch (e) {
                alert(e);
                $$("txtNewMainProductTypeName").focus();
            }
        }
        page.events.btnNewProductType_click = function () {
            page.controls.pnlNewProductType.open();
            page.controls.pnlNewProductType.title("Product Type");
            page.controls.pnlNewProductType.rlabel("Product Type");
            page.controls.pnlNewProductType.width(400);
            page.controls.pnlNewProductType.height(200);
            page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlmymainproduct").dataBind(data, "mpt_no", "mpt_name", "None");
            });
            $$("txtNewProductTypeName").focus();
        }
        page.events.btnNewProductTypeSave_click = function () {
            var producttype = {
                ptype_name: $$("txtNewProductTypeName").value(),
                mpt_no: $$("ddlmymainproduct").selectedValue(),
            };
            try{
                if (producttype.ptype_name == "" || producttype.ptype_name == null || producttype.ptype_name == undefined) {
                    throw "Product type name is mandatory ...!";
                }
                else if (producttype.ptype_name != "" && isInt(producttype.ptype_name)) {
                    throw"Product type name should only contains characters ...!";
                }
                else if (producttype.mpt_no == "" || producttype.mpt_no == null || producttype.mpt_no == undefined) {
                    throw"Main Product Type Is Not Choosen ...!";
                }
                page.productTypeAPI.postValue(producttype, function (data) {
                    var prod_type_no = data[0].key_value;
                    page.productTypeAPI.searchValues("", "", "", "", function (data) {
                        $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "None");
                        $$("ddlProductType").selectedValue(prod_type_no);
                        alert("Product type saved successfully...!");
                        page.controls.pnlNewProductType.close();
                    });
                });
            }
            catch (e) {
                alert(e);
                $$("txtNewProductTypeName").focus();
            }
        }

        page.events.btnAddNewProduct_click = function () {
            if (page.searchAttributes == "text")
                page.events.btnNewItem_click();
        }

        page.events.btnPurchaseMore_click = function () {
            page.controls.pnlPurchaseMoreOption.open();
            page.controls.pnlPurchaseMoreOption.title("More Option");
            page.controls.pnlPurchaseMoreOption.rlabel("More Option");
            page.controls.pnlPurchaseMoreOption.width(350);
            page.controls.pnlPurchaseMoreOption.height(300);
        }
        page.events.btnSaveMoreOption_click = function () {
            //doneProfitCalculate();
            //donePrice1ProfitCalculate();
            //donePrice2ProfitCalculate();
            page.controls.pnlPurchaseMoreOption.close();
        }

    });
}