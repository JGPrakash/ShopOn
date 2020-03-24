$.fn.itemInventory = function() {
    return $.pageController.getControl(this, function(page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-invent/item-invent.html");

        page.itemAPI = new ItemAPI();
        page.accService = new AccountingService();
        page.finfactsEntry = new FinfactsEntry();
        page.vendorAPI = new VendorAPI();
        page.stockAPI = new StockAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();

        page.contextAdjustments = function () {
            CONTEXT.ENABLE_VARIATION_MRP = true;
            CONTEXT.ENABLE_VARIATION_BATCH = true;
            CONTEXT.ENABLE_VARIATION_EXPIRY_DATE = true;
            CONTEXT.ENABLE_VARIATION_MAN_DATE = true;
            CONTEXT.ENABLE_VARIATION_VENDOR_NO = true;
        }



        page.ddl_vendor_name = [];
        page.events = {
            btnNewVariation_click: function () {
                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlAddInventVendor.dataBind(data, "vendor_no", "vendor_name", "Select");
                    $$("btnAddVariation").disable(false);
                    $$("btnAddVariation").show();
                    page.controls.pnlNewVariation.open();
                    page.controls.pnlNewVariation.title("New Variation");
                    page.controls.pnlNewVariation.rlabel("Variation");
                    page.controls.pnlNewVariation.width(350);
                    page.controls.pnlNewVariation.height(400);
                    
                    $$("ddlAddInventVendor").selectedValue(page.vendor_no);
                    $$("txtNewVariation").value("");
                    $$("txtAddInventCost").value("");
                    $$("txtAddMrp").value("");
                    $$("txtAddBatchNo").value("");
                    $$("dsAddExpiryDate").selectedObject.val("");
                    $$("dsAddManDate").selectedObject.val("");
                    $$("txtNewVariation").focus();
                    
                    $$("chkItemVariationSupplierNo").prop("checked") ? $$("pnlVariationSupplier").show() : $$("pnlVariationSupplier").hide();
                    $$("chkItemVariationBuyingCost").prop("checked") ? $$("pnlVariationCost").show() : $$("pnlVariationCost").hide();
                    $$("chkItemVariationMRP").prop("checked")?$$("pnlMrp").show():$$("pnlMrp").hide();
                    $$("chkItemVariationBatchNo").prop("checked")?$$("pnlBatchNo").show():$$("pnlBatchNo").hide();
                    $$("chkItemVariationManDate").prop("checked") ? $$("pnlManDate").show() : $$("pnlManDate").hide();
                    $$("chkItemVariationExpiryDate").prop("checked") ? $$("pnlExpiryDate").show() : $$("pnlExpiryDate").hide();
                });
                
            },

            btnRemoveInventory_click: function() {
                var rowId = page.controls.grdItemInventory.selectedRows()[0].attr("row_id");
                var data = {
                    item_no: page.item_no,
                    variation_name: page.controls.grdItemInventory.selectedData()[0].variation_name
                }
                if (confirm("If the transaction deleted particular bill Will Be Affected")) {
                    $(".detail-info").progressBar("show")
                    $$("msgPanel").flash("Removing inventory...");
                    page.stockAPI.deleteVariationStock(page.controls.grdItemInventory.selectedData()[0].stock_no, function () {
                        page.controls.grdItemInventory.deleteRow(rowId);
                        page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                            //page.controls.grdItemInventory.dataBind(data);
                            page.view.selectedItemInventory(data);
                        });
                        page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                            //page.controls.grdItemVariations.dataBind(data);
                            page.view.selectedItemVariation(data);
                        });
                        $(".detail-info").progressBar("hide")
                        $$("msgPanel").flash("Inventory removed...");
                    });
                }
            },

            btnAddVariation_click: function () {
                $$("btnAddVariation").disable(true);
                $$("btnAddVariation").hide();
                page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (var_data) {
                    try {
                        //if ($$("txtAddInventCost").value() == null || $$("txtAddInventCost").value() == "" || $$("txtAddInventCost").value() == undefined || parseFloat($$("txtAddInventCost").value()) < 0 || isNaN($$("txtAddInventCost").value())) {
                        //    throw "Cost should be positive number and not empty"
                        //    $$("txtAddInventCost").focus();
                        //}
                        if ($$("txtNewVariation").value() == "") {
                            throw ("Enter variation name...!");
                            $$("txtNewVariation").focus();
                        }

                        $(var_data).each(function (i, item) {
                            if (item.variation_name == $$("txtNewVariation").value())
                                throw "Variation should be different";
                        });
                        $(page.controls.grdItemVariations.allData()).each(function (i, item) {
                            if (!$$("chkItemVariationSupplierNo").prop("checked")) {
                                item.vendor_no = "-1";
                                $$("ddlAddInventVendor").selectedValue("-1");
                            }
                            if (!$$("chkItemVariationBuyingCost").prop("checked")) {
                                item.cost = "0";
                                $$("txtAddInventCost").value("0");
                            }
                            if (!$$("chkItemVariationMRP").prop("checked")) {
                                item.mrp = "0";
                                $$("txtAddMrp").value("0");
                            }
                            if (!$$("chkItemVariationBatchNo").prop("checked")) {
                                item.batch_no = "";
                                $$("txtAddBatchNo").value("")
                            }
                            if (!$$("chkItemVariationManDate").prop("checked")) {
                                item.man_date = "";
                                $$("dsAddManDate").selectedObject.val("");
                            }
                            if (!$$("chkItemVariationExpiryDate").prop("checked")) {
                                item.expiry_date = "";
                                $$("dsAddExpiryDate").selectedObject.val("");
                            }
                            if (item.variation_name == $$("txtNewVariation").value())
                                throw "Variation should be different";
                            if (parseFloat(item.mrp) == parseFloat($$("txtAddMrp").value()) &&
                                item.batch_no == $$("txtAddBatchNo").value() &&
                                parseFloat(item.cost) == parseFloat($$("txtAddInventCost").value()) &&
                                (item.expiry_date == null ? "" : item.expiry_date) == $$("dsAddExpiryDate").getDate() &&
                                (item.man_date == null ? "" : item.man_date) == $$("dsAddManDate").getDate() &&
                                 item.vendor_no == $$("ddlAddInventVendor").selectedValue()) {
                                throw "Duplicate entry should not be entered";
                            }
                        });
                        var result = 0;
                        $(".detail-info").progressBar("show")
                        $$("msgPanel").flash("Inserting inventory...");
                        var a = $$("dsAddExpiryDate").selectedObject.val().substring(6, 10) + "-" + $$("dsAddExpiryDate").selectedObject.val().substring(3, 5) + "-" + $$("dsAddExpiryDate").selectedObject.val().substring(0, 2)
                        var b = $$("dsAddManDate").selectedObject.val().substring(6, 10) + "-" + $$("dsAddManDate").selectedObject.val().substring(3, 5) + "-" + $$("dsAddManDate").selectedObject.val().substring(0, 2)
                        //VALIDATE THE EXPIRY DATE
                        if ($$("dsAddExpiryDate").selectedObject.val() != "" && $$("dsAddExpiryDate").selectedObject.val() != null && typeof $$("dsAddExpiryDate").selectedObject.val() != "undefined") {
                            var EnteredDate = $$("dsAddExpiryDate").getDate();
                            var date = EnteredDate.substring(0, 2);
                            var month = EnteredDate.substring(3, 5);
                            var year = EnteredDate.substring(6, 10);

                            var myDate = new Date(year, month - 1, date);
                            var today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (myDate < today) {
                                throw "Please Check The Expiry Date";
                            }
                            if ($$("dsAddManDate").selectedObject.val() != "" && $$("dsAddManDate").selectedObject.val() != null && typeof $$("dsAddManDate").selectedObject.val() != "undefined") {
                                var EnteredDate1 = $$("dsAddManDate").getDate();
                                var date1 = EnteredDate1.substring(0, 2);
                                var month1 = EnteredDate1.substring(3, 5);
                                var year1 = EnteredDate1.substring(6, 10);

                                var myDate1 = new Date(year, month - 1, date);
                                if (myDate < myDate1) {
                                    throw "Please Check Expiry And Manufacture Date";
                                }
                            }
                        }

                        var insert_data = {
                            store_no: localStorage.getItem("user_store_no"),
                            item_no: page.item_no,
                            cost: $$("txtAddInventCost").value(),
                            variation_name: $$("txtNewVariation").value(),
                            active: 1,
                            user_no: getCookie("user_id"),
                            vendor_no: CONTEXT.ENABLE_VARIATION_VENDOR_NO ? ($$("ddlAddInventVendor").selectedValue() == "" || $$("ddlAddInventVendor").selectedValue() == null || typeof $$("ddlAddInventVendor").selectedValue() == "undefined") ? "" : $$("ddlAddInventVendor").selectedValue() : "",
                            mrp: CONTEXT.ENABLE_VARIATION_MRP ? ($$("txtAddMrp").value() == "" || $$("txtAddMrp").value() == null || $$("txtAddMrp").value() == undefined) ? "" : $$("txtAddMrp").value() : "",
                            batch_no: CONTEXT.ENABLE_VARIATION_BATCH ? ($$("txtAddBatchNo").value() == "" || $$("txtAddBatchNo").value() == null || typeof $$("txtAddBatchNo").value() == "undefined") ? "" : $$("txtAddBatchNo").value() : "",
                            rate: $$("txtAddInventCost").value(),
                        }
                        if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                            if (page.expiry_days == "" || page.expiry_days == null || typeof page.expiry_days == "undefined") {
                                if ($$("dsAddExpiryDate").selectedObject.val() == "" || $$("dsAddExpiryDate").selectedObject.val() == null || typeof $$("dsAddExpiryDate").selectedObject.val() == "undefined") {
                                    insert_data.expiry_date = "";
                                }
                                else {
                                    insert_data.expiry_date = CONTEXT.ENABLE_VARIATION_EX_DATE ? a : "";
                                }
                            }
                            else {
                                var today = new Date();
                                today.setDate(today.getDate() + parseInt(page.expiry_days));
                                insert_data.expiry_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", today));
                            }
                        }
                        else {
                            if ($$("dsAddExpiryDate").selectedObject.val() == "" || $$("dsAddExpiryDate").selectedObject.val() == null || typeof $$("dsAddExpiryDate").selectedObject.val() == "undefined") {
                                insert_data.expiry_date = "";
                            }
                            else {
                                insert_data.expiry_date = CONTEXT.ENABLE_VARIATION_EX_DATE ? a : "";
                            }
                        }
                        if ($$("dsAddManDate").selectedObject.val() == "" || $$("dsAddManDate").selectedObject.val() == null || typeof $$("dsAddManDate").selectedObject.val() == "undefined") {
                            insert_data.man_date = "";
                        }
                        else {
                            insert_data.man_date = CONTEXT.ENABLE_VARIATION_MAN_DATE ? b : "";
                        }
                        page.stockAPI.insertVariation(insert_data, function (data) {
                            alert("Variation Added Successfully");
                            page.controls.pnlNewVariation.close();
                            $(".detail-info").progressBar("hide")
                            page.events.btnNewInventory_click();
                            $$("msgPanel").flash("Inventory inserted...");

                            page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                                //page.controls.grdItemVariations.dataBind(data1);
                                page.view.selectedItemVariation(data1);
                            });
                        }, function (err) {
                            $(".detail-info").progressBar("hide");
                            alert(err.message);
                            $$("btnAddVariation").disable(false);
                            $$("btnAddVariation").show();
                        });
                    }
                    catch (e) {
                        $(".detail-info").progressBar("hide");
                        alert(e);
                        $$("btnAddVariation").disable(false);
                        $$("btnAddVariation").show();
                    }
                });
            },
            btnStopVariation_click: function () {
                if ($$("grdItemVariations").selectedData().length==0)
                    $$("msgPanel").show("Please select a variation to proceed...!");
                else if ($$("grdItemVariations").selectedData()[0].active == "0") {
                    $$("msgPanel").show("Selected variation is already stopped!");
                }
                else {
                    if (confirm("Are You Sure Want To Stop This Variation")) {
                        if (confirm("If You Stop This This Variation Cannot Be Sale")) {
                            var var_no = page.controls.grdItemVariations.selectedData()[0].var_no;
                            var data = {
                                active: 0
                            }
                            page.stockAPI.updateVariation(var_no, data, function (data) {
                                $$("msgPanel").show("Variation stoped successfully...!");
                                page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                                    //page.controls.grdItemVariations.dataBind(data1);
                                    page.view.selectedItemVariation(data1);
                                });
                            })
                        }
                    }
                }
            },
            btnActiveVariation_click: function () {
                if ($$("grdItemVariations").selectedData()[0] == undefined)
                    $$("msgPanel").show("Please select a variation to proceed...!");
                else if ($$("grdItemVariations").selectedData()[0].active == "1") {
                    $$("msgPanel").show("Selected variation is already activated!");
                }
                else {
                    var var_no = page.controls.grdItemVariations.selectedData()[0].var_no;
                    var data = {


                        active: 1
                    }
                    page.stockAPI.updateVariation(var_no,data, function (data) {
                        $$("msgPanel").show("Variation activated successfully...!");
                        page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                            //page.controls.grdItemVariations.dataBind(data1);
                            page.view.selectedItemVariation(data1);
                        });
                    })
                }
            },

            btnNewInventory_click: function () {
                $$("txtAddInventCost").value("");
                $$("ddlAddInventVendor").selectedValue(-1);
                $$("txtAddMrp").value("");
                $$("txtAddBatchNo").value("");
                $$("dsAddExpiryDate").setDate('');
                $$("txtNewVariation").value("");
            },
            btnSTApplyFilter_click: function () {
                $$("grdItemInventory").applyFilter();
            },
            btnSTHideFilter_click: function () {
                $$("grdItemInventory").clearFilter();
            },
            btnSTShowFilter_click: function () {
                $$("grdItemInventory").showFilter();
            },
            page_load: function () {

                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    $(data).each(function (i, ven_data) {
                        page.ddl_vendor_name.push({
                            vendor_no: ven_data.vendor_no,
                            vendor_name: ven_data.vendor_name
                        })
                    });
                    page.view.selectedItemVariation([]);
                    page.view.selectedItemInventory([]);
                });
                if (CONTEXT.ENABLE_EXP_DATE) {
                    $$("pnlExpiryDate").show();
                    $$("pnlManDate").show();
                    $$("pnlStockExpiryDate").show();
                    $$("pnlStockManDate").show();
                }
                else {
                    $$("pnlExpiryDate").hide();
                    $$("pnlManDate").hide();
                    $$("pnlStockExpiryDate").hide();
                    $$("pnlStockManDate").hide();
                }
                if (CONTEXT.ENABLE_BAT_NO) {
                    $$("pnlBatchNo").show();
                    $$("pnlStockBatchNo").show();
                }
                else {
                    $$("pnlBatchNo").hide();
                    $$("pnlStockBatchNo").hide();
                }
                if (CONTEXT.ENABLE_MRP) {
                    $$("pnlMrp").show();
                    $$("pnlStockMrp").show();
                }
                else {
                    $$("pnlMrp").hide();
                    $$("pnlStockMrp").hide();
                }

                if (CONTEXT.ENABLE_VARIATION) {
                    $$("btnActiveVariation").show();
                    $$("btnStopVariation").show();
                    $$("btnNewVariation").show();
                    $('#line4').show();
                    $('#line3').show();
                    $('#line2').show();
                }
                else {
                    $$("btnActiveVariation").hide();
                    $$("btnStopVariation").hide();
                    $$("btnNewVariation").hide();
                    $('#line4').hide();
                    $('#line3').hide();
                    $('#line2').hide();
                }

                if (CONTEXT.ENABLE_INVENTORY_DETAILS) {
                    $(".key").show();
                }
                else {
                    $(".key").hide();
                }

            },
            btnAddInvent_click: function () {
                if (page.controls.grdItemVariations.selectedData() == "" || page.controls.grdItemVariations.selectedData() == null || page.controls.grdItemVariations.selectedData() == undefined) {
                    alert("Please select the stock variation");
                }
                else {
                    $$("btnAddInvent").disable(false);
                    $$("btnAddInvent").show();
                    page.controls.pnlAddInventory.open();
                    page.controls.pnlAddInventory.title("Inventory");
                    page.controls.pnlAddInventory.rlabel("Inventory");
                    page.controls.pnlAddInventory.width(800);
                    page.controls.pnlAddInventory.height(440);
                    $$("txtkey1Inventory").val("");
                    $$("txtkey2Inventory").val("");
                    $$("txtkey3Inventory").val("");
                    $$("txtAddInventoryQty").val("");
                    $$("txtAddStockCost").val("");
                    $$("txtAddStockMrp").val("");
                    $$("txtAddStockBatchNo").val("");
                    $$("dsAddStockManDate").selectedObject.val("");
                    $$("dsAddStockExpiryDate").selectedObject.val("");
                    $$("ddlAddTransType").val("Purchase");
                    $$("txtAddInventoryQty").focus();
                    page.vendorAPI.searchValues("", "", "", "", function (data) {
                        page.controls.ddlAddStockVendor.dataBind(data, "vendor_no", "vendor_name", "Select");
                    });
                    $$("txtkey2Inventory").val(page.item_no);
                    $$("txtkey2Inventory").disable(true);
                    var variations = page.controls.grdItemVariations.selectedData()[0];
                    if (variations.mrp == null || variations.mrp == "" || typeof variations.mrp == "undefined") {
                        $$("txtAddStockMrp").disable(false);
                    }
                    else {
                        $$("txtAddStockMrp").val(variations.mrp);
                        $$("txtAddStockMrp").disable(true);
                    }
                    if (parseInt(variations.cost) == 0 || variations.cost == null || variations.cost == "" || typeof variations.cost == "undefined") {
                        $$("txtAddStockCost").disable(false);
                    }
                    else {
                        $$("txtAddStockCost").val(variations.cost);
                        $$("txtAddStockCost").disable(true);
                    }
                    if (variations.batch_no == null || variations.batch_no == "" || typeof variations.batch_no == "undefined") {
                        $$("txtAddStockBatchNo").disable(false);
                    }
                    else {
                        $$("txtAddStockBatchNo").val(variations.batch_no);
                        $$("txtAddStockBatchNo").disable(true);
                    }
                    if (variations.man_date == null || variations.man_date == "" || typeof variations.man_date == "undefined") {
                        $$("dsAddStockManDate").disable(false);
                    }
                    else {
                        $$("dsAddStockManDate").setDate(dbDate(variations.man_date))
                        $$("dsAddStockManDate").disable(true);
                    }
                    if (variations.expiry_date == null || variations.expiry_date == "" || typeof variations.expiry_date == "undefined") {
                        $$("dsAddStockExpiryDate").disable(false);
                    }
                    else {
                        $$("dsAddStockExpiryDate").setDate(dbDate(variations.expiry_date));
                        $$("dsAddStockExpiryDate").disable(true);
                    }
                }
            },

            btnAddInventory_click: function () {
                $$("btnAddInvent").disable(true);
                $$("btnAddInvent").hide();
                try {
                    if (page.controls.grdItemVariations.selectedData() == "" || page.controls.grdItemVariations.selectedData() == null || page.controls.grdItemVariations.selectedData() == undefined) {
                        throw "Please select the stock variation";
                    }
                    else {
                        var variations = page.controls.grdItemVariations.selectedData();
                        if (variations.length == 0)
                            throw "Please add variation before adding stock.";
                        if ($$("txtAddInventoryQty").value() == "" || $$("txtAddInventoryQty").value() == null || typeof $$("txtAddInventoryQty").value() == "undefined" || isNaN($$("txtAddInventoryQty").value())) {
                            throw "Quantity Should Be a Number";
                        }
                        
                        var tran_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                        variations[0].man_date = ($$("dsAddStockManDate").getDate() == "" || $$("dsAddStockManDate").getDate() == null) ? "" : dbDateTime($$("dsAddStockManDate").getDate());//(variations[0].man_date == null) ? "" : dbDateTime(variations[0].man_date);
                        variations[0].expiry_date = ($$("dsAddStockExpiryDate").getDate() == "" || $$("dsAddStockExpiryDate").getDate() == null) ? "" : dbDateTime($$("dsAddStockExpiryDate").getDate());//(variations[0].expiry_date == null) ? "" : dbDateTime(variations[0].expiry_date);
                        variations[0].cost = ($$("txtAddStockCost").value() == "" || $$("txtAddStockCost").value() == null) ? "0" : $$("txtAddStockCost").value();
                        if (typeof variations[0].cost == "undefined" || variations[0].cost == "" || variations[0].cost == null || parseFloat(variations[0].cost) <= 0 || isNaN(variations[0].cost)) {
                            throw "Cost should be number and positive";
                        }
                        var inventItem={
                            var_no: variations[0].var_no,
                            qty: $$("txtAddInventoryQty").val(),
                            trans_type: $$("ddlAddTransType")[0].value,
                            user_id: getCookie("user_id"),
                            trans_date: tran_date,
                            key1: $$("txtkey1Inventory").val(),
                            key2: $$("txtkey2Inventory").val(),
                            key3: $$("txtkey3Inventory").val(),
                            comments: $$("txtCommentsInventory").val(),
                            //Stock Table Data
                            vendor_no: $$("ddlAddStockVendor").selectedValue(),//variations[0].vendor_no,
                            cost: variations[0].cost,
                            mrp: $$("txtAddStockMrp").value(),//variations[0].mrp,
                            batch_no: $$("txtAddStockBatchNo").value(),//variations[0].batch_no,
                            man_date: variations[0].man_date,
                            expiry_date: variations[0].expiry_date,
                            //FINFACTS ENTRY DATA
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            invent_type: ($$("ddlAddTransType")[0].value == "Damage")?"SaleCredit":$$("ddlAddTransType")[0].value + "Credit",
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            description: ($$("ddlAddTransType")[0].value == "Damage") ? "SaleCredit" : $$("ddlAddTransType")[0].value + "Credit",
                            amount: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val())
                        };
                        page.stockAPI.insertVariationStock(inventItem, function (data1) {
                            alert("Inventory Added Successfully...");
                            if ($$("ddlAddTransType")[0].value == "Sale" || $$("ddlAddTransType")[0].value == "Damage") {
                                var data1 = {
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    description: $$("ddlAddTransType")[0].value,
                                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                    sales_with_out_tax: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    tax_amt: parseFloat(0).toFixed(5),
                                    buying_cost: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    round_off: parseFloat(0).toFixed(5),
                                    key_1: $$("txtkey1Inventory").val(),
                                    key_2: $$("txtkey2Inventory").val(),
                                };
                                page.finfactsEntryAPI.cashSales(data1, function (response) {
                                    alert("Payment is recorded successfully.");
                                    page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemInventory.dataBind(data);
                                        page.view.selectedItemInventory(data);
                                    });
                                    page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemVariations.dataBind(data);
                                        page.view.selectedItemVariation(data);
                                    });
                                    page.controls.pnlAddInventory.close();
                                });
                            }
                            if ($$("ddlAddTransType")[0].value == "Purchase") {
                                var data1 = {
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    description: $$("ddlAddTransType")[0].value,
                                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                    pur_with_out_tax: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    tax_amt: parseFloat(0).toFixed(5),
                                    buying_cost: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    round_off: parseFloat(0).toFixed(5),
                                    key_1: $$("txtkey1Inventory").val(),
                                    key_2: $$("txtkey2Inventory").val(),
                                };
                                page.finfactsEntryAPI.cashPurchase(data1, function (response) {
                                    alert("Payment is recorded successfully.");
                                    page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemInventory.dataBind(data);
                                        page.view.selectedItemInventory(data);
                                    });
                                    page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemVariations.dataBind(data);
                                        page.view.selectedItemVariation(data);
                                    });
                                    page.controls.pnlAddInventory.close();
                                });
                            }
                            if ($$("ddlAddTransType")[0].value == "PurchaseReturn") {
                                var data1 = {
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    description: $$("ddlAddTransType")[0].value,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                    pur_with_out_tax: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    tax_amt: parseFloat(0).toFixed(5),
                                    buying_cost: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    round_off: parseFloat(0).toFixed(5),
                                    key_1: $$("txtkey1Inventory").val(),
                                    key_2: $$("txtkey2Inventory").val(),
                                };
                                page.finfactsEntryAPI.cashReturnPurchase(data1, function (response) {
                                    alert("Payment is recorded successfully.");
                                    page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemInventory.dataBind(data);
                                        page.view.selectedItemInventory(data);
                                    });
                                    page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemVariations.dataBind(data);
                                        page.view.selectedItemVariation(data);
                                    });
                                    page.controls.pnlAddInventory.close();
                                });
                            }
                            if ($$("ddlAddTransType")[0].value == "SaleReturn") {
                                var data1 = {
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    description: $$("ddlAddTransType")[0].value,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                    sales_with_out_tax: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    tax_amt: parseFloat(0).toFixed(5),
                                    buying_cost: parseFloat(variations[0].cost) * parseFloat($$("txtAddInventoryQty").val()),
                                    round_off: parseFloat(0).toFixed(5),
                                    key_1: $$("txtkey1Inventory").val(),
                                    key_2: $$("txtkey2Inventory").val(),
                                };
                                page.finfactsEntryAPI.cashReturnSales(data1, function (response) {
                                    alert("Payment is recorded successfully.");
                                    page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemInventory.dataBind(data);
                                        page.view.selectedItemInventory(data);
                                    });
                                    page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        //page.controls.grdItemVariations.dataBind(data);
                                        page.view.selectedItemVariation(data);
                                    });
                                    page.controls.pnlAddInventory.close();
                                });
                            }
                        });
                    }
                }catch(e){
                    alert(e);
                    $$("btnAddInvent").disable(false);
                    $$("btnAddInvent").show();
                }
            },
          
            btnRemoveVariation_click: function () {
                var flag = false;
                if ($$("grdItemVariations").selectedData()[0] == undefined)
                    $$("msgPanel").show("Select a variation to removed...!");
                else {
                    if (confirm("Are You Sure Want To Remove This Variation")) {
                        if (confirm("If You Delete This Variation It Will Affect The Bill Also")) {
                            var data = {
                                item_no: page.item_no,
                                variation_name: page.controls.grdItemVariations.selectedData()[0].variation_name
                            }
                            $(page.controls.grdItemInventory.allData()).each(function (i, item) {
                                if (item.variation_name == data.variation_name) {
                                    flag = true;
                                }
                            });
                            if (flag == true)
                                if (confirm("This may happen negative the stock value"))
                                    flag = false;
                            if (flag == false)
                                page.stockAPI.deleteVariation(page.controls.grdItemVariations.selectedData()[0].var_no, function (data) {
                                    $$("msgPanel").show("Variation removed successfully...!");

                                    page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                                        //page.controls.grdItemVariations.dataBind(data1);
                                        page.view.selectedItemVariation(data1);
                                        page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                            //page.controls.grdItemInventory.dataBind(data);
                                            page.view.selectedItemInventory(data);
                                        });
                                    });
                                })
                        }
                    }
                }
            },
            btnSetVariation_click: function () {
                page.controls.pnlSetVariation.open();
                page.controls.pnlSetVariation.title("Set Variation");
                page.controls.pnlSetVariation.rlabel("Set Variation");
                page.controls.pnlSetVariation.width(500);
                page.controls.pnlSetVariation.height(400);
            }
        };
        page.events.btnItemVariationSave_click = function () {
            var data = {
                item_no: page.item_no
            };
            if ($$("chkItemVariationSupplierNo").prop("checked")) {
                data.var_supp_no = 1;
            }
            else {
                data.var_supp_no = 0;
            }
            if ($$("chkItemVariationBuyingCost").prop("checked")) {
                data.var_buying_cost = 1;
            }
            else {
                data.var_buying_cost = 0;
            }
            if ($$("chkItemVariationMRP").prop("checked")) {
                data.var_mrp = 1;
            }
            else {
                data.var_mrp = 0;
            }
            if ($$("chkItemVariationBatchNo").prop("checked")) {
                data.var_batch_no = 1;
            }
            else {
                data.var_batch_no = 0;
            }
            if ($$("chkItemVariationManDate").prop("checked")) {
                data.var_man_date = 1;
            }
            else {
                data.var_man_date = 0;
            }
            if ($$("chkItemVariationExpiryDate").prop("checked")) {
                data.var_expiry_date = 1;
            }
            else {
                data.var_expiry_date = 0;
            }
            if ($$("chkItemVariationInvoiceNo").prop("checked")) {
                data.var_invoice_no = 1;
            }
            else {
                data.var_invoice_no = 0;
            }
            if ($$("chkItemVariationSize").prop("checked")) {
                data.var_size = 1;
            }
            else {
                data.var_size = 0;
            }
            if ($$("chkItemVariationColor").prop("checked")) {
                data.var_color = 1;
            }
            else {
                data.var_color = 0;
            }
            if ($$("chkItemVariationPattern").prop("checked")) {
                data.var_pattern = 1;
            }
            else {
                data.var_pattern = 0;
            }
            if ($$("chkItemVariationMaterial").prop("checked")) {
                data.var_material = 1;
            }
            else {
                data.var_material = 0;
            }
            var check = check_variation(data);
            if (check.length == 0) {
                page.itemAPI.putValue(page.item_no, data, function (data) {
                    alert("Data Saved Successfully");
                }, function () {
                    alert("Some Problem Will Occur Please Try Again Later");
                });
            }
            else {
                alert("The Variation" + check [0].name+ " Does Not Support The New Variation Format So Deactivate It And Try Again");
            }
        };
        function check_variation(data) {
            var check = [];
            $(page.controls.grdItemVariations.allData()).each(function (i, item) {
                if(item.active == "1"){
                    if (data.var_supp_no == "0") {
                        if (item.vendor_no != "-1" && item.vendor_no != "" && item.vendor_no != null && typeof item.vendor_no != "undefined")
                        {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_buying_cost == "0") {
                        if (item.cost != "0" && item.cost != "" && item.cost != null && typeof item.cost != "undefined")
                        {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_mrp == "0") {
                        if (item.mrp != "0" && item.mrp != "" && item.mrp != null && typeof item.mrp != "undefined")
                        {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_batch_no == "0") {
                        if (item.batch_no != "" && item.batch_no != null && typeof item.batch_no != "undefined")
                        {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_man_date == "0") {
                        if (item.man_date != "" && item.man_date != null && typeof item.man_date != "undefined")
                        {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_expiry_date == "0") {
                        if (item.expiry_date != "" && item.expiry_date != null && typeof item.expiry_date != "undefined")
                        {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_invoice_no == "0") {
                        if (item.invoice_no != "" && item.invoice_no != null && typeof item.invoice_no != "undefined") {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_size == "0") {
                        if (item.size != "" && item.size != null && typeof item.size != "undefined") {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_color == "0") {
                        if (item.color != "" && item.color != null && typeof item.color != "undefined") {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_pattern == "0") {
                        if (item.pattern != "" && item.pattern != null && typeof item.pattern != "undefined") {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                    if (data.var_material == "0") {
                        if (item.material != "" && item.material != null && typeof item.material != "undefined") {
                            check.push({
                                name: item.variation_name
                            });
                        }
                    }
                }
            });
            return (check);
        }
        page.interface.load = function(itemNo,exp_days) {
            page.item_no = itemNo;
            page.expiry_days = exp_days;
            page.itemAPI.getValue(itemNo, function (variation_data) {
                page.qty_type = variation_data[0].qty_type;
                page.vendor_no = variation_data[0].vendor_no;
                page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                    //page.controls.grdItemInventory.dataBind(data);
                    page.view.selectedItemInventory(data);
                    page.stockAPI.searchVariationsMain (page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                        //page.controls.grdItemVariations.dataBind(data1);
                        page.view.selectedItemVariation(data1);
                        // page.itemAPI.getValue(page.item_no, function (itemData) {
                        //    page.qty_type = itemData[0].qty_type;
                        //    page.vendor_no = itemData[0].vendor_no;
                        //});
                    });
                });
                page.loadItemVariation(variation_data[0]);
            });
        }
        page.view = {
            selectedItemVariation: function (data) {
                var grdVariationWidth = 550;
                if (CONTEXT.ENABLE_VARIATION)
                    grdVariationWidth = grdVariationWidth + 130;
                if (CONTEXT.ENABLE_BAT_NO)
                    grdVariationWidth = grdVariationWidth + 80;
                else {
                    grdVariationWidth = grdVariationWidth + 210;
                }
                if (CONTEXT.ENABLE_EXP_DATE)
                    grdVariationWidth = grdVariationWidth + 100;
                if (CONTEXT.ENABLE_MAN_DATE)
                    grdVariationWidth = grdVariationWidth + 160;
                page.controls.grdItemVariations.width(grdVariationWidth + "px");//940px;
                page.controls.grdItemVariations.height("245px");
                page.controls.grdItemVariations.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "100px", 'dataField': "cost", visible: $$("chkItemVariationBuyingCost").prop("checked") },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "80px", 'dataField': "qty" },
                        { 'name': "MRP", 'rlabel': 'MRP', 'width': "60px", 'dataField': "mrp", visible: $$("chkItemVariationMRP").prop("checked") },
                        { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "70px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && $$("chkItemVariationBatchNo").prop("checked") },
                        { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && $$("chkItemVariationExpiryDate").prop("checked") },
                        { 'name': "Manufacture Date", 'rlabel': 'Man Date', 'width': "150px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE && $$("chkItemVariationManDate").prop("checked") },
                        { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "120px", 'dataField': "vendor_name", visible: $$("chkItemVariationSupplierNo").prop("checked") },
                        { 'name': "Invoice No", 'rlabel': 'Invoice No', 'width': "90px", 'dataField': "invoice_no", visible: $$("chkItemVariationInvoiceNo").prop("checked") },
                        { 'name': "Size", 'rlabel': 'Size', 'width': "90px", 'dataField': "size", visible: $$("chkItemVariationSize").prop("checked") },
                        { 'name': "Color", 'rlabel': 'Color', 'width': "90px", 'dataField': "color", visible: $$("chkItemVariationColor").prop("checked") },
                        { 'name': "Pattern", 'rlabel': 'Pattern', 'width': "90px", 'dataField': "pattern", visible: $$("chkItemVariationPattern").prop("checked") },
                        { 'name': "Material", 'rlabel': 'Material', 'width': "110px", 'dataField': "material", visible: $$("chkItemVariationMaterial").prop("checked") },
                        { 'name': "", 'width': "0px", 'dataField': "vendor_no" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                    ]
                });

                $$("grdItemVariations").rowBound = function (row, item) {
                    if (item.active == "0") {
                        row[0].style.color = "red";
                    }
                }
                page.controls.grdItemVariations.dataBind(data);
            },
            selectedItemInventory: function (data) {
                var grdWidth = 1500;
                if (CONTEXT.ENABLE_VARIATION)
                    grdWidth = grdWidth + 170;
                if (CONTEXT.ENABLE_MAN_DATE)
                    grdWidth = grdWidth + 170;
                page.controls.grdItemInventory.width(grdWidth + "px");//1400px;
                page.controls.grdItemInventory.height("350px");
                page.controls.grdItemInventory.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Trans Id", 'rlabel': 'Trans Id', 'width': "70px", 'dataField': "stock_no", filterType: "Text" },
                        { 'name': "Trans Date", 'rlabel': 'Trans Date', 'width': "90px", 'dataField': "trans_date", filterType: "Select" },
                        { 'name': "Trans Type", 'rlabel': 'Trans Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "key1", filterType: "Text" },
                        { 'name': "Variation Name", 'rlabel': 'Variation', 'width': "150px", 'dataField': "variation_name", filterType: "Select", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "110px", 'dataField': "vendor_name", filterType: "Select" },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "qty", filterType: "Text" },
                        { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost", filterType: "Select" },
                        { 'name': "Comment", 'rlabel': 'Comments', 'width': "70px", 'dataField': "comments" },
                        { 'name': "MRP", 'rlabel': 'MRP', 'width': "65px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP, filterType: "Select" },
                        { 'name': "Manufacture Date", 'rlabel': 'Man Date', 'width': "150px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE },
                        { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE, filterType: "Select" },
                        { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "90px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO, filterType: "Select" },
                        { 'name': "Invoice No", 'rlabel': 'Invoice No', 'width': "90px", 'dataField': "invoice_no", visible: $$("chkItemVariationInvoiceNo").prop("checked") },
                        { 'name': "Size", 'rlabel': 'Size', 'width': "90px", 'dataField': "size", visible: $$("chkItemVariationSize").prop("checked") },
                        { 'name': "Color", 'rlabel': 'Color', 'width': "90px", 'dataField': "color", visible: $$("chkItemVariationColor").prop("checked") },
                        { 'name': "Pattern", 'rlabel': 'Pattern', 'width': "90px", 'dataField': "pattern", visible: $$("chkItemVariationPattern").prop("checked") },
                        { 'name': "Material", 'rlabel': 'Material', 'width': "110px", 'dataField': "material", visible: $$("chkItemVariationMaterial").prop("checked") },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                    ]
                });
                page.controls.grdItemInventory.dataBind(data);
                page.controls.grdItemInventory.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "edit") {
                        page.controls.pnlUpdInventory.open();
                    }
                }
            }
        }
        page.loadItemVariation = function(data){
            if (data.var_supp_no == "1") {
                $$("chkItemVariationSupplierNo").prop('checked', true);
            }
            else {
                $$("chkItemVariationSupplierNo").prop('checked', false);
            }
            if (data.var_buying_cost == "1") {
                $$("chkItemVariationBuyingCost").prop('checked', true);
            }
            else {
                $$("chkItemVariationBuyingCost").prop('checked', false);
            }
            if (data.var_mrp == "1") {
                $$("chkItemVariationMRP").prop('checked', true);
            }
            else {
                $$("chkItemVariationMRP").prop('checked', false);
            }
            if (data.var_batch_no == "1") {
                $$("chkItemVariationBatchNo").prop('checked', true);
            }
            else {
                $$("chkItemVariationBatchNo").prop('checked', false);
            }
            if (data.var_man_date == "1") {
                $$("chkItemVariationManDate").prop('checked', true);
            }
            else {
                $$("chkItemVariationManDate").prop('checked', false);
            }
            if (data.var_expiry_date == "1") {
                $$("chkItemVariationExpiryDate").prop('checked', true);
            }
            else {
                $$("chkItemVariationExpiryDate").prop('checked', false);
            }
            if (data.var_invoice_no == "1") {
                $$("chkItemVariationInvoiceNo").prop('checked', true);
            }
            else {
                $$("chkItemVariationInvoiceNo").prop('checked', false);
            }
            if (data.var_size == "1") {
                $$("chkItemVariationSize").prop('checked', true);
            }
            else {
                $$("chkItemVariationSize").prop('checked', false);
            }
            if (data.var_color == "1") {
                $$("chkItemVariationColor").prop('checked', true);
            }
            else {
                $$("chkItemVariationColor").prop('checked', false);
            }
            if (data.var_pattern == "1") {
                $$("chkItemVariationPattern").prop('checked', true);
            }
            else {
                $$("chkItemVariationPattern").prop('checked', false);
            }
            if (data.var_material == "1") {
                $$("chkItemVariationMaterial").prop('checked', true);
            }
            else {
                $$("chkItemVariationMaterial").prop('checked', false);
            }
        }
    });
}