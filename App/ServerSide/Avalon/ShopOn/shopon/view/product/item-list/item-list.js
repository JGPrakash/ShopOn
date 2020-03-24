var detail_page = null;
var global_attr_list = [];
var global_isVarSet = false;
var global_item_stock = 0, item_level_stock =0,main_grid_height = "65vh";
$.fn.itemList = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        //Import services required.
        page.controlName = "itemList";
        page.itemService = new ItemService();
        page.stockService = new StockService();
        page.inventoryService = new InventoryService();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.manufactureAPI = new ManufactureAPI();
        page.settingApi = new SettingsAPI();
        page.printCount= null;
        page.stockAPI = new StockAPI();
        page.itemAPI = new ItemAPI();
        page.uploadAPI = new UploadAPI();
        page.itemPriceAPI = new ItemPriceAPI();
        page.vendorAPI = new VendorAPI();
        page.itemTrayAPI = new ItemTrayAPI();
        page.maximumIdAPI = new MaximumIdAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.itemVariationAPI = new ItemVariationAPI();
        page.itemSKUAPI = new ItemSKUAPI();
        
        page.item_count = 0;
        
        document.title = "ShopOn - Product";
        $("body").keydown(function (e) {
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewItem_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSaveItem_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnRemove_click();
            }
        });

        function confirmManualDisc() {
            var defer = $.Deferred();

            $("#dialog-form").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#manualcount");
                        //Do your code here
                        page.printCount = text1.val();
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

        e.page_load = function () {


            $(".detail-tab-action").hide();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            $$("btnPrintBarcode").hide();
            //$("#iremove").hide();
            $('#iremove1').hide();
              //  $("#idownloadeShopon").hide();
               // $$("btnDownloadEshopon").hide();
               // $("#iuploadEShopon").hide();
               // $$("btnUploadEshopon").hide();
            $$("btnPrintQRcode").hide();
            (CONTEXT.ENABLE_SECONDARY_LANGUAGE) ? $$("btnLanguage").selectedObject.show() : $$("btnLanguage").selectedObject.hide();
            (CONTEXT.PACKAGE) ? $$("btnPackage").selectedObject.show() : $$("btnPackage").selectedObject.hide();
            //CONTEXT Not Loading Properly
            if (CONTEXT.ENABLE_GLOBAL_EXP_ALERT) {
                $$("btnExpiryAlert").show();
                $("#iexpiry").show();
            } else {
                $$("btnExpiryAlert").hide();
                $("#iexpiry").hide();
            }

            if (CONTEXT.SHOW_BARCODE) {
                $$("btnPrintNewBarcode").show();
               // $('#iremove').show();
            } else {
                //$('#iremove').hide();
                $$("btnPrintNewBarcode").hide();
            }
            
            $(".detail-action input").click(function () {
                $(".detail-action input").css("border", "none");
                $(this).css("border-bottom", "solid 1px gray");
            });
           
            page.searchItemNo = null;
            page.itemAPI.getCountValue(function (data) {
                page.item_count = parseInt(data[0].tot_record);
                page.view.filterResult(true);
            });
            page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlMainPrdType").dataBind(data, "mpt_no", "mpt_name", "None");
                $$("ddlAdvMainPrdType").dataBind(data, "mpt_no", "mpt_name", "Select");
            });
            $$("ddlAdvMainPrdType").selectionChange(function () {
                var filter = "";
                if ($$("ddlAdvMainPrdType").selectedValue() != "-1" && $$("ddlAdvMainPrdType").selectedValue() != null) {
                    filter = "mptt.mpt_no = " + $$("ddlAdvMainPrdType").selectedValue();
                }
                page.productTypeAPI.searchValues("", "", filter, "", function (data) {
                    $$("ddlAdvPrdType").dataBind(data, "ptype_no", "ptype_name", "Select");
                });
            });
            page.productTypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlPrdType").dataBind(data, "ptype_no", "ptype_name", "None");
                $$("ddlAdvPrdType").dataBind(data, "ptype_no", "ptype_name", "Select");
            });
            page.itemAttributeAPI.searchValue(0,"", "", "", "", function (data) {// attr_no_key not in(100,101,102)
                global_attr_list = data;
            });
            page.productTypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "Select");
                $$("ddlProductType").selectionChange(function () {
                    if ($$("ddlProductType").selectedValue() == "-1") {
                        $$("grdItemResult").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.itemAPI.searchValues("", "", "", "", function (data) {
                                var totalRecord = page.item_count;
                                //page.itemAPI.searchValues(start, end, "", "item_no", function (data) {
                                page.itemAPI.searchValues(start, end, "", "item_code", function (data) {
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
                        $$("grdItemResult").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.itemAPI.searchValues("", "", "", "", function (data) {
                                var totalRecord = page.item_count;
                                    page.itemAPI.searchValues(start, end, "it.ptype_no=" + $$("ddlProductType").selectedValue(), "item_no", function (data) {
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
                })
            });
            $$("txtItemSearch").selectedObject.focus();

            if (CONTEXT.ENABLE_SUBSCRIPTION) {
                $$("ddlProductType").hide();
            } else {
                $$("ddlProductType").hide();
            }
            if (CONTEXT.ENABLE_ESHOPON_UPLOAD) {
                $("#iuploadEShopon").show();
                $$("btnUploadEshopon").show();
            }
            else {
                $("#iuploadEShopon").hide();
                $$("btnUploadEshopon").hide();
            }
            if (CONTEXT.ENABLE_EXCEL_UPLOAD) {
                $$("btnUpdateExcel").show();
                $("#iupdate").show();
            } else {
                $$("btnUpdateExcel").hide();
                $("#iupdate").hide();
            }
            if (CONTEXT.ENABLE_ADVANCE_SEARCH) {
                $$("btnAdvanceSearch").show();
            }
            else {
                $$("btnAdvanceSearch").hide();
            }
        }
        page.events.btnSearchAdvance_click = function () {
            var totalRecord = page.item_count;
            var filter = "";
            if ($$("ddlAdvMainPrdType").selectedValue() != "-1" && $$("ddlAdvPrdType").selectedValue() != "-1") {
                filter = "it.mpt_no = " + $$("ddlAdvMainPrdType").selectedValue() + " and it.ptype_no = " + $$("ddlAdvPrdType").selectedValue();
            }
            else if ($$("ddlAdvMainPrdType").selectedValue() != "-1") {
                filter = "it.mpt_no = " + $$("ddlAdvMainPrdType").selectedValue();
            }
            else if ($$("ddlAdvPrdType").selectedValue() != "-1") {
                filter = "it.ptype_no = " + $$("ddlAdvPrdType").selectedValue();
            }
            else {

            }
            page.controls.pnlAdvanceSearch.close();
            page.controls.grdItemResult.height(main_grid_height);
            page.controls.grdItemResult.setTemplate({
                selection: "Single", paging: true, pageSize: 100,
                columns: [
                    { 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_code" },
                    { 'name': "Item Name", 'rlabel': 'Name', 'width': "calc(100% - 150px)", 'dataField': "item_name" }
                ]
            });
            page.controls.grdItemResult.selectionChanged = page.events.grdItemResult_select;
            $$("grdItemResult").dataBind({
                getData: function (start, end, sortExpression, filterExpression, callback) {
                    var totalRecord = page.item_count;
                    page.itemAPI.searchValues(start, end, filter, "item_code", function (data) {
                        callback(data, totalRecord);
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
        page.view.filterInput = function () {
            if (page.searchItemNo == null) {
                var search = page.controls.txtItemSearch.value();
                if (page.controls.txtItemSearch.value().startsWith("00")) {
                    search = page.controls.txtItemSearch.value().substring(0, page.controls.txtItemSearch.value().length - 1);
                    //return " ( item_no = '" + search + "')";
                    return " ( item_code = '" + search + "')";
                }
                else {
                    //return " (concat(item_no,item_name,ifnull(barcode,true)) like '" + search + "%' or item_name like '" + search + "%')";
                    return " (concat(item_code,item_name,ifnull(barcode,true)) like '%" + search + "%' or item_name like '%" + search + "%')";
                }
            }
            else
                //return " item_no=" + page.searchItemNo + " ";
                return " item_code=" + page.searchItemNo + " ";
        }
        page.view.filterResult=function (data) {
            if (data == true) {
                page.controls.grdItemResult.height(main_grid_height);
                page.controls.grdItemResult.setTemplate({
                    selection: "Single", paging: true,pageSize:100,
                    columns: [
                        { 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_code" },
                        //{ 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'rlabel': 'Name', 'width': "calc(100% - 150px)", 'dataField': "item_name" }
                    ]
                });
                page.controls.grdItemResult.selectionChanged = page.events.grdItemResult_select;
                $$("grdItemResult").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        filterExpression = page.view.filterInput();
                        //page.itemAPI.searchValues("", "", "", "", function (data) {
                        var totalRecord = page.item_count;
                        //page.itemAPI.searchValues(start, end, filterExpression, "item_no", function (data) {
                        page.itemAPI.searchValues(start, end, filterExpression, "item_code", function (data) {
                                callback(data, totalRecord);
                            }); 
                        //});
                    },
                   update : function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });
            }
            else{
                page.controls.grdItemResult.height(main_grid_height);
                page.controls.grdItemResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 100,
                    columns: [
                        { 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_code" },
                        { 'name': "Item Name", 'rlabel': 'Name', 'width': "calc(100% - 150px)", 'dataField': "item_name" }
                    ]
                });
                page.controls.grdItemResult.selectionChanged = page.events.grdItemResult_select;
                $$("grdItemResult").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        filterExpression = page.view.filterItemInput();
                        //page.itemAPI.searchValues("", "", "", "", function (data) {
                        var totalRecord = page.item_count;
                        //page.itemAPI.searchValues(start, end, filterExpression, "item_no", function (data) {
                        page.itemAPI.searchValues(start, end, filterExpression, "item_code", function (data) {
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
        }
        page.view.filterItemInput = function () {
            if (page.searchItemNo == null) {
                var search = page.controls.txtItemSearch.value();
                if (page.controls.txtItemSearch.value().startsWith("00")) {
                    search = page.controls.txtItemSearch.value().substring(0, page.controls.txtItemSearch.value().length - 1);
                    //return " ( item_no = '" + search + "')";
                    return " ( item_no = '" + search + "')";
                }
                else {
                    //return " (concat(item_no,item_name,ifnull(barcode,true)) like '" + search + "%' or item_name like '" + search + "%')";
                    return " (concat(item_no,item_name,ifnull(barcode,true)) like '" + search + "%' or item_name like '" + search + "%')";
                }
            }
            else
                //return " item_no=" + page.searchItemNo + " ";
                return " item_no=" + page.searchItemNo + " ";
        }
        page.view.filterAdvanceResult = function (data) {
            if (data == true) {
                page.controls.grdItemResult.height(main_grid_height);
                page.controls.grdItemResult.setTemplate({
                    selection: "Single", paging: true, pageSize: 100,
                    columns: [
                        //{ 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_no" },
                        { 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_code" },
                        { 'name': "Item Name", 'rlabel': 'Name', 'width': "calc(100% - 150px)", 'dataField': "item_name" }
                    ]
                });
                page.controls.grdItemResult.selectionChanged = page.events.grdItemResult_select;
                $$("grdItemResult").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        filterExpression = "(it.item_no in (select item_no from po_bill_item_t where bill_no in (select bill_no from po_bill_t where bill_id like '" + page.controls.txtItemSearch.value() + "')))";
                        if (page.controls.txtItemSearch.value().slice(-1) == "#") {
                            if (page.controls.txtItemSearch.value().startsWith("#3")) {
                                filterExpression = "(it.item_no in (select key2 from item_stock_t where stock_no = '" + page.controls.txtItemSearch.value().substring(2, page.controls.txtItemSearch.value().length - 1) + "'))";
                            }
                        }
                        var totalRecord = page.item_count;
                        //page.itemAPI.searchValues(start, end, filterExpression, "item_no", function (data) {
                        page.itemAPI.searchValues(start, end, filterExpression, "item_code", function (data) {
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
        }

        e.btnSearch_click = function () {
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            //$("#iremove").hide();
            $(".detail-tab-action").hide();
            $(".basic-info").hide();
            $$("btnSaveItem").hide();
            $$("btnPrintBarcode").hide();
            $$("btnPrintQRcode").hide();
            if (CONTEXT.ENABLE_ESHOPON_UPLOAD) {
                //$("#idownloadeShopon").show();
                //$$("btnDownloadEshopon").show();
                $("#iuploadEShopon").show();
                $$("btnUploadEshopon").show();
            }
            else {
                //$("#idownloadeShopon").hide();
                //$$("btnDownloadEshopon").hide();
                $("#iuploadEShopon").hide();
                $$("btnUploadEshopon").hide();
            }
            $$("msgPanel").flash("Searching...");

            page.searchItemNo = null;
            page.view.filterResult(true);
            $$("msgPanel").hide();
            $$("txtItemSearch").selectedObject.focus();
        },
        e.lblchkCurrentPrc_click = function () {
            page.interface.loadPrice();
        },
        e.btnAdvanceSearch_click = function () {
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            //$("#iremove").hide();
            $(".detail-tab-action").hide();
            $$("btnSaveItem").hide();
            $$("btnPrintBarcode").hide();
            $$("btnPrintQRcode").hide();

            $$("msgPanel").flash("Searching...");

            page.searchItemNo = null;
            if (page.controls.txtItemSearch.value() == "") {
                //page.view.filterResult(true);
                page.controls.pnlAdvanceSearch.open();
                page.controls.pnlAdvanceSearch.title("Advance Search");
                page.controls.pnlAdvanceSearch.rlabel("Advance Search");
                page.controls.pnlAdvanceSearch.width(400);
                page.controls.pnlAdvanceSearch.height(250);
                $$("ddlAdvMainPrdType").selectedValue("-1");
                $$("ddlAdvPrdType").selectedValue("-1");
            }
            else {
                page.view.filterAdvanceResult(true);
            }
            $$("msgPanel").hide();
            $$("txtItemSearch").selectedObject.focus();
        },
        e.btnBeforeBarcode_click = function () {
            page.controls.itemPrintBarcode.open();
            page.controls.itemPrintBarcode.title("Print Details");
            page.controls.itemPrintBarcode.rlabel("Print Details");
            page.controls.itemPrintBarcode.width(350);
            page.controls.itemPrintBarcode.height(350);
            $$("txtPrintRow").focus();
            //var template = CONTEXT.BARCODE_TEMPLATE;
            var template = "Template3";
            if (template == "Template7") {
                $$("pnlBillDate").show();
                $$("pnlSellingRate").hide();
            }
            else {
                $$("pnlBillDate").hide();
                $$("pnlSellingRate").show();
            }
            if (CONTEXT.ENABLE_DYNAMIC_BARCODE) {
                $$("pnlDynamicBarcode").show();
            }
            else {
                $$("pnlDynamicBarcode").hide();
            }
            $$("chkShowSellingPrice").prop('checked', true);
        },
         e.btnPrintBarcode_click = function () {

             if (CONTEXT.SHOW_BARCODE) {
                 var template = CONTEXT.BARCODE_TEMPLATE;
                 if (CONTEXT.ENABLE_DYNAMIC_BARCODE) {
                     if ($$("ddlBarcodePrint").selectedValue() == "2") {
                         template = "Template2";
                     }
                     if ($$("ddlBarcodePrint").selectedValue() == "3") {
                         template = "Template8";
                     }
                     if ($$("ddlBarcodePrint").selectedValue() == "4") {
                         template = "Template4";
                     }
                 }
                 if (template == "Template1") {
                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "")
                         page.printCount = 1;

                     var printBox = {

                         PrinterName: "Microsoft Print to PDF",
                         Width: 500,
                         Height: 100,
                         Lines: []
                     };
                     //Barcode Printer Code
                     var item = page.controls.grdItemResult.selectedData()[0];
                     var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();
                     
                     printBox.Lines.push({ StartX: 15, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 15, StartY: 10, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 20, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 10, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 20, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 10, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 20, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 15, StartY: 10, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 20, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 10, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 20, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 10, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 20, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 15, StartY: 50, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 50, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 50, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 15, StartY: 60, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 60, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 60, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                     for (var i = 0; i < parseInt(page.printCount) ; i++)
                         PrintService.PrintBarcode(printBox);

                 }
                 else if (template == "Template2") {
                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "") {
                         page.printCount = 1;
                     }
                     else {
                         page.printCount = parseFloat(page.printCount) / 2;
                     }
                     for (var i = 0; i < page.printCount ; i++) {
                         var pagePrinter1 = true;
                         var pagePrinter2 = true;
                         var check = page.printCount - i;
                         if (check == 0.5)
                             pagePrinter2 = false;
                         var printBox = {
                             PrinterName: CONTEXT.BARCODE_PRINTER_NAME,
                             Width: 500,
                             Height: 100,
                             Lines: []
                         };
                         //Barcode Printer Code
                         var item = page.controls.grdItemResult.selectedData()[0];
                         var item_price = "Rs: " + parseFloat($$("ddlItemVariation").selectedValue()).toFixed(2);
                         if (!$$("chkShowSellingPrice").prop("checked"))
                             item_price = "";
                         //var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? item.item_name.substring(0, 10) : item.barcode.substring(0, 10);
                         item.item_name = item.item_name;//+ " #" + item.item_no + " @" + $$("ddlItemVariation").selectedData().var_no;
                         //var itemNo = " #" + item.item_no + " @" + $$("ddlItemVariation").selectedData().var_no;
                         var itemNo = " #" + item.item_code + " @" + $$("ddlItemVariation").selectedData().var_no;
                         var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation($$("ddlItemVariation").selectedData().var_no,13) : item.barcode.substring(0, 10);//getBitByZero(item.item_no, 15)
                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 25, StartY: 10, Text: (CONTEXT.COMPANY_NAME), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 230, StartY: 10, Text: (CONTEXT.COMPANY_NAME), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 25, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 22, FontStyle: 1, TextHeight: 20, TextWidth: 150 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 230, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 22, FontStyle: 1, TextHeight: 20, TextWidth: 150 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 25, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 22, FontStyle: 1, TextHeight: 20, TextWidth: 150 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 230, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 22, FontStyle: 1, TextHeight: 20, TextWidth: 150 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 25, StartY: 50, Text: (item.item_name).substring(0, 20), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 230, StartY: 50, Text: (item.item_name).substring(0, 20), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 25, StartY: 62, Text: item_price, FontFamily: "Courier New", FontSize: 16, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 230, StartY: 62, Text: item_price, FontFamily: "Courier New", FontSize: 16, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 25, StartY: 85, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 230, StartY: 85, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                         PrintService.PrintBarcode(printBox);
                     }
                 }
                 else if (template == "Template3") {
                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "")
                         page.printCount = 1;

                     var printBox = {

                         PrinterName: "Microsoft Print to PDF",
                         Width: 500,
                         Height: 90,
                         Lines: []
                     };
                     //Barcode Printer Code
                     var item = page.controls.grdItemResult.selectedData()[0];
                     var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();

                     printBox.Lines.push({ StartX: 25, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 160, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 300, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 25, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 160, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 300, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 25, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 160, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 300, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 25, StartY: 60, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 160, StartY: 60, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 300, StartY: 60, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 25, StartY: 70, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 160, StartY: 70, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 300, StartY: 70, Text: item_price, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                     for (var i = 0; i < parseInt(page.printCount) ; i++)
                         PrintService.PrintBarcode(printBox);
                 }
                 else if (template == "Template4") {
                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "")
                         page.printCount = 1;
                     else {
                         page.printCount = parseFloat(page.printCount) / 4;
                     }
                     for (var i = 0; i < page.printCount ; i++) {
                         var pagePrinter1 = true;
                         var pagePrinter2 = true;
                         var pagePrinter3 = true;
                         var pagePrinter4 = true;
                         var check = page.printCount - i;
                         if (check == 0.25) {
                             pagePrinter2 = false;
                             pagePrinter3 = false;
                             pagePrinter4 = false;
                         }
                         if (check == 0.5) {
                             pagePrinter3 = false;
                             pagePrinter4 = false;
                         }
                         if (check == 0.75) {
                             pagePrinter4 = false;
                         }
                         var printBox = {
                             PrinterName: CONTEXT.BARCODE_PRINTER_NAME,
                             Width: 500,
                             Height: 90,
                             Lines: []
                         };
                         //Barcode Printer Code
                         var item = page.controls.grdItemResult.selectedData()[0];
                         var item_price = "Rs: " + parseFloat($$("ddlItemVariation").selectedValue()).toFixed(2);
                         if (!$$("chkShowSellingPrice").prop("checked"))
                             item_price = "";
                         var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation($$("ddlItemVariation").selectedData().var_no, 5) : item.barcode.substring(0, 4);
                         item.item_name = item.item_name + " #" + item.item_no + " @" + $$("ddlItemVariation").selectedData().var_no;
                         var itemNo = " #" + item.item_no + " @" + $$("ddlItemVariation").selectedData().var_no;
                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter4)
                            printBox.Lines.push({ StartX: 320, StartY: 0, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 15, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 115, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 215, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter4)
                             printBox.Lines.push({ StartX: 315, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 15, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 115, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 215, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter4)
                             printBox.Lines.push({ StartX: 315, StartY: 15, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 31, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 31, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 31, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter4)
                            printBox.Lines.push({ StartX: 320, StartY: 31, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 40, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 40, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 40, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter4)
                             printBox.Lines.push({ StartX: 320, StartY: 40, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 55, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 55, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 55, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                         if (pagePrinter4)
                             printBox.Lines.push({ StartX: 320, StartY: 55, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });


                         PrintService.PrintBarcode(printBox);
                     }
                     //for (var i = 0; i < parseInt(page.printCount) ; i++) {
                     //    if (i + 1 == parseInt(page.printCount)) {
                     //        PrintService.PrintBarcode(printBox);
                     //        alert("Barcode Printed Successfully");
                     //    }
                     //    else {
                     //        PrintService.PrintBarcode(printBox);
                     //    }
                     //} 
                 }
                 else if (template == "Template5") {

                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "")
                         page.printCount = 1;

                     var printBox = {

                         PrinterName: "Microsoft Print to PDF",
                         Width: 500,
                         Height: 80,
                         Lines: []
                     };
                     //Barcode Printer Code
                     var item = page.controls.grdItemResult.selectedData()[0];
                     var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();

                     printBox.Lines.push({ StartX: 20, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 120, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 220, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 320, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 10, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 110, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 210, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 310, StartY: 20, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 10, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 110, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 210, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 310, StartY: 20, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 24, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 20, StartY: 65, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 120, StartY: 65, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 220, StartY: 65, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 320, StartY: 65, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });


                     for (var i = 0; i < parseInt(page.printCount) ; i++) {
                         if (i + 1 == parseInt(page.printCount)) {
                             PrintService.PrintBarcode(printBox);
                             alert("Barcode Printed Successfully");
                         }
                         else {
                             PrintService.PrintBarcode(printBox);
                         }
                     }
                 }
                 else if (template == "Template6") {
                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "")
                         page.printCount = 1;

                     var printBox = {
                         PrinterName: "Microsoft Print to PDF",
                         Width: 500,
                         Height: 100,
                         Lines: []
                     };
                     //Barcode Printer Code
                     var item = page.controls.grdItemResult.selectedData()[0];
                     $$("ddlItemVariationCost").selectedValue($$("ddlItemVariation").selectedValue());
                     var item_mrp = CONTEXT.BARCODE_PRICE_ALPHABET + "" + parseInt($$("ddlItemVariationCost").selectedData().cost) + "" + CONTEXT.BARCODE_PRICE_ALPHABET;
                     var item_price = "Rs: " + parseFloat($$("ddlItemVariation").selectedValue()).toFixed(2);

                     printBox.Lines.push({ StartX: 25, StartY: 15, Text: (CONTEXT.COMPANY_NAME), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 230, StartY: 15, Text: (CONTEXT.COMPANY_NAME), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 35, StartY: 30, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 230, StartY: 30, BarcodeText: item.item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 35, StartY: 30, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 230, StartY: 30, BarcodeText: page.controls.grdItemResult.selectedData()[0].item_no, FontFamily: "Courier New", FontSize: 22, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 30, StartY: 65, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                     printBox.Lines.push({ StartX: 235, StartY: 65, Text: (item.item_name).substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                     printBox.Lines.push({ StartX: 30, StartY: 75, Text: item_mrp, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 235, StartY: 75, Text: item_mrp, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 30, StartY: 85, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 235, StartY: 85, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                     for (var i = 0; i < parseInt(page.printCount) ; i++)
                         PrintService.PrintBarcode(printBox);
                 }
                 else if (template == "Template7") {

                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "")
                         page.printCount = 1;

                     var printBox = {

                         PrinterName: "Microsoft Print to PDF",
                         Width: 500,
                         Height: 90,
                         Lines: []
                     };
                     //Barcode Printer Code
                     var item = page.controls.grdItemResult.selectedData()[0];
                     var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();

                     printBox.Lines.push({ StartX: 10, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 15), FontFamily: "Courier New", FontSize: 11, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 15), FontFamily: "Courier New", FontSize: 11, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 15), FontFamily: "Courier New", FontSize: 11, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 10, StartY: 30, Text: "PKD DATE:" + dbDateMonthYear($$("txtBillDate").getDate()), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 30, Text: "PKD DATE:" + dbDateMonthYear($$("txtBillDate").getDate()), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 30, Text: "PKD DATE:" + dbDateMonthYear($$("txtBillDate").getDate()), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 10, StartY: 45, Text: "Best Before ", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 45, Text: "Best Before ", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 45, Text: "Best Before ", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 10, StartY: 55, Text: page.controls.grdItemResult.selectedData()[0].expiry_days + " Days Of Packing", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 55, Text: page.controls.grdItemResult.selectedData()[0].expiry_days + " Days Of Packing", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 55, Text: page.controls.grdItemResult.selectedData()[0].expiry_days + " Days Of Packing", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 10, StartY: 65, Text: "FSSAI", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 65, Text: "FSSAI", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 65, Text: "FSSAI", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                     printBox.Lines.push({ StartX: 10, StartY: 80, Text: "Lic No:"+CONTEXT.FSSAI_NO, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 150, StartY: 80, Text: "Lic No:" + CONTEXT.FSSAI_NO, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                     printBox.Lines.push({ StartX: 290, StartY: 80, Text: "Lic No:" + CONTEXT.FSSAI_NO, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                     for (var i = 0; i < parseInt(page.printCount) ; i++)
                         PrintService.PrintBarcode(printBox);
                 }
                 else if (template == "Template8") {
                     page.printCount = $$("txtPrintRow").value();
                     if (page.printCount == null || page.printCount == "") {
                         page.printCount = 1;
                     }
                     else {
                         page.printCount = parseFloat(page.printCount) / 3;
                     }
                     for (var i = 0; i < page.printCount ; i++) {
                         var pagePrinter1 = true;
                         var pagePrinter2 = true;
                         var pagePrinter3 = true;
                         var check = page.printCount - i;
                         if (check > 0.5 && check < 1)
                             pagePrinter3 = false;
                         if (check < 0.5) {
                             pagePrinter2 = false;
                             pagePrinter3 = false;
                         }
                         var printBox = {
                             PrinterName: CONTEXT.BARCODE_PRINTER_NAME,
                             Width: 500,
                             Height: 90,
                             Copies:1,
                             Lines: []
                         };
                         //Barcode Printer Code
                         var item = page.controls.grdItemResult.selectedData()[0];
                         var item_price = "Rs: " + parseFloat($$("ddlItemVariation").selectedValue()).toFixed(2);
                         if (!$$("chkShowSellingPrice").prop("checked"))
                             item_price = "";
                         var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation($$("ddlItemVariation").selectedData().var_no, 8) : item.barcode.substring(0, 7);
                         item.item_name = item.item_name;// + " #" + item.item_no + " @" + $$("ddlItemVariation").selectedData().var_no;
                         var itemNo = " #" + item.item_no + " @" + $$("ddlItemVariation").selectedData().var_no;
                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 10, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 150, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 290, StartY: 10, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 0, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 20, TextWidth: 120 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 140, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 20, TextWidth: 120 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 280, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 20, TextWidth: 120 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 0, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 20, TextWidth: 120 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 140, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 20, TextWidth: 120 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 280, StartY: 25, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 20, TextWidth: 120 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 10, StartY: 50, Text: (item.item_name).substring(0, 16), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 150, StartY: 50, Text: (item.item_name).substring(0, 16), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter3)
                            printBox.Lines.push({ StartX: 290, StartY: 50, Text: (item.item_name).substring(0, 16), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 10, StartY: 60, Text: item_price, FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 150, StartY: 60, Text: item_price, FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 290, StartY: 60, Text: item_price, FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 10, StartY: 77, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 150, StartY: 77, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 290, StartY: 77, Text: itemNo, FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });


                         PrintService.PrintBarcode(printBox);
                         //PrintService.PrintReceipt(printBox);
                     }
                 }
             }
             else {
                 alert("Your Settings Block The Barcode Printing Please Change It");
             }

             
         }
        e.btnBeforeQRcode_click = function () {
            page.controls.itemPrintQRcode.open();
            page.controls.itemPrintQRcode.title("Print Details");
            page.controls.itemPrintQRcode.rlabel("Print Details");
            page.controls.itemPrintQRcode.width(500);
            page.controls.itemPrintQRcode.height(330);
            $$("txtQRPrintRow").focus();
        },
        e.btnPrintQRcode_click = function () {
            var item = page.controls.grdItemResult.selectedData()[0];
            var item_price = "Rs: " + $$("ddlQRItemVariation").selectedValue();
            page.printCount = $$("txtQRPrintRow").value();
            if (page.printCount == null || page.printCount == "")
                page.printCount = 1;
            var template = CONTEXT.QR_TEMPLATE;
            if (CONTEXT.ENABLE_QR_CODE) {
                if (template == "Template1") {
                    var printBox = {
                        PrinterName: CONTEXT.QR_PRINTER_NAME,
                        Width: 500,
                        Height: 100,
                        Lines: []
                    };
                    printBox.Lines.push({ StartX: 15, StartY: 15, QRText: item.item_name, FontFamily: "Courier New", FontSize: 10, FontStyle: 1, TextWidth: 57, TextHeight: 57 });
                    printBox.Lines.push({ StartX: 80, StartY: 20, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 80, StartY: 40, Text: (item.item_name).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 80, StartY: 55, Text: (item_price).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });


                    printBox.Lines.push({ StartX: 215, StartY: 15, QRText: item.item_name, FontFamily: "Courier New", FontSize: 10, FontStyle: 1, TextWidth: 57, TextHeight: 57 });
                    printBox.Lines.push({ StartX: 280, StartY: 20, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 280, StartY: 40, Text: (item.item_name).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 280, StartY: 55, Text: (item_price).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                    for (var i = 0; i < parseInt(page.printCount) ; i++) {
                        e.printServiceQR(printBox);
                    }
                }
                if (template == "Template2") {
                    var printBox = {
                        PrinterName: CONTEXT.QR_PRINTER_NAME,
                        Width: 500,
                        Height: 100,
                        Lines: []
                    };
                    printBox.Lines.push({ StartX: 15, StartY: 15, QRText: item.item_name, FontFamily: "Courier New", FontSize: 10, FontStyle: 1, TextWidth: 60, TextHeight: 60 });
                    printBox.Lines.push({ StartX: 80, StartY: 20, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 80, StartY: 40, Text: (item.item_name).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 80, StartY: 55, Text: (item_price).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });


                    printBox.Lines.push({ StartX: 215, StartY: 15, QRText: item.item_name, FontFamily: "Courier New", FontSize: 10, FontStyle: 1, TextWidth: 60, TextHeight: 60 });
                    printBox.Lines.push({ StartX: 280, StartY: 20, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 280, StartY: 40, Text: (item.item_name).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 280, StartY: 55, Text: (item_price).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                    for (var i = 0; i < parseInt(page.printCount) ; i++) {
                        e.printServiceQR(printBox);
                    }
                }
            }
            else {
                alert("Your Settings Block The Barcode Printing Please Change It");
            }
        },
        e.printServiceQR = function (printBox) {
            setTimeout(function () {
                PrintService.PrintQRCode(printBox);
            }, 2000)
        },

            e.btnSaveItem_click = function () {
                page.controls.currentUC.saveDetail();
                page.controls.currentUC.saveVariation();
                //$$("grdItemResult").updateRow($$("grdItemResult").selectedRowIds()[0], data);
                //page.itemService.getItemByNo(page.controls.grdItemResult.selectedData()[0].item_no, function (data) {
                page.itemAPI.getValue(page.controls.grdItemResult.selectedData()[0].item_no, function (data) {
                    $$("grdItemResult").updateRow($$("grdItemResult").selectedRowIds()[0], data[0]);
                    $$("grdItemResult").selectedRows()[0].click();
                });
            }
       

            page.interface.loadItemGrid = function (data) {
                $$("grdItemResult").updateRow($$("grdItemResult").selectedRowIds()[0], data);
                $$("grdItemResult").selectedRows()[0].click();
            }

            e.btnRemove_click = function () {
                try {
                    if (item_level_stock == 0) {
                        page.controls.pnlRemoveConfirmPopup.open();
                        page.controls.pnlRemoveConfirmPopup.title("Remove Alert");
                        page.controls.pnlRemoveConfirmPopup.rlabel("Remove Alert");
                        page.controls.pnlRemoveConfirmPopup.width(540);
                        page.controls.pnlRemoveConfirmPopup.height(200);
                        if (CONTEXT.ENABLE_REMOVE) {
                            $$("btnRemoveConfirmPopupSave").show();
                        }
                        else {
                            $$("btnRemoveConfirmPopupSave").hide();
                        }
                    }
                    else {
                        page.controls.pnlRemoveAlertPopup.open();
                        page.controls.pnlRemoveAlertPopup.title("Remove Alert");
                        page.controls.pnlRemoveAlertPopup.rlabel("Remove Alert");
                        page.controls.pnlRemoveAlertPopup.width(540);
                        page.controls.pnlRemoveAlertPopup.height(200);
                    }
                }
                catch (e) {
                    alert(e);
                }
            }
            e.btnRemoveConfirm_click = function(){
                page.controls.currentUC.removeDetail();
                page.searchItemNo = null;
                page.view.filterResult(true);
                page.controls.pnlRemoveConfirmPopup.close();
            }
        e.btnRemoveAlertPopupClose_click = function () {
            page.controls.pnlRemoveAlertPopup.close();
        }
        e.btnRemoveConfirmPopupClose_click = function () {
            page.controls.pnlRemoveConfirmPopup.close();
        }
        e.btnDetails_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "solid 3px gray");        
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "none");
            $$("btnImage").selectedObject.css("border-bottom", "none");
            $$("btnDetails").selectedObject.blur();
            $$("btnSaveItem").show();
            $$("btnRemove").show();
            $$("btnRemove").selectedObject.next().show();
            //$$("msgPanel").show("Details of the item...");
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemDetail")
            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no, page.controls.grdItemResult.selectedData()[0]);
            //$$("msgPanel").hide();
            if (CONTEXT.ENABLE_GLOBAL_EXP_ALERT) {
                $$("btnExpiryAlert").show();
                $("#iexpiry").show();
            } else {
                $$("btnExpiryAlert").hide();
                $("#iexpiry").hide();
            }
        }

        e.btnInventory_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none ");
            $$("btnInventory").selectedObject.css("border-bottom", "solid 3px gray ");
            $$("btnPrice").selectedObject.css("border-bottom", "none ");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "none");
            $$("btnImage").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            //$$("msgPanel").show("Inventory details of the item...");
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemInventory")

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no, page.controls.grdItemResult.selectedData()[0]);
            //$$("msgPanel").hide();
        }
        page.interface.loadItemInventory = function (data) {
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemInventory")
            page.controls.currentUC.selectedItemInventory(data);
        }
        e.btnPrice_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "none");
            $$("btnImage").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemPrice")

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no, page.controls.grdItemResult.selectedData()[0]);
        }
        e.btnLanguage_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "none");
            $$("btnImage").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemLanguage");

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
        }
        e.btnPackage_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnPackage").selectedObject.blur();
            $$("btnImage").selectedObject.css("border-bottom", "none");
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemPackage");

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no, page.controls.grdItemResult.selectedData()[0].package_item, page.controls.grdItemResult.selectedData()[0].package_count);
        }
        e.btnProperty_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnImage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnProperty").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemProperty");

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
        }
        e.btnImage_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnProperty").selectedObject.css("border-bottom", "none");
            $$("btnImage").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnImage").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $$("btnRemove").selectedObject.next().hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemImage");

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
        }
        e.grdItemVariation_select = function (item) {
            page.itemAttributeAPI.searchValue(0, 6, " attr_no_key not in(100,101,102)", "", "", function (data) {
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
        e.grdItemResult_select = function (item) {
            //$("#iremove").show();
            global_attr_list = [];
            page.string_item_attr_list = "";//undefined;
            $$("btnSaveItem").show();
            $$("btnRemove").show();
            $$("btnRemove").selectedObject.next().show();
            //if (CONTEXT.SHOW_BARCODE == true) {
            //    $$("btnPrintBarcode").hide();
            //    $('#iremove').hide();
            //} else {
            //    $('#iremove').hide();
            //    $$("btnPrintBarcode").hide();
            //}
            if (CONTEXT.ENABLE_QR_CODE == true) {
                $$("btnPrintQRcode").show();
                $('#iremove1').show();
            } else {
                $('#iremove1').hide();
                $$("btnPrintQRcode").hide();
            }

            $(".detail-tab-action").show();
            //$$("btnRemove").hide();
            page.events.btnDetails_click();
            /*
            page.stockAPI.searchCurrentPricesMain(page.controls.grdItemResult.selectedData()[0].item_no, getCookie("user_store_id"), function (data) {
                page.controls.ddlItemVariation.dataBind(data, "price", "price");
                page.controls.ddlItemVariationCost.dataBind(data, "price", "cost");
                page.controls.ddlQRItemVariation.dataBind(data, "price", "price");
                $$("lblVariationMrp").value($$("ddlItemVariation").selectedValue())
            });
            */
            $$("ddlItemVariation").selectionChange(function () {
                $$("lblVariationMrp").value($$("ddlItemVariation").selectedValue());
            });
            $$("ddlQRItemVariation").selectionChange(function () {
                $$("lblQRVariationMrp").value($$("ddlItemVariation").selectedValue());
            });
            page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {// attr_no_key not in(100,101,102)
                global_attr_list = data;
            });
        }
      

        e.btnAddItem_click = function () {
            $$("btnAddItem").disable(true);
            try {
                if (page.controls.txtAddItemName.value() == "" || page.controls.txtAddItemName.value() == null || page.controls.txtAddItemName.value() == undefined)
                    throw "Item name is not null";
                $$("msgPanel").show("Inserting new item...");
                var active;
                if ($$("chkNewInclusive").prop("checked"))
                    active = 1;
                else
                    active = 0;
                page.itemAPI.postValue({
                    item_name: page.controls.txtAddItemName.value(),
                    barcode: $$("txtNewBarcode").value(),
                    unit: $$("itemNewUnit").selectedValue(),
                    tax_class_no: $$("ddlNewTax").selectedValue(),
                    tax_inclusive: active,
                    alter_unit: $$("txtAlterUnit").selectedValue(),
                    alter_unit_fact: $$("txtAlterUnitFact").value(),
                    mpt_no: ($$("ddlMainPrdType").selectedValue() != -1) ? $$("ddlMainPrdType").selectedValue() : undefined,
                    ptype_no:($$("ddlPrdType").selectedValue()!=-1)?$$("ddlPrdType").selectedValue():undefined,
                }, function (data) {
                    var itemNo = data[0].key_value;
                    if ($$("chkStock").prop("checked")) {
                        var iData ={
                            store_no: getCookie("user_store_id"),
                            item_no: itemNo,
                            variation_name: "null-null-null-null-null-null",
                            active: 1,
                            user_no: getCookie("user_id"),
                            attr_type1: "null",
                            attr_value1: "null",
                            attr_type2: "null",
                            attr_value2: "null",
                            attr_type3: "null",
                            attr_value3: "null",
                            attr_type4: "null",
                            attr_value4: "null",
                            attr_type5: "null",
                            attr_value5: "null",
                            attr_type6: "null",
                            attr_value6: "null",
                        };
                        page.itemVariationAPI.postValue(iData, function (data) {
                            var varNo=data[0].key_value;
                            console.log("new variation successfully created..!");
                            var sData = {
                                store_no: getCookie("user_store_id"),
                                avg_buying_cost: 0,
                                var_no: varNo,
                                attr_type1: "null",
                                attr_value1: "null",
                                attr_type2: "null",
                                attr_value2: "null",
                                attr_type3: "null",
                                attr_value3: "null",
                                attr_type4: "null",
                                attr_value4: "null",
                                attr_type5: "null",
                                attr_value5: "null",
                                attr_type6: "null",
                                attr_value6: "null",

                            }
                            page.itemSKUAPI.postValue(sData, function (data) {
                                var skuNo = data[0].key_value;
                                var pData = [];
                                pData.push({
                                    valid_from: dbDate(currentDate()),
                                    price: $$("txtItemPrice").val(),
                                    alter_price_1: $$("txtItemPrice").val(),
                                    alter_price_2: $$("txtItemPrice").val(),
                                    user_no: getCookie("user_id"),
                                    comp_id: getCookie("user_company_id"),
                                    store_no: getCookie("user_store_id"),
                                    item_level: "ITEM",
                                    key_value: itemNo,
                                    state_no: "100"
                                });

                                pData.push({
                                    valid_from: dbDate(currentDate()),
                                    price: $$("txtItemPrice").val(),
                                    alter_price_1: $$("txtItemPrice").val(),
                                    alter_price_2: $$("txtItemPrice").val(),
                                    user_no: getCookie("user_id"),
                                    comp_id: getCookie("user_company_id"),
                                    store_no: getCookie("user_store_id"),
                                    item_level: "VAR",
                                    key_value: varNo,
                                    state_no: "100"
                                });
                                pData.push({
                                    valid_from: dbDate(currentDate()),
                                    price: $$("txtItemPrice").val(),
                                    alter_price_1: $$("txtItemPrice").val(),
                                    alter_price_2: $$("txtItemPrice").val(),
                                    user_no: getCookie("user_id"),
                                    comp_id: getCookie("user_company_id"),
                                    store_no: getCookie("user_store_id"),
                                    item_level: "SKU",
                                    key_value: skuNo,
                                    state_no: "100"
                                });
                                page.itemPriceAPI.multiPostValue(pData, function (data) {
                                    console.log(data);
                                })
                            });
                        }, function (error) {
                            console.log(error)
                        })
                    }
                  /*  else {
                        var var_attr_name = "", var_attr_no = "", stock_attr_name = "", stock_attr_no = "";
                        $($$("grdItemVariation").selectedData()).each(function (i, item) {
                            if (i == 0) {
                                var_attr_name = item.attr_name;
                                var_attr_no = item.attr_no_key;
                            }
                            else {
                                var_attr_name = var_attr_name + "," + item.attr_name;
                                var_attr_no = var_attr_no + "," + item.attr_no_key;
                            }
                        });
                        $($$("grdItemStockVariation").selectedData()).each(function (i, item) {
                            if (i == 0) {
                                stock_attr_name = item.attr_name;
                                stock_attr_no = item.attr_no_key;
                            }
                            else {
                                stock_attr_name = stock_attr_name + "," + item.attr_name;
                                stock_attr_no = stock_attr_no + "," + item.attr_no_key;
                            }
                        });
                        stock_attr_name = var_attr_name + "," + stock_attr_name;
                        stock_attr_no = var_attr_no + "," + stock_attr_no;
                        var data = {
                            item_no: itemNo,
                            var_attribute: var_attr_name,
                            var_stock_attribute: stock_attr_name,
                            var_attr_key: var_attr_no,
                            var_stock_attr_key: stock_attr_no
                        }
                        page.itemAPI.putValue(itemNo, data, function (data) {
                        })
                    }*/
                    
                    page.controls.itemAddDialog.close();
                    page.searchItemNo=itemNo;
                    page.itemAPI.getCountValue(function (data) {
                        page.item_count = parseInt(data[0].tot_record);
                        page.view.filterResult(false);
                    });
                    
                    $$("msgPanel").flash("Item added successfully...!");
                    $$("btnAddItem").disable(false);
                })
            } catch (e) {
                alert(e);
                $$("btnAddItem").disable(false);
            }
        }
        e.btnNewItem_click = function () {
            $$("btnAddItem").disable(false);
            var addnewpopup = 500;
            $$("pnlItemCode").hide();
            $$("txtAddItemName").focus();
            page.controls.itemAddDialog.open();
            page.controls.itemAddDialog.title("Add New Item");
            page.controls.itemAddDialog.rlabel("Add New Item");
            page.controls.itemAddDialog.width(500);
            page.controls.itemAddDialog.height(550);

            page.controls.txtAddItemCode.value("");
            page.controls.txtAddItemName.value("");
            if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                $$("chkNewInclusive").prop("checked", true);
            }
            else {
                $$("chkNewInclusive").prop("checked", false);
            }
            if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                $$("pnlNewItemMainPrd").show();
                $$("pnlNewItemPrd").show();
            } else {
                $$("pnlNewItemMainPrd").hide();
                $$("pnlNewItemPrd").hide();
            }
            $$("chkStock").prop("checked", false);
            $$("itemPrice").hide();
            $$("txtItemPrice").value("");
            $$("txtItemAlterPrice1").value("");
            $$("itemAlterPrice1").hide();
            $$("txtItemAlterPrice2").value("");
            $$("itemAlterPrice2").hide();
            $$("pnlItemNo").hide();
            $$("itemPrice").hide();
            $$("txtItemPrice").value("");
            $$("chkStock").change(function () {
                if ($$("chkStock").prop("checked")) {
                    $$("itemPrice").show();
                    $$("txtItemPrice").value("");
                    $$("txtItemPrice").focus();
                    if(CONTEXT.ENABLE_ALTER_PRICE_1)
                    {
                        $$("txtItemAlterPrice1").value("");
                        $$("itemAlterPrice1").show();
                    }
                    else {
                        $$("txtItemAlterPrice1").value("");
                        $$("itemAlterPrice1").hide();
                    }
                    if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                        $$("txtItemAlterPrice2").value("");
                        $$("itemAlterPrice2").show();
                    }
                    else {
                        $$("txtItemAlterPrice2").value("");
                        $$("itemAlterPrice2").hide();
                    }
                    if (CONTEXT.ENABLE_CREATE_DEFAULT_PRICE) {
                        $$("txtItemPrice").value(CONTEXT.ENABLE_CREATE_DEFAULT_PRICE_VALUE);
                        $$("txtItemAlterPrice1").value(CONTEXT.ENABLE_CREATE_DEFAULT_PRICE_VALUE);
                        $$("txtItemAlterPrice2").value(CONTEXT.ENABLE_CREATE_DEFAULT_PRICE_VALUE);
                    }
          //          $$("itemSetVariation").hide();
                }
                else {
                    $$("itemPrice").hide();
                    $$("txtItemPrice").value("");
                    $$("txtItemAlterPrice1").value("");
                    $$("itemAlterPrice1").hide();
                    $$("txtItemAlterPrice2").value("");
                    $$("itemAlterPrice2").hide();
                   // $$("itemSetVariation").show();
                }
            });
            page.taxclassAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlNewTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
            });
            $$("itemNewUnit").selectedValue("No unit");
            $$("txtNewBarcode").value("");
           
            if (CONTEXT.SHOW_BARCODE) {
                $$("pnlBarCode").show();
            } else {
                $$("pnlBarCode").hide();
            }
            if (CONTEXT.ENABLE_TAX_MODULE) {
                $$("pnlTax").show();
                $$("pnlTaxMode").show();
            }
            else {
                $$("pnlTax").hide();
                $$("pnlTaxMode").hide();
            }
            if (CONTEXT.ENABLE_ALTER_UNIT) {
                $$("pnlAlternativeUnit").show();
                $$("pnlAlternativeUnitFactor").show();
            } else {
                $$("pnlAlternativeUnit").hide();
                $$("pnlAlternativeUnitFactor").hide();
            }

            page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlMainPrdType").dataBind(data, "mpt_no", "mpt_name", "None");
            });
            page.productTypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlPrdType").dataBind(data, "ptype_no", "ptype_name", "None");
            });

            $$("ddlMainPrdType").selectionChange(function () {
                var filter = "";
                if ($$("ddlMainPrdType").selectedValue() != "-1" && $$("ddlMainPrdType").selectedValue() != null) {
                    filter = "mptt.mpt_no = " + $$("ddlMainPrdType").selectedValue();
                }
                page.productTypeAPI.searchValues("", "", filter, "", function (data) {
                    $$("ddlPrdType").dataBind(data, "ptype_no", "ptype_name", "None");
                });
            });
           /* page.controls.grdItemVariation.width("100%");
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

            $$("grdItemVariation").dataBind(global_attr_list);
            $$("grdItemStockVariation").dataBind(global_attr_list);*/
            $$("txtAddItemName").focus();
        }
        e.btnExpiryAlert_click = function () {
            page.controls.pnlManualDiscountPopUp.open();
            page.controls.pnlManualDiscountPopUp.title("Expiry Alert Panel");
            page.controls.pnlManualDiscountPopUp.rlabel("Expiry Alert Panel");
        }
        e.btnUpdateExcel_click = function () {
            page.controls.pnlUpdateExcelPopup.open();
            page.controls.pnlUpdateExcelPopup.title("Update From Excel");
            page.controls.pnlUpdateExcelPopup.rlabel("Update From Excel");
            page.controls.pnlUpdateExcelPopup.width(600);
            page.controls.pnlUpdateExcelPopup.height(400);
            $("#fileUpload").val("");
            $$("upload_path").html("2. Your File Must Present " + CONTEXT.REPORT_PATH + " drive");
        }
        e.btnUpdateExcelVariation_click = function () {
            page.controls.pnlUpdateExcelVariationPopup.open();
            page.controls.pnlUpdateExcelVariationPopup.title("Update From Excel");
            page.controls.pnlUpdateExcelVariationPopup.rlabel("Update From Excel");
            page.controls.pnlUpdateExcelVariationPopup.width(600);
            page.controls.pnlUpdateExcelVariationPopup.height(550);
            $$("ddlFormatVariation").selectedValue("False");
            $$("txtStartRow").value("");
            $$("txtEndRow").value("");
            $("#fileUploadVariation").val("");
            $$("lblSampleDocument").html("<a href='" + CONTEXT.SAMPLE_EXCEL_FORMAT_LOCATION + "'>Click Here</a>")
            $$("upload_path").html("2. Your File Must Present " + CONTEXT.REPORT_PATH + " drive");

        }
        e.btnUploadEshopon_click = function () {
            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                //page.settingApi.searchSettings("", "", "sett_key='LAST_UPLOAD_TIME' and comp_id = " + getCookie("user_company_id"), "sett_no", function (data) {
                 //   if (data.length > 0) {
                        var upData = {
                            //upd_date: data[0].value_1,
                            e_comp_id: CONTEXT.ESHOPON_COMP_ID,
                            e_store_no: CONTEXT.ESHOPON_STORE_NO,
                            e_auth_token: CONTEXT.ESHOPON_AUTH_TOKEN
                        }
                   // }
                    $.server.webMethodPOST("shopon/online-offline-sync/offline", upData, function (data) {
                        alert("Syncronized successfully...!");
                    }, function (error) {
                        alert(error.message);
                    })
                //})
            } else {
                alert("Settings blocking . please check");
            }
        }
        e.btnDownloadEshopon_click = function () {
            if (CONTEXT.ENABLE_ALTER_PRICE_2) {
                page.settingApi.searchSettings("", "", "sett_key in ('LAST_DOWNLOAD_TIME','ESHOPON_COMP_ID','ESHOPON_STORE_NO','ESHOPON_AUTH_TOKEN') and comp_id = " + getCookie("user_company_id"), "", function (data) {
                    if (data.length > 0) {
                        var upd_date = data.filter(function (n) {
                            return n.sett_key == 'LAST_DOWNLOAD_TIME';
                        })
                        var e_comp_id = data.filter(function (n) {
                            return n.sett_key == 'ESHOPON_COMP_ID';
                        })
                        var e_store_no = data.filter(function (n) {
                            return n.sett_key == 'ESHOPON_STORE_NO';
                        })
                        var e_auth_token = data.filter(function (n) {
                            return n.sett_key == 'ESHOPON_AUTH_TOKEN';
                        })

                        var upData = {
                            upd_date: upd_date[0].value_1,
                            e_comp_id: e_comp_id[0].value_1,
                            e_store_no: e_store_no[0].value_1,
                            e_auth_token: e_auth_token[0].value_1
                        }
                        $.server.webMethodPOST("shopon/online-offline-sync/online", upData, function (data) {
                            alert("Download Completed...!");
                        }, function (error) {
                            alert(error.message);
                        })
                    }

                })
            }
        }
        e.btnUploadFileVariation_click = function () {
            var _validFileExtensions = [".xls"];
            var files = $("#fileUploadVariation").get(0).files;
            var file_name = $("#fileUploadVariation").val();
            var check_file_name = $("#fileUploadVariation").val().split(".");
            if (check_file_name[1] != "xls" && check_file_name[1] != "xlsx") {
                alert("Sorry This File Format Not Supported");
            }
            else {
                if (confirm("If Upload The File The Previous Item Data Is Erased")) {
                    try {
                        var data = {
                            file_name: CONTEXT.REPORT_PATH + "" + files[0].name,
                            truncate: ($$("ddlFormatVariation").selectedValue() == "True") ? "True" : "False",
                            start_row: parseInt($$("txtStartRow").value()) - 1,
                            end_row: parseInt($$("txtEndRow").value()) - 1,
                            comp_id: localStorage.getItem("user_company_id"),
                            store_no: localStorage.getItem("user_store_no"),
                            user_no: CONTEXT.user_no,
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD
                        }
                        if (data.start_row == null || data.start_row == "" || parseInt(data.start_row) < 0 || typeof data.start_row == "undefined") {
                            $$("txtStartRow").focus();
                            throw "Start Row Should Be Proper";
                        }
                        if (data.end_row == null || data.end_row == "" || parseInt(data.end_row) < 0 || typeof data.end_row == "undefined") {
                            $$("txtEndRow").focus();
                            throw "End Row Should Be Proper";
                        }
                        page.uploadAPI.postSkuValue(data, function (data) {
                            alert("Data Uploaded Successfully");
                            page.controls.pnlUpdateExcelVariationPopup.close();
                            $$("ddlFormatVariation").selectedValue("False");
                            $$("txtStartRow").value("");
                            $$("txtEndRow").value("");
                            $("#fileUploadVariation").val("");
                            e.btnSearch_click();
                        }, function (data) {
                            throw "Some Error Will Occur Please Upload Later";
                        });
                    }
                    catch (e) {
                        alert(e);
                    }
                }
            }
        }
        e.btnManualAlertDaysOK_click = function () {
            var data = {
                expiry_alert_days: $$("txtManualAlertDays").value(),
                comp_id: localStorage.getItem("user_company_id")
            }
            page.itemAPI.putValue(0,data, function (data) {
                alert("Alert Days Updates Successfully");
                page.controls.pnlManualDiscountPopUp.close();
                e.btnSearch_click();
            })
        }
        e.btnManualAlertDaysCancel_click = function () {
           page.controls.pnlManualDiscountPopUp.close();
        }
        e.btnUploadFile_click = function () {
            var _validFileExtensions = [".xls"];
            var files = $("#fileUpload").get(0).files;
            var file_name = $("#fileUpload").val();
            var check_file_name = $("#fileUpload").val().split(".");
            if (check_file_name[1] != "xls") {
                alert("Sorry This File Format Not Supported");
            }
            else {
                if (confirm("If Upload The File The Previous Item Data Is Erased")) {
                    var data = {
                        file_name: CONTEXT.REPORT_PATH + files[0].name
                    }
                    page.uploadAPI.postValue(data, function (data) {
                        alert("Data Uploaded Successfully");
                        $("#fileUpload").val("");
                        page.controls.pnlUpdateExcelPopup.close();
                        e.btnSearch_click();
                    }, function (data) {
                        alert("Some Error Will Occur Please Upload Later");
                    });
                }
            }
        }

        e.btnPrintNewBarcode_click = function () {
            page.controls.pnlPrintNewBarcodePopup.open();
            page.controls.pnlPrintNewBarcodePopup.title("Barcode Print Panel");
            page.controls.pnlPrintNewBarcodePopup.rlabel("Barcode Print Panel");
            page.controls.pnlPrintNewBarcodePopup.width("85%");
            page.controls.pnlPrintNewBarcodePopup.height(600);
            page.controls.ucBarcodePrint.select({});
        }

        e.btnNewMainProductType_click = function(){
            page.controls.pnlNewMainProductType.open();
            page.controls.pnlNewMainProductType.title("Main Product Type");
            page.controls.pnlNewMainProductType.rlabel("Main Product Type");
            page.controls.pnlNewMainProductType.width(400);
            page.controls.pnlNewMainProductType.height(200);
            $$("txtNewMainProductTypeName").focus();
        }
        e.btnNewMainProductTypeSave_click = function () {
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
                        $$("ddlMainPrdType").dataBind(data, "mpt_no", "mpt_name", "None");
                        $$("ddlMainPrdType").selectedValue(mpt_no);
                        $$("msgPanel").flash("Data Saved Successfully...!!!");
                        page.controls.pnlNewMainProductType.close();
                    });
                });
            }
            catch (e) {
                $$("msgPanel").show(e);
                $$("txtNewMainProductTypeName").focus();
            }
        }
        e.btnNewProductType_click = function () {
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
        e.btnNewProductTypeSave_click = function () {
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
                        $$("ddlPrdType").dataBind(data, "ptype_no", "ptype_name", "None");
                        $$("ddlPrdType").selectedValue(prod_type_no);
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


    });
    function selectRow(up) {
        var t = $$("grdItemResult");
        var count = t.grid.dataCount;
        var selected = t.selectedRowIds()[0];
        if (selected) {
            var index = parseInt(t.selectedRowIds()[0]) - 1;
            index = parseInt(index) + parseInt(up ? -1 : 1);
            if (index < 0) index = 0;
            if (index >= count) index = count - 1;
            t.getAllRows()[index].click();
        } else {
            var index;
            index = parseInt(up ? count - 1 : 0);
            t.getAllRows()[index].click();
        }
    }
    var panel = $("[controlid=grdItemResult]").attr('tabindex', 0).focus();
    panel.bind('keydown', function (e) {
        switch (e.keyCode) {
            case 38:    // up
                selectRow(true);
                return false;
            case 40:    // down
                selectRow(false);
                return false;
        }
    });
}

$.fn.itemDetail = function () {
    return $.pageController.getControl(this, function (page, $$, e) {
        detail_page = page;
        page.controlName = "itemDetail";
        page.template("/" + appConfig.root + "/shopon/view/product/item-list/item-detail/item-detail.html?" + new Date());

        page.customerService = new CustomerService();
        page.purchaseService = new PurchaseService();
        page.itemService = new ItemService();
        page.inventoryService = new InventoryService();
        page.trayService = new TrayService();
        page.stockService = new StockService();
        page.stockAPI = new StockAPI();
        page.vendorAPI = new VendorAPI();
        page.itemVariationAPI = new ItemVariationAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.manufactureAPI = new ManufactureAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.eggtrayAPI = new EggTrayAPI();
        page.itemAPI = new ItemAPI();
        page.itemTrayAPI = new ItemTrayAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.itemAttrCacheAPI = new ItemAttrCacheAPI();
        page.itemPriceAPI = new ItemPriceAPI();
        page.fileAPI = new FileAPI();
        page.itemAttributeKey = "";
        page.skuAttributeKey = "";
        page.product_type_no = "-1";
        page.events = {
            btnGenBarCode_click:function(){
                $$("txtBarcode").value(getFullCode($$("txtItemCode").value()));
            },

            btnUploadImage_click: function () {
                var data = new FormData();

                var files = $("#fileUpload").get(0).files;

                // Add the uploaded image content to the form data collection
                if (files.length > 0) {
                    data.append("file", files[0]);

                    // Make Ajax request with the contentType = false, and procesDate = false
                    var ajaxRequest = $.ajax({
                        type: "POST",
                        //url: "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
                        url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                        headers: {
                           //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
                            'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + $$("lblItemNo").value() + '/'
                        },
                        contentType: false,
                        processData: false,
                        data: data
                    });

                    ajaxRequest.done(function (xhr, textStatus) {
                        //alert("Picture uploaded successfully.");
                        $$("msgPanel").show("Picture uploaded successfully...!");
                    });
                }
                else {
                    //alert('Please select only the images before uploading it');
                    $$("msgPanel").show("Please select only the images before uploading it");
                }
            },
            btnSetItemVar_click: function () {
                page.controls.pnlSetVariation.open();
                page.controls.pnlSetVariation.title("Set Variation");
                page.controls.pnlSetVariation.rlabel("Set Variation");
                page.controls.pnlSetVariation.width(800);
                page.controls.pnlSetVariation.height(480);

                $$("grdItemVariation").dataBind(global_attr_list);
                $$("grdItemStockVariation").dataBind(global_attr_list);
            },
            btnActiveItemVar_click: function () {
                var vSData = page.controls.grdVariation.selectedRows();
                var sID = page.controls.grdVariation.selectedRowIds();
                var vGridData = page.controls.grdVariation.allData();
                if (vSData.length > 0) {
                    if (vGridData[sID[0] - 1].active != "1") {
                        var vData = {
                            var_no: vGridData[sID[0] - 1].var_no,
                            active: 1
                        }
                        page.itemVariationAPI.putValue(vGridData[sID[0] - 1].var_no, vData, function (data) {
                            //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                            //    alert("selected variation is Active now...!");
                            //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                            page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data) {
                                    if (data.length > 0) {
                                        page.interface.selectedItemVariation(data);
                                        item_level_stock = data.length;
                                    }
                                    else {
                                        item_level_stock = 0;
                                    }
                                })
                            //})
                        })
                    }
                    else {
                        alert("This variation is already Active...!");
                    }

                }
                else {
                    alert("select a variation to Active...!");
                }
            },
            btnActiveItemVar_click: function () {
                var vSData = page.controls.grdVariation.selectedRows();
                var sID = page.controls.grdVariation.selectedRowIds();
                var vGridData = page.controls.grdVariation.allData();
                if (vSData.length > 0) {
                    if (vGridData[sID[0] - 1].active == "1") {
                        alert("Selected variation is already active...!");
                    } else {
                        var vData = {
                            var_no: vGridData[sID[0] - 1].var_no,
                            active: 1
                        }
                        page.itemVariationAPI.putValue(vGridData[sID[0] - 1].var_no, vData, function (data) {
                            //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                            //    alert("selected variation is Active now...!");
                            //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                            page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data) {
                                    if (data.length > 0) {
                                        page.interface.selectedItemVariation(data);
                                    }
                                    else {
                                        item_level_stock = 0;
                                    }
                                })
                            //})
                        })
                    }
                }
                else {
                    alert("select a variation to Active...!");
                }
            },
            btnRemoveItemVar_click: function () {
                var vSData = page.controls.grdVariation.selectedRows();
                var sID = page.controls.grdVariation.selectedRowIds();
                var vGridData = page.controls.grdVariation.allData();
                if (vSData.length > 0) {
                    if (vGridData[sID[0] - 1].active == "0") {
                        alert("Selected variation is already inactive...!");
                    }
                    else {
                        var vData = {
                            var_no: vGridData[sID[0] - 1].var_no,
                            active: 0
                        }
                    
                        page.itemVariationAPI.putValue(vGridData[sID[0] - 1].var_no, vData, function (data) {
                            //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                            //    alert("selected variation is stop working...!");
                            //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                            page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data) {
                                    if (data.length > 0) {
                                        page.interface.selectedItemVariation(data);
                                    }
                                    else {
                                        item_level_stock = 0;
                                    }
                                })
                            //})
                        })
                    }
                }
                else {
                    alert("select a variation to stop working...!");
                }
            },
            btnAddItemVar_click: function () {
                var attrValues = {
                    var_no: "",
                    attr_type1: page.item_attr_list[0],
                    attr_type2: page.item_attr_list[1],
                    attr_type3: page.item_attr_list[2],
                    attr_type4: page.item_attr_list[3],
                    attr_type5: page.item_attr_list[4],
                    attr_type6: page.item_attr_list[5],
                    attr_value1: "",
                    attr_value2: "",
                    attr_value3: "",
                    attr_value4: "",
                    attr_value5: "",
                    attr_value6: "",
                };
                page.controls.grdVariation.createRow(attrValues);
                //var rows = page.controls.grdVariation.getAllRows();
                //page.controls.grdVariation.edit(true, rows.length);
            },
            btnItemVariationSave_click: function () {
                try {
                    if ((parseFloat($$("grdItemVariation").selectedData().length) + parseFloat($$("grdItemStockVariation").selectedData().length)) > 6) {
                        throw "Maximum Six(6) Variations Only Allowed";
                    }
                    if ($$("grdVariation").allData().length > 0) {
                        throw "You Have Already Set The Variation If You Want This Variation Please Add As A New Product";
                    }
                    $($$("grdVariation").allData()).each(function (i, item) {
                        if (parseFloat(item.qty) > 0)
                            throw "Item Variation Have Stock Qty, Set The Qty To Be Zero For All VAriation And Try Again";
                    });
                    var data = {
                        item_no: page.item_no,
                        var_attribute: "",
                        var_stock_attribute: "",
                        var_attr_key: "",
                        var_stock_attr_key: ""
                    };
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
                    if ((parseInt($$("grdItemVariation").selectedData().length) + parseInt($$("grdItemStockVariation").selectedData().length)) > 6) {
                        throw "Maximum 6 variations only choosen";
                    }
                    page.itemAPI.putValue($$("lblItemNo").value(), data, function (data) {
                        $$("msgPanel").flash("Data Saved Successfully");
                        page.controls.pnlSetVariation.close();
                        page.interface.loadVariation($$("lblItemNo").value(), page.expiry_days);
                    }, function () {
                        $$("msgPanel").show("Some Problem Will Occur Please Try Again Later");
                    });
                }
                catch (e) {
                    $$("msgPanel").show(e);
                }
            },
            btnSaveItem_click: function () {
                try { 
                    var files = $("#fileUpload").get(0).files;
                    var fileName="";
                    // Add the uploaded image content to the form data collection
                    if (files.length > 0) {
                        fileName = files[0];
                    }
                    if ($$("txtAlterUnitFact").value() != "") {
                        if (isNaN($$("txtAlterUnitFact").value())) {
                            $$("txtAlterUnitFact").focus();
                            throw "Alternate Unit Factor is number";
                        }
                    }
                    if ($$("txtExpiryDays").value() != "") {
                        if (isNaN($$("txtExpiryDays").value())) {
                            $$("txtExpiryDays").focus();
                            throw "Expiry days is number";
                        }
                    }
                    $("textarea").each(function () {
                        this.value = this.value.replace(/,/g, "-");
                    });
                    //if ($$("txtAdditionalTax").value() != "") {
                    //    if (isNaN($$("txtAdditionalTax").value())) {
                    //        $$("txtAdditionalTax").focus();
                    //        throw "Additional Tax Should Be A Number And Positive";
                    //    }
                    //}
                    var active;
                    if ($$("chkInclusive").prop("checked"))
                        active = 1;
                    else
                        active = 0;
                    var item_active = ($$("chkItemActive").prop("checked")) ? "1" : "0";
                    var discount_activate = ($$("chkDiscountInclusive").prop("checked")) ? 1 : 0;
                    var draft_bill = ($$("chkDraftBill").prop("checked")) ? 1 : 0;
                    //$(".detail-info").progressBar("show");
                    page.itemAPI.putValue($$("lblItemNo").value(),{
                    //page.itemService.updateItem({
                        item_no: $$("lblItemNo").value(),
                        item_name: $$("txtItemName").value(),
                        model: $$("txtModelName").value(),
                        item_code: $$("txtItemCode").value(),
                        ptype_no: ($$("ddlProductType").selectedValue() == null) ? "-1" : $$("ddlProductType").selectedValue(),
                        cat_no: "-1",//$$("ddlCategory").selectedValue(),
                        man_no: ($$("ddlManufacturer").selectedValue() == null) ? "-1" : $$("ddlManufacturer").selectedValue(),
                        barcode:$$("txtBarcode").value(),
                        tray_no: ($$("ddlTray").selectedValue() == null) ? "-1" : $$("ddlTray").selectedValue(),
                        tag: $$("txtTags").value(),
                        upc: $$("txtUPC").value(),
                        ean: $$("txtEAN").value(),
                        sku: $$("txtSKU").value(),
                        mrp: $$("txtMrpRate").value().substring(0, 20),
                        unit: ($$("itemUnit").selectedValue() == null) ? "-1" : $$("itemUnit").selectedValue(),
                        sku: $$("txtSKU").value(),

                        mansku: $$("txtManSKU").value(),
                        tax_class_no: ($$("ddlTax").selectedValue() == null) ? "-1" : $$("ddlTax").selectedValue(),
                        reorder_level: $$("txtReOrderLevel").value(),
                        reorder_qty: $$("txtReOrderQty").value(),
                        def_vendor_no: ($$("ddlVendor").selectedValue() == null) ? "-1" : $$("ddlVendor").selectedValue(),
                        image_name: fileName.name,
                        qty_type: ($$("qty_type").selectedValue() == null) ? "-1" : $$("qty_type").selectedValue(),
                        key_word: $$("txtKeyWord").val(),
                        packing: $$("txtPacking").value(),
                        expiry_alert_days: $$("txtExpiryAlert").value(),
                        tax_inclusive: active,
                        discount_inclusive: discount_activate,
                        alter_unit: $$("txtAlterUnit").selectedValue(),
                        alter_unit_fact: $$("txtAlterUnitFact").value(),
                        expiry_days: ($$("txtExpiryDays").value() == "") ? "" : parseInt($$("txtExpiryDays").value()),
                        item_description: $$("txtItemDescription").val(),
                        rack_no: $$("txtRackNo").value(),
                        mpt_no: ($$("ddlMainProductType").selectedValue() == null) ? "-1" : $$("ddlMainProductType").selectedValue(),
                        tray_mode: $$("ddlTrayMode").selectedValue(),
                        item_class: $$("ddlItemClass").selectedValue(),
                        active: item_active,
                        draft_bill: draft_bill
                        //additionalTax: $$("txtAdditionalTax").value()
                    }, function (data) {
                        $$("msgPanel").show("Product updated sucessfully...");
                    }
                    );
                    page.itemTrayAPI.searchValues("", "", "item_no=" + $$("lblItemNo").value(), "", function (data) {
                        if (data == '' || data == undefined || data.length ==0) {
                            var trayno;
                            if ($$("ddlTray").selectedValue() == null) {
                                trayno = -1;
                            } else {
                                trayno = $$("ddlTray").selectedValue();
                            }
                            page.itemTrayAPI.postValue({
                                    item_no: $$("lblItemNo").value(),
                                    tray_no: trayno,
                                    comp_id: localStorage.getItem("user_company_id")
                                }, function () {  },
                                function (error) {
                                    $("msgPanel").show("This item is already mapped to the different tray. You cannot map the same item to different trays!!" + error.message);
                                });
                        }
                        else {
                            $(data).each(function (i, item) {
                                var trayno;
                                if ($$("ddlTray").selectedValue() == null) {
                                    trayno = -1;
                                } else {
                                    trayno = $$("ddlTray").selectedValue();
                                }
                                var data1 = {
                                    item_tray_no: item["item_tray_no"],
                                    item_no: $$("lblItemNo").value(),
                                    tray_no: trayno,
                                    comp_id: localStorage.getItem("user_company_id")
                                };
                                $$("msgPanel").show("Updating product for item...");
                                page.itemTrayAPI.putValue(data1.item_tray_no, data1, function (data) {
                                    $$("msgPanel").hide();
                                });
                            });
                        }
                    });
                } catch (e) {
                    alert(e)
                }
            },
            btnRemove_click: function () {
                $("msgPanel").show("Removing Item...");
                var data = {
                    item_no: $$("lblItemNo").value()
                }
                page.itemAPI.deleteValue($$("lblItemNo").value(), data, function (data) {
                    $("msgPanel").show("product removed...");
                    $$("lblItemNo").value('');
                    $$("txtItemName").value('');
                    $$("txtModelName").value("");
                    $$("txtItemCode").value('');
                    $$("ddlMainProductType").selectedValue('');
                    $$("ddlProductType").selectedValue('');
                    $$("ddlCategory").selectedValue('');
                    $$("ddlManufacturer").selectedValue('');
                    $$("txtTags").value('');

                    $$("txtUPC").value('');
                    $$("txtEAN").value('');
                    $$("txtSKU").value('');
                    $$("txtManSKU").value('');

                    $$("ddlTax").selectedValue('');
                    $$("txtPrice").value('');

                    $$("lblInStock").value('');
                    item.qty_stock = 0;
                    $$("lblInStockAmount").value('');
                    $$("txtReOrderLevel").value('');
                    $$("txtReOrderQty").value('');
                    $$("ddlVendor").selectedValue('');

                    $$("txtKeyWord").val('');

                    $$("txtPacking").value('');
                    $$("txtAlterUnit").selectedValue('-1');
                    $$("txtAlterUnitFact").value('');
                    $$("txtExpiryAlert").value('');
                    $$("txtItemDescription").val('');
                    //$$("txtAdditionalTax").val('');
                    $$("ddlItemClass").selectedValue('Goods');
                });
            },
            btnAddAttr_click: function () {
                var attr = page.controls.ddlAttrName.selectedData();
                var data = {};
                data.attr_no = attr.attr_no;
                data.item_no = $$("lblItemNo").value();

                if (attr.attr_type == "Number") {
                    data.attr_val_name = page.controls.txtAttrValue.value();
                } else {
                    var attrval = page.controls.ddlAttrValue.selectedData();
                    data.attr_val_no = attrval.val_no;
                    data.attr_val_name = attrval.val_name;
                }

                $$("msgPanel").show("Inserting attributes...");

            },
            page_init: function () { },
            page_load: function () {
                page.imgData = [];
                $$("fuTest").fileAdded = function (fileData) {

                    var attrCacheData = {
                        type: "ITEM",
                        item_no: page.item_no,
                        attr_no: 150,
                        attr_value: fileData[0].file_no,
                        attr_text:  fileData[0].file_name,
                        comp_id: getCookie("user_company_id")
                    }

                    page.itemAttrCacheAPI.postValue(attrCacheData, function (attrData) {
                        page.imgData.push({
                            file_no: fileData[0].file_no,
                            file_data: fileData[0].file_data,
                            file_type: fileData[0].file_type,
                            file_path: fileData[0].file_path,
                            item_attr_no: attrData[0].key_value
                        })
                        loadImages(page.imgData);
                    })
                }
                loadImages = function (data) {
                    if (CONTEXT.IMAGE_UPLOAD_TYPE=="FILE") {
                        setTimeout(function () {
                            loadforImages(data);
                        }, 2500);
                    } else {
                        loadforImages(data);
                    }

                }
                loadforImages = function (data) {
                    var html = "";
                    if (data.length > 0) {
                        html = html + '<div class="col-lg-12">';
                        html = html + '<div class="col-lg-12" style="border: solid 1px #d8d2d2;" >';
                        if (CONTEXT.IMAGE_UPLOAD_TYPE == "DB") {
                            html = html + '<img class="prd-img-upload-big" id="idUpImage" src="' + encodeURI(data[data.length - 1].file_data) + '"/>';
                        } else {
                            html = html + '<img class="prd-img-upload-big" id="idUpImage" src="' + encodeURI(data[data.length - 1].file_path) + '"/>';
                        }

                        html = html + '</div>';
                        html = html + '<div class="grid-slider">';
                        html = html + '<div class="grid-slider-images">';
                        $(data).each(function (i, item) {
                            if (i == 0) {
                                html = html + '<div class="prd-img-upload-div active-img-div" id="idImageDiv' + i + '" >';
                            } else {
                                html = html + '<div class="prd-img-upload-div" id="idImageDiv' + i + '" >';
                            }

                            html = html + '<div class="product-list">';
                            html = html + '<span style="display:none">' + item.item_attr_no + ' </span>';
                            html = html + '<span style="display:none">' + item.file_no + ' </span>';
                            html = html + '<span style="float:right"><i class="fa fa-remove" onClick="removeImage(' + i + ');" ></i> </span>';
                            if (CONTEXT.IMAGE_UPLOAD_TYPE == "DB")
                                html = html + '<img class="prd-img-upload" id="idImage' + i + '" src="' + encodeURI(item.file_data) + '" onClick="previewImage(this,' + i + ');" />';
                            else
                                html = html + '<img class="prd-img-upload" id="idImage' + i + '" src="' + encodeURI(item.file_path) + '" onClick="previewImage(this,' + i + ');" />';
                            html = html + '</div>';
                            html = html + '</div>';
                        })
                        html = html + '</div>';
                        html = html + '</div>';
                        html = html + '</div>';
                    }
                    $$("grdFilesUploaded").html(html);
                    Window.no_of_images = parseInt(page.imgData.length);
                    Window.no_of_images_server = parseInt(page.imgData.length);
                    if (CONTEXT.ENABLE_MULTIPLE_IMAGE) {
                        $$("pnlImageUpload").show();
                    } else {
                        $$("pnlImageUpload").hide();
                    }
                }
                previewImage = function (element, i) {
                    document.getElementById("idUpImage").setAttribute("src", element.getAttribute("src"));
                    $(page.imgData).each(function (j, item) {
                        $("#idImageDiv" + j).removeClass("active-img-div");
                    })
                    $("#idImageDiv" + i).addClass("active-img-div");
                }
                removeImage = function (index) {
                    if (confirm("Are you sure want to remove the image?")) {
                        var fileData = {
                            file_no: page.imgData[index].file_no
                        }

                        page.fileAPI.deleteValue(fileData, function (attrData) {
                            var data = {
                                start_record: 0,
                                end_record: "",
                                filter_expression: " type='ITEM' and attr_no=150 and attr_value='" + page.imgData[index].file_no + "'",
                                sort_expression: " attr_no "
                            }
                            page.itemAttrCacheAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                                if (data.length > 0) {
                                    var attrData = {
                                        item_attr_no: data[0].item_attr_no
                                    }
                                    page.itemAttrCacheAPI.deleteValue(attrData, function () {
                                        alert("Image removed successfully");
                                        page.imgData.splice(index, 1);
                                        loadImages(page.imgData);
                                    })
                                }
                            })
                        })
                    }

                }
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
                        $$("ddlProductType").selectedValue(page.product_type_no);
                    });
                });


                page.eggtrayAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlTray.dataBind(data, "tray_id", "tray_name", "None")
                });
                page.manufactureAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlManufacturer.dataBind(data, "man_no", "man_name", "None");
                });

                page.taxclassAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                });

                if (CONTEXT.ENABLE_IMAGE == "true") {
                    $$("pnlImg").show();
                }
                else {
                    $$("pnlImg").hide();
                }

                if (CONTEXT.ENABLE_MODULE_TRAY) {
                    $$("pnlTray").show();
                    $$("pnlTrayMode").show();
                } else {
                    $$("pnlTray").hide();
                    $$("pnlTrayMode").hide();
                }

                if (CONTEXT.SHOW_BARCODE) {
                    $$("pnlBarCode").show();
                } else {
                    $$("pnlBarCode").hide();
                }

                if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                    $$("pnlMainProductType").show();
                    $$("pnlProductType").show();
                    $$("pnlKeyword").hide();
                } else {
                    $$("pnlMainProductType").hide();
                    $$("pnlProductType").hide();
                    $$("pnlKeyword").hide();
                }
                if (CONTEXT.ENABLE_PACK) {
                    $$("pnlPacking").show();
                }
                else {
                    $$("pnlPacking").hide();
                }

                if (CONTEXT.ENABLE_REORDER_LEVEL) {
                    $$("pnlReorderLevel").show();
                    $$("pnlReorderQty").show();
                } else {
                    $$("pnlReorderLevel").hide();
                    $$("pnlReorderQty").hide();
                }
                if (CONTEXT.ENABLE_ALTER_UNIT) {
                    $$("pnlAlternativeUnit").show();
                    $$("pnlAlternativeUnitFactor").show();
                } else {
                    $$("pnlAlternativeUnit").hide();
                    $$("pnlAlternativeUnitFactor").hide();
                }
                if (CONTEXT.ENABLE_EXP_DAYS_MODE) {
                    $$("pnlExpiryDays").show();
                } else {
                    $$("pnlExpiryDays").hide();
                }
                if (CONTEXT.ENABLE_MANUFACTURE) {
                    $$("pnlManufacturer").show();
                } else {
                    $$("pnlManufacturer").hide();
                }
                if (CONTEXT.ENABLE_TAX_MODULE) {
                    $$("pnlTax").show();
                }
                else {
                    $$("pnlTax").hide();
                }
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    $$("pnlTaxInclusive").show();
                } else {
                    $$("pnlTaxInclusive").hide();
                }
                if (CONTEXT.ENABLE_DISCOUNT_INCLUSION) {
                    $$("pnlDiscountInclusive").show();
                } else {
                    $$("pnlDiscountInclusive").hide();
                }
                if (CONTEXT.ENABLE_EXP_ALERT) {
                    $$("pnlExpiryAlert").show();
                } else {
                    $$("pnlExpiryAlert").hide();
                }
                if (CONTEXT.ENABLE_RACK) {
                    $$("pnlRack").show();
                } else {
                    $$("pnlRack").hide();
                }
                if (CONTEXT.ENABLE_ITEM_DESCRIPTION) {
                    page.controls.pnlItemDescription.show();
                } else {
                    page.controls.pnlItemDescription.hide();
                }
                if (CONTEXT.ENABLE_QR_CODE) {
                    $$("pnlQrCode").show();
                }
                else {
                    $$("pnlQrCode").hide();
                }
                $$("txtItemName").focus();
            },
            btnNewMainProductType_click:function(){
                page.controls.pnlNewMainProductType.open();
                page.controls.pnlNewMainProductType.title("Main Product Type");
                page.controls.pnlNewMainProductType.rlabel("Main Product Type");
                page.controls.pnlNewMainProductType.width(400);
                page.controls.pnlNewMainProductType.height(200);
                $$("txtNewMainProductTypeName").focus();
            },
            btnNewMainProductTypeSave_click: function () {
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
                            $$("msgPanel").flash("Data Saved Successfully...!!!");
                            page.controls.pnlNewMainProductType.close();
                        });
                    });
                }
                catch (e) {
                    $$("msgPanel").show(e);
                    $$("txtNewMainProductTypeName").focus();
                }
            },
            btnNewProductType_click: function () {
                page.controls.pnlNewProductType.open();
                page.controls.pnlNewProductType.title("Product Type");
                page.controls.pnlNewProductType.rlabel("Product Type");
                page.controls.pnlNewProductType.width(400);
                page.controls.pnlNewProductType.height(200);
                page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlmymainproduct").dataBind(data, "mpt_no", "mpt_name", "None");
                });
                $$("txtNewProductTypeName").focus();
            },
            btnNewProductTypeSave_click: function () {
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
                            $$("msgPanel").flash("Product type saved successfully...!");
                            page.controls.pnlNewProductType.close();
                        });
                    });
                }
                catch (e) {
                    $$("msgPanel").show(e);
                    $$("txtNewProductTypeName").focus();
                }
            },
            btnbtnNewVendor_click: function () {
                page.controls.pnlNewVendor.open();
                page.controls.pnlNewVendor.title("New Supplier");
                page.controls.pnlNewVendor.rlabel("New Supplier");
                page.controls.pnlNewVendor.width(500);
                page.controls.pnlNewVendor.height(600);
                page.controls.ucVendorEdit.select({});
            },
            btnSaveVendor_click: function () {
                page.controls.ucVendorEdit.save(function (data1) {
                    page.vendorAPI.searchValues("", "", "", "", function (data) {
                        page.controls.ddlVendor.dataBind(data, "vendor_no", "vendor_name", "None");
                        page.controls.ddlVendor.selectedValue(data1[0].vendor_no);
                        page.controls.pnlNewVendor.close();
                    });
                });
            },
            btnNewManufacture_click: function () {
                page.controls.pnlNewManufacture.open();
                page.controls.pnlNewManufacture.title("New Manufacture");
                page.controls.pnlNewManufacture.rlabel("New Manufacture");
                page.controls.pnlNewManufacture.width(500);
                page.controls.pnlNewManufacture.height(500);
                page.controls.ucManufactureEdit.select({});
            },
            btnSaveManufacture_click: function () {
                $$("msgPanel").show("Inserting new manufacturer...");
                page.controls.ucManufactureEdit.save(function (data1) {
                    page.manufactureAPI.searchValues("", "", "", "", function (data) {
                        page.controls.ddlManufacturer.dataBind(data, "man_no", "man_name", "None");
                        page.controls.ddlManufacturer.selectedValue(data1.man_no);
                        page.controls.pnlNewManufacture.close();
                        $$("msgPanel").flash("New manufacturer saved successfully...");
                    });
                });
            },
            btnbtnNewTray_click: function () {
                page.controls.pnlNewTrayPopup.open();
                page.controls.pnlNewTrayPopup.title("Create New Tray");
                page.controls.pnlNewTrayPopup.rlabel("Create New Tray");
                page.controls.pnlNewTrayPopup.width(300);
                page.controls.pnlNewTrayPopup.height(300);
                page.controls.txtTrayName.val('');
                page.controls.txtTrayDesc.val('');
                $$("txtTrayName").focus();
            },
            btnAddTrayOK_click: function () {
                $$("btnAddTrayOK").disable(true);
                try {
                    if ($$("txtTrayName").val() == "") {
                        alert("Tray name is mandatory...!");
                        $$("txtTrayName").focus();
                    }
                    else {
                        var input = {
                            tray_name: page.controls.txtTrayName.value(),
                            tray_desc: page.controls.txtTrayDesc.value(),
                            comp_id: localStorage.getItem("user_company_id")
                        };
                        $$("msgPanel").show("Inserting tray...!");
                        page.eggtrayAPI.postValue(input, function (data) {
                            $$("msgPanel").show("Tray inserted successfully...!");
                            var tray_id = data[0].key_value;
                            page.eggtrayAPI.searchValues("", "", "", "", function (data) {
                                page.controls.ddlTray.dataBind(data, "tray_id", "tray_name", "None");
                                page.controls.ddlTray.selectedValue(tray_id);
                                $$("pnlNewTrayPopup").close();
                                $$("btnAddTrayOK").disable(false);
                            });
                        },
                            function (error) {
                                alert('This item is already mapped to the different tray. You cannot map the same item to different trays. ' + error.message);
                                $$("btnAddTrayOK").disable(false);
                            });
                    }
                }
                catch (e) {
                    alert('This item is already mapped to the different tray. You cannot map the same item to different trays.');
                    $$("btnAddTrayOK").disable(false);
                }
            }
            
        };

        page.validation = {};
        page.interface.loadMultipleImages = function (itemNo) {
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: " type='ITEM' and attr_no=150 and item_no=" + itemNo,
                sort_expression: " attr_value "
            }
            page.itemAttrCacheAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                var filenos = "";
                $(data).each(function (i, item) {
                    if (i == 0)
                        filenos = filenos+"'" + item.attr_value + "'";
                    else
                        filenos = filenos+",'" + item.attr_value + "'";
                });
                if (filenos != "")
                {
                    var filter = " file_no in (" + filenos + ")";
                    $.server.webMethodGET("propon/files?filter=" + filter, function (data) {
                        page.imgData = data;
                        loadImages(data);
                    });
                } else {
                    loadImages([]);
                }

                
            })
        }
        page.interface.loadVariation = function (itemNo, exp_days) {
            page.item_no = itemNo;
            page.expiry_days = exp_days;
            page.itemAPI.getValue(itemNo, function (variation_data) {
                page.qty_type = variation_data[0].qty_type;
                page.vendor_no = variation_data[0].vendor_no;
                if (variation_data[0].var_attribute != null && variation_data[0].var_attribute != "" && typeof variation_data[0].var_attribute != "undefined") {
                    page.string_item_attr_list = variation_data[0].var_attribute;
                    page.item_attr_list = variation_data[0].var_attribute.split(",");
                }
                if (variation_data[0].var_stock_attribute != null && variation_data[0].var_stock_attribute != "" && typeof variation_data[0].var_stock_attribute != "undefined") {
                    page.string_storck_attr_list = variation_data[0].var_stock_attribute;
                    page.storck_attr_list = variation_data[0].var_stock_attribute.split(",");
                }
                if (variation_data[0].var_attr_key != null && variation_data[0].var_attr_key != "" && typeof variation_data[0].var_attr_key != "undefined") {
                    page.string_item_attr_key_list = variation_data[0].var_attr_key;
                    page.item_attr_key_list = variation_data[0].var_attr_key.split(",");
                }
                if (variation_data[0].var_stock_attr_key != null && variation_data[0].var_stock_attr_key != "" && typeof variation_data[0].var_stock_attr_key != "undefined") {
                    page.storck_attr_key_list = variation_data[0].var_stock_attr_key.split(",");
                    page.string_stock_attr_list = variation_data[0].var_stock_attr_key;
                }
                //page.stockAPI.searchStocksMain(page.item_no, localStorage.getItem("user_store_no"), function (data) {
                //page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_store_no"), function (data1) {
                page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data1) {
                        if(data1.length>0){
                            page.interface.selectedItemVariation(data1);
                            item_level_stock = data1.length;
                            global_isVarSet = true;
                        }
                        else {
                            page.interface.selectedItemVariation([]);
                            item_level_stock = 0;
                            global_isVarSet = false;
                        }

                    });
               // });
                //page.loadItemVariation(variation_data[0]);
            });
        }
        page.interface.selectedItemVariation= function (data) {
            var grdVariationWidth = 150;
            if (CONTEXT.ENABLE_VARIATION)
                grdVariationWidth = grdVariationWidth + 110;
            if (CONTEXT.ENABLE_BAT_NO)
                grdVariationWidth = grdVariationWidth + 80;
            else {
                grdVariationWidth = grdVariationWidth + 110;
            }
            if (CONTEXT.ENABLE_EXP_DATE)
                grdVariationWidth = grdVariationWidth + 100;
            if (CONTEXT.ENABLE_MAN_DATE)
                grdVariationWidth = grdVariationWidth + 110;
            if (typeof page.string_item_attr_key_list != "undefined") {
                var grdWidth = 100;
                //if (page.item_attr_key_list.length - 1 >= 1)
                //    grdWidth = grdWidth + 10
                if (page.item_attr_key_list.length - 1 >= 2)
                    grdWidth = grdWidth + 20;
                if (page.item_attr_key_list.length - 1 >= 3)
                    grdWidth = grdWidth + 25;
                if (page.item_attr_key_list.length - 1 >= 4)
                    grdWidth = grdWidth + 30;
                if (page.item_attr_key_list.length - 1 >= 5)
                    grdWidth = grdWidth + 25;
                page.controls.grdVariation.width(grdWidth + "%");
                //page.controls.grdVariation.width("120%") //grdVariationWidth + "px");//940px;
                page.controls.grdVariation.height("98px");
                page.controls.grdVariation.setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[0]), 'rlabel': getAttributeName(page.string_item_attr_key_list.split(",")[0]), 'width': "130px;margin-top:0px;", 'dataField': "attributes1", visible: (page.item_attr_key_list.length - 1 >= 0), editable: true, itemTemplate: "<div  id='Attributes1'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[1]), 'rlabel': getAttributeName(page.string_item_attr_key_list.split(",")[1]), 'width': "130px;margin-top:0px;", 'dataField': "attributes2", visible: (page.item_attr_key_list.length - 1 >= 1), editable: true, itemTemplate: "<div  id='Attributes2'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[2]), 'rlabel': getAttributeName(page.string_item_attr_key_list.split(",")[2]), 'width': "100px;margin-top:0px;", 'dataField': "attributes3", visible: (page.item_attr_key_list.length - 1 >= 2), editable: true, itemTemplate: "<div  id='Attributes3'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[3]), 'rlabel': getAttributeName(page.string_item_attr_key_list.split(",")[3]), 'width': "100px;margin-top:0px;", 'dataField': "attributes4", visible: (page.item_attr_key_list.length - 1 >= 3), editable: true, itemTemplate: "<div  id='Attributes4'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[4]), 'rlabel': getAttributeName(page.string_item_attr_key_list.split(",")[4]), 'width': "100px;margin-top:0px;", 'dataField': "attributes5", visible: (page.item_attr_key_list.length - 1 >= 4), editable: true, itemTemplate: "<div  id='Attributes5'></div>" },
                        { 'name': getAttributeName(page.string_item_attr_key_list.split(",")[5]), 'rlabel': getAttributeName(page.string_item_attr_key_list.split(",")[5]), 'width': "100px;margin-top:0px;", 'dataField': "attributes6", visible: (page.item_attr_key_list.length - 1 >= 5), editable: true, itemTemplate: "<div  id='Attributes6'></div>" },
                        { 'name': "Stock", 'width': "100px", 'dataField': "qty" },
                        { 'name': "", 'width': "40px", 'dataField': "var_no", editable: false, itemTemplate: "<div  id='prdDetail' style=''></div>" },
                        { 'name': "", 'width': "0px", 'dataField': "vendor_no", visible: false },
                        { 'name': "", 'width': "auto", 'dataField': "var_no", visible: false },
                    ]
                });
                page.controls.grdVariation.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "ActiveVariation") {
                        if (confirm("Are you sure want to active this variation")) {
                            var vData = {
                                var_no: rowData.var_no,
                                active: 1
                            }
                            page.itemVariationAPI.putValue(rowData.var_no, vData, function (data) {
                                page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data) {
                                    page.interface.selectedItemVariation(data);
                                    item_level_stock = data.length;
                                    $$("msgPanel").flash("Variation activated successfully");
                                });
                            });
                        }
                    }
                    if (action == "DeActiveVariation") {
                        if (confirm("Are you sure want to deactive this variation")) {
                            var vData = {
                                var_no: rowData.var_no,
                                active: 0
                            }
                            page.itemVariationAPI.putValue(rowData.var_no, vData, function (data) {
                                page.stockAPI.searchVariationsMain(page.item_no, localStorage.getItem("user_fulfillment_store_no"), function (data) {
                                    page.interface.selectedItemVariation(data);
                                    item_level_stock = data.length;
                                    $$("msgPanel").flash("Variation deactivated successfully");
                                });
                            });
                        }
                    }
                }
                $$("grdVariation").rowBound = function (row, item) {
                    var attrTemplate = [];
                    if (item.attr_type1 == "exp_date" || item.attr_type1 == "man_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value1' style='width:100px;' >");
                    }
                    else {
                        attrTemplate.push("<input type='text' dataField='attr_value1' style='width:80px;'>");
                    }
                    $(row).find("[id=Attributes1]").html(attrTemplate.join(""));
                    $(row).find("input[dataField=net_rate]").val(item.net_rate);

                    var attrTemplate = [];
                    if (item.attr_type2 == "man_date") {
                        attrTemplate.push("<input type='date' dataField='attr_value2' style='width:100px;'>");
                    }
                    else {
                        attrTemplate.push("<input type='text' dataField='attr_value2' style='width:80px;'>");
                    }
                    $(row).find("[id=Attributes2]").html(attrTemplate.join(""));

                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value3' style='width:80px;'>");
                    $(row).find("[id=Attributes3]").html(attrTemplate.join(""));
                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value4' style='width:80px;'>");
                    $(row).find("[id=Attributes4]").html(attrTemplate.join(""));
                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value5' style='width:80px;'>");
                    $(row).find("[id=Attributes5]").html(attrTemplate.join(""));
                    var attrTemplate = [];
                    attrTemplate.push("<input type='text' dataField='attr_value6' style='width:80px;'>");
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
                    if (item.attr_value1 != "") {
                        if (item.active == "0") {
                            htmlTemplate.push("<input type='button'  class='grid-button' value='' action='ActiveVariation' style='background-image: url(BackgroundImage/add.png);background-size: contain;background-color: transparent;width: auto;background-repeat: no-repeat;width: 15px;border: none;cursor: pointer;'/>");
                        }
                        else {
                            htmlTemplate.push("<input type='button'  class='grid-button' value='' action='DeActiveVariation' style='background-image: url(BackgroundImage/cancel.png);background-size: contain;background-color: transparent;width: auto;background-repeat: no-repeat;width: 15px;border: none;cursor: pointer;'/>");
                        }
                    }
                    $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));
                }

                page.controls.grdVariation.dataBind(data);
                item_level_stock = $$("grdVariation").allData().length;                
            }
            //page.controls.grdVariation.edit(true);
            if ($$("grdVariation").allData().length == 0) {
                $$("btnSetItemVar").show();
                $$("btnSetItemVar").selectedObject.next().show();
            }
            else {
                $$("btnSetItemVar").hide();
                $$("btnSetItemVar").selectedObject.next().hide();
            }
        }
        page.interface.saveVariation = function () {
            var vGridData = page.controls.grdVariation.allData();
            //var vGridData = page.controls.grdVariation.getAllRows();
            var iData = [];
            var uData = [];
            $(vGridData).each(function (i, item) {
                //var var_no = $(item).find("[datafield=var_no]").find("div").html();
                //var attr_value1 = $(item).find("[datafield=attr_value1]").find("div").find("input").val();
                //var attr_value2 = $(item).find("[datafield=attr_value2]").find("div").find("input").val();
                //var attr_value3 = $(item).find("[datafield=attr_value3]").find("div").find("input").val();
                //var attr_value4 = $(item).find("[datafield=attr_value4]").find("div").find("input").val();
                //var attr_value5 = $(item).find("[datafield=attr_value5]").find("div").find("input").val();
                //var attr_value6 = $(item).find("[datafield=attr_value6]").find("div").find("input").val();
                var var_no = item.var_no;
                var attr_value1 = item.attr_value1;
                var attr_value2 = item.attr_value2;
                var attr_value3 = item.attr_value3;
                var attr_value4 = item.attr_value4;
                var attr_value5 = item.attr_value5;
                var attr_value6 = item.attr_value6;
                var strVar = "";
                i = 0;
                if (attr_value1 != "") {
                    if (strVar !="")
                        strVar = strVar + '-' + page.string_item_attr_list.split(',')[i] + "-" + attr_value1
                    else
                        strVar = page.string_item_attr_list.split(',')[i] + "-" + attr_value1
                    i++;
                }
                if (attr_value2 != "") {
                    if (strVar != "")
                        strVar = strVar + '-' + page.string_item_attr_list.split(',')[i] + "-" + attr_value2
                    else
                        strVar = page.string_item_attr_list.split(',')[i] + "-" + attr_value2
                    i++;
                }
                if (attr_value3 != "") {
                    if (strVar != "")
                        strVar = strVar + '-' + page.string_item_attr_list.split(',')[i] + "-" + attr_value3
                    else
                        strVar = page.string_item_attr_list.split(',')[i] + "-" + attr_value3
                    i++;
                }
                if (attr_value4 != "") {
                    if (strVar != "")
                        strVar = strVar + '-' + page.string_item_attr_list.split(',')[i] + "-" + attr_value4
                    else
                        strVar = page.string_item_attr_list.split(',')[i] + "-" + attr_value4
                    i++;
                }
                if (attr_value5 != "") {
                    if (strVar != "")
                        strVar = strVar + '-' + page.string_item_attr_list.split(',')[i] + "-" + attr_value5
                    else
                        strVar = page.string_item_attr_list.split(',')[i] + "-" + attr_value5
                    i++;
                }
                if (attr_value6 != "") {
                    if (strVar != "")
                        strVar = strVar + '-' + page.string_item_attr_list.split(',')[i] + "-" + attr_value6
                    else
                        strVar = page.string_item_attr_list.split(',')[i] + "-" + attr_value6
                    i++;
                }
                if (attr_value1 != "" || attr_value2 != "" || attr_value3 != "" || attr_value4 != "" || attr_value5 != "" || attr_value6 != "") {
                    if (var_no == "") {
                        iData.push({
                            var_no: item.var_no,
                            store_no: getCookie("user_store_id"),
                            item_no: page.item_no,
                            variation_name: strVar,
                            active: 1,
                            user_no: getCookie("user_id"),
                            attr_type1: (attr_value1 != "") ? page.item_attr_list[0] : "",
                            attr_value1: (attr_value1 != "") ? attr_value1 : "",
                            attr_type2: (attr_value2 != "") ? page.item_attr_list[1] : "",
                            attr_value2: (attr_value2 != "") ? attr_value2 : "",
                            attr_type3: (attr_value3 != "") ? page.item_attr_list[2] : "",
                            attr_value3: (attr_value3 != "") ? attr_value3 : "",
                            attr_type4: (attr_value4 != "") ? page.item_attr_list[3] : "",
                            attr_value4: (attr_value4 != "") ? attr_value4 : "",
                            attr_type5: (attr_value5 != "") ? page.item_attr_list[4] : "",
                            attr_value5: (attr_value5 != "") ? attr_value5 : "",
                            attr_type6: (attr_value6 != "") ? page.item_attr_list[5] : "",
                            attr_value6: (attr_value6 != "") ? attr_value6 : "",
                        });
                    }
                }

            })
            if (iData.length > 0) {
                page.itemVariationAPI.multiPostValue(iData, function (data) {
                    console.log("new variation sucessfully created..!");
                }, function (error) {
                })
            }
        }
        page.interface.saveDetail = function () {
            page.events.btnSaveItem_click();
        }
        page.interface.setItemVariation = function () {
            page.events.btnSetItemVar_click();
        }
        page.interface.addItemVariation = function () {
            page.events.btnAddItemVar_click();
        }
        page.interface.removeDetail = function () {
            page.events.btnRemove_click();
        }
        page.interface.load = function (item_no, itemData) {
            page.product_type_no = itemData.ptype_no;
            page.interface.loadVariation(item_no, page.expiry_days);
            Window.selected_item_no = item_no;
            $$("pnlImageUpload").hide();
            page.interface.loadMultipleImages(item_no);
            $$("txtPrice").disable(true);
            $$("txtMrpRate").disable(true);

            page.controls.grdItemVariation.width("100%");
            page.controls.grdItemVariation.height("250px");
            page.controls.grdItemVariation.setTemplate({
                selection: "Multiple",
                columns: [
                    { 'name': "Name", 'width': "200px", 'dataField': "attr_name" },
                    { 'name': "", 'width': "0px", 'dataField': "attr_no", visible: false },
                    { 'name': "", 'width': "0px", 'dataField': "attr_no_key", visible: false }
                ]
            });
            page.controls.grdItemVariation.rowBound = function (row, item) {
                var hide = true;
                if ($$("grdVariation").allData().length != 0) {
                    $(page.itemAttributeKey.split(",")).each(function (i, var_item) {
                        if (var_item == item.attr_no_key) {
                            row.find(".grid_select input[type=checkbox]").prop("checked", true);
                            hide = false;
                        }
                    });
                    if (page.itemAttributeKey == null || page.itemAttributeKey == "")
                        hide = false;
                    if (hide) {
                        row.css("display", "none");
                    }
                }
            }
            $$("grdItemVariation").selectionChanged = function (row, item1) {
                page.itemAttributeAPI.searchValue(0, "", "", "", "", function (data) {// attr_no_key not in(100,101,102)
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
            page.controls.grdItemStockVariation.height("250px");
            page.controls.grdItemStockVariation.setTemplate({
                selection: "Multiple",
                columns: [
                    { 'name': "Name", 'width': "200px", 'dataField': "attr_name" },
                    { 'name': "", 'width': "0px", 'dataField': "attr_no", visible: false }
                ]
            });
            page.controls.grdItemStockVariation.rowBound = function (row, item) {
                if ($$("grdVariation").allData().length != 0) {
                    var hide = true;
                    $(page.skuAttributeKey.split(",")).each(function (i, var_item) {
                        if (var_item == item.attr_no_key) {
                            row.find(".grid_select input[type=checkbox]").prop("checked", true);
                            hide = false;
                            hide = (page.itemAttributeKey.split(",").includes(item.attr_no_key)) ? true : false;
                        }
                    });
                    if (page.skuAttributeKey == null || page.skuAttributeKey == "")
                        hide = false;
                    if (hide) {
                        row.css("display", "none");
                    }
                }
            }
            $$("grdItemStockVariation").dataBind([]);
            page.vendorAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlVendor.dataBind(data, "vendor_no", "vendor_name", "None");
                $("textarea").each(function () {
                    this.value = this.value.replace(/-/g, ",");
                });
                page.itemAPI.getValue(item_no, function (data) {
                    var item = data[0];

                    $$("lblItemNo").value(item.item_no);
                    page.item_no = $$("lblItemNo").value();
                    $$("txtItemName").value(item.item_name);
                    $$("txtModelName").value(item.model);
                    page.item_name = item.item_name;
                    $$("txtItemCode").value(item.item_code);
                    $$("ddlCategory").selectedValue(item.cat_no);
                    $$("ddlMainProductType").selectedValue(item.mpt_no);
                    $$("ddlProductType").selectedValue(item.ptype_no);
                    $$("ddlManufacturer").selectedValue(item.man_no);
                    $$("txtTags").value(item.tag);
                    $$("ddlTray").selectedValue(item.tray_no);
                    $$("txtUPC").value(item.upc);
                    $$("txtEAN").value(item.ean);
                    $$("txtSKU").value(item.sku);
                    $$("txtManSKU").value(item.mansku);
                    if (item.unit == "null" || item.unit == null || item.unit == "" || item.unit == undefined)
                        $$("itemUnit").selectedValue("No Unit");
                    else
                        $$("itemUnit").selectedValue(item.unit);
                    $$("txtBarcode").value(item.barcode);
                    $$("txtExpiryDays").value(item.expiry_days);
                    $$("txtRackNo").value(item.rack_no);

                    $$("ddlTax").selectedValue(item.tax_class_no);

                    $$("qty_type").selectedValue(item.qty_type);
                    $$("lblInStock").value(item.qty_stock);
                    global_item_stock = item.qty_stock;
                    $$("lblInStockAmount").value(item.qty_stock_amount);
                    $$("txtReOrderLevel").value(item.reorder_level);
                    $$("txtReOrderQty").value(item.reorder_qty);
                    $$("ddlVendor").selectedValue(item.def_vendor_no);

                    $$("txtKeyWord").val(item.key_word);
                    $$("txtPacking").value(item.packing);
                    $$("txtAlterUnit").selectedValue(item.alter_unit);
                    $$("txtAlterUnitFact").value(item.alter_unit_fact);
                    $$("ddlTrayMode").selectedValue(item.tray_mode);
                    $$("ddlItemClass").selectedValue(item.item_class);
                    if (item.tax_inclusive == 1) {
                        $$("chkInclusive").prop('checked', true);
                    }
                    else {
                        $$("chkInclusive").prop('checked', false); 
                    }
                    if (item.discount_inclusive == 1) {
                        $$("chkDiscountInclusive").prop('checked', true);
                    }
                    else {
                        $$("chkDiscountInclusive").prop('checked', false);
                    }
                    if (item.active == "1") {
                        $$("chkItemActive").prop('checked', true);
                    }
                    else {
                        $$("chkItemActive").prop('checked', false);
                    }
                    if (item.draft_bill == 1) {
                        $$("chkDraftBill").prop('checked', true);
                    }
                    else {
                        $$("chkDraftBill").prop('checked', false);
                    }
                    if (item.barcode == null || (item.barcode).length == 0) {
                        $$("btnGenBarCode").show();
                    } else {
                        $$("btnGenBarCode").hide();
                    }
                    $$("txtExpiryAlert").value(item.expiry_alert_days);
                    $$("txtItemDescription").val(item.item_description);
                    //$$("txtAdditionalTax").val(item.additionalTax);
                    page.itemAttributeKey = (item.var_attr_key == null || typeof item.var_attr_key == "undefined") ? "" : item.var_attr_key;
                    page.skuAttributeKey = (item.var_stock_attr_key == null || typeof item.var_stock_attr_key == "undefined") ? "" : item.var_stock_attr_key;

                    if (item.image_name != undefined && item.image_name != null && item.image_name != '')
                        $("#output").attr("src", CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + $$("lblItemNo").value() + '/' + item.image_name);


                    if (CONTEXT.ENABLE_QR_CODE) {
                        redrawQrCode(item.item_name);
                    }

                    var filter = " item_no=" + item.item_no + " and store_no = " + localStorage.getItem("user_fulfillment_store_no");
                    filter = filter + " and state_no=100";
                    page.itemPriceAPI.searchValue("", "", filter, "", function (data1) {
                        var price = "",mrp="";
                        $(data1).each(function (i, item) {
                            if (i == 0) {
                                price = item.price;
                            }
                            else {
                                if (price == "") {
                                    price = item.price;
                                }
                                else {
                                    price = price + " | " + item.price;
                                }
                            }
                        });
                        $$("txtCurrentSellingPrice").value(price);
                        $(data1).each(function (i, item) {
                            if (i == 0) {
                                mrp = item.mrp;
                            }
                            else {
                                if (mrp == "") {
                                    mrp = item.mrp;
                                }
                                else {
                                    mrp = mrp + " | " + item.mrp;
                                }
                            }
                        });
                        $$("txtCurrentSellingMrp").value(mrp);
                    });

                    if (page.skuAttributeKey.split(",").includes("5")) {
                        $$("pnlItemMRP").show();
                    }
                    else {
                        $$("pnlItemMRP").hide();
                    }
                });
            });

            if (CONTEXT.ENABLE_ITEM_CLASS) {
                $$("pnlItemClass").show();
            }
            else {
                $$("pnlItemClass").hide();
            }
            if (CONTEXT.ENABLE_DRAFT_BILL) {
                $$("pnlDraftBill").show();
            }
            else {
                $$("pnlDraftBill").hide();
            }
            if (CONTEXT.ENABLE_MULTIPLE_IMAGE) {
                $$("pnlImageUpload").show();
            } else {
                $$("pnlImageUpload").hide();
            }
        }
        function getAttributeNo(id) {
            var value = "";
            $(global_attr_list).each(function (i, item) {
                if (item.attr_no_key == id)
                    value = item.attr_no;
            })
            return (value);
        }
        function getAttributeName(id) {
            var value = "";
            $(global_attr_list).each(function (i, item) {
                if (item.attr_no_key == id)
                    value = item.attr_name;
            })
            return (value);
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