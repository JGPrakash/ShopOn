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

       page.events = {
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
                           page.stockAPI.searchPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                               //page.controls.grdItemPrice.dataBind(data);
                               page.view.selectedItemPrice(data);
                           });
                           page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
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

           btnAddPrice_click: function () {
               $$("btnAddPrice").disable(true);
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
                                   var time = cur_date.getHours() % 12;//EnteredDate.substring(11, 13);
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
                page.view.selectedItemPrice([]);
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
                $$("btnAddPrice").disable(false);
            }
        };

       page.price_validation = function (callback) {
           var alldata = page.controls.grdItemPrice.allData();
           $(alldata).each(function (index, item) {
               var price = parseFloat($$("txtAddItemPrice").val()).toFixed(5);
               var mrp = parseFloat($$("txtAddItemMrp")).toFixed(5);
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
        page.interface.load = function(itemNo) {
            page.item_no = itemNo;
            page.itemAPI.getValue(itemNo, function (variation_data) {
                
            page.stockAPI.searchPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                if (data.length > 0)
                    page.priceflag = true;
                else
                    page.priceflag = false;
                //page.controls.grdItemPrice.dataBind(data);
                page.view.selectedItemPrice(data);
            });

            page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                //page.controls.grdInventoryPrice.dataBind(data);
                page.view.selectedItemPriceHistory(data);
            });
            page.stockAPI.searchCurrentPricesMain(page.item_no, getCookie("user_store_id"), function (data) {
                if (data.length > 0) {
                    $$("txtAddItemMrp").val(data[0].mrp);
                    $$("txtAddItemBatchNo").val(data[0].batch_no);
                    $$("dsAddExpiryDate").setDate(data[0].expiry_date);
                }
            })
            page.loadItemVariation(variation_data[0]);
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
                        { 'name': "From Date", 'rlabel': 'From Date', 'width': "150px", 'dataField': "valid_from", filterType: "Select" },
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
                var grdWidth = 1165;
                if (CONTEXT.ENABLE_ALTER_PRICE_1)
                    grdWidth = grdWidth + 240;
                if (CONTEXT.ENABLE_ALTER_PRICE_2)
                    grdWidth = grdWidth + 240;
                if (CONTEXT.ENABLE_BAT_NO)
                    grdWidth = grdWidth + 120;
                if (CONTEXT.ENABLE_EXP_DATE)
                    grdWidth = grdWidth + 120;
                page.controls.grdInventoryPrice.width(grdWidth + "px");
                page.controls.grdInventoryPrice.height("260px");
                page.controls.grdInventoryPrice.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_VARIATION },
                        { 'name': "B.Cost", 'rlabel': 'Buying Cost', 'width': "100px", 'dataField': "cost", visible: itemCost },
                        { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': 'Selling Price', 'width': "80px", 'dataField': "price" },
                        { 'name': "From Date", 'rlabel': 'From Date', 'width': "150px", 'dataField': "valid_from" },
                        { 'name': "Net Rate", 'rlabel': 'Net Rate', 'width': "150px", 'dataField': "net_rate" },
                        { 'name': "Profit %", 'rlabel': 'Profit %', 'width': "120px", 'dataField': "profit", editable: true },
                        { 'name': "New" + CONTEXT.SALE_PRICE_NAME, 'rlabel': 'New Selling Price', 'width': "100px", 'dataField': "new_price", itemTemplate: "<input type='text' id='new_price' dataField='new_price' >" },
                        { 'name': CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'Selling Price1', 'width': "100px", 'dataField': "pre_alter_price_1", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
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
                    ]
                });
                page.controls.grdInventoryPrice.rowBound = function (row, item) {
                    if (item.active == "0") {
                        row[0].style.color = "red";
                    }
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
                    });
                    $(row).find("input[dataField=alter_price_2]").change(function () {
                        item.alter_price_2 = $(this).val();
                    });

                    //Calculate Net Rate
                    var net_rate = 0;
                    net_rate = parseFloat(item.cost) + (parseFloat(item.cost)* parseFloat(item.tax_per) / 100);
                    item.net_rate = net_rate;
                    row.find("input[datafield=net_rate]").val(net_rate);
                    row.find("input[datafield=net_rate]").html(net_rate);
                    $(row).find("[datafield=net_rate]").find("div").html(net_rate);

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
                            var selling_price = parseFloat(parseFloat(item.net_rate) * ((100 + parseFloat(item.profit)) / 100)).toFixed(5);
                            item.new_price = selling_price;
                            row.find("input[datafield=new_price]").val(selling_price);
                            row.find("id[new_price]").val(selling_price);
                        }

                    });
                }
                page.controls.grdInventoryPrice.dataBind(data);
                page.controls.grdInventoryPrice.edit(true);
            }
        }
    });

    

}