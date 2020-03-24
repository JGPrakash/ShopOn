$.fn.barcodePrint = function () {
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + '/shopon/view/barcode-print/barcode-print.html');
        page.stockReportAPI = new StockReportAPI();

        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.itemAPI = new ItemAPI();
        page.variationAPI = new VariationAPI();

        var typeData = [];

        var inputs = $(':input').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });

        page.events.page_load = function () {
            $$("ddlType").selectionChange(function () {
                $$("txtValue").selectedObject.val("");
                $("#txtValue").css("placeholder", "Select");
                if ($$("ddlType").selectedValue() != "1") {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    if ($$("ddlType").selectedValue() == "2") {
                        $("#txtValue").css("placeholder", "Main Product Type");
                        data.filter_expression = "concat(ifnull(mpt_no,''),ifnull(mpt_name,'')) like '%%'";
                        page.mainproducttypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                    if ($$("ddlType").selectedValue() == "3") {
                        $("#txtValue").css("placeholder", "Product Type");
                        data.filter_expression = "concat(ifnull(ptt.ptype_no,''),ifnull(ptt.ptype_name,'')) like '%%'";
                        page.productTypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                    if ($$("ddlType").selectedValue() == "4") {
                        $("#txtValue").css("placeholder", "Item Name");
                        data.filter_expression = "(concat(item_no,item_name,ifnull(barcode,true)) like '%%' or item_name like '%%')";
                        page.itemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                    if ($$("ddlType").selectedValue() == "5") {
                        $("#txtValue").css("placeholder", "Variation Name");
                        data.filter_expression = "";
                        page.variationAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                }
            });
            page.controls.txtValue.dataBind({
                getData: function (term, callback) {
                    callback(typeData);
                }
            });

            $("[controlid=txtBillNo]").bind("keypress", function (e) {
                $$("txtInvoiceNo").val("");
            });
            $("[controlid=txtInvoiceNo]").bind("keypress", function (e) {
                $$("txtBillNo").val("");
            });
        }

        page.interface.load = function (bill) {

            
        }
        page.interface.select = function () {
            //Clear All The Fields Data
            $$("txtBillNo").val("");
            $$("txtInvoiceNo").val("");
            $$("ddlType").selectedValue("1");
            $$("txtValue").selectedObject.val("");
            $$("ddlStock").selectedValue("1");
            page.view.selectedBarcode([]);
        }
        page.events.btnSearchStock_click = function () {
            var bill_code = "";
            if ($$("txtBillNo").val() != "") {
                bill_code = ($$("txtBillNo").val().indexOf('-') > -1) ? true : false;
                if (bill_code) {
                    bill_code = $$("txtBillNo").val();
                }
                else {
                    var today = new Date();
                    bill_code = today.getFullYear() + "" + (today.getMonth() + 1) + "-" + $$("txtBillNo").value();
                }
            }
            
            var filter = {
                viewMode: "Stock",
                bill_no: "",
                bill_code: bill_code,
                invoice_no: $$("txtInvoiceNo").val(),
                po_no: $$("txtPoNo").val(),
                type: ($$("ddlType").selectedValue() == "1") ? "" : $$("ddlType").selectedValue(),
                value: ($$("txtValue").selectedValue() == null) ? "" : $$("txtValue").selectedValue(),
                stock: ($$("ddlStock").selectedValue() == "1") ? "" : $$("ddlStock").selectedValue(),
                store_no: localStorage.getItem("user_store_no")
            }
            page.stockReportAPI.stockReport(filter, function (data) {
                page.view.selectedBarcode(data);
            });
        }
        page.events.btnPrintBarcode_click = function () {
            $(page.controls.grdBarcodePrint.selectedData()).each(function (i, item) {
                if (!$$("chkPrintItemBarcode").prop("checked"))
                    item.barcode = null;
                var data = {
                    printRow: $$("ddlBillPrintCount").selectedValue(),
                    printCount: item.printCount,
                    item_name: item.item_name,
                    item_no: item.item_no,
                    barcode:item.barcode,
                    var_no: item.var_no,
                    stock_no: item.stock_no,
                    sku_no: item.sku_no,
                    selling_price: item.selling_price,
                    product_type: (item.ptype_name == null || typeof item.ptype_name == "undefined") ? "" : item.ptype_name,
                    size: "",
                    bill_no: item.bill_code,
                    vendor_name: item.vendor_name
                }
                printStockBarcode(data);
            });
        }
        page.view = {
            selectedBarcode: function (data) {
                page.controls.grdBarcodePrint.width("100%");
                //if ($$("chkPrintItemBarcode").prop("checked"))
                //    page.controls.grdBarcodePrint.width("110%");
                page.controls.grdBarcodePrint.height("250px");
                page.controls.grdBarcodePrint.setTemplate({
                    selection: "Multiple", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "MPT", 'rlabel': 'MPT', 'width': "130px", 'dataField': "mpt_name" },
                        { 'name': "PT", 'rlabel': 'PT', 'width': "130px", 'dataField': "ptype_name" },
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", "visible": false },
                        { 'name': "", 'rlabel': '', 'width': "0px", 'dataField': "var_no", "visible": false },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name" },
                        { 'name': "Item Barcode", 'rlabel': 'Item Barcode', 'width': "120px", 'dataField': "barcode", visible: $$("chkPrintItemBarcode").prop("checked") },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "80px", 'dataField': "variation_name", visible: false },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "80px", 'dataField': "bill_code", visible: false },
                        { 'name': "Price", 'rlabel': 'Price', 'width': "100px", 'dataField': "selling_price" },
                        { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "130px", 'dataField': "vendor_name" },
                        { 'name': "Cost", 'rlabel': 'Cost', 'width': "100px", 'dataField': "avg_buying_cost" },
                        { 'name': "SKU", 'rlabel': 'SKU', 'width': "90px", 'dataField': "sku_no" },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "90px", 'dataField': "qty" },
                        { 'name': "No Of Print", 'rlabel': 'No Of Print', 'width': "90px", 'dataField': "printCount", editable: true },
                    ]
                });
                page.controls.grdBarcodePrint.dataBind(data);
                page.controls.grdBarcodePrint.edit(true);
            }
        }
    });
}