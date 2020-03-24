/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var global_attr_list = [];


$.fn.businessProductsPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.template("/" + appConfig.root + "/business-products.html");
        //page.template(appConfig.location + "/css/business-products.css");

        page.itemAPI = new ItemAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.itemSKUAPI = new ItemSKUAPI();
        page.stockAPI = new StockAPI();

        page.itemList = [];
        page.newItem = false;
        page.newItemNo = "";
        page.attr_list = [];
        page.item_attr_list = [];
        page.storck_attr_list = [];
        page.string_item_attr_list = "";
        page.string_storck_attr_list = "";
        page.string_item_attr_key_list = "";
        page.item_attr_key_list = "";
        page.string_stock_attr_list = "";
        page.storck_attr_key_list = "";
        page.item_no = 0;

        page.events = {
            page_load: function () {
                $(".footer").html(footerTemplate.join(""));

                if (localStorage.getItem("business_user_id") == "" || localStorage.getItem("business_user_id") == null || typeof localStorage.getItem("business_user_id") == "undefined") {
                    window.location.href = "./business-signin.html";
                }
                $(".menu-div").hide();
            },
            btnProducts_click: function () {
                page.view.setPage("items");

                page.itemAPI.searchStoreValues("", "", "", "", function (data) {
                    page.view.selectedProducts(data);
                })

            },
            btnNewProducts_click: function () {
                $$("txtNewItemName").selectedObject.focus();
                page.controls.txtNewItemName.dataBind({
                    getData: function (term, callback) {
                        page.itemAPI.searchValues(0, "10", "(it.item_name like '%" + term + "%' or pt.ptype_name like '%" + term + "%' or mpt.mpt_name like '%" + term + "%')", "", function (data) {
                            callback(data);
                        });
                    }
                });
                page.controls.txtNewItemName.allowCustomText(function (item) {
                    page.controls.txtNewItemName.selectedObject.val(item.val());
                    page.newItem = true;
                });
                page.controls.txtNewItemName.noRecordFound(function () {
                    page.newItem = true;
                });
                page.controls.txtItemSearch.select(function (item) {
                    page.newItem = false;
                    page.newItemNo = item.item_no;
                });
                page.newItem = false;
            },
            btnGetApproval_click: function () {
                if (page.newItem) {
                    var data = {
                        item_name: page.controls.txtNewItemName.selectedObject.val(),
                        comp_id: localStorage.getItem("user_company_id")
                    }
                    page.itemAPI.postValue(data, function (data) {
                        var store_data = {
                            item_no: data[0].key_value,
                            store_no: localStorage.getItem("user_store_no"),
                            stock_maintainence: $$("chkStockMaitainence").prop("checked")?"1":"0"
                        }
                        page.itemAPI.postStoreValue(store_data, function (data) {
                            alert("Product Saved Successfully");
                            page.events.btnProducts_click();
                        });
                    }, function (error) {
                        showErrorDialog();
                    });
                }
                else {
                    var data = {
                        item_no: page.newItemNo,
                        store_no: localStorage.getItem("user_store_no"),
                        stock_maintainence: $$("chkStockMaitainence").prop("checked") ? "1" : "0"
                    }
                    page.itemAPI.postStoreValue(data, function (data) {
                        alert("Product Saved Successfully");
                        page.events.btnProducts_click();
                    });
                }
            },
            btnAddStock_click: function (itemNo) {
                page.itemAPI.getValue(itemNo, function (variation_data) {
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
                    var sData = {
                        start_record: "",
                        end_record: "",
                        filter_expression: " item_no=" + itemNo,
                        sort_expression: " sku_no desc"
                    }
                    page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                        page.view.selectedAddStock(data);
                    });
                });
            },
            btnCreateNewSku_click: function () {
                var attrValues = {
                    var_no: "",
                    qty:"New Stock",
                    attr_type1: page.storck_attr_list[0],
                    attr_type2: page.storck_attr_list[1],
                    attr_type3: page.storck_attr_list[2],
                    attr_type4: page.storck_attr_list[3],
                    attr_type5: page.storck_attr_list[4],
                    attr_type6: page.storck_attr_list[5],
                    attr_value1: "",
                    attr_value2: "",
                    attr_value3: "",
                    attr_value4: "",
                    attr_value5: "",
                    attr_value6: "",
                    new_stock:0
                };
                page.controls.grdAddStock.createRow(attrValues);
                page.controls.grdAddStock.edit(true);
            },
            btnSaveNewStock_click: function (itemData) {
                var varData = {
                    variation_name:getVariationName(itemData),
                    store_no: localStorage.getItem("user_store_no"),
                    item_no: page.item_no,
                    active: 1,
                    user_no: getCookie("user_id"),
                    attr_type1: getSupportedText(itemData.attr_type1),
                    attr_value1: itemData.attr_value1,
                    attr_type2: getSupportedText(itemData.attr_type2),
                    attr_value2: itemData.attr_value2,
                    attr_type3: getSupportedText(itemData.attr_type3),
                    attr_value3: itemData.attr_value3,
                    attr_type4: getSupportedText(itemData.attr_type4),
                    attr_value4: itemData.attr_value4,
                    attr_type5: getSupportedText(itemData.attr_type5),
                    attr_value5: itemData.attr_value5,
                    attr_type6: getSupportedText(itemData.attr_type6),
                    attr_value6: itemData.attr_value6,
                }
                var inventItem = {
                    var_no: "0",
                    item_no: page.item_no,
                    store_no: localStorage.getItem("user_store_no"),
                    qty: itemData.new_stock,

                    trans_type: "Purchase",
                    user_id: localStorage.getItem("app_user_id"),
                    trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    key1: page.item_no,
                    key2: "-1",
                    key3: localStorage.getItem("app_user_id"),
                    comments: "Stock Added By User: " + localStorage.getItem("app_user_id") + " on : " + new Date(),
                    //Stock Table Data
                    cost: 0,
                    avg_buying_cost: 0,
                    u_comp_id: localStorage.getItem("user_company_id"),

                    //FINFACTS ENTRY DATA
                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                    invent_type: "PurchaseCredit",
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    description: "Stock Added By User: " + localStorage.getItem("app_user_id") + " on : " + new Date(),
                    amount: 0,


                    attr_type1: getSupportedText(itemData.attr_type1),
                    attr_value1: itemData.attr_value1,
                    attr_type2: getSupportedText(itemData.attr_type2),
                    attr_value2: itemData.attr_value2,
                    attr_type3: getSupportedText(itemData.attr_type3),
                    attr_value3: itemData.attr_value3,
                    attr_type4: getSupportedText(itemData.attr_type4),
                    attr_value4: itemData.attr_value4,
                    attr_type5: getSupportedText(itemData.attr_type5),
                    attr_value5: itemData.attr_value5,
                    attr_type6: getSupportedText(itemData.attr_type6),
                    attr_value6: itemData.attr_value6,

                    tray_mode: "None",
                    tray_id: "",
                    manual_stock: "1"
                };
                inventItem.var_data = varData;
                inventItem.average_stock = "false";
                page.stockAPI.insertVariationStock(inventItem, function (data) {
                    alert("Stock Added Successfully...");
                });
            },
            checkNewStock_click: function (data, callback) {
                var result = true;
                try{
                    if (data.attr_type1 != null && data.attr_type1 != "" && data.attr_type1 != undefined) {
                        if (data.attr_value1 == null || data.attr_value1 == "" || data.attr_value1 == undefined) {
                            result = false;
                            throw result;
                        }
                    }
                    if (data.attr_type2 != null && data.attr_type2 != "" && data.attr_type2 != undefined) {
                        if (data.attr_value2 == null || data.attr_value2 == "" || data.attr_value2 == undefined) {
                            result = false;
                            throw result;
                        }
                    }
                    if (data.attr_type3 != null && data.attr_type3 != "" && data.attr_type3 != undefined) {
                        if (data.attr_value3 == null || data.attr_value3 == "" || data.attr_value3 == undefined) {
                            result = false;
                            throw result;
                        }
                    }
                    if (data.attr_type4 != null && data.attr_type4 != "" && data.attr_type4 != undefined) {
                        if (data.attr_value4 == null || data.attr_value4 == "" || data.attr_value4 == undefined) {
                            result = false;
                            throw result;
                        }
                    }
                    if (data.attr_type5 != null && data.attr_type5 != "" && data.attr_type5 != undefined) {
                        if (data.attr_value5 == null || data.attr_value5 == "" || data.attr_value5 == undefined) {
                            result = false;
                            throw result;
                        }
                    }
                    if (data.attr_type6 != null && data.attr_type6 != "" && data.attr_type6 != undefined) {
                        if (data.attr_value6 == null || data.attr_value6 == "" || data.attr_value6 == undefined) {
                            result = false;
                            throw result;
                        }
                    }
                    if (isNaN(data.new_stock)) {
                        result = false;
                    }
                }
                catch (e) {
                    callback(result)
                }
                callback(result)
            },
            setAddStockActionButton_click: function (button) {
                if (button == "save") {
                    $(page.row).find("[id=saveStockButton]").show();
                    $(page.row).find("[id=actionImage]").hide();
                    $(page.row).find("[id=reSaveStockButton]").hide();
                    $(row).find("[id=savedStockButton]").hide();
                }
                else if (button == "load") {
                    $(page.row).find("[id=saveStockButton]").hide();
                    $(page.row).find("[id=actionImage]").show();
                    $(page.row).find("[id=reSaveStockButton]").hide();
                    $(row).find("[id=savedStockButton]").hide();
                }
                else if(button == "retry") {
                    $(page.row).find("[id=saveStockButton]").hide();
                    $(page.row).find("[id=actionImage]").hide();
                    $(page.row).find("[id=reSaveStockButton]").show();
                    $(row).find("[id=savedStockButton]").hide();
                }
                else {
                    $(page.row).find("[id=saveStockButton]").hide();
                    $(page.row).find("[id=actionImage]").hide();
                    $(page.row).find("[id=reSaveStockButton]").hide();
                    $(row).find("[id=savedStockButton]").hide();
                }
            },
            btnViewStockDetails_click: function (itemNo) {
                page.itemAPI.getValue(itemNo, function (variation_data) {
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
                    var sData = {
                        start_record: "",
                        end_record: "",
                        filter_expression: " item_no=" + itemNo,
                        sort_expression: " sku_no desc"
                    }
                    page.itemSKUAPI.searchValue(sData.start_record, sData.end_record, sData.filter_expression, sData.sort_expression, function (data) {
                        page.view.selectedViewStock(data);
                    });
                });
            }
        }

        page.view = {
            setPage: function (page) {
                if (page == "newProduct") {
                    $$("pnlSearch").hide();
                    $$("pnlProducts").hide();
                    $$("pnlNewProducts").show();
                }
                if (page == "items") {
                    $$("pnlSearch").show();
                    $$("pnlProducts").show();
                    $$("pnlNewProducts").hide();
                }
            },
            selectedProducts: function (data) {
                $$("grdItems").width("100%");
                //$$("grdItems").height("auto;min-height:100px;overflow-y:auto;overflow-x:hidden;");
                page.controls.grdItems.setTemplate({
                    selection: "Single", sort: false,
                    columns: [
                        { 'name': "", 'width': "0px", 'dataField': "qty", visible: false },

                        { 'name': "", 'width': "100%;margin: 0px;padding: 15px;border: 1px solid #c1bfbf;", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                    ]
                });
                page.controls.grdItems.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Delete") {
                        removeCartItems(rowData.sku_no);
                        page.controls.grdItems.deleteRow(rowId);
                        page.calculate();
                        page.view.selectedPanel();
                    }
                    if (action == "addStock") {
                        page.events.btnAddStock_click(rowData.item_no);
                    }
                }
                page.controls.grdItems.selectionChanged = function (row, item) {
                    page.item_no = item.item_no;
                }
                page.controls.grdItems.rowBound = function (row, item) {
                    var htmlTemplate = [];
                    if (window.mobile) {
                        htmlTemplate.push('<div class="col-xs-12">');
                        htmlTemplate.push('<span class="order-list-style1">Order Placed</span><br><h4 class="order-date">' + item.ordered_date + '</h4><br><span class="order-list-style1">Order Number:&nbsp;' + item.order_id + '<br><span class="order-list-style1">Recipient:&nbsp;' + item.cust_name + '</span><br><span class="order-list-style1">Order total:&nbsp;<i class="fa fa-rupee"></i>' + item.total + '</span>');
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-12">');
                        $(item.order_items).each(function (i, product) {
                            if (item.status == "906")
                                htmlTemplate.push('<h2 class="state-text">' + item.state_text + " &nbsp;&nbsp;On&nbsp;&nbsp; " + item.confirm_date + '</h2>');
                            else if (item.status == "901")
                                htmlTemplate.push('<h2 class="state-text">' + item.state_text + " &nbsp;&nbsp;On&nbsp;&nbsp; " + item.fulfilled_date + '</h2>');
                            else if (item.status == "800")
                                htmlTemplate.push('<h2 class="state-text">' + item.state_text + " &nbsp;&nbsp;On&nbsp;&nbsp; " + item.delivered_date + '</h2>');
                            else
                                htmlTemplate.push('<h2 class="state-text">' + item.state_text + '</h2>');
                            htmlTemplate.push('<hr class="col-xs-12">');
                            htmlTemplate.push('<div class="col-xs-3" style="padding:0px;">');
                            htmlTemplate.push('<img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + product.item_no + '/' + product.image_name + '" width="100%" />');
                            htmlTemplate.push('</div>');
                            htmlTemplate.push('<div class="col-xs-9">');
                            htmlTemplate.push('<h3 class="item-name">' + product.item_name + '</h3>');
                            htmlTemplate.push('<span class="order-list-style1">Quantity:&nbsp;' + parseInt(product.quantity) + '&nbsp;' + product.unit + '</span>');
                            htmlTemplate.push('</div>');
                        });
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-12">');
                        htmlTemplate.push("<span class='col-xs-12'>&nbsp;</span>");
                        htmlTemplate.push("<button class='order-list-button col-xs-12' action='OrderDetails'>Order Details</button>");
                        htmlTemplate.push("<button class='order-list-button col-xs-12' action='Invoice'>Invoice</button>");
                        if (item.status == "800" || item.status == "902") {
                            if (datediff(item.delivered_date) <= 7) {
                                htmlTemplate.push("<button class='order-list-button col-xs-12' action='OrderReturns'>Replace items</button>");
                            }
                            if (datediff(item.delivered_date) <= 28)
                                htmlTemplate.push("<button class='order-list-button col-xs-12' action='cancelOrder'>Return Order</button>");
                        }
                        if (item.status == "901" || item.status == "906")
                            htmlTemplate.push("<button class='order-list-button col-xs-12' action='cancelOrder'>Cancel Order</button>");
                        htmlTemplate.push('</div>');
                    }
                    else {
                        htmlTemplate.push('<div class="col-xs-2">');
                        if (true) {//item.image == null || item.image == "" || item.image == undefined
                            htmlTemplate.push('<img src="../image/no-image.png" width="100%" />');
                        }
                        else {
                            htmlTemplate.push('<img src="' + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image + '" width="100%" />');
                        }
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-7">');
                        htmlTemplate.push('<h3 class="item-name">' + item.item_name + '</h3>');
                        if (item.unit != null && item.unit != "" && item.unit != undefined) {
                            htmlTemplate.push('<span class="order-list-style1 col-xs-12"><span class="col-xs-3">Unit&nbsp;:</span><span class="col-xs-9">' + item.unit + '</span></span>');
                        }
                        if (item.mpt_name != null && item.mpt_name != "" && item.mpt_name != undefined) {
                            htmlTemplate.push('<span class="order-list-style1 col-xs-12"><span class="col-xs-3">Main Category Type&nbsp;:</span><span class="col-xs-9">' + item.mpt_name + '</span></span>');
                        }
                        if (item.ptype_name != null && item.ptype_name != "" && item.ptype_name != undefined) {
                            htmlTemplate.push('<span class="order-list-style1 col-xs-12"><span class="col-xs-3">Sub Category Type&nbsp;:</span><span class="col-xs-9">' + item.ptype_name + '</span></span>');
                        }
                        if (item.tax_class_name != null && item.tax_class_name != "" && item.tax_class_name != undefined) {
                            htmlTemplate.push('<span class="order-list-style1 col-xs-12"><span class="col-xs-3">Tax% @ HSN Code&nbsp;:</span><span class="col-xs-9">' + item.tax_class_name + '</span></span>');
                        }
                        htmlTemplate.push('<span class="order-list-style1 col-xs-12"><span class="col-xs-3">Total Stock&nbsp;:</span><span class="col-xs-9">' + item.stock + ' <button class="stock-button" action="viewStock">(Stock Details)</button></span></span>');
                        htmlTemplate.push('</div>');
                        htmlTemplate.push('<div class="col-xs-3">');
                        htmlTemplate.push("<button class='order-list-button col-xs-12' action='addStock'>Add Stock</button>");
                        htmlTemplate.push("<button class='order-list-button col-xs-12' action='setPrice'>Set Price</button>");
                        htmlTemplate.push("<button class='order-list-button col-xs-12' action='disableItems'>Deactivate Product</button>");
                        htmlTemplate.push("<button class='order-list-button col-xs-12' action='deleteItems'>Delete Product</button>");
                        htmlTemplate.push('</div>');
                    }
                    // htmlTemplate.push('<hr class="col-xs-12">');
                    $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                };

                $$("grdItems").dataBind(data);
            },
            selectedAddStock: function (data) {
                var gridWidth = 100;
                page.controls.pnlAddStock.open();
                page.controls.pnlAddStock.title("Add Stock");
                if (!window.mobile) {
                    gridWidth = (page.storck_attr_key_list.length <= 2) ? 60 : (page.storck_attr_key_list.length > 2 && page.storck_attr_key_list.length <= 4) ? 80 : 90;
                }
                page.controls.pnlAddStock.width(gridWidth+"%");
                page.controls.pnlAddStock.height("auto");

                page.controls.grdAddStock.width("100%");//1400px;
                page.controls.grdAddStock.height("auto");
                page.controls.grdAddStock.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    pageType: "Standard",
                    columns: [
                        { 'name': "Stock Id", 'width': "80px", 'dataField': "sku_no" },
                        { 'name': "Stock In Store", 'width': "150px", 'dataField': "qty" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[0]), 'width': "130px;margin-top:0px;", 'dataField': "attributes1", visible: (page.storck_attr_list.length - 1 >= 0), itemTemplate: "<div  id='Attributes1'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[1]), 'width': "130px;margin-top:0px;", 'dataField': "attributes2", visible: (page.storck_attr_list.length - 1 >= 1), itemTemplate: "<div  id='Attributes2'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[2]), 'width': "100px;margin-top:0px;", 'dataField': "attributes3", visible: (page.storck_attr_list.length - 1 >= 2), itemTemplate: "<div  id='Attributes3'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[3]), 'width': "100px;margin-top:0px;", 'dataField': "attributes4", visible: (page.storck_attr_list.length - 1 >= 3), itemTemplate: "<div  id='Attributes4'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[4]), 'width': "100px;margin-top:0px;", 'dataField': "attributes5", visible: (page.storck_attr_list.length - 1 >= 4), itemTemplate: "<div  id='Attributes5'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[5]), 'width': "100px;margin-top:0px;", 'dataField': "attributes6", visible: (page.storck_attr_list.length - 1 >= 5), itemTemplate: "<div  id='Attributes6'></div>" },
                        { 'name': "New Stock", 'width': "150px", 'dataField': "new_stock", editable: true },
                        { 'name': "", 'width': "50px", 'dataField': "var_no", editable: false, itemTemplate: "<div  id='saveStock' style=''></div>" },
                    ]
                });
                page.controls.grdAddStock.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    page.row = row;
                    if (action == "saveStock") {
                        page.events.setAddStockActionButton_click("load");
                        page.events.checkNewStock_click(rowData, function (result) {
                            if (result) {
                                //page.events.btnSaveNewStock_click(rowData);
                            }
                            else {
                                alert("Please Give Details To All The Field");
                                page.events.setAddStockActionButton_click("retry");
                            }
                        });
                    }
                    if (action == "reSaveStock") {
                        page.events.setAddStockActionButton_click("load");
                        page.events.checkNewStock_click(rowData, function (result) {
                            if (result) {
                                //page.events.btnSaveNewStock_click(rowData);
                            }
                            else {
                                alert("Please Give Details To All The Field");
                                page.events.setAddStockActionButton_click("retry");
                            }
                        });
                    }
                }
                $$("grdAddStock").rowBound = function (row, item) {
                    if (item.active == "0") {
                        row[0].style.color = "red";
                    }

                    var attrTemplate = [];
                    if (item.attr_type1 == "exp_date" || item.attr_type1 == "man_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value1' style='width:100px;margin-top:5px;' >");
                    }
                    else {
                        attrTemplate.push("<input type='text' dataField='attr_value1' style='width:80px;margin-top:5px;'>");
                    }
                    $(row).find("[id=Attributes1]").html(attrTemplate.join(""));

                    var attrTemplate = [];
                    if (item.attr_type2 == "man_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value2' style='width:100px;margin-top:5px;'>");
                    }
                    else {
                        attrTemplate.push("<input type='text' dataField='attr_value2' style='width:80px;margin-top:5px;'>");
                    }
                    $(row).find("[id=Attributes2]").html(attrTemplate.join(""));

                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value3' style='width:80px;margin-top:5px;'>");
                    $(row).find("[id=Attributes3]").html(attrTemplate.join(""));
                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value4' style='width:80px;margin-top:5px;'>");
                    $(row).find("[id=Attributes4]").html(attrTemplate.join(""));
                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value5' style='width:80px;margin-top:5px;'>");
                    $(row).find("[id=Attributes5]").html(attrTemplate.join(""));
                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value6' style='width:80px;margin-top:5px;'>");
                    $(row).find("[id=Attributes6]").html(attrTemplate.join(""));

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

                    if (item.attr_value1 == "") {
                        $(row).find("input[dataField=attr_value1]").attr("disabled", false);
                        $(row).find("input[dataField=attr_value1]").css("background", "white");
                    }
                    else {
                        $(row).find("input[dataField=attr_value1]").val(item.attr_value1).change();
                        $(row).find("input[dataField=attr_value1]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value1]").css("border", "none");
                        $(row).find("input[dataField=attr_value1]").css("background", "transparent");
                    }
                    if (item.attr_value2 == "") {
                        $(row).find("input[dataField=attr_value2]").attr("disabled", false);
                        $(row).find("input[dataField=attr_value2]").css("background", "white");
                    }
                    else {
                        $(row).find("input[dataField=attr_value2]").val(item.attr_value2).change();
                        $(row).find("input[dataField=attr_value2]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value2]").css("border", "none");
                        $(row).find("input[dataField=attr_value2]").css("background", "transparent");
                    }
                    if (item.attr_value3 == "") {
                        $(row).find("input[dataField=attr_value3]").attr("disabled", false);
                        $(row).find("input[dataField=attr_value3]").css("background", "white");
                    }
                    else {
                        $(row).find("input[dataField=attr_value3]").val(item.attr_value3).change();
                        $(row).find("input[dataField=attr_value3]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value3]").css("border", "none");
                        $(row).find("input[dataField=attr_value3]").css("background", "transparent");
                    }
                    if (item.attr_value4 == "") {
                        $(row).find("input[dataField=attr_value4]").attr("disabled", false);
                        $(row).find("input[dataField=attr_value4]").css("background", "white");
                    }
                    else {
                        $(row).find("input[dataField=attr_value4]").val(item.attr_value4).change();
                        $(row).find("input[dataField=attr_value4]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value4]").css("border", "none");
                        $(row).find("input[dataField=attr_value4]").css("background", "transparent");
                    }
                    if (item.attr_value5 == "") {
                        $(row).find("input[dataField=attr_value5]").attr("disabled", false);
                        $(row).find("input[dataField=attr_value5]").css("background", "white");
                    }
                    else {
                        $(row).find("input[dataField=attr_value5]").val(item.attr_value5).change();
                        $(row).find("input[dataField=attr_value5]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value5]").css("border", "none");
                        $(row).find("input[dataField=attr_value5]").css("background", "transparent");
                    }
                    if (item.attr_value6 == "") {
                        $(row).find("input[dataField=attr_value6]").attr("disabled", false);
                        $(row).find("input[dataField=attr_value6]").css("background", "white");
                    }
                    else {
                        $(row).find("input[dataField=attr_value6]").val(item.attr_value6).change();
                        $(row).find("input[dataField=attr_value6]").attr("disabled", true);
                        $(row).find("input[dataField=attr_value6]").css("border", "none");
                        $(row).find("input[dataField=attr_value6]").css("background", "transparent");
                    }

                    if (item.active == "0") {
                        row[0].style.color = "red";
                        $(row).find("input[dataField=attr_value1]").css("color", "red");
                        $(row).find("input[dataField=attr_value2]").css("color", "red");
                        $(row).find("input[dataField=attr_value3]").css("color", "red");
                        $(row).find("input[dataField=attr_value4]").css("color", "red");
                        $(row).find("input[dataField=attr_value5]").css("color", "red");
                        $(row).find("input[dataField=attr_value6]").css("color", "red");
                    }
                    var htmlTemplate = [];
                    htmlTemplate.push("<input type='button'  class='grid-button' value='Save' action='saveStock' id='saveStockButton'/><div class='col-xs-12' id = 'actionImage'><img src='../image/spinner.gif' width='100%' /></div><input type='button'  class='grid-button' value='Retry' action='reSaveStock' id='reSaveStockButton' id='reSaveStockButton'/><input type='button'  class='grid-button' value='Stock Saved' action='Stock Saved' id='savedStockButton'/>");
                    $(row).find("[id=saveStock]").html(htmlTemplate.join(""));
                    $(row).find("[id=actionImage]").hide();
                    $(row).find("[id=reSaveStockButton]").hide();
                    $(row).find("[id=savedStockButton]").hide();
                }
                page.controls.grdAddStock.dataBind(data);
                page.controls.grdAddStock.edit(true);
            },
            selectedViewStock: function (data) {
                var gridWidth = 100;
                page.controls.pnlViewStock.open();
                page.controls.pnlViewStock.title("View Stock List");
                if (!window.mobile) {
                    gridWidth = (page.storck_attr_key_list.length <= 2) ? 60 : (page.storck_attr_key_list.length > 2 && page.storck_attr_key_list.length <= 4) ? 80 : 90;
                }
                page.controls.pnlViewStock.width(gridWidth + "%");
                page.controls.pnlViewStock.height("auto");

                page.controls.grdViewStock.width("100%");//1400px;
                page.controls.grdViewStock.height("auto");
                page.controls.grdViewStock.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    pageType: "Standard",
                    columns: [
                        { 'name': "Stock Id", 'width': "80px", 'dataField': "sku_no" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[0]), 'width': "130px;margin-top:0px;", 'dataField': "attributes1", visible: (page.storck_attr_list.length - 1 >= 0), itemTemplate: "<div  id='Attributes1'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[1]), 'width': "130px;margin-top:0px;", 'dataField': "attributes2", visible: (page.storck_attr_list.length - 1 >= 1), itemTemplate: "<div  id='Attributes2'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[2]), 'width': "100px;margin-top:0px;", 'dataField': "attributes3", visible: (page.storck_attr_list.length - 1 >= 2), itemTemplate: "<div  id='Attributes3'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[3]), 'width': "100px;margin-top:0px;", 'dataField': "attributes4", visible: (page.storck_attr_list.length - 1 >= 3), itemTemplate: "<div  id='Attributes4'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[4]), 'width': "100px;margin-top:0px;", 'dataField': "attributes5", visible: (page.storck_attr_list.length - 1 >= 4), itemTemplate: "<div  id='Attributes5'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[5]), 'width': "100px;margin-top:0px;", 'dataField': "attributes6", visible: (page.storck_attr_list.length - 1 >= 5), itemTemplate: "<div  id='Attributes6'></div>" },
                        { 'name': "Stock In Store", 'width': "150px", 'dataField': "qty" },
                        { 'name': "", 'width': "50px", 'dataField': "var_no", editable: false, itemTemplate: "<div  id='saveStock' style=''></div>" },
                    ]
                });
                page.controls.grdViewStock.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    page.row = row;
                    if (action == "saveStock") {
                        page.events.setAddStockActionButton_click("load");
                        page.events.checkNewStock_click(rowData, function (result) {
                            if (result) {
                                //page.events.btnSaveNewStock_click(rowData);
                            }
                            else {
                                alert("Please Give Details To All The Field");
                                page.events.setAddStockActionButton_click("retry");
                            }
                        });
                    }
                }
                $$("grdViewStock").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<input type='button'  class='grid-button' value='Save' action='saveStock' id='saveStockButton'/><div class='col-xs-12' id = 'actionImage'><img src='../image/spinner.gif' width='100%' /></div><input type='button'  class='grid-button' value='Retry' action='reSaveStock' id='reSaveStockButton' id='reSaveStockButton'/><input type='button'  class='grid-button' value='Stock Saved' action='Stock Saved' id='savedStockButton'/>");
                    $(row).find("[id=saveStock]").html(htmlTemplate.join(""));
                    $(row).find("[id=actionImage]").hide();
                    $(row).find("[id=reSaveStockButton]").hide();
                    $(row).find("[id=savedStockButton]").hide();
                }
                page.controls.grdViewStock.dataBind(data);
                page.controls.grdViewStock.edit(true);
            },
        }

        page.interface.load = function () {
            page.events.btnProducts_click();

            page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {// attr_no_key not in(100,101,102)
                global_attr_list = data;
            });
        }

    });
};

function getAttributeName(id) {
    var value = "";
    $(global_attr_list).each(function (i, item) {
        if (item.attr_no_key == id)
            value = item.attr_name;
    })
    return (value);
}
function getSupportedText(text) {
    text = (text == null || text == "" || text == undefined || typeof text == "undefined") ? "" : text;
    return text;
}

function getVariationName(data) {
    variationName = "";
    if (data.attr_type1 != null && data.attr_type1 != "" && data.attr_type1 != undefined) {
        variationName = variationName + data.attr_type1+": ";
    }
    if (data.attr_value1 != null && data.attr_value1 != "" && data.attr_value1 != undefined) {
        variationName = variationName + data.attr_value1;
    }
    if (data.attr_type2 != null && data.attr_type2 != "" && data.attr_type2 != undefined) {
        variationName = variationName + ", " + data.attr_type2 + ": ";
    }
    if (data.attr_value2 != null && data.attr_value2 != "" && data.attr_value2 != undefined) {
        variationName = variationName + data.attr_value2;
    }
    if (data.attr_type3 != null && data.attr_type3 != "" && data.attr_type3 != undefined) {
        variationName = variationName + ", " + data.attr_type3 + ": ";
    }
    if (data.attr_value3 != null && data.attr_value3 != "" && data.attr_value3 != undefined) {
        variationName = variationName + data.attr_value3;
    }
    if (data.attr_type4 != null && data.attr_type4 != "" && data.attr_type4 != undefined) {
        variationName = variationName + ", " + data.attr_type4 + ": ";
    }
    if (data.attr_value4 != null && data.attr_value4 != "" && data.attr_value4 != undefined) {
        variationName = variationName + data.attr_value4;
    }
    if (data.attr_type5 != null && data.attr_type5 != "" && data.attr_type5 != undefined) {
        variationName = variationName + ", " + data.attr_type5 + ": ";
    }
    if (data.attr_value5 != null && data.attr_value5 != "" && data.attr_value5 != undefined) {
        variationName = variationName + data.attr_value5;
    }
    if (data.attr_type6 != null && data.attr_type6 != "" && data.attr_type6 != undefined) {
        variationName = variationName + ", " + data.attr_type6 + ": ";
    }
    if (data.attr_value6 != null && data.attr_value6 != "" && data.attr_value6 != undefined) {
        variationName = variationName + data.attr_value6;
    }
    return variationName;
}


function ItemAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("inventory/item/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
    this.getValue = function (item_no, callback) {
        //$.server.webMethodGET("inventory/item/" + item_no + "?store_no=" + localStorage.getItem("user_store_no"), callback, callback);
        $.server.webMethodGET("inventory/item/" + item_no + "?store_no=" + localStorage.getItem("user_store_no"), callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("inventory/item/", data, callback, errorCallback);
    }

    this.postStoreValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/itemstore/", data, callback, errorCallback);
    }
    this.searchStoreValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("shopon/itemstore/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

}

function ItemAttributeAPI() {
    var self = this;

    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, i, callback) {
        //todo filter expression -> 
        $.server.webMethodGET("shopon/item-attribute/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression + "&i=" + i, callback);
    }
}

function ItemSKUAPI() {
    this.searchValue = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("inventory/sku?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
}

function StockAPI() {
    this.insertVariationStock = function (stock, callback, errorCallback) {
        $.server.webMethodPOST("shopon/variation/" + stock.var_no + "/stock", stock, callback, errorCallback);
    };
}


