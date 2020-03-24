$.fn.itemInventory = function() {
    return $.pageController.getControl(this, function(page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-invent/item-invent.html");

        page.itemAPI = new ItemAPI();
        page.accService = new AccountingService();
        page.finfactsEntry = new FinfactsEntry();
        page.vendorAPI = new VendorAPI();
        page.stockAPI = new StockAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        
        page.itemSKUAPI = new ItemSKUAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.storeAPI = new StoreAPI();
        page.customerAPI = new CustomerAPI();

        page.attr_list = [];
        page.item_attr_list = [];
        page.storck_attr_list = [];
        page.string_item_attr_list = "";
        page.string_storck_attr_list = "";
        page.string_item_attr_key_list = "";
        page.item_attr_key_list = "";
        page.string_stock_attr_list = "";
        page.storck_attr_key_list = "";
        page.customerList = [];
        page.vendorList = [];
        page.searchList = [];

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
                $$("btnAddVariation").disable(false);
                $$("btnAddVariation").show();
                page.controls.pnlNewVariation.open();
                page.controls.pnlNewVariation.title("New Variation");
                page.controls.pnlNewVariation.rlabel("Variation");
                page.controls.pnlNewVariation.width(450);
                page.controls.pnlNewVariation.height(550);
                page.view.selectedNewVariation([]);
                page.itemAttributeAPI.searchValue(0, "", "attr_no_key in (" + page.item_attr_key_list.join(",") + ")", "","", function (data) {
                    page.view.selectedNewVariation(data);
                });
            },
            btnRemoveInventoryBefore_click: function () {
                
                if (page.controls.grdItemInventory.selectedData()[0].manual_stock == "0"){
                    page.controls.pnlRemoveAlertPopup.open();
                    page.controls.pnlRemoveAlertPopup.title("Remove Alert");
                    page.controls.pnlRemoveAlertPopup.rlabel("Remove Alert");
                    page.controls.pnlRemoveAlertPopup.width(540);
                    page.controls.pnlRemoveAlertPopup.height(200);
                } else {
                    page.controls.pnlRemoveConfirmPopup.open();
                    page.controls.pnlRemoveConfirmPopup.title("Remove Alert");
                    page.controls.pnlRemoveConfirmPopup.rlabel("Remove Alert");
                    page.controls.pnlRemoveConfirmPopup.width(540);
                    page.controls.pnlRemoveConfirmPopup.height(200);
                    if (CONTEXT.ENABLE_REMOVE) {
                        $$("btnRemoveAlertPopupSave").show();
                    }
                    else {
                        $$("btnRemoveAlertPopupSave").hide();
                    }
                }
            },
            btnRemoveAlertPopupClose_click: function () {
                page.controls.pnlRemoveAlertPopup.close();
            },
            btnRemoveConfirmPopupClose_click: function () {
                page.controls.pnlRemoveConfirmPopup.close();
            },
            btnRemoveInventory_click: function () {
                try {
                    //if (page.controls.grdItemInventory.selectedData()[0].manual_stock == "0")
                    //    throw "This Transaction Contains Bill If You Want To Remove This Transaction Please Return The Appropriate Bill....!!!";
                    ////if (page.controls.grdItemInventory.selectedData()[0].bill_code != null && page.controls.grdItemInventory.selectedData()[0].bill_code != "")
                    //    throw "This transaction includes bill no if you want return the item in the bill no " + page.controls.grdItemInventory.selectedData()[0].bill_code;
                    var rowId = page.controls.grdItemInventory.selectedRows()[0].attr("row_id");
                    var data = {
                        item_no: page.item_no,
                        variation_name: page.controls.grdItemInventory.selectedData()[0].variation_name
                    }
                    $(".detail-info").progressBar("show")
                    $$("msgPanel").flash("Removing inventory...");
                    var data1 = {
                        stock_no: page.controls.grdItemInventory.selectedData()[0].stock_no,
                        item_no: page.controls.grdItemInventory.selectedData()[0].item_no,
                        trans_type: page.controls.grdItemInventory.selectedData()[0].trans_type,
                    }
                    page.stockAPI.deleteVariationStock(page.controls.grdItemInventory.selectedData()[0].stock_no, data1, function () {
                        page.controls.grdItemInventory.deleteRow(rowId);
                        var scData = {
                            start_record: "",
                            end_record: "",
                            filter_expression: " item_no=" + page.item_no,
                            sort_expression: "stock_no desc"
                        }
                        page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
                            page.view.selectedItemInventory(data);
                        });
                        var sData = {
                            start_record: "",
                            end_record: "",
                            filter_expression: " item_no=" + page.item_no,
                            sort_expression: ""
                        }
                        page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                            page.view.selectedItemVariation(data);
                            $(".detail-info").progressBar("hide");
                            $$("msgPanel").flash("Inventory removed...");
                            page.controls.pnlRemoveConfirmPopup.close();
                        });

                    });
                }
                catch (e) {
                    $$("msgPanel").show(e);
                    page.controls.pnlRemoveConfirmPopup.close();
                }
            },

            btnAddVariation_click: function () {
                $$("btnAddVariation").disable(true);
                $$("btnAddVariation").hide();
                page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (var_data) {
                    try {
                        if ($$("txtNewVariation").value() == "") {
                            throw ("Enter variation name...!");
                            $$("txtNewVariation").focus();
                        }

                        $(var_data).each(function (i, item) {
                            if (item.variation_name == $$("txtNewVariation").value())
                                throw "Variation should be different";
                        });
                        $(page.controls.grdItemNewVariation.allData()).each(function (i, item) {
                            if(item.attr_value == ""){
                                throw "Variation Value Is Not Empty!!!";
                            }
                        });
                        var result = 0;
                        $(".detail-info").progressBar("show")
                        $$("msgPanel").flash("Inserting inventory...");
                        var insert_data = {
                            store_no: localStorage.getItem("user_store_no"),
                            item_no: page.item_no,
                            variation_name: $$("txtNewVariation").value(),
                            active: 1,
                            user_no: getCookie("user_id"),
                            attr_type1: "",
                            attr_value1: "",
                            attr_type2: "",
                            attr_value2: "",
                            attr_type3: "",
                            attr_value3: "",
                            attr_type4: "",
                            attr_value4: "",
                            attr_type5: "",
                            attr_value5: "",
                            attr_type6: "",
                            attr_value6: "",
                        }
                        $(page.controls.grdItemNewVariation.allData()).each(function (i, item) {
                            if(i == 0){
                                insert_data.attr_type1=item.attr_no;
                                insert_data.attr_value1 = item.attr_value;
                            }
                            if (i == 1) {
                                insert_data.attr_type2 = item.attr_no;
                                insert_data.attr_value2 = item.attr_value;
                            }
                            if (i == 2) {
                                insert_data.attr_type3 = item.attr_no;
                                insert_data.attr_value3 = item.attr_value;
                            }
                            if (i == 3) {
                                insert_data.attr_type4 = item.attr_no;
                                insert_data.attr_value4 = item.attr_value;
                            }
                            if (i == 4) {
                                insert_data.attr_type5 = item.attr_no;
                                insert_data.attr_value5 = item.attr_value;
                            }
                            if (i == 5) {
                                insert_data.attr_type6 = item.attr_no;
                                insert_data.attr_value6 = item.attr_value;
                            }
                        });
                        page.stockAPI.insertVariation(insert_data, function (data) {
                            alert("Variation Added Successfully");
                            page.controls.pnlNewVariation.close();
                            $(".detail-info").progressBar("hide");
                            $$("msgPanel").flash("Inventory inserted...");

                            var sData = {
                                start_record: "",
                                end_record: "",
                                filter_expression: " item_no=" + page.item_no,
                                sort_expression: ""
                            }
                            page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data1) {
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
                                var sData = {
                                    start_record: "",
                                    end_record: "",
                                    filter_expression: " item_no=" + page.item_no,
                                    sort_expression: ""
                                }
                                page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                                    page.view.selectedItemVariation(data);
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
                        var sData = {
                            start_record: "",
                            end_record: "",
                            filter_expression: " item_no=" + page.item_no,
                            sort_expression: ""
                        }
                        page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data1) {
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
                    page.vendorList = data;
                    page.searchList = data;
                    $(data).each(function (i, ven_data) {
                        page.ddl_vendor_name.push({
                            vendor_no: ven_data.vendor_no,
                            vendor_name: ven_data.vendor_name
                        })
                    });
                    page.view.selectedItemVariation([]);
                    page.view.selectedItemInventory([]);
                });
                page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                    page.customerList = data;
                });

                page.controls.txtkey3Inventory.dataBind({
                    getData: function (term, callback) {
                        callback(page.searchList);
                    }
                });

                $("#ddlAddTransType").change(function () {
                    page.controls.txtkey3Inventory.selectedObject.val("");
                    if ($$("ddlAddTransType").val() == "Purchase" || $$("ddlAddTransType").val() == "PurchaseReturn") {
                        page.controls.txtkey3Inventory.clearLastTerm();
                        page.searchList = page.vendorList;
                        page.controls.txtkey3Inventory.clearLastTerm();
                    }
                    else {
                        page.controls.txtkey3Inventory.clearLastTerm();
                        page.searchList = page.customerList;
                        page.controls.txtkey3Inventory.clearLastTerm();
                    }
                });

                //if (CONTEXT.ENABLE_INVENTORY_DETAILS) {
                //    $(".key").show();
                //}
                //else {
                //    $(".key").hide();
                //}

                page.itemAttributeAPI.searchValue(0, "", "", "","", function (data) {
                    page.attr_list = data;
                });
                //var previlageData = {
                //    obj_type: "Product::CompProd::Store",
                //    obj_id: localStorage.getItem("prod_id"),
                //};
                //page.userpermissionAPI.getValue(previlageData, function (store_data) {
                //    var menu_ids = [];
                //    $(store_data).each(function (i, item) {
                //        item.obj_id = item.obj_id.split("::")[2];
                //        menu_ids.push(item.obj_id);
                //    });
                //    var data = {
                //        start_record: 0,
                //        end_record: "",
                //        filter_expression: "store_no in (" + menu_ids.join(",") + ")",
                //        sort_expression: ""
                //    }
                //    page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //        $$("ddlInventoryStore").dataBind(data, "store_no", "store_name", "All");
                //    });
                //});
                //$$("ddlInventoryStore").selectionChange(function(){
                //    var sData = {
                //        start_record: "",
                //        end_record: "",
                //        filter_expression: " item_no=" + page.item_no +" and svt.store_no="+getCookie("user_store_id"),
                //        sort_expression: ""
                //    }
                //    page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                //        page.view.selectedItemVariation(data);
                //    });
                //})
                if ($.parseJSON(localStorage.getItem("user_store_data")).length == 1) {
                    $$("btnStockTransfer").hide();
                    $$("btnStockTransfer").selectedObject.prev().hide();
                }
                else{
                    $("btnStockTransfer").show();
                    $$("btnStockTransfer").selectedObject.prev().show();
                }
            },
            btnAddInvent_click: function () {
                    $$("btnAddInvent").disable(false);
                    $$("btnAddInvent").show();
                    page.controls.pnlAddInventory.open();
                    page.controls.pnlAddInventory.title("Inventory");
                    page.controls.pnlAddInventory.rlabel("Inventory");
                    page.controls.pnlAddInventory.width(800);
                    page.controls.pnlAddInventory.height(550);
                    
                    $$("txtkey1Inventory").val("");
                    $$("txtkey2Inventory").val("");
                    $$("txtkey3Inventory").selectedObject.val("");
                    $$("txtCommentsInventory").val("");
                    $$("txtkey2Inventory").val(page.item_no);
                    $$("txtkey2Inventory").disable(true);
                    $$("ddlAddTransType").val("Purchase");
                    page.view.selectedVariationStock([]);
                    var data = [];
                    page.item_variation_keys = [];
                    page.stock_variation_keys = [];
                    $(page.storck_attr_key_list).each(function (i, item) {
                        if (item != "") {
                            if (!page.item_attr_key_list.includes(item)) {
                                data.push(item);
                                page.stock_variation_keys.push(item);

                            }
                            else {
                                data.push(item);
                                page.item_variation_keys.push(item);
                            }
                        }
                    });
                    if(data.length != 0){
                        page.itemAttributeAPI.searchValue(0, "", "attr_no_key in (" + data.join(",") + ")", "", "", function (data) {
                            var stkAttr = [];
                            var varAttr = page.controls.grdItemVariations.selectedData();
                            if (varAttr.length > 0) {
                                varAttr = varAttr[0];
                                $(data).each(function (i, item) {
                                    if (item.attr_no == varAttr.attr_type1) {
                                        item.attr_value = varAttr.attr_value1;
                                    }
                                    else if (item.attr_no == varAttr.attr_type2) {
                                        item.attr_value = varAttr.attr_value2;
                                    }
                                    else if (item.attr_no == varAttr.attr_type3) {
                                        item.attr_value = varAttr.attr_value3;
                                    }
                                    else if (item.attr_no == varAttr.attr_type4) {
                                        item.attr_value = varAttr.attr_value4;
                                    }
                                    else if (item.attr_no == varAttr.attr_type5) {
                                        item.attr_value = varAttr.attr_value5;
                                    }
                                    else if (item.attr_no == varAttr.attr_type6) {
                                        item.attr_value = varAttr.attr_value6;
                                    }
                                    if (item.attr_no == 'vendor_no') {
                                        $$("txtkey3Inventory").selectedValue(item.attr_value);
                                    }
                                    $$("txtAddInventoryCurntStk").val(varAttr.qty);
                                })
                            }
                            else {
                                var tot_qty = 0;
                                $(page.controls.grdItemVariations.allData()).each(function (i, item) {
                                    tot_qty = parseFloat(tot_qty) + parseFloat(item.qty);
                                });
                                $$("txtAddInventoryCurntStk").val(tot_qty);
                            }
                            if (page.storck_attr_key_list.includes("4")) {
                                $$("pnlAddStockCost").hide();
                            } else {
                                $$("pnlAddStockCost").show();
                            }
                            page.view.selectedVariationStock(data);
                        });
                    }
                    else {
                        var tot_qty = 0;
                        $(page.controls.grdItemVariations.allData()).each(function (i, item) {
                            tot_qty = parseFloat(tot_qty) + parseFloat(item.qty);
                        });
                        $$("txtAddInventoryCurntStk").val(tot_qty);
                    }
                    $$("txtAddInventoryQty").val("");
                    $$("txtAddStockCost").val("");
                    $$("txtAddInventoryQty").focus();

                    //$("[controlid=txtAddInventoryQty]").on('keyup', function (e) {
                    //    if (e.which == 13) {
                    //        if (page.storck_attr_key_list.includes("4")) {

                    //        }
                    //        else {
                    //            $$("txtAddInventoryQty").focus().select();
                    //        }
                    //    }
                //});
                    $("input").keyup(function (event) {
                        if (event.keyCode == 13) {
                            textboxes = $("input");
                            currentBoxNumber = textboxes.index(this);
                            if (textboxes[currentBoxNumber + 1] != null) {
                                nextBox = textboxes[currentBoxNumber + 1];
                                nextBox.focus();
                                nextBox.select();
                            }
                            event.preventDefault();
                            return false;
                        }
                    });
                    $("[controlid=txtCommentsInventory]").on('keyup', function (e) {
                        if (e.which == 13) {
                            if (page.storck_attr_key_list.includes("4")) {
                                $$("grdItemStock").getRow()[0].find("input[dataField=attr_value]").focus().select();
                            }
                            else {
                                $$("txtAddStockCost").focus();
                            }
                        }
                    });
                    $("[controlid=txtAddStockCost]").on('keyup', function (e) {
                        if (e.which == 13) {
                            if ($$("grdItemStock").allData().length == 0) {
                                $(".btnAddInvent").focus();
                            }
                            else {
                                $$("grdItemStock").getRow()[0].find("input[dataField=attr_value]").focus().select();
                            }
                        }
                    });
            },

            btnAddInventory_click: function () {
                var cost = $$("txtAddStockCost").value();
                try {
                    var length = 0, average_stock = "false";
                        if ($$("txtAddInventoryQty").value() == "" || $$("txtAddInventoryQty").value() == null || typeof $$("txtAddInventoryQty").value() == "undefined" || isNaN($$("txtAddInventoryQty").value())) {
                            throw "Quantity Should Be a Number";
                        }
                        if (page.qty_type == "Integer" && CheckDecimal($$("txtAddInventoryQty").value())) {
                            throw "Incorrect Quantity Type";
                        }
                        if (page.qty_type == "Decimal" && !CheckDecimal($$("txtAddInventoryQty").value())) {
                            throw "Incorrect Quantity Type";
                        }
                        var tran_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                       
                        var skuData = {
                            avg_buying_cost: $$("txtAddStockCost").value(),
                            store_no: getCookie("user_store_id")
                        }
                        var varData = {
                            //store_no: getCookie("user_store_id"),
                            store_no: localStorage.getItem("user_fulfillment_store_no"),
                            item_no: page.item_no,
                            active: 1,
                            user_no: getCookie("user_id"),
                            attr_type1: "",
                            attr_value1: "",
                            attr_type2: "",
                            attr_value2: "",
                            attr_type3: "",
                            attr_value3: "",
                            attr_type4: "",
                            attr_value4: "",
                            attr_type5: "",
                            attr_value5: "",
                            attr_type6: "",
                            attr_value6: "",
                        }
                        var inventItem={
                            var_no: "0",
                            item_no: page.item_no,
                            //store_no: getCookie("user_store_id"),
                            store_no: localStorage.getItem("user_fulfillment_store_no"),
                            qty: $$("txtAddInventoryQty").val(),

                            trans_type: $$("ddlAddTransType")[0].value,
                            user_id: getCookie("user_id"),
                            trans_date: tran_date,
                            key1: $$("txtkey1Inventory").val(),
                            key2: $$("txtkey2Inventory").val(),
                            key3: $$("txtkey3Inventory").selectedValue(),
                            comments: $$("txtCommentsInventory").val(),
                            //Stock Table Data
                            cost:$$("txtAddStockCost").value(),
                            avg_buying_cost: $$("txtAddStockCost").value(),
                            u_comp_id: localStorage.getItem("user_company_id"),
                            
                            //FINFACTS ENTRY DATA
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            invent_type: ($$("ddlAddTransType")[0].value == "Damage")?"SaleCredit":$$("ddlAddTransType")[0].value + "Credit",
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            description: (($$("ddlAddTransType")[0].value == "Damage") ? "SaleCredit" : $$("ddlAddTransType")[0].value + "Credit")+" - " + $$("txtkey1Inventory").val(),
                            amount: parseFloat($$("txtAddStockCost").value()) * parseFloat($$("txtAddInventoryQty").val()),
                            
                            
                            attr_type1: "",
                            attr_value1: "",
                            attr_type2: "",
                            attr_value2: "",
                            attr_type3: "",
                            attr_value3: "",
                            attr_type4: "",
                            attr_value4: "",
                            attr_type5: "",
                            attr_value5: "",
                            attr_type6: "",
                            attr_value6: "",

                            tray_mode: "None",
                            tray_id: "",
                            manual_stock:"1"
                        };
                        length++;
                        var strCheckItemVar = "";
                        for (var i = 1; i <= page.storck_attr_list.length; i++) {
                            inventItem["attr_type" + i] = page.storck_attr_list[i-1];
                            $(page.controls.grdItemStock.allData()).each(function (j, item) {
                                if (item.attr_no == inventItem["attr_type" + i]){
                                    inventItem["attr_value" + i] = item.attr_value;
                                    if (item.attr_no == "cost") {
                                        item.attr_value = parseFloat(item.attr_value).toFixed(2);
                                        inventItem["attr_value" + i] = parseFloat(item.attr_value).toFixed(2) + "";
                                        skuData.avg_buying_cost = parseFloat(item.attr_value).toFixed(2)+"";
                                        inventItem.avg_buying_cost = parseFloat(item.attr_value).toFixed(2) + "";
                                        cost = item.attr_value;
                                        inventItem.amount = parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val());
                                        inventItem.cost = parseFloat(cost).toFixed(2);
                                        average_stock = "true";
                                    }
                                }
                            });
                        }
                        for (var i = 1; i <= page.item_attr_list.length; i++) {
                            varData["attr_type" + i] = page.item_attr_list[i-1];
                            $(page.controls.grdItemStock.allData()).each(function (j, item) {
                                if (item.attr_no == varData["attr_type" + i]){
                                    varData["attr_value" + i] = item.attr_value;
                                    strCheckItemVar = strCheckItemVar + item.attr_no + "" + item.attr_value;
                                }
                            });
                        }
                        var var_name = page.item_name;
                        $(page.controls.grdItemStock.allData()).each(function (j, item) {
                            var_name = var_name + "-" + item.attr_no + ":" + item.attr_value;
                        });
                    //page.itemSKUAPI.postValue(skuData, function (sData) {
                        strCheckItemVar = (strCheckItemVar != "") ? strCheckItemVar : page.item_no;
                        inventItem.var_string = strCheckItemVar;
                        varData.variation_name = var_name;
                        var variations = page.controls.grdItemVariations.selectedData();
                        if (page.controls.grdItemVariations.selectedData() != "" && page.controls.grdItemVariations.selectedData() == null || page.controls.grdItemVariations.selectedData() != undefined) {
                            var variations = page.controls.grdItemVariations.selectedData();
                            if (variations.length > 0) {
                                //inventItem.var_no = variations[0].var_no;
                            }
                        }
                        inventItem.var_data = varData;
                        inventItem.average_stock = average_stock;
                        if (cost == "" || cost == null || typeof cost == "undefined" || isNaN(cost)) {
                            throw "Cost Should Be a Number";
                        }
                        page.stockAPI.insertVariationStock(inventItem, function (data1) {
                            var key_4 = data1[0].stock_no;
                                $$("msgPanel").flash("Inventory Added Successfully...");
                                if ($$("ddlAddTransType")[0].value == "Sale" || $$("ddlAddTransType")[0].value == "Damage") {
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        description: $$("ddlAddTransType")[0].value + " - Manual - " + $$("txtkey1Inventory").val(),
                                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        tax_amt: parseFloat(0).toFixed(5),
                                        buying_cost: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        round_off: parseFloat(0).toFixed(5),
                                        key_1: $$("txtkey1Inventory").val(),
                                        key_2: $$("txtkey2Inventory").val(),
                                        key_4: key_4,
                                    };
                                    page.finfactsEntryAPI.cashSales(data1, function (response) {
                                        $$("msgPanel").flash("Finfacts is recorded successfully.");
                                        var scData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " stock_no desc"
                                        }
                                        page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
                                        //page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                            page.view.selectedItemInventory(data);
                                        });
                                        //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var sData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " sku_no desc"
                                        }
                                        page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
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
                                        description: $$("ddlAddTransType")[0].value + " - Manual - " + $$("txtkey1Inventory").val(),
                                        target_acc_id: CONTEXT.INFACTS_PURCHASE_DEF_CASH_ACCOUNT,//FINFACTS_PURCHASE_DEF_BANK_ACCOUNT,//F
                                        pur_with_out_tax: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        tax_amt: parseFloat(0).toFixed(5),
                                        buying_cost: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        round_off: parseFloat(0).toFixed(5),
                                        key_1: $$("txtkey1Inventory").val(),
                                        key_2: $$("txtkey2Inventory").val(),
                                        key_4:key_4,
                                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                    };
                                    page.finfactsEntryAPI.cashPurchase(data1, function (response) {
                                        $$("msgPanel").flash("Finfacts updated successfully.");
                                        //page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var scData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " stock_no desc"
                                        }
                                        page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
                                            page.view.selectedItemInventory(data);
                                        });
                                        //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var sData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " sku_no desc"
                                        }
                                        page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                                            page.view.selectedItemVariation(data);
                                        });
                                        page.controls.pnlAddInventory.close();
                                    });
                                }
                                if ($$("ddlAddTransType")[0].value == "PurchaseReturn") {
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        description: $$("ddlAddTransType")[0].value + " - Manual - " + $$("txtkey1Inventory").val(),
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        target_acc_id: CONTEXT.FINFACTS_PURCHASE_DEF_CASH_ACCOUNT,
                                        pur_with_out_tax: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        tax_amt: parseFloat(0).toFixed(5),
                                        buying_cost: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        round_off: parseFloat(0).toFixed(5),
                                        key_1: $$("txtkey1Inventory").val(),
                                        key_2: $$("txtkey2Inventory").val(),
                                        key_4: key_4,
                                    };
                                    page.finfactsEntryAPI.cashReturnPurchase(data1, function (response) {
                                        $$("msgPanel").flash("Finfacts is updated successfully.");
                                        //page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var scData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " stock_no desc"
                                        }
                                        page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
                                            page.view.selectedItemInventory(data);
                                        });
                                        //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var sData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " sku_no desc"
                                        }
                                        page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                                            page.view.selectedItemVariation(data);
                                        });
                                        page.controls.pnlAddInventory.close();
                                    });
                                }
                                if ($$("ddlAddTransType")[0].value == "SaleReturn") {
                                    var data1 = {
                                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                        description: $$("ddlAddTransType")[0].value + " - Manual - " + $$("txtkey1Inventory").val(),
                                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                        sales_with_out_tax: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        tax_amt: parseFloat(0).toFixed(5),
                                        buying_cost: parseFloat(cost) * parseFloat($$("txtAddInventoryQty").val()),
                                        round_off: parseFloat(0).toFixed(5),
                                        key_1: $$("txtkey1Inventory").val(),
                                        key_2: $$("txtkey2Inventory").val(),
                                        key_4: key_4,
                                    };
                                    page.finfactsEntryAPI.cashReturnSales(data1, function (response) {
                                        $$("msgPanel").flash("Finfacts updated successfully.");
                                        //page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var scData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " stock_no desc"
                                        }
                                        page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
                                            page.view.selectedItemInventory(data);
                                        });
                                        //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                                        var sData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: " sku_no desc"
                                        }
                                        page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                                            page.view.selectedItemVariation(data);
                                        });
                                        page.controls.pnlAddInventory.close();
                                    });
                                }
                            //})

                        });
                    //}
                }catch(e){
                    $$("msgPanel").show(e);
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
                                    var sData = {
                                        start_record: "",
                                        end_record: "",
                                        filter_expression: " item_no=" + page.item_no,
                                        sort_expression: ""
                                    }
                                    page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data1) {
                                        page.view.selectedItemVariation(data1);
                                        var scData = {
                                            start_record: "",
                                            end_record: "",
                                            filter_expression: " item_no=" + page.item_no,
                                            sort_expression: ""
                                        }
                                        page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
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
                page.controls.pnlSetVariation.width(800);
                page.controls.pnlSetVariation.height(450);

                page.controls.grdItemVariation.width("100%");
                page.controls.grdItemVariation.setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Name", 'width': "200px", 'dataField': "attr_name" },
                        { 'name': "", 'width': "0px", 'dataField': "attr_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "attr_no_key", visible: false }
                    ]
                });
                page.controls.grdItemVariation.selectionChanged = function (row, item1) {
                    page.itemAttributeAPI.searchValue(0, "", "", "","", function (data) {
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
                page.controls.grdItemStockVariation.setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Name", 'width': "200px", 'dataField': "attr_name" },
                        { 'name': "", 'width': "0px", 'dataField': "attr_no", visible: false }
                    ]
                });
                $$("grdItemStockVariation").dataBind([]);
                
                
                $$("grdItemVariation").dataBind(page.attr_list);
                $$("grdItemStockVariation").dataBind(page.attr_list);
            },

            btnStockTransfer_click: function () {
                var sData = {
                    start_record: "",
                    end_record: "",
                    filter_expression: " item_no=" + page.item_no,
                    sort_expression: ""
                }
                page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                    page.view.selectedStockTransfer(data);
                });
                page.controls.pnlStockTransfer.open();
                page.controls.pnlStockTransfer.title("Stock Transfer");
                page.controls.pnlStockTransfer.rlabel("Stock Transfer");
                page.controls.pnlStockTransfer.width(1000);
                page.controls.pnlStockTransfer.height(500);
                $$("ddlTransferStore").dataBind($.parseJSON(localStorage.getItem("user_store_data")), "store_no", "store_name");
            },
            btnStockTransferConfirm_click:function(){
                if (confirm("Are You Sure Want To Transfer This Stock")) {
                    try {
                        var sales_data = [], purchase_data = [], noStock = true;;
                        if (localStorage.getItem("user_fulfillment_store_no") == $$("ddlTransferStore").selectedValue())
                            throw "Please Select Different Store To Transfer The Stock";
                        $($$("grdStockTransfer").allData()).each(function (i, item) {
                            if (parseFloat(item.transfer_qty) > 0) {
                                noStock = false;
                                if (parseInt(item.qty) <= 0)
                                    throw "This SKU " + item.sku_no + " does not have the stock to transfer";
                                sales_data.push({
                                    var_no: item.var_no,
                                    sku_no: item.sku_no,
                                    cost: item.avg_buying_cost,
                                    avg_buying_cost: item.avg_buying_cost,
                                    qty: item.transfer_qty,
                                    comments: "",
                                    trans_type: "MoveOut",
                                    trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    key1: "",
                                    key2: page.item_no,
                                    key3: "",
                                    invent_type: "SaleCredit",
                                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    amount: (parseFloat(item.avg_buying_cost) * parseFloat(item.transfer_qty)),
                                    store_no: localStorage.getItem("user_store_no"),
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
                                    tray_received: item.transfer_qty,
                                    tray_id: "",
                                    tray_mode: "",//"SKU",
                                    tray_trans_type: "Customer Sales",
                                });
                                purchase_data.push({
                                    var_no: "0",
                                    sku_no: "-1",
                                    item_no:page.item_no,
                                    cost: item.avg_buying_cost,
                                    avg_buying_cost: item.avg_buying_cost,
                                    qty: item.transfer_qty,
                                    comments: "",
                                    trans_type: "MoveIn",
                                    trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    key1: "",
                                    key2: page.item_no,
                                    key3: "",
                                    invent_type: "PurchaseCredit",
                                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    amount: (parseFloat(item.avg_buying_cost) * parseFloat(item.transfer_qty)),
                                    store_no: $$("ddlTransferStore").selectedValue(),
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
                                    tray_received: item.transfer_qty,
                                    tray_id: "",
                                    tray_mode: "",//"SKU",
                                    tray_trans_type: "Customer Sales",
                                    u_comp_id: localStorage.getItem("user_company_id"),
                                    var_data: {
                                        store_no: $$("ddlTransferStore").selectedValue(),
                                        item_no: page.item_no,
                                        avg_buying_cost: item.avg_buying_cost,
                                        variation_name: item.attr_type1 + "-" + item.attr_value1 + "-" + item.attr_type2 + "-" + item.attr_value2 + item.attr_type3 + "-" + item.attr_value3,
                                        active: 1,
                                        user_no: localStorage.getItem("app_user_id"),
                                        attr_type1: typeof page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[0])] == "undefined" ? "" : page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[0])],
                                        attr_value1: (page.storck_attr_list.indexOf(page.item_attr_list[0]) == 0) ? item.attr_value1 : (page.storck_attr_list.indexOf(page.item_attr_list[0]) == 1) ? item.attr_value2 : (page.storck_attr_list.indexOf(page.item_attr_list[0]) == 2) ? item.attr_value3 : (page.storck_attr_list.indexOf(page.item_attr_list[0]) == 3) ? item.attr_value4 : (page.storck_attr_list.indexOf(page.item_attr_list[0]) == 4) ? item.attr_value5 : (page.storck_attr_list.indexOf(page.item_attr_list[0]) == 5) ? item.attr_value6 : "",
                                        attr_type2: typeof page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[1])] == "undefined" ? "" : page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[1])],
                                        attr_value2: (page.storck_attr_list.indexOf(page.item_attr_list[1]) == 0) ? item.attr_value1 : (page.storck_attr_list.indexOf(page.item_attr_list[1]) == 1) ? item.attr_value2 : (page.storck_attr_list.indexOf(page.item_attr_list[1]) == 2) ? item.attr_value3 : (page.storck_attr_list.indexOf(page.item_attr_list[1]) == 3) ? item.attr_value4 : (page.storck_attr_list.indexOf(page.item_attr_list[1]) == 4) ? item.attr_value5 : (page.storck_attr_list.indexOf(page.item_attr_list[1]) == 5) ? item.attr_value6 : "",
                                        attr_type3: typeof page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[2])] == "undefined" ? "" : page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[2])],
                                        attr_value3: (page.storck_attr_list.indexOf(page.item_attr_list[2]) == 0) ? item.attr_value1 : (page.storck_attr_list.indexOf(page.item_attr_list[2]) == 1) ? item.attr_value2 : (page.storck_attr_list.indexOf(page.item_attr_list[2]) == 2) ? item.attr_value3 : (page.storck_attr_list.indexOf(page.item_attr_list[2]) == 3) ? item.attr_value4 : (page.storck_attr_list.indexOf(page.item_attr_list[2]) == 4) ? item.attr_value5 : (page.storck_attr_list.indexOf(page.item_attr_list[2]) == 5) ? item.attr_value6 : "",
                                        attr_type4: typeof page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[3])] == "undefined" ? "" : page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[3])],
                                        attr_value4: (page.storck_attr_list.indexOf(page.item_attr_list[3]) == 0) ? item.attr_value1 : (page.storck_attr_list.indexOf(page.item_attr_list[3]) == 1) ? item.attr_value2 : (page.storck_attr_list.indexOf(page.item_attr_list[3]) == 2) ? item.attr_value3 : (page.storck_attr_list.indexOf(page.item_attr_list[3]) == 3) ? item.attr_value4 : (page.storck_attr_list.indexOf(page.item_attr_list[3]) == 4) ? item.attr_value5 : (page.storck_attr_list.indexOf(page.item_attr_list[3]) == 5) ? item.attr_value6 : "",
                                        attr_type5: typeof page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[4])] == "undefined" ? "" : page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[4])],
                                        attr_value5: (page.storck_attr_list.indexOf(page.item_attr_list[4]) == 0) ? item.attr_value1 : (page.storck_attr_list.indexOf(page.item_attr_list[4]) == 1) ? item.attr_value2 : (page.storck_attr_list.indexOf(page.item_attr_list[4]) == 2) ? item.attr_value3 : (page.storck_attr_list.indexOf(page.item_attr_list[4]) == 3) ? item.attr_value4 : (page.storck_attr_list.indexOf(page.item_attr_list[4]) == 4) ? item.attr_value5 : (page.storck_attr_list.indexOf(page.item_attr_list[4]) == 5) ? item.attr_value6 : "",
                                        attr_type6: typeof page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[5])] == "undefined" ? "" : page.storck_attr_list[page.storck_attr_list.indexOf(page.item_attr_list[5])],
                                        attr_value6: (page.storck_attr_list.indexOf(page.item_attr_list[5]) == 0) ? item.attr_value1 : (page.storck_attr_list.indexOf(page.item_attr_list[5]) == 1) ? item.attr_value2 : (page.storck_attr_list.indexOf(page.item_attr_list[5]) == 2) ? item.attr_value3 : (page.storck_attr_list.indexOf(page.item_attr_list[5]) == 3) ? item.attr_value4 : (page.storck_attr_list.indexOf(page.item_attr_list[5]) == 4) ? item.attr_value5 : (page.storck_attr_list.indexOf(page.item_attr_list[5]) == 5) ? item.attr_value6 : "",
                                    }
                                });
                            }
                        });
                        if (noStock)
                            throw "No Transfer Qty Is Specified...";
                        page.stockAPI.insertVariationStock(sales_data, function (data1) {
                            page.stockAPI.insertVariationStock(purchase_data, function (data1) {
                                alert("Stock Successfully Transfered...!");
                                page.interface.load(page.item_no, page.expiry_days);
                                page.controls.pnlStockTransfer.close();
                            });
                        });
                    }
                    catch (e) {
                        alert(e);
                    }
                }
            }
        };
        page.events.btnItemVariationSave_click = function () {
            var data = {
                item_no: page.item_no,
                var_attribute: "",
                var_stock_attribute: "",
                var_attr_key: "",
                var_stock_attr_key:""
            };
            $($$("grdItemVariation").selectedData()).each(function (i, item) {
                if (data.var_attribute == "")
                    data.var_attribute = item.attr_no;
                else
                    data.var_attribute = data.var_attribute + "," + item.attr_no;

                if (data.var_attr_key == "")
                    data.var_attr_key = item.attr_no_key;
                else
                    data.var_attr_key = data.var_attr_key + "," + item.attr_no_key;
            });
            data.var_attribute = (data.var_attribute == "") ? page.item_attr_list.join(",") : data.var_attribute;
            data.var_attr_key = (data.var_attr_key == "") ? page.item_attr_key_list.join(",") : data.var_attr_key;
            data.var_stock_attribute = data.var_attribute;
            $($$("grdItemStockVariation").selectedData()).each(function (i, item) {
                if (data.var_stock_attribute == "")
                    data.var_stock_attribute = item.attr_no;
                else
                    data.var_stock_attribute = data.var_stock_attribute + "," + item.attr_no;

                if (data.var_stock_attr_key == "")
                    data.var_stock_attr_key = item.attr_no_key;
                else
                    data.var_stock_attr_key = data.var_stock_attr_key + "," + item.attr_no_key;
            });
            data.var_stock_attribute = (data.var_stock_attribute == "") ? page.storck_attr_list.join(",") : data.var_stock_attribute;
            data.var_stock_attr_key = (data.var_stock_attr_key == "") ? page.storck_attr_key_list.join(",") : data.var_attr_key +","+data.var_stock_attr_key;
            page.itemAPI.putValue(page.item_no, data, function (data) {
                alert("Data Saved Successfully");
                page.controls.pnlSetVariation.close();
                page.interface.load(page.item_no, page.expiry_days);
            }, function () {
                alert("Some Problem Will Occur Please Try Again Later");
            });
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
                page.item_name = variation_data[0].item_name;
                if (variation_data[0].var_attribute != null && variation_data[0].var_attribute != "" && typeof variation_data[0].var_attribute != "undefined") {
                    if (variation_data[0].var_attribute != null && typeof variation_data[0].var_attribute != "undefined") {
                        page.string_item_attr_list = variation_data[0].var_attribute;
                        page.item_attr_list = variation_data[0].var_attribute.split(",");
                        page.item_attr_list.sort(function (a, b) { return parseInt(a) - parseInt(b) });
                    }
                }
                if (variation_data[0].var_stock_attribute != null && variation_data[0].var_stock_attribute != "" && typeof variation_data[0].var_stock_attribute != "undefined") {
                    page.string_storck_attr_list = variation_data[0].var_stock_attribute;
                    page.storck_attr_list = variation_data[0].var_stock_attribute.split(",");
                    page.storck_attr_list.sort(function (a, b) { return parseInt(a) - parseInt(b) });
                    
                }
                if (variation_data[0].var_attr_key != null && variation_data[0].var_attr_key != "" && typeof variation_data[0].var_attr_key != "undefined") {
                    page.string_item_attr_key_list = variation_data[0].var_attr_key;
                    page.item_attr_key_list = variation_data[0].var_attr_key.split(",");
                    page.item_attr_key_list.sort(function (a, b) { return parseInt(a) - parseInt(b) });
                }
                if (variation_data[0].var_stock_attr_key != null && variation_data[0].var_stock_attr_key != "" && typeof variation_data[0].var_stock_attr_key != "undefined") {
                    page.storck_attr_key_list = variation_data[0].var_stock_attr_key.split(",");
                    page.string_stock_attr_list = variation_data[0].var_stock_attr_key;
                    page.storck_attr_key_list.sort(function (a, b) { return parseInt(a) - parseInt(b) });
                }
                var scData = {
                    start_record: "",
                    end_record: "",
                    filter_expression: " item_no=" + page.item_no,
                    sort_expression: " stock_no desc"
                }
                page.stockAPI.searchValue(scData.start_record, scData.end_record, scData.filter_expression, scData.sort_expression, function (data) {
                    page.view.selectedItemInventory(data);
                    var sData = {
                        start_record: "",
                        end_record: "",
                        filter_expression: " item_no=" + page.item_no,
                        sort_expression: " sku_no desc"
                    }
                    page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data1) {
                        page.view.selectedItemVariation(data1);
                    });
                });
            });
        }
        page.interface.selectedItemInventory= function (data) {
            //var grdWidth = 1500;
            //if (CONTEXT.ENABLE_VARIATION)
            //    grdWidth = grdWidth + 170;
            //if (CONTEXT.ENABLE_MAN_DATE)
            //    grdWidth = grdWidth + 170;
            //page.controls.grdItemInventory.width(grdWidth + "px");//1400px;
            var grdWidth = 100;
            if (page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[1]))
                grdWidth = grdWidth + 5;
            if (page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[2]))
                grdWidth = grdWidth + 10;
            if (page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[3]))
                grdWidth = grdWidth + 10;
            if (page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[4]))
                grdWidth = grdWidth + 10;
            if (page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[5]))
                grdWidth = grdWidth + 10;
            //if (CONTEXT.ENABLE_VARIATION)
            //    grdWidth = grdWidth + 170;
            //if (CONTEXT.ENABLE_MAN_DATE)
            //    grdWidth = grdWidth + 170;
            page.controls.grdItemInventory.width(grdWidth + "%");//1400px;
            page.controls.grdItemInventory.height("250px");
            page.controls.grdItemInventory.setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    { 'name': "Trans Id", 'rlabel': 'Trans Id', 'width': "70px", 'dataField': "stock_no", filterType: "Text" },
                    { 'name': "Trans Date", 'rlabel': 'Trans Date', 'width': "70px", 'dataField': "trans_date", filterType: "Select" },
                    { 'name': "Trans Type", 'rlabel': 'Trans Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "key1", filterType: "Text" },
                    { 'name': "Variation Name", 'rlabel': 'Variation', 'width': "130px;word-break: break-word;white-space: pre-wrap;", 'dataField': "variation_name", filterType: "Select", visible: CONTEXT.ENABLE_VARIATION },
                    { 'name': "SKU", 'rlabel': 'SKU', 'width': "50px", 'dataField': "sku_no", filterType: "Text" },
                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                    { 'name': "Cost", 'rlabel': 'Cost', 'width': "50px", 'dataField': "cost", filterType: "Select" },
                    //{ 'name': "Comment", 'rlabel': 'Comments', 'width': "70px", 'dataField': "comments",visible:false },
                    { 'name': getAttributeName(page.string_stock_attr_list.split(",")[0]), 'rlabel': getAttributeName(page.string_stock_attr_list.split(",")[0]), 'width': "100px", 'dataField': "attr_value1", visible: page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[0]) },
                    { 'name': getAttributeName(page.string_stock_attr_list.split(",")[1]), 'rlabel': getAttributeName(page.string_stock_attr_list.split(",")[1]), 'width': "60px", 'dataField': "attr_value2", visible: page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[1]) },
                    { 'name': getAttributeName(page.string_stock_attr_list.split(",")[2]), 'rlabel': getAttributeName(page.string_stock_attr_list.split(",")[2]), 'width': "70px", 'dataField': "attr_value3", visible: page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[2]) },
                    { 'name': getAttributeName(page.string_stock_attr_list.split(",")[3]), 'rlabel': getAttributeName(page.string_stock_attr_list.split(",")[3]), 'width': "90px", 'dataField': "attr_value4", visible: page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[3]) },
                    { 'name': getAttributeName(page.string_stock_attr_list.split(",")[4]), 'rlabel': getAttributeName(page.string_stock_attr_list.split(",")[4]), 'width': "150px", 'dataField': "attr_value5", visible: page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[4]) },
                    { 'name': getAttributeName(page.string_stock_attr_list.split(",")[5]), 'rlabel': getAttributeName(page.string_stock_attr_list.split(",")[5]), 'width': "120px", 'dataField': "attr_value6", visible: page.storck_attr_list.includes(page.string_storck_attr_list.split(",")[5]) },
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
        page.view = {
            selectedItemVariation: function (data) {
                //var grdVariationWidth = 100;
                //if (CONTEXT.ENABLE_VARIATION)
                //    grdVariationWidth = grdVariationWidth + 10;
                //if (CONTEXT.ENABLE_BAT_NO)
                //    grdVariationWidth = grdVariationWidth + 10;
                //else {
                //    grdVariationWidth = grdVariationWidth + 10;
                //}
                //if (CONTEXT.ENABLE_EXP_DATE)
                //    grdVariationWidth = grdVariationWidth + 10;
                //if (CONTEXT.ENABLE_MAN_DATE)
                //    grdVariationWidth = grdVariationWidth + 10;
                //page.controls.grdItemVariations.width(grdVariationWidth + "%");//940px;
                var grdWidth = 100;
                //if (page.storck_attr_key_list.length - 1 >= 1)
                //    grdWidth = grdWidth + 22;
                if (page.storck_attr_key_list.length - 1 >= 2)
                    grdWidth = grdWidth + 11;
                if (page.storck_attr_key_list.length - 1 >= 3)
                    grdWidth = grdWidth + 11;
                if (page.storck_attr_key_list.length - 1 >= 4)
                    grdWidth = grdWidth + 11;
                if (page.storck_attr_key_list.length - 1 >= 5)
                    grdWidth = grdWidth + 11;
                page.controls.grdItemVariations.width(grdWidth + "%");//1400px;
                page.controls.grdItemVariations.height("250px");
                page.controls.grdItemVariations.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    pageType:"Standard",
                    columns: [
                        { 'name': "SKU", 'rlabel': 'SKU', 'width': "80px", 'dataField': "sku_no" },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "150px;word-break: break-word;white-space: pre-wrap;", 'dataField': "variation_name", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "80px", 'dataField': "qty" },
                        { 'name': getAttributeName(page.storck_attr_key_list[0]), 'rlabel': getAttributeName(page.storck_attr_key_list[0]), 'width': "100px", 'dataField': "attr_value1", visible: (page.storck_attr_key_list.length - 1 >= 0) },
                        { 'name': getAttributeName(page.storck_attr_key_list[1]), 'rlabel': getAttributeName(page.storck_attr_key_list[1]), 'width': "100px", 'dataField': "attr_value2", visible: (page.storck_attr_key_list.length - 1 >= 1) },
                        { 'name': getAttributeName(page.storck_attr_key_list[2]), 'rlabel': getAttributeName(page.storck_attr_key_list[2]), 'width': "100px", 'dataField': "attr_value3", visible: (page.storck_attr_key_list.length - 1 >= 2) },
                        { 'name': getAttributeName(page.storck_attr_key_list[3]), 'rlabel': getAttributeName(page.storck_attr_key_list[3]), 'width': "100px", 'dataField': "attr_value4", visible: (page.storck_attr_key_list.length - 1 >= 3) },
                        { 'name': getAttributeName(page.storck_attr_key_list[4]), 'rlabel': getAttributeName(page.storck_attr_key_list[4]), 'width': "100px", 'dataField': "attr_value5", visible: (page.storck_attr_key_list.length - 1 >= 4) },
                        { 'name': getAttributeName(page.storck_attr_key_list[5]), 'rlabel': getAttributeName(page.storck_attr_key_list[5]), 'width': "100px", 'dataField': "attr_value6", visible: (page.storck_attr_key_list.length - 1 >= 5) },
                        { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "120px", 'dataField': "net_rate",visible:false },
                        { 'name': "AVG BCost", 'rlabel': 'AVG BCost', 'width': "120px", 'dataField': "avg_buying_cost" },
                        { 'name': "", 'width': "0px", 'dataField': "vendor_no" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                        { 'name': "", 'width': "0px", 'dataField': "store_no" },
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
                var grdWidth = 100;
                if (page.storck_attr_key_list.length - 1 >= 1)
                    grdWidth = grdWidth + 5;
                if (page.storck_attr_key_list.length - 1 >= 2)
                    grdWidth = grdWidth + 15;
                if (page.storck_attr_key_list.length - 1 >= 3)
                    grdWidth = grdWidth + 10;
                if (page.storck_attr_key_list.length - 1 >= 4)
                    grdWidth = grdWidth + 10;
                if (page.storck_attr_key_list.length - 1 >= 5)
                    grdWidth = grdWidth + 10;
                //if (CONTEXT.ENABLE_VARIATION)
                //    grdWidth = grdWidth + 170;
                //if (CONTEXT.ENABLE_MAN_DATE)
                //    grdWidth = grdWidth + 170;
                page.controls.grdItemInventory.width(grdWidth + "%");//1400px;
                page.controls.grdItemInventory.height("350px");
                page.controls.grdItemInventory.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Trans Id", 'rlabel': 'Trans Id', 'width': "70px", 'dataField': "stock_no", filterType: "Text" },
                        { 'name': "Trans Date", 'rlabel': 'Trans Date', 'width': "70px", 'dataField': "trans_date", filterType: "Select" },
                        { 'name': "Trans Type", 'rlabel': 'Trans Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_code", filterType: "Text" },
                        { 'name': "Variation Name", 'rlabel': 'Variation', 'width': "130px;word-break: break-word;white-space: pre-wrap;", 'dataField': "variation_name", filterType: "Select", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "SKU", 'rlabel': 'SKU', 'width': "60px", 'dataField': "sku_no", filterType: "Text" },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "60px", 'dataField': "qty", filterType: "Text" },
                        { 'name': "Cost", 'rlabel': 'Cost', 'width': "60px", 'dataField': "avg_buying_cost", filterType: "Select" },
                        //{ 'name': "Comment", 'rlabel': 'Comments', 'width': "70px", 'dataField': "comments" },
                        { 'name': getAttributeName(page.storck_attr_key_list[0]), 'rlabel': getAttributeName(page.storck_attr_key_list[0]), 'width': "100px", 'dataField': "attr_value1", visible: (page.storck_attr_key_list.length - 1 >= 0) },
                        { 'name': getAttributeName(page.storck_attr_key_list[1]), 'rlabel': getAttributeName(page.storck_attr_key_list[1]), 'width': "100px", 'dataField': "attr_value2", visible: (page.storck_attr_key_list.length - 1 >= 1) },
                        { 'name': getAttributeName(page.storck_attr_key_list[2]), 'rlabel': getAttributeName(page.storck_attr_key_list[2]), 'width': "100px", 'dataField': "attr_value3", visible: (page.storck_attr_key_list.length - 1 >= 2) },
                        { 'name': getAttributeName(page.storck_attr_key_list[3]), 'rlabel': getAttributeName(page.storck_attr_key_list[3]), 'width': "100px", 'dataField': "attr_value4", visible: (page.storck_attr_key_list.length - 1 >= 3) },
                        { 'name': getAttributeName(page.storck_attr_key_list[4]), 'rlabel': getAttributeName(page.storck_attr_key_list[4]), 'width': "100px", 'dataField': "attr_value5", visible: (page.storck_attr_key_list.length - 1 >= 4) },
                        { 'name': getAttributeName(page.storck_attr_key_list[5]), 'rlabel': getAttributeName(page.storck_attr_key_list[5]), 'width': "100px", 'dataField': "attr_value6", visible: (page.storck_attr_key_list.length - 1 >= 5) },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                    ]
                });
                page.controls.grdItemInventory.dataBind(data);
                page.controls.grdItemInventory.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "edit") {
                        page.controls.pnlUpdInventory.open();
                    }
                }
                page.controls.grdItemInventory.rowBound = function (row, item) {
                    if (item.bill_code == null || item.bill_code == "" || typeof item.bill_code == "undefined") {
                        $(row).find("[datafield=bill_code]").find("div").html(item.key1);
                    }
                    if (page.storck_attr_list[0] == "cost") {
                        row.find("div[datafield=attr_value1]").css("display", "none");
                        $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value1]").css("display", "none");
                    }
                    if (page.storck_attr_list[1] == "cost") {
                        row.find("div[datafield=attr_value2]").css("display", "none");
                        $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value2]").css("display", "none");
                    }
                    if (page.storck_attr_list[2] == "cost") {
                        row.find("div[datafield=attr_value3]").css("display", "none");
                        $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value3]").css("display", "none");
                    }
                    if (page.storck_attr_list[3] == "cost") {
                        row.find("div[datafield=attr_value4]").css("display", "none");
                        $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value4]").css("display", "none");
                    }
                    if (page.storck_attr_list[4] == "cost") {
                        row.find("div[datafield=attr_value5]").css("display", "none");
                        $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value5]").css("display", "none");
                    }
                    if (page.storck_attr_list[5] == "cost") {
                        row.find("div[datafield=attr_value6]").css("display", "none");
                        $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value6]").css("display", "none");
                    }
                };
                if (page.storck_attr_list[0] == "cost") {
                    $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value1]").css("display", "none");
                }
                if (page.storck_attr_list[1] == "cost") {
                    $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value2]").css("display", "none");
                }
                if (page.storck_attr_list[2] == "cost") {
                    $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value3]").css("display", "none");
                }
                if (page.storck_attr_list[3] == "cost") {
                    $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value4]").css("display", "none");
                }
                if (page.storck_attr_list[4] == "cost") {
                    $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value5]").css("display", "none");
                }
                if (page.storck_attr_list[5] == "cost") {
                    $$("grdItemInventory").selectedObject.find(".grid_header div[datafield=attr_value6]").css("display", "none");
                }
            },
            selectedNewVariation: function (data) {
                page.controls.grdItemNewVariation.width("100%");
                page.controls.grdItemNewVariation.height("300px");
                page.controls.grdItemNewVariation.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "attr_no", 'rlabel': 'attr_no', 'width': "0px", 'dataField': "attr_no", visible: false },
                        { 'name': "Name", 'rlabel': 'Name', 'width': "100px", 'dataField': "attr_name" },
                        { 'name': "Value", 'rlabel': 'Value', 'width': "150px", 'dataField': "attributes", editable: true, itemTemplate: "<div  id='Attributes'></div>" },
                    ]
                });
                page.controls.grdItemNewVariation.rowBound = function (row, item) {
                    var attrTemplate = [];
                    if (item.attr_no == "exp_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value' style='width:130px;'>");
                    }
                    else if (item.attr_no == "man_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value' style='width:130px;'>");
                    }
                    else {
                        attrTemplate.push("<input type='text' dataField='attr_value' style='width:130px;'>");
                    }
                    $(row).find("[id=Attributes]").html(attrTemplate.join(""));
                    $(row).find("input[dataField=attr_value]").change(function () {
                        item.attr_value = $(this).val();
                    });
                }
                page.controls.grdItemNewVariation.dataBind(data);
                page.controls.grdItemNewVariation.edit(true);
            },
            selectedVariationStock: function (data) {
                page.controls.grdItemStock.width("100%");
                page.controls.grdItemStock.height("150px");
                page.controls.grdItemStock.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "60px", 'dataField': "sl_no", visible: false },
                        { 'name': "attr_no", 'rlabel': 'attr_no', 'width': "0px", 'dataField': "attr_no", visible: false },
                        { 'name': "Name", 'rlabel': 'Name', 'width': "150px", 'dataField': "attr_name" },
                        { 'name': "Value", 'rlabel': 'Value', 'width': "200px", 'dataField': "attributes", editable: true, itemTemplate: "<div  id='Attributes'></div>" },
                    ]
                });
                page.controls.grdItemStock.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdItemStock.allData().length);
                    var attrTemplate = [];
                    if (item.attr_no == "exp_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value' style='width:180px;'>");
                    }
                    else if (item.attr_no == "man_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value' style='width:180px;'>");
                    }
                    else {
                        attrTemplate.push("<input type='text' dataField='attr_value' style='width:180px;'>");
                    }
                    $(row).find("[id=Attributes]").html(attrTemplate.join(""));
                    $(row).find("input[dataField=attr_value]").change(function () {
                        item.attr_value = $(this).val();
                    });
                    if (item.attr_value != null && item.attr_value != "" && typeof item.attr_value != "undefined")
                        $(row).find("input[dataField=attr_value]").val(item.attr_value).change();
                    if (item.attr_no == "exp_date") {
                        if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                            if (page.expiry_days.expiry_days != null && typeof page.expiry_days.expiry_days != "undefined" && page.expiry_days.expiry_days != "" && page.expiry_days.expiry_days != "0") {
                                var today = new Date();
                                var numberOfDaysToAdd = parseInt(page.expiry_days.expiry_days);
                                today.setDate(today.getDate() + numberOfDaysToAdd);
                                var year = today.getFullYear();
                                var month = (today.getMonth() + 1) < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
                                var date = (today.getDate()) < 10 ? "0" + today.getDate() : today.getDate();
                                $(row).find("input[dataField=attr_value]").val(year + "-" + month + "-" + date).change();
                            }
                        }
                    }

                    row.on("focus", "input[dataField=attr_value]", function () {
                        page.getattributedata(row,item, function (data) {
                            row.find("input[dataField=attr_value]").autocomplete({
                                minLength: 0,
                                source: data,
                                focus: function (event, ui) {
                                    row.find("input[datafield=variation_name]").val(ui.item.label);
                                    return false;
                                },
                                select: function (event, ui) {
                                    item.attr_value = ui.item.label;
                                    row.find("input[datafield=attr_value]").val(ui.item.label);
                                    return false;
                                },
                                change: function (event, ui) {
                                    item.attr_value = $(this).val();
                                    row.find("input[datafield=attr_value]").val($(this).val());
                                }
                            });
                        });
                    });
                    row.on("keydown", "input[datafield=attr_value]", function (e) {
                        if (e.which == 9 || e.which == 13) {
                            var nextRow = row.next();//$(this).closest("grid_row").next();
                            if (nextRow.length > 0) {
                                nextRow.find("input[dataField=attr_value]").focus().select();
                            } else {
                                $(".btnAddInvent").focus();
                            }
                        }
                    });
                }
                page.controls.grdItemStock.dataBind(data);
                //page.controls.grdItemStock.edit(true);
            },
            selectedStockTransfer: function (data) {
                var grdVariationWidth = 100;
                page.controls.grdStockTransfer.width(grdVariationWidth + "%");//940px;
                page.controls.grdStockTransfer.height("300px");
                page.controls.grdStockTransfer.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    pageType: "Standard",
                    columns: [
                        { 'name': "SKU", 'rlabel': 'SKU', 'width': "80px", 'dataField': "sku_no" },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "150px;word-break: break-word;white-space: pre-wrap;", 'dataField': "variation_name", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "80px", 'dataField': "qty" },
                        { 'name': "Transfer Qty", 'rlabel': 'Transfer Qty', 'width': "100px", 'dataField': "transfer_qty", editable: true },
                        { 'name': getAttributeName(page.storck_attr_key_list[0]), 'rlabel': getAttributeName(page.storck_attr_key_list[0]), 'width': "100px", 'dataField': "attr_value1", visible: (page.storck_attr_key_list.length - 1 >= 0) },
                        { 'name': getAttributeName(page.storck_attr_key_list[1]), 'rlabel': getAttributeName(page.storck_attr_key_list[1]), 'width': "100px", 'dataField': "attr_value2", visible: (page.storck_attr_key_list.length - 1 >= 1) },
                        { 'name': getAttributeName(page.storck_attr_key_list[2]), 'rlabel': getAttributeName(page.storck_attr_key_list[2]), 'width': "100px", 'dataField': "attr_value3", visible: (page.storck_attr_key_list.length - 1 >= 2) },
                        { 'name': getAttributeName(page.storck_attr_key_list[3]), 'rlabel': getAttributeName(page.storck_attr_key_list[3]), 'width': "100px", 'dataField': "attr_value4", visible: (page.storck_attr_key_list.length - 1 >= 3) },
                        { 'name': getAttributeName(page.storck_attr_key_list[4]), 'rlabel': getAttributeName(page.storck_attr_key_list[4]), 'width': "100px", 'dataField': "attr_value5", visible: (page.storck_attr_key_list.length - 1 >= 4) },
                        { 'name': getAttributeName(page.storck_attr_key_list[5]), 'rlabel': getAttributeName(page.storck_attr_key_list[5]), 'width': "100px", 'dataField': "attr_value6", visible: (page.storck_attr_key_list.length - 1 >= 5) },
                    ]
                });

                $$("grdStockTransfer").rowBound = function (row, item) {
                    if (item.active == "0") {
                        row[0].style.color = "red";
                    }
                }
                page.controls.grdStockTransfer.dataBind(data);
                $$("grdStockTransfer").edit(true);
            }
        }
        page.getattributedata = function (row,item, callback) {
            var sku_no = "", attr_value = "", var_attr = "false", item_no,position = 0;

            if ($(row).find("[datafield=sl_no]").find("div").html() == "1") {
                attr_value = "attr_type1";
                var_attr = (page.item_attr_key_list.includes(page.storck_attr_key_list[0])) ? "true" : "false";
                position = page.item_attr_key_list.indexOf(page.storck_attr_key_list[0]);
            }
            else if ($(row).find("[datafield=sl_no]").find("div").html() == "2") {
                attr_value = "attr_type2";
                var_attr = (page.item_attr_key_list.includes(page.storck_attr_key_list[1])) ? "true" : "false";
                position = page.item_attr_key_list.indexOf(page.storck_attr_key_list[1]);
            }
            else if ($(row).find("[datafield=sl_no]").find("div").html() == "3") {
                attr_value = "attr_type3";
                var_attr = (page.item_attr_key_list.includes(page.storck_attr_key_list[2])) ? "true" : "false";
                position = page.item_attr_key_list.indexOf(page.storck_attr_key_list[2]);
            }
            else if ($(row).find("[datafield=sl_no]").find("div").html() == "4") {
                attr_value = "attr_type4";
                var_attr = (page.item_attr_key_list.includes(page.storck_attr_key_list[3])) ? "true" : "false";
                position = page.item_attr_key_list.indexOf(page.storck_attr_key_list[3]);
            }
            else if ($(row).find("[datafield=sl_no]").find("div").html() == "5") {
                attr_value = "attr_type5";
                var_attr = (page.item_attr_key_list.includes(page.storck_attr_key_list[4])) ? "true" : "false";
                position = page.item_attr_key_list.indexOf(page.storck_attr_key_list[4]);
            }
            else if ($(row).find("[datafield=sl_no]").find("div").html() == "6") {
                attr_value = "attr_type6";
                var_attr = (page.item_attr_key_list.includes(page.storck_attr_key_list[5])) ? "true" : "false";
                position = page.item_attr_key_list.indexOf(page.storck_attr_key_list[5]);
            }
            if (var_attr == "true") {
                if (position == 0)
                    attr_value = "attr_type1";
                if (position == 1)
                    attr_value = "attr_type2";
                if (position == 2)
                    attr_value = "attr_type3";
                if (position == 3)
                    attr_value = "attr_type4";
                if (position == 4)
                    attr_value = "attr_type5";
                if (position == 5)
                    attr_value = "attr_type6";
            }
            //if (var_attr == "true") {
            //    $(page.item_attr_key_list).each(function (i, item) {
            //        $(page.storck_attr_key_list).each(function (j, item) {
            //            if (page.item_attr_key_list.includes(page.storck_attr_key_list[j])) {
            //                if (i == 0)
            //                    attr_value = "attr_type1";
            //                if (i == 1)
            //                    attr_value = "attr_type2";
            //                if (i == 2)
            //                    attr_value = "attr_type3";
            //                if (i == 3)
            //                    attr_value = "attr_type4";
            //                if (i == 4)
            //                    attr_value = "attr_type5";
            //                if (i == 5)
            //                    attr_value = "attr_type6";
            //            }
            //        });
            //    })
            //}
            $($$("grdItemVariations").allData()).each(function (i, item) {
                if (i == 0) {
                    sku_no = item.sku_no;
                }
                else {
                    sku_no = sku_no + "," + item.sku_no;
                }
            });
            if (var_attr == "false") {
                if (sku_no != "") {
                    var data = {
                        attr_value: attr_value,
                        sku_value: sku_no,
                        var_attr: var_attr,
                        item_no: page.item_no,
                        store_no: localStorage.getItem("user_fulfillment_store_no"),//localStorage.getItem("user_store_no")
                    }
                    page.stockAPI.getattributesearch(data, function (data) {
                        callback(data);
                    });
                }
                else {
                    callback([]);
                }
            }
            else {
                var data = {
                    attr_value: attr_value,
                    sku_value: sku_no,
                    var_attr: var_attr,
                    item_no: page.item_no,
                    store_no: localStorage.getItem("user_fulfillment_store_no"),//getCookie("user_store_id"),
                }
                page.stockAPI.getattributesearch(data, function (data) {
                    callback(data);
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
        function checkAttributes(id) {
            var result = false;
            $(page.item_attr_list).each(function (i, item) {
                if (item.attr_no_key == id)
                    result = true;
            })
            return (result);
        }
    });
}