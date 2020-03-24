$.fn.itemPrice = function () {
    document.activeElement.msGetInputContext;
    var itemCost = false;
    var itemMrp = false;
    var itemBatchNo = false;
    var itemMandate = false;
    var itemExpiryDate = false;
    var itemSuppNo = false;
    return $.pageController.getControl(this, function(page, $$) {
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-price/item-price.html?" + new Date());
        page.itemAPI = new ItemAPI();
        page.stockAPI = new StockAPI();
        page.itemPriceAPI = new ItemPriceAPI();
        page.itemSKUAPI = new ItemSKUAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.storeAPI = new StoreAPI();
        page.itemVariationAPI = new ItemVariationAPI();
        page.avg_price = 0;
        page.avg_net_rate = 0;

        var inputs = $(':input').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
      
        page.val_id = 0;
        page.itemData = "";

        page.events = {
            lblchkCurrentPrc_click: function () {
                $("[controlid=chkCurrentPrc]").bind("click");
            },
            btnRemovePrice_click: function () {
               if (page.priceflag == false) {
                   $$("msgPanel").show("No price  added to remove...!");
               }
               else {
                   if ($$("grdItemPrice").selectedData()[0] == undefined)
                       $$("msgPanel").show("Select a price to remove...!");
                   else {
                       if (confirm("If the price deleted it cannot be rollback")) {
                           var rowId = page.controls.grdItemPrice.selectedRows()[0].attr("row_id");
                           $$("msgPanel").flash("Removing price for item...");
                           page.stockAPI.deleteVariationPrice(page.controls.grdItemPrice.selectedData()[0].price_no, function (data) {
                               page.controls.grdItemPrice.deleteRow(rowId);
                               $$("msgPanel").flash("Item price removed...");
                           });
                           //page.stockAPI.searchPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                           page.stockAPI.searchPricesMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data) {
                               //page.controls.grdItemPrice.dataBind(data);
                               //page.view.selectedItemPrice(data);
                           });
                           //page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                           var pData = {
                               start_record: "",
                               end_record: "",
                               filter_expression: " item_no=" + page.item_no + " and store_no = " + localStorage.getItem("user_fulfillment_store_no"),
                               sort_expression: ""
                           }
                           if ($("[controlid='chkCurrentPrc']").prop('checked')) {
                               pData.filter_expression = " item_no=" + page.item_no + " and state_no=100" + " and store_no = " + localStorage.getItem("user_fulfillment_store_no")
                           }
                           else if ($("[controlid='chkPastPrc']").prop('checked')) {
                               pData.filter_expression = " item_no=" + page.item_no + " and state_no=150" + " and store_no = " + localStorage.getItem("user_fulfillment_store_no")
                           }
                           else if ($("[controlid='chkFuturePrc']").prop('checked')) {
                               pData.filter_expression = " item_no=" + page.item_no + " and state_no=200" + " and store_no = " + localStorage.getItem("user_fulfillment_store_no")
                           }
                           page.itemPriceAPI.searchValue(pData.start_record, pData.end_record, pData.filter_expression, pData.sort_expression, function (data) {
                               //page.controls.grdInventoryPrice.dataBind(data);
                               page.view.selectedItemPriceHistory(data);
                           });
                       }
                       $(".detail-info").progressBar("hide");
                   }
               }
            },
            btnSTHideFilter_click: function () {
               $$("grdItemPrice").clearFilter();
            },
            btnSTShowFilter_click: function () {
               $$("grdItemPrice").showFilter();
            },
            btnStopPPrice_click : function(){
                var grdSelect = page.controls.grdInventoryPrice.selectedRowIds();
                var grdPData = page.controls.grdInventoryPrice.allData();
                if (grdSelect.length < 0) {
                    alert("Please select a price to stop working...!");
                }
                else {
                    var item = grdPData[grdSelect[0] - 1];
                        var uData ={
                            price_no: item.price_no,
                            state_no: 150
                        }
                        page.itemPriceAPI.putValue(uData, function (data) {
                            alert("Selected price has been stopped working");
                            page.interface.loadPrice();
                        })
                    }
            },
            btnStartPrice_click: function () {
                var grdSelect = page.controls.grdInventoryPrice.selectedRowIds();
                var grdPData = page.controls.grdInventoryPrice.allData();
                if (grdSelect.length < 0) {
                    alert("Please select a price to start...!");
                }
                else {
                    var item = grdPData[grdSelect[0] - 1];
                    var uData = {
                        price_no: item.price_no,
                        state_no: 100
                    }
                    var filter = " item_no=" + page.item_no + " and store_no = " + localStorage.getItem("user_fulfillment_store_no");
                    filter = filter + " and state_no=100";
                    page.itemPriceAPI.searchValue("", "", filter, "", function (data1) {
                        try{
                            $(data1).each(function (i, item1) {
                                if (item1.key_value == item.key_value && item1.item_level == item.item_level)
                                    throw "This SKU Already Having Price If You Want Start This Price Please Deactive The SKU";
                            })
                            page.itemPriceAPI.putValue(uData, function (data) {
                                alert("Selected price has been started");
                                page.interface.loadPrice();
                            })
                        }
                        catch (e) {
                            alert(e);
                        }
                    });
                }
            },
            btnUpdatePrice_click : function(){
                page.itemPriceAPI.printBatch(function (data) {
                    alert("Prices Updated In Today's Date");
                    page.interface.loadPrice();
                });
            },
            btnAddPrice_click: function () {
                $$("pnlPPercnt").show();
                $$("pnlWPPercnt").show();
                $$("pnlOPPercnt").show();
                $$("pnltxtPCost").hide();
                $$("pnltxtNetRate").show();
                //$$("pnltxtNetRate1").show();
                $$("pnltxtNetRate1").hide();
                $$("pnlPriceLimit").hide();
                if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                    $$("pnlPWSPrice").show();
                    $$("pnlWPPercnt").show();
                }
                else {
                    $$("pnlPWSPrice").hide();
                    $$("pnlWPPercnt").hide();
                }
                if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                    $$("pnlOPPrice").show();
                    $$("pnlOPPercnt").show();
                }
                else {
                    $$("pnlOPPrice").hide();
                    $$("pnlOPPercnt").hide();
                }
                if (CONTEXT.ENABLE_PRICE_LIMIT) {
                    $$("pnlPriceLimit").show();
                }
                else {
                    $$("pnlPriceLimit").hide();
                }
                $$("lblAvgBuyingCost").value(page.avg_price);
                $$("txtNetRate").value(page.avg_net_rate);
                $$("txtPCost").val(page.avg_price);
                if (isNaN($$("txtNetRate").val()))
                    $$("txtNetRate").value(0);
                if (isNaN($$("lblAvgBuyingCost").value()))
                    $$("lblAvgBuyingCost").value(0);
                if (isNaN($$("txtPCost").val()))
                    $$("txtPCost").value(0);
                page.clearPriceDetails(function () {
                    var sID = page.controls.grdInventoryPrice.selectedRowIds();
                    var grdPData = page.controls.grdInventoryPrice.allData();
                    if (sID.length > 0) {
                        item = grdPData[sID[0] - 1];
                        if (item.item_level == "ITEM") {
                            $$("ddlPItemVar").selectedValue(-1);
                            $$("ddlPSKU").selectedValue(-1);
                            $$("txtPPrice").val(item.price);
                            $$("txtPWSPrice").val(item.alter_price_1);
                            $$("txtPPrice").val(item.alter_price_2);
                            $$("txtPOldPrice").val(item.price);
                            $$("txtWSOldPrice").val(item.alter_price_1);
                            $$("txtOPOldPrice").val(item.alter_price_2);

                            
                            $$("txtPPercnt").val("");
                            $$("txtWSPPercnt").val("");
                            $$("txtOPPercnt").val("");
                            $$("pnltxtPCost").show();
                            $$("pnltxtNetRate").show();
                            //$$("pnltxtNetRate1").show();
                            $$("pnltxtNetRate1").hide();
                            $$("pnlPPercnt").show();
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                $$("pnlPWSPrice").show();
                                $$("pnlWPPercnt").show();
                            }
                            else {
                                $$("pnlPWSPrice").hide();
                                $$("pnlWPPercnt").hide();
                            }
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                $$("pnlOPPrice").show();
                                $$("pnlOPPercnt").show();
                            }
                            else {
                                $$("pnlOPPrice").hide();
                                $$("pnlOPPercnt").hide();
                            }
                            page.calculateProfit();
                            $$("lblAvgBuyingCost").value(page.avg_price);
                            $$("txtNetRate").value(page.avg_net_rate);
                            $$("txtPCost").val(page.avg_price);
                            if (isNaN($$("txtNetRate").val()))
                                $$("txtNetRate").value(0);
                            if (isNaN($$("lblAvgBuyingCost").value()))
                                $$("lblAvgBuyingCost").value(0);
                            if (isNaN($$("txtPCost").val()))
                                $$("txtPCost").value(0);
                        }
                        else if (item.item_level == "SKU") {
                            $$("ddlPItemVar").selectedValue(-1);
                            $$("ddlPSKU").selectedValue(item.key_value);
                            $$("txtPCost").val(item.avg_buying_cost);
                            $$("txtNetRate").val(item.net_rate);
                            $$("txtPPrice").val(item.price);
                            $$("txtPWSPrice").val(item.alter_price_1);
                            $$("txtPOPrice").val(item.alter_price_2);
                            $$("txtPOldPrice").val(item.price);
                            $$("txtWSOldPrice").val(item.alter_price_1);
                            $$("txtOPOldPrice").val(item.alter_price_2);
                            if (isNaN($$("txtNetRate").val()))
                                $$("txtNetRate").value(0);
                            if (isNaN($$("lblAvgBuyingCost").value()))
                                $$("lblAvgBuyingCost").value(0);
                            if (isNaN($$("txtPCost").val()))
                                $$("txtPCost").value(0);

                            $$("pnltxtPCost").show();
                            $$("pnltxtNetRate").show();
                            $$("pnltxtNetRate1").hide();
                            $$("pnlPPercnt").show();
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                $$("pnlPWSPrice").show();
                                $$("pnlWPPercnt").show();
                            }
                            else {
                                $$("pnlPWSPrice").hide();
                                $$("pnlWPPercnt").hide();
                            }
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                $$("pnlOPPrice").show();
                                $$("pnlOPPercnt").show();
                            }
                            else {
                                $$("pnlOPPrice").hide();
                                $$("pnlOPPercnt").hide();
                            }
                            page.calculateProfit();
                            $$("lblAvgBuyingCost").value(item.avg_buying_cost);
                        }
                        else if (item.item_level == "VAR") {
                            $$("ddlPItemVar").selectedValue(item.key_value);
                            $$("ddlPSKU").selectedValue(-1);
                            $$("txtPPrice").val(item.price);
                            $$("txtPWSPrice").val(item.alter_price_1);
                            $$("txtPOPrice").val(item.alter_price_2);
                            $$("txtPOldPrice").val(item.price);
                            $$("txtWSOldPrice").val(item.alter_price_1);
                            $$("txtOPOldPrice").val(item.alter_price_2);
                            $$("pnltxtPCost").hide();
                            $$("pnltxtNetRate").show();
                            //$$("pnltxtNetRate1").show();
                            $$("pnltxtNetRate1").hide();
                            $$("pnlPPercnt").show();
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                $$("pnlPWSPrice").show();
                                $$("pnlWPPercnt").show();
                            }
                            else {
                                $$("pnlPWSPrice").hide();
                                $$("pnlWPPercnt").hide();
                            }
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                $$("pnlOPPrice").show();
                                $$("pnlOPPercnt").show();
                            }
                            else {
                                $$("pnlOPPrice").hide();
                                $$("pnlOPPercnt").hide();
                            }
                            $$("txtPPercnt").val("");
                            $$("txtWSPPercnt").val("");
                            $$("txtOPPercnt").val("");
                        }

                    }

                    //$$("btnAddPrice").disable(true);
                    page.controls.pnlAddNewPrice.open();
                    page.controls.pnlAddNewPrice.title("Price");
                    page.controls.pnlAddNewPrice.rlabel("Price");
                    page.controls.pnlAddNewPrice.width(750);
                    page.controls.pnlAddNewPrice.height(450);

                    $$("txtPPercnt").focus();
                });


               
               
                /*
               $$("dtpPFromDate").setDate(new Date());
               var data = {
                   start_record: 0,
                   end_record: "",
                   filter_expression: " item_no ="+page.item_no + " and store_no in (select store_no from store_t where comp_id="+ getCookie("user_company_id") +" )",
                   sort_expression: ""
               }
                page.itemVariationAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.controls.ddlPItemVar.dataBind(data, "var_no", "variation_name", "All");
                page.interface.loadSKU(page.item_no);
                })
                */
                page.controls.ddlPItemVar.selectionChange(function () {
                    $$("txtWSPPercnt").val("");
                    $$("txtOPPercnt").val("");
                    $$("txtPPercnt").val("");
                    if ($$("ddlPItemVar").selectedValue() != -1 && $$("ddlPItemVar").selectedValue() != null) {
                        page.interface.loadSKU(page.item_no, function () {
                            page.loadExsistingPrice();
                            $$("pnltxtPCost").hide();
                            $$("pnltxtNetRate").show();
                            //$$("pnltxtNetRate1").show();
                            $$("pnltxtNetRate1").hide();
                            $$("pnlPPercnt").show();
                            if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                                $$("pnlPWSPrice").show();
                                $$("pnlWPPercnt").show();
                            }
                            else {
                                $$("pnlPWSPrice").hide();
                                $$("pnlWPPercnt").hide();
                            }
                            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                                $$("pnlOPPrice").show();
                                $$("pnlOPPercnt").show();
                            }
                            else {
                                $$("pnlOPPrice").hide();
                                $$("pnlOPPercnt").hide();
                            }
                            $$("txtPPrice").val("");
                            $$("txtPWSPrice").val("");
                            $$("txtPOPrice").val("");
                        });
                        $$("lblAvgBuyingCost").value($$("ddlPItemVar").selectedData().avg_var_cost);
                        $$("txtNetRate").value(parseFloat($$("ddlPItemVar").selectedData().net_rate).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                        $$("txtPCost").val($$("ddlPItemVar").selectedData().avg_var_cost);
                        if (isNaN($$("txtNetRate").val()))
                            $$("txtNetRate").value(0);
                        if (isNaN($$("lblAvgBuyingCost").value()))
                            $$("lblAvgBuyingCost").value(0);
                        if (isNaN($$("txtPCost").val()))
                            $$("txtPCost").value(0);
                    }
                    else {
                        page.interface.loadSKU(page.item_no, function () {
                            if ($$("ddlPSKU").selectedValue() == "-1") {
                                $$("lblAvgBuyingCost").value(page.avg_price);
                                $$("txtNetRate").value(page.avg_net_rate);
                                $$("txtPCost").val(page.avg_price);
                                if (isNaN($$("txtNetRate").val()))
                                    $$("txtNetRate").value(0);
                                if (isNaN($$("lblAvgBuyingCost").value()))
                                    $$("lblAvgBuyingCost").value(0);
                                if (isNaN($$("txtPCost").val()))
                                    $$("txtPCost").value(0);
                            }
                            else {
                                $$("lblAvgBuyingCost").value($$("ddlPSKU").selectedData().avg_buying_cost);
                                $$("txtNetRate").value($$("ddlPSKU").selectedData().net_rate);
                                $$("txtPCost").val($$("ddlPSKU").selectedData().avg_buying_cost);
                                if (isNaN($$("txtNetRate").val()))
                                    $$("txtNetRate").value(0);
                                if (isNaN($$("lblAvgBuyingCost").value()))
                                    $$("lblAvgBuyingCost").value(0);
                                if (isNaN($$("txtPCost").val()))
                                    $$("txtPCost").value(0);
                            }
                        });
                    }
                   
               })
                page.controls.ddlPSKU.selectionChange(function () {
                    $$("txtWSPPercnt").val("");
                    $$("txtOPPercnt").val("");
                    $$("txtPPercnt").val("");
                    $$("txtPPrice").val("");
                    $$("txtPWSPrice").val("");
                    $$("txtPOPrice").val("");
                   page.loadExsistingPrice();
                   if (page.controls.ddlPSKU.selectedValue() != -1 && page.controls.ddlPSKU.selectedValue()!=null) {
                       var skuData = page.controls.ddlPSKU.selectedData()
                       if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
                           buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
                       } else {
                           buyCost_tax = 0;
                       }
                       var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
                       $$("txtPCost").val(skuData.avg_buying_cost);
                       $$("txtNetRate").val(net_rate);
                       $$("pnltxtPCost").show();
                       $$("pnltxtNetRate").show();
                       //$$("pnltxtNetRate1").show();
                       $$("pnltxtNetRate1").hide();
                       $$("pnlPPercnt").show();
                       if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                           $$("pnlPWSPrice").show();
                           $$("pnlWPPercnt").show();
                       }
                       else {
                           $$("pnlPWSPrice").hide();
                           $$("pnlWPPercnt").hide();
                       }
                       if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                           $$("pnlOPPrice").show();
                           $$("pnlOPPercnt").show();
                       }
                       else {
                           $$("pnlOPPrice").hide();
                           $$("pnlOPPercnt").hide();
                       }
                       $$("lblAvgBuyingCost").value($$("ddlPSKU").selectedData().avg_buying_cost);
                       if (isNaN($$("txtNetRate").val()))
                           $$("txtNetRate").value(0);
                       if (isNaN($$("lblAvgBuyingCost").value()))
                           $$("lblAvgBuyingCost").value(0);
                       if (isNaN($$("txtPCost").val()))
                           $$("txtPCost").value(0);
                   }
                   else {
                       $$("txtPCost").val("");
                       $$("txtNetRate").val("");
                       $$("pnltxtPCost").hide();
                       $$("pnltxtNetRate").show();
                       //$$("pnltxtNetRate1").show();
                       $$("pnlPPercnt").show();
                       $$("pnltxtNetRate1").hide();
                       if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                           $$("pnlPWSPrice").show();
                           $$("pnlWPPercnt").show();
                       }
                       else {
                           $$("pnlPWSPrice").hide();
                           $$("pnlWPPercnt").hide();
                       }
                       if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                           $$("pnlOPPrice").show();
                           $$("pnlOPPercnt").show();
                       }
                       else {
                           $$("pnlOPPrice").hide();
                           $$("pnlOPPercnt").hide();
                       }
                       if ($$("ddlPItemVar").selectedValue() == "-1") {
                           $$("lblAvgBuyingCost").value(page.avg_price);
                           $$("txtNetRate").value(page.avg_net_rate);
                           $$("txtPCost").val(page.avg_price);
                       }
                       else {
                           $$("lblAvgBuyingCost").value($$("ddlPItemVar").selectedData().avg_var_cost);
                           $$("txtNetRate").value(parseFloat($$("ddlPItemVar").selectedData().net_rate).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                           $$("txtPCost").val($$("ddlPItemVar").selectedData().avg_var_cost);
                       }
                       if (isNaN($$("txtNetRate").val()))
                           $$("txtNetRate").value(0);
                       if (isNaN($$("lblAvgBuyingCost").value()))
                           $$("lblAvgBuyingCost").value(0);
                       if (isNaN($$("txtPCost").val()))
                           $$("txtPCost").value(0);
                   }
               })
                /*
               $("[controlid=txtPPrice]").bind('blur', function () {
                   if ($$("txtPWSPrice").val() == "") {
                       $$("txtPWSPrice").val($$("txtPPrice").val());
                   }
                   if ($$("txtPOPrice").val() == "") {
                       $$("txtPOPrice").val($$("txtPPrice").val());
                   }
               })
                */
               $("[controlid=txtPPrice]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculateProfit();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               $("[controlid=txtPPercnt]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculatePrice();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               $("[controlid=txtWSPPercnt]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculatePrice();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               $("[controlid=txtOPPercnt]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculatePrice();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               $("[controlid=txtPPercnt]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculateProfit();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               $("[controlid=txtPWSPrice]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculateProfit();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               $("[controlid=txtPOPrice]").bind('focusout', function () {
                   setTimeout(function () {
                       page.calculateProfit();
                   }, 1000);
                   //var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
               })
               /*
               try{
               if ($$("grdInventoryPrice").selectedData()[0] == undefined) {
                   $$("msgPanel").show("Enter a new price to add...!");
               }
               else {
                   var result = 0;
                   var priceItems = [];
                   var grdInventData = page.controls.grdInventoryPrice.allData();

                   $(grdInventData).each(function (i, items) {
                       if (items.new_price != 0 && items.new_price != null && typeof items.new_price != "undefined") {
                           if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                               if (items.alter_price_1 == "" || items.alter_price_1 == null || typeof items.alter_price_1 == "undefined") {
                                   items.alter_price_1 = 0;
                               }
                           }
                           else
                               items.alter_price_1 = 0;
                           if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                               if (items.alter_price_2 == "" || items.alter_price_2 == null || typeof items.alter_price_2 == "undefined") {
                                   items.alter_price_2 = 0;
                               }
                           }
                           else
                               items.alter_price_2 = 0;
                           if (parseFloat(items.price) == parseFloat(items.new_price)) {
                               alert("Same Price Is Giving!! Please Check Your Price!!!");
                           }
                           else {
                               if (parseFloat(items.new_price) <= 0 || isNaN(items.new_price)) {}
                               else {
                                   var cur_date = new Date();
                                   var EnteredDate = items.new_from_date;
                                   var date = EnteredDate.substring(8, 10);
                                   var month = EnteredDate.substring(5, 7);
                                   var year = EnteredDate.substring(0, 4);
                                   var time = cur_date.getHours() % 24;//EnteredDate.substring(11, 13);
                                   var min = cur_date.getMinutes();//EnteredDate.substring(14, 16);
                                   time=(time < 9) ? "0" + time : time;
                                   var myDate = new Date(year, month - 1, date, time, min);
                                   var today = new Date();
                                   today.setDate(today.getDate() - 1);
                                   var added_date = year + "-" + month + "-" + date + " " + time + ":" + min + ":" + cur_date.getSeconds();

                                   if (items.valid_from != null) {
                                       var FromDate = items.valid_from;
                                       var from_date = FromDate.substring(0, 2);
                                       var from_month = FromDate.substring(3, 5);
                                       var from_year = FromDate.substring(6, 10);
                                       var myFromDate = new Date(from_year, from_month - 1, from_date);

                                       if (myFromDate > myDate) {
                                           throw "Date should be greater than from date";
                                       }
                                   }

                                   if (myDate > today) {
                                       priceItems.push({
                                           var_no: items.var_no,
                                           valid_from: added_date,
                                           price: items.new_price,
                                           user_no: getCookie("user_id"),
                                           alter_price_1: items.alter_price_1,
                                           alter_price_2: items.alter_price_2
                                       });
                                   }
                                   else {
                                       throw "Please check the date for variation " + items.variation_name + "";
                                   }
                               }
                           }
                       }
                    });
                   page.stockAPI.insertAllVariationPrice(0,priceItems, function (data) {
                       page.stockAPI.searchPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                           //page.controls.grdItemPrice.dataBind(data);
                           page.view.selectedItemPrice(data);
                       });
                       page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                           //page.controls.grdInventoryPrice.dataBind(data);
                           page.view.selectedItemPriceHistory(data);
                       });
                       $$("msgPanel").flash("Item price added...");
                       $$("btnAddPrice").disable(false);
                   },
                   function () {
                       $$("msgPanel").show("Item price could not be added. new price ,and valid from is  mandatory ...!");
                       $$("btnAddPrice").disable(false);
                   });
               }
               }
               catch (e) {
                   $$("msgPanel").show(e);
                   $$("btnAddPrice").disable(false);
               }
               */
           },
           btnAddNewPrice_click: function () {
               try {
                   var cur_date = new Date();
                   var date = cur_date.getDate();
                   var month = cur_date.getMonth()+1;
                   var year = cur_date.getFullYear();
                   var time = cur_date.getHours() % 24;//EnteredDate.substring(11, 13);
                   var min = cur_date.getMinutes();//EnteredDate.substring(14, 16);
                   time = (time < 9) ? "0" + time : time;
                   var myDate = new Date(year, month - 1, date, 0, 0);
                   var FromDate = $$("dtpPFromDate").selectedObject.val();
                   var from_date = FromDate.substring(0, 2);
                   var from_month = FromDate.substring(3, 5);
                   var from_year = FromDate.substring(6, 10);
                   var myFromDate = new Date(from_year, from_month - 1, from_date);

                   if ($$("txtPPrice").val() == "") {
                       throw "Price not found...!";
                       $$("txtPPrice").focus();
                   }
                   else if (isNaN($$("txtPPrice").val())) {
                       throw "Invalid price value...!";
                       $$("txtPPrice").focus();
                   }
                   else if ($$("txtPWSPrice").val() !="" && isNaN($$("txtPWSPrice").val())) {
                       throw "Invalid whole sale price value...!";
                       $$("txtPWSPrice").focus();
                   }
                   else if ($$("txtPOPrice").val() != "" && isNaN($$("txtPOPrice").val())) {
                       throw "Invalid online price value...!";
                       $$("txtPOPrice").focus();
                   }
                   else if ($$("dtpPFromDate").selectedObject.val() == "") {
                       throw "Please fill the price from date ...!";
                   }
                   else if (myFromDate < myDate) {
                       throw "Date is not valid please check ...!";
                   }
                   else {
                       var pData = {
                           valid_from: dbDate($$("dtpPFromDate").selectedObject.val()),
                           price: $$("txtPPrice").val(),
                           alter_price_1: $$("txtPWSPrice").val(),
                           alter_price_2: $$("txtPOPrice").val(),
                           user_no: getCookie("user_id"),
                           comp_id: getCookie("user_company_id"),
                           store_no: localStorage.getItem("user_fulfillment_store_no"),//getCookie("user_store_id"),
                           price_limit: $$("txtPriceLimit").value()
                       }
                       if ($$("ddlPSKU").selectedValue() != -1) {
                           pData.item_level = "SKU";
                           pData.key_value = $$("ddlPSKU").selectedValue();
                       }
                       else if ($$("ddlPSKU").selectedValue() == -1 && $$("ddlPItemVar").selectedValue() != -1) {
                           pData.item_level = "VAR";
                           pData.key_value = $$("ddlPItemVar").selectedValue();
                       }
                       else if ($$("ddlPSKU").selectedValue() == -1 && $$("ddlPItemVar").selectedValue() == -1) {
                           pData.item_level = "ITEM";
                           pData.key_value = page.item_no;
                       }
                       if (myFromDate > myDate) {
                           pData.state_no = 200;//100-Active , 200- Future , 150 - In Active
                       }
                       else {
                           pData.state_no = 100;//100-Active , 200- Future , 150 - In Active
                       }
                       if (pData.state_no != 200) {
                           var sData = {
                               start_record: "",
                               end_record: "",
                               //filter_expression: " item_level='" + pData.item_level + "'  and key_value=" + pData.key_value + "  and  date_format(valid_from,'%Y-%m-%d')<='" + pData.valid_from + "' and state_no=100" + " and store_no = " + localStorage.getItem("user_store_no"),
                               filter_expression: " item_level='" + pData.item_level + "'  and key_value=" + pData.key_value + "  and  date_format(valid_from,'%Y-%m-%d')<='" + pData.valid_from + "' and state_no=100" + " and store_no = " + localStorage.getItem("user_fulfillment_store_no"),
                               sort_expression: ""
                           }
                           page.itemPriceAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                               if (data.length > 0) {
                                   var uData =[]
                                   $(data).each(function (i,item) {
                                       uData.push({
                                           price_no: item.price_no,
                                           state_no: 150,
                                       })
                                   })

                                   page.itemPriceAPI.multiPutValue(uData, function (data) {
                                       page.itemPriceAPI.postValue(pData, function (data) {
                                           alert("Price Updated successfully..!");
                                           page.controls.pnlAddNewPrice.close();
                                           page.interface.loadPrice();
                                           page.clearPriceDetails();
                                       })
                                   })
                               }
                               else {
                                   page.itemPriceAPI.postValue(pData, function (data) {
                                       alert("Price Updated successfully..!");
                                       page.controls.pnlAddNewPrice.close();
                                       page.interface.loadPrice();
                                       page.clearPriceDetails();
                                   })
                               }

                           })
                       }
                       else {
                           page.itemPriceAPI.postValue(pData, function (data) {
                               alert("Price Updated successfully..!");
                               page.interface.loadPrice();
                               page.clearPriceDetails();
                           })
                       }

                   }
               }
               catch (e) {
                   alert(e);
               }
           },
            btnNewPrice_click: function () {
                $$("txtAddItemPrice").val("");
                $$("txtAddItemMrp").val("");
                $$("txtAddItemBatchNo").val("");
               $$("dsAddPriceFromDate").setDate('');
                $$("dsAddExpiryDate").setDate('');
            },
            page_init: function () { },

            page_load: function () {
                //page.view.selectedItemPrice([]);
                page.view.selectedItemPriceHistory([]);
                if (CONTEXT.ENABLE_EXP_DATE) {
                    $$("pnlExpiryDate").show();
                } else {
                    $$("pnlExpiryDate").hide();
                }
                if (CONTEXT.ENABLE_BAT_NO) {
                    $$("pnlBatchNo").show();
                } else {
                    $$("pnlBatchNo").hide();
                }
                if (CONTEXT.ENABLE_MRP) {
                    $$("pnlMrp").show();
                } else {
                    $$("pnlMrp").hide();
                }
                //$$("btnAddPrice").disable(false);
                var previlageData = {
                    obj_type: "Product::CompProd::Store",
                    obj_id: localStorage.getItem("prod_id"),
                };
                page.userpermissionAPI.getValue(previlageData, function (store_data) {
                    var menu_ids = [];
                    $(store_data).each(function (i, item) {
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
                        $$("ddlPriceStore").dataBind(data, "store_no", "store_name", "All");
                    });
                });
                //$$("ddlPriceStore").selectionChange(function () {
                //    var sData = {
                //        start_record: "",
                //        end_record: "",
                //        filter_expression: " item_no=" + page.item_no + + " and store_no = " + localStorage.getItem("user_store_no"),
                //        sort_expression: ""
                //    }
                //    page.itemPriceAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                //        //page.view.selectedItemVariation(data);
                //        page.interface.loadPrice();
                //    });
                //})
            }
        };
        page.clearPriceDetails = function (callback) {
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: " item_no =" + page.item_no + " and store_no in (select store_no from store_t where comp_id=" + getCookie("user_company_id") + " )",
                sort_expression: ""
            }
            page.itemVariationAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                page.controls.ddlPItemVar.dataBind(data, "var_no", "variation_name", "All");
                page.interface.loadSKU(page.item_no, function () {
                    $$("txtPItem").val(page.itemData.item_name);
                    $$("txtPPrice").val("");
                    $$("txtPWSPrice").val("");
                    $$("txtPOPrice").val("");
                    $$("txtWSPPercnt").val("");
                    $$("txtOPPercnt").val("");
                    $$("txtPPercnt").val("");
                    //$$("txtPCost").val("");
                    //$$("txtNetRate").val("");
                    $$("txtPriceLimit").val("");
                    $$("pnltxtPCost").hide();
                    $$("pnltxtNetRate").show();
                    //$$("pnltxtNetRate1").show();
                    $$("pnltxtNetRate1").hide();
                    $$("pnlPPercnt").show();
                    if (CONTEXT.ENABLE_ALTER_PRICE_1) {
                        $$("pnlPWSPrice").show();
                        $$("pnlWPPercnt").show();
                    }
                    else {
                        $$("pnlPWSPrice").hide();
                        $$("pnlWPPercnt").hide();
                    }
                    if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                        $$("pnlOPPrice").show();
                        $$("pnlOPPercnt").show();
                    }
                    else {
                        $$("pnlOPPrice").hide();
                        $$("pnlOPPercnt").hide();
                    }
                    $$("dtpPFromDate").setDate(new Date());
                    if (callback != undefined)
                        callback();
                });

            })

        }
        page.loadExsistingPrice = function () {

            var filter = ""
            var cData = [];
            if ($$("ddlPSKU").selectedValue() != -1) {
                cData.item_level = 'SKU';
                filter = " item_level='SKU' and key_value=" + $$("ddlPSKU").selectedValue();
            }
            else if ($$("ddlPSKU").selectedValue() == -1 && $$("ddlPItemVar").selectedValue() != -1) {
                cData.item_level = 'VAR';
                filter = " item_level='VAR' and key_value=" + $$("ddlPItemVar").selectedValue();
            }
            else if ($$("ddlPSKU").selectedValue() == -1 && $$("ddlPItemVar").selectedValue() == -1) {
                cData.item_level = 'ITEM';
                filter = " item_level='ITEM' and key_value=" + page.item_no;
            }
            //if (cData.item_level == 'SKU' || cData.item_level == 'VAR') {
            filter = filter + " and state_no=100" + " and store_no = " + localStorage.getItem("user_store_no");
                var pData = {
                    start_record: "",
                    end_record: "",
                    filter_expression: filter,
                    sort_expression: ""
                }
                page.itemPriceAPI.searchValue(pData.start_record, pData.end_record, pData.filter_expression, pData.sort_expression, function (data) {
                    if (data.length > 0) {
                        if (data[0].price != "" && data[0].price != undefined && data[0].price != null) {
                            $$("txtPOldPrice").val("( Old Price - "+ data[0].price+" )");
                        }
                        else {
                            $$("txtPOldPrice").val("");
                        }
                        if (data[0].alter_price_1 != "" && data[0].alter_price_1 != undefined && data[0].alter_price_1 != null) {
                            $$("txtWSOldPrice").val("( Old Price - " + data[0].alter_price_1 + " )");
                        }
                        else {
                            $$("txtWSOldPrice").val("");
                        }
                        if (data[0].alter_price_2 != "" && data[0].alter_price_2 != undefined && data[0].alter_price_2 != null) {
                            $$("txtOPOldPrice").val("( Old Price - " + data[0].alter_price_2 + " )");
                        }
                        else {
                            $$("txtOPOldPrice").val("");
                        }
                    }
                    else {
                        $$("txtPOldPrice").val("");
                        $$("txtWSOldPrice").val("");
                        $$("txtOPOldPrice").val("");
                    }

                })
            //}
            //else {

            //}

        }
        page.interface.loadPrice = function (callback) {
            //filter = " item_no=" + page.item_no + " and store_no = " + localStorage.getItem("user_store_no");
            filter = " item_no=" + page.item_no + " and store_no = " + localStorage.getItem("user_fulfillment_store_no");
            if ($("[controlid='chkCurrentPrc']").prop('checked')) {
                filter = filter + " and state_no=100";
            }
            else if ($("[controlid='chkPastPrc']").prop('checked')) {
                filter = filter + " and state_no=150";
            }
            else if ($("[controlid='chkFuturePrc']").prop('checked')) {
                filter = filter + " and state_no=200";
            }

            if ($$("ddlPriceStore").selectedValue() != -1 && $$("ddlPriceStore").selectedValue()!=null) {
                filter = filter + " and store_no=" + $$("ddlPriceStore").selectedValue()
            }
            var pData = {
                start_record: "",
                end_record: "",
                filter_expression: filter,
                sort_expression: ""
            }
            page.itemPriceAPI.searchValue(pData.start_record, pData.end_record, pData.filter_expression, pData.sort_expression, function (data) {
                page.view.selectedItemPriceHistory(data);
            });
        }
        page.calculateProfit = function () {
            var buyCost_tax = 0;
            if ($$("txtNetRate").val() != "" && !isNaN($$("txtNetRate").val()) && $$("txtNetRate").val() != "" && !isNaN($$("txtPPrice").val()) && $$("txtPPrice").val() != "") {
                //var skuData = page.controls.ddlPSKU.selectedData();
                //if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
                //    buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
                //}
                //var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
                //var profit = parseFloat(((parseFloat($$("txtPPrice").val()) - parseFloat(net_rate)) / parseFloat(net_rate)) * 100);
                //profit = profit.toFixed(2);
                //$$("txtPPercnt").val(profit);
                var net_rate = parseFloat($$("txtNetRate").val());
                var profit = parseFloat(((parseFloat($$("txtPPrice").val()) - parseFloat(net_rate)) / parseFloat(net_rate)) * 100);
                profit = profit.toFixed(CONTEXT.COUNT_AFTER_POINTS);
                $$("txtPPercnt").val(profit);
            }
            var buyCost_tax = 0;
            if ($$("txtNetRate").val() != "" && !isNaN($$("txtNetRate").val()) && $$("txtNetRate").val() != "" && !isNaN($$("txtPWSPrice").val()) && $$("txtPWSPrice").val() != "") {
                //var skuData = page.controls.ddlPSKU.selectedData();
                //if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
                //    buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
                //}
                //var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
                //var profit = parseFloat(((parseFloat($$("txtPWSPrice").val()) - parseFloat(net_rate)) / parseFloat(net_rate)) * 100);
                //profit = profit.toFixed(2);
                //$$("txtWSPPercnt").val(profit);
                var net_rate = parseFloat($$("txtNetRate").val());
                var profit = parseFloat(((parseFloat($$("txtPWSPrice").val()) - parseFloat(net_rate)) / parseFloat(net_rate)) * 100);
                profit = profit.toFixed(CONTEXT.COUNT_AFTER_POINTS);
                $$("txtWSPPercnt").val(profit);
            }
            var buyCost_tax = 0;
            if ($$("txtNetRate").val() != "" && !isNaN($$("txtNetRate").val()) && $$("txtNetRate").val() != "" && !isNaN($$("txtPOPrice").val()) && $$("txtPOPrice").val() != "") {
                //var skuData = page.controls.ddlPSKU.selectedData();
                //if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
                //    buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
                //}
                //var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
                //var profit = parseFloat(((parseFloat($$("txtPOPrice").val()) - parseFloat(net_rate)) / parseFloat(net_rate)) * 100);
                //profit = profit.toFixed(2);
                //$$("txtOPPercnt").val(profit);
                var net_rate = parseFloat($$("txtNetRate").val());
                var profit = parseFloat(((parseFloat($$("txtPOPrice").val()) - parseFloat(net_rate)) / parseFloat(net_rate)) * 100);
                profit = profit.toFixed(CONTEXT.COUNT_AFTER_POINTS);
                $$("txtOPPercnt").val(profit);
            }
            if ($$("txtPPercnt").val() == "Infinity" || isNaN($$("txtPPercnt").val()))
                $$("txtPPercnt").val(100);
            if ($$("txtWSPPercnt").val() == "Infinity" || isNaN($$("txtWSPPercnt").val()))
                $$("txtWSPPercnt").val(100);
            if ($$("txtOPPercnt").val() == "Infinity" || isNaN($$("txtOPPercnt").val()))
                $$("txtOPPercnt").val(100);
            if ($$("txtPPrice").val() == "Infinity" || isNaN($$("txtPPrice").val()))
                $$("txtPPrice").val(0);
            if ($$("txtPWSPrice").val() == "Infinity" || isNaN($$("txtPWSPrice").val()))
                $$("txtPWSPrice").val(0);
            if ($$("txtPOPrice").val() == "Infinity" || isNaN($$("txtPOPrice").val()))
                $$("txtPOPrice").val(0);
        }
       page.calculatePrice = function (callback) {
           var buyCost_tax = 0;
           if ($$("txtNetRate").val() != "" && !isNaN($$("txtNetRate").val()) && $$("txtNetRate").val() != "" && !isNaN($$("txtPPercnt").val()) && $$("txtPPercnt").val() != "") {
               //var skuData = page.controls.ddlPSKU.selectedData();
               //if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
               //    buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
               //}
               //var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
               //var price = parseFloat(net_rate) + (parseFloat(net_rate) * parseFloat($$("txtPPercnt").val()) / 100);
               //price = price.toFixed(2);
               //$$("txtPPrice").val(price);
               
               var net_rate = parseFloat($$("txtNetRate").val());
               var price = parseFloat(net_rate) + (parseFloat(net_rate) * parseFloat($$("txtPPercnt").val()) / 100);
               price = price.toFixed(CONTEXT.COUNT_AFTER_POINTS);
               $$("txtPPrice").val(price);
           }
           var buyCost_tax = 0;
           if ($$("txtNetRate").val() != "" && !isNaN($$("txtNetRate").val()) && $$("txtNetRate").val() != "" && !isNaN($$("txtWSPPercnt").val()) && $$("txtWSPPercnt").val() != "") {
               //var skuData = page.controls.ddlPSKU.selectedData();
               //if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
               //    buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
               //}
               //var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
               //var price = parseFloat(net_rate) + (parseFloat(net_rate) * parseFloat($$("txtWSPPercnt").val()) / 100);
               //price = price.toFixed(2);
               //$$("txtPWSPrice").val(price);
               
               var net_rate = parseFloat($$("txtNetRate").val());
               var price = parseFloat(net_rate) + (parseFloat(net_rate) * parseFloat($$("txtWSPPercnt").val()) / 100);
               price = price.toFixed(CONTEXT.COUNT_AFTER_POINTS);
               $$("txtPWSPrice").val(price);
           }
           var buyCost_tax = 0;
           if ($$("txtNetRate").val() != "" && !isNaN($$("txtNetRate").val()) && $$("txtNetRate").val() != "" && !isNaN($$("txtOPPercnt").val()) && $$("txtOPPercnt").val() != "") {
               //var skuData = page.controls.ddlPSKU.selectedData();
               //if (skuData.tax_per != null && skuData.tax_per != "" && skuData.tax_per != undefined) {
               //    buyCost_tax = parseFloat(skuData.avg_buying_cost) * parseFloat(skuData.tax_per) / 100;
               //}
               //var net_rate = parseFloat(skuData.avg_buying_cost) + parseFloat(buyCost_tax);
               //var price = parseFloat(net_rate) + (parseFloat(net_rate) * parseFloat($$("txtOPPercnt").val()) / 100);
               //price = price.toFixed(2);
               //$$("txtPOPrice").val(price);
               var net_rate = parseFloat($$("txtNetRate").val());
               var price = parseFloat(net_rate) + (parseFloat(net_rate) * parseFloat($$("txtOPPercnt").val()) / 100);
               price = price.toFixed(CONTEXT.COUNT_AFTER_POINTS);
               $$("txtPOPrice").val(price);
           }

           if ($$("txtPPrice").val() == "Infinity" || isNaN($$("txtPPrice").val()))
               $$("txtPPrice").val(0);
           if ($$("txtPWSPrice").val() == "Infinity" || isNaN($$("txtPWSPrice").val()))
               $$("txtPWSPrice").val(0);
           if ($$("txtPOPrice").val() == "Infinity" || isNaN($$("txtPOPrice").val()))
               $$("txtPOPrice").val(0);
           if ($$("txtPPercnt").val() == "Infinity" || isNaN($$("txtPPercnt").val()))
               $$("txtPPercnt").val(100);
           if ($$("txtWSPPercnt").val() == "Infinity" || isNaN($$("txtWSPPercnt").val()))
               $$("txtWSPPercnt").val(100);
           if ($$("txtOPPercnt").val() == "Infinity" || isNaN($$("txtOPPercnt").val()))
               $$("txtOPPercnt").val(100);
       }
       page.price_validation = function (callback) {
           var alldata = page.controls.grdItemPrice.allData();
           $(alldata).each(function (index, item) {
               var price = parseFloat($$("txtAddItemPrice").val()).toFixed(CONTEXT.COUNT_AFTER_POINTS);
               var mrp = parseFloat($$("txtAddItemMrp")).toFixed(CONTEXT.COUNT_AFTER_POINTS);
               if (item.batch_no == $$("txtAddItemBatchNo").val() && item.price == price && mrp==item.mrp) {
                   page.val_id = 0;
               }
           });


           var time = ($$("dsAddPriceFromDate").getDate()).split("-");
           var d = time[0];
           var m = time[1];
           var y = time[2];
           var sqlDate = new Date();
           var sd = sqlDate.getDay();
           var sm = sqlDate.getMonth();
           var sy = sqlDate.getFullYear();
           sm = sm + 1;
           if (sy <= y) {
               if (sm <= m) {
                   if (sd <= d) {
                       page.val_id = 1;
                   }
               }
               else {
                   page.val_id = 0;
               }
           }
           else {
               page.val_id = 0;
           }

       }
       page.interface.loadSKU = function (item_no,callback) {
           //var filter = " store_no = " + localStorage.getItem("user_store_no"); 
           var filter = " store_no = " + localStorage.getItem("user_fulfillment_store_no");
           if ($$("ddlPItemVar").selectedValue() != -1) {
               filter = filter + " and y.var_no=" + $$("ddlPItemVar").selectedValue()
           }
           else {
               filter = filter + " and item_no=" + item_no;
           }
           var sData = {
               start_record: "",
               end_record: "",
               filter_expression: filter,
               sort_expression:""
           }
           page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
               if (!CONTEXT.ENABLE_ITEM_LEVEL_PRICE && !CONTEXT.ENABLE_VARIATION_LEVEL_PRICE) {
                   $$("ddlPSKU").dataBind(data, "sku_no", "sku_name");
                   if(data.length != 0)
                    $$("ddlPSKU").selectedValue(data[0].sku_no);
               }
               else if (!CONTEXT.ENABLE_ITEM_LEVEL_PRICE && CONTEXT.ENABLE_VARIATION_LEVEL_PRICE) {
                   $$("ddlPSKU").dataBind(data, "sku_no", "sku_name");
                   if (data.length != 0)
                       $$("ddlPSKU").selectedValue(data[0].sku_no);
               }
               else {
                   $$("ddlPSKU").dataBind(data, "sku_no", "sku_name", "All");
               }
               if (callback != undefined)
                   callback();
           })
       }
        page.interface.load = function(itemNo,data) {
            page.item_no = itemNo;
            page.itemData = data;
            if (page.itemData.additionalTax == null || typeof page.itemData.additionalTax == "undefined")
                page.itemData.additionalTax = 0;
            /*
            page.itemAPI.getValue(itemNo, function (variation_data) {
                
                //page.stockAPI.searchPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                var pData = {
                    start_record: "",
                    end_record: "",
                    filter_expression: " item_no=" + page.item_no,
                    sort_expression: ""
                }
                if ($("[controlid='chkCurrentPrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=100"
                }
                else if ($("[controlid='chkPastPrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=150"
                }
                else if ($("[controlid='chkFuturePrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=200"
                }
                page.itemPriceAPI.searchValue(pData.start_record, pData.end_record, pData.filter_expression, pData.sort_expression, function (data) {
                    if (data.length > 0)
                        page.priceflag = true;
                    else
                        page.priceflag = false;
                    //page.controls.grdItemPrice.dataBind(data);
                    //page.view.selectedItemPrice(data);
                });

                //page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                var pData = {
                    start_record: "",
                    end_record: "",
                    filter_expression: " item_no=" + page.item_no,
                    sort_expression: ""
                }
                $("[controlid='chkCurrentPrc']").prop('checked', true);
                if ($("[controlid='chkCurrentPrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=100"
                }
                else if ($("[controlid='chkPastPrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=150"
                }
                else if ($("[controlid='chkFuturePrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=200"
                }
                page.itemPriceAPI.searchValue(pData.start_record, pData.end_record, pData.filter_expression, pData.sort_expression, function (data) {
                //page.controls.grdInventoryPrice.dataBind(data);
                page.view.selectedItemPriceHistory(data);
            });
                //page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                var pData = {
                    start_record: "",
                    end_record: "",
                    filter_expression: " item_no=" + page.item_no,
                    sort_expression: ""
                }
                if ($("[controlid='chkCurrentPrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=100"
                }
                else if ($("[controlid='chkPastPrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=150"
                }
                else if ($("[controlid='chkFuturePrc']").prop('checked')) {
                    pData.filter_expression = " item_no=" + page.item_no + " and state_no=200"
                }
                page.itemPriceAPI.searchValue(pData.start_record, pData.end_record, pData.filter_expression, pData.sort_expression, function (data) {
                if (data.length > 0) {
                    $$("txtAddItemMrp").val(data[0].mrp);
                    $$("txtAddItemBatchNo").val(data[0].batch_no);
                    $$("dsAddExpiryDate").setDate(data[0].expiry_date);
                }
            })
            page.loadItemVariation(variation_data[0]);
            });
            */
            
            $("[controlid=chkCurrentPrc]").bind("click", function (e) {
                $("[controlid=chkCurrentPrc]").prop('checked', true);
                $("[controlid=chkPastPrc]").prop('checked', false);
                $("[controlid=chkFuturePrc]").prop('checked', false);
                page.interface.loadPrice();
            })
            $("[controlid=chkPastPrc]").bind("click", function (e) {
                $("[controlid=chkPastPrc]").prop('checked', true);
                $("[controlid=chkCurrentPrc]").prop('checked', false);
                $("[controlid=chkFuturePrc]").prop('checked', false);
                page.interface.loadPrice();
            })
            $("[controlid=chkFuturePrc]").bind("click", function (e) {
                $("[controlid=chkFuturePrc]").prop('checked', true);
                $("[controlid=chkPastPrc]").prop('checked', false);
                $("[controlid=chkCurrentPrc]").prop('checked', false);
                page.interface.loadPrice();
            })
            $("[controlid=chkCurrentPrc]").prop('checked', true);
            $("[controlid=chkPastPrc]").prop('checked', false);
            $("[controlid=chkFuturePrc]").prop('checked', false);
            page.interface.loadPrice();
            
            //page.itemSKUAPI.searchValue("", "", " item_no=" + page.item_no + " and store_no = " + localStorage.getItem("user_store_no"), "", function (data) {
            page.itemSKUAPI.searchValue("", "", " item_no=" + page.item_no + " and store_no = " + localStorage.getItem("user_fulfillment_store_no"), "", function (data) {
                $(data).each(function (i, item) {
                    if (item.avg_buying_cost != null && item.avg_buying_cost != "") {
                        page.avg_price = parseFloat(parseFloat(page.avg_price) + parseFloat(item.avg_buying_cost)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                        page.avg_net_rate = parseFloat(parseFloat(page.avg_net_rate) + parseFloat(item.net_rate)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    }
                });
                page.avg_price = parseFloat(parseFloat(page.avg_price) / data.length).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                page.avg_net_rate = parseFloat(parseFloat(page.avg_net_rate) / data.length).toFixed(CONTEXT.COUNT_AFTER_POINTS);
            });
        };
        page.loadItemVariation = function (data) {
            if (data.var_supp_no == "1") {
                itemSuppNo = true;
            }
            if (data.var_buying_cost == "1") {
                itemCost=true;
            }
            if (data.var_mrp == "1") {
                itemMrp = true;
            }
            if (data.var_batch_no == "1") {
                itemBatchNo = true;
            }
            if (data.var_man_date == "1") {
                itemMandate = true;
            }
            if (data.var_expiry_date == "1") {
                itemExpiryDate = true;
            }
        }
        page.view = {
            selectedItemPrice: function (data) {
                var grditempriceWidth = 900;
                if (CONTEXT.ENABLE_VARIATION)
                    grditempriceWidth = grditempriceWidth + 135;
                if (CONTEXT.ENABLE_ALTER_PRICE_1)
                    grditempriceWidth = grditempriceWidth + 120;
                if (CONTEXT.ENABLE_ALTER_PRICE_2)
                    grditempriceWidth = grditempriceWidth + 120;
                if (CONTEXT.ENABLE_BAT_NO)
                    grditempriceWidth = grditempriceWidth + 135;
                page.controls.grdItemPrice.width(grditempriceWidth + "px");//1500px;
                page.controls.grdItemPrice.height("300px");
                page.controls.grdItemPrice.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "ID", 'rlabel': 'ID', 'width': "60px", 'dataField': "price_no", filterType: "Text" },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "125px", 'dataField': "variation_name", filterType: "Select", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "From Date", 'rlabel': 'From Date', 'width': "150px", 'dataField': "valid_from_date"},
                        { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': 'Selling Price', 'width': "80px", 'dataField': "price", filterType: "Text" },
                        { 'name': CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'Selling Price1', 'width': "100px", 'dataField': "alter_price_1", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                        { 'name': CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'Selling Price2', 'width': "100px", 'dataField': "alter_price_2", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_2 },

                        { 'name': "Cost", 'width': "80px", 'rlabel': 'Cost', 'dataField': "cost", filterType: "Text", visible: itemCost },
                        { 'name': "MRP", 'width': "80px", 'rlabel': 'MRP', 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP && itemMrp, filterType: "Select" },
                        { 'name': "Batch No", 'width': "125px", 'rlabel': 'Batch No', 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && itemBatchNo, filterType: "Select", visible: CONTEXT.ENABLE_BAT_NO },

                        { 'name': "Expiry Date", 'width': "95px", 'rlabel': 'Exp Date', 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && itemExpiryDate, filterType: "Select" },
                        { 'name': "User Id", 'width': "85px", 'rlabel': 'User Id', 'dataField': "user_no", filterType: "Select" },
                        { 'name': "Active", 'width': "85px", 'rlabel': 'Active', 'dataField': "active", filterType: "Select" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                    ]
                });
                page.controls.grdItemPrice.dataBind(data);
            },
            selectedItemPriceHistory: function (data) {
                //var grdWidth = 920;
                //if (CONTEXT.ENABLE_ALTER_PRICE_1)
                //    grdWidth = grdWidth + 240;
                //if (CONTEXT.ENABLE_ALTER_PRICE_2)
                //    grdWidth = grdWidth + 240;
                //if (CONTEXT.ENABLE_BAT_NO)
                //    grdWidth = grdWidth + 120;
                //if (CONTEXT.ENABLE_EXP_DATE)
                //    grdWidth = grdWidth + 120;
                //page.controls.grdInventoryPrice.width(grdWidth + "px");
                var grdWidth = 100;
                if (CONTEXT.ENABLE_ALTER_PRICE_1)
                    grdWidth = grdWidth + 10;
                if (CONTEXT.ENABLE_ALTER_PRICE_2)
                    grdWidth = grdWidth + 10;
                page.controls.grdInventoryPrice.width(grdWidth + "%");
                page.controls.grdInventoryPrice.height("260px");
                page.controls.grdInventoryPrice.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "ID", 'rlabel': 'ID', 'width': "60px", 'dataField': "price_no" },
                        { 'name': "Item Level", 'rlabel': 'Item Level', 'width': "100px", 'dataField': "item_level" },
                        { 'name': "Item\Var\SKU", 'rlabel': 'Item\Var\SKU', 'width': "140px", 'dataField': "key_value" },
                        { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "90px", 'dataField': "net_rate" },
                        { 'name': "AVG BCost", 'rlabel': 'AVG BCost', 'width': "85px", 'dataField': "avg_buying_cost" },
                        { 'name': "Selling Price", 'rlabel': 'Selling Price', 'width': "140px", 'dataField': "price" },
                        { 'name': "WholeSale Price", 'rlabel': 'Price1', 'width': "140px", 'dataField': "alter_price_1", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                        { 'name': "Online Price", 'rlabel': 'Price2', 'width': "140px", 'dataField': "alter_price_2", visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                        { 'name': "Price Limit", 'rlabel': 'Price Limit', 'width': "120px", 'dataField': "price_limit", visible: CONTEXT.ENABLE_PRICE_LIMIT },
                        { 'name': "From Date", 'rlabel': 'From Date', 'width': "80px", 'dataField': "valid_from_date" },
                        /*
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "B.Cost", 'rlabel': 'Buying Cost', 'width': "100px", 'dataField': "cost", visible: itemCost },
                        { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': 'Selling Price', 'width': "80px", 'dataField': "price" },
                        { 'name': "From Date", 'rlabel': 'From Date', 'width': "150px", 'dataField': "valid_from" },
                        { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "150px", 'dataField': "net_rate" },
                        { 'name': "Profit %", 'rlabel': 'Profit %', 'width': "120px", 'dataField': "profit", editable: true },
                        { 'name': "New" + CONTEXT.SALE_PRICE_NAME, 'rlabel': 'New Selling Price', 'width': "100px", 'dataField': "new_price", itemTemplate: "<input type='text' id='new_price' dataField='new_price' >" },
                        { 'name': CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'Selling Price1', 'width': "100px", 'dataField': "pre_alter_price_1", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                        { 'name': "Price1%", 'rlabel': 'Price1%', 'width': "120px", 'dataField': "price1", editable: true, visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                        { 'name': "New" + CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'New Selling Price1', 'width': "100px", 'dataField': "alter_price_1", itemTemplate: "<input type='text' dataField='alter_price_1' >", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                        { 'name': CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'Selling Price2', 'width': "100px", 'dataField': "pre_alter_price_2", visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                        { 'name': "New" + CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'New Selling Price2', 'width': "100px", 'dataField': "alter_price_2", itemTemplate: "<input type='text' dataField='alter_price_2' >", visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                        //{ 'name': "From Date", 'width': "280px", 'rlabel': 'From Date', 'dataField': "new_from_date", itemTemplate: "<input type='datetime-local' dataField='new_from_date'>" },
                        { 'name': "From Date", 'width': "280px", 'rlabel': 'From Date', 'dataField': "new_from_date", itemTemplate: "<input type='date' dataField='new_from_date'>" },
                        { 'name': "Batch No", 'width': "80px", 'rlabel': 'Batch No', 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && itemBatchNo },
                        { 'name': "MRP", 'width': "80px", 'rlabel': 'MRP', 'dataField': "mrp", visible: itemMrp },
                        { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && itemExpiryDate },
                        { 'name': "Supplier", 'rlabel': 'Supplier Name', 'width': "150px", 'dataField': "vendor_name", visible: itemSuppNo },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                        */
                    ]
                });
                page.controls.grdInventoryPrice.rowBound = function (row, item) {
                    if (item.state_no == "150") {
                        row[0].style.color = "red";
                    }
                    /*
                    row.on("focus", "input[datafield=new_from_date]", function () {
                        row.find("input[datafield=new_from_date]").attr("placeholder", "dd-mm-yyyy");
                    });

                    $(row).find("input[dataField=new_from_date]").change(function () {
                        item.new_from_date = $(this).val();
                    });

                    $(row).find("input[dataField=new_price]").change(function () {
                        item.new_price = $(this).val();
                        var profit = parseFloat(((parseFloat(item.new_price) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
                        item.profit = profit;
                        row.find("input[datafield=profit]").val(profit);
                    });
                    $(row).find("input[dataField=alter_price_1]").change(function () {
                        item.alter_price_1 = $(this).val();
                        var profit = parseFloat(((parseFloat(item.alter_price_1) - parseFloat(item.net_rate)) / parseFloat(item.net_rate)) * 100);
                        item.price1 = profit;
                        row.find("input[datafield=price1]").val(profit);
                    });
                    $(row).find("input[dataField=alter_price_2]").change(function () {
                        item.alter_price_2 = $(this).val();
                    });

                    //Calculate Net Rate
                    var net_rate = 0;
                    net_rate = parseFloat(item.cost) + (parseFloat(item.cost) * parseFloat(item.tax_per) / 100);
                    if (parseFloat(page.itemData.additionalTax) != 0) {
                        net_rate = net_rate + parseFloat(page.itemData.additionalTax);
                    }
                    item.net_rate = parseFloat(net_rate).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                    row.find("input[datafield=net_rate]").val(parseFloat(net_rate).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    row.find("input[datafield=net_rate]").html(parseFloat(net_rate).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                    $(row).find("[datafield=net_rate]").find("div").html(parseFloat(net_rate).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                    row.on("change", "input[datafield=profit]", function () {
                        if (item.profit.startsWith("#")) {
                            item.profit = item.profit.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(item.profit)) / 100;
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            item.new_price = selling_price;
                            row.find("input[datafield=new_price]").val(selling_price);
                            row.find("id[new_price]").val(selling_price);
                        }
                        else {
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            item.new_price = selling_price;
                            row.find("input[datafield=new_price]").val(selling_price);
                            row.find("id[new_price]").val(selling_price);
                        }

                    });
                    row.on("change", "input[datafield=price1]", function () {
                        if (item.price1.startsWith("#")) {
                            item.price1 = item.price1.replace(/#/g, 0);
                            var profper = (parseFloat(item.mrp) * parseFloat(item.price1)) / 100;
                            var selling_price = parseFloat(item.mrp) - parseFloat(profper);
                            item.alter_price_1 = selling_price;
                            row.find("input[datafield=alter_price_1]").val(selling_price);
                            row.find("id[alter_price_1]").val(selling_price);
                        }
                        else {
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.price1)) / 100)).toFixed(CONTEXT.COUNT_AFTER_POINTS);
                            item.alter_price_1 = selling_price;
                            row.find("input[datafield=alter_price_1]").val(selling_price);
                            row.find("id[alter_price_1]").val(selling_price);
                        }

                    });
                    */
                }
                page.controls.grdInventoryPrice.dataBind(data);
                page.controls.grdInventoryPrice.edit(true);
            }
        }
    });

    

}