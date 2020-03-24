$.fn.customerPortal = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.itemService = new ItemService();
        page.customerService = new CustomerService();
        page.billService = new BillService();
        page.taxclassService = new TaxClassService();
        page.salesService = new SalesService();
        page.finfactsService = new FinfactsService();
        page.stockAPI = new StockAPI();
        page.salesItemAPI = new SalesItemAPI();
        page.finfactsEntry = new FinfactsEntry();
        page.customerAPI = new CustomerAPI();
        page.itemAPI = new ItemAPI();
        page.discount = [];
        page.selectedSOItems = [];
        page.cust_no = 0;
        page.cust_name = "";
        page.cust_phone = "";
        page.cust_email = "";
        page.cust_address = "";
        page.cust_gst = "";
        page.order_id = null;
        document.title = "ShopOn - Customer Portal";
        page.events.page_load = function () {
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            page.current_date = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
            page.sales_tax_no = -1;
            page.billService.getSalesTaxClass(CONTEXT.DEFAULT_SALES_TAX, function (data) {
                page.sales_tax = data;
            });

            page.controls.grdProductDetail.width("100%");
            page.controls.grdProductDetail.setTemplate({
                selection: "Single",
                columns: [
                        { 'name': "",  itemTemplate: "<div  id='prdDetail' style=''></div>" },
                ]
            });
            $$("grdProductDetail").rowBound = function (row, item) {
                if (item.man_name == null || typeof item.man_name == "undefined" || item.man_name == "") {
                    item.man_name = "";
                }
                var htmlTemplate = [];
                if (item.image_name == null || item.image_name == "" || typeof item.image_name == "undefined") {
                    htmlTemplate.push("<div class='col-xs-12 col-sm-6'><img id='imgPrdDetail' src='Image/no-image.png'  /></div>");
                }
                else {
                    htmlTemplate.push("<div class='col-xs-12 col-sm-6'><img id='imgPrdDetail' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div>");
                }
                $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                htmlTemplate.push("<div class='col-xs-12 col-sm-6' style='padding-top: 20px;'><p id='prdproductdetails'><span id='headline' class='col-xs-12 col-sm-12'>Specifications : </span><span  class='col-xs-12 col-sm-12 grid_item_name'>" + item.item_name + "</span><span  class='col-xs-12 col-sm-12 grid_man_name'>Manufacturer : " + item.man_name + "</span><span  class='col-xs-12 col-sm-12'> Rs. " + item.price + "</span>" +
                 "<input class='col-xs-12 col-sm-4' id='grdAddToCart' type='button' value='Add To Cart'/><input class='col-xs-12 col-sm-4' id='grdBuyNow' type='button' value='Buy Now' />");
                $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                $(row).find("[id=grdAddToCart]").click(function () {
                    page.addProductsToCart(item);
                });
                $(row).find("[id=grdBuyNow]").click(function () {
                    page.addProductsToCartCallback(item, function (data) {
                        page.events.btnCart_click();
                        page.checkCart();
                    });
                });
            }
            page.controls.grdProductDetail.dataBind([]);

            
            page.controls.grdMyCart.width("100%");
            page.controls.grdMyCart.setTemplate({
                selection: "Single",
                columns: [
                        //{ 'name': "", itemTemplate: "<div  id='imgGrid' style=margin-left:20px;''></div>" },
                        { 'name': "", itemTemplate: "<div  id='detailGrid'></div>" },
                        { 'name': "", 'width': "0px", 'dataField': "quantity", visible:false },
                        //{ 'name': "", itemTemplate: "<input action='remove' type='button' id='btnRemoveCart' class='buttonSecondary' title ='Remove' value='Remove' /> " },
                        { 'name': "", 'width': "0px", 'dataField': "item_no" },
                        { 'name': "", 'width': "0px", 'dataField': "order_id" },
                        { 'name': "", 'width': "0px", 'dataField': "item_name" },
                        { 'name': "", 'width': "0px", 'dataField': "item_code" },
                        { 'name': "", 'width': "0px", 'dataField': "vendor_name" },
                        { 'name': "", 'width': "0px", 'dataField': "man_name" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_per" },
                        { 'name': "", 'width': "0px", 'dataField': "price" },
                        { 'name': "", 'width': "0px", 'dataField': "mrp" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                        { 'name': "", 'width': "0px", 'dataField': "item_code" },
                        { 'name': "", 'width': "0px", 'dataField': "barcode" },
                        { 'name': "", 'width': "0px", 'dataField': "expiry_date" },
                        { 'name': "", 'width': "0px", 'dataField': "batch_no" },
                        { 'name': "", 'width': "0px", 'dataField': "sku" },
                        { 'name': "", 'width': "0px", 'dataField': "unit" },
                        { 'name': "", 'width': "0px", 'dataField': "tray_no" },
                        { 'name': "", 'width': "0px", 'dataField': "qty_stock" },
                ]
            });
            $$("grdMyCart").rowBound = function (row, item) {
                if (item.vendor_name == null || item.vendor_name == "" || typeof item.vendor_name == "undefined") {
                    item.vendor_name = "";
                }
                htmlTemplate = [];
                htmlTemplate.push("<div class='col-xs-12 col-sm-4'><img id='imgcart' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div>" +
                    "<div class='col-xs-12 col-sm-8'><span class='col-xs-12' id='grid_item_name'>" + item.item_name + "</span><span class='col-xs-12' style='margin-top:5px;'>Seller: " + item.vendor_name + "</span>" +
                    "<input class='col-xs-4 col-sm-2' type='number' id='item_qty'  style='margin-top:5px;'/><span class='col-xs-6 col-sm-6'style='margin-top:5px;'>" + item.unit + "</span>" +
                    "<span class='col-xs-12 grid_item_price'> <i class='fa fa-inr'></i> <span id='grid_item_total'>" + item.price + "</span></span>"+
                    "<input class='col-xs-12 col-sm-4' type='button' id='item_remove' action='remove' value='REMOVE'/>" +
                  "</div>");
                //htmlTemplate.push("<div><p id='cartproductdetails'><span id='cartitemname'>" + item.item_name + "</span><BR><span id='cartvendor'>Seller: " + item.vendor_name + "</span><BR><span id='cartprice'> Rs. " + item.price + "</span></p></div>");
                $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                $(row).find("[id=item_qty]").val(item.quantity);
                $(row).find("[id=item_qty]").change(function () {
                    if (item.qty_type == "Integer") {
                        item.quantity = parseInt($(row).find("[id=item_qty]").val());
                    }
                    else {
                        item.quantity = parseFloat($(row).find("[id=item_qty]").val());
                    }
                    page.calculate();
                });
                row.on("change", "input[datafield=quantity]", function () {
                    if (item.qty_type == "Integer")
                        $(this).val(parseInt($(this).val()));
                    page.calculate();
                });
            }
            page.controls.grdMyCart.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "remove") {
                    page.controls.grdMyCart.deleteRow(rowId);
                    page.calculate();
                    page.checkCart();
                }
            }
            page.controls.grdMyCart.dataBind([]);

            page.controls.grdMyOrder.width("100%");
            page.controls.grdMyOrder.setTemplate({
                selection: "Single",
                columns: [
                        { 'name': "", 'width': "100%", itemTemplate: "<div  id='imgGrid' style=margin-left:20px;''></div>" },

                ]
            });
            var lastOrderId = "";
            $$("grdMyOrder").rowBound = function (row, item) {
                var htmlTemplate = [];
                htmlTemplate.push("<div class='col-sm-4 col-md-4 col-xs-3 col-lg-4'><img id='track-image' action='imgClick' src='Image/orders.png'/></div>");
                $(row).find("[id=imgGrid]").html(htmlTemplate.join(""));

                htmlTemplate.push("<div class='col-sm-4 col-xs-9'><input action='trackOrder' type='button' id='btnTrackOrder' class='buttonSecondary col-xs-12' title ='TrackOrder' value='Order Id :" + item.order_id + "' /><p id='cartproductdetails'><span class='col-xs-12' id='cartprice'> <i class='fa fa-inr'></i> " + item.total_amount + "</span><span class='col-xs-12' id='ord_date'>Ordered On : " + item.ordered_date + "</span></p></div>");//<span class='col-xs-12' id='cartitemname'>" + item.cust_name + "</span><span class='col-xs-12' id='cartvendor'>Seller: " + item.vendor_name + "</span>
                $(row).find("[id=imgGrid]").html(htmlTemplate.join(""));

                htmlTemplate.push("<div class='col-sm-4 col-xs-9' style='float:right;'><p id='status' class='col-xs-12'><span >" + item.state_text + "</span></p></div>");
                $(row).find("[id=imgGrid]").html(htmlTemplate.join(""));

            }
            page.controls.grdMyOrder.dataBind([]);
            var sortViewData = [];
            sortViewData.push({ view_no: "1", view_name: "Relevant" }, { view_no: "2", view_name: "Item - A To Z" }, { view_no: "3", view_name: "Item - Z To A" }, { view_no: "4", view_name: "Price -  Low To High" }, { view_no: "5", view_name: "Price - High To Low" });
            $$("ddlSystemSort").dataBind(sortViewData, "view_no", "view_name");
            page.advanceItemSearch(true);
            page.advanceMobileItemSearch(true);
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "user_id = " + localStorage.getItem("app_user_id"),
                sort_expression: ""
            }
            page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                if (data.length != 0) {
                    page.cust_no = data[0].cust_no;
                    page.cust_name = data[0].cust_name;
                    page.cust_phone = data[0].phone_no;
                    page.cust_email = data[0].email;
                    page.cust_address = data[0].address1 + "" + data[0].address2 + "" + data[0].city + "" + data[0].state + "" + data[0].zip_code;
                    page.cust_gst = data[0].gst_no;
                }
            });

            $$("ddlSystemSort").selectionChange(function () {
                page.advanceItemSearch(true);
            });
        }


        $("[controlid=txtItemSearch]").keyup(function () {
            page.advanceItemSearch(true);
        });
        page.events.btnAdvaSearchItem_click = function () {
            page.advanceItemSearch(true);
        }
        
        page.advanceItemSearch = function (summary) {
            var data;
            page.getSystemFilterData(function (filter) {
                page.getSortValue(function (sort) {
                    data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "item_name like '%" + $$("txtItemSearch").value() + "%' " + filter + "",
                        sort_expression: sort
                    }
                    page.salesItemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.view.selectedItemDetails(data);
                        $$("lblSearchResult").html("We've got " + data.length + " results");
                        
                        if (summary) {
                            var filter = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "item_name like '%" + $$("txtItemSearch").value() + "%' ",
                                sort_expression: ""
                            }
                            page.itemAPI.getSummary(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                var man_data = [];
                                var prod_data = [];
                                var main_prod_data = [];
                                $(data).each(function (i, item) {
                                    if (item.man_name != null) {
                                        man_data.push({ man_name: item.man_name });
                                    }
                                });
                                $(data).each(function (i, item) {
                                    if (item.ptype_name != null) {
                                        prod_data.push({ ptype_name: item.ptype_name });
                                    }
                                });
                                $(data).each(function (i, item) {
                                    if (item.mpt_name != null) {
                                        main_prod_data.push({ mpt_name: item.mpt_name });
                                    }
                                });
                                //var uniqueManufacture = [];
                                //$.each(man_data, function (i, el) {
                                //    if ($.inArray(el, uniqueManufacture) === -1) uniqueManufacture.push(el);
                                //});
                                page.view.selectedManufactureGrid(removeDuplicateManufacture(man_data));
                                page.view.selectedProductTypeGrid(removeDuplicateProductType(prod_data));
                                page.view.selectedMainProductTypeGrid(removeDuplicateMainProductType(main_prod_data));
                            });
                        }
                    });
                });
            });
        }
        function removeDuplicateManufacture(arr) {
            var obj = {};
            for (var i = 0, len = arr.length; i < len; i++)
                obj[arr[i]['man_name']] = arr[i];

            var result = [];
            for (var key in obj)
                result.push(obj[key]);
            return result;
        }
        function removeDuplicateProductType(arr) {
            var obj = {};
            for (var i = 0, len = arr.length; i < len; i++)
                obj[arr[i]['ptype_name']] = arr[i];

            var result = [];
            for (var key in obj)
                result.push(obj[key]);
            return result;
        }
        function removeDuplicateMainProductType(arr) {
            var obj = {};
            for (var i = 0, len = arr.length; i < len; i++)
                obj[arr[i]['mpt_name']] = arr[i];

            var result = [];
            for (var key in obj)
                result.push(obj[key]);
            return result;
        }
        page.getSystemFilterData = function (callback) {
            var data = "";
            $(page.controls.grdManufactureFilter.getAllRows()).each(function (i, row) {
                if ($(row).find("[id=chkSystemProductType1]").prop("checked")) {
                    if(data == "")
                        data = data + " and man_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                    else
                        data = data + " or man_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                }
            });
            $(page.controls.grdProductTypeFilter.getAllRows()).each(function (i, row) {
                if ($(row).find("[id=chkSystemProductType1]").prop("checked")) {
                    if(data == "")
                        data = data + " and ptype_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                    else
                        data = data + " or ptype_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                }
            });
            $(page.controls.grdMainProductTypeFilter.getAllRows()).each(function (i, row) {
                if ($(row).find("[id=chkSystemProductType1]").prop("checked")) {
                    if (data == "")
                        data = data + " and mpt_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                    else
                        data = data + " or mpt_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                }
            });
            if (data != "")
                data = data;
            callback(data);
        }
        page.getMobileFilterData = function (callback) {
            var data = "";
            $(page.controls.grdManufactureMobileFilter.getAllRows()).each(function (i, row) {
                if ($(row).find("[id=chkSystemProductType1]").prop("checked")) {
                    if(data == "")
                        data = data + " and man_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                    else
                        data = data + " or man_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                }
            });
            $(page.controls.grdProductTypeMobileFilter.getAllRows()).each(function (i, row) {
                if ($(row).find("[id=chkSystemProductType1]").prop("checked")) {
                    if(data == "")
                        data = data + " and ptype_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                    else
                        data = data + " or ptype_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                }
            });
            $(page.controls.grdMainProductTypeMobileFilter.getAllRows()).each(function (i, row) {
                if ($(row).find("[id=chkSystemProductType1]").prop("checked")) {
                    if(data == "")
                        data = data + " and mpt_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                    else
                        data = data + " or mpt_name like '%" + $(row).find("[id=lblProductType]").html() + "%'";
                }
            });
            callback(data);
        }
        page.getSortValue = function(callback){
            var data = "";
            if ($$("ddlSystemSort").selectedValue() == "1")
                data = "";
            if ($$("ddlSystemSort").selectedValue() == "2")
                data = "item_name asc";
            if ($$("ddlSystemSort").selectedValue() == "3")
                data = "item_name desc";
            if ($$("ddlSystemSort").selectedValue() == "4")
                data = "price asc";
            if ($$("ddlSystemSort").selectedValue() == "5")
                data = "price desc";
            callback(data);
        }
        page.showProductDetails = function (data) {
            $$("pnlSearchDetail").hide();
            $$("pnlProductDetail").show();
            page.controls.pnlMyCart.hide();
            page.controls.pnlMyOrder.hide();
            page.controls.grdProductDetail.dataBind([]);
            page.controls.grdProductDetail.createRow(data);
        }
        page.events.btnTrackOrder_click = function () {
            page.salesService.getCustomerPortal(page.cust_no, function (data, callback) {
                page.controls.grdMyOrder.dataBind(data);
            });
        }
        page.events.btnMyOrder_click = function () {
            $$("pnlSearchDetail").hide();
            page.controls.pnlMyOrder.show();
            $$("pnlProductDetail").hide();
            page.controls.pnlMyCart.hide();
            page.events.btnTrackOrder_click();
        }
        page.events.btnCart_click = function () {
            page.controls.pnlMyCart.show();
            $$("pnlSearchDetail").hide();
            $$("pnlProductDetail").hide();
            page.controls.pnlMyOrder.hide();
            page.checkCart();
        }
        page.checkCart = function () {
            if ($$("grdMyCart").allData().length == 0) {
                $$("pnlEmptyCart").show();
                $$("pnlCartTopRow").hide();
                $$("right-cart").hide();
                $$("btnBuyNow").hide();
            }
            else {
                $$("pnlEmptyCart").hide();
                $$("pnlCartTopRow").show();
                $$("right-cart").show();
                $$("btnBuyNow").show();
            }
        }
        page.events.btnBuyNow_click = function () {
            if (page.controls.grdMyCart.allData().length == 0)
                alert("Your cart is empty...!");
            else {
                //$$("msgPanel").hide();
                var SOData = {
                    cust_no: page.cust_no,
                    ordered_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    status: "906",
                    expected_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    confirm_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    shipping_address: page.cust_address,
                    delivery_address: page.cust_address,
                    contact_no: page.cust_phone,
                    email: page.cust_email,
                    company: "",
                    sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                }
                page.salesService.createSalesOrder(SOData, function (data) {
                    page.order_id=data[0].key_value;
                    var rsoItems = [];
                    var rbillItems = [];
                    $(page.controls.grdMyCart.allData()).each(function (i, item) {
                        rsoItems.push({
                            order_id: page.order_id,
                            quantity: item.quantity,
                            price: item.price,
                            discount: item.discount,
                            tax_per: item.tax_per,
                            total_price: item.total_price,
                            tax_class_no: item.tax_class_no,
                            sales_tax_class_no: CONTEXT.DEFAULT_SALES_TAX,
                            unit: item.unit,
                            free_qty: item.free_qty,
                            hsn_code: item.hsn_code,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            unit_identity: item.unit_identity,
                            var_no: item.var_no
                        });
                        rbillItems.push({
                            var_no: item.var_no,
                            bill_item_qty: (item.qty_type == "Integer") ? parseInt(item.bill_item_qty) : parseFloat(item.bill_item_qty),
                            qty: (item.qty_type == "Integer") ? parseInt(item.quantity) : parseFloat(item.quantity),
                            free_qty: item.free_qty,
                            unit_identity: item.unit_identity,
                            price: item.price,
                            discount: item.discount,
                            taxable_value: ((parseFloat(item.item_sub_total) - parseFloat(item.discount)) * parseFloat(item.tax_per)) / 100,
                            tax_per: item.tax_per,
                            total_price: item.total_price,
                            price_no: item.price_no,
                            bill_type: "Sale",
                            tax_class_no: item.tax_class_no,
                            sub_total: parseFloat(item.item_sub_total),

                            hsn_code: item.hsn_code,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            tray_received: (item.tray_received == null || item.tray_received == "" || typeof item.tray_received == "undefined") ? "0" : item.tray_received,
                            cost: item.cost,
                            amount: parseFloat(item.cost) * parseFloat(item.quantity),

                            executive_id: (item.executive_id == "") ? "-1" : item.executive_id
                        });
                    });
                    page.salesService.insertSalesOrderItems(0, rsoItems, function () {
                        var newBill = {
                            so_no: page.order_id,
                            bill_no: "0",
                            bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            store_no: localStorage.getItem("user_store_no"),
                            user_no: localStorage.getItem("app_user_id"),
                            reg_no: localStorage.getItem("user_register_id"),

                            sub_total: page.controls.lblSubTotal.value(),
                            total: page.controls.lblTotal.value(),
                            discount: page.controls.lblDiscount.value(),
                            tax: page.controls.lblTax.value(),

                            bill_type: "Sale",
                            state_no: 200,
                            round_off: "0",
                            sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                            cust_no: page.cust_no,
                            cust_name: page.cust_name,
                            mobile_no: page.cust_phone,
                            email_id: page.cust_email,
                            cust_address: page.cust_address,
                            gst_no: page.cust_gst,
                            bill_no_par: "",
                            sales_executive: "-1",
                        };
                        newBill.bill_items = rbillItems;
                        newBill.discounts = page.discount;
                        var expense = [];
                        newBill.expenses = expense;
                        page.stockAPI.insertBill(newBill, function (billNo) {
                            page.currentBillNo = billNo;
                            page.salesService.updateBillNo({ order_id: page.order_id, bill_no: page.currentBillNo }, function () {
                                var buying_cost = 0;
                                $(page.controls.grdMyCart.allData()).each(function (i, item) {
                                    buying_cost = buying_cost + (parseFloat(item.cost) * (parseFloat(item.quantity) + parseFloat(item.free_qty)));
                                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                                        var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));// - parseFloat(page.controls.lblRndOff.value());
                                        var data1 = {
                                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                                            description: "Sales Order-" + page.currentBillNo,
                                            sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                                            tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                                            buying_cost: buying_cost,
                                            round_off: "0",
                                            key_1: page.currentBillNo,
                                            key_2: page.cust_no,
                                        };
                                        page.finfactsEntry.creditSales(data1, function (response) {
                                            alert("Order Saved Successfully");
                                            page.events.btnShowProductList_click();
                                        });
                                    }
                                })
                            });
                        });
                    });
                });
            }
        }
        
        page.clearCart = function () {
            page.controls.lblSubTotal.value('');
            page.controls.lblDiscount.value('');
            page.controls.lblTax.value('');
            page.controls.lblTotal.value('');
            page.controls.grdMyCart.dataBind([]);
        }
        
        page.addProductsToCart = function (item) {
            page.discount_flag = false;
            if (item != null) {
                $(item).each(function (i, item) {
                    if (typeof item.item_no != "undefined") {

                        if (item.price != null) {

                            page.itemService.getItemDiscountAutocomplete(item.item_no, function (data1) {
                                page.taxclassService.getTaxByItem(page.sales_tax_no, item.tax_class_no, function (taxData) {
                                    if (data1 != '' && data1 != undefined) {
                                        discountVal = data1[0].disc_value;
                                        page.discount.push({
                                            disc_no: data1[0].disc_no,
                                            disc_type: data1[0].disc_type,
                                            disc_name: data1[0].disc_name,
                                            disc_value: discountVal,
                                            item_no: item.item_no
                                        });
                                    }

                                    var newitem = {
                                        item_no: item.item_no,
                                        item_name: item.item_name,
                                        image_name: item.image_name,
                                        batch_no: item.batch_no,
                                        man_date: item.man_date,
                                        expiry_date: item.expiry_date,
                                        qty_stock: item.qty_stock,
                                        cost: (item.tax_inclusive == "0") ? item.price : parseFloat(parseFloat(item.price) / ((100 + parseFloat(item.tax)) / 100)).toFixed(4),
                                        qty_const: item.qty_stock,
                                        mrp: item.mrp,
                                        order_id: page.so_order_id,
                                        discount: item.discount,
                                        tax: taxData[0].tax,
                                        tax_class_no: item.tax_class_no,
                                        temp_qty: 1,
                                        quantity: 1,
                                        free_qty: 0,
                                        fullfilled: 0,
                                        price: item.price,
                                        temp_price: item.price,
                                        alter_price_1: item.alter_price_1,
                                        alter_price_2: item.alter_price_2,
                                        tray_id: item.tray_no,
                                        tray_count: 0,
                                        unit: item.unit,
                                        tofullfilled: 1,
                                        todelivered: 1,
                                        total_price: item.price * 1 + item.tax * item.price * 1,
                                        cost: item.cost == null ? 0 : item.cost,
                                        tax_inclusive: item.tax_inclusive,
                                        variation_name: item.variation_name,
                                        hsn_code: item.hsn_code,
                                        cgst: (taxData[0].cgst == null) ? 0 : taxData[0].cgst,
                                        sgst: (taxData[0].sgst == null) ? 0 : taxData[0].sgst,
                                        igst: (taxData[0].igst == null) ? 0 : taxData[0].igst,
                                        tax_per: taxData[0].tax,
                                        alter_unit: item.alter_unit,
                                        alter_unit_fact: item.alter_unit_fact,
                                        unit_identity: 0,
                                        state_text: "Created",
                                        var_no: item.var_no,
                                        price_no: item.price_no == null ? "0" : item.price_no,
                                        expiry_alert_days: item.expiry_alert_days,
                                        rack_no: item.rack_no,
                                        discount_inclusive: item.discount_inclusive
                                    };
                                    var rows = page.controls.grdMyCart.getRow({
                                        variation_name: newitem.variation_name
                                    });


                                    if (rows.length == 0) {
                                        page.controls.grdMyCart.createRow(newitem);
                                        page.controls.grdMyCart.edit(true);
                                        rows = page.controls.grdMyCart.getRow({
                                            variation_name: newitem.variation_name
                                        });
                                        rows[0].find("[datafield=temp_qty]").find("input").focus();
                                    } else {
                                        var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                        txtQty.val(parseInt(txtQty.val()) + 1);
                                        txtQty.trigger('change');
                                        txtQty.focus();
                                    }
                                    page.calculate();
                                });
                            });

                                page.calculate();


                        } else {
                            alert("No price is defined for item:" + item.item_name);
                        }


                    }
                });
            }
        }
        page.addProductsToCartCallback = function (item,callback) {
            page.discount_flag = false;
            if (item != null) {
                $(item).each(function (i, item) {
                    if (typeof item.item_no != "undefined") {
                        if (item.price != null) {
                            page.itemService.getItemDiscountAutocomplete(item.item_no, function (data1) {
                                page.taxclassService.getTaxByItem(page.sales_tax_no, item.tax_class_no, function (taxData) {
                                    if (data1 != '' && data1 != undefined) {
                                        discountVal = data1[0].disc_value;
                                        page.discount.push({
                                            disc_no: data1[0].disc_no,
                                            disc_type: data1[0].disc_type,
                                            disc_name: data1[0].disc_name,
                                            disc_value: discountVal,
                                            item_no: item.item_no
                                        });
                                    }
                                    var newitem = {
                                        item_no: item.item_no,
                                        item_name: item.item_name,
                                        image_name: item.image_name,
                                        batch_no: item.batch_no,
                                        man_date: item.man_date,
                                        expiry_date: item.expiry_date,
                                        qty_stock: item.qty_stock,
                                        cost: (item.tax_inclusive == "0") ? item.price : parseFloat(parseFloat(item.price) / ((100 + parseFloat(item.tax)) / 100)).toFixed(4),
                                        qty_const: item.qty_stock,
                                        mrp: item.mrp,
                                        order_id: page.so_order_id,
                                        discount: item.discount,
                                        tax: taxData[0].tax,
                                        tax_class_no: item.tax_class_no,
                                        temp_qty: 1,
                                        quantity: 1,
                                        free_qty: 0,
                                        fullfilled: 0,
                                        price: item.price,
                                        temp_price: item.price,
                                        alter_price_1: item.alter_price_1,
                                        alter_price_2: item.alter_price_2,
                                        tray_id: item.tray_no,
                                        tray_count: 0,
                                        unit: item.unit,
                                        tofullfilled: 1,
                                        todelivered: 1,
                                        total_price: item.price * 1 + item.tax * item.price * 1,
                                        cost: item.cost == null ? 0 : item.cost,
                                        tax_inclusive: item.tax_inclusive,
                                        variation_name: item.variation_name,
                                        hsn_code: item.hsn_code,
                                        cgst: (taxData[0].cgst == null) ? 0 : taxData[0].cgst,
                                        sgst: (taxData[0].sgst == null) ? 0 : taxData[0].sgst,
                                        igst: (taxData[0].igst == null) ? 0 : taxData[0].igst,
                                        tax_per: taxData[0].tax,
                                        alter_unit: item.alter_unit,
                                        alter_unit_fact: item.alter_unit_fact,
                                        unit_identity: 0,
                                        state_text: "Created",
                                        var_no: item.var_no,
                                        price_no: item.price_no == null ? "0" : item.price_no,
                                        expiry_alert_days: item.expiry_alert_days,
                                        rack_no: item.rack_no,
                                        discount_inclusive: item.discount_inclusive
                                    };
                                    var rows = page.controls.grdMyCart.getRow({
                                        variation_name: newitem.variation_name
                                    });
                                    if (rows.length == 0) {
                                        page.controls.grdMyCart.createRow(newitem);
                                        page.controls.grdMyCart.edit(true);
                                        rows = page.controls.grdMyCart.getRow({
                                            variation_name: newitem.variation_name
                                        });
                                        rows[0].find("[datafield=temp_qty]").find("input").focus();
                                    } else {
                                        var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                        txtQty.val(parseInt(txtQty.val()) + 1);
                                        txtQty.trigger('change');
                                        txtQty.focus();
                                    }
                                    page.calculate();
                                    callback(item);
                                });
                            });
                            page.calculate();
                            callback(item);
                        } else {
                            alert("No price is defined for item:" + item.item_name);
                            callback([]);
                        }
                    }
                });
            }
            else {
                callback([]);
            }
        }
        page.calculate = function () {
            //page.controls.grdDiscount.dataBind(page.discount);
            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;
            $(page.controls.grdMyCart.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdMyCart.getRowData(row);
                var item_no = parseInt($(row).find("[datafield=item_no]").find("div").html());
                var price = parseFloat($(row).find("[datafield=price]").find("div").html()).toFixed(2);
                var alldata = page.controls.grdMyCart.allData();
                var qty;
                $(alldata).each(function (index, item) {
                    if (i == index) {
                        if (item.qty_type == "Integer")
                            qty = parseInt(item.quantity);
                        else
                            qty = parseFloat(item.quantity);
                    }
                });
                var discount_inclusive = parseInt($(row).find("[datafield=discount_inclusive]").find("div").html());
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var txtDiscount = $(row).find("[datafield=discount]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());
                if (isNaN(qty)) {
                    qty = 1;
                }
                page.billService.getSalesTaxClass(CONTEXT.DEFAULT_SALES_TAX, function (data) {
                    page.sales_tax = data;
                });
                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.sales_tax).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = item.tax_per;
                        }
                    });
                    return rdata;
                }
                function getTaxIgst(tax_class_no) {
                    var rdata = 0;
                    $(page.sales_tax).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = item.igst;
                        }
                    });
                    return rdata;
                }
                var tax = getTaxPercent(tax_class_no);
                var isgt = getTaxIgst(tax_class_no);

                var billdiscountval = 0;
                var billdiscountper = 0;
                var discount = 0;
                var discount_val = 0;
                var disc_price;

                $(page.discount).each(function (j, data) {
                    //if discount typ is item -> add to item disc
                    if (data.item_no == item_no) {
                        if (data.disc_type == "Fixed")
                            discount = discount + data.disc_value * qty;
                        else if (data.disc_type == "Percent") {
                            discount = discount + ((price * qty) * data.disc_value / 100);
                        }

                    }
                });


                tot_discount = tot_discount + discount;
                price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                var qty_price = (price * qty);
                sub_total = sub_total + qty_price;
                var tax_amount = (qty_price * tax / 100);
                tot_sales_tax = tot_sales_tax + tax_amount;
                var amount = qty_price + tax_amount;
                billItem.item_sub_total = qty_price;

                txtTax.html(tax + "%");
                txtDiscount.html(parseFloat(discount));
                txtAmount.html(parseFloat(amount).toFixed(5));

                var currentData = page.controls.grdMyCart.getRowData(row); //set the grid value
                currentData.tax_per = tax;
                currentData.discount = discount;
                currentData.total_price = amount;
                currentData.disc_no = page.discount.disc_no;
                if (page.discount_flag == true)
                    currentData.disc_no = page.discount.disc_no;
                else
                    currentData.disc_no = parseInt(0);

                $(row).find("[id=grid_item_total]").html(qty_price);
            });

            page.controls.lblSubTotal.value(parseFloat(parseFloat(sub_total) + parseFloat(tot_discount)).toFixed(5));

            var billdiscountval = 0;
            var billdiscountper = 0
            $(page.discount).each(function (j, data) {

                //if discount typ is bill -> add to bill disc
                if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {


                    if (data.disc_type == "Fixed")
                        billdiscountval = billdiscountval + parseFloat(data.disc_value);
                    else if (data.disc_type == "Percent") {
                        billdiscountval = billdiscountval + (parseFloat(page.lbl_total) * data.disc_value / 100);
                    }

                }
            });

            tot_discount = tot_discount + billdiscountval;
            total = sub_total + tot_sales_tax - tot_discount;

            var data = page.controls.grdMyCart.allData();

            page.controls.lblDiscount.value(parseInt(tot_discount));
            page.controls.lblTax.value(parseFloat(tot_sales_tax).toFixed(2));
            page.controls.lblTotal.value(parseFloat(total).toFixed(2));
            
        }
        
        page.events.btnSort_click = function () {
            page.controls.pnlSortPopup.open();
            page.controls.pnlSortPopup.title("Sort Details");
            page.controls.pnlSortPopup.width("100%");
            page.controls.pnlSortPopup.height(350);
            $$("rdioMobileSort0").prop('checked', true);
            $("#lblMobileSort0").focus();
        }
        page.events.btnSortPopup_click = function () {
            page.controls.pnlSortPopup.close();
            page.advanceMobileItemSearch(true);
        }
        page.events.btnSortCancelPopup_click = function () {
            page.controls.pnlSortPopup.close();
        }
        page.events.btnFilters_click = function () {
            page.controls.pnlFiltersPopup.open();
            page.controls.pnlFiltersPopup.title("Filters Details");
            page.controls.pnlFiltersPopup.width("100%");
            page.controls.pnlFiltersPopup.height(265);
        }
        page.events.btnFiltersPopup_click = function () {
            page.controls.pnlFiltersPopup.close();
            page.advanceMobileItemSearch(true);
        }
        page.events.btnFiltersCancelPopup_click = function () {
            page.controls.pnlFiltersPopup.close();
        }
        page.advanceMobileItemSearch = function (summary) {
            var prodTypeList = [];
            var data;
            page.getMobileFilterData(function (filter) {
                page.getMobileSortValue(function (sort) {
                    data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "item_name like '%" + $$("txtItemSearch").value() + "%' " + filter + "",
                        sort_expression: sort
                    }
                    page.salesItemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        page.view.selectedItemDetails(data);
                        $$("lblSearchResult").html("We've got " + data.length + " results");
                        
                        if (summary) {
                            var filter = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: "item_name like '%" + $$("txtItemSearch").value() + "%' ",
                                sort_expression: ""
                            }
                            page.itemAPI.getSummary(filter.start_record, filter.end_record, filter.filter_expression, filter.sort_expression, function (data) {
                                var man_data = [];
                                var prod_data = [];
                                var main_prod_data = [];
                                $(data).each(function (i, item) {
                                    if (item.man_name != null) {
                                        man_data.push({ man_name: item.man_name });
                                    }
                                });
                                $(data).each(function (i, item) {
                                    if (item.ptype_name != null) {
                                        prod_data.push({ ptype_name: item.ptype_name });
                                    }
                                });
                                $(data).each(function (i, item) {
                                    if (item.mpt_name != null) {
                                        main_prod_data.push({ mpt_name: item.mpt_name });
                                    }
                                });
                                page.view.selectedManufactureMobileGrid(removeDuplicateManufacture(man_data));
                                page.view.selectedProductTypeMobileGrid(removeDuplicateProductType(prod_data));
                                page.view.selectedMainProductTypeMobileGrid(removeDuplicateMainProductType(main_prod_data));
                            });
                        }
                    });
                });
            });
        }
        page.getMobileSortValue = function (callback) {
            var data = "";
            if ($$("rdioMobileSort1").prop("checked"))
                data = "item_name asc";
            if ($$("rdioMobileSort2").prop("checked"))
                data = "item_name desc";
            if ($$("rdioMobileSort3").prop("checked"))
                data = "price asc";
            if ($$("rdioMobileSort4").prop("checked"))
                data = "price desc";
            callback(data);
        }
        page.events.btnShowProductList_click = function () {
            $$("pnlProductDetail").hide();
            page.controls.pnlMyCart.hide();
            page.controls.pnlMyOrder.hide();
            $$("pnlSearchDetail").show();
        }


        page.view = {
            selectedItemDetails: function(data){
                page.controls.grdAdvSearchItem.width("100%");
                page.controls.grdAdvSearchItem.height("500px");
                page.controls.grdAdvSearchItem.setTemplate({
                    selection: "Single", paging: "LoadMore", pageSize: 25,
                    columns: [
                            { 'name': "", 'dataField': "item_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdAdvSearchItem").rowBound = function (row, item) {
                    if (item.image_name == "" || item.image_name == null || item.image_name == undefined) {
                        if (item.disc_value == null || typeof item.disc_value == "undefined") {
                            if (item.qty_stock <= 0) {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='Image/no-image.png'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> OUT OF STOCK </span>" +
                                "</div>")
                            }
                            else if (item.qty_stock <= 10) {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='Image/no-image.png'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> Only " + item.qty_stock + " Stock Left </span>" +
                                "</div>")
                            }
                            else {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='Image/no-image.png'/><div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' /></div>")
                            }
                        }
                        else if (item.disc_type == "Percent") {
                            if (item.qty_stock <= 0) {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='Image/no-image.png'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<span class='col-xs-12'>Offer " + item.disc_value + "%</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> OUT OF STOCK </span>" +
                                "</div>")
                            }
                            else if (item.qty_stock <= 10) {
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='Image/no-image.png'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<span class='col-xs-12'>Offer " + item.disc_value + "%</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> Only " + item.qty_stock + " Stock Left </span>" +
                                "</div>")
                            }
                            else {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='Image/no-image.png'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12'>Offer " + item.disc_value + "%</span>" +
                                "</div>")
                            }
                        }
                    }
                    else {
                        if (item.disc_value == null || typeof item.disc_value == "undefined") {
                            if (item.qty_stock <= 0) {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> OUT OF STOCK </span>" +
                                "</div>")
                            }
                            else if (item.qty_stock <= 10) {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> Only " + item.qty_stock + " Stock Left </span>" +
                                "</div>")
                            }
                            else {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' /></div>")
                            }
                        }
                        else if (item.disc_type == "Percent") {
                            if (item.qty_stock <= 0) {
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<span class='col-xs-12'>Offer " + item.disc_value + "%</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> OUT OF STOCK </span>" +
                                "</div>")
                            }
                            else if (item.qty_stock <= 10) {
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<span class='col-xs-12'>Offer " + item.disc_value + "%</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12' id='stock'> Only " + item.qty_stock + " Stock Left </span>" +
                                "</div>")
                            }
                            else {
                                var htmlTemplate = [];
                                var htmlTemplate = [];
                                htmlTemplate.push("<div class='image-frame'><div><img class='grid-first-image' action='imgClick' src='" + CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + item.item_no + '/' + item.image_name + "'/></div></div>" +
                                "<div class='col-xs-12'><span class='col-xs-12' id='itemname' action='itemclick' >" + item.item_name + "</span>" +
                                "<span class='col-xs-12' id='price'> Rs. " + item.price + "</span>" +
                                "<input type='button' id='btnAddCart' controlid='btnAddCart' control='customerPortal.secondaryButton' class='grid-button col-xs-12' value='Add To Cart' action='add_to_cart' />" +
                                "<span class='col-xs-12'>Offer " + item.disc_value + "%</span>" +
                                "</div>")
                            }
                        }
                    }
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));

                    $(row).find("img[action=imgClick]").click(function () {
                        page.showProductDetails(item);
                    });
                    $(row).find("span[action=itemclick]").click(function () {
                        page.showProductDetails(item);
                    });
                    $(row).find("input[action=add_to_cart]").click(function () {
                        page.addProductsToCart(item);
                        //$$("msgPanel").flash("Product added to cart successfully view Cart to buy now...!");
                    });

                    page.calculate();
                }
                page.controls.grdAdvSearchItem.dataBind(data);
            },
            selectedManufactureGrid: function (data) {
                page.controls.grdManufactureFilter.width("100%");
                page.controls.grdManufactureFilter.height("auto");
                page.controls.grdManufactureFilter.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "", 'dataField': "man_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdManufactureFilter").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<span class='col-sm-12'><input type='checkbox' controlId='chkSystemProductType1' id='chkSystemProductType1' name='product_type'><span id='lblProductType' class='checkBoxLabel'>" + item.man_name + "</span></span>")
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));
                    $(row).find("[id=chkSystemProductType1]").change(function () {
                        page.advanceItemSearch(false);
                    });
                };
                $$("grdManufactureFilter").dataBind(data);
            },
            selectedProductTypeGrid: function (data) {
                page.controls.grdProductTypeFilter.width("100%");
                page.controls.grdProductTypeFilter.height("auto");
                page.controls.grdProductTypeFilter.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "", 'dataField': "ptype_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdProductTypeFilter").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<span class='col-sm-12'><input type='checkbox' controlId='chkSystemProductType1' id='chkSystemProductType1' name='product_type'><span id='lblProductType' class='checkBoxLabel'>" + item.ptype_name + "</span></span>")
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));
                    $(row).find("[id=chkSystemProductType1]").change(function () {
                        page.advanceItemSearch(false);
                    });
                };
                $$("grdProductTypeFilter").dataBind(data);
            },
            selectedMainProductTypeGrid: function (data) {
                page.controls.grdMainProductTypeFilter.width("100%");
                page.controls.grdMainProductTypeFilter.height("auto");
                page.controls.grdMainProductTypeFilter.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "", 'dataField': "main_ptype_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdMainProductTypeFilter").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<span class='col-sm-12'><input type='checkbox' controlId='chkSystemProductType1' id='chkSystemProductType1' name='product_type'><span id='lblProductType' class='checkBoxLabel'>" + item.mpt_name + "</span></span>")
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));
                    $(row).find("[id=chkSystemProductType1]").change(function () {
                        page.advanceItemSearch(false);
                    });
                };
                $$("grdMainProductTypeFilter").dataBind(data);
            },
            selectedManufactureMobileGrid: function (data) {
                page.controls.grdManufactureMobileFilter.width("100%");
                page.controls.grdManufactureMobileFilter.height("auto");
                page.controls.grdManufactureMobileFilter.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "", 'dataField': "man_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdManufactureMobileFilter").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<span class='col-sm-12'><input type='checkbox' controlId='chkSystemProductType1' id='chkSystemProductType1' name='product_type'><span id='lblProductType' class='checkBoxLabel'>" + item.man_name + "</span></span>")
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));
                    $(row).find("[id=chkSystemProductType1]").change(function () {
                        page.advanceMobileItemSearch(false);
                    });
                };
                $$("grdManufactureMobileFilter").dataBind(data);
            },
            selectedProductTypeMobileGrid: function (data) {
                page.controls.grdProductTypeMobileFilter.width("100%");
                page.controls.grdProductTypeMobileFilter.height("auto");
                page.controls.grdProductTypeMobileFilter.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "", 'dataField': "ptype_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdProductTypeMobileFilter").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<span class='col-sm-12'><input type='checkbox' controlId='chkSystemProductType1' id='chkSystemProductType1' name='product_type'><span id='lblProductType' class='checkBoxLabel'>" + item.ptype_name + "</span></span>")
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));
                    $(row).find("[id=chkSystemProductType1]").change(function () {
                        page.advanceMobileItemSearch(false);
                    });
                };
                $$("grdProductTypeMobileFilter").dataBind(data);
            },
            selectedMainProductTypeMobileGrid: function (data) {
                page.controls.grdMainProductTypeMobileFilter.width("100%");
                page.controls.grdMainProductTypeMobileFilter.height("auto");
                page.controls.grdMainProductTypeMobileFilter.setTemplate({
                    selection: "Single",
                    columns: [
                            { 'name': "", 'dataField': "main_ptype_no", itemTemplate: "<div  id='imgDetailGrid' style></div>" }
                    ]
                });
                $$("grdMainProductTypeMobileFilter").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<span class='col-sm-12'><input type='checkbox' controlId='chkSystemProductType1' id='chkSystemProductType1' name='product_type'><span id='lblProductType' class='checkBoxLabel'>" + item.mpt_name + "</span></span>")
                    $(row).find("[id=imgDetailGrid]").html(htmlTemplate.join(""));
                    $(row).find("[id=chkSystemProductType1]").change(function () {
                        page.advanceMobileItemSearch(false);
                    });
                };
                $$("grdMainProductTypeMobileFilter").dataBind(data);
            }

        }
    });
}