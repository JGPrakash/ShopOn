var detail_page = null;
$.fn.itemList = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        //Import services required.
        page.controlName = "itemList";
        page.itemService = new ItemService();
        page.stockService = new StockService();
        page.inventoryService = new InventoryService();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.printCount= null;
        page.stockAPI = new StockAPI();
        page.itemAPI = new ItemAPI();
        page.uploadAPI = new UploadAPI();
        page.vendorAPI = new VendorAPI();
        page.itemTrayAPI = new ItemTrayAPI();
        page.maximumIdAPI = new MaximumIdAPI();
        page.taxclassAPI = new TaxClassAPI();
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
            $$("btnPrintBarcode").hide();
            $("#iremove").hide();
            $('#iremove1').hide();
            $$("btnPrintQRcode").hide();
            

            //CONTEXT Not Loading Properly
            if (CONTEXT.ENABLE_EXP_ALERT) {
                $$("btnExpiryAlert").show();
                $("#iexpiry").show();
            } else {
                $$("btnExpiryAlert").hide();
                $("#iexpiry").hide();
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
           
            page.productTypeAPI.searchValues("", "", "", "", function (data) {
                $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "Select");
                $$("ddlProductType").selectionChange(function () {
                    if ($$("ddlProductType").selectedValue() == "-1") {
                        $$("grdItemResult").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.itemAPI.searchValues("", "", "", "", function (data) {
                                var totalRecord = page.item_count;
                                    page.itemAPI.searchValues(start, end, "", "item_no", function (data) {
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
        }
        
        page.view.filterInput = function () {
            if (page.searchItemNo == null) {
                var search = page.controls.txtItemSearch.value();
                if (page.controls.txtItemSearch.value().startsWith("00")) {
                    search = page.controls.txtItemSearch.value().substring(0, page.controls.txtItemSearch.value().length - 1);
                    return " ( item_no = '" + search + "')";
                }
                else {
                    return " (concat(item_no,item_name,ifnull(barcode,true)) like '" + search + "%' or item_name like '" + search + "%')";
                }
            }
            else
                return " item_no=" + page.searchItemNo + " ";
        }
        page.view.filterResult=function (data) {
            if (data == true) {
                page.controls.grdItemResult.height("800px");
                page.controls.grdItemResult.setTemplate({
                    selection: "Single", paging: true,pageSize:100,
                    columns: [
                        //{ 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_code" },
                        { 'name': "Item No", 'rlabel': 'No', 'width': "80px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'rlabel': 'Name', 'width': "calc(100% - 150px)", 'dataField': "item_name" }
                    ]
                });
                page.controls.grdItemResult.selectionChanged = page.events.grdItemResult_select;
                $$("grdItemResult").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        filterExpression = page.view.filterInput();
                        //page.itemAPI.searchValues("", "", "", "", function (data) {
                        var totalRecord = page.item_count;
                        page.itemAPI.searchValues(start, end, filterExpression, "item_no", function (data) {
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
        }
        page.view.filterAdvanceResult = function (data) {
            if (data == true) {
                page.controls.grdItemResult.height("800px");
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
                        filterExpression = "(it.item_no in (select item_no from po_bill_item_t where bill_no like '" + page.controls.txtItemSearch.value() + "'))";
                        var totalRecord = page.item_count;
                        page.itemAPI.searchValues(start, end, filterExpression, "item_no", function (data) {
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
            $("#iremove").hide();
            $(".detail-tab-action").hide();
            $$("btnSaveItem").hide();
            $$("btnPrintBarcode").hide();
            $$("btnPrintQRcode").hide();
            
            $$("msgPanel").flash("Searching...");

            page.searchItemNo = null;
            page.view.filterResult(true);
            $$("msgPanel").hide();
            $$("txtItemSearch").selectedObject.focus();
        },
        e.btnAdvanceSearch_click = function () {
            $$("btnRemove").hide();
            $("#iremove").hide();
            $(".detail-tab-action").hide();
            $$("btnSaveItem").hide();
            $$("btnPrintBarcode").hide();
            $$("btnPrintQRcode").hide();

            $$("msgPanel").flash("Searching...");

            page.searchItemNo = null;
            page.view.filterResult(true);
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
                         var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();
                         if (!$$("chkShowSellingPrice").prop("checked"))
                             item_price = "";
                         //var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? item.item_name.substring(0, 10) : item.barcode.substring(0, 10);
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
                         var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();
                         if (!$$("chkShowSellingPrice").prop("checked"))
                             item_price = "";
                         var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation($$("ddlItemVariation").selectedData().var_no, 5) : item.barcode.substring(0, 4);
                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter4)
                            printBox.Lines.push({ StartX: 320, StartY: 5, Text: (CONTEXT.COMPANY_NAME).substring(0, 13), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 15, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 115, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 215, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter4)
                             printBox.Lines.push({ StartX: 315, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 15, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 115, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 215, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });
                         if (pagePrinter4)
                             printBox.Lines.push({ StartX: 315, StartY: 20, BarcodeText: printBarcodeNo, FontFamily: "Courier New", FontSize: 20, FontStyle: 1, TextHeight: 15, TextWidth: 100 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 36, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 36, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 36, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                         if (pagePrinter4)
                            printBox.Lines.push({ StartX: 320, StartY: 36, Text: (item.item_name).substring(0, 10), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                         if (pagePrinter1)
                             printBox.Lines.push({ StartX: 20, StartY: 45, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter2)
                             printBox.Lines.push({ StartX: 120, StartY: 45, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter3)
                             printBox.Lines.push({ StartX: 220, StartY: 45, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                         if (pagePrinter4)
                            printBox.Lines.push({ StartX: 320, StartY: 45, Text: item_price, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

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
                         var item_price = "Rs: " + $$("ddlItemVariation").selectedValue();
                         if (!$$("chkShowSellingPrice").prop("checked"))
                             item_price = "";
                         var printBarcodeNo = (item.barcode == "" || item.barcode == null || typeof item.barcode == "undefined") ? getBitByVariation($$("ddlItemVariation").selectedData().var_no,8) : item.barcode.substring(0, 7);
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
            page.controls.itemPrintQRcode.width(300);
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
                if (confirm("If the item deleted Variation, Price and Stock Will Be Affected")) {
                    if (confirm("Are You Sure Want To Delete This Item")) {
                        page.controls.currentUC.removeDetail();
                        page.searchItemNo = null;
                        page.view.filterResult(true);
                    }
                }
        }

        e.btnDetails_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "solid 3px gray");        
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnDetails").selectedObject.blur();
            $$("btnSaveItem").show();
            $$("btnRemove").show();
            //$$("msgPanel").show("Details of the item...");
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemDetail")
            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
            //$$("msgPanel").hide();
            if (CONTEXT.ENABLE_EXP_ALERT) {
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
            $$("btnInventory").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            //$$("msgPanel").show("Inventory details of the item...");
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemInventory")

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
            //$$("msgPanel").hide();
        }

        e.btnPrice_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemPrice")

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
        }
        e.btnLanguage_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnPackage").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemLanguage");

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no);
        }
        e.btnPackage_click = function () {
            $$("btnDetails").selectedObject.css("border-bottom", "none");
            $$("btnInventory").selectedObject.css("border-bottom", "none");
            $$("btnPrice").selectedObject.css("border-bottom", "none");
            $$("btnLanguage").selectedObject.css("border-bottom", "none");
            $$("btnPackage").selectedObject.css("border-bottom", "solid 3px gray");
            $$("btnPackage").selectedObject.blur();
            $$("btnSaveItem").hide();
            $$("btnRemove").hide();
            $.pageController.unLoadUserControl(page, "currentUC");
            $.pageController.loadUserControl(page, page.controls.pnlContainerPage.children("div"), "currentUC", "itemPackage");

            page.controls.currentUC.load(page.controls.grdItemResult.selectedData()[0].item_no, page.controls.grdItemResult.selectedData()[0].package_item, page.controls.grdItemResult.selectedData()[0].package_count);
        }

        e.grdItemResult_select = function (item) {
            $("#iremove").show();
            $$("btnSaveItem").show();
            $$("btnRemove").show();
            if (CONTEXT.SHOW_BARCODE == true) {
                $$("btnPrintBarcode").show();
                $('#iremove').show();
            } else {
                $('#iremove').hide();
                $$("btnPrintBarcode").hide();
            }
            if (CONTEXT.ENABLE_QR_CODE == true) {
                $$("btnPrintQRcode").show();
                $('#iremove1').show();
            } else {
                $('#iremove1').hide();
                $$("btnPrintQRcode").hide();
            }
            $(".detail-tab-action").show();
            $$("btnRemove").show();
            page.events.btnDetails_click();
            
            page.stockAPI.searchCurrentPricesMain(page.controls.grdItemResult.selectedData()[0].item_no, getCookie("user_store_id"), function (data) {
                page.controls.ddlItemVariation.dataBind(data, "price", "price");
                page.controls.ddlItemVariationCost.dataBind(data, "price", "cost");
                page.controls.ddlQRItemVariation.dataBind(data, "price", "price");
                $$("lblVariationMrp").value($$("ddlItemVariation").selectedValue())
            });
            $$("ddlItemVariation").selectionChange(function () {
                $$("lblVariationMrp").value($$("ddlItemVariation").selectedValue());
            });
            $$("ddlQRItemVariation").selectionChange(function () {
                $$("lblQRVariationMrp").value($$("ddlItemVariation").selectedValue());
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
                    alter_unit: $$("txtAlterUnit").value(),
                    alter_unit_fact: $$("txtAlterUnitFact").value(),
                }, function (data) {
                    var itemNo = data[0].key_value;
                    if ($$("chkStock").prop("checked")) {
                        var inventItems = {
                            store_no: localStorage.getItem("user_store_no"),
                            item_no: data[0].key_value,
                            variation_name: data[0].key_value + "-" + localStorage.getItem("user_store_no") + "-0-0-0-0-0",
                            cost: "0",
                            vendor_no: "",
                            mrp: "0",
                            batch_no: "",
                            expiry_date: "",
                            man_date: "",
                            active: "1",
                            user_no: getCookie("user_id"),
                        }
                        page.stockAPI.insertVariation(inventItems, function (data1) {
                            var price = data1[0].key_value;
                            var priceItem = {
                                var_no: data1[0].key_value,
                                valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                price: $$("txtItemPrice").value(),
                                user_no: getCookie("user_id"),
                                alter_price_1: $$("txtItemAlterPrice1").value(),
                                alter_price_2: $$("txtItemAlterPrice2").value()
                            }
                            page.stockAPI.insertVariationPrice(priceItem, function (data) { });

                        });
                    }
                    if (CONTEXT.ENABLE_CREATE_DEFAULT_PRICE) {
                        if (!$$("chkStock").prop("checked")){
                            var inventItems = {
                                store_no: localStorage.getItem("user_store_no"),
                                item_no: data[0].key_value,
                                variation_name: data[0].key_value + "-" + localStorage.getItem("user_store_no") + "-0-0-0-0-0",
                                cost: "0",
                                vendor_no: "",
                                mrp: "0",
                                batch_no: "",
                                expiry_date: "",
                                man_date: "",
                                active: "1",
                                user_no: getCookie("user_id"),
                            }
                            page.stockAPI.insertVariation(inventItems, function (data1) {
                                var price = data1[0].key_value;
                                var priceItem = {
                                    var_no: data1[0].key_value,
                                    valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    price: "1500",
                                    user_no: getCookie("user_id"),
                                    alter_price_1: $$("txtItemAlterPrice1").value(),
                                    alter_price_2: $$("txtItemAlterPrice2").value()
                                }
                                page.stockAPI.insertVariationPrice(priceItem, function (data) { });

                            });
                        }
                    }
                    page.controls.itemAddDialog.close();
                    page.searchItemNo=itemNo;
                    page.itemAPI.getCountValue(function (data) {
                        page.item_count = parseInt(data[0].tot_record);
                        page.view.filterResult(true);
                    });
                    
                    $$("msgPanel").show("Item: " + itemNo + " added successfully...!");
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
            page.controls.itemAddDialog.width(450);
            page.controls.itemAddDialog.height(addnewpopup);

            page.controls.txtAddItemCode.value("");
            page.controls.txtAddItemName.value("");
            if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                $$("chkNewInclusive").prop("checked", true);
            }
            else {
                $$("chkNewInclusive").prop("checked", false);
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
                }
                else {
                    $$("itemPrice").hide();
                    $$("txtItemPrice").value("");
                    $$("txtItemAlterPrice1").value("");
                    $$("itemAlterPrice1").hide();
                    $$("txtItemAlterPrice2").value("");
                    $$("itemAlterPrice2").hide();
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
            if (CONTEXT.ENABLE_ALTER_UNIT) {
                $$("pnlAlternativeUnit").show();
                $$("pnlAlternativeUnitFactor").show();
            } else {
                $$("pnlAlternativeUnit").hide();
                $$("pnlAlternativeUnitFactor").hide();
            }
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
            page.controls.pnlUpdateExcelVariationPopup.height(500);
            $$("ddlFormat").selectedValue("False");
            $$("txtStartRow").value("");
            $$("txtEndRow").value("");
            $("#fileUploadVariation").val("");
            $$("upload_path").html("2. Your File Must Present " + CONTEXT.REPORT_PATH + " drive");

        }
        e.btnUploadFileVariation_click = function () {
            var _validFileExtensions = [".xls"];
            var files = $("#fileUploadVariation").get(0).files;
            var file_name = $("#fileUploadVariation").val();
            var check_file_name = $("#fileUploadVariation").val().split(".");
            if (check_file_name[1] != "xls") {
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
                            store_no: localStorage.getItem("user_store_no")
                        }
                        if (data.start_row == null || data.start_row == "" || parseInt(data.start_row) < 0 || typeof data.start_row == "undefined") {
                            $$("txtStartRow").focus();
                            throw "Start Row Should Be Proper";
                        }
                        if (data.end_row == null || data.end_row == "" || parseInt(data.end_row) < 0 || typeof data.end_row == "undefined") {
                            $$("txtEndRow").focus();
                            throw "End Row Should Be Proper";
                        }
                        page.uploadAPI.postVariationValue(data, function (data) {
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
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.manufactureAPI = new ManufactureAPI();
        page.taxclassAPI = new TaxClassAPI();
        page.eggtrayAPI = new EggTrayAPI();
        page.itemAPI = new ItemAPI();
        page.itemTrayAPI = new ItemTrayAPI();
        page.events = {
            btnGenBarCode_click:function(){
                $$("txtBarcode").value(getFullCode($$("lblItemNo").value()));
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
                    var active;
                    if ($$("chkInclusive").prop("checked"))
                        active = 1;
                    else
                        active = 0;
                    var discount_activate = ($$("chkDiscountInclusive").prop("checked")) ? 1 : 0;
                    //$(".detail-info").progressBar("show");
                    page.itemAPI.putValue($$("lblItemNo").value(),{
                    //page.itemService.updateItem({
                        item_no: $$("lblItemNo").value(),
                        item_name: $$("txtItemName").value(),
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
                        alter_unit: $$("txtAlterUnit").value(),
                        alter_unit_fact: $$("txtAlterUnitFact").value(),
                        expiry_days: ($$("txtExpiryDays").value() == "") ? "" : parseInt($$("txtExpiryDays").value()),
                        item_description: $$("txtItemDescription").val(),
                        rack_no: $$("txtRackNo").value(),
                        mpt_no: ($$("ddlMainProductType").selectedValue() == null) ? "-1" : $$("ddlMainProductType").selectedValue()
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
                    $$("lblInStockAmount").value('');
                    $$("txtReOrderLevel").value('');
                    $$("txtReOrderQty").value('');
                    $$("ddlVendor").selectedValue('');

                    $$("txtKeyWord").val('');

                    $$("txtPacking").value('');
                    $$("txtAlterUnit").value('');
                    $$("txtAlterUnitFact").value('');
                    $$("txtExpiryAlert").value('');
                    $$("txtItemDescription").val('');
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

//$(".detail-info").progressBar("show")
                $$("msgPanel").show("Inserting attributes...");

                //page.itemService.insertAttributeValue(data, function () {
                //    page.itemService.getItemAttributes($$("lblItemNo").value(), function (data) {
                //        page.controls.grdItemAttributes.dataBind(data);
                //    });
                //   //$(".detail-info").progressBar("hide")
                //$$("msgPanel").show("Attributes inserted...");
                //});
            },
            //btnRemAttr_click: function () {
            //    var attr = page.controls.grdItemAttributes.selectedData()[0];
            //    //$(".detail-info").progressBar("show")
            //    $$("msgPanel").show("Deleting attributes...");
            //    page.itemService.deleteAttributeValue({
            //        item_no: attr.item_no,
            //        attr_no: attr.attr_no,
            //        attr_val_name: attr.attr_val_name

            //    }, function () {
            //        page.itemService.getItemAttributes($$("lblItemNo").value(), function (data) {
            //            page.controls.grdItemAttributes.dataBind(data);
            //        });
            //        //$(".detail-info").progressBar("hide")
            //    $$("msgPanel").show("Attributes removed...");
            //    });
            //},
            page_init: function () { },
            //ddlAttrName_selectionChange: function (attData) {
            //    if (attData.attr_type == "Number") {
            //        page.controls.ddlAttrValue.hide();
            //        page.controls.txtAttrValue.show();
            //    } else {
            //        page.controls.ddlAttrValue.show();
            //        page.controls.txtAttrValue.hide();
            //        page.itemService.getAttributeValues(attData.attr_type, function (data) {
            //            page.controls.ddlAttrValue.dataBind(data, "val_no", "val_name", "None");
            //        });
            //    }

            //},
            page_load: function () {
                page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlMainProductType").dataBind(data, "mpt_no", "mpt_name", "None");
                });
                
                page.productTypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlProductType").dataBind(data, "ptype_no", "ptype_name", "None");
                });
                page.manufactureAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlManufacturer.dataBind(data, "man_no", "man_name", "None");
                });
                
                page.taxclassAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                });

                page.eggtrayAPI.searchValues("", "", "", "", function (data) {
                    page.controls.ddlTray.dataBind(data, "tray_id", "tray_name", "None")
                });


                if (CONTEXT.ENABLE_IMAGE == "true") {
                    $$("pnlImg").show();
                }
                else {
                    $$("pnlImg").hide();
                }

                if (CONTEXT.ENABLE_MODULE_TRAY) {
                    $$("pnlTray").show();
                } else {
                    $$("pnlTray").hide();
                }

                if (CONTEXT.ENABLE_MRP) {
                    $$("pnlMrp").show();
                } else {
                    $$("pnlMrp").hide();
                }
                if (CONTEXT.SHOW_BARCODE) {
                    $$("pnlBarCode").show();
                } else {
                    $$("pnlBarCode").hide();
                }

                if (CONTEXT.ENABLE_PRODUCT_TYPE) {
                    $$("pnlMainProductType").show();
                    $$("pnlProductType").show();
                    $$("pnlItemCode").show();
                    $$("pnlPacking").show();
                    $$("pnlKeyword").hide();
                } else {
                    $$("pnlMainProductType").hide();
                    $$("pnlProductType").hide();
                    $$("pnlItemCode").hide();
                    $$("pnlPacking").hide();
                    $$("pnlKeyword").hide();
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
            }
        };

        page.validation = {};

        page.interface.saveDetail = function () {
            page.events.btnSaveItem_click();
        }
        page.interface.removeDetail = function () {
            page.events.btnRemove_click();
        }
        page.interface.load = function (item_no) {
            $$("txtPrice").disable(true);
            $$("txtMrpRate").disable(true);
            
            page.vendorAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlVendor.dataBind(data, "vendor_no", "vendor_name", "None");
                $("textarea").each(function () {
                    this.value = this.value.replace(/-/g, ",");
                });
                page.itemAPI.getValue(item_no, function (data) {
                    page.stockAPI.searchCurrentPricesMain(item_no, getCookie("user_store_id"), function (data1) {
                        var price = "";
                        var mrp = "";
                        $(data1).each(function (i, item) {
                            if (item.price != null)
                                price = price + " " + item.price ;
                            if (item.alter_price_1 != null && item.alter_price_1 != "" && typeof item.alter_price_1 != "undefined" && parseInt(item.alter_price_1) != 0)
                                price = price + " - " + item.alter_price_1;
                            if (item.alter_price_2 != null && item.alter_price_2 != "" && typeof item.alter_price_2 != "undefined" && parseInt(item.alter_price_2) != 0)
                                price = price + " - " + item.alter_price_2;
                            price = price + " | ";
                            if (item.mrp != null)
                                mrp = mrp + " " + item.mrp + " | ";
                        });
                        $$("txtPrice").value(price);
                        $$("txtMrpRate").value(mrp);
                    });
                    var item = data[0];

                    $$("lblItemNo").value(item.item_no);
                    $$("txtItemName").value(item.item_name);
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
                    $$("lblInStockAmount").value(item.qty_stock_amount);
                    $$("txtReOrderLevel").value(item.reorder_level);
                    $$("txtReOrderQty").value(item.reorder_qty);
                    $$("ddlVendor").selectedValue(item.def_vendor_no);

                    $$("txtKeyWord").val(item.key_word);
                    $$("txtPacking").value(item.packing);
                    $$("txtAlterUnit").value(item.alter_unit);
                    $$("txtAlterUnitFact").value(item.alter_unit_fact);
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

                    if (item.barcode == null || (item.barcode).length == 0) {
                        $$("btnGenBarCode").show();
                    } else {
                        $$("btnGenBarCode").hide();
                    }
                    $$("txtExpiryAlert").value(item.expiry_alert_days);
                    $$("txtItemDescription").val(item.item_description);

                    if (item.image_name != undefined && item.image_name != null && item.image_name != '')
                        $("#output").attr("src", CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + $$("lblItemNo").value() + '/' + item.image_name);


                    if (CONTEXT.ENABLE_QR_CODE) {
                        redrawQrCode(item.item_name);
                    }
                });
            });
        }
    });
}