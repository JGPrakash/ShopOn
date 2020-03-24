var bill_tab_count = 0;
var attr_list = [];
$.fn.purchasePOP = function () {
    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.billService = new BillService();
        page.accService = new AccountingService();
        page.salesService = new SalesService();
        page.invoiceService = new InvoiceService();
        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.reportService = new ReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.settingService = new SettingService();
        page.finfactsService = new FinfactsService();
        page.purchaseBillService = new PurchaseBillService();
        page.vendorService = new VendorService();
        page.finfactsEntry = new FinfactsEntry();

        page.stockAPI = new StockAPI();
        page.purchaseBillAPI = new PurchaseBillAPI();
        page.vendorAPI = new VendorAPI();
        page.purchaseBillPaymentAPI = new PurchaseBillPaymentAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.reportAPI = new ReportAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.stockReportAPI = new StockReportAPI();
        page.tabs = {};
        page.tabId = 1;
        page.currentTabId = null;
        page.bill_count = 0;

        page.temp_obj = null;

        document.title = "ShopOn - POP";
        $("body").keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this
           
            //now we caught the key code, yabadabadoo!!
            var keyCode = e.keyCode || e.which;

            //your keyCode contains the key code, F1 to F12 
            //is among 112 and 123. Just it.
            //console.log(keyCode);
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewBill_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnBack_click();
            }           
            //if (keyCode == 114) {
            //    e.preventDefault();
            //    page.temp_obj.btnPayBill_click();
            //}
            //if (keyCode == 115) {
            //    e.preventDefault();
            //    page.temp_obj.btnSaveBill_click();
            //}
        });
        $('#pnlPayPending').keydown(function (event) {
            if (event.keyCode == 35) {
                page.events.btnPayPending_click();
            }
        });
        $('#pnlReturnPOPPopup').keydown(function (event) {
            if (event.keyCode == 35) {
                page.events.btnReturnPOPItemPopup_click();
            }
        });

        page.loadSales = function (callback) {
            page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                page.view.salesList(data);
                page.events.btnNewBill_click();
                callback();
            });
        }
    
        page.createBillView = function (billNo) {
            //Add tab and panel
            var tabText = typeof billNo == "undefined" ? "New * : 0.00" : "Bill " + billNo + " : 0.00"  ;
            $('<li index="' + page.tabId + '" ><a target="#bill_' + page.tabId + '"  style="padding-top: 1px;    padding-bottom: 0px;    height: auto;">' + tabText + '</a><button style="background-color: transparent; border: none;" >x</button></li>').insertBefore($("[controlId=tabBills] hr"));
            $$("tabPanels").append('<div style="display:none"  id="bill_' + page.tabId + '">cccccccc' + page.tabId + '</div>');
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                var nextTab = $(this).closest("li").next();
                if (nextTab.length == 0)
                    nextTab = $(this).closest("li").prev();
                if (nextTab.length == 0) {
                    page.currentTabId = null;
                    page.events.btnBack_click();
                } else {
                    page.currentTabId = parseInt(nextTab.attr("index"));
                    var index = $(this).closest("li").attr("index");
                    $.pageController.unLoadUserControl(page, "bill_" + index);
                    $$("tabPanels").find("[id=bill_" + index + "]").remove();

                    $$("tabBills").selectedObject.find("[index=" + index + "]").remove();
                    delete page.tabs[index];
                }
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] a").click();
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                bill_tab_count--;
                if (bill_tab_count == 0) {
                    page.events.btnBack_click();
                }
            });
            //$$("tabPanels").selectedObject.find('id=bill_' + page.tabId).purchaseBill();
            var obj = $.pageController.loadUserControl(page, $$("tabPanels").find('[id=bill_' + page.tabId + "]"), "bill_" + page.tabId, "purchaseBill");
            
           
            obj.setMessagePanel($$("msgPanel"));
            obj.closeBill = function () {
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                //page.events.btnNewBill_click();
            }
            obj.launchNewBill = function () {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                page.events.btnNewBill_click();
                bill_tab_count++;
            }
            obj.setBillAmount = function (amount) {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                var tabText = $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html();

                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html(tabText.split(":")[0] + ": " + amount);
            }
            
            obj.printBill = function (bill) {
                //page.events.btnPrintBill_click(bill);
                page.jasperPrint(bill, "PDF");
            }
            obj.currentProductList = page.productList;
            //Store bil_ids
            page.tabs[page.tabId] = "";
            page.currentTabId = page.tabId;
            page.tabId = page.tabId + 1;
            return obj;
        }
        
        page.createEditBillView = function (billNo) {
            //Add tab and panel
            var tabText = typeof billNo == "undefined" ? "New * : 0.00" : "Bill " + billNo + " : 0.00";
            $('<li index="' + page.tabId + '" ><a target="#bill_' + page.tabId + '"  style="padding-top: 1px;    padding-bottom: 0px;    height: auto;">' + tabText + '</a><button style="background-color: transparent; border: none;" >x</button></li>').insertBefore($("[controlId=tabBills] hr"));
            $$("tabPanels").append('<div style="display:none"  id="bill_' + page.tabId + '">cccccccc' + page.tabId + '</div>');
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                var nextTab = $(this).closest("li").next();
                if (nextTab.length == 0)
                    nextTab = $(this).closest("li").prev();
                if (nextTab.length == 0) {
                    page.currentTabId = null;
                    page.events.btnBack_click();
                } else {
                    page.currentTabId = parseInt(nextTab.attr("index"));
                    var index = $(this).closest("li").attr("index");
                    $.pageController.unLoadUserControl(page, "bill_" + index);
                    $$("tabPanels").find("[id=bill_" + index + "]").remove();

                    $$("tabBills").selectedObject.find("[index=" + index + "]").remove();
                    delete page.tabs[index];
                }
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] a").click();
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                bill_tab_count--;
                if (bill_tab_count == 0) {
                    page.events.btnBack_click();
                }
            });
            //$$("tabPanels").selectedObject.find('id=bill_' + page.tabId).purchaseBill();
            var obj = $.pageController.loadUserControl(page, $$("tabPanels").find('[id=bill_' + page.tabId + "]"), "bill_" + page.tabId, "purchaseEditBill");

            obj.setMessagePanel($$("msgPanel"));
            obj.closeBill = function () {
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                //page.events.btnNewBill_click();
            }
            obj.launchNewBill = function () {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                page.events.btnNewBill_click();
                bill_tab_count++;
            }
            obj.setBillAmount = function (amount) {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                var tabText = $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html();

                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html(tabText.split(":")[0] + ": " + amount);
            }

            obj.printBill = function (bill) {
                //page.events.btnPrintBill_click(bill);
                page.jasperPrint(bill, "PDF");
            }
            obj.currentProductList = page.productList;
            //Store bil_ids
            page.tabs[page.tabId] = "";
            page.currentTabId = page.tabId;
            page.tabId = page.tabId + 1;
            return obj;
        }
        page.createAdjustmentBillView = function (billNo) {
            //Add tab and panel
            var tabText = typeof billNo == "undefined" ? "New * : 0.00" : "Bill " + billNo + " : 0.00";
            $('<li index="' + page.tabId + '" ><a target="#bill_' + page.tabId + '"  style="padding-top: 1px;    padding-bottom: 0px;    height: auto;">' + tabText + '</a><button style="background-color: transparent; border: none;" >x</button></li>').insertBefore($("[controlId=tabBills] hr"));
            $$("tabPanels").append('<div style="display:none"  id="bill_' + page.tabId + '">cccccccc' + page.tabId + '</div>');
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                var nextTab = $(this).closest("li").next();
                if (nextTab.length == 0)
                    nextTab = $(this).closest("li").prev();
                if (nextTab.length == 0) {
                    page.currentTabId = null;
                    page.events.btnBack_click();
                } else {
                    page.currentTabId = parseInt(nextTab.attr("index"));
                    var index = $(this).closest("li").attr("index");
                    $.pageController.unLoadUserControl(page, "bill_" + index);
                    $$("tabPanels").find("[id=bill_" + index + "]").remove();

                    $$("tabBills").selectedObject.find("[index=" + index + "]").remove();
                    delete page.tabs[index];
                }
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] a").click();
            var obj = $.pageController.loadUserControl(page, $$("tabPanels").find('[id=bill_' + page.tabId + "]"), "bill_" + page.tabId, "purchaseAdjustment");

            obj.setMessagePanel($$("msgPanel"));
            obj.closeBill = function () {
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
            }
            obj.launchNewBill = function () {
                page.events.btnNewBill_click();
            }
            obj.setBillAmount = function (amount) {
                var tabText = $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html();
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html(tabText.split(":")[0] + ": " + amount);
            }

            obj.printBill = function (bill) {
                page.events.btnPrintBill_click(bill);
            }
            obj.currentProductList = page.productList;
            page.tabs[page.tabId] = "";
            page.currentTabId = page.tabId;
            page.tabId = page.tabId + 1;
            return obj;
        }
        page.createReturnBillView = function (billNo) {
            //Add tab and panel
            var tabText = typeof billNo == "undefined" ? "New * : 0.00" : "Bill " + billNo + " : 0.00";
            $('<li index="' + page.tabId + '" ><a target="#bill_' + page.tabId + '"  style="padding-top: 1px;    padding-bottom: 0px;    height: auto;">' + tabText + '</a><button style="background-color: transparent; border: none;" >x</button></li>').insertBefore($("[controlId=tabBills] hr"));
            $$("tabPanels").append('<div style="display:none"  id="bill_' + page.tabId + '">cccccccc' + page.tabId + '</div>');
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                var nextTab = $(this).closest("li").next();
                if (nextTab.length == 0)
                    nextTab = $(this).closest("li").prev();
                if (nextTab.length == 0) {
                    page.currentTabId = null;
                    page.events.btnBack_click();
                } else {
                    page.currentTabId = parseInt(nextTab.attr("index"));
                    var index = $(this).closest("li").attr("index");
                    $.pageController.unLoadUserControl(page, "bill_" + index);
                    $$("tabPanels").find("[id=bill_" + index + "]").remove();

                    $$("tabBills").selectedObject.find("[index=" + index + "]").remove();
                    delete page.tabs[index];
                }
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] a").click();
            //$$("tabPanels").selectedObject.find('id=bill_' + page.tabId).purchaseBill();
            var obj = $.pageController.loadUserControl(page, $$("tabPanels").find('[id=bill_' + page.tabId + "]"), "bill_" + page.tabId, "purchaseReturn");


            obj.setMessagePanel($$("msgPanel"));
            obj.closeBill = function () {
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                //page.events.btnNewBill_click();
            }
            obj.launchNewBill = function () {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                page.events.btnNewBill_click();
            }
            obj.setBillAmount = function (amount) {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                var tabText = $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html();

                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html(tabText.split(":")[0] + ": " + amount);
            }

            obj.printBill = function (bill) {
                page.events.btnPrintBill_click(bill);
            }
            obj.currentProductList = page.productList;
            //Store bil_ids
            page.tabs[page.tabId] = "";
            page.currentTabId = page.tabId;
            page.tabId = page.tabId + 1;
            return obj;
        }
        page.events.btnBack_click = function () {
            $$("pnlSales").show();
            $$("pnlBill").hide();
            $$("ddlSearchViews").selectedValue(1);
            //$$("grdSales").dataBind({
            //    getData: function (start, end, sortExpression, filterExpression, callback) {
            //        //page.purchaseBillService.getPOAllBill("", "", function (data) {
            //        page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
            //            var totalRecord = data.length;
            //            //page.purchaseBillService.getPOAllBill(start, end, function (data) {
            //            page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
            //                callback(data, totalRecord);
            //            });
            //        });
            //    },
            //    update: function (item, updatedItem) {
            //        for (var prop in updatedItem) {
            //            if (!updatedItem.hasOwnProperty(prop)) continue;
            //            item[prop] = updatedItem[prop];
            //        }
            //    }
            //});
        }


        page.events.btnNewBill_click = function () {            
            var obj = page.createBillView();
            page.temp_obj = obj;
            obj.createBill();
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }

        //Event to make a new Return Entry
        page.events.btnNewReturnBill_click = function (bill) {
            //var obj = page.createBillView(bill.bill_no);
            //obj.returnBill(bill.bill_no);
            //$$("pnlSales").hide()
            //$$("pnlBill").show();
            try {
                if (bill.state_text == "Return")
                    throw "Bill Already Returned";
                if (bill.state_text == "Saved")
                    throw "Bill Not Paid";

                page.currentBillNo = bill.bill_no;
                page.currentVendorNo = bill.vendor_no;
                $$("txtReturnPayDesc").value("CurrentBill");
                $$("dsReturnPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

                var ex_data = [{
                    exp_acc_id: CONTEXT.ExpenseCategory,
                    exp_acc_name: "Loading Charge"
                }];
                page.controls.ddlExpName.dataBind(ex_data, "exp_acc_id", "exp_acc_name", "None");
                
                $$("txtReturnAmount").value("0");
                $$("lblTempReturnAmount").value(0);
                $$("btnReturnPOPItemPopup").show();
                page.controls.pnlReturnPOPPopup.open();
                page.controls.pnlReturnPOPPopup.title("Return Items");
                page.controls.pnlReturnPOPPopup.rlabel("Return Items");
                page.controls.pnlReturnPOPPopup.width(1200);
                page.controls.pnlReturnPOPPopup.height(500);
                //page.purchaseBillService.getReturnedPOPBillByNo(bill.bill_no, function (rdata) {
                page.stockAPI.getBill(bill.bill_no, function (data) {
                    var dataitems = [];
                    $(data.bill_items).each(function (i, item) {
                        if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                            item.free_qty_return = 0;
                        if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                            item.free_qty = 0;
                        var qty_fact = 1;
                        dataitems.push({
                            batch_no: item.batch_no,
                            expiry_date: item.expiry_date,
                            man_date: item.man_date,
                            free_qty: parseFloat(item.free_qty) / parseFloat(qty_fact),
                            free_qty_return: parseFloat(item.free_qty_return)/parseFloat(qty_fact),//item.free_qty_return,
                            item_name: item.item_name,
                            item_name_tr: item.item_name_tr,
                            item_no: item.item_no,
                            item_code: item.item_code,
                            item_price: item.cost,//item.item_price,
                            mrp: item.mrp,
                            ordered_price: item.ordered_price,
                            ordered_qty: parseFloat(item.qty) / parseFloat(qty_fact),//item.ordered_qty,
                            qty: parseFloat(item.qty) / parseFloat(qty_fact), //- parseFloat(item.free_qty),
                            qty_returned: parseFloat(parseFloat(item.qty_returned) / parseFloat(qty_fact)),// - parseFloat(parseFloat(item.free_qty_return) / parseFloat(qty_fact)),//parseFloat(item.qty_returned) - parseFloat(item.free_qty_return),
                            tray_id: item.tray_id,
                            tray_mode: item.tray_mode,
                            cost: item.cost,
                            variation_name: item.variation_name,
                            tax_per: item.tax_per,
                            unit: item.unit,
                            alter_unit:item.alter_unit,
                            unit_identity: "0",
                            alter_unit_fact: item.alter_unit_fact,
                            free_variation: item.free_variation,
                            var_no: item.var_no,
                            free_var_no: item.free_var_no,
                            tax_inclusive: item.tax_inclusive,
                            rack_no: item.rack_no,
                            tax_class_no: item.tax_class_no,
			                additional_tax: 0,
                            cess_qty: item.cess_qty,
                            cess_qty_amount: item.cess_qty_amount,
                            var_attr_key: item.var_attr_key,
                            var_stock_attr_key: item.var_stock_attr_key,
                            sku_no:item.sku_no,
                            attr_type1: item.attr_type1,
                            attr_value1: item.attr_value1,
                            attr_type2: item.attr_type2,
                            attr_value2: item.attr_value2,
                            attr_type3: item.attr_type3,
                            attr_value3: item.attr_value3,
                            attr_type4: item.attr_type4,
                            attr_value4: item.attr_value4,
                            attr_type5: item.attr_type5,
                            attr_value5: item.attr_value5,
                            attr_type6: item.attr_type6,
                            attr_value6: item.attr_value6,
                        });
                    })
                    page.controls.grdReturnPOPItems.rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdReturnPOPItems.allData().length);

                        var attrTemplate = [];
                        if (item.var_stock_attr_key.includes("1")) {
                            attrTemplate.push("<input dataField='attr_value1' style='width:80px;' placeholder='" + attr_list[0].attr_name + "' >");
                        }
                        if (item.var_stock_attr_key.includes("2")) {
                            attrTemplate.push("<input type='text' dataField='attr_value2' style='width:80px;' placeholder='" + attr_list[1].attr_name + "' >");
                        }
                        if (item.var_stock_attr_key.includes("3")) {
                            attrTemplate.push("<input type='text' dataField='attr_value3' style='width:80px;' placeholder='" + attr_list[2].attr_name + "' >");
                        }
                        if (item.var_stock_attr_key.includes("4")) {
                            attrTemplate.push("<input type='text' dataField='attr_value4' style='width:80px;' placeholder='" + attr_list[3].attr_name + "' >");
                        }
                        if (item.var_stock_attr_key.includes("5")) {
                            attrTemplate.push("<input type='text' dataField='attr_value5' style='width:80px;' placeholder='" + attr_list[4].attr_name + "' >");
                        }
                        if (item.var_stock_attr_key.includes("6")) {
                            attrTemplate.push("<input type='text' dataField='attr_value6' style='width:80px;' placeholder='" + attr_list[5].attr_name + "' >");
                        }
                        $(row).find("[id=Attributes]").html(attrTemplate.join(""));
                        $(row).find("input[dataField=attr_value1]").val(item.attr_value1).change();
                        $(row).find("input[dataField=attr_value2]").val(item.attr_value2).change();
                        $(row).find("input[dataField=attr_value3]").val(item.attr_value3).change();
                        $(row).find("input[dataField=attr_value4]").val(item.attr_value4).change();
                        $(row).find("input[dataField=attr_value5]").val(item.attr_value5).change();
                        $(row).find("input[dataField=attr_value6]").val(item.attr_value6).change();
                        $(row).find("input[dataField=attr_value1]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value2]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value3]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value4]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value5]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value6]").attr("disabled", true);
                        if (item.attr_type1 == "cost" || item.attr_type1 == "vendor_no" || item.attr_type1 == "invoice_no")
                            $(row).find("input[dataField=attr_value1]").css("display", "none");
                        if (item.attr_type2 == "cost" || item.attr_type2 == "vendor_no" || item.attr_type2 == "invoice_no")
                            $(row).find("input[dataField=attr_value2]").css("display", "none");
                        if (item.attr_type3 == "cost" || item.attr_type3 == "vendor_no" || item.attr_type3 == "invoice_no")
                            $(row).find("input[dataField=attr_value3]").css("display", "none");
                        if (item.attr_type4 == "cost" || item.attr_type4 == "vendor_no" || item.attr_type4 == "invoice_no")
                            $(row).find("input[dataField=attr_value4]").css("display", "none");
                        if (item.attr_type5 == "cost" || item.attr_type5 == "vendor_no" || item.attr_type5 == "invoice_no")
                            $(row).find("input[dataField=attr_value5]").css("display", "none");
                        if (item.attr_type6 == "cost" || item.attr_type6 == "vendor_no" || item.attr_type6 == "invoice_no")
                            $(row).find("input[dataField=attr_value6]").css("display", "none");

                        //UNIT DROPDOWN
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
                        //CHANGES MADE IN UNIT
                        $(row).find("[id=itemUnit]").change(function () {
                            if ($(this).val() == "0") {
                                item.free_qty = parseFloat(item.free_qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty]").find("div").html(item.free_qty);
                                item.free_qty_return = parseFloat(item.free_qty_return) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty_return]").find("div").html(item.free_qty_return);
                                item.ordered_qty = parseFloat(item.ordered_qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=ordered_qty]").find("div").html(item.ordered_qty);
                                item.qty = parseFloat(item.qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty]").find("div").html(item.qty);
                                item.qty_returned = parseFloat(item.qty_returned) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty_returned]").find("div").html(item.qty_returned);
                                //item.ret_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                                //$(row).find("[datafield=ret_qty]").find("div").html(item.ret_qty);
                                //item.ret_free = parseFloat(item.ret_free) * parseFloat(item.alter_unit_fact);
                                //$(row).find("[datafield=ret_free]").find("div").html(item.ret_free);
                                item.unit_identity = 0;
                                $(row).find("[datafield=unit_identity]").find("div").html(0);

                                if (item.tray_mode == "SKU") {
                                    item.tray_received = item.qty;
                                    row.find("input[datafield=tray_received]").val(item.tray_received);
                                }
                            }
                            else {
                                item.free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty]").find("div").html(item.free_qty);
                                item.free_qty_return = parseFloat(item.free_qty_return) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty_return]").find("div").html(item.free_qty_return);
                                item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=ordered_qty]").find("div").html(item.ordered_qty);
                                item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty]").find("div").html(item.qty);
                                item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty_returned]").find("div").html(item.qty_returned);
                                //item.ret_qty = parseFloat(item.ret_qty) / parseFloat(item.alter_unit_fact);
                                //$(row).find("[datafield=ret_qty]").find("div").html(item.ret_qty);
                                //item.ret_free = parseFloat(item.ret_free) / parseFloat(item.alter_unit_fact);
                                //$(row).find("[datafield=ret_free]").find("div").html(item.ret_free);
                                item.unit_identity = 1;
                                $(row).find("[datafield=unit_identity]").find("div").html(1);

                                if (item.tray_mode == "SKU") {
                                    item.tray_received = item.qty;
                                    row.find("input[datafield=tray_received]").val(item.tray_received);
                                }
                            }
                            var tot_ret_amount = 0;
                            var ori_qty = 0;
                            if (item.unit_identity == "1") {
                                ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            }
                            else {
                                ori_qty = parseFloat(item.ret_qty);
                            }
                            item.tot_amount = parseFloat(ori_qty) * parseFloat(item.item_price);

                            if (item.cess_qty == "" || item.cess_qty == null || typeof item.cess_qty == "undefined")
                                item.cess_qty = 1;
                            if (item.cess_qty_amount == "" || item.cess_qty_amount == null || typeof item.cess_qty_amount == "undefined")
                                item.cess_qty_amount = 0;
                            item.additional_tax = Math.floor(parseFloat(ori_qty) / parseFloat(item.cess_qty)) * parseFloat(item.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                            if (item.additional_tax == 0) {
                                item.additional_tax = (parseFloat(ori_qty) / parseFloat(item.cess_qty)) * parseFloat(item.cess_qty_amount);
                            }

                            item.tot_amount = parseFloat(item.tot_amount)+parseFloat((item.tot_amount) * parseFloat(item.tax_per) / 100)
                            if (isNaN(item.tot_amount))
                                item.tot_amount = 0;
                            $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                            $(row).find("[datafield=additional_tax]").find("div").html(item.additional_tax.toFixed(5));
                            $(page.controls.grdReturnPOPItems.allData()).each(function (i, row) {
                                if (isNaN(row.tot_amount))
                                    row.tot_amount = 0;
                                tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(row.tot_amount);
                            });
                            tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                            $$("lblTempReturnAmount").value(tot_ret_amount);
                            $$("txtReturnAmount").value(tot_ret_amount);
                        });

                        if (item.tray_id == "-1" || item.tray_id == null) {
                            row.find("div[datafield=tray_received]").css("visibility", "hidden");
                        }
                        //Handle quantity change and recalculate
                        row.on("change", "input[datafield=ret_qty]", function () {
                            var tot_ret_amount = 0;
                            var ori_qty = 0;
                            if (item.unit_identity == "1") {
                                ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            }
                            else {
                                ori_qty = parseFloat(item.ret_qty);
                            }
                            item.tot_amount = parseFloat(ori_qty) * parseFloat(item.item_price);

                            if (item.cess_qty == "" || item.cess_qty == null || typeof item.cess_qty == "undefined")
                                item.cess_qty = 1;
                            if (item.cess_qty_amount == "" || item.cess_qty_amount == null || typeof item.cess_qty_amount == "undefined")
                                item.cess_qty_amount = 0;
                            item.additional_tax = Math.floor(parseFloat(ori_qty) / parseFloat(item.cess_qty)) * parseFloat(item.cess_qty_amount);//parseFloat(poItem.tax_amount) * ;
                            if (item.additional_tax == 0) {
                                item.additional_tax = (parseFloat(ori_qty) / parseFloat(item.cess_qty)) * parseFloat(item.cess_qty_amount);
                            }

                            item.tot_amount = parseFloat(item.tot_amount) + parseFloat((item.tot_amount) * parseFloat(item.tax_per) / 100) + parseFloat(item.additional_tax);
                            if (isNaN(item.tot_amount))
                                item.tot_amount = 0;
                            $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                            $(row).find("[datafield=additional_tax]").find("div").html(item.additional_tax.toFixed(5));
                            $(page.controls.grdReturnPOPItems.allData()).each(function (i, row) {
                                if (isNaN(row.tot_amount))
                                    row.tot_amount = 0;
                                tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(row.tot_amount);
                            });
                            tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                            $$("lblTempReturnAmount").value(tot_ret_amount);
                            $$("txtReturnAmount").value(tot_ret_amount);

                            if (item.tray_mode == "SKU") {
                                item.tray_received = ori_qty;
                                row.find("input[datafield=tray_received]").val(item.tray_received);
                            }
                        });
                        row.on("change", "input[datafield=additional_tax]", function () {
                            var tot_ret_amount = 0;
                            var ori_qty = 0;
                            if (item.unit_identity == "1") {
                                ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            }
                            else {
                                ori_qty = parseFloat(item.ret_qty);
                            }
                            item.tot_amount = parseFloat(ori_qty) * parseFloat(item.item_price);
                            item.tot_amount = parseFloat(item.tot_amount) + parseFloat((item.tot_amount) * parseFloat(item.tax_per) / 100) + parseFloat(item.additional_tax);
                            if (isNaN(item.tot_amount))
                                item.tot_amount = 0;
                            $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                            $(page.controls.grdReturnPOPItems.allData()).each(function (i, row) {
                                if (isNaN(row.tot_amount))
                                    row.tot_amount = 0;
                                tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(row.tot_amount);
                            });
                            tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                            $$("lblTempReturnAmount").value(tot_ret_amount);
                            $$("txtReturnAmount").value(tot_ret_amount);
                        });
                    }
                    $$("grdReturnPOPItems").dataBind(dataitems);
                    $$("grdReturnPOPItems").edit(true);
                });
                $$("grdReturnPOPItems").width("2500px");
                $$("grdReturnPOPItems").height("auto");
                $$("grdReturnPOPItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                        { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", editable: false },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name_tr", visible: CONTEXT.ENABLE_PURCHASE_SECONDARY_LANGUAGE },
                            //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", editable: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                           { 'name': "Stocked", 'rlabel': 'Stocked', 'width': "60px", 'dataField': "qty", editable: false },
                           { 'name': "Returned", 'rlabel': 'Returned', 'width': "90px", 'dataField': "qty_returned", editable: false },
                            { 'name': "Return Qty", 'rlabel': 'Return Qty', 'width': "100px", 'dataField': "ret_qty", editable: true },
                            { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "80px", 'dataField': "free_qty", editable: false, visible: false && CONTEXT.showFree },
                            { 'name': "Returned Free", 'rlabel': 'Returned Free', 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: false && CONTEXT.showFree },
                            { 'name': "Free Item", 'rlabel': 'Free Item', 'width': "100px", 'dataField': "ret_free", editable: true, visible: false && CONTEXT.showFree },
                            { 'name': "Tray", 'rlabel': 'Tray', 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                            //{ 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "GST(%)", 'rlabel': 'GST', 'width': "70px", 'dataField': "tax_per" },

                            { 'name': "Attributes", 'rlabel': 'Attributes', 'width': "500px", itemTemplate: "<div  id='Attributes'></div>" },

                            //{ 'name': "MRP", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            //{ 'name': "Man Date", 'rlabel': 'Man Date', 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            //{ 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            //{ 'name': "Batch No", 'rlabel': 'Batch No', 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
			    { 'name': "Cess Rate", 'rlabel': 'Cess Rate', 'width': "130px", 'dataField': "cess_qty_amount", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                           { 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "130px", 'dataField': "additional_tax", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX },

                            { 'name': "Price to return", 'rlabel': 'Price to return', 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Amount",'rlabel': 'Amount', 'width': "100px", 'dataField': "tot_amount" },
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
			  { 'name': "", 'width': "0px", 'dataField': "cess_qty",visible:false },
                          { 'name': "", 'width': "0px", 'dataField': "attr_type1", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type2", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type3", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type4", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type5", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "attr_type6", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "var_stock_attr_key", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "sku_no", visible: false },
                           { 'name': "", 'width': "0px", 'dataField': "tray_mode", visible: false },
                    ]
                });

                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                    $$("pnlExpenseName").show();
                    $$("pnlExpenseAmount").show();
                }
                else {
                    $$("pnlExpenseName").hide();
                    $$("pnlExpenseAmount").hide();
                }
                $$("txtExpAmount").value("");
                var today = new Date();
                var newdate = new Date();
                newdate.setDate(today.getDate() + parseInt(CONTEXT.DEFAULT_BILL_DUE_DAYS));
                $$("txtBillDueDate").setDate(newdate);
                $$("txtInvoiceNo").value("");
            } catch (e) {
                $$("msgPanel").show(e);
            }
        }

        page.events.btnReturnPOPItemPopup_click = function (overrideItems) {
            $$("btnReturnPOPItemPopup").hide();
            page.events.returnBill(undefined, overrideItems);
        }
        page.events.returnBill = function (overrideItems,billType) {
            try {
                var result = ""
                if (CONTEXT.EnableTotalQtyInBill) {
                    var alldataqty = page.controls.grdReturnPOPItems.allData();
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
                    for (var i in temp) {
                        result = result + temp[i] + ":" + i + "/";
                    }
                }
                var itemlList = page.controls.grdReturnPOPItems.allData();
                if (typeof overrideItems != "undefined")
                    itemlList = overrideItems;

                var returnItems = [];
                var newBill = {
                    bill_no: "0",
                    bill_date: dbDateTime($$("dsReturnPayDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    reg_no: localStorage.getItem("user_register_id"),
                    user_no: localStorage.getItem("app_user_id"),
                    invoice_no: $$("txtInvoiceNo").value(),
                    due_date: dbDateTime($$("txtBillDueDate").getDate()),

                    sub_total: 0,
                    total: 0,
                    discount: 0,
                    tax: 0,

                    bill_type: "PurchaseReturn",
                    state_no: 300, //300 is Return
                    pay_mode: $$("ddlReturnPayBillType").selectedValue(),
                    round_off: 0,
                    sales_tax_no: page.controls.grdSales.selectedData()[0].sales_tax_no,
                    mobile_no: page.controls.grdSales.selectedData()[0].vendor_phone,
                    email_id: page.controls.grdSales.selectedData()[0].vendor_email,
                    gst_no: page.controls.grdSales.selectedData()[0].gst_no,
                    tot_qty_words: result,
                    bill_no_par: page.controls.grdSales.selectedData()[0].bill_no,
                    vendor_no: (page.currentVendorNo == null || page.currentVendorNo == "" || typeof page.currentVendorNo == "undefined")?"":page.currentVendorNo,
                    vendor_name: page.controls.grdSales.selectedData()[0].vendor_name,
                    vendor_address: page.controls.grdSales.selectedData()[0].vendor_address,
                    //FINFACTS ENTRY DATA
                    invent_type: "PurchaseReturnCredit",
                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    //fulfill: true,
                };
                var stockItems = [];
                var lastItemNo = "";
                var lastItem = null;
                var item_tax_val;
                var buying_cost = 0;

                //CHECK THE RETURN AMOUNT
                if (parseFloat($$("txtReturnAmount").value()) > parseFloat($$("lblTempReturnAmount").value())) {
                    throw "Return amount should not be exceed than the actual return amount";
                }
                if (isNaN($$("txtReturnAmount").value()) || parseFloat($$("txtReturnAmount").value())<=0) {
                    throw "Return amount should be a number and non negative";
                }


                var flagNoData = false;
                $(itemlList).each(function (i, item) {
                    //item.unit_identity == "1" ? item.ret_qty = item.ret_qty * item.alter_unit_fact : item.ret_qty = item.ret_qty;
                    //item.unit_identity == "1" ? item.ret_free = isNaN(item.ret_free * item.alter_unit_fact) ? 0 : item.ret_free * item.alter_unit_fact : item.ret_free = item.ret_free;
                    item.unit_identity == "1" ? item.alter_unit_fact = item.alter_unit_fact : item.alter_unit_fact = 1;

                    if (typeof overrideItems != "undefined")
                        item.ret_qty = parseFloat(item.qty) - parseFloat(item.qty_returned);

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

                    if (parseFloat(item.ret_qty) > 0) {
                        //item.item_price = ((parseFloat(item.cost) * parseFloat(item.qty)) * parseFloat(item.disc_per) / 100 + (parseFloat(item.disc_val) * parseFloat(item.qty)))/(parseFloat(item.qty));
                        flagNoData = true;
                        item.ret_qty = item.ret_qty * item.alter_unit_fact;
                        item.ret_free = item.ret_free * item.alter_unit_fact;
                        //Add list for inventory transaction
                        stockItems.push(item);
                        //var tax = (parseFloat(item.ret_qty) * parseFloat(item.buying_cost)) * (item.tax_per / 100);
                        //newBill.tax = newBill.tax + tax;
                        //Add list for return bill with total item returned (when multiple mrp exists)
                        if (true) {//lastItemNo != item.item_no
                            lastItem = item;
                            lastItem.fin_ret_qty = parseFloat(item.ret_qty);
                            lastItem.fin_ret_free = parseFloat(item.ret_free);
                            lastItem.fin_total_price = parseFloat(item.ret_qty) * parseFloat(item.item_price);
                            lastItem.sum_qty_returned = parseFloat(item.qty_returned);
                            returnItems.push(item);
                            lastItemNo = item.item_no;
                        }
                        else {
                            lastItem.fin_ret_qty = parseFloat(lastItem.fin_ret_qty) + parseFloat(item.ret_qty);
                            lastItem.fin_ret_free = parseFloat(lastItem.fin_ret_free) + parseFloat(item.ret_free);
                            lastItem.fin_total_price = parseFloat(lastItem.fin_ret_qty) * parseFloat(item.item_price);
                            lastItem.sum_qty_returned = lastItem.sum_qty_returned + parseFloat(item.qty_returned);
                        }

                        if (typeof overrideItems != "undefined") {
                            //For bill overriding. Return all item bill but Destock only stocked item
                            lastItem.fin_ret_qty = parseFloat(item.ordered_qty) - parseFloat(lastItem.sum_qty_returned);
                            lastItem.fin_ret_free = parseFloat(item.free_qty) - parseFloat(lastItem.free_qty_return);
                            lastItem.fin_total_price = parseFloat(item.fin_ret_qty) * parseFloat(item.item_price);

                            //Calculate Tax
                            item_tax_val = parseFloat((parseFloat(lastItem.fin_ret_qty) * parseFloat(item.cost) * item.tax_per / 100)+parseFloat(item.additional_tax)).toFixed(5);
                            newBill.tax = parseFloat(parseFloat(newBill.tax) + parseFloat(item_tax_val)).toFixed(5);

                            //Calculate bill total value
                            newBill.sub_total = newBill.sub_total + parseFloat(lastItem.fin_ret_qty) * parseFloat(item.cost);


                            newBill.total = parseFloat(newBill.sub_total) + parseFloat(newBill.tax);

                            var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(newBill.total)).toFixed(5);
                            newBill.round_off = round_off;
                            newBill.total = total_after_Rnd_off;

                            buying_cost = buying_cost + parseFloat(lastItem.fin_ret_qty) * parseFloat(item.cost);
                        }
                        else {
                            item_tax_val = parseFloat(parseFloat(item.ret_qty) * parseFloat(item.item_price) * item.tax_per / 100).toFixed(5);
                            newBill.tax = parseFloat((parseFloat(newBill.tax) + parseFloat(item_tax_val)) + parseFloat(item.additional_tax)).toFixed(5);
                            //Calculate bill total value
                            //sub_total = (newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(item.item_price)) - newBill.tax;
                            newBill.sub_total = newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(item.item_price);

                            newBill.total = parseFloat(newBill.sub_total) + parseFloat(newBill.tax);

                            var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(newBill.total)).toFixed(5);
                            newBill.round_off = round_off;
                            newBill.total = total_after_Rnd_off;

                            buying_cost = buying_cost + parseFloat(item.ret_qty) * parseFloat(item.item_price);
                        }
                    }
                });
                
                if (flagNoData == false)
                    throw "No return quantity is specified";

                    var rbillItems = [];
                    $(returnItems).each(function (i, billItem) {
                        rbillItems.push({
                            sl_no: i + 1,

                            qty: billItem.fin_ret_qty,
                            unit_identity: billItem.unit_identity,
                            price: billItem.cost,
                            disc_val: "0",
                            disc_per: "0",
                            taxable_value: (parseFloat(billItem.fin_total_price) * parseFloat(billItem.tax_per)) / 100,
                            tax_per: billItem.tax_per,
                            tax_class_no:billItem.tax_class_no,
                            total_price: billItem.fin_total_price,
                            bill_type: "PurchaseReturn",
                            store_no: getCookie("user_store_id"),
                            item_no: billItem.item_no,
                            cost: billItem.cost,
                            vendor_no: page.currentVendorNo,
                            var_no: billItem.var_no,
                            tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined" || billItem.tray_received == 0) ? "0" : ""+billItem.tray_received+"",
                            tray_mode:"SKU",
                            tray_id: billItem.tray_id,
                            tray_trans_type: "Vendor Return",
                            trans_type: "Vendor Return",
                            comp_id: localStorage.getItem("user_company_id"),
                            item_name: billItem.item_name,
                            amount: parseFloat(billItem.item_price) * parseFloat(billItem.fin_ret_qty),

                            //Item Stock Entry
                            mrp: billItem.mrp,
                            batch_no: billItem.batch_no,
                            man_date: (billItem.man_date == null || billItem.man_date == "" || typeof billItem.man_date == "undefined") ? "" : dbDateTime(billItem.man_date),
                            expiry_date: (billItem.expiry_date == null || billItem.expiry_date == "" || typeof billItem.expiry_date == "undefined") ? "" : dbDateTime(billItem.expiry_date),
			                additional_tax:billItem.additional_tax,
                            sku_no: billItem.sku_no,
                            attr_type1: billItem.attr_type1,
                            attr_value1: billItem.attr_value1,
                            attr_type2: billItem.attr_type2,
                            attr_value2: billItem.attr_value2,
                            attr_type3: billItem.attr_type3,
                            attr_value3: billItem.attr_value3,
                            attr_type4: billItem.attr_type4,
                            attr_value4: billItem.attr_value4,
                            attr_type5: billItem.attr_type5,
                            attr_value5: billItem.attr_value5,
                            attr_type6: billItem.attr_type6,
                            attr_value6: billItem.attr_value6,
                            var_attr_key: billItem.var_attr_key,
                            var_stock_attr_key: billItem.var_stock_attr_key
                        });
                        if (CONTEXT.showFree) {
                            if (billItem.free_qty == undefined || billItem.free_qty == null || billItem.free_qty == "") {
                                rbillItems[rbillItems.length - 1].free_qty = "0";
                            }
                            else {
                                rbillItems[rbillItems.length - 1].free_qty = billItem.fin_ret_free;
                            }
                        }
                        else {
                            rbillItems[rbillItems.length - 1].free_qty = "0";
                        }
                        if (CONTEXT.showFree && CONTEXT.enableFreeVariation) {
                            if (billItem.free_var_no == undefined || billItem.free_var_no == null || billItem.free_var_no == "") {
                                rbillItems[rbillItems.length - 1].free_var_no = "";
                            }
                            else {
                                rbillItems[rbillItems.length - 1].free_var_no = billItem.free_var_no;
                            }
                        }
                    });
                    newBill.bill_items = rbillItems;
                    var billSO = [];
                    billSO.push({
                        collector_id: CONTEXT.user_no,
                        pay_desc: "POP Bill Return Payment",
                        amount: Math.round(parseFloat($$("txtReturnAmount").value())),
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_type: "PurchaseReturn",
                        pay_mode: page.controls.ddlReturnPayBillType.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: ""
                    });
                    newBill.payments = billSO;
                    var expense = [];
                    expense.push(
                        {
                        exp_name: $$("ddlExpName").selectedValue(),
                        amount: $$("txtExpAmount").value()
                    });
                    newBill.expenses = expense;
                    page.stockAPI.insertBill(newBill, function (data) {
                        page.currentReturnBillNo = data;
                        var round_off = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount) + parseFloat(newBill.tax));
                        var p_with_tax = (parseFloat(newBill.sub_total));
                        var data1 = {
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            description: "POP Return-" + page.currentReturnBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            target_acc_id: ($$("ddlReturnPayBillType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                            pur_with_out_tax: parseFloat(p_with_tax).toFixed(5),
                            tax_amt: parseFloat(newBill.tax).toFixed(5),
                            buying_cost: buying_cost,
                            round_off: parseFloat(Math.round(parseFloat(round_off)) - parseFloat(round_off)).toFixed(5),
                            key_1: page.currentReturnBillNo,
                            key_2: newBill.vendor_no,
                        };
                        var data2={
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                            paid_amount: Math.round(parseFloat($$("txtReturnAmount").value())),
                            description: "POP Return-" + page.currentReturnBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            key_1: page.currentReturnBillNo,
                        };
                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                          //  page.inventoryService.insertStocks(0, newBill.bill_items, page.currentReturnBillNo, function (temp) { });
                            $$("msgPanel").show('Updating Finfacts!');
                            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                                if ($$("txtExpAmount").value() != "" && $$("txtExpAmount").value() != null && $$("txtExpAmount").value() != undefined) {
                                    var expenseData1 = {
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_CREDITOR,//CONTEXT.ExpenseAccount,
                                        expense_acc_id: CONTEXT.ExpenseCategory,//CONTEXT.ExpenseCategory,
                                        amount: $$("txtExpAmount").value(),//$$("txtExpense").value(),
                                        description: "POP Return Expense-" + page.currentBillNo + $$("ddlExpName").selectedValue(),
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        key_1: page.currentReturnBillNo,
                                        key_2: newBill.vendor_no,
                                    };
                                    //page.accService.insertBillIncome(expenseData1, function (response) { });
                                    page.finfactsEntryAPI.insertBillIncome(expenseData1, function (response) { });
                                }
                            }
                            if (parseFloat($$("txtReturnAmount").value()) == parseFloat($$("lblTempReturnAmount").value())) {
                                page.finfactsEntryAPI.cashReturnPurchase(data1, function (response) {
                                    if (billType != "Cancel")
                                        page.controls.pnlReturnPOPPopup.close();
                                    $$("msgPanel").flash('Finfacts entry updated!');
                                    alert("Successfully returned");
                                    //page.purchaseBillService.getAllBill(function (data) {
                                    //page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    //    page.view.salesList(data);
                                    //});
                                });
                            }
                            else {
                                page.finfactsEntryAPI.creditReturnPurchase(data1, function (response) {
                                    page.finfactsEntryAPI.creditReturnPurchasePayment(data2, function (response) {
                                        if (billType != "Cancel")
                                            page.controls.pnlReturnPOPPopup.close();
                                        $$("msgPanel").flash('Finfacts entry updated!');
                                        alert("Successfully returned");
                                        //page.purchaseBillService.getAllBill(function (data) {
                                        //page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                        //    page.view.salesList(data);
                                        //});
                                    });
                                });
                            }
                        }
                        else {
                            if (billType != "Cancel")
                                page.controls.pnlReturnPOPPopup.close();
                            $$("msgPanel").flash('Finfacts entry updated!');
                            alert("Successfully returned");
                            //page.purchaseBillService.getAllBill(function (data) {
                            //page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            //    page.view.salesList(data);
                            //});
                        }
                        //if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                        //    page.addTray(newBill);
                        //}
                        if ($$("chkPrintBill").prop("checked")) {
                            if (CONTEXT.ENABLE_JASPER) {
                                page.jasperPrint(page.currentReturnBillNo, "PDF");
                            }
                        }
                        $$("msgPanel").hide();
                        //page.purchaseBillService.getAllBill(function (data) {
                        //page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                        //    page.view.salesList(data);
                        //});
                        page.events.btnBack_click();
                    });
            }
            catch (e) {
                alert(e);
                $$("btnReturnPOPItemPopup").show();
            }
        }
        
        page.events.btnPendingPayment_click = function () {
            $$("btnPayPending").disable(false);
            $$("btnPayPending").show();
            page.controls.pnlPayPending.open();
            page.controls.pnlPayPending.title("Pending Payment Screen");
            page.controls.pnlPayPending.rlabel("Pending Payment Screen");
            page.controls.pnlPayPending.width(1000);
            page.controls.pnlPayPending.height(500);
            page.view.selectedPendingPayment([]);
            $$("pnlCardType").hide();
            $$("pnlCouponNo").hide();
            $$("pnlCardNo").hide();
            //$$("ddlPayMode").selectedValue("");
            $$("ddlPayBillType").selectedValue("Select");

            //page.vendorService.getActiveVendor(function (data) {
            page.vendorAPI.searchValues("", "", "", "", function (data) {
                $$("ddlSuppName").dataBind(data, "value", "label", "All");
            });
            //page.reportService.getStoreByComp(function (data) {
            //    $$("ddlStore").dataBind(data, "store_no", "store_name", "All");
            //});
            $$("txtPendingPayDesc").value("CurrentBill");
            $$("dsPendingPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

            $$("ddlSuppName").selectionChange(function () {
                $$("ddlPayBillType").selectedValue("Select");
                $$("ddlBillView").selectedValue("Bill View");
            });
            $$("ddlBillView").selectionChange(function () {
                page.controls.grdPendingPayment.dataBind([]);
                var loan_data = {};
                loan_data.vendor_no = $$("ddlSuppName").selectedValue() == -1 ? "" : $$("ddlSuppName").selectedValue();
                loan_data.store_no = $$("ddlStore").selectedValue() == -1 ? "" : $$("ddlStore").selectedValue();
                loan_data.bill_type = $$("ddlPayBillType").selectedValue();

                if ($$("ddlBillView").selectedValue() == "Payment View" && $$("ddlPayBillType").selectedValue() != "Select") {
                    page.purchaseBillService.getPaymentWise(loan_data, function (data) {
                        $$("grdPendingPayment").width("100%");
                        $$("grdPendingPayment").height("220px");
                        $$("grdPendingPayment").setTemplate({
                            selection: "Single",
                            columns: [
                                //{ 'name': "Bill No", 'rlabel': 'Bill No', 'width': "60px", 'dataField': "bill_no" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "60px", 'dataField': "bill_id" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                                { 'name': "Bill Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "total" },
                                { 'name': "Payment Date", 'rlabel': 'Payment Date', 'width': "130px", 'dataField': "pay_date" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance" },
                                { 'name': "Total Paid", 'rlabel': 'Paid', 'width': "130px", 'dataField': "total_paid" },
                                { 'name': "Amount ", 'rlabel': 'Amount', 'width': "100px", 'dataField': "amount" },
                                { 'name': "", 'width': "100%", itemTemplate: "<div class='header'></div>" },
                            ]
                        });
                        page.controls.grdPendingPayment.dataBind(data);
                    });
                }
                else {
                    var filter = {};
                    filter.viewMode = "Standard";
                    filter.fromDate = "";
                    filter.toDate = "";
                    filter.bill_type = $$("ddlPayBillType").selectedValue();
                    filter.item_no = "";
                    filter.state_no = "";
                    filter.store_no = "";
                    filter.vendor_no = $$("ddlSuppName").selectedValue() == -1 ? "-1" : $$("ddlSuppName").selectedValue();
                    $$("msgPanel").show("Loading...");
                    var payment_data = [];
                    //page.purchaseBillService.getPendingReport(filter, function (data) {
                    if (filter.vendor_no == "-1") {
                        page.purchaseBillAPI.searchValues("", "", "b.bill_type like '" + filter.bill_type + "'", "bill_no desc", function (data) {
                            $(data).each(function (i, item) {
                                if (parseFloat(item.balance) != 0) {
                                    payment_data.push({
                                        bill_no: item.bill_no,
                                        bill_id: item.bill_id,
                                        bill_date: item.bill_date,
                                        total: item.total,
                                        total_paid_amount: item.paid,
                                        balance: parseFloat(item.total) - parseFloat(item.paid)
                                    })
                                }
                            })
                            page.view.selectedPendingPayment(payment_data);
                            $$("msgPanel").hide();
                        });
                    }
                    else {
                        page.purchaseBillAPI.searchValues("", "", "b.bill_type like '" + filter.bill_type + "' and b.vendor_no=" + filter.vendor_no, "bill_no desc", function (data) {
                            $(data).each(function (i, item) {
                                if (parseFloat(item.balance) != 0) {
                                    payment_data.push({
                                        bill_no: item.bill_no,
                                        bill_id: item.bill_id,
                                        bill_date: item.bill_date,
                                        total: item.total,
                                        total_paid_amount: item.paid,
                                        balance: parseFloat(item.total) - parseFloat(item.paid)
                                    })
                                }
                            })
                            page.view.selectedPendingPayment(payment_data);
                            $$("msgPanel").hide();
                        });
                    }
                }
            });
            $$("ddlPayBillType").selectionChange(function () {
                //Get the all bill details
                var filter = {};
                filter.viewMode = "Standard";
                filter.fromDate = "";
                filter.toDate = "";
                filter.bill_type = $$("ddlPayBillType").selectedValue();
                filter.item_no = "";
                filter.state_no = "";
                filter.store_no = "";
                filter.vendor_no = $$("ddlSuppName").selectedValue() == -1 ? "-1" : $$("ddlSuppName").selectedValue();
                $$("msgPanel").show("Loading...");
                var payment_data = [];
                //page.purchaseBillService.getPendingReport(filter, function (data) {
                if (filter.vendor_no == "-1") {
                    page.purchaseBillAPI.searchValues("", "", "b.bill_type like '" + filter.bill_type + "'", "bill_no desc", function (data) {
                        $(data).each(function (i, item) {
                            if (parseFloat(item.balance) != 0) {
                                payment_data.push({
                                    bill_no: item.bill_no,
									bill_id:item.bill_id,
                                    bill_date: item.bill_date,
                                    total: item.total,
                                    total_paid_amount: item.paid,
                                    balance: parseFloat(item.total) - parseFloat(item.paid)
                                })
                            }
                        })
                        page.view.selectedPendingPayment(payment_data);
                        $$("msgPanel").hide();
                    });
                }
                else {
                    page.purchaseBillAPI.searchValues("", "", "b.bill_type like '" + filter.bill_type + "' and b.vendor_no=" + filter.vendor_no, "bill_no desc", function (data) {
                        $(data).each(function (i, item) {
                            if (parseFloat(item.balance) != 0) {
                                payment_data.push({
                                    bill_no: item.bill_no,
									bill_id:item.bill_id,
                                    bill_date: item.bill_date,
                                    total: item.total,
                                    total_paid_amount: item.paid,
                                    balance: parseFloat(item.total) - parseFloat(item.paid)
                                })
                            }
                        })
                        page.view.selectedPendingPayment(payment_data);
                        $$("msgPanel").hide();
                    });
                }
            })

            $$("ddlPayMode").selectionChange(function () {
                if ($$("ddlPayMode").selectedValue() == "Cash") {
                    $$("pnlCardType").hide();
                    $$("pnlCardNo").hide();
                    $$("pnlCouponNo").hide();
                }
                if ($$("ddlPayMode").selectedValue() == "Card") {
                    $$("pnlCardType").show();
                    $$("pnlCouponNo").hide();
                    $$("pnlCardNo").show();
                }
                //if ($$("ddlPayMode").selectedValue() == "Coupon") {
                //    $$("pnlCardType").hide();
                //    $$("pnlCouponNo").show();
                //    $$("pnlCardNo").hide();
                //}
            })

        }

        page.events.btnPayPending_click = function () {
            $$("btnPayPending").disable(true);
            $$("btnPayPending").hide();
            var allBillSO = [];
            var data1 = [];
            var expenseData1 = [];
            try {
                var countNoAmount = false;
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    //if (item.amount_pay != 0 && item.amount_pay != "" && item.amount_pay != undefined) {
                    //    countNoAmount = countNoAmount + 1;
                    //}
                    if (parseFloat(item.amount_pay) < 0)
                        countNoAmount = true;
                    if (parseFloat(item.balance) == 0)
                        countNoAmount = true;
                    if (parseFloat(item.amount_pay) > parseFloat(item.balance))
                        countNoAmount = true;
                });
                if (countNoAmount)
                    throw "Please check the amount...!";
                if (($$("ddlPayMode").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                    throw "Card no should be mantatory";
                if (($$("ddlPayMode").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                    throw "Coupon no should be mantatory";
                if ($$("ddlPayMode").selectedValue() == "" || $$("ddlPayMode").selectedValue() == null)
                    throw "Select mode of pay...!";
                //Get all payment details in grid
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (parseFloat(item.amount_pay) > 0) {
                        page.expense_amt = item.expense_amt;
                        allBillSO.push({
                            bill_no: item.bill_no,
                            collector_id: CONTEXT.user_no,
                            pay_desc: "POP Bill Payment",
                            amount: item.amount_pay,
                            pay_date: dbDateTime($$("dsPendingPayDate").getDate()),
                            pay_type: $$("ddlPayBillType").selectedValue(),
                            pay_mode: $$("ddlPayMode").selectedValue(),
                        });
                        if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                            data1.push({
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POP-" + item.bill_no,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: item.bill_no,
                            });

                        }
                        if ($$("ddlPayBillType").selectedValue() == "PurchaseReturn") {
                            data1.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT : CONTEXT.FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "Purchase Return-" + item.bill_no,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: item.bill_no,
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                    }
                }); 
                //page.purchaseService.payAllPendingPayments(0,allBillSO, function (data) {
                page.purchaseBillPaymentAPI.postAllValue(0, allBillSO, function (data) {
                    //If finfacts module is enabled then make entry in finfacts.
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        if ($$("ddlPayBillType").selectedValue() == "Purchase") {
                            alert("Updating Finfacts...");
                            page.finfactsEntryAPI.allcreditPurchasePayment(0, data1, function (response) {
                                //page.finfactsService.insertAllReceipt(0, data1, function (response) {
                                //if (page.expense_amt > parseFloat(0)) {
                                //    var expenseData1 = {
                                //        per_id: CONTEXT.PeriodId,
                                //        target_acc_id: CONTEXT.ExpenseAccountDebtor,
                                //        expense_acc_id: CONTEXT.ExpenseCategory,
                                //        amount: $$("txtExpense").value(),
                                //        description: "POS Expense-" + currentBillNo,
                                //        jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                //        comp_id: localStorage.getItem("user_company_id"),
                                //        key_1: currentBillNo,
                                //        key_2: $$("txtCustomerName").selectedValue(),
                                //    };
                                //    page.accService.insertExpense(expenseData1, function (response) { });
                                //}
                                alert("POP payment is recorded successfully.");
                                //alert("Successfully Paid...");
                                ShowDialogBox('Message', 'Successfully paid...!', 'Ok', '', null);
                                page.controls.pnlPayPending.close();
                                //page.purchaseBillService.getAllBill(function (data) {
                                page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    page.view.salesList(data);
                                });
                            });
                        }
                        else {
                            $$("msgPanel").show("Updating Finfacts...");
                            //page.finfactsService.insertAllReturnReceipt(0, data1, function (response) {
                            //page.finfactsEntry.allcreditReturnPurchasePayment(0, data1, function (response) {
                            page.finfactsEntryAPI.allcreditReturnPurchasePayment(0, data1, function (response) {
                                alert("POP payment is returned successfully.");
                                //alert("Successfully Paid...");
                                //ShowDialogBox('Message', 'Successfully paid...!', 'Ok', '', null);
                                page.controls.pnlPayPending.close();
                                //page.purchaseBillService.getAllBill(function (data) {
                                page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    page.view.salesList(data);
                                });
                            });
                        }
                    }
                    else {
                        alert("POP payment is recorded successfully.");
                        //alert("Successfully Paid...");
                       // ShowDialogBox('Message', 'Successfully paid...!', 'Ok', '', null);
                        page.controls.pnlPayPending.close();
                        //page.purchaseBillService.getAllBill(function (data) {
                        page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            page.view.salesList(data);
                        });
                        callback();
                    }
                });

            } catch (e) {
                alert(e);
                //ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayPending").disable(false);
                $$("btnPayPending").show();
            }

        },
        page.addTray = function (newBill) {
            try {
                var trayItems = [];
                $(page.controls.grdReturnPOPItems.allData()).each(function (i, item) {

                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null && item.tray_id != "-1" && typeof item.tray_id != "undefined")
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Vendor Return",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                cust_id: newBill.vendor_no,
                                bill_id: page.currentReturnBillNo,
                                store_no: localStorage.getItem("user_store_no")
                            });
                });
                //page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {});
                page.eggtraytransAPI.postAllValues(0, trayItems, function (data) {});

            } catch (e) {
                //page.msgPanel.flash(e);
            }
        }

        page.events.btnOpenBill_click = function (bill) {
            //var obj = page.createBillView(bill.bill_no);
            var obj = page.createBillView(bill.bill_id);
            page.temp_obj = obj;
            obj.viewBill(bill.bill_no);
            //obj.viewBill(bill.bill_id);
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnBillEdit_click = function (bill) {
            //var obj = page.createEditBillView(bill);
            //page.temp_obj = obj;
            //obj.viewBill(bill);
            //bill_tab_count++;
            //$$("pnlSales").hide();
            //$$("pnlBill").show();
            //var obj = page.createBillView(bill.bill_no);
            var obj = page.createBillView(bill.bill_id);
            page.temp_obj = obj;
            obj.editBill(bill.bill_no);
            //obj.editBill(bill.bill_id);
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnReturnBill_click = function (bill) {
            var obj = page.createReturnBillView(bill.bill_no);
            obj.viewBill(bill.bill_no, bill);
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnAdjustmentBill_click = function (bill) {
            var obj = page.createAdjustmentBillView(bill.bill_no);
            obj.viewBill(bill.bill_no);
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnCancelBill_click = function (bill) {
            try {
                if (bill.state_text == "Return")
                    throw "Bill Already Returned";
                if (bill.state_text == "Saved")
                    throw "Bill Not Paid";

                page.currentBillNo = bill.bill_no;
                page.currentVendorNo = bill.vendor_no;
                $$("txtReturnPayDesc").value("CurrentBill");
                $$("dsReturnPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

                $$("txtReturnAmount").value("0");
                $$("lblTempReturnAmount").value(0);
                $$("btnReturnPOPItemPopup").show();
                page.purchaseBillService.getReturnedPOPBillByNo(bill.bill_no, function (rdata) {
                    var dataitems = [];
                    $(rdata).each(function (i, item) {
                        if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                            item.free_qty_return = 0;
                        if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                            item.free_qty = 0;
                        var qty_fact = 1;
                        dataitems.push({
                            batch_no: item.batch_no,
                            expiry_date: item.expiry_date,
                            man_date: item.man_date,
                            free_qty: parseFloat(item.free_qty) / parseFloat(qty_fact),
                            free_qty_return: parseFloat(item.free_qty_return) / parseFloat(qty_fact),//item.free_qty_return,
                            item_name: item.item_name,
                            item_no: item.item_no,
                            item_price: item.item_price,
                            mrp: item.mrp,
                            ordered_price: item.ordered_price,
                            ordered_qty: parseFloat(item.ordered_qty) / parseFloat(qty_fact),//item.ordered_qty,
                            qty: parseFloat(item.qty) / parseFloat(qty_fact), //- parseFloat(item.free_qty),
                            qty_returned: parseFloat(parseFloat(item.qty_returned) / parseFloat(qty_fact)),// - parseFloat(parseFloat(item.free_qty_return) / parseFloat(qty_fact)),//parseFloat(item.qty_returned) - parseFloat(item.free_qty_return),
                            tray_id: item.tray_id,
                            cost: item.cost,
                            variation_name: item.variation_name,
                            tax_per: item.tax_per,
                            unit: item.unit,
                            alter_unit: item.alter_unit,
                            unit_identity: "0",
                            alter_unit_fact: item.alter_unit_fact,
                            free_variation: item.free_variation,
                            var_no: item.var_no,
                            free_var_no: item.free_var_no,
                            tax_inclusive: item.tax_inclusive,
                            rack_no: item.rack_no,
                            ret_qty: item.qty,
                            ret_free_qty: item.free_qty
                        });
                    })
                    page.controls.grdReturnPOPItems.rowBound = function (row, item) {
                    }
                    $$("grdReturnPOPItems").dataBind(dataitems);
                    $$("grdReturnPOPItems").edit(true);
                    page.controls.lblTempReturnAmount.value(bill.total);
                    page.controls.txtReturnAmount.value(bill.total);
                    page.events.btnReturnPOPItemPopup_click("Cancel");
                });
                $$("grdReturnPOPItems").width("0px");
                $$("grdReturnPOPItems").height("0px");
                $$("grdReturnPOPItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                        { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", editable: false },
                            //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", editable: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                           { 'name': "Stocked", 'rlabel': 'Stocked', 'width': "60px", 'dataField': "qty", editable: false },
                           { 'name': "Returned", 'rlabel': 'Returned', 'width': "90px", 'dataField': "qty_returned", editable: false },
                            { 'name': "Return Qty", 'rlabel': 'Return Qty', 'width': "100px", 'dataField': "ret_qty", editable: true },
                            { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.showFree },
                            { 'name': "Returned Free", 'rlabel': 'Returned Free', 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.showFree },
                            { 'name': "Free Item", 'rlabel': 'Free Item', 'width': "100px", 'dataField': "ret_free", editable: true, visible: CONTEXT.showFree },
                            { 'name': "Tray", 'rlabel': 'Tray', 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "GST(%)", 'rlabel': 'GST', 'width': "70px", 'dataField': "tax_per" },
                            { 'name': "Cess Rate", 'rlabel': 'Cess Rate', 'width': "130px", 'dataField': "tax_amount", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.SHOW_POP_GROSS_AMOUNT },
                           { 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "130px", 'dataField': "additional_tax", editable: true, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POPShowMore },
                            { 'name': "MRP", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Man Date", 'rlabel': 'Man Date', 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Expiry Date", 'rlabel': 'Expiry Date', 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "Price to return", 'rlabel': 'Price to return', 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "tot_amount" },
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
            } catch (e) {
                $$("msgPanel").show(e);
            }
        }
        page.events.btnSendMail_click = function (bill) {
            var payMode = "";
            if (CONTEXT.ENABLE_EMAIL == "true") {
                try {
                    if (bill.vendor_no == null || bill.vendor_no == "" || typeof bill.vendor_no == "undefined") {
                        throw "Vendor Not Selected For Sending Email";
                    }
                    else if (bill.vendor_email == null || bill.vendor_email == "" || typeof bill.vendor_email == "undefined")
                        throw "Email id is not provided for the vendor";
                    else {
                        var itemLists = [];
                        page.purchaseBillService.getPOSBillItem(bill.bill_no, function (billItems) {
                                    $(billItems).each(function (i, item) {
                                        //itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.qty, "unit": item.unit, "price": item.cost, "dis_per": item.disc_per, "dis_val": item.disc_val, "tax_per": item.tax_per, "totalPrice": item.total_price, });
                                        itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.qty, "unit": item.unit, "price": item.cost, "discount": item.disc_val,"totalPrice": item.total_price, });
                                        //itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.qty, "unit": item.unit, "price": item.cost, "discount": item.disc_val, "totalPrice": item.total_price });
                                    });

                                    var accountInfosp = {
                                        //"billNo": bill.bill_no,
                                        //"billDate": bill.bill_date,
                                        "appName": CONTEXT.COMPANY_NAME,
                                        "companyId": localStorage.getItem("user_company_id"),
                                        "orderedDate": bill.bill_date,
                                        "deliveredDate": bill.bill_date,
                                        "expectedDate": bill.bill_date,
                                        "purchaseOrderNo": bill.bill_no,
                                        "purchaseOrderStatus": "",
                                        "shippingAddress": "",
                                        "deliveryAddress": "",
                                        //"2015-03-25T12:00:00Z",
                                        
                                        
                                        "clientAddress": CONTEXT.party_address,
                                        "vendorNumber": bill.vendor_no,
                                        "vendorName": bill.vendor_name,
                                        "tax": bill.tax,
                                        "subTotal": bill.sub_total,
                                        "discount": bill.discount,
                                        "totalPaid": bill.total,
                                        //"2300",
                                        "emailAddressList": [bill.vendor_email],

                                        "billItemList": itemLists,
                                    };
                                    var accountInfoposJson = JSON.stringify(accountInfosp);

                                    $.ajax({
                                        type: "POST",
                                        //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/pos-bill",
                                        url: CONTEXT.POEmailURL,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        crossDomain: false,
                                        data: JSON.stringify(accountInfosp),
                                        dataType: 'json',
                                        success: function (responseData, status, xhr) {
                                            console.log(responseData);
                                            $(".detail-info").progressBar("hide");
                                            $$("msgPanel").show("Email Sent Successfully..." + bill.vendor_name + " " + bill.vendor_email + " " + CONTEXT.COMPANY_NAME);
                                        },
                                        error: function (request, status, error) {
                                            console.log(request.responseText);
                                            $(".detail-info").progressBar("hide");
                                            $$("msgPanel").show("Email Sent Failed..." + bill.vendor_name + " " + bill.vendor_email + " " + CONTEXT.COMPANY_NAME);
                                        }
                                    });
                            });
                    }
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            } else {
                alert("Sorry!.. Your settings blocks email sending");
            }
        }
       
        page.events.btnSendSMS_click = function (bill) {
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {

                try {
                    if (bill.vendor_no == null || bill.vendor_no == "" || typeof bill.vendor_no == "undefined") {
                        throw "Vendor Not Selected";
                    }
                    else if (bill.vendor_phone == null || bill.vendor_phone == "" || typeof bill.vendor_phone == "undefined")
                        throw "Mobile no is not provided for the vendor";
                    else{
                        var accountInfo =
                        {
                            "appName": CONTEXT.COMPANY_NAME,

                            "senderNumber": CONTEXT.SMS_SENDER_NO,
                            "companyId": CONTEXT.SMS_COMPANY_ID,
                            "message": //"Hai",
                                "Dear " + bill.vendor_name + "," + "\n" +
                                "Your Bill No is " + bill.bill_no + " ,\n" +
                                "Your Total Amount is Rs. " + bill.total + "\n" +
                                "Regards as " + CONTEXT.COMPANY_NAME + "",
                            "receiverNumber": "+91" + bill.vendor_phone,
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

                                $$("msgPanel").flash("SMS sent successfully...");
                            },
                            error: function (request, status, error) {
                                console.log(request.responseText);

                                $$("msgPanel").show("SMS sent failed...");
                            }
                        });
                    }
                } catch (e) {
                    $$("msgPanel").show(e);
                }
               
            } else {
                alert("Sorry!.. your settings block sending messages");
            }
        }

        // print the bill
        page.events.btnPrintBill_click = function (bill) {

            function PrintData(dataList, vendorList) {
                var r = window.open(null, "_blank");
                var doc = r.document;
                //var totalAmount = 0;
                //$(page.controls.grdPOItems.allData()).each(function (i, data) {
                //    totalAmount = parseFloat(totalAmount) + parseFloat(data.total_price);
                //});

                var head = false;
                doc.write("<h1 align='center'>" + CONTEXT.COMPANY_NAME + "</h1>");
                doc.write("<br><header align='center'> <h3>Purchase Order Receipt</h3></header>");

                doc.write("<table style='width: 100%; ' cellpadding='0' cellspacing='0' border='1'>");
                doc.write("<tr><td style='font-weight:bold'>Supplier No</td><td>" + vendorList[0].vendor_no + "</td></tr>");
                doc.write("<tr><td style='font-weight:bold'>Supplier Name</td><td>" + vendorList[0].vendor_name + "</td></tr>");
                doc.write("<tr><td style='font-weight:bold'>Supplier Address</td><td>" + vendorList[0].vendor_address + "</td></tr>");
                doc.write("<tr><td style='font-weight:bold'>Supplier Mobile</td><td>" + vendorList[0].vendor_phone + "</td></tr>");
                doc.write("<tr><td style='font-weight:bold'>Supplier Email</td><td>" + vendorList[0].vendor_email + "</td></tr>");


                doc.write("</table><br>");
                doc.write("<table  style='width:100%;' cellpadding='0' cellspacing='0' border='1'>");
                doc.write("<tr style='font-weight:bold;color: white; background-color:gray;'>");
                doc.write("<th>Item No</th>");
                doc.write("<th>Item Name</th>");
                doc.write("<th>Unit</th>");
                // doc.write("<th>PO No</th>");
                // doc.write("<th>Ordered Date</th>");
                doc.write("<th>Quantity</th>");
                doc.write("<th>Free Qty</th>");
                doc.write("<th>Cost</th>");
                doc.write("<th>Sub Total</th></tr>");

                $(dataList).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.item_no + "</td>");
                        doc.write("<td>" + data.item_name + "</td>");
                        doc.write("<td>" + data.unit + "</td>");
                        doc.write("<td>" + data.qty + "</td>");
                        doc.write("<td>" + data.free_qty + "</td>");
                        doc.write("<td>" + data.cost + "</td>");
                        doc.write("<td>" + data.total_price + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }
                    doc.write("<tr>");
                    for (var prop in data) {
                    }
                    doc.write("</tr>");
                });
                doc.write("</table>");
                doc.write("</table> <div align='right'><br><br><b>Total Amount: </b>" + bill.total + " </div> ");
                doc.write(" <div align='right'><br><br><b>Total Discount: </b>" + bill.discount + " </div> ");
                doc.write(" <div align='right'><br><br><b>Total Tax: </b>" + bill.tax + " </div> ");
                doc.write(" <div align='right'><br><br><b>Total Paid: </b>" + bill.total + " </div> ");
                doc.write(" <br><br><div align='right'><h3> Authorized Signature</h3></div>");


                doc.write("<footer> <h2 align='center'>" + CONTEXT.ClientAddress + "</h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

                doc.close();
                r.focus();
                r.print();
            }
            if (CONTEXT.ENABLE_MARKET_SHOPON == "true")
                page.purchaseBillService.getPOSBillItem(bill.bill_no, function (data) {
                    page.vendorService.getVendorByNo(bill.vendor_no, function (ven_data) {
                        PrintData(data, ven_data);
                    })
                })
            else {
                page.purchaseBillService.getPOSBillItem(bill.bill_no, function (data) {
                    page.vendorService.getVendorByNo(bill.vendor_no, function (ven_data) {
                        PrintData(data, ven_data);
                    })
                })
            }
        }

       

        page.events.btnDeleteBill_click = function () {

            if (confirm("Are you sure want to delete the bill!")) {
                //Get Selected Bill
                var bill = page.controls.grdSales.selectedData()[0];
                if (bill == undefined || bill == '') {
                    $$("msgPanel").show("Select data first which you want to delete");
                } else {
                    //Delete the bill
                    page.billService.deleteBill(bill.bill_no, function (data) {
                        alert("Bill is removed");
                        //Reload Sales
                        page.loadSales();
                    });
                }
                            }

        }

        page.view = {
            salesList: function (data) {
                $$("grdSales").dataBind(data);
            },
            selectedPendingPayment: function (data) {
                $$("grdPendingPayment").width("100%");
                $$("grdPendingPayment").height("220px");
                $$("grdPendingPayment").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "100px", 'dataField': "bill_id" },
                        { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "130px", 'dataField': "bill_date" },
                        { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "130px", 'dataField': "total" },
                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "130px", 'dataField': "total_paid_amount" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "130px", 'dataField': "balance" },
                        { 'name': "", 'width': "0px", 'dataField': "expense_amt" },
                        { 'name': "Amount Pay", 'rlabel': 'Amount Pay', 'width': "130px", 'dataField': "amount_pay", editable: true },


                    ]
                });
                page.controls.grdPendingPayment.dataBind(data);
                page.controls.grdPendingPayment.edit(true);
            },
        }
        page.events.btnPrintJasperBill_click = function () {
            var exp_type = $$("ddlExportType").selectedValue();
            if (exp_type == "" || exp_type == undefined || exp_type == null)
                $$("msgPanel").show("Please select export type");
            page.printJasper(page.printBillNo, exp_type);
        }
        page.printJasper = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no, 
            }
            page.purchaseBillService.getPurchasePrint(billdata, function (data) {
            //page.purchaseBillAPI.getValue("", "", "b.bill_no=" + bill_no, "", function (data) {
            //page.stockAPI.getBill(bill_no, function (data) {
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
                var subtotal = parseFloat(item.price) * parseFloat(item.qty);
                var discount = item.discount;
                var tax = (subtotal - discount) * parseFloat(item.tax_per) / 100;
                var net_rate = parseFloat(((subtotal - discount) / (parseFloat(item.qty))) + (tax / parseFloat(item.qty))).toFixed(5);
                bill_item.push({
                    "BillItemNo": s_no,
                    "ProductName": item.item_name,	// nonstandard unquoted field name
                    "Pack": item.packing,	// nonstandard single-quoted field name
                    "Hsn": item.hsn_code,
                    "Mfr": item.man_name,
                    "Batch": item.batch_no,	// standard double-quoted field name
                    "Exp": item.expiry_date,
                    "Per": item.unit,
                    "Qty": item.qty,
                    "Qty_unit": item.qty,
                    "FreeQty": item.free_qty,
                    "Rate": parseFloat(item.price).toFixed(2),
                    "PDis": parseFloat(item.discount).toFixed(2),
                    "MRP": parseFloat(item.mrp).toFixed(2),
                    "GST": parseInt(item.tax_per),
                    "CGST": parseFloat(parseFloat(item.tax_per) / 2).toFixed(2),
                    "SGST": parseFloat(parseFloat(item.tax_per) / 2).toFixed(2),
                    "GValue": parseFloat(item.total_price).toFixed(2),
                    "TotalPrice": parseFloat(item.total_price).toFixed(2),
                    "Profit": parseFloat(((item.selling - net_rate)/net_rate)*100).toFixed(2),
                    "Selling": parseFloat(item.selling).toFixed(2)
                });
            });
            var accountInfo =
                        {
                            "BillType": "INVOICE",
                            "ApplicaName": CONTEXT.COMPANY_NAME,
                            "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "CompanyName1": CONTEXT.CompanyName1, //"New",
                            "CompanyName": CONTEXT.COMPANY_NAME.toUpperCase(),//"Essar Steel Corporation",
                            "CompanyName2": CONTEXT.CompanyName2,//"Dealer : Steel & Pipes",
                            "CompanyAdd1": CONTEXT.CompanyAdd1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                            "CompanyAdd2": CONTEXT.CompanyAdd2,
                            "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                            "Cell": "Cell : ",
                            "Cell No": CONTEXT.MobileNo,//"94434 63089",
                            "Home": "Phone : ",
                            "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                            "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                            "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                            "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                            "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                            "CompanyGST": CONTEXT.COMPANY_GST_NO,
                            "CustomerName": data.vendor_name,	// standard double-quoted field name
                            "CustPhone": data.phone_no,
                            "CustAddress": data.address,
                            "CustCityStreetZipCode": "",
                            "CompanyStateCode": "33",
                            "CustStateCode": "33",
                            "DLNo": data.license_no,
                            "email": CONTEXT.COMPANY_EMAIL,
                            "isSalesExe": CONTEXT.isSalesExecutive,
                            "GST": data.gst_no,
                            "TIN": data.tin_no,
                            "Area": data.sales_exe_area,
                            "SalesExecutiveName": data.sales_exe_name,
                            "VehicleNo": "",
                            "SupplierName": data.vendor_name,
                            "Phone": data.phone_no,
                            "SuppAddress": data.address,
                            "SuppCityStreetZipCode": "",
                            "BillNo": data.bill_no,
                            "BillDate": data.bill_date,
                            "NoofItems": data.no_of_items,
                            "Quantity": data.no_of_qty,
                            "TotalQty": data.no_of_qty,
                            "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                            "DiscountAmount": parseFloat(data.discount).toFixed(2),
                            "BCGST": parseFloat(parseFloat(data.tax) / 2).toFixed(2),
                            "BSGST": parseFloat(parseFloat(data.tax) / 2).toFixed(2),
                            "TaxAmount": parseFloat(data.tax).toFixed(2),
                            "BillAmount": parseFloat(data.total).toFixed(2),
                            "ShipAmt": 0,
                            "SSSS": "ORIGINAL",
                            "Original": "ORIGINAL",
                            "RoundAmount": parseFloat(data.round_off).toFixed(2),
                            "cgst_tot_tax": data.cgst_tot_tax,
                            "sgst_tot_tax": data.sgst_tot_tax,
                            "igst_tot_tax": data.igst_tot_tax,
                            "BIGST":"0",
                            "BillItem": bill_item
                        };

            if (page.PrintBillType == "Return") {
                accountInfo.BillName = "DEBIT BILL";
                GeneratePrint("ShopOnDev", "purchase-bill-print/main-debit-invoice.jrxml", accountInfo, exp_type, function (responseData) {

                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            }
            else {
                //var template = CONTEXT.PURCHASE_INVOICE_TEMPLATE;
                var template = "Template1";
                accountInfo.BillName = "PURCHASE BILL";
                if (template == "Template1") {
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
                if (template == "Template2") {
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill-template2.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
            }
        }
        page.jasperPrint = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no,
            }
            page.purchaseBillService.getPurchasePrint(billdata, function (data) {
            //page.purchaseBillAPI.searchValues("", "", "b.bill_no=" + bill_no, "bill_no desc", function (data) {
                page.events.btnprintInvoice_click(data, exp_type);
            });
        }
        page.events.btnprintInvoice_click = function (billItem, exp_type) {
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
                var subtotal = parseFloat(item.price) * parseFloat(item.qty);
                var discount = item.discount;
                var tax = (subtotal - discount) * parseFloat(item.tax_per) / 100;
                var net_rate = parseFloat(((subtotal - discount) / (parseFloat(item.qty))) + (tax / parseFloat(item.qty))).toFixed(5);
                bill_item.push({
                    "BillItemNo": s_no,
                    "ProductName": item.item_name,	// nonstandard unquoted field name
                    "Pack": item.packing,	// nonstandard single-quoted field name
                    "Mfr": item.man_name,
                    "Batch": item.batch_no,	// standard double-quoted field name
                    "Exp": item.expiry_date,
                    "Per": item.unit,
                    "Qty": item.qty,
                    "Qty_unit": item.qty,
                    "FreeQty": item.free_qty,
                    "Rate": parseFloat(item.price).toFixed(2),
                    "PDis": parseFloat(item.discount).toFixed(2),
                    "MRP": parseFloat(item.mrp).toFixed(2),
                    "GST": parseInt(item.tax_per),
                    "CGST": parseFloat(item.item_gst_tax).toFixed(2),
                    "SGST": parseFloat(item.item_gst_tax).toFixed(2),
                    "GValue": parseFloat(item.total_price).toFixed(2),
                    "TotalPrice": parseFloat(item.total_price).toFixed(2),
                    "Profit": parseFloat(((item.selling - net_rate) / net_rate) * 100).toFixed(2),
                    "Selling": parseFloat(item.selling).toFixed(2)
                });
            });
            var accountInfo =
                        {
                            "BillType": "INVOICE",
                            "ApplicaName": CONTEXT.COMPANY_NAME,
                            "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                            "CompanyName1": CONTEXT.CompanyName1, //"New",
                            "CompanyName": CONTEXT.CompanyName,//"Essar Steel Corporation",
                            "CompanyName2": CONTEXT.CompanyName2,//"Dealer : Steel & Pipes",
                            "CompanyAdd1": CONTEXT.CompanyAdd1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                            "CompanyAdd2": CONTEXT.CompanyAdd2,
                            "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                            "Cell": "Cell : ",
                            "Cell No": CONTEXT.MobileNo,//"94434 63089",
                            "Home": "Phone : ",
                            "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                            "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                            "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                            "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                            "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                            "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                            "CompanyGST": CONTEXT.COMPANY_GST_NO,
                            "CustomerName": data.vendor_name,	// standard double-quoted field name
                            "CustAddress": data.address,
                            "CustCityStreetZipCode": "",
                            "DLNo": data.license_no,
                            "isSalesExe": CONTEXT.isSalesExecutive,
                            "GST": data.gst_no,
                            "TIN": data.tin_no,
                            "Area": data.sales_exe_area,
                            "SalesExecutiveName": data.sales_exe_name,
                            "VehicleNo": "",
                            "SupplierName": data.vendor_name,
                            "Phone": data.phone_no,
                            "SuppAddress": data.address,
                            "SuppCityStreetZipCode": "",
                            "DLNo": data.license_no,
                            "GST": data.gst_no,
                            "TIN": data.tin_no,
                            //"BillNo": data.bill_no,
                            "BillNo": data.bill_id,
                            "BillDate": data.bill_date,
                            "NoofItems": data.no_of_items,
                            "Quantity": data.no_of_qty,
                            "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                            "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                            "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                            "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                            "BillAmount": parseFloat(data.total).toFixed(2),
                            "ShipAmt": 0,
                            "SSSS": "ORIGINAL",
                            "Original": "ORIGINAL",
                            "RoundAmount": parseFloat(data.round_off).toFixed(2),
                            "BillItem": bill_item
                        };
            if (page.PrintBillType == "Return") {
                accountInfo.BillName = "Debit BILL";
                PrintService.PrintFile("purchase-bill-print/main-debit-invoice.jrxml", accountInfo);
            }
            else {
                accountInfo.BillName = "PURCHASE BILL";
                if (template == "Template1") {
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
                if (template == "Template2") {
                    GeneratePrint("ShopOnDev", "purchase-bill-print/main-purchase-bill-template2.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
            }
        }

        page.events.btnAdvancedSearch_click = function () {
        }
        // Search Bill by BillNo
        page.events.btnSearch_click = function () {
            if ($$("txtSearch").val() == '') {
                $$("grdSales").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        //page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            var totalRecord = page.bill_count;
                            page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                callback(data, totalRecord);
                            });
                        //});
                    },
                    update: function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });
            }
            else {
                var filter = "";
                if (isNaN($$("txtSearch").val())) {
                    filter="(bill_id='" + $$("txtSearch").val() + "' or ifnull(DATE_FORMAT(bill_date, '%d-%m-%Y'),'') like '" + $$("txtSearch").val() + "' or ifnull(vendor_name,'') like '" + $$("txtSearch").val() + "%' ) or invoice_no like '%" + $$("txtSearch").val() + "%'";
                }
                else {
                    filter = "(bill_id='" + $$("txtSearch").val() + "' or invoice_no = '" + $$("txtSearch").val() + "')";
                }
                page.purchaseBillAPI.searchValues("", "", filter, "bill_no desc", function (data) {
                    $$("grdSales").dataBind(data);
                });
            }
            $$("txtSearch").selectedObject.focus()
        }

        page.events.btnMore_click = function () {
            page.controls.pnlMorePopup.open();
            page.controls.pnlMorePopup.title("Print Bill Panel");
            page.controls.pnlMorePopup.rlabel("Print Bill Panel");
            page.controls.pnlMorePopup.width("80%");
            page.controls.pnlMorePopup.height(400);

            page.controls.grdBillPrint.width("1200px");
            page.controls.grdBillPrint.height("200px");
            page.controls.grdBillPrint.setTemplate({
                selection: "Multiple", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no" },
                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "150px", 'dataField': "state_text" },
                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "150px", 'dataField': "bill_date" },
                    { 'name': "Supplier Name", 'rlabel': 'Supplier', 'width': "240px", 'dataField': "vendor_name" },
                    { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "145px", 'dataField': "total" },
                    { 'name': "Paid", 'rlabel': 'Paid', 'width': "145px", 'dataField': "paid" },
                    { 'name': "Balance", 'rlabel': 'Balance', 'width': "145px", 'dataField': "balance" },
                ]
            });
            page.controls.grdBillPrint.dataBind([]);
            $$("ddlSearchPrintViews").selectionChange(function () {
                if ($$("ddlSearchPrintViews").selectedValue() == "1") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            //page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            var totalRecord = page.bill_count;
                            page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            //});
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "2") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "3") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "", function (data) {
                                var totalRecord = data.length;
                                page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "4") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.purchaseBillAPI.searchValues("", "", "(b.bill_type='Saved' or b.state_no='100')", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.purchaseBillAPI.searchValues(start, end, "(b.bill_type='Saved' or b.state_no='100')", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "6") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.purchaseBillAPI.searchValues("", "", "b.state_no='300'", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.purchaseBillAPI.searchValues(start, end, "b.state_no='300'", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "7") {
                }
            });
        }
        page.events.btnPrintMultiBill_click = function () {
            $(page.controls.grdBillPrint.selectedData()).each(function (i, item) {
                page.jasperPrint(item.bill_no, "PDF");
            });
        }

        page.events.page_load = function () {
            //setTimeout(function () {
                $$("tabBills").selectionChanged = function (tag, obj) {
                    page.currentTabId = parseInt($(obj).closest("li").attr("index"));
                }
                page.controls.grdSales.width("100%");
                page.controls.grdSales.height("500px");
                page.controls.grdSales.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "", 'rlabel': 'Bill No', 'width': "0px", 'dataField': "bill_no",visible:false },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_id" },
                        { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "150px", 'dataField': "state_text" },
                        { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "150px", 'dataField': "bill_date" },
                        { 'name': "Supplier Name", 'rlabel': 'Supplier Name', 'width': "240px", 'dataField': "vendor_name" },
                        { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "145px", 'dataField': "total" },
                        { 'name': "Paid", 'rlabel': 'Tot Paid', 'width': "145px", 'dataField': "paid" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "145px", 'dataField': "balance" },
                        { 'name': "", 'width': "260px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />  <input type='button' title='Receipt Print'  class='grid-button' value='' action='Print' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px;' id='receiptPrint' />  <input type='button' title='Return Bill'  class='grid-button' value='' action='Return' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Return-Purchase-icon.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' /> <input type='button' title='Bill Adjustment'  class='grid-button' value='' action='Adjustment' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/bills.png);    background-size: contain;    width: 22px;    height: 25px;;margin-right:10px' id='billAdjustment' />  <input type='button'  title='Send E-mail' class='grid-button' value='' action='sendMail' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/mail-envelope.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px;' id='sendMail' />  <input type='button'  title='Send SMS' class='grid-button' value='' action='sendSMS' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/sms-icon.png);    background-size: contain;    width: 25px;    height: 28px;margin-right:10px;' id='sendSms' /> <input type='button' title='Jasper Print'  class='grid-button' value='' action='PrintJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='jasperPrint' /><input type='button'  title='Bill Edit' class='grid-button' value='' action='billEdit' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/edit.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='billEdit' /><input type='button'  title='Cancel Bill' class='grid-button' value='' action='cancelBill' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='cancelBill' /><input type='button'  title='Return Tray' class='grid-button' value='' action='returnTray' style='border: none;background-color: transparent;background-image: url(BackgroundImage/Advance-Return-icon.png); background-size: contain;width: 25px;height: 25px;margin-right:10px' id='returnTray' />  " }
                       //{ 'name': "", 'width': "230px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />  <input type='button' title='Return Bill'  class='grid-button' value='' action='Return' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Return-Purchase-icon.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' /> <input type='button' title='Jasper Print'  class='grid-button' value='' action='PrintJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' />  " }//<input type='button'  title='Credit Debit Note' class='grid-button' value='' action='creditDebitNote' style='border: none;background-color: transparent;background-image: url(BackgroundImage/credit-debit-note.png); background-size: contain;width: 25px;height: 25px;margin-right:10px' id='creditDebitNote' />

                    ]
                });

                page.controls.grdSales.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Open") {
                        page.events.btnOpenBill_click(rowData);
                    }
                    if (action == "Return") {
                        try{
                            if (rowData.state_text == "PurchaseReturn" || rowData.state_text == "Return") {
                                throw"Bill Already Returned";
                            }
                            if (rowData.state_text == "Saved") {
                                throw"Bill Not Completed";
                            }
                            //RETURN IN PANEL
                            if (rowData.po_no == null || rowData.po_no == "" || typeof rowData.po_no == "undefined") {
                                page.events.btnNewReturnBill_click(rowData);
                            }
                            else {
                                throw "Purchase Order Bill Is Not Returned";
                            }
                        }
                        catch (e) {
                            alert(e);
                        }
                    }
                    if (action == "Adjustment") {
                        //page.events.btnAdjustmentBill_click(rowData);
                    }
                    if (action == "Print") {
                        page.events.btnPrintBill_click(rowData);
                    }
                    if (action == "sendMail") {
                        page.events.btnSendMail_click(rowData);
                    }
                    if (action == "sendSMS") {
                        page.events.btnSendSMS_click(rowData);
                    }
                    if (action == "PrintJasper") {
                        page.PrintBillType = rowData.state_text;
                        page.printBillNo = rowData.bill_no;
                        page.controls.pnlPrintingPopup.open();
                        page.controls.pnlPrintingPopup.title("Select Export Type");
                        page.controls.pnlPrintingPopup.rlabel("Export Type");
                        page.controls.pnlPrintingPopup.width("500");
                        page.controls.pnlPrintingPopup.height("200");
                    }
                    //Bill Edit
                    if (action == "billEdit") {
                        try{
                            if (rowData.state_text == "Return") {
                                throw"Return Bill Is Not Editable";
                            }
                            if (rowData.state_text == "Saved") {
                                throw"Saved Bill Is Not Editable";
                            }
                            if (rowData.po_no == null || rowData.po_no == "" || typeof rowData.po_no == "undefined") {
                                if (confirm("Are You Sure Want To Edit This Bill")) {
                                    //page.purchaseBillService.getReturnBillByBill(rowData.bill_no, function (data) {
                                    page.purchaseBillAPI.searchValues("", "", "b.bill_no_par=" + rowData.bill_no, "bill_no desc", function (data) {
                                        if (data.length != 0) {
                                            alert("This Bill Can Have Return Bill");
                                        }
                                        else {
                                            page.events.btnBillEdit_click(rowData);
                                        }
                                    });
                                }
                            }
                            else {
                                throw "Purchase Order Bill Is Not Editable";
                            }
                        }
                        catch (e) {
                            alert(e);
                        }
                    }
                    //Cancel Bill
                    if (action == "cancelBill") {
                        if (confirm("Are You Sure Want To Cancel This Bill")) {
                            page.purchaseBillService.getReturnBillByBill(rowData.bill_no, function (data) {
                                if (data.length != 0) {
                                    alert("This Bill Can Have Return Bill");
                                }
                                else {
                                    page.events.btnCancelBill_click(rowData);
                                }
                            });
                        }
                    }
                    //Credit Debit Note
                    if (action == "creditDebitNote") {
                        try {
                            if (rowData.state_text == "Return") {
                                throw "Return Bill Is Not Editable";
                            }
                            if (rowData.state_text == "Saved") {
                                throw "Saved Bill Is Not Editable";
                            }
                            if (rowData.bill_type == "PurchaseCredit" || rowData.bill_type == "PurchaseDebit") {
                                throw "Credit Or Debit Bill Is Not Again Edited";
                            }
                            if (rowData.po_no == null || rowData.po_no == "" || typeof rowData.po_no == "undefined") {
                                if (confirm("Are You Sure Want To Edit This Bill")) {
                                    page.purchaseBillAPI.searchValues("", "", "b.bill_no_par=" + rowData.bill_no, "bill_no desc", function (data) {
                                        if (data.length != 0) {
                                            alert("This Bill Can Have Return Bill");
                                        }
                                        else {
                                            page.events.btnCreditEdit_click(rowData.bill_no);
                                        }
                                    });
                                }
                            }
                            else {
                                throw "Purchase Order Bill Is Not Editable";
                            }
                        }
                        catch (e) {
                            alert(e);
                        }
                    }
                    if (action == "returnTray") {
                        page.events.btnReturnTray_click(rowData);
                    }
                }
                page.controls.grdSales.beforeRowBound = function (row, item) {
                    if (CONTEXT.ENABLE_RECEIPT_PRINT)
                        $('#receiptPrint').hide();
                    else
                        $('#receiptPrint').hide();
                    if (CONTEXT.ENABLE_JASPER)
                        $('#jasperPrint').show();
                    else
                        $('#jasperPrint').hide();
                    if (CONTEXT.ENABLE_PURCHASE_EMAIL)
                        $('#sendMail').show();
                    else
                        $('#sendMail').hide();
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true")
                        $('#sendSms').show();
                    else
                        $('#sendSms').hide();
                    if (CONTEXT.ENABLE_BILL_ADJUSTMENT)
                        $('#billAdjustment').hide();
                    else
                        $('#billAdjustment').hide();
                    if (CONTEXT.ENABLE_PURCHASE_BILL_EDIT)
                        $(row).find("[id=billEdit]").show();
                    else
                        $(row).find("[id=billEdit]").hide();
                    
                }
                page.controls.grdSales.rowBound = function (row, item) {
                    if (CONTEXT.ENABLE_RECEIPT_PRINT)

                        $(row).find("[id=receiptPrint]").hide();
                    else
                        $(row).find("[id=receiptPrint]").hide();
                    if (CONTEXT.EnablePOPJasperPrint)
                        $(row).find("[id=jasperPrint]").show();
                    else
                        $(row).find("[id=jasperPrint]").hide();
                    if (CONTEXT.ENABLE_PURCHASE_EMAIL)
                        $(row).find("[id=sendMail]").show();
                    else
                        $(row).find("[id=sendMail]").hide();
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true")
                        $(row).find("[id=sendSms]").hide();
                    else
                        $(row).find("[id=sendSms]").hide();
                    if (CONTEXT.ENABLE_BILL_ADJUSTMENT)
                        $(row).find("[id=billAdjustment]").hide();
                    else
                        $(row).find("[id=billAdjustment]").hide();
                    if (CONTEXT.ENABLE_PURCHASE_BILL_EDIT)
                        $(row).find("[id=billEdit]").show();
                    else
                        $(row).find("[id=billEdit]").hide();
                    if (CONTEXT.ENABLE_PURCHASE_CANCEL_BILL)
                        $(row).find("[id=cancelBill]").hide();
                    else
                        $(row).find("[id=cancelBill]").hide();
                    if (CONTEXT.ENABLE_MODULE_TRAY)
                        $(row).find("[id=returnTray]").show();
                    else
                        $(row).find("[id=returnTray]").hide();
                }
                
                $$("grdSales").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            var totalRecord = data.length;
                            page.bill_count = data.length;
                            page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                callback(data, totalRecord);
                            });
                        });
                    },
                    update: function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });

                $$("ddlSearchViews").selectionChange(function () {
                    if ($$("ddlSearchViews").selectedValue() == "1") {
                        //page.purchaseBillService.getPOAllBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    var totalRecord = page.bill_count;
                                    page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "2") {
                        //page.purchaseBillService.getPOAllOneWeekBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.purchaseBillService.getPOAllOneWeekBill("", "", function (data) {
                                page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    //page.purchaseBillService.getPOAllOneWeekBill(start, end, function (data) {
                                    page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                        //var data = {
                        //    start_record: 0,
                        //    end_record: 100,
                        //    filter_expression: "bill_type='Purchase' and bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)",
                        //    sort_expression: ""
                        //}
                        //page.invoiceService.searchInvoice(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //    page.view.salesList(data);
                        //});
                    }
                    if ($$("ddlSearchViews").selectedValue() == "3") {
                        //page.purchaseBillService.getPOAllOneMonthBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.purchaseBillService.getPOAllOneMonthBill("", "", function (data) {
                                page.purchaseBillAPI.searchValues("", "", "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    //page.purchaseBillService.getPOAllOneMonthBill(start, end, function (data) {
                                    page.purchaseBillAPI.searchValues(start, end, "state_no='904' and bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                        //var data = {
                        //    start_record: 0,
                        //    end_record: 100,
                        //    filter_expression: "bill_type='Purchase' and bill_date>=DATE_SUB(sysdate(),INTERVAL 30 DAY)",
                        //    sort_expression: ""
                        //}
                        //page.invoiceService.searchInvoice(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //    page.view.salesList(data);
                        //});
                    }
                    if ($$("ddlSearchViews").selectedValue() == "4") {
                        //page.purchaseBillService.getPOAllSavedBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.purchaseBillService.getPOAllSavedBill("", "", function (data) {
                                page.purchaseBillAPI.searchValues("", "", "(b.bill_type='Saved' or b.state_no='100')", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    //page.purchaseBillService.getPOAllSavedBill(start, end, function (data) {
                                    page.purchaseBillAPI.searchValues(start, end, "(b.bill_type='Saved' or b.state_no='100')", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                        //var data = {
                        //    start_record: 0,
                        //    end_record: 100,
                        //    filter_expression: "bill_type='PurchaseSave'",
                        //    sort_expression: ""
                        //}
                        //page.invoiceService.searchInvoice(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //    page.view.salesList(data);
                        //});
                    }
                    if ($$("ddlSearchViews").selectedValue() == "6") {
                        //page.purchaseBillService.getAllOneMonthReturnBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.purchaseBillService.getAllOneMonthReturnBill("", "", function (data) {
                                page.purchaseBillAPI.searchValues("", "", "b.state_no='300'", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    //page.purchaseBillService.getAllOneMonthReturnBill(start, end, function (data) {
                                    page.purchaseBillAPI.searchValues(start, end, "b.state_no='300'", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                        //var data = {
                        //    start_record: 0,
                        //    end_record: 100,
                        //    filter_expression: "bill_type='PurchaseReturn' and bill_date>=DATE_SUB(sysdate(),INTERVAL 30 DAY)",
                        //    sort_expression: ""
                        //}
                        //page.invoiceService.searchInvoice(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //    page.view.salesList(data);
                        //});
                    }
                    if ($$("ddlSearchViews").selectedValue() == "7") {
                        //var data = {
                        //    start_record: 0,
                        //    end_record: 100,
                        //    filter_expression: "bill_type='PurchaseAdjustment'",
                        //    sort_expression: ""
                        //}
                        //page.invoiceService.searchInvoice(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        //    page.view.salesList(data);
                        //});
                    }
                });

                //page.purchaseService.getAllPaymentCollector(function (data) {
                //    $$("ddlReturnCollectorName").dataBind(data, "collector_id", "collector_name");
                //});

                var SearchViews = [];
                SearchViews.push({ mode_no: "1", mode_type: "Today's Purchase" }, { mode_no: "2", mode_type: "Week's Purchase" }, { mode_no: "3", mode_type: "Month's Purchase" }, { mode_no: "4", mode_type: "Saved's Purchase" });
                if (CONTEXT.ENABLE_ADVANCE_SEARCH)
                    SearchViews.push({ mode_no: "5", mode_type: "Advanced Search" });
                SearchViews.push({ mode_no: "6", mode_type: "Month's Return" });
                //SearchViews.push({ mode_no: "7", mode_type: "Adjustment Bill" });
                page.controls.ddlSearchViews.dataBind(SearchViews, "mode_no", "mode_type");
                page.controls.ddlSearchPrintViews.dataBind(SearchViews, "mode_no", "mode_type","Select");
                //$$("msgPanel").show("Please Wait Your Product Is Loading...");
                //page.itemService.getItemAutoComplete("%", CONTEXT.DEFAULT_SALES_TAX, function (data) {
                //    page.productList = data;
                //    $$("msgPanel").show("Your Purchase Is Ready");
                //    $$("msgPanel").hide();
                //});
                $$("txtSearch").selectedObject.focus()
            //}, 5000);
                if (CONTEXT.ENABLE_DUE_DATE_ALERT) {
                    var user_ids = [];
                    $(CONTEXT.USERIDACCESS).each(function (i, item) {
                        user_ids.push(item.user_id);
                    });
                    var filter = {
                        viewMode: "Standard",
                        fromDate: "",
                        toDate: "",
                        vendor_no: "",
                        item_no: "",
                        state_no: "",
                        bill_type: "",
                        bill_payment_mode: "",
                        store_no: localStorage.getItem("user_store_no"),
                        reg_no: localStorage.getItem("user_register_id"),
                        user_no: user_ids.join(","),
                        comp_id: localStorage.getItem("user_company_id"),
                        due_date: "Due Date Bill"
                    };
                    page.reportAPI.purchaseReport(filter, function (data) {
                        if (data.length != 0) {
                            if (!("Notification" in window)) {
                                alert("This browser does not support desktop notification");
                            }
                            else if (Notification.permission === "granted") {
                                var notification = new Notification(data.length + "Bills Have Today Due Date Please Verify Purchase Report");
                                notification.onclick = function () {
                                    window.location.href = "/" + appConfig.root + "/shopon/view/purchase-report/purchase-report.html";
                                };
                            }
                            else if (Notification.permission !== "denied") {
                                Notification.requestPermission(function (permission) {
                                    if (permission === "granted") {
                                        var notification = new Notification(data.length + "Bills Have Today Due Date Please Verify Purchase Report");
                                        notification.onclick = function () {
                                            window.location.href = "/" + appConfig.root + "/shopon/view/purchase-report/purchase-report.html";
                                        };
                                    }
                                });
                            }
                        }
                    });
                }
                page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {//attr_no_key in (1,2,3,4,5,6)
                    attr_list = data;
                });
		if (CONTEXT.SHOW_BARCODE) {
		    $("#barcodePrint").show();
            $$("btnPrintNewBarcode").show();
        }
        else {
		    $("#barcodePrint").hide();
            $$("btnPrintNewBarcode").hide();
        }
        }

        page.events.btnPrintBarcode_click = function () {
            page.controls.pnlPrintBarcodePopup.open();
            page.controls.pnlPrintBarcodePopup.title("Print Bill Panel");
            page.controls.pnlPrintBarcodePopup.rlabel("Print Bill Panel");
            page.controls.pnlPrintBarcodePopup.width("75%");
            page.controls.pnlPrintBarcodePopup.height(500);

            page.controls.grdBarcodePrint.width("1000px");
            page.controls.grdBarcodePrint.height("200px");
            page.controls.grdBarcodePrint.setTemplate({
                selection: "Multiple", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Item No", 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no" },
                    { 'name': "", 'rlabel': '', 'width': "0px", 'dataField': "var_no","visible":false },
                    { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name" },
                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "90px", 'dataField': "qty" },
                    { 'name': "Selling Price", 'rlabel': 'Selling Price', 'width': "150px", 'dataField': "pre_selling_price" },
                    { 'name': "No Of Print", 'rlabel': 'No Of Print', 'width': "120px", 'dataField': "printCount", editable: true },
                    //{ 'name': "No Of Row", 'rlabel': 'No Of Row', 'width': "120px", 'dataField': "printRow", editable: true },
                ]
            });
            page.controls.grdBarcodePrint.dataBind([]);
            page.controls.grdBarcodePrint.edit(true);

            $$("txtInvoiceNo").focus();
        }
        page.events.btnInvoiceBillSearch_click = function () {
            page.purchaseBillAPI.searchValues("", "", " bill_no = '" + $$("txtInvoiceNo").val() + "'", "bill_no desc", function (data) {
                page.stockAPI.getBill(data[0].bill_no, function (data) {
                    $$("grdBarcodePrint").dataBind(data.bill_items);
                    page.controls.grdBarcodePrint.edit(true);
                });
            });
        }
        page.events.btnPrintMultiBarcode_click = function () {
            $(page.controls.grdBarcodePrint.selectedData()).each(function (i, item) {
                var data = {
                    printRow: $$("ddlBillPrintCount").selectedValue(),
                    printCount: item.printCount,
                    item_name: item.item_name,
                    item_no: item.item_no,
                    var_no:item.var_no,
                    selling_price:item.pre_selling_price
                }
                printBarcode(data);
            });
        }
        page.events.btnPrintNewBarcode_click = function () {
            page.controls.pnlPrintNewBarcodePopup.open();
            page.controls.pnlPrintNewBarcodePopup.title("Print Bill Panel");
            page.controls.pnlPrintNewBarcodePopup.rlabel("Print Bill Panel");
            page.controls.pnlPrintNewBarcodePopup.width("80%");
            page.controls.pnlPrintNewBarcodePopup.height(500);
            page.controls.ucBarcodePrint.select({});
        }
        page.events.btnReturnTray_click = function (item) {
            page.controls.pnlReturnTrayPOSPopup.open();
            page.controls.pnlReturnTrayPOSPopup.title("Return Tray");
            page.controls.pnlReturnTrayPOSPopup.rlabel("Return Tray");
            page.controls.pnlReturnTrayPOSPopup.width("70%");
            page.controls.pnlReturnTrayPOSPopup.height(450);

            var filter = {
                bill_no: item.bill_no,
                bill_type: "Vendor",
                viewMode: "CustomerReturnTray"
            }
            page.stockReportAPI.stockReport(filter, function (data) {
                $$("grdReturnTrayPOPItems").width("100%");
                $$("grdReturnTrayPOPItems").height("auto");
                $$("grdReturnTrayPOPItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                        { 'name': "Tray No", 'rlabel': 'Tray No', 'width': "60px", 'dataField': "tray_id" },
                        { 'name': "Tray Name", 'rlabel': 'Tray Name', 'width': "160px", 'dataField': "tray_name", editable: false },
                        { 'name': "Sale Tray", 'rlabel': 'Sale Tray', 'width': "100px", 'dataField': "tray_sale", editable: false },
                        { 'name': "Returned Tray", 'rlabel': 'Returned Tray', 'width': "100px", 'dataField': "tray_returned", editable: false },
                        { 'name': "Return Tray", 'rlabel': 'Return Tray', 'width': "100px", 'dataField': "ret_tray", editable: true },
                        { 'name': "Attributes", 'rlabel': 'Attributes', 'width': "300px", itemTemplate: "<div  id='Attributes'></div>" },
                        { 'name': "", 'rlabel': '', 'width': "0px", 'dataField': "sku_no", visible: false },
                    ]
                });
                page.controls.grdReturnTrayPOPItems.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdReturnTrayPOPItems.allData().length);
                    var attrTemplate = [];
                    if (item.attr_value1 != "" && item.attr_value1 != null && typeof item.attr_value1 != "undefined") {
                        attrTemplate.push("<input type='text' dataField='attr_value1' style='width:80px; background: transparent;border:none;' placeholder='' >");
                    }
                    if (item.attr_value2 != "" && item.attr_value2 != null && typeof item.attr_value2 != "undefined") {
                        attrTemplate.push("<input type='text' dataField='attr_value2' style='width:80px; background: transparent;border:none;' placeholder='' >");
                    }
                    if (item.attr_value3 != "" && item.attr_value3 != null && typeof item.attr_value3 != "undefined") {
                        attrTemplate.push("<input type='text' dataField='attr_value3' style='width:80px; background: transparent;border:none;' placeholder='' >");
                    }
                    if (item.attr_value4 != "" && item.attr_value4 != null && typeof item.attr_value4 != "undefined") {
                        attrTemplate.push("<input type='text' dataField='attr_value4' style='width:80px; background: transparent;border:none;' placeholder='' >");
                    }
                    if (item.attr_value5 != "" && item.attr_value5 != null && typeof item.attr_value5 != "undefined") {
                        attrTemplate.push("<input type='text' dataField='attr_value5' style='width:80px; background: transparent;border:none;' placeholder='' >");
                    }
                    if (item.attr_value6 != "" && item.attr_value6 != null && typeof item.attr_value6 != "undefined") {
                        attrTemplate.push("<input type='text' dataField='attr_value6' style='width:80px; background: transparent;border:none;' placeholder='' >");
                    }
                    $(row).find("[id=Attributes]").html(attrTemplate.join(""));
                    $(row).find("input[dataField=attr_value1]").val(item.attr_value1).change();
                    $(row).find("input[dataField=attr_value2]").val(item.attr_value2).change();
                    $(row).find("input[dataField=attr_value3]").val(item.attr_value3).change();
                    $(row).find("input[dataField=attr_value4]").val(item.attr_value4).change();
                    $(row).find("input[dataField=attr_value5]").val(item.attr_value5).change();
                    $(row).find("input[dataField=attr_value6]").val(item.attr_value6).change();
                    $(row).find("input[dataField=attr_value1]").attr("disabled", true);
                    $(row).find("input[dataField=attr_value2]").attr("disabled", true);
                    $(row).find("input[dataField=attr_value3]").attr("disabled", true);
                    $(row).find("input[dataField=attr_value4]").attr("disabled", true);
                    $(row).find("input[dataField=attr_value5]").attr("disabled", true);
                    $(row).find("input[dataField=attr_value6]").attr("disabled", true);
                    if (item.attr_type1 == "cost" || item.attr_type1 == "vendor_no" || item.attr_type1 == "invoice_no")
                        $(row).find("input[dataField=attr_value1]").css("display", "none");
                    if (item.attr_type2 == "cost" || item.attr_type2 == "vendor_no" || item.attr_type2 == "invoice_no")
                        $(row).find("input[dataField=attr_value2]").css("display", "none");
                    if (item.attr_type3 == "cost" || item.attr_type3 == "vendor_no" || item.attr_type3 == "invoice_no")
                        $(row).find("input[dataField=attr_value3]").css("display", "none");
                    if (item.attr_type4 == "cost" || item.attr_type4 == "vendor_no" || item.attr_type4 == "invoice_no")
                        $(row).find("input[dataField=attr_value4]").css("display", "none");
                    if (item.attr_type5 == "cost" || item.attr_type5 == "vendor_no" || item.attr_type5 == "invoice_no")
                        $(row).find("input[dataField=attr_value5]").css("display", "none");
                    if (item.attr_type6 == "cost" || item.attr_type6 == "vendor_no" || item.attr_type6 == "invoice_no")
                        $(row).find("input[dataField=attr_value6]").css("display", "none");
                }
                $$("grdReturnTrayPOPItems").dataBind(data);
                $$("grdReturnTrayPOPItems").edit(true);
            });
        }
        page.events.btnReturnTrayPOPItemPopup_click = function () {
            var trans = [];
            try {
                $(page.controls.grdReturnTrayPOPItems.allData()).each(function (i, item) {
                    if (item.ret_tray == "" || item.ret_tray == null || typeof item.ret_tray == "undefined") {
                        item.ret_tray = 0;
                    }
                    if (isNaN(item.ret_tray))
                        throw "Returned Tray Is Positive and Number";
                    if ((parseFloat(item.tray_returned) + parseFloat(item.ret_tray)) > parseFloat(item.tray_sale))
                        throw "Return Tray Is Not Greater The Actual Return Qty";
                    if (parseFloat(item.ret_tray) > 0) {
                        trans.push({
                            tray_count: item.ret_tray,
                            trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            trans_type: "Vendor Return",
                            tray_id: item.tray_id,

                            cust_id: (page.controls.grdSales.selectedData()[0].vendor_no == null) ? "-1" : page.controls.grdSales.selectedData()[0].vendor_no,
                            bill_id: page.controls.grdSales.selectedData()[0].bill_no,
                            store_no: localStorage.getItem("user_store_no"),
                            sku_no: item.sku_no
                        });
                    }
                });
                page.eggtraytransAPI.postAllValue(0, trans, function (data) {
                    page.controls.pnlReturnTrayPOSPopup.close();
                    alert("Tray Successfully Returned!!!");
                });
            }
            catch (e) {
                alert(e);
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

    });
}



var t = {

    PrinterName: "Microsoft Print to PDF",
    Width: 200,
    Height: 300,
    Lines: [
        
        { StartX: 10, StartY: 10, Text: "THANGAMALAR", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 90, StartY: 10, Text: "THANGAMALAR", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 170, StartY: 10, Text: "THANGAMALAR", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },

        { StartX: 10, StartY: 20, BarCodeText: "142", FontSize: 12 },
        { StartX: 90, StartY: 20, BarCodeText: "142", FontSize: 12 },
        { StartX: 170, StartY: 20, BarCodeText: "142", FontSize: 12 },


        { StartX: 10, StartY: 30, Text: "7Dates Dry Dates - 500gm", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 90, StartY: 30, Text: "7Dates Dry Dates - 500gm", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 170, StartY: 30, Text: "7Dates Dry Dates - 500gm", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },

        { StartX: 10, StartY: 40, Text: "Rs 325.00", FontFamily: "Courier New", FontSize: 14, FontStyle: 1 },
        { StartX: 90, StartY: 40, Text: "Rs 325.00", FontFamily: "Courier New", FontSize: 14, FontStyle: 1 },
        { StartX: 170, StartY: 40, Text: "Rs 325.00", FontFamily: "Courier New", FontSize: 14, FontStyle: 1 },


      

    ]

}

function compareContents(origData, currData, keys, updColumns) {
    var deleteData = [];
    var addedData = [];
    var updatedData = [];
    $(origData).each(function (i2, origItem) {
        var found = false;
        $(currData).each(function (i3, currItem) {
            var keyMatch = true;
            $(keys.split(',')).each(function (i1, key1) {
                if (origItem[key1] != currItem[key1])
                    keyMatch = false;
            });
            if (keyMatch)
                found = true;
        });
        if (found == false)
            deleteData.push(origItem);
    });
    $(currData).each(function (i2, origItem) {
        var found = false;
        $(origData).each(function (i3, currItem) {
            var keyMatch = true;
            $(keys.split(',')).each(function (i1, key1) {
                if (origItem[key1] != currItem[key1])
                    keyMatch = false;
            });
            if (keyMatch)
                found = true;
        });
        if (found == false)
            addedData.push(origItem);
    });


    $(currData).each(function (i2, origItem) {
        var found = false;
        $(origData).each(function (i3, currItem) {
            var keyMatch = true;
            $(keys.split(',')).each(function (i1, key1) {
                if (origItem[key1] != currItem[key1])
                    keyMatch = false;
            });
            if (keyMatch) {

                $(updColumns.split(',')).each(function (i5, column) {
                    if (origItem[column] != currItem[column])
                        found = true;
                });


            }
        });
        if (found == true)
            updatedData.push(origItem);
    });
    return {
        deletedDate: deleteData,
        addedData: addedData,
        updatedData: updatedData
    };
}